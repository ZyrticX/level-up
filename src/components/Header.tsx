import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, BookOpen, Building, Info, Phone, Settings } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-final.png';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { label: "קורסים", href: "/courses", icon: BookOpen },
    { label: "המוסדות שלי", href: "/institutions", icon: Building },
    { label: "ממשק ניהול", href: "/admin", icon: Settings },
    { label: "אודות", href: "/about", icon: Info },
    { label: "צור קשר", href: "/contact", icon: Phone },
  ];

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="relative flex items-center justify-between h-14 sm:h-16 lg:h-20" dir="rtl">
          {/* Logo */}
          <Link to="/" className="flex items-center group min-w-0">
            <img 
              src={levelupLogo} 
              alt="LevelUp" 
              className="h-10 sm:h-12 lg:h-16 w-auto transition-transform group-hover:scale-105 flex-shrink-0"
            />
            <div className="mr-2 sm:mr-3 hidden xs:block min-w-0">
              <div className="text-base sm:text-lg lg:text-xl font-bold text-foreground tracking-tight truncate">LevelUp</div>
              <div className="text-xs text-muted-foreground font-medium hidden sm:block">פלטפורמת למידה מתקדמת</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6" dir="ltr">
            {navigationItems.map((item) => (
              <Link 
                key={item.label}
                to={item.href}
                className="relative px-3 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-all duration-200 group whitespace-nowrap"
              >
                <span className="relative z-10">{item.label}</span>
                <div className="absolute inset-0 bg-accent/50 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
            ))}
          </nav>

          {/* Auth Button */}
          <div className="hidden md:flex items-center">
            <Link to="/auth">
              <Button 
                variant="default"
                size="sm"
                className="font-medium px-4 lg:px-6 text-sm shadow-sm hover:shadow-md transition-all duration-200"
              >
                כניסה למנויים
              </Button>
            </Link>
          </div>

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="md:hidden p-2 flex-shrink-0"
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
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link 
                        key={item.label}
                        to={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center text-right p-4 hover:bg-accent/70 rounded-lg transition-all duration-200 group"
                      >
                        <IconComponent className="w-5 h-5 ml-3 text-muted-foreground group-hover:text-foreground" />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    );
                  })}
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