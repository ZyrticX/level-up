import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, DollarSign } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch real statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get total courses
      const { count: totalCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true });

      // Get published courses
      const { count: publishedCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get total students count
      const { data: coursesData } = await supabase
        .from('courses')
        .select('students_count');
      
      const totalStudents = coursesData?.reduce((sum, course) => sum + (course.students_count || 0), 0) || 0;

      // Get unique institutions
      const { data: institutionsData } = await supabase
        .from('courses')
        .select('institution')
        .not('institution', 'is', null);
      
      const uniqueInstitutions = new Set(institutionsData?.map(c => c.institution)).size;

      // Get total revenue (sum of prices)
      const { data: revenueData } = await supabase
        .from('courses')
        .select('price, students_count');
      
      const totalRevenue = revenueData?.reduce((sum, course) => {
        return sum + ((course.price || 0) * (course.students_count || 0));
      }, 0) || 0;

      return {
        totalCourses: totalCourses || 0,
        publishedCourses: publishedCourses || 0,
        totalStudents,
        uniqueInstitutions,
        totalRevenue
      };
    }
  });

  const dashboardStats = [
    { 
      title: 'סך הקורסים', 
      value: stats?.totalCourses.toString() || '0', 
      icon: BookOpen, 
      trend: `${stats?.publishedCourses || 0} מפורסמים` 
    },
    { 
      title: 'סטודנטים רשומים', 
      value: stats?.totalStudents.toString() || '0', 
      icon: Users, 
      trend: 'סה"כ בכל הקורסים' 
    },
    { 
      title: 'מוסדות לימוד', 
      value: stats?.uniqueInstitutions.toString() || '0', 
      icon: GraduationCap, 
      trend: 'מוסדות פעילים' 
    },
    { 
      title: 'הכנסות משוערות', 
      value: `₪${stats?.totalRevenue.toLocaleString() || '0'}`, 
      icon: DollarSign, 
      trend: 'סה"כ פוטנציאל' 
    },
  ];

  return (
    <div className="space-y-6" dir="rtl">
      {/* Header */}
      <div className="bg-background rounded-lg border border-border p-6">
        <h1 className="text-2xl font-semibold text-foreground mb-2">דשבורד ניהול</h1>
        <p className="text-muted-foreground">סקירה כללית של פעילות הפלטפורמה</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <Card key={stat.title} className="bg-background border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">פעולות מהירות</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button 
              onClick={() => navigate('/admin/courses')}
              className="w-full text-right p-3 rounded-md bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              הוסף קורס חדש
            </button>
            <button 
              className="w-full text-right p-3 rounded-md bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              צפה בדוח שבועי
            </button>
            <button 
              className="w-full text-right p-3 rounded-md bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
            >
              נהל הרשאות משתמשים
            </button>
          </CardContent>
        </Card>

        <Card className="bg-background border-border">
          <CardHeader>
            <CardTitle className="text-foreground">פעילות אחרונה</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-sm">
              <div className="font-medium text-foreground">מערכת מנהל מחוברת</div>
              <div className="text-muted-foreground">כעת</div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground">דשבורד מוכן לשימוש</div>
              <div className="text-muted-foreground">התחל לנהל קורסים</div>
            </div>
            <div className="text-sm">
              <div className="font-medium text-foreground">הפלטפורמה פעילה</div>
              <div className="text-muted-foreground">מוכנה לקליטת תוכן</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
