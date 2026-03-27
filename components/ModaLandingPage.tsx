import React, { useEffect, useRef, useState } from 'react';
import {
    ArrowRight, Shield, Sparkles,
    DollarSign, Clock, Download, Eye,
    TrendingUp, Image as ImageIcon,
    ShoppingBag, Users,
    Target, Award, Zap, Heart,
    Star, Play, Video,
    Check, Crown, Gift, Infinity
} from 'lucide-react';
import FAQSection, { varejoFaqs } from './FAQSection';

interface ModaLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;

}

export const ModaLandingPage: React.FC<ModaLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {

    // Video demo state
    const [isMuted, setIsMuted] = useState(true);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Force autoplay on load
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        const tryPlay = async () => {
            try {
                video.muted = true;
                await video.play();
                setIsVideoPlaying(true);
            } catch { /* will show click-to-play fallback */ }
        };
        if (video.readyState >= 2) tryPlay();
        else video.addEventListener('loadeddata', tryPlay, { once: true });
    }, []);

    // Track ViewContent for Meta Pixel (Moda niche)
    useEffect(() => {
        if (typeof (window as any).trackPro === 'function') {
            (window as any).trackPro('ViewContent', {
                custom_data: {
                    content_name: 'LumiPhoto Moda',
                    content_category: 'moda',
                    content_type: 'product',
                },
            });
        }
    }, []);

    const handleVideoClick = async () => {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.muted = true;
            try { await video.play(); setIsVideoPlaying(true); } catch {}
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    // Counter animation hook
    const useCounter = (target: number, duration: number = 2000, suffix: string = '') => {
        const [count, setCount] = useState(0);
        const ref = useRef<HTMLDivElement>(null);
        const counted = useRef(false);
        useEffect(() => {
            const observer = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !counted.current) {
                        counted.current = true;
                        let start = 0;
                        const step = target / (duration / 16);
                        const timer = setInterval(() => {
                            start += step;
                            if (start >= target) { setCount(target); clearInterval(timer); }
                            else setCount(Math.floor(start));
                        }, 16);
                    }
                },
                { threshold: 0.3 }
            );
            if (ref.current) observer.observe(ref.current);
            return () => observer.disconnect();
        }, [target, duration]);
        return { count, ref, suffix };
    };

    const stat1 = useCounter(300, 2000, '%');
    const stat2 = useCounter(30, 1500, 's');
    const stat3 = useCounter(95, 1800, '%');

    const painPoints = [
        {
            emoji: '📱',
            title: 'Foto tirada no celular',
            desc: 'Fundo bagunçado, luz amarela, roupa amassada no cabide. Sua cliente não vai parar o scroll por isso.',
            color: 'border-red-300/30 bg-red-50/5'
        },
        {
            emoji: '💸',
            title: 'Fotógrafo + modelo = R$ 3.000',
            desc: 'E você precisa fotografar coleção nova toda semana. Impossível manter esse custo.',
            color: 'border-red-300/30 bg-red-50/5'
        },
        {
            emoji: '📉',
            title: 'Concorrente vendendo mais',
            desc: 'A loja ao lado usa fotos com modelo e vende 3x mais da mesma peça no mesmo preço.',
            color: 'border-red-300/30 bg-red-50/5'
        },
    ];

    const desires = [
        {
            emoji: '✨',
            title: 'Fotos de editorial de moda',
            desc: 'Iluminação perfeita, modelo posando, fundo clean. Como revista — mas feito em 30 segundos com IA.',
            color: 'border-rose-400/30 bg-rose-500/5'
        },
        {
            emoji: '👩‍💻',
            title: 'Avatar IA com visual de influenciadora',
            desc: 'A IA cria modelos virtuais com cara de influenciadora. Seu produto vira conteúdo que viraliza.',
            color: 'border-pink-400/30 bg-pink-500/5'
        },
        {
            emoji: '🔥',
            title: 'Engajamento que explode',
            desc: 'Posts com modelos profissionais recebem até 5x mais curtidas. Mais curtidas = mais vendas.',
            color: 'border-fuchsia-400/30 bg-fuchsia-500/5'
        },
    ];

    const steps = [
        { num: '01', title: 'Suba a foto da peça', desc: 'Pode ser do celular. A IA vai transformar.', icon: <ImageIcon size={28} />, color: 'from-rose-400 to-pink-500' },
        { num: '02', title: 'Ative o Avatar IA', desc: 'A IA cria uma modelo virtual com visual de influenciadora.', icon: <Users size={28} />, color: 'from-pink-500 to-fuchsia-500' },
        { num: '03', title: 'Clique em gerar', desc: '3 fotos profissionais em segundos. Diversos estilos.', icon: <Sparkles size={28} />, color: 'from-fuchsia-500 to-purple-500' },
        { num: '04', title: 'Baixe e venda', desc: 'Use no Instagram, Shopee, Mercado Livre, WhatsApp.', icon: <Download size={28} />, color: 'from-purple-500 to-violet-500' },
    ];

    const benefits = [
        { icon: <DollarSign size={22} />, title: 'R$ 1,17 por foto', desc: 'Fotógrafo + modelo cobra R$ 3.000+. Economize 95% com a IA.' },
        { icon: <Clock size={22} />, title: '30 segundos', desc: 'Catálogo inteiro fotografado em uma tarde. Zero espera.' },
        { icon: <Eye size={22} />, title: 'Visual de editorial', desc: 'Ninguém percebe que é IA. Qualidade de revista de moda.' },
        { icon: <TrendingUp size={22} />, title: '+300% de vendas', desc: 'Fotos com modelo vendem até 3x mais que fotos amadoras.' },
        { icon: <Heart size={22} />, title: 'Viraliza no Instagram', desc: 'Posts com modelos profissionais recebem 5x mais engajamento.' },
        { icon: <Shield size={22} />, title: 'Uso comercial total', desc: 'Instagram, Shopee, ML, WhatsApp — todos os canais liberados.' },
    ];

    const testimonials = [
        { name: 'Camila R.', role: 'Loja de roupas femininas', text: 'Minhas vendas triplicaram depois que comecei a usar fotos com modelo no Instagram. As clientes achavam que eu tinha contratado uma agência!', stars: 5 },
        { name: 'Juliana M.', role: 'Brechó online', text: 'Eu gastava R$ 800/mês com fotógrafo e nem dava pra fotografar tudo. Agora faço 50 fotos por dia com a IA. Mudou meu negócio.', stars: 5 },
        { name: 'Fernanda L.', role: 'Moda plus size no Shopee', text: 'A IA cria modelos que parecem influenciadoras de verdade. Minhas clientes sempre perguntam quem é a modelo!', stars: 5 },
    ];

    return (
        <div className="min-h-screen h-screen overflow-y-auto overflow-x-hidden" style={{ background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 15%, #FFF0F6 40%, #FFFFFF 60%, #FFF5F5 80%, #FFFFFF 100%)' }}>

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-rose-100/60 shadow-sm">
                <div className="max-w-6xl mx-auto px-3 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 md:h-10 w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[11px] md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">LUMI<span className="text-gray-800">IA</span></span>
                            <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.15em] text-rose-400">👗 Moda</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onLogin || onGetStarted} className="px-2 py-1.5 text-gray-400 text-[10px] font-bold hover:text-gray-600 transition-colors whitespace-nowrap">Entrar</button>
                        <button onClick={onViewStudio || onGetStarted} className="px-2 py-1.5 text-gray-400 text-[10px] font-bold hover:text-gray-600 transition-colors whitespace-nowrap">Estúdio</button>
                        <button onClick={scrollToPricing} className="px-3 py-1.5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full font-black text-[10px] text-white uppercase tracking-wide hover:shadow-[0_0_20px_rgba(244,63,94,0.3)] transition-all whitespace-nowrap">Quero Começar</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO — LIGHT & FASHIONABLE ===== */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Soft gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-[10%] w-[500px] h-[500px] bg-rose-200/30 blur-[120px] rounded-full" />
                    <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] bg-pink-200/20 blur-[100px] rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-fuchsia-100/15 blur-[150px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left min-w-0 overflow-hidden">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-50 border border-rose-200 text-rose-500 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <ShoppingBag size={14} />
                                Para Lojistas de Moda
                            </div>

                            <h1 className="text-[1.7rem] sm:text-3xl md:text-5xl lg:text-[3.5rem] font-black uppercase leading-[0.95] tracking-tight mb-6 break-words text-gray-900">
                                Transforme{' '}
                                <br className="hidden sm:block" />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500">
                                    fotos amadoras
                                </span>
                                <br />em fotos que{' '}
                                <span className="relative inline-block">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">vendem</span>
                                    <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                        <path d="M2 8C50 2 150 2 198 8" stroke="url(#underline-grad)" strokeWidth="3" strokeLinecap="round" />
                                        <defs><linearGradient id="underline-grad" x1="0" y1="0" x2="200" y2="0"><stop offset="0%" stopColor="#f43f5e" /><stop offset="100%" stopColor="#ec4899" /></linearGradient></defs>
                                    </svg>
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-full md:max-w-xl mb-6 leading-relaxed break-words">
                                A IA cria <strong className="text-gray-700">modelos virtuais com visual de influenciadoras</strong> vestindo suas peças.
                                Fotos de editorial em 30 segundos — sem fotógrafo, sem modelo, sem estúdio.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-gray-500 text-[11px] font-bold">
                                    <Zap size={11} className="text-rose-400" /> R$ 1,17/foto
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-gray-500 text-[11px] font-bold">
                                    <Clock size={11} className="text-rose-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-gray-500 text-[11px] font-bold">
                                    <Heart size={11} className="text-rose-400" /> Viraliza no Instagram
                                </span>
                            </div>

                            <button onClick={scrollToPricing} className="px-10 py-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_50px_rgba(244,63,94,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                                Criar Meu Catálogo Profissional
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-gray-300 text-[10px] mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>
                        </div>

                        {/* Right: Hero Image — Desktop */}
                        <div className="hidden lg:block relative">
                            <div className="relative rounded-3xl overflow-hidden border-2 border-rose-100 shadow-[0_20px_60px_rgba(244,63,94,0.15)]">
                                <img src="/moda/hero-antes-depois.png" alt="Transformação antes e depois" className="w-full h-auto object-cover" />
                                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-white/90 to-transparent p-6">
                                    <p className="text-rose-500 text-sm font-black text-center uppercase tracking-wider">✨ A mesma peça. Resultados diferentes.</p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Hero Image */}
                        <div className="lg:hidden -mx-2">
                            <div className="rounded-2xl overflow-hidden border border-rose-100 shadow-lg">
                                <img src="/moda/hero-antes-depois.png" alt="Transformação" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VIDEO DEMO: FOTO → VÍDEO COM IA ===== */}
            <section className="py-16 bg-gradient-to-b from-zinc-900 via-zinc-950 to-zinc-900 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-[20%] w-[400px] h-[400px] bg-rose-500/8 blur-[120px] rounded-full" />
                    <div className="absolute bottom-10 right-[20%] w-[300px] h-[300px] bg-pink-500/8 blur-[100px] rounded-full" />
                </div>
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <Play size={12} />
                            Novidade Explosiva
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black text-white uppercase leading-tight">
                            Transforme Fotos em{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-400">Vídeos que Viralizam</span>
                        </h2>
                        <p className="text-sm md:text-base text-white/50 max-w-xl mx-auto mt-3">
                            No <strong className="text-white/70">TikTok Shop</strong>, vídeos vendem <span className="text-rose-400 font-bold">8x mais</span> que fotos estáticas.
                            Agora você transforma qualquer foto profissional com movimento natural — <strong className="text-white/70">em 30 segundos</strong>.
                        </p>
                    </div>

                    <div className="flex justify-center px-4">
                        <div className="relative flex items-center gap-4 md:gap-8 max-w-[750px] w-full justify-center">

                            {/* LEFT PHONE - Static Photo */}
                            <div className="relative w-[42%] max-w-[280px]">
                                <div className="absolute -inset-3 bg-gradient-to-br from-rose-500/15 via-rose-500/5 to-transparent blur-2xl rounded-[32px] pointer-events-none" />
                                <div className="relative bg-zinc-900 rounded-[28px] p-[6px] border-2 border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-zinc-900 rounded-b-2xl z-20" />
                                    <div className="relative rounded-[22px] overflow-hidden">
                                        <img
                                            src="/moda-foto-estatica.jpg"
                                            alt="Foto do ensaio - estática"
                                            className="w-full h-auto block"
                                            style={{ aspectRatio: '9/16', objectFit: 'cover' }}
                                        />
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="white" stroke="none"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute -top-3 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500/90 to-pink-500/90 rounded-lg shadow-[0_4px_15px_rgba(244,63,94,0.4)] z-30">
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">📷 Foto</span>
                                </div>
                                <p className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 mt-4">
                                    Imagem Estática
                                </p>
                            </div>

                            {/* CENTER - 1 Click Arrow */}
                            <div className="flex flex-col items-center gap-2 z-20 shrink-0">
                                <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-r from-rose-500 to-pink-400 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.5)] border-2 border-white/20 animate-pulse">
                                    <ArrowRight size={20} className="text-white" />
                                </div>
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-wider text-rose-400 whitespace-nowrap">1 Click</span>
                            </div>

                            {/* RIGHT PHONE - Video */}
                            <div className="relative w-[42%] max-w-[280px]">
                                <div className="absolute -inset-3 bg-gradient-to-bl from-rose-500/20 via-pink-600/10 to-transparent blur-2xl rounded-[32px] pointer-events-none" />
                                <div className="relative bg-zinc-900 rounded-[28px] p-[6px] border-2 border-rose-500/30 shadow-[0_20px_60px_rgba(244,63,94,0.15)]">
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80px] h-[22px] bg-zinc-900 rounded-b-2xl z-20" />
                                    <div className="relative rounded-[22px] overflow-hidden cursor-pointer" onClick={handleVideoClick}>
                                        <video
                                            ref={videoRef}
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                            preload="auto"
                                            poster="/moda-foto-estatica.jpg"
                                            className="w-full h-auto block"
                                            style={{ aspectRatio: '9/16', objectFit: 'cover' }}
                                        >
                                            <source src="/moda-video-web.mp4" type="video/mp4" />
                                        </video>
                                        {!isVideoPlaying && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                                                <div className="w-16 h-16 rounded-full bg-rose-500/90 flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.6)] animate-pulse">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute bottom-4 right-4">
                                            <div className="w-10 h-10 rounded-full bg-rose-500/80 backdrop-blur-sm flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.4)]">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="white" stroke="none"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                                            </div>
                                        </div>
                                        <button
                                            onClick={toggleMute}
                                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-all duration-300 z-10"
                                            aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                                        >
                                            {isMuted ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                                <div className="absolute -top-3 right-4 flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-rose-500/90 to-pink-500/90 rounded-lg shadow-[0_4px_15px_rgba(244,63,94,0.4)] z-30">
                                    <span className="text-[9px] font-black uppercase tracking-[0.15em] text-white">🎬 Vídeo</span>
                                </div>
                                <div className="absolute -top-3 left-4 flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-fuchsia-500/90 to-pink-500/90 rounded-lg shadow-[0_4px_15px_rgba(217,70,239,0.3)] z-30 animate-pulse">
                                    <Zap size={10} className="text-white" />
                                    <span className="text-[8px] font-black uppercase tracking-wider text-white">Viral</span>
                                </div>
                                <p className="text-center text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mt-4">
                                    ✨ Com Movimento IA
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                        {[
                            { icon: <Video size={18} />, title: 'Foto vira vídeo com IA', desc: 'A modelo ganha movimento: pisca, respira, gira. Parece filmado em estúdio.' },
                            { icon: <TrendingUp size={18} />, title: 'TikTok Shop friendly', desc: 'Vídeos curtos têm 8x mais conversão. Perfeito para viralizar no TikTok e Reels.' },
                            { icon: <Zap size={18} />, title: 'Pronto em 30 segundos', desc: 'Sem editor de vídeo, sem After Effects. A IA faz tudo.' },
                        ].map((f, i) => (
                            <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                                <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center mx-auto mb-3 text-rose-400">{f.icon}</div>
                                <h3 className="text-white text-sm font-bold mb-1">{f.title}</h3>
                                <p className="text-white/40 text-xs leading-relaxed">{f.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-8 text-center">
                        <button onClick={onGetStarted} className="px-8 py-3.5 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-sm uppercase tracking-wider rounded-xl hover:shadow-[0_0_40px_rgba(244,63,94,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 inline-flex items-center gap-2">
                            <Video size={18} /> Quero Criar Vídeos →
                        </button>
                        <p className="text-white/30 text-[10px] mt-2">A partir de 5 créditos/vídeo</p>
                    </div>
                </div>
            </section>

            {/* ===== SOCIAL PROOF TICKER ===== */}
            <section className="py-6 border-y border-rose-100/50 bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
                    {[
                        { num: '+2.500', label: 'Lojistas usando' },
                        { num: '+180.000', label: 'Fotos geradas' },
                        { num: '4.9 ⭐', label: 'Avaliação' },
                        { num: '30s', label: 'Por foto' },
                    ].map((s, i) => (
                        <div key={i} className="text-center px-3">
                            <p className="text-rose-500 text-lg md:text-xl font-black">{s.num}</p>
                            <p className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== BLOCO DE DOR — VISUAL ANTES/DEPOIS ===== */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-50/40 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-50 border border-red-200 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Target size={12} />
                            A verdade que dói
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            Foto ruim <span className="text-red-400">mata a venda</span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">
                            <strong className="text-gray-600">72% das clientes</strong> decidem pela compra olhando APENAS a foto.
                            Se a foto não encanta, a peça <strong className="text-red-400">não vende</strong>.
                        </p>
                    </div>

                    {/* BEFORE/AFTER VISUAL */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
                        {/* ANTES — Foto Amadora */}
                        <div className="relative group">
                            <div className="rounded-2xl overflow-hidden border-2 border-red-200 shadow-lg">
                                <div className="aspect-[3/4] relative">
                                    <img src="/moda/pain-foto-amadora.png" alt="Foto amadora" className="w-full h-full object-cover brightness-95" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 via-transparent to-transparent" />
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-red-500/90 rounded-lg shadow-lg">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white">❌ Antes</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                        <p className="text-white font-bold text-sm">Foto de celular</p>
                                        <p className="text-white/60 text-[11px] leading-snug">Fundo bagunçado, luz amarela, roupa amassada. Ninguém para o scroll por isso.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-red-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg">0 vendas</div>
                        </div>

                        {/* DEPOIS — Foto IA */}
                        <div className="relative group">
                            <div className="rounded-2xl overflow-hidden border-2 border-emerald-300 shadow-[0_10px_40px_rgba(16,185,129,0.15)]">
                                <div className="aspect-[3/4] relative">
                                    <img src="/moda/desire-editorial.png" alt="Foto profissional com IA" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 via-transparent to-transparent" />
                                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-emerald-500/90 rounded-lg shadow-lg">
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white">✅ Depois com IA</span>
                                    </div>
                                    <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                                        <p className="text-white font-bold text-sm">Foto profissional com IA</p>
                                        <p className="text-white/60 text-[11px] leading-snug">Modelo influenciadora, luz de estúdio, fundo clean. Parece editorial de revista.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg animate-pulse">+300% vendas</div>
                        </div>
                    </div>

                    {/* Pain points as compact cards below */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[
                            { emoji: '📱', stat: 'R$ 0', title: 'Foto de celular = R$ 0 de resultado', desc: 'Fundo bagunçado e luz amarela espantam clientes antes mesmo de ver o preço.', color: 'bg-red-50 border-red-100' },
                            { emoji: '💸', stat: 'R$ 3.000+', title: 'Fotógrafo + modelo = proibitivo', desc: 'E precisa fotografar coleção nova toda semana. Impossível escalar com esse custo.', color: 'bg-red-50 border-red-100' },
                            { emoji: '📉', stat: '3x menos', title: 'Seu concorrente vende mais', desc: 'A loja ao lado usa fotos com modelo profissional e vende 3x mais da mesma peça.', color: 'bg-red-50 border-red-100' },
                        ].map((p, i) => (
                            <div key={i} className={`p-5 rounded-2xl border ${p.color} hover:shadow-lg transition-all duration-300`}>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="text-2xl">{p.emoji}</span>
                                    <span className="text-red-500 font-black text-lg">{p.stat}</span>
                                </div>
                                <h3 className="text-gray-900 font-bold text-sm mb-1.5">{p.title}</h3>
                                <p className="text-gray-400 text-xs leading-relaxed">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BLOCO DE DESEJO — VISUAL IMPACTANTE ===== */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 via-pink-50/30 to-transparent pointer-events-none" />
                <div className="absolute top-20 left-[10%] w-[400px] h-[400px] bg-rose-200/20 blur-[120px] rounded-full pointer-events-none" />
                <div className="absolute bottom-20 right-[10%] w-[300px] h-[300px] bg-pink-200/20 blur-[100px] rounded-full pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Heart size={12} />
                            Imagine só...
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            E se suas fotos <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">parecessem de revista?</span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">
                            Modelos com visual de influenciadoras vestindo suas peças. <strong className="text-gray-600">Fotos que fazem a cliente parar o scroll</strong> — e comprar.
                        </p>
                    </div>

                    {/* BIG VISUAL + FEATURES */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        {/* Left: Big editorial image */}
                        <div className="relative">
                            <div className="absolute -inset-4 bg-gradient-to-r from-rose-200/30 to-pink-200/30 blur-3xl rounded-3xl pointer-events-none" />
                            <div className="relative rounded-3xl overflow-hidden border-2 border-rose-200 shadow-[0_20px_60px_rgba(244,63,94,0.12)]">
                                <img src="/moda/desire-editorial.png" alt="Editorial de moda com IA" className="w-full h-auto object-cover" />
                                <div className="absolute bottom-0 inset-x-0 p-5 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Sparkles size={14} className="text-rose-400" />
                                        <span className="text-rose-400 text-[10px] font-black uppercase tracking-wider">Gerado com IA</span>
                                    </div>
                                    <p className="text-white text-sm font-bold">Parece fotógrafo profissional — mas foi feito em 30 segundos</p>
                                </div>
                            </div>
                            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wider animate-pulse z-10">
                                ✨ 100% IA
                            </div>
                        </div>

                        {/* Right: Feature cards */}
                        <div className="space-y-4">
                            {[
                                { emoji: '✨', title: 'Fotos de editorial de moda', desc: 'Iluminação perfeita, modelo posando, fundo clean. Qualidade de revista — em 30 segundos com IA.', stat: 'R$ 1,17/foto', statColor: 'text-rose-500' },
                                { emoji: '👩‍💻', title: 'Avatar IA com visual de influenciadora', desc: 'A IA cria modelos virtuais realistas que parecem influenciadoras. Seu produto vira conteúdo que viraliza.', stat: 'Sem modelo real', statColor: 'text-fuchsia-500' },
                                { emoji: '🔥', title: 'Engajamento que explode', desc: 'Posts com modelos profissionais recebem até 5x mais curtidas. Mais curtidas = mais vendas.', stat: '+500% engajamento', statColor: 'text-pink-500' },
                                { emoji: '🛒', title: 'Vende em todos os canais', desc: 'Instagram, Shopee, Mercado Livre, WhatsApp, TikTok Shop — todas as plataformas liberadas.', stat: 'Uso comercial total', statColor: 'text-emerald-500' },
                            ].map((d, i) => (
                                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 border border-rose-100 shadow-sm hover:shadow-md hover:border-rose-200 transition-all duration-300 group">
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-100 to-pink-100 flex items-center justify-center shrink-0 text-xl group-hover:scale-110 transition-transform">
                                        {d.emoji}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <h3 className="text-gray-900 font-bold text-sm">{d.title}</h3>
                                            <span className={`text-[10px] font-black ${d.statColor} whitespace-nowrap`}>{d.stat}</span>
                                        </div>
                                        <p className="text-gray-400 text-xs leading-relaxed">{d.desc}</p>
                                    </div>
                                </div>
                            ))}

                            <button onClick={scrollToPricing} className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl font-black text-sm text-white uppercase tracking-wider hover:shadow-[0_0_40px_rgba(244,63,94,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2 mt-4">
                                <Sparkles size={18} />
                                Quero Fotos de Revista →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== AVATAR IA — HERO SECTION ===== */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-fuchsia-50/30 via-pink-50/20 to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <div className="rounded-3xl overflow-hidden border border-pink-200 shadow-[0_20px_60px_rgba(236,72,153,0.1)]">
                                <img src="/moda/avatar-influencer.png" alt="Avatar IA Influenciadora" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                        <div className="order-1 lg:order-2 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-50 border border-fuchsia-200 text-fuchsia-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Sparkles size={12} />
                                O segredo das Top Sellers
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-6 leading-tight">
                                Avatares IA com{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-purple-500">
                                    visual de influenciadoras
                                </span>
                            </h2>
                            <div className="space-y-4 text-left">
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-pink-100 shadow-sm">
                                    <span className="text-xl mt-0.5">🤖</span>
                                    <p className="text-gray-600 text-sm leading-relaxed">A IA cria <strong className="text-gray-800">modelos virtuais realistas</strong> que vestem suas peças como uma influenciadora faria num unboxing.</p>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-pink-100 shadow-sm">
                                    <span className="text-xl mt-0.5">📸</span>
                                    <p className="text-gray-600 text-sm leading-relaxed">Sem contratar modelo, sem agendar estúdio. <strong className="text-gray-800">Você sobe a foto da peça e a IA faz o ensaio completo.</strong></p>
                                </div>
                                <div className="flex items-start gap-3 p-4 rounded-xl bg-white/70 border border-pink-100 shadow-sm">
                                    <span className="text-xl mt-0.5">🔥</span>
                                    <p className="text-gray-600 text-sm leading-relaxed">Posts com modelos profissionais recebem <strong className="text-rose-500">até 5x mais engajamento</strong> e fazem o produto viralizar.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-24 px-6 border-y border-rose-100/50 bg-white/60">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Play size={12} />
                            Super Simples
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            De foto <span className="text-red-400">de celular</span> a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">editorial de moda</span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">4 passos. 30 segundos. Zero habilidade técnica necessária.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="p-6 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-lg transition-all duration-300 h-full">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-r ${step.color} mb-4 shadow-lg`}>
                                        <span className="text-white">{step.icon}</span>
                                    </div>
                                    <div className="text-rose-300 text-[10px] font-black uppercase tracking-widest mb-2">Passo {step.num}</div>
                                    <h3 className="text-gray-900 font-bold text-base mb-2">{step.title}</h3>
                                    <p className="text-gray-400 text-sm">{step.desc}</p>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-rose-200">
                                        <ArrowRight size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>


            {/* ===== BLOCO 2: DIVERSIDADE DE AVATARES ===== */}
            <section className="py-24 px-6 bg-white/60 border-y border-rose-100/50 relative overflow-hidden">
                <div className="absolute top-1/2 left-[5%] w-[400px] h-[400px] bg-rose-100/30 blur-[100px] rounded-full -translate-y-1/2 pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Users size={12} />
                            Diversidade Real
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            Modelos para{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">
                                todos os públicos
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">
                            10 tipos de avatar IA que representam a diversidade brasileira. Sua cliente se vê na modelo — e compra.
                        </p>
                    </div>

                    {/* Avatar Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-10">
                        {[
                            { name: 'Morena Brasileira', emoji: '🇧🇷', desc: 'Morena, cabelo ondulado', color: 'from-amber-400 to-orange-500' },
                            { name: 'Negra Poderosa', emoji: '👑', desc: 'Negra, cabelo crespo/tranças', color: 'from-purple-500 to-fuchsia-500' },
                            { name: 'Loira Influencer', emoji: '💛', desc: 'Loira, estilo europeu', color: 'from-yellow-400 to-amber-500' },
                            { name: 'Ruiva Estilosa', emoji: '❤️', desc: 'Ruiva, cacheada, pele clara', color: 'from-red-400 to-rose-500' },
                            { name: 'Oriental BR', emoji: '🌸', desc: 'Descendente asiática brasileira', color: 'from-pink-400 to-rose-400' },
                            { name: 'Plus Size Diva', emoji: '💜', desc: 'Plus size, confiante', color: 'from-violet-400 to-purple-500' },
                            { name: 'Madura Elegante', emoji: '✨', desc: '50+, elegância e sofisticação', color: 'from-emerald-400 to-teal-500' },
                            { name: 'Teen Fashion', emoji: '🌟', desc: 'Adolescente, estilo jovem', color: 'from-sky-400 to-blue-500' },
                            { name: 'Moda Kids', emoji: '🎀', desc: 'Criança, 5-10 anos', color: 'from-pink-300 to-rose-400' },
                            { name: 'Masculino', emoji: '👔', desc: 'Modelo masculino, moderno', color: 'from-slate-500 to-gray-600' },
                        ].map((avatar, i) => (
                            <div key={i} className="group p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 text-center cursor-default">
                                <div className={`w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br ${avatar.color} flex items-center justify-center text-xl mb-3 group-hover:scale-110 transition-transform shadow-sm`}>
                                    {avatar.emoji}
                                </div>
                                <h3 className="text-gray-800 text-xs font-bold mb-1 leading-tight">{avatar.name}</h3>
                                <p className="text-gray-400 text-[10px] leading-snug">{avatar.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Diversity image */}
                    <div className="rounded-3xl overflow-hidden border border-rose-200 shadow-[0_20px_60px_rgba(244,63,94,0.1)]">
                        <img src="/moda/avatar-diversity.png" alt="Diversidade de avatares brasileiros" className="w-full h-auto object-cover" />
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-rose-50 border border-rose-100 rounded-full text-rose-500 text-[10px] font-bold">
                            <Heart size={10} /> Inclusivo
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-fuchsia-50 border border-fuchsia-100 rounded-full text-fuchsia-500 text-[10px] font-bold">
                            <Users size={10} /> Diversidade Real
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-50 border border-pink-100 rounded-full text-pink-500 text-[10px] font-bold">
                            <Sparkles size={10} /> 100% Brasileiras
                        </span>
                    </div>
                </div>
            </section>

            {/* ===== BLOCO 3: DIVERSIDADE DE ESTILOS ===== */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/20 to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} />
                            Estilo é Tudo
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            Um estilo para{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-fuchsia-500">
                                cada marca
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-lg mx-auto">
                            De editorial clean a neon urbano — escolha o estilo que combina com a identidade da sua loja.
                        </p>
                    </div>

                    {/* Styles horizontal scroll */}
                    <div className="overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
                        <div className="flex gap-4 min-w-max">
                            {[
                                { name: 'Editorial Clean', desc: 'Fundo branco, minimalista', img: '/moda/style-editorial.png' },
                                { name: 'Street Style', desc: 'Urbano, grafite, cidade', img: '/moda/style-street.png' },
                                { name: 'Neon Night', desc: 'Luzes neon, noturno', img: '/moda/style-neon.png' },
                                { name: 'Pastel Dreams', desc: 'Tons pastéis, suave', img: '/moda/style-pastel.png' },
                                { name: 'Luxury Gold', desc: 'Dourado, premium', img: '/moda/style-luxury.png' },
                                { name: 'Tropical Vibes', desc: 'Verde, tropical, Brasil', img: '/moda/style-tropical.png' },
                                { name: 'Casual Day', desc: 'Luz natural, lifestyle', img: '/moda/style-casual.png' },
                                { name: 'Vintage Rose', desc: 'Tons rosados, retrô', img: '/moda/style-vintage.png' },
                            ].map((style, i) => (
                                <div key={i} className="flex-shrink-0 w-[160px] sm:w-[180px] group cursor-default">
                                    <div className="h-[200px] sm:h-[240px] rounded-2xl border border-white/20 shadow-lg group-hover:shadow-xl group-hover:-translate-y-1 transition-all duration-300 overflow-hidden relative">
                                        <img src={style.img} alt={style.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/70 via-black/30 to-transparent">
                                            <p className="text-white text-xs font-bold">{style.name}</p>
                                            <p className="text-white/60 text-[10px]">{style.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Style showcase image */}
                    <div className="mt-8 rounded-3xl overflow-hidden border border-pink-200 shadow-[0_20px_60px_rgba(236,72,153,0.1)]">
                        <img src="/moda/style-showcase.png" alt="Showcase de estilos fotográficos" className="w-full h-auto object-cover" />
                    </div>
                </div>
            </section>

            {/* ===== VIRAL STATS ===== */}
            <section className="py-24 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-pink-50/20 to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 border border-pink-200 text-pink-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <TrendingUp size={12} />
                                Faça o produto viralizar
                            </div>
                            <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-6 leading-tight">
                                A mesma peça.{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                                    O dobro de vendas.
                                </span>
                            </h2>
                            <p className="text-gray-500 text-sm mb-8 leading-relaxed max-w-md">
                                Quando sua cliente vê a peça <strong className="text-gray-700">numa modelo que parece uma influenciadora</strong>, ela não vê só uma roupa — ela se vê usando aquela roupa. E compra.
                            </p>
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div ref={stat1.ref} className="text-center p-3 rounded-2xl bg-white border border-rose-100 shadow-sm">
                                    <p className="text-rose-500 text-2xl md:text-3xl font-black">+{stat1.count}%</p>
                                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mt-1">Mais vendas</p>
                                </div>
                                <div ref={stat2.ref} className="text-center p-3 rounded-2xl bg-white border border-rose-100 shadow-sm">
                                    <p className="text-pink-500 text-2xl md:text-3xl font-black">{stat2.count}s</p>
                                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mt-1">Por foto</p>
                                </div>
                                <div ref={stat3.ref} className="text-center p-3 rounded-2xl bg-white border border-rose-100 shadow-sm">
                                    <p className="text-fuchsia-500 text-2xl md:text-3xl font-black">{stat3.count}%</p>
                                    <p className="text-gray-400 text-[9px] font-bold uppercase tracking-wider mt-1">Economia</p>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="rounded-3xl overflow-hidden border border-pink-200 shadow-[0_20px_60px_rgba(236,72,153,0.12)]">
                                <img src="/moda/viral-social.png" alt="Produto viraliza com avatar IA" className="w-full h-auto object-cover" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== BENEFÍCIOS ===== */}
            <section className="py-24 px-6 bg-white/60 border-y border-rose-100/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Award size={12} />
                            Por que escolher a Lumi
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            Tudo que sua loja <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">precisa</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {benefits.map((b, i) => (
                            <div key={i} className="relative p-6 rounded-2xl border border-rose-100 bg-white hover:border-rose-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 overflow-hidden group">
                                <div className="text-rose-400 mb-4 group-hover:scale-110 transition-transform">{b.icon}</div>
                                <h3 className="text-gray-900 font-bold text-base mb-2">{b.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">{b.desc}</p>
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-rose-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-rose-50/20 to-transparent pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Star size={12} />
                            Depoimentos
                        </div>
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            Lojistas que já <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">transformaram</span> suas vendas
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white border border-rose-100 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-0.5 mb-3">
                                    {Array.from({ length: t.stars }).map((_, s) => (
                                        <Star key={s} size={14} className="text-amber-400 fill-amber-400" />
                                    ))}
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-400 flex items-center justify-center text-white text-[10px] font-black">{t.name[0]}</div>
                                    <div>
                                        <p className="text-gray-900 text-sm font-bold">{t.name}</p>
                                        <p className="text-gray-400 text-[10px]">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BLOCO 4: CRÉDITOS / PRICING ===== */}
            <section id="pricing-section" className="py-24 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-rose-50 via-pink-50/30 to-transparent pointer-events-none" />
                <div className="absolute top-10 left-[20%] w-[500px] h-[500px] bg-fuchsia-100/20 blur-[150px] rounded-full pointer-events-none" />
                <div className="max-w-5xl mx-auto relative z-10">

                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <DollarSign size={12} />
                            Investimento
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-gray-900 tracking-tight mb-4">
                            Pare de <span className="text-red-400">perder vendas</span>
                            <br />comece a <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500">faturar mais</span>
                        </h2>
                        <p className="text-gray-400 text-sm max-w-xl mx-auto mb-6">
                            Cada crédito gera <strong className="text-gray-600">1 foto profissional</strong>. Vídeos animados usam 5 créditos. Compre e use quando quiser — sem prazo.
                        </p>
                    </div>

                    {/* Credit info banner */}
                    <div className="max-w-2xl mx-auto mb-12 p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
                            <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-bold">
                                <Infinity size={14} className="text-rose-400" />
                                Créditos <strong className="text-rose-500">NÃO expiram</strong>
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-bold">
                                <Gift size={14} className="text-pink-400" />
                                Compre quando precisar
                            </span>
                            <span className="inline-flex items-center gap-1.5 text-gray-600 text-xs font-bold">
                                <Shield size={14} className="text-fuchsia-400" />
                                Sem mensalidade
                            </span>
                        </div>
                    </div>

                    {/* Pricing cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            {
                                name: 'Starter',
                                price: '37',
                                credits: 10,
                                photoCount: '10 fotos',
                                videoCount: '2 vídeos',
                                highlight: 'Ideal pra testar',
                                pricePerPhoto: '3,70',
                                color: 'from-gray-400 to-gray-500',
                                borderColor: 'border-gray-200',
                                popular: false,
                            },
                            {
                                name: 'Essencial',
                                price: '57',
                                credits: 30,
                                photoCount: '30 fotos',
                                videoCount: '6 vídeos',
                                highlight: 'Melhor pra começar',
                                pricePerPhoto: '1,90',
                                color: 'from-rose-400 to-pink-400',
                                borderColor: 'border-rose-200',
                                popular: false,
                            },
                            {
                                name: 'Pro',
                                price: '97',
                                credits: 80,
                                photoCount: '80 fotos',
                                videoCount: '16 vídeos',
                                highlight: 'Mais vendido',
                                pricePerPhoto: '1,21',
                                color: 'from-rose-500 to-pink-500',
                                borderColor: 'border-rose-300',
                                popular: true,
                            },
                            {
                                name: 'Premium',
                                price: '117',
                                credits: 100,
                                photoCount: '100 fotos',
                                videoCount: '20 vídeos',
                                highlight: 'Máximo valor',
                                pricePerPhoto: '1,17',
                                color: 'from-fuchsia-500 to-purple-500',
                                borderColor: 'border-fuchsia-200',
                                popular: false,
                            },
                        ].map((plan, i) => (
                            <div key={i} className={`relative p-6 rounded-2xl border-2 ${plan.borderColor} bg-white hover:shadow-xl transition-all duration-300 ${plan.popular ? 'ring-2 ring-rose-400 shadow-[0_10px_40px_rgba(244,63,94,0.15)] scale-[1.02]' : 'hover:-translate-y-1'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-black px-4 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                                        <Crown size={10} /> Mais Popular
                                    </div>
                                )}

                                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${plan.color} mb-4`}>
                                    <Sparkles size={18} className="text-white" />
                                </div>

                                <h3 className="text-gray-900 font-black text-lg uppercase tracking-wide mb-1">{plan.name}</h3>

                                <div className="mb-4">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-gray-300 text-sm">R$</span>
                                        <span className={`text-4xl font-black ${plan.popular ? 'text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-pink-500' : 'text-gray-900'}`}>{plan.price}</span>
                                    </div>
                                    <p className="text-gray-300 text-[10px] mt-1">Pagamento único</p>
                                </div>

                                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${plan.color} text-white text-[10px] font-bold mb-4`}>
                                    <Zap size={10} />
                                    {plan.credits} créditos
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <Check size={14} className="text-green-400 shrink-0" />
                                        <span><strong className="text-gray-800">{plan.photoCount}</strong> profissionais com IA</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <Check size={14} className="text-green-400 shrink-0" />
                                        <span><strong className="text-gray-800">{plan.videoCount}</strong> animados com IA</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs">
                                        <Check size={14} className="text-green-400 shrink-0" />
                                        <span className="text-rose-500 font-bold">R$ {plan.pricePerPhoto}/foto</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <Check size={14} className="text-green-400 shrink-0" />
                                        <span>Créditos não expiram</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600 text-xs">
                                        <Check size={14} className="text-green-400 shrink-0" />
                                        <span>Uso comercial ilimitado</span>
                                    </div>
                                </div>

                                <button
                                    onClick={onGetStarted}
                                    className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all duration-300 ${plan.popular
                                            ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.3)] hover:scale-[1.03] active:scale-[0.97]'
                                            : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-rose-50 hover:border-rose-300 hover:text-rose-600'
                                        }`}
                                >
                                    {plan.popular ? 'Começar Agora' : 'Escolher'}
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Guarantee + Payment */}
                    <div className="mt-10 text-center">
                        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-4">
                            <span className="text-gray-400 text-[10px] flex items-center gap-1">🔒 Pagamento 100% seguro</span>
                            <span className="text-gray-400 text-[10px] flex items-center gap-1">🛡️ Garantia 7 dias</span>
                            <span className="text-gray-400 text-[10px] flex items-center gap-1">💳 Cartão, Pix ou Boleto</span>
                            <span className="text-gray-400 text-[10px] flex items-center gap-1">⚡ Acesso imediato</span>
                        </div>
                        <p className="text-gray-300 text-xs">Sem mensalidade • Compre quando precisar • Seus créditos nunca expiram</p>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <div style={{ background: '#0a0a0a' }}>
                <FAQSection extraFaqs={varejoFaqs} accentColor="rose" />
            </div>

            {/* ===== FOOTER ===== */}
            <footer className="py-8 px-6 bg-gray-50 border-t border-rose-100/50">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-gray-300 text-xs">© 2025 LumiphotoIA — Fotos profissionais de moda com IA</p>
                </div>
            </footer>

            {/* ===== CREDIBILITY BAR ===== */}
            <div className="bg-gray-50 border-t border-rose-100/30 py-5 px-6">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00B1EA" stroke="none" /></svg>
                        <span className="text-gray-400 text-[11px] font-bold">Pagamento Seguro</span>
                        <span className="text-gray-300 text-[10px]">— Pagamento 100% Seguro</span>
                    </div>
                    <span className="text-gray-200 hidden sm:block">|</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1">🔒 Criptografia SSL</span>
                    <span className="text-gray-200 hidden sm:block">|</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1">🛡️ Garantia 7 dias</span>
                    <span className="text-gray-200 hidden sm:block">|</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1">⚡ Acesso imediato</span>
                    <span className="text-gray-200 hidden sm:block">|</span>
                    <span className="text-gray-400 text-[10px] flex items-center gap-1">💳 Cartão, Pix ou Boleto</span>
                </div>
            </div>
        </div>
    );
};

export default ModaLandingPage;
