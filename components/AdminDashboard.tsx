import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { BarChart3, Users, DollarSign, Camera, TrendingUp, Shield, Eye, EyeOff, ArrowRight, Loader2, LogOut, RefreshCw, Smartphone, Monitor, Repeat, Zap, CreditCard, Star, UserPlus, Link2, Copy, Check, Percent, Wallet, ChevronDown, ChevronUp, X, Calendar, Mail, Send, MessageSquare, Target, FileText } from 'lucide-react';

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
);

const ADMIN_EMAIL = 'talitafpublicitaria@gmail.com';

interface Stats {
    overview: {
        totalRevenue: number;
        totalSales: number;
        avgTicket: number;
        totalUsers: number;
        newUsersLastWeek: number;
        usersWithCredits: number;
        totalCreditsInSystem: number;
        conversionRate: number;
        repeatRate: number;
        repeatBuyers: number;
        uniqueBuyers: number;
        // Checkout funnel
        totalCheckouts?: number;
        checkoutsToday?: number;
        checkoutsLast7days?: number;
        checkoutConversionRate?: number;
    };
    salesByPlan: Record<string, { count: number; revenue: number }>;
    salesByDay: Record<string, { count: number; revenue: number }>;
    recentSales: Array<{ id: string; email: string; plan: string; amount: number; date: string; source_page?: string | null; utm_source?: string | null; gateway?: string }>;
    generationStats: {
        totalGenerations: number;
        totalPhotos: number;
        styleRanking: Array<{ style: string; count: number }>;
        deviceSplit: { mobile: number; desktop: number };
        generationsByDay: Record<string, number>;
        hasCustomInstructions: number;
    };
    salesBySourcePage?: Record<string, { count: number; revenue: number }>;
    salesByUtmSource?: Record<string, { count: number; revenue: number }>;
    trialRawData?: Array<{ id: string; ip_hash: string; session_id: string; status: string; delivery_style: string; created_at: string }>;
    checkoutStats?: {
        total: number;
        today: number;
        last7days: number;
        byPlan: Record<string, number>;
        bySource: Record<string, number>;
        byDay: Record<string, number>;
    };
}

export const AdminDashboard: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loginError, setLoginError] = useState('');
    const [loginLoading, setLoginLoading] = useState(false);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminTab, setAdminTab] = useState<'dashboard' | 'affiliates' | 'campaigns' | 'trials' | 'trial_metrics' | 'recovery'>('dashboard');
    const [affiliates, setAffiliates] = useState<any[]>([]);
    const [affLoading, setAffLoading] = useState(false);
    const [showAddAffiliate, setShowAddAffiliate] = useState(false);
    const [newAff, setNewAff] = useState({ name: '', email: '', phone: '', pix_key: '', commission_percent: '20', affiliate_code: '' });
    const [addAffLoading, setAddAffLoading] = useState(false);
    const [copiedCode, setCopiedCode] = useState('');
    const [expandedAff, setExpandedAff] = useState<string | null>(null);
    const [showPayoutModal, setShowPayoutModal] = useState<string | null>(null);
    const [payoutData, setPayoutData] = useState({ amount: '', period_start: '', period_end: '', pix_receipt: '' });
    const [payoutLoading, setPayoutLoading] = useState(false);
    const [timePeriod, setTimePeriod] = useState<'today' | 'yesterday' | '7d' | '30d' | 'month' | 'all'>('all');

    // Campaign state
    const [campaignSubject, setCampaignSubject] = useState('');
    const [campaignBody, setCampaignBody] = useState('');
    const [campaignAudience, setCampaignAudience] = useState<'all' | 'buyers' | 'non_buyers' | 'with_credits' | 'no_credits'>('all');
    const [campaignSending, setCampaignSending] = useState(false);
    const [campaignResult, setCampaignResult] = useState<any>(null);
    const [campaignUsers, setCampaignUsers] = useState<any>(null);
    const [campaignUsersLoading, setCampaignUsersLoading] = useState(false);

    // Trial purchases state
    const [trialPurchases, setTrialPurchases] = useState<any[]>([]);
    const [trialsLoading, setTrialsLoading] = useState(false);
    const [resendingId, setResendingId] = useState<string | null>(null);
    const [resendResults, setResendResults] = useState<Record<string, { ok: boolean; msg: string }>>({});

    // PIX Recovery state
    const [pendingPix, setPendingPix] = useState<any>(null);
    const [pixLoading, setPixLoading] = useState(false);
    const [sendingRecovery, setSendingRecovery] = useState<string | null>(null);
    const [sendingAllRecovery, setSendingAllRecovery] = useState(false);
    const [recoveryResult, setRecoveryResult] = useState<any>(null);

    // Fix body overflow for admin page scrolling
    useEffect(() => {
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    // Helper: always get a fresh token (refreshes if expired)
    const getFreshToken = async (): Promise<string> => {
        const { data } = await supabase.auth.refreshSession();
        if (data.session?.access_token) return data.session.access_token;
        // Fallback to cached session
        const { data: cached } = await supabase.auth.getSession();
        return cached.session?.access_token || '';
    };

    const handleLogin = async () => {
        setLoginLoading(true);
        setLoginError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            if (data.user?.email !== ADMIN_EMAIL) {
                await supabase.auth.signOut();
                throw new Error('Acesso negado. Você não é administrador.');
            }
            setIsAuthenticated(true);
            fetchStats(data.session?.access_token || '');
        } catch (err: any) {
            setLoginError(err.message || 'Erro ao fazer login');
        } finally {
            setLoginLoading(false);
        }
    };

    const fetchStats = async (token?: string) => {
        setLoading(true);
        setError('');
        try {
            const session = token || await getFreshToken();
            const res = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-stats`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session}`,
                        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
                    },
                }
            );
            if (!res.ok) throw new Error('Erro ao carregar dados');
            const data = await res.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setStats(null);
    };

    const fetchAffiliates = async () => {
        setAffLoading(true);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify({ action: 'list_affiliates' }),
            });
            const data = await res.json();
            setAffiliates(data.affiliates || []);
        } catch { setError('Erro ao carregar afiliados'); }
        setAffLoading(false);
    };

    const handleAddAffiliate = async () => {
        setAddAffLoading(true);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify({ action: 'add_affiliate', ...newAff, commission_percent: Number(newAff.commission_percent) }),
            });
            const data = await res.json();
            if (data.error) { setError(data.error); return; }
            setShowAddAffiliate(false);
            setNewAff({ name: '', email: '', phone: '', pix_key: '', commission_percent: '20', affiliate_code: '' });
            fetchAffiliates();
        } catch { setError('Erro ao adicionar afiliado'); }
        setAddAffLoading(false);
    };

    const handleRegisterPayout = async () => {
        if (!showPayoutModal || !payoutData.amount) return;
        setPayoutLoading(true);
        try {
            const session = await getFreshToken();
            await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify({ action: 'register_payout', affiliate_id: showPayoutModal, ...payoutData, amount: Number(payoutData.amount) }),
            });
            setShowPayoutModal(null);
            setPayoutData({ amount: '', period_start: '', period_end: '', pix_receipt: '' });
            fetchAffiliates();
        } catch { setError('Erro ao registrar pagamento'); }
        setPayoutLoading(false);
    };

    const copyAffLink = (code: string) => {
        navigator.clipboard.writeText(`https://www.lumiphotoia.online?aff=${code}`);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(''), 2000);
    };

    // Check existing session on mount
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (data.session?.user?.email === ADMIN_EMAIL) {
                setIsAuthenticated(true);
                fetchStats(data.session.access_token);
            }
        };
        checkSession();
    }, []);

    const fetchCampaignUsers = async () => {
        setCampaignUsersLoading(true);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify({ action: 'list_users_for_campaign' }),
            });
            const data = await res.json();
            setCampaignUsers(data);
        } catch { setError('Erro ao carregar usuários'); }
        setCampaignUsersLoading(false);
    };

    const sendCampaign = async () => {
        if (!campaignSubject || !campaignBody) {
            setError('Preencha o assunto e o corpo do email');
            return;
        }
        setCampaignSending(true);
        setCampaignResult(null);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify({
                    action: 'send_campaign',
                    subject: campaignSubject,
                    html_body: campaignBody,
                    audience: campaignAudience,
                }),
            });
            const data = await res.json();
            setCampaignResult(data);
            if (data.error) setError(data.error);
        } catch { setError('Erro ao enviar campanha'); }
        setCampaignSending(false);
    };

    const fetchTrialPurchases = async () => {
        setTrialsLoading(true);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}`, 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
                body: JSON.stringify({ action: 'list_trial_purchases' }),
            });
            const data = await res.json();
            if (data.error) console.error('fetchTrialPurchases error:', data.error);
            else setTrialPurchases(data.purchases || []);
        } catch (e) { console.error(e); }
        setTrialsLoading(false);
    };

    const fetchPendingPix = async () => {
        setPixLoading(true);
        setRecoveryResult(null);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify({ action: 'list_pending_pix' }),
            });
            const data = await res.json();
            setPendingPix(data);
        } catch { setError('Erro ao carregar PIX pendentes'); }
        setPixLoading(false);
    };

    const sendRecoveryEmail = async (paymentIds: string[], all = false) => {
        if (all) setSendingAllRecovery(true);
        else if (paymentIds.length === 1) setSendingRecovery(paymentIds[0]);
        setRecoveryResult(null);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}` },
                body: JSON.stringify(all ? { action: 'send_pix_recovery', send_all: true } : { action: 'send_pix_recovery', payment_ids: paymentIds }),
            });
            const data = await res.json();
            setRecoveryResult(data);
            if (!data.error) await fetchPendingPix();
        } catch { setError('Erro ao enviar lembrete'); }
        setSendingRecovery(null);
        setSendingAllRecovery(false);
    };

    const buildWhatsAppMessage = (p: any) => {
        const planLabels: Record<string, string> = { starter: 'Starter (10 Fotos)', essencial: 'Essencial (30 Fotos)', pro: 'Pro (80 Fotos)', premium: 'Premium (100 Fotos)' };
        const planName = planLabels[p.plan_type] || p.plan_type || 'LumiPhotoIA';
        return encodeURIComponent(`Oi! 😊 Vi que você iniciou a compra do pacote *${planName}* no LumiphotoIA, mas o PIX ficou pendente. Quer que eu te ajude a finalizar? 🎉\n\nAcesse: https://www.lumiphotoia.online`);
    };

    const resendTrialEmail = async (gen: any) => {
        setResendingId(gen.id);
        try {
            const session = await getFreshToken();
            const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-actions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session}`, 'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY },
                body: JSON.stringify({ action: 'resend_trial_email', generation_id: gen.id }),
            });
            const data = await res.json();
            setResendResults(prev => ({ ...prev, [gen.id]: { ok: !data.error, msg: data.error || `Email reenviado para ${gen.payer_email}!` } }));
            if (!data.error) await fetchTrialPurchases();
        } catch (e: any) {
            setResendResults(prev => ({ ...prev, [gen.id]: { ok: false, msg: String(e) } }));
        }
        setResendingId(null);
    };

    const CAMPAIGN_TEMPLATES = [
        {
            name: '🔥 Promoção Flash',
            subject: '🔥 Só HOJE: Fotos Profissionais com IA por preço especial!',
            body: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 30px;border-radius:16px">
<div style="text-align:center;margin-bottom:30px">
<h1 style="font-size:28px;margin:0;color:#f59e0b">🔥 PROMOÇÃO FLASH</h1>
<p style="color:#999;margin-top:8px">Só hoje — depois o preço volta ao normal</p>
</div>
<div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
<p style="font-size:20px;font-weight:700;margin:0">Suas fotos profissionais com IA</p>
<p style="color:#f59e0b;font-size:36px;font-weight:900;margin:12px 0">A partir de R$37</p>
<p style="color:#666">Resultado em segundos · Uso comercial · Sem sair de casa</p>
</div>
<div style="text-align:center">
<a href="https://www.lumiphotoia.online/checkout" style="display:inline-block;background:linear-gradient(to right,#f59e0b,#eab308);color:#000;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none;font-size:16px">QUERO MINHAS FOTOS →</a>
</div>
<p style="color:#555;font-size:12px;text-align:center;margin-top:30px">LumiphotoIA · Fotos Profissionais com Inteligência Artificial</p>
</div>`,
        },
        {
            name: '🎁 Bônus Surpresa',
            subject: '🎁 Presente: Ganhamos créditos BÔNUS para você!',
            body: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 30px;border-radius:16px">
<div style="text-align:center;margin-bottom:30px">
<h1 style="font-size:28px;margin:0">🎁 Presente Especial!</h1>
<p style="color:#999;margin-top:8px">Você foi selecionado(a)</p>
</div>
<div style="background:linear-gradient(135deg,#0d2818,#0a1f14);border:1px solid rgba(52,211,153,0.3);border-radius:12px;padding:24px;text-align:center;margin-bottom:24px">
<p style="font-size:48px;font-weight:900;color:#34d399;margin:0">+3</p>
<p style="font-size:18px;font-weight:700;margin:8px 0">Créditos Bônus</p>
<p style="color:#6ee7b7;font-size:14px">Adicionados automaticamente à sua conta</p>
</div>
<div style="text-align:center">
<a href="https://www.lumiphotoia.online" style="display:inline-block;background:linear-gradient(to right,#34d399,#10b981);color:#000;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none;font-size:16px">USAR MEUS CRÉDITOS →</a>
</div>
<p style="color:#555;font-size:12px;text-align:center;margin-top:30px">LumiphotoIA · team@lumiphotoia.online</p>
</div>`,
        },
        {
            name: '📸 Novidades do Estúdio',
            subject: '📸 Novidade: Novos estilos de foto no LumiphotoIA!',
            body: `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;background:#0a0a0a;color:#fff;padding:40px 30px;border-radius:16px">
<div style="text-align:center;margin-bottom:30px">
<h1 style="font-size:28px;margin:0">📸 Novidades no Estúdio!</h1>
<p style="color:#999;margin-top:8px">Acabamos de lançar novos estilos incríveis</p>
</div>
<div style="background:#1a1a1a;border:1px solid #333;border-radius:12px;padding:24px;margin-bottom:24px">
<p style="font-size:16px;margin:0 0 12px">✨ <strong>LinkedIn Profissional</strong> — Foto perfeita para seu perfil</p>
<p style="font-size:16px;margin:0 0 12px">🎬 <strong>TikTok Viral</strong> — Fotos com estética de tendência</p>
<p style="font-size:16px;margin:0">🌟 <strong>E muito mais...</strong> — Descubra todos os estilos</p>
</div>
<div style="text-align:center">
<a href="https://www.lumiphotoia.online" style="display:inline-block;background:linear-gradient(to right,#f59e0b,#eab308);color:#000;font-weight:800;padding:16px 48px;border-radius:12px;text-decoration:none;font-size:16px">EXPLORAR NOVIDADES →</a>
</div>
<p style="color:#555;font-size:12px;text-align:center;margin-top:30px">LumiphotoIA · Fotos com Inteligência Artificial</p>
</div>`,
        },
    ];

    // ==================== LOGIN SCREEN ====================
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6">
                <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/20 via-black to-purple-900/20 pointer-events-none" />
                <div className="w-full max-w-sm relative z-10">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
                            <Shield size={32} className="text-white" />
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Admin</h1>
                        <p className="text-white/40 text-sm mt-1">Painel de Controle LumiphotoIA</p>
                    </div>

                    <div className="bg-zinc-900/80 backdrop-blur-xl rounded-2xl p-6 border border-white/10 space-y-4">
                        {loginError && (
                            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{loginError}</div>
                        )}
                        <div>
                            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider font-bold">Email</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                                placeholder="admin@email.com"
                                className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-indigo-500/50 focus:outline-none text-white placeholder:text-white/20 text-sm"
                                onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                        </div>
                        <div>
                            <label className="block text-xs text-white/50 mb-1.5 uppercase tracking-wider font-bold">Senha</label>
                            <div className="relative">
                                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-indigo-500/50 focus:outline-none text-white placeholder:text-white/20 text-sm pr-12"
                                    onKeyDown={e => e.key === 'Enter' && handleLogin()} />
                                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        <button onClick={handleLogin} disabled={loginLoading}
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all text-white disabled:opacity-50">
                            {loginLoading ? <Loader2 size={18} className="animate-spin" /> : <><span>Entrar</span><ArrowRight size={16} /></>}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ==================== DASHBOARD ====================
    const fmt = (n: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(n);
    const fmtDate = (d: string) => {
        try { return new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }); }
        catch { return d; }
    };

    // Time period filter helper
    const getFilterDates = () => {
        const now = new Date();
        const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        switch (timePeriod) {
            case 'today':
                return { start: startOfToday, end: now };
            case 'yesterday': {
                const yesterday = new Date(startOfToday);
                yesterday.setDate(yesterday.getDate() - 1);
                return { start: yesterday, end: startOfToday };
            }
            case '7d': {
                const d = new Date(startOfToday);
                d.setDate(d.getDate() - 7);
                return { start: d, end: now };
            }
            case '30d': {
                const d = new Date(startOfToday);
                d.setDate(d.getDate() - 30);
                return { start: d, end: now };
            }
            case 'month': {
                const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
                return { start: firstDay, end: now };
            }
            default:
                return null;
        }
    };

    const filterDates = getFilterDates();

    // Filter stats by selected period
    const filteredRecentSales = stats?.recentSales?.filter((s: any) => {
        if (!filterDates) return true;
        const d = new Date(s.date);
        return d >= filterDates.start && d <= filterDates.end;
    }) || [];

    const filteredRevenue = filteredRecentSales.reduce((sum: number, s: any) => sum + Number(s.amount || 0), 0);
    const filteredSalesCount = filteredRecentSales.length;
    const filteredAvgTicket = filteredSalesCount > 0 ? filteredRevenue / filteredSalesCount : 0;

    // For 'all' period, use original stats values
    const displayRevenue = timePeriod === 'all' ? (stats?.overview.totalRevenue || 0) : filteredRevenue;
    const displaySalesCount = timePeriod === 'all' ? (stats?.overview.totalSales || 0) : filteredSalesCount;
    const displayAvgTicket = timePeriod === 'all' ? (stats?.overview.avgTicket || 0) : Math.round(filteredAvgTicket * 100) / 100;

    // Chart always shows all 30 days (it's a "30 dias" overview chart, not affected by period filter)
    const salesDays = stats ? Object.entries(stats.salesByDay) : [];
    const maxDayRevenue = Math.max(...salesDays.map(([, v]) => (v as any).revenue), 1);

    const periodLabels: Record<string, string> = {
        today: 'Hoje',
        yesterday: 'Ontem',
        '7d': 'Últimos 7 dias',
        '30d': 'Últimos 30 dias',
        month: 'Este mês',
        all: 'Todo período'
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-white/5 px-4 md:px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <BarChart3 size={16} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-wider">Dashboard Admin</h1>
                        <p className="text-[10px] text-white/30">LumiphotoIA</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={() => adminTab === 'dashboard' ? fetchStats() : fetchAffiliates()} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" title="Atualizar dados">
                        <RefreshCw size={16} className={`text-white/60 ${loading || affLoading ? 'animate-spin' : ''}`} />
                    </button>
                    <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 bg-red-500/10 rounded-lg border border-red-500/20 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all">
                        <LogOut size={14} /> Sair
                    </button>
                </div>
            </header>

            {/* Tab Navigation + Time Filter */}
            <div className="px-4 md:px-8 pt-4 max-w-7xl mx-auto flex flex-wrap items-center gap-2">
                <button onClick={() => setAdminTab('dashboard')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminTab === 'dashboard' ? 'bg-indigo-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
                    📊 Dashboard
                </button>
                <button onClick={() => { setAdminTab('affiliates'); fetchAffiliates(); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminTab === 'affiliates' ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
                    🤝 Afiliados
                </button>
                <button onClick={() => { setAdminTab('campaigns'); fetchCampaignUsers(); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminTab === 'campaigns' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
                    📧 Campanhas
                </button>
                <button onClick={() => setAdminTab('trial_metrics')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminTab === 'trial_metrics' ? 'bg-cyan-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
                    📊 Métricas Trial
                </button>
                <button onClick={() => { setAdminTab('trials'); fetchTrialPurchases(); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminTab === 'trials' ? 'bg-amber-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
                    📸 Compras Trial
                </button>
                <button onClick={() => { setAdminTab('recovery'); fetchPendingPix(); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${adminTab === 'recovery' ? 'bg-red-500 text-white' : 'bg-white/5 text-white/50 hover:text-white/80'}`}>
                    🔄 Recuperar Vendas
                </button>

                {/* Time Period Filter */}
                {(adminTab === 'dashboard' || adminTab === 'trial_metrics') && (
                    <div className="flex items-center gap-1.5 ml-auto bg-zinc-900/70 rounded-xl p-1 border border-white/5">
                        <Calendar size={14} className="text-white/30 ml-2" />
                        {(['today', 'yesterday', '7d', '30d', 'month', 'all'] as const).map(period => (
                            <button
                                key={period}
                                onClick={() => setTimePeriod(period)}
                                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap ${timePeriod === period
                                    ? 'bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.3)]'
                                    : 'text-white/40 hover:text-white/70 hover:bg-white/5'
                                    }`}
                            >
                                {periodLabels[period]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <main className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
                {error && <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>}

                {adminTab === 'trial_metrics' ? (() => {
                    /* ==================== TRIAL METRICS TAB ==================== */
                    const rawTrials = stats?.trialRawData || [];
                    // Filter by time period (using local timezone, not UTC)
                    // Helper: format Date as 'YYYY-MM-DD' in local timezone (e.g. BRT/UTC-3)
                    const toLocalDateStr = (d: Date) => {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, '0');
                        const dd = String(d.getDate()).padStart(2, '0');
                        return `${yyyy}-${mm}-${dd}`;
                    };
                    const nowDate = new Date();
                    const todayStr = toLocalDateStr(nowDate);
                    const yesterdayDate = new Date(nowDate); yesterdayDate.setDate(yesterdayDate.getDate() - 1);
                    const yesterdayStr = toLocalDateStr(yesterdayDate);
                    const d7 = new Date(nowDate); d7.setDate(d7.getDate() - 7);
                    const d30 = new Date(nowDate); d30.setDate(d30.getDate() - 30);
                    const monthStart = new Date(nowDate.getFullYear(), nowDate.getMonth(), 1);

                    const filtered = rawTrials.filter((t: any) => {
                        if (timePeriod === 'all') return true;
                        const tDate = new Date(t.created_at);
                        // Convert record date to local timezone string for day comparison
                        const tDay = toLocalDateStr(tDate);
                        if (timePeriod === 'today') return tDay === todayStr;
                        if (timePeriod === 'yesterday') return tDay === yesterdayStr;
                        if (timePeriod === '7d') return tDate >= d7;
                        if (timePeriod === '30d') return tDate >= d30;
                        if (timePeriod === 'month') return tDate >= monthStart;
                        return true;
                    });

                    // Compute metrics from filtered data
                    const total = filtered.length;
                    const uniqueIps = new Set(filtered.map((t: any) => t.ip_hash).filter(Boolean)).size;
                    const uniqueSessions = new Set(filtered.map((t: any) => t.session_id).filter(Boolean)).size;
                    const byStatus: Record<string, number> = {};
                    const byNiche: Record<string, number> = {};
                    const byDay: Record<string, number> = {};

                    filtered.forEach((t: any) => {
                        const status = t.status || 'unknown';
                        byStatus[status] = (byStatus[status] || 0) + 1;
                        const niche = t.delivery_style || 'delivery';
                        // Normalize to page name
                        const page = (niche === 'studio' || niche === 'Estúdio Escuro Premium') ? 'ensaio_profissional' : niche;
                        byNiche[page] = (byNiche[page] || 0) + 1;
                        const day = toLocalDateStr(new Date(t.created_at));
                        byDay[day] = (byDay[day] || 0) + 1;
                    });

                    const paidCount = (byStatus['paid_single'] || 0) + (byStatus['paid_pack'] || 0);
                    const conversionRate = total > 0 ? Math.round((paidCount / total) * 1000) / 10 : 0;
                    const todayCount = byDay[todayStr] || 0;

                    // Build chart data (last 30 days)
                    const chartDays: Record<string, number> = {};
                    for (let i = 29; i >= 0; i--) {
                        const dd = new Date(nowDate); dd.setDate(dd.getDate() - i);
                        chartDays[toLocalDateStr(dd)] = 0;
                    }
                    rawTrials.forEach((t: any) => {
                        const day = toLocalDateStr(new Date(t.created_at));
                        if (chartDays[day] !== undefined) chartDays[day]++;
                    });

                    // Page config (maps delivery_style → source page)
                    const nicheConfig: Record<string, { emoji: string; label: string; color: string; barColor: string }> = {
                        delivery: { emoji: '🍔', label: 'Página Delivery', color: 'text-orange-400', barColor: 'bg-orange-500' },
                        ensaio_profissional: { emoji: '📸', label: 'Página Ensaios', color: 'text-indigo-400', barColor: 'bg-indigo-500' },
                        pet: { emoji: '🐾', label: 'Página Pet', color: 'text-pink-400', barColor: 'bg-pink-500' },
                        estetica: { emoji: '💄', label: 'Página Estética', color: 'text-rose-400', barColor: 'bg-rose-500' },
                        aniversario: { emoji: '🎂', label: 'Página Aniversário', color: 'text-amber-400', barColor: 'bg-amber-500' },
                    };

                    return (
                        <div className="space-y-6">
                            <h2 className="text-lg font-bold flex items-center gap-2"><BarChart3 size={20} className="text-cyan-400" /> Métricas de Trial Gratuito {timePeriod !== 'all' && <span className="text-sm font-normal text-white/40">({periodLabels[timePeriod]})</span>}</h2>

                            {total === 0 ? (
                                <div className="text-center py-16 text-white/40">
                                    <Camera size={48} className="mx-auto mb-4 opacity-50" />
                                    <p className="text-lg">Nenhuma geração trial {timePeriod !== 'all' ? 'neste período' : 'registrada ainda'}</p>
                                </div>
                            ) : (
                                <>
                                    {/* KPI Cards */}
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                            <Camera size={20} className="text-cyan-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{total}</p>
                                            <p className="text-xs text-white/50 font-bold mt-1">Total Gerações</p>
                                        </div>
                                        <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                            <Users size={20} className="text-blue-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{uniqueIps}</p>
                                            <p className="text-xs text-white/50 font-bold mt-1">IPs Únicos</p>
                                            <p className="text-[10px] text-white/30 mt-0.5">{uniqueSessions} sessões</p>
                                        </div>
                                        <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                            <TrendingUp size={20} className="text-emerald-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{conversionRate}%</p>
                                            <p className="text-xs text-white/50 font-bold mt-1">Conversão Trial</p>
                                            <p className="text-[10px] text-white/30 mt-0.5">{paidCount} pagos</p>
                                        </div>
                                        <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                            <Zap size={20} className="text-amber-400 mb-2" />
                                            <p className="text-2xl font-black text-white">{todayCount}</p>
                                            <p className="text-xs text-white/50 font-bold mt-1">Hoje</p>
                                            <p className="text-[10px] text-white/30 mt-0.5">gerações hoje</p>
                                        </div>
                                    </div>

                                    {/* Status Breakdown */}
                                    <div>
                                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-3">Por Status</h3>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {Object.entries(byStatus).map(([status, count]) => {
                                                const statusColors: Record<string, string> = {
                                                    preview: 'bg-zinc-500/20 border-zinc-500/30 text-zinc-400',
                                                    paid_single: 'bg-blue-500/20 border-blue-500/30 text-blue-400',
                                                    paid_pack: 'bg-purple-500/20 border-purple-500/30 text-purple-400',
                                                    expired: 'bg-red-500/20 border-red-500/30 text-red-400',
                                                };
                                                const statusLabels: Record<string, string> = {
                                                    preview: '👁️ Preview',
                                                    paid_single: '💳 Pagou 1 Foto',
                                                    paid_pack: '💎 Pagou Pack',
                                                    expired: '⏰ Expirado',
                                                };
                                                return (
                                                    <div key={status} className={`p-4 rounded-xl border ${statusColors[status] || 'bg-white/5 border-white/10 text-white/60'}`}>
                                                        <p className="text-2xl font-black">{count}</p>
                                                        <p className="text-xs font-bold mt-1">{statusLabels[status] || status}</p>
                                                        <p className="text-[10px] opacity-60 mt-0.5">{total > 0 ? Math.round((Number(count) / total) * 100) : 0}%</p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Per Page/Niche Breakdown with bars */}
                                    <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Gerações por Página</h3>
                                        <div className="space-y-3">
                                            {Object.entries(byNiche)
                                                .sort(([, a], [, b]) => (b as number) - (a as number))
                                                .map(([niche, count]) => {
                                                    const cfg = nicheConfig[niche] || { emoji: '📷', label: niche, color: 'text-white/60', barColor: 'bg-white/30' };
                                                    const pct = total > 0 ? Math.round((Number(count) / total) * 100) : 0;
                                                    return (
                                                        <div key={niche}>
                                                            <div className="flex items-center justify-between mb-1">
                                                                <span className={`text-sm font-bold ${cfg.color}`}>{cfg.emoji} {cfg.label}</span>
                                                                <span className="text-sm font-bold text-white/60">{count} <span className="text-[10px] text-white/30">({pct}%)</span></span>
                                                            </div>
                                                            <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                                                                <div className={`h-full rounded-full ${cfg.barColor} transition-all duration-500`} style={{ width: `${pct}%` }} />
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </div>

                                    {/* Daily Chart */}
                                    <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Gerações por Dia (últimos 30 dias)</h3>
                                        <div className="flex items-end gap-[3px] h-32">
                                            {Object.entries(chartDays).map(([day, count]) => {
                                                const maxTrialDay = Math.max(...Object.values(chartDays).map(Number), 1);
                                                const height = (Number(count) / maxTrialDay) * 100;
                                                const shortDay = day.slice(5);
                                                return (
                                                    <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
                                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 rounded text-[9px] text-white/80 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                                            {shortDay}: {count}
                                                        </div>
                                                        <div
                                                            className="w-full rounded-t bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-all"
                                                            style={{ height: `${Math.max(height, Number(count) > 0 ? 4 : 1)}%` }}
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <span className="text-[9px] text-white/20">{Object.keys(chartDays)[0]?.slice(5)}</span>
                                            <span className="text-[9px] text-white/20">Hoje</span>
                                        </div>
                                    </div>

                                    {/* Recent Trials Table */}
                                    <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">Últimas Gerações {timePeriod !== 'all' && `(${periodLabels[timePeriod]})`}</h3>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-white/30 text-[10px] uppercase tracking-wider">
                                                        <th className="text-left pb-3 pr-4">IP Hash</th>
                                                        <th className="text-left pb-3 pr-4">Status</th>
                                                        <th className="text-left pb-3 pr-4">Página</th>
                                                        <th className="text-left pb-3">Data</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-white/5">
                                                    {filtered.slice(0, 50).map((t: any) => {
                                                        const statusBadge: Record<string, string> = {
                                                            preview: 'bg-zinc-500/20 text-zinc-400',
                                                            paid_single: 'bg-blue-500/20 text-blue-400',
                                                            paid_pack: 'bg-purple-500/20 text-purple-400',
                                                            expired: 'bg-red-500/20 text-red-400',
                                                        };
                                                        const pageKey = (t.delivery_style === 'studio' || t.delivery_style === 'Estúdio Escuro Premium') ? 'ensaio_profissional' : (t.delivery_style || 'delivery');
                                                        const cfg = nicheConfig[pageKey] || { emoji: '📷', label: t.delivery_style, color: '', barColor: '' };
                                                        return (
                                                            <tr key={t.id} className="hover:bg-white/[0.02]">
                                                                <td className="py-2.5 pr-4 text-white/50 font-mono text-xs">{t.ip_hash}</td>
                                                                <td className="py-2.5 pr-4">
                                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusBadge[t.status] || 'bg-white/10 text-white/50'}`}>
                                                                        {t.status}
                                                                    </span>
                                                                </td>
                                                                <td className="py-2.5 pr-4 text-xs">{cfg.emoji} {cfg.label}</td>
                                                                <td className="py-2.5 text-white/40 text-xs">{fmtDate(t.created_at)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })() : adminTab === 'trials' ? (
                    /* ==================== TRIAL PURCHASES TAB ==================== */
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Camera size={20} className="text-amber-400" /> Compras Trial — Entrega de Fotos HD</h2>
                            <button onClick={fetchTrialPurchases} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" title="Atualizar">
                                <RefreshCw size={16} className={`text-white/60 ${trialsLoading ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {trialsLoading ? (
                            <div className="flex items-center justify-center py-16"><Loader2 size={32} className="animate-spin text-amber-500" /></div>
                        ) : trialPurchases.length === 0 ? (
                            <div className="text-center py-16 text-white/40">
                                <Camera size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Nenhuma compra trial ainda</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {trialPurchases.map((gen: any) => {
                                    const photos: any[] = gen.purchased_photo_urls || [];
                                    const hdPaths: any[] = gen.hd_storage_paths || [];
                                    const result = resendResults[gen.id];
                                    const emailOk = !!gen.email_sent_at && !gen.last_email_error;
                                    return (
                                        <div key={gen.id} className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5 space-y-3">
                                            {/* Header */}
                                            <div className="flex items-start justify-between flex-wrap gap-3">
                                                <div>
                                                    <p className="font-bold text-white text-sm">{gen.payer_email}</p>
                                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gen.status === 'paid_single' ? 'bg-blue-500/20 text-blue-400' : 'bg-purple-500/20 text-purple-400'}`}>
                                                            {gen.status === 'paid_single' ? '1 Foto HD' : 'Pack 3 Fotos'}
                                                        </span>
                                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emailOk ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                            {emailOk ? `✅ Email enviado ${gen.email_sent_count}x` : gen.last_email_error ? '❌ Erro no email' : '⏳ Email pendente'}
                                                        </span>
                                                        <span className="text-[10px] text-white/30">{fmtDate(gen.created_at)}</span>
                                                    </div>
                                                    {gen.last_email_error && (
                                                        <p className="text-red-400 text-[10px] mt-1 font-mono bg-red-500/5 rounded px-2 py-1">{gen.last_email_error}</p>
                                                    )}
                                                </div>
                                                {/* Resend Email Button */}
                                                <button
                                                    onClick={() => resendTrialEmail(gen)}
                                                    disabled={resendingId === gen.id}
                                                    className="flex items-center gap-2 px-4 py-2 bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded-xl text-xs font-bold hover:bg-amber-500/30 transition-all disabled:opacity-50"
                                                >
                                                    {resendingId === gen.id ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                                                    Reenviar Email
                                                </button>
                                            </div>

                                            {/* Resend result */}
                                            {result && (
                                                <div className={`text-xs px-3 py-2 rounded-xl ${result.ok ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                                                    {result.msg}
                                                </div>
                                            )}

                                            {/* Photo Links */}
                                            {photos.length > 0 ? (
                                                <div className="space-y-1.5">
                                                    <p className="text-[10px] text-white/30 uppercase tracking-wider font-bold">Fotos disponíveis ({photos.length} links — expiram em 90 dias)</p>
                                                    {photos.map((photo: any, i: number) => (
                                                        <div key={i} className="flex items-center justify-between gap-2 p-2 bg-white/5 rounded-lg">
                                                            <span className="text-xs text-white/60">{photo.label || `Foto ${i + 1}`}</span>
                                                            <div className="flex gap-2">
                                                                <a
                                                                    href={photo.url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="px-3 py-1 bg-amber-500 text-black rounded-lg text-xs font-bold hover:bg-amber-400 transition-colors"
                                                                >
                                                                    Baixar HD
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : hdPaths.length > 0 ? (
                                                <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl">
                                                    <p className="text-orange-400 text-xs font-bold">⚠️ Signed URLs não foram gerados ainda</p>
                                                    <p className="text-white/40 text-[10px] mt-1">{hdPaths.length} fotos HD existem no Storage. Clique em "Reenviar Email" para gerar URLs e reenviar.</p>
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                                    <p className="text-red-400 text-xs">⚠️ Sem fotos HD no Storage para esta geração</p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                ) : adminTab === 'recovery' ? (
                    /* ==================== PIX RECOVERY TAB ==================== */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <h2 className="text-lg font-bold flex items-center gap-2"><RefreshCw size={20} className="text-red-400" /> Recuperação de Vendas — PIX Pendentes</h2>
                            <div className="flex items-center gap-2">
                                <button onClick={fetchPendingPix} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" title="Atualizar">
                                    <RefreshCw size={16} className={`text-white/60 ${pixLoading ? 'animate-spin' : ''}`} />
                                </button>
                                {pendingPix?.pending?.length > 0 && (
                                    <button
                                        onClick={() => sendRecoveryEmail([], true)}
                                        disabled={sendingAllRecovery}
                                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 rounded-xl text-sm font-bold hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all disabled:opacity-50"
                                    >
                                        {sendingAllRecovery ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                                        Enviar Todos
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Recovery Result Toast */}
                        {recoveryResult && (
                            <div className={`p-4 rounded-xl border text-sm ${recoveryResult.error ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'}`}>
                                {recoveryResult.error
                                    ? `❌ Erro: ${recoveryResult.error}`
                                    : `✅ ${recoveryResult.sent} email(s) enviado(s)${recoveryResult.skipped > 0 ? ` · ${recoveryResult.skipped} ignorado(s) (cooldown 6h)` : ''}${recoveryResult.failed > 0 ? ` · ${recoveryResult.failed} falha(s)` : ''}`
                                }
                                {recoveryResult.message && <span className="block mt-1 text-white/50">{recoveryResult.message}</span>}
                            </div>
                        )}

                        {pixLoading ? (
                            <div className="flex items-center justify-center py-16"><Loader2 size={32} className="animate-spin text-red-500" /></div>
                        ) : !pendingPix ? (
                            <div className="text-center py-16 text-white/40">
                                <RefreshCw size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Carregue os dados para ver PIX pendentes</p>
                            </div>
                        ) : pendingPix.pending?.length === 0 ? (
                            <div className="text-center py-16 text-white/40">
                                <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Nenhum PIX pendente (1h–48h) 🎉</p>
                                <p className="text-sm mt-2">Todos os pagamentos foram processados</p>
                            </div>
                        ) : (
                            <>
                                {/* KPI Cards */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-5">
                                        <CreditCard size={20} className="text-red-400 mb-2" />
                                        <p className="text-2xl font-black text-white">{pendingPix.summary.total}</p>
                                        <p className="text-xs text-white/50 font-bold mt-1">PIX Pendentes</p>
                                    </div>
                                    <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5">
                                        <DollarSign size={20} className="text-amber-400 mb-2" />
                                        <p className="text-2xl font-black text-white">{fmt(pendingPix.summary.totalValue)}</p>
                                        <p className="text-xs text-white/50 font-bold mt-1">Valor em Risco</p>
                                    </div>
                                    <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-5">
                                        <MessageSquare size={20} className="text-green-400 mb-2" />
                                        <p className="text-2xl font-black text-white">{pendingPix.summary.withWhatsapp}</p>
                                        <p className="text-xs text-white/50 font-bold mt-1">Com WhatsApp</p>
                                    </div>
                                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-5">
                                        <Mail size={20} className="text-blue-400 mb-2" />
                                        <p className="text-2xl font-black text-white">{pendingPix.summary.alreadySent}</p>
                                        <p className="text-xs text-white/50 font-bold mt-1">Emails Enviados</p>
                                    </div>
                                </div>

                                {/* Pending PIX Table */}
                                <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                    <h3 className="text-sm font-bold text-white/60 uppercase tracking-wider mb-4">PIX Pendentes (1h – 48h)</h3>
                                    <div className="space-y-3">
                                        {pendingPix.pending.map((p: any) => {
                                            const isSending = sendingRecovery === p.id;
                                            const alreadySent = p.recovery_email_count > 0;
                                            const whatsappClean = p.whatsapp?.replace(/\D/g, '');
                                            return (
                                                <div key={p.id} className="bg-white/[0.03] rounded-xl p-4 border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-start justify-between flex-wrap gap-3">
                                                        <div className="flex-1 min-w-0">
                                                            <p className="font-bold text-white text-sm truncate">{p.payer_email}</p>
                                                            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">{p.plan_type}</span>
                                                                <span className="text-xs text-white/40">{fmt(Number(p.amount || 0))}</span>
                                                                <span className="text-xs text-red-400 font-bold">⏰ há {p.time_ago}</span>
                                                                {alreadySent && (
                                                                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 font-bold">
                                                                        📧 {p.recovery_email_count}x enviado
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {/* Send Email Button */}
                                                            <button
                                                                onClick={() => sendRecoveryEmail([p.id])}
                                                                disabled={isSending}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-bold transition-all disabled:opacity-50"
                                                                title="Enviar email de recuperação"
                                                            >
                                                                {isSending ? <Loader2 size={12} className="animate-spin" /> : <Mail size={12} />}
                                                                Email
                                                            </button>
                                                            {/* WhatsApp Button */}
                                                            {whatsappClean ? (
                                                                <a
                                                                    href={`https://wa.me/55${whatsappClean}?text=${buildWhatsAppMessage(p)}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/20 hover:bg-green-500/30 border border-green-500/30 rounded-lg text-green-400 text-xs font-bold transition-all"
                                                                    title="Abrir WhatsApp com mensagem pronta"
                                                                >
                                                                    <MessageSquare size={12} />
                                                                    WhatsApp
                                                                </a>
                                                            ) : (
                                                                <span className="text-[10px] text-white/20 px-2">Sem WhatsApp</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : adminTab === 'campaigns' ? (
                    /* ==================== CAMPAIGNS TAB ==================== */
                    <div className="space-y-6">
                        <h2 className="text-lg font-bold flex items-center gap-2"><Mail size={20} className="text-purple-400" /> Email Marketing</h2>

                        {/* Audience Summary */}
                        {campaignUsers?.summary && (
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-white">{campaignUsers.summary.totalUsers}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Total Usuários</p>
                                </div>
                                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-white">{campaignUsers.summary.totalBuyers}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Compradores</p>
                                </div>
                                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-white">{campaignUsers.summary.totalNonBuyers}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Não Compraram</p>
                                </div>
                                <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-white">{campaignUsers.summary.totalWithCredits}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Com Créditos</p>
                                </div>
                                <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3 text-center">
                                    <p className="text-2xl font-black text-white">{campaignUsers.summary.totalWithWhatsapp}</p>
                                    <p className="text-[10px] text-white/40 uppercase tracking-wider font-bold">Com WhatsApp</p>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Left: Composer */}
                            <div className="lg:col-span-2 space-y-4">
                                <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-6 space-y-4">
                                    <h3 className="text-sm font-bold text-white/80 flex items-center gap-2"><FileText size={16} className="text-purple-400" /> Compor Email</h3>

                                    {/* Audience Selector */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider font-bold">Público Alvo</label>
                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                            {[
                                                { id: 'all' as const, label: 'Todos', icon: '👥', count: campaignUsers?.summary?.totalUsers },
                                                { id: 'buyers' as const, label: 'Compradores', icon: '💳', count: campaignUsers?.summary?.totalBuyers },
                                                { id: 'non_buyers' as const, label: 'Não comprou', icon: '🎯', count: campaignUsers?.summary?.totalNonBuyers },
                                                { id: 'with_credits' as const, label: 'Com créditos', icon: '⭐', count: campaignUsers?.summary?.totalWithCredits },
                                                { id: 'no_credits' as const, label: 'Sem créditos', icon: '🔄', count: campaignUsers?.summary?.totalUsers - (campaignUsers?.summary?.totalWithCredits || 0) },
                                            ].map(opt => (
                                                <button
                                                    key={opt.id}
                                                    onClick={() => setCampaignAudience(opt.id)}
                                                    className={`p-2.5 rounded-xl text-xs font-bold transition-all border ${campaignAudience === opt.id
                                                        ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                                                        : 'bg-white/5 border-white/5 text-white/40 hover:text-white/70'
                                                        }`}
                                                >
                                                    <span className="text-lg block mb-1">{opt.icon}</span>
                                                    {opt.label}
                                                    {opt.count !== undefined && <span className="block text-[10px] text-white/30 mt-0.5">{opt.count} emails</span>}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-bold">Assunto do Email</label>
                                        <input
                                            value={campaignSubject}
                                            onChange={e => setCampaignSubject(e.target.value)}
                                            placeholder="Ex: 🔥 Só HOJE: Fotos Profissionais com 50% OFF!"
                                            className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none text-white text-sm placeholder:text-white/20"
                                        />
                                    </div>

                                    {/* Body (HTML) */}
                                    <div>
                                        <label className="block text-xs text-white/40 mb-1.5 uppercase tracking-wider font-bold">Corpo do Email (HTML)</label>
                                        <textarea
                                            value={campaignBody}
                                            onChange={e => setCampaignBody(e.target.value)}
                                            placeholder="Cole aqui o HTML do email ou selecione um template ao lado..."
                                            rows={12}
                                            className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-purple-500/50 focus:outline-none text-white text-sm placeholder:text-white/20 font-mono text-xs resize-y"
                                        />
                                    </div>

                                    {/* Send Button */}
                                    <button
                                        onClick={sendCampaign}
                                        disabled={campaignSending || !campaignSubject || !campaignBody}
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50 text-white"
                                    >
                                        {campaignSending ? (
                                            <><Loader2 size={18} className="animate-spin" /> Enviando...</>
                                        ) : (
                                            <><Send size={18} /> Enviar Campanha para {campaignAudience === 'all' ? 'Todos' : campaignAudience === 'buyers' ? 'Compradores' : campaignAudience === 'non_buyers' ? 'Não Compraram' : campaignAudience === 'with_credits' ? 'Com Créditos' : 'Sem Créditos'}</>
                                        )}
                                    </button>

                                    {/* Result */}
                                    {campaignResult && (
                                        <div className={`p-4 rounded-xl border ${campaignResult.success ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
                                            {campaignResult.success ? (
                                                <div>
                                                    <p className="text-emerald-400 font-bold text-sm flex items-center gap-2"><Check size={16} /> Campanha enviada!</p>
                                                    <p className="text-white/50 text-xs mt-1">✅ {campaignResult.sent} enviados · ❌ {campaignResult.failed} falharam · Total: {campaignResult.total}</p>
                                                    {campaignResult.errors?.length > 0 && (
                                                        <div className="mt-2 text-red-400/70 text-[10px]">
                                                            {campaignResult.errors.map((err: string, i: number) => <p key={i}>{err}</p>)}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-red-400 text-sm">{campaignResult.error}</p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Right: Templates */}
                            <div className="space-y-4">
                                <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5 space-y-3">
                                    <h3 className="text-sm font-bold text-white/80 flex items-center gap-2"><Target size={16} className="text-amber-400" /> Templates Prontos</h3>
                                    <p className="text-[10px] text-white/30">Clique para usar um template pré-formatado</p>

                                    {CAMPAIGN_TEMPLATES.map((tpl, i) => (
                                        <button
                                            key={i}
                                            onClick={() => {
                                                setCampaignSubject(tpl.subject);
                                                setCampaignBody(tpl.body);
                                            }}
                                            className="w-full text-left p-3 rounded-xl bg-white/5 border border-white/5 hover:border-purple-500/30 hover:bg-purple-500/5 transition-all"
                                        >
                                            <p className="text-sm font-bold text-white/80">{tpl.name}</p>
                                            <p className="text-[10px] text-white/30 mt-0.5 truncate">{tpl.subject}</p>
                                        </button>
                                    ))}
                                </div>

                                {/* Contacts with WhatsApp */}
                                {campaignUsers?.users && (
                                    <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5 space-y-3">
                                        <h3 className="text-sm font-bold text-white/80 flex items-center gap-2"><MessageSquare size={16} className="text-green-400" /> Contatos c/ WhatsApp</h3>
                                        <div className="max-h-60 overflow-y-auto space-y-1.5">
                                            {campaignUsers.users.filter((u: any) => u.whatsapp).length === 0 ? (
                                                <p className="text-white/30 text-xs">Nenhum contato com WhatsApp ainda</p>
                                            ) : (
                                                campaignUsers.users.filter((u: any) => u.whatsapp).map((u: any) => (
                                                    <div key={u.id} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
                                                        <div>
                                                            <p className="text-xs text-white/80 truncate max-w-[140px]">{u.email}</p>
                                                            <p className="text-[10px] text-green-400 font-mono">{u.whatsapp}</p>
                                                        </div>
                                                        <a
                                                            href={`https://wa.me/55${u.whatsapp.replace(/\D/g, '')}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="p-1.5 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                                                        >
                                                            <MessageSquare size={12} className="text-green-400" />
                                                        </a>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ) : adminTab === 'affiliates' ? (
                    /* ==================== AFFILIATES TAB ==================== */
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2"><Users size={20} className="text-emerald-400" /> Gestão de Afiliados</h2>
                            <button onClick={() => setShowAddAffiliate(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all">
                                <UserPlus size={16} /> Adicionar Afiliado
                            </button>
                        </div>

                        {/* Add Affiliate Modal */}
                        {showAddAffiliate && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold flex items-center gap-2"><UserPlus size={18} className="text-emerald-400" /> Novo Afiliado</h3>
                                        <button onClick={() => setShowAddAffiliate(false)} className="text-white/40 hover:text-white"><X size={20} /></button>
                                    </div>
                                    <input value={newAff.name} onChange={e => setNewAff({ ...newAff, name: e.target.value })} placeholder="Nome completo" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                    <input value={newAff.email} onChange={e => setNewAff({ ...newAff, email: e.target.value })} placeholder="Email" type="email" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                    <input value={newAff.phone} onChange={e => setNewAff({ ...newAff, phone: e.target.value })} placeholder="Telefone / WhatsApp" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                    <input value={newAff.pix_key} onChange={e => setNewAff({ ...newAff, pix_key: e.target.value })} placeholder="Chave PIX" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <input value={newAff.affiliate_code} onChange={e => setNewAff({ ...newAff, affiliate_code: e.target.value })} placeholder="Código (ex: joao2026)" className="px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                        <div className="relative">
                                            <input value={newAff.commission_percent} onChange={e => setNewAff({ ...newAff, commission_percent: e.target.value })} placeholder="Comissão %" type="number" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-emerald-500/50 focus:outline-none text-white text-sm placeholder:text-white/30 pr-10" />
                                            <Percent size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30" />
                                        </div>
                                    </div>
                                    <button onClick={handleAddAffiliate} disabled={addAffLoading || !newAff.name || !newAff.email} className="w-full py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all disabled:opacity-50">
                                        {addAffLoading ? <Loader2 size={18} className="animate-spin" /> : <>Cadastrar Afiliado</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Payout Modal */}
                        {showPayoutModal && (
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                                <div className="bg-zinc-900 rounded-2xl border border-white/10 p-6 w-full max-w-md space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold flex items-center gap-2"><Wallet size={18} className="text-amber-400" /> Registrar Pagamento PIX</h3>
                                        <button onClick={() => setShowPayoutModal(null)} className="text-white/40 hover:text-white"><X size={20} /></button>
                                    </div>
                                    <input value={payoutData.amount} onChange={e => setPayoutData({ ...payoutData, amount: e.target.value })} placeholder="Valor pago (R$)" type="number" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-wider">Período Início</label>
                                            <input value={payoutData.period_start} onChange={e => setPayoutData({ ...payoutData, period_start: e.target.value })} type="date" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none text-white text-sm" />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-white/40 uppercase tracking-wider">Período Fim</label>
                                            <input value={payoutData.period_end} onChange={e => setPayoutData({ ...payoutData, period_end: e.target.value })} type="date" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none text-white text-sm" />
                                        </div>
                                    </div>
                                    <input value={payoutData.pix_receipt} onChange={e => setPayoutData({ ...payoutData, pix_receipt: e.target.value })} placeholder="Comprovante / Observação" className="w-full px-4 py-3 bg-white/5 rounded-xl border border-white/10 focus:border-amber-500/50 focus:outline-none text-white text-sm placeholder:text-white/30" />
                                    <button onClick={handleRegisterPayout} disabled={payoutLoading || !payoutData.amount} className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all disabled:opacity-50 text-white">
                                        {payoutLoading ? <Loader2 size={18} className="animate-spin" /> : <>Confirmar Pagamento</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Affiliates List */}
                        {affLoading ? (
                            <div className="flex items-center justify-center py-16"><Loader2 size={32} className="animate-spin text-emerald-500" /></div>
                        ) : affiliates.length === 0 ? (
                            <div className="text-center py-16 text-white/40">
                                <Users size={48} className="mx-auto mb-4 opacity-50" />
                                <p className="text-lg">Nenhum afiliado cadastrado</p>
                                <p className="text-sm">Clique em "Adicionar Afiliado" para começar</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {affiliates.map((aff: any) => (
                                    <div key={aff.id} className="bg-zinc-900/60 rounded-2xl border border-white/5 overflow-hidden">
                                        <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/[0.02]" onClick={() => setExpandedAff(expandedAff === aff.id ? null : aff.id)}>
                                            <div className="flex items-center gap-4">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm ${aff.is_active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {aff.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{aff.name}</h4>
                                                    <p className="text-white/40 text-xs">{aff.email} • {aff.commission_percent}% comissão</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right hidden md:block">
                                                    <p className="text-sm font-bold text-emerald-400">{fmt(aff.pending_commission)} pendente</p>
                                                    <p className="text-xs text-white/40">{aff.total_sales} vendas • {fmt(aff.total_commission)} total</p>
                                                </div>
                                                <button onClick={e => { e.stopPropagation(); copyAffLink(aff.affiliate_code); }} className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors" title="Copiar link">
                                                    {copiedCode === aff.affiliate_code ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-white/40" />}
                                                </button>
                                                {expandedAff === aff.id ? <ChevronUp size={16} className="text-white/40" /> : <ChevronDown size={16} className="text-white/40" />}
                                            </div>
                                        </div>

                                        {expandedAff === aff.id && (
                                            <div className="border-t border-white/5 p-4 space-y-4">
                                                {/* Affiliate Link */}
                                                <div className="flex items-center gap-2 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
                                                    <Link2 size={14} className="text-emerald-400 shrink-0" />
                                                    <code className="text-xs text-white/70 flex-1 overflow-x-auto">https://www.lumiphotoia.online?aff={aff.affiliate_code}</code>
                                                    <button onClick={() => copyAffLink(aff.affiliate_code)} className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-xs font-bold shrink-0">
                                                        {copiedCode === aff.affiliate_code ? 'Copiado!' : 'Copiar'}
                                                    </button>
                                                </div>

                                                {/* Quick Stats */}
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                    <div className="p-3 bg-white/5 rounded-lg"><p className="text-[10px] text-white/40">Vendas</p><p className="text-lg font-black text-white">{aff.total_sales}</p></div>
                                                    <div className="p-3 bg-white/5 rounded-lg"><p className="text-[10px] text-white/40">Receita Gerada</p><p className="text-lg font-black text-white">{fmt(aff.total_revenue)}</p></div>
                                                    <div className="p-3 bg-white/5 rounded-lg"><p className="text-[10px] text-white/40">Comissão Total</p><p className="text-lg font-black text-emerald-400">{fmt(aff.total_commission)}</p></div>
                                                    <div className="p-3 bg-amber-500/10 rounded-lg"><p className="text-[10px] text-amber-400">Pendente</p><p className="text-lg font-black text-amber-400">{fmt(aff.pending_commission)}</p></div>
                                                </div>

                                                {/* Info */}
                                                <div className="grid grid-cols-2 gap-2 text-xs">
                                                    {aff.phone && <p className="text-white/40">📱 {aff.phone}</p>}
                                                    {aff.pix_key && <p className="text-white/40">💰 PIX: {aff.pix_key}</p>}
                                                </div>

                                                {/* Sales List */}
                                                {aff.sales?.length > 0 && (
                                                    <div>
                                                        <h5 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Vendas Recentes</h5>
                                                        <div className="space-y-1 max-h-40 overflow-y-auto">
                                                            {aff.sales.slice(0, 10).map((sale: any) => (
                                                                <div key={sale.id} className="flex items-center justify-between p-2 bg-white/[0.02] rounded-lg text-xs">
                                                                    <span className="text-white/50">{fmtDate(sale.created_at)}</span>
                                                                    <span className="text-white/70 capitalize">{sale.plan_type}</span>
                                                                    <span className="text-white/70">{fmt(sale.sale_amount)}</span>
                                                                    <span className="text-emerald-400 font-bold">{fmt(sale.commission_amount)}</span>
                                                                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${sale.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                                                                        {sale.status === 'paid' ? 'Pago' : 'Pendente'}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Payouts */}
                                                {aff.payouts?.length > 0 && (
                                                    <div>
                                                        <h5 className="text-xs font-bold text-white/60 uppercase tracking-wider mb-2">Pagamentos Realizados</h5>
                                                        <div className="space-y-1">
                                                            {aff.payouts.map((p: any) => (
                                                                <div key={p.id} className="flex items-center justify-between p-2 bg-emerald-500/5 rounded-lg text-xs">
                                                                    <span className="text-white/50">{fmtDate(p.paid_at)}</span>
                                                                    <span className="text-emerald-400 font-bold">{fmt(p.amount)}</span>
                                                                    {p.pix_receipt && <span className="text-white/30">{p.pix_receipt}</span>}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-2">
                                                    <button onClick={() => setShowPayoutModal(aff.id)} className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400 text-xs font-bold hover:bg-amber-500/20 transition-all">
                                                        <Wallet size={14} /> Registrar Pagamento PIX
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ) : loading && !stats ? (
                    <div className="flex items-center justify-center py-32">
                        <Loader2 size={40} className="animate-spin text-indigo-500" />
                    </div>
                ) : stats ? (
                    <>
                        {/* ===== KPI CARDS ===== */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <KpiCard icon={DollarSign} label={`Receita ${timePeriod !== 'all' ? '(' + periodLabels[timePeriod] + ')' : 'Total'}`} value={fmt(displayRevenue)} color="emerald" />
                            <KpiCard icon={CreditCard} label="Vendas" value={String(displaySalesCount)} sub={`Ticket médio: ${fmt(displayAvgTicket)}`} color="amber" />
                            <KpiCard icon={Users} label="Usuários" value={String(stats.overview.totalUsers)} sub={`+${stats.overview.newUsersLastWeek} essa semana`} color="blue" />
                            <KpiCard icon={Camera} label="Créditos no Sistema" value={String(stats.overview.totalCreditsInSystem)} sub={`${stats.overview.usersWithCredits} usuários c/ créditos`} color="purple" />
                        </div>

                        {/* ===== STRATEGIC METRICS ROW ===== */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <KpiCard icon={TrendingUp} label="Taxa de Conversão" value={`${stats.overview.conversionRate}%`} sub="visitantes → compradores" color="indigo" small />
                            <KpiCard icon={Repeat} label="Taxa de Recompra" value={`${stats.overview.repeatRate}%`} sub={`${stats.overview.repeatBuyers} recompraram`} color="pink" small />
                            <KpiCard icon={Zap} label="Fotos Geradas" value={String(stats.generationStats.totalPhotos)} sub={`${stats.generationStats.totalGenerations} sessões`} color="orange" small />
                            <KpiCard icon={Star} label="Instruções Custom" value={String(stats.generationStats.hasCustomInstructions)} sub="usaram texto personalizado" color="cyan" small />
                        </div>

                        {/* ===== CHECKOUT FUNNEL ===== */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                            <KpiCard icon={Target} label="InitiateCheckout" value={String(stats.overview.totalCheckouts || 0)} sub={`${stats.overview.checkoutsToday || 0} hoje`} color="rose" small />
                            <KpiCard icon={CreditCard} label="Vendas Completadas" value={String(displaySalesCount)} sub={`de ${stats.overview.totalCheckouts || 0} checkouts`} color="emerald" small />
                            <KpiCard icon={Percent} label="Conversão Checkout" value={`${stats.overview.checkoutConversionRate || 0}%`} sub="checkout → compra" color="violet" small />
                            <KpiCard icon={Wallet} label="Gateway" value="Assiny" sub="PIX 100%" color="blue" small />
                        </div>

                        {/* ===== SALES CHART + SALES BY PLAN ===== */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Sales Chart */}
                            <div className="lg:col-span-2 bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <BarChart3 size={16} className="text-indigo-400" /> Vendas por Dia (30 dias)
                                </h3>
                                <div className="flex items-end gap-[2px] h-40">
                                    {salesDays.map(([day, val]: [string, any]) => {
                                        const height = maxDayRevenue > 0 ? (val.revenue / maxDayRevenue * 100) : 0;
                                        const isToday = day === new Date().toISOString().split('T')[0];
                                        return (
                                            <div key={day} className="flex-1 flex flex-col items-center gap-1 group relative">
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 px-2 py-1 rounded text-[9px] text-white font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                                    {day.slice(5)}: {fmt(val.revenue)} ({val.count}x)
                                                </div>
                                                <div
                                                    className={`w-full rounded-t transition-all ${isToday ? 'bg-indigo-500 shadow-lg shadow-indigo-500/30' : val.count > 0 ? 'bg-indigo-500 group-hover:bg-indigo-400' : 'bg-white/10'}`}
                                                    style={{ height: `${Math.max(height, 4)}%` }}
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                                <div className="flex justify-between mt-2">
                                    <span className="text-[9px] text-white/30">{salesDays[0]?.[0]?.slice(5)}</span>
                                    <span className="text-[9px] text-white/30">Hoje</span>
                                </div>
                            </div>

                            {/* Sales by Plan */}
                            <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Vendas por Plano</h3>
                                <div className="space-y-3">
                                    {Object.entries(stats.salesByPlan).sort((a, b) => b[1].revenue - a[1].revenue).map(([plan, data]) => {
                                        const totalPlanSales = stats.overview.totalSales || 1;
                                        const pct = Math.round(data.count / totalPlanSales * 100);
                                        return (
                                            <div key={plan} className="space-y-1.5">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-bold capitalize text-white">{plan}</span>
                                                    <span className="text-xs text-white/50">{data.count}x • {fmt(data.revenue)}</span>
                                                </div>
                                                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                    <div className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                    {Object.keys(stats.salesByPlan).length === 0 && <p className="text-white/30 text-sm text-center py-4">Nenhuma venda ainda</p>}
                                </div>
                            </div>
                        </div>

                        {/* ===== ORIGEM DAS VENDAS ===== */}
                        {(stats.salesBySourcePage || stats.salesByUtmSource) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {/* Sales by Source Page */}
                                {stats.salesBySourcePage && (
                                    <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText size={16} className="text-cyan-400" /> Vendas por Página
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(stats.salesBySourcePage).sort((a, b) => (b[1] as any).revenue - (a[1] as any).revenue).map(([page, data]: [string, any]) => {
                                                const totalAllPages = Object.values(stats.salesBySourcePage!).reduce((s: number, v: any) => s + v.count, 0) || 1;
                                                const pct = Math.round(data.count / totalAllPages * 100);
                                                const pageLabels: Record<string, string> = {
                                                    '/': '🏠 Página Principal',
                                                    '/ensaios': '📸 Ensaios',
                                                    '/ensaio-advogadas': '⚖️ Advogadas',
                                                    '/ensaio-aniversario': '🎂 Aniversário',
                                                    '/ensaio-estetica': '💆 Estética',
                                                    '/ensaio-beleza': '💄 Beleza',
                                                    '/ensaio-pet': '🐾 Pet',
                                                    '/moda': '👗 Moda',
                                                    '/delivery': '🍕 Delivery',
                                                    '/varejo': '🛍️ Varejo',
                                                    'assiny': '💳 Assiny (direto)',
                                                    'direto': '🔗 Direto / Desconhecido',
                                                };
                                                return (
                                                    <div key={page} className="space-y-1.5">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-white">{pageLabels[page] || page}</span>
                                                            <span className="text-xs text-white/50">{data.count}x • {fmt(data.revenue)} • {pct}%</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {Object.keys(stats.salesBySourcePage).length === 0 && <p className="text-white/30 text-sm text-center py-4">Nenhum dado ainda</p>}
                                        </div>
                                    </div>
                                )}

                                {/* Sales by UTM Source */}
                                {stats.salesByUtmSource && (
                                    <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                        <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <TrendingUp size={16} className="text-pink-400" /> Vendas por Fonte de Tráfego
                                        </h3>
                                        <div className="space-y-3">
                                            {Object.entries(stats.salesByUtmSource).sort((a, b) => (b[1] as any).revenue - (a[1] as any).revenue).map(([source, data]: [string, any]) => {
                                                const totalAllSources = Object.values(stats.salesByUtmSource!).reduce((s: number, v: any) => s + v.count, 0) || 1;
                                                const pct = Math.round(data.count / totalAllSources * 100);
                                                const sourceLabels: Record<string, string> = {
                                                    'facebook': '📘 Facebook',
                                                    'instagram': '📷 Instagram',
                                                    'google': '🔍 Google',
                                                    'tiktok': '🎵 TikTok',
                                                    'youtube': '▶️ YouTube',
                                                    'whatsapp': '💬 WhatsApp',
                                                    'email': '📧 Email',
                                                    'direto': '🔗 Direto / Orgânico',
                                                };
                                                return (
                                                    <div key={source} className="space-y-1.5">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-sm font-bold text-white">{sourceLabels[source.toLowerCase()] || `🌐 ${source}`}</span>
                                                            <span className="text-xs text-white/50">{data.count}x • {fmt(data.revenue)} • {pct}%</span>
                                                        </div>
                                                        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-pink-500 to-pink-400 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            {Object.keys(stats.salesByUtmSource).length === 0 && <p className="text-white/30 text-sm text-center py-4">Nenhum dado ainda</p>}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* ===== DEVICE SPLIT + STYLE RANKING ===== */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            {/* Device Split */}
                            <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4">Dispositivos</h3>
                                {(() => {
                                    const total = stats.generationStats.deviceSplit.mobile + stats.generationStats.deviceSplit.desktop;
                                    const mobilePct = total > 0 ? Math.round(stats.generationStats.deviceSplit.mobile / total * 100) : 0;
                                    const desktopPct = total > 0 ? 100 - mobilePct : 0;
                                    return total > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3">
                                                <Smartphone size={20} className="text-blue-400" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white font-bold">Mobile</span>
                                                        <span className="text-white/50">{mobilePct}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${mobilePct}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Monitor size={20} className="text-purple-400" />
                                                <div className="flex-1">
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="text-white font-bold">Desktop</span>
                                                        <span className="text-white/50">{desktopPct}%</span>
                                                    </div>
                                                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                        <div className="h-full bg-purple-500 rounded-full" style={{ width: `${desktopPct}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : <p className="text-white/30 text-sm text-center py-4">Aguardando dados</p>;
                                })()}
                            </div>

                            {/* Style Ranking */}
                            <div className="lg:col-span-2 bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                                <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                                    <Camera size={16} className="text-amber-400" /> Estilos Mais Usados
                                </h3>
                                {stats.generationStats.styleRanking.length > 0 ? (
                                    <div className="space-y-2">
                                        {stats.generationStats.styleRanking.map((item, i) => {
                                            const maxCount = stats.generationStats.styleRanking[0]?.count || 1;
                                            const pct = Math.round(item.count / maxCount * 100);
                                            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
                                            return (
                                                <div key={item.style} className="flex items-center gap-3">
                                                    <span className="w-6 text-center text-sm">{medal}</span>
                                                    <div className="flex-1">
                                                        <div className="flex justify-between text-xs mb-1">
                                                            <span className="text-white font-medium truncate max-w-[200px]">{item.style}</span>
                                                            <span className="text-white/50 ml-2">{item.count}x</span>
                                                        </div>
                                                        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                                            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${pct}%` }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : <p className="text-white/30 text-sm text-center py-6">Dados serão coletados a partir das próximas gerações</p>}
                            </div>
                        </div>

                        {/* ===== RECENT SALES TABLE ===== */}
                        <div className="bg-zinc-900/60 rounded-2xl border border-white/5 p-5">
                            <h3 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <DollarSign size={16} className="text-emerald-400" /> Vendas Recentes
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-white/40 text-[10px] uppercase tracking-wider">
                                            <th className="text-left py-2 px-3">Email</th>
                                            <th className="text-left py-2 px-3">Plano</th>
                                            <th className="text-right py-2 px-3">Valor</th>
                                            <th className="text-left py-2 px-3">Gateway</th>
                                            <th className="text-left py-2 px-3">Origem</th>
                                            <th className="text-left py-2 px-3">Tráfego</th>
                                            <th className="text-right py-2 px-3">Data</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentSales.map(sale => (
                                            <tr key={sale.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                                                <td className="py-2.5 px-3 text-white/80 text-xs">{sale.email}</td>
                                                <td className="py-2.5 px-3">
                                                    <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 rounded-md text-[10px] font-bold uppercase">{sale.plan}</span>
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-emerald-400 font-bold text-xs">{fmt(sale.amount)}</td>
                                                <td className="py-2.5 px-3 text-xs">
                                                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${sale.gateway === 'Assiny' ? 'bg-violet-500/10 text-violet-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                                        {sale.gateway || 'MP'}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-3 text-xs">
                                                    {(sale as any).source_page ? (
                                                        <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-md text-[10px] font-bold">{(sale as any).source_page}</span>
                                                    ) : (
                                                        <span className="text-white/20 text-[10px]">—</span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-3 text-xs">
                                                    {(sale as any).utm_source ? (
                                                        <span className="px-2 py-0.5 bg-pink-500/10 text-pink-400 rounded-md text-[10px] font-bold">{(sale as any).utm_source}</span>
                                                    ) : (
                                                        <span className="text-white/20 text-[10px]">—</span>
                                                    )}
                                                </td>
                                                <td className="py-2.5 px-3 text-right text-white/40 text-xs">{fmtDate(sale.date)}</td>
                                            </tr>
                                        ))}
                                        {stats.recentSales.length === 0 && (
                                            <tr><td colSpan={7} className="text-center py-8 text-white/30">Nenhuma venda registrada</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                ) : null}
            </main>

            <footer className="py-6 text-center text-white/20 text-[10px] uppercase tracking-widest">
                © {new Date().getFullYear()} LumiphotoIA Admin
            </footer>
        </div>
    );
};

// ==================== KPI CARD COMPONENT ====================
const KpiCard: React.FC<{
    icon: React.FC<any>;
    label: string;
    value: string;
    sub?: string;
    color: string;
    small?: boolean;
}> = ({ icon: Icon, label, value, sub, color, small }) => {
    const colorMap: Record<string, string> = {
        emerald: 'from-emerald-500/10 to-emerald-600/5 border-emerald-500/20 text-emerald-400',
        amber: 'from-amber-500/10 to-amber-600/5 border-amber-500/20 text-amber-400',
        blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
        purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
        indigo: 'from-indigo-500/10 to-indigo-600/5 border-indigo-500/20 text-indigo-400',
        pink: 'from-pink-500/10 to-pink-600/5 border-pink-500/20 text-pink-400',
        orange: 'from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-400',
        cyan: 'from-cyan-500/10 to-cyan-600/5 border-cyan-500/20 text-cyan-400',
    };

    return (
        <div className={`bg-gradient-to-br ${colorMap[color]} rounded-xl border p-3 md:p-4`}>
            <div className="flex items-center gap-2 mb-1">
                <Icon size={small ? 14 : 16} />
                <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</span>
            </div>
            <p className={`${small ? 'text-lg md:text-xl' : 'text-xl md:text-2xl'} font-black text-white`}>{value}</p>
            {sub && <p className="text-[9px] md:text-[10px] text-white/30 mt-0.5">{sub}</p>}
        </div>
    );
};

export default AdminDashboard;
