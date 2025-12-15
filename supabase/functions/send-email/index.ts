/**
 * Supabase Edge Function: Send Email via Resend
 * Handles all email types for Level Up Academy
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Brand Configuration
const BRAND_CONFIG = {
  name: 'Level Up Academy',
  logo: 'https://levelupacademy.co.il/levelup-logo.png',
  website: 'https://levelupacademy.co.il',
  supportEmail: 'support@levelupacademy.co.il',
  colors: {
    primary: '#3B82F6',
    primaryDark: '#2563EB',
    primaryLight: '#EFF6FF',
    success: '#16A34A',
    warning: '#F59E0B',
    error: '#EF4444',
    background: '#FFFFFF',
    surface: '#F8FAFC',
    text: '#0F172A',
    textMuted: '#64748B',
    border: '#E2E8F0',
  },
  font: 'Assistant, Arial, sans-serif',
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Email wrapper generator
function generateEmailWrapper(content: string, previewText?: string): string {
  const { colors, font, logo, name, website, supportEmail } = BRAND_CONFIG;
  
  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${name}</title>
  ${previewText ? `<span style="display: none; max-height: 0; overflow: hidden;">${previewText}</span>` : ''}
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&display=swap');
    body {
      margin: 0;
      padding: 0;
      font-family: ${font};
      background-color: ${colors.surface};
      color: ${colors.text};
      direction: rtl;
      text-align: right;
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${colors.background};
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .email-header {
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
      padding: 32px;
      text-align: center;
    }
    .email-header img {
      max-width: 180px;
      height: auto;
    }
    .email-body {
      padding: 32px;
    }
    .email-footer {
      background-color: ${colors.surface};
      padding: 24px 32px;
      text-align: center;
      font-size: 14px;
      color: ${colors.textMuted};
      border-top: 1px solid ${colors.border};
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.primaryDark} 100%);
      color: #FFFFFF !important;
      padding: 14px 32px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 16px;
      margin: 16px 0;
    }
    .btn-secondary {
      display: inline-block;
      background-color: ${colors.background};
      color: ${colors.primary} !important;
      padding: 12px 28px;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      border: 2px solid ${colors.primary};
    }
    h1 { color: ${colors.text}; font-size: 28px; font-weight: 700; margin: 0 0 16px 0; }
    h2 { color: ${colors.text}; font-size: 22px; font-weight: 600; margin: 0 0 12px 0; }
    p { color: ${colors.text}; font-size: 16px; line-height: 1.6; margin: 0 0 16px 0; }
    .text-muted { color: ${colors.textMuted}; }
    .text-primary { color: ${colors.primary}; }
    .text-success { color: ${colors.success}; }
    .divider { height: 1px; background-color: ${colors.border}; margin: 24px 0; }
    .card { background-color: ${colors.surface}; border-radius: 12px; padding: 20px; margin: 16px 0; }
    .highlight-box {
      background: linear-gradient(135deg, ${colors.primaryLight} 0%, #FFFFFF 100%);
      border-right: 4px solid ${colors.primary};
      padding: 16px 20px;
      border-radius: 8px;
      margin: 16px 0;
    }
    @media only screen and (max-width: 600px) {
      .email-container { border-radius: 0; }
      .email-header, .email-body, .email-footer { padding: 24px 20px; }
      h1 { font-size: 24px; }
    }
  </style>
</head>
<body>
  <div style="padding: 20px; background-color: ${colors.surface};">
    <div class="email-container">
      <div class="email-header">
        <img src="${logo}" alt="${name}" />
      </div>
      <div class="email-body">
        ${content}
      </div>
      <div class="email-footer">
        <p style="margin: 0 0 8px 0;">© ${new Date().getFullYear()} ${name}. כל הזכויות שמורות.</p>
        <p style="margin: 0 0 8px 0;">
          <a href="${website}" style="color: ${colors.primary}; text-decoration: none;">אתר</a>
          &nbsp;|&nbsp;
          <a href="${website}/privacy" style="color: ${colors.primary}; text-decoration: none;">מדיניות פרטיות</a>
          &nbsp;|&nbsp;
          <a href="mailto:${supportEmail}" style="color: ${colors.primary}; text-decoration: none;">תמיכה</a>
        </p>
        <p style="margin: 16px 0 0 0; font-size: 12px;">
          קיבלת את האימייל הזה כי נרשמת ל-${name}.<br>
          <a href="${website}/unsubscribe" style="color: ${colors.textMuted};">לחץ כאן להסרה</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

// Email Templates
const templates: Record<string, (data: any) => { subject: string; html: string }> = {
  // ============================================
  // AUTHENTICATION
  // ============================================
  signup_confirmation: (data) => ({
    subject: 'ברוכים הבאים ל-Level Up Academy! 🎓',
    html: generateEmailWrapper(`
      <h1>ברוכים הבאים ל-Level Up! 🎓</h1>
      <p>שלום ${data.firstName || 'לומד יקר'},</p>
      <p>שמחים שהצטרפת למשפחת Level Up Academy!</p>
      <p>כדי להשלים את ההרשמה ולהתחיל ללמוד, אנא אשר את כתובת האימייל שלך:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.confirmationUrl}" class="btn-primary">אשר את החשבון שלי</a>
      </div>
      <div class="highlight-box">
        <p style="margin: 0;"><strong>מה מחכה לך?</strong></p>
        <ul style="margin: 8px 0 0 0; padding-right: 20px;">
          <li>גישה למאות שעות של תוכן איכותי</li>
          <li>מרצים מהשורה הראשונה</li>
          <li>קהילת סטודנטים תומכת</li>
        </ul>
      </div>
      <p class="text-muted" style="font-size: 14px;">הקישור תקף ל-24 שעות.</p>
    `, 'אשר את החשבון שלך ב-Level Up Academy'),
  }),

  password_reset: (data) => ({
    subject: 'שחזור סיסמה - Level Up Academy 🔐',
    html: generateEmailWrapper(`
      <h1>שחזור סיסמה 🔐</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הכפתור למטה כדי לבחור סיסמה חדשה:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.resetUrl}" class="btn-primary">אפס סיסמה</a>
      </div>
      <div class="card">
        <p style="margin: 0; font-size: 14px;">⏰ <strong>הקישור יפוג בעוד ${data.expiresIn || '1 שעה'}</strong></p>
      </div>
      <p class="text-muted" style="font-size: 14px;">אם לא ביקשת לאפס את הסיסמה, ניתן להתעלם מהודעה זו.</p>
    `, 'איפוס סיסמה - Level Up Academy'),
  }),

  password_changed: (data) => ({
    subject: 'הסיסמה שלך שונתה ✅',
    html: generateEmailWrapper(`
      <h1>הסיסמה שונתה בהצלחה ✅</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>הסיסמה שלך שונתה בהצלחה.</p>
      <div class="card" style="background-color: ${BRAND_CONFIG.colors.primaryLight};">
        <p style="margin: 0;">אם <strong>לא</strong> ביצעת את השינוי הזה, צור איתנו קשר מיידית:</p>
        <p style="margin: 8px 0 0 0;"><a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${BRAND_CONFIG.colors.primary};">${BRAND_CONFIG.supportEmail}</a></p>
      </div>
    `, 'הסיסמה שלך שונתה'),
  }),

  magic_link: (data) => ({
    subject: 'קישור התחברות 🔗',
    html: generateEmailWrapper(`
      <h1>קישור התחברות 🔗</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>לחץ על הכפתור למטה כדי להתחבר לחשבון שלך:</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.magicLinkUrl}" class="btn-primary">התחבר עכשיו</a>
      </div>
      <p class="text-muted" style="font-size: 14px;">⏰ הקישור תקף ל-15 דקות בלבד ולשימוש חד פעמי.</p>
    `, 'קישור התחברות ל-Level Up Academy'),
  }),

  // ============================================
  // PAYMENTS
  // ============================================
  purchase_confirmation: (data) => {
    const formattedAmount = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: data.currency || 'ILS',
    }).format(data.amount);

    return {
      subject: `אישור רכישה - ${data.courseName} 🎉`,
      html: generateEmailWrapper(`
        <h1>תודה על הרכישה! 🎉</h1>
        <p>שלום ${data.firstName || ''},</p>
        <p>הרכישה שלך הושלמה בהצלחה! אנחנו נרגשים שבחרת ללמוד איתנו.</p>
        <div class="card">
          ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
          <h2 style="color: ${BRAND_CONFIG.colors.primary}; margin: 0 0 16px 0;">${data.courseName}</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_CONFIG.colors.border};">מספר הזמנה:</td><td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_CONFIG.colors.border}; text-align: left; font-weight: 600;">${data.orderId}</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_CONFIG.colors.border};">תאריך רכישה:</td><td style="padding: 8px 0; border-bottom: 1px solid ${BRAND_CONFIG.colors.border}; text-align: left;">${data.purchaseDate}</td></tr>
            <tr><td style="padding: 8px 0; font-weight: 700; font-size: 18px;">סה"כ:</td><td style="padding: 8px 0; text-align: left; font-weight: 700; font-size: 18px; color: ${BRAND_CONFIG.colors.success};">${formattedAmount}</td></tr>
          </table>
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${BRAND_CONFIG.website}/my-courses" class="btn-primary">התחל ללמוד עכשיו</a>
        </div>
      `, `אישור רכישה - ${data.courseName}`),
    };
  },

  payment_failed: (data) => {
    const formattedAmount = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: data.currency || 'ILS',
    }).format(data.amount);

    return {
      subject: 'התשלום לא הושלם ❌',
      html: generateEmailWrapper(`
        <h1>התשלום לא הושלם ❌</h1>
        <p>שלום ${data.firstName || ''},</p>
        <p>לצערנו, התשלום עבור הקורס <strong>${data.courseName}</strong> לא הושלם.</p>
        <div class="card" style="border-right: 4px solid ${BRAND_CONFIG.colors.error};">
          <p><strong>סכום:</strong> ${formattedAmount}</p>
          ${data.reason ? `<p><strong>סיבה:</strong> ${data.reason}</p>` : ''}
        </div>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${BRAND_CONFIG.website}/checkout" class="btn-primary">נסה שוב</a>
        </div>
      `, 'התשלום לא הושלם'),
    };
  },

  refund_processed: (data) => {
    const formattedAmount = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: data.currency || 'ILS',
    }).format(data.amount);

    return {
      subject: 'החזר כספי אושר 💰',
      html: generateEmailWrapper(`
        <h1>החזר כספי אושר 💰</h1>
        <p>שלום ${data.firstName || ''},</p>
        <p>ההחזר הכספי שלך אושר ומעובד.</p>
        <div class="card">
          <table style="width: 100%;">
            <tr><td style="padding: 8px 0;">מספר הזמנה:</td><td style="text-align: left; font-weight: 600;">${data.orderId}</td></tr>
            <tr><td style="padding: 8px 0;">קורס:</td><td style="text-align: left;">${data.courseName}</td></tr>
            <tr><td style="padding: 8px 0;">סכום החזר:</td><td style="text-align: left; font-weight: 700; color: ${BRAND_CONFIG.colors.success};">${formattedAmount}</td></tr>
          </table>
        </div>
        <p>ההחזר יופיע בחשבון שלך תוך 5-10 ימי עסקים.</p>
      `, 'החזר כספי אושר'),
    };
  },

  // ============================================
  // COURSES
  // ============================================
  course_welcome: (data) => ({
    subject: `ברוכים הבאים לקורס ${data.courseName}! 📚`,
    html: generateEmailWrapper(`
      <h1>ברוכים הבאים לקורס! 📚</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>נרשמת בהצלחה לקורס <strong>${data.courseName}</strong>!</p>
      <div class="card">
        ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
        <table style="width: 100%;">
          <tr><td style="padding: 8px 0;">👨‍🏫 מרצה:</td><td style="text-align: left;">${data.instructorName}</td></tr>
          <tr><td style="padding: 8px 0;">📖 מספר שיעורים:</td><td style="text-align: left;">${data.totalLessons}</td></tr>
          <tr><td style="padding: 8px 0;">⏱️ משך משוער:</td><td style="text-align: left;">${data.estimatedDuration}</td></tr>
        </table>
      </div>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.courseUrl}" class="btn-primary">התחל ללמוד</a>
      </div>
    `, `ברוכים הבאים לקורס ${data.courseName}`),
  }),

  course_completed: (data) => ({
    subject: `🎉 מזל טוב! סיימת את ${data.courseName}`,
    html: generateEmailWrapper(`
      <div style="text-align: center;">
        <h1>🎉 מזל טוב! 🎉</h1>
        <p style="font-size: 20px;">סיימת את הקורס <strong>${data.courseName}</strong>!</p>
      </div>
      <div class="card" style="background: linear-gradient(135deg, ${BRAND_CONFIG.colors.primaryLight} 0%, #FFFFFF 100%); text-align: center;">
        <p style="font-size: 18px; margin: 0 0 8px 0;">🏆 הישג נפתח!</p>
        <p style="font-size: 24px; font-weight: 700; color: ${BRAND_CONFIG.colors.primary}; margin: 0;">בוגר קורס</p>
      </div>
      <div class="card">
        <table style="width: 100%;">
          <tr><td style="padding: 8px 0;">📅 תאריך סיום:</td><td style="text-align: left;">${data.completionDate}</td></tr>
          <tr><td style="padding: 8px 0;">⏱️ סה"כ זמן למידה:</td><td style="text-align: left;">${data.totalWatchTime}</td></tr>
        </table>
      </div>
      ${data.certificateUrl ? `
      <div style="text-align: center; margin: 32px 0;">
        <p>התעודה שלך מוכנה!</p>
        <a href="${data.certificateUrl}" class="btn-primary">הורד תעודה</a>
      </div>
      ` : ''}
    `, `מזל טוב! סיימת את ${data.courseName}`),
  }),

  weekly_progress: (data) => ({
    subject: `סיכום שבועי - ${data.courseName} 📊`,
    html: generateEmailWrapper(`
      <h1>סיכום שבועי 📊</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>הנה סיכום ההתקדמות שלך בקורס <strong>${data.courseName}</strong>:</p>
      <div class="card" style="text-align: center;">
        <div style="font-size: 48px; font-weight: 700; color: ${BRAND_CONFIG.colors.primary};">${data.progressPercent}%</div>
        <p style="margin: 8px 0 0 0; color: ${BRAND_CONFIG.colors.textMuted};">השלמת הקורס</p>
      </div>
      <p>נשארו לך עוד <strong>${data.totalLessons - data.completedLessons}</strong> שיעורים להשלמת הקורס. אתה יכול!</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.continueUrl}" class="btn-primary">המשך ללמוד</a>
      </div>
    `, `סיכום שבועי - ${data.courseName}`),
  }),

  continue_learning_reminder: (data) => ({
    subject: 'חסר לנו! המשך את הלמידה 👋',
    html: generateEmailWrapper(`
      <h1>חסר לנו! 👋</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>שמנו לב שלא ביקרת אצלנו כבר ${data.daysInactive} ימים.</p>
      <div class="card">
        <p style="margin: 0 0 8px 0;"><strong>הקורס שלך:</strong> ${data.courseName}</p>
        <p style="margin: 0 0 8px 0;"><strong>התקדמות:</strong> ${data.progressPercent}%</p>
      </div>
      <p>המשך מאיפה שהפסקת - אתה קרוב יותר למטרה משאתה חושב!</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${data.continueUrl}" class="btn-primary">המשך ללמוד</a>
      </div>
    `, 'המשך את הלמידה שלך'),
  }),

  // ============================================
  // MARKETING
  // ============================================
  abandoned_cart: (data) => {
    const formattedPrice = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: 'ILS',
    }).format(data.originalPrice);

    return {
      subject: `שכחת משהו? ${data.courseName} מחכה לך 🛒`,
      html: generateEmailWrapper(`
        <h1>שכחת משהו? 🛒</h1>
        <p>שלום ${data.firstName || ''},</p>
        <p>שמנו לב שהשארת את הקורס <strong>${data.courseName}</strong> בעגלה.</p>
        <div class="card">
          ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
          <h2 style="margin: 0 0 8px 0;">${data.courseName}</h2>
          <p style="font-size: 24px; font-weight: 700; color: ${BRAND_CONFIG.colors.primary}; margin: 0;">${formattedPrice}</p>
        </div>
        ${data.discountCode ? `
        <div class="highlight-box" style="background: linear-gradient(135deg, ${BRAND_CONFIG.colors.success}15 0%, ${BRAND_CONFIG.colors.success}05 100%); border-color: ${BRAND_CONFIG.colors.success};">
          <p style="margin: 0; text-align: center;">
            🎁 <strong>מתנה מיוחדת!</strong><br>
            השתמש בקוד <span style="background-color: ${BRAND_CONFIG.colors.success}20; padding: 4px 12px; border-radius: 4px; font-weight: 700;">${data.discountCode}</span><br>
            לקבלת <strong>${data.discountPercent}% הנחה</strong>!
          </p>
        </div>
        ` : ''}
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.checkoutUrl}" class="btn-primary">השלם רכישה</a>
        </div>
      `, `השלם את הרכישה שלך - ${data.courseName}`),
    };
  },

  discount_code: (data) => ({
    subject: `קוד הנחה מיוחד: ${data.discountPercent}% הנחה! 🎁`,
    html: generateEmailWrapper(`
      <h1>קוד הנחה מיוחד! 🎁</h1>
      <p>שלום ${data.firstName || ''},</p>
      <p>קיבלת קוד הנחה בלעדי!</p>
      <div style="text-align: center; margin: 32px 0;">
        <div style="background: linear-gradient(135deg, ${BRAND_CONFIG.colors.primaryLight} 0%, #FFFFFF 100%); border: 2px dashed ${BRAND_CONFIG.colors.primary}; border-radius: 12px; padding: 24px;">
          <p style="margin: 0 0 8px 0; color: ${BRAND_CONFIG.colors.textMuted};">קוד ההנחה שלך:</p>
          <p style="font-size: 32px; font-weight: 700; color: ${BRAND_CONFIG.colors.primary}; margin: 0; letter-spacing: 4px;">${data.code}</p>
          <p style="margin: 16px 0 0 0; font-size: 24px; font-weight: 600; color: ${BRAND_CONFIG.colors.success};">${data.discountPercent}% הנחה!</p>
        </div>
      </div>
      <div class="card">
        <p style="margin: 0;">⏰ <strong>תוקף:</strong> עד ${data.expiresAt}</p>
      </div>
      <div style="text-align: center; margin: 32px 0;">
        <a href="${BRAND_CONFIG.website}" class="btn-primary">בחר קורס</a>
      </div>
    `, `קוד הנחה: ${data.discountPercent}% הנחה!`),
  }),

  // ============================================
  // ADMIN
  // ============================================
  new_purchase_alert: (data) => {
    const formattedAmount = new Intl.NumberFormat('he-IL', {
      style: 'currency',
      currency: data.currency || 'ILS',
    }).format(data.amount);

    return {
      subject: `💰 רכישה חדשה: ${formattedAmount}`,
      html: generateEmailWrapper(`
        <h1>רכישה חדשה! 💰</h1>
        <div class="card" style="background: linear-gradient(135deg, ${BRAND_CONFIG.colors.success}15 0%, #FFFFFF 100%);">
          <table style="width: 100%;">
            <tr><td style="padding: 8px 0;"><strong>לקוח:</strong></td><td style="text-align: left;">${data.customerName}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>אימייל:</strong></td><td style="text-align: left;">${data.customerEmail}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>קורס:</strong></td><td style="text-align: left;">${data.courseName}</td></tr>
            <tr><td style="padding: 8px 0;"><strong>סכום:</strong></td><td style="text-align: left; font-size: 20px; font-weight: 700; color: ${BRAND_CONFIG.colors.success};">${formattedAmount}</td></tr>
          </table>
        </div>
        <div style="text-align: center; margin: 24px 0;">
          <a href="${BRAND_CONFIG.website}/admin" class="btn-secondary">צפה בדאשבורד</a>
        </div>
      `, `רכישה חדשה: ${formattedAmount}`),
    };
  },

  new_user_alert: (data) => ({
    subject: `🎉 משתמש חדש: ${data.userName}`,
    html: generateEmailWrapper(`
      <h1>משתמש חדש נרשם! 🎉</h1>
      <div class="card">
        <table style="width: 100%;">
          <tr><td style="padding: 8px 0;"><strong>שם:</strong></td><td style="text-align: left;">${data.userName}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>אימייל:</strong></td><td style="text-align: left;">${data.userEmail}</td></tr>
          <tr><td style="padding: 8px 0;"><strong>תאריך הרשמה:</strong></td><td style="text-align: left;">${data.signupDate}</td></tr>
        </table>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${BRAND_CONFIG.website}/admin/students" class="btn-secondary">צפה בסטודנטים</a>
      </div>
    `, `משתמש חדש: ${data.userName}`),
  }),
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }

    const { type, data } = await req.json();

    // Validate email type
    if (!templates[type]) {
      throw new Error(`Unknown email type: ${type}`);
    }

    // Generate email content
    const { subject, html } = templates[type](data);

    // Send via Resend
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Level Up Academy <noreply@levelupacademy.co.il>',
        to: data.to,
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Resend API error: ${JSON.stringify(errorData)}`);
    }

    const result = await response.json();

    // Log email sent (optional: store in database)
    console.log(`Email sent: ${type} to ${data.to}`, result);

    return new Response(
      JSON.stringify({ success: true, id: result.id }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

