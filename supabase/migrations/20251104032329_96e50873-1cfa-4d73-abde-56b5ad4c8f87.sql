-- Add user_id column to testimonials table
ALTER TABLE public.testimonials 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the old admin-only insert policy
DROP POLICY IF EXISTS "Admins can insert testimonials" ON public.testimonials;

-- Create new policy allowing authenticated users to insert their own testimonials
CREATE POLICY "Authenticated users can insert testimonials" 
ON public.testimonials 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Create policy allowing users to view their own testimonials (even if not active)
CREATE POLICY "Users can view their own testimonials" 
ON public.testimonials 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Update the default for is_active to false for user-submitted testimonials
ALTER TABLE public.testimonials 
ALTER COLUMN is_active SET DEFAULT false;