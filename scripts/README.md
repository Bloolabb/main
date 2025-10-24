SUMMARY

This README summarizes the production hardening and fixes applied to the SQL migration and helper scripts in the `scripts/` folder.

Migration Scripts

1. 014_create_demo_requests.sql
   - Creates school_demo_requests table for managing demo requests from schools
   - Includes RLS policies for secure access control
   - Adds realtime pub/sub support
   - Creates indexes for performance optimization

2. Earlier Migrations & Changes

3. Idempotency and safety
   - Added `DROP POLICY IF EXISTS` before `CREATE POLICY` where appropriate so policies can be re-applied without error.
   - Ensured `ON CONFLICT` or `ON CONFLICT DO NOTHING` on seed inserts where relevant for idempotent seeds.
   - Added `CREATE EXTENSION IF NOT EXISTS pgcrypto;` to ensure `gen_random_uuid()` is available in environments that allow it.
   - Used `DROP TRIGGER IF EXISTS` before creating triggers.

2. Removed hard-coded secrets/emails
   - Replaced hard-coded admin email occurrences with a safe bootstrap mechanism using a runtime GUC `bootstrap.admin_email` and/or the helper function `public.add_admin_user(email, role)` for programmatic assignment.
   - Scripts that previously referenced `zvmmed@gmail.com` now read the GUC or instruct operators to use `public.add_admin_user`.

3. Transactional and logged operations
   - Wrapped one-off bootstrap steps in `DO $$ ... $$` blocks with exception handling to avoid leaving the DB in a bad state.
   - Admin role assignments now log to `public.admin_activity_log` when available.
   - Helper `public.add_admin_user` is a `SECURITY DEFINER` function that validates inputs and writes to `admin_activity_log`.

4. RLS and security improvements
   - Fixed admin RLS recursion by adding a SECURITY DEFINER helper `public.check_admin_access_internal(p_user_id UUID)` and using safer policies.
   - Ensured RLS is re-enabled after safe bootstrap insertion.
   - Added minimal grants (and notes) and recommended restricting function execution to a small operator role instead of broad roles.

Files modified (high level)
- `001_create_database_schema.sql` — added `pgcrypto` extension, made RLS policies idempotent.
- `002_create_profile_trigger.sql` — made trigger installation idempotent.
- `009_create_admin_user.sql` — replaced hard-coded bootstrap with GUC-driven DO block; idempotent insertion.
- `010_fix_admin_setup.sql` — added production-ready helper `public.add_admin_user`, logging and bootstrap GUC support.
- `011_simple_admin_setup.sql` — removed hard-coded email and used bootstrap GUC-driven DO block.
- `012_fix_admin_rls_policies.sql` — idempotent policy recreation, added secure internal admin check function and bootstrap insert via GUC.
- `012_fix_admin_rls_policies.sql` — idempotent policy recreation, added secure internal admin check function and bootstrap insert via GUC.
- `013_create_admin_ops_role.sql` — new migration that creates a restricted `admin_ops` role and grants it execute on admin helper functions if present.

How to run (safe recommended approach)

1) Backup first
   Always take a DB snapshot or pg_dump of relevant schemas before running migration scripts in production.

2) Preferred (programmatic) approach
   - Use the helper function to grant admin:

```sql
-- Run this from a secure admin DB session
SELECT public.add_admin_user('admin@example.com', 'super_admin');
```

3) One-off bootstrap using psql GUC (if helper is not available yet)

```psql
\set bootstrap.admin_email 'admin@example.com'
\i scripts/012_fix_admin_rls_policies.sql    -- if you need to fix RLS first
\i scripts/010_fix_admin_setup.sql          -- assigns role and defines helper
\i scripts/009_create_admin_user.sql        -- idempotent insert using GUC (optional)
\i scripts/013_create_admin_ops_role.sql    -- create restricted operator role (run after functions exist)
```
