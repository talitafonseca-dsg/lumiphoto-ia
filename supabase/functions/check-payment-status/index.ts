import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const DEFAULT_PASSWORD = "lumi123456";
const SITE_URL = "https://lumiphotoia.vercel.app";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const CREDITS_MAP: Record<string, number> = {
    starter: 10,
    essencial: 30,
    pro: 80,
    premium: 100,
};

const PLAN_NAMES: Record<string, string> = {
    starter: "Starter (10 Fotos)",
    essencial: "Essencial (30 Fotos)",
    pro: "Pro (80 Fotos)",
    premium: "Premium (100 Fotos)",
};

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Buscar todos os pagamentos que precisam de processamento
        const { data: pendingPayments } = await supabaseAdmin
            .from("payments")
            .select("*")
            .in("status", ["pending", "approved"])
            .or("user_created.eq.false,user_created.is.null");

        if (!pendingPayments || pendingPayments.length === 0) {
            return new Response(
                JSON.stringify({ message: "Nenhum pagamento pendente", processed: 0 }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        console.log(`Found ${pendingPayments.length} pending payments to check`);
        let processed = 0;

        for (const payment of pendingPayments) {
            const paymentId = payment.mercadopago_payment_id;

            // Verificar status atual no Mercado Pago
            const mpResponse = await fetch(
                `https://api.mercadopago.com/v1/payments/${paymentId}`,
                { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } }
            );

            if (!mpResponse.ok) {
                console.error(`Failed to check payment ${paymentId}:`, await mpResponse.text());
                continue;
            }

            const mpPayment = await mpResponse.json();
            console.log(`Payment ${paymentId} status: ${mpPayment.status}`);

            // Atualizar status no banco
            if (mpPayment.status !== "pending") {
                await supabaseAdmin.from("payments").update({
                    status: mpPayment.status,
                    payer_email: mpPayment.payer?.email || payment.payer_email,
                }).eq("mercadopago_payment_id", paymentId);
            }

            // Se aprovado e usuário não criado, processar
            if (mpPayment.status === "approved" && !payment.user_created) {
                // PIX payments may not have payer.email, extract from external_reference
                let refEmail = "";
                let planType = "starter";
                try {
                    const refData = JSON.parse(mpPayment.external_reference);
                    planType = refData.plan || "starter";
                    refEmail = refData.email || "";
                } catch {
                    // use default
                }

                const payerEmail = mpPayment.payer?.email || refEmail;
                if (!payerEmail) {
                    console.error(`No email for payment ${paymentId}`);
                    results.push({ paymentId, error: "No payer email" });
                    continue;
                }

                const creditsToAdd = CREDITS_MAP[planType] || 0;

                console.log(`Processing approved payment: ${payerEmail}, plan: ${planType}, credits: ${creditsToAdd}`);

                // Criar ou atualizar usuário
                const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
                    email: payerEmail,
                    password: DEFAULT_PASSWORD,
                    email_confirm: true,
                    user_metadata: {
                        plan_type: planType,
                        payment_id: paymentId,
                        purchase_date: new Date().toISOString(),
                        credits: creditsToAdd,
                    },
                });

                if (userError) {
                    if (userError.message.includes("already been registered")) {
                        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
                        const existingUser = existingUsers?.users?.find(u => u.email === payerEmail);
                        if (existingUser) {
                            const currentCredits = (existingUser.user_metadata?.credits as number) || 0;
                            await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                                user_metadata: {
                                    ...existingUser.user_metadata,
                                    plan_type: planType,
                                    payment_id: paymentId,
                                    last_payment_date: new Date().toISOString(),
                                    credits: currentCredits + creditsToAdd,
                                },
                            });
                        }
                    } else {
                        console.error("Error creating user:", userError);
                        continue;
                    }
                }

                // Atualizar pagamento
                await supabaseAdmin.from("payments").update({
                    status: "approved",
                    payer_email: payerEmail,
                    user_id: userData?.user?.id || null,
                    user_created: true,
                }).eq("mercadopago_payment_id", paymentId);

                // Enviar email
                const isNewUser = !userError;
                await sendWelcomeEmail(payerEmail, planType, creditsToAdd, isNewUser);

                console.log(`✅ Processed payment ${paymentId} for ${payerEmail}`);
                processed++;
            }
        }

        return new Response(
            JSON.stringify({ message: `Processados ${processed} pagamentos`, processed }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Erro ao verificar pagamentos" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});

async function sendWelcomeEmail(email: string, plan: string, credits: number, isNewUser: boolean) {
    if (!RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured, skipping welcome email");
        return;
    }

    const planName = PLAN_NAMES[plan] || plan;
    const subject = isNewUser
        ? `🎉 Bem-vindo ao LumiphotoIA! Seus ${credits} créditos estão prontos`
        : `✅ +${credits} créditos adicionados ao seu LumiphotoIA`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#f59e0b;font-size:28px;margin:0;letter-spacing:1px;">LUMIPHOTO<span style="color:#ffffff;">IA</span></h1>
            <p style="color:#666;font-size:14px;margin-top:8px;">Estúdio de Fotografia com IA</p>
        </div>
        <div style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:16px;padding:32px;border:1px solid rgba(245,158,11,0.2);">
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;">${isNewUser ? '🎉 Bem-vindo ao LumiphotoIA!' : '✅ Créditos Adicionados!'}</h2>
            <p style="color:#a0a0a0;font-size:15px;margin:0 0 24px 0;">
                ${isNewUser ? 'Seu pagamento foi aprovado e sua conta já está pronta para usar!' : `Seu pagamento foi aprovado e ${credits} créditos foram adicionados à sua conta!`}
            </p>
            <div style="background:rgba(245,158,11,0.1);border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid rgba(245,158,11,0.15);">
                <p style="color:#f59e0b;font-size:13px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;">Seu Pacote</p>
                <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0;">${planName}</p>
                <p style="color:#a0a0a0;font-size:14px;margin:4px 0 0 0;">${credits} fotos profissionais com IA</p>
            </div>
            ${isNewUser ? `
            <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.1);">
                <p style="color:#f59e0b;font-size:13px;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:1px;">🔐 Seus Dados de Acesso</p>
                <table style="width:100%;border-collapse:collapse;">
                    <tr><td style="color:#a0a0a0;font-size:14px;padding:6px 0;">Email:</td><td style="color:#ffffff;font-size:14px;font-weight:bold;padding:6px 0;">${email}</td></tr>
                    <tr><td style="color:#a0a0a0;font-size:14px;padding:6px 0;">Senha:</td><td style="color:#ffffff;font-size:14px;font-weight:bold;padding:6px 0;">${DEFAULT_PASSWORD}</td></tr>
                </table>
                <p style="color:#ff6b6b;font-size:12px;margin:12px 0 0 0;">⚠️ Recomendamos alterar sua senha após o primeiro acesso.</p>
            </div>
            ` : ''}
            <div style="text-align:center;margin-top:24px;">
                <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:16px;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">Acessar o LumiphotoIA →</a>
            </div>
        </div>
        <div style="text-align:center;margin-top:32px;">
            <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.</p>
        </div>
    </div>
</body>
</html>`;

    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${RESEND_API_KEY}`,
            },
            body: JSON.stringify({
                from: 'LumiphotoIA <team@lumiphotoia.online>',
                to: [email],
                subject,
                html,
            }),
        });
        if (!res.ok) {
            console.error('Resend error:', await res.text());
        } else {
            console.log(`📧 Welcome email sent to ${email}`);
        }
    } catch (error) {
        console.error('Failed to send email:', error);
    }
}
