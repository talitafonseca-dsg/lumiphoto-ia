
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
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.ADVOGADO]: {
    description: 'Direito & Confiança',
    color: 'from-amber-800/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.MEDICO_DENTISTA]: {
    description: 'Saúde & Credibilidade',
    color: 'from-teal-500/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.CORRETOR_IMOVEIS]: {
    description: 'Sucesso & Negócios',
    color: 'from-emerald-600/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.ENGENHEIRO]: {
    description: 'Obras & Solidez',
    color: 'from-orange-500/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.ARQUITETO]: {
    description: 'Criatividade & Estrutura',
    color: 'from-slate-600/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PSICOLOGO]: {
    description: 'Empatia & Acolhimento',
    color: 'from-teal-500/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.DESIGNER_GRAFICO]: {
    description: 'Inovação Visual',
    color: 'from-purple-500/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.VENDEDOR_CARROS]: {
    description: 'Vendas & Dinamismo',
    color: 'from-red-600/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.SOCIAL_MEDIA]: {
    description: 'Conectado & Criativo',
    color: 'from-pink-500/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PODCASTER]: {
    description: 'Voz & Influência',
    color: 'from-purple-500/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PET_SHOP]: {
    description: 'Cuidado Animal',
    color: 'from-orange-500/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.CONSULTOR_FINANCEIRO]: {
    description: 'Estratégia & Crescimento',
    color: 'from-slate-600/20',
    category: 'Profissional',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  },

  // MODA & BELEZA
  [StudioStyle.EDITORIAL_VOGUE]: {
    description: 'Alta Moda & Contraste',
    color: 'from-purple-600/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.LUXURY_GOLD]: {
    description: 'Elegância & Opulência',
    color: 'from-amber-600/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.GLOW_BEAUTY]: {
    description: 'Pele Perfeita & Fresh',
    color: 'from-pink-600/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.OLD_MONEY]: {
    description: 'Herança & Clássico',
    color: 'from-amber-800/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1543087903-1ac2ec7aa8c5?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.MAQUIADORA]: {
    description: 'Arte & Detalhes',
    color: 'from-pink-500/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.CABELEIREIRO]: {
    description: 'Hair Style Profissional',
    color: 'from-fuchsia-600/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.JEWELRY_MACRO]: {
    description: 'Joias & Requinte',
    color: 'from-yellow-200/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1573408301185-a140d60523d7?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.SKINCARE_ORGANIC]: {
    description: 'Natural & Puro',
    color: 'from-green-200/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1556228578-8d2a741c9b20?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.STREET_FASHION]: {
    description: 'Urbano & Trendy',
    color: 'from-zinc-700/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.BRIDAL_LUXURY]: {
    description: 'Noiva & Elegância',
    color: 'from-rose-100/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.MEN_GROOMING]: {
    description: 'Barbearia & Estilo',
    color: 'from-slate-800/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PERFUME_ELEGANCE]: {
    description: 'Fragrância & Aura',
    color: 'from-amber-200/20',
    category: 'Moda & Beleza',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=600&q=80'
  },

  // LIFESTYLE
  [StudioStyle.FITNESS_PRO]: {
    description: 'Performance & Suor',
    color: 'from-red-600/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.NATURE_FRESH]: {
    description: 'Orgânico & Ao Ar Livre',
    color: 'from-emerald-600/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.COASTAL_LUXE]: {
    description: 'Verão e Sofisticação',
    color: 'from-sky-500/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.URBAN_STREET]: {
    description: 'Streetwear Moderno',
    color: 'from-zinc-600/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PERSONAL_TRAINER]: {
    description: 'Coach & Motivação',
    color: 'from-lime-600/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.NUTRICIONISTA]: {
    description: 'Saudável & Colorido',
    color: 'from-green-500/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.YOGA_WELLNESS]: {
    description: 'Zen & Equilíbrio',
    color: 'from-teal-300/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1588286882045-8002d9197c31?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.TRAVEL_BLOGGER]: {
    description: 'Aventura & Mundo',
    color: 'from-sky-400/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.COFFEE_LOVER]: {
    description: 'Café & Aconchego',
    color: 'from-amber-900/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.GAMER_STREAMER]: {
    description: 'Setup & Energia',
    color: 'from-purple-600/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.MUSICIAN_VIBE]: {
    description: 'Música & Alma',
    color: 'from-indigo-700/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.DIY_CRAFTS]: {
    description: 'Artesanato & Mãos',
    color: 'from-orange-300/20',
    category: 'Casual',
    imageUrl: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=600&q=80'
  },

  // FAMILY
  [StudioStyle.FAMILY_STUDIO_CLEAN]: {
    description: 'Retrato de Família',
    color: 'from-gray-300/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FAMILY_LIFESTYLE_HOME]: {
    description: 'Espontâneo em Casa',
    color: 'from-amber-100/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1542038784456-1ea8c935837a?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FAMILY_GOLDEN_HOUR]: {
    description: 'Luz Dourada Externa',
    color: 'from-orange-400/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FAMILY_BEACH]: {
    description: 'Família na Praia',
    color: 'from-cyan-400/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FAMILY_CHRISTMAS]: {
    description: 'Natal Mágico',
    color: 'from-red-600/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1512389142660-9c87db543544?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FAMILY_PICNIC]: {
    description: 'Piquenique & Alegria',
    color: 'from-lime-400/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1533222535027-fea652012543?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.MATERNITY_SOFT]: {
    description: 'Gestante & Amor',
    color: 'from-pink-200/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.NEWBORN_ART]: {
    description: 'Recém-nascido',
    color: 'from-stone-200/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.KIDS_PLAYGROUND]: {
    description: 'Diversão no Parque',
    color: 'from-yellow-400/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1472162072942-cd5147eb3902?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.GENERATIONS_PORTRAIT]: {
    description: 'Avós & Netos',
    color: 'from-warm-gray-400/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1525492416187-d4f1076f8231?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FAMILY_KITCHEN]: {
    description: 'Cozinhando Juntos',
    color: 'from-orange-200/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PET_FRIENDLY_FAMILY]: {
    description: 'Família com Pets',
    color: 'from-amber-700/20',
    category: 'Família',
    imageUrl: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80'
  },

  // COMERCIAL & PRODUTO
  [StudioStyle.ECOMMERCE_CLEAN]: {
    description: 'Fundo Branco & Foco',
    color: 'from-gray-100/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.TECH_STARTUP]: {
    description: 'Inovação & Escritório',
    color: 'from-indigo-500/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.GASTRONOMIA]: {
    description: 'Food Porn & Sabor',
    color: 'from-orange-500/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.REAL_ESTATE]: {
    description: 'Arquitetura & Decor',
    color: 'from-blue-200/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.COFFEE_SHOP]: {
    description: 'Cafeteria & Aroma',
    color: 'from-stone-700/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FLORIST_BOUTIQUE]: {
    description: 'Flores & Cores',
    color: 'from-pink-400/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f217271dc16c?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.BAKERY_ARTISAN]: {
    description: 'Padaria Artesanal',
    color: 'from-amber-300/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.BOOKSTORE_COZY]: {
    description: 'Livraria & Cultura',
    color: 'from-blue-900/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.GYM_CROSSFIT]: {
    description: 'Academia & Força',
    color: 'from-slate-800/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.SPA_WELLNESS]: {
    description: 'Spa & Relax',
    color: 'from-teal-100/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.BARBER_SHOP_RETRO]: {
    description: 'Barbearia Clássica',
    color: 'from-stone-900/20',
    category: 'Comercial',
    imageUrl: 'https://images.unsplash.com/photo-1512690459411-b9245aed6191?auto=format&fit=crop&w=600&q=80'
  },

  // CRIATIVO
  [StudioStyle.CYBERPUNK_NEON]: {
    description: 'Neon & Futurismo',
    color: 'from-cyan-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1535295972055-1c762f4483e5?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FUTURISTA_LAB]: {
    description: 'Alta Tecnologia',
    color: 'from-indigo-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1581090464777-f3220bbe1b8b?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.VINTAGE_FILM]: {
    description: 'Analógico & Retrô',
    color: 'from-orange-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.POP_ART]: {
    description: 'Cores & Contraste',
    color: 'from-yellow-500/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.TATUADOR]: {
    description: 'Ink & Lifestyle',
    color: 'from-violet-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.FOTOGRAFO]: {
    description: 'Câmera & Arte',
    color: 'from-rose-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.SURREAL_DREAM]: {
    description: 'Onírico & Mágico',
    color: 'from-violet-500/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1518640027989-d30d357e6ae9?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.GLITCH_ART]: {
    description: 'Erro Digital',
    color: 'from-fuchsia-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.PAPER_CUTOUT]: {
    description: 'Colagem 3D',
    color: 'from-yellow-400/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1525715843408-5b6ec445005f?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.DOUBLE_EXPOSURE]: {
    description: 'Fusão de Imagens',
    color: 'from-cyan-500/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1554189097-ffe88e998a2b?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.WATERCOLOR_ART]: {
    description: 'Pintura Suave',
    color: 'from-emerald-400/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80'
  },
  [StudioStyle.NEON_PORTRAIT]: {
    description: 'Luzes Fluorescentes',
    color: 'from-blue-600/20',
    category: 'Criativo',
    imageUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=600&q=80'
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
  slideCount?: number;
  useAiAvatar?: boolean;
  avatarType?: string; // Type of AI avatar to generate (woman_young, man_young, etc.)
  isEditableMode?: boolean;
  useBoxLayout?: boolean;
  brandColors?: string[]; // New: Store hex codes for strict branding
  customInstructions?: string; // New: User custom prompt instructions
}

export interface GeneratedImage {
  id: string;
  url: string;
  originalUrl?: string; // Clean background without baked text
  variation: number;
  slides?: string[];
  layoutMode?: 'default' | 'box';
}
