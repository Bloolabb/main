-- Create a restricted operator role for admin operations
-- This role is intended to be granted to trusted operators or CI/service accounts only.
-- It will have minimal privileges required to run admin helper functions.

DO $$
BEGIN
  -- Create role if it doesn't exist
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_ops') THEN
    EXECUTE 'CREATE ROLE admin_ops NOINHERIT;';
  END IF;
END$$;

-- Grant minimal usage on schema
GRANT USAGE ON SCHEMA public TO admin_ops;

-- Grant execute on admin helper functions if they exist
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'add_admin_user') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.add_admin_user(text, text) TO admin_ops;';
  END IF;

  IF EXISTS (SELECT 1 FROM pg_proc WHERE proname = 'check_admin_access_internal') THEN
    EXECUTE 'GRANT EXECUTE ON FUNCTION public.check_admin_access_internal(UUID) TO admin_ops;';
  END IF;
END$$;

-- Note: Assign this role to specific DB users/roles as needed with:
--   GRANT admin_ops TO some_db_user;
