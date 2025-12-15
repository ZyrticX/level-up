import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  UserCheck,
  GraduationCap, 
  Activity,
  BarChart, 
  Settings,
  Menu,
  X,
  Palette,
  Server
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const AdminSidebar = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: 'דשבורד', href: '/admin', icon: LayoutDashboard },
    { label: 'ניהול קורסים', href: '/admin/courses', icon: BookOpen },
    { label: 'ניהול משתמשים', href: '/admin/students', icon: UserCheck },
    { label: 'ניהול קבוצות', href: '/admin/groups', icon: Users },
    { label: 'מוסדות לימוד', href: '/admin/institutions', icon: GraduationCap },
    { label: 'שרת Hetzner', href: '/admin/hetzner-videos', icon: Server },
    { label: 'אייקונים לנושאים', href: '/admin/subjects', icon: Palette },
    { label: 'מעקב משתמשים', href: '/admin/tracking', icon: Activity },
    { label: 'דוחות וסטטיסטיקות', href: '/admin/reports', icon: BarChart },
    { label: 'הגדרות מערכת', href: '/admin/settings', icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className={`bg-background border-l border-border h-screen transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="font-semibold text-foreground">ממשק ניהול</h2>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="h-8 w-8"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex items-center p-3 rounded-md transition-colors ${
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${isCollapsed ? '' : 'ml-3'}`} />
                  {!isCollapsed && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;