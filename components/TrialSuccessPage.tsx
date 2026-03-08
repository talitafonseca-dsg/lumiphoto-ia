import React, { useEffect, useState, useRef } from 'react';
import { CheckCircle, Download, Loader2, XCircle, Clock, Mail, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

interface PurchasedPhoto {
    url: string;
    label: string;
    index: number;
    expires_at: string;
}

type PageStatus = 'polling' | 'confirmed' | 'failed';

export const TrialSuccessPage: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => {
    const [status, setStatus] = useState<PageStatus>('polling');
    const [photos, setPhotos] = useState<PurchasedPhoto[]>([]);
    const [paidEmail, setPaidEmail] = useState('');
    const [productType, setProductType] = useState<'single' | 'pack'>('single');
    const [pollCount, setPollCount] = useState(0);
    const [errorMsg, setErrorMsg] = useState('');
    const [showDownloads, setShowDownloads] = useState(false);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const pollCountRef = useRef(0);

    const generationId = new URLSearchParams(window.location.search).get('gen') || '';

    useEffect(() => {
        if (!generationId) {
            setErrorMsg('ID de geração não encontrado. Verifique o link.');
            setStatus('failed');
            return;
        }

        const poll = async () => {
            pollCountRef.current += 1;
            setPollCount(pollCountRef.current);

            // Stop after 3 minutes (36 polls × 5s) — show confirmed anyway
            if (pollCountRef.current > 36) {
                if (intervalRef.current) clearInterval(intervalRef.current);
                setStatus('confirmed');
                return;
            }

            try {
                const res = await fetch(
                    `${SUPABASE_URL}/rest/v1/trial_generations?id=eq.${generationId}&select=status,purchased_photo_urls,payer_email,product_type,email_sent_at`,
                    {
                        headers: {
                            apikey: SUPABASE_ANON_KEY,
                            Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
                            Accept: 'application/json',
                        },
                    }
                );

                if (!res.ok) return;
                const data = await res.json();
                const record = data?.[0];
                if (!record) return;

                const isPaid = record.status === 'paid_single' || record.status === 'paid_pack';

                if (isPaid) {
                    if (intervalRef.current) clearInterval(intervalRef.current);
                    setPaidEmail(record.payer_email || '');
                    setProductType(record.product_type || 'single');
                    if (record.purchased_photo_urls?.length > 0) {
                        setPhotos(record.purchased_photo_urls);
                    }
                    setStatus('confirmed');
                }
            } catch {
                // silently retry
            }
        };

        poll();
        intervalRef.current = setInterval(poll, 5000);
        return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }, [generationId]);

    const handleDownload = async (url: string, label: string) => {
        try {
            const res = await fetch(url);
            const blob = await res.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = `LumiPhotoIA_${label.replace(' ', '_')}_HD.png`;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(blobUrl); }, 2000);
        } catch {
            window.open(url, '_blank');
        }
    };

    // ── Polling state ─────────────────────────────────────────────────────────
    if (status === 'polling') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="fixed inset-0 pointer-events-none">
                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[150px]" />
                </div>
                <div className="w-full max-w-sm relative z-10 text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-amber-500/20 rounded-full flex items-center justify-center">
                        <Loader2 size={36} className="text-amber-400 animate-spin" />
                    </div>
                    <h1 className="text-2xl font-black text-white mb-3">Confirmando pagamento...</h1>
                    <p className="text-white/50 text-sm mb-6 leading-relaxed">
                        Aguarde enquanto processamos seu pagamento.<br />
                        <span className="text-amber-400 font-bold">Isso leva apenas alguns segundos!</span>
                    </p>
                    <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                        <div className="flex items-center justify-center gap-2 text-white/40 text-xs">
                            <Clock size={12} className="text-amber-400" />
                            <span>Verificando... ({pollCount > 0 ? `${pollCount}ª` : '1ª'} tentativa)</span>
                        </div>
                    </div>
                    <p className="text-white/20 text-xs mt-4">Não feche esta página.</p>
                </div>
            </div>
        );
    }

    // ── Failed state ──────────────────────────────────────────────────────────
    if (status === 'failed') {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="w-full max-w-sm text-center">
                    <div className="w-20 h-20 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
                        <XCircle size={36} className="text-red-400" />
                    </div>
                    <h1 className="text-2xl font-black text-red-400 mb-3">Algo deu errado</h1>
                    <p className="text-white/50 text-sm mb-6">{errorMsg || 'Verifique seu email para os links de download.'}</p>
                    <button onClick={onGoHome} className="px-8 py-3 bg-amber-500 text-black font-black rounded-xl hover:bg-amber-400 transition-colors">
                        Voltar ao Início
                    </button>
                </div>
            </div>
        );
    }

    // ── Confirmed state (primary: email confirmation modal) ───────────────────
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
            {/* Glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-green-600/10 rounded-full blur-[150px]" />
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] bg-amber-600/10 rounded-full blur-[80px]" />
            </div>

            <div className="w-full max-w-md relative z-10">

                {/* ── SUCCESS MODAL ─────────────────────────────────────────── */}
                <div className="bg-[#111827] border border-green-500/30 rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(34,197,94,0.1)]">

                    {/* Header banner */}
                    <div className="bg-gradient-to-r from-green-600/20 via-green-500/10 to-green-600/20 border-b border-green-500/20 px-6 py-5 text-center">
                        <div className="w-16 h-16 mx-auto mb-3 bg-green-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                            <CheckCircle size={32} className="text-green-400" />
                        </div>
                        <h1 className="text-xl font-black text-white">Pagamento confirmado! 🎉</h1>
                        <p className="text-white/50 text-sm mt-1">
                            {productType === 'pack'
                                ? 'Suas 3 fotos HD estão a caminho!'
                                : 'Sua foto HD está a caminho!'}
                        </p>
                    </div>

                    {/* Email notification */}
                    <div className="px-6 py-6">
                        <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-5 mb-4">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Mail size={18} className="text-amber-400" />
                                </div>
                                <div>
                                    <p className="text-amber-400 font-black text-sm uppercase tracking-wider">Verifique seu email</p>
                                    <p className="text-white/40 text-xs">Enviamos os links de download para:</p>
                                </div>
                            </div>
                            <p className="text-white font-bold text-sm break-all">
                                {paidEmail || 'seu email'}
                            </p>
                            <p className="text-white/30 text-xs mt-2">
                                Não encontrou? Verifique a <span className="text-amber-400">pasta de spam</span> e mova para a caixa de entrada.
                            </p>
                        </div>

                        {/* Pack: credentials info */}
                        {productType === 'pack' && (
                            <div className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 mb-4">
                                <p className="text-amber-400 font-black text-xs uppercase tracking-wider mb-2">🎁 Bônus: sua conta criada</p>
                                <p className="text-white/60 text-sm leading-relaxed">
                                    Criamos uma conta com <strong className="text-amber-400">7 créditos extras</strong>.<br />
                                    <span className="text-white/40 text-xs">Login e senha enviados no mesmo email.</span>
                                </p>
                            </div>
                        )}

                        {/* Download section — collapsible secondary option */}
                        {photos.length > 0 && (
                            <div className="border border-white/10 rounded-2xl overflow-hidden mb-4">
                                <button
                                    onClick={() => setShowDownloads(v => !v)}
                                    className="w-full flex items-center justify-between px-4 py-3 text-white/50 text-sm hover:bg-white/5 transition-colors"
                                >
                                    <span className="flex items-center gap-2">
                                        <Download size={14} className="text-white/40" />
                                        Baixar diretamente aqui também
                                    </span>
                                    {showDownloads
                                        ? <ChevronUp size={14} />
                                        : <ChevronDown size={14} />}
                                </button>
                                {showDownloads && (
                                    <div className="border-t border-white/10 divide-y divide-white/5">
                                        {photos.map((photo, i) => (
                                            <div key={i} className="flex items-center gap-3 px-4 py-3">
                                                <div className="w-12 h-14 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                                                    <img
                                                        src={photo.url}
                                                        alt={photo.label}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-white font-bold text-sm">{photo.label}</p>
                                                    <p className="text-white/30 text-xs">HD • Sem marca d'água</p>
                                                </div>
                                                <button
                                                    onClick={() => handleDownload(photo.url, photo.label)}
                                                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold rounded-xl hover:bg-amber-500/30 transition-all"
                                                >
                                                    <Download size={12} />
                                                    Baixar
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Expiry notice */}
                        <p className="text-center text-white/20 text-xs mb-5">
                            ⚠️ Os links expiram em 90 dias. Baixe e salve suas fotos!
                        </p>

                        {/* CTA */}
                        <button
                            onClick={onGoHome}
                            className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl font-bold text-sm text-white/60 flex items-center justify-center gap-2 hover:bg-white/10 transition-all"
                        >
                            <span>Voltar ao Início</span>
                            <ArrowRight size={15} />
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrialSuccessPage;
