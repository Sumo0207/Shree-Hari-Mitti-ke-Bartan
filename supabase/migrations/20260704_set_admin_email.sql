-- Ensure the requested email is treated as an admin in the app logic
-- This migration updates any existing admin role rows for this email and clears others.
DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE lower(email) = lower('sumitkatakiya922@gmail.com')
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    DELETE FROM public.user_roles
    WHERE role = 'admin' AND user_id <> target_user_id;

    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;

    UPDATE public.profiles
    SET role = 'admin', updated_at = now()
    WHERE id = target_user_id;

    UPDATE public.profiles
    SET role = 'user', updated_at = now()
    WHERE id <> target_user_id AND role = 'admin';
  END IF;
END $$;
