import React, { useEffect, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Clock, ArrowRight, Sparkles, Copy, Check, Mail, RefreshCw } from 'lucide-react';

interface CheckoutResultProps {
    onBack: () => void;
}

type ResultStatus = 'approved' | 'failure' | 'pending' | 'unknown';

const DEFAULT_PASSWORD = 'lumi123456';
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

const CheckoutResult: React.FC<CheckoutResultProps> = ({ onBack }) => {
    const [status, setStatus] = useState<ResultStatus>('unknown');
    const [planName, setPlanName] = useState('');
    const [buyerEmail, setBuyerEmail] = useState('');
    const [isTrialPurchase, setIsTrialPurchase] = useState(false);
    const [productType, setProductType] = useState<'single' | 'pack' | ''>('');
    const [copiedField, setCopiedField] = useState<'email' | 'password' | null>(null);
    const [pollCount, setPollCount] = useState(0);
    const [pollingStatus, setPollingStatus] = useState<'idle' | 'polling' | 'confirmed'>('idle');
    const [paymentId, setPaymentId] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const path = window.location.pathname;

        // Mercado Pago returns via query params or path
        const collectionStatus = params.get('collection_status') || params.get('status');
        const mpPaymentId = params.get('payment_id') || params.get('collection_id') || '';
        setPaymentId(mpPaymentId);

        let detectedStatus: ResultStatus = 'unknown';
        if (path.includes('/checkout/success') || collectionStatus === 'approved') {
            detectedStatus = 'approved';
        } else if (path.includes('/checkout/failure') || collectionStatus === 'rejected') {
            // Rejected can also mean PIX was initiated but not yet paid
            // So we treat it as 'pending' if payment_id exists (PIX in progress)
            detectedStatus = mpPaymentId ? 'pending' : 'failure';
        } else if (path.includes('/checkout/pending') || collectionStatus === 'pending' || collectionStatus === 'in_process') {
            detectedStatus = 'pending';
        }
        setStatus(detectedStatus);

        // Extract data from external_reference
        const externalRef = params.get('external_reference');
        if (externalRef) {
            try {
                const ref = JSON.parse(externalRef);
                setPlanName(ref.plan || '');
                if (ref.email) setBuyerEmail(ref.email);
                if (ref.payer_email) setBuyerEmail(ref.payer_email);
                if (ref.type === 'trial') {
                    setIsTrialPurchase(true);
                    setProductType(ref.product_type || '');
                }
            } catch { /* ignore */ }
        }

        // Save purchase info for approved regular purchases
        if (detectedStatus === 'approved') {
            const email = (() => {
                try {
                    if (externalRef) {
                        const ref = JSON.parse(externalRef);
                        return ref.email || ref.payer_email || '';
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

    // Poll for payment confirmation for pending PIX payments
    const pollPaymentStatus = useCallback(async () => {
        if (!paymentId || pollingStatus === 'confirmed') return;

        setPollingStatus('polling');
        try {
            // Check via our edge function if the payment has been confirmed
            const res = await fetch(`${SUPABASE_URL}/functions/v1/check-payment-status`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({ payment_id: paymentId }),
            });
            if (res.ok) {
                const data = await res.json();
                if (data.status === 'approved') {
                    setStatus('approved');
                    setPollingStatus('confirmed');
                }
            }
        } catch { /* ignore — just keep showing pending */ }
        setPollCount(c => c + 1);
        setPollingStatus(prev => prev === 'confirmed' ? 'confirmed' : 'idle');
    }, [paymentId, pollingStatus]);

    const copyToClipboard = async (text: string, field: 'email' | 'password') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedField(field);
            setTimeout(() => setCopiedField(null), 2000);
        } catch {
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

    // ─── Render helpers ───────────────────────────────────────────────────────

    if (status === 'pending') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-gradient-to-br from-amber-900/20 via-black to-yellow-900/10 pointer-events-none" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 border border-amber-500/20 shadow-[0_30px_80px_rgba(0,0,0,0.7)] text-center space-y-5">

                        {/* Animated icon */}
                        <div className="flex justify-center">
                            <div className="relative w-24 h-24 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                                <Clock size={48} className="text-amber-400 animate-pulse" />
                                <div className="absolute inset-0 rounded-full border-2 border-amber-400/30 animate-ping" />
                            </div>
                        </div>

                        <div>
                            <p className="text-amber-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">✅ PIX Enviado</p>
                            <h1 className="text-2xl font-black text-white leading-tight">
                                Aguardando<br />
                                <span className="text-amber-400">Confirmação do PIX</span>
                            </h1>
                        </div>

                        {/* Main info box */}
                        <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-4 text-left space-y-3">
                            <div className="flex items-start gap-3">
                                <Mail size={18} className="text-amber-400 mt-0.5 shrink-0" />
                                <div>
                                    <p className="text-white font-bold text-sm">
                                        {isTrialPurchase
                                            ? productType === 'single'
                                                ? 'Sua foto HD será enviada por email'
                                                : 'Suas fotos HD + acesso ao estúdio serão enviados por email'
                                            : 'Seu acesso será enviado por email'
                                        }
                                    </p>
                                    {buyerEmail && (
                                        <p className="text-amber-300 text-xs mt-0.5 font-mono break-all">{buyerEmail}</p>
                                    )}
                                </div>
                            </div>

                            <div className="h-px bg-white/5" />

                            <div className="space-y-1.5">
                                <p className="text-white/60 text-xs flex items-center gap-2">
                                    <span className="text-amber-400">⏱</span>
                                    O PIX leva normalmente <strong className="text-white">até 5 minutos</strong> para cair
                                </p>
                                <p className="text-white/60 text-xs flex items-center gap-2">
                                    <span className="text-emerald-400">📧</span>
                                    Você receberá um email assim que confirmado
                                </p>
                                <p className="text-white/60 text-xs flex items-center gap-2">
                                    <span className="text-blue-400">🔒</span>
                                    Processamento automático e seguro
                                </p>
                            </div>
                        </div>

                        {/* Trust message */}
                        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-3">
                            <p className="text-emerald-400 text-xs font-bold text-center">
                                ✅ Seu pagamento foi detectado e está sendo confirmado.<br />
                                <span className="text-white/50 font-normal">Não precisa fazer nada — o email chegará automaticamente.</span>
                            </p>
                        </div>

                        {/* Polling button */}
                        {paymentId && (
                            <button
                                onClick={pollPaymentStatus}
                                disabled={pollingStatus === 'polling'}
                                className="w-full py-2.5 border border-white/10 rounded-xl text-white/50 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-colors disabled:opacity-50"
                            >
                                <RefreshCw size={13} className={pollingStatus === 'polling' ? 'animate-spin' : ''} />
                                {pollingStatus === 'polling' ? 'Verificando...' : `Verificar agora ${pollCount > 0 ? `(${pollCount})` : ''}`}
                            </button>
                        )}

                        <button
                            onClick={onBack}
                            className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-black"
                        >
                            Voltar ao Início
                            <ArrowRight size={16} />
                        </button>

                        <p className="text-white/20 text-[10px]">
                            Problema? Responda o email de confirmação ou entre em contato via WhatsApp.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'failure') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-gradient-to-br from-red-900/10 via-black to-black pointer-events-none" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl text-center space-y-5">
                        <div className="flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                                <XCircle size={44} className="text-orange-400" />
                            </div>
                        </div>

                        <div>
                            <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">Pagamento Recusado</p>
                            <h1 className="text-xl font-black text-white">Não conseguimos confirmar o pagamento</h1>
                        </div>

                        {/* Soft explanation */}
                        <div className="bg-orange-500/8 border border-orange-500/15 rounded-xl p-4 text-left space-y-2">
                            <p className="text-white/70 text-sm">Isso pode acontecer por:</p>
                            <ul className="text-white/50 text-xs space-y-1 list-disc list-inside">
                                <li>Saldo insuficiente no banco</li>
                                <li>Sessão expirada antes de confirmar o PIX</li>
                                <li>Pagamento cancelado pelo banco</li>
                            </ul>
                        </div>

                        {/* PIX reassurance */}
                        <div className="bg-blue-500/8 border border-blue-500/15 rounded-xl p-3">
                            <p className="text-blue-300 text-xs">
                                💡 Se você <strong>já fez o PIX</strong>, o sistema processa automaticamente em até 5 minutos. Verifique seu email <strong>{buyerEmail || 'usado na compra'}</strong> antes de tentar novamente.
                            </p>
                        </div>

                        <button
                            onClick={onBack}
                            className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-black"
                        >
                            Tentar Novamente
                            <ArrowRight size={16} />
                        </button>

                        <p className="text-white/20 text-[10px]">
                            Nenhum valor foi cobrado em caso de recusa. Dúvidas? Responda o email de confirmação.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    if (status === 'approved') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
                <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-amber-900/20 pointer-events-none" />

                <div className="relative z-10 w-full max-w-md">
                    <div className="bg-zinc-900/90 backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 shadow-2xl text-center space-y-5">
                        <div className="flex justify-center">
                            <div className="w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
                                <CheckCircle size={52} className="text-emerald-400" />
                            </div>
                        </div>

                        <div>
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">🎉 Pagamento Aprovado!</p>
                            <h1 className="text-2xl font-black text-white">
                                {isTrialPurchase ? 'Foto liberada em HD!' : 'Bem-vindo ao LumiphotoIA!'}
                            </h1>
                            {planName && (
                                <p className="text-amber-400 font-bold text-sm mt-1 uppercase tracking-wider">Pacote {planName}</p>
                            )}
                        </div>

                        {isTrialPurchase ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 text-left space-y-2">
                                <div className="flex items-center gap-2">
                                    <Mail size={16} className="text-emerald-400 shrink-0" />
                                    <p className="text-white text-sm font-bold">Foto enviada para seu email!</p>
                                </div>
                                {buyerEmail && (
                                    <p className="text-emerald-300 text-xs font-mono break-all ml-6">{buyerEmail}</p>
                                )}
                                <p className="text-white/50 text-xs ml-6">Verifique também a caixa de spam caso não apareça.</p>
                            </div>
                        ) : (
                            <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border border-amber-500/30 rounded-2xl p-5 text-left space-y-4">
                                <p className="text-amber-400 font-black text-xs uppercase tracking-[0.2em] text-center">
                                    🔐 Seus Dados de Acesso
                                </p>

                                <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Email</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-white font-bold text-sm break-all">{buyerEmail || 'O email usado na compra'}</p>
                                        {buyerEmail && (
                                            <button onClick={() => copyToClipboard(buyerEmail, 'email')} className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                                {copiedField === 'email' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="bg-black/30 rounded-xl p-3 border border-white/10">
                                    <p className="text-white/40 text-[10px] uppercase tracking-widest mb-1">Senha</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <p className="text-amber-400 font-mono font-bold text-lg tracking-wider">{DEFAULT_PASSWORD}</p>
                                        <button onClick={() => copyToClipboard(DEFAULT_PASSWORD, 'password')} className="flex-shrink-0 p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                                            {copiedField === 'password' ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                                        </button>
                                    </div>
                                </div>

                                <p className="text-white/30 text-[10px] text-center">⚠️ Recomendamos alterar sua senha após o primeiro acesso</p>
                            </div>
                        )}

                        <button
                            onClick={onBack}
                            className="w-full py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all text-white"
                        >
                            {isTrialPurchase ? 'Gerar Mais Fotos' : 'Fazer Login Agora'}
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Unknown/loading state
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="text-center space-y-4">
                <Sparkles size={48} className="text-amber-400 mx-auto animate-pulse" />
                <p className="text-white/50 text-sm">Verificando status do pagamento...</p>
            </div>
        </div>
    );
};

export default CheckoutResult;
