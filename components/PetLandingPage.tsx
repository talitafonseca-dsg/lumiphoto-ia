import React from 'react';
import {
    ArrowRight, Shield, Sparkles, Clock, Download, Eye,
    TrendingUp, Star, Camera, Heart, Zap, Check, Gem,
    Image as ImageIcon
} from 'lucide-react';
import FAQSection, { petFaqs } from './FAQSection';


interface PetLandingPageProps {
    onGetStarted: () => void;
    onViewStudio?: () => void;
    onLogin?: () => void;

}

export const PetLandingPage: React.FC<PetLandingPageProps> = ({ onGetStarted, onViewStudio, onLogin }) => {

    const heroPairs = [
        { before: '/pets/caramelo-antes.png', after: '/pets/caramelo-depois.png', label: 'Vira-lata Caramelo' },
        { before: '/pets/gato-antes.png', after: '/pets/gato-depois.png', label: 'Gato Cinza' },
        { before: '/pets/filhote-antes.png', after: '/pets/filhote-depois.png', label: 'Filhote' },
    ];

    const gallery = [
        { img: '/pets/gallery-bulldog.png', name: 'Bento', breed: 'Bulldog Francês · 1 ano' },
        { img: '/pets/tutor-dog.png', name: 'Fernanda & Thor', breed: 'Golden Retriever · Ensaio Tutor + Pet' },
        { img: '/pets/viralata-jardim.png', name: 'Pipoca', breed: 'Vira-lata Caramelo · Jardim Tropical' },
        { img: '/pets/gallery-husky.png', name: 'Zeus', breed: 'Husky Siberiano · 2 anos' },
        { img: '/pets/viralata-royal.png', name: 'Rei Caramelo', breed: 'Vira-lata · Ensaio Renascentista' },
        { img: '/pets/tutor-cat.png', name: 'Rafael & Mia', breed: 'Persa · Ensaio Tutor + Pet' },
        { img: '/pets/viralata-praia.png', name: 'Bolinha', breed: 'Vira-lata · Pôr do Sol na Praia' },
        { img: '/pets/gallery-siamese.png', name: 'Luna', breed: 'Siamês · 3 anos' },
        { img: '/pets/gallery-pomeranian.png', name: 'Floquinho', breed: 'Lulu da Pomerânia · 1 ano' },
        { img: '/pets/viralata-natalino.png', name: 'Noel', breed: 'Vira-lata · Ensaio de Natal' },
        { img: '/pets/gallery-labrador.png', name: 'Mel', breed: 'Labrador · 5 anos' },
        { img: '/pets/depois-cat.png', name: 'Simba', breed: 'Gato Laranja · 4 anos' },
    ];

    const painPoints = [
        { emoji: '📸', title: 'As fotos ficam escuras e sem graça', text: 'Você tira dezenas de fotos tentando capturar aquele momento perfeito. Mas a iluminação estraga, o fundo é uma bagunça e o peludo nunca fica parado.' },
        { emoji: '⏳', title: 'Ele está crescendo rápido demais', text: 'De filhote a adulto, em um piscar de olhos. Esses momentos não voltam. Cada fase é única — e merece ser eternizada com qualidade.' },
        { emoji: '💔', title: 'E se um dia ele não estiver mais aqui?', text: 'É a dor que nenhum tutor quer pensar, mas todos sentem. Uma foto de qualidade pode ser a memória mais preciosa que você vai ter para sempre.' },
        { emoji: '💸', title: 'Fotógrafo pet custa muito caro', text: 'R$ 500, R$ 1.000 por sessão. Você agenda, o pet não coopera, metade das fotos fica ruim. Dinheiro e tempo desperdiçados.' },
        { emoji: '😤', title: 'O pet nunca fica parado para a foto', text: 'Você aponta o celular e ele desvia, vira, corre. A melhor foto que você tirou ainda assim ficou com os olhos fechados ou fora de foco.' },
        { emoji: '🖼️', title: 'Merecia estar em um quadro na parede', text: 'Você vê tutores com aquelas fotos lindas e pensa: meu pet é mais bonito que todos esses. Mas nunca teve a foto que faz jus a isso.' },
    ];

    const testimonials = [
        { text: 'Meu Golden tem 11 anos e eu sempre quis um ensaio lindo dele. Nunca tive coragem de gastar R$ 800 num fotógrafo. A LumiphotoIA fez em 30 segundos e eu chorei de emoção.', highlight: 'chorei de emoção', name: 'Fernanda Alves', role: 'Tutora do Thor — SP', avatar: '🐕' },
        { text: 'Minha gatinha partiu esse ano. Antes de acontecer, fiz o ensaio dela pela LumiphotoIA. Hoje esse quadro é o bem mais precioso que eu tenho. Não tem preço.', highlight: 'o bem mais precioso', name: 'Carla Menezes', role: 'Tutora da Mel — RJ', avatar: '🐈' },
        { text: 'Fiz o ensaio do meu Bulldog e mandei para toda a família no Natal como presente. Todo mundo perguntou onde eu contratei o fotógrafo. Não acreditaram que foi IA.', highlight: 'Não acreditaram que foi IA', name: 'Roberto Lima', role: 'Tutor do Bento — BH', avatar: '🐾' },
        { text: 'Uso para vender ensaios dos pets dos meus clientes. Cobro R$ 120 por ensaio e gasto centavos para gerar. Minha renda dobrou no primeiro mês.', highlight: 'Minha renda dobrou', name: 'Ana Paula Costa', role: 'Pet influencer — Fortaleza', avatar: '📸' },
        { text: 'Fiz o ensaio do meu cachorro como fundo de tela do celular. Todo mundo que vê me pergunta onde fiz. Viramos celebridades da família.', highlight: 'celebridades da família', name: 'Juliana Rocha', role: 'Tutora da Luna — Curitiba', avatar: '🦮' },
        { text: 'Meu filho fez de aniversário para a nossa cachorra. O quadro dela na parede é o item mais comentado por quem visita a casa. Parece pintura de artista.', highlight: 'pintura de artista', name: 'Marcos Souza', role: 'Tutor da Belinha — SP', avatar: '🎂' },
    ];

    const plans = [
        { name: 'Memória', emoji: '🐾', price: 37, credits: 10, perCredit: '3,70', features: ['10 transformações de foto', 'Cães e gatos', 'Alta resolução para impressão', 'Download imediato', 'Suporte por email'], featured: false },
        { name: 'Família Pet', emoji: '🏅', price: 97, credits: 50, perCredit: '1,94', features: ['50 transformações de foto', 'Cães, gatos e outros pets', 'Alta resolução (print + digital)', 'Estilos exclusivos premium', 'Ensaio tutor + pet', 'Suporte prioritário WhatsApp'], featured: true, badge: '❤️ Mais popular' },
        { name: 'Eternidade', emoji: '🌟', price: 197, credits: 150, perCredit: '1,31', features: ['150 transformações de foto', 'Resolução máxima 4K', 'Todos os tipos de pet', 'Estilos VIP exclusivos', 'Ideal para revendedores', 'Suporte dedicado'], featured: false },
    ];

    return (
        <div className="min-h-screen h-screen overflow-y-auto bg-[#0a0a0a] text-white overflow-x-hidden">
            {/* ===== TOPBAR ===== */}
            <div className="bg-gradient-to-r from-[#003d4d]/80 via-[#005a73]/80 to-[#003d4d]/80 text-center py-2.5 px-4">
                <p className="text-[#80d4ec]/90 text-xs font-bold tracking-wider">
                    🐾 Oferta especial — <span className="text-white">primeiras 200 famílias: 35% OFF</span> — Eternize esse momento antes que passe
                </p>
            </div>

            {/* ===== NAV ===== */}
            <nav className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-6 py-4">
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <div className="flex items-center gap-1.5 min-w-0 shrink-0">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-5 md:h-10 w-auto object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="text-[11px] md:text-base font-black text-transparent bg-clip-text bg-gradient-to-r from-[#33b7da] to-[#00a5d1]">LUMI<span className="text-white">IA</span></span>
                            <span className="text-[7px] md:text-[11px] font-black uppercase tracking-[0.15em] text-orange-400">🐾 Pets</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-6">
                        <button onClick={onLogin} className="text-white/50 text-[10px] md:text-sm hover:text-white transition-colors">Entrar</button>
                        <button onClick={onViewStudio} className="text-white/50 text-[10px] md:text-sm hover:text-white transition-colors">Estúdio</button>
                        <button onClick={onGetStarted} className="px-3 md:px-5 py-1.5 md:py-2 bg-gradient-to-r from-[#00a5d1] to-[#008db5] text-black text-[9px] md:text-xs font-black uppercase tracking-wider rounded-full hover:shadow-[0_0_25px_rgba(0,165,209,0.4)] transition-all">
                            VER PACOTES
                        </button>
                    </div>
                </div>
            </nav>

            {/* ===== HERO ===== */}
            <section className="py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                    {/* Left */}
                    <div className="min-w-0">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00a5d1]/10 border border-[#00a5d1]/20 text-orange-400 text-[10px] font-black uppercase tracking-widest mb-8">
                            <Heart size={12} /> Para tutores apaixonados
                        </div>

                        <h1 className="text-[1.6rem] sm:text-4xl md:text-6xl font-black uppercase leading-[1.05] tracking-tight mb-6">
                            Seu pet merece<br />
                            um ensaio<br />
                            <span className="text-orange-400 italic font-serif font-normal normal-case text-[0.9em]">digno do amor</span><br />
                            que você sente.
                        </h1>

                        <p className="text-white/40 text-sm sm:text-base leading-relaxed mb-8 max-w-full md:max-w-md break-words">
                            Transforme qualquer foto do seu peludo em um <strong className="text-white/70">ensaio fotográfico profissional</strong> — em 30 segundos, sem fotógrafo, sem estúdio, sem sair de casa.
                        </p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {['🐾 Cães & Gatos', '⚡ 30 segundos', '📱 Só com o celular', '💛 Para eternizar'].map((pill, i) => (
                                <span key={i} className="px-2.5 sm:px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-[11px] sm:text-xs font-semibold">{pill}</span>
                            ))}
                        </div>

                        {/* CTA */}
                        <button onClick={onGetStarted} className="group flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#00a5d1] to-[#008db5] text-black font-black text-base uppercase tracking-wider hover:shadow-[0_0_40px_rgba(0,165,209,0.4)] transition-all">
                            <Sparkles size={18} /> Eternizar meu pet agora
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <p className="text-white/20 text-xs mt-4">A partir de R$ 37 • Pagamento único • Sem mensalidade</p>

                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-white/30 text-[10px] sm:text-xs">
                            <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> Resultado em 30s</span>
                            <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> Alta resolução</span>
                            <span className="flex items-center gap-1"><Check size={12} className="text-green-400" /> Download imediato</span>
                        </div>
                    </div>

                    {/* Right: Before/After + 3 Sample Photos — Desktop */}
                    <div className="relative hidden lg:block">
                        {/* Before/After Collage */}
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="relative rounded-2xl overflow-hidden border border-red-500/20 shadow-lg">
                                <img src="/pets/caramelo-antes.png" alt="Antes - foto caseira" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-2 left-2 px-2 py-1 bg-red-500/80 text-[9px] font-black text-white uppercase tracking-wider rounded-lg">📱 Foto do celular</span>
                            </div>
                            <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500/40 shadow-[0_8px_30px_rgba(0,165,209,0.2)]">
                                <img src="/pets/caramelo-depois.png" alt="Depois - IA profissional" className="w-full h-48 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-2 right-2 px-2 py-1 bg-orange-500/90 text-[9px] font-black text-black uppercase tracking-wider rounded-lg">✨ Ensaio IA</span>
                            </div>
                        </div>
                        {/* Mini pairs row */}
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            {heroPairs.map((pair, i) => (
                                <div key={i} className="relative rounded-xl overflow-hidden border border-white/10">
                                    <div className="flex relative">
                                        <div className="w-1/2 relative">
                                            <img src={pair.before} alt={`Antes ${pair.label}`} className="w-full h-16 object-cover" />
                                            <span className="absolute bottom-0.5 left-0.5 px-1 py-0.5 bg-red-500/70 text-[6px] font-black text-white uppercase rounded">antes</span>
                                        </div>
                                        <div className="w-1/2 relative">
                                            <img src={pair.after} alt={`Depois ${pair.label}`} className="w-full h-16 object-cover" />
                                            <span className="absolute bottom-0.5 right-0.5 px-1 py-0.5 bg-orange-500/90 text-[6px] font-black text-black uppercase rounded">depois</span>
                                        </div>
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg z-10">
                                            <ArrowRight size={7} className="text-black" />
                                        </div>
                                    </div>
                                    <p className="text-center text-[7px] font-black text-white/40 py-0.5 bg-black/40">{pair.label}</p>
                                </div>
                            ))}
                        </div>
                        {/* 3 Trial sample photos */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { img: '/pets/trial-praia.png', label: '🏖️ Praia', desc: 'Pôr do sol na praia' },
                                { img: '/pets/trial-estudio.png', label: '📸 Estúdio', desc: 'Fundo profissional' },
                                { img: '/pets/trial-natureza.png', label: '🌿 Natureza', desc: 'Jardim tropical' },
                            ].map((s, i) => (
                                <div key={i} className={`relative rounded-2xl overflow-hidden border-2 ${i === 1 ? 'border-orange-500/50 shadow-[0_8px_30px_rgba(0,165,209,0.2)] scale-105 z-10' : 'border-white/10'} transition-all hover:scale-105`}>
                                    <img src={s.img} alt={s.label} className="w-full aspect-[3/4] object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                                        <p className="text-white font-black text-sm">{s.label}</p>
                                        <p className="text-white/40 text-[10px]">{s.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 text-center">
                            <p className="text-orange-400/80 text-xs font-black">🐾 Esses 3 estilos chegam grátis ao testar</p>
                        </div>
                        {/* Floating heart */}
                        <div className="absolute -top-4 -right-4 w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center text-2xl shadow-[0_4px_20px_rgba(244,63,94,0.4)] animate-pulse z-10">
                            ❤️
                        </div>
                    </div>

                    {/* Mobile: Before/After + sample photos */}
                    <div className="lg:hidden -mx-6 px-6 space-y-4">
                        {/* Before/After pair */}
                        <div className="grid grid-cols-2 gap-2">
                            <div className="relative rounded-xl overflow-hidden border border-red-500/20">
                                <img src="/pets/caramelo-antes.png" alt="Antes" className="w-full h-36 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-1.5 left-1.5 px-2 py-0.5 bg-red-500/80 text-[8px] font-black text-white uppercase rounded">📱 Antes</span>
                            </div>
                            <div className="relative rounded-xl overflow-hidden border-2 border-orange-500/40">
                                <img src="/pets/caramelo-depois.png" alt="Depois" className="w-full h-36 object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 bg-orange-500/90 text-[8px] font-black text-black uppercase rounded">✨ IA</span>
                            </div>
                        </div>
                        {/* 3 Trial sample photos */}
                        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                            {[
                                { img: '/pets/trial-praia.png', label: '🏖️ Praia', desc: 'Pôr do sol' },
                                { img: '/pets/trial-estudio.png', label: '📸 Estúdio', desc: 'Fundo clean' },
                                { img: '/pets/trial-natureza.png', label: '🌿 Natureza', desc: 'Jardim tropical' },
                            ].map((s, i) => (
                                <div key={i} className={`flex-shrink-0 w-36 rounded-2xl overflow-hidden border-2 ${i === 1 ? 'border-orange-500/50 shadow-[0_8px_20px_rgba(0,165,209,0.15)]' : 'border-white/10'}`}>
                                    <div className="relative aspect-[3/4]">
                                        <img src={s.img} alt={s.label} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                                            <p className="text-white font-black text-xs">{s.label}</p>
                                            <p className="text-white/40 text-[9px]">{s.desc}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-orange-400/60 text-[10px] font-black">🐾 Esses 3 estilos chegam grátis ao testar</p>
                    </div>
                </div>
            </section>

            {/* ===== SOCIAL PROOF BAR ===== */}
            <div className="bg-gradient-to-r from-[#003d4d]/30 via-[#005a73]/20 to-[#003d4d]/30 border-y border-[#00a5d1]/10 py-6 px-6">
                <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-around gap-6">
                    {[
                        { num: '+8.400', label: 'Tutores felizes' },
                        { num: '+24K', label: 'Ensaios gerados' },
                        { num: '30s', label: 'Tempo por foto' },
                        { num: '4.9★', label: 'Avaliação média' },
                        { num: 'R$37', label: 'A partir de' },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <p className="text-2xl md:text-3xl font-black text-orange-400">{item.num}</p>
                            <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest mt-1">{item.label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ===== DOR / PAIN POINTS ===== */}
            <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#003d4d]/5 to-transparent overflow-hidden">
                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-6 h-px bg-[#33b7da]/60" />
                        A verdade que toda família pet sente
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-4">
                        Fotos do celular não capturam<br />
                        <span className="text-orange-400 italic font-serif font-normal normal-case">o que o coração vê.</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mb-14 leading-relaxed">
                        Você olha para o seu pet e vê o ser mais lindo do mundo. Mas as fotos nunca conseguem mostrar isso de verdade.
                    </p>

                    {/* Large visual before/after comparison */}
                    <div className="grid lg:grid-cols-2 gap-6 mb-14">
                        <div className="relative rounded-2xl overflow-hidden border border-red-500/20 group">
                            <img src="/pets/caramelo-antes.png" alt="Foto comum do celular" className="w-full h-72 md:h-96 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <span className="px-3 py-1 bg-red-500/80 text-[10px] font-black text-white uppercase tracking-wider rounded-lg inline-block mb-3">📱 Realidade</span>
                                <p className="text-white font-bold text-lg">A foto que você tem no celular</p>
                                <p className="text-white/50 text-sm mt-1">Escura, desfocada, com fundo bagunçado. Não faz jus ao quanto ele é lindo.</p>
                            </div>
                        </div>
                        <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500/30 shadow-[0_0_40px_rgba(0,165,209,0.15)] group">
                            <img src="/pets/caramelo-depois.png" alt="Ensaio profissional IA" className="w-full h-72 md:h-96 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6">
                                <span className="px-3 py-1 bg-orange-500/90 text-[10px] font-black text-black uppercase tracking-wider rounded-lg inline-block mb-3">✨ Ensaio IA</span>
                                <p className="text-white font-bold text-lg">A foto que seu pet <span className="text-orange-400">merece</span></p>
                                <p className="text-white/50 text-sm mt-1">Iluminação de estúdio, fundo profissional, cada detalhe valorizado. Em 30 segundos.</p>
                            </div>
                        </div>
                    </div>

                    {/* Pain point cards with images */}
                    <div className="grid md:grid-cols-2 gap-4 mb-10">
                        {/* Card 1 — with cat before/after */}
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20 transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                            <div className="flex h-44">
                                <div className="w-1/2 relative">
                                    <img src="/pets/gato-antes.png" alt="Gato foto caseira" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-red-500/70 text-[7px] font-black text-white uppercase rounded">Antes</span>
                                </div>
                                <div className="w-1/2 relative">
                                    <img src="/pets/gato-depois.png" alt="Gato ensaio IA" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-orange-500/90 text-[7px] font-black text-black uppercase rounded">Depois</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">📸</span>
                                    <h3 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">As fotos ficam escuras e sem graça</h3>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">Você tira dezenas de fotos tentando capturar aquele momento perfeito. Mas a iluminação estraga, o fundo é uma bagunça e o peludo nunca fica parado. <strong className="text-white/50">Com a IA, basta UMA foto.</strong></p>
                            </div>
                        </div>

                        {/* Card 2 — puppy before/after */}
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20 transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                            <div className="flex h-44">
                                <div className="w-1/2 relative">
                                    <img src="/pets/filhote-antes.png" alt="Filhote brincando" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-red-500/70 text-[7px] font-black text-white uppercase rounded">Filhote</span>
                                </div>
                                <div className="w-1/2 relative">
                                    <img src="/pets/filhote-depois.png" alt="Filhote ensaio" className="w-full h-full object-cover" />
                                    <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-orange-500/90 text-[7px] font-black text-black uppercase rounded">Ensaio IA</span>
                                </div>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">⏳</span>
                                    <h3 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">Ele está crescendo rápido demais</h3>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">De filhote a adulto, em um piscar de olhos. Esses momentos não voltam. Cada fase é única. <strong className="text-white/50">Eternize AGORA — antes que esse momento vire só lembrança.</strong></p>
                            </div>
                        </div>

                        {/* Card 3 — emotional, no image */}
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-rose-500/5 to-transparent border border-rose-500/10 hover:border-rose-500/30 transition-all duration-300 group hover:-translate-y-1">
                            <span className="text-4xl mb-3 block">💔</span>
                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-rose-300 transition-colors">E se um dia ele não estiver mais aqui?</h3>
                            <p className="text-white/30 text-sm leading-relaxed">É a dor que nenhum tutor quer pensar, mas todos sentem. Uma foto de qualidade pode ser <strong className="text-rose-300/80">a memória mais preciosa que você vai ter para sempre</strong>. Não deixe para depois.</p>
                            <div className="mt-4 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                                <p className="text-white/40 text-xs italic">"Minha gatinha partiu esse ano. O ensaio que fiz antes é o bem mais precioso que tenho." — Carla, RJ</p>
                            </div>
                        </div>

                        {/* Card 4 — comparison with fotógrafo */}
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20 transition-all duration-300 group hover:-translate-y-1">
                            <span className="text-4xl mb-3 block">💸</span>
                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-orange-300 transition-colors">Fotógrafo pet custa muito caro</h3>
                            <p className="text-white/30 text-sm leading-relaxed mb-4">R$ 500 a R$ 1.000 por sessão. Você agenda, o pet não coopera, metade das fotos fica ruim.</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                                    <p className="text-red-400 text-xl font-black">R$ 800</p>
                                    <p className="text-white/30 text-[10px] mt-1">Fotógrafo pet</p>
                                    <p className="text-red-400/60 text-[9px]">+ deslocamento + espera</p>
                                </div>
                                <div className="p-3 rounded-xl bg-green-500/5 border border-green-500/10 text-center">
                                    <p className="text-green-400 text-xl font-black">R$ 37</p>
                                    <p className="text-white/30 text-[10px] mt-1">LumiphotoIA</p>
                                    <p className="text-green-400/60 text-[9px]">10 ensaios em 30 seg</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 5 — tutor+pet image */}
                        <div className="rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20 transition-all duration-300 overflow-hidden group hover:-translate-y-1">
                            <div className="h-64 relative">
                                <img src="/pets/tutor-dog.png" alt="Tutor com pet - ensaio profissional" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-orange-500/90 text-[8px] font-black text-black uppercase rounded">✨ Ensaio Tutor + Pet</span>
                            </div>
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-2xl">🖼️</span>
                                    <h3 className="text-white font-bold text-base group-hover:text-orange-300 transition-colors">Merecia estar em um quadro na parede</h3>
                                </div>
                                <p className="text-white/30 text-sm leading-relaxed">Você pode ter um ensaio profissional <strong className="text-white/50">com o seu pet junto</strong> — digno de quadro, de presente, de guardar para sempre. Sem sair de casa.</p>
                            </div>
                        </div>

                        {/* Card 6 */}
                        <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20 transition-all duration-300 group hover:-translate-y-1">
                            <span className="text-4xl mb-3 block">😤</span>
                            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-orange-300 transition-colors">O pet nunca fica parado para a foto</h3>
                            <p className="text-white/30 text-sm leading-relaxed mb-3">Você aponta o celular e ele desvia, vira, corre. A melhor foto que você tirou ainda assim ficou fora de foco.</p>
                            <div className="p-3 rounded-xl bg-orange-500/5 border border-[#00a5d1]/10">
                                <p className="text-orange-400 text-xs font-bold mb-1">💡 Com a LumiphotoIA:</p>
                                <p className="text-white/40 text-xs">Qualquer foto serve. Mesmo desfocada, com o pet de costas ou com os olhos fechados. A IA transforma qualquer foto em obra de arte.</p>
                            </div>
                        </div>
                    </div>

                    {/* Section CTA */}
                    <div className="text-center">
                        <button onClick={onGetStarted} className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white/[0.05] border border-orange-500/30 text-orange-400 font-bold text-sm uppercase tracking-wider hover:bg-[#00a5d1]/10 hover:shadow-[0_0_30px_rgba(0,165,209,0.15)] transition-all">
                            <Camera size={16} /> Ver a transformação do meu pet
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            {/* ===== COMO FUNCIONA ===== */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-6 h-px bg-[#33b7da]/60" />
                        Como funciona
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-4">
                        Três passos.<br />
                        <span className="text-orange-400">Trinta segundos.</span> Uma memória eterna.
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mb-14 leading-relaxed">
                        Sem fotógrafo, sem estúdio, sem equipamento especial. Só você, seu celular e o amor pelo seu pet.
                    </p>

                    <div className="grid md:grid-cols-3 gap-8 relative">
                        {/* Connection line */}
                        <div className="hidden md:block absolute top-8 left-[18%] right-[18%] h-0.5 bg-gradient-to-r from-orange-500/30 via-rose-500/30 to-[#00a5d1]/30" />

                        {[
                            { num: '1', title: 'Tire uma foto comum', desc: 'Qualquer foto do seu pet serve. Com o celular, em casa, no jardim, no sofá. Não precisa ser perfeita — a IA cuida disso.', badge: '📱 Qualquer celular', img: '/pets/caramelo-antes.png' },
                            { num: '2', title: 'Envie para a LumiphotoIA', desc: 'Faça upload da foto na plataforma, escolha o estilo do ensaio e clique em transformar. Mais fácil que enviar foto no WhatsApp.', badge: '🖱️ 3 cliques', img: '/logo-gold.png' },
                            { num: '3', title: 'Receba o ensaio profissional', desc: 'Em 30 segundos, seu pet vira protagonista de um ensaio de estúdio digno de revista. Baixe, imprima, quadro na parede.', badge: '⚡ 30 segundos', img: '/pets/caramelo-depois.png' },
                        ].map((step, i) => (
                            <div key={i} className="relative text-center">
                                <div className="w-14 h-14 mx-auto bg-gradient-to-br from-[#00a5d1] to-[#008db5] text-black font-black text-2xl rounded-full flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,165,209,0.3)] relative z-10 ring-4 ring-[#0a0a0a]">
                                    {step.num}
                                </div>
                                {step.img && (
                                    <div className={`rounded-xl overflow-hidden border border-white/10 mb-4 mx-auto max-w-[200px] ${step.num === '2' ? 'bg-[#111] flex items-center justify-center p-6' : ''}`}>
                                        <img src={step.img} alt={step.title} className={step.num === '2' ? 'w-32 h-auto object-contain' : 'w-full h-32 object-cover'} />
                                    </div>
                                )}
                                <h3 className="text-white font-bold text-lg mb-2">{step.title}</h3>
                                <p className="text-white/30 text-sm leading-relaxed mb-3">{step.desc}</p>
                                <span className="inline-block px-3 py-1 rounded-full bg-[#00a5d1]/10 border border-[#00a5d1]/20 text-orange-400 text-xs font-bold">{step.badge}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== GALLERY ===== */}
            <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#003d4d]/5 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-6 h-px bg-[#33b7da]/60" />
                        Galeria de ensaios
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-4">
                        Pets reais. Resultados<br />
                        <span className="text-orange-400 italic font-serif font-normal normal-case">que emocionam.</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-lg mb-14 leading-relaxed">
                        Cada foto abaixo começou como uma foto comum de celular. A IA transformou em arte. Incluindo ensaios de tutores com seus pets.
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {gallery.map((item, i) => (
                            <div key={i} className={`relative rounded-2xl overflow-hidden border border-white/5 hover:border-orange-500/30 transition-all duration-300 group cursor-pointer ${i === 1 ? 'md:mt-6' : i === 3 ? 'md:-mt-6' : ''}`}>
                                <div className="relative aspect-[3/4] overflow-hidden">
                                    <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <p className="text-white font-bold text-sm italic">{item.name}</p>
                                        <p className="text-white/60 text-[10px]">{item.breed}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== EMOTIONAL CTA ===== */}
            <section className="py-24 px-4 sm:px-6 bg-gradient-to-b from-[#003d4d]/10 via-[#0a0a0a] to-[#0a0a0a] text-center relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
                </div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-6">
                        Ele te dá amor incondicional<br />todo dia. Você merece ter uma<br />
                        foto <span className="text-orange-400 italic font-serif font-normal normal-case">à altura desse amor.</span>
                    </h2>
                    <p className="text-white/40 text-lg leading-relaxed max-w-xl mx-auto mb-10">
                        Seu pet não liga para fotos. Mas <strong className="text-white/70">você vai ligar</strong> — daqui a 5, 10, 15 anos. Quando você abrir aquele álbum e ver aquele olhar, aquela expressão, aquele momento.
                    </p>
                    <button onClick={onGetStarted} className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#00a5d1] to-[#008db5] text-black font-black text-lg uppercase tracking-wider hover:shadow-[0_0_50px_rgba(0,165,209,0.4)] transition-all">
                        <Heart size={20} /> Eternizar meu pet agora
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            </section>

            {/* ===== TESTIMONIALS ===== */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                        <span className="w-6 h-px bg-[#33b7da]/60" />
                        O que os tutores dizem
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-14">
                        Famílias reais.<br />
                        Emoções <span className="text-orange-400 italic font-serif font-normal normal-case">reais.</span>
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {testimonials.map((t, i) => (
                            <div key={i} className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20 transition-all duration-300 hover:-translate-y-1">
                                <div className="text-orange-400 text-sm mb-3 tracking-wider">★★★★★</div>
                                <p className="text-white/60 text-sm leading-relaxed mb-5 italic">
                                    "{t.text.split(t.highlight)[0]}<strong className="text-orange-400 not-italic">{t.highlight}</strong>{t.text.split(t.highlight)[1]}"
                                </p>
                                <div className="flex items-center gap-3 border-t border-white/5 pt-4">
                                    <div className="w-10 h-10 rounded-full bg-white/[0.05] border border-white/10 flex items-center justify-center text-xl">{t.avatar}</div>
                                    <div>
                                        <p className="text-white font-bold text-sm">{t.name}</p>
                                        <p className="text-white/30 text-xs">{t.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== PRICING ===== */}
            <section className="py-20 px-4 sm:px-6 bg-gradient-to-b from-[#003d4d]/5 to-transparent">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-14">
                        <div className="inline-flex items-center gap-2 text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4">
                            <span className="w-6 h-px bg-[#33b7da]/60" />
                            Escolha seu plano
                            <span className="w-6 h-px bg-[#33b7da]/60" />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-4">
                            Menos que um petisco.<br />
                            Uma memória <span className="text-orange-400 italic font-serif font-normal normal-case">para sempre.</span>
                        </h2>
                        <p className="text-white/40 text-sm max-w-lg mx-auto leading-relaxed">
                            Pagamento único, sem mensalidade. Você paga uma vez e tem ensaios que vão durar a vida inteira.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
                            {['Pagamento Único', 'Créditos Não Expiram', 'Sem Renovação Automática'].map((badge, i) => (
                                <span key={i} className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold flex items-center gap-1">
                                    <Check size={10} /> {badge}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {plans.map((plan, i) => (
                            <div key={i} className={`relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-2 ${plan.featured ? 'bg-gradient-to-b from-orange-500/10 to-transparent border-2 border-orange-500/30 shadow-[0_0_40px_rgba(0,165,209,0.1)] scale-[1.03]' : 'bg-white/[0.03] border border-white/5 hover:border-[#00a5d1]/20'}`}>
                                {plan.featured && (
                                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-orange-500 text-black text-[10px] font-black uppercase tracking-wider rounded-full whitespace-nowrap">{plan.badge}</span>
                                )}
                                <div className="text-center mb-6">
                                    <span className="text-4xl mb-3 block">{plan.emoji}</span>
                                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">{plan.name}</p>
                                    <p className="text-5xl font-black text-white"><span className="text-xl text-white/40">R$</span>{plan.price}</p>
                                    <p className="text-white/30 text-xs mt-1">pagamento único · {plan.credits} ensaios</p>
                                    <p className="text-orange-400 text-xs font-bold mt-1">= R$ {plan.perCredit}/ensaio</p>
                                </div>
                                <ul className="space-y-2.5 mb-6">
                                    {plan.features.map((f, fi) => (
                                        <li key={fi} className="flex items-center gap-2 text-white/60 text-sm">
                                            <Gem size={10} className="text-orange-400 flex-shrink-0" /> {f}
                                        </li>
                                    ))}
                                </ul>
                                <button onClick={onGetStarted} className={`w-full py-3.5 rounded-full font-bold text-sm uppercase tracking-wider transition-all ${plan.featured ? 'bg-gradient-to-r from-[#00a5d1] to-[#008db5] text-black hover:shadow-[0_0_30px_rgba(0,165,209,0.4)]' : 'bg-white/[0.05] text-white border border-white/10 hover:border-orange-500/30 hover:text-orange-400'}`}>
                                    {plan.featured ? 'Quero o Família Pet →' : `Começar com ${plan.name}`}
                                </button>
                                <p className="text-center text-white/20 text-[10px] mt-3">Pagamento único — sem mensalidade</p>
                            </div>
                        ))}
                    </div>

                    {/* Trust strip */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-white/20 text-xs">
                        <span className="flex items-center gap-1"><Shield size={12} /> Pagamento 100% seguro</span>
                        <span className="flex items-center gap-1"><Check size={12} /> Sem pegadinhas</span>
                        <span className="flex items-center gap-1"><Check size={12} /> Sem fidelidade</span>
                        <span className="flex items-center gap-1"><Star size={12} /> 4.9/5 avaliação</span>
                    </div>
                </div>
            </section>

            {/* ===== FAQ ===== */}
            <section className="py-20 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <FAQSection extraFaqs={petFaqs} accentColor="blue" />
                </div>
            </section>

            {/* ===== FINAL CTA ===== */}
            <section className="py-24 px-4 sm:px-6 text-center relative overflow-hidden">
                <div className="absolute top-10 left-20 text-8xl opacity-[0.03] pointer-events-none">🐾</div>
                <div className="absolute bottom-10 right-20 text-8xl opacity-[0.03] rotate-12 pointer-events-none">🐾</div>
                <div className="relative z-10 max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-5xl font-black uppercase text-white leading-tight mb-6">
                        Cada dia é uma memória<br />
                        que você pode <span className="text-orange-400 italic font-serif font-normal normal-case">eternizar</span><br />
                        — ou deixar passar.
                    </h2>
                    <p className="text-white/40 text-base leading-relaxed max-w-md mx-auto mb-10">
                        Seu pet está aqui agora. Esse olhar, esse jeito de te olhar — dura um instante. A foto dura para sempre.
                    </p>
                    <button onClick={onGetStarted} className="group inline-flex items-center gap-3 px-10 py-5 rounded-full bg-gradient-to-r from-[#00a5d1] to-[#008db5] text-black font-black text-lg uppercase tracking-wider hover:shadow-[0_0_50px_rgba(0,165,209,0.4)] transition-all">
                        <Sparkles size={20} /> Fazer o ensaio do meu pet agora
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex flex-wrap items-center justify-center gap-5 mt-6">
                        {['Sem mensalidade', 'Garantia de 7 dias', 'Resultado em 30 segundos', 'A partir de R$ 37'].map((g, i) => (
                            <span key={i} className="flex items-center gap-1.5 text-white/30 text-xs">
                                <Check size={12} className="text-green-400" /> {g}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ===== FOOTER ===== */}
            <footer className="bg-white/[0.02] border-t border-white/5 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="h-6 w-auto object-contain opacity-30" />
                        <span className="text-white/30 text-sm">Pets</span>
                    </div>
                    <p className="text-white/20 text-xs">© 2025 LumiphotoIA. Todos os direitos reservados.</p>
                    <div className="flex gap-5 text-white/20 text-xs">
                        <span className="hover:text-white/50 cursor-pointer transition-colors">Termos</span>
                        <span className="hover:text-white/50 cursor-pointer transition-colors">Privacidade</span>
                        <span className="hover:text-white/50 cursor-pointer transition-colors">Contato</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PetLandingPage;
