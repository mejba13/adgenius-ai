-- AdGenius AI Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT NOT NULL DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- BRAND KITS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.brand_kits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  logo_url TEXT,
  primary_color TEXT NOT NULL DEFAULT '#2563EB',
  secondary_color TEXT NOT NULL DEFAULT '#10B981',
  font_family TEXT NOT NULL DEFAULT 'inter',
  tone_preset TEXT NOT NULL DEFAULT 'professional',
  tone_of_voice TEXT,
  sample_copy TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id) -- One brand kit per user
);

-- ============================================
-- CREATIVES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.creatives (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'copy' CHECK (type IN ('copy', 'image', 'video')),
  platform TEXT NOT NULL CHECK (platform IN ('meta', 'google', 'tiktok', 'linkedin')),
  name TEXT,
  content JSONB NOT NULL, -- Array of variations
  input_params JSONB NOT NULL, -- Generation input parameters
  is_favorite BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- USAGE RECORDS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS public.usage_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  credits_used INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, period_start) -- One record per user per period
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_brand_kits_user ON public.brand_kits(user_id);
CREATE INDEX IF NOT EXISTS idx_creatives_user ON public.creatives(user_id);
CREATE INDEX IF NOT EXISTS idx_creatives_user_type ON public.creatives(user_id, type);
CREATE INDEX IF NOT EXISTS idx_creatives_created ON public.creatives(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_usage_user_period ON public.usage_records(user_id, period_start);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brand_kits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_records ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Brand Kits: Users can CRUD their own brand kit
CREATE POLICY "Users can view own brand kit" ON public.brand_kits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own brand kit" ON public.brand_kits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own brand kit" ON public.brand_kits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own brand kit" ON public.brand_kits
  FOR DELETE USING (auth.uid() = user_id);

-- Creatives: Users can CRUD their own creatives
CREATE POLICY "Users can view own creatives" ON public.creatives
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own creatives" ON public.creatives
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own creatives" ON public.creatives
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own creatives" ON public.creatives
  FOR DELETE USING (auth.uid() = user_id);

-- Usage Records: Users can view their own usage
CREATE POLICY "Users can view own usage" ON public.usage_records
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_brand_kits_updated_at
  BEFORE UPDATE ON public.brand_kits
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creatives_updated_at
  BEFORE UPDATE ON public.creatives
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_usage_records_updated_at
  BEFORE UPDATE ON public.usage_records
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to get or create current usage record
CREATE OR REPLACE FUNCTION public.get_or_create_usage_record(p_user_id UUID)
RETURNS public.usage_records AS $$
DECLARE
  v_record public.usage_records;
  v_period_start DATE;
  v_period_end DATE;
BEGIN
  -- Calculate current period (monthly)
  v_period_start := DATE_TRUNC('month', CURRENT_DATE)::DATE;
  v_period_end := (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  -- Try to get existing record
  SELECT * INTO v_record
  FROM public.usage_records
  WHERE user_id = p_user_id AND period_start = v_period_start;

  -- If no record exists, create one
  IF NOT FOUND THEN
    INSERT INTO public.usage_records (user_id, period_start, period_end, credits_used)
    VALUES (p_user_id, v_period_start, v_period_end, 0)
    RETURNING * INTO v_record;
  END IF;

  RETURN v_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to increment usage
CREATE OR REPLACE FUNCTION public.increment_usage(p_user_id UUID, p_amount INTEGER DEFAULT 1)
RETURNS INTEGER AS $$
DECLARE
  v_record public.usage_records;
  v_new_total INTEGER;
BEGIN
  -- Get or create the usage record
  v_record := public.get_or_create_usage_record(p_user_id);

  -- Increment and return new total
  UPDATE public.usage_records
  SET credits_used = credits_used + p_amount
  WHERE id = v_record.id
  RETURNING credits_used INTO v_new_total;

  RETURN v_new_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
