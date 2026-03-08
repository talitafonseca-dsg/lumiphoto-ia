
export enum CreationType {
  SOCIAL_POST = 'Post para Redes Sociais',
  STUDIO_PHOTO = 'Foto de Estúdio com IA',
  MASCOT = 'Criar Mascote com IA',
  CREATIVE_BACKGROUND = 'Fundo Criativo / PPT',
  YOUTUBE_THUMB = 'Thumbnail para YouTube',
  MOCKUP = 'Criar Mockup Profissional'
}

export enum VisualStyle {
  MODERN = 'Moderno',
  PROFESSIONAL = 'Profissional',
  CREATIVE = 'Criativo',
  CLEAN = 'Clean',
  DARK = 'Dark',
  LUXURY = 'Luxo',
  MINIMALIST = 'Minimalista',
  TECH = 'Tecnológico',
  INFANTIL = 'Infantil',
  UGC_INSTAGRAM = 'UGC Instagram',
  EDITORIAL = 'Editorial',
  COMMERCIAL_PREMIUM = 'Comercial Premium',
  GLOW_BEAUTY = 'Glow Beauty',
  DESIGNI_PD_PRO = 'Design Pro',
  RELIGIOUS = 'Religioso',
  DELIVERY = 'Delivery & Food'
}

export enum StudioStyle {
  // BUSINESS & PROFISSÕES
  EXECUTIVO_PRO = 'Executivo Pro',
  ADVOGADO = 'Advogado',
  MEDICO_DENTISTA = 'Médico / Dentista',
  CORRETOR_IMOVEIS = 'Corretor de Imóveis',
  ENGENHEIRO = 'Engenheiro Civil',
  ARQUITETO = 'Arquiteto / Design',
  PSICOLOGO = 'Psicólogo',
  DESIGNER_GRAFICO = 'Designer Gráfico',
  VENDEDOR_CARROS = 'Vendedor de Carros',

  // NOVOS
  SOCIAL_MEDIA = 'Social Media Manager',
  PODCASTER = 'Podcaster / Influencer',
  PET_SHOP = 'Pet Shop / Vet',
  CONSULTOR_FINANCEIRO = 'Consultor Financeiro', // NOVO

  // MODA & BELEZA
  EDITORIAL_VOGUE = 'Editorial Vogue',
  LUXURY_GOLD = 'Luxury Gold',
  GLOW_BEAUTY = 'Glow Beauty',
  OLD_MONEY = 'Old Money',
  MAQUIADORA = 'Maquiadora',
  CABELEIREIRO = 'Cabeleireiro',
  JEWELRY_MACRO = 'Joias & Detalhes',
  SKINCARE_ORGANIC = 'Skincare Natural', // NOVO
  STREET_FASHION = 'Moda Urbana', // NOVO
  BRIDAL_LUXURY = 'Noiva Luxo', // NOVO
  MEN_GROOMING = 'Barbearia & Estilo', // NOVO
  PERFUME_ELEGANCE = 'Perfumaria', // NOVO
  MANICURE = 'Manicure & Nail Art', // NOVO
  DESIGNER_SOBRANCELHA = 'Design de Sobrancelhas', // NOVO
  DEPILADORA = 'Depiladora', // NOVO
  PENTEADOS = 'Penteados & Updos', // NOVO

  // LIFESTYLE & SAÚDE
  FITNESS_PRO = 'Fitness Pro',
  NATURE_FRESH = 'Eco Nature',
  COASTAL_LUXE = 'Coastal Luxe',
  URBAN_STREET = 'Urban Street',
  PERSONAL_TRAINER = 'Personal Trainer',
  NUTRICIONISTA = 'Nutricionista',
  YOGA_WELLNESS = 'Yoga & Bem-estar', // NOVO
  TRAVEL_BLOGGER = 'Travel Blogger', // NOVO
  COFFEE_LOVER = 'Coffee Lifestyle', // NOVO
  GAMER_STREAMER = 'Gamer / Streamer', // NOVO
  MUSICIAN_VIBE = 'Músico / Artista', // NOVO
  DIY_CRAFTS = 'Artesanato / DIY', // NOVO

  // FAMÍLIA
  FAMILY_STUDIO_CLEAN = 'Família: Estúdio Clean',
  FAMILY_LIFESTYLE_HOME = 'Família: Em Casa',
  FAMILY_GOLDEN_HOUR = 'Família: Pôr do Sol',
  FAMILY_BEACH = 'Família: Praia',
  FAMILY_CHRISTMAS = 'Família: Especial Natal',
  FAMILY_PICNIC = 'Família: Piquenique', // NOVO
  MATERNITY_SOFT = 'Gestante', // NOVO
  NEWBORN_ART = 'Newborn Art', // NOVO
  KIDS_PLAYGROUND = 'Crianças no Parque', // NOVO
  GENERATIONS_PORTRAIT = 'Gerações (Avós)', // NOVO
  FAMILY_KITCHEN = 'Cozinhando Juntos', // NOVO
  PET_FRIENDLY_FAMILY = 'Família com Pets', // NOVO

  // ANIVERSÁRIO
  BDAY_BALOES_ROSE = 'Aniver: Balões Rose Gold',
  BDAY_CONFETTI = 'Aniver: Chuva de Confetti',
  BDAY_BALOES_NUMERO = 'Aniver: Balões com Número',
  BDAY_LUXO_DOURADO = 'Aniver: Luxo Dourado',
  BDAY_ESTUDIO_CLEAN = 'Aniver: Estúdio Clean',
  BDAY_JARDIM = 'Aniver: Jardim Encantado',
  BDAY_POOL_PARTY = 'Aniver: Pool Party',
  BDAY_NEON_GLOW = 'Aniver: Neon Glow',
  // ANIVERSÁRIO MASCULINO
  BDAY_CHURRASCO = 'Aniver: Churrasco & Cerveja',
  BDAY_ESPORTE = 'Aniver: Esporte & Troféu',
  BDAY_BOTECO = 'Aniver: Boteco Retrô',
  BDAY_WHISKY_VIP = 'Aniver: Whisky VIP',
  BDAY_AVENTURA = 'Aniver: Aventura Outdoor',
  BDAY_GAMER = 'Aniver: Gamer Party',

  // COMERCIAL & PRODUTO (NOVO)
  ECOMMERCE_CLEAN = 'E-commerce Clean',
  TECH_STARTUP = 'Tech Startup',
  GASTRONOMIA = 'Gastronomia & Food',
  REAL_ESTATE = 'Interiores & Decor',
  COFFEE_SHOP = 'Cafeteria', // NOVO
  FLORIST_BOUTIQUE = 'Floricultura', // NOVO
  BAKERY_ARTISAN = 'Padaria Artesanal', // NOVO
  BOOKSTORE_COZY = 'Livraria', // NOVO
  GYM_CROSSFIT = 'Crossfit / Gym', // NOVO
  SPA_WELLNESS = 'Spa & Relax', // NOVO
  BARBER_SHOP_RETRO = 'Barbearia Retrô', // NOVO

  // VAREJO 🛍️
  VAREJO_MODA_LOOKBOOK = 'Moda: Lookbook',
  VAREJO_MODA_FLATLAY = 'Moda: Flat Lay',
  VAREJO_MODA_EDITORIAL = 'Moda: Editorial',
  VAREJO_JOIAS_LUXURY = 'Joias: Luxury',
  VAREJO_COSMETICOS = 'Cosméticos: Beauty',
  VAREJO_ACESSORIOS = 'Acessórios: Lifestyle',
  VAREJO_ELETRONICOS = 'Tech: Premium',
  VAREJO_FUNDO_BRANCO = 'Fundo Branco: Marketplace',
  VAREJO_LIFESTYLE = 'Lifestyle Shot',

  // DELIVERY 🍕
  DELIVERY_BURGER = 'Burger Gourmet',
  DELIVERY_PIZZA = 'Pizza Artesanal',
  DELIVERY_SUSHI = 'Sushi & Japonês',
  DELIVERY_DOCES = 'Confeitaria & Doces',
  DELIVERY_ACAI = 'Açaí & Bowls',
  DELIVERY_CAFE = 'Café & Bebidas',
  DELIVERY_CHURRASCO = 'Churrasco & Brasa',
  DELIVERY_SAUDAVEL = 'Saudável & Fit',
  DELIVERY_PADARIA = 'Padaria & Pães',

  // CRIATIVO & ARTÍSTICO
  CYBERPUNK_NEON = 'Cyberpunk Neon',
  FUTURISTA_LAB = 'Futurista Lab',
  VINTAGE_FILM = 'Vintage Film',
  POP_ART = 'Pop Art Studio',
  TATUADOR = 'Tatuador / Arte',
  FOTOGRAFO = 'Fotógrafo',
  SURREAL_DREAM = 'Sonho Surreal', // NOVO
  GLITCH_ART = 'Glitch Digital', // NOVO
  PAPER_CUTOUT = 'Arte em Papel', // NOVO
  DOUBLE_EXPOSURE = 'Dupla Exposição', // NOVO
  WATERCOLOR_ART = 'Aquarela', // NOVO
  NEON_PORTRAIT = 'Retrato Neon', // NOVO

  // POLÍTICO
  POLITICO_BANDEIRA = 'Político: Bandeira',
  POLITICO_COMICIO = 'Político: Comício',
  POLITICO_GABINETE = 'Político: Gabinete',
  POLITICO_CAMPANHA_RURAL = 'Político: Campanha Rural',

  // RESTAURAÇÃO DE FOTOS
  RESTAURACAO_RETRATO = 'Restauração: Retrato',
  RESTAURACAO_FAMILIA = 'Restauração: Família',
  RESTAURACAO_COLORIZAR = 'Restauração: Colorizar',

  // PALCO & ORATÓRIA
  PALESTRANTE_PALCO = 'Palestrante no Palco',
  COACH_MENTOR = 'Coach & Mentor',
  PASTOR_LIDER = 'Pastor / Líder Religioso',
  TEDX_SPEAKER = 'TEDx Speaker',
  COMUNICADOR_MC = 'Comunicador / MC',

  // INSPIRACIONAL
  INSP_FUNDO_BOLD_RED = 'Fundo Bold Vermelho',
  INSP_FUNDO_BOLD_BLUE = 'Fundo Bold Azul',
  INSP_IMPACTO_CINEMATIC = 'Impacto Cinematic',
  INSP_NEON_BICOLOR = 'Neon Bicolor',
  INSP_HOME_OFFICE = 'Home Office Creator',
  INSP_EDITORIAL_ELEGANTE = 'Editorial Elegante',
  INSP_GOLDEN_HOUR = 'Golden Hour Portrait',
  INSP_PRETO_BRANCO = 'Preto & Branco',
  INSP_STREET_URBAN = 'Street Urban',
  INSP_SMOKE_MYSTERY = 'Smoke & Mystery',
  INSP_LUZ_NATURAL = 'Luz Natural',
  INSP_POWER_PORTRAIT = 'Power Portrait',

  // OFÍCIOS & SERVIÇOS
  DENTISTA = 'Dentista',
  PEDREIRO = 'Pedreiro / Construção',
  ELETRICISTA = 'Eletricista',
  MECANICO = 'Mecânico Automotivo',
  CHEF_COZINHEIRO = 'Chef / Cozinheiro',
  PROFESSOR = 'Professor / Educador',
  ENFERMEIRO = 'Enfermeiro(a)',
  FARMACEUTICO = 'Farmacêutico',
  BOMBEIRO = 'Bombeiro',
  CONTADOR = 'Contador / Contabilidade',
  CAMINHONEIRO = 'Caminhoneiro',
  AGRICULTOR = 'Agricultor / Agro',

  // TIKTOK VIRAL 🔥
  TIKTOK_MIRROR = 'Selfie no Espelho',
  TIKTOK_BEACH = 'Praia Golden Hour',
  TIKTOK_PARTY = 'Festa & Drinks',
  TIKTOK_CAR = 'No Carro',
  TIKTOK_MORNING = 'That Girl Morning',
  TIKTOK_GYM = 'Gym Selfie',
  TIKTOK_OOTD = 'OOTD - Look do Dia',
  TIKTOK_ROOFTOP = 'Rooftop Sunset',
  TIKTOK_CAFE = 'Café Aesthetic',
  TIKTOK_FESTIVAL = 'Festival & Show',

  // ADVOGADOS ESPECIAL ⚖️
  ADV_MINIMALISTA = 'Advogado Minimalista',
  ADV_MODERNO = 'Advogado Moderno',
  ADV_ESCRITORIO = 'Escritório Clean',
  ADV_EXECUTIVO_DARK = 'Executivo Dark',
  ADV_EDITORIAL = 'Advocacia Editorial',
  ADV_CORPORATIVO = 'Corporativo Premium',
}

// =============================================
// DELIVERY STUDIO — 24 estilos exclusivos
// =============================================
export enum DeliveryStyle {
  // GRUPO 1 — FOCO NO PRODUTO
  FOOD_STUDIO_DARK = 'Estúdio Escuro Premium',
  FOOD_STUDIO_WHITE = 'Estúdio Clean Branco',
  FOOD_CLOSEUP = 'Close-up Apetitoso',
  FOOD_FLATLAY_EDITORIAL = 'Flat Lay Editorial',
  FOOD_FLATLAY_MINIMAL = 'Flat Lay Minimalista',
  FOOD_OVERHEAD_RUSTIC = 'Mesa Rústica Overhead',

  // GRUPO 2 — AMBIENTES / LIFESTYLE
  FOOD_ENV_HOME = 'Recebido em Casa',
  FOOD_ENV_KITCHEN = 'Cozinha Caseira',
  FOOD_ENV_DINNERTABLE = 'Mesa de Jantar',
  FOOD_ENV_BOTECO = 'Boteco & Barzinho',
  FOOD_ENV_FOODTRUCK = 'Food Truck / Feira',
  FOOD_ENV_PICNIC = 'Piquenique ao Ar Livre',
  FOOD_ENV_BEACH = 'Praia & Verão',
  FOOD_ENV_NIGHT_OUT = 'Noite & Restaurante',
  FOOD_ENV_ROOFTOP = 'Rooftop Urbano',

  // GRUPO 3 — COM PESSOA / AVATAR
  FOOD_PERSON_TASTING = 'Degustação',
  FOOD_PERSON_DELIVERY = 'Recebendo a Entrega',
  FOOD_PERSON_CHEF = 'Chef Apresentando',
  FOOD_PERSON_INFLUENCER = 'Influencer de Food',
  FOOD_PERSON_FAMILY = 'Família à Mesa',

  // GRUPO 4 — REDES SOCIAIS
  FOOD_SOCIAL_VERTICAL = 'Story / Reels Vertical',
  FOOD_SOCIAL_PROMO = 'Promoção do Dia',
  FOOD_SOCIAL_MENU = 'Foto de Cardápio',
  FOOD_SOCIAL_TRIO = 'Trio de Produtos',

  // GRUPO 5 — UGC & VIRAL (conteúdo caseiro autêntico)
  FOOD_UGC_UNBOXING = 'UGC: Unboxing do Pedido',
  FOOD_UGC_BITE = 'UGC: Momento da Mordida',
  FOOD_UGC_REACTION = 'UGC: Reação de Aprovação',
  FOOD_UGC_AESTHETIC = 'UGC: Aesthetic Caseiro',

  // GRUPO 6 — MARCA & LOGO (identidade visual)
  FOOD_BRAND_PACKAGING = 'Embalagem com Logo',
  FOOD_BRAND_STOREFRONT = 'Fachada da Loja',
  FOOD_BRAND_INSTITUTIONAL = 'Foto Institucional',
  FOOD_BRAND_UNIFORM = 'Equipe com Uniforme',
  FOOD_BRAND_PAPERBAG = 'Sacola Brandada',
  FOOD_BRAND_CUP = 'Copo / Embalagem de Bebida',
  FOOD_BRAND_PIZZABOX = 'Caixa de Produto Brandada',
  FOOD_BRAND_MENU = 'Cardápio Digital',
  FOOD_BRAND_SHIRT = 'Camiseta da Marca',
  FOOD_BRAND_STICKER = 'Adesivo no Produto',
}

export type DeliveryStyleMeta = {
  label: string;
  description: string;
  color: string;
  icon: string;
  category: 'Foco no Produto' | 'Ambientes' | 'Com Pessoa' | 'Redes Sociais' | 'UGC & Viral' | 'Marca & Logo';
  avatarEnabled: boolean;
  logoEnabled?: boolean;
  prompt: string;
};


export const DeliveryStyleMetaMap: Record<DeliveryStyle, DeliveryStyleMeta> = {
  [DeliveryStyle.FOOD_STUDIO_DARK]: {
    label: 'Estúdio Escuro Premium',
    description: 'Fundo preto, iluminação lateral dramática estilo Michelin',
    color: 'from-zinc-800/80',
    icon: '🖤',
    category: 'Foco no Produto',
    avatarEnabled: false,
    prompt: `Food photography masterpiece. IDENTIFY the food in the provided image and recreate it as a professional studio shot.
SCENE: Matte black background, single dramatic side rim light (warm amber/golden), soft shadow gradient. Michelin-star restaurant aesthetic.
LIGHTING: Hard directional light from the left, creating deep shadows and highlighting textures. Subtle golden bounce fill from the right.
COMPOSITION: Food centered or slightly off-center, hero close-up angle (45° overhead to straight-on). Negative space on one side.
DETAILS: Make every texture pop — caramelized edges, steam wisps, glistening sauces, melted cheese pulls if applicable.
STYLE: Ultra-premium dark food photography. Magazine cover quality. No props except perhaps a dark slate or wooden board underneath.
OUTPUT: Photorealistic, NOT illustrated. Real photograph aesthetic.`,
  },

  [DeliveryStyle.FOOD_STUDIO_WHITE]: {
    label: 'Estúdio Clean Branco',
    description: 'Fundo branco, luz soft diffuse, estilo cardápio digital',
    color: 'from-slate-100/20',
    icon: '⬜',
    category: 'Foco no Produto',
    avatarEnabled: false,
    prompt: `Food photography for digital menu / iFood listing. IDENTIFY the food in the provided image.
SCENE: Pure white (#FFFFFF) seamless background, soft diffused lighting from all sides. Clean, professional, appetizing.
LIGHTING: Soft box lighting from above and sides, zero harsh shadows, even exposure. The food should look bright and fresh.
COMPOSITION: Food perfectly centered, slight overhead angle (30–45°). Clean negative space all around.
DETAILS: Vibrant natural colors, fresh textures, zero clutter. The food must look delicious and hygienic.
PROPS: Minimal — perhaps a white plate, clean wooden board, or nothing at all.
STYLE: Professional food catalog photography. Think iFood premium listing. Clean and appetizing.
OUTPUT: Photorealistic. Bright and clean.`,
  },

  [DeliveryStyle.FOOD_CLOSEUP]: {
    label: 'Close-up Apetitoso',
    description: 'Macro: queijo derretendo, vapor, textura em detalhes',
    color: 'from-amber-600/30',
    icon: '🔬',
    category: 'Foco no Produto',
    avatarEnabled: false,
    prompt: `Extreme close-up macro food photography. IDENTIFY the food in the provided image and shoot it in ultra-close detail.
SCENE: Tight macro shot, bokeh background, focus on the most appetizing texture detail of the food.
LIGHTING: Dramatic macro lighting emphasizing textures — cheese pulls, melted chocolate, crispy skin, glistening glazes, steam wisps above hot food.
COMPOSITION: Fill 80% of the frame with the most craveable part of the dish. Shallow depth of field, blurred background.
DETAILS: Every texture magnified — bubbling cheese, charred crust, dripping sauce, powdered sugar snow, fresh herb fibers.
STYLE: Food porn photography. Designed to make the viewer crave the food immediately. Hyper-detailed, almost uncomfortable closeness.
OUTPUT: Photorealistic macro photograph with cinematic color grading.`,
  },

  [DeliveryStyle.FOOD_FLATLAY_EDITORIAL]: {
    label: 'Flat Lay Editorial',
    description: 'Vista de cima, ingredientes ao redor, estética de revista',
    color: 'from-rose-600/20',
    icon: '🗞️',
    category: 'Foco no Produto',
    avatarEnabled: false,
    prompt: `Editorial flat lay food photography. IDENTIFY the food in the provided image.
SCENE: Perfectly composed overhead (bird's eye / top-down, 90°) shot. The food is the hero surrounded by complementary props and ingredients.
BACKGROUND: Rustic marble, dark slate, linen cloth, aged wood — choose the most appropriate for the food type.
PROPS: Scatter relevant ingredients around the hero dish — fresh herbs, spices, raw ingredients, napkins, utensils. Balanced negative space.
LIGHTING: Even, soft overhead diffused light with subtle shadows creating depth. No harsh direct light.
COMPOSITION: Rule of thirds, asymmetric arrangement, intentional negative space for text placement if needed.
STYLE: Bon Appétit / Food & Wine magazine editorial. Aspirational yet authentic Brazilian food culture.
OUTPUT: Photorealistic overhead photograph with warm editorial color grading.`,
  },

  [DeliveryStyle.FOOD_FLATLAY_MINIMAL]: {
    label: 'Flat Lay Minimalista',
    description: 'Vista de cima clean, 1–2 props, fundo neutro',
    color: 'from-stone-400/20',
    icon: '⬜',
    category: 'Foco no Produto',
    avatarEnabled: false,
    prompt: `Minimalist flat lay food photography. IDENTIFY the food in the provided image.
SCENE: Top-down (90°) shot. The food is centered with extreme negative space. Only 1 or 2 complementary props maximum.
BACKGROUND: Clean neutral surface — warm white, light grey, soft beige linen, or light concrete. Spotlessly clean.
PROPS: Only what is essential — perhaps a single fork, a small herb sprig, or a minimal garnish. NO clutter.
LIGHTING: Soft, shadowless natural-style light. Even and calm.
COMPOSITION: Centered or slightly offset, generous negative space. Muji / Japanese aesthetic minimalism.
STYLE: Clean, modern, Scandinavian-Brazilian minimalism. Instagram-worthy simplicity.
OUTPUT: Photorealistic, high contrast clean photograph. Calm and elegant.`,
  },

  [DeliveryStyle.FOOD_OVERHEAD_RUSTIC]: {
    label: 'Mesa Rústica Overhead',
    description: 'Vista aérea, madeira envelhecida, props de cozinha artesanal',
    color: 'from-amber-900/30',
    icon: '🪵',
    category: 'Foco no Produto',
    avatarEnabled: false,
    prompt: `Rustic overhead food photography. IDENTIFY the food in the provided image.
SCENE: Top-down (90°) bird's eye shot on a rustic aged wooden table. Warm, homemade, authentic feeling.
SURFACE: Dark reclaimed wood OR worn terracotta tile OR aged butcher block. Visible grain, authentic imperfections.
PROPS: Cast iron pan, ceramic bowls, rustic pottery, linen napkins, vintage cutlery, fresh herbs scattered naturally, small wooden spoon.
LIGHTING: Warm golden hour window light from the side, creating soft shadows that reveal the wood texture.
COMPOSITION: Full table scene — not just the hero dish, but surrounding props creating a full "just cooked" moment.
STYLE: Brazilian countryside kitchen meets Tuscany. Honest, comforting, artisanal food culture.
OUTPUT: Photorealistic with warm, slightly desaturated film-style color grading.`,
  },

  // ---- AMBIENTES ----

  [DeliveryStyle.FOOD_ENV_HOME]: {
    label: 'Recebido em Casa',
    description: 'Sofá, mesa de sala, embalagem aberta — delivery chegou',
    color: 'from-amber-400/20',
    icon: '🏠',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Delivery-at-home lifestyle food photography. IDENTIFY the food in the provided image.
SCENE: Cozy living room or dining table setting. The delivery has just arrived, packaging is open, the food is being revealed.
ENVIRONMENT: Warm home interior — couch visible in background, coffee table, soft ambient light from a lamp or TV glow. Comfortable and relatable.
PROPS: Delivery bag or box open nearby, perhaps a drink (soda, juice), napkins, maybe a phone showing the delivery app rating screen.
LIGHTING: Warm home ambient lighting — table lamp glow, late evening comfortable tone.
COMPOSITION: The food is the hero, environment tells the "delivery received" story. 45° angle shot.
STYLE: Authentic Brazilian home delivery moment. Real, relatable, aspirational comfort.
OUTPUT: Photorealistic lifestyle photograph. Warm, inviting, honest.`,
  },

  [DeliveryStyle.FOOD_ENV_KITCHEN]: {
    label: 'Cozinha Caseira',
    description: 'Bancada, azulejos, luz de tarde, comida caseira',
    color: 'from-yellow-500/20',
    icon: '🔥',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Home kitchen lifestyle food photography. IDENTIFY the food in the provided image.
SCENE: Brazilian home kitchen counter. The food is freshly plated, moments after cooking or delivery arrival.
ENVIRONMENT: Kitchen tiles in background (azulejos), countertop with some cooking items — a cutting board, a pot in background, some herbs. Warm afternoon light through a window.
LIGHTING: Soft natural afternoon window light, warm color temperature (3000K), gentle shadows.
COMPOSITION: Food on counter with kitchen context visible but not overwhelming. 45° angle.
STYLE: Authentic, real, comforting. Like your neighbor's kitchen who makes amazing food. Brazilian casa vibe.
OUTPUT: Photorealistic lifestyle photograph with warm, homey color grading.`,
  },

  [DeliveryStyle.FOOD_ENV_DINNERTABLE]: {
    label: 'Mesa de Jantar',
    description: 'Velas, taças, jantar especial ou romântico',
    color: 'from-rose-900/30',
    icon: '🕯️',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Romantic dinner table food photography. IDENTIFY the food in the provided image.
SCENE: Elegantly set dining table. Special occasion or date night setting.
ENVIRONMENT: White linen tablecloth or dark wood table, wine glasses (full or empty), candles casting warm bokeh in background, fine dining silverware.
LIGHTING: Candlelight as primary light source — warm amber tones, soft romantic glow. No harsh lights.
COMPOSITION: The dishes are the hero, table setting creates luxury context. Slight overhead 60° angle.
PROPS: Wine glasses, candles, perhaps flowers, elegant napkin fold.
STYLE: Special occasion dining. Premium restaurant meets intimate home dinner. Brazilian date night energy.
OUTPUT: Photorealistic photograph with warm candlelight color grading. Romantic and aspirational.`,
  },

  [DeliveryStyle.FOOD_ENV_BOTECO]: {
    label: 'Boteco & Barzinho',
    description: 'Mesa rústica, cerveja/chopp, luzes quentes de bar',
    color: 'from-yellow-700/30',
    icon: '🍺',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Brazilian boteco / bar food photography. IDENTIFY the food in the provided image.
SCENE: Classic Brazilian boteco atmosphere. The food is a bar snack / petisco served at a casual neighborhood bar.
ENVIRONMENT: Rustic wooden table, beer bottles or chopp glasses nearby, bar counter in soft background bokeh. String lights or neon sign glow in background.
LIGHTING: Warm incandescent bar lighting, amber tones, bokeh lights in background creating depth.
PROPS: Cold beer bottle (Brahma, Skol, or generic), coasters, small napkins, salt shaker.
COMPOSITION: Food and drinks together tell the boteco story. Slight low angle (eye level or slightly below).
STYLE: Classic Brazilian boteco culture. Friendly, informal, delicious. "Pelada depois do trabalho" energy.
OUTPUT: Photorealistic with warm amber bar lighting color grading.`,
  },

  [DeliveryStyle.FOOD_ENV_FOODTRUCK]: {
    label: 'Food Truck / Feira',
    description: 'Ambiente urbano externo, concreto, street food energy',
    color: 'from-zinc-600/20',
    icon: '🚚',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Food truck / street food market photography. IDENTIFY the food in the provided image.
SCENE: Outdoor street food setting — food truck or gastronomy fair. Urban, energetic, vibrant atmosphere.
ENVIRONMENT: Concrete or asphalt surface, colorful food truck in soft background, string lights overhead, crowd bokeh in distance. Daytime outdoor light.
LIGHTING: Bright outdoor daylight or golden hour sun from the side. Vibrant and energetic.
PROPS: Paper wrapper, branded paper bag, wooden skewer, napkin holder. Street food presentation.
COMPOSITION: The food feels freshly made and handed to you. Slightly low angle for impact.
STYLE: Brazilian gastronomic fair energy. Vibrant, authentic, street food culture. Festival de gastronomia vibes.
OUTPUT: Photorealistic with vibrant, high-energy outdoor color grading.`,
  },

  [DeliveryStyle.FOOD_ENV_PICNIC]: {
    label: 'Piquenique ao Ar Livre',
    description: 'Gramado, cesto de vime, luz natural de dia',
    color: 'from-green-600/20',
    icon: '🌿',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Outdoor picnic food photography. IDENTIFY the food in the provided image.
SCENE: Green park or garden picnic setting. The food is arranged on a picnic blanket outdoors.
ENVIRONMENT: Green grass, checkered or linen picnic blanket, wicker basket nearby, trees providing dappled afternoon shade. Fresh natural surroundings.
LIGHTING: Beautiful natural afternoon sun through leaves — dappled golden light, warm and soft.
PROPS: Wicker picnic basket, fruit scattered nearby, wildflowers, a bottle of juice or wine.
COMPOSITION: Bird's eye or 45° angle showing food on the picnic blanket with environment.
STYLE: Relaxed, healthy, outdoor Brazilian leisure. Açaí-in-the-park energy. Happy and natural.
OUTPUT: Photorealistic with vibrant, fresh outdoor natural lighting color grading.`,
  },

  [DeliveryStyle.FOOD_ENV_BEACH]: {
    label: 'Praia & Verão',
    description: 'Areia, coquetel, sombra de coqueiro, vibe tropical',
    color: 'from-cyan-500/20',
    icon: '🏖️',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Brazilian beach / summer food photography. IDENTIFY the food in the provided image.
SCENE: Tropical beach setting. The food is enjoyed at the beach — perfect for açaí, cold drinks, grilled snacks, watermelon.
ENVIRONMENT: Fine sand, turquoise water bokeh in background, palm tree shadow, warm tropical sun. Brazilian summer paradise.
LIGHTING: Bright tropical sun with hard shadows and vibrant saturation. Sun high or golden hour side light.
PROPS: Beach towel, sunscreen bottle (small), coconut drink, sunglasses, tropical flowers.
COMPOSITION: Food on sand or beach chair armrest. The sea is visible in the blurred background.
STYLE: Brazilian summer beach culture. Praia de Ipanema energy. Vibrant, joyful, tropical.
OUTPUT: Photorealistic with high saturation, warm tropical color grading. Blue sky, turquoise water tones.`,
  },

  [DeliveryStyle.FOOD_ENV_NIGHT_OUT]: {
    label: 'Noite & Restaurante',
    description: 'Mesa de restaurante noturno, luzes bokeh, clima festivo',
    color: 'from-indigo-900/30',
    icon: '🌙',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Upscale night restaurant food photography. IDENTIFY the food in the provided image.
SCENE: Premium restaurant at night. The food is served at an elegant dinner table with a lively atmosphere in the background.
ENVIRONMENT: Restaurant interior — dark ambient, warm point lights creating bokeh, other tables blurred in background, professional restaurant table setting.
LIGHTING: Restaurant pendant lights from above, warm amber point lights, beautiful bokeh from background lights. Dramatic and premium.
PROPS: Wine glasses, premium plates, restaurant napkin, small candle on table.
COMPOSITION: Tight shot of the dish with restaurant atmosphere bokeh in background. 45° angle.
STYLE: Premium Brazilian restaurant experience. Dinner out vibes. Aspirational "vale a pena o delivery" energy.
OUTPUT: Photorealistic with dramatic restaurant night lighting, rich color grading.`,
  },

  [DeliveryStyle.FOOD_ENV_ROOFTOP]: {
    label: 'Rooftop Urbano',
    description: 'Varanda com vista da cidade à noite, clima premium',
    color: 'from-violet-900/30',
    icon: '🌆',
    category: 'Ambientes',
    avatarEnabled: false,
    prompt: `Rooftop urban food photography. IDENTIFY the food in the provided image.
SCENE: Upscale rooftop bar or restaurant terrace with city skyline view at dusk or night.
ENVIRONMENT: City lights bokeh in the background, elevated terrace with urban panorama, modern rooftop furniture, fairy lights overhead.
LIGHTING: City glow ambient light, golden hour transitioning to night, warm string lights, urban blue-orange color contrast.
PROPS: City skyline visible behind, modern terrace chair/table edge, perhaps a cocktail nearby.
COMPOSITION: Food in foreground with blurred city lights creating magical bokeh background.
STYLE: Premium urban rooftop lifestyle. "Vista linda da cidade" energy. Sophisticated and aspirational.
OUTPUT: Photorealistic with cinematic blue-hour/golden-hour urban color grading.`,
  },

  // ---- COM PESSOA ----

  [DeliveryStyle.FOOD_PERSON_TASTING]: {
    label: 'Degustação 😋',
    description: 'Pessoa comendo, expressão de aprovação genuína',
    color: 'from-orange-500/20',
    icon: '😋',
    category: 'Com Pessoa',
    avatarEnabled: true,
    prompt: `Food tasting lifestyle photography. IDENTIFY the food in the provided image.
TASK: Create a photo of a PERSON genuinely enjoying this food — mid-bite or reaction moment.
PERSON: If a person photo is provided, use their exact face and identity. If not, generate a happy young Brazilian adult.
EXPRESSION: Natural, genuine enjoyment — eyes slightly closed in bliss, authentic smile, "this is amazing" reaction. NOT forced/fake.
COMPOSITION: Person holding or eating the food, food visible and recognizable. Waist-up shot.
ENVIRONMENT: Simple complementary background — home, restaurant, or clean studio.
LIGHTING: Warm, flattering lifestyle lighting.
STYLE: Authentic UGC (User Generated Content) style — real person, real reaction, not overly produced. Brazilian social media vibe.
OUTPUT: Photorealistic lifestyle photograph.`,
  },

  [DeliveryStyle.FOOD_PERSON_DELIVERY]: {
    label: 'Recebendo a Entrega',
    description: 'Mãos abrindo sacola/caixa, unboxing do delivery',
    color: 'from-emerald-600/20',
    icon: '📦',
    category: 'Com Pessoa',
    avatarEnabled: true,
    prompt: `Delivery unboxing lifestyle photography. IDENTIFY the food in the provided image.
TASK: Create a photo of a PERSON receiving or unboxing a food delivery order. The moment of delightful surprise.
PERSON: If a person photo is provided, use their exact face and identity. If not, generate a happy young Brazilian adult.
ACTION: Person opening a delivery bag or box, the food is being revealed. Hands interacting with the packaging.
EXPRESSION: Excitement and delight — eyes wide, big smile, anticipation.
ENVIRONMENT: Home doorway or living room setting. Casual and relatable.
LIGHTING: Warm home ambient lighting.
STYLE: Authentic delivery experience moment. iFood unboxing energy. Real, relatable, makes viewers want to order.
OUTPUT: Photorealistic lifestyle photograph.`,
  },

  [DeliveryStyle.FOOD_PERSON_CHEF]: {
    label: 'Chef Apresentando',
    description: 'Cozinheiro apresentando o prato com orgulho, avental',
    color: 'from-white/10',
    icon: '👨‍🍳',
    category: 'Com Pessoa',
    avatarEnabled: true,
    prompt: `Chef presenting dish food photography. IDENTIFY the food in the provided image.
TASK: Create a photo of a PROFESSIONAL CHEF proudly presenting this dish to the camera.
PERSON: If a person photo is provided, use their exact face, wearing a white chef's coat and apron. If not, generate a proud Brazilian chef, mid-40s, warm expression.
ACTION: Chef holding the plate forward at chest level, presenting it directly to camera. Proud, confident posture.
EXPRESSION: Pride and passion for the craft. Warm smile that says "I made this and it's perfect."
ENVIRONMENT: Restaurant kitchen or clean cooking environment. Stainless steel or brick in background.
LIGHTING: Professional kitchen lighting, slightly dramatic.
STYLE: Professional food business marketing. "The chef who made your meal wants you to see it" energy.
OUTPUT: Photorealistic professional photograph.`,
  },

  [DeliveryStyle.FOOD_PERSON_INFLUENCER]: {
    label: 'Influencer de Food',
    description: 'Mão estendida para câmera, ângulo de Reels',
    color: 'from-pink-500/20',
    icon: '📱',
    category: 'Com Pessoa',
    avatarEnabled: true,
    prompt: `Food influencer / content creator photography. IDENTIFY the food in the provided image.
TASK: Create a photo of a FOOD CONTENT CREATOR holding this food toward the camera — classic influencer shot.
PERSON: If a person photo is provided, use their exact face and identity. If not, generate a stylish young Brazilian food influencer (22–30 years old).
ACTION: Person holding the food extended toward camera, slightly tilted, close enough to see detail. One hand hold. Classic food influencer framing.
EXPRESSION: Excited, conversational — like they're about to say "You HAVE to try this!" directly to their audience.
ENVIRONMENT: Clean, aesthetic background — café, bright kitchen, patterned wall. Trendy and photogenic.
LIGHTING: Ring light style or bright natural light. Clean and flattering.
STYLE: Instagram / TikTok food content creator. 2024 food reel energy.
OUTPUT: Photorealistic content creator photograph.`,
  },

  [DeliveryStyle.FOOD_PERSON_FAMILY]: {
    label: 'Família à Mesa',
    description: 'Refeição em grupo, prato no centro, alegria',
    color: 'from-amber-400/20',
    icon: '👨‍👩‍👧',
    category: 'Com Pessoa',
    avatarEnabled: true,
    prompt: `Family meal lifestyle food photography. IDENTIFY the food in the provided image.
TASK: Create a warm family meal scene centered around this food.
PEOPLE: Brazilian family at a dinner table — 3 to 4 people of different ages (parents + children or friends). If a person photo is provided, include them as the main family member.
ACTION: Family gathered around the table, the food is the centerpiece. People reaching for it, serving each other, laughing.
EXPRESSION: Joy, warmth, togetherness. Genuine family happiness.
ENVIRONMENT: Brazilian home dining room or kitchen table. Warm and inviting.
LIGHTING: Warm home ambient light, golden tones.
STYLE: "Domingo em família" energy. Brazilian family culture. The most comforting image of belonging.
OUTPUT: Photorealistic lifestyle photograph, wide enough to see multiple people and the food together.`,
  },

  // ---- REDES SOCIAIS ----

  [DeliveryStyle.FOOD_SOCIAL_VERTICAL]: {
    label: 'Story / Reels Vertical',
    description: 'Composição 9:16 atraente para Stories e TikTok',
    color: 'from-fuchsia-600/20',
    icon: '📱',
    category: 'Redes Sociais',
    avatarEnabled: false,
    prompt: `Vertical social media food photography (9:16). IDENTIFY the food in the provided image.
TASK: Create a VERTICAL composition (9:16 ratio) optimized for Instagram Stories and TikTok.
COMPOSITION: Food in the lower 60% of the frame, upper 40% has clean space for text overlay. Dynamic and eye-catching scroll-stop composition.
BACKGROUND: Complementary to the food — dark dramatic or bright natural. Must look premium on a phone screen.
LIGHTING: Dramatic and photogenic — designed to be visually arresting on a small screen.
STYLE ELEMENTS: Could include subtle gradient overlays at top/bottom, or a very clean hero shot. Think: swipe-worthy, thumb-stopping.
TEXT SPACE: Leave clear space in top third for price/offer text overlay.
STYLE: Premium food content for Brazilian social media. Made for mobile-first viewing.
OUTPUT: Photorealistic, optimized for mobile vertical format.`,
  },

  [DeliveryStyle.FOOD_SOCIAL_PROMO]: {
    label: 'Promoção do Dia',
    description: 'Arte com destaque de preço/oferta ao lado da foto',
    color: 'from-red-600/20',
    icon: '🏷️',
    category: 'Redes Sociais',
    avatarEnabled: false,
    prompt: `Food promotion / offer social media post. IDENTIFY the food in the provided image.
TASK: Create a promotional composite image — the food photo on one side, bold price/offer graphic on the other.
LAYOUT: Split composition: 60% hero food photo (left or center) + 40% bold graphic space (right or overlay).
GRAPHIC ELEMENTS: Bold promotional badge showing "OFERTA" or "PROMOÇÃO" in bright red/yellow/orange. Price tag area clearly visible. Bold Brazilian promotional design language.
FOOD SECTION: The food looks absolutely delicious, maximum appetite appeal.
BACKGROUND: Bold, high-contrast gradient (red-orange or black-red). Promotional energy.
TYPOGRAPHY SPACE: Leave clear areas for text: dish name, price, and call to action.
STYLE: Brazilian food delivery promotion. iFood/Rappi/McDonald's promotional energy — bold, urgent, appetizing.
OUTPUT: Photorealistic food with bold graphic promotional elements.`,
  },

  [DeliveryStyle.FOOD_SOCIAL_MENU]: {
    label: 'Foto de Cardápio',
    description: 'Composição clean para cardápio digital — iFood otimizado',
    color: 'from-blue-600/20',
    icon: '📋',
    category: 'Redes Sociais',
    avatarEnabled: false,
    prompt: `Digital menu / iFood listing food photography. IDENTIFY the food in the provided image.
TASK: Create the perfect dish photo optimized for iFood digital menu — clean, appetizing, and professional.
COMPOSITION: Food perfectly centered, slight overhead (30–45°). Clean background without distraction. The food fills about 70% of the frame.
BACKGROUND: Clean — white, light grey, or very simple complementary color. Professional and hygienic looking.
LIGHTING: Even, bright, appetizing. No dark shadows. The food must look fresh and clean.
DETAILS: Every element visible and appetizing. Portion size clear. Garnishes perfect.
STYLE: Professional food menu photography. Think McDonald's menu images or premium iFood listing. Clean, clear, mouthwatering.
OUTPUT: Photorealistic, bright, clean. Optimized for thumbnail display.`,
  },

  [DeliveryStyle.FOOD_SOCIAL_TRIO]: {
    label: 'Trio de Produtos',
    description: '3 produtos compostos juntos em uma cena harmoniosa',
    color: 'from-violet-600/20',
    icon: '✨',
    category: 'Redes Sociais',
    avatarEnabled: false,
    prompt: `Food trio composition photography. IDENTIFY the food in the provided image.
TASK: Create a beautiful composition featuring THREE versions or variations of this type of food — a trio showcase.
COMPOSITION: Three food items arranged in a visually balanced triangle or row. Each item slightly different (different flavor, topping, or presentation).
BACKGROUND: Dark premium or marble surface. The trio arrangement creates visual impact.
LIGHTING: Even, dramatic lighting that makes all three items look equally stunning.
ARRANGEMENT: Hero item centered and slightly larger, flanked by two supporting items. Asymmetric but balanced.
STYLE: "Menu showcase" or "choose your favorite" social media post energy. Great for promoting variety.
OUTPUT: Photorealistic composition showing a complete food trio.`,
  },

  // ================================================
  // GRUPO 5 — UGC & VIRAL
  // ================================================
  [DeliveryStyle.FOOD_UGC_UNBOXING]: {
    label: 'UGC: Unboxing do Pedido',
    description: 'Foto caseira de quem abriu o delivery, real e autêntico',
    color: 'from-rose-500/20',
    icon: '📦',
    category: 'UGC & Viral',
    avatarEnabled: true,
    logoEnabled: false,
    prompt: `UGC (User Generated Content) food unboxing photography. IDENTIFY the food in the provided image.
SCENE: Realistic home setting — kitchen counter, coffee table, or lap. Delivery bag/box nearby. Casual, authentic moment of receiving and opening the food.
STYLE: Shot on phone camera aesthetic. Slightly imperfect exposure, natural shadows, no professional lighting. The kind of photo a real customer would post on Instagram Stories.
PROPS: Delivery packaging (generic or branded), maybe a napkin or drink nearby. Home background visible but not overly styled.
PERSON: ${/*avatar hint*/ 'If avatar provided, show hands or person in background. If not, focus on hands holding or reaching for the food.'}
AUTHENTICITY: This looks 100% real. NOT a studio shot. The food looks delicious but in an approachable way.
OUTPUT: Photorealistic UGC photo. Phone camera quality. Authentic Brazilian delivery culture aesthetic.`,
  },

  [DeliveryStyle.FOOD_UGC_BITE]: {
    label: 'UGC: Momento da Mordida',
    description: 'Foto casual do produto sendo degustado, estilo reels virais',
    color: 'from-orange-500/20',
    icon: '😋',
    category: 'UGC & Viral',
    avatarEnabled: true,
    logoEnabled: false,
    prompt: `UGC viral food bite moment photography. IDENTIFY the food in the provided image.
SCENE: Close-up of the food being eaten or held. Melting cheese, sauce dripping, bite taken — show the most mouthwatering moment.
STYLE: "Money shot" but with phone camera authenticity. Like a viral TikTok or Reels thumbnail. Slightly messy, very real, extremely appetizing.
PERSON: If avatar provided, show them mid-bite or holding the food up close. Expression of delight/approval.
LIGHTING: Natural window light or warm indoor light. Imperfect but flattering.
COMPOSITION: Close-up hero shot, slight bokeh, food filling most of the frame.
AUTHENTICITY: Feels like real customer content, not a photoshoot. People want to try this immediately.
OUTPUT: Photorealistic UGC photo. Viral food content aesthetic.`,
  },

  [DeliveryStyle.FOOD_UGC_REACTION]: {
    label: 'UGC: Reação de Aprovação',
    description: 'Pessoa reagindo positivamente ao produto, estilo depoimento',
    color: 'from-yellow-500/20',
    icon: '🤩',
    category: 'UGC & Viral',
    avatarEnabled: true,
    logoEnabled: false,
    prompt: `UGC food reaction / testimonial photography. IDENTIFY the food in the provided image.
SCENE: Person genuinely reacting to the food — thumbs up, wide smile, amazed expression — holding the product clearly visible.
STYLE: Casual selfie or friend-taking-photo style. Real environment (home, table, outdoor). Not posed or stiff.
PERSON: Must be present and showing clear positive reaction. Food prominently visible in hand or nearby.
LIGHTING: Natural light preferred. Authentic indoor or outdoor setting.
PURPOSE: This looks like a real customer review photo. Used for testimonials, stories, social proof.
AUTHENTICITY: Zero studio vibe. Pure UGC energy. Would fit perfectly in a "what our customers say" highlight.
OUTPUT: Photorealistic authentic UGC photo. Warm, human, trustworthy.`,
  },

  [DeliveryStyle.FOOD_UGC_AESTHETIC]: {
    label: 'UGC: Aesthetic Caseiro',
    description: 'Flat lay caseiro com toque pessoal, estilo Pinterest/TikTok',
    color: 'from-pink-500/20',
    icon: '🌸',
    category: 'UGC & Viral',
    avatarEnabled: false,
    logoEnabled: false,
    prompt: `UGC aesthetic food photography. IDENTIFY the food in the provided image.
SCENE: Cozy home setup — wooden table, marble counter, or blanket. Food styled casually but with a personal aesthetic touch. Flowers, a book, a cute mug nearby.
STYLE: Between professional and casual. Pinterest-worthy but clearly not a studio. "I styled this at home" energy. Brazilian food aesthetics on TikTok.
LIGHTING: Warm golden hour or window light. Soft shadows. Instagram-worthy despite being "casual."
PROPS: Personal items — fairy lights, notebooks, small plants, colored fabric. Nothing generic.
COMPOSITION: Slight overhead angle, thoughtful but imperfect arrangement. Story-worthy single shot.
OUTPUT: Photorealistic aesthetic UGC. Warm, personal, relatable. Would get thousands of saves.`,
  },

  // ================================================
  // GRUPO 6 — MARCA & LOGO
  // ================================================
  [DeliveryStyle.FOOD_BRAND_PACKAGING]: {
    label: 'Embalagem com Logo',
    description: 'Produto na embalagem branded com logo da marca visível',
    color: 'from-blue-500/20',
    icon: '🎁',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Brand packaging food photography. IDENTIFY the food in the provided image.
TASK: Create a premium shot of this food delivered in branded packaging. If a logo image is provided, apply it clearly to the packaging, bag, box, or wrapper.
PACKAGING: Custom-designed delivery bag, box, or container. Logo prominently displayed. Brand colors extracted from the logo applied to the packaging design.
FOOD: Partially visible inside or beside the packaging — appetizing and fresh.
SCENE: Clean surface (marble, dark wood, or light background). Professional product shot aesthetic.
LIGHTING: Soft, even light that highlights the packaging and makes the logo crisp and legible.
STYLE: Premium delivery brand photography. Think high-end restaurant packaging or boutique food brand.
OUTPUT: Photorealistic branded packaging shot. The logo must be clearly readable.`,
  },

  [DeliveryStyle.FOOD_BRAND_STOREFRONT]: {
    label: 'Fachada da Loja',
    description: 'Fachada do estabelecimento com logo e identidade visual da marca',
    color: 'from-indigo-500/20',
    icon: '🏪',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Restaurant / food business storefront photography. IDENTIFY the food type in the provided image.
TASK: Create a professional exterior shot of a food business storefront that sells this type of food. If a logo is provided, display it prominently on the signage, awning, or facade.
STOREFRONT: Modern, appealing restaurant or food shop exterior. Logo on sign above entrance. Brand colors applied to facade decor and details.
SCENE: Daytime exterior, slightly warm golden light. Inviting entrance. Clean sidewalk. Urban Brazilian neighborhood feel.
STYLE: Real estate photography meets food branding. The kind of photo used on Google Maps or iFood listing cover.
DETAILS: Menu board visible with items listed. Windows showing interior. A sign with the food business name.
OUTPUT: Photorealistic storefront. Warm, inviting, professional Brazilian food establishment.`,
  },

  [DeliveryStyle.FOOD_BRAND_INSTITUTIONAL]: {
    label: 'Foto Institucional',
    description: 'Composição de marca com produto, logo e cores institucionais',
    color: 'from-cyan-500/20',
    icon: '🎨',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Brand institutional food photography. IDENTIFY the food in the provided image.
TASK: Create a high-end institutional brand photo combining this food with the brand identity. If a logo is provided, extract its colors and apply them as a theme — background colors, accent elements, gradient overlays.
COMPOSITION: Food as hero, brand elements as supporting cast. Logo displayed elegantly (not intrusively). Brand palette colors in background, props, or overlay.
STYLE: Corporate food brand photography. Used for website headers, presentations, press kits. Think brand lookbook for a premium food delivery service.
MOOD: Aspirational, luxurious, aligned with brand personality.
DETAILS: Consistent color palette throughout. Typography-ready space if needed. Logo crisp and proud.
OUTPUT: Photorealistic institutional brand photo. Cohesive, premium, brandable.`,
  },

  [DeliveryStyle.FOOD_BRAND_UNIFORM]: {
    label: 'Equipe com Uniforme',
    description: 'Equipe ou entregador com uniforme branded segurando o produto',
    color: 'from-teal-500/20',
    icon: '👕',
    category: 'Marca & Logo',
    avatarEnabled: true,
    logoEnabled: true,
    prompt: `Brand uniform / team food photography. IDENTIFY the food in the provided image.
TASK: Show a food business team member or delivery person wearing branded uniform holding or delivering this food. If a logo is provided, apply it to the uniform (shirt, cap, apron) and any packaging.
PERSON: If avatar provided, show them dressed in branded uniform. If not, generate an appropriate team member.
UNIFORM: T-shirt, cap, or apron with brand logo clearly visible. Colors match brand identity.
FOOD: Held proudly or being delivered. Fresh, appetizing presentation.
SCENE: Either at the restaurant entrance, kitchen door, or delivery moment. Professional but warm.
STYLE: "Meet our team" or "powered by passion" photography. Used for social media team posts or brand introduction content.
OUTPUT: Photorealistic branded team photo. Prideful, professional, human.`,
  },

  [DeliveryStyle.FOOD_BRAND_PAPERBAG]: {
    label: 'Sacola Brandada',
    description: 'Sacola de papel kraft com logo impressa, produto dentro',
    color: 'from-amber-600/20',
    icon: '🛍️',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Branded paper bag food mockup photography. IDENTIFY the food in the provided image.
TASK: Create a premium product shot featuring a kraft paper delivery bag with the brand logo clearly printed on it. Food is visible inside or placed beside the bag.
BAG: High-quality kraft paper bag. Logo printed large and centered on the front. Brand colors used as accent (handles, tissue paper inside, stamp or sticker).
FOOD: Partially visible at the top of the bag, or arranged beside it on the surface. Fresh and appetizing.
SURFACE: Marble counter, wooden table, or concrete. Clean and premium.
LIGHTING: Warm, soft light from one side. Shadows that give depth to the bag.
STYLE: Premium food delivery brand unboxing moment. Looks like an editorial lifestyle shot.
OUTPUT: Photorealistic branded bag mockup. Logo legible and prominent.`,
  },

  [DeliveryStyle.FOOD_BRAND_CUP]: {
    label: 'Copo / Embalagem de Bebida',
    description: 'Copo, lata ou embalagem de bebida com logo da marca',
    color: 'from-sky-600/20',
    icon: '🥤',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Branded cup / beverage packaging food mockup photography. IDENTIFY the food in the provided image.
TASK: Create a premium beverage packaging mockup where the brand logo appears clearly on a cup, can, or bottle.
PACKAGING: Paper cup, clearbox, or branded container with the logo wrapped around it. Colors from the logo applied to the packaging design and sleeve.
PAIRING: The food product sits beside or behind the packaging as a natural combo suggestion.
SCENE: Clean counter or bar top. Premium, modern aesthetic.
LIGHTING: Even, bright, product-photography style. Logo facing camera, fully readable.
STYLE: Fast food & delivery brand identity shot. Think branded café cup or artisan delivery box.
OUTPUT: Photorealistic branded cup / beverage packaging mockup. Logo must be clearly readable.`,
  },

  [DeliveryStyle.FOOD_BRAND_PIZZABOX]: {
    label: 'Caixa de Produto Brandada',
    description: 'Caixa fechada ou aberta com logo e produto dentro',
    color: 'from-red-600/20',
    icon: '📦',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Branded product box food mockup photography. IDENTIFY the food in the provided image.
TASK: Create a premium product shot of a delivery box (pizza box, burger box, or general food box) with the brand logo prominently displayed. Box can be open showing the food inside, or closed with food beside it.
BOX: Custom delivery box — white or kraft. Logo printed on lid, large and centered. Brand colors used on interior tissue or liner paper.
FOOD: Visible inside the open box or placed artfully beside the closed box.
SCENE: Dark wood table or marble surface. Side lighting that reveals the box texture.
STYLE: Premium artisan food delivery brand. Like a high-end custom packaging reveal.
OUTPUT: Photorealistic branded box mockup. Logo crisp and brand identity strong.`,
  },

  [DeliveryStyle.FOOD_BRAND_MENU]: {
    label: 'Cardápio Digital',
    description: 'Imagem estilo menu digital ou banner do iFood com logo',
    color: 'from-violet-600/20',
    icon: '📋',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Digital menu / food app banner style food photography. IDENTIFY the food in the provided image.
TASK: Create a professional digital menu card or iFood/delivery app banner image featuring this food.
LAYOUT: Food as the hero. Brand logo in the corner or centered at top. Name or category text space available.
BACKGROUND: Gradient background using brand colors from the logo, or a complementary dark/light surface.
FOOD: Perfectly lit, appetizing, centered or slightly off-center with room for text overlay.
STYLE: Like a professional iFood listing banner, Instagram food menu post, or digital menu display.
TYPOGRAPHY READY: Leave clean space near top or bottom for text overlays.
OUTPUT: Photorealistic digital menu-style image. Clear, clean, brand-consistent.`,
  },

  [DeliveryStyle.FOOD_BRAND_SHIRT]: {
    label: 'Camiseta da Marca',
    description: 'Camiseta ou moletom estampado com logo e produto em cena',
    color: 'from-emerald-600/20',
    icon: '👚',
    category: 'Marca & Logo',
    avatarEnabled: true,
    logoEnabled: true,
    prompt: `Branded t-shirt / apparel food photography. IDENTIFY the food in the provided image.
TASK: Create a lifestyle photo featuring a branded t-shirt or hoodie with the brand logo. Person (if provided) wears the branded apparel while holding or being near the food.
APPAREL: Fitted or relaxed t-shirt / hoodie. Logo prominently printed on chest or front. Colors match brand identity.
PERSON: If avatar provided, show them wearing the branded shirt, holding the food in a relaxed, confident pose.
FOOD: Held in hand or placed on nearby surface. Always visible and appetizing.
SCENE: Clean lifestyle background — kitchen, café entrance, or outdoor urban setting.
STYLE: Brand ambassador / merchandise photography. Like an influencer post promoting a food brand.
OUTPUT: Photorealistic branded apparel lifestyle photo. Logo visible and shirt looks premium.`,
  },

  [DeliveryStyle.FOOD_BRAND_STICKER]: {
    label: 'Adesivo no Produto',
    description: 'Adesivo/lacre da marca no produto ou embalagem delivery',
    color: 'from-lime-600/20',
    icon: '🔖',
    category: 'Marca & Logo',
    avatarEnabled: false,
    logoEnabled: true,
    prompt: `Branded sticker / seal food packaging photography. IDENTIFY the food in the provided image.
TASK: Create an authentic delivery moment photo where the brand logo appears as a sticker, seal, or label on the packaging of the food product.
STICKER: Round or rectangular branded sticker / wax seal on the delivery bag, box lid, or food container. Logo printed sharp and readable. Brand colors on the sticker border.
PACKAGING: Generic kraft bag, white box, or clear container — elevated by the branded sticker.
FOOD: Visible inside or nearby. The sticker seals the package or decorates the container.
SCENE: Dark surface with dramatic lighting highlighting the sticker detail.
STYLE: Premium artisan food brand. Think handcrafted bakery or boutique restaurant delivery.
OUTPUT: Photorealistic branded sticker mockup. Sticker detail sharp, authentic, premium.`,
  },
};





export enum MascotStyle {
  PIXAR_3D = 'Estilo Disney/Pixar 3D',
  CARTOON_2D = 'Cartoon Clássico 2D',
  ANIME_MODERN = 'Anime Moderno',
  CLAYMATION = 'Massinha (Claymation)',
  FUNKO_POP = 'Boneco Funko Pop',
  HAND_DRAWN = 'Sketch / Desenhado à Mão',
  RETRO_PIXEL = 'Pixel Art Retrô',
  REALISTIC_PLUSHD = 'Pelúcia Realista'
}

export enum MockupStyle {
  TSHIRT = 'Camiseta / Vestuário',
  BRANDING = 'Identidade Visual / Papelaria',
  VEHICLE = 'Envelopamento de Veículo',
  MUG = 'Caneca / Cerâmica',
  PACKAGING = 'Embalagem / Caixa',
  SIGNAGE = 'Placa / Fachada',
  TOTE_BAG = 'Ecobag / Sacola',
  STATIONERY = 'Caderno / Agenda'
}

export const MockupStyleMeta: Record<MockupStyle, { description: string, color: string, imageUrl: string }> = {
  [MockupStyle.TSHIRT]: {
    description: 'Estampa em Modelo Real',
    color: 'from-blue-500/20',
    imageUrl: '/mockup-styles/tshirt.png'
  },
  [MockupStyle.BRANDING]: {
    description: 'Cartão, Envelope e Pasta',
    color: 'from-slate-500/20',
    imageUrl: '/mockup-styles/branding.png'
  },
  [MockupStyle.VEHICLE]: {
    description: 'Adesivagem Comercial',
    color: 'from-red-500/20',
    imageUrl: '/mockup-styles/vehicle.png'
  },
  [MockupStyle.MUG]: {
    description: 'Caneca Personalizada',
    color: 'from-orange-500/20',
    imageUrl: '/mockup-styles/mug.png'
  },
  [MockupStyle.PACKAGING]: {
    description: 'Design de Embalagem',
    color: 'from-green-500/20',
    imageUrl: '/mockup-styles/packaging.png'
  },
  [MockupStyle.SIGNAGE]: {
    description: 'Letreiro e Fachada',
    color: 'from-yellow-500/20',
    imageUrl: '/mockup-styles/signage.png'
  },
  [MockupStyle.TOTE_BAG]: {
    description: 'Sacola de Tecido',
    color: 'from-indigo-500/20',
    imageUrl: '/mockup-styles/tote-bag.png'
  },
  [MockupStyle.STATIONERY]: {
    description: 'Caderno e Anotações',
    color: 'from-pink-500/20',
    imageUrl: '/mockup-styles/stationery.png'
  }
}

export const MascotStyleMeta: Record<MascotStyle, { description: string, color: string, imageUrl: string }> = {
  [MascotStyle.PIXAR_3D]: {
    description: '3D Fofo & Expressivo',
    color: 'from-blue-500/20',
    imageUrl: '/mascot-styles/pixar-3d.png'
  },
  [MascotStyle.CARTOON_2D]: {
    description: 'Traços Planos & Vibrantes',
    color: 'from-red-500/20',
    imageUrl: '/mascot-styles/cartoon-2d.png'
  },
  [MascotStyle.ANIME_MODERN]: {
    description: 'Estilo Japonês Moderno',
    color: 'from-pink-500/20',
    imageUrl: '/mascot-styles/anime-modern.png'
  },
  [MascotStyle.CLAYMATION]: {
    description: 'Textura de Massinha',
    color: 'from-orange-500/20',
    imageUrl: '/mascot-styles/claymation.png'
  },
  [MascotStyle.FUNKO_POP]: {
    description: 'Cabeçudo & Colecionável',
    color: 'from-indigo-500/20',
    imageUrl: '/mascot-styles/funko-pop.png'
  },
  [MascotStyle.HAND_DRAWN]: {
    description: 'Artístico & Riscado',
    color: 'from-emerald-500/20',
    imageUrl: '/mascot-styles/hand-drawn.png'
  },
  [MascotStyle.RETRO_PIXEL]: {
    description: '8-bit Nostalgia',
    color: 'from-purple-500/20',
    imageUrl: '/mascot-styles/retro-pixel.png'
  },
  [MascotStyle.REALISTIC_PLUSHD]: {
    description: 'Pelúcia Fofinha',
    color: 'from-yellow-500/20',
    imageUrl: '/mascot-styles/realistic-plush.png'
  }
};

export const StudioStyleMeta: Record<StudioStyle, { description: string, color: string, imageUrl: string, category: string }> = {
  // BUSINESS
  [StudioStyle.EXECUTIVO_PRO]: {
    description: 'Liderança & Autoridade',
    color: 'from-blue-600/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/executivo_pro.png'
  },
  [StudioStyle.ADVOGADO]: {
    description: 'Direito & Confiança',
    color: 'from-amber-800/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/advogado.png'
  },
  [StudioStyle.MEDICO_DENTISTA]: {
    description: 'Saúde & Credibilidade',
    color: 'from-teal-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/medico_dentista.png'
  },
  [StudioStyle.CORRETOR_IMOVEIS]: {
    description: 'Sucesso & Negócios',
    color: 'from-emerald-600/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/corretor_imoveis.png'
  },
  [StudioStyle.ENGENHEIRO]: {
    description: 'Obras & Solidez',
    color: 'from-orange-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/engenheiro.png'
  },
  [StudioStyle.ARQUITETO]: {
    description: 'Criatividade & Estrutura',
    color: 'from-slate-600/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/arquiteto.png'
  },
  [StudioStyle.PSICOLOGO]: {
    description: 'Empatia & Acolhimento',
    color: 'from-teal-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/psicologo.png'
  },
  [StudioStyle.DESIGNER_GRAFICO]: {
    description: 'Inovação Visual',
    color: 'from-purple-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/designer_grafico.png'
  },
  [StudioStyle.VENDEDOR_CARROS]: {
    description: 'Vendas & Dinamismo',
    color: 'from-red-600/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/vendedor_carros.png'
  },
  [StudioStyle.SOCIAL_MEDIA]: {
    description: 'Conectado & Criativo',
    color: 'from-pink-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/social_media.png'
  },
  [StudioStyle.PODCASTER]: {
    description: 'Voz & Influência',
    color: 'from-purple-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/podcaster.png'
  },
  [StudioStyle.PET_SHOP]: {
    description: 'Cuidado Animal',
    color: 'from-orange-500/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/pet_shop.png'
  },
  [StudioStyle.CONSULTOR_FINANCEIRO]: {
    description: 'Estratégia & Crescimento',
    color: 'from-slate-600/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/consultor_financeiro.png'
  },

  // MODA & BELEZA
  [StudioStyle.EDITORIAL_VOGUE]: {
    description: 'Alta Moda & Contraste',
    color: 'from-purple-600/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/editorial_vogue.png'
  },
  [StudioStyle.LUXURY_GOLD]: {
    description: 'Elegância & Opulência',
    color: 'from-amber-600/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/luxury_gold.png'
  },
  [StudioStyle.GLOW_BEAUTY]: {
    description: 'Pele Perfeita & Fresh',
    color: 'from-pink-600/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/glow_beauty.png'
  },
  [StudioStyle.OLD_MONEY]: {
    description: 'Herança & Clássico',
    color: 'from-amber-800/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/old_money.png'
  },
  [StudioStyle.MAQUIADORA]: {
    description: 'Arte & Detalhes',
    color: 'from-pink-500/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/maquiadora.png'
  },
  [StudioStyle.CABELEIREIRO]: {
    description: 'Hair Style Profissional',
    color: 'from-fuchsia-600/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/cabeleireiro.png'
  },
  [StudioStyle.JEWELRY_MACRO]: {
    description: 'Joias & Requinte',
    color: 'from-yellow-200/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/jewelry_macro.png'
  },
  [StudioStyle.SKINCARE_ORGANIC]: {
    description: 'Natural & Puro',
    color: 'from-green-200/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/skincare_organic.png'
  },
  [StudioStyle.STREET_FASHION]: {
    description: 'Urbano & Trendy',
    color: 'from-zinc-700/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/street_fashion.png'
  },
  [StudioStyle.BRIDAL_LUXURY]: {
    description: 'Noiva & Elegância',
    color: 'from-rose-100/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/bridal_luxury.png'
  },
  [StudioStyle.MEN_GROOMING]: {
    description: 'Barbearia & Estilo',
    color: 'from-slate-800/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/men_grooming.png'
  },
  [StudioStyle.PERFUME_ELEGANCE]: {
    description: 'Fragrância & Aura',
    color: 'from-amber-200/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/perfume_elegance.png'
  },
  [StudioStyle.MANICURE]: {
    description: 'Unhas & Nail Art',
    color: 'from-pink-400/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/manicure.png'
  },
  [StudioStyle.DESIGNER_SOBRANCELHA]: {
    description: 'Sobrancelhas Perfeitas',
    color: 'from-rose-300/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/designer_sobrancelha.png'
  },
  [StudioStyle.DEPILADORA]: {
    description: 'Estética & Depilação',
    color: 'from-sky-200/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/depiladora.png'
  },
  [StudioStyle.PENTEADOS]: {
    description: 'Penteados & Hair Art',
    color: 'from-fuchsia-400/20',
    category: 'Moda & Beleza',
    imageUrl: '/studio-styles/penteados.png'
  },

  // LIFESTYLE
  [StudioStyle.FITNESS_PRO]: {
    description: 'Performance & Suor',
    color: 'from-red-600/20',
    category: 'Casual',
    imageUrl: '/studio-styles/fitness_pro.png'
  },
  [StudioStyle.NATURE_FRESH]: {
    description: 'Orgânico & Ao Ar Livre',
    color: 'from-emerald-600/20',
    category: 'Casual',
    imageUrl: '/studio-styles/nature_fresh.png'
  },
  [StudioStyle.COASTAL_LUXE]: {
    description: 'Verão e Sofisticação',
    color: 'from-sky-500/20',
    category: 'Casual',
    imageUrl: '/studio-styles/coastal_luxe.png'
  },
  [StudioStyle.URBAN_STREET]: {
    description: 'Streetwear Moderno',
    color: 'from-zinc-600/20',
    category: 'Casual',
    imageUrl: '/studio-styles/urban_street.png'
  },
  [StudioStyle.PERSONAL_TRAINER]: {
    description: 'Coach & Motivação',
    color: 'from-lime-600/20',
    category: 'Casual',
    imageUrl: '/studio-styles/personal_trainer.png'
  },
  [StudioStyle.NUTRICIONISTA]: {
    description: 'Saudável & Colorido',
    color: 'from-green-500/20',
    category: 'Casual',
    imageUrl: '/studio-styles/nutricionista.png'
  },
  [StudioStyle.YOGA_WELLNESS]: {
    description: 'Zen & Equilíbrio',
    color: 'from-teal-300/20',
    category: 'Casual',
    imageUrl: '/studio-styles/yoga_wellness.png'
  },
  [StudioStyle.TRAVEL_BLOGGER]: {
    description: 'Aventura & Mundo',
    color: 'from-sky-400/20',
    category: 'Casual',
    imageUrl: '/studio-styles/travel_blogger.png'
  },
  [StudioStyle.COFFEE_LOVER]: {
    description: 'Café & Aconchego',
    color: 'from-amber-900/20',
    category: 'Casual',
    imageUrl: '/studio-styles/coffee_lover.png'
  },
  [StudioStyle.GAMER_STREAMER]: {
    description: 'Setup & Energia',
    color: 'from-purple-600/20',
    category: 'Casual',
    imageUrl: '/studio-styles/gamer_streamer.png'
  },
  [StudioStyle.MUSICIAN_VIBE]: {
    description: 'Música & Alma',
    color: 'from-indigo-700/20',
    category: 'Casual',
    imageUrl: '/studio-styles/musician_vibe.png'
  },
  [StudioStyle.DIY_CRAFTS]: {
    description: 'Artesanato & Mãos',
    color: 'from-orange-300/20',
    category: 'Casual',
    imageUrl: '/studio-styles/diy_crafts.png'
  },

  // FAMILY
  [StudioStyle.FAMILY_STUDIO_CLEAN]: {
    description: 'Retrato de Família',
    color: 'from-gray-300/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_studio_clean.png'
  },
  [StudioStyle.FAMILY_LIFESTYLE_HOME]: {
    description: 'Espontâneo em Casa',
    color: 'from-amber-100/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_lifestyle_home.png'
  },
  [StudioStyle.FAMILY_GOLDEN_HOUR]: {
    description: 'Luz Dourada Externa',
    color: 'from-orange-400/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_golden_hour.png'
  },
  [StudioStyle.FAMILY_BEACH]: {
    description: 'Família na Praia',
    color: 'from-cyan-400/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_beach.png'
  },
  [StudioStyle.FAMILY_CHRISTMAS]: {
    description: 'Natal Mágico',
    color: 'from-red-600/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_christmas.png'
  },
  [StudioStyle.FAMILY_PICNIC]: {
    description: 'Piquenique & Alegria',
    color: 'from-lime-400/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_picnic.png'
  },
  [StudioStyle.MATERNITY_SOFT]: {
    description: 'Gestante & Amor',
    color: 'from-pink-200/20',
    category: 'Família',
    imageUrl: '/studio-styles/maternity_soft.png'
  },
  [StudioStyle.NEWBORN_ART]: {
    description: 'Recém-nascido',
    color: 'from-stone-200/20',
    category: 'Família',
    imageUrl: '/studio-styles/newborn_art.png'
  },
  [StudioStyle.KIDS_PLAYGROUND]: {
    description: 'Diversão no Parque',
    color: 'from-yellow-400/20',
    category: 'Família',
    imageUrl: '/studio-styles/kids_playground.png'
  },
  [StudioStyle.GENERATIONS_PORTRAIT]: {
    description: 'Avós & Netos',
    color: 'from-warm-gray-400/20',
    category: 'Família',
    imageUrl: '/studio-styles/generations_portrait.png'
  },
  [StudioStyle.FAMILY_KITCHEN]: {
    description: 'Cozinhando Juntos',
    color: 'from-orange-200/20',
    category: 'Família',
    imageUrl: '/studio-styles/family_kitchen.png'
  },
  [StudioStyle.PET_FRIENDLY_FAMILY]: {
    description: 'Família com Pets',
    color: 'from-amber-700/20',
    category: 'Família',
    imageUrl: '/studio-styles/pet_friendly_family.png'
  },

  // ANIVERSÁRIO
  [StudioStyle.BDAY_BALOES_ROSE]: {
    description: 'Balões Rose Gold & Elegância',
    color: 'from-rose-400/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_baloes_rose.png'
  },
  [StudioStyle.BDAY_CONFETTI]: {
    description: 'Chuva de Confetti Dourado',
    color: 'from-yellow-500/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_confetti.png'
  },
  [StudioStyle.BDAY_BALOES_NUMERO]: {
    description: 'Balões Numéricos Metálicos',
    color: 'from-amber-400/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_baloes_numero.png'
  },
  [StudioStyle.BDAY_LUXO_DOURADO]: {
    description: 'Festa Luxo Preto & Dourado',
    color: 'from-amber-600/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_luxo_dourado.png'
  },
  [StudioStyle.BDAY_ESTUDIO_CLEAN]: {
    description: 'Estúdio Simples & Chique',
    color: 'from-gray-300/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_estudio_clean.png'
  },
  [StudioStyle.BDAY_JARDIM]: {
    description: 'Jardim Encantado & Flores',
    color: 'from-pink-300/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_jardim.png'
  },
  [StudioStyle.BDAY_POOL_PARTY]: {
    description: 'Pool Party & Verão',
    color: 'from-cyan-400/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_pool_party.png'
  },
  [StudioStyle.BDAY_NEON_GLOW]: {
    description: 'Festa Neon & Brilho UV',
    color: 'from-fuchsia-500/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_neon_glow.png'
  },
  // ANIVERSÁRIO MASCULINO
  [StudioStyle.BDAY_CHURRASCO]: {
    description: 'Churrasco & Cerveja Gelada',
    color: 'from-orange-700/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_churrasco.png'
  },
  [StudioStyle.BDAY_ESPORTE]: {
    description: 'Troféu & Vitória',
    color: 'from-green-600/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_esporte.png'
  },
  [StudioStyle.BDAY_BOTECO]: {
    description: 'Boteco & Nostalgia',
    color: 'from-yellow-700/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_boteco.png'
  },
  [StudioStyle.BDAY_WHISKY_VIP]: {
    description: 'Whisky & Charuto VIP',
    color: 'from-amber-900/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_whisky_vip.png'
  },
  [StudioStyle.BDAY_AVENTURA]: {
    description: 'Aventura & Natureza',
    color: 'from-emerald-700/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_aventura.png'
  },
  [StudioStyle.BDAY_GAMER]: {
    description: 'Setup Gamer & RGB',
    color: 'from-purple-700/20',
    category: 'Aniversário',
    imageUrl: '/studio-styles/bday_gamer.png'
  },

  // COMERCIAL & PRODUTO
  [StudioStyle.ECOMMERCE_CLEAN]: {
    description: 'Fundo Branco & Foco',
    color: 'from-gray-100/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/ecommerce_clean.png'
  },
  [StudioStyle.TECH_STARTUP]: {
    description: 'Inovação & Escritório',
    color: 'from-indigo-500/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/tech_startup.png'
  },
  [StudioStyle.GASTRONOMIA]: {
    description: 'Food Porn & Sabor',
    color: 'from-orange-500/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.REAL_ESTATE]: {
    description: 'Arquitetura & Decor',
    color: 'from-blue-200/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/real_estate.png'
  },
  [StudioStyle.COFFEE_SHOP]: {
    description: 'Cafeteria & Aroma',
    color: 'from-stone-700/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/coffee_shop.png'
  },
  [StudioStyle.FLORIST_BOUTIQUE]: {
    description: 'Flores & Cores',
    color: 'from-pink-400/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/florist_boutique.png'
  },
  [StudioStyle.BAKERY_ARTISAN]: {
    description: 'Padaria Artesanal',
    color: 'from-amber-300/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/bakery_artisan.png'
  },
  [StudioStyle.BOOKSTORE_COZY]: {
    description: 'Livraria & Cultura',
    color: 'from-blue-900/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/bookstore_cozy.png'
  },
  [StudioStyle.GYM_CROSSFIT]: {
    description: 'Academia & Força',
    color: 'from-slate-800/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/personal_trainer.png'
  },
  [StudioStyle.SPA_WELLNESS]: {
    description: 'Spa & Relax',
    color: 'from-teal-100/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/spa_wellness.png'
  },
  [StudioStyle.BARBER_SHOP_RETRO]: {
    description: 'Barbearia Clássica',
    color: 'from-stone-900/20',
    category: 'Comercial',
    imageUrl: '/studio-styles/barber_shop_retro.png'
  },

  // VAREJO 🛍️
  [StudioStyle.VAREJO_MODA_LOOKBOOK]: {
    description: 'Modelo vestindo a peça',
    color: 'from-rose-500/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/ecommerce_clean.png'
  },
  [StudioStyle.VAREJO_MODA_FLATLAY]: {
    description: 'Roupas dispostas artisticamente',
    color: 'from-pink-300/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/ecommerce_clean.png'
  },
  [StudioStyle.VAREJO_MODA_EDITORIAL]: {
    description: 'Editorial com cenário fashion',
    color: 'from-purple-600/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/editorial_vogue.png'
  },
  [StudioStyle.VAREJO_JOIAS_LUXURY]: {
    description: 'Joias em fundo escuro luxury',
    color: 'from-yellow-300/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/jewelry_macro.png'
  },
  [StudioStyle.VAREJO_COSMETICOS]: {
    description: 'Cosméticos premium com texturas',
    color: 'from-fuchsia-400/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/skincare_organic.png'
  },
  [StudioStyle.VAREJO_ACESSORIOS]: {
    description: 'Bolsas, óculos, sapatos lifestyle',
    color: 'from-amber-500/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/luxury_gold.png'
  },
  [StudioStyle.VAREJO_ELETRONICOS]: {
    description: 'Tech & gadgets em fundo dark',
    color: 'from-slate-700/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/tech_startup.png'
  },
  [StudioStyle.VAREJO_FUNDO_BRANCO]: {
    description: 'Fundo branco para marketplace',
    color: 'from-gray-200/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/ecommerce_clean.png'
  },
  [StudioStyle.VAREJO_LIFESTYLE]: {
    description: 'Produto em contexto real',
    color: 'from-emerald-400/20',
    category: 'Varejo 🛍️',
    imageUrl: '/studio-styles/nature_fresh.png'
  },

  // DELIVERY 🍕
  [StudioStyle.DELIVERY_BURGER]: {
    description: 'Hambúrguer gourmet com fumaça',
    color: 'from-orange-600/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.DELIVERY_PIZZA]: {
    description: 'Pizza artesanal com queijo',
    color: 'from-red-500/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.DELIVERY_SUSHI]: {
    description: 'Sushi & comida japonesa',
    color: 'from-slate-600/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.DELIVERY_DOCES]: {
    description: 'Bolos, doces & confeitaria',
    color: 'from-pink-500/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.DELIVERY_ACAI]: {
    description: 'Açaí & bowls coloridos',
    color: 'from-purple-500/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.DELIVERY_CAFE]: {
    description: 'Café artesanal & bebidas',
    color: 'from-amber-900/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/coffee_shop.png'
  },
  [StudioStyle.DELIVERY_CHURRASCO]: {
    description: 'Carne na brasa & churrasco',
    color: 'from-red-800/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/gastronomia.png'
  },
  [StudioStyle.DELIVERY_SAUDAVEL]: {
    description: 'Saladas & bowls saudáveis',
    color: 'from-green-500/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/nutricionista.png'
  },
  [StudioStyle.DELIVERY_PADARIA]: {
    description: 'Pães artesanais & massas',
    color: 'from-amber-400/20',
    category: 'Delivery 🍕',
    imageUrl: '/studio-styles/bakery_artisan.png'
  },

  // CRIATIVO
  [StudioStyle.CYBERPUNK_NEON]: {
    description: 'Neon & Futurismo',
    color: 'from-cyan-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/cyberpunk_neon.png'
  },
  [StudioStyle.FUTURISTA_LAB]: {
    description: 'Alta Tecnologia',
    color: 'from-indigo-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/futurista_lab.png'
  },
  [StudioStyle.VINTAGE_FILM]: {
    description: 'Analógico & Retrô',
    color: 'from-orange-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/vintage_film.png'
  },
  [StudioStyle.POP_ART]: {
    description: 'Cores & Contraste',
    color: 'from-yellow-500/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/pop_art.png'
  },
  [StudioStyle.TATUADOR]: {
    description: 'Ink & Lifestyle',
    color: 'from-violet-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/tatuador.png'
  },
  [StudioStyle.FOTOGRAFO]: {
    description: 'Câmera & Arte',
    color: 'from-rose-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/fotografo.png'
  },
  [StudioStyle.SURREAL_DREAM]: {
    description: 'Onírico & Mágico',
    color: 'from-violet-500/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/surreal_dream.png'
  },
  [StudioStyle.GLITCH_ART]: {
    description: 'Erro Digital',
    color: 'from-fuchsia-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/glitch_art.png'
  },
  [StudioStyle.PAPER_CUTOUT]: {
    description: 'Colagem 3D',
    color: 'from-yellow-400/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/paper_cutout.png'
  },
  [StudioStyle.DOUBLE_EXPOSURE]: {
    description: 'Fusão de Imagens',
    color: 'from-cyan-500/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/double_exposure.png'
  },
  [StudioStyle.WATERCOLOR_ART]: {
    description: 'Pintura Suave',
    color: 'from-emerald-400/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/watercolor_art.png'
  },
  [StudioStyle.NEON_PORTRAIT]: {
    description: 'Luzes Fluorescentes',
    color: 'from-blue-600/20',
    category: 'Criativo',
    imageUrl: '/studio-styles/neon_portrait.png'
  },

  // POLÍTICO
  [StudioStyle.POLITICO_BANDEIRA]: {
    description: 'Bandeira & Patriotismo',
    color: 'from-green-700/20',
    category: 'Político',
    imageUrl: '/studio-styles/politico_bandeira.png'
  },
  [StudioStyle.POLITICO_COMICIO]: {
    description: 'Palanque & Multidão',
    color: 'from-red-700/20',
    category: 'Político',
    imageUrl: '/studio-styles/politico_comicio.png'
  },
  [StudioStyle.POLITICO_GABINETE]: {
    description: 'Gabinete & Autoridade',
    color: 'from-slate-700/20',
    category: 'Político',
    imageUrl: '/studio-styles/politico_gabinete.png'
  },
  [StudioStyle.POLITICO_CAMPANHA_RURAL]: {
    description: 'Campanha & Povo',
    color: 'from-amber-700/20',
    category: 'Político',
    imageUrl: '/studio-styles/politico_campanha_rural.png'
  },

  // RESTAURAÇÃO DE FOTOS
  [StudioStyle.RESTAURACAO_RETRATO]: {
    description: 'Restaurar Retrato Antigo',
    color: 'from-stone-500/20',
    category: 'Restauração',
    imageUrl: '/studio-styles/luxury_gold.png'
  },
  [StudioStyle.RESTAURACAO_FAMILIA]: {
    description: 'Restaurar Foto de Família',
    color: 'from-amber-500/20',
    category: 'Restauração',
    imageUrl: '/studio-styles/family_studio_clean.png'
  },
  [StudioStyle.RESTAURACAO_COLORIZAR]: {
    description: 'Colorizar Foto P&B',
    color: 'from-purple-500/20',
    category: 'Restauração',
    imageUrl: '/studio-styles/restauracao_colorizar.png'
  },

  // PALCO & ORATÓRIA
  [StudioStyle.PALESTRANTE_PALCO]: {
    description: 'Palco & Holofotes',
    color: 'from-blue-500/20',
    category: 'Palco & Oratória',
    imageUrl: '/studio-styles/palestrante_palco.png'
  },
  [StudioStyle.COACH_MENTOR]: {
    description: 'Coach & Motivação',
    color: 'from-amber-500/20',
    category: 'Palco & Oratória',
    imageUrl: '/studio-styles/coach_mentor.png'
  },
  [StudioStyle.PASTOR_LIDER]: {
    description: 'Púlpito & Ministério',
    color: 'from-indigo-400/20',
    category: 'Palco & Oratória',
    imageUrl: '/studio-styles/pastor_lider.png'
  },
  [StudioStyle.TEDX_SPEAKER]: {
    description: 'Palco TED & Impacto',
    color: 'from-red-500/20',
    category: 'Palco & Oratória',
    imageUrl: '/studio-styles/tedx_speaker.png'
  },
  [StudioStyle.COMUNICADOR_MC]: {
    description: 'Energia & Palco',
    color: 'from-purple-500/20',
    category: 'Palco & Oratória',
    imageUrl: '/studio-styles/comunicador_mc.png'
  },

  // INSPIRACIONAL
  [StudioStyle.INSP_FUNDO_BOLD_RED]: {
    description: 'Fundo Vermelho Bold',
    color: 'from-red-600/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_fundo_bold_red.png'
  },
  [StudioStyle.INSP_FUNDO_BOLD_BLUE]: {
    description: 'Fundo Azul Bold',
    color: 'from-blue-600/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_fundo_bold_blue.png'
  },
  [StudioStyle.INSP_IMPACTO_CINEMATIC]: {
    description: 'Sombras & Impacto',
    color: 'from-gray-800/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_impacto_cinematic.png'
  },
  [StudioStyle.INSP_NEON_BICOLOR]: {
    description: 'Neon Vermelho & Azul',
    color: 'from-fuchsia-500/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_neon_bicolor.png'
  },
  [StudioStyle.INSP_HOME_OFFICE]: {
    description: 'Creator em Casa',
    color: 'from-amber-500/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_home_office.png'
  },
  [StudioStyle.INSP_EDITORIAL_ELEGANTE]: {
    description: 'Elegância & Sofisticação',
    color: 'from-rose-400/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_editorial_elegante.png'
  },
  [StudioStyle.INSP_GOLDEN_HOUR]: {
    description: 'Luz Dourada Natural',
    color: 'from-yellow-500/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_golden_hour.png'
  },
  [StudioStyle.INSP_PRETO_BRANCO]: {
    description: 'Clássico P&B',
    color: 'from-neutral-500/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_preto_branco.png'
  },
  [StudioStyle.INSP_STREET_URBAN]: {
    description: 'Urbano & Street',
    color: 'from-stone-500/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_street_urban.png'
  },
  [StudioStyle.INSP_SMOKE_MYSTERY]: {
    description: 'Fumaça & Mistério',
    color: 'from-slate-600/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_smoke_mystery.png'
  },
  [StudioStyle.INSP_LUZ_NATURAL]: {
    description: 'Luz de Janela',
    color: 'from-orange-300/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_luz_natural.png'
  },
  [StudioStyle.INSP_POWER_PORTRAIT]: {
    description: 'Poder & Autoridade',
    color: 'from-zinc-700/20',
    category: 'Inspiracional',
    imageUrl: '/studio-styles/insp_power_portrait.png'
  },

  // OFÍCIOS & SERVIÇOS
  [StudioStyle.DENTISTA]: {
    description: 'Sorriso & Confiança',
    color: 'from-cyan-400/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/dentista.png'
  },
  [StudioStyle.PEDREIRO]: {
    description: 'Construção & Força',
    color: 'from-orange-600/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/pedreiro.png'
  },
  [StudioStyle.ELETRICISTA]: {
    description: 'Energia & Precisão',
    color: 'from-yellow-500/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/eletricista.png'
  },
  [StudioStyle.MECANICO]: {
    description: 'Motor & Habilidade',
    color: 'from-slate-600/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/mecanico.png'
  },
  [StudioStyle.CHEF_COZINHEIRO]: {
    description: 'Gastronomia & Arte',
    color: 'from-red-500/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/chef.png'
  },
  [StudioStyle.PROFESSOR]: {
    description: 'Educação & Inspiração',
    color: 'from-blue-400/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/professor.png'
  },
  [StudioStyle.ENFERMEIRO]: {
    description: 'Cuidado & Saúde',
    color: 'from-teal-400/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/enfermeiro.png'
  },
  [StudioStyle.FARMACEUTICO]: {
    description: 'Saúde & Conhecimento',
    color: 'from-green-400/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/farmaceutico.png'
  },
  [StudioStyle.BOMBEIRO]: {
    description: 'Coragem & Heroísmo',
    color: 'from-red-600/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/bombeiro.png'
  },
  [StudioStyle.CONTADOR]: {
    description: 'Números & Estratégia',
    color: 'from-indigo-400/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/contador.png'
  },
  [StudioStyle.CAMINHONEIRO]: {
    description: 'Estrada & Liberdade',
    color: 'from-amber-600/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/caminhoneiro.png'
  },
  [StudioStyle.AGRICULTOR]: {
    description: 'Campo & Dedicação',
    color: 'from-emerald-600/20',
    category: 'Ofícios & Serviços',
    imageUrl: '/studio-styles/agricultor.png'
  },

  // TIKTOK VIRAL 🔥
  [StudioStyle.TIKTOK_MIRROR]: {
    description: 'Selfie Aesthetic',
    color: 'from-pink-500/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_mirror.png'
  },
  [StudioStyle.TIKTOK_BEACH]: {
    description: 'Beach Vibes',
    color: 'from-amber-400/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_beach.png'
  },
  [StudioStyle.TIKTOK_PARTY]: {
    description: 'Party Mode',
    color: 'from-fuchsia-500/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_party.png'
  },
  [StudioStyle.TIKTOK_CAR]: {
    description: 'Car Aesthetic',
    color: 'from-slate-500/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_car.png'
  },
  [StudioStyle.TIKTOK_MORNING]: {
    description: 'That Girl ✨',
    color: 'from-lime-300/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_morning.png'
  },
  [StudioStyle.TIKTOK_GYM]: {
    description: 'Gym Aesthetic',
    color: 'from-red-500/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_gym.png'
  },
  [StudioStyle.TIKTOK_OOTD]: {
    description: 'Look do Dia',
    color: 'from-violet-500/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_ootd.png'
  },
  [StudioStyle.TIKTOK_ROOFTOP]: {
    description: 'Sunset Vibes',
    color: 'from-orange-500/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_rooftop.png'
  },
  [StudioStyle.TIKTOK_CAFE]: {
    description: 'Coffee Vibes',
    color: 'from-yellow-800/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_cafe.png'
  },
  [StudioStyle.TIKTOK_FESTIVAL]: {
    description: 'Festival Energy',
    color: 'from-purple-600/20',
    category: 'TikTok Viral 🔥',
    imageUrl: '/studio-styles/tiktok_festival.png'
  },
  // ADVOGADOS ESPECIAL ⚖️
  [StudioStyle.ADV_MINIMALISTA]: {
    description: 'Fundo branco clean, postura de autoridade',
    color: 'from-gray-400/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/adv_minimalista.png'
  },
  [StudioStyle.ADV_MODERNO]: {
    description: 'Sem gravata, visual contemporâneo',
    color: 'from-slate-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/adv_moderno.png'
  },
  [StudioStyle.ADV_ESCRITORIO]: {
    description: 'Mesa clean com livros jurídicos',
    color: 'from-amber-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/adv_escritorio.png'
  },
  [StudioStyle.ADV_EXECUTIVO_DARK]: {
    description: 'Fundo escuro elegante, corporativo',
    color: 'from-zinc-600/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/adv_executivo_dark.png'
  },
  [StudioStyle.ADV_EDITORIAL]: {
    description: 'Fashion-forward, editorial moderno',
    color: 'from-stone-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/adv_editorial.png'
  },
  [StudioStyle.ADV_CORPORATIVO]: {
    description: 'Janela panorâmica, skyline corporativo',
    color: 'from-sky-500/20',
    category: 'Profissional',
    imageUrl: '/studio-styles/adv_corporativo.png'
  }
};

export enum SocialClass {
  POPULAR = 'Popular / Simples',
  MIDDLE = 'Classe Média',
  LUXURY = 'Alta Renda / Luxo'
}

export enum AspectRatio {
  SQUARE = '1:1',
  PORTRAIT_4_5 = '4:5', // Added for Instagram support
  PORTRAIT_3_4 = '3:4',
  STORY_9_16 = '9:16',
  LANDSCAPE_16_9 = '16:9',
  CLASSIC_4_3 = '4:3'
}

export enum ColorPalette {
  VIBRANT_RETAIL = 'Varejo Vibrante (Vermelho/Amarelo)',
  TECH_DARK = 'Tech Dark (Roxo/Neon)',
  LUXURY_GOLD = 'Luxo Gold (Preto/Dourado)',
  FRESH_NATURE = 'Fresh Nature (Verde/Branco)',
  MINIMAL_BW = 'Minimal Black & White',
  SUMMER_POP = 'Summer Pop (Laranja/Azul)',
  CORPORATE_BLUE = 'Corporate Blue (Azul Escuro/Cinza)'
}

export enum UGCEnvironment {
  HOME = 'Casa / Interior',
  OUTDOOR = 'Rua / Cidade',
  OFFICE = 'Escritório / Trabalho',
  STORE = 'Mercado / Loja',
  GYM = 'Academia / Esportes',
  NATURE = 'Parque / Natureza'
}

export enum UGCModel {
  WOMAN_20_30 = 'Mulher (20-30 anos)',
  WOMAN_30_40 = 'Mulher (30-40 anos)',
  MAN_20_30 = 'Homem (20-30 anos)',
  MAN_30_40 = 'Homem (30-40 anos)',
  CHILD = 'Criança (5-10 anos)',
  TEEN = 'Jovem / Teen (15-18 anos)',
  SENIOR = 'Idoso / Senior (60+ anos)'
}

export interface GenerationConfig {
  type: CreationType;
  style: VisualStyle;
  studioStyle?: StudioStyle;
  mascotStyle?: MascotStyle;
  mockupStyle?: MockupStyle;
  aspectRatio: AspectRatio;
  colorPalette?: ColorPalette;
  productDescription: string;
  copyText?: string;
  editPrompt?: string; // New: For Magic Edit instructions
  ctaText?: string;
  targetAudience?: string;
  socialClass?: SocialClass;
  ugcEnvironment?: UGCEnvironment;
  customEnvironment?: string;
  ugcModel?: UGCModel;
  designCount?: number;
  shotType?: 'closeup' | 'american' | 'fullbody'; // Optional photo framing
  slideCount?: number;
  useAiAvatar?: boolean;
  avatarType?: string; // Type of AI avatar to generate (woman_young, man_young, etc.)
  isEditableMode?: boolean;
  useBoxLayout?: boolean;
  brandColors?: string[]; // New: Store hex codes for strict branding
  customInstructions?: string; // New: User custom prompt instructions
  birthdayAge?: string; // Age for birthday photoshoot presets
}

export interface GeneratedImage {
  id: string;
  url: string;
  originalUrl?: string; // Clean background without baked text
  variation: number;
  slides?: string[];
  layoutMode?: 'default' | 'box';
}
