import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const DEFAULT_PASSWORD = "lumi123456";
const SITE_URL = "https://www.lumiphotoia.online";

// TrackPro/Meta CAPI - Server-Side Tracking
const TRACKPRO_ENDPOINT = "https://obzvzudlfftyjwgemdhx.supabase.co/functions/v1/track-event";
const TRACKPRO_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ienZ6dWRsZmZ0eWp3Z2VtZGh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzY0NjYsImV4cCI6MjA4NzgxMjQ2Nn0.iSgCV7hYpR4UKm0Twok4AmBFzhQqThpFSx6AQaNFKkI";
const TRACKPRO_USER_ID = "844b2e8d-36b7-438b-93d4-2bc9cee6118d";

// Per-niche pixel IDs
const MAIN_PIXEL_ID = '4260013394267682';
const MODA_PIXEL_ID = '2128280607956363';

function getPixelIdsForSource(sourcePage: string): string[] {
    const ids = [MAIN_PIXEL_ID];
    const path = (sourcePage || '').toLowerCase();
    if (path === 'moda' || path === '/moda') ids.push(MODA_PIXEL_ID);
    return ids;
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
    },
});

// SAFETY: Fix NULL string columns in auth.users that crash GoTrue's Go scanner
async function fixNullAuthTokens(userId: string) {
    try {
        await supabaseAdmin.rpc('fix_null_auth_tokens', { target_user_id: userId });
        console.log('Fixed NULL auth tokens for user:', userId);
    } catch (e) {
        console.warn('fixNullAuthTokens failed (non-critical):', e);
    }
}

// Map Assiny product price to plan
const PRICE_TO_PLAN: Record<number, string> = {
    37: "starter",
    57: "essencial",
    97: "pro",
    117: "premium",
};

const CREDITS_MAP: Record<string, number> = {
    starter: 10,
    essencial: 30,
    pro: 80,
    premium: 100,
};

const PLAN_PRICES: Record<string, number> = {
    starter: 37, essencial: 57, pro: 97, premium: 117,
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
    if (path === 'moda') return 'moda';
    return 'delivery';
}

function isValidEmail(email: string): boolean {
    return !!email && email.includes('@') && !email.includes('*') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

Deno.serve(async (req: Request) => {
    // Allow GET for health check
    if (req.method === "GET") {
        return new Response(JSON.stringify({ status: "ok", service: "assiny-webhook" }), {
            headers: { "Content-Type": "application/json" },
        });
    }

    if (req.method !== "POST") {
        return new Response("Method not allowed", { status: 405 });
    }

    try {
        // Parse the webhook payload
        let body: any = {};
        try {
            body = await req.json();
        } catch {
            const text = await req.text();
            console.log("Raw body (not JSON):", text);
            return new Response("OK", { status: 200 });
        }

        // ===== DISCOVERY LOGGING =====
        // Log the full payload to understand Assiny's webhook format
        console.log("📦 Assiny webhook received:", JSON.stringify(body, null, 2));
        console.log("📦 Headers:", JSON.stringify(Object.fromEntries(req.headers.entries())));

        // ===== EXTRACT DATA FROM PAYLOAD =====
        // Assiny's exact payload format is not publicly documented.
        // We search common field patterns used by Brazilian checkout platforms.
        const payerEmail = (
            body.buyer?.email ||
            body.customer?.email ||
            body.data?.buyer?.email ||
            body.data?.customer?.email ||
            body.email ||
            body.payer?.email ||
            body.data?.purchase?.buyer?.email ||
            ""
        ).toLowerCase().trim();

        const transactionId = (
            body.transaction ||
            body.transaction_id ||
            body.data?.purchase?.transaction ||
            body.data?.transaction ||
            body.id ||
            body.purchase?.transaction ||
            `assiny_${Date.now()}`
        ).toString();

        const productName = (
            body.product?.name ||
            body.data?.product?.name ||
            body.prod?.name ||
            body.item?.name ||
            ""
        ).toLowerCase();

        const amount = (
            body.purchase?.full_price?.value ||
            body.data?.purchase?.full_price?.value ||
            body.price ||
            body.amount ||
            body.value ||
            body.data?.purchase?.price?.value ||
            body.purchase?.price ||
            0
        );

        const status = (
            body.event ||
            body.status ||
            body.data?.purchase?.status ||
            body.purchase?.status ||
            ""
        ).toString().toUpperCase();

        const buyerName = (
            body.buyer?.name ||
            body.customer?.name ||
            body.data?.buyer?.name ||
            body.buyer?.first_name ||
            ""
        );

        const buyerPhone = (
            body.buyer?.phone ||
            body.customer?.phone ||
            body.data?.buyer?.phone ||
            body.buyer?.checkout_phone ||
            ""
        );

        console.log(`📋 Parsed: email=${payerEmail} | tx=${transactionId} | amount=${amount} | status=${status} | product=${productName}`);

        // ===== VALIDATE =====
        // Only process approved/completed purchases
        const isApproved = (
            status.includes("APPROVED") ||
            status.includes("COMPLETED") ||
            status.includes("PURCHASE_APPROVED") ||
            status.includes("PAID") ||
            status === "APPROVED" ||
            // If no status field, treat as approved (some platforms only send on approval)
            (!status && payerEmail && amount > 0)
        );

        if (!isApproved) {
            console.log(`⏳ Non-approved event (${status}), storing for tracking`);
            return new Response("OK", { status: 200 });
        }

        if (!payerEmail || !isValidEmail(payerEmail)) {
            console.error("❌ No valid email found in webhook payload");
            console.log("Payload keys:", Object.keys(body));
            return new Response("OK", { status: 200 });
        }

        // ===== DETERMINE PLAN =====
        // Try price-based matching first, then product name
        const numericAmount = typeof amount === 'number' ? amount : parseFloat(String(amount)) || 0;
        // Round to handle decimal amounts like 37.00
        const roundedAmount = Math.round(numericAmount);
        let planType = PRICE_TO_PLAN[roundedAmount] || "";

        if (!planType) {
            // Try matching by product name
            if (productName.includes("starter") || productName.includes("10 fotos")) planType = "starter";
            else if (productName.includes("essencial") || productName.includes("30 fotos")) planType = "essencial";
            else if (productName.includes("pro") || productName.includes("80 fotos")) planType = "pro";
            else if (productName.includes("premium") || productName.includes("100 fotos")) planType = "premium";
            else planType = "starter"; // fallback
        }

        const creditsToAdd = CREDITS_MAP[planType] || 10;
        console.log(`🎯 Plan detected: ${planType} (${creditsToAdd} credits) from amount R$${roundedAmount}`);

        // ===== IDEMPOTENCY CHECK =====
        // Check if this transaction was already processed
        const { data: existingPayment } = await supabaseAdmin
            .from("payments")
            .select("status, user_created")
            .eq("mercadopago_payment_id", transactionId)
            .maybeSingle();

        if (existingPayment?.user_created) {
            console.log(`⚡ Transaction ${transactionId} already processed, skipping`);
            return new Response("OK", { status: 200 });
        }

        // ===== STORE PAYMENT RECORD =====
        await supabaseAdmin.from("payments").upsert({
            mercadopago_payment_id: transactionId,
            payer_email: payerEmail,
            plan_type: planType,
            amount: numericAmount || PLAN_PRICES[planType] || 37,
            status: "approved",
            metadata: body,
            source_page: "assiny",
            purchase_tracked: false,
        }, { onConflict: "mercadopago_payment_id" });

        // Atomic claim
        const { data: claimedRows } = await supabaseAdmin
            .from("payments")
            .update({ user_created: true })
            .eq("mercadopago_payment_id", transactionId)
            .or("user_created.eq.false,user_created.is.null")
            .select("mercadopago_payment_id");

        if (!claimedRows || claimedRows.length === 0) {
            console.log("⚡ Payment already claimed by another webhook instance");
            return new Response("OK", { status: 200 });
        }

        console.log(`🔒 Atomically claimed transaction ${transactionId}`);

        // ===== DETERMINE SEGMENT (SOURCE PAGE) =====
        // Try to find a recent checkout_intent from the pending_checkouts table or use default
        let sourcePage = "delivery";
        let whatsapp = "";
        let referralCode = "";
        let affiliateCode = "";

        // Look up by email in recent payments for source_page info
        // The checkout intent is saved client-side in localStorage; for now, default to delivery
        // When the user visits the site post-purchase, we can reconcile

        const userSegment = sourcePageToSegment(sourcePage);

        // ===== CREATE / UPDATE USER =====
        console.log(`👤 Creating user: ${payerEmail} | Plan: ${planType} | Credits: ${creditsToAdd}`);

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
                payment_id: transactionId,
                purchase_date: new Date().toISOString(),
                credits: creditsToAdd,
                segment: userSegment,
                ...(whatsapp ? { whatsapp } : {}),
            },
        });

        if (userData?.user?.id) {
            await fixNullAuthTokens(userData.user.id);
        }

        let resolvedUserId = userData?.user?.id || null;

        if (userError) {
            if (userError.message.includes("already been registered")) {
                console.log("User already exists, updating metadata and adding credits");

                const { data: existingRows, error: rpcError } = await supabaseAdmin
                    .rpc('get_user_by_email', { target_email: payerEmail });

                if (rpcError) {
                    console.error("RPC get_user_by_email error:", rpcError);
                }

                const existingUser = existingRows?.[0];

                if (existingUser) {
                    resolvedUserId = existingUser.user_id;
                    const currentCredits = (existingUser.user_meta?.credits as number) || 0;
                    const newTotal = currentCredits + creditsToAdd;

                    await supabaseAdmin.auth.admin.updateUserById(existingUser.user_id, {
                        user_metadata: {
                            ...(existingUser.user_meta || {}),
                            plan_type: planType,
                            payment_id: transactionId,
                            last_payment_date: new Date().toISOString(),
                            credits: newTotal,
                            ...(existingUser.user_meta?.segment ? {} : { segment: userSegment }),
                            ...(whatsapp ? { whatsapp } : {}),
                        },
                    });
                    console.log(`✅ Updated existing user ${existingUser.user_id}: credits ${currentCredits} → ${newTotal}`);
                } else {
                    console.error("❌ Could not find existing user by email:", payerEmail);
                }
            } else {
                console.error("Error creating user:", userError);
                return new Response("OK", { status: 200 });
            }
        }

        // Update payment with user_id
        await supabaseAdmin.from("payments").update({
            payer_email: payerEmail,
            user_id: resolvedUserId,
            status: "approved",
        }).eq("mercadopago_payment_id", transactionId);

        // ===== SEND WELCOME EMAIL =====
        const isNewUser = !userError;
        const emailError = await sendWelcomeEmail(payerEmail, planType, creditsToAdd, isNewUser);

        await supabaseAdmin.from("payments").update({
            email_sent: !emailError,
            email_error: emailError || null,
        }).eq("mercadopago_payment_id", transactionId);

        if (emailError) {
            console.error(`❌ Welcome email FAILED for ${payerEmail}: ${emailError}`);
        } else {
            console.log(`📧 Welcome email confirmed sent to ${payerEmail}`);
        }

        console.log(`✅ User ${isNewUser ? 'created' : 'updated'} successfully: ${payerEmail}`);
        console.log(`📋 Plan: ${planType} | Credits: ${creditsToAdd}`);

        // ===== SERVER-SIDE PURCHASE TRACKING (Meta CAPI) =====
        const { data: trackGuard } = await supabaseAdmin
            .from("payments")
            .update({ purchase_tracked: true })
            .eq("mercadopago_payment_id", transactionId)
            .eq("purchase_tracked", false)
            .select("mercadopago_payment_id");

        if (trackGuard && trackGuard.length > 0) {
            await trackServerPurchase(payerEmail, planType, numericAmount || PLAN_PRICES[planType], transactionId, {
                phone: buyerPhone || null,
                firstName: buyerName || null,
                lastName: null,
                fbp: null,
                fbc: null,
                pixelIds: getPixelIdsForSource(sourcePage),
            });
        }

        // ===== REFERRAL REWARD =====
        if (referralCode) {
            await processReferralReward(referralCode, payerEmail);
        }

        return new Response("OK", { status: 200 });
    } catch (error) {
        console.error("Webhook error:", error);
        return new Response("OK", { status: 200 });
    }
});

// ============================================================
// WELCOME EMAIL
// ============================================================
async function sendWelcomeEmail(email: string, planType: string, credits: number, isNewUser: boolean): Promise<string | null> {
    if (!RESEND_API_KEY) return "RESEND_API_KEY not configured";
    if (email.includes("@pegueepregue.temp")) return null;

    const subject = isNewUser
        ? "🎉 Bem-vindo à LumiPhotoIA! Seus créditos já estão disponíveis"
        : "✅ Créditos adicionados à sua conta LumiPhotoIA";

    const planEmoji: Record<string, string> = { starter: '🚀', essencial: '🌟', pro: '🔥', premium: '👑' };

    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:40px 20px;">
  <h1 style="color:#f59e0b;font-size:24px;margin:0 0 4px 0;">LUMIPHOTO<span style="color:#fff;">IA</span></h1>
  <p style="color:#666;font-size:13px;margin:0 0 32px 0;">Est` + "ú" + `dio de Fotografia com IA</p>

  <div style="background:#1a1a2e;border-radius:16px;padding:28px;border:1px solid rgba(245,158,11,0.2);">
    <h2 style="color:#fff;font-size:20px;margin:0 0 8px 0;">${isNewUser ? '🎉 Sua conta foi criada com sucesso!' : '✅ Cr' + "é" + 'ditos adicionados!'}</h2>
    <p style="color:#a0a0a0;font-size:14px;margin:0 0 20px 0;">
      ${isNewUser ? 'Voc' + "ê" + ' j' + "á" + ' pode come' + "ç" + 'ar a gerar fotos profissionais com IA.' : 'Seus cr' + "é" + 'ditos foram adicionados ' + "à" + ' sua conta.'}
    </p>

    <div style="background:rgba(245,158,11,0.08);border-radius:12px;padding:20px;border:1px solid rgba(245,158,11,0.15);margin-bottom:20px;">
      <p style="color:#f59e0b;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">Seu Plano</p>
      <p style="color:#fff;font-size:18px;margin:0 0 4px 0;font-weight:bold;">${planEmoji[planType] || ''} ${planType.charAt(0).toUpperCase() + planType.slice(1)}</p>
      <p style="color:#a0a0a0;font-size:14px;margin:0;">${credits} fotos profissionais</p>
    </div>

    ${isNewUser ? `
    <div style="background:rgba(245,158,11,0.08);border-radius:12px;padding:20px;border:1px solid rgba(245,158,11,0.15);margin-bottom:20px;">
      <p style="color:#f59e0b;font-size:12px;margin:0 0 8px 0;text-transform:uppercase;letter-spacing:1px;">Dados de Acesso</p>
      <p style="color:#fff;font-size:14px;margin:0 0 4px 0;">Email: <strong>${email}</strong></p>
      <p style="color:#fff;font-size:14px;margin:0 0 4px 0;">Senha: <strong>lumi123456</strong></p>
      <p style="color:#a0a0a0;font-size:12px;margin:8px 0 0 0;">Mude sua senha ap` + "ó" + `s o primeiro acesso.</p>
    </div>` : ''}

    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}" style="display:inline-block;padding:14px 40px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:14px;border-radius:10px;text-decoration:none;">Acessar Minha Conta</a>
    </div>
  </div>

  <p style="color:#444;font-size:11px;text-align:center;margin-top:24px;">` + "©" + ` ${new Date().getFullYear()} LumiPhotoIA. D` + "ú" + `vidas? Responda este email.</p>
</div>
</body></html>`;

    try {
        const resendRes = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
            body: JSON.stringify({
                from: "LumiPhotoIA <team@lumiphotoia.online>",
                to: [email],
                subject,
                html,
            }),
        });
        const resendBody = await resendRes.json().catch(() => ({}));
        if (!resendRes.ok) {
            return `Resend HTTP ${resendRes.status}: ${JSON.stringify(resendBody)}`;
        }
        console.log(`📧 Email sent to ${email}`, resendBody);
        return null;
    } catch (err) {
        return String(err);
    }
}

// ============================================================
// SERVER-SIDE PURCHASE TRACKING (Meta CAPI)
// ============================================================
interface TrackExtraData {
    phone?: string | null;
    firstName?: string | null;
    lastName?: string | null;
    fbp?: string | null;
    fbc?: string | null;
    pixelIds?: string[];
}

async function trackServerPurchase(email: string, plan: string, amount: number, paymentId: string, extra?: TrackExtraData) {
    try {
        const eventId = `purchase_${paymentId}`;
        const purchaseValue = PLAN_PRICES[plan] || amount || 37;

        let normPhone: string | null = null;
        if (extra?.phone) {
            const digits = extra.phone.replace(/\D/g, '');
            if (digits.length === 10 || digits.length === 11) {
                normPhone = '55' + digits;
            } else if (digits.length >= 12) {
                normPhone = digits;
            }
        }

        const payload = {
            event_name: "Purchase",
            event_id: eventId,
            event_time: Math.floor(Date.now() / 1000),
            source_url: `${SITE_URL}/checkout/success`,
            user_id: TRACKPRO_USER_ID,
            ...(extra?.fbp ? { fbp: extra.fbp } : {}),
            ...(extra?.fbc ? { fbc: extra.fbc } : {}),
            ...(extra?.pixelIds ? { pixel_ids: extra.pixelIds } : {}),
            user_data: {
                email: email?.toLowerCase().trim() || null,
                phone: normPhone,
                first_name: extra?.firstName?.toLowerCase().trim() || null,
                last_name: extra?.lastName?.toLowerCase().trim() || null,
                external_id: `server_${paymentId}`,
                country: 'br',
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
            console.log(`📊 Server-side Purchase tracked: ${email} | ${plan} | R$${purchaseValue}`);
        } else {
            console.error("TrackPro CAPI error:", await res.text());
        }
    } catch (error) {
        console.error("Failed to track server-side Purchase:", error);
    }
}

// ============================================================
// REFERRAL REWARD
// ============================================================
async function processReferralReward(referralCode: string, buyerEmail: string) {
    try {
        const { data: referrer } = await supabaseAdmin
            .from("referral_codes")
            .select("user_id")
            .eq("code", referralCode)
            .single();

        if (referrer?.user_id) {
            const { data: refUser } = await supabaseAdmin
                .rpc('get_user_by_email', { target_email: buyerEmail });

            // Don't reward self-referrals
            if (refUser?.[0]?.user_id === referrer.user_id) {
                console.log("Self-referral detected, skipping reward");
                return;
            }

            const { data: existingRows } = await supabaseAdmin
                .rpc('get_user_by_id', { target_user_id: referrer.user_id });

            const existingUser = existingRows?.[0];
            if (existingUser) {
                const currentCredits = (existingUser.user_meta?.credits as number) || 0;
                await supabaseAdmin.auth.admin.updateUserById(referrer.user_id, {
                    user_metadata: {
                        ...(existingUser.user_meta || {}),
                        credits: currentCredits + 3,
                    },
                });
                console.log(`🎁 Referral reward: +3 credits to ${referrer.user_id}`);
            }
        }
    } catch (err) {
        console.error("Referral reward error:", err);
    }
}
