import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, DollarSign, MessageSquare, FileDown, UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const navigate = useNavigate();

  // Fetch real statistics
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get active users (mock - created in last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      const { count: activeUsers } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', thirtyDaysAgo.toISOString());

      // Get published courses (active)
      const { count: activeCourses } = await supabase
        .from('courses')
        .select('*', { count: 'exact', head: true })
        .eq('is_published', true);

      // Get unique institutions
      const { data: institutionsData } = await supabase
        .from('courses')
        .select('institution')
        .not('institution', 'is', null);
      
      const uniqueInstitutions = new Set(institutionsData?.map(c => c.institution)).size;

      // Mock groups data (future implementation)
      const activeGroups = 8;
      const inactiveGroups = 3;

      return {
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        activeCourses: activeCourses || 0,
        activeGroups,
        inactiveGroups,
        uniqueInstitutions
      };
    }
  });

  const dashboardStats = [
    { 
      title: 'סך המשתמשים', 
      value: stats?.totalUsers.toString() || '0', 
      icon: Users, 
      trend: `${stats?.activeUsers || 0} פעילים בזמן אמת`,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      title: 'קורסים פעילים', 
      value: stats?.activeCourses.toString() || '0', 
      icon: BookOpen, 
      trend: 'קורסים מפורסמים',
      color: 'bg-green-50 text-green-600'
    },
    { 
      title: 'קבוצות', 
      value: `${stats?.activeGroups || 0}/${(stats?.activeGroups || 0) + (stats?.inactiveGroups || 0)}`, 
      icon: MessageSquare, 
      trend: `${stats?.activeGroups || 0} פעילות, ${stats?.inactiveGroups || 0} לא פעילות`,
      color: 'bg-purple-50 text-purple-600'
    },
    { 
      title: 'מוסדות לימוד', 
      value: stats?.uniqueInstitutions.toString() || '0', 
      icon: GraduationCap, 
      trend: 'מוסדות פעילים',
      color: 'bg-orange-50 text-orange-600'
    },
  ];

  const exportReport = () => {
    const csvContent = `סטטיסטיקות,ערך\n` +
      `סך המשתמשים,${stats?.totalUsers || 0}\n` +
      `פעילים,${stats?.activeUsers || 0}\n` +
      `קורסים פעילים,${stats?.activeCourses || 0}\n` +
      `קבוצות פעילות,${stats?.activeGroups || 0}\n` +
      `קבוצות לא פעילות,${stats?.inactiveGroups || 0}\n` +
      `מוסדות לימוד,${stats?.uniqueInstitutions || 0}\n`;

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `דוח-סטטיסטיקות-${new Date().toLocaleDateString('he-IL')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('הדוח יוצא בהצלחה!');
  };

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
            <Card key={stat.title} className="bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 rounded-2xl shadow-md hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-semibold text-foreground">
                  {stat.title}
                </CardTitle>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <IconComponent className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                <p className="text-xs text-muted-foreground font-medium">
                  {stat.trend}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="bg-gradient-to-br from-white to-primary/5 border-2 border-primary/20 rounded-2xl shadow-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-foreground">פעולות מהירות</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button 
            onClick={() => navigate('/admin/courses')}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <BookOpen className="w-5 h-5 ml-2" />
            הוסף קורס חדש
          </Button>
          <Button 
            onClick={exportReport}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <FileDown className="w-5 h-5 ml-2" />
            יצא דוח (CSV)
          </Button>
          <Button 
            onClick={() => navigate('/admin/students')}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <UserCheck className="w-5 h-5 ml-2" />
            נהל משתמשים
          </Button>
          <Button 
            onClick={() => navigate('/admin/institutions')}
            className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <GraduationCap className="w-5 h-5 ml-2" />
            נהל מוסדות
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
