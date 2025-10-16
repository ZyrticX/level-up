-- Create table for storing user consent records
CREATE TABLE IF NOT EXISTS public.user_consents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  consent_type TEXT NOT NULL CHECK (consent_type IN ('all', 'essential', 'marketing', 'analytics')),
  consent_given BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_consents ENABLE ROW LEVEL SECURITY;

-- Users can view their own consents
CREATE POLICY "Users can view their own consents"
ON public.user_consents
FOR SELECT
USING (auth.uid() = user_id OR auth.uid() IS NULL);

-- Users can insert their own consents
CREATE POLICY "Users can insert their own consents"
ON public.user_consents
FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NULL);

-- Admins can view all consents
CREATE POLICY "Admins can view all consents"
ON public.user_consents
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_user_consents_user_id ON public.user_consents(user_id);
CREATE INDEX idx_user_consents_session_id ON public.user_consents(session_id);

-- Add trigger for updated_at
CREATE TRIGGER update_user_consents_updated_at
BEFORE UPDATE ON public.user_consents
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();