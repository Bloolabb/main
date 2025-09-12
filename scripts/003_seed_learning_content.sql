-- Insert learning tracks
INSERT INTO public.learning_tracks (id, title, description, icon, color, order_index) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'AI Fundamentals', 'Master the basics of Artificial Intelligence and Machine Learning', '🤖', '#3B82F6', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Entrepreneurship Basics', 'Learn essential skills for starting and running a business', '💼', '#10B981', 2)
ON CONFLICT (id) DO NOTHING;

-- Insert AI Fundamentals modules
INSERT INTO public.modules (id, track_id, title, description, order_index, unlock_xp_required) VALUES
  ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'What is AI?', 'Introduction to Artificial Intelligence concepts', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Machine Learning Basics', 'Understanding how machines learn from data', 2, 50),
  ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', 'AI in Daily Life', 'Exploring AI applications around us', 3, 100)
ON CONFLICT (id) DO NOTHING;

-- Insert Entrepreneurship modules
INSERT INTO public.modules (id, track_id, title, description, order_index, unlock_xp_required) VALUES
  ('660e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'Business Ideas', 'Finding and validating business opportunities', 1, 0),
  ('660e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', 'Market Research', 'Understanding your customers and competition', 2, 50),
  ('660e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', 'Business Planning', 'Creating a roadmap for success', 3, 100)
ON CONFLICT (id) DO NOTHING;

-- Insert AI Fundamentals lessons
INSERT INTO public.lessons (id, module_id, title, description, order_index, xp_reward) VALUES
  -- What is AI? module lessons
  ('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'AI Definition', 'Learn what Artificial Intelligence really means', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Types of AI', 'Discover different categories of AI systems', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'AI vs Human Intelligence', 'Compare artificial and human intelligence', 3, 15),
  
  -- Machine Learning Basics lessons
  ('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440002', 'What is Machine Learning?', 'Introduction to ML concepts', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440002', 'Training Data', 'How machines learn from examples', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440002', 'Algorithms Explained', 'Understanding ML algorithms simply', 3, 15),
  
  -- AI in Daily Life lessons
  ('770e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440003', 'AI in Your Phone', 'Discover AI features in smartphones', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440008', '660e8400-e29b-41d4-a716-446655440003', 'Social Media AI', 'How AI powers social platforms', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440009', '660e8400-e29b-41d4-a716-446655440003', 'Future of AI', 'What to expect from AI development', 3, 15)
ON CONFLICT (id) DO NOTHING;

-- Insert Entrepreneurship lessons
INSERT INTO public.lessons (id, module_id, title, description, order_index, xp_reward) VALUES
  -- Business Ideas lessons
  ('770e8400-e29b-41d4-a716-446655440010', '660e8400-e29b-41d4-a716-446655440004', 'Spotting Opportunities', 'How to identify business opportunities', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440011', '660e8400-e29b-41d4-a716-446655440004', 'Problem-Solution Fit', 'Matching solutions to real problems', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440012', '660e8400-e29b-41d4-a716-446655440004', 'Idea Validation', 'Testing your business ideas', 3, 15),
  
  -- Market Research lessons
  ('770e8400-e29b-41d4-a716-446655440013', '660e8400-e29b-41d4-a716-446655440005', 'Know Your Customer', 'Understanding target audiences', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440014', '660e8400-e29b-41d4-a716-446655440005', 'Competitor Analysis', 'Studying the competition', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440015', '660e8400-e29b-41d4-a716-446655440005', 'Market Size', 'Estimating market opportunities', 3, 15),
  
  -- Business Planning lessons
  ('770e8400-e29b-41d4-a716-446655440016', '660e8400-e29b-41d4-a716-446655440006', 'Business Model Canvas', 'Mapping your business model', 1, 10),
  ('770e8400-e29b-41d4-a716-446655440017', '660e8400-e29b-41d4-a716-446655440006', 'Financial Planning', 'Understanding money in business', 2, 10),
  ('770e8400-e29b-41d4-a716-446655440018', '660e8400-e29b-41d4-a716-446655440006', 'Launch Strategy', 'Planning your business launch', 3, 15)
ON CONFLICT (id) DO NOTHING;
