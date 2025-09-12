-- Insert achievement badges
INSERT INTO public.badges (name, description, icon, condition_type, condition_value) VALUES
  ('First Steps', 'Complete your first lesson', '🎯', 'lessons_completed', 1),
  ('Getting Started', 'Earn your first 50 XP', '⭐', 'xp_milestone', 50),
  ('Dedicated Learner', 'Maintain a 3-day streak', '🔥', 'streak', 3),
  ('Knowledge Seeker', 'Complete 10 lessons', '📚', 'lessons_completed', 10),
  ('XP Master', 'Earn 500 XP', '💎', 'xp_milestone', 500),
  ('Streak Champion', 'Maintain a 7-day streak', '🏆', 'streak', 7),
  ('AI Explorer', 'Complete the AI Fundamentals track', '🤖', 'track_completed', 1),
  ('Future Entrepreneur', 'Complete the Entrepreneurship Basics track', '💼', 'track_completed', 2),
  ('Overachiever', 'Earn 1000 XP', '🌟', 'xp_milestone', 1000),
  ('Consistency King', 'Maintain a 30-day streak', '👑', 'streak', 30)
ON CONFLICT DO NOTHING;
