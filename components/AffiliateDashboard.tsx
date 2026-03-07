import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DollarSign, TrendingUp, Copy, Check, LogOut, Loader2, Link2, Eye, EyeOff, ShoppingCart, CreditCard, Calendar } from 'lucide-react';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;

interface AffiliateData {
    affiliate: {
        name: string;
        email: string;
        affiliate_code: string;
        commission_percent: number;
    };
    stats: {
        total_sales: number;
        total_commission: number;
        total_paid: number;
        pending_commission: number;
        month_sales: number;
        month_commission: number;
    };
    sales: any[];
    payouts: any[];
}

export const AffiliateDashboard: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [data, setData] = useState<AffiliateData | null>(null);
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'resumo' | 'vendas' | 'pagamentos'>('resumo');

    useEffect(() => {
        checkSession();
    }, []);

    const checkSession = async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            setIsLoggedIn(true);
            fetchDashboard(session.access_token);
        }
    };

    const handleLogin = async () => {
        setLoading(true);
        setError(null);
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            setIsLoggedIn(true);
            fetchDashboard(authData.session!.access_token);
        } catch (err: any) {
            setError(err.message || 'Erro ao fazer login');
        } finally {
            setLoading(false);
        }
    };

    const fetchDashboard = async (token?: string) => {
        try {
            const t = token || (await supabase.auth.getSession()).data.session?.access_token;
            if (!t) return;

            const res = await fetch(`${SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${t}`,
                },
                body: JSON.stringify({ action: 'affiliate_dashboard' }),
            });

            const result = await res.json();
            if (result.error) {
                setError('Acesso negado. Esta conta não é de afiliado.');
                setIsLoggedIn(false);
                return;
            }
            setData(result);
        } catch (err: any) {
            setError('Erro ao carregar dados');
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsLoggedIn(false);
        setData(null);
    };

    const copyLink = () => {
        if (!data) return;
        navigator.clipboard.writeText(`https://www.lumiphotoia.online?aff=${data.affiliate.affiliate_code}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const fmt = (n: number) => `R$ ${n.toFixed(2).replace('.', ',')}`;
    const fmtDate = (d: string) => new Date(d).toLocaleDateString('pt-BR');

    // ==================== LOGIN SCREEN ====================
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
                <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-amber-900/20 pointer-events-none" />
                <div className="w-full max-w-md relative z-10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-white">LUMIPHOTO<span className="text-amber-500">IA</span></h1>
                        <p className="text-white/40 text-sm mt-1">Painel do Afiliado</p>
                    </div>

                    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10 shadow-2xl">
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" size={20} /> Entrar
                        </h2>

                        {error && (
                            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
                        )}

                        <div className="space-y-4">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Seu email de afiliado"
                                className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder:text-white/30"
                            />
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Senha"
                                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white placeholder:text-white/30 pr-12"
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                                />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <button
                                onClick={handleLogin}
                                disabled={loading}
                                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl font-bold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50"
                            >
                                {loading ? <Loader2 size={20} className="animate-spin" /> : 'Entrar'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== DASHBOARD ====================
    if (!data) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
                <Loader2 size={40} className="animate-spin text-emerald-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            <div className="fixed inset-0 bg-gradient-to-br from-emerald-900/10 via-black to-amber-900/10 pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto p-4 md:p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-black text-white">LUMIPHOTO<span className="text-amber-500">IA</span></h1>
                        <p className="text-white/40 text-sm">Painel do Afiliado • {data.affiliate.name}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white/60 hover:text-white hover:border-white/20 transition-all text-sm">
                        <LogOut size={16} /> Sair
                    </button>
                </div>

                {/* Affiliate Link */}
                <div className="mb-6 p-4 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-2xl">
                    <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Link2 size={14} /> Seu Link de Afiliado (Comissão: {data.affiliate.commission_percent}%)
                    </p>
                    <div className="flex items-center gap-2">
                        <code className="flex-1 text-white/80 text-sm bg-black/30 px-4 py-2 rounded-lg overflow-x-auto">
                            https://www.lumiphotoia.online?aff={data.affiliate.affiliate_code}
                        </code>
                        <button
                            onClick={copyLink}
                            className="px-4 py-2 bg-emerald-500 text-white rounded-lg font-bold text-sm flex items-center gap-1 hover:bg-emerald-400 transition-colors shrink-0"
                        >
                            {copied ? <><Check size={14} /> Copiado!</> : <><Copy size={14} /> Copiar</>}
                        </button>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                        <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><ShoppingCart size={12} /> Vendas Mês</p>
                        <p className="text-2xl font-black text-white">{data.stats.month_sales}</p>
                    </div>
                    <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                        <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><DollarSign size={12} /> Comissão Mês</p>
                        <p className="text-2xl font-black text-emerald-400">{fmt(data.stats.month_commission)}</p>
                    </div>
                    <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                        <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><CreditCard size={12} /> Pendente</p>
                        <p className="text-2xl font-black text-amber-400">{fmt(data.stats.pending_commission)}</p>
                    </div>
                    <div className="bg-zinc-900/80 border border-white/10 rounded-xl p-4">
                        <p className="text-white/40 text-xs mb-1 flex items-center gap-1"><TrendingUp size={12} /> Total Recebido</p>
                        <p className="text-2xl font-black text-white">{fmt(data.stats.total_paid)}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                    {(['resumo', 'vendas', 'pagamentos'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}
                        >
                            {tab === 'resumo' ? '📊 Resumo' : tab === 'vendas' ? '🛒 Vendas' : '💵 Pagamentos'}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="bg-zinc-900/80 border border-white/10 rounded-2xl p-6">
                    {activeTab === 'resumo' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-white">Resumo Geral</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <p className="text-white/40 text-sm">Total de Vendas</p>
                                    <p className="text-3xl font-black text-white">{data.stats.total_sales}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <p className="text-white/40 text-sm">Comissão Total Gerada</p>
                                    <p className="text-3xl font-black text-emerald-400">{fmt(data.stats.total_commission)}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <p className="text-white/40 text-sm">Já Recebido (PIX)</p>
                                    <p className="text-3xl font-black text-white">{fmt(data.stats.total_paid)}</p>
                                </div>
                                <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                    <p className="text-amber-400 text-sm font-bold">A Receber</p>
                                    <p className="text-3xl font-black text-amber-400">{fmt(data.stats.pending_commission)}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'vendas' && (
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Histórico de Vendas</h3>
                            {data.sales.length === 0 ? (
                                <p className="text-white/40 text-center py-8">Nenhuma venda ainda. Compartilhe seu link!</p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-white/10">
                                                <th className="text-left py-3 text-white/40 font-medium">Data</th>
                                                <th className="text-left py-3 text-white/40 font-medium">Comprador</th>
                                                <th className="text-left py-3 text-white/40 font-medium">Plano</th>
                                                <th className="text-right py-3 text-white/40 font-medium">Valor</th>
                                                <th className="text-right py-3 text-white/40 font-medium">Comissão</th>
                                                <th className="text-center py-3 text-white/40 font-medium">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {data.sales.map((sale: any) => (
                                                <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5">
                                                    <td className="py-3 text-white/70">{fmtDate(sale.created_at)}</td>
                                                    <td className="py-3 text-white/70">{sale.buyer_email?.replace(/(.{2})(.*)(@.*)/, "$1***$3")}</td>
                                                    <td className="py-3 text-white/70 capitalize">{sale.plan_type}</td>
                                                    <td className="py-3 text-white/70 text-right">{fmt(sale.sale_amount)}</td>
                                                    <td className="py-3 text-emerald-400 text-right font-bold">{fmt(sale.commission_amount)}</td>
                                                    <td className="py-3 text-center">
                                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sale.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                            {sale.status === 'paid' ? 'Pago' : 'Pendente'}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'pagamentos' && (
                        <div>
                            <h3 className="text-lg font-bold text-white mb-4">Pagamentos Recebidos (PIX)</h3>
                            {data.payouts.length === 0 ? (
                                <p className="text-white/40 text-center py-8">Nenhum pagamento realizado ainda.</p>
                            ) : (
                                <div className="space-y-3">
                                    {data.payouts.map((payout: any) => (
                                        <div key={payout.id} className="p-4 bg-white/5 rounded-xl flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-bold">{fmt(payout.amount)}</p>
                                                <p className="text-white/40 text-xs flex items-center gap-1">
                                                    <Calendar size={12} />
                                                    {payout.period_start && payout.period_end
                                                        ? `${fmtDate(payout.period_start)} - ${fmtDate(payout.period_end)}`
                                                        : fmtDate(payout.paid_at)}
                                                </p>
                                                {payout.pix_receipt && <p className="text-white/30 text-xs mt-1">{payout.pix_receipt}</p>}
                                            </div>
                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-xs font-bold">✓ Pago</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-white/20 text-[10px] uppercase tracking-widest">
                        © 2026 LumiphotoIA. Painel de Afiliado.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AffiliateDashboard;
