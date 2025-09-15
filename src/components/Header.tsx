import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Menu, Settings, LogOut, BookOpen, Building, Info, Phone } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-transparent.png';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

// Professional academic header component

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  const navigationItems = [
    { label: "קורסים", href: "/courses", icon: BookOpen },
    { label: "המוסדות שלי", href: "/institutions", icon: Building },
    { label: "אודות", href: "/about", icon: Info },
    { label: "צור קשר", href: "/contact", icon: Phone },
  ];

  return (
    <header className="bg-background border-b border-border/20 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-6 py-3 md:py-4">
        <div className="relative flex items-center justify-between" dir="rtl">
          {/* Right side - Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src={levelupLogo} 
              alt="LevelUp Logo" 
              className="h-16 md:h-20 lg:h-28 xl:h-32 w-auto"
            />
          </Link>

          {/* Center Navigation - Desktop only */}
          <nav className="hidden lg:flex items-center gap-6 absolute left-1/2 transform -translate-x-1/2">
            {navigationItems.map((item) => (
              <Link 
                key={item.label}
                to={item.href}
                className="text-foreground/80 hover:text-primary transition-colors text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Left side - Simplified Button */}
          <div className="hidden lg:flex items-center">
            <Link to="/auth">
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary-dark font-medium px-6 py-2"
                aria-label="כניסה לאזור המנויים"
              >
                כניסה למנויים
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden"
                aria-label="פתח תפריט ניווט"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]" dir="rtl">
              <div className="flex flex-col space-y-6 mt-8">
                {/* Mobile Logo */}
                <div className="flex items-center justify-center pb-6 border-b border-border">
                  <div className="text-xl font-bold text-primary">
                    LevelUp
                  </div>
                </div>
                
                {/* Mobile Navigation */}
                <nav className="flex flex-col space-y-3">
                  {navigationItems.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <Link 
                        key={item.label}
                        to={item.href} 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center text-right p-3 hover:bg-accent rounded-md transition-colors"
                      >
                        <IconComponent className="w-4 h-4 ml-3" />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>

                {/* Mobile Auth Button */}
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-primary text-primary-foreground hover:bg-primary-dark font-medium"
                  >
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