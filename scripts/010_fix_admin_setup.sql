-- First, let's check if the user exists and create admin role
-- Replace 'zvmmed@gmail.com' with the actual email you used to sign up

-- Create a more robust admin setup that handles the user lookup properly
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Find the user by email in auth.users
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'zvmmed@gmail.com';
    
    -- If user exists, create admin role
    IF user_uuid IS NOT NULL THEN
        -- Insert admin role (ignore if already exists)
        INSERT INTO admin_roles (user_id, role, created_by)
        VALUES (user_uuid, 'super_admin', user_uuid)
        ON CONFLICT (user_id) DO UPDATE SET
            role = 'super_admin',
            updated_at = NOW();
            
        RAISE NOTICE 'Admin role assigned to user: %', user_uuid;
    ELSE
        RAISE NOTICE 'User with email zvmmed@gmail.com not found. Please sign up first.';
    END IF;
END $$;

-- Also create a function to easily add admin users in the future
CREATE OR REPLACE FUNCTION add_admin_user(user_email TEXT, admin_role TEXT DEFAULT 'super_admin')
RETURNS TEXT AS $$
DECLARE
    user_uuid UUID;
    result_message TEXT;
BEGIN
    -- Validate role
    IF admin_role NOT IN ('super_admin', 'content_admin', 'support_admin') THEN
        RETURN 'Invalid role. Must be: super_admin, content_admin, or support_admin';
    END IF;
    
    -- Find user
    SELECT id INTO user_uuid FROM auth.users WHERE email = user_email;
    
    IF user_uuid IS NULL THEN
        RETURN 'User not found. Please ensure the user has signed up first.';
    END IF;
    
    -- Add admin role
    INSERT INTO admin_roles (user_id, role, created_by)
    VALUES (user_uuid, admin_role, user_uuid)
    ON CONFLICT (user_id) DO UPDATE SET
        role = admin_role,
        updated_at = NOW();
    
    RETURN 'Admin role ' || admin_role || ' assigned successfully to ' || user_email;
END;
$$ LANGUAGE plpgsql;
