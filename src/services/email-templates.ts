/**
 * Email Templates for Level Up Academy
 * All templates are in Hebrew (RTL) with Level Up branding
 */

import { BRAND_CONFIG, generateEmailWrapper } from './email.service';

const { colors } = BRAND_CONFIG;

// ============================================
// AUTHENTICATION EMAILS
// ============================================

export function signupConfirmationTemplate(data: {
  firstName?: string;
  confirmationUrl: string;
}): string {
  const content = `
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
        <li>תעודות הסמכה מוכרות</li>
      </ul>
    </div>
    
    <p class="text-muted" style="font-size: 14px;">
      הקישור תקף ל-24 שעות. אם לא ביקשת להירשם, ניתן להתעלם מהודעה זו.
    </p>
  `;
  
  return generateEmailWrapper(content, 'אשר את החשבון שלך ב-Level Up Academy');
}

export function passwordResetTemplate(data: {
  firstName?: string;
  resetUrl: string;
  expiresIn?: string;
}): string {
  const content = `
    <h1>שחזור סיסמה 🔐</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>קיבלנו בקשה לאיפוס הסיסמה שלך. לחץ על הכפתור למטה כדי לבחור סיסמה חדשה:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.resetUrl}" class="btn-primary">אפס סיסמה</a>
    </div>
    
    <div class="card">
      <p style="margin: 0; font-size: 14px;">
        ⏰ <strong>הקישור יפוג בעוד ${data.expiresIn || '1 שעה'}</strong>
      </p>
    </div>
    
    <p class="text-muted" style="font-size: 14px;">
      אם לא ביקשת לאפס את הסיסמה, ניתן להתעלם מהודעה זו. הסיסמה שלך תישאר ללא שינוי.
    </p>
    
    <div class="divider"></div>
    
    <p class="text-muted" style="font-size: 14px;">
      <strong>טיפ לאבטחה:</strong> לעולם אל תשתף את הסיסמה שלך עם אחרים, ובחר סיסמה חזקה עם לפחות 8 תווים.
    </p>
  `;
  
  return generateEmailWrapper(content, 'איפוס סיסמה - Level Up Academy');
}

export function passwordChangedTemplate(data: {
  firstName?: string;
}): string {
  const content = `
    <h1>הסיסמה שונתה בהצלחה ✅</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>הסיסמה שלך שונתה בהצלחה.</p>
    
    <div class="card" style="background-color: ${colors.primaryLight};">
      <p style="margin: 0;">
        אם <strong>לא</strong> ביצעת את השינוי הזה, צור איתנו קשר מיידית:
      </p>
      <p style="margin: 8px 0 0 0;">
        <a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${colors.primary};">${BRAND_CONFIG.supportEmail}</a>
      </p>
    </div>
    
    <p class="text-muted" style="font-size: 14px;">
      לאבטחת החשבון שלך, אנו שולחים התראה בכל פעם שהסיסמה משתנה.
    </p>
  `;
  
  return generateEmailWrapper(content, 'הסיסמה שלך שונתה');
}

export function magicLinkTemplate(data: {
  firstName?: string;
  magicLinkUrl: string;
}): string {
  const content = `
    <h1>קישור התחברות 🔗</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>לחץ על הכפתור למטה כדי להתחבר לחשבון שלך:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.magicLinkUrl}" class="btn-primary">התחבר עכשיו</a>
    </div>
    
    <p class="text-muted" style="font-size: 14px;">
      ⏰ הקישור תקף ל-15 דקות בלבד ולשימוש חד פעמי.
    </p>
    
    <p class="text-muted" style="font-size: 14px;">
      אם לא ביקשת להתחבר, ניתן להתעלם מהודעה זו.
    </p>
  `;
  
  return generateEmailWrapper(content, 'קישור התחברות ל-Level Up Academy');
}

// ============================================
// PAYMENT EMAILS
// ============================================

export function purchaseConfirmationTemplate(data: {
  firstName?: string;
  orderId: string;
  courseName: string;
  courseImage?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  purchaseDate: string;
}): string {
  const formattedAmount = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: data.currency || 'ILS',
  }).format(data.amount);

  const content = `
    <h1>תודה על הרכישה! 🎉</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>הרכישה שלך הושלמה בהצלחה! אנחנו נרגשים שבחרת ללמוד איתנו.</p>
    
    <div class="card">
      ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
      <h2 style="color: ${colors.primary}; margin: 0 0 16px 0;">${data.courseName}</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid ${colors.border};">מספר הזמנה:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid ${colors.border}; text-align: left; font-weight: 600;">${data.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid ${colors.border};">תאריך רכישה:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid ${colors.border}; text-align: left;">${data.purchaseDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid ${colors.border};">אמצעי תשלום:</td>
          <td style="padding: 8px 0; border-bottom: 1px solid ${colors.border}; text-align: left;">${data.paymentMethod}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: 700; font-size: 18px;">סה"כ:</td>
          <td style="padding: 8px 0; text-align: left; font-weight: 700; font-size: 18px; color: ${colors.success};">${formattedAmount}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${BRAND_CONFIG.website}/my-courses" class="btn-primary">התחל ללמוד עכשיו</a>
    </div>
    
    <div class="highlight-box">
      <p style="margin: 0;"><strong>💡 טיפ:</strong> הקורס זמין לך לצמיתות! תוכל לצפות בשיעורים בכל זמן ומכל מקום.</p>
    </div>
  `;
  
  return generateEmailWrapper(content, `אישור רכישה - ${data.courseName}`);
}

export function paymentFailedTemplate(data: {
  firstName?: string;
  courseName: string;
  amount: number;
  currency: string;
  reason?: string;
}): string {
  const formattedAmount = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: data.currency || 'ILS',
  }).format(data.amount);

  const content = `
    <h1>התשלום לא הושלם ❌</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>לצערנו, התשלום עבור הקורס <strong>${data.courseName}</strong> לא הושלם.</p>
    
    <div class="card" style="border-right: 4px solid ${colors.error};">
      <p><strong>סכום:</strong> ${formattedAmount}</p>
      ${data.reason ? `<p><strong>סיבה:</strong> ${data.reason}</p>` : ''}
    </div>
    
    <p>אנא נסה שוב או השתמש באמצעי תשלום אחר:</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${BRAND_CONFIG.website}/checkout" class="btn-primary">נסה שוב</a>
    </div>
    
    <p class="text-muted" style="font-size: 14px;">
      נתקלת בבעיה? צוות התמיכה שלנו כאן לעזור: 
      <a href="mailto:${BRAND_CONFIG.supportEmail}" style="color: ${colors.primary};">${BRAND_CONFIG.supportEmail}</a>
    </p>
  `;
  
  return generateEmailWrapper(content, 'התשלום לא הושלם');
}

export function refundProcessedTemplate(data: {
  firstName?: string;
  orderId: string;
  courseName: string;
  amount: number;
  currency: string;
}): string {
  const formattedAmount = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: data.currency || 'ILS',
  }).format(data.amount);

  const content = `
    <h1>החזר כספי אושר 💰</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>ההחזר הכספי שלך אושר ומעובד.</p>
    
    <div class="card">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0;">מספר הזמנה:</td>
          <td style="text-align: left; font-weight: 600;">${data.orderId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">קורס:</td>
          <td style="text-align: left;">${data.courseName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">סכום החזר:</td>
          <td style="text-align: left; font-weight: 700; color: ${colors.success};">${formattedAmount}</td>
        </tr>
      </table>
    </div>
    
    <p>ההחזר יופיע בחשבון שלך תוך 5-10 ימי עסקים.</p>
    
    <p class="text-muted" style="font-size: 14px;">
      אנחנו מצטערים שהקורס לא התאים לך. נשמח לשמוע מה יכולנו לעשות טוב יותר.
    </p>
  `;
  
  return generateEmailWrapper(content, 'החזר כספי אושר');
}

// ============================================
// COURSE EMAILS
// ============================================

export function courseWelcomeTemplate(data: {
  firstName?: string;
  courseName: string;
  courseImage?: string;
  instructorName: string;
  totalLessons: number;
  estimatedDuration: string;
  courseUrl: string;
}): string {
  const content = `
    <h1>ברוכים הבאים לקורס! 📚</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>נרשמת בהצלחה לקורס <strong>${data.courseName}</strong>!</p>
    
    <div class="card">
      ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
      
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0;">👨‍🏫 מרצה:</td>
          <td style="text-align: left;">${data.instructorName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">📖 מספר שיעורים:</td>
          <td style="text-align: left;">${data.totalLessons}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">⏱️ משך משוער:</td>
          <td style="text-align: left;">${data.estimatedDuration}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.courseUrl}" class="btn-primary">התחל ללמוד</a>
    </div>
    
    <div class="highlight-box">
      <p style="margin: 0 0 8px 0;"><strong>💡 טיפים להצלחה:</strong></p>
      <ol style="margin: 0; padding-right: 20px;">
        <li>קבע זמן קבוע ללמידה כל יום</li>
        <li>רשום הערות תוך כדי צפייה</li>
        <li>תרגל את מה שלמדת</li>
        <li>אל תהסס לשאול שאלות!</li>
      </ol>
    </div>
  `;
  
  return generateEmailWrapper(content, `ברוכים הבאים לקורס ${data.courseName}`);
}

export function newLessonTemplate(data: {
  firstName?: string;
  courseName: string;
  lessonTitle: string;
  lessonNumber: number;
  duration: string;
  lessonUrl: string;
}): string {
  const content = `
    <h1>שיעור חדש זמין! 🆕</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>שיעור חדש נוסף לקורס <strong>${data.courseName}</strong>:</p>
    
    <div class="card" style="background: linear-gradient(135deg, ${colors.primaryLight} 0%, #FFFFFF 100%);">
      <h2 style="margin: 0 0 8px 0; color: ${colors.primary};">
        שיעור ${data.lessonNumber}: ${data.lessonTitle}
      </h2>
      <p style="margin: 0; color: ${colors.textMuted};">⏱️ ${data.duration}</p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.lessonUrl}" class="btn-primary">צפה בשיעור</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `שיעור חדש: ${data.lessonTitle}`);
}

export function continueLearningReminderTemplate(data: {
  firstName?: string;
  courseName: string;
  lastLessonTitle: string;
  progressPercent: number;
  daysInactive: number;
  continueUrl: string;
}): string {
  const content = `
    <h1>חסר לנו! 👋</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>שמנו לב שלא ביקרת אצלנו כבר ${data.daysInactive} ימים.</p>
    
    <div class="card">
      <p style="margin: 0 0 8px 0;"><strong>הקורס שלך:</strong> ${data.courseName}</p>
      <p style="margin: 0 0 8px 0;"><strong>השיעור האחרון:</strong> ${data.lastLessonTitle}</p>
      
      <div style="background-color: ${colors.surface}; border-radius: 8px; padding: 12px; margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>התקדמות:</span>
          <span style="font-weight: 700; color: ${colors.primary};">${data.progressPercent}%</span>
        </div>
        <div style="background-color: ${colors.border}; border-radius: 4px; height: 8px; margin-top: 8px;">
          <div style="background: linear-gradient(90deg, ${colors.primary}, ${colors.primaryDark}); border-radius: 4px; height: 100%; width: ${data.progressPercent}%;"></div>
        </div>
      </div>
    </div>
    
    <p>המשך מאיפה שהפסקת - אתה קרוב יותר למטרה משאתה חושב!</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.continueUrl}" class="btn-primary">המשך ללמוד</a>
    </div>
  `;
  
  return generateEmailWrapper(content, 'המשך את הלמידה שלך');
}

export function weeklyProgressTemplate(data: {
  firstName?: string;
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  watchedMinutes: number;
  continueUrl: string;
}): string {
  const content = `
    <h1>סיכום שבועי 📊</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>הנה סיכום ההתקדמות שלך בקורס <strong>${data.courseName}</strong>:</p>
    
    <div class="card" style="text-align: center;">
      <div style="font-size: 48px; font-weight: 700; color: ${colors.primary};">${data.progressPercent}%</div>
      <p style="margin: 8px 0 0 0; color: ${colors.textMuted};">השלמת הקורס</p>
    </div>
    
    <div style="display: flex; gap: 16px; margin: 24px 0;">
      <div class="card" style="flex: 1; text-align: center;">
        <div style="font-size: 28px; font-weight: 700; color: ${colors.success};">${data.completedLessons}</div>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: ${colors.textMuted};">שיעורים הושלמו</p>
      </div>
      <div class="card" style="flex: 1; text-align: center;">
        <div style="font-size: 28px; font-weight: 700; color: ${colors.primary};">${data.watchedMinutes}</div>
        <p style="margin: 4px 0 0 0; font-size: 14px; color: ${colors.textMuted};">דקות צפייה</p>
      </div>
    </div>
    
    <p>נשארו לך עוד <strong>${data.totalLessons - data.completedLessons}</strong> שיעורים להשלמת הקורס. אתה יכול!</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.continueUrl}" class="btn-primary">המשך ללמוד</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `סיכום שבועי - ${data.courseName}`);
}

export function courseCompletedTemplate(data: {
  firstName?: string;
  courseName: string;
  completionDate: string;
  certificateUrl?: string;
  totalWatchTime: string;
}): string {
  const content = `
    <div style="text-align: center;">
      <h1>🎉 מזל טוב! 🎉</h1>
      <p style="font-size: 20px;">סיימת את הקורס <strong>${data.courseName}</strong>!</p>
    </div>
    
    <div class="card" style="background: linear-gradient(135deg, ${colors.primaryLight} 0%, #FFFFFF 100%); text-align: center;">
      <p style="font-size: 18px; margin: 0 0 8px 0;">🏆 הישג נפתח!</p>
      <p style="font-size: 24px; font-weight: 700; color: ${colors.primary}; margin: 0;">בוגר קורס</p>
    </div>
    
    <div class="card">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0;">📅 תאריך סיום:</td>
          <td style="text-align: left;">${data.completionDate}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;">⏱️ סה"כ זמן למידה:</td>
          <td style="text-align: left;">${data.totalWatchTime}</td>
        </tr>
      </table>
    </div>
    
    ${data.certificateUrl ? `
    <div style="text-align: center; margin: 32px 0;">
      <p>התעודה שלך מוכנה!</p>
      <a href="${data.certificateUrl}" class="btn-primary">הורד תעודה</a>
    </div>
    ` : ''}
    
    <div class="highlight-box">
      <p style="margin: 0;"><strong>מה עכשיו?</strong></p>
      <p style="margin: 8px 0 0 0;">המשך להתפתח עם הקורסים המומלצים שלנו!</p>
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BRAND_CONFIG.website}" class="btn-secondary">גלה קורסים נוספים</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `מזל טוב! סיימת את ${data.courseName}`);
}

// ============================================
// MARKETING EMAILS
// ============================================

export function abandonedCartTemplate(data: {
  firstName?: string;
  courseName: string;
  courseImage?: string;
  originalPrice: number;
  discountCode?: string;
  discountPercent?: number;
  checkoutUrl: string;
}): string {
  const formattedPrice = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(data.originalPrice);

  const content = `
    <h1>שכחת משהו? 🛒</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>שמנו לב שהשארת את הקורס <strong>${data.courseName}</strong> בעגלה.</p>
    
    <div class="card">
      ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
      <h2 style="margin: 0 0 8px 0;">${data.courseName}</h2>
      <p style="font-size: 24px; font-weight: 700; color: ${colors.primary}; margin: 0;">${formattedPrice}</p>
    </div>
    
    ${data.discountCode ? `
    <div class="highlight-box" style="background: linear-gradient(135deg, ${colors.success}15 0%, ${colors.success}05 100%); border-color: ${colors.success};">
      <p style="margin: 0; text-align: center;">
        🎁 <strong>מתנה מיוחדת!</strong><br>
        השתמש בקוד <span style="background-color: ${colors.success}20; padding: 4px 12px; border-radius: 4px; font-weight: 700;">${data.discountCode}</span><br>
        לקבלת <strong>${data.discountPercent}% הנחה</strong>!
      </p>
    </div>
    ` : ''}
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.checkoutUrl}" class="btn-primary">השלם רכישה</a>
    </div>
    
    <p class="text-muted" style="font-size: 14px; text-align: center;">
      יש שאלות? אנחנו כאן לעזור: ${BRAND_CONFIG.supportEmail}
    </p>
  `;
  
  return generateEmailWrapper(content, `השלם את הרכישה שלך - ${data.courseName}`);
}

export function discountCodeTemplate(data: {
  firstName?: string;
  code: string;
  discountPercent: number;
  expiresAt: string;
  applicableCourses?: string[];
}): string {
  const content = `
    <h1>קוד הנחה מיוחד! 🎁</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>קיבלת קוד הנחה בלעדי!</p>
    
    <div style="text-align: center; margin: 32px 0;">
      <div style="background: linear-gradient(135deg, ${colors.primaryLight} 0%, #FFFFFF 100%); border: 2px dashed ${colors.primary}; border-radius: 12px; padding: 24px;">
        <p style="margin: 0 0 8px 0; color: ${colors.textMuted};">קוד ההנחה שלך:</p>
        <p style="font-size: 32px; font-weight: 700; color: ${colors.primary}; margin: 0; letter-spacing: 4px;">${data.code}</p>
        <p style="margin: 16px 0 0 0; font-size: 24px; font-weight: 600; color: ${colors.success};">${data.discountPercent}% הנחה!</p>
      </div>
    </div>
    
    <div class="card">
      <p style="margin: 0;">⏰ <strong>תוקף:</strong> עד ${data.expiresAt}</p>
      ${data.applicableCourses && data.applicableCourses.length > 0 ? `
      <p style="margin: 16px 0 0 0;"><strong>תקף על הקורסים:</strong></p>
      <ul style="margin: 8px 0 0 0; padding-right: 20px;">
        ${data.applicableCourses.map(course => `<li>${course}</li>`).join('')}
      </ul>
      ` : '<p style="margin: 16px 0 0 0;">✅ תקף על כל הקורסים!</p>'}
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${BRAND_CONFIG.website}" class="btn-primary">בחר קורס</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `קוד הנחה: ${data.discountPercent}% הנחה!`);
}

export function newCourseRecommendationTemplate(data: {
  firstName?: string;
  courseName: string;
  courseImage?: string;
  courseDescription: string;
  price: number;
  courseUrl: string;
}): string {
  const formattedPrice = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: 'ILS',
  }).format(data.price);

  const content = `
    <h1>קורס חדש שעשוי לעניין אותך! ✨</h1>
    <p>שלום ${data.firstName || ''},</p>
    <p>בהתבסס על ההעדפות שלך, חשבנו שתאהב את הקורס החדש שלנו:</p>
    
    <div class="card">
      ${data.courseImage ? `<img src="${data.courseImage}" alt="${data.courseName}" style="width: 100%; border-radius: 8px; margin-bottom: 16px;" />` : ''}
      <h2 style="margin: 0 0 12px 0; color: ${colors.primary};">${data.courseName}</h2>
      <p style="color: ${colors.textMuted}; margin: 0 0 16px 0;">${data.courseDescription}</p>
      <p style="font-size: 24px; font-weight: 700; color: ${colors.text}; margin: 0;">${formattedPrice}</p>
    </div>
    
    <div style="text-align: center; margin: 32px 0;">
      <a href="${data.courseUrl}" class="btn-primary">צפה בקורס</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `קורס חדש: ${data.courseName}`);
}

// ============================================
// ADMIN EMAILS
// ============================================

export function newPurchaseAlertTemplate(data: {
  customerName: string;
  customerEmail: string;
  courseName: string;
  amount: number;
  currency: string;
}): string {
  const formattedAmount = new Intl.NumberFormat('he-IL', {
    style: 'currency',
    currency: data.currency || 'ILS',
  }).format(data.amount);

  const content = `
    <h1>רכישה חדשה! 💰</h1>
    
    <div class="card" style="background: linear-gradient(135deg, ${colors.success}15 0%, #FFFFFF 100%);">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0;"><strong>לקוח:</strong></td>
          <td style="text-align: left;">${data.customerName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>אימייל:</strong></td>
          <td style="text-align: left;">${data.customerEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>קורס:</strong></td>
          <td style="text-align: left;">${data.courseName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>סכום:</strong></td>
          <td style="text-align: left; font-size: 20px; font-weight: 700; color: ${colors.success};">${formattedAmount}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BRAND_CONFIG.website}/admin" class="btn-secondary">צפה בדאשבורד</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `רכישה חדשה: ${formattedAmount}`);
}

export function newUserAlertTemplate(data: {
  userName: string;
  userEmail: string;
  signupDate: string;
}): string {
  const content = `
    <h1>משתמש חדש נרשם! 🎉</h1>
    
    <div class="card">
      <table style="width: 100%;">
        <tr>
          <td style="padding: 8px 0;"><strong>שם:</strong></td>
          <td style="text-align: left;">${data.userName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>אימייל:</strong></td>
          <td style="text-align: left;">${data.userEmail}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0;"><strong>תאריך הרשמה:</strong></td>
          <td style="text-align: left;">${data.signupDate}</td>
        </tr>
      </table>
    </div>
    
    <div style="text-align: center; margin: 24px 0;">
      <a href="${BRAND_CONFIG.website}/admin/students" class="btn-secondary">צפה בסטודנטים</a>
    </div>
  `;
  
  return generateEmailWrapper(content, `משתמש חדש: ${data.userName}`);
}

// Export all templates
export const emailTemplates = {
  // Authentication
  signup_confirmation: signupConfirmationTemplate,
  password_reset: passwordResetTemplate,
  password_changed: passwordChangedTemplate,
  magic_link: magicLinkTemplate,
  
  // Payments
  purchase_confirmation: purchaseConfirmationTemplate,
  payment_failed: paymentFailedTemplate,
  refund_processed: refundProcessedTemplate,
  
  // Courses
  course_welcome: courseWelcomeTemplate,
  new_lesson: newLessonTemplate,
  continue_learning_reminder: continueLearningReminderTemplate,
  weekly_progress: weeklyProgressTemplate,
  course_completed: courseCompletedTemplate,
  
  // Marketing
  abandoned_cart: abandonedCartTemplate,
  discount_code: discountCodeTemplate,
  new_course_recommendation: newCourseRecommendationTemplate,
  
  // Admin
  new_purchase_alert: newPurchaseAlertTemplate,
  new_user_alert: newUserAlertTemplate,
};

