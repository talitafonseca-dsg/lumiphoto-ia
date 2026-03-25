import React, { useState, useEffect } from 'react';
import { Loader2, Check, Sparkles, Shield, Clock, Zap, ArrowRight, CreditCard, Phone } from 'lucide-react';

interface CheckoutPageProps {
    onBack?: () => void;
}

interface PlanType {
    id: string;
    name: string;
    emoji: string;
    price: number;
    credits: number;
    pricePerPhoto: number;
    popular: boolean;
    savingsPercent?: number;
    badge?: string;
}

const STARTER_PRICE_PER_PHOTO = 3.70;

const PLANS: Record<string, PlanType> = {
    starter: {
        id: 'starter',
        name: 'Starter',
        emoji: '🚀',
        price: 37,
        credits: 10,
        pricePerPhoto: 3.70,
        popular: false,
    },
    essencial: {
        id: 'essencial',
        name: 'Essencial',
        emoji: '🌟',
        price: 57,
        credits: 30,
        pricePerPhoto: 1.90,
        popular: false,
        savingsPercent: 49,
        badge: '-49%/foto',
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        emoji: '🔥',
        price: 97,
        credits: 80,
        pricePerPhoto: 1.21,
        popular: true,
        savingsPercent: 67,
        badge: '-67%/foto',
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        emoji: '👑',
        price: 117,
        credits: 100,
        pricePerPhoto: 1.17,
        popular: false,
        savingsPercent: 68,
        badge: '-68%/foto',
    },
};

const BENEFITS = [
    { icon: Sparkles, text: 'Fotos profissionais com IA' },
    { icon: Zap, text: 'Use quando quiser, sem prazo' },
    { icon: Shield, text: 'Uso comercial liberado' },
    { icon: Clock, text: 'Atualizações incluídas' },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
    const [selectedPlan, setSelectedPlan] = useState<'starter' | 'essencial' | 'pro' | 'premium'>('pro');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Capture referral code from URL or localStorage
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const refCode = params.get('ref');
        if (refCode) {
            localStorage.setItem('referral_code', refCode);
        }
    }, []);

    // Fire InitiateCheckout via TrackPro on page load (Pixel + CAPI)
    useEffect(() => {
        // Recover identity for returning visitors (e.g. came back from MP)
        try {
            const cachedEmail = localStorage.getItem('_tp_cached_email');
            if (cachedEmail && typeof (window as any).trackProUpdateIdentity === 'function') {
                const cachedPhone = localStorage.getItem('_tp_cached_phone') || undefined;
                (window as any).trackProUpdateIdentity(cachedEmail, cachedPhone);
            }
        } catch { /* ignore */ }

        if (typeof (window as any).trackPro === 'function') {
            (window as any).trackPro('InitiateCheckout', {
                custom_data: {
                    value: PLANS[selectedPlan].price,
                    currency: 'BRL',
                    content_name: PLANS[selectedPlan].name,
                    content_ids: [PLANS[selectedPlan].id],
                    num_items: PLANS[selectedPlan].credits,
                },
            });
        }
    }, []);

    const handleCheckout = async () => {
        if (!email) {
            setError('Por favor, insira seu email');
            return;
        }

        if (!email.includes('@')) {
            setError('Por favor, insira um email válido');
            return;
        }

        setLoading(true);
        setError(null);

        // Update Pixel identity with user-provided email/phone
        try {
            if (typeof (window as any).trackProUpdateIdentity === 'function') {
                (window as any).trackProUpdateIdentity(email, whatsapp || undefined);
            }
        } catch { /* ignore */ }

        // Save email/phone for Pixel advanced matching when user returns
        try {
            localStorage.setItem('lumiphoto_recent_purchase', JSON.stringify({
                email,
                phone: whatsapp ? whatsapp.replace(/\D/g, '') : null,
                timestamp: Date.now(),
            }));
        } catch { /* ignore */ }

        // Fire enriched InitiateCheckout with user data
        if (typeof (window as any).trackPro === 'function') {
            (window as any).trackPro('InitiateCheckout', {
                email,
                phone: whatsapp ? whatsapp.replace(/\D/g, '') : undefined,
                custom_data: {
                    value: PLANS[selectedPlan].price,
                    currency: 'BRL',
                    content_name: PLANS[selectedPlan].name,
                    content_ids: [PLANS[selectedPlan].id],
                    num_items: PLANS[selectedPlan].credits,
                },
            });
        }

        try {
            // Chamar Edge Function para criar preferência
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-preference`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        plan: selectedPlan,
                        payer_email: email,
                        referral_code: localStorage.getItem('referral_code') || undefined,
                        affiliate_code: localStorage.getItem('affiliate_code') || undefined,
                        whatsapp: whatsapp || undefined,
                        source_page: localStorage.getItem('source_page') || undefined,
                        utm_source: localStorage.getItem('utm_source') || undefined,
                        utm_medium: localStorage.getItem('utm_medium') || undefined,
                        utm_campaign: localStorage.getItem('utm_campaign') || undefined,
                        fbp: document.cookie.match(/(?:^| )_fbp=([^;]+)/)?.[1] || undefined,
                        fbc: document.cookie.match(/(?:^| )_fbc=([^;]+)/)?.[1] || undefined,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Erro ao processar pagamento');
            }

            const data = await response.json();


            // Redirecionar para o Mercado Pago
            window.location.href = data.init_point;
        } catch (err: any) {
            console.error('Checkout error:', err);
            setError(err.message || 'Erro ao processar. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const plan = PLANS[selectedPlan];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-start md:justify-center p-4 pt-8 md:p-6 md:pt-6 overflow-y-auto bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-amber-900/20 pointer-events-none" />

            <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start pb-20 md:pb-6">
                {/* Left Side: Plans */}
                <div className="space-y-6">
                    <div className="mb-8">
                        <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                            <ArrowRight className="rotate-180" size={16} /> Voltar
                        </button>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                            Escolha seu <span className="text-amber-500">Pacote</span>
                        </h1>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/15 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold">
                                <Check size={12} strokeWidth={3} /> Pagamento único
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/15 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold">
                                <Shield size={12} /> Sem mensalidade
                            </span>
                        </div>
                        <p className="text-white/50 mt-3 text-sm">
                            Compre créditos e use quando quiser. Sem assinatura, sem renovação automática.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {Object.values(PLANS).map((p) => (
                            <button
                                key={p.id}
                                onClick={() => {
                                    setSelectedPlan(p.id as any);
                                    // Track AddToCart when user selects a different plan
                                    if (typeof (window as any).trackPro === 'function' && p.id !== selectedPlan) {
                                        (window as any).trackPro('AddToCart', {
                                            custom_data: {
                                                value: p.price,
                                                currency: 'BRL',
                                                content_name: p.name,
                                                content_ids: [p.id],
                                                num_items: p.credits,
                                            },
                                        });
                                    }
                                }}
                                className={`w-full relative p-4 rounded-xl border-2 transition-all duration-300 text-left group ${selectedPlan === p.id
                                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                {p.popular && (
                                    <div className="absolute -top-3 left-4 px-3 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] font-black uppercase text-black tracking-wider">
                                        ⭐ Melhor custo-benefício
                                    </div>
                                )}

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedPlan === p.id ? 'border-amber-500 bg-amber-500' : 'border-white/30'}`}>
                                            {selectedPlan === p.id && <Check size={12} className="text-black" strokeWidth={4} />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base">{p.emoji}</span>
                                                <h3 className={`font-bold text-base ${selectedPlan === p.id ? 'text-white' : 'text-white/70'}`}>{p.name}</h3>
                                                {p.badge && (
                                                    <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-[10px] font-black text-emerald-400">
                                                        {p.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-white/40 mt-0.5">{p.credits} fotos profissionais com IA</p>
                                        </div>
                                    </div>

                                    <div className="text-right shrink-0 ml-3">
                                        <p className="text-xl font-black text-white">R$ {p.price}<span className="text-xs font-medium text-white/30">,00</span></p>
                                        <div className="flex items-center gap-1 justify-end">
                                            {p.savingsPercent && (
                                                <span className="text-[10px] text-white/20 line-through">R$ {STARTER_PRICE_PER_PHOTO.toFixed(2)}</span>
                                            )}
                                            <span className={`text-xs font-bold ${p.savingsPercent ? 'text-emerald-400' : 'text-white/40'}`}>
                                                R$ {p.pricePerPhoto.toFixed(2)}/foto
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>

                    {/* Price comparison bar */}
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        <p className="text-[11px] text-white/40 text-center">
                            💡 No plano <strong className="text-amber-400">{plan.name}</strong>, cada foto sai por <strong className="text-emerald-400">R$ {plan.pricePerPhoto.toFixed(2)}</strong>
                            {plan.savingsPercent ? (
                                <> — você <strong className="text-emerald-400">economiza {plan.savingsPercent}%</strong> comparado ao Starter</>
                            ) : null}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                        {BENEFITS.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <benefit.icon size={16} className="text-amber-500 shrink-0" />
                                <span className="text-xs text-white/60 font-medium leading-tight">{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Checkout Form */}
                <div className="md:sticky md:top-6">
                    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                            <CreditCard size={24} className="text-amber-500" />
                            Finalizar Compra
                        </h2>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm text-white/60 mb-2">
                                    Seu melhor email (você receberá o acesso por aqui)
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="seu@email.com"
                                    className="w-full px-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none text-white placeholder:text-white/30 text-base"
                                />
                            </div>

                            <div>
                                <label className="block text-sm text-white/60 mb-2 flex items-center gap-1.5">
                                    <Phone size={14} className="text-green-400" />
                                    WhatsApp <span className="text-white/30">(opcional)</span>
                                </label>
                                <input
                                    type="tel"
                                    value={whatsapp}
                                    onChange={(e) => {
                                        const v = e.target.value.replace(/\D/g, '');
                                        if (v.length <= 11) {
                                            const formatted = v.length > 6
                                                ? `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7)}`
                                                : v.length > 2
                                                    ? `(${v.slice(0, 2)}) ${v.slice(2)}`
                                                    : v;
                                            setWhatsapp(formatted);
                                        }
                                    }}
                                    placeholder="(11) 99999-9999"
                                    className="w-full px-4 py-4 bg-white/5 rounded-xl border border-white/10 focus:border-green-500/50 focus:outline-none text-white placeholder:text-white/30 text-base"
                                />
                                <p className="text-[10px] text-white/25 mt-1.5">Receba promoções e bônus exclusivos</p>
                            </div>

                            <div className="p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-white">{plan.emoji} Pacote {plan.name}</p>
                                        <p className="text-amber-200/60 text-sm font-medium">{plan.credits} Fotos Profissionais</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-black text-amber-500">
                                            R$ {plan.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-2 pt-2 border-t border-amber-500/10 flex items-center justify-between">
                                    <span className="text-[11px] text-white/40">Valor por foto</span>
                                    <span className="text-sm font-bold text-emerald-400">R$ {plan.pricePerPhoto.toFixed(2)}/foto</span>
                                </div>
                                <p className="text-[10px] text-white/30 mt-2 text-center">✅ Pagamento único • Sem assinatura • Sem renovação</p>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all disabled:opacity-50 text-white"
                            >
                                {loading ? (
                                    <Loader2 size={24} className="animate-spin" />
                                ) : (
                                    <>
                                        <span>Pagar com Mercado Pago</span>
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="text-center space-y-2 pt-2">
                                <p className="text-white/40 text-xs flex items-center justify-center gap-1">
                                    <Shield size={10} /> Pagamento 100% seguro
                                </p>
                                <p className="text-white/30 text-[10px]">
                                    Após o pagamento, seus créditos são liberados na hora. Use quando quiser.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <img src="/logo-gold.png" className="h-6 w-auto mx-auto opacity-30 invert brightness-0 grayscale mb-2" />
                        <p className="text-white/20 text-[10px] uppercase tracking-widest">
                            © 2026 LumiphotoIA. Todos os direitos reservados.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
