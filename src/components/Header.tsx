import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-new-transparent.png';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('lu_auth') === '1';

  const navigationItems = [
    { label: "קורסים", href: "/courses" },
    { label: "המוסדות שלי", href: "/institutions" },
    { label: "אודות", href: "/about" },
    { label: "צור קשר", href: "/contact" },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="relative flex flex-row-reverse items-center justify-between h-14 sm:h-16 lg:h-20" dir="rtl">
          {/* Logo */}
          <Link to="/" className="flex items-center group min-w-0 mr-6">
            <img 
              src={levelupLogo} 
              alt="LevelUp – לוגו" 
              className="h-12 w-auto transition-all duration-300 group-hover:scale-105 flex-shrink-0"
              style={{ 
                height: '48px',
                filter: 'drop-shadow(0 0 12px rgba(255, 255, 255, 0.5)) drop-shadow(0 0 24px rgba(255, 255, 255, 0.2)) brightness(1.1) contrast(1.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '6px',
                padding: '2px'
              }}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-x-6" aria-label="ניווט ראשי" dir="rtl">
            {navigationItems.map((item) => {
              const active = location.pathname.startsWith(item.href);
              return (
                <Link 
                  key={item.label}
                  to={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={`px-1 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${active ? 'text-foreground' : 'text-foreground/70 hover:text-foreground'}`}
                >
                  <span className="underline-offset-8 hover:underline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center gap-3">
            {!isLoggedIn ? (
              <Link to="/auth">
                <Button 
                  variant="default"
                  size="sm"
                  className="font-medium px-4 lg:px-6 text-sm shadow-sm hover:shadow-md transition-all duration-200"
                  aria-label="כניסה למנויים"
                >
                  כניסה למנויים
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-medium">
                    אפשרויות
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>חשבון</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings">הגדרות</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      localStorage.removeItem('lu_auth');
                      window.location.reload();
                    }}
                  >
                    התנתק
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden p-2 flex-shrink-0"
                aria-label="פתח תפריט"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80" dir="rtl">
              <div className="flex flex-col space-y-8 mt-6">
                <div className="text-center pb-6 border-b border-border/50">
                  <div className="text-xl font-bold text-foreground">LevelUp</div>
                  <div className="text-sm text-muted-foreground mt-1">פלטפורמת למידה מתקדמת</div>
                </div>
                
                <nav className="flex flex-col space-y-2">
                  {navigationItems.map((item) => (
                    <Link 
                      key={item.label}
                      to={item.href} 
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-right p-4 hover:bg-accent/70 rounded-lg transition-all duration-200 font-medium"
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>

                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="w-full font-medium py-3">
                    כניסה למנויים
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;