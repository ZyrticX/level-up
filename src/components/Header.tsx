import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Menu, Settings, LogOut, BookOpen, Building, Info, Phone } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo.png';
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
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between" dir="rtl">
          {/* Right side - Logo */}
          <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img 
              src={levelupLogo} 
              alt="LevelUp Logo" 
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Navigation - Left side */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Text Menu */}
            <nav className="flex items-center gap-6">
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

            {/* Buttons */}
            <div className="flex items-center gap-3">
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="text-sm font-medium"
                  aria-label="כניסה לאזור המנויים"
                >
                  <User className="w-4 h-4 ml-2" />
                  כניסה למנויים
                </Button>
              </Link>

              {isLoggedIn && (
                <DropdownMenu open={optionsOpen} onOpenChange={setOptionsOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="text-sm font-medium text-foreground/80 hover:text-foreground"
                      aria-label="תפריט אפשרויות"
                    >
                      אפשרויות
                      <ChevronDown className="w-4 h-4 mr-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="start" 
                    className="bg-background border border-border min-w-[140px] shadow-md"
                    sideOffset={8}
                  >
                    <DropdownMenuItem className="text-right cursor-pointer">
                      <Settings className="w-4 h-4 ml-2" />
                      הגדרות
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-right cursor-pointer">
                      <LogOut className="w-4 h-4 ml-2" />
                      התנתק
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
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
                    variant="outline" 
                    className="w-full text-sm font-medium"
                  >
                    <User className="w-4 h-4 ml-2" />
                    כניסה למנויים
                  </Button>
                </Link>

                {/* Mobile Options */}
                {isLoggedIn && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground px-3">אפשרויות</h3>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-right p-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 ml-3" />
                      הגדרות
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-right p-3"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <LogOut className="w-4 h-4 ml-3" />
                      התנתק
                    </Button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;