-- Add indexes for foreign keys to improve query performance
-- This addresses the "unindexed foreign keys" warnings from the database linter

-- ============================================================================
-- INQUIRIES TABLE - product_id foreign key
-- ============================================================================

-- Create index on product_id for faster joins and lookups
CREATE INDEX IF NOT EXISTS idx_inquiries_product_id 
  ON public.inquiries(product_id);

-- ============================================================================
-- PRODUCTS TABLE - category_id foreign key
-- ============================================================================

-- Create index on category_id for faster category-based queries
CREATE INDEX IF NOT EXISTS idx_products_category_id 
  ON public.products(category_id);

-- ============================================================================
-- TESTIMONIALS TABLE - user_id foreign key
-- ============================================================================

-- Create index on user_id for faster user-based queries
CREATE INDEX IF NOT EXISTS idx_testimonials_user_id 
  ON public.testimonials(user_id);

-- These indexes will improve performance for:
-- 1. JOIN operations between tables
-- 2. Filtering by foreign key columns (WHERE clauses)
-- 3. Foreign key constraint validation
-- 4. CASCADE operations (DELETE/UPDATE)
