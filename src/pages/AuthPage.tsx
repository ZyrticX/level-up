import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Mail, Phone, Lock, GraduationCap } from 'lucide-react';

import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Mock data for institutions and departments
const institutions = {
  'technion': 'הטכניון - מכון טכנולוגי לישראל',
  'hebrew-university': 'האוניברסיטה העברית בירושלים',
  'tel-aviv-university': 'אוניברסיטת תל אביב',
  'ben-gurion-university': 'אוניברסיטת בן גוריון',
  'bar-ilan-university': 'אוניברסיטת בר אילן',
  'haifa-university': 'אוניברסיטת חיפה'
};

const departmentsByInstitution = {
  'technion': [
    'מדעי המחשב',
    'הנדסת חשמל',
    'הנדסת תעשייה וניהול',
    'הנדסה אזרחית',
    'הנדסת מכונות'
  ],
  'hebrew-university': [
    'מדעי המחשב',
    'מתמטיקה',
    'פיזיקה',
    'כימיה',
    'ביולוגיה'
  ],
  'tel-aviv-university': [
    'מדעי המחשב',
    'פסיכולוגיה',
    'כלכלה',
    'משפטים',
    'רפואה'
  ],
  'ben-gurion-university': [
    'מדעי המחשב',
    'הנדסת תעשייה וניהול',
    'רפואה',
    'מדעי הטבע',
    'מדעי החברה'
  ],
  'bar-ilan-university': [
    'מדעי המחשב',
    'מתמטיקה',
    'פסיכולוגיה',
    'חינוך',
    'משפטים'
  ],
  'haifa-university': [
    'מדעי המחשב',
    'חינוך',
    'מדעי החברה',
    'מדעי הטבע',
    'אמנויות'
  ]
};

interface SignupFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  institution: string;
  department: string;
  additionalInfo: string;
  agreedToTerms: boolean;
}

interface LoginFormData {
  email: string;
  password: string;
}

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  // Signup form state
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: 'דניאל',
    lastName: 'כהן',
    phone: '050-1234567',
    email: 'daniel.cohen@student.technion.ac.il',
    password: 'Test123!',
    confirmPassword: 'Test123!',
    institution: 'technion',
    department: 'מדעי המחשב',
    additionalInfo: 'אני סטודנט שנה ג\' במדעי המחשב. מעוניין ללמוד אלגוריתמים מתקדמים ובינה מלאכותית. יש לי ניסיון בפיתוח ב-Python ו-Java.',
    agreedToTerms: true
  });

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: 'daniel.cohen@student.technion.ac.il',
    password: 'Test123!'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSignupChange = (field: keyof SignupFormData, value: string | boolean) => {
    setSignupForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleLoginChange = (field: keyof LoginFormData, value: string) => {
    setLoginForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateSignup = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!signupForm.firstName.trim()) newErrors.firstName = 'שם פרטי נדרש';
    if (!signupForm.lastName.trim()) newErrors.lastName = 'שם משפחה נדרש';
    if (!signupForm.phone.trim()) newErrors.phone = 'מספר טלפון נדרש';
    if (!signupForm.email.trim()) newErrors.email = 'כתובת מייל נדרשת';
    if (!signupForm.password) newErrors.password = 'סיסמה נדרשת';
    if (signupForm.password.length < 6) newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = 'סיסמאות אינן תואמות';
    if (!signupForm.institution) newErrors.institution = 'יש לבחור מוסד לימודים';
    if (!signupForm.department) newErrors.department = 'יש לבחור חוג לימודים';
    if (!signupForm.agreedToTerms) newErrors.agreedToTerms = 'יש לאשר את התקנון ומדיניות הפרטיות';

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (signupForm.email && !emailRegex.test(signupForm.email)) {
      newErrors.email = 'כתובת מייל לא תקינה';
    }

    // Phone validation (basic Israeli phone number)
    const phoneRegex = /^0[5-9]\d{8}$/;
    if (signupForm.phone && !phoneRegex.test(signupForm.phone.replace(/[-\s]/g, ''))) {
      newErrors.phone = 'מספר טלפון לא תקין';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateLogin = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!loginForm.email.trim()) newErrors.email = 'כתובת מייל נדרשת';
    if (!loginForm.password) newErrors.password = 'סיסמה נדרשת';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateSignup()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupForm.email,
        password: signupForm.password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            first_name: signupForm.firstName,
            last_name: signupForm.lastName,
            phone: signupForm.phone,
            institution: signupForm.institution,
            department: signupForm.department,
            additional_info: signupForm.additionalInfo,
          }
        }
      });

      if (error) {
        let errorMessage = 'אירעה שגיאה בהרשמה';
        if (error.message.includes('already registered')) {
          errorMessage = 'המשתמש כבר קיים במערכת';
        } else if (error.message.includes('invalid email')) {
          errorMessage = 'כתובת מייל לא תקינה';
        } else if (error.message.includes('password')) {
          errorMessage = 'סיסמה חלשה מדי - נסה סיסמה חזקה יותר';
        }
        
        toast({
          title: "שגיאה בהרשמה",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      // Create profile row for the new user (fallback when DB trigger isn't present)
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: signupForm.firstName || '',
            last_name: signupForm.lastName || '',
            phone: signupForm.phone || null,
            institution: signupForm.institution || null,
            department: signupForm.department || null,
            additional_info: signupForm.additionalInfo || null,
          });
        if (profileError) {
          toast({
            title: "שגיאה ביצירת פרופיל",
            description: "ההרשמה הצליחה אך יצירת הפרופיל נכשלה. ננסה שוב מאוחר יותר.",
            variant: "destructive",
          });
        }
      }

      toast({
        title: "הרשמה בוצעה בהצלחה!",
        description: "ברוכים הבאים ל-LevelUp. אתם מועברים לעמוד הראשי.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "שגיאה בהרשמה",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (error) {
        let errorMessage = 'שגיאה בהתחברות';
        if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'כתובת מייל או סיסמה שגויים';
        } else if (error.message.includes('Email not confirmed')) {
          errorMessage = 'יש לאשר את כתובת המייל קודם';
        }
        
        toast({
          title: "שגיאה בהתחברות",
          description: errorMessage,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "התחברות בוצעה בהצלחה!",
        description: "ברוכים השבים ל-LevelUp.",
      });
      navigate('/');
    } catch (error) {
      toast({
        title: "שגיאה בהתחברות",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!loginForm.email) {
      toast({
        title: "שגיאה",
        description: "נא להזין כתובת מייל",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(loginForm.email, {
        redirectTo: `${window.location.origin}/`,
      });

      if (error) {
        toast({
          title: "שגיאה",
          description: "אירעה שגיאה בשליחת המייל",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "שחזור סיסמה",
        description: "קישור לשחזור סיסמה נשלח למייל שלכם.",
      });
    } catch (error) {
      toast({
        title: "שגיאה",
        description: "אירעה שגיאה בלתי צפויה",
        variant: "destructive",
      });
    }
  };

  const availableDepartments = signupForm.institution 
    ? departmentsByInstitution[signupForm.institution as keyof typeof departmentsByInstitution] || []
    : [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="section-standard">
        <div className="container-standard">
          <div className="max-w-md mx-auto space-elements">
            {/* Tab Navigation */}
            <div className="flex bg-muted rounded-xl p-1">
              <button
                onClick={() => setActiveTab('login')}
                className={`flex-1 py-3 px-4 rounded-lg text-nav font-medium transition-colors ${
                  activeTab === 'login'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                כניסה למערכת
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`flex-1 py-3 px-4 rounded-lg text-nav font-medium transition-colors ${
                  activeTab === 'signup'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                הרשמה למערכת
              </button>
            </div>

            {/* Login Form */}
            {activeTab === 'login' && (
              <Card className="card-academic">
                <CardHeader>
                  <CardTitle className="text-h2 text-foreground text-right">
                    כניסה למשתמשים רשומים
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleLogin} className="space-elements">
                    <div>
                      <label className="block text-nav font-medium mb-2 text-right">כתובת מייל</label>
                      <div className="relative">
                        <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="email"
                          value={loginForm.email}
                          onChange={(e) => handleLoginChange('email', e.target.value)}
                          className="pr-10 text-paragraph"
                          placeholder="הכניסו את כתובת המייל שלכם"
                        />
                      </div>
                      {errors.email && <p className="text-destructive text-nav mt-1 text-right">{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-nav font-medium mb-2 text-right">סיסמה</label>
                      <div className="relative">
                        <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={loginForm.password}
                          onChange={(e) => handleLoginChange('password', e.target.value)}
                          className="pr-10 pl-10 text-paragraph"
                          placeholder="הכניסו את הסיסמה שלכם"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="text-destructive text-nav mt-1 text-right">{errors.password}</p>}
                    </div>

                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                      {isLoading ? 'מתחבר...' : 'התחבר'}
                    </button>

                    <div className="space-elements">
                      <button
                        type="button"
                        onClick={handleForgotPassword}
                        className="btn-ghost w-full"
                      >
                        שכחתי סיסמה
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('signup')}
                        className="btn-secondary w-full"
                      >
                        עדיין לא רשומים? עברו להרשמה
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Signup Form */}
            {activeTab === 'signup' && (
              <Card className="card-academic">
                <CardHeader>
                  <CardTitle className="text-h2 text-foreground text-right">
                    הרשמה למערכת
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSignup} className="space-elements">
                  {/* Personal Information */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">שם פרטי</label>
                      <div className="relative">
                        <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          value={signupForm.firstName}
                          onChange={(e) => handleSignupChange('firstName', e.target.value)}
                          className="pr-10"
                          placeholder="שם פרטי"
                        />
                      </div>
                      {errors.firstName && <p className="text-destructive text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">שם משפחה</label>
                      <Input
                        value={signupForm.lastName}
                        onChange={(e) => handleSignupChange('lastName', e.target.value)}
                        placeholder="שם משפחה"
                      />
                      {errors.lastName && <p className="text-destructive text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">מספר טלפון</label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={signupForm.phone}
                        onChange={(e) => handleSignupChange('phone', e.target.value)}
                        className="pr-10"
                        placeholder="050-1234567"
                      />
                    </div>
                    {errors.phone && <p className="text-destructive text-sm mt-1">{errors.phone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">כתובת מייל</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={signupForm.email}
                        onChange={(e) => handleSignupChange('email', e.target.value)}
                        className="pr-10"
                        placeholder="example@email.com"
                      />
                    </div>
                    {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">סיסמה</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={signupForm.password}
                        onChange={(e) => handleSignupChange('password', e.target.value)}
                        className="pr-10 pl-10"
                        placeholder="לפחות 6 תווים"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">אימות סיסמה</label>
                    <div className="relative">
                      <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={signupForm.confirmPassword}
                        onChange={(e) => handleSignupChange('confirmPassword', e.target.value)}
                        className="pr-10 pl-10"
                        placeholder="הכניסו שוב את הסיסמה"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute left-3 top-3 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">מוסד לימודים</label>
                    <Select
                      value={signupForm.institution}
                      onValueChange={(value) => {
                        handleSignupChange('institution', value);
                        handleSignupChange('department', ''); // Reset department when institution changes
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחרו מוסד לימודים" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(institutions).map(([key, name]) => (
                          <SelectItem key={key} value={key}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.institution && <p className="text-destructive text-sm mt-1">{errors.institution}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">חוג לימודים</label>
                    <Select
                      value={signupForm.department}
                      onValueChange={(value) => handleSignupChange('department', value)}
                      disabled={!signupForm.institution}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={signupForm.institution ? "בחרו חוג לימודים" : "בחרו תחילה מוסד לימודים"} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableDepartments.map((department) => (
                          <SelectItem key={department} value={department}>
                            {department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-destructive text-sm mt-1">{errors.department}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      רוצה לספר לנו משהו נוסף? כאן זה המקום.
                    </label>
                    <Textarea
                      value={signupForm.additionalInfo}
                      onChange={(e) => handleSignupChange('additionalInfo', e.target.value)}
                      placeholder="ספרו לנו על עצמכם, על המטרות שלכם או כל דבר אחר שתרצו לשתף..."
                      rows={3}
                    />
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id="terms"
                      checked={signupForm.agreedToTerms}
                      onCheckedChange={(checked) => handleSignupChange('agreedToTerms', checked as boolean)}
                    />
                    <label htmlFor="terms" className="text-sm">
                      אני מאשר את{' '}
                      <Link to="/terms" className="text-primary hover:underline">
                        תקנון האתר
                      </Link>
                      {' '}ו
                      <Link to="/privacy" className="text-primary hover:underline">
                        מדיניות הפרטיות
                      </Link>
                    </label>
                  </div>
                  {errors.agreedToTerms && <p className="text-destructive text-sm mt-1">{errors.agreedToTerms}</p>}

                    <button type="submit" className="btn-primary w-full" disabled={isLoading}>
                      {isLoading ? 'נרשם...' : 'הירשם'}
                    </button>
                </form>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;