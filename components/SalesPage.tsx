
import React, { useState } from 'react';
import { Camera, Check, Star, Zap, Image as ImageIcon, Briefcase, Heart, Instagram, Sparkles, Layout, ShoppingBag, TrendingUp, Gift, Copy, Link2, Loader2 } from 'lucide-react';

interface SalesPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onGetStarted, onLogin }) => {
    const [refEmail, setRefEmail] = useState('');
    const [refLink, setRefLink] = useState('');
    const [refLoading, setRefLoading] = useState(false);
    const [refCopied, setRefCopied] = useState(false);
    const [refError, setRefError] = useState<string | null>(null);

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
            <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
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
                        <button onClick={onLogin} className="px-5 py-2.5 rounded-full border border-white/20 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all">
                            Entrar
                        </button>
                        <button onClick={onGetStarted} className="px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 text-white text-xs font-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all transform hover:scale-105 active:scale-95">
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

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 max-w-5xl mx-auto">
                        SUA IMAGEM PROFISSIONAL, <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-600">REINVENTADA PELA IA.</span>
                    </h1>

                    <p className="text-lg md:text-xl text-white/40 max-w-2xl mx-auto leading-relaxed">
                        Sem fotógrafo. Sem estúdio. Sem agendamento. Transforme suas selfies simples em retratos de estúdio de alta qualidade em segundos.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
                        <button onClick={onGetStarted} className="w-full md:w-auto px-10 py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 text-white font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(245,158,11,0.3)] hover:shadow-[0_20px_50px_rgba(245,158,11,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 group">
                            <Zap size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
                            Quero Minhas Fotos Agora
                        </button>
                        <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold mt-2 md:mt-0">
                            <span className="text-amber-500">★ 4.9/5</span> por mais de 10.000 profissionais
                        </p>
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
                            <p className="text-2xl font-black text-amber-400">10.000+</p>
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
                        <p className="text-red-400/80 text-sm font-medium italic">
                            "Você sabe que sua foto de perfil tá fraca. Aquela selfie no LinkedIn tá afastando oportunidades. Mas agendar um fotógrafo custa caro, exige tempo e você ainda precisa aparecer no estúdio..."
                        </p>
                        <h2 className="text-3xl md:text-5xl font-black text-white leading-tight">
                            Chega de <span className="text-red-400 line-through decoration-red-500/50">fotos amadoras</span> que sabotam
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">sua imagem profissional</span>
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
                                    <span className="text-lg">⚡</span>
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
                                        <img src="/showcase-result-1.jpg" alt="Resultado 1" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img src="/showcase-result-2.jpg" alt="Resultado 2" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img src="/showcase-result-3.jpg" alt="Resultado 3" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-3 mt-3">
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img src="/showcase-result-4.jpg" alt="Resultado 4" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img src="/showcase-result-5.jpg" alt="Resultado 5" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                    </div>
                                    <div className="aspect-[4/5] rounded-xl overflow-hidden bg-zinc-800 border border-amber-500/20 shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                                        <img src="/showcase-result-6.jpg" alt="Resultado 6" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
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
                            <span>Pronto em Minutos</span>
                        </div>
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
                        <div className="rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-500 group overflow-hidden flex flex-col">
                            <div className="aspect-[4/3] overflow-hidden bg-zinc-900 flex items-center justify-center p-0">
                                <img src="/step-1-upload.png" alt="Envie sua foto" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-lg shrink-0">1</div>
                                    <h3 className="text-base md:text-lg font-black uppercase">Envie sua Foto</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">Tire uma selfie simples ou envie uma foto da galeria. Sem maquiagem.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-500 group overflow-hidden flex flex-col">
                            <div className="aspect-[4/3] overflow-hidden bg-zinc-900 flex items-center justify-center p-4">
                                <img src="/step-2-styles.png" alt="Escolha o estilo" className="w-auto h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-lg shrink-0">2</div>
                                    <h3 className="text-base md:text-lg font-black uppercase">Escolha o Estilo</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">Dezenas de estilos: Executivo, Moda, Fitness, Casual e mais.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="rounded-3xl bg-white/5 border border-white/5 hover:border-amber-500/30 transition-all duration-500 group overflow-hidden flex flex-col">
                            <div className="aspect-[4/3] overflow-hidden bg-zinc-900 flex items-center justify-center p-2">
                                <img src="/step-3-results.png" alt="Receba em minutos" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 rounded-xl" />
                            </div>
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-black font-black text-lg shrink-0">3</div>
                                    <h3 className="text-base md:text-lg font-black uppercase">Receba em Minutos</h3>
                                </div>
                                <p className="text-white/40 text-sm leading-relaxed">Em menos de 10 minutos, sua galeria em alta definição.</p>
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
                                <button onClick={onGetStarted} className="px-8 py-4 rounded-xl bg-white text-black font-black uppercase tracking-widest hover:bg-amber-400 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    Ver Meus Resultados
                                </button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="grid grid-cols-2 gap-4">
                                <img src="/showcase/results-1.jpg" className="rounded-2xl shadow-2xl border border-white/10 translate-y-8" />
                                <img src="/showcase/results-2.jpg" className="rounded-2xl shadow-2xl border border-white/10" />
                            </div>
                            {/* Floating Badge */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl text-center">
                                <p className="text-3xl font-black text-amber-500">100%</p>
                                <p className="text-[10px] uppercase tracking-widest text-white/60 font-bold">Satisfação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* VIDEO TUTORIAL & PROMO */}
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
                                        <h4 className="font-bold text-lg mb-1">Uso Pessoal & Autoestima</h4>
                                        <p className="text-sm text-white/40">Desde uma foto bonita para o perfil até renovar a autoestima. Perfeito para redes sociais e apps de namoro.</p>
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
                                <div className="col-span-4 space-y-4 pt-8">
                                    <img src="/use-case-1.png" className="w-full aspect-video object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
                                    <img src="/use-case-2.jpg" className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
                                </div>
                                {/* Column 2 - Center focused */}
                                <div className="col-span-4 space-y-4">
                                    <img src="/use-case-3.png" className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 shadow-2xl hover:scale-105 transition-transform duration-500" />
                                    <img src="/use-case-5.jpg" className="w-full aspect-square object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
                                </div>
                                {/* Column 3 */}
                                <div className="col-span-4 space-y-4 pt-12">
                                    <img src="/use-case-4.jpg" className="w-full aspect-[3/4] object-cover rounded-2xl border border-white/10 shadow-lg hover:scale-105 transition-transform duration-500" />
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
                        <p className="text-white/40 max-w-xl mx-auto">
                            Sem mensalidade. Compre créditos e use quando quiser.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Starter */}
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">🚀</span>
                                <h3 className="text-lg font-bold text-white">Starter</h3>
                            </div>
                            <p className="text-4xl font-black text-white mb-1">R$ 37<span className="text-lg font-normal text-white/40">,00</span></p>
                            <p className="text-sm text-amber-400 font-bold mb-4">10 Fotos</p>
                            <p className="text-xs text-white/30 mb-6">R$ 3,70 por foto</p>
                            <button onClick={onGetStarted} className="mt-auto w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors">
                                Comprar
                            </button>
                        </div>

                        {/* Essencial */}
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">✨</span>
                                <h3 className="text-lg font-bold text-white">Essencial</h3>
                            </div>
                            <p className="text-4xl font-black text-white mb-1">R$ 57<span className="text-lg font-normal text-white/40">,00</span></p>
                            <p className="text-sm text-amber-400 font-bold mb-4">30 Fotos</p>
                            <p className="text-xs text-white/30 mb-6">R$ 1,90 por foto</p>
                            <button onClick={onGetStarted} className="mt-auto w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors">
                                Comprar
                            </button>
                        </div>

                        {/* Pro - Popular */}
                        <div className="p-6 rounded-2xl bg-gradient-to-b from-amber-500/10 to-zinc-900/50 border-2 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.15)] transition-all duration-300 flex flex-col relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-500 rounded-full text-[10px] font-black uppercase text-black">
                                Mais Popular
                            </div>
                            <div className="flex items-center gap-2 mb-4 mt-2">
                                <span className="text-xl">🔥</span>
                                <h3 className="text-lg font-bold text-white">Pro</h3>
                            </div>
                            <p className="text-4xl font-black text-white mb-1">R$ 97<span className="text-lg font-normal text-white/40">,00</span></p>
                            <p className="text-sm text-amber-400 font-bold mb-4">80 Fotos</p>
                            <p className="text-xs text-white/30 mb-6">R$ 1,21 por foto</p>
                            <button onClick={onGetStarted} className="mt-auto w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-bold text-sm hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">
                                Comprar Agora
                            </button>
                        </div>

                        {/* Premium */}
                        <div className="p-6 rounded-2xl bg-zinc-900/50 border border-white/10 hover:border-amber-500/30 transition-all duration-300 flex flex-col">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-xl">👑</span>
                                <h3 className="text-lg font-bold text-white">Premium</h3>
                            </div>
                            <p className="text-4xl font-black text-white mb-1">R$ 117<span className="text-lg font-normal text-white/40">,00</span></p>
                            <p className="text-sm text-amber-400 font-bold mb-4">100 Fotos</p>
                            <p className="text-xs text-white/30 mb-6">R$ 1,17 por foto</p>
                            <button onClick={onGetStarted} className="mt-auto w-full py-3 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-colors">
                                Comprar
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* REFERRAL PROGRAM SECTION */}
            <section className="py-24 relative overflow-hidden">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-emerald-950/20 to-[#0a0a0a]" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                {/* Glowing orbs */}
                <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-amber-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />

                <div className="max-w-4xl mx-auto px-6 relative z-10">
                    {/* Badge */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Gift size={12} />
                            Programa de Indicação
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            Indique e <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">Ganhe</span>
                        </h2>
                        <p className="text-white/40 max-w-lg mx-auto text-lg">
                            Compartilhe seu link exclusivo e ganhe <span className="text-emerald-400 font-bold">3 fotos grátis</span> quando alguém comprar pelo seu link!
                        </p>
                    </div>

                    {/* Main Card */}
                    <div className="relative">
                        {/* Glow border */}
                        <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500/50 via-green-400/30 to-emerald-500/50 rounded-3xl blur-sm" />

                        <div className="relative bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-emerald-500/20">
                            {/* Steps */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                                        <Link2 size={24} className="text-emerald-400" />
                                    </div>
                                    <p className="text-white font-bold text-sm mb-1">1. Gere seu link</p>
                                    <p className="text-white/30 text-xs">Insira seu email e receba um link exclusivo</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/20 flex items-center justify-center mb-4">
                                        <ShoppingBag size={24} className="text-amber-400" />
                                    </div>
                                    <p className="text-white font-bold text-sm mb-1">2. Compartilhe</p>
                                    <p className="text-white/30 text-xs">Envie para amigos que precisam de fotos</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/20 flex items-center justify-center mb-4">
                                        <Sparkles size={24} className="text-green-400" />
                                    </div>
                                    <p className="text-white font-bold text-sm mb-1">3. Ganhe fotos</p>
                                    <p className="text-white/30 text-xs">Receba 3 fotos grátis por cada compra</p>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent mb-10" />

                            {/* Form */}
                            {!refLink ? (
                                <div className="max-w-xl mx-auto space-y-4">
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
                                            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50 whitespace-nowrap"
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
                                <div className="max-w-xl mx-auto space-y-4">
                                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-5">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Sparkles size={14} className="text-emerald-400" />
                                            <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                                Seu link está pronto!
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
                                        className="w-full py-4 bg-gradient-to-r from-emerald-600 to-green-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] transition-all text-lg"
                                    >
                                        <Copy size={20} />
                                        {refCopied ? 'Link Copiado! ✓' : 'Copiar Link'}
                                    </button>
                                </div>
                            )}

                            {/* Info badge */}
                            <p className="text-center text-white/20 text-xs mt-6">
                                🔒 Link único por email • Recompensa automática • Notificação por email
                            </p>
                        </div>
                    </div>
                </div>
            </section>

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
                                <svg width="20" height="20" viewBox="0 0 512 512" fill="none"><path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.886 76.886c14.192 14.192 33.064 22 53.12 22h15.064l-97.835-97.835c-18.858-18.858-49.573-18.858-68.431 0l-97.836 97.835h15.064zm0 0" fill="#4DB6AC" /><path d="M392.54 120.81c-20.056 0-38.928 7.808-53.12 22l-76.886 76.886c-5.557 5.557-14.593 5.557-20.15 0l-76.693-76.692c-14.192-14.192-33.064-22-53.12-22H97.505l97.836 97.835c18.858 18.858 49.573 18.858 68.431 0l97.835-97.836h-15.064zm0 0" fill="#4DB6AC" /><path d="M467.95 218.65l-48.792-48.791c-1.484 1.346-2.857 2.804-4.342 4.288l-76.886 76.886c-8.22 8.22-19.088 12.74-30.597 12.74-11.509 0-22.377-4.52-30.597-12.74l-76.693-76.692c-1.484-1.484-2.857-2.942-4.342-4.288l-48.79 48.79c-24.263 24.264-24.263 63.66 0 87.924l48.79 48.791c1.485-1.346 2.858-2.804 4.342-4.288l76.693-76.692c16.44-16.44 44.753-16.44 61.194 0l76.886 76.886c1.485 1.484 2.858 2.942 4.342 4.288l48.791-48.791c24.264-24.264 24.264-63.66 0-87.924zm0 0" fill="#4DB6AC" /></svg>
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

                        {/* Mercado Pago Badge */}
                        <div className="mt-6 flex items-center justify-center gap-3">
                            <div className="px-5 py-2.5 bg-[#009ee3]/10 border border-[#009ee3]/20 rounded-xl flex items-center gap-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="12" fill="#009ee3" /><path d="M7 12.5C7 10 9 8 12 8s5 2 5 4.5S15 17 12 17 7 15 7 12.5z" fill="white" /><path d="M10 11.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm4 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" fill="#009ee3" /></svg>
                                <div>
                                    <p className="text-xs font-bold text-[#009ee3]">Mercado Pago</p>
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
                                    <span className="text-xs text-white/40 ml-2">4.9/5 (10.000+ avaliações)</span>
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
