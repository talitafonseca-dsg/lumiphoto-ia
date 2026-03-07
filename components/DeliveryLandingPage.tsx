import React, { useState } from 'react';
import {
    Camera, Check, Star, Zap, ArrowRight, Shield, Sparkles,
    Users, DollarSign, Clock, Download, Eye, MessageCircle,
    ChevronDown, TrendingUp, Image as ImageIcon,
    UtensilsCrossed, Flame, Coffee, Cake, Leaf, Pizza
} from 'lucide-react';
import FAQSection, { deliveryFaqs } from './FAQSection';

interface DeliveryLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;
}

export const DeliveryLandingPage: React.FC<DeliveryLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {
    const [activeSegment, setActiveSegment] = useState(0);

    const segments = [
        { icon: <Flame size={20} />, title: 'Hambúrguer & Fast Food', desc: 'Burgers gourmet com fumaça e close-ups' },
        { icon: <Pizza size={20} />, title: 'Pizza & Massas', desc: 'Pizza artesanal com queijo derretendo' },
        { icon: <UtensilsCrossed size={20} />, title: 'Sushi & Japonês', desc: 'Comida japonesa elegante e colorida' },
        { icon: <Cake size={20} />, title: 'Confeitaria & Doces', desc: 'Bolos, doces e sobremesas artesanais' },
        { icon: <Coffee size={20} />, title: 'Café & Padaria', desc: 'Café artesanal e pães frescos' },
        { icon: <Leaf size={20} />, title: 'Saudável & Fit', desc: 'Saladas, bowls e açaí vibrantes' },
    ];

    const steps = [
        { num: '01', title: 'Fotografe o Prato', desc: 'Tire uma foto do prato com o celular. Não precisa ser perfeita.', icon: <Camera size={24} /> },
        { num: '02', title: 'Escolha o Estilo', desc: 'Burger gourmet, pizza artesanal, sushi elegante — cada tipo de comida tem um preset.', icon: <Sparkles size={24} /> },
        { num: '03', title: 'IA Transforma', desc: 'A IA cria uma foto profissional de food photography em 30 segundos.', icon: <Zap size={24} /> },
        { num: '04', title: 'Use e Venda', desc: 'Baixe em alta resolução. Use no cardápio, iFood, Instagram e delivery.', icon: <Download size={24} /> },
    ];

    const benefits = [
        { icon: <DollarSign size={22} />, title: 'R$ 1,17 por Foto', desc: 'Fotos de comida profissionais custam R$ 200+ cada. Com a Lumi, menos de R$ 2.' },
        { icon: <Clock size={22} />, title: '30 Segundos', desc: 'Pare de esperar dias pelo fotógrafo. Fotos prontas em segundos.' },
        { icon: <Eye size={22} />, title: 'Dá Água na Boca', desc: 'Iluminação, cores e composição que fazem o cliente pedir.' },
        { icon: <TrendingUp size={22} />, title: '+400% Pedidos', desc: 'Restaurantes com fotos profissionais vendem até 4x mais no delivery.' },
        { icon: <Star size={22} />, title: 'Cardápio Completo', desc: 'Fotografe todo o menu em minutos, não semanas.' },
        { icon: <Shield size={22} />, title: 'Multi-plataforma', desc: 'iFood, Rappi, Uber Eats, Instagram, cardápio próprio — tudo.' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
            {/* HERO */}
            <section className="relative py-20 md:py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-orange-600/8 via-transparent to-transparent" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <UtensilsCrossed size={12} />
                        Para Restaurantes & Delivery
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                        Fotos de Comida
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">
                            que Vendem com IA
                        </span>
                    </h1>
                    <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Transforme fotos de celular em <strong className="text-white/80">food photography profissional</strong> em 30 segundos.
                        Hambúrguer, pizza, sushi, doces — qualquer prato.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onGetStarted} className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl font-black uppercase tracking-wider text-sm text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105">
                            <span className="flex items-center justify-center gap-2">
                                Começar Agora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        {onViewStudio && (
                            <button onClick={onViewStudio} className="px-8 py-4 rounded-2xl border border-white/10 font-bold text-sm hover:border-orange-500/30 hover:bg-orange-500/5 transition-all">
                                Ver Estúdio Grátis
                            </button>
                        )}
                    </div>
                    <p className="text-white/30 text-xs mt-4">A partir de R$ 1,17 por foto • Pagamento único</p>
                </div>
            </section>

            {/* SEGMENTOS */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Para Todo Tipo de <span className="text-orange-400">Comida</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            Presets especializados para cada tipo de culinária e restaurante.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {segments.map((seg, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveSegment(i)}
                                className={`p-5 rounded-2xl border text-left transition-all ${activeSegment === i
                                        ? 'bg-orange-500/10 border-orange-500/30 shadow-lg shadow-orange-500/10'
                                        : 'bg-white/[0.02] border-white/5 hover:border-orange-500/20'
                                    }`}
                            >
                                <div className={`mb-3 ${activeSegment === i ? 'text-orange-400' : 'text-white/40'}`}>
                                    {seg.icon}
                                </div>
                                <h3 className="text-white font-bold text-sm mb-1">{seg.title}</h3>
                                <p className="text-white/40 text-xs">{seg.desc}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* COMO FUNCIONA */}
            <section className="py-20 px-6 bg-gradient-to-b from-[#0a0a0a] to-[#0d0d0d]">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Como <span className="text-orange-400">Funciona</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all group">
                                <div className="text-orange-500/30 text-4xl font-black mb-4">{step.num}</div>
                                <div className="text-orange-400 mb-3">{step.icon}</div>
                                <h3 className="text-white font-bold mb-2">{step.title}</h3>
                                <p className="text-white/40 text-sm">{step.desc}</p>
                                {i < steps.length - 1 && (
                                    <div className="hidden md:block absolute -right-3 top-1/2 text-white/10">
                                        <ArrowRight size={20} />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* BENEFÍCIOS */}
            <section className="py-20 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                            Por que <span className="text-orange-400">Restaurantes</span> Escolhem a Lumi
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-orange-500/20 transition-all">
                                <div className="text-orange-400 mb-4">{b.icon}</div>
                                <h3 className="text-white font-bold mb-2">{b.title}</h3>
                                <p className="text-white/40 text-sm">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section id="pricing" className="py-20 px-6 bg-gradient-to-t from-orange-600/8 to-transparent">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                        Venda <span className="text-orange-400">Mais</span> com Fotos que Dão Fome
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-8">
                        Fotos profissionais de comida a partir de R$ 1,17 cada. Pagamento único, sem mensalidade.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onGetStarted} className="group px-8 py-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl font-black uppercase tracking-wider text-sm text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-all hover:scale-105">
                            <span className="flex items-center justify-center gap-2">
                                Escolher Meu Plano <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <FAQSection extraFaqs={deliveryFaqs} accentColor="amber" />

            {/* FOOTER */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-white/20 text-xs">© 2025 LumiphotoIA — Food photography profissional com IA</p>
                </div>
            </footer>
        </div>
    );
};

export default DeliveryLandingPage;
