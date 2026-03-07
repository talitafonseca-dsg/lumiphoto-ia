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

        return new Response(JSON.stringify({ error: "Unknown action" }), { status: 400, headers: corsHeaders });
    } catch (error: any) {
        console.error("Admin action error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
});
