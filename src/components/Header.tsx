import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
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
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('lu_auth') === '1';


  return (
    <header className="bg-muted/50 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 sm:h-18 lg:h-20" dir="rtl">
          {/* Logo */}
          <Link to="/" className="flex items-center group min-w-0">
            <img 
              src={levelupLogo} 
              alt="LevelUp – לוגו" 
              className="w-auto h-12 transition-transform group-hover:scale-105 flex-shrink-0"
              style={{ 
                imageRendering: 'crisp-edges'
              }}
            />
          </Link>

          {/* Auth Button */}
          <div className="flex items-center gap-4">
            {!isLoggedIn ? (
              <Link to="/auth">
                <Button 
                  variant="default"
                  size="sm"
                  className="font-medium px-6 py-2.5 text-sm shadow-sm hover:shadow-md transition-all duration-200 bg-primary hover:bg-primary/90 text-white"
                  aria-label="כניסה למנויים"
                >
                  כניסה למנויים
                </Button>
              </Link>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="font-medium px-4 py-2.5 border-primary/20 hover:border-primary/40 hover:bg-primary/5">
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
                className="lg:hidden p-2 flex-shrink-0"
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

                <div className="space-y-4">
                  {!isLoggedIn ? (
                    <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full font-medium py-3">
                        כניסה למנויים
                      </Button>
                    </Link>
                  ) : (
                    <div className="space-y-2">
                      <Link to="/settings" onClick={() => setIsMobileMenuOpen(false)}>
                        <Button variant="outline" className="w-full font-medium py-3">
                          הגדרות
                        </Button>
                      </Link>
                      <Button 
                        variant="outline" 
                        className="w-full font-medium py-3"
                        onClick={() => {
                          localStorage.removeItem('lu_auth');
                          setIsMobileMenuOpen(false);
                          window.location.reload();
                        }}
                      >
                        התנתק
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;