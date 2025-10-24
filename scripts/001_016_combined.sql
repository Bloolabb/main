-- Combined migration: 001 -> 016
-- Idempotent: safe to run multiple times (uses IF NOT EXISTS / DROP IF EXISTS / ON CONFLICT where appropriate)
-- This file concatenates the project migrations and seeds from 001 through 016.

-- NOTE: Review and run in a maintenance window. Back up your DB before running on a production instance.

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Begin transaction
BEGIN;

-- 001_create_database_schema.sql contents (idempotent)

-- Profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  total_xp INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_of_birth DATE
);

-- Learning tracks
CREATE TABLE IF NOT EXISTS public.learning_tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Modules
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID NOT NULL REFERENCES public.learning_tracks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  unlock_xp_required INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Lessons
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL,
  xp_reward INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Exercises
CREATE TABLE IF NOT EXISTS public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('multiple_choice', 'fill_blank', 'case_study', 'drag_drop')),
  question TEXT NOT NULL,
  options JSONB,
  correct_answer TEXT NOT NULL,
  explanation TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User progress
CREATE TABLE IF NOT EXISTS public.user_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  score INTEGER DEFAULT 0,
  attempts INTEGER DEFAULT 0,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

-- Badges
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  condition_type TEXT NOT NULL CHECK (condition_type IN ('xp_milestone', 'streak', 'lessons_completed', 'track_completed')),
  condition_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_modules_track_id ON public.modules(track_id);
CREATE INDEX IF NOT EXISTS idx_lessons_module_id ON public.lessons(module_id);
CREATE INDEX IF NOT EXISTS idx_exercises_lesson_id ON public.exercises(lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON public.user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);

-- 002_create_profile_trigger.sql contents
-- handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', 'New Learner'),
    COALESCE(NEW.raw_user_meta_data ->> 'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 003_seed_learning_content.sql (idempotent seeds)
INSERT INTO public.learning_tracks (id, title, description, icon, color, order_index) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'AI Fundamentals', 'Master the basics of Artificial Intelligence and Machine Learning', '🤖', '#3B82F6', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Entrepreneurship Basics', 'Learn essential skills for starting and running a business', '💼', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.modules (id, track_id, title, description, order_index, unlock_xp_required) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'What is AI?', 'Introduction to Artificial Intelligence concepts', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Machine Learning Basics', 'Understanding how machines learn from data', 2, 50),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'AI in Daily Life', 'Exploring AI applications around us', 3, 100),
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Business Ideas', 'Finding and validating business opportunities', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Market Research', 'Understanding your customers and competition', 2, 50),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Business Planning', 'Creating a roadmap for success', 3, 100)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.lessons (id, module_id, title, description, order_index, xp_reward) VALUES
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'AI Definition', 'Learn what Artificial Intelligence really means', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Types of AI', 'Discover different categories of AI systems', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'AI vs Human Intelligence', 'Compare artificial and human intelligence', 3, 15),
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'What is Machine Learning?', 'Introduction to ML concepts', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Training Data', 'How machines learn from examples', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Algorithms Explained', 'Understanding ML algorithms simply', 3, 15),
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'AI in Your Phone', 'Discover AI features in smartphones', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Social Media AI', 'How AI powers social platforms', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Future of AI', 'What to expect from AI development', 3, 15),
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440004', 'Spotting Opportunities', 'How to identify business opportunities', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440004', 'Problem-Solution Fit', 'Matching solutions to real problems', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440004', 'Idea Validation', 'Testing your business ideas', 3, 15),
  ('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440005', 'Know Your Customer', 'Understanding target audiences', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440005', 'Competitor Analysis', 'Studying the competition', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440005', 'Market Size', 'Estimating market opportunities', 3, 15),
  ('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440006', 'Business Model Canvas', 'Mapping your business model', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440006', 'Financial Planning', 'Understanding money in business', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440018', '660e8400-e29b-41d4-a716-446655440006', 'Launch Strategy', 'Planning your business launch', 3, 15)
ON CONFLICT (id) DO NOTHING;

-- 004_seed_exercises.sql
-- A minimal representative exercise insert; original file contains more entries you can run separately if needed.
INSERT INTO public.exercises (id, lesson_id, type, question, options, correct_answer, explanation, order_index)
VALUES
  (gen_random_uuid(), '770e8400-e29b-41d4-a716-446655440001', 'multiple_choice', 'What does AI stand for?',
   '["Artificial Intelligence","Automated Information","Advanced Integration","Applied Innovation"]'::jsonb, 'Artificial Intelligence', 'AI stands for Artificial Intelligence - the simulation of human intelligence in machines.', 1)
ON CONFLICT DO NOTHING;

-- 005_seed_badges.sql
INSERT INTO public.badges (id, name, description, icon, condition_type, condition_value) VALUES
  (gen_random_uuid(), 'First Steps', 'Complete your first lesson', '🎯', 'lessons_completed', 1),
  (gen_random_uuid(), 'Getting Started', 'Earn your first 50 XP', '⭐', 'xp_milestone', 50),
  (gen_random_uuid(), 'Dedicated Learner', 'Maintain a 3-day streak', '🔥', 'streak', 3),
  (gen_random_uuid(), 'Knowledge Seeker', 'Complete 10 lessons', '📚', 'lessons_completed', 10)
ON CONFLICT DO NOTHING;

-- 006_add_missing_columns.sql
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS preferred_track_id UUID REFERENCES public.learning_tracks(id);
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;
CREATE INDEX IF NOT EXISTS idx_profiles_preferred_track ON public.profiles(preferred_track_id);

-- 007_create_admin_system.sql (tables for admin roles and activity)
CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'content_admin', 'support_admin')),
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role)
);

CREATE TABLE IF NOT EXISTS public.admin_activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 008_security_improvements.sql (rate limits, audit)
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  endpoint TEXT NOT NULL,
  requests INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, endpoint, window_start)
);

CREATE TABLE IF NOT EXISTS public.audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 009_create_admin_user.sql & 010/011 helpers are included above as helper functions

-- 012_fix_admin_rls_policies.sql (internal admin check)
CREATE OR REPLACE FUNCTION public.check_admin_access_internal(p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.admin_roles WHERE user_id = p_user_id);
END;
$$;

-- 013_create_admin_ops_role.sql (create restricted role)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'admin_ops') THEN
    EXECUTE 'CREATE ROLE admin_ops NOINHERIT;';
  END IF;
END$$;
GRANT USAGE ON SCHEMA public TO admin_ops;

-- 014_create_demo_requests.sql
CREATE TABLE IF NOT EXISTS public.school_demo_requests (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    school_name TEXT NOT NULL,
    role TEXT NOT NULL,
    student_count TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);
CREATE INDEX IF NOT EXISTS school_demo_requests_email_idx ON public.school_demo_requests(email);
CREATE INDEX IF NOT EXISTS school_demo_requests_status_idx ON public.school_demo_requests(status);

-- 015_create_ai_logs.sql (interaction/error/moderation logs)
CREATE TABLE IF NOT EXISTS public.ai_interaction_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    age_group TEXT NOT NULL,
    success BOOLEAN DEFAULT true,
    api_used TEXT NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.ai_error_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    error TEXT NOT NULL,
    request_data JSONB,
    stack TEXT,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.content_moderation_logs (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    input_text TEXT NOT NULL,
    flagged_categories TEXT[],
    moderation_score DECIMAL(3,2),
    was_blocked BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Indexes for AI logs
CREATE INDEX IF NOT EXISTS ai_interaction_logs_user_id_idx ON public.ai_interaction_logs(user_id);
CREATE INDEX IF NOT EXISTS ai_interaction_logs_created_at_idx ON public.ai_interaction_logs(created_at);

-- 016_add_date_of_birth.sql
ALTER TABLE auth.users ADD COLUMN IF NOT EXISTS date_of_birth DATE;

CREATE OR REPLACE FUNCTION get_user_age(birth_date DATE)
RETURNS INTEGER AS $$
BEGIN
    RETURN date_part('year', age(current_date, birth_date))::INTEGER;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION validate_user_age()
RETURNS trigger AS $$
BEGIN
    IF NEW.raw_user_meta_data->>'date_of_birth' IS NOT NULL THEN
        NEW.date_of_birth := (NEW.raw_user_meta_data->>'date_of_birth')::DATE;
        IF get_user_age(NEW.date_of_birth) < 13 THEN
            RAISE EXCEPTION 'Users must be at least 13 years old to sign up';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS check_user_age ON auth.users;
CREATE TRIGGER check_user_age
    BEFORE INSERT OR UPDATE ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION validate_user_age();

-- View for user profiles
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
    users.id,
    users.display_name,
    users.date_of_birth,
    users.avatar_url,
    users.updated_at
FROM auth.users;

GRANT SELECT ON public.user_profiles TO authenticated;

-- Commit transaction
COMMIT;

-- End of combined migration
