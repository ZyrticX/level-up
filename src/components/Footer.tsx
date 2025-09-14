import { Separator } from '@/components/ui/separator';
import levelupLogo from '@/assets/levelup-logo-1.jpg';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-muted border-t border-border">
      <div className="container mx-auto px-4 py-12" dir="rtl">
        <div className="max-w-6xl mx-auto">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src={levelupLogo} 
                  alt="LevelUp" 
                  className="h-10 w-auto rounded-md"
                />
              </div>
              <p className="text-muted-foreground leading-relaxed">
                פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">קישורים מהירים</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    אודותינו
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    צור קשר
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    שאלות נפוצות
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    תמיכה טכנית
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">תמיכה</h3>
              <ul className="space-y-3">
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    מרכז עזרה
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    דרכי תשלום
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    החזרים וביטולים
                  </a>
                </li>
                <li>
                  <a 
                    href="#" 
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    מדיניות השימוש
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          {/* Legal Links and Copyright */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-wrap justify-center md:justify-start gap-6">
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                תקנון האתר
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                מדיניות פרטיות
              </a>
              <a 
                href="#" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                הצהרת נגישות
              </a>
            </div>

            <div className="text-sm text-muted-foreground">
              © {currentYear} LevelUp. כל הזכויות שמורות.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;