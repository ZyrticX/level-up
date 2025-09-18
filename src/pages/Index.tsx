import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, Star, CheckCircle } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-new-transparent.png';

const Index = () => {
  return (
    <main className="min-h-screen bg-background font-sans" dir="rtl" role="main">

      {/* Hero Section */}
      <section className="section-hero relative py-16 md:py-20 lg:py-24 overflow-hidden flex items-center" aria-labelledby="hero-title">
        <div className="container-standard text-center relative z-10 w-full">
          <div className="max-w-6xl mx-auto space-elements">
            <div className="animate-fade-in">
              <h1 
                id="hero-title" 
                className="text-h1 text-white mb-6 drop-shadow-lg text-center"
              >
                פלטפורמת הלמידה המתקדמת בישראל
              </h1>
              <p className="text-paragraph text-white/95 mb-8 text-center max-w-4xl mx-auto drop-shadow-md">
                מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות של המוסדות האקדמיים המובילים במדינה
              </p>
            </div>
          </div>
        </div>
        {/* Enhanced Floating Elements */}
        <div className="absolute top-1/4 left-8 w-20 h-20 bg-white/15 rounded-full animate-float blur-sm shadow-lg"></div>
        <div className="absolute top-1/3 right-12 w-16 h-16 bg-white/15 rounded-full animate-float animation-delay-2000 blur-sm shadow-lg"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-white/15 rounded-full animate-float animation-delay-4000 blur-sm shadow-lg"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white/20 rounded-full animate-float animation-delay-1000 blur-sm shadow-md"></div>
      </section>


      {/* Features Section */}
      <section className="section-standard" aria-labelledby="features-title">
        <div className="container-standard space-elements">
          <div className="text-center space-elements">
            <div className="flex justify-center">
              <img 
                src={levelupLogo} 
                alt="LevelUp" 
                className="h-52 md:h-60 lg:h-72 xl:h-80 w-auto drop-shadow-2xl"
              />
            </div>
            <h2 id="features-title" className="text-h2 text-foreground text-right">למה לבחור ב-LevelUp?</h2>
            <p className="text-paragraph text-muted-foreground max-w-3xl mx-auto text-right">
              אנו מציעים חוויית למידה מותאמת אישית עם תוכן איכותי ותמיכה מקצועית
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            <div className="card-feature text-center p-6 md:p-8">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-h3 text-foreground mb-3 md:mb-4 text-right">תוכן איכותי</h3>
              <p className="text-paragraph text-muted-foreground text-right">
                חומר לימוד מקיף ומעודכן, מותאם לסילבוס של מוסדות הלימוד המובילים בישראל
              </p>
            </div>

            <div className="card-feature text-center p-6 md:p-8">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-h3 text-foreground mb-3 md:mb-4 text-right">קהילה תומכת</h3>
              <p className="text-paragraph text-muted-foreground text-right">
                הצטרף לקהילה של סטודנטים מובחרים ובעלי ביצועים גבוהים במוסדות השונים
              </p>
            </div>

            <div className="card-feature text-center p-6 md:p-8 md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Award className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-h3 text-foreground mb-3 md:mb-4 text-right">הצלחה מוכחת</h3>
              <p className="text-paragraph text-muted-foreground text-right">
                אלפי סטודנטים כבר השיגו הצלחה בבחינות הסופיות עם העזרה של הפלטפורמה שלנו
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="section-standard" aria-labelledby="institutions-title">
        <div className="container-standard space-elements">
          <div className="text-center space-elements">
            <h2 id="institutions-title" className="text-h2 text-foreground text-right">מוסדות הלימוד שלנו</h2>
            <p className="text-paragraph text-muted-foreground max-w-3xl mx-auto text-right">
              אנו עובדים עם המוסדות המובילים בישראל כדי להבטיח תוכן מדויק ועדכני
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              { id: 'technion', name: 'הטכניון', subtitle: 'מכון טכנולוגי לישראל', courses: '45+ קורסים' },
              { id: 'hebrew-university', name: 'האוניברסיטה העברית', subtitle: 'ירושלים', courses: '38+ קורסים' },
              { id: 'tel-aviv-university', name: 'אוניברסיטת תל אביב', subtitle: 'המוסד המוביל', courses: '52+ קורסים' },
              { id: 'ben-gurion-university', name: 'אוניברסיטת בן גוריון', subtitle: 'בנגב', courses: '34+ קורסים' },
              { id: 'bar-ilan-university', name: 'אוניברסיטת בר אילן', subtitle: 'רמת גן', courses: '28+ קורסים' },
              { id: 'haifa-university', name: 'אוניברסיטת חיפה', subtitle: 'הצפון', courses: '31+ קורסים' }
            ].map((institution) => (
              <Link
                key={institution.id}
                to={`/institution/${institution.id}`}
                className="card-course group p-6 md:p-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6 group-hover:bg-primary/20 transition-colors duration-200">
                    <GraduationCap className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-primary" />
                  </div>
                  <h3 className="text-h3 text-foreground text-right">{institution.name}</h3>
                  <p className="text-paragraph text-muted-foreground text-right">{institution.subtitle}</p>
                  <div className="badge-academic text-nav text-right">
                    {institution.courses}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-feature section-standard" aria-labelledby="stats-title">
        <div className="container-standard">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="space-elements">
              <div className="text-h2 font-bold text-primary">15,000+</div>
              <div className="text-paragraph text-muted-foreground">סטודנטים רשומים</div>
            </div>
            <div className="space-elements">
              <div className="text-h2 font-bold text-primary">250+</div>
              <div className="text-paragraph text-muted-foreground">קורסים זמינים</div>
            </div>
            <div className="space-elements">
              <div className="text-h2 font-bold text-primary">95%</div>
              <div className="text-paragraph text-muted-foreground">שיעור הצלחה</div>
            </div>
            <div className="space-elements">
              <div className="text-h2 font-bold text-primary">6</div>
              <div className="text-paragraph text-muted-foreground">מוסדות לימוד</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white section-standard" aria-labelledby="cta-title">
        <div className="container-standard text-center">
          <div className="max-w-3xl mx-auto space-elements">
            <h2 id="cta-title" className="text-h2 text-white text-right">מוכנים להתחיל?</h2>
            <p className="text-paragraph text-white/95 text-right">
              הצטרפו אלינו היום והתחילו את המסע שלכם להצלחה אקדמית
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto max-w-xs mx-auto">
              <button className="bg-white text-primary btn-secondary w-full">
                הירשמו עכשיו
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 lg:py-16 max-w-7xl">
          {/* Main Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 lg:gap-12 mb-8 md:mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-2 text-center md:text-right">
              <div className="flex items-center justify-center md:justify-start space-x-3 mb-4 md:mb-6">
                <img 
                  src={levelupLogo} 
                  alt="LevelUp" 
                  className="h-16 md:h-20 lg:h-24 w-auto"
                />
              </div>
              <p className="text-paragraph text-muted-foreground max-w-md mx-auto md:mx-0 text-right">
                פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-right">
              <h3 className="text-h3 text-foreground mb-4 md:mb-6 text-right">קישורים מהירים</h3>
              <ul className="space-y-3 md:space-y-4">
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">אודותינו</a></li>
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">צור קשר</a></li>
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">שאלות נפוצות</a></li>
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">תמיכה טכנית</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="text-center md:text-right">
              <h3 className="text-h3 text-foreground mb-4 md:mb-6 text-right">תמיכה</h3>
              <ul className="space-y-3 md:space-y-4">
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">מרכז עזרה</a></li>
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">דרכי תשלום</a></li>
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">החזרים וביטולים</a></li>
                <li><a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">מדיניות השימוש</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 md:pt-8 lg:pt-10">
            {/* Legal Links and Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 lg:gap-8">
                <a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">תקנון האתר</a>
                <a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a>
                <a href="#" className="text-nav text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
              </div>

              <div className="text-nav text-muted-foreground text-center md:text-right">
                © 2024 LevelUp. כל הזכויות שמורות.
              </div>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default Index;