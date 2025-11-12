# מדריך התקנה והרצה - LevelUp Hebrew

## תוכן עניינים
1. [דרישות מקדימות](#דרישות-מקדימות)
2. [התקנה ראשונית](#התקנה-ראשונית)
3. [הגדרת Supabase](#הגדרת-supabase)
4. [הגדרת Stripe](#הגדרת-stripe)
5. [הרצה מקומית](#הרצה-מקומית)
6. [Deploy לProduction](#deploy-לproduction)
7. [בדיקות](#בדיקות)
8. [פתרון בעיות](#פתרון-בעיות)

---

## דרישות מקדימות

לפני שמתחילים, ודא שמותקנים:

- ✅ **Node.js** (גרסה 18 ומעלה) - [הורדה](https://nodejs.org/)
- ✅ **npm** או **bun** (מנהל חבילות)
- ✅ **Git** - [הורדה](https://git-scm.com/)
- ✅ **חשבון Supabase** - [הרשמה](https://supabase.com/)
- ✅ **חשבון Stripe** (לתשלומים) - [הרשמה](https://stripe.com/)

### בדיקת גרסאות:
```bash
node --version  # צריך להיות >= 18
npm --version
git --version
```

---

## התקנה ראשונית

### 1. שכפול הפרויקט
```bash
git clone <your-repo-url>
cd levelup-hebrew-landing
```

### 2. התקנת חבילות
```bash
npm install

# או אם משתמשים ב-bun:
bun install
```

### 3. התקנת חבילות נוספות נדרשות
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js react-dropzone axios
```

---

## הגדרת Supabase

### שלב 1: יצירת פרויקט ב-Supabase

1. היכנס ל-[Supabase Dashboard](https://app.supabase.com/)
2. לחץ על "New Project"
3. בחר ארגון (או צור חדש)
4. מלא פרטים:
   - **Name:** levelup-hebrew
   - **Database Password:** (שמור אותו!)
   - **Region:** בחר קרוב לישראל (Europe West)
5. לחץ "Create new project"
6. המתן כ-2 דקות עד שהפרויקט יהיה מוכן

### שלב 2: העתקת Credentials

לאחר שהפרויקט מוכן:

1. לך ל-**Settings** → **API**
2. העתק:
   - **Project URL** 
   - **anon/public key**
   - **service_role key** (שמור במקום מאובטח!)

### שלב 3: יצירת קובץ .env.local

צור קובץ `.env.local` בשורש הפרויקט:

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Stripe (נוסיף אחר כך)
VITE_STRIPE_PUBLIC_KEY=pk_test_...

# Optional
VITE_APP_NAME="LevelUp Hebrew"
```

### שלב 4: הרצת Migrations

#### אופציה א': דרך Supabase Dashboard (מומלץ למתחילים)

1. לך ל-**SQL Editor** בדשבורד
2. העתק את התוכן מהקובץ:
   ```
   supabase/migrations/20251027000000_complete_schema_for_course_platform.sql
   ```
3. הדבק ב-SQL Editor
4. לחץ "Run"
5. ודא שאין שגיאות

#### אופציה ב': דרך Supabase CLI (מתקדם)

```bash
# התקנת Supabase CLI
npm install -g supabase

# התחברות לפרויקט
supabase login
supabase link --project-ref your-project-ref

# הרצת migrations
supabase db push
```

### שלב 5: הגדרת Storage Buckets

1. לך ל-**Storage** בדשבורד
2. צור את ה-Buckets הבאים:

#### Bucket: `videos`
- **Name:** videos
- **Public:** ❌ (Private)
- לחץ "Create bucket"

#### Bucket: `thumbnails`
- **Name:** thumbnails
- **Public:** ✅ (Public)
- לחץ "Create bucket"

#### Bucket: `course-materials`
- **Name:** course-materials
- **Public:** ❌ (Private)
- לחץ "Create bucket"

#### Bucket: `institution-logos`
- **Name:** institution-logos
- **Public:** ✅ (Public)
- לחץ "Create bucket"

### שלב 6: הגדרת Storage Policies

עבור כל bucket, לך ל-**Policies** והוסף:

#### Policies ל-`videos`:

```sql
-- Users with enrollment can view videos
CREATE POLICY "Enrolled users can view videos"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'videos' AND
  auth.role() = 'authenticated' AND
  EXISTS (
    SELECT 1 FROM public.videos v
    JOIN public.course_enrollments e ON e.course_id = v.course_id
    WHERE storage.foldername(name)[1] = v.course_id::text
      AND e.user_id = auth.uid()
      AND e.payment_status = 'completed'
  )
);

-- Admins can upload videos
CREATE POLICY "Admins can upload videos"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'videos' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

#### Policies ל-`thumbnails`:

```sql
-- Everyone can view thumbnails
CREATE POLICY "Public can view thumbnails"
ON storage.objects FOR SELECT
USING (bucket_id = 'thumbnails');

-- Admins can upload thumbnails
CREATE POLICY "Admins can upload thumbnails"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'thumbnails' AND
  EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

### שלב 7: יצירת משתמש Admin ראשון

1. לך ל-**Authentication** → **Users**
2. לחץ "Add user"
3. הזן:
   - Email: admin@example.com
   - Password: (בחר סיסמה חזקה)
   - Email Confirm: ✅
4. לחץ "Create user"

5. לך ל-**SQL Editor** והרץ:

```sql
-- קבלת user_id של המשתמש שיצרת
SELECT id, email FROM auth.users WHERE email = 'admin@example.com';

-- הוספת תפקיד admin (החלף את USER_ID_HERE)
INSERT INTO public.user_roles (user_id, role)
VALUES ('USER_ID_HERE', 'admin');

-- יצירת פרופיל (אם לא נוצר אוטומטית)
INSERT INTO public.profiles (id, first_name, last_name)
VALUES ('USER_ID_HERE', 'Admin', 'User')
ON CONFLICT (id) DO NOTHING;
```

---

## הגדרת Stripe

### שלב 1: יצירת חשבון

1. הירשם ל-[Stripe](https://dashboard.stripe.com/register)
2. אמת את המייל שלך
3. עבור ל-**Developers** → **API Keys**

### שלב 2: העתקת Keys

ב-**Test mode** (חשוב!):
- העתק **Publishable key** (מתחיל ב-`pk_test_`)
- העתק **Secret key** (מתחיל ב-`sk_test_`)

הוסף ל-`.env.local`:
```env
VITE_STRIPE_PUBLIC_KEY=pk_test_your_key_here
```

### שלב 3: יצירת Webhook

1. לך ל-**Developers** → **Webhooks**
2. לחץ "Add endpoint"
3. ה-URL יהיה (נעדכן אחר כך):
   ```
   https://your-project.supabase.co/functions/v1/stripe-webhook
   ```
4. בחר Events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. לחץ "Add endpoint"
6. העתק את ה-**Signing secret** (מתחיל ב-`whsec_`)

### שלב 4: יצירת Edge Function לStripe

צור את הקבצים:

```bash
# יצירת תיקיות
mkdir -p supabase/functions/create-payment-intent
mkdir -p supabase/functions/stripe-webhook

# צור את הקבצים מתוך TECHNICAL_SPEC.md
# (העתק את הקוד מהמסמך)
```

צור `.env` בתיקיית functions:
```bash
# supabase/functions/.env
STRIPE_SECRET_KEY=sk_test_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### שלב 5: Deploy של Edge Functions

```bash
# Deploy create-payment-intent
supabase functions deploy create-payment-intent --no-verify-jwt

# Deploy stripe-webhook
supabase functions deploy stripe-webhook --no-verify-jwt
```

---

## הרצה מקומית

### התחלת Dev Server

```bash
npm run dev

# או עם bun:
bun run dev
```

הפרויקט יהיה זמין ב:
```
http://localhost:5173
```

### בדיקה ראשונית

1. פתח את הדפדפן
2. גש ל-`http://localhost:5173`
3. ודא שהדף נטען ללא שגיאות
4. נסה להתחבר עם המשתמש Admin שיצרת

---

## Deploy לProduction

### אופציה 1: Vercel (מומלץ)

1. התקן Vercel CLI:
```bash
npm install -g vercel
```

2. התחבר:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. הגדר Environment Variables ב-Vercel Dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_STRIPE_PUBLIC_KEY`

### אופציה 2: Netlify

1. התחבר ל-[Netlify](https://app.netlify.com/)
2. לחץ "Add new site" → "Import an existing project"
3. חבר את ה-Git repo
4. הגדר:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. הוסף Environment Variables
6. לחץ "Deploy"

### אופציה 3: Build ידני

```bash
npm run build

# התיקייה dist תכיל את הקבצים הסטטיים
# העלה אותם לכל שרת web
```

---

## בדיקות

### בדיקה מקומית

```bash
# בדיקת לינטר
npm run lint

# הרצת tests (אם יש)
npm test

# בדיקת build
npm run build
npm run preview
```

### בדיקת Flow מלא

1. **הרשמה:**
   - צור משתמש חדש
   - בדוק שנוצר profile
   - בדוק שהתקבל אימייל

2. **רכישת קורס:**
   - כנס לדף קורס
   - לחץ "רכוש עכשיו"
   - השתמש בכרטיס בדיקה של Stripe:
     - מספר: `4242 4242 4242 4242`
     - תוקף: כל תאריך עתידי
     - CVC: כל 3 ספרות

3. **צפייה בקורס:**
   - לך ל-"הקורסים שלי"
   - פתח קורס שרכשת
   - נסה לצפות בסרטון

4. **Admin:**
   - התחבר כ-admin
   - נסה להוסיף קורס חדש
   - נסה להעלות סרטון

---

## פתרון בעיות

### בעיה: "Invalid API key"
**פתרון:**
1. בדוק שהעתקת נכון את ה-keys מ-Supabase
2. ודא שאין רווחים מיותרים ב-`.env.local`
3. הפעל מחדש את ה-dev server

### בעיה: "CORS error"
**פתרון:**
1. לך ל-Supabase → **Settings** → **API**
2. תחת **CORS**, הוסף:
   ```
   http://localhost:5173
   https://your-production-domain.com
   ```

### בעיה: "Row Level Security policy violation"
**פתרון:**
1. ודא שהרצת את כל ה-migrations
2. בדוק שיש policies לטבלאות
3. ב-Supabase Dashboard, לך לטבלה → Policies
4. ודא שיש policy מתאים

### בעיה: "Cannot upload to storage"
**פתרון:**
1. ודא שהבucket קיים
2. בדוק את ה-Storage Policies
3. ודא שהמשתמש מאומת
4. בדוק שגודל הקובץ מתחת ל-50MB

### בעיה: Stripe webhook לא עובד
**פתרון:**
1. ודא שה-webhook URL נכון
2. בדוק את ה-signing secret
3. ב-Stripe Dashboard, לך ל-Webhooks → בחר endpoint → ראה logs
4. בדוק ב-Supabase Functions logs

### בעיה: הסרטון לא מתנגן
**פתרון:**
1. ודא שהקובץ הוא MP4
2. בדוק שיש גישה (enrollment completed)
3. נסה URL ישיר של הסרטון
4. בדוק ב-Network tab בדפדפן

---

## קישורים שימושיים

### Documentation
- [Supabase Docs](https://supabase.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [React Router](https://reactrouter.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

### Tools
- [Supabase Dashboard](https://app.supabase.com/)
- [Stripe Dashboard](https://dashboard.stripe.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [React Discord](https://discord.gg/react)

---

## מבנה תיקיות

```
levelup-hebrew-landing/
├── src/
│   ├── components/        # קומפוננטות React
│   │   ├── ui/           # Shadcn UI components
│   │   └── ...
│   ├── pages/            # דפי האפליקציה
│   ├── hooks/            # Custom React hooks
│   ├── integrations/     # אינטגרציות (Supabase וכו')
│   └── lib/              # פונקציות עזר
├── supabase/
│   ├── migrations/       # Database migrations
│   └── functions/        # Edge Functions
├── public/               # קבצים סטטיים
├── .env.local           # Environment variables (לא ב-git!)
├── package.json
├── PROJECT_ROADMAP.md   # לוח זמנים מפורט
├── TECHNICAL_SPEC.md    # מפרט טכני
└── SETUP_GUIDE.md       # המדריך הזה
```

---

## הערות אבטחה

⚠️ **חשוב מאוד:**

1. **אל תשתף** את ה-`.env.local` או ה-`service_role_key`
2. השתמש ב-**test keys** של Stripe בפיתוח בלבד
3. **אמת** תמיד input של משתמשים
4. השתמש ב-**RLS policies** בכל הטבלאות
5. **לא** לאחסן סודות ב-frontend code
6. השתמש ב-**HTTPS** בלבד בproduction
7. **גבה** את הדאטה באופן קבוע

---

## מוכנים להתחיל?

1. עקוב אחרי המדריך הזה צעד אחר צעד
2. בדוק שהכל עובד מקומית
3. עבור ל-[PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md) לתכנון הפיתוח
4. קרא את [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md) לפרטים טכניים

**בהצלחה! 🚀**

צריך עזרה? פתח issue ב-GitHub או פנה למפתחים.


