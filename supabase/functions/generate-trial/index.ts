import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { GoogleGenAI } from "npm:@google/genai";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Collect Gemini keys with rotation
const GEMINI_KEYS: string[] = [];
for (let i = 1; i <= 10; i++) {
    const key = Deno.env.get(`GEMINI_KEY_${i}`);
    if (key) GEMINI_KEYS.push(key);
}
if (GEMINI_KEYS.length === 0) {
    const singleKey = Deno.env.get("GEMINI_API_KEY");
    if (singleKey) GEMINI_KEYS.push(singleKey);
}

const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
});

let keyIndex = 0;
function getNextKey(): string {
    if (GEMINI_KEYS.length === 0) throw new Error("No Gemini API keys configured");
    const key = GEMINI_KEYS[keyIndex % GEMINI_KEYS.length];
    keyIndex++;
    return key;
}

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-session-id",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
};

// Hash IP/session for rate limiting (simple, fast)
async function hashString(str: string): Promise<string> {
    const data = new TextEncoder().encode(str);
    const hash = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 32);
}

// Generate a single image via Gemini with retry
async function generateSingleImage(parts: any[], aspectRatio: string): Promise<{ data: string; mimeType: string }> {
    let finalAspectRatio = aspectRatio || "1:1";
    if (finalAspectRatio === "4:5") finalAspectRatio = "3:4";

    const maxRetries = Math.min(GEMINI_KEYS.length, 3);
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
                throw new Error("429 RESOURCE_EXHAUSTED");
            }

            const imagePart = response.candidates[0].content.parts.find((p: any) => p.inlineData);
            if (!imagePart?.inlineData) throw new Error("No image in response");

            return { data: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType || "image/png" };
        } catch (err: any) {
            lastError = err;
            const is429 = err.message?.includes("429") || err.message?.toLowerCase().includes("quota");
            if (is429 && attempt < maxRetries - 1) continue;
            break;
        }
    }
    throw lastError;
}

// Upload HD image to Supabase Storage
async function uploadHdImage(
    generationId: string,
    index: number,
    base64Data: string,
    mimeType: string
): Promise<string> {
    const ext = mimeType.split("/")[1] || "png";
    const path = `${generationId}/hd_${index}.${ext}`;
    const bytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    const { error } = await supabaseAdmin.storage
        .from("trial-generations")
        .upload(path, bytes, {
            contentType: mimeType,
            upsert: true,
        });

    if (error) throw new Error(`Storage upload failed: ${error.message}`);
    return path;
}

// Create watermarked preview (reduced quality via JPEG re-encode or just flag for frontend CSS)
// We return the full base64 but mark it as "preview" — frontend applies CSS watermark overlay.
// HD versions are ONLY accessible via signed URL after payment.
// This is secure because HD paths are private in Supabase Storage.
function buildPreviewDataUrl(base64Data: string, mimeType: string): string {
    return `data:${mimeType};base64,${base64Data}`;
}

Deno.serve(async (req: Request) => {
    if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (req.method !== "POST") return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: corsHeaders });

    try {
        const body = await req.json();
        const { session_id, parts, aspectRatio, delivery_style } = body;

        // ── SECURITY: Validate session_id ──────────────────────────────────────
        if (!session_id || typeof session_id !== "string" || session_id.length > 100) {
            return new Response(JSON.stringify({ error: "session_id inválido" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        if (!parts || !Array.isArray(parts) || parts.length === 0) {
            return new Response(JSON.stringify({ error: "Dados de geração inválidos" }), {
                status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        // ── SECURITY: Get IP for rate limiting ─────────────────────────────────
        const ipRaw = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
            req.headers.get("x-real-ip") || "unknown";
        const ipHash = await hashString(ipRaw);
        const sessionHash = await hashString(session_id);

        // ── ADMIN BYPASS: Check JWT for admin email ─────────────────────────────
        const ADMIN_EMAILS = ["talitafpublicitaria@gmail.com"];
        let isAdmin = false;
        try {
            const authHeader = req.headers.get("Authorization");
            if (authHeader?.startsWith("Bearer ")) {
                const token = authHeader.slice(7);
                const payload = JSON.parse(atob(token.split(".")[1]));
                const email = payload?.email || payload?.sub;
                if (email && ADMIN_EMAILS.includes(email)) {
                    isAdmin = true;
                    console.log(`Admin bypass granted for: ${email}`);
                }
            }
        } catch (_) { /* ignore JWT parse errors */ }

        if (!isAdmin) {
            // ── SECURITY: Rate limit by session_id (1 trial per session) ───────────
            const { data: existingBySession } = await supabaseAdmin
                .from("trial_generations")
                .select("id, status, expires_at")
                .eq("session_id", sessionHash)
                .in("status", ["preview", "paid_single", "paid_pack"])
                .order("created_at", { ascending: false })
                .limit(1)
                .maybeSingle();

            if (existingBySession) {
                const expiresAt = new Date(existingBySession.expires_at);
                if (expiresAt > new Date()) {
                    return new Response(JSON.stringify({
                        error: "Você já gerou seu preview gratuito. Pague para liberar ou aguarde a expiração.",
                        existing_generation_id: existingBySession.id,
                        rate_limited: true,
                    }), { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } });
                }
            }

            // ── SECURITY: Rate limit by IP (max 3 per IP per 24h) ──────────────────
            const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const { count: ipCount } = await supabaseAdmin
                .from("trial_generations")
                .select("id", { count: "exact" })
                .eq("ip_hash", ipHash)
                .gte("created_at", yesterday);

            if ((ipCount || 0) >= 3) {
                return new Response(JSON.stringify({
                    error: "Limite de trials por IP atingido. Tente novamente amanhã.",
                    rate_limited: true,
                }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
            }
        }


        // ── Generate 3 images in parallel — each with a DIFFERENT high-impact style ──
        const generationId = crypto.randomUUID();

        // Determine trial type
        const isStudioTrial = delivery_style === 'studio';
        const isAniversarioTrial = delivery_style === 'aniversario';

        // ── STUDIO PORTRAIT PROMPTS: Executivo Pro, Família Studio Clean, Aniversário Balão Dourado ──
        const STUDIO_STYLE_PROMPTS = [
            // Style 1: Executivo Pro — authoritative professional portrait
            `Professional executive portrait photography. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Clean, elegant light grey or off-white studio background. Upscale corporate executive portrait.
FRAMING: American-plan (plano americano) shot — from waist/hips up. Subject centered, slightly turned 3/4 to camera.
LIGHTING: Soft Rembrandt or flat professional studio lighting. Diffused key light from slightly above, subtle fill reflector.
ATTIRE: Professional business attire — dark navy or charcoal blazer/suit for men, elegant blazer for women. Crisp white shirt/blouse.
EXPRESSION: Confident, composed, approachable. Eyes engaging the camera.
STYLE: LinkedIn profile / personal branding portrait. Polished, authoritative, professional.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face, skin tone, or features. Only change clothing, background, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. High-end studio photography quality.`,

            // Style 2: Família Studio Clean — warm family portrait
            `Clean family studio portrait photography. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Clean white or soft pastel background (cream, light grey, or warm white). Classic family portrait studio setting.
FRAMING: American-plan (plano americano) shot — from waist up. Warm and inviting composition.
LIGHTING: Soft, even studio lighting — large octabox or softbox creating flattering, shadow-free illumination. Warm color temperature.
ATTIRE: Smart casual elegant — for men: well-fitted white or light blue shirt; for women: elegant blouse or soft-colored dress.
EXPRESSION: Warm, genuine, joyful smile. Eyes bright, welcoming.
STYLE: Family studio portrait — clean, professional, heartwarming. Suitable for framing in homes or family events.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face, skin tone, or features. Only change clothing, background, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. Classic studio photography.`,

            // Style 3: Inspiracional Bokeh Dourado — empowering, elegant, aspirational
            `Inspirational portrait photography. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Warm, elegant bokeh background — creamy golden/champagne soft light circles in the background (similar to fairy lights or window light). Neutral warm beige/taupe wall. Luxury feel.
FRAMING: American-plan (plano americano) shot — from chest/waist up. Relaxed confident pose with one hand gently resting near the chin or collarbone (thoughtful, aspirational gesture).
LIGHTING: Soft directional key light from slightly above, creating beautiful skin luminosity. Warm golden hour color temperature. Subtle rim light on hair.
ATTIRE: Elegant blazer or structured jacket in nude, beige, cream, blush rose, or camel tones. Simple minimal jewelry — small gold earrings. Clean, polished look.
EXPRESSION: Calm, confident, warm smile or subtle knowing expression. Direct eye contact with camera. Empowered.
STYLE: Personal brand / inspirational portrait. The "I've arrived" energy. Premium, aspirational, human warmth. Works for professionals, lawyers, aestheticians, coaches, entrepreneurs.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face, skin tone, or features. Only change clothing, background, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. High-end editorial portrait quality with warm cinematic tones.`,
        ];

        const STUDIO_STYLE_LABELS = [
            "Executivo Pro",
            "Família Studio Clean",
            "Inspiracional Dourado",
        ];

        // ── FOOD DELIVERY PROMPTS (existing) ──
        const DELIVERY_STYLE_PROMPTS = [
            // Style 1: Dark Studio Premium — Michelin-star drama
            `Food photography masterpiece. IDENTIFY the food in the provided image and recreate it as a professional studio shot.
SCENE: Matte black background, single dramatic side rim light (warm amber/golden), soft shadow gradient. Michelin-star restaurant aesthetic.
LIGHTING: Hard directional light from the left, creating deep shadows and highlighting textures. Subtle golden bounce fill from the right.
COMPOSITION: Food centered or slightly off-center, hero close-up angle (45° overhead to straight-on). Negative space on one side.
DETAILS: Make every texture pop — caramelized edges, steam wisps, glistening sauces, melted cheese pulls if applicable.
STYLE: Ultra-premium dark food photography. Magazine cover quality. No props except perhaps a dark slate or wooden board underneath.
OUTPUT: Photorealistic, NOT illustrated. Real photograph aesthetic.`,

            // Style 2: Macro Close-up — irresistible food porn
            `Extreme close-up macro food photography. IDENTIFY the food in the provided image and shoot it in ultra-close detail.
SCENE: Tight macro shot, bokeh background, focus on the most appetizing texture detail of the food.
LIGHTING: Dramatic macro lighting emphasizing textures — cheese pulls, melted chocolate, crispy skin, glistening glazes, steam wisps above hot food.
COMPOSITION: Fill 80% of the frame with the most craveable part of the dish. Shallow depth of field, blurred background.
DETAILS: Every texture magnified — bubbling cheese, charred crust, dripping sauce, powdered sugar snow, fresh herb fibers.
STYLE: Food porn photography. Designed to make the viewer crave the food immediately. Hyper-detailed, almost uncomfortable closeness.
OUTPUT: Photorealistic macro photograph with cinematic color grading.`,

            // Style 3: Rooftop Urban Night — aspirational lifestyle
            `Rooftop urban food photography. IDENTIFY the food in the provided image and place it in a premium rooftop setting.
SCENE: Upscale rooftop bar or restaurant terrace with city skyline view at dusk or night.
ENVIRONMENT: City lights bokeh in the background, elevated terrace with urban panorama, modern rooftop furniture, fairy lights overhead.
LIGHTING: City glow ambient light, golden hour transitioning to night, warm string lights, urban blue-orange color contrast.
PROPS: City skyline visible behind, modern terrace chair/table edge, perhaps a cocktail nearby.
COMPOSITION: Food in foreground with blurred city lights creating magical bokeh background.
STYLE: Premium urban rooftop lifestyle. "Vista linda da cidade" energy. Sophisticated and aspirational.
OUTPUT: Photorealistic with cinematic blue-hour/golden-hour urban color grading.`,
        ];

        const DELIVERY_STYLE_LABELS = [
            "Estúdio Premium Escuro",
            "Close-up Apetitoso",
            "Rooftop Urbano",
        ];

        // ── BIRTHDAY / ANIVERSÁRIO PROMPTS: Estúdio Clean, Garden Party, Balão Dourado ──
        const ANIVERSARIO_STYLE_PROMPTS = [
            // Style 1: Estúdio Clean com Balão Metálico Dourado
            `Professional birthday photoshoot portrait. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Clean white or soft off-white studio background. Elegant, minimalist birthday photoshoot setting.
PROPS: One large metallic gold balloon (number or round) held or floating nearby. Subtle gold confetti or light bokeh sparkles in the background.
FRAMING: American-plan (plano americano) shot — from waist up. Centered, celebratory pose.
LIGHTING: Soft, even studio lighting — large softbox creating flattering, luminous skin tones. Warm champagne/golden color temperature.
ATTIRE: Elegant party outfit — gold sequin top, white dress, or champagne-colored blazer for women; dark blazer or dress shirt for men.
EXPRESSION: Joyful, celebrating smile. Radiant energy. Birthday celebration mood.
STYLE: Clean, elegant birthday photoshoot. Magazine-quality. Luxury celebration aesthetic. Suitable for social media announcements and personal branding.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face. Only change clothing, background, props, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. Clean, bright studio backdrop — absolutely NO red backgrounds.`,

            // Style 2: Garden Party / Jardim Encantado
            `Outdoor garden birthday party portrait. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Beautiful garden setting with lush greenery, blooming flowers (roses, peonies), and soft natural light filtering through leaves.
PROPS: Rose gold or silver metallic balloon cluster in the background, flowers in hair or held. Soft bokeh garden background.
FRAMING: American-plan shot from waist up. Natural, relaxed celebrating pose.
LIGHTING: Golden hour natural light — warm, glowing, creating beautiful skin luminosity. Soft dappled sunlight through foliage.
ATTIRE: Floral summer dress or elegant garden party outfit. Light, warm, celebratory colors — mint, coral, blush, or white.
EXPRESSION: Genuine joy, carefree smile, celebrating birthday in nature.
STYLE: Romantic garden birthday celebration. "Ensaio no jardim" aesthetic. Dreamy, feminine yet sophisticated. Works for all genders with appropriate outfit variation.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face. Only change clothing, setting, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. Beautiful natural outdoor setting — NO red backgrounds, only soft greens, pinks, and warm naturals.`,

            // Style 3: Luxo Balão Dourado — elegant dark luxury backdrop
            `Luxury birthday photoshoot with golden balloons. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Elegant dark charcoal or deep navy backdrop (NOT red — dark grey or navy blue). Large metallic gold number balloons or gold letter balloons ("ANIVERSÁRIO" or "HAPPY BIRTHDAY") arranged decoratively behind the person.
PROPS: Oversized gold foil balloons, gold confetti floating in air, champagne glass held elegantly.
FRAMING: American-plan (plano americano) — from waist up. Confident, glamorous birthday pose.
LIGHTING: Dramatic studio lighting with golden rim light creating a halo effect on hair. Warm amber key light from the front.
ATTIRE: Glamorous birthday outfit — sparkling gold sequin dress for women; elegant black suit with gold pocket square for men.
EXPRESSION: Confident, glowing, "it's my birthday" energy. Powerful and celebratory.
STYLE: Luxury birthday editorial. Gold metallic aesthetic. Rich and premium. Champagne celebration vibes.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face. Background must be dark charcoal or navy — absolutely NO red backgrounds.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. Dark background with warm golden lighting — rich, luxury birthday celebration feel.`,
        ];

        const ANIVERSARIO_STYLE_LABELS = [
            "Estúdio Clean",
            "Garden Party",
            "Balão Dourado",
        ];

        // Select prompts and labels based on trial type
        const TRIAL_STYLE_PROMPTS = isAniversarioTrial ? ANIVERSARIO_STYLE_PROMPTS : isStudioTrial ? STUDIO_STYLE_PROMPTS : DELIVERY_STYLE_PROMPTS;
        const TRIAL_STYLE_LABELS = isAniversarioTrial ? ANIVERSARIO_STYLE_LABELS : isStudioTrial ? STUDIO_STYLE_LABELS : DELIVERY_STYLE_LABELS;

        // Extract only the image part from incoming `parts` (ignore frontend text prompt)
        const imageParts = parts.filter((p: any) => p.inlineData);

        const generationPromises = [0, 1, 2].map(async (index) => {
            // Build parts: image from client + our curated style prompt
            const styledParts = [
                ...imageParts,
                { text: TRIAL_STYLE_PROMPTS[index] },
            ];
            const result = await generateSingleImage(styledParts, aspectRatio || "1:1");
            return { index, styleLabel: TRIAL_STYLE_LABELS[index], ...result };
        });

        const results = await Promise.allSettled(generationPromises);
        const successful = results
            .map((r, i) => r.status === "fulfilled" ? r.value : null)
            .filter(Boolean) as { index: number; data: string; mimeType: string }[];

        if (successful.length === 0) {
            throw new Error("Falha ao gerar imagens. Tente novamente.");
        }

        // ── Upload HD images to private Storage ────────────────────────────────
        const hdPaths: { path: string; variation: number; index: number }[] = [];
        const previewImages: { url: string; variation: number; index: number }[] = [];

        await Promise.all(successful.map(async ({ index, data, mimeType }) => {
            // Upload HD to private storage
            const storagePath = await uploadHdImage(generationId, index, data, mimeType);
            hdPaths.push({ path: storagePath, variation: index + 1, index });

            // Build preview data URL (full quality for display, watermark added client-side)
            const previewUrl = buildPreviewDataUrl(data, mimeType);
            previewImages.push({ url: previewUrl, variation: index + 1, index });
        }));

        // ── Save to database ───────────────────────────────────────────────────
        const { data: newRecord, error: insertError } = await supabaseAdmin
            .from("trial_generations")
            .insert({
                id: generationId,
                session_id: sessionHash,
                ip_hash: ipHash,
                status: "preview",
                delivery_style: delivery_style || null,
                aspect_ratio: aspectRatio || "1:1",
                preview_images: previewImages.map(p => ({ url: p.url.substring(0, 50) + "...", variation: p.variation, index: p.index })), // Store truncated URL metadata only
                hd_storage_paths: hdPaths,
                expires_at: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours
            })
            .select("id, expires_at")
            .single();

        if (insertError) {
            console.error("Failed to save trial generation:", insertError);
            throw new Error("Erro ao salvar geração");
        }

        // Return preview images with full data URLs (watermark applied client-side)
        return new Response(JSON.stringify({
            generation_id: generationId,
            preview_images: previewImages,
            expires_at: newRecord.expires_at,
            count: previewImages.length,
        }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    } catch (error: any) {
        console.error("generate-trial error:", error);
        return new Response(JSON.stringify({ error: error.message || "Erro interno" }), {
            status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});
