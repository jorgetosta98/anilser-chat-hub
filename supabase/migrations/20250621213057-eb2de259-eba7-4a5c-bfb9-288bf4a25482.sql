
-- First, let's add the user_id column as nullable
ALTER TABLE public.knowledge_documents 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Update existing documents to assign them to the first available user
-- If no users exist, we'll handle this in the application code
UPDATE public.knowledge_documents 
SET user_id = (
  SELECT auth.users.id 
  FROM auth.users 
  LIMIT 1
)
WHERE user_id IS NULL;

-- Only make user_id NOT NULL if we have users in the system
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN
    ALTER TABLE public.knowledge_documents 
    ALTER COLUMN user_id SET NOT NULL;
  END IF;
END $$;

-- Create RLS policies for knowledge_documents
CREATE POLICY "Users can view their own knowledge documents" 
  ON public.knowledge_documents 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own knowledge documents" 
  ON public.knowledge_documents 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own knowledge documents" 
  ON public.knowledge_documents 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own knowledge documents" 
  ON public.knowledge_documents 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create table for user frequent questions
CREATE TABLE public.user_frequent_questions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  conversation_id UUID REFERENCES public.conversations(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_positive BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user_frequent_questions
ALTER TABLE public.user_frequent_questions ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_frequent_questions
CREATE POLICY "Users can view their own frequent questions" 
  ON public.user_frequent_questions 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own frequent questions" 
  ON public.user_frequent_questions 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own frequent questions" 
  ON public.user_frequent_questions 
  FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own frequent questions" 
  ON public.user_frequent_questions 
  FOR DELETE 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_knowledge_documents_user_id ON public.knowledge_documents(user_id);
CREATE INDEX idx_user_frequent_questions_user_id ON public.user_frequent_questions(user_id);
CREATE INDEX idx_user_frequent_questions_positive ON public.user_frequent_questions(user_id, is_positive, created_at DESC);

-- Trigger to update updated_at on user_frequent_questions
CREATE TRIGGER update_user_frequent_questions_updated_at
    BEFORE UPDATE ON public.user_frequent_questions
    FOR EACH ROW
    EXECUTE FUNCTION update_knowledge_updated_at();
