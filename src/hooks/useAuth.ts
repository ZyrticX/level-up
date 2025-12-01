import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { authService, SignUpData, SignInData, UpdateProfileData } from '@/services/auth.service';
import { useToast } from '@/hooks/use-toast';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone?: string;
  institutionId?: string;
  institution?: string;
  departmentId?: string;
  department?: string;
  avatarUrl?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  roles: string[];
  signUp: (data: SignUpData) => Promise<boolean>;
  signIn: (data: SignInData) => Promise<boolean>;
  signOut: () => Promise<void>;
  sendPasswordReset: (email: string) => Promise<boolean>;
  updatePassword: (newPassword: string) => Promise<boolean>;
  updateProfile: (data: UpdateProfileData) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

/**
 * Hook for managing authentication state and actions
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [roles, setRoles] = useState<string[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Parse user metadata into profile
  const parseUserProfile = useCallback((user: User): UserProfile => {
    const metadata = user.user_metadata || {};
    return {
      id: user.id,
      email: user.email || '',
      firstName: metadata.first_name || '',
      lastName: metadata.last_name || '',
      fullName: `${metadata.first_name || ''} ${metadata.last_name || ''}`.trim() || user.email || '',
      phone: metadata.phone,
      institutionId: metadata.institution_id,
      institution: metadata.institution,
      departmentId: metadata.department_id,
      department: metadata.department,
      avatarUrl: metadata.avatar_url,
      isEmailVerified: !!user.email_confirmed_at,
      createdAt: user.created_at,
    };
  }, []);

  // Load user roles
  const loadUserRoles = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (!error && data) {
      const userRoles = data.map(r => r.role);
      setRoles(userRoles);
      setIsAdmin(userRoles.includes('admin'));
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    const currentUser = await authService.getUser();
    setUser(currentUser);
    if (currentUser) {
      setProfile(parseUserProfile(currentUser));
      await loadUserRoles(currentUser.id);
    }
  }, [parseUserProfile, loadUserRoles]);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        const currentSession = await authService.getSession();
        setSession(currentSession);
        
        if (currentSession?.user) {
          setUser(currentSession.user);
          setProfile(parseUserProfile(currentSession.user));
          await loadUserRoles(currentSession.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user || null);
        
        if (newSession?.user) {
          setProfile(parseUserProfile(newSession.user));
          await loadUserRoles(newSession.user.id);
        } else {
          setProfile(null);
          setRoles([]);
          setIsAdmin(false);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          navigate('/');
        } else if (event === 'PASSWORD_RECOVERY') {
          navigate('/reset-password');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [parseUserProfile, loadUserRoles, navigate]);

  // Sign up
  const signUp = useCallback(async (data: SignUpData): Promise<boolean> => {
    const result = await authService.signUp(data);
    
    if (result.success) {
      toast({
        title: 'ההרשמה הושלמה בהצלחה!',
        description: 'נשלח אליך אימייל לאימות החשבון',
      });
      return true;
    } else {
      toast({
        title: 'שגיאה בהרשמה',
        description: result.error,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Sign in
  const signIn = useCallback(async (data: SignInData): Promise<boolean> => {
    const result = await authService.signIn(data);
    
    if (result.success) {
      toast({
        title: 'התחברת בהצלחה!',
        description: `שלום, ${result.data?.user?.user_metadata?.first_name || 'משתמש'}`,
      });
      return true;
    } else {
      toast({
        title: 'שגיאה בהתחברות',
        description: result.error,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Sign out
  const signOut = useCallback(async () => {
    const result = await authService.signOut();
    
    if (result.success) {
      toast({
        title: 'התנתקת בהצלחה',
      });
    } else {
      toast({
        title: 'שגיאה בהתנתקות',
        description: result.error,
        variant: 'destructive',
      });
    }
  }, [toast]);

  // Send password reset email
  const sendPasswordReset = useCallback(async (email: string): Promise<boolean> => {
    const result = await authService.sendPasswordResetEmail(email);
    
    if (result.success) {
      toast({
        title: 'נשלח אימייל לאיפוס סיסמה',
        description: 'בדוק את תיבת הדואר שלך',
      });
      return true;
    } else {
      toast({
        title: 'שגיאה בשליחת האימייל',
        description: result.error,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Update password
  const updatePassword = useCallback(async (newPassword: string): Promise<boolean> => {
    const result = await authService.updatePassword(newPassword);
    
    if (result.success) {
      toast({
        title: 'הסיסמה עודכנה בהצלחה',
      });
      return true;
    } else {
      toast({
        title: 'שגיאה בעדכון הסיסמה',
        description: result.error,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast]);

  // Update profile
  const updateProfile = useCallback(async (data: UpdateProfileData): Promise<boolean> => {
    const result = await authService.updateProfile(data);
    
    if (result.success) {
      await refreshUser();
      toast({
        title: 'הפרופיל עודכן בהצלחה',
      });
      return true;
    } else {
      toast({
        title: 'שגיאה בעדכון הפרופיל',
        description: result.error,
        variant: 'destructive',
      });
      return false;
    }
  }, [toast, refreshUser]);

  return {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated: !!user,
    isAdmin,
    roles,
    signUp,
    signIn,
    signOut,
    sendPasswordReset,
    updatePassword,
    updateProfile,
    refreshUser,
  };
}

export default useAuth;

