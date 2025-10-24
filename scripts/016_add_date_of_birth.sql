-- Add date_of_birth column to auth.users
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

-- Create a function to get user's age
CREATE OR REPLACE FUNCTION get_user_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN date_part('year', age(current_date, birth_date))::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to validate age during sign up
CREATE OR REPLACE FUNCTION validate_user_age()
RETURNS trigger AS $$
BEGIN
    IF NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL THEN
        -- Convert the date_of_birth from metadata to proper DATE type
        NEW.date_of_birth := (NEW.raw_user_meta_data->>'date_of_birth')::DATE;
        
        -- Check if user is at least 13 years old
        IF get_user_age(NEW.date_of_birth) < 13 THEN
            RAISE EXCEPTION 'Users must be at least 13 years old to sign up';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to validate age on user creation
DROP TRIGGER IF EXISTS check_user_age ON auth.users;
CREATE TRIGGER check_user_age
    BEFORE INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_age();

-- Create or update RLS policy for accessing date_of_birth
CREATE POLICY IF NOT EXISTS "Users can see their own date of birth"
    ON auth.users
    FOR SELECT
    USING (auth.uid() = id);

-- Add date_of_birth to profile view for easier access
DROP VIEW IF EXISTS public.user_profiles;
CREATE VIEW public.user_profiles AS
SELECT 
    users.id,
    users.display_name,
    users.date_of_birth,
    users.avatar_url,
    users.updated_at
FROM auth.users;

-- Grant necessary permissions
GRANT SELECT ON public.user_profiles TO authenticated;
REVOKE ALL ON FUNCTION get_user_age(DATE) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_user_age(DATE) TO authenticated;

COMMENT ON COLUMN auth.users.date_of_birth IS 'User''s date of birth, stored as DATE type';
COMMENT ON FUNCTION get_user_age IS 'Calculates the age of a user based on their date of birth';
COMMENT ON FUNCTION validate_user_age IS 'Validates that users are at least 13 years old during sign up';