
import React, { useState } from 'react';
import {
    Camera, Check, ArrowRight, Shield, Sparkles,
    Clock, MessageCircle, Download,
    Smartphone, Award, Heart, Star, Scissors,
    Eye, Target, TrendingUp, Palette, Crown, Gem
} from 'lucide-react';
import FAQSection, { beautyFaqs } from './FAQSection';


interface BeautyLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;

}

export const BeautyLandingPage: React.FC<BeautyLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {


    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const plans = [
        {
            name: 'Starter',
            credits: 30,
            price: 57,
            perCredit: '1.90',
            popular: false,
            features: ['30 fotos profissionais', 'Todos os estilos de beleza', 'Resolução HD', 'Uso comercial liberado', 'Suporte por WhatsApp'],
        },
        {
            name: 'Pro',
            credits: 80,
            price: 97,
            perCredit: '1.21',
            popular: true,
            features: ['80 fotos profissionais', 'Todos os estilos de beleza', 'Resolução HD', 'Uso comercial liberado', 'Suporte por WhatsApp', 'Melhor custo-benefício'],
        },
        {
            name: 'Business',
            credits: 200,
            price: 297,
            perCredit: '1.49',
            popular: false,
            features: ['200 fotos profissionais', 'Todos os estilos de beleza', 'Resolução HD', 'Uso comercial liberado', 'Suporte prioritário', 'Ideal para equipes'],
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
                            <span className="text-[11px] md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">LUMI<span className="text-white">IA</span></span>
                            <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.15em] text-fuchsia-400">💅 Beauty</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onLogin || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Entrar</button>
                        <button onClick={onViewStudio || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Estúdio</button>
                        <button onClick={scrollToPricing} className="px-3 py-1.5 bg-gradient-to-r from-pink-500 to-rose-400 rounded-lg font-black text-[10px] text-white uppercase tracking-wide hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all whitespace-nowrap">Ver Pacotes</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-pink-700/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-rose-900/8 blur-[180px] rounded-full" />
                    <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-purple-700/5 blur-[150px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left min-w-0 overflow-hidden">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-800/20 border border-pink-700/30 text-pink-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <Scissors size={14} />
                                Ensaio para Profissionais da Beleza
                            </div>

                            <h1 className="text-[1.6rem] sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6 break-words">
                                Sua cliente te{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">
                                    escolhe pela foto
                                </span>
                                <br />antes de{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300">
                                    te conhecer
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-full md:max-w-xl mb-6 leading-relaxed break-words">
                                No mundo da estética, <strong className="text-white/80">imagem é tudo</strong>.
                                Suas clientes escolhem maquiadoras, cabeleireiras e designers de unhas pelo{' '}
                                <strong className="text-white/80">visual do perfil</strong>.
                                Tenha fotos de estúdio em <strong className="text-pink-400">30 segundos</strong>.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Sparkles size={11} className="text-pink-400" /> Estilos beauty
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Clock size={11} className="text-pink-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Shield size={11} className="text-pink-400" /> 100% fidelidade
                                </span>
                            </div>

                            <button onClick={scrollToPricing} className="px-10 py-5 bg-gradient-to-r from-pink-600 to-rose-500 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_50px_rgba(236,72,153,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                                Criar Meu Ensaio Profissional
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 57 • Pagamento único • Sem mensalidade</p>


                        </div>

                        {/* Right: Image showcase */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-3">
                                {[
                                    { img: '/ensaios/beauty-gallery-1.png', label: 'Maquiadora' },
                                    { img: '/ensaios/beauty-gallery-2.png', label: 'Cabeleireira' },
                                    { img: '/ensaios/beauty-gallery-3.png', label: 'Nail Designer' },
                                    { img: '/ensaios/beauty-gallery-4.png', label: 'Sobrancelha' },
                                ].map((s, i) => (
                                    <div key={i} className={`relative rounded-2xl overflow-hidden border ${i === 0 ? 'border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)]' : 'border-white/10'} ${i === 1 ? 'mt-8' : ''} ${i === 2 ? '-mt-4' : ''}`}>
                                        <img src={s.img} alt={s.label} className="w-full aspect-[3/4] object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                                        <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm text-[9px] font-black text-white/80 uppercase rounded-lg">{s.label}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-pink-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-pink-400 text-xs font-black text-center">💅 Fotos que atraem clientes</p>
                            </div>
                        </div>

                        {/* Mobile showcase */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                                {[
                                    { img: '/ensaios/beauty-gallery-1.png', label: 'Maquiadora' },
                                    { img: '/ensaios/beauty-gallery-2.png', label: 'Cabeleireira' },
                                    { img: '/ensaios/beauty-gallery-3.png', label: 'Nail Designer' },
                                    { img: '/ensaios/beauty-gallery-4.png', label: 'Sobrancelha' },
                                    { img: '/ensaios/beauty-gallery-5.png', label: 'Esteticista' },
                                ].map((s, i) => (
                                    <div key={i} className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                                        <div className="relative aspect-[3/4]">
                                            <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                            <p className="absolute bottom-2 left-2 text-[9px] font-black text-white uppercase drop-shadow-lg">{s.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* ===== DOR: SUA FOTO NÃO COMBINA COM SEU TALENTO ===== */}
            < section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden" >
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-pink-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Seu talento é incrível. Sua <span className="text-pink-400">foto</span> mostra isso?
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto">
                            Você faz trabalhos lindos, mas se o perfil não tem fotos profissionais,
                            a cliente nem chega a te conhecer. A primeira impressão é visual.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                        <div className="lg:col-span-1 flex justify-center">
                            <div className="relative w-40 rounded-2xl overflow-hidden border-2 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                <img src="/ensaios/selfie-beauty-woman.png" alt="Selfie amadora" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2 text-center">
                                    <span className="text-red-300 text-[9px] font-black uppercase">❌ Selfie do salão</span>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: Eye, title: 'Primeira Impressão', desc: 'A cliente escolhe pela foto antes de ver seu trabalho.', color: 'text-red-400', bg: 'from-red-500/20' },
                                { icon: TrendingUp, title: 'Concorrência', desc: 'Profissionais com fotos bonitas lotam a agenda. As outras perdem espaço.', color: 'text-orange-400', bg: 'from-orange-500/20' },
                                { icon: Target, title: 'Valor Percebido', desc: 'Foto profissional = percepção de qualidade = cliente paga mais.', color: 'text-pink-400', bg: 'from-pink-500/20' },
                            ].map((item, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-pink-500/20 transition-all">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bg} to-transparent border border-white/5 flex items-center justify-center mb-3`}>
                                        <item.icon size={22} className={item.color} />
                                    </div>
                                    <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                                    <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="lg:col-span-1 flex justify-center">
                            <div className="relative w-40 rounded-2xl overflow-hidden border-2 border-pink-500/40 shadow-[0_0_20px_rgba(236,72,153,0.15)]">
                                <img src="/ensaios/pro-beauty-woman.png" alt="Ensaio profissional" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-pink-900/60 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2 text-center">
                                    <span className="text-pink-300 text-[9px] font-black uppercase">✅ Ensaio profissional</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* ===== BEFORE/AFTER IMPACTANTE ===== */}
            < section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden" >
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-pink-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            Transformação Instantânea
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            De selfie a foto de <span className="text-pink-400">capa de revista</span>
                        </h2>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden border border-pink-500/20 shadow-[0_0_40px_rgba(236,72,153,0.1)] mb-8">
                        <div className="grid grid-cols-2 gap-0">
                            <div className="relative">
                                <img src="/ensaios/selfie-beauty-man.png" alt="Antes" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-3 left-3 px-3 py-1 bg-red-500/80 text-[9px] font-black text-white uppercase rounded-lg">❌ Antes</span>
                            </div>
                            <div className="relative">
                                <img src="/ensaios/pro-beauty-man.png" alt="Depois" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-3 right-3 px-3 py-1 bg-pink-500/90 text-[9px] font-black text-white uppercase rounded-lg">✅ Depois</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-pink-500 flex items-center justify-center">
                                    <Sparkles size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm">Selfie → Ensaio profissional</p>
                                    <p className="text-white/50 text-xs">Mesmo rosto, cenário de estúdio premium</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {['30 segundos', 'Sem fotógrafo', 'Qualidade HD'].map((t, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-pink-500/20 border border-pink-500/30 rounded-full text-pink-400 text-[9px] font-black uppercase">
                                        ✓ {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-pink-500/5 border border-pink-500/15 flex flex-col md:flex-row items-center gap-4">
                        <div className="flex items-center gap-3">
                            <Clock size={20} className="text-pink-400 flex-shrink-0" />
                            <div>
                                <p className="text-pink-400 font-black text-sm">💡 Um ensaio fotográfico custa de R$ 500 a R$ 2.000</p>
                                <p className="text-white/40 text-xs">Com a LumiphotoIA, faça por menos de R$ 2 por foto. Na hora que quiser.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* ===== ESTILOS PARA CADA NICHO ====== */}
            < section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden" >
                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Estilos Para <span className="text-pink-400">Cada Especialidade</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Maquiadora, cabeleireira, nail designer, design de sobrancelha — cada nicho,
                            um visual perfeito para atrair suas clientes
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { img: '/ensaios/beauty-gallery-1.png', label: 'Maquiadora', desc: 'Estúdio com Hollywood mirror' },
                            { img: '/ensaios/beauty-gallery-2.png', label: 'Cabeleireira', desc: 'Salão moderno com espelhos' },
                            { img: '/ensaios/beauty-gallery-3.png', label: 'Nail Designer', desc: 'Estação clean e organizada' },
                            { img: '/ensaios/beauty-gallery-4.png', label: 'Sobrancelhista', desc: 'Clínica estética moderna' },
                            { img: '/ensaios/beauty-gallery-5.png', label: 'Esteticista', desc: 'Spa luxuoso e acolhedor' },
                            { img: '/ensaios/beauty-gallery-6.png', label: 'Barbeiro', desc: 'Barbearia urbana e estilosa' },
                        ].map((style, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden border border-pink-500/20 group cursor-pointer">
                                <img src={style.img} alt={style.label} className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Crown size={12} className="text-pink-400" />
                                        <h4 className="text-white font-black text-sm">{style.label}</h4>
                                    </div>
                                    <p className="text-white/50 text-[10px]">{style.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ===== COMO FUNCIONA ===== */}
            < section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden" >
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            3 Cliques
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            Mais Fácil que Postar no <span className="text-pink-400">Instagram</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-pink-600/30 via-pink-500/30 to-rose-500/30" />

                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-pink-600/20 to-pink-700/5 border border-pink-600/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-black flex items-center justify-center shadow-lg">1</div>
                                <Smartphone size={36} className="text-pink-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Envie uma selfie</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">Qualquer foto do celular. Não precisa de maquiagem perfeita.</p>
                        </div>

                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-pink-500/20 to-rose-500/5 border border-pink-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-pink-500 text-white text-sm font-black flex items-center justify-center shadow-lg">2</div>
                                <Palette size={36} className="text-pink-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Escolha o visual</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">Glow Beauty, Editorial, Golden Hour, Estúdio Clean e +120 opções.</p>
                        </div>

                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-rose-500/20 to-rose-600/5 border border-rose-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(244,63,94,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-rose-500 text-white text-sm font-black flex items-center justify-center shadow-lg">3</div>
                                <Download size={36} className="text-rose-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Baixe e poste</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">3 variações em HD prontas para stories, feed e materiais do salão.</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* ===== ONDE USAR ===== */}
            < section className="py-24 bg-[#050505] border-t border-white/5" >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Use Suas Fotos em <span className="text-pink-400">Tudo</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {[
                            { img: '/ensaios/beauty-gallery-1.png', title: 'Instagram Feed', desc: 'Fotos que param o scroll e atraem seguidores', icon: Camera, color: 'text-pink-400', border: 'border-pink-500/30' },
                            { img: '/ensaios/beauty-gallery-2.png', title: 'Stories & Reels', desc: 'Capas profissionais para destaques do perfil', icon: Heart, color: 'text-red-400', border: 'border-red-500/30' },
                            { img: '/ensaios/beauty-gallery-3.png', title: 'Google Meu Negócio', desc: 'Foto profissional gera mais agendamentos', icon: Star, color: 'text-amber-400', border: 'border-amber-500/30' },
                            { img: '/ensaios/beauty-gallery-4.png', title: 'Cartão Digital', desc: 'Visual de luxo no cartão de visitas digital', icon: Gem, color: 'text-purple-400', border: 'border-purple-500/30' },
                            { img: '/ensaios/beauty-gallery-5.png', title: 'Banner do Salão', desc: 'Foto impactante para materiais impressos', icon: Award, color: 'text-emerald-400', border: 'border-emerald-500/30' },
                            { img: '/ensaios/beauty-gallery-6.png', title: 'TikTok', desc: 'Capas profissionais para vídeos virais', icon: TrendingUp, color: 'text-cyan-400', border: 'border-cyan-500/30' },
                        ].map((item, i) => (
                            <div key={i} className={`relative rounded-2xl overflow-hidden ${item.border} border group cursor-pointer`}>
                                <img src={item.img} alt={item.title} className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
                                <div className="absolute bottom-0 left-0 right-0 p-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <item.icon size={14} className={item.color} />
                                        <h4 className="text-white font-black text-sm">{item.title}</h4>
                                    </div>
                                    <p className="text-white/50 text-[10px] leading-relaxed">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ===== ZERO PROMPT ===== */}
            < section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden" >
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-600/5 border border-pink-500/25 flex items-center justify-center overflow-hidden p-0">
                                    <img src="/logo-gold.png" alt="LumiphotoIA" className="w-full h-full object-cover rounded-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">Zero Prompt. Zero Curso.</h3>
                                    <p className="text-pink-400/60 text-xs font-bold uppercase tracking-wider">Mais fácil que WhatsApp</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed mb-5">
                                Você é especialista em beleza, não em tecnologia. A LumiphotoIA é{' '}
                                <strong className="text-white/70">ridiculamente simples</strong>. Sem comandos, sem edição, sem inglês.
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-black flex items-center justify-center flex-shrink-0">1</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Upload</strong> da sua selfie</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-pink-600 text-white text-sm font-black flex items-center justify-center flex-shrink-0">2</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Escolhe</strong> o visual que combina com seu nicho</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-pink-600/10 border border-pink-600/20">
                                    <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0">✓</div>
                                    <span className="text-pink-400 text-sm font-bold">3 fotos profissionais em 30 segundos</span>
                                </div>
                            </div>
                        </div>

                        {/* Caixinha Mágica */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-gradient-to-br from-pink-500/5 to-transparent">
                            <div className="p-6 space-y-3">
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-pink-500/20 border border-pink-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Quero com fundo rosa e ring light"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-500/10 border border-pink-400/15 text-pink-400/80 text-sm max-w-[80%]">
                                        ✨ Pronto! Fundo rosa com ring light aplicado, iluminação beauty perfeita.
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-pink-500/20 border border-pink-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Muda pra um look mais glam com batom vermelho"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-500/10 border border-pink-400/15 text-pink-400/80 text-sm max-w-[80%]">
                                        ✨ Visual glam aplicado mantendo sua identidade facial!
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-pink-500/20 border border-pink-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Agora estilo editorial com fundo neutro"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-pink-500/10 border border-pink-400/15 text-pink-400/80 text-sm max-w-[80%]">
                                        ✨ Visual editorial com fundo neutro e luz natural. Premium!
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 border-t border-white/5 text-center">
                                <p className="text-pink-400/60 text-[10px] font-black uppercase tracking-widest">🪄 Caixinha Mágica — Personalize tudo em português</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section >

            {/* ===== 100% FIDELIDADE ===== */}
            < section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden" >
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Shield size={12} />
                            Garantia de Identidade
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            100% <span className="text-emerald-400">Fidelidade</span> Facial
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto text-base">
                            Suas clientes vão reconhecer você. A IA muda o cenário e a iluminação,
                            mas <strong className="text-white/70">nunca muda seu rosto</strong>.
                        </p>
                    </div>

                    <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(52,211,153,0.1)] mb-8">
                        <div className="grid grid-cols-2 gap-0">
                            <div className="relative">
                                <img src="/ensaios/selfie-beauty-woman.png" alt="Selfie original" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-3 left-3 px-3 py-1 bg-white/20 backdrop-blur-sm text-[9px] font-black text-white uppercase rounded-lg">📱 Foto enviada</span>
                            </div>
                            <div className="relative">
                                <img src="/ensaios/pro-beauty-woman.png" alt="Resultado profissional" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-3 right-3 px-3 py-1 bg-emerald-500/80 text-[9px] font-black text-white uppercase rounded-lg">✅ Mesmo rosto</span>
                            </div>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                            <p className="text-white font-black text-lg mb-1">Cada rosto é único. Cada resultado é fiel.</p>
                            <p className="text-white/40 text-sm">A IA não inventa, não mistura, não deforma. É você — em um cenário profissional.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-2 mb-8">
                        {[
                            { img: '/ensaios/beauty-gallery-1.png', label: 'MUA' },
                            { img: '/ensaios/beauty-gallery-2.png', label: 'Hair' },
                            { img: '/ensaios/beauty-gallery-3.png', label: 'Nails' },
                            { img: '/ensaios/beauty-gallery-5.png', label: 'Spa' },
                            { img: '/ensaios/beauty-gallery-6.png', label: 'Barber' },
                        ].map((s, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group border border-white/5">
                                <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
                                    <p className="text-white font-black text-[9px] uppercase tracking-wider drop-shadow-lg">{s.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Shield size={22} className="text-emerald-400 flex-shrink-0" />
                            <p className="text-white/40 text-xs">🔒 Identidade preservada: mudamos só cenário, roupa e iluminação. Seu rosto permanece 100% fiel.</p>
                        </div>
                        <div className="flex items-center gap-2">
                            {['100% Fiel', 'Sem deformação', 'Natural', 'HD'].map((t, i) => (
                                <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400/80 text-[10px] font-bold">
                                    <Check size={10} className="inline mr-1" />{t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section >

            {/* ===== TAMBÉM FAZ: TIKTOK ===== */}
            < section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden" >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <TrendingUp size={12} />
                            Tendência
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Fotos para <span className="text-purple-400">TikTok & Reels</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Capas profissionais para seus conteúdos virais. Mostre para suas clientes
                            que você também domina as tendências.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                        {[
                            { img: '/studio-styles/tiktok_cafe.png', label: 'Café' },
                            { img: '/studio-styles/tiktok_mirror.png', label: 'Mirror' },
                            { img: '/studio-styles/tiktok_morning.png', label: 'Morning' },
                            { img: '/studio-styles/tiktok_ootd.png', label: 'OOTD' },
                            { img: '/studio-styles/tiktok_party.png', label: 'Party' },
                        ].map((s, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group border border-purple-500/20">
                                <img src={s.img} alt={s.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <p className="absolute bottom-1.5 left-1.5 text-white font-black text-[9px] uppercase drop-shadow-lg">{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section >

            {/* ===== PRICING ===== */}
            < section id="pricing-section" className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5 relative" >
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Gem size={12} />
                            Investimento
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                            Invista no Seu <span className="text-pink-400">Visual</span>
                        </h2>
                        <p className="text-white/30 max-w-lg mx-auto text-sm">
                            Ensaio fotográfico profissional custa de R$ 500 a R$ 2.000. Com a LumiphotoIA, comece por R$ 57.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold"><Check size={12} strokeWidth={3} /> Pagamento único</span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500/15 border border-pink-500/30 rounded-full text-pink-400 text-xs font-bold"><Shield size={12} /> Sem mensalidade</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <div key={i} className={`relative rounded-2xl p-6 border transition-all duration-300 ${plan.popular
                                ? 'bg-gradient-to-b from-pink-600/10 to-transparent border-pink-600/30 shadow-[0_0_40px_rgba(236,72,153,0.15)] scale-[1.02]'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                                }`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-pink-600 to-rose-500 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-lg">⭐ Mais Vendido</div>
                                )}
                                <div className="text-center mb-6">
                                    <h3 className={`text-lg font-black ${plan.popular ? 'text-pink-400' : 'text-white/70'}`}>{plan.name}</h3>
                                    <div className="mt-3"><span className="text-4xl font-black text-white">R$ {plan.price}</span></div>
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
                                <button onClick={onGetStarted} className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${plan.popular
                                    ? 'bg-gradient-to-r from-pink-600 to-rose-500 text-white hover:shadow-[0_0_30px_rgba(236,72,153,0.4)] hover:scale-[1.02]'
                                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                                    }`}>Escolher {plan.name}</button>
                            </div>
                        ))}
                    </div>
                    <p className="text-center text-white/20 text-xs mt-8">Pagamento seguro via Mercado Pago • Cartão, Pix ou Boleto</p>
                </div>
            </section >

            {/* ===== CTA FINAL ===== */}
            < section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-white/5 relative overflow-hidden" >
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-600/8 blur-[200px] rounded-full" />
                </div>
                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <p className="text-white/30 text-sm mb-6 uppercase tracking-widest font-bold">Sua agenda cheia começa pela sua imagem</p>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6 leading-tight">
                        Profissionais de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-rose-400">sucesso</span>{' '}
                        investem no visual
                    </h2>
                    <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                        Enquanto outras profissionais usam selfies do salão, você vai transmitir glamour e profissionalismo em cada plataforma.
                    </p>
                    <button onClick={scrollToPricing} className="px-12 py-5 bg-gradient-to-r from-pink-600 to-rose-500 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_60px_rgba(236,72,153,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3 mb-6">
                        Criar Meu Ensaio Profissional
                        <ArrowRight size={22} />
                    </button>
                    <div className="flex flex-wrap justify-center gap-4 text-xs text-white/25">
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> Pagamento único</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> Sem mensalidade</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> 100% fidelidade</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-pink-500" /> 30 segundos</span>
                    </div>
                </div>
            </section >

            {/* ===== FAQ ===== */}
            < FAQSection extraFaqs={beautyFaqs} accentColor="pink" />

            {/* ===== FOOTER ===== */}
            < footer className="border-t border-white/5 bg-[#030303] py-8" >
                <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-6 w-auto object-contain opacity-30" />
                        <span className="text-white/15 text-[10px] uppercase tracking-widest">© {new Date().getFullYear()} LumiphotoIA</span>
                    </div>
                    <div className="flex items-center gap-4 text-white/15 text-[10px]">
                        <span>suporte@lumiphotoia.online</span>
                        <span>•</span>
                        <span>www.lumiphotoia.online</span>
                    </div>
                </div>
            </footer >

            {/* ===== MP CREDIBILITY BAR ===== */}
            < div className="border-t border-white/5 bg-[#050505] py-5 px-6" >
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
            </div >
        </div >
    );
};
