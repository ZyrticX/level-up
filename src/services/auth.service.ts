import { supabase } from '@/integrations/supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

export interface AuthResult {
  success: boolean;
  error?: string;
  data?: {
    user?: User | null;
    session?: Session | null;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  institutionId?: string;
  institution?: string;
  departmentId?: string;
  department?: string;
  additionalInfo?: string;
  marketingConsent?: boolean;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  institutionId?: string;
  institution?: string;
  departmentId?: string;
  department?: string;
}

/**
 * Authentication service for handling all auth-related operations
 */
export const authService = {
  /**
   * Sign up a new user
   */
  async signUp(data: SignUpData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            phone: data.phone || null,
            institution_id: data.institutionId || null,
            institution: data.institution || null,
            department_id: data.departmentId || null,
            department: data.department || null,
            additional_info: data.additionalInfo || null,
            marketing_consent: data.marketingConsent || false,
          },
        },
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Sign in an existing user
   */
  async signIn(data: SignInData): Promise<AuthResult> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return {
        success: true,
        data: {
          user: authData.user,
          session: authData.session,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Sign out the current user
   */
  async signOut(): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Update password (when user is logged in with reset token)
   */
  async updatePassword(newPassword: string): Promise<AuthResult> {
    try {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return {
        success: true,
        data: {
          user: data.user,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Update user profile metadata
   */
  async updateProfile(data: UpdateProfileData): Promise<AuthResult> {
    try {
      const updateData: Record<string, unknown> = {};
      
      if (data.firstName !== undefined) updateData.first_name = data.firstName;
      if (data.lastName !== undefined) updateData.last_name = data.lastName;
      if (data.phone !== undefined) updateData.phone = data.phone;
      if (data.institutionId !== undefined) updateData.institution_id = data.institutionId;
      if (data.institution !== undefined) updateData.institution = data.institution;
      if (data.departmentId !== undefined) updateData.department_id = data.departmentId;
      if (data.department !== undefined) updateData.department = data.department;

      const { data: authData, error } = await supabase.auth.updateUser({
        data: updateData,
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return {
        success: true,
        data: {
          user: authData.user,
        },
      };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Get current session
   */
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  },

  /**
   * Get current user
   */
  async getUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  },

  /**
   * Check if user is admin
   */
  async isAdmin(): Promise<boolean> {
    const user = await this.getUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    return !error && data !== null;
  },

  /**
   * Get user roles
   */
  async getUserRoles(): Promise<string[]> {
    const user = await this.getUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (error) return [];
    return data.map(r => r.role);
  },

  /**
   * Resend email confirmation
   */
  async resendEmailConfirmation(email: string): Promise<AuthResult> {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
      });

      if (error) {
        return { success: false, error: translateAuthError(error) };
      }

      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : 'שגיאה לא צפויה',
      };
    }
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },
};

/**
 * Translate Supabase auth errors to Hebrew
 */
function translateAuthError(error: AuthError): string {
  const errorMessages: Record<string, string> = {
    'Invalid login credentials': 'אימייל או סיסמה שגויים',
    'Email not confirmed': 'האימייל לא אומת. בדוק את תיבת הדואר שלך',
    'User already registered': 'משתמש עם אימייל זה כבר קיים במערכת',
    'Password should be at least 6 characters': 'הסיסמה צריכה להכיל לפחות 6 תווים',
    'Invalid email': 'כתובת אימייל לא תקינה',
    'Email rate limit exceeded': 'נשלחו יותר מדי בקשות. נסה שנית מאוחר יותר',
    'For security purposes, you can only request this once every 60 seconds': 'מסיבות אבטחה, ניתן לבקש זאת רק פעם ב-60 שניות',
    'New password should be different from the old password': 'הסיסמה החדשה צריכה להיות שונה מהסיסמה הישנה',
    'Auth session missing!': 'לא נמצא מפגש מחובר. נסה להתחבר מחדש',
    'User not found': 'משתמש לא נמצא',
    'Unable to validate email address: invalid format': 'פורמט אימייל לא תקין',
  };

  // Check for exact match
  if (errorMessages[error.message]) {
    return errorMessages[error.message];
  }

  // Check for partial match
  for (const [key, value] of Object.entries(errorMessages)) {
    if (error.message.toLowerCase().includes(key.toLowerCase())) {
      return value;
    }
  }

  // Return original message if no translation found
  return error.message;
}

export default authService;

