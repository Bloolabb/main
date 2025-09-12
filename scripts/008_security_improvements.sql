-- Add security improvements and indexes for performance

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_profiles_total_xp ON profiles(total_xp DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_current_streak ON profiles(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_lesson ON user_progress(user_id, lesson_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(completed, completed_at);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_user_time ON admin_activity_log(admin_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_earned ON user_badges(user_id, earned_at DESC);

-- Add rate limiting table for API security
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL, -- IP address or user ID
  endpoint TEXT NOT NULL,
  requests INTEGER DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(identifier, endpoint, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Rate limits policies (admin only)
CREATE POLICY "admins_can_view_rate_limits" ON public.rate_limits
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid()
    )
  );

-- Add function to clean old rate limit records
CREATE OR REPLACE FUNCTION public.cleanup_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM public.rate_limits 
  WHERE created_at < NOW() - INTERVAL '1 hour';
END;
$$;

-- Add function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_endpoint TEXT,
  p_limit INTEGER DEFAULT 100,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_window TIMESTAMP WITH TIME ZONE;
  current_requests INTEGER;
BEGIN
  -- Calculate current window start
  current_window := DATE_TRUNC('hour', NOW()) + 
    (EXTRACT(MINUTE FROM NOW())::INTEGER / p_window_minutes) * 
    (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current request count for this window
  SELECT requests INTO current_requests
  FROM public.rate_limits
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start = current_window;
  
  -- If no record exists, create one
  IF current_requests IS NULL THEN
    INSERT INTO public.rate_limits (identifier, endpoint, window_start, requests)
    VALUES (p_identifier, p_endpoint, current_window, 1)
    ON CONFLICT (identifier, endpoint, window_start) 
    DO UPDATE SET requests = rate_limits.requests + 1;
    RETURN TRUE;
  END IF;
  
  -- Check if limit exceeded
  IF current_requests >= p_limit THEN
    RETURN FALSE;
  END IF;
  
  -- Increment counter
  UPDATE public.rate_limits 
  SET requests = requests + 1
  WHERE identifier = p_identifier 
    AND endpoint = p_endpoint 
    AND window_start = current_window;
  
  RETURN TRUE;
END;
$$;

-- Add audit log for sensitive operations
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

-- Enable RLS on audit log
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;

-- Audit log policies (admin only)
CREATE POLICY "admins_can_view_audit_log" ON public.audit_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.admin_roles ar 
      WHERE ar.user_id = auth.uid()
    )
  );

-- Add trigger function for audit logging
CREATE OR REPLACE FUNCTION public.audit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_log (action, table_name, record_id, old_values)
    VALUES (TG_OP, TG_TABLE_NAME, OLD.id, row_to_json(OLD));
    RETURN OLD;
  ELSIF TG_OP = 'UPDATE' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, old_values, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
    RETURN NEW;
  ELSIF TG_OP = 'INSERT' THEN
    INSERT INTO public.audit_log (user_id, action, table_name, record_id, new_values)
    VALUES (auth.uid(), TG_OP, TG_TABLE_NAME, NEW.id, row_to_json(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$$;

-- Add audit triggers to sensitive tables
DROP TRIGGER IF EXISTS audit_profiles ON profiles;
CREATE TRIGGER audit_profiles
  AFTER INSERT OR UPDATE OR DELETE ON profiles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();

DROP TRIGGER IF EXISTS audit_admin_roles ON admin_roles;
CREATE TRIGGER audit_admin_roles
  AFTER INSERT OR UPDATE OR DELETE ON admin_roles
  FOR EACH ROW EXECUTE FUNCTION audit_trigger();
