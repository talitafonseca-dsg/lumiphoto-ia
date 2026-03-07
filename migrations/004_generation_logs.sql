-- =============================================
-- GENERATION LOGS TABLE - Track studio generation usage
-- =============================================

CREATE TABLE IF NOT EXISTS public.generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email TEXT,
  studio_style TEXT,
  creation_type TEXT,
  aspect_ratio TEXT,
  design_count INTEGER DEFAULT 1,
  has_custom_model BOOLEAN DEFAULT false,
  has_reference_image BOOLEAN DEFAULT false,
  has_product_image BOOLEAN DEFAULT false,
  has_custom_instructions BOOLEAN DEFAULT false,
  device_type TEXT, -- 'mobile' or 'desktop'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indices for analytics queries
CREATE INDEX IF NOT EXISTS idx_gen_logs_user ON public.generation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_gen_logs_style ON public.generation_logs(studio_style);
CREATE INDEX IF NOT EXISTS idx_gen_logs_created ON public.generation_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_gen_logs_type ON public.generation_logs(creation_type);

-- RLS
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;

-- Service role full access (for Edge Functions)
CREATE POLICY "Service role full access on generation_logs"
  ON public.generation_logs
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Authenticated users can insert their own logs
CREATE POLICY "Users can insert own generation logs"
  ON public.generation_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- =============================================
-- END MIGRATION
-- =============================================
