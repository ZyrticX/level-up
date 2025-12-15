-- Migration: Add Hetzner video streaming support
-- This adds fields for Hetzner server paths and video access tokens

-- Add Hetzner-specific columns to videos table
ALTER TABLE videos 
ADD COLUMN IF NOT EXISTS hetzner_path TEXT,
ADD COLUMN IF NOT EXISTS hls_path TEXT,
ADD COLUMN IF NOT EXISTS is_preview BOOLEAN DEFAULT false;

-- Create video access tokens table for secure streaming
CREATE TABLE IF NOT EXISTS video_access_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES videos(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  used_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_access_tokens_token ON video_access_tokens(token);
CREATE INDEX IF NOT EXISTS idx_video_access_tokens_expires ON video_access_tokens(expires_at);
CREATE INDEX IF NOT EXISTS idx_video_access_tokens_user ON video_access_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_hetzner_path ON videos(hetzner_path);

-- Enable RLS
ALTER TABLE video_access_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for video_access_tokens
CREATE POLICY "Users can view their own tokens" ON video_access_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create their own tokens" ON video_access_tokens
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can manage all tokens" ON video_access_tokens
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() 
      AND role = 'admin'
    )
  );

-- Function to generate secure video token
CREATE OR REPLACE FUNCTION generate_video_token(
  p_user_id UUID,
  p_video_id UUID,
  p_ip_address TEXT DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_expires_in_minutes INTEGER DEFAULT 120
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_token TEXT;
  v_has_access BOOLEAN;
BEGIN
  -- Check if user has access to the video's course
  SELECT EXISTS (
    SELECT 1 FROM course_enrollments ce
    JOIN videos v ON v.course_id = ce.course_id
    WHERE v.id = p_video_id 
    AND ce.user_id = p_user_id 
    AND ce.payment_status = 'completed'
  ) OR EXISTS (
    SELECT 1 FROM videos v
    WHERE v.id = p_video_id 
    AND v.is_preview = true
  ) INTO v_has_access;
  
  IF NOT v_has_access THEN
    RAISE EXCEPTION 'User does not have access to this video';
  END IF;
  
  -- Generate unique token
  v_token := encode(gen_random_bytes(32), 'hex');
  
  -- Insert token record
  INSERT INTO video_access_tokens (user_id, video_id, token, ip_address, user_agent, expires_at)
  VALUES (p_user_id, p_video_id, v_token, p_ip_address, p_user_agent, now() + (p_expires_in_minutes || ' minutes')::INTERVAL);
  
  RETURN v_token;
END;
$$;

-- Function to validate video token (called by Nginx via API)
CREATE OR REPLACE FUNCTION validate_video_token(
  p_token TEXT,
  p_video_id UUID DEFAULT NULL,
  p_ip_address TEXT DEFAULT NULL
)
RETURNS TABLE (
  is_valid BOOLEAN,
  user_id UUID,
  video_id UUID,
  hetzner_path TEXT,
  hls_path TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN vat.id IS NULL THEN false
      WHEN vat.expires_at < now() THEN false
      WHEN p_ip_address IS NOT NULL AND vat.ip_address IS NOT NULL AND vat.ip_address != p_ip_address THEN false
      ELSE true
    END AS is_valid,
    vat.user_id,
    vat.video_id,
    v.hetzner_path,
    v.hls_path
  FROM video_access_tokens vat
  JOIN videos v ON v.id = vat.video_id
  WHERE vat.token = p_token
  AND (p_video_id IS NULL OR vat.video_id = p_video_id);
  
  -- Update used_at timestamp
  UPDATE video_access_tokens 
  SET used_at = now() 
  WHERE token = p_token;
END;
$$;

-- Function to clean up expired tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_video_tokens()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM video_access_tokens WHERE expires_at < now();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Comments for documentation
COMMENT ON TABLE video_access_tokens IS 'Stores temporary access tokens for secure video streaming from Hetzner server';
COMMENT ON COLUMN videos.hetzner_path IS 'Path to video file on Hetzner server (e.g., /videos/course-1/lesson-1.mp4)';
COMMENT ON COLUMN videos.hls_path IS 'Path to HLS manifest file on Hetzner server (e.g., /videos/course-1/lesson-1/index.m3u8)';
COMMENT ON COLUMN videos.is_preview IS 'If true, video is accessible without enrollment (free preview)';


