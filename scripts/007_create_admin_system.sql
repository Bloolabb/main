-- Create admin roles table
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'support_admin')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

-- Enable RLS on admin_roles
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

-- Admin roles policies - only super admins can manage roles
CREATE POLICY "super_admins_can_view_all_roles" ON public.admin_roles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

CREATE POLICY "super_admins_can_insert_roles" ON public.admin_roles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

CREATE POLICY "super_admins_can_update_roles" ON public.admin_roles
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

CREATE POLICY "super_admins_can_delete_roles" ON public.admin_roles
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid() AND ar.role = 'super_admin'
    )
  );

-- Create admin activity log
CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on admin activity log
ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Admin activity log policies
CREATE POLICY "admins_can_view_activity_log" ON public.admin_activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid()
    )
  );

CREATE POLICY "admins_can_insert_activity_log" ON public.admin_activity_log
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid()
    )
  );

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = is_admin.user_id
  );
END;
$$;

-- Create function to check specific admin role
CREATE OR REPLACE FUNCTION public.has_admin_role(role_name TEXT, user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_roles 
    WHERE admin_roles.user_id = has_admin_role.user_id 
    AND admin_roles.role = role_name
  );
END;
$$;

-- Insert initial super admin (replace with your email)
-- This will need to be updated with the actual admin email after signup
-- INSERT INTO public.admin_roles (user_id, role, granted_by) 
-- SELECT id, 'super_admin', id FROM auth.users WHERE email = 'admin@bloolabb.com';
