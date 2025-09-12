-- Insert sample exercises for AI Fundamentals
INSERT INTO public.exercises (lesson_id, type, question, options, correct_answer, explanation, order_index) VALUES
  -- AI Definition lesson exercises
  ('770e8400-e29b-41d4-a716-446655440001', 'multiple_choice', 'What does AI stand for?', 
   '["Artificial Intelligence", "Automated Information", "Advanced Integration", "Applied Innovation"]', 
   'Artificial Intelligence', 'AI stands for Artificial Intelligence - the simulation of human intelligence in machines.', 1),
   
  ('770e8400-e29b-41d4-a716-446655440001', 'fill_blank', 'AI is the simulation of _____ intelligence in machines.', 
   NULL, 'human', 'AI aims to replicate human cognitive abilities in computer systems.', 2),
   
  -- Types of AI lesson exercises
  ('770e8400-e29b-41d4-a716-446655440002', 'multiple_choice', 'Which is an example of Narrow AI?', 
   '["A chess-playing computer", "A general-purpose robot", "Human-level AI", "Superintelligent AI"]', 
   'A chess-playing computer', 'Chess computers are designed for one specific task, making them Narrow AI.', 1),
   
  -- Business Ideas lesson exercises
  ('770e8400-e29b-41d4-a716-446655440010', 'multiple_choice', 'What is the first step in identifying business opportunities?', 
   '["Observing problems around you", "Writing a business plan", "Getting funding", "Hiring employees"]', 
   'Observing problems around you', 'Great businesses start by solving real problems people face every day.', 1),
   
  ('770e8400-e29b-41d4-a716-446655440010', 'case_study', 'Sarah notices that students at her school struggle to find study groups. What type of business opportunity is this?', 
   '["A problem-based opportunity", "A technology opportunity", "A trend opportunity", "A resource opportunity"]', 
   'A problem-based opportunity', 'Sarah identified a specific problem (difficulty finding study groups) that could be solved with a business solution.', 2)
ON CONFLICT DO NOTHING;
