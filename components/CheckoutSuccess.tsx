import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, ArrowRight, Sparkles, Copy, Check, Clock, XCircle } from 'lucide-react';

interface CheckoutSuccessProps {
    onGoToLogin: () => void;
}

const DEFAULT_PASSWORD = 'lumi123456';

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ onGoToLogin }) => {
    const [buyerEmail, setBuyerEmail] = useState('');
    const [planName, setPlanName] = useState('');
    const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
    const [status, setStatus] = useState<'success' | 'failure' | 'pending'>('success');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname;

        // Determine status from URL (use local variable, not state, since state hasn't updated yet)
        let currentStatus: 'success' | 'failure' | 'pending' = 'success';
        if (path.includes('/checkout/failure') || params.get('collection_status') === 'rejected') {
            currentStatus = 'failure';
        } else if (path.includes('/checkout/pending') || params.get('collection_status') === 'pending') {
            currentStatus = 'pending';
        }
        setStatus(currentStatus);

        // Extract email and plan from external_reference
        const externalRef = params.get('external_reference');
        let extractedEmail = '';
        let extractedPlan = '';
        if (externalRef) {
            try {
                const ref = JSON.parse(externalRef);
                if (ref.email) { extractedEmail = ref.email; setBuyerEmail(ref.email); }
                if (ref.plan) { extractedPlan = ref.plan; setPlanName(ref.plan); }
            } catch { /* ignore */ }
        }

        // Fire Purchase event via TrackPro (sends both client Pixel AND server CAPI)
        // NOTE: Mercado Pago does NOT return payment_amount in the redirect URL.
        // We determine value from the plan name in external_reference.
        if (currentStatus === 'success') {
            const planPrices: Record<string, number> = {
                'starter': 37,
                'essencial': 57,
                'pro': 97,
                'premium': 117,
            };
            const purchaseValue = planPrices[extractedPlan.toLowerCase()] || 37;

            // DEDUP: Build a unique key from the payment params to prevent duplicate tracking
            const params = new URLSearchParams(window.location.search);
            const paymentId = params.get('payment_id')
                || params.get('collection_id')
                || '';
            const dedupKey = paymentId ? `lumiphoto_purchase_tracked_${paymentId}` : '';

            // Only fire if we have a payment ID and haven't tracked this specific payment yet
            if (paymentId && dedupKey && !sessionStorage.getItem(dedupKey)) {
                sessionStorage.setItem(dedupKey, '1');

                // IMPORTANT: Only fire client-side Pixel (fbq), NOT trackPro.
                // The mercadopago-webhook already sends server-side CAPI via trackPro.
                // Using both would cause DUPLICATE Purchase events in Meta.
                // Use deterministic event_id matching the webhook for Meta's built-in dedup.
                if (typeof (window as any).fbq === 'function') {
                    const eventId = `purchase_${paymentId}`;
                    (window as any).fbq('track', 'Purchase', {
                        value: purchaseValue,
                        currency: 'BRL',
                        content_name: extractedPlan || 'LumiPhoto Credits',
                        content_type: 'product',
                    }, { eventID: eventId });
                    console.log('✅ Client Pixel: Purchase event fired (fbq only, no CAPI — webhook handles CAPI)', { value: purchaseValue, plan: extractedPlan, paymentId, eventId });
                }
            } else if (!paymentId) {
                console.log('⏭️ Purchase tracking SKIPPED — no payment_id in URL');
            } else {
                console.log('⏭️ Purchase tracking SKIPPED — already tracked for:', paymentId);
            }
        }

        // Save purchase info to localStorage so AuthScreen can use it
        if (currentStatus === 'success') {
            localStorage.setItem('lumiphoto_recent_purchase', JSON.stringify({
                email: extractedEmail,
                password: DEFAULT_PASSWORD,
                timestamp: Date.now(),
            }));
        }

        // Clean up URL — delay to let tracking complete
        setTimeout(() => {
            window.history.replaceState({}, '', window.location.pathname);
        }, 3000);
    }, []);

    const copyToClipboard = async (text: string, field: 'email' | 'password') => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = text;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
        }
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    // Failure screen
    if (status === 'failure') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[150px]" />
                </div>
                <div className="w-full max-w-md relative z-10 text-center">
                    <div className="relative inline-flex mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(239,68,68,0.4)]">
                            <XCircle size={48} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-red-400">Pagamento não aprovado</h1>
                    <p className="text-white/60 text-lg mb-8">
                        Houve um problema com o pagamento. Tente novamente ou use outro método.
                    </p>
                    <button
                        onClick={onGoToLogin}
                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white"
                    >
                        <span>Voltar ao Início</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    // Pending screen
    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-amber-600/15 rounded-full blur-[150px]" />
                </div>
                <div className="w-full max-w-md relative z-10 text-center">
                    <div className="relative inline-flex mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(245,158,11,0.4)]">
                            <Clock size={48} className="text-white" />
                        </div>
                    </div>
                    <h1 className="text-3xl font-black mb-4 text-amber-400">Pagamento Pendente</h1>
                    <p className="text-white/60 text-lg mb-6">
                        Seu pagamento está sendo processado. Assim que confirmado, seus créditos serão liberados.
                    </p>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 mb-8 text-left">
                        <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Após a aprovação:</p>
                        <p className="text-white/50 text-sm">
                            Você receberá um email com seus dados de acesso.
                            A senha padrão é: <span className="text-amber-400 font-mono font-bold">lumi123456</span>
                        </p>
                    </div>
                    <button
                        onClick={onGoToLogin}
                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white"
                    >
                        <span>Voltar ao Início</span>
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        );
    }

    // Success screen
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            {/* Background Effects */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-600/20 rounded-full blur-[150px]" />
            </div>

            <div className="w-full max-w-md relative z-10 text-center">
                {/* Success Icon */}
                <div className="relative inline-flex mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(34,197,94,0.5)]">
                        <CheckCircle size={48} className="text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2">
                        <Sparkles size={28} className="text-yellow-400 animate-pulse" />
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    Pagamento Confirmado!
                </h1>

                {planName && (
                    <p className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-2">
                        Pacote {planName}
                    </p>
                )}

                <p className="text-white/60 text-base mb-6">
                    Sua conta foi criada com sucesso! Anote seus dados de acesso abaixo.
                </p>

                {/* Credentials Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 mb-6 text-left space-y-4">
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

                {/* Email reminder */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-6 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail size={16} className="text-indigo-400" />
                    </div>
                    <p className="text-white/40 text-xs">
                        Também enviamos esses dados para o seu email
                    </p>
                </div>

                {/* CTA Button */}
                <button
                    onClick={onGoToLogin}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:from-amber-500 hover:to-yellow-500 transition-all text-white"
                >
                    <span>Fazer Login Agora</span>
                    <ArrowRight size={20} />
                </button>

                {/* Footer */}
                <p className="text-white/20 text-xs mt-8">
                    © {new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
