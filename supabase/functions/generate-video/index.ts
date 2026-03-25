import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

const FAL_API_KEY = Deno.env.get("FAL_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const VIDEO_CREDIT_COST = 5;
const FAL_MODEL_ID = "fal-ai/kling-video/v2.5-turbo/pro/image-to-video";

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        // Authenticate user via JWT
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Não autorizado" }), {
                status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const supabaseClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
            global: { headers: { Authorization: authHeader } },
        });
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Usuário não encontrado" }), {
                status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const body = await req.json();
        const { action, image_url, request_id, status_url, response_url } = body;

        // === SUBMIT: Start video generation ===
        if (action === "submit") {
            if (!image_url) {
                return new Response(JSON.stringify({ error: "image_url é obrigatório" }), {
                    status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Check credits
            const currentCredits = (user.user_metadata?.credits as number) || 0;
            if (currentCredits < VIDEO_CREDIT_COST) {
                return new Response(JSON.stringify({
                    error: `Créditos insuficientes. Você precisa de ${VIDEO_CREDIT_COST} créditos para animar uma foto. Você tem ${currentCredits}.`,
                    credits_needed: VIDEO_CREDIT_COST,
                    current_credits: currentCredits,
                }), {
                    status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Deduct credits
            const newCredits = currentCredits - VIDEO_CREDIT_COST;
            await supabaseAdmin.auth.admin.updateUserById(user.id, {
                user_metadata: { ...user.user_metadata, credits: newCredits },
            });

            console.log(`🎬 Video submit for ${user.email}. Credits: ${currentCredits} → ${newCredits}`);

            // Submit to Fal.ai queue
            const falResponse = await fetch(`https://queue.fal.run/${FAL_MODEL_ID}`, {
                method: "POST",
                headers: {
                    "Authorization": `Key ${FAL_API_KEY}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image_url: image_url,
                    prompt: "Subtle natural movement, gentle breathing, slight head turn, natural eye blink, hair movement, cinematic smooth motion. Keep the person looking exactly the same.",
                    duration: "5",
                    aspect_ratio: "9:16",
                }),
            });

            if (!falResponse.ok) {
                // Refund credits on failure
                await supabaseAdmin.auth.admin.updateUserById(user.id, {
                    user_metadata: { ...user.user_metadata, credits: currentCredits },
                });
                const errText = await falResponse.text();
                console.error("❌ Fal.ai submit error:", errText);
                return new Response(JSON.stringify({ error: "Erro ao iniciar geração de vídeo", details: errText }), {
                    status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            const falResult = await falResponse.json();
            console.log("✅ Fal.ai submit OK:", JSON.stringify(falResult));

            // Return ALL URLs from fal.ai — frontend must store these for status/result checks
            return new Response(JSON.stringify({
                request_id: falResult.request_id,
                status_url: falResult.status_url,
                response_url: falResult.response_url,
                cancel_url: falResult.cancel_url,
                status: "IN_QUEUE",
                new_credits: newCredits,
            }), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // === STATUS: Check video generation progress ===
        if (action === "status") {
            if (!request_id) {
                return new Response(JSON.stringify({ error: "request_id é obrigatório" }), {
                    status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Use the status_url from the submit response if provided, otherwise construct it
            const targetUrl = status_url || `https://queue.fal.run/${FAL_MODEL_ID}/requests/${request_id}/status`;
            console.log("📊 Status check:", targetUrl);

            const statusResponse = await fetch(targetUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Key ${FAL_API_KEY}`,
                },
            });

            if (!statusResponse.ok) {
                const errText = await statusResponse.text();
                console.error(`❌ Status ${statusResponse.status}:`, errText);

                // If the status URL fails, try /response directly — if the video is done, we get the result
                const resultUrl = response_url || `https://queue.fal.run/${FAL_MODEL_ID}/requests/${request_id}/response`;
                console.log("🔄 Trying response URL:", resultUrl);
                
                const directResponse = await fetch(resultUrl, {
                    method: "GET",
                    headers: {
                        "Authorization": `Key ${FAL_API_KEY}`,
                    },
                });

                if (directResponse.ok) {
                    const resultData = await directResponse.json();
                    console.log("✅ Got result directly:", JSON.stringify(resultData).substring(0, 200));
                    return new Response(JSON.stringify({ status: "COMPLETED", ...resultData }), {
                        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }

                // If it's a 422 or specific error, the request is still processing
                const directStatus = directResponse.status;
                console.log(`Response URL returned ${directStatus}`);
                
                if (directStatus === 422 || directStatus === 400) {
                    // Video is still being processed
                    return new Response(JSON.stringify({ status: "IN_PROGRESS" }), {
                        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
                    });
                }

                return new Response(JSON.stringify({ 
                    error: "Erro ao verificar status", 
                    details: errText,
                    fal_status: statusResponse.status 
                }), {
                    status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            const statusResult = await statusResponse.json();
            console.log("📊 Status:", JSON.stringify(statusResult).substring(0, 200));
            return new Response(JSON.stringify(statusResult), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // === RESULT: Get the final video ===
        if (action === "result") {
            if (!request_id) {
                return new Response(JSON.stringify({ error: "request_id é obrigatório" }), {
                    status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Use the response_url from the submit response if provided
            const targetUrl = response_url || `https://queue.fal.run/${FAL_MODEL_ID}/requests/${request_id}/response`;
            console.log("🎬 Getting result:", targetUrl);

            const resultResponse = await fetch(targetUrl, {
                method: "GET",
                headers: {
                    "Authorization": `Key ${FAL_API_KEY}`,
                },
            });

            if (!resultResponse.ok) {
                const errText = await resultResponse.text();
                console.error(`❌ Result ${resultResponse.status}:`, errText);
                return new Response(JSON.stringify({ error: "Erro ao obter vídeo", details: errText }), {
                    status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            const resultData = await resultResponse.json();
            console.log("🎬 Video result keys:", Object.keys(resultData));

            return new Response(JSON.stringify(resultData), {
                status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify({ error: "Ação inválida. Use: submit, status, result" }), {
            status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (error) {
        console.error("💥 Error:", error);
        return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
