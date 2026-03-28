
import React, { useState, useRef, useEffect } from 'react';
import {
    Camera, Check, Star, Zap, ArrowRight, Shield, Sparkles,
    Users, DollarSign, Clock, Download, Eye, MessageCircle,
    ChevronDown, TrendingUp, Image as ImageIcon,
    Smartphone, Send, Award, Target, Heart, Briefcase,
    Play, Volume2, VolumeX
} from 'lucide-react';
import FAQSection, { ensaioFaqs } from './FAQSection';


interface EnsaiosLandingPageProps {
    onGetStarted: () => void;
    onPlanSelect?: (plan: string) => void;
    onViewStudio?: () => void;
    onLogin?: () => void;

}

export const EnsaiosLandingPage: React.FC<EnsaiosLandingPageProps> = ({ onGetStarted, onPlanSelect, onViewStudio, onLogin }) => {
    const [selectedScenario, setSelectedScenario] = useState(1);
    const videoRef = useRef<HTMLVideoElement>(null);
    const videoRef2 = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [isPlaying2, setIsPlaying2] = useState(true);
    const [isMuted2, setIsMuted2] = useState(true);

    useEffect(() => {
        if (typeof (window as any).trackPro === 'function') {
            (window as any).trackPro('ViewContent', {
                custom_data: {
                    content_name: 'LumiPhoto Ensaios',
                    content_category: 'ensaios',
                    content_type: 'product',
                },
            });
        }
    }, []);

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const scenarios = [
        { ensaios: 3, price: 49, label: 'Conservador', emoji: '🌱' },
        { ensaios: 5, price: 49, label: 'Médio', emoji: '🔥' },
        { ensaios: 10, price: 49, label: 'Intenso', emoji: '🚀' },
    ];

    const currentScenario = scenarios[selectedScenario];
    const costPerPhoto = 1.21;
    const photosPerEnsaio = 3;
    const costPerEnsaio = costPerPhoto * photosPerEnsaio;
    const profitPerEnsaio = currentScenario.price - costPerEnsaio;
    const monthlyRevenue = currentScenario.ensaios * currentScenario.price * 30;
    const monthlyCost = currentScenario.ensaios * costPerEnsaio * 30;
    const monthlyProfit = monthlyRevenue - monthlyCost;

    const niches = [
        { emoji: '🏛️', name: 'Ensaio Político', desc: 'Candidatos, vereadores e políticos sempre precisam de fotos profissionais para campanhas e redes sociais. Demanda altíssima em ano eleitoral.', charge: 99, photos: 5, dailyVol: 3, image: '/politico-blue.png', hot: true },
        { emoji: '🎂', name: 'Ensaio Aniversário', desc: 'Festas de aniversário merecem fotos profissionais. Mães, debutantes e aniversariantes pagam bem por memórias lindas.', charge: 79, photos: 5, dailyVol: 3, image: '/ensaios/niche-birthday.png', hot: true },
        { emoji: '💅', name: 'Profissional de Estética', desc: 'Dermatologistas, esteticistas e profissionais de beleza precisam de fotos que transmitam credibilidade e autoridade.', charge: 89, photos: 3, dailyVol: 4, image: '/ensaios/niche-aesthetics.png', hot: true },
        { emoji: '🎵', name: 'Tendência TikTok', desc: 'Ensaios virais de TikTok e Instagram com visual de editorial. Jovens pagam por fotos que bomban nas redes sociais.', charge: 59, photos: 3, dailyVol: 6, image: '/ensaios/niche-tiktok.png', hot: false },
        { emoji: '👶', name: 'Ensaio Bebê', desc: 'Mães pagam com prazer por fotos fofas dos filhos. Acompanhamento mensal = cliente recorrente o ano todo.', charge: 69, photos: 3, dailyVol: 4, image: '/ensaios/niche-baby.png', hot: false },
        { emoji: '📸', name: 'Restauração', desc: 'Fotos antigas restauradas e colorizadas. Forte apelo emocional = alta conversão. Clientes indicam amigos e família.', charge: 49, photos: 2, dailyVol: 5, image: '/restore-split.png', hot: false },
        { emoji: '👔', name: 'Corporativo', desc: 'LinkedIn, currículos, sites empresariais. Profissionais pagam bem por uma foto que transmita autoridade e confiança.', charge: 79, photos: 3, dailyVol: 4, image: '/ensaios/niche-corporate.png', hot: false },
        { emoji: '❤️', name: 'Ensaio Casal', desc: 'Namorados, noivos, aniversários. Altíssimo valor percebido — casais adoram fotos artísticas e compartilham nas redes.', charge: 89, photos: 5, dailyVol: 2, image: '/ensaios/niche-couple.png', hot: false },
        { emoji: '🐾', name: 'Ensaio Pet', desc: 'Donos de pets tratam como filhos e pagam bem por fotos criativas e divertidas. Mercado em crescimento explosivo.', charge: 49, photos: 3, dailyVol: 5, image: '/ensaios/niche-pet.png', hot: false },
    ];

    const marketProof = [
        {
            type: 'stat',
            icon: '📊',
            title: 'Mercado em Explosão',
            items: [
                'Mercado global de IA generativa projetado para US$ 109 bi até 2030 — Fonte: Grand View Research',
                'Brasil: 92% dos pequenos negócios usam redes sociais para vender — Fonte: SEBRAE 2024',
                '70% das consultoras e profissionais liberais investem em foto profissional — Pesquisa LinkedIn',
            ],
        },
        {
            type: 'youtube',
            icon: '🔍',
            title: 'Busque no YouTube',
            items: [
                '"Ensaio fotográfico com IA" — milhares de vídeos mostrando o potencial',
                '"Como vender ensaios digitais" — centenas de tutoriais de empreendedores',
                '"AI photography business" — tendência crescente no mundo inteiro',
            ],
        },
    ];

    const testimonials = [
        {
            name: 'Carla M.',
            role: 'Social Media',
            quote: 'Facilitou demais minhas vendas de ensaios. Meus clientes ficam encantados com a qualidade e indicam pra todo mundo. Nunca entreguei tanto em tão pouco tempo.',
            avatar: '/ensaios/testimonial-carla.png',
        },
        {
            name: 'Rafael S.',
            role: 'Empreendedor Digital',
            quote: 'Em 2 minutos eu gero um ensaio completo sem saber nada de edição. A plataforma é ridiculamente fácil de usar e o resultado parece feito em estúdio profissional.',
            avatar: '/ensaios/testimonial-rafael.png',
        },
        {
            name: 'Amanda L.',
            role: 'Fotógrafa',
            quote: 'Uso como complemento do meu trabalho. Consigo atender muito mais clientes sem precisar de estúdio físico. A qualidade surpreende até quem entende de fotografia.',
            avatar: '/ensaios/testimonial-amanda.png',
        },
    ];

    // FAQs are now in the shared FAQSection component

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 md:h-10 w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[11px] md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMI<span className="text-white">IA</span></span>
                            <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.15em] text-orange-400">📸 Ensaios</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={onLogin || onGetStarted}
                            className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={onViewStudio || onGetStarted}
                            className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap"
                        >
                            Estúdio
                        </button>
                        <button
                            onClick={scrollToPricing}
                            className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg font-black text-[10px] text-black uppercase tracking-wide hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all whitespace-nowrap"
                        >
                            Ver Pacotes
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO WITH SHOWCASE ===== */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* BG Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text */}
                        <div className="text-center lg:text-left min-w-0 overflow-hidden">

                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <DollarSign size={14} />
                                Oportunidade de Negócio
                            </div>

                            <h1 className="text-[1.6rem] sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6 break-words">
                                Ganhe de{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 whitespace-nowrap">
                                    R$&nbsp;5.000 a
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                                    R$&nbsp;10.000
                                </span>
                                <br />por mês vendendo{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                                    Ensaios IA
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-full md:max-w-xl mb-6 leading-relaxed break-words">
                                Transforme selfies em ensaios profissionais de estúdio em <strong className="text-white/80">30 segundos</strong>.
                                Sem equipamento, sem estúdio, sem saber nada de IA.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Zap size={11} className="text-amber-400" /> Sem experiência
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Clock size={11} className="text-amber-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Shield size={11} className="text-amber-400" /> Uso comercial
                                </span>
                            </div>

                            <button
                                onClick={scrollToPricing}
                                className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(52,211,153,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3"
                            >
                                Começar a Lucrar Agora
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>


                        </div>

                        {/* Right: Before/After Showcase */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Pair 1: Politician */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group">
                                    <div className="flex">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/selfie-politician.png" alt="Selfie" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[9px] font-black text-white/70 uppercase tracking-wider rounded">Selfie</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/politico-blue.png" alt="Ensaio IA" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-500/90 text-[9px] font-black text-black uppercase tracking-wider rounded">Ensaio IA ✨</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                        <ArrowRight size={12} className="text-black" />
                                    </div>
                                </div>

                                {/* Pair 2: Corporate */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group mt-6">
                                    <div className="flex">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/selfie-corporate.png" alt="Selfie" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[9px] font-black text-white/70 uppercase tracking-wider rounded">Selfie</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/niche-corporate.png" alt="Ensaio IA" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-500/90 text-[9px] font-black text-black uppercase tracking-wider rounded">Ensaio IA ✨</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                        <ArrowRight size={12} className="text-black" />
                                    </div>
                                </div>

                                {/* Pair 3: TikTok */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group">
                                    <div className="flex">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/selfie-tiktok.png" alt="Selfie" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[9px] font-black text-white/70 uppercase tracking-wider rounded">Selfie</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/niche-tiktok.png" alt="Ensaio IA" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-500/90 text-[9px] font-black text-black uppercase tracking-wider rounded">Ensaio IA ✨</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                        <ArrowRight size={12} className="text-black" />
                                    </div>
                                </div>

                                {/* Pair 4: Aesthetics */}
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group mt-6">
                                    <div className="flex">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/selfie-aesthetics.png" alt="Selfie" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[9px] font-black text-white/70 uppercase tracking-wider rounded">Selfie</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/niche-aesthetics.png" alt="Ensaio IA" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-amber-500/90 text-[9px] font-black text-black uppercase tracking-wider rounded">Ensaio IA ✨</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                        <ArrowRight size={12} className="text-black" />
                                    </div>
                                </div>
                                {/* Pair 5: Restauração — spans full row width */}
                                <div className="col-span-2 relative rounded-2xl overflow-hidden border border-rose-500/30 shadow-[0_8px_30px_rgba(244,63,94,0.15)] group">
                                    <div className="flex">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/restauracao-antes.png" alt="Foto Antiga" className="w-full h-48 object-cover filter grayscale sepia" />
                                            <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-[9px] font-black text-white/70 uppercase tracking-wider rounded">Foto Antiga</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/restauracao-depois.png" alt="Restaurada IA" className="w-full h-48 object-cover" />
                                            <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-rose-500/90 text-[9px] font-black text-white uppercase tracking-wider rounded">Restaurada IA 🪄</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                        <ArrowRight size={12} className="text-white" />
                                    </div>
                                    <div className="absolute top-0 inset-x-0 bg-gradient-to-r from-rose-500/20 to-transparent px-3 py-1.5">
                                        <span className="text-[8px] font-black text-rose-300 uppercase tracking-widest">🔥 Mais vendido: Restauração de fotos</span>
                                    </div>
                                </div>
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-amber-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-amber-400 text-xs font-black text-center">✨ Selfie → Ensaio profissional em 30 segundos</p>
                            </div>
                        </div>

                        {/* Mobile showcase (horizontal scroll with before/after) */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[
                                    { before: '/ensaios/selfie-politician.png', after: '/politico-blue.png', label: 'Político' },
                                    { before: '/ensaios/selfie-tiktok.png', after: '/ensaios/niche-tiktok.png', label: 'TikTok' },
                                    { before: '/ensaios/selfie-aesthetics.png', after: '/ensaios/niche-aesthetics.png', label: 'Estética' },
                                    { before: '/ensaios/selfie-birthday.png', after: '/ensaios/niche-birthday.png', label: 'Aniversário' },
                                    { before: '/ensaios/selfie-corporate.png', after: '/ensaios/niche-corporate.png', label: 'Corporativo' },
                                    { before: '/ensaios/selfie-couple.png', after: '/ensaios/niche-couple.png', label: 'Casal' },
                                    { before: '/ensaios/restauracao-antes.png', after: '/ensaios/restauracao-depois.png', label: '🔥 Restauração', labelBefore: 'Foto Antiga', labelAfter: 'Restaurada 🪄', accent: 'rose' },
                                ].map((pair, i) => (
                                    <div key={i} className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/[0.02]">
                                        <div className="flex relative">
                                            <div className="w-1/2 relative">
                                                <img src={pair.before} alt="Selfie" className="w-full h-36 object-cover" />
                                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[8px] font-black text-white/60 uppercase rounded">Selfie</span>
                                            </div>
                                            <div className="w-1/2 relative">
                                                <img src={pair.after} alt="Ensaio" className="w-full h-36 object-cover" />
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-amber-500/90 text-[8px] font-black text-black uppercase rounded">IA ✨</span>
                                            </div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                                <ArrowRight size={10} className="text-black" />
                                            </div>
                                        </div>
                                        <div className="px-3 py-2 text-center">
                                            <p className="text-white/50 text-[10px] font-bold uppercase tracking-wider">{pair.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-amber-400 text-xs font-bold mt-2">✨ Selfie → Ensaio profissional em 30 segundos</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA (3 PASSOS) ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            Simples Assim
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            3 Passos Para <span className="text-amber-500">Lucrar</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Você não precisa de estúdio, equipamento ou saber editar. A IA faz tudo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        {/* Connecting line */}
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-amber-500/30 via-emerald-500/30 to-green-500/30" />

                        {/* Step 1 */}
                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">1</div>
                                <Smartphone size={36} className="text-amber-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Cliente envia selfie</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Pelo WhatsApp, Instagram ou como preferir. Basta uma foto do rosto.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center group">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/25 flex items-center justify-center group-hover:shadow-[0_0_30px_rgba(52,211,153,0.2)] transition-all duration-500 overflow-hidden p-0">
                                    <img src="/logo-gold.png" alt="LumiphotoIA" className="w-full h-full object-cover rounded-3xl" />
                                </div>
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-emerald-500 text-black text-sm font-black flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.5)] z-20" style={{ right: 'calc(50% - 48px - 8px)' }}>2</div>
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">IA gera o ensaio</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Em 30 segundos, 3 variações profissionais estilo estúdio. Sem prompt, sem edição.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-black text-sm font-black flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">3</div>
                                <DollarSign size={36} className="text-green-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Entregue e lucre</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Envie prévia com marca d'água. Cliente aprovou? Entregue o HD e receba o pagamento.
                            </p>
                        </div>
                    </div>

                    {/* Workflow visual */}
                    <div className="mt-16 p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5">
                        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center text-sm">
                            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <MessageCircle size={16} className="text-amber-400" />
                                <span className="text-white/70">Receber selfie</span>
                            </div>
                            <ArrowRight size={16} className="text-white/20 hidden md:block" />
                            <ChevronDown size={16} className="text-white/20 md:hidden" />
                            <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                <Camera size={16} className="text-emerald-400" />
                                <span className="text-white/70">Upload na LumiphotoIA</span>
                            </div>
                            <ArrowRight size={16} className="text-white/20 hidden md:block" />
                            <ChevronDown size={16} className="text-white/20 md:hidden" />
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-xl border border-blue-500/20">
                                <Eye size={16} className="text-blue-400" />
                                <span className="text-white/70">Enviar prévia</span>
                            </div>
                            <ArrowRight size={16} className="text-white/20 hidden md:block" />
                            <ChevronDown size={16} className="text-white/20 md:hidden" />
                            <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                                <DollarSign size={16} className="text-green-400" />
                                <span className="text-white/70 font-bold">Receber pagamento</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VIDEO TUTORIAL ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Play size={12} fill="currentColor" />
                            Tutorial Rápido
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Veja Como é <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">Simples</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto text-sm">
                            Assista aos tutoriais e veja como criar ensaios profissionais e começar a faturar em poucos minutos.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto">
                        {/* Video 1 - Junior */}
                        <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                            <video
                                ref={videoRef}
                                src="/junior.mp4"
                                className="w-full aspect-[9/16] object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                onClick={() => {
                                    if (videoRef.current) {
                                        if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); }
                                        else { videoRef.current.pause(); setIsPlaying(false); }
                                    }
                                }}
                            />
                            <div className="absolute bottom-3 right-3 flex gap-1.5">
                                <button onClick={(e) => { e.stopPropagation(); if (videoRef.current) { if (videoRef.current.paused) { videoRef.current.play(); setIsPlaying(true); } else { videoRef.current.pause(); setIsPlaying(false); } } }} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all">
                                    {isPlaying ? <span className="text-[10px] font-black">⏸</span> : <Play size={12} fill="white" />}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); if (videoRef.current) { videoRef.current.muted = !videoRef.current.muted; setIsMuted(!isMuted); } }} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all">
                                    {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                </button>
                            </div>
                        </div>

                        {/* Video 2 - Lorena */}
                        <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 shadow-[0_0_40px_rgba(245,158,11,0.1)]">
                            <video
                                ref={videoRef2}
                                src="/lorena.mp4"
                                className="w-full aspect-[9/16] object-cover"
                                autoPlay
                                muted
                                loop
                                playsInline
                                onClick={() => {
                                    if (videoRef2.current) {
                                        if (videoRef2.current.paused) { videoRef2.current.play(); setIsPlaying2(true); }
                                        else { videoRef2.current.pause(); setIsPlaying2(false); }
                                    }
                                }}
                            />
                            <div className="absolute bottom-3 right-3 flex gap-1.5">
                                <button onClick={(e) => { e.stopPropagation(); if (videoRef2.current) { if (videoRef2.current.paused) { videoRef2.current.play(); setIsPlaying2(true); } else { videoRef2.current.pause(); setIsPlaying2(false); } } }} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all">
                                    {isPlaying2 ? <span className="text-[10px] font-black">⏸</span> : <Play size={12} fill="white" />}
                                </button>
                                <button onClick={(e) => { e.stopPropagation(); if (videoRef2.current) { videoRef2.current.muted = !videoRef2.current.muted; setIsMuted2(!isMuted2); } }} className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-all">
                                    {isMuted2 ? <VolumeX size={12} /> : <Volume2 size={12} />}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CALCULADORA DE LUCRO ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <TrendingUp size={12} />
                            Calculadora de Lucro
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            Simule Seus <span className="text-emerald-400">Ganhos</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Escolha o ritmo de trabalho e veja quanto pode lucrar por mês com ensaios IA.
                        </p>
                    </div>

                    {/* Scenario Selector — more visual */}
                    <div className="grid grid-cols-3 gap-3 mb-10 max-w-2xl mx-auto">
                        {scenarios.map((s, i) => (
                            <button
                                key={i}
                                onClick={() => setSelectedScenario(i)}
                                className={`relative p-4 rounded-2xl font-bold text-sm transition-all text-center ${selectedScenario === i
                                    ? 'bg-emerald-500/15 border-2 border-emerald-500/50 text-emerald-400 shadow-[0_0_30px_rgba(52,211,153,0.1)]'
                                    : 'bg-white/[0.03] border-2 border-white/5 text-white/50 hover:border-white/15'
                                    }`}
                            >
                                <span className="text-2xl block mb-1">{s.emoji}</span>
                                <span className="block font-black text-base">{s.label}</span>
                                <span className="block text-xs mt-0.5 opacity-60">{s.ensaios} ensaios/dia</span>
                                {selectedScenario === i && (
                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0a0a0a]" />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Main calculator visual */}
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
                        {/* Left: Per-ensaio breakdown */}
                        <div className="lg:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                            <h3 className="text-white font-black text-lg mb-5 flex items-center gap-2">
                                <Camera size={18} className="text-amber-400" />
                                Por Ensaio
                            </h3>

                            {/* Visual breakdown with bar */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/50 text-sm">Você cobra do cliente</span>
                                    <span className="text-white font-black text-xl">R$ {currentScenario.price}</span>
                                </div>

                                {/* Visual bar showing cost vs profit */}
                                <div className="relative h-8 rounded-full overflow-hidden bg-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-emerald-500 to-green-400 rounded-full transition-all duration-700 flex items-center justify-end pr-3"
                                        style={{ width: `${((profitPerEnsaio / currentScenario.price) * 100)}%` }}
                                    >
                                        <span className="text-[10px] font-black text-black">LUCRO</span>
                                    </div>
                                    <div
                                        className="absolute right-0 top-0 h-full bg-red-500/30 rounded-r-full flex items-center justify-center"
                                        style={{ width: `${((costPerEnsaio / currentScenario.price) * 100)}%` }}
                                    >
                                        <span className="text-[10px] font-bold text-red-300">CUSTO</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/15 text-center">
                                        <p className="text-emerald-400/60 text-[10px] font-bold uppercase">Seu lucro</p>
                                        <p className="text-emerald-400 font-black text-lg">R$ {profitPerEnsaio.toFixed(2)}</p>
                                    </div>
                                    <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/15 text-center">
                                        <p className="text-red-400/60 text-[10px] font-bold uppercase">Custo IA</p>
                                        <p className="text-red-400 font-black text-lg">R$ {costPerEnsaio.toFixed(2)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <span className="text-white/40 text-xs">Margem de lucro</span>
                                    <span className="text-emerald-400 font-black text-lg">{((profitPerEnsaio / currentScenario.price) * 100).toFixed(0)}%</span>
                                </div>

                                <div className="text-center pt-2">
                                    <p className="text-white/25 text-[10px]">
                                        Baseado no Plano Pro: {photosPerEnsaio} fotos × R$ {costPerPhoto.toFixed(2)} = R$ {costPerEnsaio.toFixed(2)}/ensaio
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right: Monthly projection — the hero number */}
                        <div className="lg:col-span-3 relative">
                            <div className="p-8 rounded-2xl bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent border-2 border-emerald-500/25 h-full flex flex-col justify-center relative overflow-hidden">
                                {/* Glow effect */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-500/10 blur-[100px] rounded-full" />

                                <div className="relative z-10">
                                    <div className="text-center mb-6">
                                        <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-widest mb-2">
                                            Cenário {currentScenario.label} • {currentScenario.ensaios} ensaios/dia
                                        </p>
                                        <p className="text-white/40 text-sm mb-4">
                                            Seu faturamento mensal estimado:
                                        </p>
                                        <p className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-400 leading-none">
                                            R$ {monthlyProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                                        </p>
                                        <p className="text-emerald-400/50 text-sm font-bold mt-2">lucro líquido por mês</p>
                                    </div>

                                    {/* Visual breakdown row */}
                                    <div className="grid grid-cols-3 gap-3 mb-6">
                                        <div className="p-3 rounded-xl bg-white/[0.05] text-center">
                                            <p className="text-white/30 text-[10px] font-bold uppercase">Faturamento</p>
                                            <p className="text-white font-black text-lg">R$ {monthlyRevenue.toLocaleString('pt-BR')}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-white/[0.05] text-center">
                                            <p className="text-white/30 text-[10px] font-bold uppercase">Custo IA</p>
                                            <p className="text-red-400 font-black text-lg">- R$ {monthlyCost.toFixed(0)}</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-500/10 text-center border border-emerald-500/20">
                                            <p className="text-emerald-400/60 text-[10px] font-bold uppercase">Lucro</p>
                                            <p className="text-emerald-400 font-black text-lg">R$ {monthlyProfit.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</p>
                                        </div>
                                    </div>

                                    {/* Comparison: Traditional vs IA */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                                            <p className="text-red-400/50 text-[10px] font-bold uppercase mb-1">❌ Fotógrafo Tradicional</p>
                                            <p className="text-red-400/70 text-xs">Equipamentos, estúdio, edição</p>
                                            <p className="text-red-400/50 text-xs font-bold mt-1">Custo: R$ 2.000-5.000/mês</p>
                                        </div>
                                        <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center">
                                            <p className="text-emerald-400/50 text-[10px] font-bold uppercase mb-1">✅ Com LumiphotoIA</p>
                                            <p className="text-emerald-400/70 text-xs">Só uma selfie + 30 segundos</p>
                                            <p className="text-emerald-400/50 text-xs font-bold mt-1">Custo: R$ {monthlyCost.toFixed(0)}/mês</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Platform advantages — speed, quality, cost-benefit */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 group hover:border-amber-500/20 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                <Zap size={20} className="text-amber-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">30 Segundos por Ensaio</h4>
                                <p className="text-white/30 text-xs leading-relaxed">Enquanto fotógrafo leva horas, você entrega em segundos. Mais ensaios = mais dinheiro.</p>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 group hover:border-purple-500/20 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                <Star size={20} className="text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Qualidade de Estúdio</h4>
                                <p className="text-white/30 text-xs leading-relaxed">IA gera fotos profissionais indistinguíveis de estúdio real. Seus clientes vão amar.</p>
                            </div>
                        </div>
                        <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 group hover:border-emerald-500/20 transition-all">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                                <DollarSign size={20} className="text-emerald-400" />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-sm mb-1">Custo Quase Zero</h4>
                                <p className="text-white/30 text-xs leading-relaxed">Cada foto custa R$ {costPerPhoto.toFixed(2)}. Margem de lucro acima de 90% em todos os nichos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== NICHOS LUCRATIVOS (WITH IMAGES) ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Target size={12} />
                            Nichos Lucrativos
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            9 Mercados Altamente <span className="text-amber-500">Lucrativos</span>
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto">
                            Cada nicho tem demanda constante e clientes dispostos a pagar. Veja quanto você pode ganhar em cada um.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {niches.map((niche, i) => {
                            const nicheCost = niche.photos * costPerPhoto;
                            const nicheProfit = niche.charge - nicheCost;
                            const monthlyEarning = nicheProfit * niche.dailyVol * 30;
                            const margin = ((nicheProfit / niche.charge) * 100).toFixed(0);

                            return (
                                <div key={i} className="group rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all duration-500 overflow-hidden relative">
                                    {/* Hot badge */}
                                    {niche.hot && (
                                        <div className="absolute top-4 right-4 z-20 px-3 py-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-full text-[10px] font-black text-white uppercase shadow-lg">
                                            🔥 Alta Demanda
                                        </div>
                                    )}

                                    {/* Niche Image — taller */}
                                    <div className="relative h-56 md:h-64 overflow-hidden">
                                        <img
                                            src={niche.image}
                                            alt={niche.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                                        <div className="absolute bottom-4 left-5 flex items-center gap-2">
                                            <span className="text-3xl">{niche.emoji}</span>
                                            <h3 className="text-white font-black text-xl drop-shadow-lg">{niche.name}</h3>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 space-y-4">
                                        <p className="text-white/40 text-sm leading-relaxed">{niche.desc}</p>

                                        {/* Earnings breakdown */}
                                        <div className="space-y-2 p-4 rounded-xl bg-white/[0.03] border border-white/5">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-white/40">Você cobra por ensaio:</span>
                                                <span className="font-black text-white text-sm">R$ {niche.charge},00</span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-white/40">Seu custo ({niche.photos} fotos × R$ {costPerPhoto.toFixed(2)}):</span>
                                                <span className="font-bold text-red-400">- R$ {nicheCost.toFixed(2)}</span>
                                            </div>
                                            <div className="h-px bg-white/5" />
                                            <div className="flex items-center justify-between">
                                                <span className="text-white/50 text-xs font-bold">Lucro por ensaio:</span>
                                                <span className="font-black text-emerald-400 text-lg">R$ {nicheProfit.toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-[10px]">
                                                <span className="text-emerald-400/60 font-bold">Margem de {margin}%</span>
                                                <span className="text-amber-400/60 font-bold">{niche.photos} fotos por ensaio</span>
                                            </div>
                                        </div>

                                        {/* Monthly scenario highlight */}
                                        <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500/10 to-green-500/5 border border-emerald-500/20">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-emerald-400/60 text-[10px] font-bold uppercase tracking-wider">Se fizer {niche.dailyVol} ensaios/dia:</p>
                                                    <p className="text-emerald-400 text-xl font-black">R$ {monthlyEarning.toLocaleString('pt-BR')}<span className="text-xs font-bold text-emerald-400/60">/mês</span></p>
                                                </div>
                                                <div className="w-10 h-10 rounded-full bg-emerald-500/15 flex items-center justify-center">
                                                    <TrendingUp size={18} className="text-emerald-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Bottom CTA */}
                    <div className="mt-12 text-center">
                        <p className="text-white/30 text-sm mb-4">Todos os nichos usam a mesma plataforma. Atenda um ou todos.</p>
                        <button
                            onClick={scrollToPricing}
                            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl font-black text-base text-black uppercase tracking-wider hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-2"
                        >
                            Quero Começar a Lucrar
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== ZERO BARREIRAS (PAIN-POINT FOCUSED) ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    {/* Header — pain-focused */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Shield size={12} />
                            Barreiras Eliminadas
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6">
                            Você <span className="text-red-400 line-through decoration-2">NÃO</span> Precisa<br className="md:hidden" /> Saber Nada de IA
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto text-base">
                            Quem quer vender ensaios online esbarra em prompts, cursos caros e ferramentas complexas.
                            <strong className="text-white/60"> A LumiphotoIA elimina tudo isso.</strong>
                        </p>
                    </div>

                    {/* Crossed-out barriers */}
                    <div className="flex flex-wrap justify-center gap-3 mb-16">
                        {[
                            '❌ Cursos de IA',
                            '❌ Escrever prompts',
                            '❌ Saber Photoshop',
                            '❌ Equipamento caro',
                            '❌ Estúdio fotográfico',
                            '❌ Horas de edição'
                        ].map((barrier, i) => (
                            <span key={i} className="px-4 py-2 rounded-xl bg-red-500/5 border border-red-500/10 text-red-400/70 text-sm font-bold line-through decoration-red-400/40">
                                {barrier}
                            </span>
                        ))}
                    </div>

                    {/* Feature 1: Zero prompts — the main pain */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 flex items-center justify-center overflow-hidden p-0">
                                    <img src="/logo-gold.png" alt="LumiphotoIA" className="w-full h-full object-cover rounded-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">Zero Prompt. Zero Curso.</h3>
                                    <p className="text-amber-400/60 text-xs font-bold uppercase tracking-wider">A IA mais fácil que existe</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed mb-5">
                                Enquanto outras ferramentas exigem que você <strong className="text-white/70">escreva comandos complexos em inglês</strong>,
                                gaste meses em cursos e ainda erre nos resultados...
                            </p>
                            <p className="text-white/70 text-base leading-relaxed mb-6 font-medium">
                                Na LumiphotoIA você só faz <strong className="text-emerald-400">3 cliques</strong>:
                            </p>

                            {/* Visual steps */}
                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">1</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Upload</strong> da selfie do cliente</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">2</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Escolhe</strong> o estilo do ensaio</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500 text-black text-sm font-black flex items-center justify-center flex-shrink-0">✓</div>
                                    <span className="text-emerald-400 text-sm font-bold">3 variações profissionais em 30 segundos</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                <p className="text-amber-400/80 text-xs font-bold">💡 Sem prompt, sem inglês, sem tutorial. Se você sabe usar o WhatsApp, sabe usar a LumiphotoIA.</p>
                            </div>
                        </div>
                        {/* Platform style grid — real thumbnails */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-[#0d0d0d] p-3">
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                                {[
                                    { img: '/studio-styles/executivo_pro.png', label: 'Executivo Pro' },
                                    { img: '/studio-styles/advogado.png', label: 'Advogado' },
                                    { img: '/studio-styles/dentista.png', label: 'Médico / Dentista' },
                                    { img: '/studio-styles/corretor_imoveis.png', label: 'Corretor' },
                                    { img: '/studio-styles/engenheiro.png', label: 'Engenheiro' },
                                    { img: '/studio-styles/arquiteto.png', label: 'Arquiteto' },
                                    { img: '/studio-styles/designer_grafico.png', label: 'Designer' },
                                    { img: '/studio-styles/coach_mentor.png', label: 'Coach' },
                                    { img: '/studio-styles/editorial_vogue.png', label: 'Editorial Vogue' },
                                    { img: '/studio-styles/luxury_gold.png', label: 'Luxury Gold' },
                                    { img: '/studio-styles/palestrante_palco.png', label: 'Palestrante' },
                                    { img: '/studio-styles/tiktok_rooftop.png', label: 'Rooftop Sunset' },
                                    { img: '/studio-styles/fitness_pro.png', label: 'Fitness Pro' },
                                    { img: '/studio-styles/cyberpunk_neon.png', label: 'Cyberpunk' },
                                    { img: '/studio-styles/glow_beauty.png', label: 'Glow Beauty' },
                                ].map((style, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group">
                                        <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                                            <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-white/20 text-[10px] font-bold mt-3 uppercase tracking-widest">+120 estilos disponíveis</p>
                        </div>
                    </div>

                    {/* Feature 2: Magic Box — customization */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
                        <div className="order-2 lg:order-1 rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-gradient-to-br from-purple-500/5 to-transparent">
                            <div className="p-6">
                                <div className="space-y-3">
                                    {/* Simulated chat messages */}
                                    <div className="flex justify-end">
                                        <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                            "Quero essa foto mas com fundo de escritório moderno"
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-emerald-500/10 border border-emerald-500/15 text-emerald-400/80 text-sm max-w-[80%]">
                                            ✨ Pronto! Fundo alterado para escritório moderno com iluminação natural.
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                            "Agora coloca ele de terno azul marinho"
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-emerald-500/10 border border-emerald-500/15 text-emerald-400/80 text-sm max-w-[80%]">
                                            ✨ Feito! Terno azul marinho aplicado mantendo a identidade do cliente.
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                            "Perfeito! Agora faz uma versão mais séria pra campanha"
                                        </div>
                                    </div>
                                    <div className="flex justify-start">
                                        <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-emerald-500/10 border border-emerald-500/15 text-emerald-400/80 text-sm max-w-[80%]">
                                            ✨ Versão campanha gerada! Postura confiante, iluminação profissional.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/25 flex items-center justify-center">
                                    <MessageCircle size={26} className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">Caixinha Mágica</h3>
                                    <p className="text-purple-400/60 text-xs font-bold uppercase tracking-wider">Seu expert em Photoshop particular</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed mb-5">
                                Quer mudar o fundo? A roupa? A iluminação? O cenário? É só <strong className="text-white/70">pedir em português</strong>, como se estivesse conversando com um amigo que é expert em Photoshop.
                            </p>
                            <p className="text-white/70 text-base leading-relaxed mb-6">
                                A <strong className="text-purple-400">Caixinha Mágica</strong> entende o que você quer e ajusta o ensaio <strong className="text-white">sem nenhum conhecimento técnico</strong>.
                            </p>

                            <div className="space-y-2 mb-6">
                                {[
                                    'Mude fundos, roupas e cenários por texto',
                                    'Ajuste iluminação e poses com uma frase',
                                    'Refine detalhes como um designer profissional',
                                    'Tudo em português, sem termos técnicos'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm">
                                        <Check size={14} className="text-purple-400 flex-shrink-0" />
                                        <span className="text-white/60">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                                <p className="text-purple-400/80 text-xs font-bold">🪄 É como ter um designer gráfico 24h disponível — só que instantâneo e muito mais barato.</p>
                            </div>
                        </div>
                    </div>

                    {/* Feature 3: Watermark Preview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-blue-600/5 border border-blue-500/25 flex items-center justify-center">
                                    <Eye size={26} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">Prévia com Marca D'Água</h3>
                                    <p className="text-blue-400/60 text-xs font-bold uppercase tracking-wider">Venda antes de entregar</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed mb-5">
                                Envie uma prévia protegida para o cliente aprovar <strong className="text-white/70">antes de cobrar</strong>. O botão "PRÉVIA" gera uma versão com marca d'água que você manda pelo WhatsApp.
                            </p>
                            <p className="text-white/70 text-base leading-relaxed mb-6">
                                Só entregue o HD <strong className="text-emerald-400">depois do PIX</strong>. Zero risco para você.
                            </p>
                            <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/15">
                                <p className="text-blue-400/80 text-xs font-bold">💡 Modelo de negócio perfeito: sem risco para você e sem surpresas para o cliente.</p>
                            </div>
                        </div>
                        {/* Preview image with PRÉVIA watermark covering the whole image including face */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)]">
                            <div className="relative">
                                <img src="/showcase-result-1.jpg" alt="Resultado com marca d'água PRÉVIA" className="w-full object-cover" />
                                <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none select-none">
                                    <div className="font-black uppercase text-white/25" style={{ transform: 'rotate(-35deg)', whiteSpace: 'nowrap' }}>
                                        <p className="text-5xl md:text-6xl mb-16 ml-[-50px]">PRÉVIA</p>
                                        <p className="text-4xl md:text-5xl mb-16 ml-[30px]">PRÉVIA</p>
                                        <p className="text-5xl md:text-6xl mb-16 ml-[-80px]">PRÉVIA</p>
                                        <p className="text-4xl md:text-5xl mb-16 ml-[50px]">PRÉVIA</p>
                                        <p className="text-5xl md:text-6xl ml-[-30px]">PRÉVIA</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom differentials grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Clock, title: 'Resultado em 30s', desc: 'Enquanto fotógrafos levam dias, você entrega em minutos', color: 'text-emerald-400', bg: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/20' },
                            { icon: Star, title: 'Qualidade estúdio', desc: 'Clientes não vão perceber que é IA', color: 'text-purple-400', bg: 'from-purple-500/20 to-purple-600/5 border-purple-500/20' },
                            { icon: DollarSign, title: 'Foto por R$ 1,17', desc: 'Ensaio de 3 fotos sai por R$ 3,51', color: 'text-green-400', bg: 'from-green-500/20 to-green-600/5 border-green-500/20' },
                            { icon: Shield, title: 'Uso comercial', desc: 'Revenda liberada em todos os planos', color: 'text-rose-400', bg: 'from-rose-500/20 to-rose-600/5 border-rose-500/20' },
                        ].map((item, i) => (
                            <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all text-center">
                                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${item.bg} border flex items-center justify-center mb-3`}>
                                    <item.icon size={20} className={item.color} />
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                <p className="text-white/30 text-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PROVA SOCIAL — MERCADO & DEPOIMENTOS ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            O Mercado de IA em <span className="text-emerald-400">Números</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto text-sm">
                            Não acredite na gente. Pesquise você mesmo — os dados são públicos.
                        </p>
                    </div>

                    {/* Market Data Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        {marketProof.map((block, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all">
                                <div className="text-3xl mb-3">{block.icon}</div>
                                <h4 className="text-white font-black text-lg mb-4">{block.title}</h4>
                                <ul className="space-y-3">
                                    {block.items.map((item, j) => (
                                        <li key={j} className="flex items-start gap-2">
                                            <Check size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-sm leading-relaxed text-white/50">{item}</p>
                                        </li>
                                    ))}
                                </ul>
                                {block.type === 'youtube' && (
                                    <a href="https://www.youtube.com/results?search_query=ensaio+fotogr%C3%A1fico+com+IA" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 bg-red-500/10 border border-red-500/20 rounded-full text-red-400 text-[10px] font-black uppercase hover:bg-red-500/20 transition-colors">
                                        ▶ Pesquisar no YouTube
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Testimonials */}
                    <div className="text-center mb-8">
                        <h3 className="text-2xl md:text-3xl font-black uppercase text-white tracking-tight">
                            Quem Já Usa <span className="text-amber-400">Recomenda</span>
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all">
                                <div className="flex items-center gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map(s => (
                                        <Star key={s} size={14} className="text-amber-500" fill="currentColor" />
                                    ))}
                                </div>
                                <p className="text-white/60 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                                <div className="flex items-center gap-3">
                                    <img
                                        src={t.avatar}
                                        alt={t.name}
                                        className="w-10 h-10 rounded-full object-cover border-2 border-amber-500/30"
                                    />
                                    <div>
                                        <p className="text-white font-bold text-sm">{t.name}</p>
                                        <p className="text-white/30 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/15 text-center">
                        <p className="text-amber-400/80 text-sm font-bold">
                            💡 Dica: Pesquise "ensaio fotográfico com IA" no YouTube e veja com seus próprios olhos o tamanho desse mercado.
                        </p>
                    </div>
                </div>
            </section>

            {/* ===== PRICING (ROI FOCUSED) ===== */}
            <section id="pricing-section" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-white/5 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Zap size={12} fill="currentColor" />
                            Investimento
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                            Seu Custo é <span className="text-emerald-400">Mínimo</span>
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                                <Check size={12} strokeWidth={3} /> Pagamento único
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
                                <Shield size={12} /> Sem mensalidade
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { emoji: '🚀', name: 'Starter', price: 37, credits: 10, perPhoto: 3.70, ensaios: 3, roi: '~R$ 110', popular: false },
                            { emoji: '🌟', name: 'Essencial', price: 57, credits: 30, perPhoto: 1.90, ensaios: 10, roi: '~R$ 433', popular: false, save: 49 },
                            { emoji: '🔥', name: 'Pro', price: 97, credits: 80, perPhoto: 1.21, ensaios: 26, roi: '~R$ 1.177', popular: true, save: 67 },
                            { emoji: '👑', name: 'Premium', price: 117, credits: 100, perPhoto: 1.17, ensaios: 33, roi: '~R$ 1.500', popular: false, save: 68 },
                        ].map((plan, i) => (
                            <div
                                key={i}
                                className={`group p-6 rounded-2xl flex flex-col relative transition-all duration-500 ${plan.popular
                                    ? 'bg-gradient-to-b from-amber-500/[0.08] to-white/[0.02] border-2 border-amber-500/40 hover:border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.12)]'
                                    : 'bg-white/[0.03] border border-white/10 hover:border-amber-500/40'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-[10px] font-black uppercase text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                                        ⭐ Mais Vendido
                                    </div>
                                )}
                                {plan.save && (
                                    <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-black text-emerald-400">
                                        -{plan.save}%/foto
                                    </div>
                                )}

                                <div className="relative z-10">
                                    <div className={`flex items-center gap-2 mb-4 ${plan.popular ? 'mt-2' : ''}`}>
                                        <span className="text-xl">{plan.emoji}</span>
                                        <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                                    </div>
                                    <p className="text-4xl font-black text-white mb-1">R$ {plan.price}<span className="text-lg font-normal text-white/40">,00</span></p>
                                    <p className="text-sm text-amber-400 font-bold mb-2">{plan.credits} Fotos</p>

                                    <div className="space-y-2 mb-6">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/30">Custo por foto:</span>
                                            <span className="font-bold text-emerald-400">R$ {plan.perPhoto.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/30">Ensaios possíveis:</span>
                                            <span className="font-bold text-white/70">{plan.ensaios} ensaios</span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                                            <span className="text-white/30">Se cobrar R$ 49/ensaio:</span>
                                            <span className="font-bold text-emerald-400">{plan.roi} de retorno</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => onPlanSelect ? onPlanSelect(plan.name.toLowerCase()) : onGetStarted()}
                                        className={`mt-auto w-full py-3.5 rounded-xl font-bold text-sm active:scale-[0.98] transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                                            : 'bg-white/[0.08] border border-white/10 text-white hover:bg-white/[0.15]'
                                            }`}
                                    >
                                        {plan.popular ? 'Começar a Lucrar' : 'Comprar'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-white/25 text-xs mt-8">
                        ✅ Pagamento único • Sem assinatura • Sem renovação automática • Use seus créditos quando quiser
                    </p>
                    <p className="text-center text-white/30 text-xs mt-4 flex items-center justify-center gap-2">
                        <MessageCircle size={14} className="text-emerald-400" />
                        <span>Suporte por <strong className="text-emerald-400">WhatsApp</strong> incluso em todos os planos</span>
                    </p>
                </div>
            </section>

            {/* ===== CTA FINAL ===== */}
            <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 blur-[200px] rounded-full" />
                </div>

                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <p className="text-white/30 text-sm mb-6 uppercase tracking-widest font-bold">O mercado já está aquecido</p>

                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6 leading-tight">
                        Enquanto você pensa,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                            outros já estão lucrando
                        </span>
                    </h2>

                    <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                        Cada dia sem começar é dinheiro que você deixa na mesa. A demanda por ensaios fotográficos profissionais só cresce.
                    </p>

                    {/* Before/After showcase */}
                    <div className="flex justify-center gap-4 mb-10">
                        <div className="w-32 h-40 rounded-xl overflow-hidden border border-white/10 relative">
                            <img src="/showcase-original.jpg" alt="Antes" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] font-bold py-1 text-center">SELFIE</div>
                        </div>
                        <div className="flex items-center">
                            <ArrowRight size={24} className="text-amber-500" />
                        </div>
                        <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-amber-500/40 relative shadow-[0_0_20px_rgba(245,158,11,0.2)]">
                            <img src="/showcase-result-1.jpg" alt="Depois" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-amber-500 text-black text-[10px] font-black py-1 text-center">ENSAIO IA ✨</div>
                        </div>
                    </div>

                    <button
                        onClick={scrollToPricing}
                        className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_60px_rgba(52,211,153,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3 mb-6"
                    >
                        Quero Começar Agora
                        <ArrowRight size={22} />
                    </button>

                    <div className="flex flex-wrap justify-center gap-4 text-xs text-white/25">
                        <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Pagamento único</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Sem mensalidade</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Uso comercial liberado</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-emerald-500" /> Resultado em 30 segundos</span>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FAQSection extraFaqs={ensaioFaqs} accentColor="amber" />

            {/* ===== MP CREDIBILITY BAR ===== */}
            <div className="border-t border-white/5 bg-[#050505] py-5 px-6">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#10B981" stroke="none" /></svg>
                        <span className="text-white/40 text-[11px] font-bold">Pagamento Seguro</span>
                        <span className="text-white/20 text-[10px]">— Checkout 100% Protegido</span>
                    </div>
                    <span className="text-white/10 hidden sm:block">|</span>
                    <span className="text-white/25 text-[10px] flex items-center gap-1">🔒 Criptografia SSL</span>
                    <span className="text-white/10 hidden sm:block">|</span>
                    <span className="text-white/25 text-[10px] flex items-center gap-1">🛡️ Garantia 7 dias</span>
                    <span className="text-white/10 hidden sm:block">|</span>
                    <span className="text-white/25 text-[10px] flex items-center gap-1">⚡ Acesso imediato</span>
                    <span className="text-white/10 hidden sm:block">|</span>
                    <span className="text-white/25 text-[10px] flex items-center gap-1">💳 Cartão, Pix ou Boleto</span>
                </div>
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/5 bg-[#030303] py-8">
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-6 w-auto object-contain opacity-30" />
                        <span className="text-white/15 text-[10px] uppercase tracking-widest">
                            © {new Date().getFullYear()} LumiphotoIA
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-white/15 text-[10px]">
                        <span>suporte@lumiphotoia.online</span>
                        <span>•</span>
                        <span>www.lumiphotoia.online</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};
