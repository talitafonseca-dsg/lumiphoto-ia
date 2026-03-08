import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Download, Lock, Zap, Clock, CheckCircle, Loader2, Star, Package } from 'lucide-react';

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
    const handlePay = useCallback(async (mode: 'single' | 'pack') => {
        if (!email || !email.includes('@')) {
            setError('Insira um email válido para receber suas fotos em HD');
            return;
        }
        if (mode === 'single' && selectedImageIndex === null) {
            setError('Selecione qual foto deseja liberar em HD');
            return;
        }
        if (isExpired) {
            setError('Preview expirado. Feche e gere novamente!');
            return;
        }

        setIsCreatingCheckout(true);
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
                    selected_image_index: mode === 'single' ? selectedImageIndex : null,
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

    if (!isOpen) return null;

    const timerUrgent = secondsLeft < 60;
    const timerWarning = secondsLeft < 5 * 60;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />

            <div className="relative w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl bg-[#111] border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.8)] animate-in fade-in zoom-in-95 duration-300">

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 w-8 h-8 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors"
                >
                    <X size={14} className="text-white" />
                </button>

                {/* ── Header ─────────────────────────────────────────────────────── */}
                <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-4 pr-8">
                        <div>
                            <p className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">🔥 LumiPhotoIA — Teste Grátis</p>
                            <h2 className="text-white font-black text-xl leading-tight">
                                Suas fotos estão prontas!<br />
                                <span className="text-orange-400">Libere em HD agora.</span>
                            </h2>
                        </div>

                        {/* Timer */}
                        <div className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl border ${isExpired ? 'border-red-500/50 bg-red-500/10' : timerUrgent ? 'border-red-500/40 bg-red-500/10 animate-pulse' : timerWarning ? 'border-amber-500/40 bg-amber-500/10' : 'border-white/10 bg-white/[0.03]'}`}>
                            <Clock size={12} className={isExpired ? 'text-red-400' : timerWarning ? 'text-amber-400' : 'text-white/40'} />
                            <p className={`font-black text-lg leading-none mt-1 ${isExpired ? 'text-red-400' : timerUrgent ? 'text-red-400' : timerWarning ? 'text-amber-400' : 'text-white'}`}>
                                {isExpired ? 'EXPIROU' : formatTime(secondsLeft)}
                            </p>
                            <p className="text-[8px] text-white/30 font-bold uppercase mt-0.5">preview</p>
                        </div>
                    </div>

                    {isExpired && (
                        <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                            <p className="text-red-400 text-xs font-bold text-center">Preview expirado. Feche e gere novamente gratuitamente!</p>
                        </div>
                    )}
                </div>

                {/* ── Photo Grid ─────────────────────────────────────────────────── */}
                <div className="px-4 sm:px-6 pb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {images.map((img, i) => (
                            <div
                                key={img.index}
                                onClick={() => !isExpired && setSelectedImageIndex(i)}
                                className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 group sm:aspect-[3/4] ${selectedImageIndex === i && paymentMode === 'single' ? 'ring-2 ring-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]' : 'ring-1 ring-white/10 hover:ring-white/30'}`}
                                style={{ aspectRatio: '3/4' }}
                            >
                                <img
                                    src={img.url}
                                    alt={`Foto ${i + 1}`}
                                    className="w-full h-full object-cover object-top"
                                    style={{ filter: isExpired ? 'grayscale(100%) brightness(0.5)' : undefined }}
                                    draggable={false}
                                    onContextMenu={e => e.preventDefault()}
                                />

                                {/* Watermark overlay — tiled to prevent screenshot theft */}
                                {!isExpired && (
                                    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
                                        {/* Semi-transparent dark veil */}
                                        <div className="absolute inset-0 bg-black/25" />
                                        {/* Tiled watermark grid */}
                                        <div className="absolute inset-0 flex flex-col justify-around items-center gap-0 py-2">
                                            {[0, 1, 2, 3].map(row => (
                                                <div key={row} className="flex justify-around w-full px-1">
                                                    {[0, 1].map(col => (
                                                        <div
                                                            key={col}
                                                            style={{ transform: 'rotate(-30deg)', whiteSpace: 'nowrap' }}
                                                            className="text-white/40 text-[7px] font-black uppercase tracking-widest select-none"
                                                        >
                                                            LUMIPHOTO IA • PREVIEW
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                        {/* Extra bold watermark centered on face/top area */}
                                        <div className="absolute top-[20%] left-0 right-0 flex justify-center">
                                            <div
                                                style={{ transform: 'rotate(-20deg)', whiteSpace: 'nowrap' }}
                                                className="text-white/50 text-[8px] font-black uppercase tracking-[0.25em] select-none bg-black/30 px-3 py-1 rounded"
                                            >
                                                PREVIEW • LUMIPHOTO IA • PREVIEW
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Lock icon */}
                                <div className="absolute top-2 right-2">
                                    <div className="w-5 h-5 bg-black/60 backdrop-blur rounded-full flex items-center justify-center">
                                        <Lock size={9} className="text-white/60" />
                                    </div>
                                </div>

                                {/* Selected badge */}
                                {selectedImageIndex === i && paymentMode === 'single' && (
                                    <div className="absolute top-2 left-2 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                        <CheckCircle size={10} className="text-black" />
                                    </div>
                                )}

                                {/* Style label */}
                                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                    <p className="text-[8px] text-white/60 font-black uppercase text-center tracking-wide">
                                        {i === 0 ? '🔴 Ensaio Vermelho' : i === 1 ? '🏠 Casual em Casa' : '✨ Inspiracional Dourado'}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-white/25 text-[10px] mt-2 select-none">
                        🔒 Fotos com marca d'água. Libere em HD após o pagamento.
                    </p>
                </div>

                {/* ── Purchase Section ───────────────────────────────────────────── */}
                <div className="px-6 pb-6 space-y-3">
                    {/* Email input */}
                    <div>
                        <label className="block text-[10px] font-black uppercase text-white/50 tracking-wider mb-1.5">
                            📧 Seu email (as fotos HD chegam aqui)
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="seuemail@exemplo.com"
                            disabled={isExpired}
                            className="w-full bg-white/[0.05] border border-white/10 focus:border-orange-500/60 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 transition-all disabled:opacity-40"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-xs font-bold bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">⚠️ {error}</p>
                    )}

                    {/* CTA Buttons */}
                    <div className="grid grid-cols-1 gap-3">
                        {/* PACK — Primary CTA */}
                        <button
                            onClick={() => { setPaymentMode('pack'); handlePay('pack'); }}
                            disabled={isExpired || isCreatingCheckout}
                            className={`relative w-full py-4 rounded-2xl font-black text-sm transition-all overflow-hidden ${isExpired ? 'bg-white/5 text-white/20 cursor-not-allowed' : 'bg-gradient-to-r from-orange-600 to-amber-500 text-black shadow-[0_10px_40px_rgba(245,158,11,0.35)] hover:shadow-[0_15px_50px_rgba(245,158,11,0.5)] hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isCreatingCheckout && paymentMode === 'pack' ? (
                                <span className="flex items-center justify-center gap-2"><Loader2 size={16} className="animate-spin" /> Aguarde...</span>
                            ) : (
                                <span className="flex flex-col items-center">
                                    <span className="flex items-center gap-2 text-base">
                                        <Package size={18} />
                                        Pack 10 Fotos HD — <span className="text-xl font-black">R$37</span>
                                    </span>
                                    <span className="text-[10px] font-bold mt-0.5 opacity-80">3 fotos HD agora + conta com 7 créditos para gerar mais</span>
                                </span>
                            )}
                            {/* Best value badge */}
                            <span className="absolute top-2 right-3 bg-black/30 text-[8px] font-black uppercase text-white/90 px-2 py-0.5 rounded-full">⭐ Melhor custo</span>
                        </button>

                        {/* SINGLE — Secondary CTA */}
                        <button
                            onClick={() => { setPaymentMode('single'); }}
                            disabled={isExpired}
                            className={`w-full py-3 rounded-2xl font-black text-sm border transition-all ${isExpired ? 'border-white/5 text-white/20 cursor-not-allowed bg-transparent' : paymentMode === 'single' ? 'border-orange-500/50 bg-orange-500/10 text-orange-400' : 'border-white/15 bg-white/[0.03] text-white/70 hover:border-white/30 hover:bg-white/[0.06]'}`}
                        >
                            {paymentMode === 'single' ? (
                                <span className="flex flex-col items-center gap-1">
                                    <span className="text-base">Liberar 1 foto em HD — R$5</span>
                                    {selectedImageIndex === null ? (
                                        <span className="text-[9px] font-bold opacity-70 text-amber-400">⬆️ Toque numa foto acima para selecionar</span>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handlePay('single'); }}
                                            disabled={isCreatingCheckout}
                                            className="mt-1 px-6 py-2 bg-orange-500 text-black rounded-xl font-black text-xs hover:bg-orange-400 transition-colors disabled:opacity-50"
                                        >
                                            {isCreatingCheckout ? <Loader2 size={12} className="animate-spin inline" /> : `✓ Liberar Foto ${(selectedImageIndex ?? 0) + 1} — R$5`}
                                        </button>
                                    )}
                                </span>
                            ) : (
                                <span className="flex items-center justify-center gap-2">
                                    <Zap size={14} />
                                    Liberar 1 foto em HD — R$5
                                </span>
                            )}
                        </button>
                    </div>

                    {/* Trust signals */}
                    <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
                        <span className="flex items-center gap-1 text-white/30 text-[10px] font-bold"><CheckCircle size={10} className="text-green-400" /> Pagamento seguro MP</span>
                        <span className="flex items-center gap-1 text-white/30 text-[10px] font-bold"><Star size={10} className="text-amber-400" /> Fotos chegam por email</span>
                        <span className="flex items-center gap-1 text-white/30 text-[10px] font-bold"><Download size={10} className="text-blue-400" /> HD sem marca d'água</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrialResultModal;
