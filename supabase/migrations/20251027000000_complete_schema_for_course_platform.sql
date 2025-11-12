-- Migration: Complete Schema for Course Platform
-- Created: 2025-10-27
-- Description: טבלאות מלאות למערכת ניהול קורסים עם תשלומים, סרטונים, והתקדמות

-- ========================================
-- 1. Videos Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.course_chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0, -- משך בשניות
  order_index INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_videos_course_id ON public.videos(course_id);
CREATE INDEX IF NOT EXISTS idx_videos_chapter_id ON public.videos(chapter_id);
CREATE INDEX IF NOT EXISTS idx_videos_order ON public.videos(course_id, order_index);
CREATE INDEX IF NOT EXISTS idx_videos_published ON public.videos(is_published);

-- RLS
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view published videos metadata"
ON public.videos FOR SELECT
USING (is_published = true);

CREATE POLICY "Admins can manage videos"
ON public.videos FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 2. Course Enrollments Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT,
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  discount_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_status ON public.course_enrollments(payment_status);
CREATE INDEX IF NOT EXISTS idx_enrollments_user_course ON public.course_enrollments(user_id, course_id);

-- RLS
ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all enrollments"
ON public.course_enrollments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create enrollments"
ON public.course_enrollments FOR INSERT
WITH CHECK (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update enrollments"
ON public.course_enrollments FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger
CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 3. Video Progress Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_duration INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, video_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.video_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_progress_video_id ON public.video_progress(video_id);
CREATE INDEX IF NOT EXISTS idx_progress_completed ON public.video_progress(completed);

-- RLS
ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.video_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.video_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.video_progress FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all progress"
ON public.video_progress FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- ========================================
-- 4. Payments Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  payment_provider TEXT NOT NULL,
  provider_payment_id TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  failure_reason TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_enrollment_id ON public.payments(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_payments_provider_id ON public.payments(provider_payment_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
ON public.payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "System can create payments"
ON public.payments FOR INSERT
WITH CHECK (true); -- Edge functions will handle this

-- Trigger
CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 5. Discount Codes Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL,
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_to TIMESTAMPTZ,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  applicable_courses UUID[],
  min_purchase_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_discount_codes_active ON public.discount_codes(is_active);
CREATE INDEX IF NOT EXISTS idx_discount_codes_validity ON public.discount_codes(valid_from, valid_to);

-- RLS
ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active discount codes"
ON public.discount_codes FOR SELECT
USING (is_active = true AND (valid_to IS NULL OR valid_to > now()));

CREATE POLICY "Admins can manage discount codes"
ON public.discount_codes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger
CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 6. Course Reviews Table
-- ========================================
CREATE TABLE IF NOT EXISTS public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON public.course_reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_published ON public.course_reviews(is_published);

-- RLS
ALTER TABLE public.course_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view published reviews"
ON public.course_reviews FOR SELECT
USING (is_published = true);

CREATE POLICY "Users can create their own reviews"
ON public.course_reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
ON public.course_reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all reviews"
ON public.course_reviews FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger
CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.course_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- ========================================
-- 7. Database Functions
-- ========================================

-- Function: Check if user has access to course
CREATE OR REPLACE FUNCTION public.check_user_has_access(
  _user_id UUID,
  _course_id UUID
)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.course_enrollments
    WHERE user_id = _user_id
      AND course_id = _course_id
      AND payment_status = 'completed'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get course progress percentage
CREATE OR REPLACE FUNCTION public.get_course_progress(
  _user_id UUID,
  _course_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  total_videos INTEGER;
  completed_videos INTEGER;
BEGIN
  SELECT COUNT(*)
  INTO total_videos
  FROM public.videos
  WHERE course_id = _course_id AND is_published = true;
  
  IF total_videos = 0 THEN
    RETURN 0;
  END IF;
  
  SELECT COUNT(*)
  INTO completed_videos
  FROM public.video_progress vp
  JOIN public.videos v ON v.id = vp.video_id
  WHERE vp.user_id = _user_id
    AND v.course_id = _course_id
    AND vp.completed = true;
  
  RETURN (completed_videos::DECIMAL / total_videos::DECIMAL) * 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Validate discount code
CREATE OR REPLACE FUNCTION public.validate_discount_code(
  _code TEXT,
  _course_id UUID,
  _purchase_amount DECIMAL
)
RETURNS TABLE(
  is_valid BOOLEAN,
  discount_amount DECIMAL,
  error_message TEXT
) AS $$
DECLARE
  discount_record RECORD;
  calculated_discount DECIMAL;
BEGIN
  SELECT * INTO discount_record
  FROM public.discount_codes
  WHERE code = _code
    AND is_active = true
    AND (valid_to IS NULL OR valid_to > now())
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'קוד קופון לא תקף או פג תוקף'::TEXT;
    RETURN;
  END IF;
  
  IF discount_record.applicable_courses IS NOT NULL AND 
     NOT (_course_id = ANY(discount_record.applicable_courses)) THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'קוד קופון לא תקף לקורס זה'::TEXT;
    RETURN;
  END IF;
  
  IF discount_record.min_purchase_amount IS NOT NULL AND 
     _purchase_amount < discount_record.min_purchase_amount THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 
      format('נדרש סכום מינימלי של %s ש"ח', discount_record.min_purchase_amount)::TEXT;
    RETURN;
  END IF;
  
  IF discount_record.discount_type = 'percentage' THEN
    calculated_discount := (_purchase_amount * discount_record.discount_value) / 100;
  ELSE
    calculated_discount := discount_record.discount_value;
  END IF;
  
  IF calculated_discount > _purchase_amount THEN
    calculated_discount := _purchase_amount;
  END IF;
  
  RETURN QUERY SELECT true, calculated_discount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get user's enrolled courses with progress
CREATE OR REPLACE FUNCTION public.get_user_courses_with_progress(_user_id UUID)
RETURNS TABLE(
  course_id UUID,
  course_title TEXT,
  enrolled_at TIMESTAMPTZ,
  progress_percentage DECIMAL,
  total_videos INTEGER,
  completed_videos INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.id as course_id,
    c.title as course_title,
    e.enrolled_at,
    COALESCE(public.get_course_progress(_user_id, c.id), 0) as progress_percentage,
    (SELECT COUNT(*) FROM public.videos WHERE course_id = c.id AND is_published = true)::INTEGER as total_videos,
    (SELECT COUNT(*) FROM public.video_progress vp 
     JOIN public.videos v ON v.id = vp.video_id 
     WHERE vp.user_id = _user_id AND v.course_id = c.id AND vp.completed = true)::INTEGER as completed_videos
  FROM public.course_enrollments e
  JOIN public.courses c ON c.id = e.course_id
  WHERE e.user_id = _user_id
    AND e.payment_status = 'completed'
  ORDER BY e.enrolled_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 8. Update existing courses table
-- ========================================

-- הוספת עמודות חסרות לטבלת courses (אם לא קיימות)
DO $$ 
BEGIN
  -- Add total_duration column if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='courses' AND column_name='total_duration') THEN
    ALTER TABLE public.courses ADD COLUMN total_duration INTEGER DEFAULT 0;
  END IF;
  
  -- Add students_enrolled column if not exists  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name='courses' AND column_name='students_enrolled') THEN
    ALTER TABLE public.courses ADD COLUMN students_enrolled INTEGER DEFAULT 0;
  END IF;
END $$;

-- Function: Update course statistics
CREATE OR REPLACE FUNCTION public.update_course_statistics(_course_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.courses
  SET 
    total_duration = (
      SELECT COALESCE(SUM(duration), 0)
      FROM public.videos
      WHERE course_id = _course_id AND is_published = true
    ),
    students_enrolled = (
      SELECT COUNT(*)
      FROM public.course_enrollments
      WHERE course_id = _course_id AND payment_status = 'completed'
    ),
    updated_at = now()
  WHERE id = _course_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 9. Triggers for automatic updates
-- ========================================

-- Trigger: Update course statistics when enrollment changes
CREATE OR REPLACE FUNCTION public.update_course_stats_on_enrollment()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.update_course_statistics(NEW.course_id);
  END IF;
  IF TG_OP = 'DELETE' THEN
    PERFORM public.update_course_statistics(OLD.course_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_stats_enrollment
AFTER INSERT OR UPDATE OR DELETE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_course_stats_on_enrollment();

-- Trigger: Update course statistics when video changes
CREATE OR REPLACE FUNCTION public.update_course_stats_on_video()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    PERFORM public.update_course_statistics(NEW.course_id);
  END IF;
  IF TG_OP = 'DELETE' THEN
    PERFORM public.update_course_statistics(OLD.course_id);
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_course_stats_video
AFTER INSERT OR UPDATE OR DELETE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_course_stats_on_video();

-- ========================================
-- 10. Sample Data (Optional - for development)
-- ========================================

-- Insert sample discount code
INSERT INTO public.discount_codes (code, discount_type, discount_value, max_uses, is_active)
VALUES ('WELCOME10', 'percentage', 10, 100, true)
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- Migration Complete
-- ========================================

-- הוסף הערה למעקב
COMMENT ON TABLE public.videos IS 'מכיל מטא-דאטה של סרטוני הקורס';
COMMENT ON TABLE public.course_enrollments IS 'רכישות והרשמות לקורסים';
COMMENT ON TABLE public.video_progress IS 'מעקב אחרי התקדמות צפייה של משתמשים';
COMMENT ON TABLE public.payments IS 'היסטוריית תשלומים מפורטת';
COMMENT ON TABLE public.discount_codes IS 'קודי קופון והנחות';
COMMENT ON TABLE public.course_reviews IS 'ביקורות ודירוגים של קורסים';


