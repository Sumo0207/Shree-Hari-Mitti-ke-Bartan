-- Add translation columns to guides table
ALTER TABLE public.guides 
ADD COLUMN IF NOT EXISTS title_translations JSONB,
ADD COLUMN IF NOT EXISTS content_translations JSONB;
