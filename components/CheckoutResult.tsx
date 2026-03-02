import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface CheckoutResultProps {
    onBack: () => void;
}

type ResultStatus = 'approved' | 'failure' | 'pending' | 'unknown';

const CheckoutResult: React.FC<CheckoutResultProps> = ({ onBack }) => {
    const [status, setStatus] = useState<ResultStatus>('unknown');
    const [planName, setPlanName] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname;

        // Mercado Pago returns via query params or path
        const collectionStatus = params.get('collection_status') || params.get('status');

        if (path.includes('/checkout/success') || collectionStatus === 'approved') {
            setStatus('approved');
        } else if (path.includes('/checkout/failure') || collectionStatus === 'rejected') {
            setStatus('failure');
        } else if (path.includes('/checkout/pending') || collectionStatus === 'pending') {
            setStatus('pending');
        }

        // Try to get plan info 
        const externalRef = params.get('external_reference');
        if (externalRef) {
            try {
                const ref = JSON.parse(externalRef);
                setPlanName(ref.plan || '');
            } catch { /* ignore */ }
        }

        // Clean up URL
        window.history.replaceState({}, '', '/');
    }, []);

    const config: Record<ResultStatus, { icon: React.ReactNode; title: string; message: string; color: string }> = {
        approved: {
            icon: <CheckCircle size={64} className="text-emerald-400" />,
            title: 'Pagamento Aprovado! 🎉',
            message: 'Seus créditos já foram adicionados à sua conta. Faça login com o email usado na compra para começar a criar.',
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
                <div className="bg-zinc-900/80 backdrop-blur-xl rounded-3xl p-12 border border-white/10 shadow-2xl text-center space-y-8">
                    <div className="flex justify-center">
                        <div className={`w-28 h-28 rounded-full bg-${current.color}-500/10 border border-${current.color}-500/20 flex items-center justify-center`}>
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
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-left space-y-2">
                            <p className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Como acessar:</p>
                            <ol className="text-white/60 text-sm space-y-1 list-decimal list-inside">
                                <li>Use o email da compra para fazer login</li>
                                <li>Senha padrão: <span className="text-amber-400 font-mono font-bold">lumi123456</span></li>
                                <li>Troque sua senha após o primeiro acesso</li>
                            </ol>
                        </div>
                    )}

                    <button
                        onClick={onBack}
                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white"
                    >
                        <span>{status === 'approved' ? 'Começar a Criar' : 'Voltar ao Início'}</span>
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
