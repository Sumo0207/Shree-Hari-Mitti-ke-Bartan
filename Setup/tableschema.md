-- Enable extension for UUID generation (Supabase usually has pgcrypto)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Role enum
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin','user');
  END IF;
END$$;

-- Profiles (links to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  username text,
  avatar_url text,
  role public.app_role DEFAULT 'user',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS profiles_role_idx ON public.profiles (role);

-- Categories
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  name_hi text,
  name_gu text,
  created_at timestamptz DEFAULT now()
);

-- Products
CREATE TABLE IF NOT EXISTS public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  name_en text,
  name_hi text,
  name_gu text,
  description text,
  description_en text,
  description_hi text,
  description_gu text,
  story_en text,
  story_hi text,
  story_gu text,
  price numeric,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  image_url text,
  visible boolean DEFAULT true,
  is_featured boolean DEFAULT false,
  size text,
  material text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS products_category_idx ON public.products (category_id);
CREATE INDEX IF NOT EXISTS products_visible_idx ON public.products (visible);

-- Settings (single-row config table)
CREATE TABLE IF NOT EXISTS public.settings (
  id serial PRIMARY KEY,
  business_name text,
  business_name_en text,
  business_name_hi text,
  business_name_gu text,
  phone text,
  email text,
  address text,
  address_en text,
  address_hi text,
  address_gu text,
  updated_at timestamptz DEFAULT now(),
  whatsapp text,
  google_map text,
  instagram text,
  facebook text,
  youtube text,
  logo_url text,
  footer_text text,
  footer_en text,
  footer_hi text,
  footer_gu text,
  business_hours_days_en text,
  business_hours_days_hi text,
  business_hours_days_gu text,
  business_hours_closed_en text,
  business_hours_closed_hi text,
  business_hours_closed_gu text
);

-- About content
CREATE TABLE IF NOT EXISTS public.about_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key text NOT NULL,
  title text,
  title_en text,
  title_hi text,
  title_gu text,
  content text,
  content_en text,
  content_hi text,
  content_gu text,
  image_url text,
  updated_at timestamptz DEFAULT now()
);

-- Gallery images
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL,
  caption text,
  created_at timestamptz DEFAULT now()
);

-- Guides
CREATE TABLE IF NOT EXISTS public.guides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text,
  title_hi text,
  title_gu text,
  content_en text,
  content_hi text,
  content_gu text,
  thumbnail_url text,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name text NOT NULL,
  customer_name_en text,
  customer_name_hi text,
  customer_name_gu text,
  customer_location text,
  message text NOT NULL,
  message_en text,
  message_hi text,
  message_gu text,
  rating integer,
  display_order integer DEFAULT 0,
  is_active boolean DEFAULT false,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS testimonials_user_idx ON public.testimonials (user_id);

-- User roles (optional separate table)
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS user_roles_user_id_ux ON public.user_roles (user_id);

-- Convenience: ensure at least one settings row (optional)
INSERT INTO public.settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- Grant basic select/insert/update/delete to authenticated users as needed
-- (Leave RLS policies to your project-specific rules; create policies to restrict admin-only operations)