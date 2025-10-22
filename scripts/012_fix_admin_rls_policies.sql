-- Fix infinite recursion in admin_roles RLS policies
-- The issue is that policies are checking admin_roles table to determine access to admin_roles table

-- Drop existing problematic policies
-- Drop problematic policies (idempotent)
DROP POLICY IF EXISTS "super_admins_can_view_all_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "super_admins_can_insert_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "super_admins_can_update_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "super_admins_can_delete_roles" ON public.admin_roles;
DROP POLICY IF EXISTS "admins_can_view_activity_log" ON public.admin_activity_log;
DROP POLICY IF EXISTS "admins_can_insert_activity_log" ON public.admin_activity_log;

-- If you need to seed an initial admin, set the GUC 'bootstrap.admin_email' and this script will insert it safely.
DO $$
DECLARE
  v_email TEXT := current_setting('bootstrap.admin_email', true);
  v_user_uuid UUID;
BEGIN
  IF v_email IS NULL OR trim(v_email) = '' THEN
    RAISE NOTICE 'No bootstrap.admin_email provided. Skipping automatic insert.';
  ELSE
    SELECT id INTO v_user_uuid FROM auth.users WHERE email = v_email LIMIT 1;
    IF v_user_uuid IS NOT NULL THEN
      INSERT INTO public.admin_roles (user_id, role, granted_by)
      VALUES (v_user_uuid, 'super_admin', v_user_uuid)
      ON CONFLICT (user_id, role) DO NOTHING;
      RAISE NOTICE 'Inserted bootstrap admin %', v_email;
    ELSE
      RAISE NOTICE 'Bootstrap email % not found in auth.users', v_email;
    END IF;
  END IF;
END $$;

-- Re-create safer policies (no recursion)
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check admin status without triggering RLS
CREATE OR REPLACE FUNCTION public.check_admin_access_internal(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = p_user_id);
END;
$$;

-- Policies
DROP POLICY IF EXISTS "authenticated_users_can_check_own_admin_status" ON public.admin_roles;
CREATE POLICY "authenticated_users_can_check_own_admin_status" ON public.admin_roles
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "service_role_full_access" ON public.admin_roles;
CREATE POLICY "service_role_full_access" ON public.admin_roles
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "admins_can_view_own_activity" ON public.admin_activity_log;
CREATE POLICY "admins_can_view_own_activity" ON public.admin_activity_log
  FOR SELECT USING (admin_user_id = auth.uid());

DROP POLICY IF EXISTS "service_role_activity_access" ON public.admin_activity_log;
CREATE POLICY "service_role_activity_access" ON public.admin_activity_log
  FOR ALL USING (auth.role() = 'service_role');

-- Grant necessary permissions to authenticated role in a minimal way
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT SELECT ON public.admin_roles TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_admin_access_internal(UUID) TO authenticated;
-- Also grant execute to admin_ops (created by 013_create_admin_ops_role.sql)
GRANT EXECUTE ON FUNCTION public.check_admin_access_internal(UUID) TO admin_ops;
