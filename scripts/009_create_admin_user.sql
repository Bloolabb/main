-- Safe admin insertion. Avoid hard-coded emails in production.
-- Use the `public.add_admin_user` helper function when available, or set the bootstrap GUC and rerun.

DO $$
DECLARE
  v_email TEXT := current_setting('bootstrap.admin_email', true);
  v_user_uuid UUID;
BEGIN
  IF v_email IS NULL OR trim(v_email) = '' THEN
    RAISE NOTICE 'No bootstrap.admin_email provided. Use public.add_admin_user(email, role) or set the GUC and run this script.';
    RETURN;
  END IF;

  SELECT id INTO v_user_uuid FROM auth.users WHERE email = v_email LIMIT 1;
  IF v_user_uuid IS NULL THEN
    RAISE NOTICE 'User with email % not found. Please create the user first.', v_email;
    RETURN;
  END IF;

  INSERT INTO public.admin_roles (user_id, role, granted_by, granted_at)
  VALUES (v_user_uuid, 'super_admin', v_user_uuid, now())
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Optionally update profile metadata (if a role column exists)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='role') THEN
    UPDATE public.profiles SET role = 'admin' WHERE id = v_user_uuid;
  END IF;

  RAISE NOTICE 'Assigned super_admin to % (id: %)', v_email, v_user_uuid;
END $$;
