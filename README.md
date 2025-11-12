# LevelUp Hebrew - פלטפורמת קורסים אקדמיים 🎓

פלטפורמה מקיפה למכירה, ניהול וצפייה בקורסים אקדמיים עם מערכת תשלומים, ניהול משתמשים, והעלאת תוכן וידאו.

## 📋 תוכן עניינים

- [תיאור הפרויקט](#תיאור-הפרויקט)
- [תכונות עיקריות](#תכונות-עיקריות)
- [טכנולוגיות](#טכנולוגיות)
- [מסמכי הפרויקט](#מסמכי-הפרויקט)
- [התקנה מהירה](#התקנה-מהירה)
- [רישיון](#רישיון)

---

## 🎯 תיאור הפרויקט

LevelUp Hebrew היא פלטפורמה מתקדמת המיועדת למוסדות אקדמיים וסטודנטים. המערכת מאפשרת:

- 🎥 **צפייה בקורסים** - וידאו באיכות גבוהה עם מעקב התקדמות
- 💳 **מערכת תשלומים** - רכישה מאובטחת של קורסים עם Stripe
- 📚 **ניהול תוכן** - העלאה וניהול של סרטונים, חומרי עזר ומסמכים
- 👥 **מערכת משתמשים** - הרשמה, התחברות, וניהול פרופיל
- 📊 **ממשק אדמין** - ניהול קורסים, משתמשים, תשלומים ודוחות
- 🏫 **מוסדות חינוך** - תמיכה במספר מוסדות ומחלקות

---

## ✨ תכונות עיקריות

### למשתמשים:
- ✅ הרשמה והתחברות מאובטחת
- ✅ עיון וחיפוש קורסים
- ✅ רכישת קורסים עם קודי קופון
- ✅ צפייה בסרטונים עם מעקב התקדמות
- ✅ הורדת חומרי עזר (PDFs, סיכומים, מבחנים)
- ✅ ניהול פרופיל אישי
- ✅ דירוג וביקורת קורסים

### למנהלים:
- ✅ העלאה וניהול סרטונים
- ✅ יצירה ועריכת קורסים
- ✅ ניהול פרקים וחומרי עזר
- ✅ מעקב אחרי תשלומים
- ✅ ניהול משתמשים והרשאות
- ✅ דוחות ואנליטיקס
- ✅ ניהול קודי קופון והנחות

---

## 🛠️ טכנולוגיות

### Frontend:
- **React 18** - ספריית UI
- **TypeScript** - Type safety
- **Vite** - Build tool מהיר
- **Shadcn UI** - קומפוננטות UI מתקדמות
- **Tailwind CSS** - Styling
- **React Router** - ניווט
- **React Query** - ניהול state ו-caching

### Backend:
- **Supabase** - Backend as a Service
  - PostgreSQL Database
  - Authentication
  - Storage
  - Row Level Security (RLS)
  - Edge Functions

### תשלומים:
- **Stripe** - מערכת תשלומים

### אחרים:
- **Lucide Icons** - אייקונים
- **React Hook Form** - ניהול טפסים
- **Zod** - Validation

---

## 📚 מסמכי הפרויקט

הפרויקט כולל מסמכים מפורטים שיעזרו לך להתחיל:

### 🗺️ [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)
**לוח זמנים מפורט לפיתוח הפרויקט**
- 12 שלבי פיתוח מפורטים
- הערכות זמן לכל שלב
- רשימת משימות (checkboxes)
- עדיפויות MVP
- טיפים וקישורים שימושיים

📖 **מתי להשתמש:** תכנון הפרויקט, מעקב התקדמות

---

### 🔧 [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)
**מפרט טכני מלא**
- Database Schema מפורט (כל הטבלאות)
- Supabase Edge Functions עם קוד מלא
- Storage Buckets ו-Policies
- דוגמאות קוד לFrontend
- Hooks מותאמים
- Environment Variables
- Security best practices

📖 **מתי להשתמש:** פיתוח, הבנת המבנה הטכני

---

### 📦 [SETUP_GUIDE.md](./SETUP_GUIDE.md)
**מדריך התקנה והגדרה צעד אחר צעד**
- דרישות מקדימות
- התקנה ראשונית
- הגדרת Supabase
- הגדרת Stripe
- הרצה מקומית
- Deploy לProduction
- פתרון בעיות נפוצות

📖 **מתי להשתמש:** התחלת עבודה, התקנה, פתרון בעיות

---

## 🚀 התקנה מהירה

### תנאי מקדים:
- Node.js 18+
- npm או bun
- חשבון Supabase
- חשבון Stripe (לתשלומים)

### שלבים:

1. **שכפול הפרויקט:**
```bash
git clone <your-repo-url>
cd levelup-hebrew-landing
```

2. **התקנת חבילות:**
```bash
npm install
```

3. **הגדרת Environment Variables:**

צור קובץ `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

4. **הרצת Migrations:**
- לך ל-Supabase Dashboard → SQL Editor
- העתק והרץ את:
  ```
  supabase/migrations/20251027000000_complete_schema_for_course_platform.sql
  ```

5. **הרצת Dev Server:**
```bash
npm run dev
```

האפליקציה תהיה זמינה ב: `http://localhost:5173`

📖 **למדריך מפורט:** ראה [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## 📖 איך להתחיל?

### למפתח חדש בפרויקט:

1. **קרא את הקבצים לפי הסדר הזה:**
   - `README.md` (את זה) ← **אתה כאן! ✅**
   - [SETUP_GUIDE.md](./SETUP_GUIDE.md) ← **הבא**
   - [TECHNICAL_SPEC.md](./TECHNICAL_SPEC.md)
   - [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md)

2. **עקוב אחרי SETUP_GUIDE.md** להתקנה

3. **בדוק את TECHNICAL_SPEC.md** להבנת המבנה

4. **השתמש ב-PROJECT_ROADMAP.md** לתכנון העבודה

---

## 🏗️ מבנה הפרויקט

```
levelup-hebrew-landing/
├── 📁 src/
│   ├── 📁 components/      # קומפוננטות React
│   ├── 📁 pages/          # דפי האפליקציה
│   ├── 📁 hooks/          # Custom hooks
│   ├── 📁 integrations/   # Supabase וכו'
│   └── 📁 lib/            # פונקציות עזר
├── 📁 supabase/
│   ├── 📁 migrations/     # Database migrations
│   └── 📁 functions/      # Edge Functions
├── 📁 public/             # קבצים סטטיים
├── 📄 package.json
├── 📄 .env.local          # Environment variables
├── 📄 PROJECT_ROADMAP.md  # לוח זמנים מפורט
├── 📄 TECHNICAL_SPEC.md   # מפרט טכני
├── 📄 SETUP_GUIDE.md      # מדריך התקנה
└── 📄 README.md           # המסמך הזה
```

---

## 🎯 Status הפרויקט

**גרסה נוכחית:** v0.1.0 (Demo)

**מה עובד:**
- ✅ UI/UX בסיסי
- ✅ דפי משתמשים (עם mock data)
- ✅ דפי Admin (עם mock data)
- ✅ VideoPlayer component
- ✅ Supabase setup חלקי

**מה בעבודה:** (ראה [PROJECT_ROADMAP.md](./PROJECT_ROADMAP.md))
- 🚧 Database Schema מלא
- 🚧 Authentication מלא
- 🚧 אינטגרציית תשלומים
- 🚧 העלאת סרטונים
- 🚧 Progress tracking

---

## 🤝 תרומה לפרויקט

1. צור branch חדש: `git checkout -b feature/amazing-feature`
2. Commit את השינויים: `git commit -m 'Add amazing feature'`
3. Push ל-branch: `git push origin feature/amazing-feature`
4. פתח Pull Request

---

## 📞 צור קשר ותמיכה

- 📧 **Email:** support@leveluphebrew.com
- 🐛 **Bugs:** פתח issue ב-GitHub
- 💡 **Feature Requests:** פתח issue עם התגית `enhancement`

---

## 📝 רישיון

Copyright © 2025 LevelUp Hebrew. All rights reserved.

---

## 🙏 תודות

- [Supabase](https://supabase.com/) - Backend platform מעולה
- [Shadcn UI](https://ui.shadcn.com/) - קומפוננטות UI יפהפיות
- [Stripe](https://stripe.com/) - מערכת תשלומים אמינה
- [Lovable](https://lovable.dev/) - הפרוייקט הראשוני נוצר עם Lovable

---

**מוכנים להתחיל? קראו את [SETUP_GUIDE.md](./SETUP_GUIDE.md) 🚀**
