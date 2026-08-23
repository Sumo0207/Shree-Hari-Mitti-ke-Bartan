-- Allow the configured admin account to insert/update/delete categories
-- even when the role row is missing or not yet synced.

DO $$
DECLARE
  target_user_id uuid;
BEGIN
  SELECT id INTO target_user_id
  FROM auth.users
  WHERE lower(email) = lower('sumitkatakiya922@gmail.com')
  LIMIT 1;

  IF target_user_id IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (target_user_id, 'admin')
    ON CONFLICT (user_id) DO UPDATE SET role = EXCLUDED.role;
  END IF;
END $$;

CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    public.has_role(auth.uid(), 'admin')
    OR lower(COALESCE(auth.jwt() ->> 'email', '')) IN (
      lower('sumitkatakiya922@gmail.com')
    );
$$;

DROP POLICY IF EXISTS "Allow admin write access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin update access on categories" ON public.categories;
DROP POLICY IF EXISTS "Allow admin delete access on categories" ON public.categories;

CREATE POLICY "Allow admin write access on categories"
  ON public.categories
  FOR INSERT
  WITH CHECK (public.is_admin_user());

CREATE POLICY "Allow admin update access on categories"
  ON public.categories
  FOR UPDATE
  USING (public.is_admin_user());

CREATE POLICY "Allow admin delete access on categories"
  ON public.categories
  FOR DELETE
  USING (public.is_admin_user());
