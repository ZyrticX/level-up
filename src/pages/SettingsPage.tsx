import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const profileSchema = z.object({
  firstName: z.string().trim().min(1, { message: 'שם פרטי הוא שדה חובה' }).max(100),
  lastName: z.string().trim().min(1, { message: 'שם משפחה הוא שדה חובה' }).max(100),
  phone: z.string().trim().max(20).optional(),
  institution: z.string().trim().max(200).optional(),
  department: z.string().trim().max(200).optional(),
  additionalInfo: z.string().trim().max(1000).optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const SettingsPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      institution: '',
      department: '',
      additionalInfo: '',
    },
  });

  useEffect(() => {
    const checkAuthAndLoadProfile = async () => {
      // Check session first (faster)
      const { data: { session } } = await supabase.auth.getSession();
      let user = session?.user;
      
      if (!user) {
        // Try getUser as fallback
        const { data: { user: fetchedUser } } = await supabase.auth.getUser();
        if (!fetchedUser) {
          navigate('/auth');
          return;
        }
        user = fetchedUser;
      }

      // Load profile data
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        toast({
          title: 'שגיאה',
          description: 'לא הצלחנו לטעון את הפרופיל שלך',
          variant: 'destructive',
        });
      } else if (profile) {
        form.reset({
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          phone: profile.phone || '',
          institution: profile.institution || '',
          department: profile.department || '',
          additionalInfo: profile.additional_info || '',
        });
      } else {
        // No profile exists yet, use user metadata if available
        form.reset({
          firstName: user.user_metadata?.first_name || '',
          lastName: user.user_metadata?.last_name || '',
          phone: user.user_metadata?.phone || '',
          institution: '',
          department: '',
          additionalInfo: '',
        });
      }

      setLoading(false);
    };

    checkAuthAndLoadProfile();
  }, [navigate, toast, form]);

  const onSubmit = async (values: ProfileFormValues) => {
    setSaving(true);
    
    const { data: { session } } = await supabase.auth.getSession();
    let user = session?.user;
    
    if (!user) {
      const { data: { user: fetchedUser } } = await supabase.auth.getUser();
      if (!fetchedUser) {
        navigate('/auth');
        return;
      }
      user = fetchedUser;
    }

    // Try to update first, if no rows affected, insert
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .single();

    const profileData = {
      id: user.id,
      first_name: values.firstName,
      last_name: values.lastName,
      phone: values.phone || null,
      institution: values.institution || null,
      department: values.department || null,
      additional_info: values.additionalInfo || null,
    };

    let error;
    if (existingProfile) {
      // Update existing profile
      const result = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', user.id);
      error = result.error;
    } else {
      // Insert new profile
      const result = await supabase
        .from('profiles')
        .insert(profileData);
      error = result.error;
    }

    if (error) {
      console.error('Error saving profile:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לשמור את השינויים',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'הצלחה',
        description: 'הפרטים שלך עודכנו בהצלחה',
      });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-card rounded-lg shadow-sm border border-border p-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 text-center">הגדרות חשבון</h1>
          <p className="text-muted-foreground mb-8 text-center">עדכן את הפרטים האישיים שלך</p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" dir="rtl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם פרטי *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="הזן שם פרטי" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>שם משפחה *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="הזן שם משפחה" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>טלפון</FormLabel>
                    <FormControl>
                      <Input {...field} type="tel" placeholder="הזן מספר טלפון" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="institution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מוסד</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="שם המוסד" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מחלקה</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="שם המחלקה" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>מידע נוסף</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        placeholder="הוסף מידע נוסף (אופציונלי)" 
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={saving}
                >
                  {saving ? 'שומר...' : 'שמור שינויים'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex-1"
                >
                  ביטול
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
