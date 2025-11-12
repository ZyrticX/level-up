import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import levelupLogo from '@/assets/levelup-logo-new.png';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import LoginModal from './LoginModal';
import SignupModal from './SignupModal';
import { BookOpen, Mail, Settings, FileText, LogOut, User as UserIcon, ChevronDown } from 'lucide-react';

const Header = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const navigate = useNavigate();
  const { isAdmin } = useAdminAuth();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const isLoggedIn = !!user;

  return (
    <>
      <header className="bg-white/90 backdrop-blur-md border-b border-border/40 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 sm:h-20" dir="rtl">
            {/* Logo - Right Side */}
            <Link to="/" className="flex items-center group flex-shrink-0">
              <img 
                src={levelupLogo} 
                alt="LevelUp – לוגו" 
                className="w-auto h-12 sm:h-14 md:h-16 transition-transform group-hover:scale-105"
                style={{ 
                  imageRendering: 'crisp-edges'
                }}
              />
            </Link>

            {/* Auth Buttons - Left Side */}
            <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 flex-shrink-0">
              {!isLoggedIn ? (
                <>
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    variant="default"
                    size="sm"
                    className="font-medium px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-2.5 text-xs sm:text-sm shadow-sm hover:shadow-md transition-all duration-200 bg-primary hover:bg-primary/90 text-white hidden sm:inline-flex"
                  >
                    כניסה למנויים
                  </Button>
                  <Button 
                    onClick={() => setShowLoginModal(true)}
                    variant="default"
                    size="icon"
                    className="font-medium w-9 h-9 sm:hidden shadow-sm hover:shadow-md transition-all duration-200 bg-primary hover:bg-primary/90 text-white"
                    title="כניסה"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    onClick={() => setShowSignupModal(true)}
                    variant="outline"
                    size="sm"
                    className="font-medium px-3 py-2 sm:px-4 sm:py-2.5 md:px-6 md:py-2.5 text-xs sm:text-sm border-primary text-primary hover:bg-primary/10 transition-all duration-200 hidden sm:inline-flex"
                  >
                    הרשמה
                  </Button>
                  <Button 
                    onClick={() => setShowSignupModal(true)}
                    variant="outline"
                    size="icon"
                    className="font-medium w-9 h-9 sm:hidden border-primary text-primary hover:bg-primary/10 transition-all duration-200"
                    title="הרשמה"
                  >
                    <UserIcon className="w-4 h-4" />
                  </Button>
                  <Link to="/contact">
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="font-medium w-9 h-9 sm:w-auto sm:px-4 sm:py-2.5 text-xs sm:text-sm hover:bg-accent transition-all duration-200"
                      title="צור קשר"
                    >
                      <Mail className="w-4 h-4 sm:mr-2" />
                      <span className="hidden sm:inline">צור קשר</span>
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/contact">
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 transition-all duration-200 w-9 h-9"
                      title="צור קשר"
                    >
                      <Mail className="w-4 h-5 text-primary" />
                    </Button>
                  </Link>
                  <Link to="/my-courses">
                    <Button 
                      variant="ghost"
                      size="icon"
                      className="hover:bg-primary/10 transition-all duration-200 w-9 h-9"
                      title="הקורסים שלי"
                    >
                      <BookOpen className="w-4 h-5 text-primary" />
                    </Button>
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="font-medium px-2 py-2 sm:px-4 sm:py-2.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5 gap-1 sm:gap-2 text-xs sm:text-sm"
                      >
                        <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">{user?.user_metadata?.first_name || 'משתמש'}</span>
                        <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white w-56">
                      <DropdownMenuLabel className="font-bold text-base">
                        שלום, {user?.user_metadata?.first_name || 'משתמש'}!
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="flex items-center gap-2 cursor-pointer">
                            <Settings className="w-4 h-4" />
                            <span>לוח בקרה</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center gap-2 cursor-pointer">
                          <Settings className="w-4 h-4" />
                          <span>הגדרות משתמש</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/privacy" className="flex items-center gap-2 cursor-pointer">
                          <FileText className="w-4 h-4" />
                          <span>מדיניות פרטיות</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={handleSignOut} className="flex items-center gap-2 cursor-pointer text-destructive">
                        <LogOut className="w-4 h-4" />
                        <span>התנתק</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Login Modal */}
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
      />
      
      {/* Signup Modal */}
      <SignupModal 
        isOpen={showSignupModal} 
        onClose={() => setShowSignupModal(false)}
      />
    </>
  );
};

export default Header;