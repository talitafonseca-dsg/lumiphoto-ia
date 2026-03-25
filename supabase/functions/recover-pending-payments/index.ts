import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const DEFAULT_PASSWORD = "lumi123456";
const SITE_URL = "https://www.lumiphotoia.online";

const CREDITS_MAP: Record<string, number> = {
    starter: 10, essencial: 30, pro: 80, premium: 100,
};

const PLAN_NAMES: Record<string, string> = {
    starter: "Starter (10 Fotos)", essencial: "Essencial (30 Fotos)",
    pro: "Pro (80 Fotos)", premium: "Premium (100 Fotos)",
};

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

function sourcePageToSegment(sourcePage: string): string {
    if (!sourcePage || sourcePage === '/' || sourcePage === '' || sourcePage === '/delivery') return 'delivery';
    const path = sourcePage.toLowerCase().replace(/^\//, '');
    if (path === 'ensaio-beleza' || path.startsWith('beauty')) return 'beleza';
    if (path === 'ensaio-advogadas' || path.startsWith('advogadas')) return 'advogadas';
    if (path === 'ensaio-aniversario') return 'aniversario';
    if (path === 'ensaio-estetica') return 'estetica';
    if (path === 'ensaios') return 'ensaios';
    if (path === 'varejo') return 'varejo';
    return 'delivery';
}

Deno.serve(async (req: Request) => {
    // CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" },
        });
    }

    try {
        // Fetch all pending payments from the last 48 hours
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        const { data: pendingPayments, error: fetchErr } = await supabaseAdmin
            .from("payments")
            .select("*")
            .eq("status", "pending")
            .gte("created_at", cutoff)
            .order("created_at", { ascending: false });

        if (fetchErr) {
            console.error("Error fetching pending payments:", fetchErr);
            return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500 });
        }

        if (!pendingPayments || pendingPayments.length === 0) {
            return new Response(JSON.stringify({ message: "No pending payments found", recovered: 0 }), {
                headers: { "Content-Type": "application/json" },
            });
        }

        console.log(`🔍 Found ${pendingPayments.length} pending payments to check`);

        const results: any[] = [];

        for (const payment of pendingPayments) {
            const paymentId = payment.mercadopago_payment_id;
            console.log(`\n--- Checking payment ${paymentId} (${payment.payer_email}) ---`);

            try {
                // Fetch current status from Mercado Pago API
                const mpRes = await fetch(
                    `https://api.mercadopago.com/v1/payments/${paymentId}`,
                    { headers: { Authorization: `Bearer ${MP_ACCESS_TOKEN}` } }
                );

                if (!mpRes.ok) {
                    console.error(`Failed to fetch payment ${paymentId} from MP:`, await mpRes.text());
                    results.push({ paymentId, status: "mp_error", action: "skipped" });
                    continue;
                }

                const mpPayment = await mpRes.json();
                const currentStatus = mpPayment.status;
                console.log(`Payment ${paymentId}: MP status = ${currentStatus}`);

                if (currentStatus === "approved") {
                    // APPROVED! Process this payment now
                    console.log(`✅ Payment ${paymentId} is APPROVED! Processing...`);

                    // Extract data from external_reference
                    let planType = "starter";
                    let refEmail = "";
                    let whatsapp = "";
                    let sourcePage = "";
                    try {
                        const refData = JSON.parse(mpPayment.external_reference);
                        planType = refData.plan || "starter";
                        refEmail = refData.email || "";
                        whatsapp = refData.whatsapp || "";
                        sourcePage = refData.source_page || "";
                    } catch { /* ignore parse errors */ }

                    const payerEmail = refEmail || mpPayment.payer?.email;
                    if (!payerEmail || !payerEmail.includes("@")) {
                        console.error(`No valid email for payment ${paymentId}`);
                        results.push({ paymentId, status: "approved", action: "skipped_no_email" });
                        continue;
                    }

                    const creditsToAdd = CREDITS_MAP[planType] || 10;

                    // Update payment status FIRST
                    await supabaseAdmin.from("payments").update({
                        status: "approved",
                        metadata: mpPayment,
                    }).eq("mercadopago_payment_id", paymentId);

                    // Atomic claim: only process if not already done
                    const { data: claimedRows } = await supabaseAdmin
                        .from("payments")
                        .update({ user_created: true })
                        .eq("mercadopago_payment_id", paymentId)
                        .or("user_created.eq.false,user_created.is.null")
                        .select("mercadopago_payment_id");

                    if (!claimedRows || claimedRows.length === 0) {
                        console.log(`Payment ${paymentId} already processed, skipping`);
                        results.push({ paymentId, status: "approved", action: "already_processed" });
                        continue;
                    }

                    // Create user
                    const userSegment = sourcePageToSegment(sourcePage);
                    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
                        email: payerEmail,
                        password: DEFAULT_PASSWORD,
                        email_confirm: true,
                        app_metadata: {
                            provider: "email",
                            providers: ["email"],
                        },
                        user_metadata: {
                            plan_type: planType,
                            payment_id: paymentId,
                            purchase_date: new Date().toISOString(),
                            credits: creditsToAdd,
                            segment: userSegment,
                            ...(whatsapp ? { whatsapp } : {}),
                        },
                    });

                    let isNewUser = true;
                    if (userError) {
                        if (userError.message.includes("already been registered")) {
                            console.log("User exists, adding credits");
                            isNewUser = false;
                            const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
                            const existingUser = existingUsers?.users?.find(u => u.email === payerEmail);
                            if (existingUser) {
                                const currentCredits = (existingUser.user_metadata?.credits as number) || 0;
                                await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                                    user_metadata: {
                                        ...existingUser.user_metadata,
                                        credits: currentCredits + creditsToAdd,
                                        last_payment_date: new Date().toISOString(),
                                    },
                                });
                            }
                        } else {
                            console.error(`Error creating user for ${paymentId}:`, userError);
                            results.push({ paymentId, status: "approved", action: "user_creation_error" });
                            continue;
                        }
                    }

                    // Update payment with user_id
                    const userId = userData?.user?.id || null;
                    await supabaseAdmin.from("payments").update({
                        user_id: userId,
                    }).eq("mercadopago_payment_id", paymentId);

                    // Send welcome email
                    await sendWelcomeEmail(payerEmail, planType, creditsToAdd, isNewUser);

                    console.log(`🎉 Recovered payment ${paymentId}: ${payerEmail} -> ${creditsToAdd} credits`);
                    results.push({ paymentId, email: payerEmail, status: "approved", action: "recovered", credits: creditsToAdd });

                } else if (currentStatus === "cancelled" || currentStatus === "rejected") {
                    // Update DB to reflect final status
                    await supabaseAdmin.from("payments").update({
                        status: currentStatus,
                    }).eq("mercadopago_payment_id", paymentId);

                    console.log(`❌ Payment ${paymentId} is ${currentStatus}`);
                    results.push({ paymentId, status: currentStatus, action: "status_updated" });

                } else {
                    // Still pending
                    console.log(`⏳ Payment ${paymentId} still ${currentStatus}`);
                    results.push({ paymentId, status: currentStatus, action: "still_pending" });
                }
            } catch (err) {
                console.error(`Error processing payment ${paymentId}:`, err);
                results.push({ paymentId, status: "error", action: String(err) });
            }
        }

        return new Response(JSON.stringify({ recovered: results.filter(r => r.action === "recovered").length, total_checked: results.length, results }), {
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Recovery function error:", error);
        return new Response(JSON.stringify({ error: String(error) }), { status: 500 });
    }
});

async function sendWelcomeEmail(email: string, plan: string, credits: number, isNewUser: boolean) {
    if (!RESEND_API_KEY) return;

    const planName = PLAN_NAMES[plan] || plan;
    const subject = isNewUser
        ? `🎉 Bem-vindo ao LumiphotoIA! Seus ${credits} créditos estão prontos`
        : `✅ +${credits} créditos adicionados ao seu LumiphotoIA`;

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
        <div style="text-align:center;margin-bottom:32px;">
            <h1 style="color:#f59e0b;font-size:28px;margin:0;letter-spacing:1px;">LUMIPHOTO<span style="color:#ffffff;">IA</span></h1>
            <p style="color:#666;font-size:14px;margin-top:8px;">Estúdio de Fotografia com IA</p>
        </div>
        <div style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:16px;padding:32px;border:1px solid rgba(245,158,11,0.2);">
            <h2 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;">${isNewUser ? '🎉 Bem-vindo ao LumiphotoIA!' : '✅ Créditos Adicionados!'}</h2>
            <p style="color:#a0a0a0;font-size:15px;margin:0 0 24px 0;">${isNewUser ? 'Seu pagamento foi aprovado e sua conta já está pronta para usar!' : 'Seu pagamento foi aprovado e ' + credits + ' créditos foram adicionados à sua conta!'}</p>
            <div style="background:rgba(245,158,11,0.1);border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid rgba(245,158,11,0.15);">
                <p style="color:#f59e0b;font-size:13px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;">Seu Pacote</p>
                <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0;">${planName}</p>
                <p style="color:#a0a0a0;font-size:14px;margin:4px 0 0 0;">${credits} fotos profissionais com IA</p>
            </div>
            ${isNewUser ? '<div style="background:rgba(255,255,255,0.05);border-radius:12px;padding:20px;margin-bottom:24px;border:1px solid rgba(255,255,255,0.1);"><p style="color:#f59e0b;font-size:13px;margin:0 0 12px 0;text-transform:uppercase;letter-spacing:1px;">🔐 Seus Dados de Acesso</p><table style="width:100%;border-collapse:collapse;"><tr><td style="color:#a0a0a0;font-size:14px;padding:6px 0;">Email:</td><td style="color:#ffffff;font-size:14px;font-weight:bold;padding:6px 0;">' + email + '</td></tr><tr><td style="color:#a0a0a0;font-size:14px;padding:6px 0;">Senha:</td><td style="color:#ffffff;font-size:14px;font-weight:bold;padding:6px 0;">lumi123456</td></tr></table><p style="color:#ff6b6b;font-size:12px;margin:12px 0 0 0;">⚠️ Recomendamos alterar sua senha após o primeiro acesso.</p></div>' : ''}
            <div style="text-align:center;margin-top:24px;">
                <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:16px;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">Acessar o LumiphotoIA →</a>
            </div>
        </div>
        <div style="text-align:center;margin-top:32px;">
            <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.</p>
        </div>
    </div>
</body></html>`;

    try {
        await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({
                from: 'LumiphotoIA <team@lumiphotoia.online>',
                to: [email],
                subject,
                html,
            }),
        });
        console.log(`📧 Welcome email sent to ${email}`);
    } catch (error) {
        console.error('Failed to send welcome email:', error);
    }
}
