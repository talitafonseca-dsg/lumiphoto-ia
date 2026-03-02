import React, { useState } from 'react';
import { Loader2, Check, Sparkles, Shield, Clock, Zap, ArrowRight, CreditCard } from 'lucide-react';

interface CheckoutPageProps {
    onBack?: () => void;
}

interface PlanType {
    id: string;
    name: string;
    price: number;
    credits: number;
    pricePerPhoto: number;
    popular: boolean;
    savings?: string;
}

const PLANS: Record<string, PlanType> = {
    starter: {
        id: 'starter',
        name: 'Starter',
        price: 27,
        credits: 10,
        pricePerPhoto: 2.70,
        popular: false,
    },
    essencial: {
        id: 'essencial',
        name: 'Essencial',
        price: 47,
        credits: 30,
        pricePerPhoto: 1.56,
        popular: false,
    },
    pro: {
        id: 'pro',
        name: 'Pro',
        price: 97,
        credits: 80,
        pricePerPhoto: 1.21,
        popular: true,
        savings: 'Melhor Custo',
    },
    premium: {
        id: 'premium',
        name: 'Premium',
        price: 117,
        credits: 100,
        pricePerPhoto: 1.17,
        popular: false,
    },
};

const BENEFITS = [
    { icon: Sparkles, text: 'Geração ilimitada de artes com IA' },
    { icon: Zap, text: 'Editor profissional com camadas' },
    { icon: Shield, text: 'Uso comercial liberado' },
    { icon: Clock, text: 'Atualizações incluídas' },
];

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onBack }) => {
    const [selectedPlan, setSelectedPlan] = useState<'starter' | 'essencial' | 'pro' | 'premium'>('pro');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-amber-900/20 pointer-events-none" />

            <div className="w-full max-w-5xl relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                {/* Left Side: Plans */}
                <div className="space-y-6">
                    <div className="mb-8">
                        <button onClick={onBack} className="text-white/40 hover:text-white flex items-center gap-2 mb-4 transition-colors">
                            <ArrowRight className="rotate-180" size={16} /> Voltar
                        </button>
                        <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                            Escolha seu <span className="text-amber-500">Pacote</span>
                        </h1>
                        <p className="text-white/60 mt-2">
                            Acesso imediato ao estúdio. Sem mensalidade.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {Object.values(PLANS).map((plan) => (
                            <button
                                key={plan.id}
                                onClick={() => setSelectedPlan(plan.id as any)}
                                className={`w-full relative p-4 rounded-xl border-2 transition-all duration-300 text-left flex items-center justify-between group ${selectedPlan === plan.id
                                    ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                                    : 'border-white/10 bg-white/5 hover:border-white/20'
                                    }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-3 right-4 px-3 py-0.5 bg-amber-500 rounded-full text-[10px] font-black uppercase text-black">
                                        Popular
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPlan === plan.id ? 'border-amber-500 bg-amber-500' : 'border-white/30'}`}>
                                        {selectedPlan === plan.id && <Check size={12} className="text-black" strokeWidth={4} />}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold ${selectedPlan === plan.id ? 'text-white' : 'text-white/70'}`}>{plan.name}</h3>
                                        <p className="text-xs text-white/40">{plan.credits} Fotos Profissionais</p>
                                    </div>
                                </div>

                                <div className="text-right">
                                    <p className="text-xl font-black text-white">R$ {plan.price}</p>
                                    <p className="text-[10px] text-white/40">R$ {plan.pricePerPhoto.toFixed(2)} / foto</p>
                                </div>
                            </button>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                        {BENEFITS.map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/5">
                                <benefit.icon size={16} className="text-amber-500 shrink-0" />
                                <span className="text-xs text-white/60 font-medium leading-tight">{benefit.text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Side: Checkout Form */}
                <div className="sticky top-6">
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

                            <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                <div>
                                    <p className="font-bold text-white">Pacote {PLANS[selectedPlan].name}</p>
                                    <p className="text-amber-200/60 text-sm font-medium">{PLANS[selectedPlan].credits} Fotos Profissionais</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-2xl font-black text-amber-500">
                                        R$ {PLANS[selectedPlan].price}
                                    </p>
                                </div>
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
                                    Após o pagamento, seus créditos serão liberados automaticamente.
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
