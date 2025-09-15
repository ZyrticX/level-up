import React, { useState } from 'react';
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
  const navigate = useNavigate();
  const { toast } = useToast();

  // Signup form state
  const [signupForm, setSignupForm] = useState<SignupFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    institution: '',
    department: '',
    additionalInfo: '',
    agreedToTerms: false
  });

  // Login form state
  const [loginForm, setLoginForm] = useState<LoginFormData>({
    email: '',
    password: ''
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

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSignup()) {
      // Mock signup success
      toast({
        title: "הרשמה בוצעה בהצלחה!",
        description: "ברוכים הבאים ל-LevelUp. אתם מועברים לעמוד הקורסים.",
      });
      navigate('/my-courses');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateLogin()) {
      // Mock login - check if user exists
      if (loginForm.email === 'test@example.com' && loginForm.password === 'password') {
        toast({
          title: "התחברות בוצעה בהצלחה!",
          description: "ברוכים השבים ל-LevelUp.",
        });
        navigate('/my-courses');
      } else {
        toast({
          title: "שגיאה בהתחברות",
          description: "המשתמש לא קיים במערכת",
          variant: "destructive",
        });
      }
    }
  };

  const handleForgotPassword = () => {
    toast({
      title: "שחזור סיסמה",
      description: "קישור לשחזור סיסמה נשלח למייל שלכם.",
    });
  };

  const availableDepartments = signupForm.institution 
    ? departmentsByInstitution[signupForm.institution as keyof typeof departmentsByInstitution] || []
    : [];

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Tab Navigation */}
          <div className="flex mb-6 bg-muted rounded-lg p-1">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'login'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              כניסה למערכת
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
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
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  כניסה למשתמשים רשומים
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">כתובת מייל</label>
                    <div className="relative">
                      <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => handleLoginChange('email', e.target.value)}
                        className="pr-10"
                        placeholder="הכניסו את כתובת המייל שלכם"
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
                        value={loginForm.password}
                        onChange={(e) => handleLoginChange('password', e.target.value)}
                        className="pr-10 pl-10"
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
                    {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
                  </div>

                  <Button type="submit" className="w-full btn-academic">
                    התחבר
                  </Button>

                  <div className="space-y-2">
                    <Button
                      type="button"
                      onClick={handleForgotPassword}
                      variant="ghost"
                      className="w-full"
                    >
                      שכחתי סיסמה
                    </Button>
                    <Button
                      type="button"
                      onClick={() => setActiveTab('signup')}
                      variant="outline"
                      className="w-full"
                    >
                      עדיין לא רשומים? עברו להרשמה
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Signup Form */}
          {activeTab === 'signup' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">
                  הרשמה למערכת
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSignup} className="space-y-4">
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

                  <Button type="submit" className="w-full btn-hero">
                    הירשם
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AuthPage;