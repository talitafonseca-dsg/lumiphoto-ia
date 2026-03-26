import React, { useEffect, useState } from 'react';
import { CheckCircle, Mail, ArrowRight, Sparkles, Copy, Check, Clock, XCircle, Download } from 'lucide-react';

interface CheckoutSuccessProps {
    onGoToLogin: (sourcePage?: string) => void;
}

const DEFAULT_PASSWORD = 'lumi123456';

export const CheckoutSuccess: React.FC<CheckoutSuccessProps> = ({ onGoToLogin }) => {
    const [buyerEmail, setBuyerEmail] = useState('');
    const [planName, setPlanName] = useState('');
    const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
    const [status, setStatus] = useState<'success' | 'failure' | 'pending'>('success');
    const [isTrialPurchase, setIsTrialPurchase] = useState(false);
    const [trialProductType, setTrialProductType] = useState<'single' | 'pack'>('single');
    const [sourcePage, setSourcePage] = useState<string>('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname;

        let currentStatus: 'success' | 'failure' | 'pending' = 'success';
        if (path.includes('/checkout/failure') || params.get('collection_status') === 'rejected') {
            currentStatus = 'failure';
        } else if (path.includes('/checkout/pending') || params.get('collection_status') === 'pending') {
            currentStatus = 'pending';
        }
        setStatus(currentStatus);

        const externalRef = params.get('external_reference');
        let extractedEmail = '';
        let extractedPlan = '';
        if (externalRef) {
            try {
                const ref = JSON.parse(externalRef);
                // Support both 'email' (regular plans) and 'payer_email' (trial)
                if (ref.payer_email) { extractedEmail = ref.payer_email; setBuyerEmail(ref.payer_email); }
                if (ref.email) { extractedEmail = ref.email; setBuyerEmail(ref.email); }
                if (ref.plan) { extractedPlan = ref.plan; setPlanName(ref.plan); }
                if (ref.source_page) { setSourcePage(ref.source_page); }
                if (ref.type === 'trial') {
                    setIsTrialPurchase(true);
                    setTrialProductType(ref.product_type || 'single');
                }
            } catch { /* ignore */ }
        }

        if (currentStatus === 'success') {
            const planPrices: Record<string, number> = {
                'starter': 37, 'essencial': 57, 'pro': 97, 'premium': 117,
            };
            const purchaseValue = planPrices[extractedPlan.toLowerCase()] || 37;

            const innerParams = new URLSearchParams(window.location.search);
            const paymentId = innerParams.get('payment_id') || innerParams.get('collection_id') || '';
            const dedupKey = paymentId ? `lumiphoto_purchase_tracked_${paymentId}` : '';

            // Client-side Purchase tracking (+ server-side CAPI via webhook).
            // Meta deduplicates via eventID, so both can fire safely.
            if (paymentId && dedupKey && !localStorage.getItem(dedupKey)) {
                localStorage.setItem(dedupKey, '1');
                const eventId = `purchase_${paymentId}`;
                try {
                    // Use trackPro for full CAPI + browser pixel dedup
                    if (typeof (window as any).trackPro === 'function') {
                        (window as any).trackPro('Purchase', {
                            event_id: eventId,
                            email: extractedEmail || undefined,
                            custom_data: {
                                value: purchaseValue,
                                currency: 'BRL',
                                content_name: extractedPlan || 'LumiPhoto Credits',
                                content_category: 'credits',
                                content_type: 'product',
                                content_ids: [extractedPlan || 'starter'],
                                num_items: 1,
                                order_id: paymentId,
                            },
                        });
                        console.log('✅ Purchase tracked via trackPro (browser + CAPI)', { paymentId, plan: extractedPlan, value: purchaseValue });
                    } else if (typeof (window as any).fbq === 'function') {
                        // Fallback: direct fbq if trackPro not loaded
                        (window as any).fbq('track', 'Purchase', {
                            value: purchaseValue,
                            currency: 'BRL',
                            content_name: extractedPlan || 'LumiPhoto Credits',
                            content_type: 'product',
                        }, { eventID: eventId });
                        console.log('✅ Purchase tracked via fbq (browser only)', { paymentId, plan: extractedPlan, value: purchaseValue });
                    }
                } catch (e) {
                    console.error('Failed to track Purchase:', e);
                }
            }
        }

        if (currentStatus === 'success') {
            localStorage.setItem('lumiphoto_recent_purchase', JSON.stringify({
                email: extractedEmail, password: DEFAULT_PASSWORD, timestamp: Date.now(),
                source_page: sourcePage || localStorage.getItem('source_page') || '',
            }));
        }

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
                    <button onClick={() => onGoToLogin(sourcePage || localStorage.getItem('source_page') || '')}
                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white">
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
                        {isTrialPurchase
                            ? 'Seu pagamento está sendo processado. Assim que confirmado, sua foto HD será enviada por email.'
                            : 'Seu pagamento está sendo processado. Assim que confirmado, seus créditos serão liberados.'
                        }
                    </p>
                    <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-5 border border-white/10 mb-8 text-left">
                        <p className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2">Após a aprovação:</p>
                        <p className="text-white/50 text-sm">
                            {isTrialPurchase
                                ? 'Você receberá um email com o link de download e seus dados de acesso.'
                                : 'Você receberá um email com seus dados de acesso.'
                            }
                            {' '}A senha padrão é: <span className="text-amber-400 font-mono font-bold">lumi123456</span>
                        </p>
                    </div>
                    <button onClick={() => onGoToLogin(sourcePage || localStorage.getItem('source_page') || '')}
                        className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white">
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

                <h1 className="text-3xl font-black mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                    {isTrialPurchase ? 'Foto Liberada em HD!' : 'Pagamento Confirmado!'}
                </h1>

                {planName && !isTrialPurchase && (
                    <p className="text-amber-500 font-bold text-sm uppercase tracking-wider mb-2">
                        Pacote {planName}
                    </p>
                )}

                <p className="text-white/60 text-base mb-6">
                    {isTrialPurchase
                        ? 'Sua foto HD sem marca d\'água foi enviada por email. Sua conta também já está pronta!'
                        : 'Sua conta foi criada com sucesso! Anote seus dados de acesso abaixo.'
                    }
                </p>

                {/* Trial: Email download notice */}
                {isTrialPurchase && (
                    <div className="bg-emerald-500/10 border border-emerald-500/25 rounded-2xl p-4 mb-5 text-left space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                <Download size={16} className="text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-white font-bold text-sm">
                                    {trialProductType === 'single' ? '📥 Foto HD enviada por email!' : '📥 3 Fotos HD enviadas por email!'}
                                </p>
                                {buyerEmail && (
                                    <p className="text-emerald-300 text-xs font-mono break-all">{buyerEmail}</p>
                                )}
                            </div>
                        </div>
                        <p className="text-white/40 text-xs ml-10">Abra seu email para baixar. Verifique também a caixa de spam.</p>
                    </div>
                )}

                {/* Credentials Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 backdrop-blur-xl rounded-2xl p-5 border border-amber-500/30 mb-6 text-left space-y-4">
                    <p className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] text-center">
                        🔐 {isTrialPurchase ? 'Sua Conta LumiPhotoIA' : 'Seus Dados de Acesso'}
                    </p>

                    <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Email</p>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-white font-bold text-sm break-all">{buyerEmail || 'O email usado na compra'}</p>
                            {buyerEmail && (
                                <button onClick={() => copyToClipboard(buyerEmail, 'email')}
                                    className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Copiar email">
                                    {copiedField === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                        <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Senha</p>
                        <div className="flex items-center justify-between gap-2">
                            <p className="text-amber-400 font-mono font-bold text-lg tracking-wider">{DEFAULT_PASSWORD}</p>
                            <button onClick={() => copyToClipboard(DEFAULT_PASSWORD, 'password')}
                                className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors" title="Copiar senha">
                                {copiedField === 'password' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                            </button>
                        </div>
                    </div>

                    <p className="text-white/30 text-[10px] text-center">
                        {isTrialPurchase && trialProductType === 'pack'
                            ? '✨ Conta criada com 7 créditos para gerar mais fotos!'
                            : '⚠️ Recomendamos alterar sua senha após o primeiro acesso'
                        }
                    </p>
                </div>

                {/* Email reminder */}
                <div className="bg-white/5 rounded-xl p-3 border border-white/10 mb-6 flex items-center gap-3 text-left">
                    <div className="w-8 h-8 bg-indigo-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Mail size={16} className="text-indigo-400" />
                    </div>
                    <p className="text-white/40 text-xs">
                        {isTrialPurchase
                            ? 'O link de download HD + dados de acesso foram enviados para seu email'
                            : 'Também enviamos esses dados para o seu email'
                        }
                    </p>
                </div>

                <button onClick={() => onGoToLogin(sourcePage || localStorage.getItem('source_page') || '')}
                    className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:from-amber-500 hover:to-yellow-500 transition-all text-white">
                    <span>Fazer Login Agora</span>
                    <ArrowRight size={20} />
                </button>

                <p className="text-white/20 text-xs mt-8">
                    © {new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
};

export default CheckoutSuccess;
