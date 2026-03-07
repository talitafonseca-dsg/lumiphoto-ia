
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
