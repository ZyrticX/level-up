-- Fix infinite recursion in user_roles RLS policy by using SECURITY DEFINER function
-- Drop the recursive policy
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;

-- Recreate an admin SELECT policy that does not recurse
CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'::app_role));