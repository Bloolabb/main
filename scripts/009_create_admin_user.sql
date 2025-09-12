-- Fixed admin role insertion to use correct table and role values
-- Note: First sign up with zvmmed@gmail.com through the regular signup process
-- Then run this script to grant admin privileges

-- Grant admin privileges using the correct admin_roles table
INSERT INTO public.admin_roles (
  user_id,
  role,
  granted_by,
  granted_at
) VALUES (
  (SELECT id FROM auth.users WHERE email = 'zvmmed@gmail.com'),
  'super_admin',
  (SELECT id FROM auth.users WHERE email = 'zvmmed@gmail.com'),
  now()
) ON CONFLICT (user_id, role) DO NOTHING;

-- Update profile to mark as admin
UPDATE public.profiles 
SET role = 'admin'
WHERE id = (SELECT id FROM auth.users WHERE email = 'zvmmed@gmail.com');
