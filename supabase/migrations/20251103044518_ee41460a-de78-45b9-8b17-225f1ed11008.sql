-- Add translation support for products table
-- We'll store translations as JSONB objects with language codes as keys

-- Add new columns for translations
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS name_translations JSONB DEFAULT '{"en": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS description_translations JSONB DEFAULT '{"en": ""}'::jsonb,
ADD COLUMN IF NOT EXISTS story_translations JSONB DEFAULT '{"en": ""}'::jsonb;

-- Migrate existing data to translations format
UPDATE public.products
SET 
  name_translations = jsonb_build_object('en', COALESCE(name, '')),
  description_translations = jsonb_build_object('en', COALESCE(description, '')),
  story_translations = jsonb_build_object('en', COALESCE(story, ''))
WHERE name_translations = '{"en": ""}'::jsonb;

-- Add helpful comment
COMMENT ON COLUMN public.products.name_translations IS 'Product name in multiple languages. Format: {"en": "English", "hi": "Hindi", "gu": "Gujarati", "mr": "Marathi", "bn": "Bengali"}';
COMMENT ON COLUMN public.products.description_translations IS 'Product description in multiple languages';
COMMENT ON COLUMN public.products.story_translations IS 'Product story in multiple languages';