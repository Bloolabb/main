-- Simple admin setup for zvmmed@gmail.com
-- Run this after the user has signed up through the normal process
-- Simple admin setup helper (no hard-coded emails)
DO $$
DECLARE
    user_uuid UUID;
    v_email TEXT := current_setting('bootstrap.admin_email', true);
BEGIN
    IF v_email IS NULL OR trim(v_email) = '' THEN
        RAISE NOTICE 'No bootstrap.admin_email provided. Set the GUC or call public.add_admin_user(email, role) instead.';
        RETURN;
    END IF;

    SELECT id INTO user_uuid FROM auth.users WHERE email = v_email LIMIT 1;
    IF user_uuid IS NULL THEN
        RAISE NOTICE 'User % not found. Ensure they have signed up first.', v_email;
        RETURN;
    END IF;

    INSERT INTO public.admin_roles (user_id, role, granted_by, granted_at)
    VALUES (user_uuid, 'super_admin', user_uuid, NOW())
    ON CONFLICT (user_id, role) DO UPDATE SET granted_at = NOW();

    RAISE NOTICE 'Admin privileges granted to % (ID: %)', v_email, user_uuid;
END $$;
