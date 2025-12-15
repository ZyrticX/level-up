-- =============================================
-- Email Triggers for Level Up Academy
-- Automatic email sending on database events
-- =============================================

-- Create email_logs table to track sent emails
CREATE TABLE IF NOT EXISTS public.email_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_type TEXT NOT NULL,
    recipient_email TEXT NOT NULL,
    recipient_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    subject TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed', 'bounced')),
    resend_id TEXT,
    error_message TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT now(),
    sent_at TIMESTAMPTZ,
    opened_at TIMESTAMPTZ,
    clicked_at TIMESTAMPTZ
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs(recipient_email);
CREATE INDEX IF NOT EXISTS idx_email_logs_type ON public.email_logs(email_type);
CREATE INDEX IF NOT EXISTS idx_email_logs_status ON public.email_logs(status);
CREATE INDEX IF NOT EXISTS idx_email_logs_created ON public.email_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_logs_user ON public.email_logs(recipient_user_id);

-- Enable RLS
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own email logs"
    ON public.email_logs FOR SELECT
    USING (recipient_user_id = auth.uid());

CREATE POLICY "Admins can view all email logs"
    ON public.email_logs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Add comment
COMMENT ON TABLE public.email_logs IS 'Tracks all emails sent through the system';

-- =============================================
-- Email Preferences Table
-- =============================================

CREATE TABLE IF NOT EXISTS public.email_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    -- Transactional emails (cannot be disabled)
    receive_purchase_emails BOOLEAN DEFAULT true,
    receive_password_emails BOOLEAN DEFAULT true,
    -- Optional notifications
    receive_course_updates BOOLEAN DEFAULT true,
    receive_progress_reminders BOOLEAN DEFAULT true,
    receive_weekly_summary BOOLEAN DEFAULT true,
    receive_new_courses BOOLEAN DEFAULT true,
    receive_marketing BOOLEAN DEFAULT true,
    receive_newsletter BOOLEAN DEFAULT true,
    -- Settings
    preferred_language TEXT DEFAULT 'he',
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.email_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can manage their own preferences"
    ON public.email_preferences FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all preferences"
    ON public.email_preferences FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.user_roles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- Create default preferences for new users
CREATE OR REPLACE FUNCTION public.create_email_preferences_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.email_preferences (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create preferences on user signup
DROP TRIGGER IF EXISTS on_user_created_email_preferences ON auth.users;
CREATE TRIGGER on_user_created_email_preferences
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.create_email_preferences_for_new_user();

-- =============================================
-- Function to Queue Email
-- =============================================

CREATE OR REPLACE FUNCTION public.queue_email(
    p_email_type TEXT,
    p_recipient_email TEXT,
    p_recipient_user_id UUID DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'
)
RETURNS UUID AS $$
DECLARE
    v_email_id UUID;
BEGIN
    INSERT INTO public.email_logs (
        email_type,
        recipient_email,
        recipient_user_id,
        metadata
    )
    VALUES (
        p_email_type,
        p_recipient_email,
        p_recipient_user_id,
        p_metadata
    )
    RETURNING id INTO v_email_id;
    
    -- Note: The actual sending is handled by Edge Function called via webhook/cron
    
    RETURN v_email_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Trigger: New User Signup → Welcome Email
-- =============================================

CREATE OR REPLACE FUNCTION public.trigger_welcome_email()
RETURNS TRIGGER AS $$
DECLARE
    v_first_name TEXT;
BEGIN
    -- Get first name from metadata
    v_first_name := NEW.raw_user_meta_data->>'first_name';
    
    -- Queue welcome email
    PERFORM public.queue_email(
        'signup_confirmation',
        NEW.email,
        NEW.id,
        jsonb_build_object(
            'firstName', COALESCE(v_first_name, ''),
            'confirmationUrl', COALESCE(NEW.confirmation_token, '')
        )
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Note: Supabase handles auth emails internally, but we can add custom logic
-- This trigger is optional - Supabase Auth already sends confirmation emails

-- =============================================
-- Trigger: New Purchase → Confirmation Email
-- =============================================

CREATE OR REPLACE FUNCTION public.trigger_purchase_email()
RETURNS TRIGGER AS $$
DECLARE
    v_user RECORD;
    v_course RECORD;
BEGIN
    -- Only trigger on completed payment
    IF NEW.payment_status = 'completed' AND (OLD IS NULL OR OLD.payment_status != 'completed') THEN
        -- Get user info
        SELECT email, raw_user_meta_data->>'first_name' as first_name
        INTO v_user
        FROM auth.users
        WHERE id = NEW.user_id;
        
        -- Get course info
        SELECT title, icon_url
        INTO v_course
        FROM public.courses
        WHERE id = NEW.course_id;
        
        -- Queue purchase confirmation email
        PERFORM public.queue_email(
            'purchase_confirmation',
            v_user.email,
            NEW.user_id,
            jsonb_build_object(
                'firstName', COALESCE(v_user.first_name, ''),
                'orderId', NEW.id::TEXT,
                'courseName', v_course.title,
                'courseImage', v_course.icon_url,
                'amount', NEW.amount_paid,
                'currency', COALESCE(NEW.currency, 'ILS'),
                'paymentMethod', COALESCE(NEW.payment_method, 'כרטיס אשראי'),
                'purchaseDate', to_char(NEW.created_at, 'DD/MM/YYYY HH24:MI')
            )
        );
        
        -- Also notify admin
        PERFORM public.queue_email(
            'new_purchase_alert',
            'admin@levelupacademy.co.il',
            NULL,
            jsonb_build_object(
                'customerName', COALESCE(v_user.first_name, 'אורח'),
                'customerEmail', v_user.email,
                'courseName', v_course.title,
                'amount', NEW.amount_paid,
                'currency', COALESCE(NEW.currency, 'ILS')
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_enrollment_purchase ON public.course_enrollments;
CREATE TRIGGER on_enrollment_purchase
    AFTER INSERT OR UPDATE ON public.course_enrollments
    FOR EACH ROW
    EXECUTE FUNCTION public.trigger_purchase_email();

-- =============================================
-- Trigger: Course Completed → Completion Email
-- =============================================

CREATE OR REPLACE FUNCTION public.trigger_course_completed_email()
RETURNS TRIGGER AS $$
DECLARE
    v_user RECORD;
    v_course RECORD;
    v_total_videos INT;
    v_completed_videos INT;
    v_watch_time INT;
BEGIN
    -- Get course info
    SELECT c.id, c.title INTO v_course
    FROM public.videos v
    JOIN public.courses c ON c.id = v.course_id
    WHERE v.id = NEW.video_id;
    
    IF v_course.id IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Count total and completed videos for this course
    SELECT COUNT(*) INTO v_total_videos
    FROM public.videos WHERE course_id = v_course.id AND is_published = true;
    
    SELECT COUNT(*) INTO v_completed_videos
    FROM public.video_progress vp
    JOIN public.videos v ON v.id = vp.video_id
    WHERE vp.user_id = NEW.user_id 
    AND v.course_id = v_course.id 
    AND vp.completed = true;
    
    -- Check if course is now complete
    IF v_completed_videos >= v_total_videos AND v_total_videos > 0 THEN
        -- Get user info
        SELECT email, raw_user_meta_data->>'first_name' as first_name
        INTO v_user
        FROM auth.users
        WHERE id = NEW.user_id;
        
        -- Calculate total watch time
        SELECT COALESCE(SUM(watched_duration), 0) INTO v_watch_time
        FROM public.video_progress vp
        JOIN public.videos v ON v.id = vp.video_id
        WHERE vp.user_id = NEW.user_id AND v.course_id = v_course.id;
        
        -- Queue completion email
        PERFORM public.queue_email(
            'course_completed',
            v_user.email,
            NEW.user_id,
            jsonb_build_object(
                'firstName', COALESCE(v_user.first_name, ''),
                'courseName', v_course.title,
                'completionDate', to_char(now(), 'DD/MM/YYYY'),
                'totalWatchTime', (v_watch_time / 60) || ' דקות'
            )
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_video_completed ON public.video_progress;
CREATE TRIGGER on_video_completed
    AFTER UPDATE ON public.video_progress
    FOR EACH ROW
    WHEN (NEW.completed = true AND (OLD.completed IS NULL OR OLD.completed = false))
    EXECUTE FUNCTION public.trigger_course_completed_email();

-- =============================================
-- Function: Send Weekly Progress Emails (Cron Job)
-- =============================================

CREATE OR REPLACE FUNCTION public.send_weekly_progress_emails()
RETURNS void AS $$
DECLARE
    r RECORD;
BEGIN
    -- For each user with active course progress
    FOR r IN (
        SELECT DISTINCT 
            u.id as user_id,
            u.email,
            u.raw_user_meta_data->>'first_name' as first_name,
            c.id as course_id,
            c.title as course_name,
            COUNT(CASE WHEN vp.completed THEN 1 END) as completed_lessons,
            COUNT(v.id) as total_lessons,
            ROUND(COUNT(CASE WHEN vp.completed THEN 1 END)::NUMERIC / NULLIF(COUNT(v.id), 0) * 100) as progress_percent,
            COALESCE(SUM(vp.watched_duration) / 60, 0) as watched_minutes
        FROM auth.users u
        JOIN public.course_enrollments ce ON ce.user_id = u.id AND ce.payment_status = 'completed'
        JOIN public.courses c ON c.id = ce.course_id
        JOIN public.videos v ON v.course_id = c.id AND v.is_published = true
        LEFT JOIN public.video_progress vp ON vp.video_id = v.id AND vp.user_id = u.id
        LEFT JOIN public.email_preferences ep ON ep.user_id = u.id
        WHERE 
            (ep.receive_weekly_summary IS NULL OR ep.receive_weekly_summary = true)
            AND ce.created_at < now() - INTERVAL '7 days' -- Enrolled more than a week ago
        GROUP BY u.id, u.email, u.raw_user_meta_data, c.id, c.title
        HAVING COUNT(CASE WHEN vp.completed THEN 1 END) < COUNT(v.id) -- Course not completed
    )
    LOOP
        -- Queue weekly progress email
        PERFORM public.queue_email(
            'weekly_progress',
            r.email,
            r.user_id,
            jsonb_build_object(
                'firstName', COALESCE(r.first_name, ''),
                'courseName', r.course_name,
                'completedLessons', r.completed_lessons,
                'totalLessons', r.total_lessons,
                'progressPercent', r.progress_percent,
                'watchedMinutes', r.watched_minutes,
                'continueUrl', 'https://levelupacademy.co.il/course/' || r.course_id
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Function: Send Continue Learning Reminders (Cron Job)
-- =============================================

CREATE OR REPLACE FUNCTION public.send_continue_learning_reminders()
RETURNS void AS $$
DECLARE
    r RECORD;
BEGIN
    -- For users who haven't watched anything in 7+ days
    FOR r IN (
        SELECT DISTINCT 
            u.id as user_id,
            u.email,
            u.raw_user_meta_data->>'first_name' as first_name,
            c.id as course_id,
            c.title as course_name,
            v.title as last_lesson_title,
            ROUND(COUNT(CASE WHEN vp2.completed THEN 1 END)::NUMERIC / NULLIF(COUNT(v2.id), 0) * 100) as progress_percent,
            EXTRACT(DAY FROM now() - MAX(vp.last_watched_at)) as days_inactive
        FROM auth.users u
        JOIN public.course_enrollments ce ON ce.user_id = u.id AND ce.payment_status = 'completed'
        JOIN public.courses c ON c.id = ce.course_id
        JOIN public.video_progress vp ON vp.user_id = u.id
        JOIN public.videos v ON v.id = vp.video_id AND v.course_id = c.id
        JOIN public.videos v2 ON v2.course_id = c.id AND v2.is_published = true
        LEFT JOIN public.video_progress vp2 ON vp2.video_id = v2.id AND vp2.user_id = u.id
        LEFT JOIN public.email_preferences ep ON ep.user_id = u.id
        WHERE 
            (ep.receive_progress_reminders IS NULL OR ep.receive_progress_reminders = true)
            AND vp.last_watched_at < now() - INTERVAL '7 days'
            AND vp.last_watched_at > now() - INTERVAL '30 days' -- Don't spam inactive users
        GROUP BY u.id, u.email, u.raw_user_meta_data, c.id, c.title, v.title
        HAVING COUNT(CASE WHEN vp2.completed THEN 1 END) < COUNT(v2.id) -- Course not completed
    )
    LOOP
        PERFORM public.queue_email(
            'continue_learning_reminder',
            r.email,
            r.user_id,
            jsonb_build_object(
                'firstName', COALESCE(r.first_name, ''),
                'courseName', r.course_name,
                'lastLessonTitle', r.last_lesson_title,
                'progressPercent', r.progress_percent,
                'daysInactive', r.days_inactive,
                'continueUrl', 'https://levelupacademy.co.il/course/' || r.course_id
            )
        );
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================
-- Grant permissions
-- =============================================

GRANT SELECT, INSERT ON public.email_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.email_preferences TO authenticated;
GRANT USAGE ON SCHEMA public TO authenticated;

