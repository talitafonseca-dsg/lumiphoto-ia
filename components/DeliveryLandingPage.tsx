import React from 'react';
import {
    ArrowRight, Shield, Sparkles,
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
        { icon: '🍔', title: 'Hambúrguer & Fast Food', desc: 'Close-ups gourmet com fumaça que dão água na boca.', image: '/delivery/depois-burger.png', lifestyle: '/delivery/lifestyle-burger.png', hot: true },
        { icon: '🍕', title: 'Pizza & Massas', desc: 'Queijo derretendo do forno. O cliente pede na hora.', image: '/delivery/depois-pizza.png', lifestyle: '/delivery/lifestyle-pizza.png', hot: true },
        { icon: '🍣', title: 'Sushi & Japonês', desc: 'Composição elegante que valoriza cada peça.', image: '/delivery/hero-sushi.png', lifestyle: '/delivery/lifestyle-acai.png', hot: false },
        { icon: '🍰', title: 'Confeitaria & Doces', desc: 'Brigadeiros, bolos e sobremesas irresistíveis.', image: '/delivery/depois-bolo.png', lifestyle: '', hot: true },
        { icon: '🥗', title: 'Saudável & Bowls', desc: 'Cores vibrantes que atraem o público fitness.', image: '/delivery/pro-bowl.png', lifestyle: '', hot: false },
        { icon: '🥩', title: 'Churrasco & Grill', desc: 'Carnes na brasa com textura e suculência.', image: '/delivery/pro-prato.png', lifestyle: '', hot: false },
        { icon: '🥟', title: 'Salgadinhos', desc: 'Coxinhas, pastéis e esfihas com textura crocante que vende.', image: '/delivery/food_salgadinhos.png', lifestyle: '', hot: true },
        { icon: '🍇', title: 'Açaí', desc: 'Cores vibrantes e toppings irresistíveis. Foto que refresca.', image: '/delivery/food_acai.png', lifestyle: '', hot: false },
        { icon: '🍱', title: 'Marmitex', desc: 'Comida caseira com apresentação de restaurante premium.', image: '/delivery/food_marmitex.png', lifestyle: '', hot: false },
    ];

    const steps = [
        { num: '1', title: 'Tire a foto como sempre tirou', desc: 'Pode ser com o celular, com luz ruim, sem cenário especial. O prato no balcão mesmo. A IA não precisa de perfeição para criar perfeição.', badge: 'Qualquer celular', icon: '📱' },
        { num: '2', title: 'Envie para a LumiPhotoIA', desc: 'Suba a foto na plataforma, selecione o estilo que deseja e clique em transformar. Não tem complicação, é mais fácil que postar no Instagram.', badge: '3 cliques', icon: '📤' },
        { num: '3', title: 'Foto profissional pronta', desc: 'Em 30 segundos, sua foto vira uma imagem de cardápio premium feita pela LumiPhotoIA — digna de restaurante estrelado. Baixe e cole direto no iFood, Rappi ou cardápio digital.', badge: '30 segundos', icon: '⚡' },
    ];

    const benefits = [
        { icon: <DollarSign size={24} />, title: 'R$ 1,17 por Foto', desc: 'Fotógrafo de comida cobra R$ 200+ por prato. Com a Lumi, R$ 1,17.', gradient: 'from-orange-500/20' },
        { icon: <Clock size={24} />, title: '30 Segundos', desc: 'Pare de esperar. Fotos prontas na hora pra subir.', gradient: 'from-amber-500/20' },
        { icon: <Eye size={24} />, title: 'Dá Água na Boca', desc: 'Iluminação e cores que fazem o cliente pedir.', gradient: 'from-red-500/20' },
        { icon: <TrendingUp size={24} />, title: '+400% Pedidos', desc: 'Restaurantes com boas fotos vendem até 4x mais.', gradient: 'from-green-500/20' },
        { icon: <Star size={24} />, title: 'Cardápio Inteiro', desc: 'Fotografe 50 pratos em uma tarde.', gradient: 'from-purple-500/20' },
        { icon: <Shield size={24} />, title: 'Multi-plataforma', desc: 'iFood, Rappi, Uber Eats, Instagram — tudo.', gradient: 'from-blue-500/20' },
    ];

    const heroPairs = [
        { before: '/delivery/antes-burger.png', after: '/delivery/depois-burger.png', label: 'Hambúrguer' },
        { before: '/delivery/antes-pizza.png', after: '/delivery/depois-pizza.png', label: 'Pizza' },
        { before: '/delivery/antes-bolo.png', after: '/delivery/depois-bolo.png', label: 'Bolo' },
        { before: '/delivery/antes-salgadinhos.png', after: '/delivery/depois-salgadinhos.png', label: 'Salgadinhos' },
    ];

    const beforeAfterPairs = [
        { before: '/delivery/antes-acai-2.png', after: '/delivery/depois-acai-2.png', label: 'Açaí' },
        { before: '/delivery/antes-hotdog-2.png', after: '/delivery/depois-hotdog-2.png', label: 'Hot Dog' },
        { before: '/delivery/antes-japones-2.png', after: '/delivery/depois-japones-2.png', label: 'Japonês' },
    ];

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">

            {/* ===== OFERTA RELÂMPAGO BANNER ===== */}
            <div className="sticky top-0 z-[60] bg-gradient-to-r from-red-600 via-red-500 to-red-600 py-2 px-4 text-center">
                <p className="text-white text-xs font-black uppercase tracking-wider">
                    <span className="mr-2">⚡</span>
                    <span className="text-yellow-300">OFERTA RELÂMPAGO</span>
                    {' — '}
                    <span className="text-yellow-200">primeiras 48h: 40% OFF no pacote Pro</span>
                    {' — '}
                    <span className="text-white/90">Restam apenas 7 vagas</span>
                    <span className="ml-2">⚡</span>
                </p>
            </div>

            {/* ===== STICKY HEADER ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-6xl mx-auto px-3 py-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 md:h-10 w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[11px] md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">LUMI<span className="text-white">IA</span></span>
                            <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.15em] text-emerald-400">🍔 Delivery</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button onClick={onLogin || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Entrar</button>
                        <button onClick={onViewStudio || onGetStarted} className="px-2 py-1.5 text-white/50 text-[10px] font-bold hover:text-white/80 transition-colors whitespace-nowrap">Estúdio</button>
                        <button onClick={scrollToPricing} className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-amber-400 rounded-lg font-black text-[10px] text-black uppercase tracking-wide hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all whitespace-nowrap">Ver Pacotes</button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO COM ANTES/DEPOIS ===== */}
            <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/10 blur-[200px] rounded-full" />
                    <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-amber-500/8 blur-[180px] rounded-full" />
                </div>

                <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="text-center lg:text-left min-w-0 overflow-hidden">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-[0.15em] mb-6">
                                <Flame size={14} />
                                Para Restaurantes & Delivery
                            </div>

                            <h1 className="text-[1.6rem] sm:text-3xl md:text-5xl lg:text-6xl font-black uppercase leading-[0.9] tracking-tight mb-6 break-words">
                                Seu prato{' '}
                                <span className="text-orange-400">concorre</span>
                                <br />com +5 mil{' '}
                                <span className="text-amber-400">restaurantes.</span>
                                <br />A foto{' '}
                                <span className="text-orange-400">decide quem</span>
                                <br />vende.
                            </h1>

                            <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-full md:max-w-xl mb-6 leading-relaxed break-words">
                                Em <strong className="text-white/80">30 segundos</strong>, a IA transforma qualquer foto tirada com celular em <strong className="text-white/80">foto profissional pela LumiPhotoIA</strong> — o tipo que faz o cliente travar o scroll, salivar e pedir na hora.
                            </p>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-8">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <TrendingUp size={11} className="text-orange-400" /> R$ 1,17/foto
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Zap size={11} className="text-orange-400" /> 30 segundos
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <ImageIcon size={11} className="text-orange-400" /> Direto do celular
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-white/60 text-[11px] font-bold">
                                    <Shield size={11} className="text-orange-400" /> Ideal para iFood & Rappi
                                </span>
                            </div>

                            {/* ── CTA BUTTON ─────────────────────────── */}
                            <div className="flex flex-col items-center lg:items-start gap-3 w-full lg:w-auto">
                                <button
                                    onClick={scrollToPricing}
                                    className="group relative px-10 py-5 rounded-2xl font-black text-lg uppercase tracking-wider transition-all duration-300 inline-flex items-center gap-3 w-full justify-center lg:w-auto overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #ff6b35, #f59e0b)', boxShadow: '0 0 0 2px rgba(245,158,11,0.4), 0 20px 60px rgba(255,107,53,0.4)' }}
                                >
                                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                                    <Zap size={22} className="text-black" />
                                    <span className="text-black">Criar Fotos Profissionais</span>
                                    <ArrowRight size={22} className="text-black group-hover:translate-x-1 transition-transform" />
                                </button>
                                <p className="text-white/30 text-[11px] font-bold text-center lg:text-left">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>
                                <button onClick={scrollToPricing} className="text-white/30 text-xs underline hover:text-white/60 transition-colors">
                                    ver pacotes completos →
                                </button>
                            </div>

                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mt-1">
                                <span className="flex items-center gap-1.5 text-white/40 text-xs"><span className="text-green-400">✓</span> Resultado em 30 segundos</span>
                                <span className="flex items-center gap-1.5 text-white/40 text-xs"><span className="text-green-400">✓</span> Resolução HD profissional</span>
                                <span className="flex items-center gap-1.5 text-white/40 text-xs"><span className="text-green-400">✓</span> Direto para iFood & Rappi</span>
                            </div>
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
                            <div className="grid grid-cols-3 gap-2 mt-4">
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
                                <div className="relative rounded-xl overflow-hidden border border-red-500/20">
                                    <div className="flex relative">
                                        <div className="w-1/2 relative">
                                            <img src="/delivery/antes-salgadinhos.png" alt="Antes salgadinhos" className="w-full h-20 object-cover" />
                                            <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-red-500/70 text-[7px] font-black text-white uppercase rounded">antes</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src="/delivery/depois-salgadinhos.png" alt="Depois salgadinhos" className="w-full h-20 object-cover" />
                                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-orange-500/90 text-[7px] font-black text-black uppercase rounded">depois</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                            <ArrowRight size={8} className="text-black" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[8px] font-black text-white/50 py-1 bg-black/40">🥟 Salgadinhos</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-black/80 backdrop-blur-xl border border-orange-500/30 rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)]">
                                <p className="text-orange-400 text-xs font-black text-center">📱 → ✨ De caseira a profissional em 30s</p>
                            </div>
                        </div>

                        {/* Mobile Carousel — Before/After */}
                        <div className="lg:hidden -mx-6 px-6">
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                                {heroPairs.map((pair, i) => (
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


            {/* ===== DOR: O CLIENTE NÃO PROVA A COMIDA ===== */}
            <section className="py-10 md:py-20 bg-[#050505] border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-red-900/5 to-transparent" />
                <div className="max-w-6xl mx-auto px-6 relative z-10">

                    {/* Two-column: headline left + stat right */}
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-start mb-8 lg:mb-14">
                        <div className="lg:w-1/2 lg:sticky lg:top-8">
                            <div className="inline-flex items-center gap-2 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <span className="w-6 h-px bg-red-400/60" />
                                A realidade que ninguém fala
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight mb-6">
                                O cliente não <span className="text-orange-400">prova</span> a comida.<br />
                                Ele compra<br />com os olhos.
                            </h2>
                            <p className="text-white/40 text-base max-w-sm leading-relaxed mb-8">
                                No iFood, você tem <strong className="text-white/70">3 segundos</strong> antes do dedo passar. Uma foto ruim não é só feiúra — é dinheiro indo embora.
                            </p>
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/15">
                                    <span className="text-2xl">📉</span>
                                    <div>
                                        <p className="text-white font-black text-sm uppercase">-37% de conversão</p>
                                        <p className="text-white/30 text-xs">com fotos de baixa qualidade no iFood</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/15">
                                    <span className="text-2xl">💸</span>
                                    <div>
                                        <p className="text-white font-black text-sm uppercase">R$ 2.000 por ensaio</p>
                                        <p className="text-white/30 text-xs">é o custo médio de um fotógrafo profissional</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                    <span className="text-2xl">🏆</span>
                                    <div>
                                        <p className="text-white font-black text-sm uppercase">+400% mais pedidos</p>
                                        <p className="text-white/30 text-xs">com fotos geradas pela LumiPhotoIA</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right: image cards grid — hidden on mobile to avoid large gap */}
                        <div className="hidden lg:grid lg:w-1/2 grid-cols-2 gap-3">
                            {[
                                { img: '/delivery/antes-burger.png', label: 'Foto escura', stat: 'Cliente passa pro próximo' },
                                { img: '/delivery/antes-pizza.png', label: 'Sem iluminação', stat: 'Prato parece requentado' },
                                { img: '/delivery/antes-acai-2.png', label: 'Foto de celular', stat: 'Zero apetite, zero clique' },
                                { img: '/delivery/antes-hotdog-2.png', label: 'Imagem granulada', stat: 'Algoritmo enterra no feed' },
                                { img: '/delivery/antes-bolo.png', label: 'Foto sem foco', stat: 'Concorrente leva o pedido' },
                                { img: '/delivery/antes-japones-2.png', label: 'Prato invisível', stat: 'R$ 2k pelo fotógrafo' },
                            ].map((item, i) => (
                                <div key={i} className="relative rounded-2xl overflow-hidden group aspect-[4/3]">
                                    <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                                    <div className="absolute inset-0 bg-red-900/30" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3">
                                        <span className="inline-block px-2 py-0.5 bg-red-500/80 text-white text-[8px] font-black uppercase rounded-full mb-1">❌ {item.label}</span>
                                        <p className="text-white/70 text-[10px] font-bold leading-tight">{item.stat}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== ANTES/DEPOIS COMPLETO ===== */}
            <section className="py-24 px-6 border-t border-white/5 bg-[#050505]">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <span className="w-6 h-px bg-orange-400/60" />
                            Antes & Depois
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight">
                                Veja a <span className="text-orange-400">transformação</span>
                            </h2>
                            <p className="text-white/40 text-sm max-w-xs lg:text-right leading-relaxed">
                                Foto de celular → foto premium da LumiPhotoIA.<br />
                                <strong className="text-orange-400">Em 30 segundos.</strong>
                            </p>
                        </div>
                    </div>

                    {/* Pairs stacked */}
                    <div className="flex flex-col gap-6">
                        {beforeAfterPairs.map((pair, i) => (
                            <div key={i} className="relative rounded-3xl overflow-hidden border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                                {/* Food name badge */}
                                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-black/80 backdrop-blur-sm border border-white/10 rounded-full">
                                        <span className="text-white font-black text-sm uppercase tracking-wider">{pair.label}</span>
                                        <span className="px-2 py-0.5 bg-orange-500 text-black text-[9px] font-black rounded-full uppercase">⚡ 30s com IA</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 h-64 md:h-80">
                                    {/* ANTES */}
                                    <div className="relative overflow-hidden">
                                        <img src={pair.before} alt={`Antes ${pair.label}`} className="w-full h-full object-cover scale-105 grayscale" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
                                        <div className="absolute inset-0 bg-red-900/20" />
                                        {/* Big ANTES label */}
                                        <div className="absolute bottom-4 left-4">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-black uppercase rounded-full">📱 ANTES</span>
                                            </div>
                                            <p className="text-white/60 text-xs font-bold">Foto de celular</p>
                                        </div>
                                        {/* Messy overlay text */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-20">
                                            <p className="text-white text-4xl font-black uppercase">ANTES</p>
                                        </div>
                                    </div>

                                    {/* DEPOIS */}
                                    <div className="relative overflow-hidden">
                                        <img src={pair.after} alt={`Depois ${pair.label}`} className="w-full h-full object-cover scale-105" />
                                        <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/20" />
                                        {/* Big DEPOIS label */}
                                        <div className="absolute bottom-4 right-4 text-right">
                                            <div className="flex items-center gap-2 mb-2 justify-end">
                                                <span className="px-3 py-1 bg-orange-500 text-black text-[10px] font-black uppercase rounded-full">✨ DEPOIS</span>
                                            </div>
                                            <p className="text-white/60 text-xs font-bold">Criada pela LumiPhotoIA</p>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center opacity-20">
                                            <p className="text-orange-400 text-4xl font-black uppercase">DEPOIS</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Center divider arrow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(249,115,22,0.6)] border-4 border-black">
                                        <ArrowRight size={18} className="text-black" strokeWidth={3} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== SEGMENTOS: SOCIAL PROOF + MARKET DATA ===== */}
            <section className="py-24 px-6 border-t border-white/5 bg-[#050505]">
                <div className="max-w-6xl mx-auto">

                    {/* Section header */}
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <span className="w-6 h-px bg-orange-400/60" />
                            A ciência por trás da compra
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight">
                                O cérebro compra<br />
                                antes do <span className="text-orange-400">estômago.</span>
                            </h2>
                            <p className="text-white/40 text-sm max-w-xs lg:text-right leading-relaxed">
                                95% das decisões de compra são tomadas <strong className="text-white/70">antes de provar o alimento</strong> — só pela visão e emoção.
                            </p>
                        </div>
                    </div>

                    {/* Market stats banner */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
                        {[
                            { num: '93%', label: 'das compras de comida', sub: 'são influenciadas pela aparência visual do produto', color: 'text-orange-400' },
                            { num: '+63%', label: 'no ticket médio', sub: 'com fotos profissionais vs. fotos amadoras de celular', color: 'text-emerald-400' },
                            { num: '3 seg', label: 'é o tempo que você tem', sub: 'antes do cliente passar para o concorrente no iFood', color: 'text-red-400' },
                        ].map((stat, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/8 hover:border-orange-500/20 transition-all">
                                <p className={`text-5xl font-black ${stat.color} mb-1`}>{stat.num}</p>
                                <p className="text-white font-black text-sm uppercase tracking-wide mb-2">{stat.label}</p>
                                <p className="text-white/30 text-xs leading-relaxed">{stat.sub}</p>
                            </div>
                        ))}
                    </div>

                    {/* Lifestyle row — clients interacting with food */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-white/40 text-xs font-black uppercase tracking-wider">Conteúdo que gera desejo</span>
                            <span className="flex-1 h-px bg-white/5" />
                            <span className="text-orange-400/60 text-[10px] font-black uppercase">Feed viral</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
                            {[
                                { img: '/delivery/lifestyle-burger.png', quote: '"Esse hambúrguer é insano 🔥"', result: '+2.400 curtidas · 180 pedidos no dia', tag: 'Hambúrguer' },
                                { img: '/delivery/lifestyle-acai.png', quote: '"Tirando foto do meu açaí 📸"', result: 'Foto virou capa do iFood por 1 semana', tag: 'Açaí' },
                                { img: '/delivery/lifestyle-pizza.png', quote: '"A pizza que tá em todo feed"', result: '+340% nos pedidos em 3 dias', tag: 'Pizza' },
                            ].map((item, i) => (
                                <div key={i} className="relative rounded-2xl overflow-hidden group h-72">
                                    <img src={item.img} alt={item.tag} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                                    {/* Instagram-style overlay */}
                                    <div className="absolute top-3 left-3">
                                        <span className="px-2 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-[9px] font-black rounded-full uppercase">📸 Lifestyle</span>
                                    </div>

                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <p className="text-white font-bold text-sm italic mb-2 leading-tight">"{item.quote.replace(/"/g, '')}"</p>
                                        <div className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                                            <p className="text-orange-300/80 text-[10px] font-black uppercase">{item.result}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Emotional insight bar */}
                    <div className="flex flex-col md:flex-row gap-4 mb-14 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-orange-500/5 to-transparent border border-orange-500/20">
                        <div className="text-4xl">🧠</div>
                        <div>
                            <p className="text-white font-black text-base uppercase tracking-wide mb-2">A compra é emocional. A foto é o gatilho.</p>
                            <p className="text-white/40 text-sm leading-relaxed max-w-2xl">Estudos de neuromarketing mostram que <strong className="text-orange-400">o desejo de comer é ativado em menos de 200 milissegundos</strong> ao ver uma foto apetitosa — antes mesmo da razão entrar em ação. No delivery, quem tem a foto mais bonita vende mais, cobra mais e fideliza mais.</p>
                        </div>
                    </div>

                    {/* Food categories grid */}
                    <div className="flex items-center gap-3 mb-6">
                        <span className="text-white/40 text-xs font-black uppercase tracking-wider">Resultados por segmento</span>
                        <span className="flex-1 h-px bg-white/5" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {segments.map((seg, i) => {
                            const showLifestyle = seg.lifestyle && seg.lifestyle !== seg.image;
                            const stats = ['+280%', '+340%', '+190%', '+420%', '+250%', '+310%', '+370%', '+260%', '+290%'];
                            return (
                                <div key={i} className="relative rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-300 group cursor-pointer">
                                    {seg.hot && (
                                        <span className="absolute top-3 right-3 z-10 px-2 py-0.5 bg-orange-500 text-black text-[9px] font-black uppercase tracking-wider rounded-full">Popular</span>
                                    )}
                                    <div className="relative h-44 overflow-hidden">
                                        {showLifestyle ? (
                                            <>
                                                <img src={seg.image} alt={seg.title} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 group-hover:opacity-0 opacity-100" />
                                                <img src={seg.lifestyle} alt={`${seg.title} lifestyle`} className="absolute inset-0 w-full h-full object-cover transition-all duration-700 opacity-0 group-hover:opacity-100 scale-105" />
                                            </>
                                        ) : (
                                            <img src={seg.image} alt={seg.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/30 to-transparent" />

                                        {/* Stat overlay on hover */}
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="text-center">
                                                <p className="text-4xl font-black text-orange-400">{stats[i]}</p>
                                                <p className="text-white/80 text-[10px] font-black uppercase">em pedidos</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xl">{seg.icon}</span>
                                            <h3 className="text-white font-bold text-sm group-hover:text-orange-300 transition-colors">{seg.title}</h3>
                                        </div>
                                        <p className="text-white/30 text-xs leading-relaxed">{seg.desc}</p>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Catch-all: Any food card */}
                        <div className="relative rounded-2xl overflow-hidden border border-dashed border-orange-500/30 hover:border-orange-500/50 transition-all duration-300 group cursor-pointer col-span-2 md:col-span-3 bg-gradient-to-r from-orange-500/[0.04] via-transparent to-orange-500/[0.04]">
                            <div className="p-8 md:p-10 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-3xl">
                                    🍽️
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-white font-black text-lg mb-1">Qualquer tipo de comida. <span className="text-orange-400">Qualquer.</span></h3>
                                    <p className="text-white/40 text-sm leading-relaxed">Pastel, tapioca, crepe, yakisoba, caldos, espetinhos, comida árabe, mexicana, vegana, fit... Se é comida e cabe numa foto, <strong className="text-white/60">a IA transforma em foto profissional.</strong></p>
                                </div>
                                <div className="flex flex-wrap justify-center md:justify-end gap-2">
                                    {['🥘', '🌮', '🧁', '🍝', '🥙', '🍜', '🫔', '🥪'].map((e, i) => (
                                        <span key={i} className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/5 flex items-center justify-center text-lg group-hover:bg-orange-500/10 transition-colors">{e}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-24 px-6 bg-gradient-to-b from-orange-600/5 via-transparent to-transparent border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16">
                        <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <span className="w-6 h-px bg-orange-400/60" />
                            Como Funciona
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight">
                                3 Passos.<br /><span className="text-orange-400">30 Segundos.</span> Pronto.
                            </h2>
                            <p className="text-white/40 text-sm max-w-xs lg:text-right leading-relaxed">
                                Sem instalação, sem app, sem curso.<br />
                                <strong className="text-white/60">Simples como postar no Instagram.</strong>
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                        {/* STEP 1 — Tire a foto */}
                        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-orange-500/20 transition-all group">
                            <div className="relative h-52 overflow-hidden">
                                <img src="/delivery/antes-burger.png" alt="Tire a foto com seu celular" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 grayscale" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
                                <div className="absolute top-4 left-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] border-2 border-black">
                                        <span className="text-black font-black text-base">1</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-2 py-1 bg-white/10 backdrop-blur border border-white/10 text-white/60 text-[9px] font-black rounded-full uppercase">📱 Qualquer celular</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-white font-black text-base uppercase tracking-wide mb-2">Tire a foto como sempre tirou</h3>
                                <p className="text-white/40 text-sm leading-relaxed">Luz ruim, fundo de balcão, sem cenário. A LumiPhotoIA não precisa de perfeição para entregar perfeição.</p>
                            </div>
                        </div>

                        {/* STEP 2 — Plataforma LumiPhotoIA (featured, wider) */}
                        <div className="relative rounded-3xl overflow-hidden border border-orange-500/20 bg-gradient-to-b from-orange-500/5 to-transparent hover:border-orange-500/40 transition-all group">
                            {/* Platform screenshot */}
                            <div className="relative overflow-hidden" style={{ height: '260px' }}>
                                <img src="/delivery/plataforma-studio.png" alt="Plataforma LumiPhotoIA" className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0508] via-transparent to-black/30" />
                                <div className="absolute top-4 left-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] border-2 border-black">
                                        <span className="text-black font-black text-base">2</span>
                                    </div>
                                </div>
                                {/* Lumi brand badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1.5 bg-orange-500 text-black text-[9px] font-black rounded-full uppercase tracking-wider">⚡ LumiPhotoIA</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-white font-black text-base uppercase tracking-wide mb-3">Envie para a LumiPhotoIA</h3>
                                <p className="text-white/40 text-sm leading-relaxed mb-4">Acesse a plataforma e escolha como quer gerar sua foto:</p>
                                {/* 3 upload modes */}
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                        <span className="text-base">🧑</span>
                                        <div>
                                            <p className="text-white text-xs font-black uppercase">Foto do Modelo</p>
                                            <p className="text-white/30 text-[10px]">use um modelo real junto ao produto</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/5">
                                        <span className="text-base">📋</span>
                                        <div>
                                            <p className="text-white text-xs font-black uppercase">Foto de Referência</p>
                                            <p className="text-white/30 text-[10px]">inspire a IA com um estilo que você gosta</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
                                        <span className="text-base">🤖</span>
                                        <div>
                                            <p className="text-orange-400 text-xs font-black uppercase">IA no Automático</p>
                                            <p className="text-white/30 text-[10px]">deixa a Lumi escolher o melhor resultado</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STEP 3 — Resultado */}
                        <div className="relative rounded-3xl overflow-hidden border border-white/5 bg-white/[0.02] hover:border-orange-500/20 transition-all group">
                            <div className="relative h-52 overflow-hidden">
                                <img src="/delivery/depois-burger.png" alt="Foto profissional pronta" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
                                <div className="absolute top-4 left-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.5)] border-2 border-black">
                                        <span className="text-black font-black text-base">3</span>
                                    </div>
                                </div>
                                <div className="absolute bottom-4 left-4">
                                    <span className="px-2 py-1 bg-emerald-500/80 text-white text-[9px] font-black rounded-full uppercase">✅ 30 segundos</span>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-white font-black text-base uppercase tracking-wide mb-2">Foto premium pronta para usar</h3>
                                <p className="text-white/40 text-sm leading-relaxed mb-4">Baixe e cole direto no iFood, Rappi, WhatsApp ou cardápio digital. Nenhuma edição necessária.</p>
                                <div className="flex flex-wrap gap-2">
                                    {['iFood', 'Rappi', 'Instagram', 'Cardápio'].map(p => (
                                        <span key={p} className="px-2 py-1 text-[9px] font-black uppercase bg-white/5 border border-white/10 text-white/40 rounded-full">{p}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ===== BENEFÍCIOS — BENTO GRID ===== */}
            <section className="py-24 px-6 border-t border-white/5 bg-[#050505]">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-14">
                        <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <span className="w-6 h-px bg-orange-400/60" />
                            Por que a LumiPhotoIA
                        </div>
                        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
                            <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight">
                                Chega de <span className="text-red-400">perder pedidos</span><br />por foto feia.
                            </h2>
                            <p className="text-white/30 text-sm max-w-xs lg:text-right leading-relaxed">
                                Tudo que um fotógrafo leva dias pra fazer,<br />
                                <strong className="text-orange-400">a LumiPhotoIA entrega em 30 segundos.</strong>
                            </p>
                        </div>
                    </div>

                    {/* Bento grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-auto">

                        {/* HERO CARD — R$ 1,17 por foto (spans 2 cols on lg) */}
                        <div className="lg:col-span-2 relative rounded-3xl overflow-hidden group h-72">
                            <img src="/delivery/depois-pizza.png" alt="R$ 1,17 por foto" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
                            <div className="absolute inset-0 p-8 flex flex-col justify-end">
                                <div className="mb-3">
                                    <span className="px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 text-[9px] font-black uppercase rounded-full tracking-wider">💰 Custo real</span>
                                </div>
                                <div className="flex items-end gap-4 mb-3">
                                    <div>
                                        <p className="text-6xl font-black text-orange-400 leading-none">R$ 1,17</p>
                                        <p className="text-white font-black text-sm uppercase tracking-wide mt-1">por foto gerada</p>
                                    </div>
                                    <div className="pb-1">
                                        <p className="text-white/30 text-xs line-through">Fotógrafo: R$ 200+/prato</p>
                                        <p className="text-emerald-400 text-xs font-black">Economize 99% por ensaio</p>
                                    </div>
                                </div>
                                <p className="text-white/40 text-sm max-w-sm leading-relaxed">Fotógrafo profissional cobra R$ 2.000 por ensaio. Com a LumiPhotoIA, você cobre um cardápio inteiro por menos de R$ 60.</p>
                            </div>
                        </div>

                        {/* SPEED CARD */}
                        <div className="relative rounded-3xl overflow-hidden group h-72">
                            <img src="/delivery/depois-acai-2.png" alt="30 segundos" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="inline-block px-2 py-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[9px] font-black uppercase rounded-full tracking-wider mb-3 w-fit">⚡ Velocidade</span>
                                <p className="text-6xl font-black text-white leading-none">30<span className="text-3xl text-amber-400">seg</span></p>
                                <p className="text-white font-black text-sm uppercase tracking-wide mt-2 mb-2">Foto pronta na hora</p>
                                <p className="text-white/40 text-xs leading-relaxed">Pare de esperar. Sobe direto no iFood depois de gerar.</p>
                            </div>
                        </div>

                        {/* +400% PEDIDOS */}
                        <div className="relative rounded-3xl overflow-hidden group h-64">
                            <img src="/delivery/home-burger.png" alt="+400% pedidos" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="inline-block px-2 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] font-black uppercase rounded-full tracking-wider mb-3 w-fit">📈 Resultado</span>
                                <p className="text-5xl font-black text-emerald-400 leading-none">+400%</p>
                                <p className="text-white font-black text-sm uppercase tracking-wide mt-2 mb-1">em pedidos</p>
                                <p className="text-white/40 text-xs">Restaurantes com boas fotos vendem até 4× mais.</p>
                            </div>
                        </div>

                        {/* CARDÁPIO INTEIRO */}
                        <div className="relative rounded-3xl overflow-hidden group h-64">
                            <img src="/delivery/home-pizza.png" alt="Cardápio inteiro" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-end">
                                <span className="inline-block px-2 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[9px] font-black uppercase rounded-full tracking-wider mb-3 w-fit">🍽️ Volume</span>
                                <p className="text-5xl font-black text-white leading-none">50<span className="text-2xl text-purple-400"> pratos</span></p>
                                <p className="text-white font-black text-sm uppercase tracking-wide mt-2 mb-1">em uma tarde</p>
                                <p className="text-white/40 text-xs">Fotografe o cardápio inteiro de uma vez.</p>
                            </div>
                        </div>

                        {/* MULTI-PLATAFORMA — full width */}
                        <div className="relative rounded-3xl overflow-hidden group h-40 md:col-span-2 lg:col-span-1">
                            <img src="/delivery/home-hotdog.png" alt="Multi-plataforma" className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                            <div className="absolute inset-0 p-6 flex flex-col justify-center">
                                <span className="inline-block px-2 py-1 bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[9px] font-black uppercase rounded-full tracking-wider mb-3 w-fit">🌐 Alcance</span>
                                <p className="text-white font-black text-lg uppercase leading-tight mb-1">Multi-plataforma</p>
                                <div className="flex flex-wrap gap-2">
                                    {['iFood', 'Rappi', 'Uber Eats', 'Instagram'].map(p => (
                                        <span key={p} className="px-2 py-0.5 bg-white/10 border border-white/10 text-white/60 text-[9px] font-black rounded-full">{p}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ===== RESULTADOS REAIS ===== */}
            <section className="py-24 px-6 border-t border-white/5">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="mb-14">
                        <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <span className="w-6 h-px bg-orange-400/60" />
                            Resultados reais
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight">
                            O que muda quando<br />a foto <span className="text-orange-400">é boa de verdade</span>
                        </h2>
                        <p className="text-white/30 text-base mt-4 max-w-lg">
                            Não é sobre ficar bonito. É sobre vender mais. Cada melhoria visual tem impacto direto nos pedidos.
                        </p>
                    </div>

                    {/* Two-column layout */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Left — Stat cards */}
                        <div className="flex flex-col gap-4">

                            {/* Card 1 */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] group hover:border-orange-500/20 transition-all duration-300">
                                <div className="flex items-stretch">
                                    <div className="relative w-24 flex-shrink-0 overflow-hidden">
                                        <img src="/delivery/depois-burger.png" alt="Cliques no cardápio" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                                    </div>
                                    <div className="p-5 flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg mt-0.5">👆</div>
                                        <div>
                                            <p className="text-orange-400 font-black text-sm uppercase tracking-wide mb-1">+34% de cliques no cardápio</p>
                                            <p className="text-white/40 text-xs leading-relaxed">Fotos profissionais aumentam a taxa de clique no iFood — o que melhora seu ranqueamento no algoritmo e gera ainda mais visibilidade orgânica.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] group hover:border-orange-500/20 transition-all duration-300">
                                <div className="flex items-stretch">
                                    <div className="relative w-24 flex-shrink-0 overflow-hidden">
                                        <img src="/delivery/depois-marmitex.png" alt="Ticket médio" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                                    </div>
                                    <div className="p-5 flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-lg mt-0.5">🛒</div>
                                        <div>
                                            <p className="text-orange-400 font-black text-sm uppercase tracking-wide mb-1">Ticket médio sobe 22%</p>
                                            <p className="text-white/40 text-xs leading-relaxed">Quando o prato parece premium, o cliente aceita pagar mais. Fotos profissionais elevam a percepção de valor sem mudar o produto.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 3 */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] group hover:border-orange-500/20 transition-all duration-300">
                                <div className="flex items-stretch">
                                    <div className="relative w-24 flex-shrink-0 overflow-hidden">
                                        <img src="/delivery/depois-acai.png" alt="Avaliações" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                                    </div>
                                    <div className="p-5 flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-lg mt-0.5">⭐</div>
                                        <div>
                                            <p className="text-amber-400 font-black text-sm uppercase tracking-wide mb-1">Mais avaliações positivas</p>
                                            <p className="text-white/40 text-xs leading-relaxed">Clientes que sabem exatamente o que vão receber ficam mais satisfeitos. Foto fiel ao prato = expectativa alinhada = avaliação 5 estrelas.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 4 */}
                            <div className="relative rounded-2xl overflow-hidden border border-white/8 bg-white/[0.02] group hover:border-orange-500/20 transition-all duration-300">
                                <div className="flex items-stretch">
                                    <div className="relative w-24 flex-shrink-0 overflow-hidden">
                                        <img src="/delivery/depois-hotdog.png" alt="Clientes fiéis" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a]" />
                                    </div>
                                    <div className="p-5 flex items-start gap-4">
                                        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-lg mt-0.5">🔄</div>
                                        <div>
                                            <p className="text-blue-400 font-black text-sm uppercase tracking-wide mb-1">Clientes que voltam sempre</p>
                                            <p className="text-white/40 text-xs leading-relaxed">Uma apresentação impecável cria memória afetiva. O cliente lembra da foto, lembra da experiência positiva e volta no próximo pedido.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Right — Big impact card */}
                        <div className="relative rounded-3xl overflow-hidden border border-orange-500/20 bg-gradient-to-b from-orange-500/8 to-transparent shadow-[0_0_80px_rgba(249,115,22,0.1)]">
                            <div className="absolute inset-0">
                                <img src="/delivery/depois-japones.png" alt="Resultado" className="w-full h-full object-cover opacity-20" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/60" />
                            </div>
                            <div className="relative p-10 flex flex-col items-center justify-center h-full min-h-[480px] text-center">
                                <p className="text-orange-400/60 text-xs font-black uppercase tracking-[0.3em] mb-6">Resultado médio comprovado</p>
                                <p className="text-[7rem] md:text-[9rem] font-black text-orange-400 leading-none tracking-tight">+34%</p>
                                <div className="w-16 h-px bg-orange-500/40 my-6" />
                                <p className="text-white font-black text-xl md:text-2xl uppercase tracking-wide leading-tight mb-3">
                                    Aumento médio em pedidos<br />nos primeiros 30 dias
                                </p>
                                <p className="text-white/30 text-xs leading-relaxed max-w-xs mb-8">
                                    Com base em dados de 12.000+ restaurantes que migraram para fotos profissionais via LumiPhotoIA nos últimos 12 meses.
                                </p>
                                {/* Rating row */}
                                <div className="flex flex-col items-center gap-3">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span key={i} className="text-amber-400 text-lg">★</span>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {/* Mini face avatars — illustrative */}
                                        <div className="flex -space-x-2">
                                            {['🧑‍🍳', '👩', '🧔', '👩‍🦱', '👨'].map((face, i) => (
                                                <div key={i} className="w-7 h-7 rounded-full bg-white/10 border-2 border-black flex items-center justify-center text-sm leading-none">
                                                    {face}
                                                </div>
                                            ))}
                                        </div>
                                        <p className="text-white/50 text-sm font-black">4.9<span className="text-white/25 font-normal">/5</span></p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>


            {/* ===== PLANOS & PREÇOS =====// */}
            <section id="pricing-section" className="py-24 px-6 bg-gradient-to-b from-orange-600/5 via-transparent to-transparent border-t border-white/5">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                            <DollarSign size={12} />
                            Investimento
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black uppercase text-white leading-[0.9] tracking-tight mb-4">
                            Cada dia sem boas fotos<br />é <span className="text-red-400">dinheiro perdido</span>
                        </h2>
                        <p className="text-white/40 text-base max-w-xl mx-auto">
                            Escolha seu pacote. Sem mensalidade, sem renovação, sem expiração.
                        </p>
                    </div>

                    {/* Credits explanation banner */}
                    <div className="flex flex-col md:flex-row items-center gap-4 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 mb-10">
                        <div className="text-3xl">💰</div>
                        <div className="flex-1 text-center md:text-left">
                            <p className="text-white font-black text-sm uppercase tracking-wide mb-1">Não é assinatura. São créditos.</p>
                            <p className="text-white/50 text-sm">Você compra créditos e usa quando quiser. <strong className="text-emerald-400">Eles não expiram</strong>, não renovam automaticamente e ficam disponíveis indefinidamente na sua conta.</p>
                        </div>
                        <div className="flex flex-col gap-1 text-center flex-shrink-0">
                            {['Sem expiração', 'Sem renovação', 'Sem mensalidade'].map(t => (
                                <span key={t} className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black rounded-full uppercase">{t}</span>
                            ))}
                        </div>
                    </div>

                    {/* Plans — use mt-6 on the middle card to make Popular badge float above */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start mb-10">

                        {/* ESSENCIAL */}
                        <div className="relative rounded-3xl border border-white/8 bg-white/[0.02] hover:border-orange-500/20 transition-all duration-300">
                            <div className="p-8">
                                {/* Per-photo hero */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full mb-5">
                                    <span className="text-orange-400 font-black text-xs">📸</span>
                                    <span className="text-orange-400 font-black text-sm">R$ 1,90 por foto</span>
                                </div>

                                <p className="text-white/40 text-[11px] font-black uppercase tracking-wider mb-2">Essencial</p>
                                <div className="flex items-end gap-3 mb-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-white/30 text-base">R$</span>
                                        <span className="text-6xl font-black text-white leading-none">57</span>
                                    </div>
                                    <div className="pb-2">
                                        <p className="text-3xl font-black text-orange-400 leading-none">30</p>
                                        <p className="text-white/40 text-[10px] font-black uppercase">fotos</p>
                                    </div>
                                </div>
                                <p className="text-white/25 text-xs mb-6">pagamento único — use quando quiser</p>

                                <div className="h-px bg-white/5 mb-6" />
                                <ul className="flex flex-col gap-3 mb-8">
                                    {[
                                        '30 créditos de foto com IA',
                                        'Créditos não expiram',
                                        'Todos os estilos disponíveis',
                                        'Download em alta qualidade',
                                        'Suporte por WhatsApp',
                                    ].map(f => (
                                        <li key={f} className="flex items-start gap-2.5 text-white/50 text-sm">
                                            <span className="text-orange-400 text-xs mt-0.5 flex-shrink-0">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-orange-500/30 text-orange-400 font-black text-sm uppercase tracking-wider hover:bg-orange-500/10 transition-all">
                                    Começar →
                                </button>
                            </div>
                        </div>

                        {/* PRO — POPULAR: floating badge above, card is elevated */}
                        <div className="relative -mt-0 md:-mt-6 flex flex-col">
                            {/* Floating badge above card */}
                            <div className="flex justify-center mb-3">
                                <span className="px-5 py-2 bg-gradient-to-r from-orange-500 to-amber-400 text-black text-[11px] font-black uppercase rounded-full tracking-wider shadow-[0_0_20px_rgba(249,115,22,0.5)]">🔥 Mais Popular</span>
                            </div>
                            <div className="relative rounded-3xl border-2 border-orange-500/60 bg-gradient-to-b from-orange-500/10 to-transparent shadow-[0_0_80px_rgba(249,115,22,0.2)] flex-1">
                                <div className="p-8">
                                    {/* Per-photo hero */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/20 border border-orange-500/40 rounded-full mb-5">
                                        <span className="text-orange-400 font-black text-xs">📸</span>
                                        <span className="text-orange-400 font-black text-sm">R$ 1,21 por foto</span>
                                    </div>

                                    <p className="text-orange-400/80 text-[11px] font-black uppercase tracking-wider mb-2">Pro</p>
                                    <div className="flex items-end gap-3 mb-1">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-white/50 text-base">R$</span>
                                            <span className="text-6xl font-black text-orange-400 leading-none">97</span>
                                        </div>
                                        <div className="pb-2">
                                            <p className="text-3xl font-black text-orange-400 leading-none">80</p>
                                            <p className="text-white/40 text-[10px] font-black uppercase">fotos</p>
                                        </div>
                                    </div>
                                    <p className="text-white/25 text-xs mb-6">pagamento único — use quando quiser</p>

                                    <div className="h-px bg-orange-500/20 mb-6" />
                                    <ul className="flex flex-col gap-3 mb-8">
                                        {[
                                            '80 créditos de foto com IA',
                                            'Créditos não expiram',
                                            'Todos os estilos disponíveis',
                                            'Download em alta qualidade',
                                            'Suporte prioritário por WhatsApp',
                                            'Ideal para cardápio completo',
                                        ].map(f => (
                                            <li key={f} className="flex items-start gap-2.5 text-white/70 text-sm">
                                                <span className="text-orange-400 text-xs mt-0.5 flex-shrink-0">✓</span> {f}
                                            </li>
                                        ))}
                                    </ul>
                                    <button onClick={onGetStarted} className="w-full py-5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-400 text-black font-black text-base uppercase tracking-wider hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                                        🔥 Quero esse plano
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* PREMIUM */}
                        <div className="relative rounded-3xl border border-white/8 bg-white/[0.02] hover:border-amber-500/20 transition-all duration-300">
                            <div className="p-8">
                                {/* Per-photo hero */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-5">
                                    <span className="text-amber-400 font-black text-xs">📸</span>
                                    <span className="text-amber-400 font-black text-sm">R$ 1,17 por foto</span>
                                </div>

                                <p className="text-white/40 text-[11px] font-black uppercase tracking-wider mb-2">Premium</p>
                                <div className="flex items-end gap-3 mb-1">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-white/30 text-base">R$</span>
                                        <span className="text-6xl font-black text-white leading-none">117</span>
                                    </div>
                                    <div className="pb-2">
                                        <p className="text-3xl font-black text-amber-400 leading-none">100</p>
                                        <p className="text-white/40 text-[10px] font-black uppercase">fotos</p>
                                    </div>
                                </div>
                                <p className="text-white/25 text-xs mb-6">pagamento único — use quando quiser</p>

                                <div className="h-px bg-white/5 mb-6" />
                                <ul className="flex flex-col gap-3 mb-8">
                                    {[
                                        '100 créditos de foto com IA',
                                        'Créditos não expiram',
                                        'Todos os estilos disponíveis',
                                        'Download em alta qualidade',
                                        'Suporte prioritário VIP',
                                        'Ideal para múltiplos cardápios',
                                    ].map(f => (
                                        <li key={f} className="flex items-start gap-2.5 text-white/50 text-sm">
                                            <span className="text-amber-400 text-xs mt-0.5 flex-shrink-0">✓</span> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={onGetStarted} className="w-full py-4 rounded-2xl border border-amber-500/30 text-amber-400 font-black text-sm uppercase tracking-wider hover:bg-amber-500/10 transition-all">
                                    Escolher Premium →
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Guarantee bar */}
                    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 py-6 border-t border-white/5">
                        {[
                            { icon: '🛡️', text: 'Garantia de 7 dias' },
                            { icon: '🚫', text: 'Sem mensalidade' },
                            { icon: '♾️', text: 'Créditos não expiram' },
                            { icon: '🤝', text: 'Uso comercial incluído' },
                            { icon: '💬', text: 'Suporte por WhatsApp' },
                            { icon: '⚡', text: 'Resultado em 30 segundos' },
                        ].map(({ icon, text }) => (
                            <div key={text} className="flex items-center gap-2 text-white/40 text-xs">
                                <span className="text-sm">{icon}</span> {text}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}

            <FAQSection extraFaqs={deliveryFaqs} accentColor="amber" />

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
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-white/20 text-xs">© 2025 LumiphotoIA — Fotos profissionais para delivery com IA</p>
                </div>
            </footer>
        </div>
    );
};

export default DeliveryLandingPage;
