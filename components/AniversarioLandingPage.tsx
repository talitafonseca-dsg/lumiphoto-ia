
import React, { useState, useRef } from 'react';
import {
    Camera, Check, Star, ArrowRight, Shield, Sparkles,
    DollarSign, Clock, MessageCircle, Gift, Cake,
    Image as ImageIcon, Download,
    Smartphone, Award, Heart, Play, Volume2, VolumeX,
    Palette, Users
} from 'lucide-react';
import FAQSection, { aniversarioFaqs } from './FAQSection';
import StudioTrialUpload from './StudioTrialUpload';

interface AniversarioLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;
    onFreeTrialGenerate?: (parts: any[], aspectRatio: string, trialType: string) => void;
    isTrialGenerating?: boolean;
    trialError?: string;
}

export const AniversarioLandingPage: React.FC<AniversarioLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin, onFreeTrialGenerate, isTrialGenerating, trialError }) => {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const bdayStyles = [
        { img: '/studio-styles/bday_estudio_clean.png', label: 'Estúdio Clean', hot: true },
        { img: '/studio-styles/bday_jardim.png', label: 'Jardim Encantado', hot: true },
        { img: '/studio-styles/bday_luxo_dourado.png', label: 'Luxo Dourado', hot: true },
        { img: '/studio-styles/bday_boteco.png', label: 'Boteco', hot: false },
        { img: '/studio-styles/bday_churrasco.png', label: 'Churrasco VIP', hot: false },
        { img: '/studio-styles/bday_neon_glow.png', label: 'Neon Brilho', hot: false },
        { img: '/studio-styles/bday_baloes_rose.png', label: 'Balões Rosé', hot: false },
        { img: '/studio-styles/bday_baloes_numero.png', label: 'Balões Número', hot: false },
        { img: '/studio-styles/bday_pool_party.png', label: 'Festa na Piscina', hot: false },
        { img: '/studio-styles/bday_whisky_vip.png', label: 'Whisky Masculino', hot: false },
        { img: '/studio-styles/bday_confetti.png', label: 'Festa Confetti', hot: false },
        { img: '/studio-styles/bday_gamer.png', label: 'Gamer Neon', hot: false },
        { img: '/studio-styles/bday_esporte.png', label: 'Esportivo', hot: false },
        { img: '/studio-styles/bday_aventura.png', label: 'Aventura', hot: false },
    ];

    const costPerPhoto = 1.21;

    const plans = [
        {
            name: 'Starter',
            credits: 30,
            price: 57,
            perCredit: '1.90',
            popular: false,
            features: ['30 fotos profissionais', 'Todos os estilos de aniversário', 'Resolução HD', 'Uso comercial liberado', 'Suporte por WhatsApp'],
        },
        {
            name: 'Pro',
            credits: 80,
            price: 97,
            perCredit: '1.21',
            popular: true,
            features: ['80 fotos profissionais', 'Todos os estilos de aniversário', 'Resolução HD', 'Uso comercial liberado', 'Suporte por WhatsApp', 'Melhor custo-benefício'],
        },
        {
            name: 'Business',
            credits: 200,
            price: 297,
            perCredit: '1.49',
            popular: false,
            features: ['200 fotos profissionais', 'Todos os estilos de aniversário', 'Resolução HD', 'Uso comercial liberado', 'Suporte prioritário', 'Menor custo por foto'],
        },
    ];

    // FAQs are now in the shared FAQSection component

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[11px] font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMI<span className="text-white">IA</span></span>
                            <span className="text-[7px] font-black uppercase tracking-[0.15em] text-violet-400">🎂 Aniversário</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onLogin || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Entrar</button>
                        <button onClick={onViewStudio || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Estúdio</button>
                        <button onClick={scrollToPricing} className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg font-black text-[10px] text-black uppercase tracking-wide hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all whitespace-nowrap">Ver Pacotes</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                {/* BG Effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-500/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <Cake size={14} />
                                Ensaio de Aniversário
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6">
                                Transforme uma{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                                    selfie
                                </span>
                                <br />em um ensaio de{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                                    aniversário incrível
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white/50 max-w-xl mb-6 leading-relaxed">
                                Dezenas de cenários prontos + uma <strong className="text-white/80">caixinha mágica</strong> para pedir o que quiser: cenário, roupa, decoração.
                                Ou suba uma <strong className="text-white/80">imagem de referência</strong> e a IA recria. Tudo em <strong className="text-white/80">30 segundos</strong>.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Cake size={11} className="text-pink-400" /> Cenários ilimitados
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
                                className="px-10 py-5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3"
                            >
                                Criar Ensaio de Aniversário
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 57 • Pagamento único • Sem mensalidade</p>

                            {/* FREE TRIAL CTA */}
                            {onFreeTrialGenerate && (
                                <div className="mt-8 p-5 rounded-2xl border border-pink-500/20 bg-pink-500/[0.04]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 bg-pink-500/20 text-pink-400 text-[10px] font-black uppercase rounded-full border border-pink-500/30">🎁 TESTE GRÁTIS</span>
                                        <span className="text-white/30 text-[10px]">Sem cadastro, sem cartão</span>
                                    </div>
                                    <StudioTrialUpload
                                        onTrialGenerate={onFreeTrialGenerate}
                                        isGenerating={isTrialGenerating}
                                        error={trialError}
                                        accentColor="from-pink-500 to-rose-400"
                                        ctaLabel="Gerar 3 Estilos Grátis"
                                        descriptionLabel="Envie uma selfie e veja 3 ensaios: Inspiracional, Casual e Aniversário Dourado"
                                        trialType="aniversario"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right: Before/After Showcase (Desktop) */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] group">
                                    <img src="/ensaios/selfie-birthday.png" alt="Selfie" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-[10px] font-black text-white/70 uppercase tracking-wider rounded-lg">📱 Selfie Original</span>
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-[0_8px_30px_rgba(236,72,153,0.2)] group mt-8">
                                    <img src="/ensaios/niche-birthday.png" alt="Ensaio IA" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-pink-500/90 text-[10px] font-black text-white uppercase tracking-wider rounded-lg">✨ Ensaio IA</span>
                                </div>
                            </div>
                            {/* More style previews */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {[
                                    { img: '/ensaios/bday-closeup-1.png', label: 'Close-up' },
                                    { img: '/ensaios/bday-closeup-2.png', label: 'Close-up' },
                                    { img: '/ensaios/bday-american-1.png', label: 'Plano Americano' },
                                    { img: '/ensaios/bday-american-2.png', label: 'Plano Americano' },
                                ].map((s, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                                        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <p className="absolute bottom-1 left-1 text-[8px] font-black text-white/80 uppercase">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            {/* Floating badge */}
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-pink-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-pink-400 text-xs font-black text-center">🎂 Cenários ilimitados + caixinha mágica</p>
                            </div>
                        </div>

                        {/* Mobile showcase (horizontal scroll) */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                <div className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/[0.02]">
                                    <div className="flex relative">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/selfie-birthday.png" alt="Selfie" className="w-full h-36 object-cover" />
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[8px] font-black text-white/60 uppercase rounded">Selfie</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/niche-birthday.png" alt="Ensaio" className="w-full h-36 object-cover" />
                                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-pink-500/90 text-[8px] font-black text-white uppercase rounded">IA ✨</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                            <ArrowRight size={10} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <p className="text-white/50 text-[10px] font-bold">Antes & Depois</p>
                                    </div>
                                </div>
                                {bdayStyles.slice(0, 6).map((s, i) => (
                                    <div key={i} className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                        <div className="relative aspect-[3/4]">
                                            <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <p className="absolute bottom-2 left-2 text-[9px] font-black text-white uppercase drop-shadow-lg">{s.label}</p>
                                            {s.hot && <span className="absolute top-2 right-2 px-1.5 py-0.5 bg-pink-500/90 text-[7px] font-black text-white rounded">🔥</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== VIDEO TUTORIAL ===== */}
            <section className="py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Play size={12} fill="currentColor" />
                            Veja na Prática
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Veja Como É <span className="text-pink-400">Simples</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Assista ao tutorial e veja como transformar uma selfie em um ensaio de aniversário profissional em poucos cliques.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.6)] bg-black max-w-sm w-full">
                            <video
                                ref={videoRef}
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="w-full aspect-[9/16] object-cover"
                            >
                                <source src="/lorena.mp4" type="video/mp4" />
                            </video>
                            <button
                                onClick={toggleMute}
                                className="absolute bottom-4 right-4 p-3 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 hover:bg-black/80 transition-all z-10"
                            >
                                {isMuted ? <VolumeX size={18} className="text-white/70" /> : <Volume2 size={18} className="text-white/70" />}
                            </button>
                            <div className="absolute top-4 left-4 px-3 py-1.5 bg-pink-500/20 backdrop-blur-sm border border-pink-500/30 rounded-full">
                                <span className="text-pink-400 text-[10px] font-black uppercase tracking-wider">🎂 Tutorial Aniversário</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            Super Simples
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            3 Cliques Para o Ensaio <span className="text-pink-400">Perfeito</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Sem estúdio, sem equipamento, sem saber IA. A plataforma faz tudo.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-pink-500/30 via-amber-500/30 to-green-500/30" />

                        {/* Step 1 */}
                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-pink-500/20 to-pink-600/5 border border-pink-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-black flex items-center justify-center shadow-[0_0_10px_rgba(236,72,153,0.5)]">1</div>
                                <Smartphone size={36} className="text-pink-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Envie a selfie</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Upload da foto do aniversariante. Pode ser uma selfie simples do celular.
                            </p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">2</div>
                                <Cake size={36} className="text-amber-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Escolha o cenário</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Luxo Dourado? Neon Glow? Pool Party? Ou peça qualquer cenário na caixinha mágica. Sem limites.
                            </p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-black text-sm font-black flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">3</div>
                                <Download size={36} className="text-green-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Baixe e encante</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                3 variações profissionais em 30 segundos. Baixe em HD e surpreenda o aniversariante!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== GALERIA DE ESTILOS ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-pink-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Palette size={12} />
                            Cenários Exclusivos
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            Cenários de <span className="text-pink-400">Aniversário</span> Sem Limite
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto">
                            Dezenas de cenários prontos + uma <strong className="text-white/60">caixinha mágica</strong> para criar o que quiser.
                            Descreva o cenário, a roupa, a decoração — ou suba uma foto de referência e a IA recria.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                        {bdayStyles.map((style, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer">
                                <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                {style.hot && (
                                    <span className="absolute top-2 right-2 px-2 py-0.5 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full text-[8px] font-black text-white shadow-lg">🔥</span>
                                )}
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white font-black text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TAMBÉM FAZ: TIKTOK ===== */}
            <section className="py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-cyan-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} />
                            Tendência
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Também Faz Ensaios <span className="text-cyan-400">TikTok</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Seus clientes de aniversário vão adorar ensaios virais para TikTok e Instagram. Ofereça como extra e aumente seu ticket!
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                        {[
                            { img: '/studio-styles/tiktok_party.png', label: 'TikTok Party' },
                            { img: '/studio-styles/tiktok_rooftop.png', label: 'Rooftop Sunset' },
                            { img: '/studio-styles/tiktok_cafe.png', label: 'Café Aesthetic' },
                            { img: '/studio-styles/tiktok_beach.png', label: 'Beach Vibes' },
                            { img: '/studio-styles/tiktok_ootd.png', label: 'OOTD' },
                            { img: '/studio-styles/tiktok_gym.png', label: 'Gym Fit' },
                            { img: '/studio-styles/tiktok_mirror.png', label: 'Mirror Selfie' },
                            { img: '/studio-styles/tiktok_festival.png', label: 'Festival' },
                            { img: '/studio-styles/tiktok_morning.png', label: 'Morning Glow' },
                            { img: '/studio-styles/tiktok_car.png', label: 'Car Lifestyle' },
                        ].map((style, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer">
                                <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white font-black text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== TAMBÉM FAZ: FAMÍLIA ===== */}
            <section className="py-20 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Heart size={12} />
                            Família & Casal
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Ensaios de <span className="text-amber-400">Família</span> e <span className="text-pink-400">Casal</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Após o aniversário, ofereça ensaios de família e casal! Clientes satisfeitos voltam para mais ensaios com pessoas queridas.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {[
                            { img: '/studio-styles/family_golden_hour.png', label: 'Golden Hour' },
                            { img: '/studio-styles/family_beach.png', label: 'Praia em Família' },
                            { img: '/studio-styles/family_studio_clean.png', label: 'Estúdio Clean' },
                            { img: '/studio-styles/family_picnic.png', label: 'Piquenique' },
                            { img: '/studio-styles/family_christmas.png', label: 'Natal em Família' },
                            { img: '/studio-styles/family_kitchen.png', label: 'Cozinha Gourmet' },
                            { img: '/studio-styles/family_lifestyle_home.png', label: 'Lifestyle Home' },
                            { img: '/studio-styles/bridal_luxury.png', label: 'Casal Luxury' },
                        ].map((style, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer">
                                <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white font-black text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-white/30 text-sm mb-4">São <strong className="text-white/60">+120 estilos</strong> disponíveis na plataforma</p>
                        <button
                            onClick={scrollToPricing}
                            className="px-8 py-3 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-xl font-black text-sm text-black uppercase tracking-wider hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-[1.02] transition-all inline-flex items-center gap-2"
                        >
                            Começar Agora
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== TAMBÉM FAZ: PERFIL PROFISSIONAL ===== */}
            <section className="py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Award size={12} />
                            Perfil Profissional
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Ensaios de <span className="text-blue-400">Perfil Profissional</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Além de aniversário, a mesma plataforma faz ensaios corporativos e profissionais.
                            Ofereça para médicos, advogados, coaches e executivos.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {[
                            { img: '/studio-styles/executivo_pro.png', label: 'Executivo' },
                            { img: '/studio-styles/advogado.png', label: 'Advogado' },
                            { img: '/studio-styles/medico_dentista.png', label: 'Médico' },
                            { img: '/studio-styles/coach_mentor.png', label: 'Coach' },
                            { img: '/studio-styles/professor.png', label: 'Professor' },
                            { img: '/studio-styles/arquiteto.png', label: 'Arquiteto' },
                        ].map((style, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group cursor-pointer">
                                <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2">
                                    <p className="text-white font-black text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-white/30 text-sm mb-4">Uma plataforma, <strong className="text-white/60">infinitas possibilidades</strong></p>
                        <button
                            onClick={scrollToPricing}
                            className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl font-black text-sm text-white uppercase tracking-wider hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-all inline-flex items-center gap-2"
                        >
                            Ver Todos os Estilos
                            <ArrowRight size={16} />
                        </button>
                    </div>
                </div>
            </section>


            {/* ===== 100% FIDELIDADE ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Before/After Identity showcase */}
                        <div className="flex justify-center gap-4 items-center">
                            <div className="relative">
                                <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg">
                                    <img src="/ensaios/selfie-birthday.png" alt="Selfie real" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 border border-white/10 rounded-full whitespace-nowrap">
                                    <span className="text-white/60 text-[9px] font-bold uppercase">📱 Foto real</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ArrowRight size={20} className="text-emerald-400" />
                                <span className="text-emerald-400 text-[8px] font-black uppercase">Mesmo rosto</span>
                            </div>
                            <div className="relative">
                                <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-emerald-500/40 shadow-[0_0_25px_rgba(52,211,153,0.15)]">
                                    <img src="/ensaios/niche-birthday.png" alt="Ensaio com mesmo rosto" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500/90 rounded-full whitespace-nowrap">
                                    <span className="text-white text-[9px] font-black uppercase">✨ Mesmo rosto, novo cenário</span>
                                </div>
                            </div>
                        </div>

                        {/* Right: Text */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/25 flex items-center justify-center">
                                    <Shield size={26} className="text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">100% Fidelidade</h3>
                                    <p className="text-emerald-400/60 text-xs font-bold uppercase tracking-wider">O rosto nunca muda</p>
                                </div>
                            </div>

                            <p className="text-white/50 text-base leading-relaxed mb-6">
                                Diferente de outras IAs que deformam o rosto, a LumiphotoIA usa tecnologia de <strong className="text-white/80">preservação de identidade</strong>. O rosto do aniversariante permanece <strong className="text-emerald-400">100% idêntico</strong> à selfie enviada.
                            </p>

                            <div className="space-y-3 mb-6">
                                {[
                                    'O rosto da pessoa é preservado com fidelidade total',
                                    'Mudamos apenas o cenário, roupa e iluminação',
                                    'Seus clientes vão se reconhecer na foto',
                                    'Resultado profissional sem distorções',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check size={16} className="text-emerald-400 flex-shrink-0" />
                                        <span className="text-white/60 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
                                <p className="text-emerald-400/80 text-xs font-bold">🔒 Identidade preservada: seus clientes vão se reconhecer em cada foto. É a mesma pessoa, em um cenário incrível.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PARA QUEM É ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-5xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Perfeito Para <span className="text-pink-400">Você</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[
                            { icon: Camera, title: 'Fotógrafos', desc: 'Ofereça ensaios de aniversário digitais como upsell', color: 'text-pink-400', bg: 'from-pink-500/20' },
                            { icon: Users, title: 'Mães & Pais', desc: 'Crie fotos incríveis dos filhos sem ir ao estúdio', color: 'text-amber-400', bg: 'from-amber-500/20' },
                            { icon: Gift, title: 'Festas & Eventos', desc: 'Surpreenda aniversariantes com fotos profissionais', color: 'text-purple-400', bg: 'from-purple-500/20' },
                            { icon: DollarSign, title: 'Empreendedores', desc: 'Venda ensaios de aniversário pelo Instagram e WhatsApp', color: 'text-emerald-400', bg: 'from-emerald-500/20' },
                        ].map((item, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/20 transition-all text-center">
                                <div className={`w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br ${item.bg} to-transparent border border-white/5 flex items-center justify-center mb-4`}>
                                    <item.icon size={24} className={item.color} />
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">{item.title}</h4>
                                <p className="text-white/30 text-xs">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== ZERO PROMPT ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            Você <span className="text-pink-400">Não</span> Precisa Saber Nada de IA
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto">
                            A LumiphotoIA elimina todas as barreiras. Sem prompts, sem inglês, sem curso.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
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
                                Na LumiphotoIA você só faz <strong className="text-pink-400">3 cliques</strong>:
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0">1</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Upload</strong> da selfie do aniversariante</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0">2</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Escolhe</strong> o cenário de aniversário</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-pink-500/10 border border-pink-500/20">
                                    <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0">✓</div>
                                    <span className="text-pink-400 text-sm font-bold">3 variações profissionais em 30 segundos</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/15">
                                <p className="text-amber-400/80 text-xs font-bold">💡 Sem prompt, sem inglês, sem tutorial. Se você sabe usar o WhatsApp, sabe usar a LumiphotoIA.</p>
                            </div>
                        </div>

                        {/* Style grid */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-[#0d0d0d] p-3">
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                {bdayStyles.slice(0, 12).map((style, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group">
                                        <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                                            <p className="text-white font-black text-[9px] md:text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-white/20 text-[10px] font-bold mt-3 uppercase tracking-widest">Cenários ilimitados de aniversário</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== CAIXINHA MÁGICA ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-gradient-to-br from-purple-500/5 to-transparent">
                            <div className="p-6 space-y-3">
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Quero mais balões coloridos no fundo"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-500/10 border border-pink-500/15 text-pink-400/80 text-sm max-w-[80%]">
                                        ✨ Pronto! Balões coloridos adicionados ao cenário.
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Coloca um bolo decorado na mesa"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-500/10 border border-pink-500/15 text-pink-400/80 text-sm max-w-[80%]">
                                        ✨ Feito! Bolo de aniversário decorado adicionado à composição.
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Agora muda a roupa para um vestido dourado"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-500/10 border border-pink-500/15 text-pink-400/80 text-sm max-w-[80%]">
                                        ✨ Vestido dourado aplicado mantendo a identidade do aniversariante.
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-purple-600/5 border border-purple-500/25 flex items-center justify-center">
                                    <MessageCircle size={26} className="text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">Caixinha Mágica</h3>
                                    <p className="text-purple-400/60 text-xs font-bold uppercase tracking-wider">Personalize tudo em português</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed mb-5">
                                Quer mais balões? Mudar a decoração? Trocar a roupa? É só <strong className="text-white/70">pedir em português</strong>, como se estivesse conversando com um expert em Photoshop.
                            </p>
                            <p className="text-white/70 text-base leading-relaxed mb-6">
                                Cada detalhe pode ser ajustado: <strong className="text-pink-400">cenário</strong>, <strong className="text-pink-400">decoração</strong>,{' '}
                                <strong className="text-pink-400">roupa</strong>, <strong className="text-pink-400">iluminação</strong> — tudo sem saber editar.
                            </p>

                            <div className="p-4 rounded-xl bg-purple-500/5 border border-purple-500/15">
                                <p className="text-purple-400/80 text-xs font-bold">🎯 Seus clientes vão pedir ajustes? Com a Caixinha Mágica você resolve em segundos.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing-section" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-white/5 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Cake size={12} />
                            Investimento
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                            Comece a Criar <span className="text-pink-400">Agora</span>
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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <div
                                key={i}
                                className={`relative rounded-2xl p-6 border transition-all duration-300 ${plan.popular
                                    ? 'bg-gradient-to-b from-pink-500/10 to-transparent border-pink-500/30 shadow-[0_0_40px_rgba(236,72,153,0.15)] scale-[1.02]'
                                    : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-500 to-rose-400 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
                                        ⭐ Mais Vendido
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className={`text-lg font-black ${plan.popular ? 'text-pink-400' : 'text-white/70'}`}>{plan.name}</h3>
                                    <div className="mt-3">
                                        <span className="text-4xl font-black text-white">R$ {plan.price}</span>
                                    </div>
                                    <p className="text-white/30 text-xs mt-1">{plan.credits} créditos • R$ {plan.perCredit}/foto</p>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {plan.features.map((f, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Check size={14} className={plan.popular ? 'text-pink-400 flex-shrink-0' : 'text-emerald-400 flex-shrink-0'} />
                                            <span className="text-white/50 text-xs">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={onGetStarted}
                                    className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${plan.popular
                                        ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-[1.02]'
                                        : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    Escolher {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-white/20 text-xs mt-8">
                        Pagamento seguro via Mercado Pago • Cartão, Pix ou Boleto
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
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-500/8 blur-[200px] rounded-full" />
                </div>

                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <p className="text-white/30 text-sm mb-6 uppercase tracking-widest font-bold">Aniversários acontecem todo dia</p>

                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6 leading-tight">
                        Cada aniversário é uma{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-300">
                            oportunidade
                        </span>
                    </h2>

                    <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                        Mães, debutantes, festas infantis, 30 anos, 50 anos... Milhares de aniversários acontecem todo dia. Cada um é um cliente potencial.
                    </p>

                    <div className="flex justify-center gap-4 mb-10">
                        <div className="w-32 h-40 rounded-xl overflow-hidden border border-white/10 relative">
                            <img src="/ensaios/selfie-birthday.png" alt="Antes" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-black/70 text-white text-[10px] font-bold py-1 text-center">SELFIE</div>
                        </div>
                        <div className="flex items-center">
                            <ArrowRight size={24} className="text-pink-500" />
                        </div>
                        <div className="w-32 h-40 rounded-xl overflow-hidden border-2 border-pink-500/40 relative shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                            <img src="/ensaios/niche-birthday.png" alt="Depois" className="w-full h-full object-cover" />
                            <div className="absolute bottom-0 inset-x-0 bg-pink-500 text-white text-[10px] font-black py-1 text-center">ENSAIO IA ✨</div>
                        </div>
                    </div>

                    <button
                        onClick={scrollToPricing}
                        className="px-12 py-5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_60px_rgba(236,72,153,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3 mb-6"
                    >
                        Quero Criar Ensaios de Aniversário
                        <ArrowRight size={22} />
                    </button>

                    <div className="flex flex-wrap justify-center gap-4 text-xs text-white/25">
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> Pagamento único</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> Sem mensalidade</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> Uso comercial liberado</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> Resultado em 30 segundos</span>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FAQSection extraFaqs={aniversarioFaqs} accentColor="pink" />

            {/* ===== MP CREDIBILITY BAR ===== */}
            <div className="border-t border-white/5 bg-[#050505] py-5 px-6">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00B1EA" stroke="none" /></svg>
                        <span className="text-white/40 text-[11px] font-bold">Mercado Pago</span>
                        <span className="text-white/20 text-[10px]">— Pagamento 100% Seguro</span>
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
