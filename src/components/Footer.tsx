import { Separator } from '@/components/ui/separator';
import { Phone, MapPin } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-new-transparent.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 lg:py-16 max-w-7xl" dir="rtl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-12">
          {/* Logo and Description */}
          <div className="md:col-span-2 text-center md:text-right">
            <div className="flex items-center justify-center md:justify-start space-x-3 mb-4 md:mb-6">
              <img src={levelupLogo} alt="LevelUp" className="h-16 md:h-20 lg:h-24 w-auto" />
            </div>
            <p className="text-paragraph text-muted-foreground max-w-md mx-auto md:mx-0 text-right">
              פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
              המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
            </p>
          </div>

          {/* Quick Links */}
          <div className="text-center md:text-right">
            <h3 className="text-h3 text-foreground mb-4 md:mb-6 text-right">ניווט באתר</h3>
            <ul className="space-y-3 md:space-y-4">
              <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">דף הבית</a></li>
              <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a></li>
              <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a></li>
              <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">תקנון ותנאי שימוש</a></li>
              <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">צור קשר</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="text-center md:text-right">
            <h3 className="text-h3 text-foreground mb-4 md:mb-6 text-right">צור קשר</h3>
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-start gap-3 text-nav text-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>050-322-3885</span>
              </div>
              <div className="flex items-center justify-start gap-3 text-nav text-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>בעל שם טוב 35 פתח תקווה</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6 md:pt-8 lg:pt-10">
          {/* Legal Links - Centered */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8">
              <a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">תקנון האתר</a>
              <a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a>
              <a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
            </div>

            <div className="text-nav text-muted-foreground text-center">
              © {currentYear} LevelUp. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;