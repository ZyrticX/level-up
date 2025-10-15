import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { BookOpen, Users, GraduationCap, TrendingUp, Activity } from 'lucide-react';

const AdminReportsPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-reports'],
    queryFn: async () => {
      const [coursesRes, studentsRes, institutionsRes] = await Promise.all([
        supabase.from('courses').select('*'),
        supabase.from('profiles').select('*'),
        supabase.from('institutions').select('*'),
      ]);

      const totalCourses = coursesRes.data?.length || 0;
      const publishedCourses = coursesRes.data?.filter(c => c.is_published).length || 0;
      const totalStudents = studentsRes.data?.length || 0;
      const totalInstitutions = institutionsRes.data?.length || 0;
      const activeInstitutions = institutionsRes.data?.filter(i => i.is_active).length || 0;

      // Course distribution by institution
      const coursesByInstitution = coursesRes.data?.reduce((acc: Record<string, number>, course) => {
        const inst = course.institution || 'ללא מוסד';
        acc[inst] = (acc[inst] || 0) + 1;
        return acc;
      }, {}) || {};

      const institutionData = Object.entries(coursesByInstitution).map(([name, count]) => ({
        name,
        count,
      }));

      // Student distribution by institution
      const studentsByInstitution = studentsRes.data?.reduce((acc: Record<string, number>, student) => {
        const inst = student.institution || 'ללא מוסד';
        acc[inst] = (acc[inst] || 0) + 1;
        return acc;
      }, {}) || {};

      const studentDistribution = Object.entries(studentsByInstitution).map(([name, count]) => ({
        name,
        count,
      }));

      // Course status distribution
      const courseStatusData = [
        { name: 'פורסמו', value: publishedCourses, color: '#10b981' },
        { name: 'טיוטה', value: totalCourses - publishedCourses, color: '#94a3b8' },
      ];

      // Mock monthly growth data (in real app, this would come from actual date ranges)
      const monthlyGrowth = [
        { month: 'ינואר', students: 12, courses: 3 },
        { month: 'פברואר', students: 19, courses: 5 },
        { month: 'מרץ', students: 28, courses: 7 },
        { month: 'אפריל', students: 35, courses: 9 },
        { month: 'מאי', students: 42, courses: 12 },
        { month: 'יוני', students: totalStudents, courses: totalCourses },
      ];

      return {
        totalCourses,
        publishedCourses,
        totalStudents,
        totalInstitutions,
        activeInstitutions,
        institutionData,
        studentDistribution,
        courseStatusData,
        monthlyGrowth,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען דוחות...</p>
        </div>
      </div>
    );
  }

  const summaryCards = [
    {
      title: 'סה"כ קורסים',
      value: stats?.totalCourses || 0,
      icon: BookOpen,
      description: `${stats?.publishedCourses || 0} פורסמו`,
      color: 'text-blue-600',
    },
    {
      title: 'סה"כ סטודנטים',
      value: stats?.totalStudents || 0,
      icon: Users,
      description: 'משתמשים רשומים',
      color: 'text-green-600',
    },
    {
      title: 'מוסדות לימוד',
      value: stats?.totalInstitutions || 0,
      icon: GraduationCap,
      description: `${stats?.activeInstitutions || 0} פעילים`,
      color: 'text-purple-600',
    },
    {
      title: 'שיעור פרסום',
      value: stats?.totalCourses ? `${Math.round((stats.publishedCourses / stats.totalCourses) * 100)}%` : '0%',
      icon: TrendingUp,
      description: 'קורסים מפורסמים',
      color: 'text-orange-600',
    },
  ];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">דוחות וסטטיסטיקות</h1>
        <p className="text-muted-foreground">מבט כולל על נתוני המערכת</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card) => {
          const IconComponent = card.icon;
          return (
            <Card key={card.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <IconComponent className={`h-5 w-5 ${card.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{card.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Course Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>התפלגות סטטוס קורסים</CardTitle>
            <CardDescription>קורסים מפורסמים לעומת טיוטות</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.courseStatusData || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stats?.courseStatusData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Courses by Institution */}
        <Card>
          <CardHeader>
            <CardTitle>קורסים לפי מוסד</CardTitle>
            <CardDescription>התפלגות קורסים בין המוסדות</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={stats?.institutionData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Growth */}
        <Card>
          <CardHeader>
            <CardTitle>גידול חודשי</CardTitle>
            <CardDescription>סטודנטים וקורסים במהלך הזמן</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats?.monthlyGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="students" stroke="#10b981" name="סטודנטים" strokeWidth={2} />
                <Line type="monotone" dataKey="courses" stroke="#3b82f6" name="קורסים" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Students by Institution */}
        <Card>
          <CardHeader>
            <CardTitle>סטודנטים לפי מוסד</CardTitle>
            <CardDescription>התפלגות סטודנטים בין המוסדות</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats?.studentDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats?.studentDistribution?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            סטטיסטיקות נוספות
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-primary">
                {stats?.totalCourses && stats?.totalInstitutions 
                  ? (stats.totalCourses / stats.totalInstitutions).toFixed(1)
                  : '0'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">ממוצע קורסים למוסד</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-green-600">
                {stats?.totalStudents && stats?.totalCourses
                  ? (stats.totalStudents / stats.totalCourses).toFixed(1)
                  : '0'}
              </div>
              <p className="text-sm text-muted-foreground mt-2">ממוצע סטודנטים לקורס</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <div className="text-3xl font-bold text-purple-600">
                {stats?.activeInstitutions || 0}
              </div>
              <p className="text-sm text-muted-foreground mt-2">מוסדות פעילים</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminReportsPage;
