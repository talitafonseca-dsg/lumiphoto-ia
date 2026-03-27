import React, { useEffect } from 'react';
import {
    ArrowRight, Shield, Sparkles,
    DollarSign, Clock, Download, Eye,
    TrendingUp, Image as ImageIcon,
    ShoppingBag, Package, Users,
    Target, Award, Zap
} from 'lucide-react';
import FAQSection, { varejoFaqs } from './FAQSection';

interface VarejoLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;
}

export const VarejoLandingPage: React.FC<VarejoLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {

    useEffect(() => {
        if (typeof (window as any).trackPro === 'function') {
            (window as any).trackPro('ViewContent', {
                custom_data: {
                    content_name: 'LumiPhoto Varejo',
                    content_category: 'varejo',
                    content_type: 'product',
                },
            });
        }
    }, []);

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const segments = [
        { icon: '👗', title: 'Moda & Fashion', desc: 'Lookbooks e editoriais que fazem a peça vender sozinha.', image: '/varejo/pro-vestido.png', hot: true },
        { icon: '💎', title: 'Joias & Relógios', desc: 'Close-ups luxury que transmitem o valor real da peça.', image: '/varejo/pro-relogio.png', hot: true },
        { icon: '💄', title: 'Cosméticos & Beauty', desc: 'Texturas, cores e acabamento de editorial de beleza.', image: '/varejo/cosmeticos.png', hot: false },
        { icon: '👟', title: 'Calçados & Esporte', desc: 'Fotos limpas que destacam cada detalhe do produto.', image: '/varejo/pro-tenis.png', hot: false },
        { icon: '👜', title: 'Bolsas & Acessórios', desc: 'Lifestyle shots que criam desejo imediato.', image: '/varejo/pro-bolsa.png', hot: true },
        { icon: '📱', title: 'Eletrônicos & Tech', desc: 'Fundo dark premium que valoriza cada gadget.', image: '/varejo/eletronicos.png', hot: false },
    ];

    const steps = [
        { num: '01', title: 'Suba o Produto', desc: 'Tire uma foto do produto com o celular. Simples assim.', icon: <Package size={28} />, color: 'from-emerald-500 to-green-400' },
        { num: '02', title: 'Modelo ou Avatar', desc: 'Para moda: suba selfie da modelo ou ative o avatar IA.', icon: <Users size={28} />, color: 'from-blue-500 to-cyan-400' },
        { num: '03', title: 'Escolha o Estilo', desc: 'Lookbook, fundo branco, lifestyle — 9 presets prontos.', icon: <Sparkles size={28} />, color: 'from-purple-500 to-pink-400' },
        { num: '04', title: 'Baixe & Venda', desc: '3 fotos profissionais em 30s. Alta resolução.', icon: <Download size={28} />, color: 'from-amber-500 to-yellow-400' },
    ];

    const benefits = [
        { icon: <DollarSign size={24} />, title: 'Economia de 95%', desc: 'Fotógrafo cobra R$ 2.000+. Com a IA, cada foto sai por R$ 1,17.', gradient: 'from-emerald-500/20' },
        { icon: <Clock size={24} />, title: '30 Segundos', desc: 'Catálogo inteiro pronto em minutos, não semanas.', gradient: 'from-blue-500/20' },
        { icon: <Eye size={24} />, title: '100% Realista', desc: 'Ninguém percebe que é IA. Qualidade de estúdio.', gradient: 'from-purple-500/20' },
        { icon: <TrendingUp size={24} />, title: '+300% Vendas', desc: 'Fotos profissionais vendem até 3x mais.', gradient: 'from-amber-500/20' },
        { icon: <ShoppingBag size={24} />, title: 'Multi-canal', desc: 'Shopee, ML, Instagram, sua loja — tudo perfeito.', gradient: 'from-pink-500/20' },
        { icon: <Shield size={24} />, title: 'Uso Comercial', desc: 'Catálogos, anúncios, marketplaces — liberado.', gradient: 'from-teal-500/20' },
    ];

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 md:h-10 w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[11px] md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMI<span className="text-white">IA</span></span>
                            <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.15em] text-teal-400">🛍️ Varejo</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onLogin || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Entrar</button>
                        <button onClick={onViewStudio || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Estúdio</button>
                        <button onClick={scrollToPricing} className="px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-lg font-black text-[10px] text-black uppercase tracking-wide hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all whitespace-nowrap">Ver Pacotes</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-emerald-500/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-green-500/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left min-w-0 overflow-hidden">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <ShoppingBag size={14} />
                                Para Lojistas & E-commerce
                            </div>

                            <h1 className="text-[1.6rem] sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6 break-words">
                                Seus produtos{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                                    não vendem
                                </span>
                                <br />por causa das{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                                    fotos
                                </span>
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-full md:max-w-xl mb-6 leading-relaxed break-words">
                                O cliente scrolla, vê uma foto escura tirada na mesa da cozinha e <strong className="text-white/80">ignora seu produto</strong>. Enquanto o concorrente com fotos profissionais
                                vende <strong className="text-emerald-400">3x mais</strong>. A IA resolve isso em 30 segundos.
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

                            <button onClick={scrollToPricing} className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                                Quero Fotos que Vendem
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>
                        </div>

                        {/* Right: Product Showcase — Desktop */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <img src="/varejo/pro-vestido.png" alt="Moda Fashion" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-emerald-500/90 text-[10px] font-black text-black uppercase tracking-wider rounded-lg">👗 Moda</span>
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border-2 border-amber-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.2)] mt-8">
                                    <img src="/varejo/pro-relogio.png" alt="Relógio Luxury" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-amber-500/90 text-[10px] font-black text-black uppercase tracking-wider rounded-lg">⌚ Luxury</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[
                                    { img: '/varejo/pro-bolsa.png', label: 'Bolsas' },
                                    { img: '/varejo/pro-tenis.png', label: 'Calçados' },
                                    { img: '/varejo/cosmeticos.png', label: 'Cosméticos' },
                                ].map((s, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                                        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <p className="absolute bottom-1 left-1 text-[8px] font-black text-white/80 uppercase">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-emerald-400 text-xs font-black text-center">🛍️ Fotos que despertam desejo</p>
                            </div>
                        </div>

                        {/* Mobile Carousel */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[
                                    { img: '/varejo/pro-vestido.png', label: 'Moda Fashion' },
                                    { img: '/varejo/pro-relogio.png', label: 'Relógio Luxury' },
                                    { img: '/varejo/pro-bolsa.png', label: 'Bolsa Premium' },
                                    { img: '/varejo/pro-tenis.png', label: 'Calçados' },
                                ].map((s, i) => (
                                    <div key={i} className="flex-shrink-0 w-44 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
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

            {/* ===== DOR: FOTOS RUINS ===== */}
            <section className="py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-emerald-600/5" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Foto ruim <span className="text-red-400">= venda perdida</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            72% dos consumidores decidem pela compra baseados na foto. Seu produto pode ser incrível, mas se a foto não transmite isso, o cliente não compra.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                            <div className="text-red-400 text-2xl mb-3">😤</div>
                            <h3 className="text-white font-bold text-sm mb-1">Foto escura e sem foco</h3>
                            <p className="text-white/40 text-xs">Cliente scrolla e ignora. Produto invisível entre milhares.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                            <div className="text-red-400 text-2xl mb-3">💸</div>
                            <h3 className="text-white font-bold text-sm mb-1">Fotógrafo cobra R$ 2.000+</h3>
                            <p className="text-white/40 text-xs">E você precisa fotografar 50 produtos novos todo mês.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5">
                            <div className="text-emerald-400 text-2xl mb-3">✨</div>
                            <h3 className="text-white font-bold text-sm mb-1">Com a Lumi: R$ 1,17/foto</h3>
                            <p className="text-white/40 text-xs">Fotos profissionais em 30s. Catálogo completo em uma tarde.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== SEGMENTOS COM IMAGENS ===== */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Target size={12} />
                            Segmentos
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Fotos que <span className="text-emerald-400">Despertam Desejo</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            Cada segmento tem presets únicos. A IA entende seu produto.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {segments.map((seg, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/30 transition-all duration-300 group cursor-pointer bg-white/[0.02]">
                                {seg.hot && (
                                    <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-emerald-500 text-black text-[9px] font-black uppercase tracking-wider rounded-full">
                                        Popular
                                    </span>
                                )}
                                <div className="relative h-40 overflow-hidden">
                                    <img src={seg.image} alt={seg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/50 to-transparent" />
                                </div>
                                <div className="p-5 -mt-4 relative">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-2xl">{seg.icon}</span>
                                        <h3 className="text-white font-bold text-base group-hover:text-emerald-300 transition-colors">{seg.title}</h3>
                                    </div>
                                    <p className="text-white/40 text-sm leading-relaxed">{seg.desc}</p>
                                </div>
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
                            De foto <span className="text-red-400">amadora</span> a <span className="text-emerald-400">catálogo</span> em 30s
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

            {/* ===== GALERIA — TODAS IMAGENS ÚNICAS ===== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <ImageIcon size={12} />
                            Resultados Reais
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Seu cliente <span className="text-emerald-400">vai querer</span> comprar
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { img: '/varejo/hero-moda.png', label: 'Lookbook Fashion' },
                            { img: '/varejo/hero-joias.png', label: 'Joias Premium' },
                            { img: '/varejo/eletronicos.png', label: 'Tech Dark' },
                            { img: '/studio-styles/ecommerce_clean.png', label: 'E-commerce Clean' },
                        ].map((item, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-square">
                                <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="text-white text-xs font-bold">{item.label}</p>
                                    <p className="text-emerald-400 text-[9px] font-black uppercase tracking-wider">Gerado com IA ✨</p>
                                </div>
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
                            Chega de <span className="text-red-400">perder vendas</span> por foto ruim
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
                        Pare de <span className="text-red-400">perder</span> e comece a <span className="text-emerald-400">vender</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-10">
                        Cada dia com fotos ruins é dinheiro perdido. Comece hoje por menos do que um café.
                    </p>
                    <button onClick={onGetStarted} className="px-12 py-5 bg-gradient-to-r from-emerald-500 to-green-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(16,185,129,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                        Quero Fotos Profissionais
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

            {/* ===== MP CREDIBILITY BAR ===== */}
            <div className="border-t border-white/5 bg-[#050505] py-5 px-6">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <div className="flex items-center gap-2">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="opacity-50"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#00B1EA" stroke="none" /></svg>
                        <span className="text-white/40 text-[11px] font-bold">Pagamento Seguro</span>
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

export default VarejoLandingPage;
