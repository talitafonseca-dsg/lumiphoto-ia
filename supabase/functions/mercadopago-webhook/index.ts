import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const DEFAULT_PASSWORD = "lumi123456";
const SITE_URL = "https://www.lumiphotoia.online";

// TrackPro/Meta CAPI - Server-Side Tracking
const TRACKPRO_ENDPOINT = "https://obzvzudlfftyjwgemdhx.supabase.co/functions/v1/track-event";
const TRACKPRO_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ienZ6dWRsZmZ0eWp3Z2VtZGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzY0NjYsImV4cCI6MjA4NzgxMjQ2Nn0.iSgCV7hYpR4UKm0Twok4AmBFzhQqThpFSx6AQaNFKkI";
const TRACKPRO_USER_ID = "844b2e8d-36b7-438b-93d4-2bc9cee6118d";

const PLAN_PRICES: Record<string, number> = {
    starter: 37, essencial: 57, pro: 80, premium: 117,
};

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

// Maps landing page URL path to a segment key
function sourcePageToSegment(sourcePage: string): string {
    if (!sourcePage || sourcePage === '/' || sourcePage === '' || sourcePage === '/delivery') return 'delivery';
    const path = sourcePage.toLowerCase().replace(/^\//, '');
    if (path === 'ensaio-beleza' || path.startsWith('beauty')) return 'beleza';
    if (path === 'ensaio-advogadas' || path.startsWith('advogadas')) return 'advogadas';
    if (path === 'ensaio-aniversario') return 'aniversario';
    if (path === 'ensaio-estetica') return 'estetica';
    if (path === 'ensaios') return 'ensaios';
    if (path === 'varejo') return 'varejo';
    return 'delivery'; // default
}

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
        let affiliateCode = "";
        let whatsapp = "";
        let sourcePage = "";
        let utmSource = "";
        let utmMedium = "";
        let utmCampaign = "";
        let refData: any = {};
        try {
            refData = JSON.parse(payment.external_reference);
            planType = refData.plan || "starter";
            refEmail = refData.email || "";
            referralCode = refData.referral_code || "";
            affiliateCode = refData.affiliate_code || "";
            whatsapp = refData.whatsapp || "";
            sourcePage = refData.source_page || "";
            utmSource = refData.utm_source || "";
            utmMedium = refData.utm_medium || "";
            utmCampaign = refData.utm_campaign || "";
        } catch {
            console.log("Could not parse external_reference");
        }

        // ── TRIAL PAYMENT HANDLER ──────────────────────────────────────────
        if (refData.type === "trial" && payment.status === "approved") {
            console.log("🎯 Trial payment detected:", refData);
            // ALWAYS prefer refData.email (set by us in external_reference) over payer.email from MP
            // MP can return payer.email in invalid/masked formats that Resend rejects
            const trialEmail = refData.email || payment.payer?.email;
            await handleTrialPayment(refData, trialEmail, paymentId.toString(), payment.transaction_amount);
            return new Response("OK", { status: 200 });
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
                ...(sourcePage ? { source_page: sourcePage } : {}),
                ...(utmSource ? { utm_source: utmSource } : {}),
                ...(utmMedium ? { utm_medium: utmMedium } : {}),
                ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
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

        const userSegment = sourcePageToSegment(sourcePage);

        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: payerEmail,
            password: DEFAULT_PASSWORD,
            email_confirm: true, // Auto-confirma o email
            user_metadata: {
                plan_type: planType,
                payment_id: paymentId,
                purchase_date: new Date().toISOString(),
                credits: creditsToAdd,
                segment: userSegment,
                ...(whatsapp ? { whatsapp } : {}),
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
                            credits: newTotal,
                            // Only set segment if not already set (don't overwrite existing segment)
                            ...(existingUser.user_metadata?.segment ? {} : { segment: userSegment }),
                            ...(whatsapp ? { whatsapp } : {}),
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
            ...(sourcePage ? { source_page: sourcePage } : {}),
            ...(utmSource ? { utm_source: utmSource } : {}),
            ...(utmMedium ? { utm_medium: utmMedium } : {}),
            ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
        }, { onConflict: "mercadopago_payment_id" });

        // Enviar email de boas-vindas
        const isNewUser = !userError;
        await sendWelcomeEmail(payerEmail, planType, creditsToAdd, isNewUser);

        console.log(`✅ User ${isNewUser ? 'created' : 'updated'} successfully: ${payerEmail}`);
        console.log(`📋 Plan: ${planType} | Credits: ${creditsToAdd}`);

        // ========== SERVER-SIDE PURCHASE TRACKING (Meta CAPI) ==========
        await trackServerPurchase(payerEmail, planType, payment.transaction_amount, paymentId.toString());

        // ========== REFERRAL REWARD ==========
        if (referralCode) {
            await processReferralReward(referralCode, payerEmail);
        }

        // ========== AFFILIATE COMMISSION ==========
        if (affiliateCode) {
            await processAffiliateCommission(affiliateCode, payerEmail, planType, payment.transaction_amount, paymentId.toString());
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        // Sempre retorna 200 para o Mercado Pago não reenviar
        return new Response("OK", { status: 200 });
    }
});

// ============================================================
// TRIAL PAYMENT HANDLER
// ============================================================
async function handleTrialPayment(
    refData: any,
    payerEmail: string,
    paymentId: string,
    amount: number
) {
    const generationId = refData.generation_id;
    const productType = refData.product_type; // 'single' | 'pack'
    const selectedImageIndex = refData.selected_image_index;

    // Robust email sanitization
    // 1. If "Name <email@example.com>" format, extract the email inside <>
    const angleBracketMatch = payerEmail?.match(/<([^>]+)>/);
    let cleanEmail = angleBracketMatch ? angleBracketMatch[1] : payerEmail;
    // 2. Trim whitespace, newlines, control chars, and non-printable/non-ASCII
    cleanEmail = cleanEmail?.trim()
        .replace(/[\r\n\t]/g, '')          // remove line breaks and tabs
        .replace(/[^\x20-\x7E]/g, '')     // remove non-printable and non-ASCII chars
        .trim();
    // 3. Extract raw email using simple regex if still contains garbage
    const emailRegexMatch = cleanEmail?.match(/[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/);
    if (emailRegexMatch) {
        cleanEmail = emailRegexMatch[0];
    }

    if (!generationId || !cleanEmail || !cleanEmail.includes("@")) {
        console.error("Trial payment missing generation_id or valid email. Raw email:", payerEmail, "| Sanitized:", cleanEmail);
        return;
    }
    // Use the sanitized clean email for all subsequent operations
    console.log(`📧 Email sanitized: "${payerEmail}" -> "${cleanEmail}"`);
    payerEmail = cleanEmail;

    console.log(`✅ Trial payment approved: ${payerEmail} | type: ${productType} | gen: ${generationId}`);

    // 1. Check for duplicate processing
    const { data: existing } = await supabaseAdmin
        .from("trial_generations")
        .select("id, status")
        .eq("id", generationId)
        .single();

    if (!existing) {
        console.error("Trial generation not found:", generationId);
        return;
    }

    if (existing.status !== "preview") {
        console.log("Trial already processed:", existing.status);
        return;
    }

    // 2. Update trial status to paid — including product_type and selected_image_index from refData
    const newStatus = productType === "single" ? "paid_single" : "paid_pack";
    await supabaseAdmin
        .from("trial_generations")
        .update({
            status: newStatus,
            mp_payment_id: paymentId,
            payer_email: payerEmail,
            product_type: productType,
            selected_image_index: refData.selected_image_index ?? null,
            expires_at: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days after payment
        })
        .eq("id", generationId);

    // 3. For PACK: create user account with 7 credits (+ the 3 HD images)
    let userCreated = false;
    if (productType === "pack") {
        const PACK_CREDITS = 7; // 3 already unlocked HD + 7 more
        const { data: userData, error: userError } = await supabaseAdmin.auth.admin.createUser({
            email: payerEmail,
            password: "lumi123456",
            email_confirm: true,
            user_metadata: {
                plan_type: "trial_pack",
                payment_id: paymentId,
                purchase_date: new Date().toISOString(),
                credits: PACK_CREDITS,
                segment: "delivery",
                trial_generation_id: generationId,
            },
        });

        if (userError) {
            if (userError.message.includes("already been registered")) {
                // User exists — add 7 credits
                const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
                const existingUser = existingUsers?.users?.find((u: any) => u.email === payerEmail);
                if (existingUser) {
                    const currentCredits = (existingUser.user_metadata?.credits as number) || 0;
                    await supabaseAdmin.auth.admin.updateUserById(existingUser.id, {
                        user_metadata: { ...existingUser.user_metadata, credits: currentCredits + PACK_CREDITS },
                    });
                    await supabaseAdmin.from("trial_generations").update({ created_user_id: existingUser.id }).eq("id", generationId);
                }
            } else {
                console.error("Error creating user for trial pack:", userError);
            }
        } else if (userData?.user) {
            await supabaseAdmin.from("trial_generations").update({ created_user_id: userData.user.id }).eq("id", generationId);
            userCreated = true;
        }
    }

    // 4. Generate signed URLs for HD images (90-day expiry for admin panel access)
    const { data: trialRecord } = await supabaseAdmin
        .from("trial_generations")
        .select("hd_storage_paths")
        .eq("id", generationId)
        .single();

    const hdPaths: { path: string; variation: number; index: number }[] = trialRecord?.hd_storage_paths || [];
    const selectedIndex = refData.selected_image_index;

    const relevantPaths = productType === "single" && selectedIndex !== null && selectedIndex !== undefined
        ? hdPaths.filter(p => p.index === selectedIndex)
        : hdPaths;

    const signedUrlExpirySeconds = 90 * 24 * 3600; // 90 days
    const signedUrls: string[] = [];
    const purchasedPhotoUrls: { url: string; label: string; expires_at: string; index: number }[] = [];

    for (const { path, index } of relevantPaths) {
        const { data: signed } = await supabaseAdmin.storage
            .from("trial-generations")
            .createSignedUrl(path, signedUrlExpirySeconds);
        if (signed?.signedUrl) {
            signedUrls.push(signed.signedUrl);
            purchasedPhotoUrls.push({
                url: signed.signedUrl,
                label: `Foto ${index + 1}`,
                index,
                expires_at: new Date(Date.now() + signedUrlExpirySeconds * 1000).toISOString(),
            });
        }
    }

    // Save purchased photo URLs to DB for admin resend capability
    await supabaseAdmin
        .from("trial_generations")
        .update({ purchased_photo_urls: purchasedPhotoUrls })
        .eq("id", generationId);

    console.log(`📦 Saved ${purchasedPhotoUrls.length} signed URLs to DB for generation ${generationId}`);

    // 5. Send delivery email
    const emailError = await sendTrialDeliveryEmail(payerEmail, productType, signedUrls, userCreated);

    // Track email status
    if (emailError) {
        await supabaseAdmin.from("trial_generations").update({
            last_email_error: emailError,
            email_sent_count: 0,
        }).eq("id", generationId);
        console.error(`❌ Email failed for ${payerEmail}: ${emailError}`);
    } else {
        await supabaseAdmin.from("trial_generations").update({
            email_sent_at: new Date().toISOString(),
            email_sent_count: 1,
            last_email_error: null,
        }).eq("id", generationId);
    }

    // 6. Track purchase
    await trackServerPurchase(payerEmail, `trial_${productType}`, amount, paymentId);

    console.log(`🎉 Trial unlocked: ${signedUrls.length} HD photos for ${payerEmail}`);
}

async function sendTrialDeliveryEmail(email: string, productType: string, signedUrls: string[], userCreated: boolean): Promise<string | null> {
    if (!RESEND_API_KEY) return "RESEND_API_KEY not configured";
    if (signedUrls.length === 0) return "No signed URLs to send";

    const photoLinksHtml = signedUrls.map((url, i) =>
        `<a href="${url}" style="display:inline-block;margin:6px 4px;padding:10px 20px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:13px;border-radius:8px;text-decoration:none;">📥 Baixar Foto ${i + 1}</a>`
    ).join("");

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <h1 style="color:#f59e0b;font-size:24px;margin:0 0 4px 0;">LUMIPHOTO<span style="color:#fff;">IA</span></h1>
  <p style="color:#666;font-size:13px;margin:0 0 32px 0;">Estúdio de Fotografia com IA — Delivery</p>

  <div style="background:#1a1a2e;border-radius:16px;padding:28px;border:1px solid rgba(245,158,11,0.2);">
    <h2 style="color:#fff;font-size:20px;margin:0 0 8px 0;">🎉 Suas fotos profissionais estão prontas!</h2>
    <p style="color:#a0a0a0;font-size:14px;margin:0 0 20px 0;">
      ${productType === "single"
            ? "Sua foto em HD foi gerada e está disponível para download abaixo."
            : "Suas 3 fotos em HD estão prontas! Além disso, criamos sua conta com 7 créditos para mais fotos."}
    </p>

    <div style="text-align:center;margin:24px 0;">${photoLinksHtml}</div>

    <p style="color:#666;font-size:11px;text-align:center;margin:16px 0 0 0;">Os links expiram em 7 dias. Baixe e salve suas fotos!</p>

    ${productType === "pack" && userCreated ? `
    <div style="margin-top:24px;padding:16px;background:rgba(245,158,11,0.08);border-radius:10px;border:1px solid rgba(245,158,11,0.15);">
      <p style="color:#f59e0b;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">🔐 Sua Conta LumiPhotoIA</p>
      <p style="color:#fff;font-size:14px;margin:0 0 4px 0;">Email: <strong>${email}</strong></p>
      <p style="color:#fff;font-size:14px;margin:0 0 4px 0;">Senha: <strong>lumi123456</strong></p>
      <p style="color:#a0a0a0;font-size:12px;margin:8px 0 0 0;">+ 7 créditos para gerar mais fotos. Mude sua senha após o primeiro acesso.</p>
    </div>` : ""}

    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}/delivery" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:14px;border-radius:10px;text-decoration:none;">Gerar Mais Fotos →</a>
    </div>
  </div>

  <p style="color:#444;font-size:11px;text-align:center;margin-top:24px;">© ${new Date().getFullYear()} LumiPhotoIA. Dúvidas? Responda este email.</p>
</div>
</body></html>`;

    try {
        const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({
                from: "LumiPhotoIA <team@lumiphotoia.online>",
                to: [email],
                subject: "📸 Suas fotos profissionais estão prontas para download!",
                html,
            }),
        });
        const resendBody = await resendRes.json().catch(() => ({}));
        if (!resendRes.ok) {
            const errMsg = `Resend HTTP ${resendRes.status}: ${JSON.stringify(resendBody)}`;
            console.error("Failed to send trial email:", errMsg);
            return errMsg;
        }
        console.log(`📧 Trial delivery email sent to ${email}`, resendBody);
        return null; // success
    } catch (err) {
        const errMsg = String(err);
        console.error("Failed to send trial email:", errMsg);
        return errMsg;
    }
}



function getPlanFromReference(ref: string): string {
    try { const data = JSON.parse(ref); return data.plan || "starter"; } catch { return "starter"; }
}

// Server-side Purchase event via TrackPro (Meta CAPI)
async function trackServerPurchase(email: string, plan: string, amount: number, paymentId: string) {
    try {
        const eventId = `purchase_${paymentId}`;
        const purchaseValue = PLAN_PRICES[plan] || amount || 37;

        const payload = {
            event_name: "Purchase",
            event_id: eventId,
            event_time: Math.floor(Date.now() / 1000),
            source_url: `${SITE_URL}/checkout/success`,
            user_id: TRACKPRO_USER_ID,
            user_data: {
                email: email || null,
                external_id: `server_${paymentId}`,
            },
            custom_data: {
                value: purchaseValue,
                currency: "BRL",
                content_name: plan || "LumiPhoto Credits",
                content_type: "product",
                order_id: paymentId,
            },
        };

        const res = await fetch(TRACKPRO_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "apikey": TRACKPRO_ANON_KEY,
                "Authorization": `Bearer ${TRACKPRO_ANON_KEY}`,
            },
            body: JSON.stringify(payload),
        });

        if (res.ok) {
            console.log(`📊 Server-side Purchase tracked via CAPI: ${email} | ${plan} | R$${purchaseValue} | eventId: ${eventId}`);
        } else {
            console.error("TrackPro CAPI error:", await res.text());
        }
    } catch (error) {
        console.error("Failed to track server-side Purchase:", error);
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

async function processAffiliateCommission(affiliateCode: string, buyerEmail: string, planType: string, saleAmount: number, paymentId: string) {
    try {
        console.log(`🤝 Processing affiliate commission for code: ${affiliateCode}`);

        // Find the affiliate
        const { data: affiliate, error: affError } = await supabaseAdmin
            .from("affiliates")
            .select("*")
            .eq("affiliate_code", affiliateCode)
            .eq("is_active", true)
            .single();

        if (affError || !affiliate) {
            console.log("Affiliate not found or inactive:", affiliateCode);
            return;
        }

        // Anti-fraud: block self-purchase
        if (affiliate.email.toLowerCase() === buyerEmail.toLowerCase()) {
            console.warn("⚠️ Self-affiliate purchase blocked:", buyerEmail);
            return;
        }

        // Check for duplicate
        const { data: existing } = await supabaseAdmin
            .from("affiliate_sales")
            .select("id")
            .eq("payment_id", paymentId)
            .single();

        if (existing) {
            console.log("Affiliate sale already recorded for payment:", paymentId);
            return;
        }

        // Calculate commission
        const commissionAmount = Number(saleAmount) * Number(affiliate.commission_percent) / 100;

        // Insert affiliate sale
        const { error: insertError } = await supabaseAdmin
            .from("affiliate_sales")
            .insert({
                affiliate_id: affiliate.id,
                payment_id: paymentId,
                buyer_email: buyerEmail,
                plan_type: planType,
                sale_amount: saleAmount,
                commission_amount: commissionAmount,
                status: "pending",
            });

        if (insertError) {
            console.error("Error recording affiliate sale:", insertError);
            return;
        }

        console.log(`✅ Affiliate ${affiliate.name} earned ${commissionAmount.toFixed(2)} (${affiliate.commission_percent}% of ${saleAmount})`);
    } catch (error) {
        console.error("Error processing affiliate commission:", error);
    }
}
