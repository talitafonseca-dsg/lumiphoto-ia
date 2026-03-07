
import React, { useState, useRef } from 'react';
import { Camera, Check, Star, Zap, Image as ImageIcon, Briefcase, Heart, Instagram, Sparkles, Layout, ShoppingBag, TrendingUp, Gift, Copy, Link2, Loader2, Linkedin, Flame, Eye, Users, ArrowRight, Shield } from 'lucide-react';
import FAQSection from './FAQSection';

interface SalesPageProps {
    onGetStarted: () => void;
    onViewStudio: () => void;
    onLogin: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {
    const [refEmail, setRefEmail] = useState('');
    const [refLink, setRefLink] = useState('');
    const [refLoading, setRefLoading] = useState(false);
    const [refCopied, setRefCopied] = useState(false);
    const [refError, setRefError] = useState<string | null>(null);
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const handleGenerateReferral = async () => {
        if (!refEmail || !refEmail.includes('@')) {
            setRefError('Por favor, insira um email válido');
            return;
        }
        setRefLoading(true);
        setRefError(null);
        try {
            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-referral`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: refEmail.toLowerCase().trim() }),
                }
            );
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Erro ao gerar link');
            }
            const data = await res.json();
            setRefLink(data.link);
        } catch (err: any) {
            setRefError(err.message || 'Erro ao gerar. Tente novamente.');
        } finally {
            setRefLoading(false);
        }
    };

    const handleCopyRef = () => {
        navigator.clipboard.writeText(refLink);
        setRefCopied(true);
        setTimeout(() => setRefCopied(false), 2000);
    };
    return (
        <div className="h-screen w-full bg-[#050505] text-white selection:bg-amber-500/30 overflow-y-auto overflow-x-hidden">
            {/* HEADER */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-2xl border-b border-white/[0.06]">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                        <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600 hidden md:block">
                            LUMIPHOTO<span className="text-white">IA</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            className="text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors hidden md:block"
                        >
                            Escolha o seu pacote
                        </button>
                        <button onClick={onLogin} className="px-5 py-2.5 rounded-full bg-white/[0.05] backdrop-blur-sm border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/[0.1] hover:border-white/20 transition-all duration-300">
                            Entrar
                        </button>
                        <button onClick={onViewStudio} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-black uppercase tracking-wider hover:shadow-[0_0_25px_rgba(245,158,11,0.5)] transition-all duration-300 transform hover:scale-105 active:scale-95">
                            Ver Studio
                        </button>
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto text-center relative z-10 space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] animate-fade-in-up">
                        <Star size={12} fill="currentColor" />
                        A Nova Era da Fotografia Pessoal
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 max-w-5xl mx-auto">
                        PARE DE USAR FOTOS&nbsp;AMADORAS. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600">TENHA RETRATOS PROFISSIONAIS COM&nbsp;IA&nbsp;EM&nbsp;SEGUNDOS.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
                        Sua melhor versão em fotos de estúdio ultra-realistas para LinkedIn, currículo, redes sociais ou momentos especiais — em apenas 1&nbsp;clique.
                    </p>
                    <p className="text-sm font-bold text-white/60 uppercase tracking-widest">
                        Sem estúdio. Sem complicação. Só resultado.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <button onClick={onGetStarted} className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_60px_rgba(245,158,11,0.5)] hover:-translate-y-1 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-3 group relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                            <Zap size={20} fill="currentColor" className="group-hover:scale-110 transition-transform relative z-10" />
                            <span className="relative z-10">Quero Minhas Fotos Agora</span>
                        </button>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-2 md:mt-0">
                            <span className="text-amber-500">★ 4.9/5</span> por mais de 2.000 profissionais
                        </p>
                    </div>
                </div>

                {/* HERO VIDEO */}
                <div className="mt-16 flex justify-center px-4">
                    <div className="relative w-full max-w-[340px] md:max-w-[380px]">
                        <div className="absolute -inset-2 bg-gradient-to-b from-amber-500/20 via-amber-500/10 to-transparent blur-2xl rounded-3xl pointer-events-none" />
                        <div className="relative rounded-[24px] overflow-hidden border-2 border-white/10 shadow-[0_20px_60px_rgba(245,158,11,0.15)]">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                loop
                                playsInline
                                preload="metadata"
                                poster="/lorena_poster.jpg"
                                className="w-full h-auto block"
                                style={{ aspectRatio: '9/16' }}
                            >
                                <source src="/lorena.mp4" type="video/mp4" />
                            </video>
                            <button
                                onClick={toggleMute}
                                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white hover:bg-black/80 hover:border-amber-500/40 transition-all duration-300 z-10"
                                aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
                            >
                                {isMuted ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
                                )}
                            </button>
                        </div>
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-black/70 backdrop-blur-xl rounded-full border border-amber-500/30 shadow-lg">
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 whitespace-nowrap">
                                ✨ Veja a mágica acontecer
                            </p>
                        </div>
                    </div>
                </div>

                {/* HERO GRID */}
                <div className="mt-20 max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 px-4 opacity-80 lg:opacity-100">
                    <div className="space-y-4 pt-12">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-v2-1.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-v2-2.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                    </div>
                    <div className="space-y-4">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-v2-3.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-v2-4.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                    </div>
                    <div className="space-y-4 pt-8 hidden md:block">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-new-1.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-new-2.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                    </div>
                    <div className="space-y-4 pt-20 hidden md:block">
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10"><img src="/showcase/home-new-3.jpg" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" /></div>
                        <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-zinc-900 flex items-center justify-center">
                            <div className="text-center p-6">
                                <p className="text-4xl font-black text-amber-500 mb-2">+50</p>
                                <p className="text-xs font-bold uppercase tracking-widest text-white/50">Estilos Disponíveis</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* SOCIAL PROOF - TESTIMONIALS */}
            <section className="py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                {/* Subtle background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Header */}
                    <div className="text-center mb-14 space-y-4">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Star size={12} />
                            Depoimentos Reais
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight">
                            Quem usou, <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">Aprovou</span>
                        </h2>
                        <p className="text-white/30 max-w-md mx-auto text-sm">
                            Veja o que nossos clientes estão dizendo sobre suas fotos profissionais com IA
                        </p>
                    </div>

                    {/* Testimonials Grid */}
                    <div className="flex gap-5 overflow-x-auto pb-4 md:pb-0 md:grid md:grid-cols-5 md:overflow-visible scrollbar-hide snap-x snap-mandatory">
                        {/* Testimonial 1 */}
                        <div className="min-w-[280px] md:min-w-0 snap-center flex flex-col bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/testimonials/dep-1.png" alt="Camila" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30" />
                                <div>
                                    <p className="text-white font-bold text-sm">Camila Souza</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Maquiadora Profissional</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-white/60 text-xs leading-relaxed flex-1">
                                "Fiz um ensaio profissional que custaria <span className="text-amber-400 font-bold">R$ 800+</span> por menos de R$ 40. As fotos ficaram tão reais que meus clientes perguntaram qual fotógrafo eu contratei!"
                            </p>
                            <p className="text-amber-500/50 text-[10px] mt-4 font-bold uppercase tracking-wider">Ensaio Executivo</p>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="min-w-[280px] md:min-w-0 snap-center flex flex-col bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/testimonials/dep-2.png" alt="Rafael" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30" />
                                <div>
                                    <p className="text-white font-bold text-sm">Rafael Mendes</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Personal Trainer</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-white/60 text-xs leading-relaxed flex-1">
                                "Usei para criar fotos pro meu Instagram de personal. Consegui <span className="text-amber-400 font-bold">47 novos seguidores</span> na primeira semana só com as fotos do studio. Qualidade absurda."
                            </p>
                            <p className="text-amber-500/50 text-[10px] mt-4 font-bold uppercase tracking-wider">Ensaio Fitness</p>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="min-w-[280px] md:min-w-0 snap-center flex flex-col bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/testimonials/dep-3.png" alt="Juliana" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30" />
                                <div>
                                    <p className="text-white font-bold text-sm">Juliana Costa</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Advogada</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-white/60 text-xs leading-relaxed flex-1">
                                "Precisava de fotos profissionais pro meu LinkedIn urgente. Em <span className="text-amber-400 font-bold">menos de 5 minutos</span> eu tinha 10 opções incríveis. Meu perfil nunca ficou tão profissional!"
                            </p>
                            <p className="text-amber-500/50 text-[10px] mt-4 font-bold uppercase tracking-wider">Foto Corporativa</p>
                        </div>

                        {/* Testimonial 4 */}
                        <div className="min-w-[280px] md:min-w-0 snap-center flex flex-col bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/testimonials/dep-4.png" alt="Lucas" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30" />
                                <div>
                                    <p className="text-white font-bold text-sm">Lucas Oliveira</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Designer Gráfico</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-white/60 text-xs leading-relaxed flex-1">
                                "Eu trabalho com design e sei o valor de uma boa foto. A Lumiphoto me impressionou — <span className="text-amber-400 font-bold">qualidade de estúdio real</span>. Já indiquei pra 5 clientes meus."
                            </p>
                            <p className="text-amber-500/50 text-[10px] mt-4 font-bold uppercase tracking-wider">Ensaio Criativo</p>
                        </div>

                        {/* Testimonial 5 */}
                        <div className="min-w-[280px] md:min-w-0 snap-center flex flex-col bg-white/[0.03] backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300">
                            <div className="flex items-center gap-3 mb-4">
                                <img src="/testimonials/dep-5.png" alt="Fernanda" className="w-12 h-12 rounded-full object-cover border-2 border-amber-500/30" />
                                <div>
                                    <p className="text-white font-bold text-sm">Fernanda Lima</p>
                                    <p className="text-white/30 text-[10px] uppercase tracking-wider">Empresária</p>
                                </div>
                            </div>
                            <div className="flex gap-0.5 mb-3">
                                {[...Array(5)].map((_, i) => <Star key={i} size={12} className="text-amber-400 fill-amber-400" />)}
                            </div>
                            <p className="text-white/60 text-xs leading-relaxed flex-1">
                                "Fiz fotos de aniversário que pareciam de estúdio profissional. Minha família inteira ficou chocada. Já fiz <span className="text-amber-400 font-bold">3 sessões diferentes</span> e todas ficaram perfeitas!"
                            </p>
                            <p className="text-amber-500/50 text-[10px] mt-4 font-bold uppercase tracking-wider">Ensaio Aniversário</p>
                        </div>
                    </div>

                    {/* Social proof counter */}
                    <div className="flex items-center justify-center gap-8 mt-12 pt-8 border-t border-white/5">
                        <div className="text-center">
                            <p className="text-2xl font-black text-amber-400">2.000+</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Fotos Geradas</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-amber-400">4.9</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Avaliação Média</p>
                        </div>
                        <div className="w-px h-10 bg-white/10" />
                        <div className="text-center">
                            <p className="text-2xl font-black text-amber-400">98%</p>
                            <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Satisfação</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PERSUASIVE - PROBLEM / SOLUTION */}
            <section className="py-24 relative overflow-hidden">
                {/* Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0808] to-[#050505]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[150px]" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    {/* Opening Copy - Pain Point */}
                    <div className="text-center mb-16 space-y-6 max-w-3xl mx-auto">
                        <p className="text-red-400/80 text-base md:text-lg font-medium italic leading-relaxed max-w-2xl mx-auto">
                            "Você sabe que sua foto de perfil tá fraca. Aquela selfie no LinkedIn tá afastando oportunidades. Mas agendar um fotógrafo custa caro, exige tempo e você ainda precisa aparecer no estúdio..."
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            Chega de <span className="text-red-400 line-through decoration-red-500/50">fotos amadoras</span> que sabotam <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">sua&nbsp;imagem&nbsp;profissional</span>
                        </h2>
                    </div>

                    {/* 2-Column: Problem vs Solution */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* PROBLEM */}
                        <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 space-y-5">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center">
                                    <span className="text-lg">😩</span>
                                </div>
                                <h3 className="text-red-400 font-black uppercase tracking-wider text-sm">O Problema</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400/50 mt-0.5">✕</span>
                                    <p className="text-white/50 text-sm">Fotógrafo profissional custa <span className="text-red-400 font-bold">R$ 500 a R$ 2.000</span> por sessão</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400/50 mt-0.5">✕</span>
                                    <p className="text-white/50 text-sm">Agendar, se deslocar e esperar dias pelas fotos editadas</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400/50 mt-0.5">✕</span>
                                    <p className="text-white/50 text-sm">Selfie no celular = imagem amadora que não transmite autoridade</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-red-400/50 mt-0.5">✕</span>
                                    <p className="text-white/50 text-sm">Perde clientes, oportunidades e credibilidade por causa de uma foto ruim</p>
                                </li>
                            </ul>
                        </div>

                        {/* SOLUTION */}
                        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-3xl p-8 space-y-5 relative">
                            <div className="absolute -top-3 right-6 px-4 py-1 bg-amber-500 rounded-full text-[10px] font-black uppercase text-black tracking-wider">
                                A Solução
                            </div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                                    <img src="/logo-gold.png" alt="LumiphotoIA" className="h-7 w-7 object-contain" />
                                </div>
                                <h3 className="text-emerald-400 font-black uppercase tracking-wider text-sm">LumiphotoIA</h3>
                            </div>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-white/70 text-sm">Fotos com qualidade de estúdio por <span className="text-emerald-400 font-bold">a partir de R$ 3,70 cada</span></p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-white/70 text-sm"><span className="text-amber-400 font-bold">Pronto em segundos</span> — sem agendar, sem sair de casa</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-white/70 text-sm">+50 estilos profissionais: executivo, fitness, aniversário, moda e mais</p>
                                </li>
                                <li className="flex items-start gap-3">
                                    <Check size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                                    <p className="text-white/70 text-sm">Seu rosto, sua identidade — a IA preserva <span className="text-amber-400 font-bold">100% das suas feições</span></p>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Target Audience */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-10">
                        <p className="text-center text-white/30 text-[10px] font-black uppercase tracking-[0.3em] mb-8">Feito para quem precisa de resultado</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                            <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                                <Briefcase size={18} className="text-amber-400 shrink-0" />
                                <p className="text-white/60 text-xs">Profissionais liberais que querem atualizar o LinkedIn</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                                <TrendingUp size={18} className="text-amber-400 shrink-0" />
                                <p className="text-white/60 text-xs">Empreendedores e coaches que precisam de fotos para tráfego pago</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                                <Instagram size={18} className="text-amber-400 shrink-0" />
                                <p className="text-white/60 text-xs">Quem quer renovar o feed do Instagram com conteúdo profissional</p>
                            </div>
                            <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl px-4 py-3 border border-white/5">
                                <Zap size={18} className="text-amber-400 shrink-0" />
                                <p className="text-white/60 text-xs">Quem não tem tempo ou dinheiro para contratar um fotógrafo</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <button onClick={onGetStarted} className="px-10 py-4 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase tracking-[0.2em] text-sm rounded-xl hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all">
                            Quero Minhas Fotos Profissionais →
                        </button>
                        <p className="text-white/20 text-xs mt-4">3 poucos cliques. Resultado em segundos. Sem compromisso.</p>
                    </div>
                </div>
            </section>

            {/* TRANSFORMATION SHOWCASE */}
            <section className="py-24 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505] border-t border-white/5 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>
                <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-amber-600/5 blur-[150px] rounded-full pointer-events-none -translate-y-1/2"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Camera size={12} />
                            Seu Rosto, Sua Identidade
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-tight">
                            Não Mudamos Seu Rosto.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600">Criamos Seu Ensaio.</span>
                        </h2>
                        <p className="text-white/50 max-w-2xl mx-auto text-lg leading-relaxed">
                            A mesma pessoa. O mesmo sorriso. A mesma essência. <br className="hidden md:block" />
                            Apenas agora em <span className="text-amber-400 font-semibold">cenários profissionais incríveis</span>.
                        </p>
                    </div>

                    {/* Before & After Visual */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: "Before" - Simple Photo */}
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-transparent blur-xl opacity-50 group-hover:opacity-75 transition-opacity rounded-3xl"></div>
                            <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-white/10 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                        <Camera size={20} className="text-white/60" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-white/40">Antes</p>
                                        <p className="text-sm font-semibold text-white">Sua Foto Comum</p>
                                    </div>
                                </div>
                                <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-800 border border-white/5">
                                    <img
                                        src="/showcase-original.jpg"
                                        alt="Foto simples antes"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <p className="text-center text-white/30 text-xs mt-4 uppercase tracking-widest">Selfie casual do dia a dia</p>
                            </div>
                        </div>

                        {/* Right: "After" - Professional Results */}
                        <div className="relative">
                            <div className="absolute -inset-1 bg-gradient-to-l from-amber-500/30 to-transparent blur-xl opacity-60 rounded-3xl"></div>
                            <div className="relative bg-zinc-900/80 backdrop-blur-sm rounded-3xl border border-amber-500/30 p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                        <Star size={20} className="text-amber-500 fill-current" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold uppercase tracking-widest text-amber-400">Depois</p>
                                        <p className="text-sm font-semibold text-white">Ensaio Profissional com IA</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img loading="lazy" src="/showcase-result-1.jpg" alt="Resultado 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img loading="lazy" src="/showcase-result-2.jpg" alt="Resultado 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img loading="lazy" src="/showcase-result-3.jpg" alt="Resultado 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img loading="lazy" src="/showcase-result-4.jpg" alt="Resultado 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img loading="lazy" src="/showcase-result-5.jpg" alt="Resultado 5" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img loading="lazy" src="/showcase-result-6.jpg" alt="Resultado 6" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <p className="text-center text-amber-400/80 text-xs mt-4 uppercase tracking-widest font-bold">6 Variações Profissionais Geradas</p>
                            </div>
                        </div>
                    </div>

                    {/* Trust badges */}
                    <div className="mt-16 flex flex-wrap justify-center gap-x-8 gap-y-4 text-white/40 text-xs uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Check size={14} className="text-amber-500" />
                            <span>Mesmo Rosto</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check size={14} className="text-amber-500" />
                            <span>Mesma Essência</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check size={14} className="text-amber-500" />
                            <span>Alta Definição</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Check size={14} className="text-amber-500" />
                            <span>Pronto em Segundos</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== LINKEDIN PROFESSIONAL PHOTO BLOCK ==================== */}
            <section className="py-24 bg-gradient-to-b from-[#050505] via-[#040810] to-[#050505] border-t border-white/5 relative overflow-hidden">
                {/* Background glows */}
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/8 blur-[180px] rounded-full pointer-events-none"></div>
                <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-400/5 blur-[150px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#0A66C2]/15 border border-[#0A66C2]/30 text-[#70B5F9] text-[10px] font-black uppercase tracking-[0.25em]">
                            <Linkedin size={13} />
                            Perfil Profissional
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-tight">
                            Sua Foto Define<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#70B5F9] via-[#0A66C2] to-[#004182]">Quem Te Contrata.</span>
                        </h2>
                        <p className="text-white/45 max-w-2xl mx-auto text-lg leading-relaxed">
                            Recrutadores levam <span className="text-[#70B5F9] font-bold">7 segundos</span> para formar uma primeira impressão.
                            Sua foto é a diferença entre ser chamado para a entrevista ou ser ignorado.
                        </p>
                    </div>

                    {/* Main Content - Two Cards */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">

                        {/* ❌ SELFIE CARD */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500/20 to-red-900/10 blur-lg opacity-40 group-hover:opacity-60 transition-opacity rounded-3xl"></div>
                            <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-red-500/15 p-8 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                        <span className="text-2xl">❌</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-red-400/80">Perfil com Selfie</p>
                                        <p className="text-sm text-white/50">O que os recrutadores veem</p>
                                    </div>
                                </div>

                                {/* Fake LinkedIn Profile Preview */}
                                <div className="rounded-2xl bg-zinc-800/80 border border-white/5 overflow-hidden mb-6 flex-1">
                                    <div className="h-16 bg-gradient-to-r from-zinc-700 to-zinc-800"></div>
                                    <div className="px-5 pb-5 -mt-8">
                                        <div className="w-24 h-24 rounded-full border-2 border-zinc-800 overflow-hidden mb-3">
                                            <img src="/linkedin-selfie.png" alt="Selfie casual" className="w-full h-full object-cover" />
                                        </div>
                                        <p className="text-white/80 text-sm font-semibold">Maria Silva</p>
                                        <p className="text-white/30 text-xs mb-3">Profissional de Marketing</p>
                                        <div className="flex items-center gap-4 text-[10px] text-white/20 uppercase tracking-wider">
                                            <span>12 conexões</span>
                                            <span>0 visualizações</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-red-400">3x</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-1">menos cliques</p>
                                    </div>
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-red-400">-70%</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-1">credibilidade</p>
                                    </div>
                                    <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-red-400">0</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-1">convites</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ✅ PROFESSIONAL CARD */}
                        <div className="relative group">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A66C2]/30 to-blue-400/15 blur-lg opacity-50 group-hover:opacity-80 transition-opacity rounded-3xl"></div>
                            <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl border border-[#0A66C2]/30 p-8 h-full flex flex-col">
                                {/* Header */}
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-12 h-12 rounded-2xl bg-[#0A66C2]/15 border border-[#0A66C2]/30 flex items-center justify-center">
                                        <span className="text-2xl">✅</span>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#70B5F9]">Perfil com Foto Profissional</p>
                                        <p className="text-sm text-white/50">Como os recrutadores te veem</p>
                                    </div>
                                </div>

                                {/* Fake LinkedIn Profile Preview - Professional */}
                                <div className="rounded-2xl bg-zinc-800/80 border border-[#0A66C2]/20 overflow-hidden mb-6 flex-1 shadow-[0_0_30px_rgba(10,102,194,0.1)]">
                                    <div className="h-16 bg-gradient-to-r from-[#0A66C2]/40 to-[#004182]/30"></div>
                                    <div className="px-5 pb-5 -mt-8">
                                        <div className="w-24 h-24 rounded-full border-2 border-zinc-800 overflow-hidden mb-3 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                                            <img src="/linkedin-professional.png" alt="Foto profissional" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="text-white text-sm font-bold">Maria Silva</p>
                                            <span className="px-1.5 py-0.5 bg-[#0A66C2] text-[8px] rounded font-bold text-white">IN</span>
                                        </div>
                                        <p className="text-white/50 text-xs mb-3">Gerente de Marketing Digital | MBA</p>
                                        <div className="flex items-center gap-4 text-[10px] uppercase tracking-wider">
                                            <span className="text-[#70B5F9]">500+ conexões</span>
                                            <span className="text-green-400">42 visualizações esta semana</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-[#70B5F9]">14x</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-1">mais cliques</p>
                                    </div>
                                    <div className="bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-[#70B5F9]">+300%</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-1">credibilidade</p>
                                    </div>
                                    <div className="bg-[#0A66C2]/10 border border-[#0A66C2]/20 rounded-xl p-3 text-center">
                                        <p className="text-lg font-black text-[#70B5F9]">21x</p>
                                        <p className="text-[9px] text-white/30 uppercase tracking-wider mt-1">convites</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Quote */}
                    <div className="mt-16 text-center">
                        <div className="inline-flex flex-col items-center gap-4 max-w-xl">
                            <div className="flex items-center gap-2 text-white/20 text-xs uppercase tracking-[0.2em]">
                                <Eye size={14} className="text-[#0A66C2]" />
                                <span>Dados LinkedIn 2024</span>
                            </div>
                            <p className="text-white/60 text-lg leading-relaxed italic">
                                "Perfis com foto profissional recebem <span className="text-[#70B5F9] font-bold not-italic">21x mais visualizações</span> e <span className="text-[#70B5F9] font-bold not-italic">9x mais solicitações de conexão</span>."
                            </p>
                            <button onClick={onGetStarted} className="mt-4 px-8 py-3 bg-gradient-to-r from-[#0A66C2] to-[#004182] text-white font-bold uppercase tracking-[0.15em] text-xs rounded-xl hover:shadow-[0_0_30px_rgba(10,102,194,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                                <Briefcase size={14} />
                                Criar Minha Foto Profissional
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ==================== TIKTOK VIRAL PHOTO BLOCK ==================== */}
            <section className="py-24 bg-gradient-to-b from-[#050505] via-[#0a0508] to-[#050505] border-t border-white/5 relative overflow-hidden">
                {/* Animated background glows */}
                <div className="absolute top-1/3 left-0 w-[350px] h-[350px] bg-pink-500/8 blur-[150px] rounded-full pointer-events-none" style={{ animation: 'pulse 4s ease-in-out infinite' }}></div>
                <div className="absolute bottom-1/3 right-0 w-[350px] h-[350px] bg-cyan-400/6 blur-[150px] rounded-full pointer-events-none" style={{ animation: 'pulse 4s ease-in-out infinite 2s' }}></div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-pink-500/5 via-transparent to-transparent blur-[80px] pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16 space-y-6">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.25em]" style={{ background: 'linear-gradient(135deg, rgba(254,44,85,0.15), rgba(0,242,234,0.1))', borderColor: 'rgba(254,44,85,0.3)', color: '#FE2C55' }}>
                            <Flame size={13} />
                            TikTok Viral
                            <span className="ml-1 px-2 py-0.5 bg-gradient-to-r from-[#FE2C55] to-[#FF0050] text-white text-[8px] font-black rounded-full animate-pulse">QUENTE</span>
                        </div>
                        <h2 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase text-white tracking-tight leading-tight">
                            Fotos Que Parecem<br />
                            <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #FE2C55, #FF7849, #00F2EA)' }}>Naturais. Não Geradas.</span>
                        </h2>
                        <p className="text-white/45 max-w-2xl mx-auto text-lg leading-relaxed">
                            A tendência que está <span className="font-bold" style={{ color: '#FE2C55' }}>explodindo no TikTok</span>: ensaios com IA que parecem
                            fotos reais do dia a dia. Sem filtro, sem pose. Só você sendo você.
                        </p>
                    </div>

                    {/* Photo Grid - Dynamic Layout */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5 max-w-5xl mx-auto">
                        {/* Photo 1 - Mirror Selfie */}
                        <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/5 hover:border-pink-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(254,44,85,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <img loading="lazy" src="/tiktok-mirror.png" alt="Selfie no espelho" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 z-20">
                                <p className="text-white/90 text-xs font-bold">📱 Mirror Selfie</p>
                                <p className="text-white/40 text-[10px]">Estilo natural</p>
                            </div>
                            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[9px] text-white/70 flex items-center gap-1">
                                <Eye size={9} /> 2.4M
                            </div>
                        </div>

                        {/* Photo 2 - Beach - Taller */}
                        <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] md:aspect-[3/5] bg-zinc-800 border border-white/5 hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,242,234,0.15)] md:row-span-2">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <img loading="lazy" src="/tiktok-beach.png" alt="Na praia" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 z-20">
                                <p className="text-white/90 text-xs font-bold">🌊 Golden Hour</p>
                                <p className="text-white/40 text-[10px]">Praia aesthetic</p>
                            </div>
                            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[9px] text-white/70 flex items-center gap-1">
                                <Flame size={9} className="text-orange-400" /> Viral
                            </div>
                        </div>

                        {/* Photo 3 - Party */}
                        <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/5 hover:border-purple-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(168,85,247,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <img loading="lazy" src="/tiktok-party.png" alt="Na festa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 z-20">
                                <p className="text-white/90 text-xs font-bold">🎉 Na Festa</p>
                                <p className="text-white/40 text-[10px]">Good vibes</p>
                            </div>
                            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[9px] text-white/70 flex items-center gap-1">
                                <Eye size={9} /> 1.8M
                            </div>
                        </div>

                        {/* Photo 4 - Car */}
                        <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/5 hover:border-amber-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <img loading="lazy" src="/tiktok-car.png" alt="No carro" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 z-20">
                                <p className="text-white/90 text-xs font-bold">🚗 No Carro</p>
                                <p className="text-white/40 text-[10px]">Sunset drive</p>
                            </div>
                            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[9px] text-white/70 flex items-center gap-1">
                                <Eye size={9} /> 980K
                            </div>
                        </div>

                        {/* Photo 5 - Coffee */}
                        <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/5 hover:border-pink-500/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(254,44,85,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <img loading="lazy" src="/tiktok-coffee.png" alt="Café" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 z-20">
                                <p className="text-white/90 text-xs font-bold">☕ Coffee Vibes</p>
                                <p className="text-white/40 text-[10px]">Cozy moment</p>
                            </div>
                            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[9px] text-white/70 flex items-center gap-1">
                                <Eye size={9} /> 1.2M
                            </div>
                        </div>

                        {/* Photo 6 - Home */}
                        <div className="relative group rounded-2xl overflow-hidden aspect-[3/4] bg-zinc-800 border border-white/5 hover:border-cyan-400/30 transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_8px_30px_rgba(0,242,234,0.15)]">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                            <img loading="lazy" src="/tiktok-home.png" alt="Em casa" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute bottom-3 left-3 z-20">
                                <p className="text-white/90 text-xs font-bold">🏠 Em Casa</p>
                                <p className="text-white/40 text-[10px]">Casual chic</p>
                            </div>
                            <div className="absolute top-3 right-3 z-20 px-2 py-1 bg-black/50 backdrop-blur-sm rounded-full text-[9px] text-white/70 flex items-center gap-1">
                                <Flame size={9} className="text-orange-400" /> Trend
                            </div>
                        </div>
                    </div>

                    {/* Trending Tags */}
                    <div className="mt-12 flex flex-wrap justify-center gap-3">
                        {['#FotoComIA', '#EnsaioNatural', '#TikTokBrasil', '#ViralTrend', '#SelfiePerfeita', '#FYP'].map((tag) => (
                            <span key={tag} className="px-4 py-2 rounded-full text-xs font-bold border transition-all duration-300 hover:scale-105 cursor-default" style={{ background: 'linear-gradient(135deg, rgba(254,44,85,0.08), rgba(0,242,234,0.05))', borderColor: 'rgba(254,44,85,0.15)', color: 'rgba(254,44,85,0.7)' }}>
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-12 text-center">
                        <button onClick={onGetStarted} className="px-10 py-4 font-black uppercase tracking-[0.2em] text-sm rounded-xl hover:scale-105 active:scale-95 transition-all text-white flex items-center gap-3 mx-auto" style={{ background: 'linear-gradient(135deg, #FE2C55, #FF7849)', boxShadow: '0 0 30px rgba(254,44,85,0.3)' }}>
                            <Flame size={16} />
                            Criar Minhas Fotos Virais
                            <ArrowRight size={16} />
                        </button>
                        <p className="text-white/20 text-xs mt-4">🔥 +5.000 fotos virais criadas esta semana</p>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">Como Funciona</h2>
                        <p className="text-white/40 max-w-xl mx-auto">Tecnologia avançada, simplificada para você. Três passos simples separam você da sua melhor versão.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                        {/* Step 1 */}
                        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.08)] transition-all duration-500 group overflow-hidden flex flex-col relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="aspect-[4/3] overflow-hidden bg-zinc-900/50 flex items-center justify-center p-0 relative z-10">
                                <img loading="lazy" src="/step-1-upload.png" alt="Envie sua foto" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-lg shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">1</div>
                                    <h3 className="text-base md:text-lg font-black uppercase">Envie sua Foto</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">Tire uma selfie simples ou envie uma foto da galeria. Sem maquiagem.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.08)] transition-all duration-500 group overflow-hidden flex flex-col relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="aspect-[4/3] overflow-hidden bg-zinc-900/50 flex items-center justify-center p-4 relative z-10">
                                <img loading="lazy" src="/step-2-styles.png" alt="Escolha o estilo" className="w-auto h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-lg shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">2</div>
                                    <h3 className="text-base md:text-lg font-black uppercase">Escolha o Estilo</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">Dezenas de estilos: Executivo, Moda, Fitness, Casual e mais.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-3xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/30 hover:shadow-[0_8px_32px_rgba(245,158,11,0.08)] transition-all duration-500 group overflow-hidden flex flex-col relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="aspect-[4/3] overflow-hidden bg-zinc-900/50 flex items-center justify-center p-2 relative z-10">
                                <img loading="lazy" src="/step-3-results.png" alt="Receba em segundos" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col relative z-10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 flex items-center justify-center text-black font-black text-lg shrink-0 shadow-[0_0_15px_rgba(245,158,11,0.3)]">3</div>
                                    <h3 className="text-base md:text-lg font-black uppercase">Receba em Segundos</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">Em alguns segundos, sua galeria em alta definição.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ADVERTISING / RESULTS SHOWCASE */}
            <section className="py-24 bg-[#050505] relative overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[100px] rounded-full pointer-events-none"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                <Sparkles size={12} fill="currentColor" />
                                Qualidade de Estúdio
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                                Resultados que <span className="text-amber-500">Impressionam</span>
                            </h2>
                            <p className="text-white/60 text-lg leading-relaxed">
                                Nossos modelos de IA são treinados por fotógrafos profissionais para garantir iluminação, composição e texturas realistas.
                                Sem aparência de "boneco de cera". Você no seu melhor ângulo, sempre.
                            </p>

                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check size={14} strokeWidth={3} /></div>
                                    <span className="font-medium">Resolução 4K Ultra HD</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check size={14} strokeWidth={3} /></div>
                                    <span className="font-medium">Iluminação de Estúdio Profissional</span>
                                </li>
                                <li className="flex items-center gap-3 text-white/80">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500"><Check size={14} strokeWidth={3} /></div>
                                    <span className="font-medium">Preservação da Identidade Facial</span>
                                </li>
                            </ul>

                            <div className="pt-4">
                                <button onClick={onGetStarted} className="px-8 py-4 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/20 text-white font-black uppercase tracking-widest hover:bg-white/[0.15] hover:border-amber-500/40 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all duration-300">
                                    Ver Meus Resultados
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <img loading="lazy" src="/showcase/results-1.jpg" className="rounded-2xl shadow-2xl border border-white/10 translate-y-8" />
                                <img loading="lazy" src="/showcase/results-2.jpg" className="rounded-2xl shadow-2xl border border-white/10" />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/60 backdrop-blur-2xl border border-white/10 p-5 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] text-center">
                                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">100%</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Satisfação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* === RESTAURAÇÃO DE FOTOS ANTIGAS === */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                {/* Background Effects */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            Novo Recurso
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight leading-tight mb-6">
                            Restaure Fotos <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">Antigas</span>
                        </h2>
                        <p className="text-white/50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Dê vida nova a memórias perdidas no tempo. Nossa IA restaura, melhora a qualidade e até coloriza fotografias antigas, danificadas ou desbotadas.
                        </p>
                    </div>

                    {/* Before/After Showcase */}
                    <div className="max-w-4xl mx-auto">
                        <div className="relative group rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_60px_rgba(245,158,11,0.08)]">
                            {/* Single split image with perfectly aligned before/after */}
                            <img
                                src="/restore-split.png"
                                className="w-full h-auto object-cover"
                                alt="Restauração de foto antiga - antes e depois"
                            />

                            {/* Labels */}
                            <div className="absolute top-6 left-6 px-4 py-2 bg-black/70 backdrop-blur-xl rounded-xl border border-white/20">
                                <span className="text-[11px] font-black uppercase tracking-widest text-white/80">📷 Antes</span>
                            </div>
                            <div className="absolute top-6 right-6 px-4 py-2 bg-amber-500/90 backdrop-blur-xl rounded-xl border border-amber-400/40">
                                <span className="text-[11px] font-black uppercase tracking-widest text-black">✨ Depois</span>
                            </div>

                            {/* Center divider glow line */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[2px] h-full bg-gradient-to-b from-amber-400/0 via-amber-400 to-amber-400/0 shadow-[0_0_15px_rgba(245,158,11,0.6)]"></div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-4xl mx-auto">
                        <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all">
                            <div className="text-3xl mb-3">🔧</div>
                            <h3 className="text-white font-bold text-sm mb-2">Restauração Total</h3>
                            <p className="text-white/40 text-xs leading-relaxed">Remove arranhões, manchas, rasgos e desbotamento de fotos antigas</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all">
                            <div className="text-3xl mb-3">🎨</div>
                            <h3 className="text-white font-bold text-sm mb-2">Colorização Inteligente</h3>
                            <p className="text-white/40 text-xs leading-relaxed">Transforma fotos preto e branco em cores naturais e realistas</p>
                        </div>
                        <div className="text-center p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all">
                            <div className="text-3xl mb-3">👴</div>
                            <h3 className="text-white font-bold text-sm mb-2">Preservação de Identidade</h3>
                            <p className="text-white/40 text-xs leading-relaxed">Mantém as feições exatas da pessoa, respeitando a memória original</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center mt-12">
                        <button onClick={onGetStarted} className="px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-black uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(245,158,11,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                            Restaurar Minha Foto Agora
                        </button>
                    </div>
                </div>
            </section>

            {/* === ENSAIO POLÍTICO === */}
            <section className="py-24 bg-[#060606] border-t border-white/5 relative overflow-hidden">
                {/* Background with Brazilian colors glow */}
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-green-600/5 blur-[150px] rounded-full pointer-events-none"></div>
                    <div className="absolute top-1/3 right-0 w-[600px] h-[600px] bg-yellow-500/5 blur-[150px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-1/3 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            Ensaio Político com IA
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-tight leading-tight mb-6">
                            Sua Imagem de{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-yellow-400 to-blue-400">
                                Campanha
                            </span>
                        </h2>
                        <p className="text-white/50 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
                            Transforme uma simples foto em um ensaio profissional de campanha política.
                            Com bandeira, fundo colorido e iluminação de estúdio — tudo com IA.
                        </p>
                    </div>

                    {/* Before/After Hero */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-0 relative">
                            {/* BEFORE */}
                            <div className="relative group">
                                <div className="relative overflow-hidden rounded-t-3xl md:rounded-l-3xl md:rounded-tr-none border border-white/10">
                                    <img
                                        src="/politico-before.png"
                                        className="w-full aspect-[3/4] object-cover brightness-90"
                                        alt="Foto casual antes"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30"></div>
                                    {/* Before Label */}
                                    <div className="absolute top-5 left-5 px-4 py-2 bg-red-500/80 backdrop-blur-xl rounded-lg">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white">📱 Selfie Casual</span>
                                    </div>
                                    {/* Issues list */}
                                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                        <div className="flex items-center gap-2 text-white/70 text-xs">
                                            <span className="text-red-400">✕</span> Iluminação ruim
                                        </div>
                                        <div className="flex items-center gap-2 text-white/70 text-xs">
                                            <span className="text-red-400">✕</span> Fundo bagunçado
                                        </div>
                                        <div className="flex items-center gap-2 text-white/70 text-xs">
                                            <span className="text-red-400">✕</span> Sem identidade visual
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Arrow / Transformation indicator */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 hidden md:flex">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)] border-4 border-black">
                                    <Zap size={24} className="text-black" fill="black" />
                                </div>
                            </div>

                            {/* AFTER */}
                            <div className="relative group">
                                <div className="relative overflow-hidden rounded-b-3xl md:rounded-r-3xl md:rounded-bl-none border border-white/10 border-t-0 md:border-t md:border-l-0">
                                    <img
                                        src="/politico-flag.png"
                                        className="w-full aspect-[3/4] object-cover"
                                        alt="Ensaio político profissional"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                                    {/* After Label */}
                                    <div className="absolute top-5 right-5 px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 backdrop-blur-xl rounded-lg">
                                        <span className="text-[11px] font-black uppercase tracking-widest text-white">✨ Ensaio IA</span>
                                    </div>
                                    {/* Quality list */}
                                    <div className="absolute bottom-6 left-6 right-6 space-y-2">
                                        <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                                            <span className="text-green-400">✓</span> Iluminação de estúdio
                                        </div>
                                        <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                                            <span className="text-green-400">✓</span> Bandeira do Brasil
                                        </div>
                                        <div className="flex items-center gap-2 text-white/90 text-xs font-medium">
                                            <span className="text-green-400">✓</span> Imagem profissional
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Variant Gallery */}
                    <div className="max-w-5xl mx-auto mb-16">
                        <h3 className="text-center text-white/40 text-xs font-black uppercase tracking-[0.3em] mb-8">
                            4 estilos disponíveis para sua campanha
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                { src: '/politico-flag.png', label: 'Bandeira', color: 'from-green-500/30 to-green-900/30', border: 'border-green-500/30' },
                                { src: '/politico-blue.png', label: 'Comício', color: 'from-blue-500/30 to-blue-900/30', border: 'border-blue-500/30' },
                                { src: '/politico-yellow.png', label: 'Gabinete', color: 'from-yellow-500/30 to-yellow-900/30', border: 'border-yellow-500/30' },
                                { src: '/politico-before.png', label: 'Campanha', color: 'from-amber-500/30 to-amber-900/30', border: 'border-amber-500/30' },
                            ].map((item, i) => (
                                <div key={i} className={`relative rounded-2xl overflow-hidden border ${item.border} group hover:scale-[1.03] transition-all duration-300`}>
                                    <img src={item.src} className="w-full aspect-[3/4] object-cover group-hover:brightness-110 transition-all" />
                                    <div className={`absolute inset-0 bg-gradient-to-t ${item.color} to-transparent`}></div>
                                    <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/60 backdrop-blur-xl rounded-lg">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">{item.label}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats Bar */}
                    <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 mb-12">
                        <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-green-500/5 to-transparent border border-green-500/10">
                            <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-300">4</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Estilos de Ensaio</p>
                        </div>
                        <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-yellow-500/5 to-transparent border border-yellow-500/10">
                            <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-300">30s</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Tempo de Criação</p>
                        </div>
                        <div className="text-center p-5 rounded-2xl bg-gradient-to-b from-blue-500/5 to-transparent border border-blue-500/10">
                            <p className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">4K</p>
                            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-1">Resolução HD</p>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <button onClick={onGetStarted} className="px-10 py-4 rounded-xl bg-gradient-to-r from-green-500 via-yellow-500 to-blue-500 text-black font-black uppercase tracking-widest text-sm hover:shadow-[0_0_40px_rgba(34,197,94,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300">
                            Criar Meu Ensaio Político
                        </button>
                        <p className="text-white/20 text-xs mt-4">Resultados em segundos • Sem fotógrafo • Sem estúdio</p>
                    </div>
                </div>
            </section>

            {/* VIDEO TUTORIAL & PROMO - HIDDEN until video content is ready */}
            {false && (
                <section className="py-24 bg-[#080808] border-t border-white/5 relative overflow-hidden">
                    {/* Background Ambience */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

                    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} />
                            Veja a Mágica Acontecer
                        </div>

                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-8">
                            Transforme suas fotos <br />
                            <span className="text-amber-500">Em Segundos</span>
                        </h2>

                        <p className="text-white/40 max-w-2xl mx-auto mb-12 text-lg">
                            Assista ao vídeo e veja como é simples criar fotos profissionais com nossa inteligência artificial. Sem complicação, resultado de estúdio.
                        </p>

                        {/* Video Placeholder */}
                        <div className="max-w-4xl mx-auto aspect-video bg-zinc-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative group mb-12">
                            {/* Placeholder Content - You can replace the src with your actual video or keep the placeholder */}
                            <img
                                src="https://images.unsplash.com/photo-1626544827763-d516dce335ca?q=80&w=1200&auto=format&fit=crop"
                                className="w-full h-full object-cover opacity-50 group-hover:scale-105 transition-transform duration-700"
                                alt="Video Thumbnail"
                            />

                            {/* Play Button Overlay */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 bg-amber-500 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.5)] group-hover:scale-110 transition-transform cursor-pointer">
                                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[18px] border-l-black border-b-[10px] border-b-transparent ml-1"></div>
                                </div>
                            </div>

                            {/* Optional: Actual Video Tag (Commenting out for now until you have the URL) */}
                            {/* 
                        <video 
                            controls 
                            className="absolute inset-0 w-full h-full object-cover"
                            poster="/video-poster.jpg"
                        >
                            <source src="/promo-video.mp4" type="video/mp4" />
                        </video> 
                        */}
                        </div>

                        <button
                            onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 bg-gradient-to-r from-amber-600 to-amber-500 text-white font-black uppercase tracking-widest rounded-xl hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95"
                        >
                            Comprar Créditos e Começar
                        </button>
                    </div>
                </section>
            )}



            {/* USE CASES */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/60 text-[10px] font-black uppercase tracking-[0.2em]">
                                Para quem é?
                            </div>
                            <h2 className="text-4xl md:text-5xl font-black uppercase text-white leading-tight">Para todos os <span className="text-amber-500">objetivos e sonhos.</span></h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0"><Heart size={20} className="text-amber-500" /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Casal, Família & Pessoal</h4>
                                        <p className="text-sm text-white/40">Ensaios de casal, família ou individuais com qualidade de estúdio. Perfeito para redes sociais, presentes e recordações.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0"><Briefcase size={20} className="text-amber-500" /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Carreira & Executivos</h4>
                                        <p className="text-sm text-white/40">Melhore seu perfil profissional e passe credibilidade imediata no LinkedIn e currículos.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0"><ShoppingBag size={20} className="text-amber-500" /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Produtos & E-commerce</h4>
                                        <p className="text-sm text-white/40">Crie fotos profissionais interagindo com seus produtos. Ideal para lojistas e marcas.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0"><TrendingUp size={20} className="text-amber-500" /></div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Fotógrafos & Empreendedores</h4>
                                        <p className="text-sm text-white/40">Para quem quer trabalhar com IA ou monetizar vendendo serviços de fotos digitais.</p>
                                    </div>
                                </div>
                            </div>
                            <button onClick={onGetStarted} className="px-8 py-4 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-amber-400 transition-colors">
                                Começar Agora
                            </button>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>


                            {/* Actual Implementation of the cleaner 3-column masonry idea */}
                            <div className="grid grid-cols-2 md:grid-cols-12 gap-4 relative z-10">
                                {/* Column 1 */}
                                <div className="col-span-4 pt-8">
                                    <img loading="lazy" src="/use-case-couple.png" className="w-full h-full object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
                                </div>
                                {/* Column 2 - Center focused */}
                                <div className="col-span-4 space-y-4">
                                    <img loading="lazy" src="/use-case-3.png" className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500" />
                                    <img loading="lazy" src="/use-case-5.jpg" className="w-full aspect-square object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
                                </div>
                                {/* Column 3 */}
                                <div className="col-span-4 space-y-4 pt-12">
                                    <img loading="lazy" src="/use-case-4.jpg" className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
                                    {/* Decoration box */}
                                    <div className="p-6 bg-zinc-900/80 backdrop-blur border border-amber-500/20 rounded-2xl shadow-xl">
                                        <p className="text-amber-500 font-black text-2xl">100%</p>
                                        <p className="text-white/60 text-xs uppercase tracking-widest">IA</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING / CREDITS */}
            <section id="pricing" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Zap size={12} fill="currentColor" />
                            Pacotes de Créditos
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                            Escolha Seu <span className="text-amber-500">Pacote</span>
                        </h2>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                                <Check size={12} strokeWidth={3} /> Pagamento único
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
                                <Shield size={12} /> Sem mensalidade
                            </span>
                        </div>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Compre créditos e use quando quiser. Não é assinatura, não renova automaticamente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Starter */}
                        <div className="group p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06] hover:shadow-[0_8px_32px_rgba(245,158,11,0.1)] transition-all duration-500 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🚀</span>
                                    <h3 className="text-lg font-bold text-white">Starter</h3>
                                </div>
                                <p className="text-4xl font-black text-white mb-1">R$ 37<span className="text-lg font-normal text-white/40">,00</span></p>
                                <p className="text-sm text-amber-400 font-bold mb-2">10 Fotos</p>
                                <p className="text-xs text-white/40 mb-6">R$ 3,70 por foto</p>
                                <button onClick={onGetStarted} className="mt-auto w-full py-3.5 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/10 text-white font-bold text-sm hover:bg-white/[0.15] hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] active:scale-[0.98] transition-all duration-300">
                                    Comprar
                                </button>
                            </div>
                        </div>

                        {/* Essencial */}
                        <div className="group p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06] hover:shadow-[0_8px_32px_rgba(245,158,11,0.1)] transition-all duration-500 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-black text-emerald-400">
                                -49%/foto
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">🌟</span>
                                    <h3 className="text-lg font-bold text-white">Essencial</h3>
                                </div>
                                <p className="text-4xl font-black text-white mb-1">R$ 57<span className="text-lg font-normal text-white/40">,00</span></p>
                                <p className="text-sm text-amber-400 font-bold mb-2">30 Fotos</p>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-xs text-white/20 line-through">R$ 3,70</span>
                                    <span className="text-xs font-bold text-emerald-400">R$ 1,90 por foto</span>
                                </div>
                                <button onClick={onGetStarted} className="mt-auto w-full py-3.5 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/10 text-white font-bold text-sm hover:bg-white/[0.15] hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] active:scale-[0.98] transition-all duration-300">
                                    Comprar
                                </button>
                            </div>
                        </div>

                        {/* Pro - Popular */}
                        <div className="group p-6 rounded-2xl bg-gradient-to-b from-amber-500/[0.08] to-white/[0.02] backdrop-blur-xl border-2 border-amber-500/40 hover:border-amber-400/60 shadow-[0_0_40px_rgba(245,158,11,0.12)] hover:shadow-[0_0_60px_rgba(245,158,11,0.25)] transition-all duration-500 flex flex-col relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.05] via-transparent to-amber-500/[0.02] pointer-events-none" />
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full text-[10px] font-black uppercase text-black shadow-[0_0_20px_rgba(245,158,11,0.4)]">
                                ⭐ Melhor Custo-Benefício
                            </div>
                            <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-black text-emerald-400">
                                -67%/foto
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4 mt-2">
                                    <span className="text-xl">🔥</span>
                                    <h3 className="text-lg font-bold text-white">Pro</h3>
                                </div>
                                <p className="text-4xl font-black text-white mb-1">R$ 97<span className="text-lg font-normal text-white/40">,00</span></p>
                                <p className="text-sm text-amber-400 font-bold mb-2">80 Fotos</p>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-xs text-white/20 line-through">R$ 3,70</span>
                                    <span className="text-xs font-bold text-emerald-400">R$ 1,21 por foto</span>
                                </div>
                                <button onClick={onGetStarted} className="mt-auto w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-bold text-sm hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] hover:from-amber-400 hover:to-yellow-300 active:scale-[0.98] transition-all duration-300">
                                    Comprar Agora
                                </button>
                            </div>
                        </div>

                        {/* Premium */}
                        <div className="group p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-amber-500/40 hover:bg-white/[0.06] hover:shadow-[0_8px_32px_rgba(245,158,11,0.1)] transition-all duration-500 flex flex-col relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
                            <div className="absolute top-4 right-4 px-2.5 py-1 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-black text-emerald-400">
                                -68%/foto
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="text-xl">👑</span>
                                    <h3 className="text-lg font-bold text-white">Premium</h3>
                                </div>
                                <p className="text-4xl font-black text-white mb-1">R$ 117<span className="text-lg font-normal text-white/40">,00</span></p>
                                <p className="text-sm text-amber-400 font-bold mb-2">100 Fotos</p>
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-xs text-white/20 line-through">R$ 3,70</span>
                                    <span className="text-xs font-bold text-emerald-400">R$ 1,17 por foto</span>
                                </div>
                                <button onClick={onGetStarted} className="mt-auto w-full py-3.5 rounded-xl bg-white/[0.08] backdrop-blur-sm border border-white/10 text-white font-bold text-sm hover:bg-white/[0.15] hover:border-amber-500/30 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] active:scale-[0.98] transition-all duration-300">
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* No-subscription reinforcement */}
                    <p className="text-center text-white/25 text-xs mt-8">
                        ✅ Pagamento único • Sem assinatura • Sem renovação automática • Use seus créditos quando quiser
                    </p>
                </div>
            </section>

            {/* REFERRAL PROGRAM SECTION */}
            <section className="py-28 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#041f1a] to-[#0a0a0a]" />

                {/* Animated glows */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[200px]" />
                <div className="absolute top-0 left-0 w-[300px] h-[300px] bg-emerald-400/5 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-green-400/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />

                <div className="max-w-5xl mx-auto px-6 relative z-10">

                    {/* ===== HERO PRIZE CARD ===== */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.25em] mb-8">
                            <Gift size={13} />
                            Programa de Indicação
                        </div>

                        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black uppercase text-white tracking-tight mb-6 leading-[0.9]">
                            Indique.<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-emerald-500" style={{ WebkitTextStroke: '0' }}>Ganhe Fotos.</span>
                        </h2>
                    </div>

                    {/* ===== GLOWING PRIZE SPOTLIGHT ===== */}
                    <div className="relative max-w-md mx-auto mb-20">
                        {/* Outer glow ring */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/40 via-green-300/20 to-emerald-500/40 rounded-[32px] blur-xl opacity-60 animate-pulse" />
                        <div className="absolute -inset-1 bg-gradient-to-r from-emerald-400/60 via-green-300/40 to-emerald-400/60 rounded-3xl blur-sm" />

                        <div className="relative bg-gradient-to-br from-[#0d2818] via-[#0a1f14] to-[#0d2818] rounded-3xl p-8 md:p-10 border border-emerald-400/30 text-center overflow-hidden">
                            {/* Sparkle decorations */}
                            <div className="absolute top-4 left-6 text-emerald-400/40 animate-pulse">✦</div>
                            <div className="absolute top-8 right-8 text-green-300/30 animate-pulse" style={{ animationDelay: '0.5s' }}>✦</div>
                            <div className="absolute bottom-6 left-10 text-emerald-300/25 animate-pulse" style={{ animationDelay: '1s' }}>✦</div>
                            <div className="absolute bottom-4 right-6 text-green-400/35 animate-pulse" style={{ animationDelay: '1.5s' }}>✦</div>

                            {/* Gift icon */}
                            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-emerald-500/30 to-green-600/20 border border-emerald-400/30 flex items-center justify-center mb-5 shadow-[0_0_40px_rgba(52,211,153,0.2)]">
                                <span className="text-4xl">🎁</span>
                            </div>

                            <p className="text-emerald-400/70 text-xs font-black uppercase tracking-[0.3em] mb-2">Sua recompensa por indicação</p>

                            <div className="relative inline-block mb-4">
                                <p className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-300 leading-none">+3</p>
                            </div>

                            <p className="text-white text-xl md:text-2xl font-black uppercase tracking-wide mb-2">Fotos Profissionais</p>
                            <p className="text-emerald-400/60 text-sm font-medium">grátis para cada amigo que comprar</p>

                            {/* Value badge */}
                            <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <span className="text-emerald-300 text-xs font-bold">💰 Economia de até R$29,90 por indicação</span>
                            </div>
                        </div>
                    </div>

                    {/* ===== HOW IT WORKS - 3 STEPS ===== */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 mb-16 relative">
                        {/* Connecting line (desktop only) */}
                        <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px bg-gradient-to-r from-emerald-500/30 via-amber-500/30 to-green-500/30" />

                        {/* Step 1 */}
                        <div className="relative text-center group">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 border border-emerald-500/25 flex items-center justify-center mb-5 group-hover:shadow-[0_0_30px_rgba(52,211,153,0.15)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-black text-xs font-black flex items-center justify-center shadow-[0_0_10px_rgba(52,211,153,0.5)]">1</div>
                                <Link2 size={28} className="text-emerald-400" />
                            </div>
                            <p className="text-white font-bold text-base mb-2">Gere seu link</p>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[200px] mx-auto">Coloque seu email e receba um link exclusivo de indicação</p>
                        </div>

                        {/* Step 2 */}
                        <div className="relative text-center group">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 flex items-center justify-center mb-5 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-amber-500 text-black text-xs font-black flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.5)]">2</div>
                                <Instagram size={28} className="text-amber-400" />
                            </div>
                            <p className="text-white font-bold text-base mb-2">Compartilhe</p>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[200px] mx-auto">Envie para amigos no WhatsApp, Instagram ou qualquer rede</p>
                        </div>

                        {/* Step 3 */}
                        <div className="relative text-center group">
                            <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/25 flex items-center justify-center mb-5 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.15)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-green-500 text-black text-xs font-black flex items-center justify-center shadow-[0_0_10px_rgba(34,197,94,0.5)]">3</div>
                                <Camera size={28} className="text-green-400" />
                            </div>
                            <p className="text-white font-bold text-base mb-2">Ganhe fotos grátis!</p>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[200px] mx-auto">Receba <span className="text-emerald-400 font-bold">+3 fotos profissionais</span> automaticamente</p>
                        </div>
                    </div>

                    {/* ===== FORM CARD ===== */}
                    <div className="relative max-w-xl mx-auto">
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/40 via-green-400/25 to-emerald-500/40 rounded-2xl blur-sm" />

                        <div className="relative bg-zinc-900/95 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-emerald-500/20">
                            {!refLink ? (
                                <div className="space-y-4">
                                    <p className="text-center text-white/60 text-sm mb-2">Insira seu email para gerar seu link exclusivo 👇</p>
                                    <div className="flex flex-col sm:flex-row gap-3">
                                        <input
                                            type="email"
                                            value={refEmail}
                                            onChange={(e) => setRefEmail(e.target.value)}
                                            placeholder="Seu melhor email"
                                            className="flex-1 px-5 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder:text-white/30 text-base"
                                            onKeyDown={(e) => e.key === 'Enter' && handleGenerateReferral()}
                                        />
                                        <button
                                            onClick={handleGenerateReferral}
                                            disabled={refLoading}
                                            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl font-black text-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(52,211,153,0.35)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 whitespace-nowrap"
                                        >
                                            {refLoading ? (
                                                <Loader2 size={20} className="animate-spin" />
                                            ) : (
                                                <>
                                                    <Gift size={18} />
                                                    Gerar Meu Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    {refError && (
                                        <p className="text-red-400 text-sm text-center">{refError}</p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles size={14} className="text-emerald-400" />
                                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                ✅ Seu link está pronto!
                                            </span>
                                        </div>
                                        <div className="bg-black/40 rounded-lg p-4 flex items-center gap-3">
                                            <code className="text-white/80 text-sm flex-1 break-all">{refLink}</code>
                                            <button
                                                onClick={handleCopyRef}
                                                className="shrink-0 p-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                                            >
                                                {refCopied ? (
                                                    <Check size={18} className="text-emerald-400" />
                                                ) : (
                                                    <Copy size={18} className="text-emerald-400" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleCopyRef}
                                        className="w-full py-4 bg-gradient-to-r from-emerald-500 to-green-400 rounded-xl font-black text-black uppercase tracking-wider flex items-center justify-center gap-2 hover:shadow-[0_0_40px_rgba(52,211,153,0.35)] hover:scale-[1.02] active:scale-95 transition-all text-base"
                                    >
                                        <Copy size={20} />
                                        {refCopied ? 'Link Copiado! ✓' : 'Copiar Link de Indicação'}
                                    </button>
                                </div>
                            )}

                            {/* Trust badges */}
                            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-6 text-white/25 text-[10px] uppercase tracking-widest">
                                <span className="flex items-center gap-1.5"><Check size={10} className="text-emerald-500" /> Link único</span>
                                <span className="flex items-center gap-1.5"><Check size={10} className="text-emerald-500" /> Recompensa automática</span>
                                <span className="flex items-center gap-1.5"><Check size={10} className="text-emerald-500" /> Sem limite de indicações</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FAQSection accentColor="amber" />

            {/* FOOTER - CREDIBILITY */}
            <footer className="border-t border-white/5 bg-[#030303]">
                {/* Trust Bar */}
                <div className="border-b border-white/5 py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                            {/* Security Shield */}
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Compra Segura</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">Ambiente 100% protegido</p>
                                </div>
                            </div>

                            {/* SSL */}
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Certificado SSL</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">Dados criptografados</p>
                                </div>
                            </div>

                            {/* Privacy */}
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Privacidade</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">Suas fotos são suas</p>
                                </div>
                            </div>

                            {/* Satisfaction */}
                            <div className="flex flex-col items-center text-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-white/80 uppercase tracking-wider">Satisfação</p>
                                    <p className="text-[10px] text-white/30 mt-0.5">+10.000 clientes satisfeitos</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="border-b border-white/5 py-8">
                    <div className="max-w-7xl mx-auto px-6">
                        <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Formas de Pagamento</p>
                        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                            {/* PIX */}
                            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:border-white/20 transition-colors">
                                <img src="/pix-logo.svg" alt="PIX" className="w-5 h-5 object-contain" />
                                <span className="text-xs font-bold text-white/70">PIX</span>
                            </div>

                            {/* Visa */}
                            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:border-white/20 transition-colors">
                                <svg width="32" height="20" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#1A1F71" /><path d="M19.5 21.5h-3.3l2.1-13h3.3l-2.1 13zm13.8-12.7c-.7-.3-1.7-.5-3-.5-3.3 0-5.6 1.8-5.6 4.3 0 1.9 1.7 2.9 2.9 3.5 1.3.6 1.7 1 1.7 1.6 0 .9-1 1.3-2 1.3-1.3 0-2-.2-3.1-.7l-.4-.2-.5 2.8c.8.4 2.2.7 3.7.7 3.5 0 5.8-1.7 5.8-4.4 0-1.5-.9-2.6-2.8-3.5-1.2-.6-1.9-1-1.9-1.6 0-.5.6-1.1 1.9-1.1 1.1 0 1.9.2 2.5.5l.3.1.5-2.8zm8.6-.3h-2.6c-.8 0-1.4.2-1.7 1l-4.9 11.7h3.5l.7-1.9h4.2l.4 1.9h3.1l-2.7-12.7zm-4.1 8.2l1.7-4.7.5 2.3.6 2.4h-2.8zM16 8.5L12.7 17l-.4-1.8c-.6-2.1-2.6-4.4-4.8-5.5l3 11.3h3.5l5.2-12.5H16z" fill="white" /><path d="M9.5 8.5H4.1l-.1.3C8 9.8 10.7 12.3 11.6 15.2l-1-5c-.2-.8-.7-1.6-1.1-1.7z" fill="#F7A600" /></svg>
                                <span className="text-xs font-bold text-white/70">Visa</span>
                            </div>

                            {/* Mastercard */}
                            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:border-white/20 transition-colors">
                                <svg width="32" height="20" viewBox="0 0 48 32" fill="none"><rect width="48" height="32" rx="4" fill="#252525" /><circle cx="19" cy="16" r="8" fill="#EB001B" /><circle cx="29" cy="16" r="8" fill="#F79E1B" /><path d="M24 10.3a8 8 0 0 1 0 11.4 8 8 0 0 1 0-11.4z" fill="#FF5F00" /></svg>
                                <span className="text-xs font-bold text-white/70">Mastercard</span>
                            </div>

                            {/* Boleto */}
                            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:border-white/20 transition-colors">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><rect x="2" y="4" width="20" height="16" rx="2" /><line x1="6" y1="8" x2="6" y2="16" /><line x1="10" y1="8" x2="10" y2="16" /><line x1="14" y1="8" x2="14" y2="16" /><line x1="18" y1="8" x2="18" y2="16" /></svg>
                                <span className="text-xs font-bold text-white/70">Boleto</span>
                            </div>

                            {/* Elo */}
                            <div className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg flex items-center gap-2 hover:border-white/20 transition-colors">
                                <div className="w-8 h-5 bg-gradient-to-r from-yellow-400 via-red-500 to-blue-600 rounded text-[8px] font-black text-white flex items-center justify-center">ELO</div>
                                <span className="text-xs font-bold text-white/70">Elo</span>
                            </div>
                        </div>

                        {/* Mercado Pago Badge - Official Logo */}
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <div className="px-5 py-2.5 bg-[#00b1ea]/10 border border-[#00b1ea]/20 rounded-xl flex items-center gap-3">
                                <div className="w-7 h-7 rounded-lg bg-[#00b1ea] flex items-center justify-center flex-shrink-0">
                                    <span className="text-white text-sm">🤝</span>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-[#00b1ea]">Mercado Pago</p>
                                    <p className="text-[9px] text-white/30">Pagamento processado com segurança</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Footer Content */}
                <div className="py-10">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                            {/* Brand */}
                            <div className="space-y-4">
                                <img src="/logo-gold.png" alt="LumiphotoIA" className="h-10 w-auto object-contain" />
                                <p className="text-sm text-white/30 leading-relaxed max-w-xs">
                                    Transforme suas selfies em fotos profissionais de estúdio com inteligência artificial avançada.
                                </p>
                                <div className="flex items-center gap-1 text-amber-500">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} size={14} fill="currentColor" />
                                    ))}
                                    <span className="text-xs text-white/40 ml-2">4.9/5 (2.000+ avaliações)</span>
                                </div>
                            </div>

                            {/* Links */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Links Úteis</h4>
                                <ul className="space-y-2">
                                    <li><button onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-white/30 hover:text-amber-400 transition-colors">Planos e Preços</button></li>
                                    <li><a href="mailto:suporte@lumiphotoia.online" className="text-sm text-white/30 hover:text-amber-400 transition-colors">Suporte</a></li>
                                    <li><span className="text-sm text-white/30">Política de Privacidade</span></li>
                                    <li><span className="text-sm text-white/30">Termos de Uso</span></li>
                                </ul>
                            </div>

                            {/* Contact & Guarantees */}
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-white/50">Garantias</h4>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-white/30">Pagamento 100% seguro</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-white/30">Suporte por email</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-white/30">Acesso imediato após pagamento</span>
                                    </li>
                                    <li className="flex items-center gap-2">
                                        <Check size={14} className="text-green-500 flex-shrink-0" />
                                        <span className="text-sm text-white/30">Fotos em alta resolução 4K</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/5 py-6">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-white/15 text-[10px] uppercase tracking-widest text-center md:text-left">
                            © {new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.
                        </p>
                        <div className="flex items-center gap-4 text-white/15 text-[10px]">
                            <span>suporte@lumiphotoia.online</span>
                            <span className="hidden md:inline">•</span>
                            <span className="hidden md:inline">www.lumiphotoia.online</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};
