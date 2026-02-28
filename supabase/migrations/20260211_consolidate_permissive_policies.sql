-- Consolidate multiple permissive policies into single policies
-- This fixes the remaining "multiple permissive policies" warnings by combining
-- overlapping policies (e.g., public read + admin read) into single policies with OR logic

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================

-- Drop both public and admin SELECT policies
DROP POLICY IF EXISTS "Allow public read access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin full access on categories" ON public.categories;

-- Create single consolidated SELECT policy (public OR admin)
CREATE POLICY "Allow read access on categories"
  ON public.categories FOR SELECT
  USING (TRUE OR public.has_role((SELECT auth.uid()), 'admin'));

-- Recreate admin write policies separately
CREATE POLICY "Allow admin write access on categories"
  ON public.categories FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin update access on categories"
  ON public.categories FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin delete access on categories"
  ON public.categories FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- GUIDES TABLE
-- ============================================================================

-- Drop both public and admin SELECT policies
DROP POLICY IF EXISTS "Allow public read access on guides" ON public.guides;
DROP POLICY IF EXISTS "Allow admin full access on guides" ON public.guides;

-- Create single consolidated SELECT policy (public OR admin)
CREATE POLICY "Allow read access on guides"
  ON public.guides FOR SELECT
  USING (TRUE OR public.has_role((SELECT auth.uid()), 'admin'));

-- Recreate admin write policies separately
CREATE POLICY "Allow admin write access on guides"
  ON public.guides FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin update access on guides"
  ON public.guides FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin delete access on guides"
  ON public.guides FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Drop both user and admin SELECT policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create single consolidated SELECT policy (own profile OR admin)
CREATE POLICY "Allow profile read access"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id OR public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- USER_ROLES TABLE
-- ============================================================================

-- Drop both user and admin SELECT policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Create single consolidated SELECT policy (own roles OR admin)
CREATE POLICY "Allow roles read access"
  ON public.user_roles FOR SELECT
  USING ((SELECT auth.uid()) = user_id OR public.has_role((SELECT auth.uid()), 'admin'));

-- Recreate admin write policies separately
CREATE POLICY "Allow admin write roles"
  ON public.user_roles FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin update roles"
  ON public.user_roles FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin delete roles"
  ON public.user_roles FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================

-- Drop all existing testimonials policies
DROP POLICY IF EXISTS "Anyone can view active testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can manage all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Users can view their own testimonials" ON public.testimonials;

-- Create single consolidated SELECT policy (active testimonials OR admin)
CREATE POLICY "Allow testimonials read access"
  ON public.testimonials FOR SELECT
  USING (is_active = TRUE OR public.has_role((SELECT auth.uid()), 'admin'));

-- Create single consolidated INSERT policy (authenticated users OR admin)
CREATE POLICY "Allow testimonials insert access"
  ON public.testimonials FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL OR public.has_role((SELECT auth.uid()), 'admin'));

-- Recreate admin write policies separately
CREATE POLICY "Allow admin update testimonials"
  ON public.testimonials FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin delete testimonials"
  ON public.testimonials FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));
