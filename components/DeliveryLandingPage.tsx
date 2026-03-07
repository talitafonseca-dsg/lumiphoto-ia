import React, { useState } from 'react';
import {
    Camera, Check, Star, Zap, ArrowRight, Shield, Sparkles,
    Users, DollarSign, Clock, Download, Eye, MessageCircle,
    ChevronDown, TrendingUp, Image as ImageIcon,
    Target, Heart, Award, Flame
} from 'lucide-react';
import FAQSection, { deliveryFaqs } from './FAQSection';

interface DeliveryLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;
}

export const DeliveryLandingPage: React.FC<DeliveryLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {

    const scrollToPricing = () => {
        const el = document.getElementById('pricing-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
    };

    const segments = [
        { icon: '🍔', title: 'Hambúrguer & Fast Food', desc: 'Burgers gourmet com fumaça e close-ups irresistíveis.', image: '/delivery/hero-burger.png', hot: true },
        { icon: '🍕', title: 'Pizza & Massas', desc: 'Pizza artesanal com queijo derretendo do forno.', image: '/delivery/pizza.png', hot: true },
        { icon: '🍣', title: 'Sushi & Japonês', desc: 'Composição profissional elegante e colorida.', image: '/delivery/hero-sushi.png', hot: false },
        { icon: '🍰', title: 'Confeitaria & Doces', desc: 'Bolos, brigadeiros, trufas e sobremesas artesanais.', image: '/studio-styles/gastronomia.png', hot: true },
        { icon: '🫐', title: 'Açaí & Bowls', desc: 'Bowls vibrantes e coloridos para redes sociais.', image: '/delivery/acai.png', hot: false },
        { icon: '☕', title: 'Café & Padaria', desc: 'Café artesanal, pães, croissants e brunchs.', image: '/studio-styles/coffee_shop.png', hot: false },
    ];

    const steps = [
        { num: '01', title: 'Fotografe o Prato', desc: 'Tire uma foto do prato com o celular. Não precisa ser perfeita.', icon: <Camera size={28} />, color: 'from-orange-500 to-amber-400' },
        { num: '02', title: 'Escolha o Estilo', desc: 'Burger, pizza, sushi, doces — cada tipo tem um preset.', icon: <Sparkles size={28} />, color: 'from-red-500 to-orange-400' },
        { num: '03', title: 'IA Transforma', desc: 'Food photography profissional em 30 segundos.', icon: <Zap size={28} />, color: 'from-amber-500 to-yellow-400' },
        { num: '04', title: 'Use & Venda', desc: 'Cardápio, iFood, Instagram e delivery próprio.', icon: <Download size={28} />, color: 'from-green-500 to-emerald-400' },
    ];

    const benefits = [
        { icon: <DollarSign size={24} />, title: 'R$ 1,17 por Foto', desc: 'Fotógrafo de comida cobra R$ 200+ por prato. Com a Lumi, menos de R$ 2.', gradient: 'from-orange-500/20' },
        { icon: <Clock size={24} />, title: '30 Segundos', desc: 'Pare de esperar dias. Fotos prontas na hora.', gradient: 'from-amber-500/20' },
        { icon: <Eye size={24} />, title: 'Dá Água na Boca', desc: 'Iluminação e cores que fazem o cliente pedir.', gradient: 'from-red-500/20' },
        { icon: <TrendingUp size={24} />, title: '+400% Pedidos', desc: 'Restaurantes com fotos profissionais vendem até 4x mais.', gradient: 'from-green-500/20' },
        { icon: <Star size={24} />, title: 'Cardápio Completo', desc: 'Fotografe 50 pratos em uma tarde.', gradient: 'from-purple-500/20' },
        { icon: <Shield size={24} />, title: 'Multi-plataforma', desc: 'iFood, Rappi, Uber Eats, Instagram — tudo.', gradient: 'from-blue-500/20' },
    ];

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-7 w-auto object-contain" />
                        <span className="hidden sm:inline text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMIPHOTO<span className="text-white">IA</span></span>
                    </div>
                    <div className="flex items-center gap-3">
                        <button onClick={onLogin || onGetStarted} className="px-4 py-2 text-white/50 text-xs font-bold hover:text-white/80 transition-colors">Entrar</button>
                        <button onClick={onViewStudio || onGetStarted} className="px-4 py-2 text-white/50 text-xs font-bold hover:text-white/80 transition-colors">Ver Estúdio</button>
                        <button onClick={scrollToPricing} className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-400 rounded-lg font-black text-xs text-black uppercase tracking-wider hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all">Escolher Pacote</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <Flame size={14} />
                                Para Restaurantes & Delivery
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.95] tracking-tight mb-6">
                                Fotos de{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                                    Comida
                                </span>
                                <br />que{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                                    Vendem
                                </span>
                                <br />com{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-300">
                                    IA
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white/50 max-w-xl mb-6 leading-relaxed">
                                Transforme fotos de celular em <strong className="text-white/80">food photography profissional</strong> em 30 segundos.
                                Hambúrguer, pizza, sushi, doces — qualquer prato.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Zap size={11} className="text-orange-400" /> R$ 1,17/foto
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Clock size={11} className="text-orange-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Shield size={11} className="text-orange-400" /> Para iFood & delivery
                                </span>
                            </div>

                            <button onClick={scrollToPricing} className="px-10 py-5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                                Começar Agora
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>
                        </div>

                        {/* Right: Food Showcase — Desktop */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <img src="/delivery/hero-burger.png" alt="Burger Gourmet" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-orange-500/90 text-[10px] font-black text-black uppercase tracking-wider rounded-lg">🍔 Burger</span>
                                </div>
                                <div className="relative rounded-2xl overflow-hidden border-2 border-red-500/40 shadow-[0_8px_30px_rgba(239,68,68,0.2)] mt-8">
                                    <img src="/delivery/pizza.png" alt="Pizza Artesanal" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-red-500/90 text-[10px] font-black text-white uppercase tracking-wider rounded-lg">🍕 Pizza</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-4">
                                {[
                                    { img: '/delivery/hero-sushi.png', label: 'Sushi' },
                                    { img: '/delivery/acai.png', label: 'Açaí' },
                                    { img: '/studio-styles/coffee_shop.png', label: 'Café' },
                                ].map((s, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square border border-white/10">
                                        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                        <p className="absolute bottom-1 left-1 text-[8px] font-black text-white/80 uppercase">{s.label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-orange-400 text-xs font-black text-center">🍕 Fotos que dão fome</p>
                            </div>
                        </div>

                        {/* Mobile Carousel */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {[
                                    { img: '/delivery/hero-burger.png', label: 'Burger Gourmet' },
                                    { img: '/delivery/pizza.png', label: 'Pizza Artesanal' },
                                    { img: '/delivery/hero-sushi.png', label: 'Sushi Japonês' },
                                    { img: '/delivery/acai.png', label: 'Açaí & Bowls' },
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

            {/* ===== PROVA SOCIAL ===== */}
            <section className="py-8 border-y border-white/5 bg-white/[0.01]">
                <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                    {[
                        { metric: '5.000+', label: 'Fotos de pratos geradas' },
                        { metric: '300+', label: 'Restaurantes ativos' },
                        { metric: '4.9★', label: 'Avaliação média' },
                        { metric: '30s', label: 'Tempo por foto' },
                    ].map((item, i) => (
                        <div key={i}>
                            <div className="text-2xl md:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">{item.metric}</div>
                            <div className="text-white/40 text-xs mt-1">{item.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ===== SEGMENTOS COM IMAGENS ===== */}
            <section className="py-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Target size={12} />
                            Tipos de Comida
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Para Todo Tipo de <span className="text-orange-400">Culinária</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            Presets especializados para cada tipo de comida. Fotos que dão fome.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {segments.map((seg, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-300 group cursor-pointer bg-white/[0.02]">
                                {seg.hot && (
                                    <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-orange-500 text-black text-[9px] font-black uppercase tracking-wider rounded-full">
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
                                        <h3 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">{seg.title}</h3>
                                    </div>
                                    <p className="text-white/40 text-sm leading-relaxed">{seg.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-24 px-6 bg-gradient-to-b from-orange-600/5 via-transparent to-transparent border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Sparkles size={12} />
                            Simples & Rápido
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Como <span className="text-orange-400">Funciona</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="relative group">
                                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all duration-300 h-full">
                                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${step.color} mb-4`}>
                                        <span className="text-black">{step.icon}</span>
                                    </div>
                                    <div className="text-orange-500/30 text-xs font-black uppercase tracking-widest mb-2">Passo {step.num}</div>
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

            {/* ===== GALERIA DE RESULTADOS ===== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <ImageIcon size={12} />
                            Resultados Reais
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Food Photography <span className="text-orange-400">Profissional</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {[
                            { img: '/delivery/hero-burger.png', label: 'Burger Gourmet' },
                            { img: '/delivery/pizza.png', label: 'Pizza Artesanal' },
                            { img: '/delivery/hero-sushi.png', label: 'Sushi Japonês' },
                            { img: '/delivery/acai.png', label: 'Açaí & Bowls' },
                        ].map((item, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden border border-white/10 group aspect-square">
                                <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                <div className="absolute bottom-3 left-3 right-3">
                                    <p className="text-white text-xs font-bold">{item.label}</p>
                                    <p className="text-orange-400 text-[9px] font-black uppercase tracking-wider">Gerado com IA ✨</p>
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
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Award size={12} />
                            Vantagens
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Por que <span className="text-orange-400">Restaurantes</span> Escolhem a Lumi
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className={`relative p-6 rounded-2xl border border-white/5 bg-gradient-to-br ${b.gradient} to-transparent hover:border-orange-500/20 transition-all duration-300 overflow-hidden`}>
                                <div className="text-orange-400 mb-4">{b.icon}</div>
                                <h3 className="text-white font-bold text-base mb-2">{b.title}</h3>
                                <p className="text-white/40 text-sm leading-relaxed">{b.desc}</p>
                                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/[0.02] rounded-full blur-xl" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== CTA FINAL ===== */}
            <section id="pricing-section" className="py-24 px-6 bg-gradient-to-t from-orange-600/10 via-orange-600/5 to-transparent border-t border-white/5">
                <div className="max-w-3xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                        <DollarSign size={12} />
                        Investimento
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tight mb-4">
                        Venda <span className="text-orange-400">Mais</span> com Fotos que Dão Fome
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-10">
                        Fotos profissionais de comida a partir de R$ 1,17 cada. Pagamento único, sem mensalidade.
                    </p>
                    <button onClick={onGetStarted} className="px-12 py-5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                        Escolher Meu Pacote
                        <ArrowRight size={22} />
                    </button>
                    <p className="text-white/20 text-xs mt-4">Sem mensalidade • Uso comercial incluído • Suporte por WhatsApp</p>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <FAQSection extraFaqs={deliveryFaqs} accentColor="amber" />

            {/* ===== FOOTER ===== */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-white/20 text-xs">© 2025 LumiphotoIA — Food photography profissional com IA</p>
                </div>
            </footer>
        </div>
    );
};

export default DeliveryLandingPage;
