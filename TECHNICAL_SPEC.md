# מפרט טכני מפורט - LevelUp Hebrew

## 1. Database Schema המלא

### טבלאות קיימות (מה שכבר יש):
✅ `profiles` - פרופילי משתמשים
✅ `courses` - קורסים
✅ `course_chapters` - פרקי קורס
✅ `course_materials` - חומרי עזר
✅ `institutions` - מוסדות
✅ `user_roles` - תפקידי משתמשים
✅ `user_consents` - הסכמות cookies

---

### טבלאות חדשות שצריך ליצור:

#### 1. `videos`
```sql
CREATE TABLE public.videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES public.course_chapters(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL, -- URL מ-Supabase Storage או Mux
  duration INTEGER NOT NULL, -- משך בשניות
  order_index INTEGER NOT NULL DEFAULT 0,
  thumbnail_url TEXT,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index לביצועים
CREATE INDEX idx_videos_course_id ON public.videos(course_id);
CREATE INDEX idx_videos_chapter_id ON public.videos(chapter_id);
CREATE INDEX idx_videos_order ON public.videos(course_id, order_index);

-- RLS Policies
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- כולם יכולים לראות סרטונים מפורסמים (metadata בלבד)
CREATE POLICY "Public can view published videos metadata"
ON public.videos FOR SELECT
USING (is_published = true);

-- רק admins יכולים לערוך
CREATE POLICY "Admins can manage videos"
ON public.videos FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Trigger לעדכון updated_at
CREATE TRIGGER update_videos_updated_at
BEFORE UPDATE ON public.videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

#### 2. `course_enrollments`
```sql
CREATE TABLE public.course_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMPTZ DEFAULT now(),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
  payment_method TEXT, -- 'stripe', 'paypal', 'manual', etc.
  amount_paid DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  discount_code TEXT,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id)
);

CREATE INDEX idx_enrollments_user_id ON public.course_enrollments(user_id);
CREATE INDEX idx_enrollments_course_id ON public.course_enrollments(course_id);
CREATE INDEX idx_enrollments_status ON public.course_enrollments(payment_status);

ALTER TABLE public.course_enrollments ENABLE ROW LEVEL SECURITY;

-- משתמשים רואים את ההרשמות שלהם בלבד
CREATE POLICY "Users can view their own enrollments"
ON public.course_enrollments FOR SELECT
USING (auth.uid() = user_id);

-- Admins רואים הכל
CREATE POLICY "Admins can view all enrollments"
ON public.course_enrollments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- רק המערכת יכולה ליצור enrollments (דרך Edge Functions)
CREATE POLICY "System can create enrollments"
ON public.course_enrollments FOR INSERT
WITH CHECK (true); -- יש לשנות למגבלה מתאימה בהמשך

CREATE TRIGGER update_enrollments_updated_at
BEFORE UPDATE ON public.course_enrollments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

#### 3. `video_progress`
```sql
CREATE TABLE public.video_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_id UUID NOT NULL REFERENCES public.videos(id) ON DELETE CASCADE,
  watched_duration INTEGER NOT NULL DEFAULT 0, -- שניות שנצפו
  completed BOOLEAN DEFAULT false,
  last_watched_at TIMESTAMPTZ DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, video_id)
);

CREATE INDEX idx_progress_user_id ON public.video_progress(user_id);
CREATE INDEX idx_progress_video_id ON public.video_progress(video_id);

ALTER TABLE public.video_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.video_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.video_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify their own progress"
ON public.video_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Admins רואים הכל
CREATE POLICY "Admins can view all progress"
ON public.video_progress FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));
```

#### 4. `payments`
```sql
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  enrollment_id UUID REFERENCES public.course_enrollments(id) ON DELETE SET NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'ILS',
  payment_provider TEXT NOT NULL, -- 'stripe', 'paypal', etc.
  provider_payment_id TEXT, -- ID מספק התשלום
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  failure_reason TEXT,
  metadata JSONB, -- מידע נוסף מספק התשלום
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_enrollment_id ON public.payments(enrollment_id);
CREATE INDEX idx_payments_provider_id ON public.payments(provider_payment_id);
CREATE INDEX idx_payments_status ON public.payments(status);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own payments"
ON public.payments FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payments"
ON public.payments FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_payments_updated_at
BEFORE UPDATE ON public.payments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

#### 5. `discount_codes`
```sql
CREATE TABLE public.discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')) DEFAULT 'percentage',
  discount_value DECIMAL(10,2) NOT NULL, -- אחוז או סכום קבוע
  valid_from TIMESTAMPTZ DEFAULT now(),
  valid_to TIMESTAMPTZ,
  max_uses INTEGER, -- מספר שימושים מקסימלי (NULL = בלתי מוגבל)
  current_uses INTEGER DEFAULT 0,
  applicable_courses UUID[], -- NULL = כל הקורסים
  min_purchase_amount DECIMAL(10,2), -- סכום מינימלי לרכישה
  is_active BOOLEAN DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_discount_codes_code ON public.discount_codes(code);
CREATE INDEX idx_discount_codes_active ON public.discount_codes(is_active);

ALTER TABLE public.discount_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active discount codes"
ON public.discount_codes FOR SELECT
USING (is_active = true AND (valid_to IS NULL OR valid_to > now()));

CREATE POLICY "Admins can manage discount codes"
ON public.discount_codes FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_discount_codes_updated_at
BEFORE UPDATE ON public.discount_codes
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

#### 6. `course_reviews` (אופציונלי אבל מומלץ)
```sql
CREATE TABLE public.course_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, course_id) -- משתמש יכול לכתוב ביקורת אחת בלבד לקורס
);

CREATE INDEX idx_reviews_course_id ON public.course_reviews(course_id);
CREATE INDEX idx_reviews_rating ON public.course_reviews(rating);

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

CREATE TRIGGER update_reviews_updated_at
BEFORE UPDATE ON public.course_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 2. Database Functions שימושיות

### פונקציה לבדיקת גישה לקורס
```sql
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
```

### פונקציה לחישוב אחוז התקדמות
```sql
CREATE OR REPLACE FUNCTION public.get_course_progress(
  _user_id UUID,
  _course_id UUID
)
RETURNS DECIMAL AS $$
DECLARE
  total_videos INTEGER;
  completed_videos INTEGER;
BEGIN
  -- ספירת סה"כ סרטונים בקורס
  SELECT COUNT(*)
  INTO total_videos
  FROM public.videos
  WHERE course_id = _course_id AND is_published = true;
  
  IF total_videos = 0 THEN
    RETURN 0;
  END IF;
  
  -- ספירת סרטונים שהושלמו
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
```

### פונקציה לולידציה והחלת קוד קופון
```sql
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
  -- נסה למצוא את הקוד
  SELECT * INTO discount_record
  FROM public.discount_codes
  WHERE code = _code
    AND is_active = true
    AND (valid_to IS NULL OR valid_to > now())
    AND (max_uses IS NULL OR current_uses < max_uses);
  
  -- אם הקוד לא נמצא או לא תקף
  IF NOT FOUND THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'קוד קופון לא תקף או פג תוקף'::TEXT;
    RETURN;
  END IF;
  
  -- בדיקה אם הקורס רלוונטי
  IF discount_record.applicable_courses IS NOT NULL AND 
     NOT (_course_id = ANY(discount_record.applicable_courses)) THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 'קוד קופון לא תקף לקורס זה'::TEXT;
    RETURN;
  END IF;
  
  -- בדיקת סכום מינימלי
  IF discount_record.min_purchase_amount IS NOT NULL AND 
     _purchase_amount < discount_record.min_purchase_amount THEN
    RETURN QUERY SELECT false, 0::DECIMAL, 
      format('נדרש סכום מינימלי של %s ש"ח', discount_record.min_purchase_amount)::TEXT;
    RETURN;
  END IF;
  
  -- חישוב ההנחה
  IF discount_record.discount_type = 'percentage' THEN
    calculated_discount := (_purchase_amount * discount_record.discount_value) / 100;
  ELSE
    calculated_discount := discount_record.discount_value;
  END IF;
  
  -- אי אפשר שהנחה תהיה גדולה מהמחיר
  IF calculated_discount > _purchase_amount THEN
    calculated_discount := _purchase_amount;
  END IF;
  
  RETURN QUERY SELECT true, calculated_discount, NULL::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## 3. Storage Buckets

### יצירת Buckets ב-Supabase

```sql
-- Videos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', false);

-- Thumbnails bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('thumbnails', 'thumbnails', true);

-- Course materials bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('course-materials', 'course-materials', false);

-- Institution logos bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('institution-logos', 'institution-logos', true);
```

### Storage Policies

```sql
-- Videos: רק users עם גישה לקורס יכולים לצפות
CREATE POLICY "Users with enrollment can view videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.videos v
    JOIN public.course_enrollments e ON e.course_id = v.course_id
    WHERE v.video_url LIKE '%' || name || '%'
      AND e.user_id = auth.uid()
      AND e.payment_status = 'completed'
  )
);

-- רק admins יכולים להעלות סרטונים
CREATE POLICY "Admins can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' AND
  has_role(auth.uid(), 'admin'::app_role)
);

-- Thumbnails: כולם יכולים לצפות
CREATE POLICY "Public can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- רק admins יכולים להעלות thumbnails
CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'thumbnails' AND
  has_role(auth.uid(), 'admin'::app_role)
);
```

---

## 4. Supabase Edge Functions

### Edge Function: create-payment-intent

**Purpose:** יצירת payment intent עבור Stripe

```typescript
// supabase/functions/create-payment-intent/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

serve(async (req) => {
  try {
    const { courseId, discountCode } = await req.json()
    
    // יצירת Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )
    
    // קבלת משתמש מחובר
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    // בדיקה אם המשתמש כבר רכש את הקורס
    const { data: existingEnrollment } = await supabaseClient
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', courseId)
      .eq('payment_status', 'completed')
      .single()
    
    if (existingEnrollment) {
      return new Response(
        JSON.stringify({ error: 'כבר רכשת את הקורס הזה' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    // קבלת מחיר הקורס
    const { data: course } = await supabaseClient
      .from('courses')
      .select('price, title')
      .eq('id', courseId)
      .single()
    
    if (!course) {
      return new Response(JSON.stringify({ error: 'Course not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }
    
    let finalAmount = course.price
    let discountAmount = 0
    
    // אם יש קוד קופון, נבדוק אותו
    if (discountCode) {
      const { data: validation } = await supabaseClient
        .rpc('validate_discount_code', {
          _code: discountCode,
          _course_id: courseId,
          _purchase_amount: course.price,
        })
        .single()
      
      if (validation?.is_valid) {
        discountAmount = validation.discount_amount
        finalAmount = course.price - discountAmount
      }
    }
    
    // יצירת payment intent ב-Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(finalAmount * 100), // Stripe עובד בagorot/cents
      currency: 'ils',
      metadata: {
        userId: user.id,
        courseId,
        discountCode: discountCode || '',
      },
    })
    
    // יצירת enrollment record עם סטטוס pending
    const { data: enrollment } = await supabaseClient
      .from('course_enrollments')
      .insert({
        user_id: user.id,
        course_id: courseId,
        payment_status: 'pending',
        payment_method: 'stripe',
        amount_paid: finalAmount,
        discount_code: discountCode || null,
        discount_amount: discountAmount,
      })
      .select()
      .single()
    
    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        enrollmentId: enrollment.id,
      }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
```

### Edge Function: stripe-webhook

**Purpose:** טיפול ב-webhooks מ-Stripe

```typescript
// supabase/functions/stripe-webhook/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import Stripe from 'https://esm.sh/stripe@12.0.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  const signature = req.headers.get('stripe-signature')
  const body = await req.text()
  
  let event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      Deno.env.get('STRIPE_WEBHOOK_SECRET')!
    )
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
    })
  }
  
  switch (event.type) {
    case 'payment_intent.succeeded': {
      const paymentIntent = event.data.object
      const { userId, courseId } = paymentIntent.metadata
      
      // עדכון enrollment לstatus completed
      await supabase
        .from('course_enrollments')
        .update({ payment_status: 'completed' })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('payment_status', 'pending')
      
      // יצירת payment record
      await supabase.from('payments').insert({
        user_id: userId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        payment_provider: 'stripe',
        provider_payment_id: paymentIntent.id,
        status: 'succeeded',
        metadata: paymentIntent.metadata,
      })
      
      // עדכון מספר השימושים בקוד קופון
      if (paymentIntent.metadata.discountCode) {
        await supabase.rpc('increment', {
          table_name: 'discount_codes',
          column_name: 'current_uses',
          row_id: paymentIntent.metadata.discountCode,
        })
      }
      
      break
    }
    
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object
      const { userId, courseId } = paymentIntent.metadata
      
      await supabase
        .from('course_enrollments')
        .update({ payment_status: 'failed' })
        .eq('user_id', userId)
        .eq('course_id', courseId)
        .eq('payment_status', 'pending')
      
      await supabase.from('payments').insert({
        user_id: userId,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        payment_provider: 'stripe',
        provider_payment_id: paymentIntent.id,
        status: 'failed',
        failure_reason: paymentIntent.last_payment_error?.message,
      })
      
      break
    }
  }
  
  return new Response(JSON.stringify({ received: true }), {
    headers: { 'Content-Type': 'application/json' },
  })
})
```

---

## 5. חבילות NPM נוספות שצריך להתקין

```json
{
  "dependencies": {
    "@stripe/stripe-js": "^2.1.0",
    "@stripe/react-stripe-js": "^2.3.0",
    "react-dropzone": "^14.2.3",
    "axios": "^1.5.0"
  }
}
```

התקנה:
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js react-dropzone axios
```

---

## 6. Environment Variables

צור קובץ `.env.local`:

```env
# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (Public Key)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Optional: Analytics
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
```

ולEdge Functions צור `.env` בתיקיית הפונקציה:

```env
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

---

## 7. דוגמאות לשימוש ב-Frontend

### Hook: useAuth
```typescript
// src/hooks/useAuth.ts
import { useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // קבלת session נוכחי
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // האזנה לשינויים
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
};
```

### Hook: useEnrollments
```typescript
// src/hooks/useEnrollments.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useEnrollments = (userId: string | undefined) => {
  return useQuery({
    queryKey: ['enrollments', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('course_enrollments')
        .select(`
          *,
          course:courses(*)
        `)
        .eq('user_id', userId)
        .eq('payment_status', 'completed');
      
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
};
```

### Hook: useCourseAccess
```typescript
// src/hooks/useCourseAccess.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCourseAccess = (userId: string | undefined, courseId: string | undefined) => {
  return useQuery({
    queryKey: ['course-access', userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) return false;
      
      const { data, error } = await supabase.rpc('check_user_has_access', {
        _user_id: userId,
        _course_id: courseId,
      });
      
      if (error) throw error;
      return data as boolean;
    },
    enabled: !!userId && !!courseId,
  });
};
```

### Hook: useCourseProgress
```typescript
// src/hooks/useCourseProgress.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useCourseProgress = (userId: string | undefined, courseId: string | undefined) => {
  return useQuery({
    queryKey: ['course-progress', userId, courseId],
    queryFn: async () => {
      if (!userId || !courseId) return 0;
      
      const { data, error } = await supabase.rpc('get_course_progress', {
        _user_id: userId,
        _course_id: courseId,
      });
      
      if (error) throw error;
      return data as number;
    },
    enabled: !!userId && !!courseId,
  });
};
```

### Component: StripeCheckout
```typescript
// src/components/StripeCheckout.tsx
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  courseId: string;
  discountCode?: string;
  onSuccess: () => void;
}

const CheckoutForm = ({ courseId, discountCode, onSuccess }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);
    setError(null);

    const { error: submitError } = await elements.submit();
    if (submitError) {
      setError(submitError.message || 'שגיאה בעיבוד התשלום');
      setLoading(false);
      return;
    }

    const { error: confirmError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (confirmError) {
      setError(confirmError.message || 'שגיאה בעיבוד התשלום');
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      <Button
        type="submit"
        disabled={!stripe || loading}
        className="w-full"
      >
        {loading ? 'מעבד...' : 'שלם עכשיו'}
      </Button>
    </form>
  );
};

export const StripeCheckout = ({ courseId, discountCode, onSuccess }: CheckoutFormProps) => {
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useState(() => {
    const createPaymentIntent = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await supabase.functions.invoke('create-payment-intent', {
          body: { courseId, discountCode },
          headers: {
            Authorization: `Bearer ${session?.access_token}`,
          },
        });

        if (response.error) throw response.error;
        
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        console.error('Error creating payment intent:', error);
      } finally {
        setLoading(false);
      }
    };

    createPaymentIntent();
  });

  if (loading) {
    return <div>טוען...</div>;
  }

  if (!clientSecret) {
    return <div>שגיאה ביצירת תשלום</div>;
  }

  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <CheckoutForm
        courseId={courseId}
        discountCode={discountCode}
        onSuccess={onSuccess}
      />
    </Elements>
  );
};
```

---

## 8. רשימת מטלות לשלב 1 (שבוע ראשון)

- [ ] הרצת כל ה-migrations מהמסמך הזה
- [ ] יצירת Storage Buckets
- [ ] הגדרת Storage Policies
- [ ] בדיקת RLS Policies
- [ ] יצירת Edge Functions הראשונות
- [ ] התקנת חבילות NPM
- [ ] יצירת Hooks בסיסיים
- [ ] בדיקת authentication flow

---

## 9. טיפים לפיתוח

### Supabase Local Development
```bash
# התקנת Supabase CLI
npm install -g supabase

# התחלת Supabase מקומי
supabase start

# יצירת migration חדשה
supabase migration new your_migration_name

# Push migrations לproduction
supabase db push
```

### טעינת Types מעודכנים
```bash
# יצירת types מעודכנים מהDB
npx supabase gen types typescript --project-id your-project-id > src/integrations/supabase/types.ts
```

### Debug Edge Functions מקומי
```bash
# הרצת edge function מקומית
supabase functions serve create-payment-intent --env-file supabase/functions/.env
```

---

## 10. Security Checklist

- [ ] כל הטבלאות עם RLS מופעל
- [ ] Policies מוגדרים נכון לכל טבלה
- [ ] Storage buckets עם policies מתאימים
- [ ] Edge Functions עם אימות
- [ ] Environment variables לא בgit (`.env` ב-`.gitignore`)
- [ ] Webhook signatures מאומתים
- [ ] Rate limiting על Edge Functions
- [ ] Input validation בכל מקום
- [ ] SQL injection prevention (Supabase מטפל בזה אוטומטית)
- [ ] XSS prevention (React מטפל בזה אוטומטית ברוב המקרים)

---

זהו! עכשיו יש לך את כל הכלים כדי להתחיל את הפיתוח. בהצלחה! 🚀


