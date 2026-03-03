import React, { useState } from 'react';
import { Gift, Copy, Check, Loader2, X, Link2, Sparkles } from 'lucide-react';

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
    userEmail?: string;
}

export const ReferralModal: React.FC<ReferralModalProps> = ({ isOpen, onClose, userEmail }) => {
    const [email, setEmail] = useState(userEmail || '');
    const [loading, setLoading] = useState(false);
    const [referralLink, setReferralLink] = useState('');
    const [copied, setCopied] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!email || !email.includes('@')) {
            setError('Por favor, insira um email válido');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-referral`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: email.toLowerCase().trim() }),
                }
            );

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Erro ao gerar link');
            }

            const data = await response.json();
            setReferralLink(data.link);
        } catch (err: any) {
            setError(err.message || 'Erro ao gerar link. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <div
                className="relative bg-zinc-900 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className="text-center mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                        <Gift size={28} className="text-emerald-400" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Indique e Ganhe</h2>
                    <p className="text-white/50 text-sm mt-2">
                        Gere seu link exclusivo. Quando alguém comprar usando seu link,
                        você ganha <span className="text-emerald-400 font-bold">3 fotos grátis</span>!
                    </p>
                </div>

                {!referralLink ? (
                    /* Generate Form */
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-white/60 mb-2">Seu email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder:text-white/30"
                            />
                        </div>

                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <Link2 size={18} />
                                    <span>Gerar Meu Link</span>
                                </>
                            )}
                        </button>
                    </div>
                ) : (
                    /* Link Generated */
                    <div className="space-y-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-emerald-400" />
                                <span className="text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                    Seu link está pronto!
                                </span>
                            </div>
                            <div className="bg-black/30 rounded-lg p-3 flex items-center gap-2">
                                <code className="text-white/80 text-xs flex-1 break-all">{referralLink}</code>
                                <button
                                    onClick={handleCopy}
                                    className="shrink-0 p-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                                >
                                    {copied ? (
                                        <Check size={16} className="text-emerald-400" />
                                    ) : (
                                        <Copy size={16} className="text-emerald-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <div className="text-center text-white/40 text-xs space-y-1">
                            <p>📤 Envie para um amigo</p>
                            <p>🛒 Quando ele comprar, você ganha 3 fotos</p>
                            <p>📧 Você será notificado por email</p>
                        </div>

                        <button
                            onClick={handleCopy}
                            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all"
                        >
                            <Copy size={18} />
                            <span>{copied ? 'Copiado!' : 'Copiar Link'}</span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReferralModal;
