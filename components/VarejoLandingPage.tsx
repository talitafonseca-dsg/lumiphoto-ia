import React, { useState } from 'react';
import {
    Camera, Check, Star, Zap, ArrowRight, Shield, Sparkles,
    Users, DollarSign, Clock, Download, Eye, MessageCircle,
    ChevronDown, TrendingUp, Image as ImageIcon,
    ShoppingBag, Package, Gem, Palette, Shirt, Smartphone,
    Target, Heart, Award
} from 'lucide-react';
import FAQSection, { varejoFaqs } from './FAQSection';

interface VarejoLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;
}

export const VarejoLandingPage: React.FC<VarejoLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {
    const [activeSegment, setActiveSegment] = useState(0);

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const segments = [
        { icon: '👗', title: 'Moda & Fashion', desc: 'Lookbooks, flat lays e editoriais de moda para catálogos e redes sociais.', hot: true },
        { icon: '💎', title: 'Joias & Acessórios', desc: 'Close-ups luxury com iluminação profissional. Joias, óculos, bolsas.', hot: true },
        { icon: '💄', title: 'Cosméticos & Beauty', desc: 'Produtos de beleza com texturas, cores e acabamento premium.', hot: false },
        { icon: '📱', title: 'Eletrônicos & Tech', desc: 'Gadgets e dispositivos em fundo dark premium ou minimalista.', hot: false },
        { icon: '🛍️', title: 'E-commerce Geral', desc: 'Fundo branco para marketplaces. Shopee, Mercado Livre, Amazon.', hot: true },
        { icon: '🏠', title: 'Lifestyle Shot', desc: 'Produto em contexto real. Cenário natural para Instagram e anúncios.', hot: false },
    ];

    const steps = [
        { num: '01', title: 'Suba o Produto', desc: 'Tire uma foto do produto com o celular. Não precisa ser profissional.', icon: <Package size={28} />, color: 'from-emerald-500 to-green-400' },
        { num: '02', title: 'Modelo ou Avatar', desc: 'Para moda: suba selfie da modelo ou ative o avatar para vestir a peça.', icon: <Users size={28} />, color: 'from-blue-500 to-cyan-400' },
        { num: '03', title: 'Escolha o Estilo', desc: 'Lookbook, editorial, fundo branco, lifestyle — 9 presets especializados.', icon: <Sparkles size={28} />, color: 'from-purple-500 to-pink-400' },
        { num: '04', title: 'Baixe & Venda', desc: '3 fotos profissionais em 30 segundos. Alta resolução para qualquer uso.', icon: <Download size={28} />, color: 'from-amber-500 to-yellow-400' },
    ];

    const benefits = [
        { icon: <DollarSign size={24} />, title: 'Economia de 95%', desc: 'Fotógrafo de produto cobra R$ 2.000+. Com a IA, cada foto sai por R$ 1,17.', gradient: 'from-emerald-500/20' },
        { icon: <Clock size={24} />, title: '30 Segundos', desc: 'Catálogo inteiro de fotos profissionais pronto em minutos, não semanas.', gradient: 'from-blue-500/20' },
        { icon: <Eye size={24} />, title: '100% Realista', desc: 'Qualidade de estúdio profissional. Ninguém percebe que é gerado por IA.', gradient: 'from-purple-500/20' },
        { icon: <TrendingUp size={24} />, title: '+300% Vendas', desc: 'Produtos com fotos profissionais vendem até 3x mais em qualquer plataforma.', gradient: 'from-amber-500/20' },
        { icon: <ShoppingBag size={24} />, title: 'Multi-canal', desc: 'Shopee, Mercado Livre, Instagram, sua loja — fotos perfeitas para tudo.', gradient: 'from-pink-500/20' },
        { icon: <Shield size={24} />, title: 'Uso Comercial', desc: 'Licença comercial incluída. Use em catálogos, anúncios e marketplaces.', gradient: 'from-teal-500/20' },
    ];

    const socialProof = [
        { metric: '10.000+', label: 'Fotos de produtos geradas' },
        { metric: '500+', label: 'Lojistas ativos' },
        { metric: '4.9★', label: 'Avaliação média' },
        { metric: '30s', label: 'Tempo por foto' },
    ];

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-7 w-auto object-contain" />
                        <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMIPHOTO<span className="text-white">IA</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={onLogin || onGetStarted}
                            className="px-4 py-2 text-white/50 text-xs font-bold hover:text-white/80 transition-colors"
                        >
                            Entrar
                        </button>
                        <button
                            onClick={onViewStudio || onGetStarted}
                            className="px-4 py-2 text-white/50 text-xs font-bold hover:text-white/80 transition-colors"
                        >
                            Ver Estúdio
                        </button>
                        <button
                            onClick={scrollToPricing}
                            className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-400 rounded-lg font-black text-xs text-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                        >
                            Escolher Pacote
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        {/* Left: Text */}
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <ShoppingBag size={14} />
                                Para Lojistas & E-commerce
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6">
                                Fotos de{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                                    Produtos
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                                    Profissionais
                                </span>
                                <br />com{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                                    IA
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white/50 max-w-xl mb-6 leading-relaxed">
                                Transforme fotos de celular em <strong className="text-white/80">imagens de catálogo profissional</strong> em 30 segundos.
                                Moda, joias, cosméticos, eletrônicos — qualquer produto.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Zap size={11} className="text-emerald-400" /> R$ 1,17/foto
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Clock size={11} className="text-emerald-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Shield size={11} className="text-emerald-400" /> Uso comercial
                                </span>
                            </div>

                            <button
                                onClick={scrollToPricing}
                                className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3"
                            >
                                Começar Agora
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>
                        </div>

                        {/* Right: Product Showcase */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Showcase cards with emojis */}
                                <div className="relative rounded-2xl overflow-hidden border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 to-transparent p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <div className="text-5xl mb-3">👗</div>
                                    <h3 className="text-white font-bold text-sm">Moda</h3>
                                    <p className="text-white/40 text-xs mt-1">Lookbook & Editorial</p>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border border-amber-500/20 bg-gradient-to-br from-amber-500/10 to-transparent p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mt-8">
                                    <div className="text-5xl mb-3">💎</div>
                                    <h3 className="text-white font-bold text-sm">Joias</h3>
                                    <p className="text-white/40 text-xs mt-1">Luxury Close-up</p>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl" />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border border-pink-500/20 bg-gradient-to-br from-pink-500/10 to-transparent p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <div className="text-5xl mb-3">💄</div>
                                    <h3 className="text-white font-bold text-sm">Cosméticos</h3>
                                    <p className="text-white/40 text-xs mt-1">Beauty Premium</p>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl" />
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-transparent p-6 shadow-[0_8px_30px_rgba(0,0,0,0.5)] mt-8">
                                    <div className="text-5xl mb-3">📱</div>
                                    <h3 className="text-white font-bold text-sm">Eletrônicos</h3>
                                    <p className="text-white/40 text-xs mt-1">Tech Dark</p>
                                    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SOCIAL PROOF BAR ===== */}
            <section className="py-8 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {socialProof.map((item, i) => (
                        <div key={i}>
                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">{item.metric}</div>
                            <div className="text-white/40 text-xs mt-1">{item.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== SEGMENTOS ===== */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Target size={12} />
                            Segmentos
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Para Qualquer Tipo de <span className="text-emerald-400">Produto</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            Presets especializados para cada segmento do varejo. Fotos que vendem.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {segments.map((seg, i) => (
                            <div
                                key={i}
                                className="relative p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-300 group cursor-pointer"
                            >
                                {seg.hot && (
                                    <span className="absolute -top-2 right-4 px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider rounded-full">
                                        Popular
                                    </span>
                                )}
                                <div className="text-4xl mb-4">{seg.icon}</div>
                                <h3 className="text-white font-bold text-base mb-2 group-hover:text-emerald-300 transition-colors">{seg.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{seg.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-24 px-6 bg-gradient-to-b from-emerald-600/5 via-transparent to-transparent border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} />
                            Simples & Rápido
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Como <span className="text-emerald-400">Funciona</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all duration-300 h-full">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} mb-4`}>
                                        <span className="text-black">{step.icon}</span>
                                    </div>
                                    <div className="text-emerald-500/30 text-xs font-black uppercase tracking-widest mb-2">Passo {step.num}</div>
                                    <h3 className="text-white font-bold text-base mb-2">{step.title}</h3>
                                    <p className="text-white/40 text-sm">{step.desc}</p>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-white/10">
                                        <ArrowRight size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== BENEFÍCIOS ===== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Award size={12} />
                            Vantagens
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Por que <span className="text-emerald-400">Lojistas</span> Escolhem a Lumi
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className={`relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br ${b.gradient} to-transparent hover:border-emerald-500/20 transition-all duration-300 overflow-hidden`}>
                                <div className="text-emerald-400 mb-4">{b.icon}</div>
                                <h3 className="text-white font-bold text-base mb-2">{b.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{b.desc}</p>
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.02] rounded-full blur-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA FINAL ===== */}
            <section id="pricing-section" className="py-24 px-6 bg-gradient-to-t from-emerald-600/10 via-emerald-600/5 to-transparent border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <DollarSign size={12} />
                        Investimento
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                        Comece a Vender <span className="text-emerald-400">Mais</span> Hoje
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-10">
                        Fotos profissionais de produtos a partir de R$ 1,17 cada. Pagamento único, sem mensalidade, sem surpresas.
                    </p>
                    <button
                        onClick={onGetStarted}
                        className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3"
                    >
                        Escolher Meu Pacote
                        <ArrowRight size={22} />
                    </button>
                    <p className="text-white/20 text-xs mt-4">Sem mensalidade • Uso comercial incluído • Suporte por WhatsApp</p>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FAQSection extraFaqs={varejoFaqs} accentColor="emerald" />

            {/* ===== FOOTER ===== */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-white/20 text-xs">© 2025 LumiphotoIA — Fotos profissionais de produtos com IA</p>
                </div>
            </footer>
        </div>
    );
};

export default VarejoLandingPage;
