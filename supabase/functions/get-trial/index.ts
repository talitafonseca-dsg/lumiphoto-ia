import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
};

async function hashString(str: string): Promise<string> {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 32);
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

    try {
        const url = new URL(req.url);
        const session_id = url.searchParams.get("session_id") || req.headers.get("x-session-id");
        const generation_id = url.searchParams.get("generation_id");

        if (!session_id) {
            return new Response(JSON.stringify({ error: "session_id obrigatório" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const sessionHash = await hashString(session_id);

        // Build query
        let query = supabaseAdmin
            .from("trial_generations")
            .select("id, status, expires_at, preview_images, hd_storage_paths, delivery_style, aspect_ratio, product_type, selected_image_index, payer_email")
            .eq("session_id", sessionHash)
            .in("status", ["preview", "paid_single", "paid_pack"])
            .order("created_at", { ascending: false })
            .limit(1);

        if (generation_id) {
            query = supabaseAdmin
                .from("trial_generations")
                .select("id, status, expires_at, preview_images, hd_storage_paths, delivery_style, aspect_ratio, product_type, selected_image_index, payer_email")
                .eq("id", generation_id)
                .eq("session_id", sessionHash)
                .single() as any;
        }

        const { data: trial, error } = await (generation_id ? query : query.maybeSingle());

        if (error || !trial) {
            return new Response(JSON.stringify({ error: "Geração não encontrada" }), {
                status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Check expiry
        if (new Date(trial.expires_at) < new Date() && trial.status === "preview") {
            await supabaseAdmin.from("trial_generations").update({ status: "expired" }).eq("id", trial.id);
            return new Response(JSON.stringify({ error: "Preview expirado. Gere novamente." }), {
                status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // If paid, generate signed URLs for HD images
        let hdSignedUrls: { url: string; variation: number; index: number }[] = [];
        if (trial.status === "paid_single" || trial.status === "paid_pack") {
            const paths: { path: string; variation: number; index: number }[] = trial.hd_storage_paths || [];

            // For single purchase, only return the selected image
            const relevantPaths = trial.status === "paid_single" && trial.selected_image_index !== null
                ? paths.filter(p => p.index === trial.selected_image_index)
                : paths;

            const signedUrlResults = await Promise.all(
                relevantPaths.map(async ({ path, variation, index }) => {
                    const { data: signedData, error: signErr } = await supabaseAdmin.storage
                        .from("trial-generations")
                        .createSignedUrl(path, 3600); // 1 hour expiry
                    if (signErr || !signedData?.signedUrl) return null;
                    return { url: signedData.signedUrl, variation, index };
                })
            );

            hdSignedUrls = signedUrlResults.filter(Boolean) as typeof hdSignedUrls;
        }

        return new Response(JSON.stringify({
            generation_id: trial.id,
            status: trial.status,
            expires_at: trial.expires_at,
            product_type: trial.product_type,
            // Preview info (for display with CSS watermark)
            preview_count: (trial.preview_images as any[])?.length || 0,
            // HD URLs only if paid
            hd_images: hdSignedUrls.length > 0 ? hdSignedUrls : undefined,
            is_paid: trial.status !== "preview",
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (error: any) {
        console.error("get-trial error:", error);
        return new Response(JSON.stringify({ error: error.message || "Erro interno" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
