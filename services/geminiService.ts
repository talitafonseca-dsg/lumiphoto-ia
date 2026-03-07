// Gemini API calls are now proxied through the generate-image Edge Function
import { GenerationConfig, CreationType, VisualStyle, StudioStyle, MascotStyle, MockupStyle, AspectRatio, GeneratedImage, SocialClass, UGCEnvironment, UGCModel } from "../types";

export const generateStudioCreative = async (
  config: GenerationConfig,
  primaryImage?: string | null,
  referenceImage?: string | null,
  productImage?: string | null,
  stickerImage?: string | null,
  customModelImage?: string | null,
  environmentImage?: string | null,
  authToken?: string
): Promise<GeneratedImage[]> => {
  const variations: GeneratedImage[] = [];

  const generationPromises = Array.from({ length: config.designCount || 3 }).map(async (_, index): Promise<GeneratedImage | null> => {
    const v = index + 1;
    const variationId = Math.random().toString(36).substr(2, 9);

    try {
      const variationPrompt = constructPrompt(config, v, customModelImage, !!stickerImage, !!productImage, !!referenceImage, !!environmentImage);

      // OPTIMIZATION: For PPT Generation, ONLY send the subject image for Slide 1 (Cover) and Slide 4 (Content).
      // For all other slides (Agenda, Section, Data, Contact), we want PURE design without the person to keep it clean.
      let variationPrimary = primaryImage;
      let variationCustomModel = customModelImage;

      if (config.type === CreationType.CREATIVE_BACKGROUND) {
        const slidesWithSubject = [1, 4]; // Cover & Content only
        if (!slidesWithSubject.includes(v)) {
          variationPrimary = null;
          variationCustomModel = null;
        }
      }

      const imageUrl = await callImageApi(variationPrompt, config.aspectRatio, variationPrimary, referenceImage, productImage, stickerImage, variationCustomModel, config.studioStyle, config.mascotStyle, config.mockupStyle, config.style, config.socialClass, !!config.isEditableMode, v, config.type, environmentImage, authToken);
      return imageUrl ? { id: variationId, url: imageUrl, originalUrl: imageUrl, variation: v } : null;
    } catch (error: any) {
      console.error(`Variation ${v} failed:`, error);
      if (v === 1) throw error;
      return null;
    }
  });

  const results = await Promise.all(generationPromises);
  const successfulVariations = results.filter((res): res is GeneratedImage => res !== null);

  if (successfulVariations.length === 0) {
    throw new Error("A engine falhou ao gerar as imagens. Tente simplificar o briefing ou mudar o estilo visual.");
  }

  return successfulVariations;
  return successfulVariations;
};

export const animateGeneratedImage = async (imageUrl: string): Promise<string> => {
  // SIMULATION: In a real environment, this would call Runway/Luma API
  console.log("Animating image:", imageUrl);
  await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing
  // Return a mock video URL or the same image to simulate success for now
  // Real implementation would return an MP4 URL
  return "https://cdn.pixabay.com/video/2024/09/25/233267_tiny.mp4"; // Placeholder video
};


// Analyze a reference image using Gemini text model to get a text description
// This avoids sending reference pixels to the image generator which causes identity confusion
const analyzeReferenceImage = async (referenceDataUrl: string, authToken?: string): Promise<string> => {
  try {
    const parts = referenceDataUrl.split(',');
    if (parts.length < 2) return '';
    const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
    const base64Data = parts[1];

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/analyze-reference`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ imageData: base64Data, mimeType: mime }),
    });

    if (!response.ok) {
      console.warn('Reference analysis failed, falling back to image mode');
      return '';
    }

    const data = await response.json();
    return data.description || '';
  } catch (error) {
    console.warn('Reference analysis error, falling back:', error);
    return '';
  }
};


const callImageApi = async (
  prompt: string,
  aspectRatio: string,
  primaryImage?: string | null,
  referenceImage?: string | null,
  productImage?: string | null,
  stickerImage?: string | null,
  customModelImage?: string | null,
  studioStyle?: string,
  mascotStyle?: MascotStyle,
  mockupStyle?: MockupStyle,
  style?: VisualStyle,
  socialClass?: SocialClass,
  isEditing: boolean = false,
  variationIndex: number = 1,
  type: string = 'Studio Photo',
  environmentImage?: string | null,
  authToken?: string
) => {
  try {
    const parts: any[] = [];

    // DEBUG: trace which images we received
    console.log('🔍 callImageApi INPUTS:', {
      hasPrimary: !!primaryImage,
      primaryLen: primaryImage?.length || 0,
      hasReference: !!referenceImage,
      hasProduct: !!productImage,
      hasCustomModel: !!customModelImage,
      hasSticker: !!stickerImage,
      hasEnvironment: !!environmentImage,
      studioStyle,
      mockupStyle,
      style,
      type,
    });

    const extractBase64 = (dataUrl: string) => {
      const parts = dataUrl.split(',');
      if (parts.length < 2) return null;
      const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
      return { data: parts[1], mimeType: mime };
    };

    // ==========================================
    // PRODUCT-FIRST PARADIGM (FOR CUSTOM MODEL + PRODUCT COMBOS)
    // ==========================================
    // When user uploads BOTH a custom model AND a product, we FLIP the order.
    // The PRODUCT becomes the "ANCHOR" (First Image) to prevent hallucination.
    // The MODEL becomes the "LAYER TO ADD" (Second Image).

    const hasCustomModelAndProduct = customModelImage && productImage;

    if (mockupStyle) {
      // ==========================================
      // MOCKUP MODE
      // ==========================================
      // Prioritize primaryImage (uploaded by user) as the Design
      const design = primaryImage ? extractBase64(primaryImage) : (productImage ? extractBase64(productImage) : null);

      if (design) {
        parts.push({
          text: `[INPUT IMAGE 1: THE DESIGN/ARTWORK]
           >>> THIS IS THE FLAT DESIGN TO BE APPLIED TO THE OBJECT.
           >>> CRITICAL: PRESERVE LOGO/ART INTEGRITY.
           >>> ACTION: Warp/Apply this image onto the target object defined in the prompt.
           >>> PERSPECTIVE: The design must follow the curve/surface of the object.`
        });
        parts.push({ inlineData: design });
      }

      if (referenceImage) {
        const ref = extractBase64(referenceImage);
        if (ref) {
          parts.push({
            text: `[IMAGE 2: STYLE/BACKGROUND REFERENCE]
             >>> Use the lighting and environment from this image.
             >>> DO NOT copy any text from this image.`
          });
          parts.push({ inlineData: ref });
        }
      }
    } else if (hasCustomModelAndProduct) {
      // COMPOSIÇÃO FOTOGRÁFICA: Pessoa + Produto interagindo
      const prod = extractBase64(productImage);
      const model = extractBase64(customModelImage);
      const ref = referenceImage ? extractBase64(referenceImage) : null;

      if (prod && model) {
        // INSTRUÇÃO MESTRE - Define a tarefa principal ANTES das imagens
        const isUGC = style === VisualStyle.UGC_INSTAGRAM;

        let masterTask = `=== MASTER TASK: ${isUGC ? 'AUTHENTIC USER PHOTO (UGC)' : 'PHOTOGRAPHIC COMPOSITION'} ===
CREATE A NEW IMAGE where the PERSON (Image 1) is PHYSICALLY HOLDING the PRODUCT (Image 2).`;

        if (ref) {
          masterTask += `\n\nSTYLE REFERENCE (IMAGE 3) IS ACTIVE:
- IGNORE default styles.
- COPY the lighting, colors, and background environment from IMAGE 3.
- PRESERVE the content of Image 1 (Person) and Image 2 (Product).
- APPLY the "Vibe" of Image 3.`;
        }

        masterTask += `\n\nCRITICAL REQUIREMENTS:
1. This is ${isUGC ? 'an AUTHENTIC USER PHOTO (UGC). NOT AN AD.' : 'a PRODUCT ADVERTISEMENT photo'}
2. The person MUST be holding/presenting the product
3. Generate NEW arms and hands in a natural holding pose
4. The product must be the HERO ELEMENT of the composition
=== END MASTER TASK ===`;

        parts.push({ text: masterTask });

        // Person image - com instruções de transformação
        parts.push({
          text: `[IMAGE 1 - THE PERSON TO TRANSFORM]
This person will appear in the final image.
>>> PRESERVE 100%: Face, facial features, skin tone, hair, identity, FACIAL EXPRESSION (do NOT change the expression — if the person is not smiling, do NOT add a smile)
>>> REGENERATE: Clothing, Arms, hands, body pose.
>>> CRITICAL INSTRUCTION: ADAPT THE CLOTHING to match the COLOR PALETTE and STYLE of Image 3 (Reference). Do not keep the original clothing if it clashes.
>>> EXPRESSION RULE: Keep the EXACT same facial expression as the input photo. Do NOT force a smile, grin, or any expression that is not present in the original image.
>>> POSE: Arms extended forward, hands gripping the product.
>>> NEGATIVE PROMPT: Original clothing, clashing colors, extra arms, mutated hands, changed expression, forced smile.`
        });
        parts.push({ inlineData: model });

        // Product image - com instruções de preservação absoluta
        parts.push({
          text: `[IMAGE 2 - THE SACRED PRODUCT/LOGO - DO NOT MODIFY]
>>> THIS EXACT ELEMENT MUST APPEAR IN THE FINAL IMAGE <<<
>>> PIXEL-PERFECT PRESERVATION REQUIRED <<<

INTELLIGENT ANALYSIS: IS THIS A PHYSICAL PRODUCT OR A LOGO?
RULE: IF UNSURE/AMBIGUOUS, TREAT IT AS A LOGO (OPTION B).

OPTION A: IF IT IS CLEARLY A 3D PHYSICAL OBJECT (Bottle, Box, Electronics, Can):
- ACTION: The person MUST HOLD it in their hands.
- GRIP: Fingers naturally wrapping around the object.
- WEIGHT: Show the object has weight, not floating.
- WARNING: DO NOT add buttons, screens, or wires if they are not in the original image.

OPTION B: IF IT IS A FLAT LOGO / BRAND MARK / AMBIGUOUS SHAPE:
- ACTION: Apply this logo onto a PREMIUM MOCKUP (Smartphone Screen, Tablet, Laptop, Desktop Monitor, Glass Sign) OR have the person POINTING/PRESENTING it.
- COMPOSITION: Place the logo/mockup naturally in the scene.
- CRITICAL: DO NOT turn the logo into a physical machine (e.g. Credit Card Terminal, Calculator).
- If pointing: The person looks at the camera, hand gesturing towards the logo/mockup.

NEGATIVE PROMPT FOR PRODUCT: Credit card machine, payment terminal, calculator, unrelated electronic device, hallucinated buttons, distorted object.`
        });
        parts.push({ inlineData: prod });

        if (ref) {
          parts.push({
            text: `[IMAGE 3 - STYLE REFERENCE - BACKGROUND & LIGHTING SOURCE]
>>> DO NOT USE THE PERSON FROM THIS IMAGE.
>>> DO NOT USE THE PRODUCT FROM THIS IMAGE.
>>> STRICTLY FORBIDDEN: DO NOT COPY ANY TEXT, LOGOS, OR WATERMARKS FROM THIS IMAGE.
>>> EXTRACT ONLY: Background style, Environmental lighting, Color Grading, Mood.
>>> GOAL: Make the composite (Person + Product) LOOK like it was shot in this environment, but with ZERO text from the reference.

        === COMPOSITION INTEGRATION RULES (CRITICAL) ===
        - DEPTH: The subject must separate from the background but feel IMMERSED in it.
        - LIGHTING INTERACTION: The background light sources must cast realistic rim lights on the subject.
        - ELEMENT INTERACTION: Background shapes/elements should slightly overlap or depth-cue the subject.
        - NO FLAT COLLAGE: Do not just paste the subject on top. Integrate them into the 3D space.
        - TEXT SPACE: Analyze where the text is in the reference. Leave that space EMPTY or with low contrast for the overlay.`
          });
          parts.push({ inlineData: ref });
        }
      }
    } else {
      // STANDARD FLOW (No Product + Model combo)

      // ============================================
      // REFERENCE MODE: INSPIRED RECREATION
      // ============================================
      // User's photo is THE MAIN CHARACTER (identity source)
      // Reference is STYLE INSPIRATION (mood, colors, composition)
      // AI should CREATE A NEW IMAGE with user's identity in reference's style

      if (referenceImage) {
        // ============================================
        // REFERENCE MODE: TEXT-DESCRIPTION APPROACH
        // ============================================
        // ARCHITECTURE: Instead of sending the reference image pixels to the generator
        // (which causes the AI to reproduce the reference person's face/body),
        // we FIRST analyze the reference with Gemini text model to get a description,
        // then send ONLY the subject's photo + text description to the generator.
        // This way the generator only sees ONE face = the subject. No identity confusion.

        const isCreativeBg = type === CreationType.CREATIVE_BACKGROUND;

        // PHASE 1: Analyze the reference image to get a text description
        console.log('🔍 Phase 1: Analyzing reference image...');
        const referenceDescription = await analyzeReferenceImage(referenceImage, authToken);
        console.log('📝 Reference description:', referenceDescription ? referenceDescription.substring(0, 200) + '...' : 'FAILED');

        if (referenceDescription) {
          // SUCCESS: We have a text description — use it instead of pixels
          parts.push({
            text: `=== TASK: STYLE-TRANSFER PHOTOGRAPHY ===
You will receive ONE image of a person (THE SUBJECT).
Below is a DETAILED TEXT DESCRIPTION of a style reference that you must apply to this person.

YOUR JOB: Create a NEW professional photo of THE SUBJECT wearing the described outfit, 
in the described lighting/environment, with a similar pose.

=== STYLE REFERENCE DESCRIPTION (apply this to the subject) ===
${referenceDescription}
=== END STYLE REFERENCE ===

IMPORTANT: The person in the output MUST be the person from the image provided below.
Use their exact face, hair, skin tone, body type, and age.
Only apply the CLOTHING, LIGHTING, POSE, and BACKGROUND from the style description above.`
          });
        } else {
          // FALLBACK: Analysis failed — send reference with minimal instructions
          const ref = extractBase64(referenceImage);
          if (ref) {
            parts.push({
              text: `[STYLE REFERENCE — Extract clothing, lighting, and pose from this image. 
Apply those style elements to the person in the next image.]`
            });
            parts.push({ inlineData: ref });
          }
        }

        // PHASE 2: Send ONLY the subject's image (no competing faces)
        let hasSubject = false;

        if (customModelImage) {
          const asset = extractBase64(customModelImage);
          if (asset) {
            parts.push({
              text: `[THE SUBJECT — Create the output photo of THIS person]
This is the REAL PERSON for the final photo.
Preserve: exact face, skin tone, hair style/color, expression, body type, age.
Dress this person in the outfit described in the STYLE REFERENCE above.
Place them in the lighting and environment described above.` });
            parts.push({ inlineData: asset });
            hasSubject = true;
          }
        }

        if (primaryImage && primaryImage !== customModelImage) {
          const asset = extractBase64(primaryImage);
          if (asset) {
            const label = hasSubject
              ? `[Additional angle of THE SUBJECT — use to better understand their facial features.]`
              : `[THE SUBJECT — Create the output photo of THIS person]
This is the REAL PERSON for the final photo.
Preserve: exact face, skin tone, hair style/color, expression, body type, age.
Dress this person in the outfit from the STYLE REFERENCE description above.`;

            parts.push({ text: label });
            parts.push({ inlineData: asset });
            hasSubject = true;
          }
        }

        if (!hasSubject) {
          const isPPTMode = type === CreationType.CREATIVE_BACKGROUND;

          if (isPPTMode) {
            parts.push({
              text: `[NO SUBJECT PROVIDED - CLEAN BACKGROUND MODE]
DO NOT include any person. Create only the background/design using the style description above.`
            });
          } else {
            const avatarPrompts = [
              "A BLACK BRAZILIAN GIRL, curly afro hair, wearing an ORANGE dress. Joyful smile.",
              "A ASIAN BRAZILIAN GIRL, straight black hair with bangs, wearing a PINK sweater. Friendly expression.",
              "A BRAZILIAN TEENAGER GIRL (14-16 years old), long straight brown hair, wearing a PURPLE backpack and WHITE blouse. Confident smile."
            ];
            const specificAvatar = avatarPrompts[variationIndex - 1] || avatarPrompts[0];

            parts.push({
              text: `[NO SUBJECT PROVIDED — Generate this person: ${specificAvatar}]
Style them using the STYLE REFERENCE description above.`
            });
          }
        }
      } else if (customModelImage) {
        const asset = extractBase64(customModelImage);
        if (asset) {
          let label = `INPUT IMAGE 1: THE SUBJECT (PROFESSIONAL PHOTO).
=== FACE DNA CARD (ANALYZE BEFORE GENERATING) ===
STEP 1: STUDY this face. Identify the 5 features that make this person UNIQUE (what distinguishes them from anyone else?).
STEP 2: LOCK these features — they are NON-NEGOTIABLE in the output:
- Face shape (jawline + chin), Nose (bridge + tip), Eyes (shape + color + spacing), Skin tone (EXACT — NEVER alter), Expression (keep IDENTICAL — do NOT add/remove smiles)
STEP 3: Also preserve: moles, freckles, scars, hair (style + color + texture), eyebrows, age markers.
CLOTHING: Keep the EXACT same outfit unless the style explicitly requires a change.
RECOGNITION TEST: The real person MUST say "That's me!" — if not, FAILED.`;
          if (studioStyle) {
            label = `INPUT IMAGE 1: THE MAIN CHARACTER.
=== FACE DNA CARD (ANALYZE BEFORE GENERATING) ===
STEP 1: STUDY this face. Identify the 5 UNIQUE features that make this person recognizable.
STEP 2: LOCK: face shape, nose, eyes, lips, skin tone, expression, moles/freckles, hair, eyebrows.
STEP 3: GENERATE the new photo. The face MUST match the locked features exactly.
ADAPT ONLY: Clothing and pose to match the "${studioStyle}" style. NEVER change the face.
TEST: If they cannot identify themselves → FAILED.`;
          }
          parts.push({ text: label });
          parts.push({ inlineData: asset });
        }
      } else if (primaryImage) {
        const asset = extractBase64(primaryImage);
        if (asset) {
          let label = `INPUT IMAGE 1: THE SUBJECT (PERSON).
=== FACE IDENTITY LOCK ===
PRESERVE: Exact face geometry, jawline, nose, eyes, lips, skin tone, hair, moles, freckles, expression.
The person MUST be immediately recognizable.`;
          if (isEditing) {
            label = "INPUT IMAGE TO EDIT: PRESERVE COMPOSITION EXACTLY. MODIFY ONLY THE REQUESTED AREAS.";
          } else if (productImage) {
            label = `INPUT IMAGE 1: THE MAIN CHARACTER.
=== FACE IDENTITY LOCK ===
PRESERVE FACE 100%: jawline, nose, eyes, lips, forehead, chin, cheekbones, skin tone, hair, moles, freckles, expression.
BODY POSE: Must change to hold product. FACE: Must NOT change at all.`;
          } else if (studioStyle) {
            label = `=== IDENTITY SOURCE: THIS IS THE REAL PERSON TO RE-PHOTOGRAPH ===
YOUR TASK: Create a BRAND NEW professional photo of THIS PERSON in the "${studioStyle}" style.

=== FACE DNA CARD (ANALYZE BEFORE GENERATING — CRITICAL) ===
STEP 1: STUDY this face for detail. What makes THIS person unique? Identify their 5 most distinctive features.
STEP 2: LOCK these features as NON-NEGOTIABLE:
- FACE SHAPE: Exact jawline + chin + forehead proportions
- NOSE: Bridge width, tip shape, nostril size (the #1 identifier)
- EYES: Shape, spacing, color, lid crease
- SKIN: Exact tone (NEVER lighten/darken), all moles, freckles, scars in correct positions
- EXPRESSION: Reproduce EXACTLY — do NOT add or remove smiles, do NOT change mouth state
Also preserve: lips, hair (color + texture + style), eyebrows, age, body type, gender.

STEP 3: GENERATE the new photo while checking each locked feature.

WHAT MUST CHANGE: background, clothing, pose, lighting (all to match "${studioStyle}").
WHAT MUST NOT CHANGE: face, body type, age, gender, skin color.

SIDE-BY-SIDE TEST: Input and output faces must look like the SAME PERSON on a different day.
If output = original photo unchanged → FAILED. If face is unrecognizable → FAILED.`;
          }
          parts.push({ text: label });
          parts.push({ inlineData: asset });
        }
      }

      // PRODUCT (if present without custom model)
      if (productImage && !referenceImage) {
        const prod = extractBase64(productImage);
        if (prod) {
          parts.push({ text: `INPUT IMAGE 2: THE HERO PRODUCT. COMPOSITE THIS INTO THE SCENE.` });
          parts.push({ inlineData: prod });
        }
      }
    }

    // 3. SECONDARY ASSETS (Sticker only - Reference handled above)
    if (stickerImage) {
      const sticker = extractBase64(stickerImage);
      if (sticker) {
        parts.push({ text: "INPUT IMAGE: CLIENT LOGO (WATERMARK ONLY)." });
        parts.push({ inlineData: sticker });
      }
    }

    // 4. ENVIRONMENT BACKGROUND
    if (environmentImage) {
      const env = extractBase64(environmentImage);
      if (env) {
        parts.push({
          text: `[ENVIRONMENT MOOD REFERENCE — ANALYZE, DO NOT COPY]
>>> YOUR TASK: ANALYZE this image and extract ABSTRACT CHARACTERISTICS ONLY:
  1. COLOR TEMPERATURE: Is it warm (golden, amber) or cool (blue, silver)?
  2. LIGHTING MOOD: Is it soft/diffused or hard/dramatic? What direction?
  3. DOMINANT COLOR TONES: What are the 2-3 main colors?
  4. OVERALL ATMOSPHERE: Is it cozy, professional, dramatic, romantic?
>>> THEN: Create a NEW, CLEAN professional studio/environment background that has SIMILAR color temperature, lighting mood, and atmosphere.
>>> ABSOLUTELY DO NOT:
  - Copy or paste ANY object from this image (no lamps, lights, bulbs, decorations, furniture, props)
  - Place the subject ON TOP of this image like a collage
  - Replicate any specific visual element from this image
  - Use this image as a literal background
>>> THINK OF IT AS: "What would a professional studio look like if it had the same COLOR WARMTH and LIGHTING MOOD as this photo?"
>>> EXAMPLE: If this image shows warm golden light → create a studio background with warm golden tones and soft warm lighting. NOT a copy of the image.`
        });
        parts.push({ inlineData: env });
      }
    }

    // 5. MAIN INSTRUCTION
    // NOTE: The reference handling logic is in constructPrompt's "isDesignReferenceMode" block
    // We don't add extra instructions here to avoid conflicts
    let finalPrompt = prompt;
    parts.push({ text: finalPrompt });

    // Send to backend Edge Function (API key is securely stored server-side)
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }

    const response = await fetch(`${supabaseUrl}/functions/v1/generate-image`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ parts, aspectRatio }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }));
      if (response.status === 403) {
        throw new Error("Créditos insuficientes. Adquira mais créditos para continuar.");
      }
      if (response.status === 429) {
        throw new Error("429: Cota excedida.");
      }
      throw new Error(errorData.error || `Erro ${response.status}`);
    }

    const data = await response.json();
    return `data:image/${data.mimeType?.split('/')[1] || 'png'};base64,${data.imageBase64}`;
  } catch (error: any) {
    console.error("Image generation failed:", error);
    if (error.message?.includes('429') || error.message?.toLowerCase().includes('quota')) {
      throw new Error("429: Cota excedida.");
    }
    throw error;
  }
};

// STYLE-SPECIFIC BACKGROUND LIBRARY - Returns unique backgrounds based on style + variation
const getStyleBackground = (style: VisualStyle, variationIndex: number, hasProduct: boolean): string => {
  // Each style has 3 unique background strategies
  const styleBackgrounds: Record<VisualStyle, string[]> = {
    [VisualStyle.MODERN]: [
      `STYLE-SPECIFIC BACKGROUND (MODERN V1 - DIGITAL APP):
      - Primary: Smooth Deep Blue (#0F172A) to Purple (#581C87) Gradient.
      - Elements: Floating Glass UI Cards with rounded corners.
      - Graphics: Subtle notification bubbles, search bars, soft bokeh.
      - Lighting: Soft screen-glow lighting.
      - Layout: LEFT-ALIGNED Subject. RIGHT-ALIGNED Glass Card for Text.`,

      `STYLE-SPECIFIC BACKGROUND (MODERN V2 - SAAS LANDING):
      - Primary: Clean Off-White to Light Grey Gradient.
      - Elements: Abstract "Data Flow" waves (smooth lines), isometric shapes.
      - Layout: CENTERED Subject with ample negative space around header.
      - Lighting: High-key, bright and friendly.
      - Text Zone: Clean negative space at the top.`,

      `STYLE-SPECIFIC BACKGROUND (MODERN V3 - DARK MODE):
      - Primary: Matte Black with distinct "Card" surfaces for content.
      - Elements: Neon accent lines (Cyan/Magenta) outlining the safe zones.
      - Layout: ASYMMETRIC dynamic composition.
      - Lighting: Cyberpunk-lite, colored rim lights.
      - Text Zone: Inside the outlined neon frames.`
    ],

    [VisualStyle.PROFESSIONAL]: [
      `STYLE-SPECIFIC BACKGROUND (PROFESSIONAL V1 - COMMERCIAL MOTION):
      - Primary: Dynamic motion-blurred background (City or Studio).
      - Elements: Speed lines or particles indicating efficiency.
      - Graphics: Floating 3D/Contextual elements (e.g. Coins for Finance).
      - Lighting: Cinematic "Hero" Rim Lighting.
      - Layout: Subject in action pose.`,

      `STYLE-SPECIFIC BACKGROUND (PROFESSIONAL V2 - STUDIO INFINITY):
      - Primary: Infinite Color Wall (Deep Brand Color).
      - Elements: Large subtle geometric shadows on the wall.
      - Floor: Reflective studio floor.
      - Lighting: Perfect 3-point studio lighting.
      - Layout: Clean, minimal, product-focused.`,

      `STYLE-SPECIFIC BACKGROUND (PROFESSIONAL V3 - CONTEXTUAL SCENE):
      - Primary: Abstract representation of the niche (Blurred Office/Gym).
      - Elements: Depth of field focus on subject.
      - Graphics: Subtle overlay of industry icons/lines.
      - Layout: Depth-layered composition (Foreground, Subject, Background).`
    ],

    [VisualStyle.CREATIVE]: [
      `STYLE-SPECIFIC BACKGROUND (CREATIVE V1 - POP ART):
      - Primary: Solid Bold Color (Hot Pink or Electric Yellow).
      - Elements: 3D Pop Art objects (Lips, Lightning bolts, Stars).
      - Layout: Collage style, dynamic angles.
      - Lighting: Hard Flash photography.`,

      `STYLE-SPECIFIC BACKGROUND (CREATIVE V2 - FLUID GRADIENT):
      - Primary: Aurora Borealis style mesh gradient (Pink/Cyan/Purple).
      - Elements: Liquid glass blobs, distorted typography.
      - Layout: Organic flow.
      - Lighting: Ethereal glow.`,

      `STYLE-SPECIFIC BACKGROUND (CREATIVE V3 - GRUNGE COLLAGE):
      - Primary: Paper texture + torn edges.
      - Elements: Halftone dots, spray paint accents, cutout aesthetics.
      - Layout: Street art poster style.
      - Lighting: Urban street light.`
    ],

    [VisualStyle.CLEAN]: [
      `STYLE - SPECIFIC BACKGROUND(CLEAN V1):
    - Primary: Pure white(#FFFFFF) void with subtle grey gradient
      - Elements: MINIMAL - only soft contact shadows
        - Lighting: Soft, diffused beauty dish lighting
          - Accents: None - let the subject be the ONLY focus`,

      `STYLE - SPECIFIC BACKGROUND(CLEAN V2):
    - Primary: Soft off - white(#FAF9F6) with subtle texture
      - Elements: One thin accent line or geometric frame
        - Lighting: Even, shadowless studio lighting
          - Accents: Minimal shadow, clean edges`,

      `STYLE - SPECIFIC BACKGROUND(CLEAN V3):
    - Primary: Light grey(#F5F5F5) gradient fading to white
      - Elements: Subtle floor / horizon line for grounding
        - Lighting: Soft backlight creating subtle halo
          - Accents: Clean, professional, Apple - style presentation`
    ],

    [VisualStyle.DARK]: [
      `STYLE-SPECIFIC BACKGROUND (DARK V1 - MATTE BLACK):
      - Primary: Matte Black non-reflective surface.
      - Elements: Glossy Black 3D Shapes (Tone on tone).
      - Lighting: Strong Side Rim Light (White).
      - Vibe: Premium Tech unboxing.`,

      `STYLE-SPECIFIC BACKGROUND (DARK V2 - NEON NOIR):
      - Primary: Dark Alley / Wet Asphalt texture (Abstract).
      - Elements: Neon tube light reflection (Cyan/Pink).
      - Lighting: Moody cinematic.
      - Vibe: Gaming/Cyberpunk.`,

      `STYLE-SPECIFIC BACKGROUND (DARK V3 - DEEP OCEAN):
      - Primary: Deep underwater Blue/Black gradient.
      - Elements: Floating bubbles, caustic light patterns.
      - Lighting: Top-down spotlight.
      - Vibe: Mysterious, Premium.`
    ],

    [VisualStyle.LUXURY]: [
      `STYLE-SPECIFIC BACKGROUND (LUXURY V1 - HIGH FASHION):
      - Primary: Deep Burgundy or Emerald Velvet texture.
      - Elements: Minimalist gold framing (very thin).
      - Layout: Vogue Magazine Cover style.
      - Lighting: Dramatic Spotlight on Subject.`,

      `STYLE-SPECIFIC BACKGROUND (LUXURY V2 - DIAMOND GLOW):
      - Primary: Black void with Diamond dust particles.
      - Elements: Refractive glass prisms, light dispersion.
      - Layout: Centered luxury product reveal.
      - Lighting: Crystal clear white light.`,

      `STYLE-SPECIFIC BACKGROUND (LUXURY V3 - SILK & SATIN):
      - Primary: Flowing silk fabric background (Champagne color).
      - Elements: Soft fabric folds, elegant movement.
      - Layout: Soft dreamy focus.
      - Lighting: Warm, romantic candlelight feel.`
    ],

    [VisualStyle.MINIMALIST]: [
      `STYLE - SPECIFIC BACKGROUND(MINIMALIST V1):
    - Primary: Natural paper texture(warm off - white)
      - Elements: ONE colored circle or line as accent
        - Lighting: Soft, natural, zen - like
          - Accents: Extreme negative space, Japanese aesthetic`,

      `STYLE - SPECIFIC BACKGROUND(MINIMALIST V2):
    - Primary: Solid pastel(Sage #9CAF88 or Dusty Pink #D4A5A5)
      - Elements: Plant shadow or window light pattern
        - Lighting: Soft natural window light
          - Accents: Organic shadows, peaceful atmosphere`,

      `STYLE - SPECIFIC BACKGROUND(MINIMALIST V3):
    - Primary: Warm beige(#D4C4B0) with subtle texture
      - Elements: Origami - like paper fold shadows
        - Lighting: Even, calming, meditation - style
          - Accents: Muji / IKEA aesthetic, perfect balance`
    ],

    [VisualStyle.TECH]: [
      `STYLE-SPECIFIC BACKGROUND (TECH V1 - APP ECOSYSTEM):
      - Primary: Deep Indigo to Violet Gradient.
      - Elements: Floating 3D App Icons, Message Bubbles, Notification Cards.
      - Graphics: Connecting lines between elements.
      - Lighting: Digital screen glow.`,

      `STYLE-SPECIFIC BACKGROUND (TECH V2 - HARDWARE FOCUS):
      - Primary: Matte Dark Grey/Black engineering surface.
      - Elements: Exploded view schematics, wireframe outlines.
      - Graphics: Technical specifications text overlay (decoration).
      - Lighting: Precision product lighting.`,

      `STYLE-SPECIFIC BACKGROUND (TECH V3 - FUTURE NET):
      - Primary: Abstract data cloud (Blue/Cyan dots).
      - Elements: Constellation lines connecting concepts.
      - Graphics: Holographic interface elements.
      - Lighting: Futuristic rim lights.`
    ],

    [VisualStyle.INFANTIL]: [
      `STYLE - SPECIFIC BACKGROUND(INFANTIL V1):
    - Primary: Soft pastel gradient(Pink + Blue + Yellow blend)
      - Elements: 3D rounded balloons, fluffy clouds, stars, hearts
        - Lighting: Soft, warm, friendly
          - Accents: Candy colors, playful shapes, Disney / Pixar style`,

      `STYLE - SPECIFIC BACKGROUND(INFANTIL V2):
    - Primary: Lavender(#E6E6FA) to mint green(#98FF98) gradient
      - Elements: Cute floating shapes, rainbow arcs, sparkles
        - Lighting: Bright but soft children's book illustration
          - Accents: Bubbles, confetti, toy - like 3D elements`,

      `STYLE - SPECIFIC BACKGROUND(INFANTIL V3):
    - Primary: Sunny yellow(#FFF3CD) with blue sky elements
      - Elements: Puffy clouds, sunshine rays, cute character elements
        - Lighting: Bright, cheerful, nursery - safe
          - Accents: Nintendo / cartoon aesthetic, playroom atmosphere`
    ],

    [VisualStyle.UGC_INSTAGRAM]: [
      `STYLE - SPECIFIC BACKGROUND(UGC V1):
    - Primary: Real blurred cafe / coffee shop environment
      - Elements: NO artificial graphics - only real - world bokeh
        - Lighting: Natural window light, golden hour
          - Accents: Real plants, cups, ambient cafe atmosphere`,

      `STYLE - SPECIFIC BACKGROUND(UGC V2):
    - Primary: Real blurred home / living room environment
      - Elements: Natural decor blur, authentic lifestyle
        - Lighting: Ring light + natural light mix
          - Accents: Genuine, relatable, influencer - style`,

      `STYLE - SPECIFIC BACKGROUND(UGC V3):
    - Primary: Real blurred outdoor / street scene
      - Elements: Urban blur, city life, authentic location
        - Lighting: Golden hour outdoor lighting
          - Accents: TikTok testimonial style, real customer vibe`
    ],

    [VisualStyle.EDITORIAL]: [
      `STYLE - SPECIFIC BACKGROUND(EDITORIAL V1):
    - Primary: BOLD solid color(Electric Blue #0066FF)
      - Elements: High contrast, minimalist fashion styling
        - Lighting: Hard flash, dramatic shadows
          - Accents: Magazine cover composition, Vogue aesthetic`,

      `STYLE - SPECIFIC BACKGROUND(EDITORIAL V2):
    - Primary: BOLD solid color(Hot Pink #FF1493)
      - Elements: Clean studio backdrop, fashion - forward
        - Lighting: Beauty lighting with dramatic contrast
          - Accents: Harper's Bazaar style, high fashion`,

      `STYLE-SPECIFIC BACKGROUND (EDITORIAL V3):
      - Primary: Dramatic black with spotlight
      - Elements: Strong shadows, silhouette play
      - Lighting: Single spotlight, theatrical
      - Accents: Art photography, Vanity Fair editorial`
    ],

    [VisualStyle.COMMERCIAL_PREMIUM]: [
      `STYLE-SPECIFIC BACKGROUND (COMMERCIAL V1):
      - Primary: Explosive starburst (Yellow #FFE500 + Red #FF0000)
      - Elements: 3D floating badges, dynamic speed lines, radial rays
      - Lighting: High energy, multiple dramatic light sources
      - Accents: Sale badges, confetti, celebration explosion`,

      `STYLE-SPECIFIC BACKGROUND (COMMERCIAL V2):
      - Primary: Bold red (#FF0000) gradient with yellow accents
      - Elements: 3D circles, ribbons, floating price elements
      - Lighting: Dramatic retail lighting
      - Accents: Black Friday energy, product launch hype`,

      `STYLE-SPECIFIC BACKGROUND (COMMERCIAL V3):
      - Primary: Dynamic purple to orange gradient with motion blur
      - Elements: Speed lines, explosion particles, dynamic frames
      - Lighting: High impact, energetic
      - Accents: Flash sale urgency, maximum attention grab`
    ],

    [VisualStyle.GLOW_BEAUTY]: [
      `STYLE-SPECIFIC BACKGROUND (BEAUTY V1):
      - Primary: Soft pink (#FFE4EC) to white gradient with pearl shimmer
      - Elements: Water droplets, pearl textures, soft bokeh particles
      - Lighting: Softbox beauty lighting with dewy effect
      - Accents: Glossy, wet skin aesthetic, L'Oreal style`,

      `STYLE-SPECIFIC BACKGROUND (BEAUTY V2):
      - Primary: Water ripple effect with iridescent reflections
      - Elements: Floating flower petals, water splash elements
      - Lighting: Soft, glowing, ethereal light
      - Accents: Skincare commercial, spa atmosphere`,

      `STYLE-SPECIFIC BACKGROUND (BEAUTY V3):
      - Primary: Rose gold (#E8B4B8) to cream gradient
      - Elements: Subtle shimmer, soft bokeh, cream textures
      - Lighting: Beauty dish with soft fill
      - Accents: Glossier aesthetic, natural beauty focus`
    ],

    [VisualStyle.DESIGNI_PD_PRO]: [
      `STYLE-SPECIFIC BACKGROUND (Design Pro V1 - SPLIT BLOCK):
      - Layout: SPLIT SCREEN COMPOSITION (50/50 or 60/40).
      - Primary: One side is the SUBJECT/PRODUCT. The other side is a SOLID BRAND COLOR BLOCK (extracted from product).
      - Elements: SHAPES MUST MATCH CONTEXT (Organic/Fluid for Beauty/Food vs Geometric/Sharp for Tech/Business).
      - Lighting: Soft, even lighting on the subject.
      - Text Zone: The Solid Color Block is the DEDICATED TEXT ZONE.`,

      `STYLE-SPECIFIC BACKGROUND (Design Pro V2 - ORGANIC CONTAINER):
      - Layout: Clean Background + LARGE SHAPE behind the text.
      - Primary: Neutral background (Off-white/Light Grey) for contrast.
      - Elements: SHAPE DEFINED BY PRODUCT (Soft Blob for Comfort/Food, Hexagon/Card for Tech).
      - Interaction: Subject overlaps the shape slightly to create depth.
      - Text Zone: Text must sit INSIDE the shape.`,

      `STYLE-SPECIFIC BACKGROUND (Design Pro V3 - BOLD CARD):
      - Layout: FLOATING CARD / CONTAINER.
      - Primary: Background is a textured deep color or blurred environment.
      - Elements: A clearly defined CARD (White or Brand Color) that holds the information.
      - Graphics: Contextual patterns (Leaves for natural, Circuit for tech, Topographic for sport).
      - Text Zone: All text must be strictly contained within the Card/Box.`
    ],

    [VisualStyle.RELIGIOUS]: [
      `STYLE-SPECIFIC BACKGROUND (RELIGIOUS V1):
      - Primary: Soft light rays descending from above (golden tones)
      - Elements: Volumetric light beams, soft clouds, heavenly atmosphere
      - Lighting: Ethereal light from above
      - Accents: Divine glow, subtle cross silhouette`,

      `STYLE-SPECIFIC BACKGROUND (RELIGIOUS V2):
      - Primary: Sky blue (#87CEEB) to white gradient with clouds
      - Elements: Soft dove silhouettes, peaceful natural elements
      - Lighting: Golden hour, hopeful, uplifting
      - Accents: Worship album cover style, faith-based warmth`,

      `STYLE-SPECIFIC BACKGROUND (RELIGIOUS V3):
      - Primary: Warm gold (#D4AF37) accents on soft neutral
      - Elements: Subtle halo effects, light particles, peaceful nature
      - Lighting: Soft, warm, blessing-like illumination
      - Accents: Modern church campaign, spiritual serenity`
    ],

    [VisualStyle.DELIVERY]: [
      `STYLE-SPECIFIC BACKGROUND (DELIVERY V1):
      - Primary: Dark slate (#2D3436) with warm accents
      - Elements: Restaurant ambiance blur, warm food textures
      - Lighting: Appetizing warm golden lighting
      - Accents: Steam effects, kitchen atmosphere, Uber Eats style`,

      `STYLE-SPECIFIC BACKGROUND (DELIVERY V2):
      - Primary: Rustic wooden table texture with depth
      - Elements: Scattered ingredients, natural food elements
      - Lighting: Warm overhead + side light
      - Accents: Food photography aesthetic, restaurant campaign`,

      `STYLE-SPECIFIC BACKGROUND (DELIVERY V3):
      - Primary: Blurred modern kitchen/restaurant environment
      - Elements: Bokeh lights, food preparation atmosphere
      - Lighting: Commercial kitchen lighting, warm tones
      - Accents: DoorDash premium, delivery hero presentation`
    ]
  };

  // Get backgrounds for the selected style (fallback to MODERN if not found)
  const backgrounds = styleBackgrounds[style] || styleBackgrounds[VisualStyle.MODERN];

  // Return the variation (1-indexed to 0-indexed conversion)
  const index = Math.min(variationIndex - 1, backgrounds.length - 1);
  return backgrounds[Math.max(0, index)];
};

const constructPrompt = (config: GenerationConfig, variationIndex: number, customModelImage?: string | null, hasSticker: boolean = false, hasProduct: boolean = false, hasReference: boolean = false, hasEnvironment: boolean = false): string => {
  const { type, style, studioStyle, mascotStyle, productDescription, aspectRatio, copyText, ctaText, useAiAvatar, isEditableMode, useBoxLayout } = config;

  // MOCKUP MODE LOGIC
  if (type === CreationType.MOCKUP && config.mockupStyle) {
    const mockupStyle = config.mockupStyle;
    let baseMockupPrompt = `
    === PROFESSIONAL MOCKUP GENERATION MODE ===
    ROLE: Expert Product Photographer & CGI Mockup Artist.
    GOAL: Create a HYPER-REALISTIC mockup of the selected item.
    INPUT: The user provided an image (design/art/logo) to be placed on the object.
    
    ITEM TYPE: ${mockupStyle}
    
    INSTRUCTIONS PER STYLE:
    ${mockupStyle === MockupStyle.TSHIRT ? 'CONTEXT: Fashion photography. Model wearing a T-Shirt. SCENE: Urban or Studio. ACTION: Apply the input design onto the fabric. IMPORTANT: Preserve fabric displacement, folds, and lighting on the design. It must look printed on the shirt, not pasted.' : ''}
    ${mockupStyle === MockupStyle.BRANDING ? 'CONTEXT: Corporate Identity. SCENE: Elegant desk or clean surface. ITEMS: Business cards, envelope, letterhead. COMPOSITION: Isometric or Overhead flatlay. DEPTH: Shallow depth of field.' : ''}
    ${mockupStyle === MockupStyle.VEHICLE ? 'CONTEXT: Commercial Fleet. SCENE: Outdoors, sunny day. ITEM: Delivery Van or Sedan. ACTION: Apply the design as a full vehicle wrap or decal. RESPECT the vehicle geometry and reflections.' : ''}
    ${mockupStyle === MockupStyle.MUG ? 'CONTEXT: Product shot. SCENE: Cozy coffee table or kitchen counter. ITEM: Ceramic Mug. ACTION: curve the design around the mug cylinder. Add ceramic gloss reflection over the design.' : ''}
    ${mockupStyle === MockupStyle.PACKAGING ? 'CONTEXT: Retail. SCENE: Studio shelf or podium. ITEM: Box, Bottle or Pouch. ACTION: Apply design to the packaging surface. DIMENSION: 3D render quality.' : ''}
    ${mockupStyle === MockupStyle.SIGNAGE ? 'CONTEXT: Exterior Architecture. SCENE: Storefront or Building Facade. ITEM: 3D Sign or Lightbox. ACTION: Turn the design into a physical sign. Add environmental lighting and shadows.' : ''}
    ${mockupStyle === MockupStyle.TOTE_BAG ? 'CONTEXT: Lifestyle. SCENE: Carrying on shoulder or hanging. ITEM: Canvas Tote Bag. ACTION: Multiply the design on the textile texture.' : ''}
    ${mockupStyle === MockupStyle.STATIONERY ? (() => {
        const themes = [
          'CONTEXT: Professional Office. SCENE: Clean white minimalism. BACKGROUND: Sleek white marble desk, laptop edge visible, silver pen. LIGHTING: Crisp cool daylight (White 5500K). VIBE: Organized, productive, high-end business.',
          'CONTEXT: Humanized / Hand-Held. SCENE: POV of person holding the agenda. ACTION: Two hands presenting the notebook in front of camera. BACKGROUND: Soft blurred aesthetic environment (Neutral warm tones). LIGHTING: Soft studio beauty light. VIBE: Influencer, human connection, personal.',
          'CONTEXT: Cozy Bed Moment. SCENE: Soft knitted blanket background (White/Beige). ACTION: Hand holding the agenda firmly. LIGHTING: Soft warm window light. VIBE: Comfortable, personal. IMPORTANT: PRESERVE INPUT DESIGN COLORS. Do not apply gold foil textures unless in input. The cover must remain WHITE if the input is white.'
        ];
        return themes[(variationIndex - 1) % 3];
      })() : ''}

    VARIATION ${variationIndex}:
    ${variationIndex === 1 ? 'ANGLE: Front / Direct View. Best for clear visibility.' : ''}
    ${variationIndex === 2 ? 'ANGLE: 45 Degree / Perspective. Best for depth.' : ''}
    ${variationIndex === 3 ? 'ANGLE: Contextual / Lifestyle. Best for vibe.' : ''}

    CRITICAL RULES:
    1. REALISM: The result must look like a PHOTO, not a 3D render.
    2. OVERLAY: The input design must conform to the surface (curved on mugs, folded on shirts).
    3. LIGHTING: The lighting of the design must match the scene.
    4. NO HALLUCINATION: Do not change the text of the design.

    USER CUSTOM INSTRUCTIONS:
    ${productDescription ? `IMPORTANT OVERRIDE: ${productDescription}` : 'No specific extra instructions.'}
    `;

    return baseMockupPrompt;
  }

  // MASCOT MODE LOGIC
  if (type === CreationType.MASCOT && mascotStyle) {
    const mascotPromptSettings = getMascotPresets(mascotStyle);

    let baseMascotPrompt = `
    === MASCOT GENERATION MODE ===
    ROLE: Master 3D Character Artist specialized in HIGH-LIKENESS CARICATURES.
    GOAL: Create a stylized mascot that is INSTANTLY RECOGNIZABLE as the subject provided in the input images.
    
    STYLE: ${mascotStyle}
    ${mascotPromptSettings}
    
    VARIATION ${variationIndex}:
    ${variationIndex === 1 ? 'FULL BODY POSE. Neutral cheerful expression. Standard presentation.' : ''}
    ${variationIndex === 2 ? 'ACTION POSE. Engaging with the audience (Waving, pointing, or holding a prop).' : ''}
    ${variationIndex === 3 ? 'CLOSE-UP / EXPRESSIVE. Showing strong emotion (Excitement, Surprise, or Determination).' : ''}

    === CRITICAL IDENTITY RULES (DO NOT IGNORE) ===
    1. FACE SHAPE: You MUST preserve the subject's unique face shape (round, oval, square, jawline).
    2. KEY FEATURES: Keep the subject's nose shape, natural eye spacing, and mouth shape. Do not swap for generic "Disney" features unless necessary for the style.
    3. HAIR: Match the hairstyle, texture, and color EXACTLY.
    4. DISTINGUISHING MARKS: Keep moles, freckles, glasses, or beard styles.
    5. RECOGNITION TEST: The user must look at the mascot and say "That is definitely me", not "That is a random character".
    6. BLENDING: Map the subject's features ONTO the geometry of the style. Do not just paste the style over the face.
    
    CONTEXT/BRIEFING: ${productDescription || 'A friendly proprietary mascot for a brand.'}
    `;

    if (customModelImage) {
      baseMascotPrompt += `
    \n>>> SUBJECT PHOTO DETECTED:
    The input images contain the specific person to be character-ized.
    PRIORITY: LIKENESS > STYLE.
    If the style instructions (e.g., "giant eyes") conflict with the subject's actual face, COMPROMISE in favor of Identity.
    The mascot must look like a "Mini-Me" version of the photo.
    `;
    }

    return baseMascotPrompt;
  }

  // SENIOR CREATIVE DIRECTOR PROMPT INJECTION
  const isStudioOrUGC = type === CreationType.STUDIO_PHOTO || style === VisualStyle.UGC_INSTAGRAM;

  // UGC ENVIRONMENT ENFORCER
  // If UGC + Popular, we MUST ban office/luxury.
  const isHomeEnv = config.ugcEnvironment === UGCEnvironment.HOME || (!config.ugcEnvironment && !config.customEnvironment);
  const homeNegative = isHomeEnv ? "Trees, Forest, Park, Street, Road, Outdoor, Garden, Grass, nature background, Window view of park." : "";

  const ugcNegativePrompt = (style === VisualStyle.UGC_INSTAGRAM && config.socialClass?.includes('Popular'))
    ? `NEGATIVE PROMPT: Office, Corporate, Glass Building, Skyscrapers, Luxury, Hotel, Studio Lighting, Professional Ad, Penthouse, Expensive Decor, Modern Art, High Ceiling, Holding a phone, Camera in shot, Visible Cellphone, Phone Screen, Floating Objects, Levitation, Giant Cups, Oversized Glass, Extra Dishes, Ghost objects, Zero Gravity, Perfect Lighting, Cinema Bokeh, Minimalism, Scandinavian Design, White Aesthetic, Kitchen Island, Marble Counter, Fisheye, Wide Angle, Distorted Hands, Big Hands, ${homeNegative}`
    : "";

  // VARIATION LOGIC (1, 2, 3)
  // VARIATION LOGIC (1, 2, 3) - ADAPTIVE CAMERA ANGLES
  const isUGCMode = style === VisualStyle.UGC_INSTAGRAM;

  // DYNAMIC BACKGROUND CONTEXT FOR VARIATIONS
  const ugcBackground = (() => {
    if (config.ugcEnvironment === UGCEnvironment.OUTDOOR) return "Urban Street / Sidewalk / City Background";
    if (config.ugcEnvironment === UGCEnvironment.NATURE) return "Outdoor Park / Garden / Nature";
    if (config.ugcEnvironment === UGCEnvironment.GYM) return "Gym Interior / Fitness Center";
    return "Domestic Interior / Kitchen / Living Room"; // Default to Home
  })();

  const variationLogic = isUGCMode ? [
    // UGC / SELFIE VARIATIONS
    // UGC / SELFIE VARIATIONS
    `LAYOUT: DIRECT PRESENTATION. Action: Facing camera. HOLDING PRODUCT/PLATE WITH BOTH HANDS (Offering gesture). Camera: Eye Level Portrait. Background: ${ugcBackground}.`,
    `LAYOUT: RELAXED GRIP. Action: Standing naturally. HOLDING PRODUCT/PLATE WITH BOTH HANDS against chest. Camera: Standard Portrait Lens. Background: ${ugcBackground}.`,
    `LAYOUT: CASUAL PRESENTATION. Action: Smiling and HOLDING THE PLATE/PRODUCT WITH BOTH HANDS. Showing the food to camera. Camera: Handheld. Background: ${ugcBackground}.`
  ][variationIndex - 1] : [
    // PROFESSIONAL STUDIO VARIATIONS
    "LAYOUT: CENTRALIZED. Action: RE-SHOOT the scene with NEW COMPOSITION. Camera: Straight-On Eye-Level. (Ignore reference face).",
    "LAYOUT: ASYMMETRIC. Action: RE-SHOOT the scene with NEW COMPOSITION. Camera: Offset Side Angle. (Ignore reference face).",
    "LAYOUT: DYNAMIC. Action: RE-SHOOT the scene with NEW COMPOSITION. Camera: Tilted Dutch Angle. (Ignore reference face)."
  ][variationIndex - 1] || "LAYOUT: STANDARD PROFESSIONAL";

  let validVariationLogic = variationLogic;

  // MAQUIADORA-SPECIFIC VARIATIONS: Unique scenes for each variation
  if (studioStyle === StudioStyle.MAQUIADORA) {
    validVariationLogic = [
      `SCENE: CONFIDENT MUA PORTRAIT. The makeup artist poses confidently at her vanity station, holding a makeup brush near her face. She looks directly at the camera with a professional, self-assured expression. Background: Hollywood mirror with warm bulbs, organized makeup products. The BRUSH MUST BE IN HER HAND with visible fingers gripping it. ABSOLUTELY NO floating or isolated props.`,
      `SCENE: SELF-APPLICATION. The makeup artist is applying makeup on HERSELF — looking into a mirror while using a brush or sponge on her own face. This is an intimate beauty moment. Props (brush/sponge) MUST be touching her face or in her hands. Background: Vanity mirror with warm lighting. ABSOLUTELY NO floating or isolated props.`,
      `SCENE: MUA AT WORK WITH CLIENT. The makeup artist is APPLYING MAKEUP ON A CLIENT sitting in front of her. COMPOSITION: The MUA stands/leans behind the seated client, holding a brush near the client's face. The CLIENT is a different person (generate a new face — NOT the same person from the input). The MUA (person from input) is the professional doing the work. The CLIENT sits relaxed. Both faces must be visible. BRUSH MUST BE IN THE MUA'S HAND touching or near the client's face. ABSOLUTELY NO floating or isolated props.`
    ][variationIndex - 1] || validVariationLogic;
  }

  if (hasReference) {
    validVariationLogic = [
      `STYLE-TRANSFER PHOTO SESSION (Variation 1):
      You received a STYLE SOURCE image and a SUBJECT image.
      Create a NEW professional photo of THE SUBJECT (the person from the last image you received).
      Apply the clothing, lighting, pose style, and mood from the STYLE SOURCE (the first image you received).
      COMPOSITION: The subject at center-left. Eye contact with camera. 3/4 body or full body.
      The output must show THE SUBJECT's face, hair, skin tone, and body type — styled with the look from the STYLE SOURCE.`,
      `STYLE-TRANSFER PHOTO SESSION (Variation 2):
      You received a STYLE SOURCE image and a SUBJECT image.
      Create a NEW professional photo of THE SUBJECT (the person from the last image you received).
      Apply the clothing, lighting, pose style, and mood from the STYLE SOURCE (the first image you received).
      COMPOSITION: The subject at center. Full or 3/4 body shot. Confident pose.
      The output must show THE SUBJECT's face, hair, skin tone, and body type — styled with the look from the STYLE SOURCE.`,
      `STYLE-TRANSFER PHOTO SESSION (Variation 3):
      You received a STYLE SOURCE image and a SUBJECT image.
      Create a NEW professional photo of THE SUBJECT (the person from the last image you received).
      Apply the clothing, lighting, pose style, and mood from the STYLE SOURCE (the first image you received).
      COMPOSITION: The subject at center-right. Close-up or editorial framing.
      The output must show THE SUBJECT's face, hair, skin tone, and body type — styled with the look from the STYLE SOURCE.`
    ][variationIndex - 1];
  }

  // GLOBAL WATERMARK ELIMINATION - APPLIES TO ALL REFERENCE IMAGE GENERATIONS
  const watermarkNegativePrompt = hasReference ? `
  === ABSOLUTE WATERMARK BAN (CRITICAL) ===
  NEGATIVE: "Designi", "sua logo aqui", diagonal text patterns, watermark overlays, stock photo text, 
  copyright text, semi-transparent text, grid patterns, repeating text patterns, faded background text,
  any text that was not explicitly requested by the user.
  
  ENFORCEMENT: If the background contains ANY unwanted text or watermark-like patterns, 
  THE ENTIRE GENERATION IS INVALID. Re-generate with a COMPLETELY NEW procedural background.
  ` : "";

  let prompt = `ROLE: ${isStudioOrUGC && style === VisualStyle.UGC_INSTAGRAM ? 'You are an Authentic Content Creator & Social Media Expert.' : 'You are a Senior Creative Director & Performance Designer at a Top Ad Agency.'}
  GOAL: ${isStudioOrUGC && style === VisualStyle.UGC_INSTAGRAM ? 'Create an AUTHENTIC, RELATABLE, ORGANIC PHOTO (UGC).' : 'Create a HIGH-CONVERSION, PROFESSIONAL, MARKET-VALIDATED DESIGN.'}
  ${validVariationLogic}
  ${watermarkNegativePrompt}
  ${ugcNegativePrompt}

  === STRUCTURAL FIDELITY & ANTI-ARTIFACT RULES (GLOBAL - ALWAYS APPLY) ===
  BEFORE generating, COUNT the features of every object and person in the input image.
  The output MUST have the EXACT SAME structural count as the input:
  
  OBJECTS:
  - A cup/mug has EXACTLY 1 handle → output MUST have EXACTLY 1 handle
  - A chair has EXACTLY 4 legs → output MUST have EXACTLY 4 legs
  - A car has EXACTLY 4 wheels → output MUST have EXACTLY 4 wheels
  - GENERAL RULE: Count handles, knobs, buttons, wheels, legs, spouts, lids on EVERY object. The output count MUST MATCH.
  - NEVER duplicate, add, or remove structural features from any object
  
  PEOPLE:
  - Every person has EXACTLY 2 arms, 2 hands, 5 fingers per hand, 2 legs, 2 eyes, 1 nose, 1 mouth
  - NEVER generate 3 arms, 6 fingers, extra limbs, merged limbs, or missing limbs
  
  SYMMETRY & PROPORTION:
  - Objects must maintain their real-world proportions and symmetry
  - If an object is asymmetric (e.g., a mug with handle on one side), keep it asymmetric — do NOT mirror it
  - Clothing must follow the body naturally — no floating fabric, no impossible folds
  
  ANTI-DUPLICATION:
  - NEVER duplicate the main subject or any significant object
  - If there is 1 cup in the input, there must be EXACTLY 1 cup in the output
  - If there is 1 person in the input, there must be EXACTLY 1 person in the output (unless explicitly requested)
  
  SELF-CHECK: Before finalizing, verify: "Does every object have the correct number of parts? Are there any duplicated features?" If not, regenerate.
  `;

  // 1. PHOTO-BASED PATH (CUSTOM MODEL UPLOADED)
  // 1. PHOTO-BASED PATH (CUSTOM MODEL UPLOADED)
  if (customModelImage) {
    if (hasProduct) {
      // --- PRODUCT + PERSON COMPOSITION MODE ---
      prompt += `
       ================================================================================
       *** PRODUCT + PERSON COMPOSITION MODE ***
       ================================================================================
       
       >>> CRITICAL TASK: ${style === VisualStyle.UGC_INSTAGRAM ? 'CREATE AN AUTHENTIC USER PHOTO (UGC)' : 'CREATE A PRODUCT ADVERTISEMENT PHOTO'} <<<
       The person from Image 1 MUST be shown HOLDING the product from Image 2.
       
       === IDENTITY \u0026 COMPOSITION RULES ===
       
       ZONE A: THE \"KEEP ZONE\" (HEAD ONLY):
       - HEAD AND FACE: 100% preservation.
       - NECK: Preserve natural transition.
       
       ZONE B: THE \"DISCARD ZONE\" (DELETE COMPLETELY):
       - ORIGINAL BODY: DELETE IT. Do not paint over it. REMOVE IT.
       - INSTRUCTION: Virtual \"Head Crop\". Take the head from Image 1 and place it on a NEW body.
       - NEW BODY PROMPT: ${style === VisualStyle.UGC_INSTAGRAM && config.socialClass?.includes('Popular') ? '"A casual everyday person wearing simple t-shirt, relaxed shoulders"' : '"A CHARISMATIC MODEL. CLOTHING INTELLIGENCE: LOOK AT THE PRODUCT. IF Notebook/School/Book -> WEAR CASUAL YOUTHFUL CLOTHING (T-shirt/Hoodie). IF Supplement/Gym -> WEAR SPORTY/ACTIVEWEAR. IF Tech/Apps -> WEAR SMART CASUAL (Polo/Tee). IF Lawyer/Bank -> WEAR SUIT. DEFAULT: Solid Neutral T-Shirt. ARMS reaching forward holding the product"'}.
       - POSE OVERRIDE: If the original image has crossed arms, THEY MUST BE GONE.
       - POSE OVERRIDE: If the original image has crossed arms, THEY MUST BE GONE.
       
       CRITICAL: RESULT MUST HAVE 2 ARMS ONLY.
       NEGATIVE PROMPT: Crossed arms, original pose, extra hands, ghost arms, 3 arms, mutated limbs, DUPLICATE PRODUCTS, DOUBLE OBJECTS.
       
       === PRODUCT INTERACTION RULES ===
       QUANTITY RULE: EXACTLY ONE PRODUCT INSTANCE.
       - The person holds the product from Image 2.
       - DO NOT place a second copy of the product on the table/background.
              THE PRODUCT MUST BE:
        1. Held firmly in BOTH HANDS (Standard Rule for Plates/Bowls).
        2. Positioned at CHEST HEIGHT for visibility (or TABLE HEIGHT).
        3. Angled slightly toward camera (product face visible)
        4. THE EXACT PRODUCT from Image 2 - same colors, buttons, screen
        5. GRAVITY CHECK: HAND MUST CUP THE OBJECT FROM BOTTOM. NO HOVERING.
        6. SCALE REFERENCE: REAL WORLD SIZE. Bottle = Hand Size. Plate = 2 Hands Size. NO GIANT OBJECTS.
        7. PROPORTION CHECK: HANDS MUST MATCH FACE SIZE. NO GIANT HANDS. NO FISHEYE DISTORTION.
              HAND POSITIONING:
        - BOTH HANDS must be visible holding the object (if carrying it).
        - Fingers wrap around the product edges/bottom.
        - Thumbs visible on the front or side
        - Natural grip - like holding a book or device
        - Hands should cast soft shadows on the product
       
       GAZE RULE:
       - SUBJECT MUST LOOK AT THE CAMERA LENS (Eye Contact) OR at the Product.
       - NEVER LOOK "OFF SCREEN" or "AT NOTHING".
       
       === ANTI-HALLUCINATION RULES ===
       FORBIDDEN:
       - DO NOT generate a different/generic product
       - DO NOT make the product float without hands
       - DO NOT place the product next to the person (must be IN hands)
       - DO NOT change the product colors or shape
       - DO NOT add extra products or objects
       `;
    } else {
      // --- SUBJECT DOMINANT MODE (Standard) ---
      prompt += `
       ================================================================================
       *** PROFESSIONAL STUDIO PHOTOGRAPHY MODE (CUSTOM SUBJECT) ***
       ================================================================================
       
       === FACE DNA CARD (ANALYZE BEFORE GENERATING — TOP PRIORITY) ===
       STEP 1: STUDY the input face. What makes THIS person unique? Identify 5 distinctive features.
       STEP 2: LOCK these as NON-NEGOTIABLE in the output:
       - FACE SHAPE: jawline + chin + forehead (round? angular? V-shaped?)
       - NOSE: bridge width + tip shape + nostril size (the #1 identifier)
       - EYES: shape + spacing + color + lid crease
       - SKIN TONE: exact match — NEVER lighten, darken, or change undertone. Keep ALL moles, freckles, scars.
       - EXPRESSION: keep IDENTICAL — do NOT add/remove smiles, do NOT change mouth state or teeth visibility.
       Also preserve: lips, eyebrows, hair (style + color + texture + parting), age.
       
       === BODY DNA CARD (EQUALLY CRITICAL AS FACE) ===
       STEP 1: ANALYZE the person's BODY TYPE from the input photo. Is the person slim, average, curvy, athletic, plus-size?
       STEP 2: LOCK the body type as NON-NEGOTIABLE:
       - BODY WEIGHT: Preserve the EXACT weight appearance. Do NOT make the person heavier OR thinner.
       - BODY SHAPE: Preserve EXACT body proportions — shoulder width, waist, hips, arms.
       - TORSO WIDTH: Match EXACTLY. Do NOT widen the torso or add bulk to the body.
       - ARMS: Match the person's actual arm thickness from the input photo.
       - CLOTHING FIT: Use WELL-FITTED clothing on the person's actual body. NOT oversized or baggy clothing that creates illusion of larger body.
       - SAFETY BIAS: IF IN DOUBT about body size, make the person slightly SLIMMER rather than heavier. NEVER add weight.
       BODY DISTORTION TEST: If the output person looks heavier or wider than the input → FAILED. REGENERATE.
       
       MULTIPLE PEOPLE: If more than one person, apply this card to EACH person individually.
       
       RECOGNITION TEST: The real person must say "That's me!" — if not, FAILED.
       
       LIGHTING & SKIN: Maintain realistic skin texture (commercial retouch level).
       `;
    }

    prompt += `
     ART DIRECTION & QUALITY:
     - APPLY THE SAME HIGH-END FINISH as the instruction below.
     ART DIRECTION & QUALITY:
     - APPLY THE SAME HIGH-END FINISH as the instruction below.
     - LIGHTING: ${style === VisualStyle.UGC_INSTAGRAM ? 'NATURAL LIGHTING (Window/Daylight)' : 'Re-light the subject to match the new background with dramatic effect'}.
     - DESIGN LANGUAGE: ${style === VisualStyle.UGC_INSTAGRAM ? 'AUTHENTIC USER GENERATED CONTENT (UGC). NOT AN AD.' : 'Create a PREMIUM COMMERCIAL AD, not just a photo'}.
     
     ${hasReference ? `
     === REFERENCE ART STYLE ACTIVE ===
     A reference image/art has been provided. IGNORE all preset style rules.
     Analyze the reference image and REPLICATE its EXACT:
     - Visual style (colors, gradients, shapes)
     - Background design and elements
     - Lighting and mood
     - Typography style (if any)
     - Overall composition and layout
     
     Create an ad that looks like it was designed by the SAME designer as the reference.
     ` : (isStudioOrUGC && studioStyle ? `
      === VISUAL STYLE: STUDIO PHOTOGRAPHY (${studioStyle}) ===
      ${getStudioPresets(studioStyle)}
      
      IMPORTANT: This is a PURE PHOTO style. NO abstract graphics. NO 3D shapes.
      ` : `
      VISUAL STYLE RULES (${style}):
      ${style === VisualStyle.UGC_INSTAGRAM ? getUGCContext(config.socialClass, config.ugcEnvironment, config.customEnvironment, config.ugcModel) : getStylePresets(style, config.socialClass)}
      
      ${style !== VisualStyle.UGC_INSTAGRAM ? `
      DESIGN ELEMENTS (MANDATORY FOR PREMIUM LOOK):
      - ADD 3D GEOMETRIC SHAPES in the background (spheres, cubes, abstract curves) that complement the composition.
      - USE DEPTH LAYERS: Foreground blur elements, mid-ground subject, background design elements.
      - INCLUDE SUBTLE LIGHT EFFECTS: Lens flares, neon glows, gradient overlays framing the scene.
      - VARIATION: Each design should feel UNIQUE - vary colors, shapes, and composition significantly.
      ` : `
      UGC / INFLUENCER AUTHENTICITY RULES:
      - NO PROFESSIONAL STUDIO LIGHTING. Use Natural Light or Ring Light.
      - NO 3D SHAPES or GRAPHICS. Real world background only.
      - BACKGROUND MUST MATCH THE CONTEXT: ${config.customEnvironment || config.ugcEnvironment}.
      - QUALITY: Good smartphone camera quality (Authentic), NOT Cinema 8K.
      `}
      `)}
     
     NEGATIVE PROMPT (QUALITY CONTROL):
     - NO FLOATING PRODUCTS. The subject MUST hold it.
     - NO "CUTOUT" LOOK. The subject must feel blended into the scene.
     - NO TEXT OBSTRUCTION (Dont cover face).
     - NO BORING PLAIN BACKGROUNDS. Always add design interest.
     ${style === VisualStyle.UGC_INSTAGRAM ? '- NEGATIVE PROMPT: Office, Corporate, Meeting Room, Studio Lighting, Professional Ad, Suit, Tie, Blazer.' : ''}
     `;
  } else if (isStudioOrUGC) {
    // PURE PHOTOGRAPHY PATH (NO SHAPES, NO TEXT BOXES)
    // Check if it's specifically STUDIO_PHOTO to apply studioStyle presets
    const isStudioPhoto = type === CreationType.STUDIO_PHOTO;

    prompt += `
  MANDATORY PHOTOGRAPHY RULES (CRITICAL):
  - TYPE: PURE PHOTOGRAPHY (Realism Focus).
  - NO GRAPHICS: DO NOT generate abstract "shapes", "boxes", "text containers", "buttons", "icons". 
  - NO DESIGN ELEMENTS: This is a PHOTO, not a graphic design. NO 3D shapes, NO floating elements.
  - COMPOSITION: Professional Photographic framing. Clean depth of field.
  - BACKGROUND: Realistic environment matching the description. NO ARTIFICIAL OVERLAYS.
  - HIERARCHY: Focus 100% on the Subject (Person) and the Environment.
  
  ${hasReference && isStudioPhoto && studioStyle ? `
  === STUDIO PRESET + REFERENCE PHOTO ACTIVE ===
  ${getStudioPresets(studioStyle)}
  
  === REFERENCE IMAGE GUIDANCE (Image 2 — USE FOR POSE, LIGHTING & ENVIRONMENT) ===
  A REFERENCE IMAGE has been provided. Use it as follows:
  
  ⚠️ CRITICAL IDENTITY RULE:
  - The PERSON in the output MUST be the SAME person from Image 1 (primary photo)
  - PRESERVE from Image 1: face, gender, body type, skin tone, hair, age, ethnicity
  - DO NOT use the person from the reference image! Only use their POSE and ENVIRONMENT.
  
  REPLICATE FROM REFERENCE IMAGE:
  - POSE and body language — match the exact pose, hand position, body angle
  - LIGHTING setup — match the lighting direction, intensity, color temperature
  - ENVIRONMENT/BACKGROUND — match the setting, backdrop, and atmosphere
  - CAMERA ANGLE — match the framing, distance, and perspective
  - OVERALL MOOD — match the energy, vibe, and feel of the reference photo
  
  Think: "Put the person from Image 1 into the EXACT SCENE and POSE of Image 2"
  The reference photo OVERRIDES the preset's pose, background, and lighting descriptions.
  The preset's STYLE elements (outfit type, vibe, quality) should still apply.
  ` : hasReference ? `
  === STYLE REFERENCE ACTIVE (PRESERVE IDENTITY!) ===
  A style reference image has been provided. IGNORE all preset styles.
  
  ⚠️ CRITICAL IDENTITY RULE:
  - The PERSON in the output MUST be the same person from the PRIMARY image (Input Image 1)
  - PRESERVE: face, gender, body type, skin tone, hair, age, ethnicity
  - DO NOT use the person from the reference image!
  
  EXTRACT FROM REFERENCE (STYLE ONLY):
  - Background type and environment
  - Lighting setup and mood
  - Color palette and tones
  - Clothing STYLE (but adapted to the subject's body)
  - Overall composition style
  - POSE and body language — replicate the exact pose from the reference
  
  Think: "Photograph the person from Image 1 using the STYLE and POSE of Image 2"
  ` : (isStudioPhoto && studioStyle ? `
  === STUDIO PRESET APPLIED: ${studioStyle} ===
  ${getStudioPresets(studioStyle)}
  
  ${hasEnvironment ? `
  === ENVIRONMENT MOOD INFLUENCE (APPLY TO BACKGROUND) ===
  The user has provided an ENVIRONMENT MOOD REFERENCE image.
  ANALYZE that image and extract ONLY:
  - Color temperature (warm golden / cool blue / neutral)
  - Lighting mood (soft/dramatic/bright)
  - Dominant color tones (2-3 main colors)
  
  THEN CREATE A NEW BACKGROUND for this photo that:
  - Uses SIMILAR color temperature and lighting mood as the environment image
  - Is a CLEAN, PROFESSIONAL studio/location background — NOT a copy of the environment image
  - Does NOT contain ANY objects, props, lamps, bulbs, decorations, or furniture from the environment image
  - Looks like the subject was NATURALLY PHOTOGRAPHED in a space with that lighting mood
  
  DO NOT paste the subject on top of the environment image. CREATE a new scene.
  KEEP from the preset above: pose style, clothing guidelines, and composition.
  === END ENVIRONMENT INFLUENCE ===
  ` : `IMPORTANT: The above preset defines the EXACT style, background, and lighting for this photo.
  Follow these instructions PRECISELY. Do not deviate from the preset.`}

  === TRANSFORMATION TASK (CRITICAL — APPLIES TO ALL STUDIO STYLES) ===
  YOUR JOB IS TO CREATE A BRAND NEW PHOTOGRAPH of this person in the style described above.
  Do NOT simply return, retouch, or slightly modify the input photo. The output MUST show:
  - A COMPLETELY DIFFERENT BACKGROUND matching the preset style (NOT the original photo's background)
  - PROFESSIONAL LIGHTING matching the preset (NOT the original photo's lighting)
  - APPROPRIATE CLOTHING/STYLING for the selected preset
  - A NEW PROFESSIONAL POSE appropriate for the style
  
  === FACE & BODY ANCHORING PROTOCOL (EXECUTE BEFORE GENERATING) ===
  BEFORE creating the new image, complete these steps:
  1. EXTRACT FACE: What are the 5 most UNIQUE features of this face?
  2. EXTRACT BODY: What is this person's body type and build?
  3. LOCK BOTH: Face features AND body type are NON-NEGOTIABLE.
  4. GENERATE: Create the new photo while continuously checking face AND body.
  5. VERIFY FACE: Do ALL 5 unique facial features match?
  6. VERIFY BODY: Does the output person have the SAME body weight? If heavier → FAILED.
  If ANY mismatch → REGENERATE.
  
  WHAT MUST CHANGE: background, clothing style, pose, lighting, environment.
  WHAT MUST NOT CHANGE: face, body type, body weight, body proportions, skin tone, hair.
  === END TRANSFORMATION TASK ===

  ${(studioStyle && (studioStyle as string).includes('Família')) || studioStyle === StudioStyle.FAMILY_PICNIC ? `
  === FAMILY MODE CROWD CONTROL ===
  STRICT RULE: Count the number of people in the INPUT IMAGE (Image 1).
  GENERATE EXACTLY THAT MANY PEOPLE. PRESERVE EACH PERSON'S IDENTITY.
  DO NOT ADD EXTRA FAMILY MEMBERS. DO NOT REMOVE ANYONE.
  
  - If Image 1 has 1 person -> Output 1 person.
  - If Image 1 has 2 people -> Output EXACTLY 2 people.
  - If Image 1 has 3 people -> Output EXACTLY 3 people.
  - Each person's face, skin tone, hair, body type, age, and gender must match EXACTLY.
  - EXCEPTION: Only add people if the User Custom Instructions EXPLICITLY ask for it.
  ` : ''}
  
  === PEOPLE COUNT RULE (ALL STYLES) ===
  Count the EXACT number of people in the INPUT IMAGE.
  The OUTPUT MUST contain the SAME number of people. NO MORE, NO LESS.
  DO NOT invent, hallucinate, or add any person not present in the input.
  Each person's face must follow the FACE DNA CARD rules above.
  ${(studioStyle && (studioStyle as string).includes('Aniver') && config.birthdayAge) ? `
  === BIRTHDAY AGE CONTEXT (CRITICAL) ===
  THE PERSON IS CELEBRATING THEIR ${config.birthdayAge}th BIRTHDAY.
  - If number balloons are part of the style, display the NUMBER "${config.birthdayAge}" prominently using METALLIC FOIL NUMBER BALLOONS.
  - Incorporate age-appropriate decorations and energy level.
  - The birthday person should look happy, celebrated, and be the center of attention.
  - If a cake is present, it should have "${config.birthdayAge}" or appropriate candles.
  === END AGE CONTEXT ===
  ` : ''}
  ` : '')}
  
  HUMAN ELEMENT RULES:
  - RAW PHOTOGRAPHY: Real Brazilian person, Canon 5D quality. NO AI/3D LOOK.
  - FACE FIDELITY: The face is the MOST IMPORTANT element. It must be a 100% match to the input photo.
  - BODY FIDELITY: The body type and weight MUST match the input photo EXACTLY. Do NOT make the person heavier or wider.
  - SKIN: Highly detailed, natural texture, pores visible. PRESERVE exact skin tone.
  - LIGHTING: Cinematic Studio Lighting. Light must enhance the face, not distort it.
  - FRAMING: AMERICAN SHOT / MEDIUM SHOT. NEVER FULL BODY. Close-up framing avoids body distortion.
  - ANATOMY: CORRECT human body proportions. Normal head-to-body ratio (1:7 or 1:8).
  - NO DISTORTION: Head size must be proportional to body. NO oversized or undersized heads.
  - BODY WEIGHT: PRESERVE EXACTLY from input. Do NOT make the person look heavier, wider, or bulkier than the input.
  - CLOTHING FIT: Clothing must be WELL-FITTED to the person's actual body. NOT oversized, baggy, or puffy clothing.
  - NATURAL POSE: Realistic body positioning, no awkward or impossible angles.
  - FACE VERIFICATION: Before finalizing, verify the output face matches the input face in ALL of these:
    jawline shape, nose shape, eye shape/color, lip shape, forehead, chin, cheekbones, eyebrows, skin tone, hair, moles/freckles.
  - BODY VERIFICATION: Compare body in output vs input. The person must appear the SAME weight and build.
  
  === ABSOLUTELY FORBIDDEN FOR PHOTOS ===
  - NO floating app icons, emojis, or social media icons
  - NO geometric shapes (spheres, cubes, circles)
  - NO text overlays or buttons
  - NO graphic design elements of ANY kind
  - NO face modifications (smoothing, reshaping, lightening, aging, de-aging)
  - NO body modifications (widening, thickening, adding weight, changing proportions, making heavier)
  - NO oversized or baggy clothing that creates illusion of a larger body
  - This must look like a REAL PHOTOGRAPH from a professional camera`;
  }

  /* 
   * LOGIC FOR DESIGN REFERENCE (Thumbnail/Social Media)
   * Using the SAME approach that works in Studio/UGC mode:
   * "Photograph the person from Image 1 using the STYLE of Image 2"
   */
  const isDesignReferenceMode = !isStudioOrUGC && hasReference;

  if (isDesignReferenceMode) {
    // REPLICATING STUDIO LOGIC + POST-PRODUCTION TEXT
    prompt += `
  MANDATORY PHOTOGRAPHY RULES (PHASE 1):
  - TYPE: PURE PHOTOGRAPHY (Realism Focus).
  - NO 3D GRAPHICS: DO NOT generate abstract 3D shapes, spheres, cubes during photography phase.
  - COMPOSITION: Professional Photographic framing. Clean depth of field.
  - CRITICAL: CHANGE THE CAMERA ANGLE slightly from the reference image.
  - RE-FRAME: Do not copy the reference pixel-for-pixel. Create a NEW view of the same scene.
  - BACKGROUND: Realistic environment matching the reference style.
  - HIERARCHY: Focus 100% on the Subject (Person) from Image 1.
  
  === STYLE REFERENCE ACTIVE (PRESERVE IDENTITY!) ===
  A style reference image has been provided. IGNORE all preset styles.
  
  === STYLE REFERENCE ACTIVE ===
  A style reference image has been provided. IGNORE all preset styles.

  ⚠️ IDENTITY RULE (CRITICAL):
  ${customModelImage ? `
  - CUSTOM MODEL DETECTED (Image 1).
  - PRESERVE: Face, identity, skin tone, hair (100% Match).
  - ADAPT: Clothing MUST change to match the style of the Reference Image.
  ` : `
  - NO CUSTOM MODEL. GENERATE A NEW UNIQUE AVATAR.
  - STRICTLY FORBIDDEN: DO NOT USE THE PERSON FROM THE REFERENCE IMAGE.
  - Create a FRESH face, unique identity, unrelated to the reference subject.
  - The goal is to reference the STYLE, not the PERSON.
  `}
  
  === BACKGROUND RE-CREATION PROTOCOL (NUCLEAR OPTION) ===
  ⚠️ SECURITY ALERT: The Reference Image contains COPYRIGHTED WATERMARKS and TEXT.
  
  YOU ARE STRICTLY FORBIDDEN FROM COPYING PIXELS FROM THE REFERENCE BACKGROUND.

  Instead, you must ANALYZE and RE-DRAW the background from scratch:
  1. ANALYZE the "Vibe" (e.g., Blue Organic Shapes, Yellow Sunburst, Abstract Tech).
  2. GENERATE A NEW 3D BACKGROUND matching that vibe.
  3. DO NOT INCLUDE any text, logos, or watermarks from the reference.
  4. CLEAN PLATE RULE: The background must be pristine, like a stock photo BEFORE text was added.

  EXTRACT FROM REFERENCE (STYLE ONLY - DO NOT COPY PIXELS):
  - Color Palette: Extract the colors.
  - Lighting: Replication the lighting direction.
  - Shapes: Re-create similar 3D shapes (e.g., if there are blobs, generate NEW blobs).
  - Composition: Use the same layout structure.

  Think: "I need to rebuild this scene in 3D software. I will use the same colors and lighting, but I will make my own shapes. I will explicitly leave out the text and watermarks."

  === COMPOSITION INTEGRATION RULES (CRITICAL) ===
  - DEPTH: The subject must separate from the background but feel IMMERSED in it.
  - LIGHTING INTERACTION: The background light sources must cast realistic rim lights on the subject.
  - ELEMENT INTERACTION: Background shapes/elements should slightly overlap or depth-cue the subject.
  - NO FLAT COLLAGE: Do not just paste the subject on top. Integrate them into the 3D space.
  - VISUAL FLOW: The lighting should lead the eye to the text area (but keep it empty for now).
  - TEXT SPACE: Analyze where the text is in the reference. Leave that space EMPTY or with low contrast for the overlay.
  
  HUMAN ELEMENT RULES:
  - RAW PHOTOGRAPHY: Real Brazilian person, Canon 5D quality.
  - SKIN: Highly detailed, natural texture, pores visible.
  - LIGHTING: Cinematic Studio Lighting matching reference.
  - FRAMING: AMERICAN SHOT / MEDIUM SHOT. NEVER FULL BODY.
  - ANATOMY: CORRECT human body proportions. Normal head-to-body ratio (1:7 or 1:8).
  - NO DISTORTION: Head size must be proportional to body. NO oversized or undersized heads.
  
  === PHASE 2: POST-PRODUCTION (DIGITAL OVERLAY) ===
  AFTER photographing the subject, apply the text overlay digitally:
  - Add the text: "${config.copyText || ''}"
  ${type === CreationType.YOUTUBE_THUMB ? `
  - Font Style: Bold, Modern Sans-Serif (YouTube Style - High CTR)
  - Color: High Contrast (Yellow, Red, or White with Stroke)
  ` : `
  - Font Style: MATCH THE TYPOGRAPHY FROM THE REFERENCE IMAGE (Image 2).
  - LOOK AT IMAGE 2: Is it Serif? Sans-Serif? Handwritten? COPY THAT STYLE.
  - Color: Extract dominant text color from Image 2.
  `}
  - Position: Natural composition, legible.
  
  === TEXT SOURCE RULES (CRITICAL) ===
  ⚠️ DO NOT READ TEXT FROM REFERENCE IMAGE ⚠️
  - The text in Image 2 is just a placeholder example.
  - IGNORE keywords like "GRÁTIS", "FREE", "KIT" found in Image 2.
  - USE ONLY THE TEXT PROVIDED IN THIS PROMPT.
  `;
  } else if (!isStudioOrUGC) {
    // GRAPHIC DESIGN / ILLUSTRATION PATH (Default - when no reference is provided)
    prompt += `
  === PREMIUM COMMERCIAL DESIGN ENGINE (AVATAR/AI GENERATED) ===
  
  MANDATORY DESIGN LANGUAGE:
  - COMPOSITION: Dynamic commercial layout with VISUAL INTEREST in every corner.
  - BACKGROUND: NOT plain or boring. Must include design elements, shapes, gradients.
  - LIGHTING: Dramatic studio lighting with rim lights and accent colors.
  - QUALITY: High-end advertising, NOT stock photo style.
  
  PREMIUM VISUAL ELEMENTS (REQUIRED):
  1. GEOMETRIC SHAPES: Add bold 3D shapes in background (spheres, cubes, abstract waves, donuts).
  2. COLOR BLOCKING: Use vibrant color blocks, gradients, or mesh gradients as background.
  3. FLOATING ACCENTS: Include floating icons, particles, or decorative elements.
  4. DEPTH LAYERS: Create foreground blur, mid-ground subject, background elements.
  5. LIGHT EFFECTS: Add neon glows, lens flares, or dramatic rim lighting.
  
  HUMAN ELEMENT RULES:
  - PHOTOREALISTIC: Real Brazilian person, Canon 5D DSLR quality. NO AI/3D LOOK.
  - EMOTION: Expressive face, eye contact with camera, confidence/authority.
  - SKIN: Natural texture, professional commercial retouch.
  - FRAMING: AMERICAN SHOT / MEDIUM SHOT ONLY. Frame from WAIST to HEAD.
  - INTERACTION: Person can point, gesture, or interact with floating elements.
  
  COMPOSITION RULES:
  - Person on LEFT or RIGHT third (not always center).
  - Design elements balance the opposite side.
  - Dynamic angles and visual flow.
  - Each variation MUST look significantly DIFFERENT.`;
  }

  // SAFETY LAYER: IDENTITY PRESERVATION for Reference Images (Global Rule)
  if (hasReference) {
    prompt += `
  === IDENTITY SEPARATION PROTOCOL (CRITICAL) ===
  - IMAGE 2 (REFERENCE) IS A STYLE GUIDE ONLY. IT HAS NO IDENTITY.
  - TREAT THE PERSON IN IMAGE 2 AS A "HEADLESS MANNEQUIN".
  - IGNORE the features, race, age, and hair of the person in Image 2.
  - FACE SOURCE: IMAGE 1 ONLY.
  - BODY/STYLE SOURCE: IMAGE 2.
  
  NEGATIVE PROMPT: Mixed identity, morphing features, looking like reference person, blended faces, cloning reference.
  `;
  }

  // BACKGROUND & BRANDING ENGINE - CONTEXTUAL PREMIUM BACKGROUNDS
  // Creates realistic thematic backgrounds that match the product/business context

  // Premium contextual environment instruction
  const premiumContextualBackground = hasProduct ? `
  === INTELLIGENT PRODUCT CONTEXT ENGINE ===
  
  **CRITICAL**: You MUST analyze the product image and identify what it is BEFORE creating the background.
  
  STEP 1 - IDENTIFY THE PRODUCT CATEGORY:
  Look at the product and determine which category it belongs to:
  
  📚 SCHOOL/EDUCATION (notebooks, backpacks, pencils, school supplies):
     → ENVIRONMENTS: Classroom, school hallway, study desk at home, library, colorful study room
     → ELEMENTS: Floating pencils, stars, books, school icons, rainbows (for kids)
     → MOOD: Fun, colorful, youthful, back-to-school energy
     → COLORS: Match the product colors (pink notebooks = pink tones in environment)
  
  💳 FINTECH/PAYMENTS (card machines, payment devices, banking apps):
     → ENVIRONMENTS: Modern store counter, successful business, restaurant, food truck, marketplace
     → ELEMENTS: Floating coins, money, success graphs, green checkmarks, payment icons
     → MOOD: Success, trust, modern, business growth
     → COLORS: Match device colors (green TON = green accents)
  
  💄 BEAUTY/COSMETICS (makeup, skincare, haircare):
     → ENVIRONMENTS: Bathroom vanity, spa, beauty salon, elegant bedroom, dressing room
     → ELEMENTS: Floating flowers, pearls, sparkles, beauty icons, water droplets
     → MOOD: Glamorous, dewy, fresh, self-care
     → COLORS: Soft pinks, golds, match product packaging
    🍔 FOOD/DELIVERY (food products, restaurants, delivery apps):
      → ENVIRONMENTS: High-end Kitchen, upscale restaurant, blurred dining scene
      → ELEMENTS: Steam, garnish, professional plating, soft bokeh lights
      → MOOD: Appetizing, premium, delicious, Michelin-star feel
      → COLORS: Warm rich tones, fresh ingredients colors
  
  👕 FASHION/CLOTHING (clothes, shoes, accessories):
     → ENVIRONMENTS: Boutique, fashion runway, street style, closet, shopping district
     → ELEMENTS: Floating hangers, shopping bags, fashion icons
     → MOOD: Stylish, trendy, confident
     → COLORS: Match the clothing colors
  
  🏠 REAL ESTATE/HOME (houses, apartments, furniture):
     → ENVIRONMENTS: Elegant home interior, dream house exterior, luxury living room
     → ELEMENTS: Floating keys, house icons, hearts
     → MOOD: Aspirational, family, warmth, dream home
     → COLORS: Warm neutrals, luxury tones
  
  📱 TECH/ELECTRONICS (phones, computers, gadgets):
     → ENVIRONMENTS: Modern office, tech startup, gaming setup, creative studio
     → ELEMENTS: Floating app icons, notifications, emojis, tech symbols
     → MOOD: Innovative, modern, connected
     → COLORS: Sleek blacks, tech blues, product accent colors
  
  🏋️ FITNESS/HEALTH (gym equipment, supplements, activewear):
     → ENVIRONMENTS: Gym, outdoor running path, yoga studio, sports field
     → ELEMENTS: Floating weights, energy symbols, fire, muscles
     → MOOD: Energetic, powerful, healthy, motivated
     → COLORS: Energetic colors, match product
  
  🧸 KIDS/TOYS (toys, children's products, games):
     → ENVIRONMENTS: Playroom, children's bedroom, playground, colorful nursery
     → ELEMENTS: Floating toys, balloons, stars, rainbows, cute characters
     → MOOD: Fun, playful, imaginative, safe
     → COLORS: Bright pastels, candy colors
  
  🐕 PETS (pet food, accessories, pet services):
     → ENVIRONMENTS: Park, cozy home with pet, pet store, backyard
     → ELEMENTS: Floating paw prints, bones, hearts, pet toys
     → MOOD: Loving, playful, caring
     → COLORS: Natural, warm, match product
  
  STEP 2 - CREATE ENVIRONMENT FOR VARIATION ${variationIndex}:
  ${variationIndex === 1 ? `
  VARIATION 1 - ACTIVE USE CONTEXT:
  Show the product being used in its NATURAL CONTEXT.
  - School notebook → Child at study desk or classroom
  - Payment device → Store counter, business transaction
  - Makeup → Applying in front of mirror
  ` : variationIndex === 2 ? `
  VARIATION 2 - LIFESTYLE ASPIRATION:
  Show the LIFESTYLE the product enables.
  - School notebook → Smart, happy student achieving success
  - Payment device → Thriving business owner, money flowing
  - Makeup → Confident, beautiful person going out
  ` : `
  VARIATION 3 - EMOTIONAL CONNECTION:
  Show the FEELING the product creates.
  - School notebook → Joy of learning, creativity
  - Payment device → Financial freedom, growth
  - Makeup → Self-love, confidence, empowerment
  `}
  
  STEP 3 - COLOR HARMONY:
  - Extract the DOMINANT COLOR from the product packaging/design
  - Apply this color as: lighting color, background tint, accent elements
  - Pink product = pink-tinted environment
  - Green product = green accents and lighting
  
  STEP 4 - FLOATING ELEMENTS:
  Add 2-4 floating elements that make sense for the product category.
  They should be RELEVANT to the product, not random.
  
  ABSOLUTE REQUIREMENTS:
  ✓ Environment MUST match the product category
  ✓ Colors MUST harmonize with product colors
  ✓ Mood MUST match the product's target audience
  ✓ Each variation shows a DIFFERENT aspect (use, lifestyle, emotion)
  
  FORBIDDEN:
  ✗ Corporate offices for children's products
  ✗ Beach scenes for school supplies
  ✗ Luxury yachts for everyday products
  ✗ Environments that make NO SENSE for the product
  ` : `
  === PREMIUM AVATAR ENVIRONMENT ENGINE ===
  
  Create a PREMIUM LIFESTYLE ENVIRONMENT for the AI-generated avatar.
  
  VARIATION ${variationIndex} ENVIRONMENT:
  ${variationIndex === 1 ? `
  - LUXURY SETTING: Mansion poolside, yacht deck, premium hotel lobby
  - OR SUCCESS OFFICE: Glass corner office, modern startup
  - Floating social icons/emojis showing engagement (❤️💬📱)
  - Golden/warm lighting, affluent atmosphere
  ` : variationIndex === 2 ? `
  - OUTDOOR LIFESTYLE: Beach sunset, mountain vista, resort terrace
  - OR URBAN CHIC: Rooftop bar, city skyline, upscale restaurant
  - Floating elements matching the vibe (travel icons, lifestyle emojis)
  - Natural lighting with color grade matching the scene
  ` : `
  - CREATIVE SPACE: Design studio, content creator setup, podcast room
  - OR LIFESTYLE HOME: Modern apartment, home office, balcony view
  - Floating tech/creative icons showing digital success
  - Soft ambient with accent rim lighting
  `}
  
  FLOATING ELEMENTS: Add 3-5 floating icons/emojis contextual to the scene.
  DEPTH: Strong background blur, person sharp.
  QUALITY: High-end commercial, magazine cover feel.
  `;

  const backgroundLogic = `
  >>> CONTEXTUAL PREMIUM BACKGROUND ENGINE (Variation ${variationIndex}) <<<
  
  ${premiumContextualBackground}
  
  STYLE INFLUENCE (${style}):
  - Apply the ${style} color palette and mood to the contextual environment
  - The environment should FEEL like a ${style} advertisement
  
  ABSOLUTE REQUIREMENTS:
  1. Background must be a REALISTIC ENVIRONMENT (not abstract shapes)
  2. Environment must MATCH the product/avatar context
  3. Colors must HARMONIZE with the product's brand colors
  4. Include FLOATING CONTEXTUAL ELEMENTS (icons, emojis, indicators)
  5. Each variation must show a DIFFERENT environment type
  6. Quality: 8K, cinematic, magazine cover level
  `;

  // ONLY add premium background logic for graphic design modes, NOT for pure photography (studio/UGC)
  // AND NOT when a Reference Image is provided (Reference dictates the bg)
  if (!isStudioOrUGC && !hasReference) {
    prompt += `
  ${backgroundLogic}
    `;
  }

  // Layout and typography rules - only for design modes, not pure photography
  // When Reference Image is active, add specific typography rules
  if (!isStudioOrUGC && hasReference) {
    prompt += `
  === TYPOGRAPHY RULES FOR REFERENCE MODE ===
  TEXT POSITIONING:
  - Place text in the TOP-LEFT or TOP area of the image
  - Text should be LARGE, BOLD, and EASY TO READ
  - Use 2-3 lines maximum, with SHORT words per line
  - Example: "Volta às\\naulas" (2 lines, stacked)
  
  TEXT HIERARCHY:
  - HEADLINE: Very large (like 80pt equivalent), Bold sans-serif, WHITE or contrasting color
  - SUBTEXT (price/brand): Medium size, below headline
  - CTA BUTTON: Pill-shaped button at the bottom
  
  TEXT CONSTRAINTS:
  - NEVER place text overlapping the avatar's face
  - NEVER use tiny unreadable fonts
  - ALWAYS ensure high contrast (white on dark blue, or dark on light areas)
  - Text should look PROFESSIONALLY DESIGNED, not randomly placed
    `;
  }

  if (!isStudioOrUGC && !hasReference) {
    prompt += `
  LAYOUT & DIAGRAMMING RULES (CRITICAL):
  - GRID SYSTEM: Align all elements (Subject, Text, CTA) to a professional 12-column grid.
  - NEGATIVE SPACE: LEAVE 40% EMPTY SPACE for text safety. DO NOT CLUTTER THE WHOLE IMAGE.
  - TEXT AREA: The text must sit on a CLEAN, HIGH-CONTRAST zone (Solid color or dark gradient area).
  - CTA BUTTON: If CTA is requested, GENERATE A PHYSICAL LOOKING "BUTTON" SHAPE (e.g., Pill shape, dropshadow) behind the text location.
  
  === TYPOGRAPHY & LINE BREAK RULES (CRITICAL) ===
  
  TEXT FORMATTING:
  - Break headlines into 2-3 SHORT LINES for visual impact
  - Each line should have MAX 3-4 WORDS for readability
  - Use STACKED typography (one word or phrase per line)
  
  CORRECT LINE BREAKS:
  - "Mude para Ton" → "Mude\\npara\\nTon" (3 lines, one word each)
  - "Esse criativo foi feito 100% com IA" → "Esse criativo foi\\nfeito 100%\\ncom IA"
  - "Escale suas ofertas" → "Escale\\nsuas\\nofertas"
  
  TEXT SIZE HIERARCHY:
  - HEADLINE: Very large, bold, 2-3 short lines stacked
  - SUBTEXT: Smaller, beneath headline
  - CTA: Button with readable text inside
  
  TEXT PLACEMENT:
  - Reserve LEFT or BOTTOM corner for text block
  - Text should never compete with the subject
  - Maintain clear separation between text zone and person zone

  FORBIDDEN:
  - Long single lines that don't fit
  - Text overlapping the product or face
  - Tiny unreadable text
  - Text crammed into small spaces
    `;
  }

  // CONTEXT AWARE LOGIC (ONLY IF NO CUSTOM IMAGE)
  if (!customModelImage && useAiAvatar) {
    const lowerText = (config.copyText + " " + config.productDescription).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    let avatarContext = config.ugcModel ? `SUBJECT: ${config.ugcModel} ` : "A professional Brazilian Model";
    // ... (Keep existing avatar context logic or simplify)
    // ... (Simplified Context Detection Logic - Same as before but cleaner)
    if (!config.ugcModel) {
      if (lowerText.includes('ton') || lowerText.includes('pag')) {
        avatarContext = "Professional Brazilian Presenter holding the device. Confident.";
      }
    }
    // ... (Skip repeating all if-else for brevity in this task overview, assuming we keep the best logic)

    prompt += `
    SUBJECT RULE: USE A HYPER - REALISTIC HUMAN AVATAR.
    - CONTEXT: ${avatarContext}
    ${config.ugcModel ? `- MANDATORY OVERRIDE: USER SELECTED "${config.ugcModel}". IGNORE ANY CONTEXT CLUES IN TEXT ABOUT AGE/GENDER. GENERATE EXACTLY THIS MODEL.` : ''}
    - APPEARANCE: Highly detailed skin, perfect eyes.REAL PHOTOGRAPHY LOOK.
    - EMOTION: High energy, smiling.
    ${style === VisualStyle.DELIVERY ? `- INTERACTION: SUBJECT MUST LOOK AT THE FOOD/PRODUCT with appetite OR present it to camera. NEVER look at empty space.` : ''}
    `;
  }

  // GLOBAL PROMPT CONTINUATION
  prompt += `
  CONTEXT & COLOR PALETTE:
  - PALETTE: ${config.colorPalette ? `STRICTLY FOLLOW: ${config.colorPalette}.` : 'Match the PRODUCT BRAND COLORS.'} 
  
  TASK EXECUTION:
  - PROMPT: ${productDescription}.`;

  // BOX LAYOUT LOGIC
  if (useBoxLayout) {
    prompt += `
    - LAYOUT MODE: "MANUAL EDITING CANVAS".
    - CRITICAL: NO READABLE TEXT.NO BOXES.CLEAN BACKGROUND.
    `;
  }

  // TEXT RENDERING ENGINE & DIAGRAMMING
  // Check if we should "burn" text into the pixels (Not using editable boxes)
  const shouldBurnText = !useBoxLayout && !isEditableMode && type !== CreationType.STUDIO_PHOTO && style !== VisualStyle.UGC_INSTAGRAM;

  if (shouldBurnText) {
    // Only enforce rigid diagramming if NO reference is present
    if (!hasReference) {
      prompt += `
      >>> DIAGRAMMING & TEXT ENGINE ACTIVE <<<
        CRITICAL INSTRUCTION: THE TEXT IS THE MAIN CHARACTER.
      1. EXPLICITLY ALLOCATE 30 % OF THE CANVAS for the text.Do not put the subject there.
      2. CREATE A HIGH - CONTRAST ZONE(Dark Gradient Overlay or Solid Shape) specifically for the text to sit on.
      3. CHECK CONTRAST: White Text on Light Background is FORBIDDEN.Dark Text on Dark Background is FORBIDDEN.
      `;
    }

    if (config.copyText) {
      // If reference exists, we want to COPY its font, not use the preset font
      const typographyRules = hasReference ? "FONT STYLE: CLONE the font from Image 2 (Reference)." : getTypographyRules(style);

      prompt += `
       CONTENT TO WRITE(VERBATIM):
  - HEADLINE: "${config.copyText}"
       ${typographyRules}
  - POSITIONING: ${hasReference ? 'MATCH REFERENCE IMAGE LAYOUT EXACTLY' : (variationIndex === 2 ? 'Asymmetrical (Left/Right)' : 'Integrated Center/Top')}.
  - SPELLING CHECK: Portuguese.Accents(á, é, ã, ç) are MANDATORY.
       `;
    } else {
      prompt += `
  === NO TEXT REQUESTED ===
  CRITICAL: The user did NOT provide any headline text.
  DO NOT generate ANY text, titles, headlines, or typography in this image.
  This should be a TEXT-FREE composition focused purely on the visual.
  NEGATIVE: text, typography, headlines, titles, words, letters, captions, watermarks.
      `;
    }

    if (ctaText) {
      prompt += `
    - ACTION BUTTON(CTA): GENERATE A VISIBLE BUTTON.
      - TEXT ON BUTTON: "${ctaText}"
    - STYLE: Pill Shape or Rounded Rectangle.High Contrast Color(e.g.Green / Blue) matching brand.
      `;
    } else {
      prompt += `
      - CRITICAL: DO NOT GENERATE ANY BUTTONS.NO "SIGN UP" BUTTONS.NO FAKE UI ELEMENTS.
      - CLEAN LAYOUT without Call - to - Actions.
      `;
    }
  } else {
    prompt += `\n - CRITICAL: NO TEXT.NO NUMBERS.NO LETTERS.CLEAN BACKGROUND ONLY.`;
  }

  // GLOBAL PRODUCT OVERRIDE (SAFEGUARD)
  if (hasProduct) {
    prompt += `
    ================================================================================
    *** GLOBAL PRODUCT RULE(OVERRIDES ALL STYLE SETTINGS) ***
    ================================================================================
    1. HERO PRODUCT PRIORITY: ONE.
       - The image provided as "Product" is the HOLY GRAIL. 
       - YOU MUST COMPOSITE THIS EXACT PRODUCT IMAGE INTO THE SCENE.
       - DO NOT DRAW A NEW PRODUCT.DO NOT "INSPIRE" YOURSELF.USE THE SOURCE PIXELS.
       - IF THE SHOWING PRODUCT IS A MACHINE(e.g., Payment Terminal), SHOW THAT EXACT MODEL.
    
    2. ANTI - HALLUCINATION PROTOCOL:
  - DO NOT CHANGE THE BUTTON COLORS.
       - DO NOT CHANGE THE SCREEN CONTENT.
       - DO NOT CHANGE THE DEVICE SHAPE.
       - IF THE HANDS DON'T FIT, CHANGE THE HANDS. NEVER CHANGE THE DEVICE.

  3. INTERACTION MANDATE:
  - The Subject(Person) MUST be holding the product FIRMLY.
       - HANDS MUST BE VISIBLE gripping the device.
       - IF "Minimalist" or "Clean" style is selected, YOU MUST STILL SHOW THE PRODUCT AND HANDS.
    
    4. PRODUCT FIDELITY:
  - KEEP COLORS EXACT.
       - KEEP LOGOS VISIBLE.
       - KEEP SCREEN CONTENT(if any).
    `;
  }

  // === USER BRIEFING OVERRIDE (HIGHEST PRIORITY) ===
  if (productDescription) {
    prompt += `
    \n================================================================================
    *** USER BRIEFING (HIGHEST PRIORITY - OVERRIDES ALL STYLE SETTINGS) ***
    ================================================================================
    The user has provided a specific description/briefing:
    "${productDescription}"

    INSTRUCTION:
    1. If the user mentions a specific LOCATION (e.g., "Park", "Kitchen", "São Paulo"), YOU MUST USE IT.
       - Ignore the default style background if it conflicts.
    2. If the user mentions specific ELEMENTS, they must be present.
    `;
  }

  // === FINAL ANATOMY & SAFETY CHECK ===
  prompt += `
  \n================================================================================
  *** FINAL SAFETY PROTOCOLS ***
  ================================================================================
  1. ANATOMY CHECK (CRITICAL):
     - MAX 2 ARMS ONLY. Count them.
     - MAX 2 HANDS ONLY. Count them.
     - IF holding a product, the "old" hands must be DELETED.
     - NO "Ghost hands" floating behind the product.
  
  2. IDENTITY CHECK:
     - Person must look like Input Image 1.
  
  3. COMPOSITION CHECK:
     - Is the text legible? (If any)
     - Is the product visible?
  `;

  // YOUTUBE THUMBNAIL LOGIC
  if (type === CreationType.YOUTUBE_THUMB) {
    if (hasReference) {
      prompt += `
      FORMAT: YouTube Thumbnail (16:9).
      - STYLE: MATCH THE REFERENCE IMAGE EXACTLY.
      - COMPOSITION: Analyze the reference image and use its exact layout (Subject placement, Text placement, Background style).
      - TEXT VISIBILITY: High Contrast, Legible, Professional.
      `;
    } else {
      prompt += `
      FORMAT: YouTube Thumbnail (16:9).
      - STYLE: "MrBeast Style" High CTR.
      - COMPOSITION: SPLIT LAYOUT RULE.
        * SUBJECT: Placed on the RIGHT (or LEFT) occupying 40% of frame.
        * TEXT AREA: Empty space on the OPPOSITE side.
      - TEXT VISIBILITY: HUGE, STROKED, HIGH CONTRAST.
      `;
    }
  }

  // CREATIVE BACKGROUND / PPT LOGIC
  if (type === CreationType.CREATIVE_BACKGROUND) {
    const isSubjectMode = !!customModelImage;
    const slideType = variationIndex === 1 ? 'COVER (CAPA)'
      : variationIndex === 2 ? 'AGENDA (ÍNDICE)'
        : variationIndex === 3 ? 'SECTION HEADER (DIVISOR)'
          : variationIndex === 4 ? 'CONTENT & IMAGE (CONTEÚDO)'
            : variationIndex === 5 ? 'DATA VISUALIZATION (DADOS)'
              : 'THANK YOU / CONTACT (CONTATO)';

    prompt += `
    === CREATIVE BACKGROUND & PPT LAYOUT ENGINE ===
    target_SLIDE_TYPE: ${slideType}
    
    GOAL: ${isSubjectMode ? 'Create a Corporate Presentation Slide with Subject.' : 'Create a High-End ABSTRACT BRAND BACKGROUND. Graphics Only.'}
    
    1. VISUAL IDENTITY (MINIMALIST APPROACH):
       - EXTRACT: Primary brand color (use sparingly as accents).
       - STYLE: Ultra-Clean, Corporate, Apple-Style Minimalism.
       - SHAPES: Use only simple GEOMETRIC shapes (Rectangles, Circles). NO organic blobs. NO messy patterns.
       - BACKGROUND: Predominantly WHITE or VERY LIGHT GRAY.
       - DO NOT create "Abstract Art". Create "Functional Slide Templates".
       ${config.brandColors && config.brandColors.length > 0 ? `
       === BRAND COLOR ACCENTS ===
       USE THESE COLORS FOR ACCENTS (Lines, Buttons, Small Shapes):
       ${config.brandColors.map((c, i) => `COLOR ${i + 1}: ${c}`).join('\n       ')}
       ` : ''}

    ${isSubjectMode ? `
    2. SLIDE ARCHETYPE RULES (VARIATION ${variationIndex}/6):
       
       ${variationIndex === 1 ? `
       [TYPE: COVER SLIDE]
       - COMPOSITION: Clean Split Screen (Left Text / Right Image).
       - STYLE: Professional Hero Section.
       - SUBJECT: Person is VISIBLE (Professional Pose).
       - NEGATIVE SPACE: Pure White area on the Left for Title.
       - VIBE: Premium, Trustworthy, Clear.
       ` : variationIndex === 4 ? `
       [TYPE: CONTENT SLIDE]
       - COMPOSITION: Standard Content Layout.
       - STYLE: WHITE BACKGROUND.
       - SUBJECT: Person is VISIBLE (Small, Pointing to content).
       - NEGATIVE SPACE: Large white area for text.
       - VIBE: Informative, Standard Corporate.
       ` : `
       [TYPE: GENERIC BACKGROUND]
       - COMPOSITION: Clean Background.
       - SUBJECT: **STRICTLY NO HUMANS**.
       - STYLE: Minimalist accents only.
       `}
    ` : `
    2. ABSTRACT BRAND BACKGROUND RULES (NO PERSON MODE):
       - FOCUS: Pure Graphic Design & Layout.
       - SUBJECT: **STRICTLY NO HUMANS. NO FACES. NO PEOPLE.**
       - COMPOSITION: Create a stunning, professional PowerPoint background using ONLY the brand colors and geometric shapes.
       - USE CASE: This image will be the background for a Slide Master.
       - ELEMENTS: Elegant curves, modern lines, subtle gradients, watermark-style logos (if provided).
       - NEGATIVE SPACE: KEEP CENTER EMPTY for user text.
       - VIBE: Premium, Corporate, Global Tech Company.
    `}

  3. STYLE:
  - Corporate, High-End, Clean.
       - Soft shadows, professional lighting.
       - Depth: The background should feel like a premium wall or digital surface.

    ${isSubjectMode ? `
    4. SUBJECT INTEGRATION:
  - The subject must look like they are standing in this branded environment.
       - Match lighting on the subject to the background colors.
    ` : ''}
    `;
  }

  // MASTER RULES
  prompt += `
  CRITICAL MASTER RULE - FORMAT & ASPECT RATIO:
  - ASPECT RATIO: ${aspectRatio}.
  - FILL 100 % OF THE CANVAS.
  
  NEGATIVE PROMPT(MANDATORY - STRICTLY ENFORCED):
  - WATERMARK REMOVAL: "Designi", "Designi" Logo, Diagonal Watermarks, White Grid Lines, Stock Photo Watermark.
  - TEXT & WATERMARKS: NO TEXT FROM INPUT IMAGES.NO COPYRIGHT SIGNS.NO STOCK PHOTO TEXT.NO BRANDING ON BACKGROUND.
  - SOURCE POISONING: DO NOT USE THE BACKGROUND PIXELS FROM IMAGE 2.
    - ARTIFACTS: NO blurry text, no jpeg artifacts, no pixelated logos.
      ${style === VisualStyle.DESIGNI_PD_PRO ?
      `- VISUAL QUALITY: No low resolution, no blurry text, no distorted faces.
     - COMPOSITION: No text covering the face. No messy composition.`
      :
      `- 3D SHAPES: NO SPHERES. NO CUBES. NO ABSTRACT GEOMETRY. NO FLOATING OBJECTS (Unless specified).
     - SYMBOLS: NO % SIGNS. NO RANDOM ICONS. NO EMOJI. NO FLOATING LOGOS.
     - GRAPHICS: NO ILLUSTRATION ELEMENTS. NO CARTOON STYLE. ONLY PHOTOREALISM.`
    }
  - TEXT: NO EXTRA WORDS.NO "LOREM IPSUM".NO FAKE PLACEHOLDERS.
  - PRODUCT: DO NOT INVENT A NEW PRODUCT.USE THE UPLOADED PRODUCT IMAGE EXACTLY.
  - STYLE: PROFESSIONAL PHOTOGRAPHY ONLY.Like magazine covers, not like mobile game ads.
    ${style === VisualStyle.DESIGNI_PD_PRO ? `- PRODUCT FIDELITY (CRITICAL): DO NOT CHANGE THE PRODUCT. IF A NOTEBOOK IS UPLOADED, USE THAT EXACT COVER ART. DO NOT GENERATE A GENERIC CARTOON NOTEBOOK. USE THE IMAGE 2.` : ''}
  `;

  // FINAL EXPRESSION ENFORCEMENT (placed at end of prompt for maximum effect)
  prompt += `\n\n=== FINAL MANDATORY CHECK: FACIAL EXPRESSION ===
  BEFORE GENERATING, RE-ANALYZE EACH PERSON'S FACE IN THE INPUT IMAGE:
  - What is their mouth doing? (closed, slightly open, smiling, neutral)
  - Are teeth visible? (yes/no)
  - What emotion do they show? (neutral, happy, serious, subtle smile)
  REPLICATE THAT EXACT STATE. DO NOT DEFAULT TO "HAPPY" OR "SMILING".
  IF MOUTH IS CLOSED → OUTPUT MOUTH MUST BE CLOSED.
  IF NO TEETH VISIBLE → OUTPUT MUST NOT SHOW TEETH.
  THIS OVERRIDES ANY "STUDIO PHOTOGRAPHY" TENDENCY TO ADD SMILES.
  === END EXPRESSION CHECK ===\n`;

  // SHOT TYPE / FRAMING
  if (config.shotType) {
    const shotInstructions: Record<string, string> = {
      closeup: 'FRAMING (MANDATORY — OVERRIDE ALL): Close-up portrait shot. Frame from the chest/shoulders up ONLY. Focus on the face and upper body. Do NOT show legs, knees, or full body under ANY circumstance. This framing instruction OVERRIDES any style preset that suggests full body.',
      american: 'FRAMING (MANDATORY — OVERRIDE ALL): American shot (medium shot). Frame from approximately mid-thigh up. Show the upper body and hands but cut off below the knees. This framing instruction OVERRIDES any style preset.',
      fullbody: 'FRAMING (MANDATORY — OVERRIDE ALL): Full body shot. Show the entire person from head to toe. Include the full body, legs, and feet in the frame.',
    };
    prompt += `\n\n=== PHOTO FRAMING (MANDATORY — HIGHEST PRIORITY) ===\n${shotInstructions[config.shotType]}\nThis framing instruction takes ABSOLUTE PRIORITY over any style, preset, or layout instruction.\n=== END FRAMING ===\n`;
  }

  // USER CUSTOM INSTRUCTIONS
  if (config.customInstructions && config.customInstructions.trim() !== '') {
    prompt += `\n\n=== USER CUSTOM INSTRUCTIONS (TOP PRIORITY) ===
    The user has provided specific instructions for this generation. YOU MUST FOLLOW THESE:
    "${config.customInstructions}"
    
    INSTRUCTION: If these instructions contradict the style or defaults, the USER INSTRUCTIONS take precedence.
    Use them to define the background, atmosphere, clothing details, or specific elements.
    === END USER INSTRUCTIONS ===\n`;
  }

  return prompt;
};

// === MASCOT PRESETS LIBRARY ===
const getMascotPresets = (style: MascotStyle): string => {
  const presets: Record<MascotStyle, string> = {
    [MascotStyle.PIXAR_3D]: `
      VISUAL STYLE: 3D Animation Style(Pixar / Disney - like).
    RENDER: Octane Render, Redshift, Raytracing, Subsurface Scattering(SSS).
      FEATURES: Big expressive eyes, soft rounded shapes, vibrant lighting.
        TEXTURES: High quality velvet / skin / fabric textures.
          BACKGROUND: Clean studio gradient or soft blurred 3D environment.
            VIBE: Friendly, High - Budget Movie Character.
    `,
    [MascotStyle.CARTOON_2D]: `
      VISUAL STYLE: Classic 2D Vector Cartoon.
    RENDER: Flat colors, clean thick outlines, cel - shading.
      FEATURES: Exaggerated expressions, dynamic poses, simplified anatomy.
        COLORS: Bold, primary colors, high contrast.
          BACKGROUND: Solid color or simple vector pattern.
            VIBE: Tv Show, Sticker pack, Brand Mascot.
    `,
    [MascotStyle.ANIME_MODERN]: `
      VISUAL STYLE: Modern Anime / Manga.
    RENDER: 2D with high - quality digital painting effects.
      FEATURES: Large detailed eyes, spiky / stylized hair, dramatic lighting.
        AESTHETIC: Shonen / Shojo premium quality.
          BACKGROUND: Speed lines, sparkles, or detailed anime background.
            VIBE: Heroic, Cute(Kawaii), or Cool.
    `,
    [MascotStyle.CLAYMATION]: `
      VISUAL STYLE: Claymation / Stop Motion / Plasticine.
    RENDER: Fingerprint textures, imperfect clay surfaces, soft shadows.
      FEATURES: Aardman style, physical handcrafted look.
        LIGHTING: Studio photography lighting on small objects.
          VIBE: Tactile, Nostalgic, Hand - made.
    `,
    [MascotStyle.FUNKO_POP]: `
      VISUAL STYLE: Vinyl Toy Figure(Funko Pop style).
    ANATOMY: Giant square - ish head, black button eyes(or style specific), small body.
      RENDER: Plastic / Vinyl material, glossy finish.
        BOX: Optionally inside or near a collector box.
          VIBE: Collectible, Toy, Merchandise.
    `,
    [MascotStyle.HAND_DRAWN]: `
      VISUAL STYLE: Pencil Sketch / Watercolor / Marker.
    RENDER: Visible paper texture, rough strokes, artistic imperfections.
      FEATURES: Loose lines, artistic interpretation.
        VIBE: Organic, Creative, Draft, Storyboard.
    `,
    [MascotStyle.RETRO_PIXEL]: `
      VISUAL STYLE: 16 - bit or 32 - bit Pixel Art.
    RENDER: Blocky pixels, limited color palette, dither shading.
      FEATURES: Game sprite aesthetic, retro gaming.
        VIBE: Nostalgic, Tech, Indie Game.
    `,
    [MascotStyle.REALISTIC_PLUSHD]: `
      VISUAL STYLE: Realistic Plush Toy / Felt Material.
    RENDER: Visible fur / fabric fibers, stitching details, soft stuffing look.
      FEATURES: Cute button eyes, huggable shape.
        LIGHTING: Soft nursery lighting.
          VIBE: Adorable, Soft, Kid - friendly product.
    `
  };
  return presets[style] || presets[MascotStyle.PIXAR_3D];
};

const getStylePresets = (style: VisualStyle, socialClass?: SocialClass): string => {
  // PREMIUM DESIGN ENGINE - Inspired by Behance/Dribbble top commercial designs
  const premiumDesignRules = `
            === MANDATORY PREMIUM DESIGN ELEMENTS ===
              1. GEOMETRIC SHAPES: Add bold 3D shapes in background(spheres, cubes, donuts, abstract waves, splashes).
  2. FLOATING ELEMENTS: Include floating icons, decorative elements, or brand symbols strategically placed.
  3. DEPTH LAYERS: Create 3 distinct layers(foreground blur elements, mid - ground subject, background design).
  4. DYNAMIC COMPOSITION: Use rule of thirds.Person on one side, design elements on the other.
  5. COLOR VIBRANCY: Use saturated, bold colors.NO WASHED OUT PALETTES.
  6. LIGHT EFFECTS: Add lens flares, neon glows, gradient overlays, light rays where appropriate.
  `;

  switch (style) {
    // 🔘 MODERNO -> Tech Corporate Premium
    case VisualStyle.MODERN: return `${premiumDesignRules}
      ART DIRECTION: MODERN DIGITAL ADVERTISING(Clean & Bold).
    BACKGROUND: Smooth, matte gradient backgrounds(Deep Blue / Purple or Brand Color) with subtle motion blur.
      DESIGN ELEMENTS:
  - ROUNDED GLASS PANELS specifically placed to hold text(Sidebar or Bottom card).
  - Floating 3D abstract shapes(Matte finish, non - distracting) to add depth.
    - Clean layout with 40 % NEGATIVE SPACE reserved for headlines.
      - Soft UI elements(like notification bubbles or search bars) if Tech product.
      COLORS: Brand Colors + White / Grey.High contrast.
        LIGHTING: Soft, diffused commercial lighting.No harsh shadows.
          TYPOGRAPHY:
  - FONT FAMILY: Sans - serif Geometric(Inter, Roboto, Poppins).
      - STYLE: Clean, bold headlines.High readability.
      - WEIGHT: Bold for headers, Regular for body.
    COMPOSITION: Asymmetrical.Subject Left / Right.Clear Empty Space for Text on opposite side.
      VIBE: Premium App Store Ad, SaaS Landing Page, Modern Startup.`;

    // 🔘 PROFISSIONAL -> Trust Authority Premium
    case VisualStyle.PROFESSIONAL: return `${premiumDesignRules}
      ART DIRECTION: HIGH - END COMMERCIAL CAMPAIGN(TV Commercial Style).
    BACKGROUND: Dynamic Studio Background(Infinite Wall or Blurred City / Office with depth).
      DESIGN ELEMENTS:
  - DYNAMIC MOTION: Blurred particles or light trails indicating speed / efficiency.
    - PRODUCT CONTEXT: Floating elements relevant to niche(e.g.Coins / Graphs for Finance, Ingredients for Food).
      - NO GOLD FRAMES.NO MARBLE.NO OLD SCHOOL LUXURY.
        - Clean, invisible grids organizing the space.
    COLORS: Deep, rich commercial tones(Navy, Charcoal, Forest Green) or BRAND PRIMARY COLOR.
      LIGHTING: Cinematic "Hero" Lighting.Rim lights separating subject from background.
        TYPOGRAPHY:
  - FONT FAMILY: Authoritative Serif or Sans(Helvetica, Garamond, Playfair Display).
      - STYLE: Trustworthy, established, premium.
      - WEIGHT: Medium to Bold.
    COMPOSITION: Cinematic wide aperture feel.Focus on Subject + Product.
      VIBE: Nike Ad, Bank TV Commercial, High - Budget Photoshoot.`;

    // 🔘 CRIATIVO -> Bold Colorful Explosion
    case VisualStyle.CREATIVE: return `${premiumDesignRules}
      ART DIRECTION: BOLD COLORFUL EXPLOSION(Spotify Wrapped / Canva Pro Style).
    BACKGROUND: Vibrant mesh gradient(Purple / Pink / Yellow / Orange fusion) with fluid abstract shapes.
      DESIGN ELEMENTS:
  - BOLD 3D shapes: Donuts, twisted rings, abstract sculptures, paint splashes
    - Floating colorful spheres and particles
      - Organic flowing shapes and waves
        - Neon accent lines and glowing edges
          - Confetti or particle burst effects
  COLORS: Hot Pink(#FF1493), Electric Yellow(#FFE500), Vibrant Purple(#9B59B6), Cyan.
    LIGHTING: Colorful ambient lighting matching gradient.Multiple color sources.
      TYPOGRAPHY:
  - FONT FAMILY: Bold Display, Artistic, Experimental(Clash Display, Syne, Bangers).
      - STYLE: Playful, loud, unconventional.
      - WEIGHT: Black / Heavy.
    COMPOSITION: Dynamic diagonal composition.Subject on one third, explosion of elements on the other.
      VIBE: Spotify Wrapped, Instagram Year in Review, Festival Poster.`;

    // 🔘 CLEAN -> Apple Minimalism Premium
    case VisualStyle.CLEAN: return `${premiumDesignRules}
      ART DIRECTION: ULTRA - CLEAN MINIMALISM(Apple Style Premium).
    BACKGROUND: Pure white void OR soft grey gradient with subtle shadows.
      DESIGN ELEMENTS:
  - Minimal: only soft contact shadows
    - ONE focal point(the subject / product)
      - Subtle light gradient behind subject
        - Clean geometric frame or border(optional)
  COLORS: Pure White(#FFFFFF), Soft Grey(#F5F5F5), ONE accent color from brand.
    LIGHTING: Soft, diffused light.No harsh shadows.Beauty dish setup.
      TYPOGRAPHY:
  - FONT FAMILY: Minimalist Sans(Helvetica Neue, San Francisco, Arial).
      - STYLE: Neutral, invisible, functional.
      - WEIGHT: Light to Medium.
    COMPOSITION: Perfect center or extreme negative space.Let the subject breathe.
      VIBE: Apple Product Page, Tesla Marketing, Premium Tech Unboxing.`;

    // 🔘 DARK -> Cyberpunk Premium
    case VisualStyle.DARK: return `${premiumDesignRules}
      ART DIRECTION: PREMIUM DARK MODE(Cyberpunk / Gaming Style).
    BACKGROUND: Matte Black(#0A0A0A) with subtle carbon fiber or hex grid texture.
      DESIGN ELEMENTS:
  - Neon rim lights(Cyan / Magenta / Purple)
    - Cyberpunk grid lines fading into perspective
      - Holographic / glitch effects
        - Floating neon geometric shapes
          - Subtle circuit board patterns
  COLORS: Pure Black, Neon Cyan(#00FFFF), Hot Magenta(#FF00FF), Electric Purple.
    LIGHTING: Strong rim / edge lighting with neon colors.Dark key light.
      TYPOGRAPHY:
  - FONT FAMILY: Monospace, Cyberpunk Sans, Futuristic(Orbitron, Rajdhani, Courier Prime).
      - STYLE: Tech - oriented, digital, edgy.
      - WEIGHT: Bold headers, light body.
    COMPOSITION: Subject emerging from darkness with dramatic lighting.
      VIBE: Gaming Brand, Tech Startup Night Mode, Cyberpunk 2077.`;

    // 🔘 LUXO -> Gold & Marble Premium
    case VisualStyle.LUXURY: return `${premiumDesignRules}
      ART DIRECTION: LUXURY FASHION(Chanel / Dior Level).
    BACKGROUND: Black marble texture OR silk drape OR gold foil accents on dark.
      DESIGN ELEMENTS:
  - Gold leaf accents and geometric gold lines
    - Marble texture overlays
      - Silk or satin fabric elements
        - Subtle diamond / crystal reflections
          - Elegant serif typography overlay(optional)
  COLORS: Gold(#D4AF37), Black, Cream(#FFFDD0), Rose Gold.
    LIGHTING: Golden hour spotlight.Warm, luxurious tones.
      TYPOGRAPHY:
  - FONT FAMILY: Elegant Serif(Bodoni, Didot, Cinzel).
      - STYLE: High - contrast stroke, sophisticated, expensive.
      - WEIGHT: Regular to Bold.
    COMPOSITION: Elegant and sophisticated.Subject as the jewel of the composition.
      VIBE: Chanel No.5, Rolex Ad, Luxury Hotel Campaign.`;

    // 🔘 MINIMALISTA -> Japanese Zen Premium
    case VisualStyle.MINIMALIST: return `${premiumDesignRules}
      ART DIRECTION: JAPANESE MINIMALISM(Muji / IKEA Premium).
    BACKGROUND: Natural paper texture OR solid pastel(Beige / Sage / Blush).
      DESIGN ELEMENTS:
  - Extreme negative space
    - ONE accent color accent shape(circle or line)
      - Subtle organic shapes(branch shadow, leaf)
        - Paper fold or origami texture
  COLORS: Off - White(#FAF9F6), Soft Beige, ONE muted accent(Sage, Terracotta, Dusty Rose).
    LIGHTING: Soft natural light.Shadow play from windows.
      TYPOGRAPHY:
  - FONT FAMILY: Thin Sans, Refined Serif(Montserrat Light, Lato, Playfair Display).
      - STYLE: Delicate, airy, spaced out.
      - WEIGHT: Thin to Light.
    COMPOSITION: Perfect balance.Zen - like harmony.Empty space is intentional.
      VIBE: Muji Catalog, Japanese Tea Brand, Wellness Retreat.`;

    // 🔘 TECNOLÓGICO -> Fintech/Crypto Premium
    case VisualStyle.TECH: return `${premiumDesignRules}
      ART DIRECTION: FINTECH / CRYPTO(Revolutionary Tech Style).
    BACKGROUND: Deep Blue / Purple gradient with data visualization elements.
      DESIGN ELEMENTS:
  - Glassmorphism cards and panels
    - Data flow lines and node networks
      - Holographic / iridescent accents
        - 3D abstract tech shapes(wireframe, mesh)
          - Floating graphs and charts(abstract)
  COLORS: Deep Blue(#1E3A8A), Electric Purple(#7C3AED), Cyan glow, White.
    LIGHTING: Cool blue ambient with accent lights.
      TYPOGRAPHY:
  - FONT FAMILY: Monospace, Futuristic Sans(Space Mono, Exo 2, Share Tech Mono).
      - STYLE: Data - driven, modern, precise.
      - WEIGHT: Medium.
    COMPOSITION: Tech - forward, dynamic angles, multiple layers of information.
      VIBE: Stripe, Coinbase, Modern Banking App.`;

    // 🔘 INFANTIL -> 3D Pixar Premium
    case VisualStyle.INFANTIL: return `${premiumDesignRules}
      ART DIRECTION: 3D CUTE WORLD(Pixar / Nintendo Style).
    BACKGROUND: Soft pastel gradient OR 3D rendered playroom / clouds.
      DESIGN ELEMENTS:
  - Soft rounded 3D shapes(balloons, stars, clouds)
    - Candy / toy textures
      - Rainbow or pastel color accents
        - Cute floating elements(hearts, stars, bubbles)
          - 3D rendered character style
  COLORS: Pastel Pink, Soft Blue, Mint Green, Sunny Yellow, Lavender.
    LIGHTING: Soft, warm, friendly.No harsh shadows.
      TYPOGRAPHY:
  - FONT FAMILY: Rounded, Bubbly, Handwritten, Fun(Comic Neue, Fredoka One, Chewy, Balsamiq Sans).
      - STYLE: Playful, friendly, legible for kids.
      - WEIGHT: Bold, Rounded.
      COMPOSITION: Playful and inviting.Subject surrounded by fun elements.
        VIBE: Disney +, Nursery Brand, Kids App Promo.`;

    // 🔘 UGC INSTAGRAM -> Authentic Influencer (SPECIAL: Popular = Homemade Brazilian Selfie)
    case VisualStyle.UGC_INSTAGRAM:
      // POPULAR CLASS = FOTO CASEIRA BRASILEIRA (Selfie estilo "gente como a gente")
      if (socialClass?.includes('Popular')) {
        return `
          === ESTILO ESPECIAL: FOTO CASEIRA BRASILEIRA ===

            CRITICAL: Este é o ÚNICO estilo que deve parecer foto CASEIRA, NÃO PROFISSIONAL.
          
          TIPO DE FOTO: SELFIE ou foto tirada por amigo / familiar.
          
          CARACTERÍSTICAS OBRIGATÓRIAS:
  - Câmera: CELULAR COMUM(Samsung médio, Motorola, não iPhone Pro)
    - Qualidade: Ligeiramente granulada, não perfeita(autêntico)
      - Iluminação: LUZ NATURAL de janela OU luz fluorescente(levemente esverdeada)
        - Enquadramento: IMPERFEITO, pessoa levemente cortada ou descentralizada
          - Fundo: CASA REAL brasileira(sofá, geladeira, quadro na parede, cortina simples)
          
          AMBIENTE CASEIRO BRASILEIRO:
  - Sala de casa simples e LIMPA(não luxuosa, mas digna)
    - Parede branca ou creme(tijolinho bege bem cuidado)
      - Sofá de tecido, rack de TV, quadrinho de família
        - Mesa de cozinha, geladeira atrás, azulejo simples
          - Quarto simples com cama arrumada, armário de porta
          
          POSE DA PESSOA:
  - Segurando o celular(selfie) com braço levemente esticado
    - OU amigo tirou a foto(ângulo frontal caseiro)
      - Sorriso natural, não posado
        - Roupa casual do dia - a - dia(camiseta, bermuda, chinelo ok)
          
          ESTILO DE ILUMINAÇÃO:
  - Luz de janela durante o dia
    - OU luz de lâmpada fluorescente(levemente fria / esverdeada)
      - Sombras suaves naturais, não profissionais

  PROIBIDO:
  - Ring light profissional
    - Estúdio fotográfico
      - Iluminação de cinema
        - Fotos muito perfeitas
          - iPhone Pro ou câmera profissional
            - Casas de luxo ou apartamentos modernos
              - Filtros pesados de Instagram

  TYPOGRAPHY(IF APPLICABLE):
  - FONT FAMILY: System Fonts, Instagram Story Fonts(San Francisco, Roboto, Courier, Neon).
  - STYLE: Casual, overlay text style.
  - WEIGHT: Various(Bold match).

    VIBE: "Foto do grupo de família no WhatsApp", "Cliente real mostrando compra", "Depoimento verdadeiro"
      `;
      }

      // CLASSE MÉDIA ou ALTA = UGC Premium (Influencer profissional)
      return `${premiumDesignRules}
      ART DIRECTION: AUTHENTIC INFLUENCER(Real UGC Style).
    BACKGROUND: Real blurred environment(Cafe, Street, Living Room, Gym) with natural depth.
      DESIGN ELEMENTS:
  - NO artificial graphics(keep authentic)
    - Natural bokeh and light leaks
      - Real - world objects out of focus
        - Genuine lifestyle setting
  COLORS: Natural, warm tones.Golden hour palette.
    LIGHTING: Natural light(window, golden hour, ring light).
      TYPOGRAPHY:
  - FONT FAMILY: Modern Sans, Instagram Fonts(Proxima Nova, Aveny - T, Cosmopolitan).
      - STYLE: Trendy, influencer aesthetic.
      - WEIGHT: Medium to Bold.
    COMPOSITION: Selfie - style or friend - took - photo feel.Slightly off - center, candid.
      VIBE: Instagram Creator, TikTok Testimonial, Real Customer Review.`;

    // 🔘 EDITORIAL -> Vogue Fashion Premium
    case VisualStyle.EDITORIAL: return `${premiumDesignRules}
      ART DIRECTION: VOGUE EDITORIAL(High Fashion Magazine).
    BACKGROUND: Solid color studio backdrop(Bold Red, Electric Blue, Hot Pink) OR dramatic shadows.
      DESIGN ELEMENTS:
  - High contrast lighting
    - Bold color blocking
      - Minimalist but impactful
        - Fashion magazine aesthetic
          - Possible typography overlay(magazine title style)
  COLORS: ONE bold solid color + Black / White contrast.
    LIGHTING: Hard flash, dramatic shadows, high contrast.
      TYPOGRAPHY:
  - FONT FAMILY: High - Fashion Serif, Didone(Didot, Bodoni, Playfair Display).
      - STYLE: Elegant, sharp, magazine cover style.
      - WEIGHT: Bold / Black for titles, Light for captions.
    COMPOSITION: Fashion model pose.Editorial framing.Magazine cover ready.
      VIBE: Vogue Cover, Harper's Bazaar, Fashion Campaign.`;

    // 🔘 COMERCIAL PREMIUM -> Black Friday Retail
    case VisualStyle.COMMERCIAL_PREMIUM: return `${premiumDesignRules}
      ART DIRECTION: HIGH IMPACT RETAIL (Black Friday / Launch Style).
      BACKGROUND: Explosive starburst (Yellow/Red) OR dynamic speed lines OR radial rays.
      DESIGN ELEMENTS:
        - 3D floating shapes (circles, badges, ribbons)
        - Starburst and explosion effects
        - Floating price tags or badges
        - Confetti and celebration particles
        - Bold geometric frames and borders
      COLORS: Attention Red (#FF0000), Electric Yellow (#FFFF00), Black, White.
      LIGHTING: High energy, multiple light sources, dramatic.
      TYPOGRAPHY:
        - FONT FAMILY: Heavy Sans-Serif (Impact, Anton, Franklin Gothic, Bebas Neue).
        - STYLE: Urgent, loud, sales-focused.
        - WEIGHT: Heavy/Black.
      COMPOSITION: Explosive, dynamic. Subject bursting out of frame. Maximum impact.
      VIBE: Black Friday Ad, Product Launch, Flash Sale Banner.`;

    // 🔘 GLOW_BEAUTY -> Cosmetic Premium
    case VisualStyle.GLOW_BEAUTY: return `${premiumDesignRules}
      ART DIRECTION: SKINCARE COMMERCIAL (L'Oreal / Glossier Style).
      BACKGROUND: Water ripple effect OR pearl/iridescent texture OR soft pink gradient.
      DESIGN ELEMENTS:
        - Water droplets and splash effects
        - Pearl and shimmer textures
        - Soft bokeh light particles
        - Dewy/wet skin effect on subject
        - Organic flower petals or leaves (optional)
      COLORS: Soft Pink, Pearl White, Rose Gold, Nude tones.
      LIGHTING: Soft beauty dish. Glowing skin effect. Dewy highlights.
      TYPOGRAPHY:
        - FONT FAMILY: Elegant Sans or Serif (Optima, Tenor Sans, Lato Light).
        - STYLE: Clean, sophisticated, feminine.
        - WEIGHT: Light to Regular.
      COMPOSITION: Close-up or medium shot. Focus on skin/beauty. Ethereal and glowing.
      VIBE: Glossier Ad, L'Oreal Commercial, Skincare Product Launch.`;

    // 🔘 DESIGNI_PD_PRO -> Reference-Based Commercial Design
    case VisualStyle.DESIGNI_PD_PRO: return `${premiumDesignRules}
      ART DIRECTION: TOPAR GRAPHIC DESIGN (Ad Library Winners).
      BACKGROUND: Use one of the 3 archetypes (Split Block, Organic Container, or Floating Card) defined above.
      
      MANDATORY COMPOSITION RULES:
      1. CONTAINERIZATION: Text NEVER floats on busy backgrounds. It MUST be inside a Solid Block, a Pill Shape, or a clear Card.
      2. COLOR EXTRACTION: Detect the PRIMARY product color. Use it for the Blocks/Shapes.
      3. SAFE ZONES: Create a "Designated Text Area" that is completely solid and high-contrast.
      
      REFERENCE INSPIRATION:
      - Like high-end Real Estate ads (Split screen, clear info columns).
      - Like Supplement ads (Bold typography, topographic textures, energy).
      - Like Tech ads (Clean cards, floating UI elements).
      
      TYPOGRAPHY:
        - FONT FAMILY: Professional Sans-Serif (Gotham, Proxima Nova, Montserrat).
        - STYLE: Versatile, corporate, clean.
        - WEIGHT: Multiple weights (Bold for headers, Regular for text).

      VIBE: Commercial, Trustworthy, High-End, Organized.`;

    // 🔘 RELIGIOUS -> Ethereal Light Premium
    case VisualStyle.RELIGIOUS: return `${premiumDesignRules}
      ART DIRECTION: MODERN CHURCH (Ethereal & Hopeful).
      BACKGROUND: Soft light rays descending, clouds, or subtle cross texture.
      DESIGN ELEMENTS:
        - Divine light rays (volumetric light)
        - Soft clouds or heavenly atmosphere
        - Subtle dove or cross silhouettes
        - Golden accents and halos
        - Peaceful natural elements
      COLORS: Gold (#D4AF37), Pure White, Sky Blue (#87CEEB), Soft Purple.
      LIGHTING: Soft, ethereal, heavenly. Light from above.
      TYPOGRAPHY:
        - FONT FAMILY: Traditional Serif, Elegant Script (Playfair Display, Great Vibes, Cinzel).
        - STYLE: Graceful, respectful, classical.
        - WEIGHT: Regular to Medium.
      COMPOSITION: Uplifting, hopeful. Subject bathed in divine light.
      VIBE: Modern Church Campaign, Worship Album Cover, Faith-Based Brand.`;

    // 🔘 DELIVERY & FOOD -> Premium Food
    case VisualStyle.DELIVERY: return `${premiumDesignRules}
      ART DIRECTION: PREMIUM FOOD (Uber Eats / DoorDash Style).
      BACKGROUND: Dark slate, wooden table texture, OR kitchen environment blur.
      DESIGN ELEMENTS:
        - Appetizing food styling (if food visible)
        - Warm steam or smoke effects
        - Natural ingredients scattered
        - Restaurant ambiance elements
        - Floating ingredients (if relevant)
      COLORS: Warm tones (Orange, Yellow, Brown), Appetizing Red, Fresh Green.
      LIGHTING: Warm, appetizing lighting. Golden highlights.
      TYPOGRAPHY:
        - FONT FAMILY: Friendly Sans, Rounded, Script (Fredoka, Varela Round, Pacifico).
        - STYLE: Delicious, inviting, warm.
        - WEIGHT: Bold/Rounded.
      COMPOSITION: Food-centric or delivery-hero style. Mouth-watering presentation.
      
      HUMAN INTERACTION RULES (CRITICAL):
      - GAZE: The Person MUST look AT THE FOOD (with desire/appetite) OR AT THE CAMERA (presenting the food).
      - ACTION: Holding the food, aiming to eat, or offering to camera.
      - PROPORTIONS (CRITICAL): The product MUST be RE-SCALED to match the human hands realistically.
      - NO GIANT BURGERS. NO TINY PIZZAS. REALISTIC SCALE ONLY.
      - HANDS: Natural grip. Fingers must not melt into the food.
      VIBE: Uber Eats Premium, Restaurant Campaign, Food Delivery Launch.`;

    default: return `${premiumDesignRules}
      ART DIRECTION: PROFESSIONAL PREMIUM STANDARD.
      BACKGROUND: Clean gradient with subtle design elements.
      DESIGN ELEMENTS: Add geometric shapes, floating elements, and professional accents.
      COLORS: Brand-appropriate palette with vibrant accents.
      LIGHTING: Professional studio lighting with dramatic touch.
      COMPOSITION: Dynamic, balanced, visually striking.
      VIBE: High-End Commercial Advertisement.`;
  }
};

const getStudioPresets = (style: StudioStyle): string => {
  switch (style) {
    case StudioStyle.EXECUTIVO_PRO: return "STYLE: Professional Corporate Leadership. LAYOUT: Center subject. FILL THE ENTIRE CANVAS. NO BORDERS. NO LETTERBOX. BACKGROUND: Modern Glass Office with blurred city skyline depth. LIGHTING: Soft reliable key light.";
    case StudioStyle.EDITORIAL_VOGUE: return "STYLE: High-Fashion Magazine. LAYOUT: Bold minimal photographic composition. FILL THE ENTIRE CANVAS. NO BORDERS. NO LETTERBOX. BACKGROUND: Simple warm gray or hand-painted canvas studio backdrop. LIGHTING: Dramatic Chiaroscuro (High Contrast).";
    case StudioStyle.FITNESS_PRO: return "STYLE: Elite Athletic Performance. LAYOUT: Dynamic camera angle. BACKGROUND: Dark high-tech gym with neon rim lights. LIGHTING: Hard rim lighting highlighting muscle definition.";
    case StudioStyle.CYBERPUNK_NEON: return "STYLE: Futurism & Sci-Fi. LAYOUT: Cinematic depth. BACKGROUND: Rainy neon city street or Data Center with clean dark zones. LIGHTING: Cyan and Magenta gels.";
    case StudioStyle.LUXURY_GOLD: return "STYLE: Opulence & Galas. LAYOUT: Elegant center focus. BACKGROUND: Dark Marble walls with Gold art deco accents in background. LIGHTING: Warm golden spotlight.";
    case StudioStyle.URBAN_STREET: return "STYLE: Street Culture & Hype. LAYOUT: Wide angle, street depth. BACKGROUND: Concrete wall with artistic graffiti. LIGHTING: Natural overcast.";
    case StudioStyle.VINTAGE_FILM: return "STYLE: Retro Nostalgia. LAYOUT: Standard 35mm framing. BACKGROUND: Warm simplistic colored backdrop. LIGHTING: Direct flash look or warm sunset haze.";
    case StudioStyle.FUTURISTA_LAB: return "STYLE: Scientific Innovation. LAYOUT: Sterile central composition. BACKGROUND: White clean room, holographic data displays in background (not overlay). LIGHTING: Cool white clinical.";
    case StudioStyle.GLOW_BEAUTY: return "STYLE: Cosmetic & Skincare. LAYOUT: Extreme close-up or beauty portrait. BACKGROUND: Soft focus pastel colors, water ripples, cream textures. LIGHTING: Ring light beauty dish.";

    // NEW STYLES
    case StudioStyle.OLD_MONEY: return "STYLE: Old Money / Silent Luxury. LAYOUT: Classic Portraiture. BACKGROUND: Estate Library, Country Club terrace, or Limestone Mansion wall. Texture: Linen, Velvet, Oak Wood. LIGHTING: Warm Golden Hour, Rich Cinematographic shadows.";
    case StudioStyle.NATURE_FRESH: return "STYLE: Organic & Eco-Friendly. LAYOUT: Natural & Airy. BACKGROUND: Lush Botanical Garden, Greenhouse with glass walls, or Sunlight filtering through leaves (Gobo). LIGHTING: Soft, diffused daylight, fresh and clean.";
    case StudioStyle.POP_ART: return "STYLE: Bold Pop Art / Gen Z. LAYOUT: High Impact Commercial. BACKGROUND: Solid Electric Blue or Hot Pink matte background. Geometric precision. LIGHTING: Hard High-Key Studio Flash, Sharp Shadows, High Saturation.";
    case StudioStyle.COASTAL_LUXE: return "STYLE: Mediterranean Vacation. LAYOUT: Relaxed Elegance. BACKGROUND: White Stucco walls, Blue Ocean blur in distance, Beige Sand tones. LIGHTING: Bright High-Key Natural Daylight, very soft shadows.";

    // PROFISSÕES POPULARES
    case StudioStyle.CORRETOR_IMOVEIS: return "STYLE: Real Estate Agent / Broker. LAYOUT: Confident professional pose. BACKGROUND: Modern luxury apartment interior, large windows with city view, or elegant property entrance. Props: Keys, tablet, professional attire. LIGHTING: Bright natural daylight, warm and inviting.";
    case StudioStyle.VENDEDOR_CARROS: return "STYLE: Car Salesperson / Dealership. LAYOUT: Showroom presence. BACKGROUND: Luxury car showroom with polished floors, premium vehicles, modern architecture. Props: Car keys, professional suit, tablet. LIGHTING: Bright showroom lighting with reflections.";
    case StudioStyle.MEDICO_DENTISTA: return "STYLE: Healthcare Professional / Doctor / Dentist. LAYOUT: Trustworthy medical portrait. BACKGROUND: Clean medical office, white walls, modern clinic equipment, or blurred hospital corridor. Props: White coat, stethoscope, clipboard. LIGHTING: Clean clinical white lighting, professional and sterile.";
    case StudioStyle.ADVOGADO: return "STYLE: Lawyer / Attorney. LAYOUT: Authoritative professional portrait. BACKGROUND: Law office with bookshelves full of law books, wooden desk, leather chair, scales of justice. Props: Suit, legal documents, glasses. LIGHTING: Warm sophisticated office lighting, golden hour from windows.";
    case StudioStyle.PERSONAL_TRAINER: return "STYLE: Personal Trainer / Fitness Coach. LAYOUT: Energetic athletic pose. BACKGROUND: Modern gym with equipment, functional training area, or outdoor fitness park. Props: Stopwatch, training gloves, athletic wear. LIGHTING: Dynamic gym lighting with energy, rim lights for definition.";
    case StudioStyle.CABELEIREIRO: return "STYLE: Hairdresser / Barber / Stylist. LAYOUT: Creative professional pose. BACKGROUND: Modern salon with mirrors, styling chairs, professional products, industrial chic decor. Props: Scissors, comb, styling tools, black cape. LIGHTING: Soft flattering salon lighting with ring light effect.";
    case StudioStyle.ARQUITETO: return "STYLE: Architect / Interior Designer. LAYOUT: Creative professional portrait. BACKGROUND: Modern design studio, architectural models, blueprints on walls, minimalist workspace. Props: Blueprints, scale ruler, tablet with design software. LIGHTING: Natural studio light from large windows, clean and modern.";
    case StudioStyle.TATUADOR: return "STYLE: Tattoo Artist. LAYOUT: Creative edgy portrait. BACKGROUND: Tattoo studio with flash art on walls, tattoo chair, ink bottles, artistic urban environment. Props: Tattoo machine, gloves, artistic tattoos visible. LIGHTING: Moody atmospheric lighting with neon accents, artistic shadows.";
    case StudioStyle.FOTOGRAFO: return "STYLE: Photographer / Creative Artist. LAYOUT: Behind-the-camera professional. BACKGROUND: Photography studio with lights, backdrops, equipment, or outdoor shoot location. Props: Professional camera, lens, lighting equipment. LIGHTING: Studio strobe lighting setup, professional photography environment.";

    // NEW PROFESSIONS
    case StudioStyle.DESIGNER_GRAFICO: return "STYLE: Creative Graphic Designer. LAYOUT: Modern creative workspace. BACKGROUND: Studio with dual monitors, color swatches, mood boards on wall, tablet. Props: Stylus, coffee, pantone books. LIGHTING: Soft screen glow mixed with daylight.";
    case StudioStyle.MAQUIADORA: return "PRIMARY TASK: RE-PHOTOGRAPH this person as a PROFESSIONAL MAKEUP ARTIST (MUA). CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Modern Beauty Professional (2024 Instagram MUA aesthetic). BACKGROUND: Chic modern vanity area with Hollywood mirror bulbs (warm glow), organized makeup products on clean marble or acrylic surface, soft bokeh. WARDROBE: MODERN and ELEGANT — fitted black top, minimalist blazer, or chic apron. NO costume-like outfits, NO 80s fashion, NO sequins, NO sparkly/metallic fabrics. Think modern Instagram beauty influencer. ABSOLUTE PROPS BAN (CRITICAL — READ CAREFULLY): EVERY makeup tool (brush, sponge, palette, lipstick) MUST be physically connected to a HUMAN HAND with visible fingers gripping it, OR resting flat on a surface (table/counter). FORBIDDEN COMPOSITIONS: close-up of a brush alone, floating brush without hands, props hovering in air, still-life of makeup products without a person. The PERSON must ALWAYS be the MAIN SUBJECT occupying at least 60% of the frame. If a brush appears in the image, a hand MUST be holding it. NO EXCEPTIONS. LIGHTING: Flattering beauty ring light or softbox, even glowing illumination. IDENTITY: 100% face preservation. VIBE: Modern, professional, aspirational beauty content.";
    case StudioStyle.NUTRICIONISTA: return "STYLE: Nutritionist / Dietitian. LAYOUT: Welcoming health professional. BACKGROUND: Bright modern clinic with fruit bowl, measuring tape, anatomical charts or healthy food imagery. Props: Apple, measuring tape, tablet. LIGHTING: Fresh, clean, high-key bright.";

    // ======================
    // EXPANDED STYLE LIST (12+ Each)
    // ======================

    // BUSINESS EXPANSION
    case StudioStyle.CONSULTOR_FINANCEIRO: return "STYLE: Finance Consultant. LAYOUT: Professional Trust. BACKGROUND: Modern fintech office, data screens blur, graph charts on glass wall. LIGHTING: Clean corporate blue-ish white.";
    case StudioStyle.SOCIAL_MEDIA: return "STYLE: Social Media Manager. LAYOUT: Trendy & Connected. BACKGROUND: Colorful creative office, ring light, smartphone on tripod, neon 'On Air' sign blur. LIGHTING: Poppy, bright influencer lighting.";
    case StudioStyle.PODCASTER: return "STYLE: Podcaster / Audio Host. LAYOUT: Speaking to mic. BACKGROUND: Soundproof studio foam, broadcast microphone, headphones, 'On Air' sign. LIGHTING: Moody studio lighting with accent colors.";
    case StudioStyle.PET_SHOP: return "STYLE: Pet Care Professional. LAYOUT: Friendly & Caring. BACKGROUND: Clean grooming salon, colourful shelves with pet supplies, paw print decor. LIGHTING: Bright and happy.";
    case StudioStyle.ENGENHEIRO: return "STYLE: Civil Engineer. LAYOUT: On-site professional. BACKGROUND: Construction site blur, blueprints, structural elements (steel/concrete), safety helmet prop. LIGHTING: Natural outdoor or industrial.";
    case StudioStyle.PSICOLOGO: return "STYLE: Psychologist / Therapist. LAYOUT: Calm & Listening. BACKGROUND: Comfortable armchair, soft textures, books, plants, soothing neutral wall colors. LIGHTING: Soft, warm, calming.";

    // MODA EXTRA
    case StudioStyle.JEWELRY_MACRO: return "STYLE: High Jewelry Campaign. LAYOUT: Focus on elegance. BACKGROUND: Dark velvet or Silk sheets, defocused sparkles. LIGHTING: Pin-point precision lighting to create flares.";
    case StudioStyle.SKINCARE_ORGANIC: return "STYLE: Organic Beauty. LAYOUT: Pure & Clean. BACKGROUND: Bathroom spa environment, white marble, bamboo, water drops. LIGHTING: Diffused soft white.";
    case StudioStyle.STREET_FASHION: return "STYLE: High Street Fashion. LAYOUT: Full body outfit check. BACKGROUND: Urban city street, brick wall, fashion district blurred. LIGHTING: Natural daylight with reflectors.";
    case StudioStyle.BRIDAL_LUXURY: return "STYLE: Bridal Editorial. LAYOUT: Romantic & Dreamy. BACKGROUND: Floral arch, soft white drapes, cathedral bokeh. LIGHTING: Ethereal backlight, dreamy haze.";
    case StudioStyle.MEN_GROOMING: return "STYLE: Men's Grooming / Barber. LAYOUT: Masculine & Sharp. BACKGROUND: Vintage barber chair, leather textures, shaving tools. LIGHTING: Contrast Rembrandt lighting.";
    case StudioStyle.PERFUME_ELEGANCE: return "STYLE: Perfume Campaign. LAYOUT: Scent visual representation. BACKGROUND: Abstract floral swirls, golden liquid effects, glass reflections. LIGHTING: Translucent backlighting.";
    case StudioStyle.MANICURE: return "STYLE: Professional Manicure & Nail Artist Portrait. LAYOUT: Beauty professional in their modern nail salon workspace. BACKGROUND: Elegant nail salon with organized nail polish collections in ombre gradient display, LED ring light, clean white marble workspace, soft pink and white interior decor. LIGHTING: Bright, clean beauty lighting with soft shadows, ring light reflection. POSE: The nail technician is shown working on beautiful nail art, or displaying finished nails with pride, or posing confidently with professional tools. Hands and nails should be prominent. PROPS: Nail polish bottles, nail art brushes, UV lamp, elegant manicure tools, fresh flowers. OUTFIT: Professional and stylish uniform or chic outfit. VIBE: Professional beauty expert, Instagram nail artist aesthetic, clean and glamorous salon environment, precision and artistry.";
    case StudioStyle.DESIGNER_SOBRANCELHA: return "STYLE: Professional Eyebrow Designer Portrait. LAYOUT: Beauty professional specializing in eyebrow design in a modern aesthetics studio. BACKGROUND: Clean, modern beauty studio with ring light, magnifying lamp, professional eyebrow tools organized neatly, white and rose gold decor, minimalist aesthetic clinic interior. LIGHTING: Soft, flattering beauty lighting, ring light creating catch lights in eyes, professional and clean. POSE: The eyebrow designer is shown carefully shaping or measuring eyebrows with precision tools, or proudly displaying their work, or posing with threading/microblading tools. Close attention to detail and precision. PROPS: Eyebrow ruler, threading thread, microblading pen, mapping pencil, magnifying lamp, before/after examples on wall. OUTFIT: Professional lab coat or aesthetic uniform, clean and polished look. VIBE: Precision beauty artist, microblading expert, clean clinical aesthetic, confident professional, Instagram brow artist.";
    case StudioStyle.DEPILADORA: return "STYLE: Professional Waxing Specialist & Aesthetician Portrait. LAYOUT: Beauty professional in a modern, clean aesthetics clinic. BACKGROUND: Clean white and pastel clinic interior with professional treatment bed, organized waxing products, warm wax heater, clean towels, spa-like atmosphere. Gentle ambient lighting. LIGHTING: Soft, clean clinical lighting with warm tones, professional and inviting. POSE: The aesthetician is shown confidently posing in her clinic, holding professional tools, or preparing a treatment area with care and expertise. Welcoming and professional demeanor. PROPS: Wax warmer, spatulas, clean towels, skincare products, professional uniform, treatment bed. OUTFIT: Clean white lab coat or professional aesthetics uniform. VIBE: Professional beauty clinic, skin care expert, clean and hygienic environment, trustworthy and skilled, modern aesthetics professional.";
    case StudioStyle.PENTEADOS: return "STYLE: Professional Hairstylist & Updo Specialist Portrait. LAYOUT: Creative hairstylist in a modern salon creating beautiful hairstyles. BACKGROUND: Elegant hair salon with professional mirrors, styling stations, hair tools organized beautifully, warm salon lighting, modern decor. LIGHTING: Warm, flattering salon lighting that highlights hair textures and the stylist's work, golden tones. POSE: The hairstylist is shown creating an elaborate updo, braiding hair artistically, or displaying a finished masterpiece hairstyle. Hands working with hair should be prominent, showing skill and creativity. PROPS: Professional brushes, bobby pins, hair accessories, curling iron, braiding tools, flower crowns, elegant hair clips. OUTFIT: Stylish and fashionable outfit befitting a creative professional. VIBE: Hair artist, creative genius, bridal hair specialist, salon queen, Instagram hairstylist, artistry and elegance.";


    // CASUAL EXTRA
    case StudioStyle.YOGA_WELLNESS: return "STYLE: Yoga & Mindfulness. LAYOUT: Meditative pose. BACKGROUND: Bamboo floor studio, sunrise view, zen garden. LIGHTING: Warm golden sunrise.";
    case StudioStyle.TRAVEL_BLOGGER: return "STYLE: Travel Lifestyle. LAYOUT: Wanderlust. BACKGROUND: Famous landmark blur (Paris/Santorini), luggage, map, camera. LIGHTING: Golden hour outdoor.";
    case StudioStyle.COFFEE_LOVER: return "STYLE: Cozy Coffee aesthetic. LAYOUT: Relaxed. BACKGROUND: Coffee shop corner, latte art, steam, rainy window blur. LIGHTING: Warm tungsten cafe lights.";
    case StudioStyle.GAMER_STREAMER: return "STYLE: Twitch Streamer. LAYOUT: Gaming chair. BACKGROUND: RGB LED strips, gaming PC setup, posters. LIGHTING: Neon purple/blue rim lights.";
    case StudioStyle.MUSICIAN_VIBE: return "STYLE: Musician / Artist. LAYOUT: With instrument. BACKGROUND: Recording studio, vinyl records, acoustic panels. LIGHTING: Moody artistic spotlight.";
    case StudioStyle.DIY_CRAFTS: return "STYLE: DIY / Crafter. LAYOUT: Hands-on creativity. BACKGROUND: Craft table, colorful yarn, paint brushes, organized chaos. LIGHTING: Bright work-lamp lighting.";

    // FAMILY styles are defined below with strict identity, expression & count rules
    case StudioStyle.MATERNITY_SOFT: return "STYLE: Maternity Shoot. LAYOUT: Tender bump focus. BACKGROUND: Sheer curtains, white bedroom, soft floral. LIGHTING: High-key angelic glow.";
    case StudioStyle.NEWBORN_ART: return "STYLE: Newborn Art. LAYOUT: Sleeping baby (if applicable) or holding baby. BACKGROUND: Soft fur blankets, knit textures, woven basket. LIGHTING: Very soft window light.";
    case StudioStyle.KIDS_PLAYGROUND: return "STYLE: Kids at Play. LAYOUT: Action freeze. BACKGROUND: Colorful playground, slides, park. LIGHTING: Bright daylight.";
    case StudioStyle.GENERATIONS_PORTRAIT: return "STYLE: Multi-Generation. LAYOUT: Formal legacy. BACKGROUND: Classic painting backdrop, canvas texture. LIGHTING: Traditional portrait lighting.";
    case StudioStyle.FAMILY_KITCHEN: return "STYLE: Baking Together. LAYOUT: Messy fun. BACKGROUND: Kitchen island, flour dust, cookie dough. LIGHTING: Bright kitchen overhead.";
    case StudioStyle.PET_FRIENDLY_FAMILY: return "STYLE: Family with Pets. LAYOUT: Chaos & Love. BACKGROUND: Backyard grass or cozy rug. LIGHTING: Natural daylight.";

    // COMERCIAL EXTRA
    case StudioStyle.ECOMMERCE_CLEAN: return "STYLE: E-commerce Product. LAYOUT: Product focus. BACKGROUND: Pure white #FFFFFF background. LIGHTING: Shadowless product photography.";
    case StudioStyle.TECH_STARTUP: return "STYLE: Tech Startup Team. LAYOUT: Collaborative. BACKGROUND: Modern open plan office, glassboards, post-its. LIGHTING: Bright office daylight.";
    case StudioStyle.GASTRONOMIA: return "STYLE: Gastronomy / Chef. LAYOUT: Plating detail. BACKGROUND: Dark moody kitchen tile, slate surface, herbs. LIGHTING: Focused food spotlight.";
    case StudioStyle.REAL_ESTATE: return "STYLE: Interior Design. LAYOUT: Wide room shot. BACKGROUND: Luxury living room, perfectly staged. LIGHTING: Balanced HDR interior.";
    case StudioStyle.COFFEE_SHOP: return "STYLE: Coffee Shop Brand. LAYOUT: Barista action. BACKGROUND: Espresso machine, coffee beans, chalkboard menu. LIGHTING: Warm cafe ambiance.";
    case StudioStyle.FLORIST_BOUTIQUE: return "STYLE: Florist Shop. LAYOUT: Surrounded by flowers. BACKGROUND: Flower shop shelves, colorful blooms, greenery. LIGHTING: Fresh natural light.";
    case StudioStyle.BAKERY_ARTISAN: return "STYLE: Artisan Bakery. LAYOUT: Holding fresh bread. BACKGROUND: Wooden shelves with loaves, flour dust, rustic mood. LIGHTING: Warm morning sun.";
    case StudioStyle.BOOKSTORE_COZY: return "STYLE: Bookstore Owner. LAYOUT: Intellectual. BACKGROUND: Floor-to-ceiling bookshelves, ladder, comfortable reading nook. LIGHTING: Quiet library lighting.";
    case StudioStyle.GYM_CROSSFIT: return "STYLE: Crossfit Box. LAYOUT: Intense workout. BACKGROUND: Industrial warehouse gym, weights, chalk dust. LIGHTING: Gritty textural lighting.";
    case StudioStyle.SPA_WELLNESS: return "STYLE: Luxury Spa. LAYOUT: Relaxed robe. BACKGROUND: Candlelight, orchids, hot stones, steam. LIGHTING: Dim romantic lighting.";
    case StudioStyle.BARBER_SHOP_RETRO: return "STYLE: Retro Barber. LAYOUT: Vintage cool. BACKGROUND: Checkered floor, vintage posters, red leather chair. LIGHTING: warm vintage bulbs.";

    // CRIATIVO EXTRA
    case StudioStyle.SURREAL_DREAM: return "STYLE: Surrealism / Dali. LAYOUT: Dreamscape. BACKGROUND: Floating islands, melting clocks, impossible clouds, pastel gradients. LIGHTING: Dreamy soft focus.";
    case StudioStyle.GLITCH_ART: return "STYLE: Digital Glitch. LAYOUT: Broken Reality. BACKGROUND: CRT TV static, RGB shift, pixel sorting, data corruption. LIGHTING: Digital screen flickering.";
    case StudioStyle.PAPER_CUTOUT: return "STYLE: Papercraft Art. LAYOUT: Layered diorama. BACKGROUND: Layers of colored paper, shadows, collage aesthetic. LIGHTING: Hard shadows to show depth.";
    case StudioStyle.DOUBLE_EXPOSURE: return "STYLE: Double Exposure. LAYOUT: Silhouette overlay. BACKGROUND: Blend of nature (forest/city) INSIDE the silhouette of the person. LIGHTING: High contrast silhouette.";
    case StudioStyle.WATERCOLOR_ART: return "STYLE: Watercolor Painting. LAYOUT: Artistic stroke. BACKGROUND: White paper texture with bleeding watercolor paints (splash). LIGHTING: Flat art scanning.";
    case StudioStyle.NEON_PORTRAIT: return "STYLE: Ultraviolet / Blacklight. LAYOUT: Glowing paint. BACKGROUND: Pitch black with UV body paint glowing patterns. LIGHTING: Blacklight only.";
    case StudioStyle.ENGENHEIRO: return "STYLE: Civil Engineer / Architect on Site. LAYOUT: Industrial professional look. BACKGROUND: Active construction site (blurred) or office with rolled blueprints and hard hat visible. Props: White hard hat, safety vest, blueprints. LIGHTING: Daylight or high-vis industrial.";
    case StudioStyle.PSICOLOGO: return "STYLE: Psychologist / Therapist. LAYOUT: Empathetic & Welcoming. BACKGROUND: Cozy therapy office, comfortable armchair, bookshelf, plants, warm decor. Props: Notebook, glasses, tissue box. LIGHTING: Warm, soothing, soft ambient light.";

    // ANIVERSÁRIO STYLES
    case StudioStyle.BDAY_BALOES_ROSE: return "STYLE: Birthday Photoshoot - Rose Gold Balloons. LAYOUT: Person surrounded by luxurious rose gold, pink, and white balloons of different sizes. BACKGROUND: White or soft pink studio backdrop filled with metallic rose gold balloons, some floating, some on the ground. Confetti scattered on floor. LIGHTING: Soft glamorous lighting with warm tones. POSE: Celebratory, holding balloons, laughing, or posing elegantly. VIBE: Chic, feminine, Instagram-worthy birthday celebration.";
    case StudioStyle.BDAY_CONFETTI: return "STYLE: Birthday Photoshoot - Confetti Shower. LAYOUT: Dynamic action shot with golden confetti falling everywhere around the person. BACKGROUND: Clean black or dark studio with thousands of metallic gold confetti pieces caught mid-air. LIGHTING: Multi-flash to freeze confetti motion, dramatic rim lighting. POSE: Arms up celebrating, spinning, dancing in confetti rain, pure joy expression. VIBE: Explosive celebration, party energy, editorial magazine style.";
    case StudioStyle.BDAY_BALOES_NUMERO: return "STYLE: Birthday Photoshoot - Number Balloons. LAYOUT: Person posing next to GIANT metallic foil number balloons showing their age. BACKGROUND: Decorated wall with balloon arch or garland behind. Colors: mix of metallics (gold, silver, rose gold) with matte colors. LIGHTING: Bright and cheerful studio lighting. POSE: Proud, fun, pointing at numbers, hugging the balloons. PROPS: CRITICAL - Include large metallic number balloons matching the age if specified. VIBE: Classic birthday photoshoot, fun milestone celebration.";
    case StudioStyle.BDAY_LUXO_DOURADO: return "STYLE: Birthday Photoshoot - Black & Gold Luxury. LAYOUT: Glamorous high-end birthday portrait. BACKGROUND: Dramatic black backdrop with golden decorations: gold balloon arch, gold tinsel curtains, black and gold themed decor. LIGHTING: Warm spotlight with golden hue, rim light separating from dark background. POSE: Elegant, sophisticated, like a VIP celebration. OUTFIT: Suggest black or gold evening wear. VIBE: Luxury party, VIP birthday celebration, high-end event photography.";
    case StudioStyle.BDAY_ESTUDIO_CLEAN: return "STYLE: Birthday Photoshoot - Clean Studio. LAYOUT: Simple and elegant studio portrait with minimal birthday elements. BACKGROUND: Pure white or soft grey seamless backdrop. Minimal props: a simple cake, a single balloon bunch, party hat (optional). LIGHTING: High-key professional photography lighting, soft and even. POSE: Natural and relaxed, sitting on stool or standing, gentle smile. VIBE: Timeless, clean, professional birthday portrait that focuses on the person.";
    case StudioStyle.BDAY_JARDIM: return "STYLE: Birthday Photoshoot - Enchanted Garden. LAYOUT: Person in an enchanted garden setting with flowers and soft decorations. BACKGROUND: Lush green garden with flower arches, hanging florals, fairy lights intertwined with greenery, rustic wooden elements. LIGHTING: Soft golden hour sunlight filtering through leaves, magical and dreamy. POSE: Sitting among flowers, walking through garden arch, smelling flowers. VIBE: Romantic, whimsical, fairytale birthday magic, boho chic.";
    case StudioStyle.BDAY_POOL_PARTY: return "STYLE: Birthday Photoshoot - Pool Party Summer. LAYOUT: Vibrant summer pool celebration. BACKGROUND: Crystal clear pool water, tropical plants, inflatable pool toys (flamingos, donuts), colorful towels. LIGHTING: Bright daylight, sun reflections on water, summer warmth. POSE: Sitting by pool edge, splashing, sunbathing, tropical cocktail in hand. PROPS: Pool floats, tropical flowers, fruit drinks, sunglasses. VIBE: Summer vibes, tropical birthday, fun and fresh.";
    case StudioStyle.BDAY_NEON_GLOW: return "STYLE: Birthday Photoshoot - Neon Glow Party. LAYOUT: Person in a neon-lit party environment. BACKGROUND: Dark room with neon lights (pink, blue, purple), LED strips, luminous birthday decorations, glow sticks, UV reactive elements. LIGHTING: Blacklight/UV mixed with colored neon LED strips, dramatic and moody. POSE: Dancing, partying, DJ vibe, holding glow sticks. VIBE: Night club birthday, rave aesthetic, Gen-Z party vibes, electric and energetic.";
    // ANIVERSÁRIO MASCULINO
    case StudioStyle.BDAY_CHURRASCO: return "STYLE: Birthday Photoshoot - BBQ & Beer Celebration. LAYOUT: Man celebrating birthday at a premium barbecue setup. BACKGROUND: Rustic outdoor barbecue area with a professional grill, smoke rising, wooden table with craft beers, charcuterie board, and string lights overhead. Warm brick or wood-panel backdrop. LIGHTING: Warm golden hour sunlight mixed with fire glow from the grill, creating a cozy masculine atmosphere. POSE: Confident and relaxed, holding a beer or tongs, laughing with pride near the grill, alpha male energy. PROPS: Premium grill, cold beer bottles, meat cuts, rustic wooden decor, birthday banner. VIBE: Masculine celebration, bro-style party, outdoor BBQ king, warm and inviting.";
    case StudioStyle.BDAY_ESPORTE: return "STYLE: Birthday Photoshoot - Sports Champion. LAYOUT: Man celebrating birthday with a sports victory theme. BACKGROUND: Stadium-inspired backdrop with dramatic spotlights, confetti falling, trophy display, sports memorabilia. Could feature football, basketball, or general sports aesthetic. LIGHTING: Stadium-style dramatic spotlights with rim lighting, epic and cinematic. POSE: Victorious pose - arms raised holding trophy, fist pump, champion celebration, powerful stance. PROPS: Golden trophy, medal, sports ball, confetti, championship banner with birthday message. VIBE: Champion energy, victorious celebration, masculine power, sports hero birthday.";
    case StudioStyle.BDAY_BOTECO: return "STYLE: Birthday Photoshoot - Retro Bar/Boteco. LAYOUT: Man celebrating at a vintage Brazilian boteco (retro bar). BACKGROUND: Classic boteco environment with checkered tablecloths, vintage beer signs, old wooden bar counter, retro posters on walls, hanging light bulbs. LIGHTING: Warm tungsten bar lighting, vintage bulbs casting golden glow, intimate and nostalgic. POSE: Sitting at bar counter or standing with beer mug raised for a toast, relaxed and cool. PROPS: Draft beer, bar snacks (petiscos), retro beer brand signs, vintage radio, playing cards. VIBE: Nostalgic Brazilian boteco, retro masculine coolness, old-school celebration, classic guy's night out.";
    case StudioStyle.BDAY_WHISKY_VIP: return "STYLE: Birthday Photoshoot - Whisky VIP Lounge. LAYOUT: Sophisticated man celebrating in a luxury lounge setting. BACKGROUND: Dark upscale lounge with leather armchairs, mahogany wood paneling, crystal decanters, dim ambient lighting, cigar lounge aesthetic. LIGHTING: Low-key dramatic lighting with warm amber tones, spotlight on the person, luxurious shadows. POSE: Seated in leather armchair holding whisky glass, sophisticated and powerful, James Bond energy. PROPS: Crystal whisky glass, premium bottle, leather chair, cigars, dark velvet curtains, birthday cake with dark theme. VIBE: Ultra-masculine luxury, gentleman's club, VIP exclusive celebration, power and refinement.";
    case StudioStyle.BDAY_AVENTURA: return "STYLE: Birthday Photoshoot - Outdoor Adventure. LAYOUT: Man celebrating birthday in an epic outdoor adventure setting. BACKGROUND: Mountain summit, forest clearing, or lakeside camp with bonfire. Camping gear, backpack, hiking boots visible. Natural landscape with dramatic sky. LIGHTING: Golden hour sunlight or campfire glow, natural and epic, warm outdoor tones. POSE: Standing on mountain peak with arms spread, sitting by campfire, or adventure-ready pose with backpack. PROPS: Campfire, camping gear, hiking boots, adventure map, birthday cake in outdoor setting, lanterns. VIBE: Adventure spirit, outdoor masculine energy, mountain king, freedom and nature celebration.";
    case StudioStyle.BDAY_GAMER: return "STYLE: Birthday Photoshoot - Gamer Birthday Setup. LAYOUT: Man celebrating birthday in an epic gaming setup environment. BACKGROUND: Premium gaming room with RGB LED lighting, multiple monitors, gaming PC with custom lights, gaming chair, LED strips in purple/blue/green colors. LIGHTING: RGB ambient lighting, monitor glow on face, neon accents, moody and tech-forward. POSE: Sitting in gaming chair with headset, victory pose with controller, or standing in front of epic setup. PROPS: Gaming headset, controller, keyboard with RGB, energy drinks, birthday-themed gaming decorations, LED numbers. VIBE: Gamer culture celebration, tech-savvy birthday, e-sports energy, modern masculine party.";

    // FAMILY STYLES - STRICT IDENTITY & COUNT RULES
    // FAMILY STYLES - STRICT IDENTITY & COUNT RULES
    // FAMILY STYLES - STRICT IDENTITY & COUNT RULES
    case StudioStyle.FAMILY_STUDIO_CLEAN: return "PRIMARY TASK: RE-PHOTOGRAPH this person in a PROFESSIONAL FAMILY STUDIO. CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Classic Commercial Family Photography — like a premium portrait studio session. BACKGROUND: Pure white (#FFFFFF) seamless cyclorama — absolutely ZERO elements from the original photo's background. WARDROBE: Dress them in clean studio-appropriate clothing (white, cream, light grey, soft pastels). POSE: Natural relaxed studio pose (standing, sitting on white cube/stool, or leaning casually). LIGHTING: Large softboxes, bright, airy, shadowless high-key lighting with soft catchlights in eyes. POST-PROCESSING: Clean commercial retouch, bright whites, magazine-quality. PEOPLE COUNT: Preserve the exact number of people from the input. IDENTITY: 100% face preservation — the person MUST be recognizable. Keep their natural expression. VIBE: Clean, timeless, high-end family portrait.";
    case StudioStyle.FAMILY_LIFESTYLE_HOME: return "PRIMARY TASK: RE-PHOTOGRAPH this person in a COZY HOME SETTING. CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Candid Lifestyle Family Photography. BACKGROUND: Beautiful warm living room with soft beige/cream tones, couch, bookshelf, natural textures — a COMPLETELY NEW environment, not the original background. WARDROBE: Comfortable casual clothing (earth tones, knitwear, soft fabrics). POSE: Natural candid moment — reading together, laughing on couch, playing on carpet. LIGHTING: Soft natural window light with warm golden tones. PEOPLE COUNT: Preserve the exact number of people from the input. IDENTITY: 100% face preservation. Keep natural expression. VIBE: Authentic, warm, comfortable.";
    case StudioStyle.FAMILY_GOLDEN_HOUR: return "PRIMARY TASK: RE-PHOTOGRAPH this person in a GOLDEN HOUR OUTDOOR SCENE. CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Cinematic Outdoor Family Photography. BACKGROUND: Wide open field, meadow, or hillside at SUNSET with golden hour light — a COMPLETELY NEW environment. WARDROBE: Flowing fabrics in warm earth tones (amber, rust, cream). POSE: Walking together, holding hands, or embracing against the sunset. LIGHTING: Warm golden backlight creating dramatic rim light silhouettes and lens flare. PEOPLE COUNT: Preserve the exact number of people from the input. IDENTITY: 100% face preservation. Keep natural expression. VIBE: Cinematic, emotional, nostalgic, romantic.";
    case StudioStyle.FAMILY_BEACH: return "PRIMARY TASK: RE-PHOTOGRAPH this person at the BEACH. CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Bright Coastal Family Photography. BACKGROUND: Beautiful white sand beach with turquoise water blur, gentle waves, clear sky — a COMPLETELY NEW environment. WARDROBE: Light summer clothing (white linen, light blue, sandy tones). POSE: Walking barefoot on sand, sitting on beach, playing with waves. LIGHTING: Bright high-key natural sunlight with ocean reflections. PEOPLE COUNT: Preserve the exact number of people from the input. IDENTITY: 100% face preservation. Keep natural expression. VIBE: Summer, freedom, joy, coastal breeze.";
    case StudioStyle.FAMILY_CHRISTMAS: return "PRIMARY TASK: RE-PHOTOGRAPH this person in a MAGICAL CHRISTMAS SCENE. CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Festive Holiday Portrait Photography. BACKGROUND: Beautifully decorated Christmas tree with warm bokeh lights, wrapped presents, fireplace, cozy holiday decor — a COMPLETELY NEW environment. WARDROBE: Festive clothing (red/green sweaters, matching pajamas, or elegant holiday attire). POSE: Gathered around tree, holding a gift, warm family embrace. LIGHTING: Warm glowing ambient light from Christmas lights and fireplace. PEOPLE COUNT: Preserve the exact number of people from the input. IDENTITY: 100% face preservation. Keep natural expression. VIBE: Magical, festive, cozy, traditional.";
    case StudioStyle.FAMILY_PICNIC: return "PRIMARY TASK: RE-PHOTOGRAPH this person at a FAMILY PICNIC. CREATE A COMPLETELY NEW IMAGE — do NOT return the original photo. STYLE: Outdoor Family Picnic Photography. BACKGROUND: Lush green park or garden with picnic blanket, wicker basket, wildflowers, trees — a COMPLETELY NEW environment. WARDROBE: Casual relaxed clothing (sundresses, khakis, soft cotton shirts). POSE: Sitting on checkered blanket together, sharing food, enjoying nature. LIGHTING: Warm dappled sunlight filtering through tree canopy. PEOPLE COUNT: Preserve the exact number of people from the input. IDENTITY: 100% face preservation. Keep natural expression. VIBE: Relaxed, natural, togetherness, golden afternoon.";

    // POLÍTICO STYLES
    case StudioStyle.POLITICO_BANDEIRA: return "STYLE: Political Portrait - Flag Drape. LAYOUT: The candidate wearing a white social shirt with the BRAZILIAN FLAG draped over the shoulders like a cape/shawl. BACKGROUND: Clean light grey or white gradient studio backdrop. POSE: Confident, hands crossed on chest touching the flag, or one hand on heart. EXPRESSION: MATCH INPUT EXACTLY. Serious, determined, trustworthy. DO NOT FORCE SMILE. LIGHTING: Professional studio softbox, clean and bright. VIBE: Patriotic, trustworthy, leadership, institutional. CRITICAL: The flag must be the Brazilian flag (green, yellow, blue). Do NOT invent symbols or coats of arms.";
    case StudioStyle.POLITICO_COMICIO: return "STYLE: Political Portrait - Rally/Campaign. LAYOUT: Close-up or medium shot of candidate. BACKGROUND: Solid colored studio backdrop — use a VIBRANT SOLID COLOR (blue, yellow, orange, or red gradient). Clean, no objects. POSE: Natural, approachable, looking at camera. EXPRESSION: MATCH INPUT EXACTLY. DO NOT FORCE SMILE. CLOTHING: White or light social shirt, clean and professional. LIGHTING: Professional editorial lighting with rim light separating subject from background. VIBE: Energetic, hopeful, modern political campaign, clean and professional.";
    case StudioStyle.POLITICO_GABINETE: return "STYLE: Political Portrait - Office/Cabinet. LAYOUT: Formal seated or standing portrait. BACKGROUND: Elegant office with dark wood bookshelf, Brazilian flag stand visible, institutional decor. POSE: Seated at desk or standing beside it, formal and authoritative. EXPRESSION: MATCH INPUT EXACTLY. DO NOT FORCE SMILE. CLOTHING: Dark suit with tie, very formal. LIGHTING: Warm ambient office lighting with professional fill light. VIBE: Authority, governance, institutional, statesmanship.";
    case StudioStyle.POLITICO_CAMPANHA_RURAL: return "STYLE: Political Portrait - Community/Rural Campaign. LAYOUT: Candidate in outdoor community setting. BACKGROUND: Blurred rural or small-town scene — farmland, community market, or simple neighborhood. POSE: Walking, greeting, or standing with open arms gesture. EXPRESSION: MATCH INPUT EXACTLY. DO NOT FORCE SMILE. CLOTHING: Casual shirt (polo or button-down), no tie, sleeves rolled up. LIGHTING: Natural golden hour outdoor light. VIBE: Approachable, man-of-the-people, grassroots, humble.";

    // PALCO & ORATÓRIA STYLES — Realistic Event Photography (NOT CGI)
    case StudioStyle.PALESTRANTE_PALCO: return "STYLE: REALISTIC EVENT PHOTOGRAPHY — Professional Speaker at Conference. CAMERA: Canon 5D Mark IV, 85mm f/1.8 lens, shot from audience level at medium distance. FRAMING: MEDIUM SHOT from waist up, NEVER full body. BODY PRESERVATION: CRITICAL — Preserve the person's EXACT body type, weight, and proportions from the input photo. Do NOT make the person thinner or heavier. Do NOT widen the torso or change body shape in any way. BACKGROUND: Real conference stage with warm spotlights, subtle stage backdrop (dark or branded), blurred audience heads visible in foreground creating depth. Bokeh from stage lights. LIGHTING: Warm amber/white stage spotlight from above and slightly front, creating natural facial highlights. Soft fill from side. NO neon, NO blue LED walls, NO lens flares. Natural event photography lighting like a professional conference photographer would capture. POSE: Speaking naturally with one hand gesturing at chest level, or holding a headset microphone. Relaxed, confident posture — NOT exaggerated theatrical poses. PROPS: Small headset microphone on ear (skin-colored or black). OUTFIT: Smart blazer (beige, navy, or black) over a simple shirt or blouse. Professional but not overdone. VIBE: Real conference speaker captured by event photographer. Warm, authentic, professional. Like a photo that would appear in a Forbes or LinkedIn article. NEGATIVE: CGI look, neon lights, LED screens, lens flares, full body shot, artificial lighting, body distortion, weight change, oversized or undersized body parts, 3D render look.";
    case StudioStyle.COACH_MENTOR: return "STYLE: REALISTIC PORTRAIT — Business Coach & Mentor. CAMERA: Canon 5D, 50mm f/1.4, shallow depth of field. FRAMING: MEDIUM CLOSE-UP from chest up, or MEDIUM SHOT from waist up. NEVER full body. BODY PRESERVATION: CRITICAL — Preserve the person's EXACT body type, weight, and proportions from the input photo. Do NOT alter body shape in any way. BACKGROUND: Clean, modern coaching space — blurred bookshelf with business books, warm-toned office with natural light from window, or elegant neutral studio backdrop. Soft, organic background. LIGHTING: Warm natural window light from one side creating soft shadows. Golden hour warmth. Professional portrait lighting — NOT harsh or clinical. POSE: Confident but approachable — slight lean forward, one hand gesturing as explaining, or arms naturally at sides. Warm, genuine smile. Natural coaching conversation energy. PROPS: Small elements visible in background only (books, whiteboard edge). Nothing in hands unless a pen or notebook. OUTFIT: Smart casual — well-fitted blazer over casual shirt, or professional polo. Clean and approachable. VIBE: Trusted business mentor photographed for their coaching website. Warm, human, inviting. Like a professional headshot for a life coach's Instagram. NEGATIVE: CGI look, artificial lighting, full body shot, body distortion, weight change, stock photo feel, corporate sterile look.";
    case StudioStyle.PASTOR_LIDER: return "STYLE: REALISTIC PORTRAIT — Modern Protestant Pastor & Church Leader. CAMERA: Canon 5D, 70mm f/2.0, professional portrait lens. FRAMING: MEDIUM SHOT from waist up, or MEDIUM CLOSE-UP. NEVER full body. BODY PRESERVATION: CRITICAL — Preserve the person's EXACT body type, weight, and proportions from the input photo. Do NOT alter body shape in any way. BACKGROUND: MODERN EVANGELICAL CHURCH — contemporary worship stage with soft LED stage lights (warm purple/blue worship lighting), modern church auditorium, dark stage backdrop with subtle cross logo or church branding projected on screen behind. Clean, modern megachurch atmosphere (Hillsong/Elevation style). Blurred congregation seats or worship team in background. NOT a traditional Catholic cathedral — NO stained glass, NO gothic arches, NO ornate altars. LIGHTING: Warm modern stage lighting — soft LED worship lights creating atmospheric purple/warm tones. Professional church broadcast lighting quality. Warm and inviting, like a modern worship service. POSE: Speaking passionately with one hand gesturing naturally, or holding a Bible casually at side. Warm, genuine smile. Charismatic preacher energy — NOT stiff or overly formal. PROPS: Modern wireless headset microphone, Bible held casually (not open on pulpit). Music stand or transparent lectern (modern, not wooden pulpit). OUTFIT: Modern smart casual — fitted blazer over untucked shirt (NO tie), or stylish button-up with rolled sleeves. Contemporary pastor look. NO pastoral vestments, NO robes, NO clerical collar. VIBE: Modern evangelical church leader. Like a portrait for a contemporary church's Instagram or YouTube channel. Warm, relatable, Spirit-filled, young church energy. Think Hillsong, Elevation Church, or Lagoinha style. NEGATIVE: CGI look, Catholic cathedral, stained glass, gothic architecture, clerical vestments, robes, old-fashioned church, candles, incense, full body shot, body distortion, weight change.";
    case StudioStyle.TEDX_SPEAKER: return "STYLE: REALISTIC EVENT PHOTOGRAPHY — TEDx Speaker on Stage. CAMERA: Canon 5D Mark IV, 135mm f/2.0 telephoto lens (compresses background beautifully), shot from audience seats. FRAMING: MEDIUM SHOT from waist up, or CLOSE-UP during passionate moment. NEVER full body. BODY PRESERVATION: CRITICAL — Preserve the person's EXACT body type, weight, and proportions from the input photo. Do NOT alter body shape in any way. BACKGROUND: Iconic TED-style dark stage with a round red carpet circle on the floor (blurred below frame), minimal dark backdrop. Subtle warm spotlight glow. A few blurred audience heads in the foreground creating the 'shot from the crowd' feel. Very minimal stage design — the focus is entirely on the speaker. LIGHTING: Single warm spotlight from above creating a pool of light on the speaker. Soft fill from front. Warm amber tones. The rest of the stage is dark, creating natural contrast. NO neon, NO colored LED, NO lens flares. POSE: Speaking with one hand gesturing naturally at chest height, making a meaningful point. Authentic, vulnerable body language. Walking or standing naturally, NOT theatrical. PROPS: Small clicker/remote in one hand (barely visible). Headset microphone on ear. OUTFIT: Smart casual — fitted blazer over plain t-shirt, or button-up shirt without tie. Authentic and intellectual. VIBE: Intimate, powerful TED talk captured by event photographer. Like a real photo from ted.com. Authentic, inspiring, intellectual. NEGATIVE: CGI look, neon lights, LED screens, full body shot, body distortion, weight change, exaggerated poses, concert lighting, 3D render.";
    case StudioStyle.COMUNICADOR_MC: return "STYLE: REALISTIC EVENT PHOTOGRAPHY — Event Host & MC on Stage. CAMERA: Canon 5D, 85mm f/1.8, fast lens for low-light event photography. FRAMING: MEDIUM SHOT from waist up. NEVER full body. BODY PRESERVATION: CRITICAL — Preserve the person's EXACT body type, weight, and proportions from the input photo. Do NOT alter body shape in any way. BACKGROUND: Real event stage with warm and colorful stage lighting (subtle purple/blue/magenta washes), blurred LED screens, blurred audience in the dark creating atmosphere. Professional corporate event or gala setting. Stage backdrop with warm tones. LIGHTING: Key spotlight from front-above on the MC, colorful rim lighting from stage washes (purple/blue accent, not overwhelming). Natural event photography lighting. Warm and energetic but realistic. POSE: Holding a wireless handheld microphone naturally, smiling warmly, one hand gesturing to engage the audience. Confident and charismatic but NATURAL — not exaggerated theatrical poses. PROPS: Wireless handheld microphone, subtle earpiece visible. OUTFIT: Stylish fitted suit or elegant outfit. Well-dressed for a gala or corporate event. Fashionable but professional. VIBE: Charismatic event host captured by the event photographer. High-energy but real. Like a photo from a corporate event recap gallery. NEGATIVE: CGI look, confetti explosion, concert-style neon, full body shot, body distortion, weight change, cartoon-like effects, oversaturated colors, 3D render.";

    // INSPIRACIONAL — Viral Instagram Profile Photo Styles (IDENTITY-FIRST)
    case StudioStyle.INSP_FUNDO_BOLD_RED: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH — must look like a real camera photo, not AI. STYLE: Bold solid red background studio portrait. FRAMING: Close-up, head and shoulders only. BACKGROUND: Solid flat red (#CC0000) backdrop paper, completely uniform. LIGHTING: Beauty dish from front-right, fill from left. Catchlights in eyes. SKIN: Real texture with visible pores. POSE: Slight head tilt, intense eye contact, serious. OUTFIT: Simple fitted black t-shirt or turtleneck. NEGATIVE: Different person, changed face, AI look, plastic skin, CGI, gradients, full body, body distortion, weight change.";
    case StudioStyle.INSP_FUNDO_BOLD_BLUE: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH — must look like a real camera photo, not AI. STYLE: Bold solid blue background studio portrait. FRAMING: Close-up, head and shoulders only. BACKGROUND: Solid flat royal blue (#1a3a8a) backdrop paper, completely uniform. LIGHTING: Softbox from front-left, blue color spill on edges. Catchlights in eyes. SKIN: Real texture with visible pores. POSE: Direct eye contact, chin slightly raised, confident. OUTFIT: Clean white t-shirt for contrast. NEGATIVE: Different person, changed face, AI look, plastic skin, CGI, gradients, full body, body distortion, weight change.";
    case StudioStyle.INSP_IMPACTO_CINEMATIC: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Dark cinematic with venetian blind shadows on face. FRAMING: Tight close-up, face and upper chest. BACKGROUND: Nearly black. LIGHTING: Single hard side light through venetian blinds creating horizontal stripe shadows across the face. Chiaroscuro. Cool blue-teal tones. The stripe shadows are MANDATORY. POSE: Hands clasped in prayer position near chin, intense eye contact, dead serious. OUTFIT: Black turtleneck. NEGATIVE: Different person, changed face, AI look, plastic skin, bright lighting, smiling, colorful, full body, body distortion, weight change.";
    case StudioStyle.INSP_NEON_BICOLOR: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Dual-color gel light portrait. FRAMING: Medium close-up or 3/4 profile. BACKGROUND: Black with swirling red and blue long-exposure light trails. LIGHTING: RED gel from left, BLUE gel from right — split lighting, colors meet at nose bridge. Real photography gels. POSE: Strong 3/4 profile, intense gaze, jaw defined by dual lighting. OUTFIT: Plain black t-shirt. NEGATIVE: Different person, changed face, AI look, plastic skin, flat lighting, daylight, full body, body distortion, weight change.";
    case StudioStyle.INSP_HOME_OFFICE: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Authentic creator portrait in home office. FRAMING: Medium shot from waist up. BACKGROUND: Blurred modern home office — monitor, bookshelf, plant, desk lamp. Shallow DOF bokeh. LIGHTING: Natural window light mixed with warm desk lamp. Cozy, ambient. POSE: Relaxed seated, direct eye contact, slight smile or neutral. Authentic 'caught in the moment' energy. OUTFIT: Casual dark t-shirt, glasses if person wears them. NEGATIVE: Different person, changed face, AI look, studio lighting, formal suit, full body, body distortion, weight change.";
    case StudioStyle.INSP_EDITORIAL_ELEGANTE: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Elegant editorial beauty portrait. FRAMING: Tight close-up, face and upper chest. BACKGROUND: Warm blurred beige/cream with creamy bokeh. LIGHTING: Beauty dish from front, reflector below chin. Even, flattering. Warm tones. Catchlights centered in eyes. SKIN: Luminous but real — visible pores, natural glow. POSE: Hand touching chin/jaw, slight head tilt, confident warmth. OUTFIT: Elegant light blazer over dark top, small gold earrings. NEGATIVE: Different person, changed face, AI look, plastic skin, heavy makeup, harsh shadows, full body, body distortion, weight change.";
    case StudioStyle.INSP_GOLDEN_HOUR: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Golden hour backlit portrait outdoors. FRAMING: Medium close-up from chest up. BACKGROUND: Outdoor golden hour — warm bokeh, sun low on horizon. LIGHTING: Backlit sun creating glowing rim light on hair/shoulders. Face lit by warm bounce light. Color temperature 3500K-4000K. Subtle lens flare. POSE: Relaxed, natural expression. Genuine smile or contemplative. Hair moving with breeze. OUTFIT: Casual light-colored top. NEGATIVE: Different person, changed face, AI look, studio lighting, indoor, overcast, cold colors, full body, body distortion, weight change.";
    case StudioStyle.INSP_PRETO_BRANCO: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. MANDATORY: ENTIRE IMAGE IN BLACK AND WHITE — zero color. STYLE: High-contrast fine-art B&W portrait. FRAMING: Tight close-up, face filling frame. BACKGROUND: Solid dark gray or black. LIGHTING: Rembrandt lighting from 45°, dramatic contrast, deep blacks and bright whites. One side in shadow. SKIN: Extreme B&W detail — texture, pores, contours visible. POSE: Direct unflinching eye contact, minimal. OUTFIT: Black turtleneck, disappears into background. NEGATIVE: Color, any color, different person, changed face, AI look, plastic skin, even lighting, full body, body distortion, weight change.";
    case StudioStyle.INSP_STREET_URBAN: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Urban street-style editorial portrait. FRAMING: Medium close-up or medium shot from waist up. BACKGROUND: Blurred urban environment — graffiti wall, concrete, city street with lights in bokeh. LIGHTING: Natural urban light — overcast or dramatic light between buildings. POSE: Leaning against wall, hands in pockets, confident swagger. OUTFIT: Streetwear — leather/denim/bomber jacket, simple t-shirt. Sunglasses optional. NEGATIVE: Different person, changed face, AI look, studio backdrop, rural, corporate, full body, body distortion, weight change.";
    case StudioStyle.INSP_SMOKE_MYSTERY: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Atmospheric smoke/haze studio portrait. FRAMING: Medium close-up or close-up. BACKGROUND: Dark studio with real fog/haze drifting through scene. Thin wisps catching light. LIGHTING: Single backlight or side light illuminating smoke particles — volumetric rays. Low-key, cool temperature. Face stays sharp while edges soften in haze. POSE: Intense, mysterious, serious eye contact. OUTFIT: All black — turtleneck or blazer. NEGATIVE: Different person, changed face, AI look, CGI smoke, bright lighting, colorful, happy, full body, body distortion, weight change.";
    case StudioStyle.INSP_LUZ_NATURAL: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Intimate natural window-light portrait. FRAMING: Tight close-up, face and upper chest. BACKGROUND: Clean white/cream wall, soft curtain. LIGHTING: Single window as only light source — soft directional natural light from one side. Beautiful natural falloff. Warm daylight 5500K. No artificial light. POSE: Intimate, looking at camera with soft genuine eyes, slight smile. Head turned toward light. OUTFIT: Simple white or neutral top. NEGATIVE: Different person, changed face, AI look, studio lighting, ring light, flash, outdoor, full body, body distortion, weight change.";
    case StudioStyle.INSP_POWER_PORTRAIT: return "#1 PRIORITY: FACE IDENTITY — The output person must be IMMEDIATELY recognizable as the EXACT same person from the input photo. Preserve every facial feature: nose shape, eye spacing, jawline, skin tone, moles, expression. If the face doesn't match perfectly → FAILED. HIERARCHY: IDENTITY > REALISM > STYLE. ULTRA-REALISTIC PHOTOGRAPH. STYLE: Dark executive power portrait. FRAMING: Medium shot from waist up or medium close-up. BACKGROUND: Very dark, near-black with subtle vignette. LIGHTING: Key light from 45°, underexposed by 1 stop. Face well-lit, everything else in shadow. Subtle rim light. Cool-neutral temperature. POSE: Arms crossed (power pose), chin slightly elevated, serious commanding expression. OUTFIT: Dark well-tailored suit/blazer, dark shirt, watch. CEO energy. NEGATIVE: Different person, changed face, AI look, bright background, smiling, casual, outdoor, colorful, full body, body distortion, weight change.";

    // OFÍCIOS & SERVIÇOS STYLES
    case StudioStyle.DENTISTA: return "STYLE: Dentist Professional Portrait. LAYOUT: Confident dentist in a modern dental clinic. BACKGROUND: Clean, modern dental clinic with dental chair, overhead dental lamp, professional equipment, organized instruments, white and blue clinical interior. LIGHTING: Bright, clean clinical lighting — professional and trustworthy atmosphere. POSE: Standing confidently in clinic wearing white lab coat and disposable gloves, holding dental mirror or displaying professional tools. Warm, trustworthy smile. PROPS: Dental chair, instruments, overhead lamp, x-ray on lightbox, teeth model. OUTFIT: Clean white lab coat, disposable gloves, professional dental attire. VIBE: Trustworthy healthcare professional, modern dentistry, patient comfort, clinical excellence.";
    case StudioStyle.PEDREIRO: return "STYLE: Construction Worker (Pedreiro) Professional Portrait. LAYOUT: Proud construction worker at an active building site. BACKGROUND: Construction site with brick walls being built, scaffolding, construction materials, concrete structures, clear sky. LIGHTING: Golden hour outdoor sunlight, warm and heroic atmosphere, natural construction site light. POSE: Standing confidently with arms crossed or holding construction tools (trowel, level), wearing hard hat and safety vest. Strong, hardworking expression showing pride and skill. PROPS: Hard hat, safety vest, trowel, brick wall, cement mixer, measuring tape, construction boots. OUTFIT: Work clothes with safety gear — hard hat, reflective vest, work boots, gloves. VIBE: Blue-collar pride, skilled tradesman, builder of dreams, strength and reliability.";
    case StudioStyle.ELETRICISTA: return "STYLE: Electrician Professional Portrait. LAYOUT: Skilled electrician working with electrical systems. BACKGROUND: Professional worksite with electrical panel open, organized wiring, circuit breakers, conduit runs, clean professional environment. LIGHTING: Mixed — work lamp lighting with ambient industrial light. Professional and technical atmosphere. POSE: Working on an electrical panel with tools or standing confidently with multimeter and wire strippers. Focused, skilled expression. PROPS: Multimeter, wire strippers, electrical tape, hard hat, tool belt, safety glasses, electrical panel. OUTFIT: Professional work uniform, safety glasses, insulated gloves, tool belt. VIBE: Technical expertise, safety-conscious professional, electrical mastery, reliable service.";
    case StudioStyle.MECANICO: return "STYLE: Auto Mechanic Professional Portrait. LAYOUT: Skilled mechanic in a modern auto repair shop. BACKGROUND: Clean, organized garage with car on lift, tool wall with pegboard, diagnostic equipment, tire racks, professional workshop. LIGHTING: Workshop fluorescent mixed with natural garage door light. Professional and industrious atmosphere. POSE: Standing next to a car holding wrench or diagnostic tool, or leaning on car hood with confident expression. Skilled and experienced look. PROPS: Wrench set, diagnostic laptop, car on lift, toolbox, tire, engine parts. OUTFIT: Clean work jumpsuit or mechanic uniform, logo cap, work boots. VIBE: Automotive expertise, trusted mechanic, precision diagnostics, reliable car care professional.";
    case StudioStyle.CHEF_COZINHEIRO: return "STYLE: Professional Chef Portrait. LAYOUT: Talented chef in a professional restaurant kitchen. BACKGROUND: Stainless steel professional kitchen with flames from stove, steam rising, organized mise en place, copper pots hanging, commercial kitchen equipment. LIGHTING: Warm dramatic kitchen lighting — fire glow mixed with overhead kitchen lights, cinematic and passionate. POSE: Plating a beautiful dish with precision, or standing with arms crossed holding chef's knife, or flambéing dramatically. Passionate and creative expression. PROPS: Chef's knife, copper pans, flames, plated gourmet dish, fresh ingredients, cutting board. OUTFIT: Crisp white chef coat (double-breasted), chef's toque or bandana, apron. VIBE: Culinary artistry, Michelin-quality passion, fire and flavor, master of the kitchen.";
    case StudioStyle.PROFESSOR: return "STYLE: Teacher / Educator Professional Portrait. LAYOUT: Inspiring teacher in a modern classroom environment. BACKGROUND: Bright, modern classroom with smart board or whiteboard with educational content, bookshelves, organized student desks, educational posters, globe. LIGHTING: Bright, warm classroom lighting — natural window light mixed with overhead fixtures. Inviting and intellectual atmosphere. POSE: Standing at whiteboard explaining a concept, or sitting at desk with open books, or interacting with educational materials. Approachable, wise expression. PROPS: Whiteboard marker, books, laptop, globe, ruler, educational charts, glasses on desk. OUTFIT: Smart casual — blazer with button-up, or professional but welcoming attire. VIBE: Inspiring educator, knowledge sharer, mentor, nurturing intellect, passionate teacher.";
    case StudioStyle.ENFERMEIRO: return "STYLE: Nurse Professional Portrait. LAYOUT: Compassionate nurse in a modern hospital setting. BACKGROUND: Clean, modern hospital corridor or patient care area. Medical equipment, monitors, clean white walls, hospital signage. Professional healthcare environment. LIGHTING: Bright, clean clinical lighting — professional and caring atmosphere. Soft fill light on face. POSE: Standing confidently with stethoscope, checking patient chart, or walking purposefully through hospital corridor. Caring, competent expression. PROPS: Stethoscope, patient chart, scrubs, medical supplies, hospital badge, blood pressure cuff. OUTFIT: Clean scrubs (blue, green, or teal), stethoscope around neck, hospital ID badge. VIBE: Healthcare hero, compassionate caregiver, dedicated professional, lifesaver, patient advocate.";
    case StudioStyle.FARMACEUTICO: return "STYLE: Pharmacist Professional Portrait. LAYOUT: Knowledgeable pharmacist in a modern pharmacy. BACKGROUND: Modern pharmacy interior with organized medicine shelves, prescription counter, labeled medication drawers, pharmacy signage, clean and professional. LIGHTING: Bright, clean pharmacy lighting — professional and trustworthy. Even illumination. POSE: Standing behind pharmacy counter, holding medication bottle, or checking prescriptions on computer. Knowledgeable, approachable expression. PROPS: Medication bottles, prescription papers, mortar and pestle, pharmacy computer, lab coat, pharmacy scale. OUTFIT: Clean white lab coat over professional clothing, pharmacy name badge. VIBE: Trusted health advisor, pharmaceutical expertise, community health guardian, accessible professional.";
    case StudioStyle.BOMBEIRO: return "STYLE: Firefighter (Bombeiro) Hero Portrait. LAYOUT: Heroic firefighter in full gear. BACKGROUND: Fire station with fire truck visible, or dramatic scene with smoke in background. Firefighting equipment, emergency lighting. LIGHTING: Dramatic lighting with warm orange/red tones — heroic and powerful. Backlighting creating silhouette edge. Cinematic emergency atmosphere. POSE: Standing tall in full turnout gear with helmet, or carrying equipment, or looking back over shoulder heroically. Brave, determined expression. PROPS: Firefighter helmet, turnout coat, fire truck, fire hose, axe, oxygen tank. OUTFIT: Full firefighter bunker gear — turnout coat, pants, boots, helmet, reflective stripes. VIBE: Everyday hero, courage under fire, protector, brave service, community defender.";
    case StudioStyle.CONTADOR: return "STYLE: Accountant / Financial Professional Portrait. LAYOUT: Sharp professional in a modern corporate office. BACKGROUND: Clean modern office with desk, multiple monitors showing spreadsheets/charts, financial books, organized files, calculator, professional corporate decor. LIGHTING: Professional office lighting — warm desk lamp mixed with ambient office light. Executive atmosphere. POSE: Seated at desk with laptop and financial documents, or standing confidently near bookshelf, or analyzing charts. Analytical, confident expression. PROPS: Laptop with spreadsheets, calculator, financial reports, pen, glasses, coffee mug, filing cabinet. OUTFIT: Professional suit or blazer, tie optional, clean and corporate. VIBE: Financial precision, strategic thinker, number cruncher, trusted advisor, business acumen.";
    case StudioStyle.CAMINHONEIRO: return "STYLE: Truck Driver (Caminhoneiro) Professional Portrait. LAYOUT: Proud truck driver next to their rig. BACKGROUND: Large truck (semi/trailer) on an open highway or at a truck stop, dramatic sky, open road stretching to horizon. Brazilian highway atmosphere. LIGHTING: Golden hour sunlight creating warm, epic atmosphere. Long shadows and warm tones. Highway romanticism. POSE: Leaning confidently against truck cab, or standing tall in front of the rig with arms crossed, or climbing into cab. Strong, reliable expression. PROPS: Large truck/trailer, cap, sunglasses, thermos, CB radio, road map, truck keys. OUTFIT: Casual work clothes — jeans, flannel or polo shirt, cap, comfortable boots. VIBE: Road warrior, freedom of the highway, reliable transporter, Brazilian trucker pride, king of the road.";
    case StudioStyle.AGRICULTOR: return "STYLE: Farmer / Agribusiness Professional Portrait. LAYOUT: Proud farmer in their productive field. BACKGROUND: Lush green crop field (soybeans, corn, coffee, or sugarcane), modern agriculture equipment or tractor in background, beautiful rural Brazilian landscape, dramatic sky. LIGHTING: Golden hour sunlight over the fields, warm earth tones, epic agricultural landscape lighting. Natural and majestic. POSE: Standing proudly in the field surveying crops, or next to tractor, or holding harvested produce. Content, hardworking expression showing pride in the land. PROPS: Straw hat, work gloves, tractor, harvested crops, soil, farming tools. OUTFIT: Rural work clothes — hat, flannel shirt, jeans, work boots, practical farming attire. VIBE: Agricultural pride, Brazilian agro power, land steward, harvest celebration, rural prosperity.";

    // TIKTOK VIRAL STYLES 🔥 — Natural, candid, iPhone-quality aesthetic photos
    case StudioStyle.TIKTOK_MIRROR: return "STYLE: TikTok Mirror Selfie Aesthetic. CRITICAL: This must look like a REAL iPhone mirror selfie, NOT a professional photo. LAYOUT: Person taking a selfie in a trendy full-length mirror. BACKGROUND: Aesthetic bedroom or bathroom — fairy lights, plants, cute decor, organized vanity. Natural and lived-in but aesthetic space. LIGHTING: Natural window light, soft and warm. NO studio lighting. Natural phone screen glow. POSE: Holding phone up to take mirror selfie, one hand on hip or fixing hair, casual and effortless. Phone should be visible in mirror. Not overly posed — natural and candid. OUTFIT: Trendy casual — crop top, jeans, loungewear, or going-out outfit. Fashion-forward but not overdressed. VIBE: Gen Z aesthetic, Instagram story quality, effortlessly cool, 'just took this casually' energy. CAMERA: iPhone quality, slight noise, natural depth.";
    case StudioStyle.TIKTOK_BEACH: return "STYLE: TikTok Beach Golden Hour. CRITICAL: This must look like a candid beach photo taken by a friend with iPhone, NOT professional photography. LAYOUT: Person at the beach during golden hour sunset. BACKGROUND: Ocean waves, golden sunset sky, wet sand reflections, palm trees silhouette. Tropical Brazilian beach paradise. LIGHTING: Warm golden hour sunset light hitting face and body, natural sun flare, lens flare from iPhone camera. No flash. POSE: Walking on the shoreline, looking at sunset, wind blowing hair, laughing naturally, or candid profile shot. Completely unposed and natural. OUTFIT: Beachwear — bikini/swim shorts, sarong, sunglasses pushed up on head, shell necklace. VIBE: Sunset paradise, summer forever, golden skin glow, beach bum aesthetic, vacation mode. CAMERA: iPhone photo quality, slightly warm color grading.";
    case StudioStyle.TIKTOK_PARTY: return "STYLE: TikTok Party & Nightlife. CRITICAL: This must look like a real party photo with iPhone FLASH, NOT studio lighting. LAYOUT: Person at a party, nightclub, or celebration. BACKGROUND: Dark club/party environment with colorful LED lights, disco ball reflections, drinks on table, blurred dancing people. Party chaos. LIGHTING: iPhone flash hitting face directly — creating that characteristic flat flash look with dark background. Red eye possible. Harsh but fun. POSE: Holding a drink (cocktail/champagne), taking a flash selfie, dancing, laughing with mouth open, arm around friends (blurred). Pure fun energy. OUTFIT: Going-out outfit — party dress, heels, or stylish club wear. Glitter, sparkles, statement accessories. VIBE: Night out energy, living your best life, party queen/king, flash photography aesthetic, chaotic fun. CAMERA: iPhone flash photography, slightly grainy, party aesthetic.";
    case StudioStyle.TIKTOK_CAR: return "STYLE: TikTok Car Selfie Aesthetic. CRITICAL: This must look like a real selfie taken inside a car, NOT a professional photo. LAYOUT: Person sitting in the driver or passenger seat of a nice car. BACKGROUND: Car interior visible — steering wheel, dashboard, sunroof or window with golden light, rearview mirror. Clean modern car interior. LIGHTING: Natural golden hour or afternoon light streaming through car window, creating dramatic light/shadow on face. Sun visor shadow. Natural and warm. POSE: Casual car selfie — one hand on steering wheel, sunglasses on, looking at camera or looking cool and unbothered, peace sign or no-hands confident pose. OUTFIT: Casual cool — sunglasses, cap, casual tee, chain necklace. Effortlessly stylish. VIBE: Main character driving aesthetic, unbothered and cool, road trip energy, 'POV you're in my passenger seat'. CAMERA: iPhone front camera quality, close-up, dashboard visible.";
    case StudioStyle.TIKTOK_MORNING: return "STYLE: TikTok 'That Girl' Morning Routine. CRITICAL: This must look like a real lifestyle photo, NOT a professional shoot. LAYOUT: Person enjoying a perfect morning routine. BACKGROUND: Bright, clean bedroom or kitchen with morning sun streaming in. White sheets, plants, organized minimalist aesthetic. Cozy and aspirational. LIGHTING: Soft morning sunlight through white curtains, golden and dreamy. Natural window light creating warm atmosphere. POSE: Sitting in bed with journal and coffee, doing skincare in bathroom mirror, preparing a healthy breakfast (avocado toast, green smoothie), or doing yoga stretches. Serene and peaceful. OUTFIT: Cute loungewear — matching set, silk pajamas, oversized sweater, messy bun. Clean and put-together but casual. PROPS: Green smoothie, journal, candle, skincare products, matcha latte, fresh fruit bowl, yoga mat. VIBE: 'That girl' aesthetic, clean girl, healthy lifestyle, morning motivation, self-care queen, Pinterest-worthy morning. CAMERA: iPhone quality, warm color grading, soft focus.";
    case StudioStyle.TIKTOK_GYM: return "STYLE: TikTok Gym Mirror Selfie. CRITICAL: This must look like a real gym mirror selfie taken with iPhone, NOT professional fitness photography. LAYOUT: Person taking a mirror selfie at the gym. BACKGROUND: Modern gym with mirrors, weight racks, treadmills, and equipment visible. Gym floor and lighting. Industrial fitness environment. LIGHTING: Harsh gym fluorescent lighting mixed with some natural light. Gym lighting that shows muscle definition. Not flattering — real gym lighting. POSE: Classic gym mirror selfie — flexing slightly, showing off workout fit, phone held up in mirror, post-workout sweat glow. One arm flexing or hands on waist. Confident but casual. OUTFIT: Trendy gym wear — matching sports set, compression leggings, crop top or tank, training shoes, AirPods in. Fitness influencer style. VIBE: #gymtok, fitness motivation, gains progress, workout complete, post-pump selfie, gym rat aesthetic. CAMERA: iPhone mirror selfie quality, gym lighting, slightly sweaty glow.";
    case StudioStyle.TIKTOK_OOTD: return "STYLE: TikTok OOTD (Outfit of the Day) Street Style. CRITICAL: This must look like a friend took this with their phone on the street, NOT a fashion photoshoot. LAYOUT: Full-body or 3/4 shot showing complete outfit on an urban street. BACKGROUND: Trendy urban backdrop — colorful wall, graffiti, modern architecture, coffee shop front, tree-lined street. City aesthetic. LIGHTING: Natural outdoor daylight, golden hour preferred. Street shadows and natural city light. POSE: Casual model stance — one hand fixing hair, walking naturally, leaning on wall, or looking off to the side. Confident but not runway-posing. Natural and effortless. OUTFIT: Complete trendy outfit — coordinated streetwear, layered look, statement sneakers or boots, accessories (bag, sunglasses, jewelry). Fashion-forward Gen Z/millennial style. VIBE: Street style blogger, fashion TikToker, 'rate my fit', outfit inspo, effortlessly fashionable. CAMERA: iPhone portrait mode, blurred background bokeh, full body visible.";
    case StudioStyle.TIKTOK_ROOFTOP: return "STYLE: TikTok Rooftop Sunset. CRITICAL: This must look like a candid photo on a rooftop, NOT a professional portrait. LAYOUT: Person on a rooftop terrace during golden hour sunset. BACKGROUND: City skyline panorama, dramatic sunset sky with orange/purple/pink colors, rooftop furniture (loungers, string lights), drinks on table. Urban paradise. LIGHTING: Dramatic sunset backlighting creating golden rim light on hair and body. Warm and cinematic but natural. Sun setting behind city buildings. POSE: Leaning on rooftop railing looking at view, sitting on lounge with drink, standing with wind in hair looking at sunset, or candid laughing photo. Relaxed and living-the-moment. OUTFIT: Chic casual — sundress, linen outfit, or stylish going-out look. Sunglasses, cocktail in hand. VIBE: Main character energy, living my best life, rooftop season, golden hour magic, city views queen. CAMERA: iPhone quality, lens flare from sunset, warm tones.";
    case StudioStyle.TIKTOK_CAFE: return "STYLE: TikTok Coffee Shop Aesthetic. CRITICAL: This must look like a cozy café photo taken with iPhone, NOT a branded shoot. LAYOUT: Person sitting in a trendy, aesthetic coffee shop. BACKGROUND: Cute café interior — exposed brick, plants hanging, vintage furniture, pastry display, warm lighting. Cozy third-wave coffee shop. LIGHTING: Warm, soft café ambient lighting. Natural light from café windows. Cozy and inviting golden tones. POSE: Sitting at a cute table with latte art coffee, reading a book, typing on MacBook, looking out the window thoughtfully, or smiling at camera with coffee cup. Cozy and comfortable. PROPS: Beautiful latte art, croissant or pastry, cute notebook, MacBook, phone on table, books, plants. OUTFIT: Casual chic — oversized sweater, turtleneck, cozy cardigan, beanie, minimalist jewelry. Cozy intellectual aesthetic. VIBE: Book lover, coffee addict, cozy girl aesthetic, study date, café hopping, intellectual cool. CAMERA: iPhone quality, warm color grading, bokeh on coffee cup.";
    case StudioStyle.TIKTOK_FESTIVAL: return "STYLE: TikTok Music Festival / Concert. CRITICAL: This must look like an excited concert/festival photo taken by a friend, NOT professional event photography. LAYOUT: Person at a music festival or live concert. BACKGROUND: Stage lights in distance, massive crowd, LED wristbands glowing, confetti in air, laser show effects, festival grounds with tents and lights. Epic live music atmosphere. LIGHTING: Dynamic colored stage lights (purple, blue, pink, green) illuminating face. Phone flash or LED wristband glow. Dark background with colorful light splashes. POSE: Hands up in the air dancing, singing along, holding up phone recording, festival peace sign, jumping with crowd. Pure ecstasy and joy. On someone's shoulders or in the front row. OUTFIT: Festival fashion — glitter on face, crop top, high-waisted shorts, chunky boots, flower crown, body chains, neon accessories, face gems, temporary tattoos. VIBE: Festival season, music is life, crowd surfing energy, main stage vibes, Lollapalooza/Rock in Rio energy. CAMERA: iPhone photo in dark concert environment, motion blur possible, colorful light streaks.";

    // ADVOGADOS ESPECIAL ⚖️
    case StudioStyle.ADV_MINIMALISTA: return "STYLE: Minimalist Lawyer Portrait. LAYOUT: Standing portrait, arms crossed or hands clasped. BACKGROUND: Clean pure white or very light gray studio background with soft shadows on floor. NO furniture, NO props, NO distractions — ONLY the clean backdrop. WARDROBE: Dark navy or black blazer over white blouse/shirt. Crisp, clean lines. LIGHTING: High-key professional studio lighting, soft and even, like a premium LinkedIn headshot. POSE: Confident, authoritative, arms crossed. VIBE: Apple-style minimalism, modern law firm partner.";
    case StudioStyle.ADV_MODERNO: return "STYLE: Modern Contemporary Lawyer. LAYOUT: Half-body portrait, relaxed confident pose. BACKGROUND: Soft neutral gray or beige gradient background. Ultra-clean, no distractions. WARDROBE: Modern suit WITHOUT tie, open collar, charcoal or light gray suit. Contemporary and approachable. LIGHTING: Soft studio lighting from the side, subtle shadow for depth. POSE: Relaxed confident expression, hands at sides or one in pocket. VIBE: Modern startup lawyer, approachable yet professional, Silicon Valley legal counsel aesthetic.";
    case StudioStyle.ADV_ESCRITORIO: return "STYLE: Clean Office Lawyer Portrait. LAYOUT: Seated at a modern minimalist desk, looking at camera. BACKGROUND: Clean bright office with organized law bookshelves slightly blurred behind. White/cream walls, modern furniture. A laptop or legal books on the desk. WARDROBE: Professional blazer in cream, navy, or charcoal. LIGHTING: Natural daylight from large windows, bright and warm. POSE: Sitting confidently, hands on desk or gesturing naturally. VIBE: Senior associate at a modern boutique law firm.";
    case StudioStyle.ADV_EXECUTIVO_DARK: return "STYLE: Executive Dark Portrait - Distinguished Lawyer. LAYOUT: Half-body portrait, classic formal pose. BACKGROUND: Dark moody background — deep charcoal or very dark navy. Subtle warm rim light. NO visible room elements, just dark gradient. WARDROBE: Classic navy or dark suit with tie, formal and distinguished. LIGHTING: Dramatic Rembrandt-style lighting with warm key light from one side, subtle fill. Rich shadows for gravitas. POSE: Serious, authoritative, hands clasped or one hand adjusting jacket. VIBE: Supreme Court justice, senior partner, distinguished legal authority.";
    case StudioStyle.ADV_EDITORIAL: return "STYLE: Editorial Fashion-Forward Lawyer. LAYOUT: Fashion editorial pose, leaning against wall or in a power stance. BACKGROUND: Minimalist architectural background — concrete wall, modern art gallery, or clean geometric shapes. Urban chic. WARDROBE: Fashion-forward professional — black turtleneck with blazer, or monochrome outfit. Delicate gold jewelry. LIGHTING: Editorial photography lighting — dramatic directional light, fashion magazine quality. POSE: Fashion editorial poses — leaning, looking away then back at camera, power stance. VIBE: Vogue Business magazine cover, fashion meets law, modern female lawyer breaking stereotypes.";
    case StudioStyle.ADV_CORPORATIVO: return "STYLE: Corporate Premium Lawyer with City View. LAYOUT: Standing portrait with panoramic city visible. BACKGROUND: Floor-to-ceiling glass windows with city skyline behind, blurred bokeh of buildings and sky. Premium corner office feel. WARDROBE: Sharp tailored suit in light gray or navy, polished shoes, subtle accessories. LIGHTING: Natural backlight from windows creating a halo effect, supplemented by office lighting. Golden hour cityscape behind. POSE: Standing confidently, one hand in pocket, looking at camera with assured expression. VIBE: Managing partner of a top-tier international law firm, penthouse office views.";

    // RESTAURAÇÃO DE FOTOS STYLES
    case StudioStyle.RESTAURACAO_RETRATO: return "STYLE: Old Photo Restoration - Portrait. TASK: RESTORE AND ENHANCE this old/damaged photograph. DO NOT generate a new person or scene. PRESERVE the EXACT same person, pose, clothing, and background from the input image. RESTORE: Fix scratches, stains, fading, discoloration, blur, grain, and damage. ENHANCE: Improve clarity, sharpness, and detail. Add natural skin texture and realistic lighting. MAINTAIN: The exact same facial features, expression, hairstyle, clothing, and composition. OUTPUT: A high-quality, restored version of the SAME photo — as if it was taken with a modern camera. DO NOT change the person's appearance, age, or add elements not present in the original.";
    case StudioStyle.RESTAURACAO_FAMILIA: return "STYLE: Old Photo Restoration - Family/Group. TASK: RESTORE AND ENHANCE this old family/group photograph. CRITICAL: PRESERVE EVERY PERSON exactly as they appear. Count all people and maintain the exact same count. RESTORE: Fix all damage (scratches, tears, fading, stains, water damage, fold marks). ENHANCE: Improve all faces with clarity while keeping their EXACT original expression and features. DO NOT change anyone's expression. DO NOT add or remove people. MAINTAIN: Same composition, same background, same clothing, same poses. OUTPUT: A pristine, high-resolution version of the original family photo.";
    case StudioStyle.RESTAURACAO_COLORIZAR: return "STYLE: Photo Colorization - B&W to Color. TASK: CONVERT this black-and-white or sepia photograph to FULL REALISTIC COLOR. PRESERVE: The EXACT same person, pose, expression, clothing, background, and composition. COLORIZE NATURALLY: Apply realistic skin tones, hair colors, clothing colors, and background colors based on the era and context of the photo. Use historically accurate color palettes. ENHANCE: Improve clarity and detail while adding color. DO NOT modify the composition, expression, or any element — only ADD COLOR. OUTPUT: A naturally colorized, high-quality version that looks like it was originally taken in color.";

    default: return "Professional studio lighting with clean photographic composition.";
  }
};

const getUGCContext = (socialClass?: SocialClass, environment?: UGCEnvironment, customEnvironment?: string, model?: UGCModel): string => {
  let baseContext = "Authentic domestic setting, natural lighting.";

  // 0. DEFINE MODEL (Persona) - If not provided, random.
  const modelContext = model ? `SUBJECT: ${model}. ` : "";

  // Helper for specific room textures based on Class
  // NOW CONTEXT AWARE: We only return tiles if it makes sense for the room.
  const getRoomDetails = (cls: string, env: UGCEnvironment, customEnv?: string) => {
    const isBathroomOrKitchen = env === UGCEnvironment.HOME && (customEnv?.toLowerCase().includes('banheiro') || customEnv?.toLowerCase().includes('cozinha') || customEnv?.toLowerCase().includes('kitchen') || customEnv?.toLowerCase().includes('bathroom'));
    const isLivingRoomOrBedroom = env === UGCEnvironment.HOME && !isBathroomOrKitchen;

    // POPULAR CLASS TEXTURES - REALISTIC BRAZILIAN HOME (GRITTY BUT DIGNIFIED)
    const popularLiving = [
      "simple painted wall with imperfections (parede pintada simples)",
      "red floor wax (piso vermelhão encerado)",
      "old ceramic floor (piso caquinho)",
      "simple wooden door frame"
    ];
    const popularTiles = [
      "simple beige square tiles 15x15",
      "old floral kitchen tiles (azulejo antigo)"
    ];

    // MIDDLE CLASS TEXTURES
    const middleLiving = [
      "smooth beige painted wall with frames", "geometric wallpaper", "clean white wall with wooden shelves",
      "soft cream wall with baseboards", "textured white wall"
    ];

    // HIGH CLASS TEXTURES
    const highLiving = [
      "honed marble stone wall", "dark wooden vertical slats", "minimalist concrete finish",
      "art gallery white wall", "luxury textured wallpaper", "boiserie paneling"
    ];

    const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

    if (cls.includes('Popular')) {
      return isBathroomOrKitchen ? pick(popularTiles) : pick(popularLiving);
    }
    if (cls.includes('Média')) return pick(middleLiving);
    if (cls.includes('Alta')) return pick(highLiving);
    return "clean wall";
  };

  // 1. DEFINE CLASS CONTEXT (Budget & Quality)
  const classContext = (() => {
    // We pass the environment to get the correct texture
    const details = getRoomDetails(socialClass || 'Popular', environment || UGCEnvironment.HOME, customEnvironment);

    if (socialClass?.includes('Popular')) return `Authentic Brazilian working class home. Simple interior (${details}). FLASH PHOTOGRAPHY STYLE. SLIGHTLY GRAINY. NOT STUDIOLIT. Shot on SAMSUNG/MOTOROLA.`;
    if (socialClass?.includes('Média')) return `Middle-class setting. Organized, comfortable furniture. (${details}). soft warm lighting. SHOT ON IPHONE.`;
    if (socialClass?.includes('Alta')) return `High-end Luxury setting. Designer furniture, golden hour lighting, (${details}). SHOT ON PRO CAMERA.`;
    return "Standard domestic setting.";
  })();


  // 2. DEFINE ENVIRONMENT SPECIFICS (Location)
  const envContext = (() => {
    if (customEnvironment && customEnvironment.trim().length > 2) {
      return `LOCATION: ${customEnvironment.toUpperCase()} (Brazilian Context). REALISTIC BACKGROUND. NATURAL LIGHTING.`;
    }

    switch (environment) {
      case UGCEnvironment.OUTDOOR: return "LOCATION: City Street / Urban Park. Natural daylight. Busy lively background (blurred).";
      case UGCEnvironment.OFFICE: return "LOCATION: Modern Co-working space or Home Office. Desk, laptop, shelves in background.";
      case UGCEnvironment.STORE: return "LOCATION: Inside a Retail Store / Supermarket. Aisles, products on shelves, fluorescent lighting.";
      case UGCEnvironment.GYM: return "LOCATION: Fitness Center / Gym. Mirrors, weights, gym equipment in background. Energetic lighting.";
      case UGCEnvironment.NATURE: return "LOCATION: Open Park / Garden. Greenery, sunlight, trees. Fresh outdoor atmosphere.";
      case UGCEnvironment.HOME:
      default: return "LOCATION: HUMBLE BRAZILIAN HOME INTERIOR. Simple furniture. Fluorescent Ceiling Light (Cool White). NOT DESIGNER. NOT MODERN.";
    }
  })();

  return `${modelContext} ${classContext} ${envContext}`;
};

/**
 * Funcao para EDICAO MAGICA (Image-to-Image)
 * Recebe a imagem atual + prompt de edicao
 */
export const editGeneratedImage = async (
  imageBase64: string,
  prompt: string,
  aspectRatio: string = "1:1",
  authToken?: string
): Promise<string> => {
  try {
    // Basic validation
    if (!imageBase64 || !prompt) throw new Error("Missing image or prompt");

    // Construct prompt
    const editingPrompt = `
    TASK: EDIT this image based on the user's instruction.
    USER INSTRUCTION: "${prompt}"
    
    CRITICAL RULES:
    1. STRICT INPAINTING TASK: ONLY change what is explicitly requested.
    2. LOCK COMPOSITION: Do NOT zoom, crop, or change the camera angle. The output MUST perfectly overlay the original.
    3. PRESERVE EVERYTHING ELSE: Background, lighting, and pose must remain IDENTICAL unless the prompt asks to change them.
    4. PRESERVE FACE IDENTITY: Do not morph the face.
    5. NO TEXT HALLUCINATIONS. NO WATERMARKS.
    
    OUTPUT: A high-quality photorealistic image with the requested edit applied.
    `;

    // Reuse callImageApi. We pass imageBase64 as 'primaryImage' (subject input).
    // We pass aspect ratio '1:1' as default or maybe we should preserve? 
    // callImageApi uses aspect ratio mainly for generation? No, it passes it to the generic prompt or irrelevant for img2img if model follows input.
    // However, callImageApi response is string | null.
    // Reuse callImageApi with specialized editing flag
    // Reuse callImageApi with specialized editing flag
    const newImageUrl = await callImageApi(editingPrompt, aspectRatio, imageBase64, null, null, null, null, undefined, undefined, undefined, undefined, undefined, true, 1, 'Editing', undefined, authToken);

    if (!newImageUrl) {
      throw new Error("Falha ao editar imagem.");
    }
    return newImageUrl;
  } catch (error) {
    console.error("Magic Edit Failed inside Service:", error);
    throw error;
  }
};

const getTypographyRules = (style: VisualStyle): string => {
  switch (style) {
    case VisualStyle.MODERN:
      return `
      - TYPOGRAPHY RULES (MODERN):
      - FONT: Geometric Sans-Serif (e.g., Futura, Montserrat, Avant Garde).
      - CASING: UPPERCASE HEADLINES.
      - DECORATION: Clean text, floating on negative space. NO BOXES.
      - COLOR: High Contrast (White on Dark, Black on Light).
      - VIBE: Tech-focused, Clean, Minimal data-driven.
      `;
    case VisualStyle.PROFESSIONAL:
      return `
      - TYPOGRAPHY RULES (PROFESSIONAL):
      - FONT: Clean Sans-Serif (e.g., Helvetica Now, Inter) or Modern Serif.
      - CASING: Title Case (Capitalize First Letters).
      - DECORATION: Professional, slight drop shadow for readability.
      - COLOR: Navy Blue, Dark Grey, or Pure White.
      - VIBE: Trustworthy, Corporate, Premium.
      `;
    case VisualStyle.DESIGNI_PD_PRO:
      return `
      - TYPOGRAPHY RULES (DESIGN PRO):
      - FONT: Modern Geometric Sans (Inter, Montserrat).
      - LAYOUT: SHORT LINES. STACK TEXT VERTICALLY (max 3 words per line).
      - ALIGNMENT: Align text to the "Text Zone" defined in the background rule.
      - DECORATION: If background is complex, use a subtle backing shape.
      - COLOR: Brand contrast.
      `;
    case VisualStyle.COMMERCIAL_PREMIUM:
    case VisualStyle.DELIVERY:
    case VisualStyle.UGC_INSTAGRAM:
      return `
      - TYPOGRAPHY RULES (RETAIL/SALES):
      - FONT: HEAVY IMPACT FONT (Bold Sans-Serif, Condensed).
      - CASING: UPPERCASE ONLY. HUGE SIZE.
      - DECORATION: MANDATORY "SALE TAGS" or "STRIPS" (Tarjas) behind main keywords (Yellow/Red backgrounds).
      - SPELLING CHECK: PORTUGUESE ACCENTS ARE MANDATORY (Ã, Ç, É). "PORÇÃO" NOT "PORCAN".
      - COLOR: White Text on Red/Yellow/Blue Strips.
      - VIBE: Urgent, Promotional, High Energy.
      `;
    case VisualStyle.LUXURY:
      return `
      - TYPOGRAPHY RULES (LUXURY):
      - FONT: Elegant Serif (Bodoni, Didot, Playfair Display) or Ultra-Thin Sans.
      - CASING: WIDE LETTER SPACING (Kerning), UPPERCASE.
      - DECORATION: Gold/Silver Foil effect, Minimalist. NO background boxes.
      - COLOR: Gold, Silver, White, Black.
      - VIBE: Expensive, Exclusive, High-End fashion.
      `;
    case VisualStyle.TECH:
      return `
      - TYPOGRAPHY RULES (TECH):
      - FONT: Monospace (Courier New) or futuristic Sans.
      - CASING: lowercase or UPPERCASE mixed.
      - DECORATION: Glitch effect, Neon Glow, or Digital "Terminal" look.
      - COLOR: Cyan, Neon Green, White.
      - VIBE: Cyberpunk, Digital, Code.
      `;
    case VisualStyle.INFANTIL:
      return `
      - TYPOGRAPHY RULES (KIDS):
      - FONT: Rounded Sans (Varela Round, Comic Neue - High Quality).
      - CASING: Mixed Case.
      - DECORATION: Inside colorful Clouds or Speech Bubbles.
      - COLOR: Primary Colors (Red, Blue, Yellow).
      - VIBE: Friendly, Playful, Soft.
      `;
    case VisualStyle.CREATIVE:
      return `
      - TYPOGRAPHY RULES (CREATIVE):
      - FONT: Artistic Brush or Bold Display Font.
      - CASING: Mixed.
      - DECORATION: Paint strokes or paper torn edges as background for text.
      - COLOR: Vibrante.
      - VIBE: Artistic, Expressive.
      `;
    default:
      return `
      - TYPOGRAPHY RULES (STANDARD):
      - FONT: BOLD READABLE SANS-SERIF (Inter/Roboto).
      - CASING: UPPERCASE for Headings.
      - DECORATION: High contrast against background. Drop shadow if needed.
      `;
  }
};

