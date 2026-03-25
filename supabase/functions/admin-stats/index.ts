import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ADMIN_EMAIL = "talitafpublicitaria@gmail.com";

// Emails to exclude from all metrics (creators/testers)
const EXCLUDED_EMAILS = [
    "talitafpublicitaria@gmail.com",
    "cauahsribeiro@gmail.com",
];

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

Deno.serve(async (req: Request) => {
    // CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
            },
        });
    }

    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    };

    try {
        // Verify admin access via JWT
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: corsHeaders });
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user || user.email !== ADMIN_EMAIL) {
            return new Response(JSON.stringify({ error: "Forbidden" }), { status: 403, headers: corsHeaders });
        }

        // ========== GATHER ALL STATS ==========

        // 1. PAYMENTS DATA
        const { data: payments } = await supabaseAdmin
            .from("payments")
            .select("*")
            .order("created_at", { ascending: false });

        const approvedPayments = (payments || []).filter((p: any) =>
            p.status === "approved" &&
            !EXCLUDED_EMAILS.includes(p.payer_email?.toLowerCase())
        );
        const totalRevenue = approvedPayments.reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);
        const totalSales = approvedPayments.length;
        const avgTicket = totalSales > 0 ? totalRevenue / totalSales : 0;

        // Sales by plan
        const salesByPlan: Record<string, { count: number; revenue: number }> = {};
        approvedPayments.forEach((p: any) => {
            const plan = p.plan_type || "unknown";
            if (!salesByPlan[plan]) salesByPlan[plan] = { count: 0, revenue: 0 };
            salesByPlan[plan].count++;
            salesByPlan[plan].revenue += Number(p.amount || 0);
        });

        // Sales over time (last 30 days)
        const salesByDay: Record<string, { count: number; revenue: number }> = {};
        const now = new Date();
        for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(d.getDate() - i);
            const key = d.toISOString().split("T")[0];
            salesByDay[key] = { count: 0, revenue: 0 };
        }
        approvedPayments.forEach((p: any) => {
            const day = (p.created_at || "").split("T")[0];
            if (salesByDay[day]) {
                salesByDay[day].count++;
                salesByDay[day].revenue += Number(p.amount || 0);
            }
        });

        // Recent sales (last 20)
        const recentSales = approvedPayments.slice(0, 20).map((p: any) => ({
            id: p.id,
            email: p.payer_email,
            plan: p.plan_type,
            amount: p.amount,
            date: p.created_at,
            source_page: p.source_page || null,
            utm_source: p.utm_source || null,
        }));

        // 5. SALES BY SOURCE PAGE
        const salesBySourcePage: Record<string, { count: number; revenue: number }> = {};
        approvedPayments.forEach((p: any) => {
            const page = p.source_page || "direto";
            if (!salesBySourcePage[page]) salesBySourcePage[page] = { count: 0, revenue: 0 };
            salesBySourcePage[page].count++;
            salesBySourcePage[page].revenue += Number(p.amount || 0);
        });

        // 6. SALES BY UTM SOURCE
        const salesByUtmSource: Record<string, { count: number; revenue: number }> = {};
        approvedPayments.forEach((p: any) => {
            const source = p.utm_source || "direto";
            if (!salesByUtmSource[source]) salesByUtmSource[source] = { count: 0, revenue: 0 };
            salesByUtmSource[source].count++;
            salesByUtmSource[source].revenue += Number(p.amount || 0);
        });

        // 2. USERS DATA
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const allUsers = (usersData?.users || []).filter((u: any) =>
            !EXCLUDED_EMAILS.includes(u.email?.toLowerCase())
        );
        const totalUsers = allUsers.length;

        // Users with credits
        const usersWithCredits = allUsers.filter((u: any) => (u.user_metadata?.credits || 0) > 0).length;
        const totalCreditsInSystem = allUsers.reduce((sum: number, u: any) => sum + (u.user_metadata?.credits || 0), 0);

        // New users last 7 days
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        const newUsersLastWeek = allUsers.filter((u: any) => new Date(u.created_at) > weekAgo).length;

        // Repeat buyers (users with >1 approved payment)
        const buyerCounts: Record<string, number> = {};
        approvedPayments.forEach((p: any) => {
            const email = p.payer_email || "";
            buyerCounts[email] = (buyerCounts[email] || 0) + 1;
        });
        const repeatBuyers = Object.values(buyerCounts).filter((c: number) => c > 1).length;
        const uniqueBuyers = Object.keys(buyerCounts).length;

        // 3. GENERATION LOGS (if table exists)
        let generationStats = {
            totalGenerations: 0,
            totalPhotos: 0,
            styleRanking: [] as { style: string; count: number }[],
            deviceSplit: { mobile: 0, desktop: 0 },
            generationsByDay: {} as Record<string, number>,
            hasCustomInstructions: 0,
        };

        try {
            const { data: rawGenLogs } = await supabaseAdmin
                .from("generation_logs")
                .select("*")
                .order("created_at", { ascending: false });

            // Filter out creator emails from generation logs
            const genLogs = (rawGenLogs || []).filter((g: any) =>
                !EXCLUDED_EMAILS.includes(g.user_email?.toLowerCase())
            );

            if (genLogs && genLogs.length > 0) {
                generationStats.totalGenerations = genLogs.length;
                generationStats.totalPhotos = genLogs.reduce((s: number, g: any) => s + (g.design_count || 1), 0);

                // Style ranking
                const styleCounts: Record<string, number> = {};
                genLogs.forEach((g: any) => {
                    const style = g.studio_style || "Sem estilo";
                    styleCounts[style] = (styleCounts[style] || 0) + 1;
                });
                generationStats.styleRanking = Object.entries(styleCounts)
                    .map(([style, count]) => ({ style, count }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10);

                // Device split
                genLogs.forEach((g: any) => {
                    if (g.device_type === "mobile") generationStats.deviceSplit.mobile++;
                    else generationStats.deviceSplit.desktop++;
                });

                // Generations by day (last 30 days)
                for (let i = 29; i >= 0; i--) {
                    const d = new Date(now);
                    d.setDate(d.getDate() - i);
                    const key = d.toISOString().split("T")[0];
                    generationStats.generationsByDay[key] = 0;
                }
                genLogs.forEach((g: any) => {
                    const day = (g.created_at || "").split("T")[0];
                    if (generationStats.generationsByDay[day] !== undefined) {
                        generationStats.generationsByDay[day]++;
                    }
                });

                // Custom instructions usage
                generationStats.hasCustomInstructions = genLogs.filter((g: any) => g.has_custom_instructions).length;
            }
        } catch {
            // Table may not exist yet
            console.log("generation_logs table not available yet");
        }

        // 4. TRIAL RAW DATA (frontend will filter/aggregate)
        let trialRawData: any[] = [];

        try {
            const { data: trialRows } = await supabaseAdmin
                .from("trial_generations")
                .select("id, ip_hash, session_id, status, delivery_style, created_at")
                .order("created_at", { ascending: false });

            trialRawData = (trialRows || []).map((t: any) => ({
                id: t.id,
                ip_hash: t.ip_hash ? t.ip_hash.substring(0, 10) + "..." : "—",
                session_id: t.session_id,
                status: t.status,
                delivery_style: t.delivery_style || "delivery",
                created_at: t.created_at,
            }));
        } catch {
            console.log("trial_generations table not available yet");
        }

        // 5. STRATEGIC METRICS
        const conversionRate = totalUsers > 0 ? (uniqueBuyers / totalUsers * 100) : 0;
        const repeatRate = uniqueBuyers > 0 ? (repeatBuyers / uniqueBuyers * 100) : 0;
        const creditsUtilization = totalCreditsInSystem; // remaining credits

        const response = {
            overview: {
                totalRevenue,
                totalSales,
                avgTicket: Math.round(avgTicket * 100) / 100,
                totalUsers,
                newUsersLastWeek,
                usersWithCredits,
                totalCreditsInSystem,
                conversionRate: Math.round(conversionRate * 10) / 10,
                repeatRate: Math.round(repeatRate * 10) / 10,
                repeatBuyers,
                uniqueBuyers,
            },
            salesByPlan,
            salesByDay,
            recentSales,
            generationStats,
            salesBySourcePage,
            salesByUtmSource,
            trialRawData,
        };

        return new Response(JSON.stringify(response), { status: 200, headers: corsHeaders });
    } catch (error: any) {
        console.error("Admin stats error:", error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: corsHeaders });
    }
});
