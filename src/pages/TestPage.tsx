import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { 
  Home, 
  Building, 
  BookOpen, 
  Video, 
  Users, 
  Settings, 
  Phone, 
  Shield,
  LayoutDashboard,
  UserCheck,
  GraduationCap,
  Video as VideoIcon,
  Activity,
  BarChart,
  Cog,
  CreditCard,
  CheckCircle,
  MessageSquare,
  Send,
  X
} from 'lucide-react';

interface PageRoute {
  path: string;
  name: string;
  description: string;
  icon: any;
  category: 'public' | 'admin';
  status: 'ready' | 'demo';
}

interface PageComment {
  path: string;
  comment: string;
  timestamp: string;
}

const TestPage = () => {
  const { toast } = useToast();
  const [comments, setComments] = useState<Record<string, string>>({});
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  // Load comments from localStorage on mount
  useEffect(() => {
    const savedComments = localStorage.getItem('testPageComments');
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error('Error loading comments:', e);
      }
    }
  }, []);

  // Save comments to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('testPageComments', JSON.stringify(comments));
  }, [comments]);

  const handleCommentChange = (path: string, value: string) => {
    setNewComments(prev => ({ ...prev, [path]: value }));
  };

  const handleSaveComment = (path: string) => {
    const comment = (newComments[path] || comments[path] || '').trim();
    if (!comment) {
      toast({
        title: 'שגיאה',
        description: 'אנא הזן הערה לפני שמירה',
        variant: 'destructive',
      });
      return;
    }

    setComments(prev => ({
      ...prev,
      [path]: comment,
    }));
    
    setNewComments(prev => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });
    
    setExpandedComments(prev => {
      const updated = new Set(prev);
      updated.delete(path);
      return updated;
    });

    toast({
      title: 'הערה נשמרה!',
      description: 'ההערה נשמרה בהצלחה',
    });
  };

  const handleDeleteComment = (path: string) => {
    setComments(prev => {
      const updated = { ...prev };
      delete updated[path];
      return updated;
    });

    toast({
      title: 'הערה נמחקה',
      description: 'ההערה נמחקה בהצלחה',
    });
  };

  const toggleCommentSection = (path: string) => {
    setExpandedComments(prev => {
      const updated = new Set(prev);
      if (updated.has(path)) {
        updated.delete(path);
      } else {
        updated.add(path);
      }
      return updated;
    });
  };

  const routes: PageRoute[] = [
    // Public Pages
    {
      path: '/',
      name: 'עמוד הבית',
      description: 'דף הבית של האתר עם Hero Section ורשימת מוסדות',
      icon: Home,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/institution/technion',
      name: 'עמוד מוסד - טכניון',
      description: 'דף המוסד עם חוגים וקורסים',
      icon: Building,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/course/physics-101',
      name: 'עמוד קורס - פיזיקה 1',
      description: 'דף הקורס עם פרטים, רכישה וחומרי לימוד',
      icon: BookOpen,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/course-purchased/physics-101',
      name: 'עמוד קורס נרכש - פיזיקה 1',
      description: 'דף הקורס אחרי רכישה עם התקדמות וחומרי עזר',
      icon: CheckCircle,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/checkout/physics-101',
      name: 'עמוד תשלום',
      description: 'השלמת רכישה עם פרטי תשלום ואבטחה',
      icon: CreditCard,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/watch/physics-101',
      name: 'עמוד צפייה',
      description: 'נגן וידאו עם פלייליסט',
      icon: Video,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/my-courses',
      name: 'הקורסים שלי',
      description: 'דף הקורסים של המשתמש',
      icon: BookOpen,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/settings',
      name: 'הגדרות משתמש',
      description: 'הגדרות אישיות',
      icon: Settings,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/contact',
      name: 'צור קשר',
      description: 'טופס יצירת קשר',
      icon: Phone,
      category: 'public',
      status: 'ready'
    },
    {
      path: '/privacy',
      name: 'מדיניות פרטיות',
      description: 'תקנון ומדיניות פרטיות',
      icon: Shield,
      category: 'public',
      status: 'ready'
    },

    // Admin Pages
    {
      path: '/admin',
      name: 'דשבורד ניהול',
      description: 'לוח בקרה עם סטטיסטיקות ופעולות מהירות',
      icon: LayoutDashboard,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/courses',
      name: 'ניהול קורסים',
      description: 'טבלת קורסים עם חיפוש וסינונים',
      icon: BookOpen,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/students',
      name: 'ניהול משתמשים',
      description: 'טבלת משתמשים עם מעקב התחברויות',
      icon: UserCheck,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/groups',
      name: 'ניהול קבוצות',
      description: 'ניהול קבוצות סטודנטים והרשאות',
      icon: Users,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/institutions',
      name: 'ניהול מוסדות וחוגים',
      description: 'טבלת מוסדות עם חוגים',
      icon: GraduationCap,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/content',
      name: 'ניהול תוכן וסרטונים',
      description: 'מסך ראשי לניהול תוכן',
      icon: VideoIcon,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/video-library',
      name: 'ספריית סרטונים',
      description: 'טבלה של כל הסרטונים - חיפוש, סינון, העלאה מרובה',
      icon: VideoIcon,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/video-editor/new',
      name: 'עריכת סרטון (חדש)',
      description: 'הגדרת כל הפרטים של סרטון בודד',
      icon: VideoIcon,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/course-builder',
      name: 'בונה קורסים',
      description: 'ארגון הסרטונים בתוך הקורס עם drag & drop',
      icon: VideoIcon,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/tracking',
      name: 'מעקב משתמשים',
      description: 'מעקב מכשירים והחלפות',
      icon: Activity,
      category: 'admin',
      status: 'ready'
    },
    {
      path: '/admin/reports',
      name: 'דוחות וסטטיסטיקות',
      description: 'דוחות מפורטים',
      icon: BarChart,
      category: 'admin',
      status: 'demo'
    },
    {
      path: '/admin/settings',
      name: 'הגדרות מערכת',
      description: 'הגדרות כלליות',
      icon: Cog,
      category: 'admin',
      status: 'demo'
    }
  ];

  const publicRoutes = routes.filter(r => r.category === 'public');
  const adminRoutes = routes.filter(r => r.category === 'admin');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-3 sm:p-4 md:p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3 md:mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent px-2">
            🎨 Test Page - כל העמודים
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-2">
            רשימה מלאה של כל העמודים והנתיבים באתר LevelUp
          </p>
          <Badge variant="outline" className="mt-3 sm:mt-4 text-sm sm:text-base md:text-lg px-4 sm:px-6 py-1.5 sm:py-2">
            {routes.length} עמודים במערכת
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 md:mb-12">
          <Card className="glass-card border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Home className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">עמודים ציבוריים</p>
                  <p className="text-2xl font-bold">{publicRoutes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">עמודי ניהול</p>
                  <p className="text-2xl font-bold">{adminRoutes.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border-2">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">מוכנים לשימוש</p>
                  <p className="text-2xl font-bold">{routes.filter(r => r.status === 'ready').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Public Pages */}
        <div className="mb-8 sm:mb-10 md:mb-12">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 flex items-center gap-2 sm:gap-3 px-2">
            <Home className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-primary" />
            עמודים ציבוריים
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            {publicRoutes.map((route) => {
              const IconComponent = route.icon;
              const hasComment = !!comments[route.path];
              const isCommentExpanded = expandedComments.has(route.path);
              
              return (
                <Card key={route.path} className="glass-card border-2 hover:scale-105 transition-all duration-300 h-full group flex flex-col">
                  <Link to={route.path} className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary/20 to-primary/10 rounded-xl flex items-center justify-center group-hover:from-primary/30 group-hover:to-primary/20 transition-all">
                          <IconComponent className="w-6 h-6 text-primary" />
                        </div>
                        <Badge 
                          variant={route.status === 'ready' ? 'default' : 'secondary'}
                          className={route.status === 'ready' ? 'bg-green-500' : ''}
                        >
                          {route.status === 'ready' ? '✓ מוכן' : 'Demo'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg md:text-xl">{route.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        {route.description}
                      </p>
                      <code className="text-xs bg-muted px-2 py-1 rounded break-all">
                        {route.path}
                      </code>
                    </CardContent>
                  </Link>
                  
                  {/* Comments Section */}
                  <div className="border-t border-border mt-auto">
                    {hasComment && (
                      <div className="p-3 sm:p-4 bg-muted/30">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="font-medium">הערה שמורה:</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(route.path)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground bg-background p-2 sm:p-3 rounded-lg border break-words">
                          {comments[route.path]}
                        </p>
                      </div>
                    )}
                    
                    {!isCommentExpanded ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCommentSection(route.path);
                        }}
                        className="w-full rounded-none border-t-0 text-xs sm:text-sm py-2 sm:py-2.5"
                      >
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        {hasComment ? 'ערוך הערה' : 'הוסף הערה'}
                      </Button>
                    ) : (
                      <div className="p-3 sm:p-4 bg-muted/30 space-y-2 sm:space-y-3">
                        <Textarea
                          placeholder="השאר הערה על העמוד הזה..."
                          value={newComments[route.path] || comments[route.path] || ''}
                          onChange={(e) => handleCommentChange(route.path, e.target.value)}
                          className="min-h-[60px] sm:min-h-[80px] text-right resize-none text-xs sm:text-sm"
                          dir="rtl"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveComment(route.path)}
                            className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
                          >
                            <Send className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                            שמור
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCommentSection(route.path)}
                            className="text-xs sm:text-sm py-1.5 sm:py-2"
                          >
                            ביטול
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Admin Pages */}
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <Shield className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-purple-600" />
            עמודי ניהול
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {adminRoutes.map((route) => {
              const IconComponent = route.icon;
              const hasComment = !!comments[route.path];
              const isCommentExpanded = expandedComments.has(route.path);
              
              return (
                <Card key={route.path} className="glass-card border-2 border-purple-200 hover:scale-105 transition-all duration-300 h-full group flex flex-col">
                  <Link to={route.path} className="flex-1">
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500/20 to-purple-400/10 rounded-xl flex items-center justify-center group-hover:from-purple-500/30 group-hover:to-purple-400/20 transition-all">
                          <IconComponent className="w-6 h-6 text-purple-600" />
                        </div>
                        <Badge 
                          variant={route.status === 'ready' ? 'default' : 'secondary'}
                          className={route.status === 'ready' ? 'bg-green-500' : ''}
                        >
                          {route.status === 'ready' ? '✓ מוכן' : 'Demo'}
                        </Badge>
                      </div>
                      <CardTitle className="text-base sm:text-lg md:text-xl">{route.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                      <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-3">
                        {route.description}
                      </p>
                      <code className="text-xs bg-purple-100 px-2 py-1 rounded break-all">
                        {route.path}
                      </code>
                    </CardContent>
                  </Link>
                  
                  {/* Comments Section */}
                  <div className="border-t border-border mt-auto">
                    {hasComment && (
                      <div className="p-3 sm:p-4 bg-muted/30">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="font-medium">הערה שמורה:</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteComment(route.path)}
                            className="h-6 w-6 p-0 flex-shrink-0"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                        <p className="text-xs sm:text-sm text-foreground bg-background p-2 sm:p-3 rounded-lg border break-words">
                          {comments[route.path]}
                        </p>
                      </div>
                    )}
                    
                    {!isCommentExpanded ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.preventDefault();
                          toggleCommentSection(route.path);
                        }}
                        className="w-full rounded-none border-t-0 text-xs sm:text-sm py-2 sm:py-2.5"
                      >
                        <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                        {hasComment ? 'ערוך הערה' : 'הוסף הערה'}
                      </Button>
                    ) : (
                      <div className="p-3 sm:p-4 bg-muted/30 space-y-2 sm:space-y-3">
                        <Textarea
                          placeholder="השאר הערה על העמוד הזה..."
                          value={newComments[route.path] || comments[route.path] || ''}
                          onChange={(e) => handleCommentChange(route.path, e.target.value)}
                          className="min-h-[60px] sm:min-h-[80px] text-right resize-none text-xs sm:text-sm"
                          dir="rtl"
                        />
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSaveComment(route.path)}
                            className="flex-1 text-xs sm:text-sm py-1.5 sm:py-2"
                          >
                            <Send className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                            שמור
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleCommentSection(route.path)}
                            className="text-xs sm:text-sm py-1.5 sm:py-2"
                          >
                            ביטול
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-8 sm:mt-12 text-center">
          <Link to="/">
            <button className="glass-button px-6 py-3 sm:px-8 sm:py-4 text-base sm:text-lg font-semibold rounded-2xl">
              ← חזרה לדף הבית
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TestPage;

