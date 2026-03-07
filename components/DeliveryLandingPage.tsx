import React from 'react';
import {
    Camera, ArrowRight, Shield, Sparkles,
    DollarSign, Clock, Download, Eye,
    TrendingUp, Image as ImageIcon,
    Target, Award, Flame, Zap, Star
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
        { icon: '🍔', title: 'Hambúrguer & Fast Food', desc: 'Close-ups gourmet com fumaça que dão água na boca.', image: '/delivery/depois-burger.png', hot: true },
        { icon: '🍕', title: 'Pizza & Massas', desc: 'Queijo derretendo do forno. O cliente pede na hora.', image: '/delivery/depois-pizza.png', hot: true },
        { icon: '🍣', title: 'Sushi & Japonês', desc: 'Composição elegante que valoriza cada peça.', image: '/delivery/hero-sushi.png', hot: false },
        { icon: '🍰', title: 'Confeitaria & Doces', desc: 'Brigadeiros, bolos e sobremesas irresistíveis.', image: '/delivery/depois-bolo.png', hot: true },
        { icon: '🥗', title: 'Saudável & Bowls', desc: 'Cores vibrantes que atraem o público fitness.', image: '/delivery/pro-bowl.png', hot: false },
        { icon: '🥩', title: 'Churrasco & Grill', desc: 'Carnes na brasa com textura e suculência.', image: '/delivery/pro-prato.png', hot: false },
    ];

    const steps = [
        { num: '01', title: 'Fotografe o Prato', desc: 'Tire uma foto com o celular. Simples assim.', icon: <Camera size={28} />, color: 'from-orange-500 to-amber-400' },
        { num: '02', title: 'Escolha o Estilo', desc: 'Burger, pizza, sushi, doces — cada tipo tem um preset.', icon: <Sparkles size={28} />, color: 'from-red-500 to-orange-400' },
        { num: '03', title: 'IA Transforma', desc: 'Food photography profissional em 30 segundos.', icon: <Zap size={28} />, color: 'from-amber-500 to-yellow-400' },
        { num: '04', title: 'Use & Venda', desc: 'Cardápio, iFood, Instagram e delivery próprio.', icon: <Download size={28} />, color: 'from-green-500 to-emerald-400' },
    ];

    const benefits = [
        { icon: <DollarSign size={24} />, title: 'R$ 1,17 por Foto', desc: 'Fotógrafo de comida cobra R$ 200+ por prato. Com a Lumi, R$ 1,17.', gradient: 'from-orange-500/20' },
        { icon: <Clock size={24} />, title: '30 Segundos', desc: 'Pare de esperar. Fotos prontas na hora pra subir.', gradient: 'from-amber-500/20' },
        { icon: <Eye size={24} />, title: 'Dá Água na Boca', desc: 'Iluminação e cores que fazem o cliente pedir.', gradient: 'from-red-500/20' },
        { icon: <TrendingUp size={24} />, title: '+400% Pedidos', desc: 'Restaurantes com boas fotos vendem até 4x mais.', gradient: 'from-green-500/20' },
        { icon: <Star size={24} />, title: 'Cardápio Inteiro', desc: 'Fotografe 50 pratos em uma tarde.', gradient: 'from-purple-500/20' },
        { icon: <Shield size={24} />, title: 'Multi-plataforma', desc: 'iFood, Rappi, Uber Eats, Instagram — tudo.', gradient: 'from-blue-500/20' },
    ];

    const beforeAfterPairs = [
        { before: '/delivery/antes-burger.png', after: '/delivery/depois-burger.png', label: 'Hambúrguer' },
        { before: '/delivery/antes-pizza.png', after: '/delivery/depois-pizza.png', label: 'Pizza' },
        { before: '/delivery/antes-bolo.png', after: '/delivery/depois-bolo.png', label: 'Bolo' },
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

            {/* ===== HERO COM ANTES/DEPOIS ===== */}
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
                                Seu prato é{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                                    incrível
                                </span>
                                <br />mas a foto{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
                                    não mostra
                                </span>
                            </h1>

                            <p className="text-base md:text-lg text-white/50 max-w-xl mb-6 leading-relaxed">
                                O cliente abre o iFood, vê uma foto <strong className="text-white/80">escura e sem graça</strong> e pede do concorrente.
                                A IA transforma aquela foto de celular em <strong className="text-orange-400">food photography profissional</strong> em 30 segundos.
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
                                Quero Fotos que Dão Fome
                                <ArrowRight size={22} />
                            </button>

                            <p className="text-white/20 text-xs mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>
                        </div>

                        {/* Right: Before/After Showcase — Desktop */}
                        <div className="hidden lg:block relative">
                            <div className="grid grid-cols-2 gap-4">
                                {/* Before */}
                                <div className="relative rounded-2xl overflow-hidden border border-red-500/30 shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                    <img src="/delivery/antes-burger.png" alt="Antes - foto caseira" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 left-3 px-3 py-1 bg-red-500/80 text-[10px] font-black text-white uppercase tracking-wider rounded-lg">📱 Foto do celular</span>
                                </div>
                                {/* After */}
                                <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-[0_8px_30px_rgba(245,158,11,0.2)] mt-8">
                                    <img src="/delivery/depois-burger.png" alt="Depois - IA profissional" className="w-full h-64 object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <span className="absolute bottom-3 right-3 px-3 py-1 bg-orange-500/90 text-[10px] font-black text-black uppercase tracking-wider rounded-lg">✨ Resultado IA</span>
                                </div>
                            </div>
                            {/* More before/after pairs */}
                            <div className="grid grid-cols-2 gap-2 mt-4">
                                <div className="relative rounded-xl overflow-hidden border border-red-500/20">
                                    <div className="flex relative">
                                        <div className="w-1/2 relative">
                                            <img src="/delivery/antes-pizza.png" alt="Antes pizza" className="w-full h-20 object-cover" />
                                            <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-red-500/70 text-[7px] font-black text-white uppercase rounded">antes</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/delivery/depois-pizza.png" alt="Depois pizza" className="w-full h-20 object-cover" />
                                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-orange-500/90 text-[7px] font-black text-black uppercase rounded">depois</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                            <ArrowRight size={8} className="text-black" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[8px] font-black text-white/50 py-1 bg-black/40">🍕 Pizza</p>
                                </div>
                                <div className="relative rounded-xl overflow-hidden border border-red-500/20">
                                    <div className="flex relative">
                                        <div className="w-1/2 relative">
                                            <img src="/delivery/antes-bolo.png" alt="Antes bolo" className="w-full h-20 object-cover" />
                                            <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-red-500/70 text-[7px] font-black text-white uppercase rounded">antes</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/delivery/depois-bolo.png" alt="Depois bolo" className="w-full h-20 object-cover" />
                                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-orange-500/90 text-[7px] font-black text-black uppercase rounded">depois</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                            <ArrowRight size={8} className="text-black" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[8px] font-black text-white/50 py-1 bg-black/40">🍰 Bolo</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-orange-400 text-xs font-black text-center">📱 → ✨ De caseira a profissional em 30s</p>
                            </div>
                        </div>

                        {/* Mobile Carousel — Before/After */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {beforeAfterPairs.map((pair, i) => (
                                    <div key={i} className="flex-shrink-0 w-64 rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-white/[0.02]">
                                        <div className="flex relative">
                                            <div className="w-1/2 relative">
                                                <img src={pair.before} alt={`Antes ${pair.label}`} className="w-full h-36 object-cover" />
                                                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-red-500/70 text-[8px] font-black text-white uppercase rounded">📱 Antes</span>
                                            </div>
                                            <div className="w-1/2 relative">
                                                <img src={pair.after} alt={`Depois ${pair.label}`} className="w-full h-36 object-cover" />
                                                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-orange-500/90 text-[8px] font-black text-black uppercase rounded">✨ IA</span>
                                            </div>
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                                <ArrowRight size={10} className="text-black" />
                                            </div>
                                        </div>
                                        <div className="p-2 text-center">
                                            <p className="text-white/50 text-[10px] font-bold">{pair.label} — Antes & Depois</p>
                                        </div>
                                    </div>
                                ))}
                                {/* Extra individual result cards */}
                                {[
                                    { img: '/delivery/pro-doces.png', label: 'Doces Artesanais' },
                                    { img: '/delivery/pro-prato.png', label: 'Churrasco Premium' },
                                ].map((s, i) => (
                                    <div key={`extra-${i}`} className="flex-shrink-0 w-36 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
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

            {/* ===== DOR: COMIDA BONITA, FOTO FEIA ===== */}
            <section className="py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/5 via-transparent to-orange-600/5" />
                <div className="max-w-5xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Comida bonita, foto <span className="text-red-400">feia</span> = <span className="text-red-400">pedido perdido</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            No iFood e no Instagram, a primeira coisa que o cliente vê é a foto. Se não dá fome, ele passa pro próximo.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                            <div className="text-red-400 text-2xl mb-3">📸</div>
                            <h3 className="text-white font-bold text-sm mb-1">Foto de celular sem iluminação</h3>
                            <p className="text-white/40 text-xs">Prato bonito parece comida requentada. Cliente não pede.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                            <div className="text-red-400 text-2xl mb-3">💸</div>
                            <h3 className="text-white font-bold text-sm mb-1">Fotógrafo de comida: R$ 200+ por prato</h3>
                            <p className="text-white/40 text-xs">E o cardápio muda todo mês. Insustentável.</p>
                        </div>
                        <div className="p-5 rounded-2xl border border-orange-500/20 bg-orange-500/5">
                            <div className="text-orange-400 text-2xl mb-3">✨</div>
                            <h3 className="text-white font-bold text-sm mb-1">Com a Lumi: R$ 1,17 e 30 segundos</h3>
                            <p className="text-white/40 text-xs">Food photography profissional. Cardápio inteiro em uma tarde.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== ANTES/DEPOIS COMPLETO ===== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <ImageIcon size={12} />
                            Antes & Depois
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Veja a <span className="text-orange-400">transformação</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            Foto de celular → food photography de restaurante premiado. Em 30 segundos.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {beforeAfterPairs.map((pair, i) => (
                            <div key={i} className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                                <div className="relative">
                                    <div className="grid grid-cols-2">
                                        <div className="relative">
                                            <img src={pair.before} alt={`Antes ${pair.label}`} className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            <span className="absolute top-2 left-2 px-2 py-0.5 bg-red-500/80 text-[9px] font-black text-white uppercase rounded-full">📱 Antes</span>
                                        </div>
                                        <div className="relative">
                                            <img src={pair.after} alt={`Depois ${pair.label}`} className="w-full h-48 object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                                            <span className="absolute top-2 right-2 px-2 py-0.5 bg-orange-500/90 text-[9px] font-black text-black uppercase rounded-full">✨ Depois</span>
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center shadow-xl z-10 border-2 border-white/20">
                                        <ArrowRight size={14} className="text-black" />
                                    </div>
                                </div>
                                <div className="p-4 text-center border-t border-white/5">
                                    <p className="text-white font-bold text-sm">{pair.label}</p>
                                    <p className="text-orange-400/60 text-[10px] font-black uppercase tracking-wider mt-0.5">30 segundos com IA</p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                            Fotos que fazem o cliente <span className="text-orange-400">pedir agora</span>
                        </h2>
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
                            De foto do <span className="text-red-400">celular</span> a <span className="text-orange-400">cardápio premium</span>
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

            {/* ===== BENEFÍCIOS ===== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <Award size={12} />
                            Vantagens
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Chega de <span className="text-red-400">perder pedidos</span> por foto feia
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
                        Cada dia sem boas fotos é <span className="text-red-400">dinheiro perdido</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-10">
                        Enquanto você espera, o concorrente com fotos profissionais leva seus clientes. Resolva isso em 30 segundos.
                    </p>
                    <button onClick={onGetStarted} className="px-12 py-5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl font-black text-lg text-black uppercase tracking-wider hover:shadow-[0_0_50px_rgba(245,158,11,0.4)] hover:scale-[1.03] active:scale-[0.97] transition-all duration-300 inline-flex items-center gap-3">
                        Quero Fotos que Vendem
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
