import { Link } from 'react-router-dom';
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

const Header = () => {
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
              className="w-auto h-16 transition-transform group-hover:scale-105 flex-shrink-0"
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
        </div>
      </div>
    </header>
  );
};

export default Header;