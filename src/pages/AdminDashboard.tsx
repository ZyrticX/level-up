import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, TrendingUp, Activity, DollarSign } from 'lucide-react';
import AdminLayout from '@/components/AdminLayout';

const AdminDashboard = () => {
  const stats = [
    { title: 'סטודנטים פעילים', value: '15,243', icon: Users, trend: '+12%' },
    { title: 'קורסים זמינים', value: '284', icon: BookOpen, trend: '+5%' },
    { title: 'מוסדות לימוד', value: '6', icon: GraduationCap, trend: '0%' },
    { title: 'שיעור השלמה', value: '87%', icon: TrendingUp, trend: '+3%' },
    { title: 'פעילות שבועית', value: '24,891', icon: Activity, trend: '+8%' },
    { title: 'הכנסות חודשיות', value: '₪125,430', icon: DollarSign, trend: '+15%' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-background rounded-lg border border-border p-6">
          <h1 className="text-2xl font-semibold text-foreground mb-2">דשבורד ניהול</h1>
          <p className="text-muted-foreground">סקירה כללית של פעילות הפלטפורמה</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat) => {
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
                  <p className="text-xs text-green-600 font-medium">
                    {stat.trend} מהחודש הקודם
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
              <button className="w-full text-right p-3 rounded-md bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                הוסף קורס חדש
              </button>
              <button className="w-full text-right p-3 rounded-md bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
                צפה בדוח שבועי
              </button>
              <button className="w-full text-right p-3 rounded-md bg-primary/5 text-primary hover:bg-primary/10 transition-colors">
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
                <div className="font-medium text-foreground">סטודנט חדש נרשם</div>
                <div className="text-muted-foreground">לפני 5 דקות</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">קורס חדש פורסם</div>
                <div className="text-muted-foreground">לפני 2 שעות</div>
              </div>
              <div className="text-sm">
                <div className="font-medium text-foreground">בעיה טכנית דווחה</div>
                <div className="text-muted-foreground">לפני 4 שעות</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;