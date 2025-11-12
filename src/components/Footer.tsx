import { Link } from 'react-router-dom';
import { Phone, Mail } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-new-transparent.png';

const Footer = () => {
  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-7xl" dir="rtl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Column 1: About */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-foreground mb-4">אודות</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              פלטפורמת הלמידה המובילה בישראל למוסדות אקדמיים.
            </p>
          </div>

          {/* Column 2: Terms & Privacy */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-foreground mb-4">תנאי שימוש</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  מדיניות פרטיות
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  תקנון האתר
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="text-center md:text-right">
            <h3 className="text-lg font-semibold text-foreground mb-4">צור קשר</h3>
            <div className="flex flex-col items-center md:items-end gap-3">
              <div className="flex items-center gap-3 flex-row-reverse">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">050-322-3885</span>
              </div>
              <div className="flex items-center gap-3 flex-row-reverse">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:levelupacademy.co.il@gmail.com" className="text-sm text-foreground hover:text-primary transition-colors">
                  levelupacademy.co.il@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Logo */}
        <div className="border-t border-border pt-8">
          <div className="flex justify-center items-center">
            <img src={levelupLogo} alt="LevelUp" className="h-32 w-auto" />
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-8 mt-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 Levelup כל הזכויות שמורות
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;