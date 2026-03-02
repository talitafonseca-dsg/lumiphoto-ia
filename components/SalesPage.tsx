
import React, { useState } from 'react';
import { Camera, Check, Star, Zap, Image as ImageIcon, Briefcase, Heart, Instagram, Sparkles, Layout, ShoppingBag, TrendingUp } from 'lucide-react';

interface SalesPageProps {
    onGetStarted: () => void;
    onLogin: () => void;
}

export const SalesPage: React.FC<SalesPageProps> = ({ onGetStarted, onLogin }) => {
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
                            className="text-xs font-bold uppercase tracking-wider text-white/70 hover:text-white transition-colors"
                        >
                            Escolha o seu pacote
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
                            <p className="text-4xl font-black text-white mb-1">R$ 27<span className="text-lg font-normal text-white/40">,00</span></p>
                            <p className="text-sm text-amber-400 font-bold mb-4">10 Fotos</p>
                            <p className="text-xs text-white/30 mb-6">R$ 2,70 por foto</p>
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
                            <p className="text-4xl font-black text-white mb-1">R$ 47<span className="text-lg font-normal text-white/40">,00</span></p>
                            <p className="text-sm text-amber-400 font-bold mb-4">30 Fotos</p>
                            <p className="text-xs text-white/30 mb-6">R$ 1,56 por foto</p>
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

            {/* FOOTER */}
            <footer className="py-12 border-t border-white/5 bg-black text-center">
                <div className="mb-8">
                    <img src="/logo-gold.png" alt="LumiphotoIA" className="h-12 w-auto mx-auto object-contain grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all" />
                </div>
                <p className="text-white/20 text-xs uppercase tracking-widest">© 2024 LumiphotoIA. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
};
