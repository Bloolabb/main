-- Simple admin setup for zvmmed@gmail.com
-- Run this after the user has signed up through the normal process

-- First, let's check if the user exists and get their ID
DO $$
DECLARE
    user_uuid UUID;
BEGIN
    -- Get the user ID from auth.users table
    SELECT id INTO user_uuid 
    FROM auth.users 
    WHERE email = 'zvmmed@gmail.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Insert admin role (use ON CONFLICT to avoid duplicates)
        INSERT INTO admin_roles (user_id, role, granted_by, granted_at)
        VALUES (user_uuid, 'super_admin', user_uuid, NOW())
        ON CONFLICT (user_id) DO UPDATE SET
            role = 'super_admin',
            granted_at = NOW();
        
        RAISE NOTICE 'Admin privileges granted to zvmmed@gmail.com (ID: %)', user_uuid;
    ELSE
        RAISE NOTICE 'User zvmmed@gmail.com not found. Please sign up first through the regular signup process.';
    END IF;
END $$;
