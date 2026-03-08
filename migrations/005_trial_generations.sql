-- =============================================
-- TRIAL GENERATIONS TABLE
-- Pay-to-unlock free trial flow
-- =============================================

CREATE TABLE IF NOT EXISTS public.trial_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  ip_hash TEXT,                         -- hashed IP for rate limiting
  status TEXT DEFAULT 'preview'         -- 'preview' | 'paid_single' | 'paid_pack' | 'expired'
    CHECK (status IN ('preview', 'paid_single', 'paid_pack', 'expired')),
  product_type TEXT                     -- null until payment: 'single' | 'pack'
    CHECK (product_type IS NULL OR product_type IN ('single', 'pack')),
  selected_image_index INTEGER,         -- for single photo purchase (0-based)
  delivery_style TEXT,
  aspect_ratio TEXT DEFAULT '1:1',
  preview_images JSONB,                 -- [{url: dataUrl, variation: 1, index: 0}]
  hd_storage_paths JSONB,              -- [{path: 'trial-generations/xxx/hd_0.png', variation: 1}]
  mp_payment_id TEXT,
  mp_preference_id TEXT,
  payer_email TEXT,
  created_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '2 hours'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_trial_session ON public.trial_generations(session_id);
CREATE INDEX IF NOT EXISTS idx_trial_ip ON public.trial_generations(ip_hash);
CREATE INDEX IF NOT EXISTS idx_trial_status ON public.trial_generations(status);
CREATE INDEX IF NOT EXISTS idx_trial_expires ON public.trial_generations(expires_at);
CREATE INDEX IF NOT EXISTS idx_trial_mp_payment ON public.trial_generations(mp_payment_id);

-- RLS
ALTER TABLE public.trial_generations ENABLE ROW LEVEL SECURITY;

-- Service role full access (Edge Functions)
CREATE POLICY "service_role_all_trial"
  ON public.trial_generations FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Cleanup function: mark expired records
CREATE OR REPLACE FUNCTION public.cleanup_expired_trials()
RETURNS void AS $$
BEGIN
  UPDATE public.trial_generations
  SET status = 'expired'
  WHERE status = 'preview'
    AND expires_at < NOW();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- END MIGRATION
-- =============================================
