-- Production-ready admin bootstrap and helper function
-- Goals:
--  - Idempotent operations
--  - No hard-coded emails/secrets
--  - Transactional safety
--  - Proper logging to admin_activity_log
--  - Clear errors and input validation

-- Notes for operators:
-- Run this script from a DBA or maintenance connection. Provide the bootstrap email
-- by replacing the psql variable :BOOTSTRAP_ADMIN_EMAIL or call the function below.

-- Example (psql): \set BOOTSTRAP_ADMIN_EMAIL 'admin@example.com' \i scripts/010_fix_admin_setup.sql

-- 1) Safe one-off bootstrap: assign super_admin to an existing user by email
DO $$
DECLARE
    v_user_uuid UUID;
    v_email TEXT := current_setting('bootstrap.admin_email', true);
BEGIN
    -- If no bootstrap variable provided, skip silently to avoid accidental changes
    IF v_email IS NULL OR trim(v_email) = '' THEN
        RAISE NOTICE 'No bootstrap.admin_email provided. Skipping one-off bootstrap.';
        RETURN;
    END IF;

    -- Find user in auth.users
    SELECT id INTO v_user_uuid FROM auth.users WHERE email = v_email LIMIT 1;

    IF v_user_uuid IS NULL THEN
        RAISE NOTICE 'User with email % not found. Create the user via the app or auth admin first.', v_email;
        RETURN;
    END IF;

    -- Ensure admin_roles table exists and insert/update role atomically
    PERFORM 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_roles';
    IF NOT FOUND THEN
        RAISE EXCEPTION 'admin_roles table does not exist. Run 007_create_admin_system.sql first.';
    END IF;

    -- Use transactional upsert
    BEGIN
        INSERT INTO public.admin_roles (user_id, role, granted_by)
        VALUES (v_user_uuid, 'super_admin', v_user_uuid)
        ON CONFLICT (user_id, role) DO NOTHING;

        INSERT INTO public.admin_activity_log (admin_user_id, action, target_type, target_id, details)
        VALUES (v_user_uuid, 'bootstrap_assigned_super_admin', 'user', v_user_uuid, jsonb_build_object('email', v_email));

        RAISE NOTICE 'Bootstrap: assigned super_admin to user %', v_user_uuid;
    EXCEPTION WHEN others THEN
        RAISE WARNING 'Failed to assign bootstrap admin: %', SQLERRM;
    END;
END $$;

-- 2) Helper function to add admin users programmatically
CREATE OR REPLACE FUNCTION public.add_admin_user(user_email TEXT, admin_role TEXT DEFAULT 'super_admin')
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_user_uuid UUID;
    v_allowed_roles TEXT[] := ARRAY['super_admin','content_admin','support_admin'];
BEGIN
    -- Input validation
    IF user_email IS NULL OR trim(user_email) = '' THEN
        RAISE EXCEPTION 'user_email is required';
    END IF;

    IF NOT (admin_role = ANY(v_allowed_roles)) THEN
        RAISE EXCEPTION 'Invalid admin_role. Allowed: %', array_to_string(v_allowed_roles, ', ');
    END IF;

    SELECT id INTO v_user_uuid FROM auth.users WHERE email = user_email LIMIT 1;
    IF v_user_uuid IS NULL THEN
        RAISE EXCEPTION 'User with email % not found', user_email;
    END IF;

    -- Ensure admin_roles exists
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='admin_roles') THEN
        RAISE EXCEPTION 'admin_roles table not found. Run migration 007_create_admin_system.sql first.';
    END IF;

    -- Upsert role for given user and role combination
    INSERT INTO public.admin_roles (user_id, role, granted_by)
    VALUES (v_user_uuid, admin_role, auth.uid())
    ON CONFLICT (user_id, role) DO UPDATE
        SET granted_by = EXCLUDED.granted_by,
                granted_at = NOW();

    -- Log the change in admin_activity_log if table exists
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname='public' AND tablename='admin_activity_log') THEN
        INSERT INTO public.admin_activity_log (admin_user_id, action, target_type, target_id, details)
        VALUES (auth.uid(), 'assign_admin_role', 'user', v_user_uuid, jsonb_build_object('email', user_email, 'role', admin_role));
    END IF;
END;
$$;

-- Grant execute on helper to role postgres (operators) if desired
-- NOTE: consider granting to a restricted service role instead of broad roles in production
-- Grant execute to a restricted operator role (create admin_ops via 013_create_admin_ops_role.sql)
GRANT EXECUTE ON FUNCTION public.add_admin_user(text, text) TO admin_ops;

-- End of production-ready admin setup
