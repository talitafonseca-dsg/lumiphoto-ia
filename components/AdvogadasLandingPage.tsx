
import React, { useState, useRef } from 'react';
import {
    Camera, Check, ArrowRight, Shield, Sparkles,
    DollarSign, Clock, MessageCircle, Gift,
    Download,
    Smartphone, Award, Heart, Play, Volume2, VolumeX,
    Palette, Users, Scale, BookOpen, Briefcase, Star,
    Eye, Target, TrendingUp, Zap
} from 'lucide-react';
import FAQSection, { advogadoFaqs } from './FAQSection';
import StudioTrialUpload from './StudioTrialUpload';

interface AdvogadasLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;
    onFreeTrialGenerate?: (parts: any[], aspectRatio: string, trialType: string) => void;
    isTrialGenerating?: boolean;
    trialError?: string;
}

export const AdvogadasLandingPage: React.FC<AdvogadasLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin, onFreeTrialGenerate, isTrialGenerating, trialError }) => {


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
            features: ['30 fotos profissionais', 'Todos os estilos jurídicos', 'Resolução HD', 'Uso comercial liberado', 'Suporte por WhatsApp'],
        },
        {
            name: 'Pro',
            credits: 80,
            price: 97,
            perCredit: '1.21',
            popular: true,
            features: ['80 fotos profissionais', 'Todos os estilos jurídicos', 'Resolução HD', 'Uso comercial liberado', 'Suporte por WhatsApp', 'Melhor custo-benefício'],
        },
        {
            name: 'Business',
            credits: 200,
            price: 297,
            perCredit: '1.49',
            popular: false,
            features: ['200 fotos profissionais', 'Todos os estilos jurídicos', 'Resolução HD', 'Uso comercial liberado', 'Suporte prioritário', 'Ideal para escritórios'],
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
                            <span className="text-[7px] font-black uppercase tracking-[0.15em] text-cyan-400">⚖️ Advocacia</span>
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
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-700/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-900/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-800/20 border border-amber-700/30 text-amber-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <Scale size={14} />
                                Ensaio Profissional para Advogados
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6">
                                Sua imagem é o{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                                    primeiro argumento
                                </span>
                                <br />que o cliente{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-200">
                                    avalia
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white/50 max-w-xl mb-6 leading-relaxed">
                                Antes mesmo de ler seu currículo, seu cliente já formou uma opinião sobre você pela foto.
                                Transmita <strong className="text-white/80">autoridade</strong>, <strong className="text-white/80">competência</strong> e{' '}
                                <strong className="text-white/80">confiança</strong> com um ensaio profissional feito em <strong className="text-white/80">30 segundos</strong>.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Scale size={11} className="text-amber-400" /> Estilos jurídicos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Clock size={11} className="text-amber-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Shield size={11} className="text-amber-400" /> 100% fidelidade
                                </span>
                            </div>

                            <button onClick={scrollToPricing} className="px-10 py-5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_50px_rgba(217,119,6,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                                Criar Meu Ensaio Profissional
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 57 • Pagamento único • Sem mensalidade</p>

                            {/* FREE TRIAL CTA */}
                            {onFreeTrialGenerate && (
                                <div className="mt-8 p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.04]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-[10px] font-black uppercase rounded-full border border-amber-500/30">🎁 TESTE GRÁTIS</span>
                                        <span className="text-white/30 text-[10px]">Sem cadastro, sem cartão</span>
                                    </div>
                                    <StudioTrialUpload
                                        onTrialGenerate={onFreeTrialGenerate}
                                        isGenerating={isTrialGenerating}
                                        error={trialError}
                                        accentColor="from-amber-600 to-yellow-500"
                                        ctaLabel="Gerar 3 Ensaios Grátis"
                                        descriptionLabel="Envie uma selfie e veja 3 estilos: Executivo Pro, Família e Inspiracional Dourado"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Right: Before/After */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <img src="/ensaios/selfie-adv-woman.png" alt="Selfie casual" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-[10px] font-black text-white/70 uppercase tracking-wider rounded-lg">📱 Selfie do celular</span>
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-600/40 shadow-[0_8px_30px_rgba(217,119,6,0.2)] mt-8">
                                    <img src="/ensaios/pro-adv-woman.png" alt="Ensaio profissional" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-amber-600/90 text-[10px] font-black text-white uppercase tracking-wider rounded-lg">⚖️ Ensaio Profissional</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[
                                    { img: '/studio-styles/advogado.png', label: 'Advogada' },
                                    { img: '/studio-styles/executivo_pro.png', label: 'Executiva' },
                                    { img: '/studio-styles/coach_mentor.png', label: 'Mentora' },
                                ].map((s, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                                        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <p className="absolute bottom-1 left-1 text-[8px] font-black text-white/80 uppercase">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-amber-600/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-amber-400 text-xs font-black text-center">⚖️ Fotos que transmitem autoridade</p>
                            </div>
                        </div>

                        {/* Mobile showcase */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                <div className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/[0.02]">
                                    <div className="flex relative">
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/selfie-adv-woman.png" alt="Selfie" className="w-full h-36 object-cover" />
                                            <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/70 text-[8px] font-black text-white/60 uppercase rounded">Selfie</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/ensaios/pro-adv-woman.png" alt="Ensaio" className="w-full h-36 object-cover" />
                                            <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-amber-600/90 text-[8px] font-black text-white uppercase rounded">⚖️ IA</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-amber-600 rounded-full flex items-center justify-center shadow-lg z-10">
                                            <ArrowRight size={10} className="text-white" />
                                        </div>
                                    </div>
                                    <div className="p-2 text-center">
                                        <p className="text-white/50 text-[10px] font-bold">Antes & Depois</p>
                                    </div>
                                </div>
                                {[
                                    { img: '/studio-styles/advogado.png', label: 'Advogada' },
                                    { img: '/studio-styles/executivo_pro.png', label: 'Executiva' },
                                    { img: '/studio-styles/coach_mentor.png', label: 'Mentora' },
                                    { img: '/studio-styles/insp_editorial_elegante.png', label: 'Elegante' },
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
            </section>

            {/* ===== DOR: SUA FOTO ESTÁ PREJUDICANDO VOCÊ ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-red-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Sua foto atual está <span className="text-red-400">prejudicando</span> você?
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto">
                            A maioria dos advogados usa selfies, fotos cortadas de eventos ou fotos amadoras no perfil profissional.
                            Isso transmite uma mensagem errada para quem busca confiança e competência.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                        {/* Left: Bad example */}
                        <div className="lg:col-span-1 flex justify-center">
                            <div className="relative w-40 rounded-2xl overflow-hidden border-2 border-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                                <img src="/ensaios/selfie-adv-man.png" alt="Selfie amadora" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-red-900/60 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2 text-center">
                                    <span className="text-red-300 text-[9px] font-black uppercase">❌ Foto amadora</span>
                                </div>
                            </div>
                        </div>

                        {/* Center: Pain cards */}
                        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {[
                                { icon: Eye, title: 'Primeira Impressão', desc: 'Clientes decidem em 3 segundos se vão confiar em você.', color: 'text-red-400', bg: 'from-red-500/20' },
                                { icon: TrendingUp, title: 'Concorrência Visual', desc: 'Seus concorrentes com fotos profissionais atraem mais clientes.', color: 'text-orange-400', bg: 'from-orange-500/20' },
                                { icon: Target, title: 'Posicionamento', desc: 'O valor do seu honorário está ligado à qualidade da sua imagem.', color: 'text-amber-400', bg: 'from-amber-500/20' },
                            ].map((item, i) => (
                                <div key={i} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-amber-500/20 transition-all">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.bg} to-transparent border border-white/5 flex items-center justify-center mb-3`}>
                                        <item.icon size={22} className={item.color} />
                                    </div>
                                    <h4 className="text-white font-bold text-sm mb-2">{item.title}</h4>
                                    <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>

                        {/* Right: Good example */}
                        <div className="lg:col-span-1 flex justify-center">
                            <div className="relative w-40 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.15)]">
                                <img src="/studio-styles/advogado.png" alt="Ensaio profissional" className="w-full aspect-[3/4] object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent" />
                                <div className="absolute bottom-2 left-2 right-2 text-center">
                                    <span className="text-amber-300 text-[9px] font-black uppercase">✅ Foto profissional</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SOLUÇÃO: BEFORE/AFTER ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-amber-600/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="flex justify-center gap-4 items-center">
                            <div className="relative">
                                <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-white/10 shadow-lg">
                                    <img src="/ensaios/selfie-adv-man.png" alt="Selfie casual" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-500/80 rounded-full whitespace-nowrap">
                                    <span className="text-white text-[9px] font-black uppercase">❌ Sem autoridade</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <ArrowRight size={20} className="text-amber-500" />
                                <span className="text-amber-400 text-[8px] font-black uppercase">30 seg</span>
                            </div>
                            <div className="relative">
                                <div className="w-44 h-56 rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_0_25px_rgba(217,119,6,0.2)]">
                                    <img src="/ensaios/pro-adv-man.png" alt="Ensaio profissional" className="w-full h-full object-cover" />
                                </div>
                                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-600/90 rounded-full whitespace-nowrap">
                                    <span className="text-white text-[9px] font-black uppercase">✅ Autoridade total</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-600/20 to-amber-700/5 border border-amber-600/25 flex items-center justify-center">
                                    <img src="/logo-gold.png" alt="LumiphotoIA" className="w-8 h-8 object-contain" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">A Solução em 30 Segundos</h3>
                                    <p className="text-amber-400/60 text-xs font-bold uppercase tracking-wider">De selfie a foto de escritório premium</p>
                                </div>
                            </div>

                            <p className="text-white/50 text-base leading-relaxed mb-6">
                                Com a LumiphotoIA, você transforma qualquer selfie em um ensaio profissional de estúdio.
                                Sem agendar fotógrafo, sem se deslocar, sem gastar horas. <strong className="text-amber-400">Em 30 segundos.</strong>
                            </p>

                            <div className="space-y-3 mb-6">
                                {[
                                    'Cenários de escritório elegante e bibliotecas jurídicas',
                                    'Iluminação profissional de estúdio automatizada',
                                    'Vestimenta formal adequada para o ambiente jurídico',
                                    '100% de fidelidade facial — seu rosto não muda',
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <Check size={16} className="text-amber-400 flex-shrink-0" />
                                        <span className="text-white/60 text-sm">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 rounded-xl bg-amber-600/5 border border-amber-600/15">
                                <p className="text-amber-400/80 text-xs font-bold">💡 Um ensaio fotográfico profissional custa de R$ 500 a R$ 2.000. Com a LumiphotoIA, você faz por menos de R$ 2 por foto.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} fill="currentColor" />
                            Simples e Rápido
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            3 Cliques Para Fotos de <span className="text-amber-400">Autoridade</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                        <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-amber-600/30 via-amber-500/30 to-green-500/30" />

                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-600/20 to-amber-700/5 border border-amber-600/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(217,119,6,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-600 text-white text-sm font-black flex items-center justify-center shadow-lg">1</div>
                                <Smartphone size={36} className="text-amber-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Envie uma selfie</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Qualquer foto do celular serve. Não precisa de maquiagem nem produção especial.
                            </p>
                        </div>

                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-amber-500 text-black text-sm font-black flex items-center justify-center shadow-lg">2</div>
                                <Scale size={36} className="text-amber-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Escolha o estilo</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                Escritório clássico, biblioteca jurídica, estúdio moderno ou executivo premium.
                            </p>
                        </div>

                        <div className="relative text-center group">
                            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-green-500/20 to-green-600/5 border border-green-500/25 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(34,197,94,0.2)] transition-all duration-500 relative z-10">
                                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-green-500 text-black text-sm font-black flex items-center justify-center shadow-lg">3</div>
                                <Download size={36} className="text-green-400" />
                            </div>
                            <h3 className="text-white font-bold text-lg mb-2">Baixe e use</h3>
                            <p className="text-white/35 text-sm leading-relaxed max-w-[250px] mx-auto">
                                3 variações profissionais em HD. Pronto para LinkedIn, Instagram e Google Meu Negócio.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ONDE USAR ===== */}
            <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Onde Usar Suas <span className="text-amber-400">Fotos Profissionais</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto">
                            Uma foto profissional de qualidade impacta toda a sua presença digital e materiais de marketing
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { img: '/studio-styles/advogado.png', title: 'LinkedIn', desc: 'Perfis com foto profissional recebem 21x mais visualizações', color: 'text-blue-400', borderColor: 'border-blue-500/30', icon: Briefcase },
                            { img: '/studio-styles/executivo_pro.png', title: 'Instagram', desc: 'Atraia clientes mostrando autoridade no feed jurídico', color: 'text-pink-400', borderColor: 'border-pink-500/30', icon: Camera },
                            { img: '/studio-styles/coach_mentor.png', title: 'Google', desc: 'Foto profissional no Google Meu Negócio gera mais confiança', color: 'text-amber-400', borderColor: 'border-amber-500/30', icon: Star },
                            { img: '/studio-styles/palestrante_palco.png', title: 'Site do Escritório', desc: 'Padronize as fotos da equipe com qualidade de estúdio', color: 'text-emerald-400', borderColor: 'border-emerald-500/30', icon: BookOpen },
                            { img: '/studio-styles/professor.png', title: 'OAB / Carteirinha', desc: 'Foto profissional que transmite seriedade e competência', color: 'text-purple-400', borderColor: 'border-purple-500/30', icon: Scale },
                            { img: '/studio-styles/insp_editorial_elegante.png', title: 'WhatsApp Business', desc: 'Foto profissional no perfil comercial gera mais respostas', color: 'text-green-400', borderColor: 'border-green-500/30', icon: MessageCircle },
                        ].map((item, i) => (
                            <div key={i} className={`relative rounded-2xl overflow-hidden ${item.borderColor} border group cursor-pointer`}>
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
            </section>

            {/* ===== ZERO PROMPT ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-500/5 blur-[200px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="flex flex-col justify-center">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/5 border border-amber-500/25 flex items-center justify-center overflow-hidden p-0">
                                    <img src="/logo-gold.png" alt="LumiphotoIA" className="w-full h-full object-cover rounded-2xl" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-2xl">Zero Prompt. Zero Curso.</h3>
                                    <p className="text-amber-400/60 text-xs font-bold uppercase tracking-wider">Feito para quem não é de tecnologia</p>
                                </div>
                            </div>
                            <p className="text-white/50 text-base leading-relaxed mb-5">
                                Você é especialista em Direito, não em edição de fotos. Por isso a LumiphotoIA é{' '}
                                <strong className="text-white/70">mais fácil que o WhatsApp</strong>. Sem comandos, sem inglês, sem configurações.
                            </p>

                            <div className="space-y-3 mb-6">
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white text-sm font-black flex items-center justify-center flex-shrink-0">1</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Upload</strong> da sua selfie</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-amber-600 text-white text-sm font-black flex items-center justify-center flex-shrink-0">2</div>
                                    <span className="text-white/70 text-sm"><strong className="text-white">Escolhe</strong> o cenário profissional</span>
                                </div>
                                <div className="flex items-center gap-4 p-3 rounded-xl bg-amber-600/10 border border-amber-600/20">
                                    <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-black flex items-center justify-center flex-shrink-0">✓</div>
                                    <span className="text-amber-400 text-sm font-bold">3 fotos profissionais em 30 segundos</span>
                                </div>
                            </div>
                        </div>

                        {/* Style grid */}
                        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_40px_rgba(0,0,0,0.5)] bg-[#0d0d0d] p-3">
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { img: '/ensaios/adv-gallery-1.png', label: 'Minimalista' },
                                    { img: '/ensaios/adv-gallery-2.png', label: 'Moderno' },
                                    { img: '/ensaios/adv-gallery-3.png', label: 'Escritório' },
                                    { img: '/ensaios/adv-gallery-4.png', label: 'Executivo' },
                                    { img: '/ensaios/adv-gallery-5.png', label: 'Editorial' },
                                    { img: '/ensaios/adv-gallery-6.png', label: 'Corporativo' },
                                ].map((style, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-[3/4] group">
                                        <img src={style.img} alt={style.label} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-1.5 left-1.5 right-1.5">
                                            <p className="text-white font-black text-[10px] uppercase tracking-wider leading-tight drop-shadow-lg">{style.label}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-white/20 text-[10px] font-bold mt-3 uppercase tracking-widest">+120 estilos profissionais</p>
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
                                        "Quero um fundo de bibliotecsjurídica com livros"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-amber-500/10 border border-amber-500/15 text-amber-400/80 text-sm max-w-[80%]">
                                        ✨ Pronto! Biblioteca jurídica com estantes de livros de Direito ao fundo.
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Muda pra um blazer preto mais formal"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-amber-500/10 border border-amber-500/15 text-amber-400/80 text-sm max-w-[80%]">
                                        ✨ Feito! Blazer preto formal aplicado mantendo a identidade.
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <div className="px-4 py-2 rounded-2xl rounded-br-sm bg-blue-500/20 border border-blue-500/15 text-white/80 text-sm max-w-[80%]">
                                        "Agora com iluminação mais quente e sofisticada"
                                    </div>
                                </div>
                                <div className="flex justify-start">
                                    <div className="px-4 py-2 rounded-2xl rounded-bl-sm bg-amber-500/10 border border-amber-500/15 text-amber-400/80 text-sm max-w-[80%]">
                                        ✨ Iluminação quente aplicada. Visual premium de estúdio.
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
                                Quer trocar o fundo? Mudar a roupa? Ajustar a iluminação? É só <strong className="text-white/70">pedir em português</strong>.
                                A IA entende e executa como um designer pessoal.
                            </p>
                            <p className="text-white/70 text-base leading-relaxed mb-6">
                                Peça: <strong className="text-amber-400">"Fundo de escritório"</strong>, <strong className="text-amber-400">"blazer azul-marinho"</strong>,{' '}
                                <strong className="text-amber-400">"iluminação natural"</strong> — tudo sem saber editar fotos.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== 100% FIDELIDADE ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-500/5 blur-[200px] rounded-full pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600/5 blur-[180px] rounded-full pointer-events-none" />

                <div className="max-w-6xl mx-auto px-6 relative z-10">
                    {/* Title */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Shield size={12} />
                            Garantia de Identidade
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            100% <span className="text-emerald-400">Fidelidade</span> Facial
                        </h2>
                        <p className="text-white/40 max-w-2xl mx-auto text-base">
                            Diferente de outras IAs que deformam o rosto, a LumiphotoIA usa tecnologia de{' '}
                            <strong className="text-white/70">preservação de identidade</strong>. Seus clientes vão reconhecer você.
                        </p>
                    </div>

                    {/* Main before/after hero image */}
                    <div className="relative rounded-3xl overflow-hidden border border-emerald-500/20 shadow-[0_0_40px_rgba(52,211,153,0.1)] mb-8">
                        <img src="/ensaios/fidelity-before-after.png" alt="Antes e depois — 100% fidelidade facial" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center">
                                    <Shield size={18} className="text-white" />
                                </div>
                                <div>
                                    <p className="text-white font-black text-sm">Mesmo rosto, novo cenário</p>
                                    <p className="text-white/50 text-xs">A IA muda apenas o ambiente, roupa e iluminação</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                {['Rosto preservado', 'Expressão mantida', 'Resultado natural'].map((t, i) => (
                                    <span key={i} className="px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-[9px] font-black uppercase">
                                        ✓ {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Gallery of professional results */}
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.4)] mb-8">
                        <img src="/ensaios/fidelity-gallery-lawyers.png" alt="Galeria de resultados profissionais" className="w-full h-auto object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
                            <p className="text-white font-black text-lg mb-1">Cada rosto é único. Cada resultado é fiel.</p>
                            <p className="text-white/40 text-sm">A IA não inventa, não mistura, não deforma. É você — em um cenário profissional.</p>
                        </div>
                    </div>


                    {/* Bottom guarantee */}
                    <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center flex-shrink-0">
                                <Shield size={22} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-emerald-400 font-black text-sm">🔒 Garantia de Identidade</p>
                                <p className="text-white/40 text-xs">Seus clientes e colegas vão reconhecer você em cada foto. Mudamos só o cenário.</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            {['100% Fiel', 'Sem deformação', 'Natural', 'HD'].map((t, i) => (
                                <span key={i} className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400/80 text-[10px] font-bold">
                                    <Check size={10} className="inline mr-1" />{t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== DEPOIMENTOS ===== */}
            <section className="py-24 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />

                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                            <Star size={14} />
                            Quem já experimentou aprova
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                            Advogados Que <span className="text-amber-400">Confiam</span>
                        </h2>
                        <p className="text-white/40 max-w-xl mx-auto text-sm">
                            Veja o que profissionais do Direito dizem sobre a experiência com o LumiphotoIA.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                name: 'Dra. Fernanda Costa',
                                role: 'Direito Empresarial',
                                quote: 'Precisava de fotos profissionais para o site do escritório e para o LinkedIn. O resultado ficou melhor do que eu esperava — clientes comentam que as fotos transmitem muita segurança e credibilidade.',
                                avatar: '/ensaios/testimonial-advogada-dra.png',
                            },
                            {
                                name: 'Dr. Marcelo Oliveira',
                                role: 'Direito Tributário',
                                quote: 'Em 3 minutos gerei todas as fotos que precisava para a OAB, redes sociais e cartão profissional. Sem estúdio, sem agendamento, sem complicação. Super prático.',
                                avatar: '/ensaios/testimonial-advogado-dr.png',
                            },
                            {
                                name: 'Dra. Juliana Reis',
                                role: 'Direito de Família',
                                quote: 'A qualidade é impressionante. Parecem fotos de estúdio profissional com iluminação perfeita. Uso no meu perfil da OAB e nas redes sociais — meus colegas sempre perguntam onde fiz.',
                                avatar: '/ensaios/testimonial-advogada-young.png',
                            },
                        ].map((t, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-amber-500/20 transition-all group">
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
                                        className="w-11 h-11 rounded-full object-cover border-2 border-amber-500/30 group-hover:border-amber-500/60 transition-colors"
                                    />
                                    <div>
                                        <p className="text-white font-bold text-sm">{t.name}</p>
                                        <p className="text-amber-400/50 text-xs font-medium">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section id="pricing-section" className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-white/5 relative">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-[0.2em]">
                            <Scale size={12} />
                            Investimento
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight">
                            Invista na Sua <span className="text-amber-400">Imagem</span>
                        </h2>
                        <p className="text-white/30 max-w-lg mx-auto text-sm">
                            Um ensaio fotográfico profissional custa de R$ 500 a R$ 2.000. Com a LumiphotoIA, comece por R$ 57.
                        </p>
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
                            <div key={i} className={`relative rounded-2xl p-6 border transition-all duration-300 ${plan.popular
                                ? 'bg-gradient-to-b from-amber-600/10 to-transparent border-amber-600/30 shadow-[0_0_40px_rgba(217,119,6,0.15)] scale-[1.02]'
                                : 'bg-white/[0.02] border-white/5 hover:border-white/15'
                                }`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-amber-600 to-amber-500 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
                                        ⭐ Mais Vendido
                                    </div>
                                )}

                                <div className="text-center mb-6">
                                    <h3 className={`text-lg font-black ${plan.popular ? 'text-amber-400' : 'text-white/70'}`}>{plan.name}</h3>
                                    <div className="mt-3">
                                        <span className="text-4xl font-black text-white">R$ {plan.price}</span>
                                    </div>
                                    <p className="text-white/30 text-xs mt-1">{plan.credits} créditos • R$ {plan.perCredit}/foto</p>
                                </div>

                                <div className="space-y-2 mb-6">
                                    {plan.features.map((f, j) => (
                                        <div key={j} className="flex items-center gap-2">
                                            <Check size={14} className={plan.popular ? 'text-amber-400 flex-shrink-0' : 'text-emerald-400 flex-shrink-0'} />
                                            <span className="text-white/50 text-xs">{f}</span>
                                        </div>
                                    ))}
                                </div>

                                <button onClick={onGetStarted} className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${plan.popular
                                    ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white hover:shadow-[0_0_30px_rgba(217,119,6,0.4)] hover:scale-[1.02]'
                                    : 'bg-white/5 text-white/70 border border-white/10 hover:bg-white/10'
                                    }`}>
                                    Escolher {plan.name}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-white/20 text-xs mt-8">Pagamento seguro via Mercado Pago • Cartão, Pix ou Boleto</p>
                </div>
            </section>

            {/* ===== CTA FINAL ===== */}
            <section className="py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-600/8 blur-[200px] rounded-full" />
                </div>

                <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
                    <p className="text-white/30 text-sm mb-6 uppercase tracking-widest font-bold">Sua próxima causa começa pela sua imagem</p>

                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-6 leading-tight">
                        Advogados de{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                            sucesso
                        </span>{' '}
                        investem na imagem
                    </h2>

                    <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
                        Enquanto outros advogados usam selfies cortadas, você vai transmitir autoridade e profissionalismo em cada plataforma.
                    </p>

                    <button onClick={scrollToPricing} className="px-12 py-5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-2xl font-black text-lg text-white uppercase tracking-wider hover:shadow-[0_0_60px_rgba(217,119,6,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3 mb-6">
                        Criar Meu Ensaio Profissional
                        <ArrowRight size={22} />
                    </button>

                    <div className="flex flex-wrap justify-center gap-4 text-xs text-white/25">
                        <span className="flex items-center gap-1"><Check size={12} className="text-amber-500" /> Pagamento único</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-amber-500" /> Sem mensalidade</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-amber-500" /> 100% fidelidade</span>
                        <span className="flex items-center gap-1"><Check size={12} className="text-amber-500" /> 30 segundos</span>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FAQSection extraFaqs={advogadoFaqs} accentColor="amber" />

            {/* ===== FOOTER ===== */}
            <footer className="border-t border-white/5 bg-[#030303] py-8">
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
            </footer>

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
        </div>
    );
};
