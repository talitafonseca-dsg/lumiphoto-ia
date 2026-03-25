import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const ADMIN_EMAIL = "talitafpublicitaria@gmail.com";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
    "Content-Type": "application/json",
};

async function verifyAdmin(req: Request): Promise<string | null> {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user || user.email !== ADMIN_EMAIL) return null;
    return user.email;
}

async function verifyAffiliate(req: Request): Promise<any | null> {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return null;
    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) return null;
    // Check if this user is an affiliate
    const { data: affiliate } = await supabaseAdmin
        .from("affiliates")
        .select("*")
        .eq("email", user.email)
        .eq("is_active", true)
        .single();
    return affiliate || null;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        const { action, ...params } = await req.json();

        // ==================== ADMIN ACTIONS ====================

        // SET CREDITS
        if (action === "set_credits") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { email, credits } = params;
            const { data: allUsers } = await supabaseAdmin.auth.admin.listUsers();
            const user = allUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());
            if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers: corsHeaders });

            await supabaseAdmin.auth.admin.updateUserById(user.id, {
                user_metadata: { ...user.user_metadata, credits: Number(credits) },
            });

            return new Response(JSON.stringify({ success: true, email, credits }), { headers: corsHeaders });
        }

        // ADD AFFILIATE
        if (action === "add_affiliate") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { name, email, phone, pix_key, commission_percent, affiliate_code } = params;

            // Create user account for affiliate if doesn't exist
            const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
            let affiliateUser = existingUsers?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

            if (!affiliateUser) {
                const password = "afiliado" + Math.random().toString(36).slice(2, 8);
                const { data: newUser } = await supabaseAdmin.auth.admin.createUser({
                    email,
                    password,
                    email_confirm: true,
                    user_metadata: { is_affiliate: true, affiliate_name: name, credits: 0 },
                });
                affiliateUser = newUser?.user || undefined;
            } else {
                await supabaseAdmin.auth.admin.updateUserById(affiliateUser.id, {
                    user_metadata: { ...affiliateUser.user_metadata, is_affiliate: true, affiliate_name: name },
                });
            }

            // Insert into affiliates table
            const { data: affiliate, error: insertError } = await supabaseAdmin
                .from("affiliates")
                .insert({
                    name,
                    email,
                    phone: phone || null,
                    pix_key: pix_key || null,
                    affiliate_code: affiliate_code || name.toLowerCase().replace(/\s+/g, '').slice(0, 10) + Math.random().toString(36).slice(2, 6),
                    commission_percent: Number(commission_percent) || 20,
                    is_active: true,
                    user_id: affiliateUser?.id || null,
                })
                .select()
                .single();

            if (insertError) {
                return new Response(JSON.stringify({ error: insertError.message }), { status: 400, headers: corsHeaders });
            }

            return new Response(JSON.stringify({ success: true, affiliate }), { headers: corsHeaders });
        }

        // LIST AFFILIATES
        if (action === "list_affiliates") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { data: affiliates } = await supabaseAdmin
                .from("affiliates")
                .select("*")
                .order("created_at", { ascending: false });

            // Get sales summary for each affiliate
            const { data: sales } = await supabaseAdmin
                .from("affiliate_sales")
                .select("*");

            const { data: payouts } = await supabaseAdmin
                .from("affiliate_payouts")
                .select("*");

            const affiliatesWithStats = (affiliates || []).map((aff: any) => {
                const affSales = (sales || []).filter((s: any) => s.affiliate_id === aff.id);
                const affPayouts = (payouts || []).filter((p: any) => p.affiliate_id === aff.id);
                const totalCommission = affSales.reduce((sum: number, s: any) => sum + Number(s.commission_amount || 0), 0);
                const totalPaid = affPayouts.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
                return {
                    ...aff,
                    total_sales: affSales.length,
                    total_revenue: affSales.reduce((sum: number, s: any) => sum + Number(s.sale_amount || 0), 0),
                    total_commission: totalCommission,
                    total_paid: totalPaid,
                    pending_commission: totalCommission - totalPaid,
                    sales: affSales,
                    payouts: affPayouts,
                };
            });

            return new Response(JSON.stringify({ affiliates: affiliatesWithStats }), { headers: corsHeaders });
        }

        // UPDATE AFFILIATE
        if (action === "update_affiliate") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { id, ...updates } = params;
            const { error } = await supabaseAdmin
                .from("affiliates")
                .update(updates)
                .eq("id", id);

            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });
            return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });
        }

        // REGISTER PAYOUT
        if (action === "register_payout") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { affiliate_id, amount, period_start, period_end, pix_receipt } = params;

            const { data: payout, error } = await supabaseAdmin
                .from("affiliate_payouts")
                .insert({
                    affiliate_id,
                    amount: Number(amount),
                    period_start,
                    period_end,
                    pix_receipt: pix_receipt || null,
                    paid_at: new Date().toISOString(),
                    created_by: ADMIN_EMAIL,
                })
                .select()
                .single();

            if (error) return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: corsHeaders });

            // Update related sales to 'paid'
            await supabaseAdmin
                .from("affiliate_sales")
                .update({ status: "paid" })
                .eq("affiliate_id", affiliate_id)
                .eq("status", "pending");

            return new Response(JSON.stringify({ success: true, payout }), { headers: corsHeaders });
        }

        // ==================== AFFILIATE ACTIONS ====================

        // GET AFFILIATE DASHBOARD (for affiliate user)
        if (action === "affiliate_dashboard") {
            const affiliate = await verifyAffiliate(req);
            if (!affiliate) return new Response(JSON.stringify({ error: "Não é afiliado" }), { status: 403, headers: corsHeaders });

            const { data: sales } = await supabaseAdmin
                .from("affiliate_sales")
                .select("*")
                .eq("affiliate_id", affiliate.id)
                .order("created_at", { ascending: false });

            const { data: payouts } = await supabaseAdmin
                .from("affiliate_payouts")
                .select("*")
                .eq("affiliate_id", affiliate.id)
                .order("paid_at", { ascending: false });

            const totalCommission = (sales || []).reduce((sum: number, s: any) => sum + Number(s.commission_amount || 0), 0);
            const totalPaid = (payouts || []).reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

            // Current month sales
            const now = new Date();
            const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
            const monthSales = (sales || []).filter((s: any) => s.created_at >= monthStart);
            const monthCommission = monthSales.reduce((sum: number, s: any) => sum + Number(s.commission_amount || 0), 0);

            return new Response(JSON.stringify({
                affiliate: {
                    name: affiliate.name,
                    email: affiliate.email,
                    affiliate_code: affiliate.affiliate_code,
                    commission_percent: affiliate.commission_percent,
                },
                stats: {
                    total_sales: (sales || []).length,
                    total_commission: totalCommission,
                    total_paid: totalPaid,
                    pending_commission: totalCommission - totalPaid,
                    month_sales: monthSales.length,
                    month_commission: monthCommission,
                },
                sales: sales || [],
                payouts: payouts || [],
            }), { headers: corsHeaders });
        }

        // LIST USERS FOR CAMPAIGN TARGETING
        if (action === "list_users_for_campaign") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { data: allUsersData } = await supabaseAdmin.auth.admin.listUsers();
            const allUsers = allUsersData?.users || [];

            // Get payments to know who bought
            const { data: payments } = await supabaseAdmin.from("payments").select("payer_email").eq("status", "approved");
            const buyerEmails = new Set((payments || []).map((p: any) => p.payer_email?.toLowerCase()));

            const users = allUsers.map((u: any) => ({
                id: u.id,
                email: u.email || "",
                whatsapp: u.user_metadata?.whatsapp || "",
                credits: u.user_metadata?.credits || 0,
                plan: u.user_metadata?.plan_type || "—",
                isBuyer: buyerEmails.has(u.email?.toLowerCase()),
                created: u.created_at,
            }));

            const totalUsers = users.length;
            const totalWithWhatsapp = users.filter((u: any) => u.whatsapp).length;
            const totalBuyers = users.filter((u: any) => u.isBuyer).length;
            const totalNonBuyers = totalUsers - totalBuyers;
            const totalWithCredits = users.filter((u: any) => u.credits > 0).length;

            return new Response(JSON.stringify({
                users,
                summary: { totalUsers, totalWithWhatsapp, totalBuyers, totalNonBuyers, totalWithCredits },
            }), { headers: corsHeaders });
        }

        // SEND EMAIL CAMPAIGN
        if (action === "send_campaign") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            if (!RESEND_API_KEY) {
                return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500, headers: corsHeaders });
            }

            const { subject, html_body, audience, emails: specificEmails } = params;

            if (!subject || !html_body) {
                return new Response(JSON.stringify({ error: "Subject and html_body are required" }), { status: 400, headers: corsHeaders });
            }

            // Get target emails based on audience
            let targetEmails: string[] = [];

            if (specificEmails && specificEmails.length > 0) {
                targetEmails = specificEmails;
            } else {
                const { data: allUsersData } = await supabaseAdmin.auth.admin.listUsers();
                const allUsers = allUsersData?.users || [];

                if (audience === "all") {
                    targetEmails = allUsers.map((u: any) => u.email).filter(Boolean);
                } else if (audience === "buyers") {
                    const { data: payments } = await supabaseAdmin.from("payments").select("payer_email").eq("status", "approved");
                    targetEmails = [...new Set((payments || []).map((p: any) => p.payer_email).filter(Boolean))];
                } else if (audience === "non_buyers") {
                    const { data: payments } = await supabaseAdmin.from("payments").select("payer_email").eq("status", "approved");
                    const buyerSet = new Set((payments || []).map((p: any) => p.payer_email?.toLowerCase()));
                    targetEmails = allUsers.filter((u: any) => !buyerSet.has(u.email?.toLowerCase())).map((u: any) => u.email).filter(Boolean);
                } else if (audience === "with_credits") {
                    targetEmails = allUsers.filter((u: any) => (u.user_metadata?.credits || 0) > 0).map((u: any) => u.email).filter(Boolean);
                } else if (audience === "no_credits") {
                    targetEmails = allUsers.filter((u: any) => (u.user_metadata?.credits || 0) === 0).map((u: any) => u.email).filter(Boolean);
                } else {
                    targetEmails = allUsers.map((u: any) => u.email).filter(Boolean);
                }
            }

            if (targetEmails.length === 0) {
                return new Response(JSON.stringify({ error: "No recipients found for this audience" }), { status: 400, headers: corsHeaders });
            }

            // Send emails in batches via Resend
            const BATCH_SIZE = 50;
            let sent = 0;
            let failed = 0;
            const errors: string[] = [];

            for (let i = 0; i < targetEmails.length; i += BATCH_SIZE) {
                const batch = targetEmails.slice(i, i + BATCH_SIZE);

                const promises = batch.map(async (toEmail: string) => {
                    try {
                        const res = await fetch('https://api.resend.com/emails', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${RESEND_API_KEY}`,
                            },
                            body: JSON.stringify({
                                from: 'LumiphotoIA <team@lumiphotoia.online>',
                                to: [toEmail],
                                subject: subject,
                                html: html_body,
                            }),
                        });
                        if (res.ok) { sent++; }
                        else {
                            failed++;
                            const err = await res.text();
                            errors.push(`${toEmail}: ${err}`);
                        }
                    } catch (e: any) {
                        failed++;
                        errors.push(`${toEmail}: ${e.message}`);
                    }
                });

                await Promise.all(promises);

                // Rate limit between batches
                if (i + BATCH_SIZE < targetEmails.length) {
                    await new Promise(r => setTimeout(r, 100));
                }
            }

            return new Response(JSON.stringify({
                success: true,
                total: targetEmails.length,
                sent,
                failed,
                errors: errors.slice(0, 10), // Only first 10 errors
            }), { headers: corsHeaders });
        }

        // ==================== TRIAL PURCHASE MANAGEMENT ====================

        // LIST TRIAL PURCHASES (paid trials for admin visibility)
        if (action === "list_trial_purchases") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { data: purchases, error: fetchErr } = await supabaseAdmin
                .from("trial_generations")
                .select("id, session_id, status, product_type, selected_image_index, payer_email, mp_payment_id, hd_storage_paths, purchased_photo_urls, email_sent_at, email_sent_count, last_email_error, created_at, expires_at, delivery_style")
                .in("status", ["paid_single", "paid_pack"])
                .order("created_at", { ascending: false })
                .limit(100);

            if (fetchErr) {
                return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500, headers: corsHeaders });
            }

            return new Response(JSON.stringify({ purchases: purchases || [] }), { headers: corsHeaders });
        }

        // RESEND TRIAL EMAIL (regenerate signed URLs + resend delivery email)
        if (action === "resend_trial_email") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const { generation_id } = params;
            if (!generation_id) {
                return new Response(JSON.stringify({ error: "generation_id is required" }), { status: 400, headers: corsHeaders });
            }

            // Fetch the trial generation record
            const { data: gen, error: genErr } = await supabaseAdmin
                .from("trial_generations")
                .select("*")
                .eq("id", generation_id)
                .single();

            if (genErr || !gen) {
                return new Response(JSON.stringify({ error: "Trial generation not found" }), { status: 404, headers: corsHeaders });
            }

            if (!gen.payer_email || !gen.payer_email.includes("@")) {
                return new Response(JSON.stringify({ error: "No valid email for this purchase. Update payer_email first." }), { status: 400, headers: corsHeaders });
            }

            // Regenerate 90-day signed URLs from hd_storage_paths
            const hdPaths: { path: string; variation: number; index: number }[] = gen.hd_storage_paths || [];
            const selectedIndex = gen.selected_image_index;

            const relevantPaths = gen.product_type === "single" && selectedIndex !== null && selectedIndex !== undefined
                ? hdPaths.filter((p: any) => p.index === selectedIndex)
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

            if (signedUrls.length === 0) {
                return new Response(JSON.stringify({ error: "No HD photos found for this generation. hd_storage_paths may be empty." }), { status: 400, headers: corsHeaders });
            }

            // Update purchased_photo_urls in DB
            await supabaseAdmin
                .from("trial_generations")
                .update({ purchased_photo_urls: purchasedPhotoUrls })
                .eq("id", generation_id);

            // Build and send delivery email via Resend
            if (!RESEND_API_KEY) {
                return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500, headers: corsHeaders });
            }

            const SITE_URL = "https://www.lumiphotoia.online";
            const photoLinksHtml = signedUrls.map((url: string, i: number) =>
                `<a href="${url}" style="display:inline-block;margin:6px 4px;padding:10px 20px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:13px;border-radius:8px;text-decoration:none;">📥 Baixar Foto ${i + 1}</a>`
            ).join("");

            const emailHtml = '<!DOCTYPE html><html><head><meta charset="utf-8"></head>'
                + '<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,\'Segoe UI\',Roboto,sans-serif;">'
                + '<div style="max-width:560px;margin:0 auto;padding:40px 20px;">'
                + '<h1 style="color:#f59e0b;font-size:24px;margin:0 0 4px 0;">LUMIPHOTO<span style="color:#fff;">IA</span></h1>'
                + '<p style="color:#666;font-size:13px;margin:0 0 32px 0;">Estúdio de Fotografia com IA</p>'
                + '<div style="background:#1a1a2e;border-radius:16px;padding:28px;border:1px solid rgba(245,158,11,0.2);">'
                + '<h2 style="color:#fff;font-size:20px;margin:0 0 8px 0;">🎉 Suas fotos profissionais estão prontas!</h2>'
                + '<p style="color:#a0a0a0;font-size:14px;margin:0 0 20px 0;">'
                + (gen.product_type === "single"
                    ? 'Sua foto em HD foi gerada e está disponível para download abaixo.'
                    : 'Suas 3 fotos em HD estão prontas!')
                + '</p>'
                + '<div style="text-align:center;margin:24px 0;">' + photoLinksHtml + '</div>'
                + '<p style="color:#666;font-size:11px;text-align:center;margin:16px 0 0 0;">Os links expiram em 90 dias. Baixe e salve suas fotos!</p>'
                + '</div>'
                + '<div style="text-align:center;margin-top:24px;">'
                + '<a href="' + SITE_URL + '/delivery" style="display:inline-block;padding:12px 32px;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:14px;border-radius:10px;text-decoration:none;">Gerar Mais Fotos →</a>'
                + '</div>'
                + '<p style="color:#444;font-size:11px;text-align:center;margin-top:24px;">© ' + new Date().getFullYear() + ' LumiPhotoIA. Dúvidas? Responda este email.</p>'
                + '</div></body></html>';

            try {
                const resendRes = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
                    body: JSON.stringify({
                        from: "LumiPhotoIA <team@lumiphotoia.online>",
                        to: [gen.payer_email],
                        subject: "📸 Suas fotos profissionais estão prontas para download!",
                        html: emailHtml,
                    }),
                });
                const resendBody = await resendRes.json().catch(() => ({}));
                if (!resendRes.ok) {
                    const errMsg = `Resend HTTP ${resendRes.status}: ${JSON.stringify(resendBody)}`;
                    await supabaseAdmin.from("trial_generations").update({
                        last_email_error: errMsg,
                    }).eq("id", generation_id);
                    return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers: corsHeaders });
                }

                // Success: update tracking
                const currentCount = gen.email_sent_count || 0;
                await supabaseAdmin.from("trial_generations").update({
                    email_sent_at: new Date().toISOString(),
                    email_sent_count: currentCount + 1,
                    last_email_error: null,
                }).eq("id", generation_id);

                return new Response(JSON.stringify({ success: true, email: gen.payer_email, photos: signedUrls.length }), { headers: corsHeaders });
            } catch (err: any) {
                const errMsg = String(err);
                await supabaseAdmin.from("trial_generations").update({
                    last_email_error: errMsg,
                }).eq("id", generation_id);
                return new Response(JSON.stringify({ error: errMsg }), { status: 500, headers: corsHeaders });
            }
        }

        // ==================== PIX RECOVERY ====================

        // LIST PENDING PIX (1h to 48h old)
        if (action === "list_pending_pix") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
            const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

            const { data: pendingPayments, error: fetchErr } = await supabaseAdmin
                .from("payments")
                .select("*")
                .eq("status", "pending")
                .lte("created_at", oneHourAgo)
                .gte("created_at", fortyEightHoursAgo)
                .order("created_at", { ascending: false });

            if (fetchErr) {
                return new Response(JSON.stringify({ error: fetchErr.message }), { status: 500, headers: corsHeaders });
            }

            // Enrich with whatsapp from metadata.external_reference
            const enriched = (pendingPayments || []).map((p: any) => {
                let whatsapp = "";
                let planLabel = p.plan_type || "—";
                try {
                    if (p.metadata?.external_reference) {
                        const ref = typeof p.metadata.external_reference === "string"
                            ? JSON.parse(p.metadata.external_reference)
                            : p.metadata.external_reference;
                        whatsapp = ref.whatsapp || "";
                        if (ref.plan) planLabel = ref.plan;
                    }
                } catch { /* ignore parse errors */ }

                const createdAt = new Date(p.created_at);
                const minutesAgo = Math.floor((Date.now() - createdAt.getTime()) / 60000);
                const hoursAgo = Math.floor(minutesAgo / 60);
                const timeLabel = hoursAgo > 0 ? `${hoursAgo}h ${minutesAgo % 60}min` : `${minutesAgo}min`;

                return {
                    id: p.id,
                    mercadopago_payment_id: p.mercadopago_payment_id,
                    payer_email: p.payer_email,
                    plan_type: planLabel,
                    amount: p.amount,
                    whatsapp,
                    created_at: p.created_at,
                    time_ago: timeLabel,
                    minutes_ago: minutesAgo,
                    recovery_email_sent_at: p.recovery_email_sent_at,
                    recovery_email_count: p.recovery_email_count || 0,
                };
            });

            const totalValue = enriched.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
            const withWhatsapp = enriched.filter((p: any) => p.whatsapp).length;
            const alreadySent = enriched.filter((p: any) => p.recovery_email_count > 0).length;

            return new Response(JSON.stringify({
                pending: enriched,
                summary: {
                    total: enriched.length,
                    totalValue,
                    withWhatsapp,
                    alreadySent,
                },
            }), { headers: corsHeaders });
        }

        // SEND PIX RECOVERY EMAIL(S)
        if (action === "send_pix_recovery") {
            const admin = await verifyAdmin(req);
            if (!admin) return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });

            if (!RESEND_API_KEY) {
                return new Response(JSON.stringify({ error: "RESEND_API_KEY not configured" }), { status: 500, headers: corsHeaders });
            }

            const { payment_ids, send_all } = params;

            // Determine which payments to send recovery to
            let targetPayments: any[] = [];

            if (send_all) {
                const oneHourAgo = new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString();
                const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

                const { data } = await supabaseAdmin
                    .from("payments")
                    .select("*")
                    .eq("status", "pending")
                    .lte("created_at", oneHourAgo)
                    .gte("created_at", fortyEightHoursAgo);
                targetPayments = data || [];
            } else if (payment_ids && payment_ids.length > 0) {
                const { data } = await supabaseAdmin
                    .from("payments")
                    .select("*")
                    .in("id", payment_ids)
                    .eq("status", "pending");
                targetPayments = data || [];
            } else {
                return new Response(JSON.stringify({ error: "Provide payment_ids or send_all" }), { status: 400, headers: corsHeaders });
            }

            // Filter out recently sent (anti-spam: 6h cooldown)
            const SIX_HOURS = 6 * 60 * 60 * 1000;
            const eligible = targetPayments.filter((p: any) => {
                if (!p.recovery_email_sent_at) return true;
                return (Date.now() - new Date(p.recovery_email_sent_at).getTime()) > SIX_HOURS;
            });

            if (eligible.length === 0) {
                return new Response(JSON.stringify({
                    success: true,
                    sent: 0,
                    skipped: targetPayments.length,
                    message: "Todos os lembretes já foram enviados recentemente (cooldown 6h)",
                }), { headers: corsHeaders });
            }

            const SITE_URL = "https://www.lumiphotoia.online";
            const PLAN_LABELS: Record<string, string> = {
                starter: "Starter (10 Fotos)", essencial: "Essencial (30 Fotos)",
                pro: "Pro (80 Fotos)", premium: "Premium (100 Fotos)",
            };

            let sent = 0;
            let failed = 0;
            const errors: string[] = [];

            for (const payment of eligible) {
                const email = payment.payer_email;
                if (!email || !email.includes("@")) { failed++; continue; }

                let planName = PLAN_LABELS[payment.plan_type] || payment.plan_type || "LumiPhotoIA";
                const amount = Number(payment.amount || 0);
                const amountStr = amount > 0 ? `R$${amount.toFixed(2).replace(".", ",")}` : "";

                const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:40px 20px;">
  <div style="text-align:center;margin-bottom:32px;">
    <h1 style="color:#f59e0b;font-size:28px;margin:0;letter-spacing:1px;">LUMIPHOTO<span style="color:#ffffff;">IA</span></h1>
    <p style="color:#666;font-size:14px;margin-top:8px;">Estúdio de Fotografia com IA</p>
  </div>

  <div style="background:linear-gradient(145deg,#1a1a2e,#16213e);border-radius:16px;padding:32px;border:1px solid rgba(245,158,11,0.2);">
    <h2 style="color:#ffffff;font-size:22px;margin:0 0 8px 0;">⏰ Seu pagamento está pendente!</h2>
    <p style="color:#a0a0a0;font-size:15px;margin:0 0 24px 0;">
      Notamos que você iniciou a compra do seu pacote de fotos profissionais com IA, mas o pagamento via PIX ainda não foi confirmado.
    </p>

    <div style="background:rgba(245,158,11,0.1);border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid rgba(245,158,11,0.15);">
      <p style="color:#f59e0b;font-size:13px;margin:0 0 4px 0;text-transform:uppercase;letter-spacing:1px;">Seu Pacote</p>
      <p style="color:#ffffff;font-size:20px;font-weight:bold;margin:0;">${planName}</p>
      ${amountStr ? `<p style="color:#a0a0a0;font-size:14px;margin:4px 0 0 0;">Valor: ${amountStr}</p>` : ""}
    </div>

    <div style="background:rgba(239,68,68,0.08);border-radius:12px;padding:16px;margin-bottom:24px;border:1px solid rgba(239,68,68,0.15);">
      <p style="color:#ef4444;font-size:14px;margin:0;font-weight:600;">⚠️ O código PIX tem prazo de validade! Finalize o pagamento para garantir seu acesso.</p>
    </div>

    <div style="text-align:center;margin-top:24px;">
      <a href="${SITE_URL}" style="display:inline-block;background:linear-gradient(135deg,#f59e0b,#d97706);color:#000;font-weight:bold;font-size:16px;padding:14px 40px;border-radius:12px;text-decoration:none;letter-spacing:0.5px;">Finalizar Pagamento →</a>
    </div>

    <p style="color:#666;font-size:12px;text-align:center;margin-top:20px;">Se você já fez o pagamento, desconsidere este email. Seu acesso será liberado automaticamente.</p>
  </div>

  <div style="text-align:center;margin-top:32px;">
    <p style="color:#555;font-size:12px;">© ${new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.</p>
    <p style="color:#444;font-size:11px;">Dúvidas? Responda este email.</p>
  </div>
</div>
</body></html>`;

                try {
                    const res = await fetch("https://api.resend.com/emails", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", Authorization: `Bearer ${RESEND_API_KEY}` },
                        body: JSON.stringify({
                            from: "LumiphotoIA <team@lumiphotoia.online>",
                            to: [email],
                            subject: "⏰ Seu PIX do LumiphotoIA está pendente — finalize agora!",
                            html,
                        }),
                    });

                    if (res.ok) {
                        sent++;
                        const currentCount = payment.recovery_email_count || 0;
                        await supabaseAdmin.from("payments").update({
                            recovery_email_sent_at: new Date().toISOString(),
                            recovery_email_count: currentCount + 1,
                        }).eq("id", payment.id);
                    } else {
                        failed++;
                        const errText = await res.text();
                        errors.push(`${email}: ${errText}`);
                    }
                } catch (e: any) {
                    failed++;
                    errors.push(`${email}: ${e.message}`);
                }
            }

            return new Response(JSON.stringify({
                success: true,
                sent,
                failed,
                skipped: targetPayments.length - eligible.length,
                errors: errors.slice(0, 5),
            }), { headers: corsHeaders });
        }

        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders });
    } catch (error: any) {
        console.error("Admin action error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
});
