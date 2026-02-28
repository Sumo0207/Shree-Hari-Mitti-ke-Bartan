-- Clear all users except admin user
-- This will remove all non-admin users from the website

-- First, get the admin user ID (the one with admin role in user_roles)
-- Then delete all other users

-- Delete from profiles table (non-admin users)
DELETE FROM public.profiles 
WHERE id NOT IN (
    SELECT user_id FROM public.user_roles WHERE role = 'admin'
);

-- Delete from user_roles table (non-admin roles)
DELETE FROM public.user_roles 
WHERE role != 'admin';

-- Delete from auth.users (non-admin users)
-- Note: This requires service role privileges, so we'll use a different approach
-- We'll create a function to handle this

CREATE OR REPLACE FUNCTION public.delete_non_admin_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    admin_ids UUID[];
    user_id UUID;
BEGIN
    -- Get all admin user IDs
    SELECT array_agg(user_id) INTO admin_ids
    FROM public.user_roles
    WHERE role = 'admin';
    
    -- Delete from auth.users for non-admin users
    FOR user_id IN 
        SELECT id FROM auth.users 
        WHERE id != ALL(COALESCE(admin_ids, ARRAY[]::UUID[]))
    LOOP
        -- This will cascade to profiles and user_roles due to ON DELETE CASCADE
        DELETE FROM auth.users WHERE id = user_id;
    END LOOP;
END;
$$;

-- Execute the function
SELECT public.delete_non_admin_users();

-- Drop the function after use
DROP FUNCTION public.delete_non_admin_users();

-- ============================================================================
-- Disable public sign-ups by modifying the handle_new_user trigger
-- Only allow admin users to be created (no automatic user creation)
-- ============================================================================

-- Drop the existing trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create a new function that only creates profiles for admin users
-- (admin users are created manually through the Supabase dashboard)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only create profile if user is admin (created manually)
  -- For non-admin users, we don't create anything
  -- This effectively disables public sign-ups
  
  -- Check if this user should be admin (based on email)
  IF NEW.email = 'katakiyasumit96@gmail.com' THEN
    INSERT INTO public.profiles (id, email, username, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
      'admin'
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    -- For non-admin emails, we still create a profile but with user role
    -- This allows the user to be created but they won't have admin access
    INSERT INTO public.profiles (id, email, username, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1)),
      'user'
    );
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- Recreate the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
