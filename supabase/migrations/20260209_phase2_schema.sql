-- Create settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id INTEGER PRIMARY KEY CHECK (id = 1), -- Enforce singleton
    business_name TEXT,
    phone TEXT,
    whatsapp TEXT,
    email TEXT,
    address TEXT,
    google_map TEXT,
    instagram TEXT,
    facebook TEXT,
    youtube TEXT,
    logo_url TEXT,
    footer_text TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on settings" ON public.settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin update access on settings" ON public.settings
    FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Allow admin insert access on settings" ON public.settings
    FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Initialize default settings
INSERT INTO public.settings (id, business_name)
VALUES (1, 'Handmade Mitti Products')
ON CONFLICT (id) DO NOTHING;

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on categories" ON public.categories
    FOR SELECT USING (true);

CREATE POLICY "Allow admin full access on categories" ON public.categories
    FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Modify products table
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.categories(id),
ADD COLUMN IF NOT EXISTS size TEXT,
ADD COLUMN IF NOT EXISTS material TEXT,
ADD COLUMN IF NOT EXISTS visible BOOLEAN DEFAULT true;

-- Modify profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'light',
ADD COLUMN IF NOT EXISTS role public.app_role DEFAULT 'user';

-- Sync role to profiles
CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.profiles
    SET role = NEW.role
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_user_role_change ON public.user_roles;
CREATE TRIGGER on_user_role_change
AFTER INSERT OR UPDATE ON public.user_roles
FOR EACH ROW EXECUTE FUNCTION public.sync_user_role();

-- Backfill profiles.role for existing users
UPDATE public.profiles p
SET role = ur.role
FROM public.user_roles ur
WHERE p.id = ur.user_id;
