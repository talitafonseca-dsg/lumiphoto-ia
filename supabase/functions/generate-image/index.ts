import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenAI } from "npm:@google/genai";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Collect all available Gemini keys from environment
const GEMINI_KEYS: string[] = [];
for (let i = 1; i <= 10; i++) {
    const key = Deno.env.get(`GEMINI_KEY_${i}`);
    if (key) GEMINI_KEYS.push(key);
}
// Fallback to single key if numbered keys not set
if (GEMINI_KEYS.length === 0) {
    const singleKey = Deno.env.get("GEMINI_API_KEY");
    if (singleKey) GEMINI_KEYS.push(singleKey);
}
console.log(`🔑 Loaded ${GEMINI_KEYS.length} Gemini API keys`);

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

// Random start for key rotation — each edge function instance starts at a random key
// This prevents all concurrent requests from hitting the same key
let keyIndex = Math.floor(Math.random() * 1000);

function getNextKey(): string {
    if (GEMINI_KEYS.length === 0) throw new Error("No Gemini API keys configured");
    const key = GEMINI_KEYS[keyIndex % GEMINI_KEYS.length];
    keyIndex++;
    return key;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req: Request) => {
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
        // 1. Verify user is authenticated
        const authHeader = req.headers.get("Authorization");
        if (!authHeader) {
            return new Response(JSON.stringify({ error: "Não autorizado" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const token = authHeader.replace("Bearer ", "");
        const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: "Token inválido" }), {
                status: 401,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Credits already verified by deduct-credits edge function (called before this)
        // Removing duplicate getUserById check to save ~2s

        // 3. Parse request
        const { parts, aspectRatio } = await req.json();

        if (!parts || !Array.isArray(parts)) {
            return new Response(JSON.stringify({ error: "Dados inválidos" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // Fix aspect ratio mapping
        let finalAspectRatio = aspectRatio || "1:1";
        if (finalAspectRatio === "4:5") finalAspectRatio = "3:4";

        // 3. Try Gemini with key rotation (retry on 429) — try ALL available keys with backoff
        const maxRetries = Math.max(GEMINI_KEYS.length, 3);
        let lastError: any = null;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            const apiKey = getNextKey();

            try {
                const ai = new GoogleGenAI({ apiKey });

                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash-image",
                    contents: { parts },
                    config: {
                        responseModalities: ["image", "text"],
                        imageConfig: { aspectRatio: finalAspectRatio },
                        personGeneration: "allow_all",
                    } as any,
                });

                if (!response.candidates || response.candidates.length === 0) {
                    throw new Error("Nenhuma imagem gerada. Tente novamente com outra foto ou descrição.");
                }

                const candidate = response.candidates[0];
                
                // Safety check: Gemini may return candidates with undefined content
                // when the response is blocked by content/safety filters
                if (!candidate.content || !candidate.content.parts) {
                    const finishReason = (candidate as any).finishReason || 'unknown';
                    console.error(`⚠️ Gemini returned empty content. finishReason: ${finishReason}`);
                    throw new Error(
                        finishReason === 'SAFETY' || finishReason === 'BLOCKED'
                            ? "A IA bloqueou esta geração por política de segurança. Tente com outra foto ou estilo."
                            : "O modelo não conseguiu gerar a imagem. Tente novamente com outra foto."
                    );
                }

                const imagePart = candidate.content.parts.find(
                    (p: any) => p.inlineData
                );

                if (!imagePart || !imagePart.inlineData) {
                    throw new Error("O modelo não gerou a imagem esperada. Tente novamente.");
                }

                // Success! Return the image
                return new Response(
                    JSON.stringify({
                        imageBase64: imagePart.inlineData.data,
                        mimeType: imagePart.inlineData.mimeType || "image/png",
                    }),
                    {
                        status: 200,
                        headers: { ...corsHeaders, "Content-Type": "application/json" },
                    }
                );
            } catch (err: any) {
                lastError = err;
                const is429 = err.message?.includes("429") || err.message?.toLowerCase().includes("quota") || err.message?.toLowerCase().includes("resource_exhausted");

                if (is429 && attempt < maxRetries - 1) {
                    const waitMs = Math.min(2000 * Math.pow(2, attempt), 10000); // 2s, 4s, 8s, max 10s
                    console.log(`⚠️ Key ${(attempt % GEMINI_KEYS.length) + 1} hit rate limit, waiting ${waitMs}ms before trying next key...`);
                    await new Promise(r => setTimeout(r, waitMs));
                    continue; // Try next key
                }

                // Non-429 error or last attempt — break
                break;
            }
        }

        // All keys exhausted or non-retryable error
        const errorMsg = lastError?.message || "Erro desconhecido";
        const is429 = errorMsg.includes("429") || errorMsg.toLowerCase().includes("quota");

        return new Response(
            JSON.stringify({
                error: is429
                    ? "Servidor temporariamente ocupado. Por favor aguarde 30 segundos e tente novamente."
                    : errorMsg,
            }),
            {
                status: is429 ? 429 : 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error("Generate image error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Erro interno" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
