import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

export interface FAQItem {
    q: string;
    a: string;
}

// ========== BASE FAQS — 3 perguntas essenciais para TODAS as páginas ==========
export const baseFaqs: FAQItem[] = [
    {
        q: 'Preciso saber usar IA ou ter experiência?',
        a: 'Não! Você só faz upload da foto e escolhe o estilo. A plataforma faz tudo automaticamente — funciona 100% no navegador, sem instalar nada.',
    },
    {
        q: 'É mensalidade? Como funciona o pagamento?',
        a: 'Não! É pagamento único. Você compra créditos e usa quando quiser — sem assinatura, sem renovação automática, e os créditos nunca expiram.',
    },
    {
        q: 'Qual a qualidade? Posso usar comercialmente?',
        a: 'Qualidade de estúdio profissional em alta resolução. Uso comercial 100% liberado em todos os planos — catálogos, anúncios, redes sociais, revenda.',
    },
];

// ========== FAQS ESPECÍFICOS POR NICHO ==========

export const ensaioFaqs: FAQItem[] = [
    {
        q: 'Como envio prévia para o cliente aprovar?',
        a: 'A plataforma tem um botão de "Prévia" que baixa a foto com marca d\'água. Você envia pelo WhatsApp e só entrega o HD depois que o cliente pagar.',
    },
    {
        q: 'E se o cliente não gostar?',
        a: 'A plataforma gera 3 variações por ensaio. Se nenhuma agradar, você pode regenerar com 1 crédito (custa ~R$ 1,21). O risco é mínimo.',
    },
];

export const advogadoFaqs: FAQItem[] = [
    {
        q: 'As fotos ficam com aspecto profissional suficiente para advogados?',
        a: 'Sim! Temos estilos específicos para advogados, com fundo de escritório, terno/terninho e iluminação de estúdio corporativo. As fotos transmitem a seriedade e credibilidade que o mercado jurídico exige.',
    },
    {
        q: 'Posso usar a foto no cartão da OAB ou site do escritório?',
        a: 'Sim! As fotos são geradas em alta resolução e com uso comercial liberado. Pode usar em cartões, site, LinkedIn, materiais de marketing e qualquer outro lugar.',
    },
];

export const aniversarioFaqs: FAQItem[] = [
    {
        q: 'Funciona para crianças e bebês?',
        a: 'Sim! A IA funciona com pessoas de todas as idades. Basta enviar uma selfie nítida do rosto e a IA cria o ensaio de aniversário com cenários temáticos.',
    },
    {
        q: 'Posso gerar fotos com tema específico de festa?',
        a: 'Sim! Você pode escolher estilos temáticos ou usar a Caixinha Mágica para descrever exatamente o tema que quer — safari, princesa, super-heróis, etc.',
    },
];

export const beautyFaqs: FAQItem[] = [
    {
        q: 'As fotos mostram maquiagem de forma realista?',
        a: 'Sim! A IA é treinada para gerar fotos com maquiagem profissional, iluminação beauty e acabamento editorial. Os resultados são como uma sessão de beleza em estúdio.',
    },
    {
        q: 'Posso usar para portfólio de maquiagem?',
        a: 'Sim! Uso comercial totalmente liberado. Perfeito para maquiadoras, esteticistas e profissionais de beleza mostrarem seu trabalho.',
    },
];

export const esteticaFaqs: FAQItem[] = [
    {
        q: 'Funciona para fotos de antes e depois?',
        a: 'A IA gera fotos profissionais a partir de selfies, mas não faz comparação de resultados de tratamentos. Use para criar fotos profissionais que transmitam credibilidade da sua clínica.',
    },
    {
        q: 'Posso usar nas redes sociais da minha clínica?',
        a: 'Sim! Uso comercial liberado em todos os planos. Perfeito para Instagram, site, Google Meu Negócio e materiais de marketing da sua clínica.',
    },
];

export const varejoFaqs: FAQItem[] = [
    {
        q: 'Posso usar para fotos de catálogo e loja virtual?',
        a: 'Sim! Os presets de varejo são otimizados para e-commerce, marketplaces (Shopee, Mercado Livre) e catálogos online. Gere fotos com fundo branco ou lifestyle em segundos.',
    },
    {
        q: 'Funciona para qualquer tipo de produto?',
        a: 'Sim! Moda, joias, acessórios, cosméticos, eletrônicos e muito mais. Basta subir a foto do produto e a IA cria imagens profissionais no estilo que você escolher.',
    },
    {
        q: 'Posso colocar o produto em uma modelo?',
        a: 'Sim! Suba a foto do produto + uma selfie da modelo e a IA veste a modelo com o produto em um cenário profissional. Perfeito para lookbooks e catálogos de moda.',
    },
];

export const deliveryFaqs: FAQItem[] = [
    {
        q: 'Funciona com fotos de celular?',
        a: 'Sim! Suba a foto do prato tirada com o celular e a IA transforma em food photography profissional — com iluminação, composição e cores que dão água na boca.',
    },
    {
        q: 'Posso usar para cardápio digital e iFood?',
        a: 'Sim! As fotos são geradas em alta resolução, perfeitas para cardápios digitais, iFood, Rappi, delivery próprio e redes sociais do restaurante.',
    },
    {
        q: 'Funciona para qualquer tipo de comida?',
        a: 'Sim! Hambúrguer, pizza, sushi, doces, açaí, saladas, pães, café e muito mais. Temos presets específicos para cada tipo de culinária.',
    },
];

// ========== COMPONENTE FAQ ==========

interface FAQSectionProps {
    /** Extra/niche-specific FAQs placed BEFORE the base FAQs */
    extraFaqs?: FAQItem[];
    /** Override the accent color (default amber) */
    accentColor?: 'amber' | 'emerald' | 'purple' | 'pink' | 'blue' | 'rose';
}

const accentStyles = {
    amber: {
        badge: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
        title: 'text-amber-500',
        iconActive: 'text-amber-500',
        itemHover: 'hover:border-amber-500/20',
    },
    emerald: {
        badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
        title: 'text-emerald-400',
        iconActive: 'text-emerald-500',
        itemHover: 'hover:border-emerald-500/20',
    },
    purple: {
        badge: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
        title: 'text-purple-400',
        iconActive: 'text-purple-500',
        itemHover: 'hover:border-purple-500/20',
    },
    pink: {
        badge: 'bg-pink-500/10 border-pink-500/20 text-pink-400',
        title: 'text-pink-400',
        iconActive: 'text-pink-500',
        itemHover: 'hover:border-pink-500/20',
    },
    blue: {
        badge: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
        title: 'text-blue-400',
        iconActive: 'text-blue-500',
        itemHover: 'hover:border-blue-500/20',
    },
    rose: {
        badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
        title: 'text-rose-400',
        iconActive: 'text-rose-500',
        itemHover: 'hover:border-rose-500/20',
    },
};

const FAQSection: React.FC<FAQSectionProps> = ({ extraFaqs = [], accentColor = 'amber' }) => {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const allFaqs = [...extraFaqs, ...baseFaqs];
    const styles = accentStyles[accentColor];

    return (
        <section className="py-24 bg-[#0a0a0a] border-t border-white/5">
            <div className="max-w-3xl mx-auto px-6">
                <div className="text-center mb-16">
                    <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] mb-6 ${styles.badge}`}>
                        <HelpCircle size={12} />
                        Dúvidas? Respondemos!
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tight mb-4">
                        Perguntas <span className={styles.title}>Frequentes</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mx-auto">
                        Tudo que você precisa saber antes de começar. Se tiver mais dúvidas, fale com nosso suporte.
                    </p>
                </div>

                <div className="space-y-3">
                    {allFaqs.map((faq, i) => (
                        <div
                            key={i}
                            className={`rounded-xl border border-white/5 overflow-hidden transition-all ${styles.itemHover}`}
                        >
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                className="w-full p-5 flex items-center justify-between text-left"
                            >
                                <span className="text-white font-bold text-sm pr-4">{faq.q}</span>
                                {openFaq === i ? (
                                    <ChevronUp size={18} className={`${styles.iconActive} shrink-0`} />
                                ) : (
                                    <ChevronDown size={18} className="text-white/30 shrink-0" />
                                )}
                            </button>
                            {openFaq === i && (
                                <div className="px-5 pb-5">
                                    <p className="text-white/50 text-sm leading-relaxed">{faq.a}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FAQSection;
