import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, User, Menu, X, Settings, Shield } from 'lucide-react';
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
import levelupLogo from '@/assets/levelup-logo-1.jpg';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // This would come from auth context in real app
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [optionsOpen, setOptionsOpen] = useState(false);

  return (
    <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50" style={{ boxShadow: "var(--shadow-subtle)" }}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between" dir="rtl">
          {/* Right side - Logo */}
          <Link to="/" className="flex items-center space-x-3 hover:opacity-80" style={{ transition: "var(--transition-fast)" }}>
            <img 
              src={levelupLogo} 
              alt="LevelUp - פלטפורמת הלמידה המקוונת" 
              className="h-20 w-auto rounded-md shadow-sm"
            />
          </Link>

          {/* Desktop Navigation - Left side */}
          <nav className="hidden md:flex items-center space-x-3 space-x-reverse">
            <Link to="/auth">
              <Button 
                variant="default" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 py-2.5 rounded-lg shadow-subtle hover:shadow-medium"
                style={{ transition: "var(--transition-smooth)" }}
                aria-label="כניסה לאזור המנויים"
              >
                <User className="w-4 h-4 ml-2" />
                כניסה למנויים
              </Button>
            </Link>

            {isLoggedIn && (
              <DropdownMenu open={optionsOpen} onOpenChange={setOptionsOpen}>
                <DropdownMenuTrigger asChild onMouseEnter={() => setOptionsOpen(true)}>
                  <Button 
                    variant="outline" 
                    className="border-border hover:bg-accent hover:text-accent-foreground font-medium px-4 py-2.5 rounded-lg shadow-subtle hover:shadow-medium"
                    style={{ transition: "var(--transition-smooth)" }}
                    aria-label="תפריט אפשרויות"
                  >
                    <Settings className="w-4 h-4 ml-2" />
                    אפשרויות
                    <ChevronDown className="w-4 h-4 mr-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="start" 
                  className="bg-popover border border-border min-w-[160px] rounded-lg p-1"
                  style={{ boxShadow: "var(--shadow-large)" }}
                  sideOffset={8}
                  onMouseLeave={() => setOptionsOpen(false)}
                >
                  <DropdownMenuItem asChild className="text-right hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 cursor-pointer">
                    <Link to="/admin">
                      <Shield className="w-4 h-4 ml-2" />
                      ניהול
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-right hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 cursor-pointer">
                    <Settings className="w-4 h-4 ml-2" />
                    הגדרות
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-right hover:bg-accent hover:text-accent-foreground rounded-md px-3 py-2 cursor-pointer">
                    <User className="w-4 h-4 ml-2" />
                    התנתק
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="md:hidden hover:bg-accent hover:text-accent-foreground"
                aria-label="פתח תפריט ניווט"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[280px] sm:w-[350px]" dir="rtl">
              <div className="flex flex-col space-y-4 mt-8">
                <div className="flex items-center justify-center pb-6 border-b border-border">
                  <img 
                    src={levelupLogo} 
                    alt="LevelUp" 
                    className="h-12 w-auto rounded-md"
                  />
                </div>
                
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    variant="default" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg"
                    style={{ transition: "var(--transition-smooth)" }}
                  >
                    <User className="w-4 h-4 ml-2" />
                    כניסה למנויים
                  </Button>
                </Link>

                {isLoggedIn && (
                  <div className="space-y-2 pt-4 border-t border-border">
                    <h3 className="text-sm font-medium text-muted-foreground px-2">אפשרויות</h3>
                    <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-right hover:bg-accent hover:text-accent-foreground py-3"
                      >
                        <Shield className="w-4 h-4 ml-2" />
                        ניהול
                      </Button>
                    </Link>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-right hover:bg-accent hover:text-accent-foreground py-3"
                    >
                      <Settings className="w-4 h-4 ml-2" />
                      הגדרות
                    </Button>
                    <Button 
                      variant="ghost" 
                      className="w-full justify-start text-right hover:bg-accent hover:text-accent-foreground py-3"
                    >
                      <User className="w-4 h-4 ml-2" />
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