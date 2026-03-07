-- Create affiliates table
CREATE TABLE IF NOT EXISTS public.affiliates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    pix_key TEXT,
    affiliate_code TEXT UNIQUE NOT NULL,
    commission_percent NUMERIC NOT NULL DEFAULT 20,
    is_active BOOLEAN NOT NULL DEFAULT true,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create affiliate_sales table
CREATE TABLE IF NOT EXISTS public.affiliate_sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id),
    payment_id TEXT,
    buyer_email TEXT,
    plan_type TEXT,
    sale_amount NUMERIC NOT NULL DEFAULT 0,
    commission_amount NUMERIC NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create affiliate_payouts table
CREATE TABLE IF NOT EXISTS public.affiliate_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    affiliate_id UUID NOT NULL REFERENCES public.affiliates(id),
    amount NUMERIC NOT NULL,
    period_start DATE,
    period_end DATE,
    pix_receipt TEXT,
    paid_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by TEXT
);

-- Enable RLS
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.affiliate_payouts ENABLE ROW LEVEL SECURITY;

-- Policies: Service role has full access (used by edge functions)
CREATE POLICY "Service role full access on affiliates" ON public.affiliates
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on affiliate_sales" ON public.affiliate_sales
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "Service role full access on affiliate_payouts" ON public.affiliate_payouts
    FOR ALL USING (true) WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_affiliate_sales_affiliate_id ON public.affiliate_sales(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliate_sales_status ON public.affiliate_sales(status);
CREATE INDEX IF NOT EXISTS idx_affiliate_payouts_affiliate_id ON public.affiliate_payouts(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_affiliates_code ON public.affiliates(affiliate_code);
