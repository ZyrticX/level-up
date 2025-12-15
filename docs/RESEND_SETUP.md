# 📧 הגדרת Resend עבור Level Up Academy

## סקירה כללית

המערכת משתמשת ב-[Resend](https://resend.com) לשליחת כל סוגי האימיילים:
- אימיילי אימות (הרשמה, שחזור סיסמה)
- אימיילי רכישה (אישורים, קבלות, החזרים)
- אימיילי קורסים (ברוכים הבאים, התקדמות, סיום)
- אימיילי שיווק (הנחות, עגלה נטושה)
- אימיילי אדמין (התראות על רכישות/משתמשים חדשים)

---

## 🚀 שלבי ההתקנה

### שלב 1: יצירת חשבון Resend

1. היכנס ל-[resend.com](https://resend.com) וצור חשבון
2. לך ל-**API Keys** ויצור מפתח חדש
3. שמור את המפתח במקום בטוח

### שלב 2: הגדרת דומיין

1. ב-Resend Dashboard, לך ל-**Domains**
2. הוסף את הדומיין `levelupacademy.co.il`
3. הוסף את רשומות ה-DNS הנדרשות:

```
# SPF Record
Type: TXT
Host: @
Value: v=spf1 include:_spf.resend.com ~all

# DKIM Record
Type: TXT
Host: resend._domainkey
Value: [יסופק על ידי Resend]

# MX Record (אופציונלי - לקבלת אימיילים)
Type: MX
Host: @
Value: feedback-smtp.resend.com
Priority: 10
```

4. המתן לאימות (יכול לקחת עד 72 שעות)

### שלב 3: הגדרת Supabase Edge Function

1. **הוסף את מפתח ה-API ל-Supabase Secrets:**

```bash
supabase secrets set RESEND_API_KEY=re_xxxxxxxxxxxxx
```

2. **פרסם את ה-Edge Function:**

```bash
supabase functions deploy send-email
```

### שלב 4: הרצת המיגרציה

```bash
supabase db push
```

או הרץ ידנית ב-SQL Editor:
```sql
-- הרץ את התוכן של:
-- supabase/migrations/20251215000000_email_triggers.sql
```

### שלב 5: הגדרת Cron Jobs (אופציונלי)

להפעלת אימיילים אוטומטיים (סיכום שבועי, תזכורות):

**ב-Supabase Dashboard → Database → Extensions:**
1. הפעל את `pg_cron`

**ב-SQL Editor:**
```sql
-- סיכום שבועי - כל יום ראשון ב-10:00
SELECT cron.schedule(
    'weekly-progress-emails',
    '0 10 * * 0',
    $$SELECT public.send_weekly_progress_emails()$$
);

-- תזכורות המשך למידה - כל יום ב-18:00
SELECT cron.schedule(
    'continue-learning-reminders',
    '0 18 * * *',
    $$SELECT public.send_continue_learning_reminders()$$
);
```

---

## 🔧 הגדרת Supabase Auth עם Resend SMTP

אם תרצה שגם אימיילי Supabase Auth (הרשמה, שחזור סיסמה) יעברו דרך Resend:

1. לך ל-**Supabase Dashboard → Authentication → SMTP Settings**
2. הפעל **Enable Custom SMTP**
3. מלא את הפרטים:

```
Host: smtp.resend.com
Port: 465
Username: resend
Password: re_xxxxxxxxxxxxx (מפתח ה-API שלך)
Sender email: noreply@levelupacademy.co.il
Sender name: Level Up Academy
```

---

## 📋 רשימת סוגי האימיילים

### Authentication
| Type | Description |
|------|-------------|
| `signup_confirmation` | אישור הרשמה |
| `password_reset` | שחזור סיסמה |
| `password_changed` | סיסמה שונתה |
| `magic_link` | קישור התחברות |
| `email_change` | שינוי אימייל |
| `invite_user` | הזמנת משתמש |
| `security_alert` | התראת אבטחה |

### Payments
| Type | Description |
|------|-------------|
| `purchase_confirmation` | אישור רכישה |
| `invoice_receipt` | חשבונית |
| `payment_failed` | תשלום נכשל |
| `refund_processed` | החזר כספי |
| `discount_code` | קוד הנחה |

### Courses
| Type | Description |
|------|-------------|
| `course_welcome` | ברוכים הבאים לקורס |
| `new_lesson` | שיעור חדש |
| `continue_learning_reminder` | תזכורת המשך למידה |
| `weekly_progress` | סיכום שבועי |
| `course_completed` | סיום קורס |
| `certificate` | תעודה |
| `new_course_recommendation` | המלצה על קורס |

### Marketing
| Type | Description |
|------|-------------|
| `abandoned_cart` | עגלה נטושה |
| `newsletter` | ניוזלטר |
| `special_offer` | מבצע מיוחד |
| `birthday_greeting` | ברכת יום הולדת |

### Admin
| Type | Description |
|------|-------------|
| `new_purchase_alert` | התראת רכישה חדשה |
| `new_user_alert` | התראת משתמש חדש |
| `daily_sales_report` | דוח מכירות יומי |

---

## 💻 שימוש בקוד

### שליחת אימייל מהקליינט

```typescript
import { emailService } from '@/services';

// שליחת אימייל רכישה
await emailService.sendPurchaseConfirmation({
  to: 'user@example.com',
  firstName: 'ישראל',
  orderId: 'ORD-123',
  courseName: 'מבוא לתכנות',
  amount: 299,
  currency: 'ILS',
  paymentMethod: 'כרטיס אשראי',
  purchaseDate: '15/12/2025',
});

// שליחת קוד הנחה
await emailService.sendDiscountCode({
  to: 'user@example.com',
  firstName: 'ישראל',
  code: 'SAVE20',
  discountPercent: 20,
  expiresAt: '31/12/2025',
});
```

### שליחה ישירה דרך Edge Function

```typescript
const { data, error } = await supabase.functions.invoke('send-email', {
  body: {
    type: 'course_welcome',
    data: {
      to: 'user@example.com',
      firstName: 'ישראל',
      courseName: 'מבוא לתכנות',
      instructorName: 'ד"ר כהן',
      totalLessons: 24,
      estimatedDuration: '12 שעות',
      courseUrl: 'https://levelupacademy.co.il/course/123',
    },
  },
});
```

---

## 🔍 מעקב ולוגים

### צפייה בלוגים של אימיילים שנשלחו

```sql
SELECT * FROM public.email_logs
ORDER BY created_at DESC
LIMIT 100;
```

### סטטיסטיקות

```sql
SELECT 
    email_type,
    status,
    COUNT(*) as count
FROM public.email_logs
WHERE created_at > now() - INTERVAL '7 days'
GROUP BY email_type, status
ORDER BY count DESC;
```

---

## ⚙️ העדפות משתמש

משתמשים יכולים לנהל את העדפות האימייל שלהם:

```typescript
// עדכון העדפות
const { error } = await supabase
  .from('email_preferences')
  .upsert({
    user_id: userId,
    receive_marketing: false,
    receive_newsletter: false,
  });

// ביטול מנוי (unsubscribe)
const { error } = await supabase
  .from('email_preferences')
  .update({ 
    receive_marketing: false,
    receive_newsletter: false,
    unsubscribed_at: new Date().toISOString(),
  })
  .eq('user_id', userId);
```

---

## 🎨 התאמת תבניות

כל התבניות נמצאות ב:
- `src/services/email-templates.ts` (Client-side)
- `supabase/functions/send-email/index.ts` (Edge Function)

צבעי המותג:
- Primary Blue: `#3B82F6`
- Primary Dark: `#2563EB`
- Success: `#16A34A`
- Warning: `#F59E0B`
- Error: `#EF4444`

---

## 📞 תמיכה

- [Resend Documentation](https://resend.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- שאלות? פתח Issue ב-GitHub

