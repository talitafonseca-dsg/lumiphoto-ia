import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const DEFAULT_PASSWORD = "lumi123456";
const SITE_URL = "https://www.lumiphotoia.online";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});


const CREDITS_MAP: Record<string, number> = {
    starter: 10,
    essencial: 30,
    pro: 80,
    premium: 100,
};

Deno.serve(async (req: Request) => {
    // Mercado Pago envia notificações via POST
    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        // Parse URL params (IPN format: ?id=X&topic=payment)
        const url = new URL(req.url);
        const urlPaymentId = url.searchParams.get("data.id") || url.searchParams.get("id");
        const urlTopic = url.searchParams.get("type") || url.searchParams.get("topic");

        // Parse body (Webhook v2 format: { type: "payment", data: { id: "X" } })
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            // IPN format may not have JSON body
            console.log("No JSON body, using URL params");
        }

        console.log("Webhook received - URL params:", { urlPaymentId, urlTopic });
        console.log("Webhook received - Body:", JSON.stringify(body));

        // Determine if this is a payment notification (support all formats)
        const isPaymentNotification =
            body.type === "payment" ||
            body.action === "payment.created" ||
            body.action === "payment.updated" ||
            body.topic === "payment" ||
            urlTopic === "payment";

        if (!isPaymentNotification) {
            console.log("Ignoring non-payment notification:", urlTopic || body.type || body.action || body.topic);
            return new Response("OK", { status: 200 });
        }

        // Get payment ID from all possible sources
        const paymentId = body.data?.id || body.id || urlPaymentId;

        if (!paymentId) {
            console.error("No payment ID found in webhook");
            return new Response("OK", { status: 200 });
        }

        console.log("Processing payment ID:", paymentId);

        // Buscar detalhes do pagamento no Mercado Pago
        const paymentResponse = await fetch(
            `https://api.mercadopago.com/v1/payments/${paymentId}`,
            {
                headers: {
                    Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
                },
            }
        );

        if (!paymentResponse.ok) {
            console.error("Failed to fetch payment details:", await paymentResponse.text());
            return new Response("OK", { status: 200 });
        }

        const payment = await paymentResponse.json();
        console.log("Payment details:", JSON.stringify(payment));

        // Extract plan, email and referral_code from external_reference
        let planType = "starter";
        let refEmail = "";
        let referralCode = "";
        try {
            const refData = JSON.parse(payment.external_reference);
            planType = refData.plan || "starter";
            refEmail = refData.email || "";
            referralCode = refData.referral_code || "";
        } catch {
            console.log("Could not parse external_reference");
        }

        // Só processamos pagamentos aprovados
        if (payment.status !== "approved") {
            console.log("Payment not approved, status:", payment.status);

            await supabaseAdmin.from("payments").upsert({
                mercadopago_payment_id: paymentId.toString(),
                mercadopago_preference_id: payment.preference_id,
                payer_email: refEmail || payment.payer?.email || "unknown",
                plan_type: planType,
                amount: payment.transaction_amount,
                status: payment.status,
                metadata: payment,
            }, { onConflict: "mercadopago_payment_id" });

            return new Response("OK", { status: 200 });
        }

        // PRIORITY: use external_reference email (we set it), MP payer email as fallback
        const payerEmail = refEmail || payment.payer?.email;
        console.log("Using email:", payerEmail, "(source:", refEmail ? "external_reference" : "payer", ")");

        const creditsToAdd = CREDITS_MAP[planType] || 0;

        if (!payerEmail || !payerEmail.includes('@')) {
            console.error("No valid payer email found");
            return new Response("OK", { status: 200 });
        }

        // Verificar se já criamos usuário para este pagamento
        const { data: existingPayment } = await supabaseAdmin
            .from("payments")
            .select("user_created")
            .eq("mercadopago_payment_id", paymentId.toString())
            .single();

        if (existingPayment?.user_created) {
            console.log("User already created for this payment");
            return new Response("OK", { status: 200 });
        }

        // Criar usuário no Supabase Auth
        console.log("Creating user for:", payerEmail);
        console.log(`Adding ${creditsToAdd} credits for plan ${planType}`);

        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: payerEmail,
            password: DEFAULT_PASSWORD,
            email_confirm: true, // Auto-confirma o email
            user_metadata: {
                plan_type: planType,
                payment_id: paymentId,
                purchase_date: new Date().toISOString(),
                credits: creditsToAdd
            },
        });

        if (userError) {
            // Se usuário já existe, apenas atualiza os metadados
            if (userError.message.includes("already been registered")) {
                console.log("User already exists, updating metadata and adding credits");

                // Buscar usuário existente
                const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = existingUsers?.users?.find(u => u.email === payerEmail);

                if (existingUser) {
                    const currentCredits = (existingUser.user_metadata?.credits as number) || 0;
                    const newTotal = currentCredits + creditsToAdd;

                    await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        user_metadata: {
                            ...existingUser.user_metadata,
                            plan_type: planType,
                            payment_id: paymentId,
                            last_payment_date: new Date().toISOString(),
                            credits: newTotal
                        },
                    });
                }
            } else {
                console.error("Error creating user:", userError);
                return new Response("OK", { status: 200 });
            }
        }

        // Registrar pagamento no banco
        const userId = userData?.user?.id || null;

        await supabaseAdmin.from("payments").upsert({
            mercadopago_payment_id: paymentId.toString(),
            mercadopago_preference_id: payment.preference_id,
            payer_email: payerEmail,
            plan_type: planType,
            amount: payment.transaction_amount,
            status: "approved",
            user_id: userId,
            user_created: true,
            metadata: payment,
        }, { onConflict: "mercadopago_payment_id" });

        // Enviar email de boas-vindas
        const isNewUser = !userError;
        await sendWelcomeEmail(payerEmail, planType, creditsToAdd, isNewUser);

        console.log(`✅ User ${isNewUser ? 'created' : 'updated'} successfully: ${payerEmail}`);
        console.log(`📋 Plan: ${planType} | Credits: ${creditsToAdd}`);

        // ========== REFERRAL REWARD ==========
        if (referralCode) {
            await processReferralReward(referralCode, payerEmail);
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        // Sempre retorna 200 para o Mercado Pago não reenviar
        return new Response("OK", { status: 200 });
    }
});

function getPlanFromReference(ref: string): string {
    try {
        const data = JSON.parse(ref);
        return data.plan || "starter";
    } catch {
        return "starter";
    }
}

const PLAN_NAMES: Record<string, string> = {
    starter: "Starter (10 Fotos)",
    essencial: "Essencial (30 Fotos)",
    pro: "Pro (80 Fotos)",
    premium: "Premium (100 Fotos)",
};

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
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <!-- Header -->
        <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#f59e0b;font-size:28px;margin:0;letter-spacing:1px;">LUMIPHOTO<span style="color:#ffffff;">IA</span></h1>
            <p style="color:#666;font-size:14px;margin-top:8px;">Estúdio de Fotografia com IA</p>
        </div>

        <!-- Main Card -->
        <div style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:16px;padding:32px;border:1px solid rgba(245,158,11,0.2);">
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;">${isNewUser ? '🎉 Bem-vindo ao LumiphotoIA!' : '✅ Créditos Adicionados!'}</h2>
            <p style="color:#a0a0a0;font-size:15px;margin:0 0 24px 0;">
                ${isNewUser
            ? 'Seu pagamento foi aprovado e sua conta já está pronta para usar!'
            : `Seu pagamento foi aprovado e ${credits} créditos foram adicionados à sua conta!`
        }
            </p>

            <!-- Plan Info -->
            <div style="background:rgba(245,158,11,0.1);border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid rgba(245,158,11,0.15);">
                <p style="color:#f59e0b;font-size:13px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;">Seu Pacote</p>
                <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0;">${planName}</p>
                <p style="color:#a0a0a0;font-size:14px;margin:4px 0 0 0;">${credits} fotos profissionais com IA</p>
            </div>

            ${isNewUser ? `
            <!-- Login Credentials -->
            <div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.1);">
                <p style="color:#f59e0b;font-size:13px;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:1px;">🔐 Seus Dados de Acesso</p>
                <table style="width:100%;border-collapse:collapse;">
                    <tr>
                        <td style="color:#a0a0a0;font-size:14px;padding:6px 0;">Email:</td>
                        <td style="color:#ffffff;font-size:14px;font-weight:bold;padding:6px 0;">${email}</td>
                    </tr>
                    <tr>
                        <td style="color:#a0a0a0;font-size:14px;padding:6px 0;">Senha:</td>
                        <td style="color:#ffffff;font-size:14px;font-weight:bold;padding:6px 0;">${DEFAULT_PASSWORD}</td>
                    </tr>
                </table>
                <p style="color:#ff6b6b;font-size:12px;margin:12px 0 0 0;">⚠️ Recomendamos alterar sua senha após o primeiro acesso.</p>
            </div>
            ` : ''}

            <!-- CTA Button -->
            <div style="text-align:center;margin-top:24px;">
                <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:16px;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">Acessar o LumiphotoIA →</a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align:center;margin-top:32px;">
            <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.</p>
            <p style="color:#444;font-size:11px;">Dúvidas? Responda este email.</p>
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
                subject: subject,
                html: html,
            }),
        });

        if (!res.ok) {
            const errorData = await res.text();
            console.error('Resend email error:', errorData);
        } else {
            console.log(`📧 Welcome email sent to ${email}`);
        }
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}

const REFERRAL_REWARD_CREDITS = 3;

async function processReferralReward(referralCode: string, buyerEmail: string) {
    try {
        console.log(`🔗 Processing referral code: ${referralCode}`);

        // Find the referral
        const { data: referral, error: findError } = await supabaseAdmin
            .from("referrals")
            .select("*")
            .eq("referral_code", referralCode)
            .eq("is_used", false)
            .single();

        if (findError || !referral) {
            console.log("Referral not found or already used:", referralCode);
            return;
        }

        // Anti-fraud: block self-referral
        if (referral.referrer_email.toLowerCase() === buyerEmail.toLowerCase()) {
            console.warn("⚠️ Self-referral blocked:", buyerEmail);
            return;
        }

        // Find the referrer user in Supabase Auth
        const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
        const referrerUser = allUsers?.users?.find(
            (u) => u.email?.toLowerCase() === referral.referrer_email.toLowerCase()
        );

        if (referrerUser) {
            // Add 3 credits to referrer
            const currentCredits = (referrerUser.user_metadata?.credits as number) || 0;
            const newTotal = currentCredits + REFERRAL_REWARD_CREDITS;

            await supabaseAdmin.auth.admin.updateUserById(referrerUser.id, {
                user_metadata: {
                    ...referrerUser.user_metadata,
                    credits: newTotal,
                },
            });

            console.log(`🎁 Added ${REFERRAL_REWARD_CREDITS} credits to ${referral.referrer_email} (${currentCredits} → ${newTotal})`);
        } else {
            console.log(`Referrer ${referral.referrer_email} not found in auth, skipping credit reward`);
        }

        // Mark referral as used
        await supabaseAdmin
            .from("referrals")
            .update({
                is_used: true,
                used_by_email: buyerEmail,
                credits_rewarded: !!referrerUser,
                used_at: new Date().toISOString(),
            })
            .eq("id", referral.id);

        // Send reward email
        if (referrerUser) {
            await sendReferralRewardEmail(referral.referrer_email, buyerEmail);
        }

        console.log(`✅ Referral ${referralCode} processed successfully`);
    } catch (error) {
        console.error("Error processing referral:", error);
    }
}

async function sendReferralRewardEmail(referrerEmail: string, buyerEmail: string) {
    if (!RESEND_API_KEY) {
        console.warn("RESEND_API_KEY not configured, skipping referral email");
        return;
    }

    const maskedBuyer = buyerEmail.replace(/(.{2})(.*)(@.*)/, "$1***$3");

    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#f59e0b;font-size:28px;margin:0;letter-spacing:1px;">LUMIPHOTO<span style="color:#ffffff;">IA</span></h1>
            <p style="color:#666;font-size:14px;margin-top:8px;">Programa de Indicação</p>
        </div>

        <div style="background:linear-gradient(145deg,#1a2e1a,#162116);border-radius:16px;padding:32px;border:1px solid rgba(34,197,94,0.3);">
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;">🎉 Você ganhou 3 fotos grátis!</h2>
            <p style="color:#a0a0a0;font-size:15px;margin:0 0 24px 0;">
                Alguém comprou pelo seu link de indicação e você foi recompensado!
            </p>

            <div style="background:rgba(34,197,94,0.1);border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid rgba(34,197,94,0.2);">
                <p style="color:#22c55e;font-size:13px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;">Sua Recompensa</p>
                <p style="color:#ffffff;font-size:24px;font-weight:bold;margin:0;">+3 Fotos Profissionais</p>
                <p style="color:#a0a0a0;font-size:13px;margin:4px 0 0 0;">Comprador: ${maskedBuyer}</p>
            </div>

            <p style="color:#a0a0a0;font-size:13px;margin:0 0 24px 0;">
                Os créditos já foram adicionados à sua conta. Acesse o estúdio e crie suas fotos!
            </p>

            <div style="text-align:center;">
                <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;font-weight:bold;font-size:16px;padding:14px 40px;border-radius:12px;text-decoration:none;">Usar meus créditos →</a>
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
                to: [referrerEmail],
                subject: '🎉 Você ganhou 3 fotos grátis no LumiphotoIA!',
                html: html,
            }),
        });

        if (!res.ok) {
            console.error('Resend referral email error:', await res.text());
        } else {
            console.log(`📧 Referral reward email sent to ${referrerEmail}`);
        }
    } catch (error) {
        console.error('Failed to send referral email:', error);
    }
}

