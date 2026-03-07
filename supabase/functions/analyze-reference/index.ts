import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { GoogleGenAI } from "npm:@google/genai";

// Collect all available Gemini keys from environment
const GEMINI_KEYS: string[] = [];
for (let i = 1; i <= 10; i++) {
    const key = Deno.env.get(`GEMINI_KEY_${i}`);
    if (key) GEMINI_KEYS.push(key);
}
if (GEMINI_KEYS.length === 0) {
    const singleKey = Deno.env.get("GEMINI_API_KEY");
    if (singleKey) GEMINI_KEYS.push(singleKey);
}

let keyIndex = 0;
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
        const { imageData, mimeType } = await req.json();

        if (!imageData) {
            return new Response(JSON.stringify({ error: "No image data provided" }), {
                status: 400,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        }

        const apiKey = getNextKey();
        const ai = new GoogleGenAI({ apiKey });

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        text: `You are a professional fashion and photography analyst. Analyze this image and provide a DETAILED description in the following format:

CLOTHING: Describe every garment visible — type (dress, blouse, pants, suit, etc.), exact color, fabric texture, pattern, cut/style, and any details (buttons, zippers, embroidery, accessories).

POSE: Describe the person's body position, stance, hand placement, head tilt, and overall body language.

LIGHTING: Describe the lighting setup — direction, warmth/coolness, intensity, shadows, and any special effects (rim light, backlight, etc.).

BACKGROUND: Describe the environment — indoor/outdoor, colors, elements, depth of field, and atmosphere.

MOOD: The overall aesthetic feeling — professional, casual, glamorous, editorial, romantic, etc.

HAIR: Describe the hairstyle visible — length, color, texture, styling.

Be extremely specific and detailed. This description will be used to recreate a similar photo with a DIFFERENT person, so accuracy is critical.
If there is NO person in the image (just clothing on a hanger, flat-lay, or product), describe the clothing/item in detail and note that it's a standalone garment/product.`
                    },
                    {
                        inlineData: {
                            data: imageData,
                            mimeType: mimeType || "image/jpeg"
                        }
                    }
                ]
            },
        });

        const textContent = response.candidates?.[0]?.content?.parts
            ?.filter((p: any) => p.text)
            ?.map((p: any) => p.text)
            ?.join("\n") || "";

        return new Response(
            JSON.stringify({ description: textContent }),
            {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    } catch (error: any) {
        console.error("Analyze reference error:", error);
        return new Response(
            JSON.stringify({ error: error.message || "Erro interno" }),
            {
                status: 500,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            }
        );
    }
});
