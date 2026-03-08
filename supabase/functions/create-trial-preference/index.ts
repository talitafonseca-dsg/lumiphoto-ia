import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SITE_URL = "https://www.lumiphotoia.online";

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

// Hash session_id consistently (must match generate-trial logic)
async function hashString(str: string): Promise<string> {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 32);
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });

    try {
        const { generation_id, session_id, product_type, payer_email, selected_image_index } = await req.json();

        // ── Validate inputs ────────────────────────────────────────────────────
        if (!generation_id || !session_id || !product_type || !payer_email) {
            return new Response(JSON.stringify({ error: "Campos obrigatórios ausentes" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (!["single", "pack"].includes(product_type)) {
            return new Response(JSON.stringify({ error: "product_type inválido" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (!payer_email.includes("@")) {
            return new Response(JSON.stringify({ error: "Email inválido" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (product_type === "single" && (selected_image_index === undefined || selected_image_index === null)) {
            return new Response(JSON.stringify({ error: "selected_image_index obrigatório para compra individual" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (!MP_ACCESS_TOKEN) {
            return new Response(JSON.stringify({ error: "Pagamento não configurado" }), {
                status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // ── Verify the trial generation exists and belongs to this session ─────
        const sessionHash = await hashString(session_id);
        const { data: trial, error: findError } = await supabaseAdmin
            .from("trial_generations")
            .select("id, status, expires_at, session_id")
            .eq("id", generation_id)
            .eq("session_id", sessionHash)
            .single();

        if (findError || !trial) {
            return new Response(JSON.stringify({ error: "Geração não encontrada ou inválida" }), {
                status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (trial.status !== "preview") {
            return new Response(JSON.stringify({ error: "Esta geração já foi paga ou expirou" }), {
                status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (new Date(trial.expires_at) < new Date()) {
            await supabaseAdmin.from("trial_generations").update({ status: "expired" }).eq("id", generation_id);
            return new Response(JSON.stringify({ error: "Preview expirado. Gere novamente." }), {
                status: 410, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // ── Build Mercado Pago preference ──────────────────────────────────────
        const products = {
            single: { title: "1 Foto Profissional HD — LumiPhotoIA", price: 5, credits: 0 },
            pack: { title: "Pack 10 Fotos HD — LumiPhotoIA", price: 37, credits: 7 },
        };
        const product = products[product_type as keyof typeof products];

        const externalRef = JSON.stringify({
            type: "trial",
            generation_id,
            session_id: sessionHash,
            product_type,
            email: payer_email,
            selected_image_index: product_type === "single" ? selected_image_index : null,
        });

        const preferenceData = {
            items: [{
                id: `trial_${product_type}`,
                title: product.title,
                description: product_type === "single"
                    ? "1 foto profissional em HD gerada pela IA, sem marca d'água"
                    : "3 fotos HD liberadas + 7 créditos para gerar mais fotos profissionais",
                quantity: 1,
                currency_id: "BRL",
                unit_price: product.price,
            }],
            payer: { email: payer_email },
            back_urls: {
                success: `${SITE_URL}/checkout/trial-success?gen=${generation_id}`,
                failure: `${SITE_URL}/checkout/failure`,
                pending: `${SITE_URL}/checkout/pending`,
            },
            auto_return: "approved",
            notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
            external_reference: externalRef,
            statement_descriptor: "LUMIPHOTO IA",
            expires: true,
            expiration_date_to: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
        };

        const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${MP_ACCESS_TOKEN}` },
            body: JSON.stringify(preferenceData),
        });

        if (!mpResponse.ok) {
            const err = await mpResponse.text();
            console.error("MP error:", err);
            return new Response(JSON.stringify({ error: `Erro no pagamento (${mpResponse.status})` }), {
                status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const preference = await mpResponse.json();

        // ── Save preference_id to trial record ─────────────────────────────────
        await supabaseAdmin
            .from("trial_generations")
            .update({
                mp_preference_id: preference.id,
                payer_email,
                product_type,
                selected_image_index: product_type === "single" ? selected_image_index : null,
            })
            .eq("id", generation_id);

        return new Response(JSON.stringify({
            preference_id: preference.id,
            init_point: preference.init_point,
            sandbox_init_point: preference.sandbox_init_point,
            amount: product.price,
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (error: any) {
        console.error("create-trial-preference error:", error);
        return new Response(JSON.stringify({ error: error.message || "Erro interno" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
