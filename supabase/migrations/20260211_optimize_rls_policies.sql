-- Optimize RLS policies for better performance
-- This migration addresses two main issues:
-- 1. Wraps auth.uid() calls in SELECT to prevent re-evaluation for each row
-- 2. Consolidates multiple permissive policies where applicable

-- ============================================================================
-- PROFILES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING ((SELECT auth.uid()) = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- USER_ROLES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- GALLERY_IMAGES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can update gallery images" ON public.gallery_images;
DROP POLICY IF EXISTS "Admins can delete gallery images" ON public.gallery_images;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Admins can insert gallery images"
  ON public.gallery_images FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Admins can update gallery images"
  ON public.gallery_images FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Admins can delete gallery images"
  ON public.gallery_images FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- TESTIMONIALS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Authenticated users can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can view all testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can update testimonials" ON public.testimonials;
DROP POLICY IF EXISTS "Admins can delete testimonials" ON public.testimonials;

-- Recreate with optimized auth.uid() calls and consolidated policies
-- Note: "Admins can manage all testimonials" covers all admin operations
CREATE POLICY "Admins can manage all testimonials"
  ON public.testimonials FOR ALL
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Authenticated users can insert testimonials"
  ON public.testimonials FOR INSERT
  WITH CHECK ((SELECT auth.uid()) IS NOT NULL);

-- ============================================================================
-- ABOUT_CONTENT TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can insert about content" ON public.about_content;
DROP POLICY IF EXISTS "Admins can update about content" ON public.about_content;
DROP POLICY IF EXISTS "Admins can delete about content" ON public.about_content;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Admins can insert about content"
  ON public.about_content FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Admins can update about content"
  ON public.about_content FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Admins can delete about content"
  ON public.about_content FOR DELETE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- GUIDES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin full access on guides" ON public.guides;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Allow admin full access on guides"
  ON public.guides FOR ALL
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- INQUIRIES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin read access on inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Allow admin update access on inquiries" ON public.inquiries;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Allow admin read access on inquiries"
  ON public.inquiries FOR SELECT
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin update access on inquiries"
  ON public.inquiries FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- SETTINGS TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin update access on settings" ON public.settings;
DROP POLICY IF EXISTS "Allow admin insert access on settings" ON public.settings;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Allow admin update access on settings"
  ON public.settings FOR UPDATE
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Allow admin insert access on settings"
  ON public.settings FOR INSERT
  WITH CHECK (public.has_role((SELECT auth.uid()), 'admin'));

-- ============================================================================
-- CATEGORIES TABLE
-- ============================================================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin full access on categories" ON public.categories;

-- Recreate with optimized auth.uid() calls
CREATE POLICY "Allow admin full access on categories"
  ON public.categories FOR ALL
  USING (public.has_role((SELECT auth.uid()), 'admin'));
