import React, { useState, useEffect } from 'react';
import { Loader2, Mail, Lock, LogIn, ArrowLeft, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../services/supabaseClient';

interface AuthScreenProps {
    onLogin: () => void;
    onBack?: () => void;
    segmentLabel?: string;   // e.g. "🍕 Delivery", "✨ Beleza"
    segmentColor?: string;   // tailwind color class e.g. "text-emerald-400"
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onBack, segmentLabel, segmentColor = 'text-amber-400' }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mode, setMode] = useState<'login' | 'forgot'>('login');
    const [resetSent, setResetSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [recentPurchase, setRecentPurchase] = useState<{ email: string; password: string } | null>(null);

    // Check for recent purchase from CheckoutResult
    useEffect(() => {
        try {
            const stored = localStorage.getItem('lumiphoto_recent_purchase');
            if (stored) {
                const data = JSON.parse(stored);
                // Only show if purchase was within the last 30 minutes
                if (data.timestamp && Date.now() - data.timestamp < 30 * 60 * 1000) {
                    setRecentPurchase({ email: data.email, password: data.password });
                    if (data.email) setEmail(data.email);
                    if (data.password) setPassword(data.password);
                } else {
                    localStorage.removeItem('lumiphoto_recent_purchase');
                }
            }
        } catch { /* ignore */ }
    }, []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (error) {
                if (error.message.includes('Invalid login')) {
                    setError('Email ou senha incorretos');
                } else {
                    setError(error.message);
                }
                return;
            }

            if (data.user) {
                // Clear recent purchase data after successful login
                localStorage.removeItem('lumiphoto_recent_purchase');
                onLogin();
            }
        } catch (err: any) {
            setError('Erro ao fazer login. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: 'https://www.lumiphotoia.online/reset-password',
            });

            if (error) {
                setError(error.message);
                return;
            }

            setResetSent(true);
        } catch (err: any) {
            setError('Erro ao enviar email de recuperação.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[150px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-amber-600/5 blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-md relative z-10">
                {/* Back Button */}
                {onBack && (
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8"
                    >
                        <ArrowLeft size={18} />
                        Voltar à página inicial
                    </button>
                )}

                {/* Logo */}
                <div className="text-center mb-10">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <img src="/logo-gold.png" alt="LumiphotoIA" className="w-14 h-14 object-contain drop-shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
                    </div>
                    <h1 className="text-3xl font-black tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-600">LUMIPHOTO</span>
                        <span className="text-white">IA</span>
                    </h1>
                    {segmentLabel && (
                        <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest ${segmentColor}`}>
                            {segmentLabel}
                        </div>
                    )}
                    <p className="text-white/40 text-sm mt-2">
                        Estúdio de Fotografia Profissional com IA
                    </p>
                </div>

                {mode === 'login' ? (
                    /* Login Form */
                    <form onSubmit={handleLogin} className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        <h2 className="text-xl font-bold mb-4 text-center text-white">Entrar na Plataforma</h2>

                        {/* Recent Purchase Welcome Banner */}
                        {recentPurchase && (
                            <div className="mb-6 p-4 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-500/30 rounded-2xl space-y-3">
                                <div className="flex items-center gap-2">
                                    <CheckCircle size={18} className="text-emerald-400 flex-shrink-0" />
                                    <p className="text-emerald-400 font-bold text-sm">Compra aprovada! Faça login abaixo</p>
                                </div>
                                <div className="bg-black/20 rounded-xl p-3 space-y-1.5">
                                    {recentPurchase.email && (
                                        <p className="text-white/60 text-xs">
                                            Email: <span className="text-white font-bold">{recentPurchase.email}</span>
                                        </p>
                                    )}
                                    <p className="text-white/60 text-xs">
                                        Senha: <span className="text-amber-400 font-mono font-bold">{recentPurchase.password}</span>
                                    </p>
                                </div>
                                <p className="text-white/30 text-[10px] text-center">Os campos já foram preenchidos. Clique em "Entrar"</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Email</label>
                                <div className="relative">
                                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="seu@email.com"
                                        required
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-white placeholder:text-white/30 transition-colors"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm text-white/60 mb-2">Senha</label>
                                <div className="relative">
                                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        className="w-full pl-12 pr-12 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-white placeholder:text-white/30 transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Forgot Password Link */}
                        <div className="mt-3 text-right">
                            <button
                                type="button"
                                onClick={() => { setMode('forgot'); setError(null); }}
                                className="text-xs text-amber-400/70 hover:text-amber-400 transition-colors"
                            >
                                Esqueci minha senha
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-5 py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:from-amber-500 hover:to-yellow-500 transition-all disabled:opacity-50 text-white"
                        >
                            {loading ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <LogIn size={20} />
                                    Entrar
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    /* Forgot Password Form */
                    <form onSubmit={handleForgotPassword} className="bg-white/[0.03] backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
                        <button
                            type="button"
                            onClick={() => { setMode('login'); setError(null); setResetSent(false); }}
                            className="flex items-center gap-2 text-xs text-white/40 hover:text-white transition-colors mb-6"
                        >
                            <ArrowLeft size={14} />
                            Voltar ao login
                        </button>

                        <h2 className="text-xl font-bold mb-2 text-white">Recuperar Senha</h2>
                        <p className="text-sm text-white/40 mb-6">
                            Digite seu email e enviaremos um link para redefinir sua senha.
                        </p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
                                {error}
                            </div>
                        )}

                        {resetSent ? (
                            <div className="p-6 bg-green-500/10 border border-green-500/20 rounded-xl text-center space-y-3">
                                <CheckCircle size={32} className="text-green-500 mx-auto" />
                                <p className="text-green-400 font-bold">Email enviado!</p>
                                <p className="text-white/40 text-sm">
                                    Verifique sua caixa de entrada e spam. O link para redefinir sua senha foi enviado para <strong className="text-white/60">{email}</strong>.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => { setMode('login'); setResetSent(false); }}
                                    className="mt-4 px-6 py-2.5 bg-white/10 rounded-lg text-sm text-white/70 hover:bg-white/20 transition-colors"
                                >
                                    Voltar ao login
                                </button>
                            </div>
                        ) : (
                            <>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Email</label>
                                    <div className="relative">
                                        <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="seu@email.com"
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/20 text-white placeholder:text-white/30 transition-colors"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-6 py-4 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 text-white"
                                >
                                    {loading ? (
                                        <Loader2 size={20} className="animate-spin" />
                                    ) : (
                                        'Enviar Link de Recuperação'
                                    )}
                                </button>
                            </>
                        )}
                    </form>
                )}

                {/* Footer */}
                <p className="text-center text-white/20 text-xs mt-8">
                    © {new Date().getFullYear()} LumiphotoIA. Todos os direitos reservados.
                </p>
            </div>
        </div>
    );
};
