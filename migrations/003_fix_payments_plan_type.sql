-- =============================================
-- FIX: Atualizar constraint de plan_type para novos planos
-- Execute no Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Remover o CHECK constraint antigo
ALTER TABLE public.payments DROP CONSTRAINT IF EXISTS payments_plan_type_check;

-- 2. Adicionar novo CHECK com os planos corretos
ALTER TABLE public.payments ADD CONSTRAINT payments_plan_type_check 
  CHECK (plan_type IN ('starter', 'essencial', 'pro', 'premium'));
