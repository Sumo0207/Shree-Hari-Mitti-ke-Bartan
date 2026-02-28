-- Fix security warnings from Supabase linter
-- 1. Fix function search_path for update_updated_at_column
-- 2. Fix function search_path for sync_user_role
-- 3. Fix RLS policy for inquiries table (make it more restrictive)
-- 4. Add INSERT policy for profiles table

-- ============================================================================
-- 1. Fix update_updated_at_column function - add SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- ============================================================================
-- 2. Fix sync_user_role function - add SET search_path
-- ============================================================================

CREATE OR REPLACE FUNCTION public.sync_user_role()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.profiles
    SET role = NEW.role
    WHERE id = NEW.user_id;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 3. Fix RLS policy for inquiries table
-- The current policy "Allow public insert on inquiries" uses WITH CHECK (true)
-- which is too permissive. We'll replace it with a more restrictive policy
-- that at least requires some basic validation.
-- ============================================================================

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow public insert on inquiries" ON public.inquiries;

-- Create a new policy that requires at least customer_name and message to be present
-- This is still permissive for anonymous users (needed for contact form) but adds basic validation
CREATE POLICY "Allow public insert on inquiries with validation"
  ON public.inquiries FOR INSERT
  WITH CHECK (
    customer_name IS NOT NULL 
    AND customer_name != '' 
    AND message IS NOT NULL 
    AND message != ''
  );

-- ============================================================================
-- 4. Add INSERT policy for profiles table
-- Allow users to insert their own profile if it doesn't exist
-- ============================================================================

CREATE POLICY "Allow users to insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);
