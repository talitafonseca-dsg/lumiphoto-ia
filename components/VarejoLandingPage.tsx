import React, { useState } from 'react';
import {
    Camera, Check, Star, Zap, ArrowRight, Shield, Sparkles,
    Users, DollarSign, Clock, Download, Eye, MessageCircle,
    ChevronDown, TrendingUp, Image as ImageIcon,
    ShoppingBag, Package, Gem, Palette, Shirt, Smartphone
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
        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
    };

    const segments = [
        { icon: <Shirt size={20} />, title: 'Moda & Fashion', desc: 'Lookbooks, flat lays e editoriais de moda' },
        { icon: <Gem size={20} />, title: 'Joias & Acessórios', desc: 'Close-ups luxury e lifestyle shots' },
        { icon: <Palette size={20} />, title: 'Cosméticos', desc: 'Beauty shots com texturas e cores premium' },
        { icon: <Smartphone size={20} />, title: 'Eletrônicos', desc: 'Tech shots em fundo dark premium' },
        { icon: <Package size={20} />, title: 'Produtos em Geral', desc: 'Fundo branco, lifestyle e catálogo' },
        { icon: <ShoppingBag size={20} />, title: 'E-commerce', desc: 'Fotos para marketplaces e lojas virtuais' },
    ];

    const steps = [
        { num: '01', title: 'Suba o Produto', desc: 'Tire uma foto do produto com o celular e faça upload na plataforma.', icon: <Package size={24} /> },
        { num: '02', title: 'Modelo ou Avatar', desc: 'Suba uma selfie da modelo ou ative o avatar da IA para vestir o produto.', icon: <Users size={24} /> },
        { num: '03', title: 'Escolha o Estilo', desc: 'Lookbook, editorial, fundo branco, lifestyle — escolha o preset ideal.', icon: <Sparkles size={24} /> },
        { num: '04', title: 'IA Gera as Fotos', desc: '3 variações profissionais em 30 segundos. Baixe em alta resolução.', icon: <Download size={24} /> },
    ];

    const benefits = [
        { icon: <DollarSign size={22} />, title: 'Economia de 95%', desc: 'Um book fotográfico custa R$ 2.000+. Com a IA, sai por menos de R$ 5.' },
        { icon: <Clock size={22} />, title: '30 Segundos', desc: 'Fotos profissionais de produto prontas em segundos, não dias.' },
        { icon: <Eye size={22} />, title: '100% Realista', desc: 'Qualidade de estúdio profissional. Ninguém percebe que é IA.' },
        { icon: <TrendingUp size={22} />, title: '+300% Vendas', desc: 'Fotos profissionais aumentam a taxa de conversão dramaticamente.' },
        { icon: <ShoppingBag size={22} />, title: 'Multi-canal', desc: 'Perfeito para Shopee, Mercado Livre, iFood, Instagram e sua loja.' },
        { icon: <Shield size={22} />, title: 'Uso Comercial', desc: 'Licença comercial incluída. Use em qualquer canal de vendas.' },
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white overflow-x-hidden">
            {/* HERO */}
            <section className="relative py-20 md:py-32 px-6">
                <div className="absolute inset-0 bg-gradient-to-b from-emerald-600/8 via-transparent to-transparent" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <ShoppingBag size={12} />
                        Para Lojistas & E-commerce
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight leading-[0.95] mb-6">
                        Fotos Profissionais
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
                            de Produtos com IA
                        </span>
                    </h1>
                    <p className="text-white/50 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
                        Transforme fotos de celular em <strong className="text-white/80">imagens de catálogo profissional</strong> em 30 segundos.
                        Moda, joias, cosméticos, eletrônicos — qualquer produto.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onGetStarted} className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl font-black uppercase tracking-wider text-sm text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105">
                            <span className="flex items-center justify-center gap-2">
                                Começar Agora <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                        {onViewStudio && (
                            <button onClick={onViewStudio} className="px-8 py-4 rounded-2xl border border-white/10 font-bold text-sm hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all">
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
                            Para Qualquer <span className="text-emerald-400">Segmento</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto">
                            Presets especializados para cada tipo de produto e nicho de mercado.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {segments.map((seg, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveSegment(i)}
                                className={`p-5 rounded-2xl border text-left transition-all ${activeSegment === i
                                        ? 'bg-emerald-500/10 border-emerald-500/30 shadow-lg shadow-emerald-500/10'
                                        : 'bg-white/[0.02] border-white/5 hover:border-emerald-500/20'
                                    }`}
                            >
                                <div className={`mb-3 ${activeSegment === i ? 'text-emerald-400' : 'text-white/40'}`}>
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
                            Como <span className="text-emerald-400">Funciona</span>
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {steps.map((step, i) => (
                            <div key={i} className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all group">
                                <div className="text-emerald-500/30 text-4xl font-black mb-4">{step.num}</div>
                                <div className="text-emerald-400 mb-3">{step.icon}</div>
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
                            Por que <span className="text-emerald-400">Lojistas</span> Escolhem a Lumi
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {benefits.map((b, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-emerald-500/20 transition-all">
                                <div className="text-emerald-400 mb-4">{b.icon}</div>
                                <h3 className="text-white font-bold mb-2">{b.title}</h3>
                                <p className="text-white/40 text-sm">{b.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA FINAL */}
            <section id="pricing" className="py-20 px-6 bg-gradient-to-t from-emerald-600/8 to-transparent">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                        Comece a Vender <span className="text-emerald-400">Mais</span> Hoje
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto mb-8">
                        Fotos profissionais de produtos a partir de R$ 1,17 cada. Pagamento único, sem mensalidade.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button onClick={onGetStarted} className="group px-8 py-4 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl font-black uppercase tracking-wider text-sm text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all hover:scale-105">
                            <span className="flex items-center justify-center gap-2">
                                Escolher Meu Plano <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <FAQSection extraFaqs={varejoFaqs} accentColor="emerald" />

            {/* FOOTER */}
            <footer className="py-8 px-6 border-t border-white/5">
                <div className="max-w-5xl mx-auto text-center">
                    <p className="text-white/20 text-xs">© 2025 LumiphotoIA — Fotos profissionais de produtos com IA</p>
                </div>
            </footer>
        </div>
    );
};

export default VarejoLandingPage;
