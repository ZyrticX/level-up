import { useState } from 'react';
import { ChevronDown, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import levelupLogo from '@/assets/levelup-logo.png';

const Header = () => {
  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between" dir="rtl">
          {/* Right side - Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src={levelupLogo} 
              alt="LevelUp" 
              className="h-12 w-auto"
            />
            <span className="text-2xl font-bold text-gradient">LevelUp</span>
          </div>

          {/* Left side - Navigation */}
          <div className="flex items-center space-x-4 space-x-reverse">
            <Button variant="default" className="btn-academic">
              <User className="w-4 h-4 ml-2" />
              כניסה למנויים
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="outline" 
                  className="btn-outline-academic flex items-center"
                >
                  אפשרויות
                  <ChevronDown className="w-4 h-4 mr-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className="bg-popover border border-border shadow-elegant min-w-[150px]"
              >
                <DropdownMenuItem className="text-right">
                  הגדרות
                </DropdownMenuItem>
                <DropdownMenuItem className="text-right">
                  התנתק
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;