import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const MP_ACCESS_TOKEN = Deno.env.get("MP_ACCESS_TOKEN");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface PlanInfo {
    id: string;
    title: string;
    price: number;
    duration: string;
}

const PLANS: Record<string, PlanInfo> = {
    starter: {
        id: "starter",
        title: "Pacote Starter - 10 Fotos",
        price: 37,
        duration: "Pacote de 10 Fotos",
    },
    essencial: {
        id: "essencial",
        title: "Pacote Essencial - 30 Fotos",
        price: 57,
        duration: "Pacote de 30 Fotos",
    },
    pro: {
        id: "pro",
        title: "Pacote Pro - 80 Fotos",
        price: 97,
        duration: "Pacote de 80 Fotos",
    },
    premium: {
        id: "premium",
        title: "Pacote Premium - 100 Fotos",
        price: 117,
        duration: "Pacote de 100 Fotos",
    },
};

Deno.serve(async (req: Request) => {
    // Handle CORS preflight
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    if (req.method !== "POST") {
        return new Response(JSON.stringify({ error: "Method not allowed" }), {
            status: 405,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }

    try {
        const { plan, payer_email, referral_code } = await req.json();

        if (!plan || !PLANS[plan]) {
            return new Response(
                JSON.stringify({ error: "Plano inválido. Use 'starter', 'essencial', 'pro' ou 'premium'" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (!payer_email) {
            return new Response(
                JSON.stringify({ error: "Email do comprador é obrigatório" }),
                { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        if (!MP_ACCESS_TOKEN) {
            console.error("MP_ACCESS_TOKEN not configured!");
            return new Response(
                JSON.stringify({ error: "Token do Mercado Pago não configurado. Configure o MP_ACCESS_TOKEN nos Secrets." }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const selectedPlan = PLANS[plan];

        const SITE_URL = "https://www.lumiphotoia.online";

        // Build external_reference with optional referral_code
        const externalRef: Record<string, string> = { plan: plan, email: payer_email };
        if (referral_code) {
            externalRef.referral_code = referral_code;
        }

        const preferenceData = {
            items: [
                {
                    id: selectedPlan.id,
                    title: selectedPlan.title,
                    description: `Acesso completo à plataforma por ${selectedPlan.duration}`,
                    quantity: 1,
                    currency_id: "BRL",
                    unit_price: selectedPlan.price,
                },
            ],
            payer: {
                email: payer_email,
            },
            back_urls: {
                success: `${SITE_URL}/checkout/success`,
                failure: `${SITE_URL}/checkout/failure`,
                pending: `${SITE_URL}/checkout/pending`,
            },
            auto_return: "approved",
            notification_url: `${SUPABASE_URL}/functions/v1/mercadopago-webhook`,
            external_reference: JSON.stringify(externalRef),
            statement_descriptor: "LUMIPHOTO IA",
        };

        const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${MP_ACCESS_TOKEN}`,
            },
            body: JSON.stringify(preferenceData),
        });

        if (!mpResponse.ok) {
            const errorData = await mpResponse.text();
            console.error("Mercado Pago error status:", mpResponse.status);
            console.error("Mercado Pago error body:", errorData);
            console.error("Token used (first 20 chars):", MP_ACCESS_TOKEN?.substring(0, 20));
            return new Response(
                JSON.stringify({ error: `Erro do Mercado Pago (${mpResponse.status}): ${errorData.substring(0, 200)}` }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        const preference = await mpResponse.json();

        return new Response(
            JSON.stringify({
                preference_id: preference.id,
                init_point: preference.init_point,
                sandbox_init_point: preference.sandbox_init_point,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    } catch (error) {
        console.error("Error:", error);
        return new Response(
            JSON.stringify({ error: "Erro interno do servidor" }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
    }
});
