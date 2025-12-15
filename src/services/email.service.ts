/**
 * Email Service for Level Up Academy
 * Uses Resend API for sending transactional and marketing emails
 * 
 * Brand Colors:
 * - Primary Blue: #3B82F6
 * - Primary Dark: #2563EB
 * - Success: #16A34A
 * - Warning: #F59E0B
 * - Error: #EF4444
 * - Background: #FFFFFF
 * - Text: #0F172A
 * - Muted: #64748B
 */

import { supabase } from '@/integrations/supabase/client';

// Email Types
export type EmailType = 
  // Authentication
  | 'signup_confirmation'
  | 'password_reset'
  | 'password_changed'
  | 'magic_link'
  | 'email_change'
  | 'invite_user'
  | 'security_alert'
  | 'account_suspended'
  | 'account_deleted'
  // Payments
  | 'purchase_confirmation'
  | 'invoice_receipt'
  | 'payment_failed'
  | 'refund_processed'
  | 'discount_code'
  // Courses
  | 'course_welcome'
  | 'new_lesson'
  | 'continue_learning_reminder'
  | 'weekly_progress'
  | 'course_completed'
  | 'certificate'
  | 'new_course_recommendation'
  | 'course_updated'
  // Notifications
  | 'instructor_message'
  | 'question_answered'
  | 'system_announcement'
  // Marketing
  | 'newsletter'
  | 'special_offer'
  | 'birthday_greeting'
  | 'abandoned_cart'
  // Admin
  | 'team_invite'
  | 'daily_sales_report'
  | 'new_user_alert'
  | 'new_purchase_alert';

// Email Data Interfaces
export interface BaseEmailData {
  to: string;
  firstName?: string;
  lastName?: string;
}

export interface SignupConfirmationData extends BaseEmailData {
  confirmationUrl: string;
}

export interface PasswordResetData extends BaseEmailData {
  resetUrl: string;
  expiresIn: string;
}

export interface PurchaseConfirmationData extends BaseEmailData {
  orderId: string;
  courseName: string;
  courseImage?: string;
  amount: number;
  currency: string;
  paymentMethod: string;
  purchaseDate: string;
}

export interface CourseWelcomeData extends BaseEmailData {
  courseName: string;
  courseImage?: string;
  instructorName: string;
  totalLessons: number;
  estimatedDuration: string;
  courseUrl: string;
}

export interface WeeklyProgressData extends BaseEmailData {
  courseName: string;
  completedLessons: number;
  totalLessons: number;
  progressPercent: number;
  watchedMinutes: number;
  continueUrl: string;
}

export interface CourseCompletedData extends BaseEmailData {
  courseName: string;
  completionDate: string;
  certificateUrl?: string;
  totalWatchTime: string;
}

export interface AbandonedCartData extends BaseEmailData {
  courseName: string;
  courseImage?: string;
  originalPrice: number;
  discountCode?: string;
  discountPercent?: number;
  checkoutUrl: string;
}

// Brand Configuration
export const BRAND_CONFIG = {
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

// Email Service Class
class EmailService {
  private resendApiKey: string | null = null;
  private fromEmail = 'Level Up Academy <noreply@levelupacademy.co.il>';

  constructor() {
    // API key will be set from environment or Supabase secrets
    this.resendApiKey = import.meta.env.VITE_RESEND_API_KEY || null;
  }

  /**
   * Send email via Resend API (through Edge Function)
   */
  async sendEmail(type: EmailType, data: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: result, error } = await supabase.functions.invoke('send-email', {
        body: { type, data },
      });

      if (error) {
        console.error('Email send error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Email service error:', err);
      return { success: false, error: 'Failed to send email' };
    }
  }

  /**
   * Send signup confirmation email
   */
  async sendSignupConfirmation(data: SignupConfirmationData) {
    return this.sendEmail('signup_confirmation', data);
  }

  /**
   * Send password reset email
   */
  async sendPasswordReset(data: PasswordResetData) {
    return this.sendEmail('password_reset', data);
  }

  /**
   * Send purchase confirmation email
   */
  async sendPurchaseConfirmation(data: PurchaseConfirmationData) {
    return this.sendEmail('purchase_confirmation', data);
  }

  /**
   * Send course welcome email
   */
  async sendCourseWelcome(data: CourseWelcomeData) {
    return this.sendEmail('course_welcome', data);
  }

  /**
   * Send weekly progress summary
   */
  async sendWeeklyProgress(data: WeeklyProgressData) {
    return this.sendEmail('weekly_progress', data);
  }

  /**
   * Send course completion email
   */
  async sendCourseCompleted(data: CourseCompletedData) {
    return this.sendEmail('course_completed', data);
  }

  /**
   * Send abandoned cart reminder
   */
  async sendAbandonedCart(data: AbandonedCartData) {
    return this.sendEmail('abandoned_cart', data);
  }

  /**
   * Send magic link for passwordless login
   */
  async sendMagicLink(data: BaseEmailData & { magicLinkUrl: string }) {
    return this.sendEmail('magic_link', data);
  }

  /**
   * Send discount code email
   */
  async sendDiscountCode(data: BaseEmailData & { 
    code: string; 
    discountPercent: number; 
    expiresAt: string;
    applicableCourses?: string[];
  }) {
    return this.sendEmail('discount_code', data);
  }

  /**
   * Send new course recommendation
   */
  async sendNewCourseRecommendation(data: BaseEmailData & {
    courseName: string;
    courseImage?: string;
    courseDescription: string;
    price: number;
    courseUrl: string;
  }) {
    return this.sendEmail('new_course_recommendation', data);
  }

  /**
   * Send system announcement
   */
  async sendSystemAnnouncement(data: BaseEmailData & {
    subject: string;
    message: string;
    ctaText?: string;
    ctaUrl?: string;
  }) {
    return this.sendEmail('system_announcement', data);
  }

  /**
   * Send admin alert for new purchase
   */
  async sendNewPurchaseAlert(data: {
    to: string;
    customerName: string;
    customerEmail: string;
    courseName: string;
    amount: number;
    currency: string;
  }) {
    return this.sendEmail('new_purchase_alert', data);
  }

  /**
   * Send admin alert for new user
   */
  async sendNewUserAlert(data: {
    to: string;
    userName: string;
    userEmail: string;
    signupDate: string;
  }) {
    return this.sendEmail('new_user_alert', data);
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export helper to generate email HTML
export function generateEmailWrapper(content: string, previewText?: string): string {
  const { colors, font, logo, name, website, supportEmail } = BRAND_CONFIG;
  
  return `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${name}</title>
  ${previewText ? `<meta name="x-apple-disable-message-reformatting">
  <!--[if !mso]><!-->
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@400;500;600;700&display=swap');
  </style>
  <!--<![endif]-->
  <span style="display: none; max-height: 0; overflow: hidden;">${previewText}</span>` : ''}
  <style>
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
    h1 {
      color: ${colors.text};
      font-size: 28px;
      font-weight: 700;
      margin: 0 0 16px 0;
    }
    h2 {
      color: ${colors.text};
      font-size: 22px;
      font-weight: 600;
      margin: 0 0 12px 0;
    }
    p {
      color: ${colors.text};
      font-size: 16px;
      line-height: 1.6;
      margin: 0 0 16px 0;
    }
    .text-muted {
      color: ${colors.textMuted};
    }
    .text-primary {
      color: ${colors.primary};
    }
    .text-success {
      color: ${colors.success};
    }
    .divider {
      height: 1px;
      background-color: ${colors.border};
      margin: 24px 0;
    }
    .card {
      background-color: ${colors.surface};
      border-radius: 12px;
      padding: 20px;
      margin: 16px 0;
    }
    .highlight-box {
      background: linear-gradient(135deg, ${colors.primaryLight} 0%, #FFFFFF 100%);
      border-right: 4px solid ${colors.primary};
      padding: 16px 20px;
      border-radius: 8px;
      margin: 16px 0;
    }
    .social-links a {
      display: inline-block;
      margin: 0 8px;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        border-radius: 0;
      }
      .email-header, .email-body, .email-footer {
        padding: 24px 20px;
      }
      h1 {
        font-size: 24px;
      }
    }
  </style>
</head>
<body>
  <div style="padding: 20px; background-color: ${colors.surface};">
    <div class="email-container">
      <!-- Header -->
      <div class="email-header">
        <img src="${logo}" alt="${name}" />
      </div>
      
      <!-- Body -->
      <div class="email-body">
        ${content}
      </div>
      
      <!-- Footer -->
      <div class="email-footer">
        <p style="margin: 0 0 8px 0;">
          © ${new Date().getFullYear()} ${name}. כל הזכויות שמורות.
        </p>
        <p style="margin: 0 0 8px 0;">
          <a href="${website}" style="color: ${colors.primary}; text-decoration: none;">אתר</a>
          &nbsp;|&nbsp;
          <a href="${website}/privacy" style="color: ${colors.primary}; text-decoration: none;">מדיניות פרטיות</a>
          &nbsp;|&nbsp;
          <a href="mailto:${supportEmail}" style="color: ${colors.primary}; text-decoration: none;">תמיכה</a>
        </p>
        <p style="margin: 16px 0 0 0; font-size: 12px;">
          קיבלת את האימייל הזה כי נרשמת ל-${name}.<br>
          אם אינך מעוניין לקבל אימיילים, 
          <a href="${website}/unsubscribe" style="color: ${colors.textMuted};">לחץ כאן להסרה</a>
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;
}

