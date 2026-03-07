import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, ArrowRight, Sparkles, Copy, Check } from 'lucide-react';

interface CheckoutResultProps {
    onBack: () => void;
}

type ResultStatus = 'approved' | 'failure' | 'pending' | 'unknown';

const DEFAULT_PASSWORD = 'lumi123456';

const CheckoutResult: React.FC<CheckoutResultProps> = ({ onBack }) => {
    const [status, setStatus] = useState<ResultStatus>('unknown');
    const [planName, setPlanName] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname;

        // Mercado Pago returns via query params or path
        const collectionStatus = params.get('collection_status') || params.get('status');

        let detectedStatus: ResultStatus = 'unknown';
        if (path.includes('/checkout/success') || collectionStatus === 'approved') {
            detectedStatus = 'approved';
        } else if (path.includes('/checkout/failure') || collectionStatus === 'rejected') {
            detectedStatus = 'failure';
        } else if (path.includes('/checkout/pending') || collectionStatus === 'pending') {
            detectedStatus = 'pending';
        }
        setStatus(detectedStatus);

        // Extract email and plan from external_reference
        const externalRef = params.get('external_reference');
        if (externalRef) {
            try {
                const ref = JSON.parse(externalRef);
                setPlanName(ref.plan || '');
                if (ref.email) {
                    setBuyerEmail(ref.email);
                }
            } catch { /* ignore */ }
        }

        // Save purchase info in localStorage so AuthScreen can use it
        if (detectedStatus === 'approved') {
            const email = (() => {
                try {
                    if (externalRef) {
                        const ref = JSON.parse(externalRef);
                        return ref.email || '';
                    }
                } catch { /* ignore */ }
                return '';
            })();

            localStorage.setItem('lumiphoto_recent_purchase', JSON.stringify({
                email,
                password: DEFAULT_PASSWORD,
                timestamp: Date.now(),
            }));
        }

        // Clean up URL after extracting data
        window.history.replaceState({}, '', '/');
    }, []);

    const copyToClipboard = async (text: string, field: 'email' | 'password') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
            // Fallback
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        }
    };

    const handleContinue = () => {
        onBack();
    };

    const config: Record<ResultStatus, { icon: React.ReactNode; title: string; message: string; color: string }> = {
        approved: {
            icon: <CheckCircle size={64} className="text-emerald-400" />,
            title: 'Pagamento Aprovado! 🎉',
            message: 'Sua conta foi criada com sucesso! Use as credenciais abaixo para acessar o estúdio.',
            color: 'emerald',
        },
        failure: {
            icon: <XCircle size={64} className="text-red-400" />,
            title: 'Pagamento não aprovado',
            message: 'Houve um problema com o pagamento. Por favor, tente novamente ou use outro método de pagamento.',
            color: 'red',
        },
        pending: {
            icon: <Clock size={64} className="text-amber-400" />,
            title: 'Pagamento Pendente',
            message: 'Seu pagamento está sendo processado. Assim que confirmado, seus créditos serão liberados automaticamente.',
            color: 'amber',
        },
        unknown: {
            icon: <Sparkles size={64} className="text-indigo-400" />,
            title: 'Checkout',
            message: 'Verificando status do pagamento...',
            color: 'indigo',
        },
    };

    const current = config[status];

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-black to-amber-900/20 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg">
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-white/10 shadow-2xl text-center space-y-6">
                    <div className="flex justify-center">
                        <div className={`w-24 h-24 md:w-28 md:h-28 rounded-full bg-${current.color}-500/10 border border-${current.color}-500/20 flex items-center justify-center`}>
                            {current.icon}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h1 className="text-2xl font-black text-white uppercase tracking-tight">
                            {current.title}
                        </h1>
                        {planName && (
                            <p className="text-amber-500 font-bold text-sm uppercase tracking-wider">
                                Pacote {planName}
                            </p>
                        )}
                        <p className="text-white/50 text-sm leading-relaxed">
                            {current.message}
                        </p>
                    </div>

                    {status === 'approved' && (
                        <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-5 text-left space-y-4">
                            <p className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] text-center">
                                🔐 Seus Dados de Acesso
                            </p>

                            {/* Email Field */}
                            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Email</p>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-white font-bold text-sm break-all">
                                        {buyerEmail || 'O email usado na compra'}
                                    </p>
                                    {buyerEmail && (
                                        <button
                                            onClick={() => copyToClipboard(buyerEmail, 'email')}
                                            className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                            title="Copiar email"
                                        >
                                            {copiedField === 'email' ? (
                                                <Check size={14} className="text-emerald-400" />
                                            ) : (
                                                <Copy size={14} className="text-white/40" />
                                            )}
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                                <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Senha</p>
                                <div className="flex items-center justify-between gap-2">
                                    <p className="text-amber-400 font-mono font-bold text-lg tracking-wider">
                                        {DEFAULT_PASSWORD}
                                    </p>
                                    <button
                                        onClick={() => copyToClipboard(DEFAULT_PASSWORD, 'password')}
                                        className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                                        title="Copiar senha"
                                    >
                                        {copiedField === 'password' ? (
                                            <Check size={14} className="text-emerald-400" />
                                        ) : (
                                            <Copy size={14} className="text-white/40" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <p className="text-white/30 text-[10px] text-center">
                                ⚠️ Recomendamos alterar sua senha após o primeiro acesso
                            </p>
                        </div>
                    )}

                    {status === 'pending' && (
                        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-left space-y-2">
                            <p className="text-amber-400 font-bold text-xs uppercase tracking-wider">Após a aprovação:</p>
                            <p className="text-white/50 text-sm">
                                Você receberá um email com seus dados de acesso.
                                A senha padrão é: <span className="text-amber-400 font-mono font-bold">lumi123456</span>
                            </p>
                        </div>
                    )}

                    <button
                        onClick={handleContinue}
                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white"
                    >
                        <span>{status === 'approved' ? 'Fazer Login Agora' : 'Voltar ao Início'}</span>
                        <ArrowRight size={20} />
                    </button>
                </div>

                <div className="mt-8 text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-widest">
                        © 2026 LumiphotoIA. Todos os direitos reservados.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutResult;
