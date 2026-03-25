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

// Random start for key rotation — distributes load across instances
let keyIndex = Math.floor(Math.random() * 1000);
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
                throw new Error("Nenhuma imagem gerada. Tente novamente.");
            }

            const imagePart = response.candidates[0].content.parts.find((p: any) => p.inlineData);
            if (!imagePart?.inlineData) throw new Error("No image in response");

            return { data: imagePart.inlineData.data, mimeType: imagePart.inlineData.mimeType || "image/png" };
        } catch (err: any) {
            lastError = err;
            const is429 = err.message?.includes("429") || err.message?.toLowerCase().includes("quota") || err.message?.toLowerCase().includes("resource_exhausted");
            if (is429 && attempt < maxRetries - 1) {
                const waitMs = Math.min(2000 * Math.pow(2, attempt), 10000);
                console.log(`\u26A0\uFE0F Trial key ${(attempt % GEMINI_KEYS.length) + 1} hit rate limit, waiting ${waitMs}ms...`);
                await new Promise(r => setTimeout(r, waitMs));
                continue;
            }
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

// ── Smart Product Detection ─────────────────────────────────────────────────
// Analyze product photo to determine if it's a dine-in item (glass/cup/bowl)
// or a delivery-packable item. This prevents awkward scenes like açaí in a
// delivery box.
async function analyzeProductType(imageParts: any[]): Promise<"dine-in" | "delivery"> {
    try {
        const apiKey = getNextKey();
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    ...imageParts,
                    {
                        text: `Analyze this food/drink product photo. Is it served in a glass, cup, goblet, bowl, or tall container that would spill or break if placed in a delivery box? Or is it a packable food (pizza, burger, sushi, cake, pastry, wrapped item) that can be placed in a takeout box or bag?

Respond with ONLY one word:
- "dine-in" if the product is in a glass, cup, goblet, tall bowl, or any container that cannot be packaged for delivery
- "delivery" if the product can be boxed or bagged for delivery

Examples of dine-in: açaí na taça, milkshake, smoothie in glass, cocktail, ice cream sundae, soup in bowl, drink in cup
Examples of delivery: pizza, hamburger, sushi, cake, pastel, marmita, wrapped food, food on a plate

Answer:`,
                    },
                ],
            },
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || "";
        console.log(`Product analysis result: "${text}"`);
        if (text.includes("dine-in") || text.includes("dine in")) return "dine-in";
        return "delivery";
    } catch (err: any) {
        console.error("Product analysis failed, defaulting to delivery:", err.message);
        return "delivery"; // Safe fallback
    }
}

// ── Garment Gender Detection ────────────────────────────────────────────────
// Analyze a garment image to determine if it's masculine or feminine clothing
async function detectGarmentGender(imageParts: any[]): Promise<"feminino" | "masculino"> {
    try {
        const apiKey = getNextKey();
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    ...imageParts,
                    {
                        text: `Analyze this clothing/garment image. Is this a piece of clothing designed for women (feminine) or men (masculine)?

Consider: the cut, style, colors, patterns, neckline, silhouette, and overall design.

Respond with ONLY one word:
- "feminino" if the garment is designed for women (dress, skirt, feminine blouse, women's pants, etc.)
- "masculino" if the garment is designed for men (men's shirt, men's suit, men's pants, polo, etc.)

If the garment is unisex (t-shirt, hoodie, jeans), default to "feminino".

Answer:`,
                    },
                ],
            },
        });

        const text = response.candidates?.[0]?.content?.parts?.[0]?.text?.trim().toLowerCase() || "";
        console.log(`Garment gender detection: "${text}"`);
        if (text.includes("masculino")) return "masculino";
        return "feminino";
    } catch (err: any) {
        console.error("Garment gender detection failed, defaulting to feminino:", err.message);
        return "feminino";
    }
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
        const isEsteticaTrial = delivery_style === 'estetica';
        const isPetTrial = delivery_style === 'pet';
        const isModaTrial = delivery_style === 'moda';

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

        // ── FOOD DELIVERY PROMPTS ──
        const DELIVERY_STYLE_PROMPTS = [
            // Style 1: Dark Studio Premium — Michelin-star drama
            `Food photography masterpiece. IDENTIFY the food in the provided image and recreate it as a professional studio shot.
SCENE: Matte black background, single dramatic side rim light (warm amber/golden), soft shadow gradient. Michelin-star restaurant aesthetic.
LIGHTING: Hard directional light from the left, creating deep shadows and highlighting textures. Subtle golden bounce fill from the right.
COMPOSITION: Food centered or slightly off-center, hero close-up angle (45° overhead to straight-on). Negative space on one side.
DETAILS: Make every texture pop — caramelized edges, steam wisps, glistening sauces, melted cheese pulls if applicable.
STYLE: Ultra-premium dark food photography. Magazine cover quality. No props except perhaps a dark slate or wooden board underneath.
OUTPUT: Photorealistic, NOT illustrated. Real photograph aesthetic.`,

            // Style 2: Flat Lay Overhead — Instagram top-down "bird's eye" style
            `Top-down flat lay food photography (overhead, bird's eye view). IDENTIFY the food in the provided image and compose it in a clean flat lay scene.
SCENE: Direct overhead shot (90°, camera pointing straight down). Clean light surface — white marble, light wood board, or terrazzo — as the base. The food is the hero centered in the frame.
LIGHTING: Bright, soft diffused natural light from above or from the side. Even, shadow-minimal lighting. Light and airy feel. Bright whites, clean tones.
COMPOSITION: Classic flat lay — food centered with intentional styling: a folded napkin, fresh herbs, small sauce cup, or delivery packaging elements scattered naturally around the food. Rule of thirds.
DETAILS: Food must look fresh and appetizing from above — visible textures, colors, steam if hot. All elements flat or very low-profile. No tall objects blocking the top-down view.
STYLE: Instagram flat lay aesthetic. Clean, editorial, "content creator" food styling. Very popular for delivery context — makes the food look organized and craveable from above.
OUTPUT: Photorealistic photograph. Bright, clean, modern aesthetic. NOT illustrated.`,

            // Style 3: Lifestyle Delivery — person enjoying the food at home
            `Lifestyle food delivery photography. IDENTIFY the food in the provided image and create a scene of a REAL PERSON enjoying it.
SCENE: Cozy home environment — stylish modern living room or kitchen counter. Warm ambient lighting. The food has just arrived via delivery.
PERSON: A happy, attractive person (man or woman, 25-35 years old) is interacting with the food — holding it, taking a bite, presenting it to camera, or smiling while looking at it. The person should look genuine and natural, not posed.
FRAMING: Medium shot showing the person from chest up with the food prominently visible. The person and food should both be clearly visible.
LIGHTING: Warm, cozy indoor lighting — soft window light mixed with warm interior ambient light. Golden tones.
EXPRESSION: Genuine enjoyment, satisfaction, "this food is amazing" energy. Natural smile, eyes on the food or at camera.
DETAILS: Food must look appetizing and be clearly recognizable as the same dish from the reference photo. Steam, textures, and freshness visible.
STYLE: Instagram lifestyle content. UGC (user-generated content) aesthetic but with professional quality. The kind of photo someone would post saying "look what I ordered!".
CRITICAL: The PERSON must be a REAL human being interacting with the food. NOT just the food alone. The food must match the provided image exactly.
OUTPUT: Photorealistic photograph. Natural, warm, lifestyle aesthetic. NOT illustrated.`,
        ];

        const DELIVERY_STYLE_LABELS = [
            "Estúdio Premium Escuro",
            "Flat Lay Aéreo",
            "Lifestyle Delivery",
        ];

        // ── DINE-IN PROMPTS: For products in glasses, cups, bowls (açaí, milkshake, etc) ──
        const DINEIN_STYLE_PROMPTS = [
            // Style 1: Café/Restaurante Premium — marble counter, warm ambient
            `Premium restaurant food photography. IDENTIFY the food/drink in the provided image and recreate it in a beautiful restaurant setting.
SCENE: Elegant marble or dark granite counter/table in a premium café or restaurant. Warm ambient lighting. Blurred restaurant interior or cozy café in the background with soft bokeh.
LIGHTING: Warm, golden side lighting from a large window. Soft shadows. Natural-looking with warm color temperature.
COMPOSITION: Product centered on the table/counter, slightly off-center for visual interest. 45° overhead angle. KEEP the product in its original container (glass, cup, bowl) — do NOT place it in any delivery box or bag.
DETAILS: Show the texture of the food — granola crunch, fruit freshness, cream dripping, condensation on glass. A small spoon or straw if appropriate.
PROPS: Clean marble/stone surface, perhaps a folded linen napkin or small decorative plant in soft focus behind.
STYLE: Instagram-worthy café shot. Premium, inviting, "I want to sit there" energy.
CRITICAL: Keep the food/drink in its ORIGINAL serving container (glass, cup, bowl). Do NOT put it in any box, bag, or delivery packaging.
OUTPUT: Photorealistic, NOT illustrated. Real photograph aesthetic.`,

            // Style 2: Flat Lay Overhead — overhead bird's eye for café/dine-in products
            `Top-down flat lay photography (overhead, bird's eye view). IDENTIFY the food/drink in the provided image and compose it in a beautiful flat lay scene.
SCENE: Direct 90° overhead shot. Clean surface base — white marble, light terrazzo, or natural wood. The drink/food in its ORIGINAL container (glass, cup, bowl) is the hero centered in frame.
LIGHTING: Bright, airy, soft natural light from above. Clean, minimal shadows. Light and fresh aesthetic.
COMPOSITION: Flat lay style — drink/food centered with lifestyle props around it: a small spoon, fresh fruit slices, granola sprinkle, flowers, or a marble coaster. Elegant and intentional arrangement.
DETAILS: Product maintains ORIGINAL container (glass, cup, bowl). Condensation, fruit freshness, cream swirls visible from above. Colors pop against the light surface.
STYLE: Instagram café flat lay aesthetic. Clean, editorial, premium content creator look. Very popular for açaí, smoothies, coffees, cakes.
CRITICAL: Keep the food/drink in its ORIGINAL serving container. NOT in any box or delivery packaging. Top-down overhead view ONLY.
OUTPUT: Photorealistic photograph. Bright, clean, modern aesthetic. NOT illustrated.`,

            // Style 3: Lifestyle Café — person enjoying the drink/food at café
            `Lifestyle café photography. IDENTIFY the food/drink in the provided image and create a scene of a REAL PERSON enjoying it at a beautiful café.
SCENE: Stylish café or restaurant interior with warm ambient lighting. Cozy, Instagram-worthy setting.
PERSON: A happy, attractive person (man or woman, 25-35 years old) is interacting with the food/drink — holding the glass/cup, taking a sip, smiling while looking at it, or presenting it to camera. Natural, genuine interaction.
FRAMING: Medium shot showing the person from chest up with the food/drink prominently visible in their hands or on the table in front of them. Both person and product clearly visible.
LIGHTING: Warm café ambient light — soft golden window light, cozy warm tones. Beautiful skin luminosity.
EXPRESSION: Genuine enjoyment, satisfaction, relaxation. "This is so good" energy. Natural smile.
DETAILS: The food/drink must be clearly recognizable as the same item from the reference photo. KEEP it in its ORIGINAL serving container (glass, cup, bowl). Condensation, textures, freshness visible.
STYLE: Instagram lifestyle content. The kind of photo someone would post saying "melhor açaí da cidade!" or "meu cantinho favorito". UGC aesthetic with professional quality.
CRITICAL: The PERSON must be a REAL human being interacting with the food/drink. NOT just the food alone. Do NOT put the food in any box or delivery packaging. Keep in ORIGINAL container.
OUTPUT: Photorealistic photograph. Natural, warm, lifestyle aesthetic. NOT illustrated.`,
        ];

        const DINEIN_STYLE_LABELS = [
            "Café Premium",
            "Flat Lay Aéreo",
            "Lifestyle Café",
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

        // ── AESTHETICS / ESTÉTICA PROMPTS: Maquiagem Studio, Executivo Beauty, Clínica Estética ──
        const ESTETICA_STYLE_PROMPTS = [
            // Style 1: Maquiagem Studio — beauty professional with makeup setup
            `Professional beauty/makeup artist portrait photography. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Modern, stylish beauty studio or makeup workspace. Clean vanity area with a large ring light visible in background, soft glowing bulbs. Professional makeup brushes, palettes, and beauty products arranged elegantly on a marble or white vanity. Warm ambient lighting.
FRAMING: American-plan (plano americano) shot — from waist up. Slightly angled, natural pose. Subject may be holding a makeup brush or palette naturally.
LIGHTING: Beautiful ring light illumination creating flawless skin lighting. Warm, flattering. Soft golden fill light. Professional beauty lighting setup.
ATTIRE: Chic all-black professional outfit — fitted black turtleneck or elegant black top. Minimal gold jewelry. Hair styled beautifully.
EXPRESSION: Confident, warm, inviting smile. "I am the best at what I do" energy. Professional yet approachable.
STYLE: Beauty professional branding portrait. Instagram beauty influencer aesthetic. Premium makeup artist vibes.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face, skin tone, or features. Only change clothing, background, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. High-end beauty studio photography.`,

            // Style 2: Executivo Beauty — professional beauty executive portrait
            `Professional executive beauty portrait. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Modern, minimalist office or premium coworking space with soft neutral tones (white, cream, light grey). Clean, uncluttered background with subtle luxury touches — a fresh flower arrangement, elegant shelf, or frosted glass partition.
FRAMING: American-plan (plano americano) shot — from waist up. Confident, professional posture. Arms crossed or one hand resting on table.
LIGHTING: Soft, flattering studio-quality lighting. Large window natural light feel. Even skin illumination. Clean, bright, professional.
ATTIRE: Elegant professional blazer — white, blush pink, or soft rose. Well-fitted, modern cut. Minimal gold accessories (small earrings, delicate necklace). Hair impeccable.
EXPRESSION: Confident, composed, warm professional smile. Direct eye contact. Authority and elegance combined. "Business owner" energy.
STYLE: Personal branding / LinkedIn portrait for beauty professionals, aesthetics clinic owners, beauty entrepreneurs. Premium, trustworthy, sophisticated.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face, skin tone, or features. Only change clothing, background, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. High-end corporate/branding photography.`,

            // Style 3: Clínica Estética — aesthetics clinic professional
            `Professional aesthetics clinic portrait. PRESERVE THE PERSON'S EXACT FACE AND LIKENESS from the provided photo.
SCENE: Modern, pristine aesthetics clinic or dermatology office. Clean white and soft grey environment with subtle medical-spa elements — sleek treatment chair, minimalist shelving with premium skincare products, soft ambient LED lighting in the background.
FRAMING: American-plan (plano americano) shot — from waist up. Professional, approachable stance. May have arms gently crossed or hands together.
LIGHTING: Clean, bright, even clinical lighting. Soft white light that creates a premium medical-spa atmosphere. Flawless skin illumination.
ATTIRE: Professional white lab coat or clinical blazer over elegant clothing — crisp white coat with subtle branding, or sophisticated white medical jacket. Clean, pristine appearance.
EXPRESSION: Warm, trustworthy, professional smile. "Your skin is in good hands" energy. Confident and caring.
STYLE: Medical aesthetics professional branding portrait. Premium skincare clinic / dermatology office vibes. Clean, clinical yet warm and inviting.
CRITICAL: EXACT facial likeness must be preserved. Do NOT alter the person's face, skin tone, or features. Only change clothing, background, and lighting.
OUTPUT: Photorealistic portrait. 3:4 aspect ratio. Premium medical-spa / aesthetics clinic photography.`,
        ];

        const ESTETICA_STYLE_LABELS = [
            "Maquiagem Studio",
            "Executivo Beauty",
            "Clínica Estética",
        ];

        // ── PET PORTRAIT PROMPTS: Praia, Estúdio Clean, Natureza ──
        const PET_STYLE_PROMPTS = [
            // Style 1: Pôr do Sol na Praia
            `Professional pet portrait photography on a sunset beach. FIRST: IDENTIFY the animal type, breed, and unique features from the provided photo.
SCENE: Stunning tropical sunset beach — golden sand, gentle ocean waves, vibrant orange/pink/purple sky. Palm tree silhouettes in the background.
LIGHTING: Beautiful golden hour backlighting creating rim light on the pet's fur. Warm, dramatic, cinematic sunset glow.
POSE: The pet is sitting on wet sand near the water's edge, looking at camera with a happy, relaxed expression (tongue out for dogs). Natural, joyful pose.
STYLE: Professional pet photography, cinematic sunset portrait. Warm, emotional, Instagram-worthy.
CRITICAL: PRESERVE the pet's EXACT appearance — breed, fur color, markings, size, face shape, eye color, coat texture. The pet in the output must be clearly the SAME animal from the input photo. Do NOT change the pet's breed or appearance.
OUTPUT: Photorealistic pet portrait. 3:4 aspect ratio. Magazine-quality pet photography with dreamy sunset atmosphere.`,

            // Style 2: Estúdio Clean
            `Professional pet studio portrait photography. FIRST: IDENTIFY the animal type, breed, and unique features from the provided photo.
SCENE: Premium photography studio with clean, dark charcoal/black background. Professional softbox lighting setup.
LIGHTING: Elegant studio lighting — diffused key light from slightly above creating beautiful catchlights in the pet's eyes, subtle rim light separating the pet from the background. Professional pet portrait lighting.
POSE: The pet is sitting or standing in a classic portrait pose, looking directly at camera with an alert, dignified expression. Elegant and composed.
STYLE: High-end pet portrait photography. Clean, professional, magazine-cover quality. Dark moody studio aesthetic.
CRITICAL: PRESERVE the pet's EXACT appearance — breed, fur color, markings, size, face shape, eye color, coat texture. The pet in the output must be clearly the SAME animal from the input photo. Do NOT change the pet's breed or appearance.
OUTPUT: Photorealistic pet portrait. 3:4 aspect ratio. Premium studio photography with deep, rich background.`,

            // Style 3: Natureza Tropical
            `Professional pet nature portrait photography. FIRST: IDENTIFY the animal type, breed, and unique features from the provided photo.
SCENE: Lush tropical garden with vibrant colorful flowers (hibiscus, bougainvillea, orchids), palm leaves, ferns, and dappled sunlight filtering through foliage.
LIGHTING: Beautiful natural light — warm golden hour with dappled sun creating gorgeous bokeh in the background. Soft, dreamy outdoor light.
POSE: The pet is sitting gracefully among the flowers and tropical plants, with a serene, content expression. Natural and relaxed.
STYLE: Professional outdoor pet photography. Tropical garden aesthetic, vibrant and warm. Nature portrait with beautiful bokeh and color depth.
CRITICAL: PRESERVE the pet's EXACT appearance — breed, fur color, markings, size, face shape, eye color, coat texture. The pet in the output must be clearly the SAME animal from the input photo. Do NOT change the pet's breed or appearance.
OUTPUT: Photorealistic pet portrait. 3:4 aspect ratio. Beautiful natural garden portrait with warm, vibrant tropical atmosphere.`,
        ];

        const PET_STYLE_LABELS = [
            "Pôr do Sol na Praia",
            "Estúdio Clean",
            "Natureza Tropical",
        ];

        // ── MODA / FASHION PROMPTS: 3 different avatars wearing the same garment ──
        // Gender is detected dynamically from the garment image
        const buildModaPrompts = (gender: "feminino" | "masculino"): string[] => {
            const isFem = gender === "feminino";
            const genderWord = isFem ? "woman" : "man";
            const genderLabel = isFem ? "FEMALE/WOMAN" : "MALE/MAN";
            const genderProhibition = isFem
                ? "ABSOLUTELY DO NOT generate a man or male model. The model MUST be a WOMAN."
                : "ABSOLUTELY DO NOT generate a woman or female model. The model MUST be a MAN.";

            const avatars = isFem ? [
                { name: "Morena Brasileira", desc: "A Brazilian morena woman, 25-30 years old, with warm medium-brown skin (morena), wavy dark brown hair, athletic-slim body type. She looks like a real Brazilian fashion influencer — natural, confident, photorealistic. Beautiful warm golden-brown skin typical of mixed-race Brazilians." },
                { name: "Negra Poderosa", desc: "A beautiful Black Brazilian woman, 25-30 years old, with rich dark melanin-rich skin, natural coily/afro hair (big beautiful afro or stylish braids), confident body type. She looks powerful, elegant, and authentically Brazilian. Photorealistic, NOT a stock photo model." },
                { name: "Loira Influencer", desc: "A blonde Brazilian woman, 25-30 years old, with light/fair skin, long straight blonde hair, slim body type. She looks like a real Instagram fashion influencer — trendy, modern, photorealistic. Natural beauty, not over-processed." },
            ] : [
                { name: "Moreno Brasileiro", desc: "A Brazilian moreno man, 25-35 years old, with warm medium-brown skin (moreno), short dark hair, athletic body type. Confident, stylish, modern Brazilian man. Photorealistic, like a real male fashion influencer." },
                { name: "Negro Imponente", desc: "A handsome Black Brazilian man, 25-35 years old, with rich dark skin, short or faded hairstyle, athletic build. Powerful, elegant, confident. Photorealistic, authentically Brazilian." },
                { name: "Loiro Moderno", desc: "A blonde Brazilian man, 25-35 years old, with light skin, styled blonde hair, slim athletic build. Modern, trendy, influencer aesthetic. Photorealistic." },
            ];

            const environments = [
                "Clean white or light grey studio backdrop. Professional softbox lighting. Minimalist editorial fashion photography. Clean, bright, e-commerce quality.",
                "Urban city street with soft natural light. Slightly blurred city background. Confident casual pose. Golden hour or overcast lighting for soft shadows.",
                "Stylish indoor setting — modern café, luxury boutique, or contemporary loft. Warm ambient lighting. Lifestyle fashion photography.",
            ];

            return avatars.map((avatar, i) => `Professional fashion lookbook photography.

=== MODEL IDENTITY ===
CREATE AN AI MODEL: ${avatar.desc}
⚠️ GENDER LOCK: The model MUST be ${genderLabel}. ${genderProhibition}

=== GARMENT TASK ===
Look at the garment/clothing image provided. This shows a clothing item — it may be on a hanger, flat lay, or worn by someone.
>>> If a PERSON is wearing the garment: EXTRACT ONLY THE CLOTHING. Ignore the person completely.
>>> Identify the EXACT garment: color, fabric, pattern, texture, cut, neckline, sleeves, length, and all design details.
>>> Your AI model (${avatar.name}) MUST WEAR this exact garment.
>>> DO NOT change the garment's color, pattern, or design — match it EXACTLY.

🔒 IDENTITY FIREWALL:
The person who may appear in the garment reference is NOT your model.
DO NOT copy their face, body, skin, hair, or any feature.
Generate a COMPLETELY NEW person matching the avatar description above.

=== ENVIRONMENT ===
${environments[i]}

=== COMPOSITION ===
- Full body or 3/4 body shot. The complete outfit must be visible.
- Confident, natural pose. Not stiff or awkward.
- Professional fashion photography lighting and quality.
- Photorealistic output — indistinguishable from a real photo.
- OUTPUT FORMAT: Photorealistic photograph. NOT cartoon, NOT illustration.

ABSOLUTE PROHIBITIONS:
- DO NOT change the garment color, pattern, or design
- DO NOT replicate the person from the reference image
- DO NOT add text, logos, or watermarks
- DO NOT generate ${isFem ? "a man" : "a woman"}`);
        };

        const MODA_STYLE_LABELS_FEM = ["Morena Brasileira", "Negra Poderosa", "Loira Influencer"];
        const MODA_STYLE_LABELS_MASC = ["Moreno Brasileiro", "Negro Imponente", "Loiro Moderno"];

        // Extract image parts from incoming `parts` (ignore frontend text prompts)
        const allImageParts = parts.filter((p: any) => p.inlineData);

        // Separate product image (1st) from optional packaging image (2nd)
        const productImageParts = allImageParts.slice(0, 1); // First image = product
        const packagingImageParts = allImageParts.slice(1, 2); // Second image = packaging (if any)
        const hasPackaging = packagingImageParts.length > 0;

        if (hasPackaging) {
            console.log("📦 Packaging image detected — will include in prompts");
        }

        // ── Smart Product Detection for Delivery Trials ──────────────────────
        // Analyze the PRODUCT image only (not packaging) to determine dine-in vs delivery
        let deliveryPrompts = DELIVERY_STYLE_PROMPTS;
        let deliveryLabels = DELIVERY_STYLE_LABELS;
        if (!isStudioTrial && !isAniversarioTrial && !isEsteticaTrial && !isPetTrial && !isModaTrial && productImageParts.length > 0) {
            const productType = await analyzeProductType(productImageParts);
            console.log(`Smart product detection: ${productType}`);
            if (productType === "dine-in") {
                deliveryPrompts = DINEIN_STYLE_PROMPTS;
                deliveryLabels = DINEIN_STYLE_LABELS;
            }
        }

        // ── Moda: Detect garment gender ──────────────────────────────────────
        let modaGender: "feminino" | "masculino" = "feminino";
        let MODA_STYLE_PROMPTS: string[] = [];
        let MODA_STYLE_LABELS: string[] = [];
        if (isModaTrial && productImageParts.length > 0) {
            modaGender = await detectGarmentGender(productImageParts);
            console.log(`👗 Moda trial — detected gender: ${modaGender}`);
            MODA_STYLE_PROMPTS = buildModaPrompts(modaGender);
            MODA_STYLE_LABELS = modaGender === "feminino" ? MODA_STYLE_LABELS_FEM : MODA_STYLE_LABELS_MASC;
        }

        // Select prompts and labels based on trial type
        const TRIAL_STYLE_PROMPTS = isModaTrial ? MODA_STYLE_PROMPTS : isPetTrial ? PET_STYLE_PROMPTS : isEsteticaTrial ? ESTETICA_STYLE_PROMPTS : isAniversarioTrial ? ANIVERSARIO_STYLE_PROMPTS : isStudioTrial ? STUDIO_STYLE_PROMPTS : deliveryPrompts;
        const TRIAL_STYLE_LABELS = isModaTrial ? MODA_STYLE_LABELS : isPetTrial ? PET_STYLE_LABELS : isEsteticaTrial ? ESTETICA_STYLE_LABELS : isAniversarioTrial ? ANIVERSARIO_STYLE_LABELS : isStudioTrial ? STUDIO_STYLE_LABELS : deliveryLabels;

        // Packaging prompt suffix — appended when packaging image is provided
        const PACKAGING_SUFFIX = hasPackaging
            ? `\n\nPACKAGING INTEGRATION (CRITICAL):\n- A second image is provided showing the client's REAL branded packaging.\n- Include this packaging NATURALLY in the scene — the food should be shown inside, emerging from, or placed next to this specific packaging.\n- Preserve the branding, colors, logo, and design of the packaging EXACTLY as shown.\n- The packaging adds authenticity — it shows this is a REAL delivery/restaurant product.\n- Do NOT invent a generic box — use ONLY the packaging shown in the reference image.`
            : "";

        const generationPromises = [0, 1, 2].map(async (index) => {
            // Build parts: product image + (optional) packaging image + curated prompt
            const styledParts = [
                ...productImageParts,
                ...(hasPackaging ? packagingImageParts : []),
                { text: TRIAL_STYLE_PROMPTS[index] + PACKAGING_SUFFIX },
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
