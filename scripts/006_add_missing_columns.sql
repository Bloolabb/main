-- Add preferred_track_id column to profiles table for onboarding
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS preferred_track_id UUID REFERENCES learning_tracks(id);

-- Add avatar_url column if not exists
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_track ON public.profiles(preferred_track_id);

-- Update RLS policy to allow reading preferred track
DROP POLICY IF EXISTS "Users can view their preferred track" ON public.profiles;
CREATE POLICY "Users can view their preferred track" ON public.profiles
  FOR SELECT USING (auth.uid() = id);
