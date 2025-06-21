
-- Create user_personalization table
CREATE TABLE public.user_personalization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_dark_mode BOOLEAN DEFAULT false,
  color_name TEXT DEFAULT 'Verde Safeboy',
  primary_color TEXT DEFAULT '#0d9488',
  secondary_color TEXT DEFAULT '#14b8a6',
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies
ALTER TABLE public.user_personalization ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own personalization settings
CREATE POLICY "Users can view their own personalization" 
  ON public.user_personalization 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy for users to insert their own personalization settings
CREATE POLICY "Users can create their own personalization" 
  ON public.user_personalization 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy for users to update their own personalization settings
CREATE POLICY "Users can update their own personalization" 
  ON public.user_personalization 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy for users to delete their own personalization settings
CREATE POLICY "Users can delete their own personalization" 
  ON public.user_personalization 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create storage bucket for user logos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-logos', 'user-logos', true);

-- Create policy to allow authenticated users to upload their logos
CREATE POLICY "Users can upload their own logos" 
  ON storage.objects 
  FOR INSERT 
  WITH CHECK (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow public access to logos
CREATE POLICY "Public access to user logos" 
  ON storage.objects 
  FOR SELECT 
  USING (bucket_id = 'user-logos');

-- Create policy to allow users to update their own logos
CREATE POLICY "Users can update their own logos" 
  ON storage.objects 
  FOR UPDATE 
  USING (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policy to allow users to delete their own logos
CREATE POLICY "Users can delete their own logos" 
  ON storage.objects 
  FOR DELETE 
  USING (bucket_id = 'user-logos' AND auth.uid()::text = (storage.foldername(name))[1]);
