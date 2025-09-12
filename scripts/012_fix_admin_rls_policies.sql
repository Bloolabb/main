-- Fix infinite recursion in admin_roles RLS policies
-- The issue is that policies are checking admin_roles table to determine access to admin_roles table

-- Drop existing problematic policies
DROP POLICY IF EXISTS "super_admins_can_view_all_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "super_admins_can_insert_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "super_admins_can_update_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "super_admins_can_delete_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "admins_can_view_activity_log" ON public.admin_activity_log;
DROP POLICY IF EXISTS "admins_can_insert_activity_log" ON public.admin_activity_log;

-- Temporarily disable RLS to allow initial admin setup
ALTER TABLE public.admin_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log DISABLE ROW LEVEL SECURITY;

-- Insert the admin user (make sure the user exists first)
INSERT INTO public.admin_roles (user_id, role, granted_by) 
SELECT id, 'super_admin', id 
FROM auth.users 
WHERE email = 'zvmmed@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Re-enable RLS with better policies that don't cause recursion
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check admin status without recursion
CREATE OR REPLACE FUNCTION public.check_admin_access(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  is_admin_user BOOLEAN := FALSE;
BEGIN
  -- Direct query without RLS to avoid recursion
  SELECT EXISTS (
    SELECT 1 FROM admin_roles 
    WHERE user_id = check_user_id
  ) INTO is_admin_user;
  
  RETURN is_admin_user;
END;
$$;

-- New policies using the security definer function
CREATE POLICY "authenticated_users_can_check_own_admin_status" ON public.admin_roles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "service_role_full_access" ON public.admin_roles
  FOR ALL USING (auth.role() = 'service_role');

-- Admin activity log policies
CREATE POLICY "admins_can_view_own_activity" ON public.admin_activity_log
  FOR SELECT USING (admin_user_id = auth.uid());

CREATE POLICY "service_role_activity_access" ON public.admin_activity_log
  FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.admin_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_access TO authenticated;
