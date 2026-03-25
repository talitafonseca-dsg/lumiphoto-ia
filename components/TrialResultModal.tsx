import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Lock, Zap, Clock, CheckCircle, Loader2, Star, Package, Unlock, ShieldCheck, Mail, Sparkles } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export interface TrialPreviewImage {
    url: string;
    variation: number;
    index: number;
}

interface TrialResultModalProps {
    isOpen: boolean;
    onClose: () => void;
    images: TrialPreviewImage[];
    generationId: string;
    sessionId: string;
    expiresAt: string; // ISO string
}

const TIMER_MINUTES = 15;

export const TrialResultModal: React.FC<TrialResultModalProps> = ({
    isOpen, onClose, images, generationId, sessionId, expiresAt
}) => {
    const [email, setEmail] = useState('');
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
    const [paymentMode, setPaymentMode] = useState<'single' | 'pack' | null>(null);
    const [isCreatingCheckout, setIsCreatingCheckout] = useState(false);
    const [error, setError] = useState('');
    const [secondsLeft, setSecondsLeft] = useState(TIMER_MINUTES * 60);
    const [isExpired, setIsExpired] = useState(false);
    const [showEmailFor, setShowEmailFor] = useState<number | null>(null); // which image index needs email
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // ── Timer ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return;
        const expiryMs = new Date(expiresAt).getTime();
        const uiExpiry = Math.min(expiryMs, Date.now() + TIMER_MINUTES * 60 * 1000);

        const tick = () => {
            const remaining = Math.max(0, Math.floor((uiExpiry - Date.now()) / 1000));
            setSecondsLeft(remaining);
            if (remaining <= 0) {
                setIsExpired(true);
                if (timerRef.current) clearInterval(timerRef.current);
            }
        };
        tick();
        timerRef.current = setInterval(tick, 1000);
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isOpen, expiresAt]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60).toString().padStart(2, '0');
        const s = (secs % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ── Checkout ──────────────────────────────────────────────────────────────
    const handlePay = useCallback(async (mode: 'single' | 'pack', imageIdx?: number) => {
        if (!email || !email.includes('@')) {
            setError('Insira um email válido para receber suas fotos em HD');
            return;
        }
        const idx = imageIdx ?? selectedImageIndex;
        if (mode === 'single' && idx === null) {
            setError('Selecione qual foto deseja liberar em HD');
            return;
        }
        if (isExpired) {
            setError('Preview expirado. Feche e gere novamente!');
            return;
        }

        setIsCreatingCheckout(true);
        setPaymentMode(mode);
        setError('');

        try {
            const res = await fetch(`${SUPABASE_URL}/functions/v1/create-trial-preference`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                },
                body: JSON.stringify({
                    generation_id: generationId,
                    session_id: sessionId,
                    product_type: mode,
                    payer_email: email,
                    selected_image_index: mode === 'single' ? idx : null,
                }),
            });

            const data = await res.json();
            if (!res.ok || data.error) {
                setError(data.error || 'Erro ao iniciar pagamento. Tente novamente.');
                return;
            }

            // Redirect to Mercado Pago checkout
            window.location.href = data.init_point;
        } catch (err) {
            setError('Erro de conexão. Tente novamente.');
        } finally {
            setIsCreatingCheckout(false);
        }
    }, [email, selectedImageIndex, generationId, sessionId, isExpired]);

    const handleUnlockClick = (imageIndex: number) => {
        if (isExpired) return;
        setSelectedImageIndex(imageIndex);
        if (!email || !email.includes('@')) {
            setShowEmailFor(imageIndex);
            // Scroll to email input
            setTimeout(() => {
                document.getElementById('trial-email-input')?.focus();
            }, 100);
        } else {
            handlePay('single', imageIndex);
        }
    };

    if (!isOpen) return null;

    const timerUrgent = secondsLeft < 60;
    const timerWarning = secondsLeft < 5 * 60;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#0a0a0a] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)]" style={{ animation: 'fadeInUp 0.4s ease-out' }}>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                    <X size={14} className="text-white" />
                </button>

                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="p-5 sm:p-6 pb-3 sm:pb-4">
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-amber-400 rounded-lg flex items-center justify-center">
                                    <Sparkles size={12} className="text-black" />
                                </div>
                                <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em]">LumiPhotoIA • Resultado</p>
                            </div>
                            <h2 className="text-white font-black text-lg sm:text-xl leading-tight">
                                Suas fotos ficaram incríveis! ✨<br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300">Libere em HD por apenas R$5</span>
                            </h2>
                        </div>

                        {/* Timer */}
                        <div className={`flex-shrink-0 flex flex-col items-center p-2.5 rounded-2xl border ${isExpired ? 'border-red-500/50 bg-red-500/10' : timerUrgent ? 'border-red-500/40 bg-red-500/10 animate-pulse' : timerWarning ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-white/[0.03]'}`}>
                            <Clock size={11} className={isExpired ? 'text-red-400' : timerWarning ? 'text-amber-400' : 'text-white/40'} />
                            <p className={`font-black text-base leading-none mt-0.5 ${isExpired ? 'text-red-400' : timerUrgent ? 'text-red-400' : timerWarning ? 'text-amber-400' : 'text-white'}`}>
                                {isExpired ? 'EXPIROU' : formatTime(secondsLeft)}
                            </p>
                            <p className="text-[7px] text-white/30 font-bold uppercase mt-0.5">expira</p>
                        </div>
                    </div>

                    {isExpired && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-xs font-bold text-center">Preview expirado. Feche e gere novamente gratuitamente!</p>
                        </div>
                    )}
                </div>

                {/* ── Email Input (compact, above images) ─────────────────────── */}
                <div className="px-5 sm:px-6 pb-3">
                    <div className="flex items-center gap-2 p-2 bg-white/[0.04] rounded-xl border border-white/8">
                        <Mail size={14} className="text-white/30 ml-1 flex-shrink-0" />
                        <input
                            id="trial-email-input"
                            type="email"
                            value={email}
                            onChange={e => { setEmail(e.target.value); setError(''); }}
                            placeholder="Seu email para receber as fotos HD"
                            disabled={isExpired}
                            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-white/25 disabled:opacity-40"
                        />
                        {email.includes('@') && <CheckCircle size={14} className="text-green-400 flex-shrink-0 mr-1" />}
                    </div>
                    {showEmailFor !== null && !email.includes('@') && (
                        <p className="text-amber-400 text-[10px] font-bold mt-1.5 ml-1 animate-pulse">
                            ☝️ Insira seu email acima para desbloquear a foto
                        </p>
                    )}
                </div>

                {error && (
                    <div className="px-5 sm:px-6 pb-2">
                        <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠️ {error}</p>
                    </div>
                )}

                {/* ── Photo Cards with individual unlock buttons ────────────────── */}
                <div className="px-4 sm:px-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {images.map((img, i) => {
                            const isUnlocking = isCreatingCheckout && paymentMode === 'single' && selectedImageIndex === i;
                            return (
                                <div key={img.index} className="rounded-2xl overflow-hidden bg-white/[0.03] border border-white/8 transition-all hover:border-white/20">
                                    {/* Image container */}
                                    <div
                                        className="relative cursor-pointer group"
                                        style={{ aspectRatio: '3/4' }}
                                        onClick={() => !isExpired && setSelectedImageIndex(i)}
                                    >
                                        <img
                                            src={img.url}
                                            alt={`Foto ${i + 1}`}
                                            className="w-full h-full object-cover object-top"
                                            style={{ filter: isExpired ? 'grayscale(100%) brightness(0.5)' : undefined }}
                                            draggable={false}
                                            onContextMenu={e => e.preventDefault()}
                                        />

                                        {/* Watermark overlay */}
                                        {!isExpired && (
                                            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                                                <div className="absolute inset-0 bg-black/20" />
                                                <div className="absolute inset-0 flex flex-col justify-around items-center gap-0 py-2">
                                                    {[0, 1, 2, 3].map(row => (
                                                        <div key={row} className="flex justify-around w-full px-1">
                                                            {[0, 1].map(col => (
                                                                <div
                                                                    key={col}
                                                                    style={{ transform: 'rotate(-30deg)', whiteSpace: 'nowrap' }}
                                                                    className="text-white/35 text-[6px] font-black uppercase tracking-widest select-none"
                                                                >
                                                                    LUMIPHOTO IA • PREVIEW
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Lock badge */}
                                        <div className="absolute top-2 right-2">
                                            <div className="w-6 h-6 bg-black/70 backdrop-blur rounded-full flex items-center justify-center border border-white/10">
                                                <Lock size={10} className="text-white/70" />
                                            </div>
                                        </div>

                                        {/* Hover overlay */}
                                        {!isExpired && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                                                <span className="text-white text-xs font-bold flex items-center gap-1.5">
                                                    <Unlock size={12} /> Desbloquear em HD
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* ★ UNLOCK BUTTON — Below each image ★ */}
                                    <div className="p-2.5">
                                        <button
                                            onClick={() => handleUnlockClick(i)}
                                            disabled={isExpired || isUnlocking}
                                            className={`w-full py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${isExpired
                                                ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                                : isUnlocking
                                                    ? 'bg-orange-500/20 text-orange-400'
                                                    : 'bg-gradient-to-r from-orange-500 to-amber-400 text-black hover:from-orange-400 hover:to-amber-300 hover:scale-[1.02] active:scale-[0.97] shadow-[0_4px_20px_rgba(249,115,22,0.3)]'
                                                }`}
                                        >
                                            {isUnlocking ? (
                                                <><Loader2 size={12} className="animate-spin" /> Aguarde...</>
                                            ) : (
                                                <><Unlock size={11} /> <span className="hidden sm:inline">Desbloquear</span><span className="sm:hidden">Desbloquear foto</span> → R$5</>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ── PACK Offer — Maximum value CTA ──────────────────────────────── */}
                <div className="px-5 sm:px-6 pb-5 space-y-3">
                    {/* Pack highlight */}
                    <div className="relative rounded-2xl border-2 border-orange-500/40 bg-gradient-to-b from-orange-500/10 to-transparent overflow-hidden">
                        {/* Best value badge */}
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-amber-400 text-black text-[9px] font-black uppercase px-3 py-1 rounded-bl-xl">
                            ⭐ Melhor custo-benefício
                        </div>

                        <div className="p-4 pt-3">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                                    <Package size={20} className="text-black" />
                                </div>
                                <div>
                                    <h3 className="text-white font-black text-base leading-tight">Pack 10 Fotos HD</h3>
                                    <p className="text-white/40 text-[10px] font-bold">
                                        3 fotos HD agora + 7 créditos para gerar mais
                                    </p>
                                </div>
                                <div className="ml-auto text-right flex-shrink-0">
                                    <p className="text-white/30 text-[10px] line-through">R$50</p>
                                    <p className="text-orange-400 text-xl font-black leading-none">R$37</p>
                                    <p className="text-white/30 text-[9px] font-bold">R$3,70/foto</p>
                                </div>
                            </div>

                            <button
                                onClick={() => {
                                    if (!email || !email.includes('@')) {
                                        setError('Insira um email válido acima');
                                        document.getElementById('trial-email-input')?.focus();
                                        return;
                                    }
                                    handlePay('pack');
                                }}
                                disabled={isExpired || (isCreatingCheckout && paymentMode === 'pack')}
                                className={`w-full py-3.5 rounded-xl font-black text-sm transition-all ${isExpired
                                    ? 'bg-white/5 text-white/20 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-orange-500 to-amber-400 text-black shadow-[0_8px_30px_rgba(249,115,22,0.4)] hover:shadow-[0_12px_40px_rgba(249,115,22,0.5)] hover:scale-[1.01] active:scale-[0.99]'
                                    }`}
                            >
                                {isCreatingCheckout && paymentMode === 'pack' ? (
                                    <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Aguarde...</span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <Package size={16} />
                                        Liberar Pack Completo → R$37
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-wrap items-center justify-center gap-4 pt-1">
                        <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold"><ShieldCheck size={11} className="text-green-400" /> Pagamento seguro</span>
                        <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold"><Mail size={11} className="text-blue-400" /> Entrega por email</span>
                        <span className="flex items-center gap-1.5 text-white/30 text-[10px] font-bold"><Star size={11} className="text-amber-400" /> HD sem marca d'água</span>
                    </div>
                </div>
            </div>

            {/* Animation keyframe */}
            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.97); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
        </div>
    );
};

export default TrialResultModal;
