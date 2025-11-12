import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface SignupFormProps {
  onSuccess: () => void;
}

// Dummy data למוסדות וחוגים
const INSTITUTIONS = [
  'אוניברסיטת תל אביב',
  'האוניברסיטה העברית',
  'טכניון',
  'אוניברסיטת בר אילן',
  'אוניברסיטת בן גוריון',
  'מכללת אפקה',
  'מכללת חדסה',
  'אחר',
];

const DEPARTMENTS = [
  'מדעי המחשב',
  'הנדסת חשמל',
  'הנדסת תוכנה',
  'מתמטיקה',
  'פיזיקה',
  'כימיה',
  'ביולוגיה',
  'כלכלה',
  'אחר',
];

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    institution: '',
    department: '',
    additionalInfo: '',
  });
  
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // אם בחרו "אחר" במוסד - מנקים את החוג
      if (field === 'institution' && value === 'אחר') {
        newData.department = '';
      }
      
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!termsAccepted) {
      toast({
        title: 'יש לאשר את תקנון האתר',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    try {
      const { error, data } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            institution: formData.institution !== 'אחר' ? formData.institution : null,
            department: formData.institution !== 'אחר' && formData.department !== 'אחר' ? formData.department : null,
            additional_info: formData.additionalInfo,
            marketing_consent: marketingAccepted,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'ההרשמה הושלמה בהצלחה!',
        description: 'נשלח אליך אימייל לאימות החשבון',
      });

      onSuccess();
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'משהו השתבש, אנא נסו שנית';
      toast({
        title: 'שגיאה בהרשמה',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const showDepartment = formData.institution && formData.institution !== 'אחר';

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* שדות בשתי עמודות */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-semibold">שם פרטי</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleChange('firstName', e.target.value)}
            required
            className="h-11 text-right border-2 border-primary/20 focus:border-primary rounded-xl text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-semibold">שם משפחה</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleChange('lastName', e.target.value)}
            required
            className="h-11 text-right border-2 border-primary/20 focus:border-primary rounded-xl text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-semibold">אימייל</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            required
            className="text-right"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-semibold">סיסמה</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            required
            minLength={6}
            className="h-11 text-right border-2 border-primary/20 focus:border-primary rounded-xl text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-semibold">טלפון (אופציונלי)</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="05X-XXXXXXX"
            className="h-11 text-right border-2 border-primary/20 focus:border-primary rounded-xl text-base"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution" className="text-sm font-semibold">מוסד לימודים</Label>
          <Select value={formData.institution} onValueChange={(value) => handleChange('institution', value)}>
            <SelectTrigger id="institution" className="h-11 text-right border-2 border-primary/20 focus:border-primary rounded-xl" dir="rtl">
              <SelectValue placeholder="בחר מוסד" />
            </SelectTrigger>
            <SelectContent dir="rtl">
              {INSTITUTIONS.map((inst) => (
                <SelectItem key={inst} value={inst} className="text-right">
                  {inst}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showDepartment && (
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="department" className="text-sm font-semibold">חוג לימודים</Label>
            <Select value={formData.department} onValueChange={(value) => handleChange('department', value)}>
              <SelectTrigger id="department" className="h-11 text-right border-2 border-primary/20 focus:border-primary rounded-xl" dir="rtl">
                <SelectValue placeholder="בחר חוג" />
              </SelectTrigger>
              <SelectContent dir="rtl">
                {DEPARTMENTS.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-right">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* שדה טקסט חופשי */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="additionalInfo" className="text-sm font-semibold">
            רוצים לספר לנו משהו נוסף? כאן זה המקום
          </Label>
          <span className="text-xs text-red-700 font-medium">אופציונאלי</span>
        </div>
        <Textarea
          id="additionalInfo"
          value={formData.additionalInfo}
          onChange={(e) => handleChange('additionalInfo', e.target.value)}
          rows={3}
          className="text-right resize-none border-2 border-primary/20 focus:border-primary rounded-xl text-base"
        />
      </div>

      {/* Checkboxes */}
      <div className="space-y-4 pt-2">
        <div className="flex items-start gap-3">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
          />
          <Label 
            htmlFor="terms" 
            className="text-sm leading-relaxed cursor-pointer"
          >
            אני מאשר/ת את{' '}
            <a href="/privacy" className="text-primary underline" target="_blank">
              תקנון האתר ומדיניות הפרטיות
            </a>
          </Label>
        </div>

        <div className="flex items-start gap-3">
          <Checkbox
            id="marketing"
            checked={marketingAccepted}
            onCheckedChange={(checked) => setMarketingAccepted(checked as boolean)}
          />
          <Label 
            htmlFor="marketing" 
            className="text-sm leading-relaxed cursor-pointer"
          >
            אני מאשר/ת קבלת דיוור עם מידע פרסומי הנוגע לתכני ושירותי האתר LevelUp
          </Label>
        </div>
      </div>

      {/* כפתור שליחה */}
      <Button
        type="submit"
        disabled={loading}
        className="w-full h-14 bg-primary hover:bg-primary/90 text-white text-lg font-bold rounded-xl shadow-md hover:shadow-lg transition-all"
      >
        {loading ? 'רושמים אותך...' : 'רשמו אותי'}
      </Button>
    </form>
  );
};

export default SignupForm;

