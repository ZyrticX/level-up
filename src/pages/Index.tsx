import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, Star, CheckCircle } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-new-transparent.png';

const Index = () => {
  return (
    <main className="min-h-screen bg-background font-sans" dir="rtl" role="main">

      {/* Hero Section */}
      <section className="section-hero relative py-16 md:py-20 lg:py-32 xl:py-40 overflow-hidden" aria-labelledby="hero-title">
        <div className="container mx-auto px-4 lg:px-8 text-center relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="animate-fade-in">
              <h1 
                id="hero-title" 
                className="text-white mb-6 md:mb-8 lg:mb-12 font-bold text-4xl md:text-5xl lg:text-7xl xl:text-8xl leading-tight tracking-tight drop-shadow-lg"
              >
                פלטפורמת הלמידה
                <br />
                <span className="text-gradient-light">המתקדמת בישראל</span>
              </h1>
              <p className="text-lg md:text-xl lg:text-2xl xl:text-3xl text-white/95 mb-8 md:mb-10 lg:mb-16 leading-relaxed max-w-4xl mx-auto font-medium drop-shadow-md">
                מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>של המוסדות האקדמיים המובילים במדינה
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center animate-scale-in">
              <Link to="/auth" className="inline-block w-full sm:w-auto">
                <button className="btn-primary text-base md:text-lg lg:text-xl w-full sm:w-auto min-w-[200px] lg:min-w-[250px] px-6 lg:px-10 py-3 lg:py-4 group shadow-lg hover:shadow-xl">
                  התחל ללמוד עכשיו
                  <span className="mr-3 group-hover:mr-2 transition-all duration-300">←</span>
                </button>
              </Link>
              <button className="btn-secondary text-base md:text-lg lg:text-xl w-full sm:w-auto min-w-[180px] lg:min-w-[220px] px-6 lg:px-10 py-3 lg:py-4 shadow-md hover:shadow-lg">
                צפה בדמו
              </button>
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
      <section className="section-feature relative py-12 md:py-16 lg:py-24 xl:py-32" aria-labelledby="features-title">
        <div className="container mx-auto px-4 lg:px-8 relative z-10 max-w-7xl">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <div className="flex justify-center mb-6 md:mb-8">
              <img 
                src={levelupLogo} 
                alt="LevelUp" 
                className="h-32 md:h-40 lg:h-48 xl:h-56 w-auto drop-shadow-2xl"
              />
            </div>
            <h2 id="features-title" className="text-foreground mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">למה לבחור ב-LevelUp?</h2>
            <p className="text-subtitle max-w-3xl mx-auto text-base md:text-lg lg:text-xl px-2">
              אנו מציעים חוויית למידה מותאמת אישית עם תוכן איכותי ותמיכה מקצועית
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 xl:gap-12">
            <div className="card-feature text-center p-6 md:p-8">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6">
                <BookOpen className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-foreground mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl font-semibold">תוכן איכותי</h3>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                חומר לימוד מקיף ומעודכן, מותאם לסילבוס של מוסדות הלימוד המובילים בישראל
              </p>
            </div>

            <div className="card-feature text-center p-6 md:p-8">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Users className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-foreground mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl font-semibold">קהילה תומכת</h3>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                הצטרף לקהילה של סטודנטים מובחרים ובעלי ביצועים גבוהים במוסדות השונים
              </p>
            </div>

            <div className="card-feature text-center p-6 md:p-8 md:col-span-2 lg:col-span-1">
              <div className="w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 md:mb-6">
                <Award className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-primary" />
              </div>
              <h3 className="text-foreground mb-3 md:mb-4 text-lg md:text-xl lg:text-2xl font-semibold">הצלחה מוכחת</h3>
              <p className="text-muted-foreground text-sm md:text-base lg:text-lg leading-relaxed">
                אלפי סטודנטים כבר השיגו הצלחה בבחינות הסופיות עם העזרה של הפלטפורמה שלנו
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-12 md:py-16 lg:py-20 xl:py-24" aria-labelledby="institutions-title">
        <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
          <div className="text-center mb-8 md:mb-12 lg:mb-16">
            <h2 id="institutions-title" className="text-foreground mb-4 md:mb-6 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">מוסדות הלימוד שלנו</h2>
            <p className="text-subtitle max-w-3xl mx-auto text-base md:text-lg lg:text-xl px-2">
              אנו עובדים עם המוסדות המובילים בישראל כדי להבטיח תוכן מדויק ועדכני
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
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
                  <h3 className="text-foreground mb-2 md:mb-3 font-semibold text-lg md:text-xl lg:text-2xl">{institution.name}</h3>
                  <p className="text-muted-foreground text-sm md:text-base lg:text-lg mb-3 md:mb-4">{institution.subtitle}</p>
                  <div className="badge-academic text-sm md:text-base">
                    {institution.courses}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-feature py-12 md:py-16 lg:py-20 xl:py-24" aria-labelledby="stats-title">
        <div className="container mx-auto px-4 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-12 text-center">
            <div className="p-4 md:p-6 lg:p-8">
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2 md:mb-4">15,000+</div>
              <div className="text-muted-foreground text-sm md:text-base lg:text-lg">סטודנטים רשומים</div>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2 md:mb-4">250+</div>
              <div className="text-muted-foreground text-sm md:text-base lg:text-lg">קורסים זמינים</div>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2 md:mb-4">95%</div>
              <div className="text-muted-foreground text-sm md:text-base lg:text-lg">שיעור הצלחה</div>
            </div>
            <div className="p-4 md:p-6 lg:p-8">
              <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-primary mb-2 md:mb-4">6</div>
              <div className="text-muted-foreground text-sm md:text-base lg:text-lg">מוסדות לימוד</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12 md:py-16 lg:py-20 xl:py-24" aria-labelledby="cta-title">
        <div className="container mx-auto px-4 lg:px-8 text-center max-w-5xl">
          <div className="max-w-3xl mx-auto">
            <h2 id="cta-title" className="text-white mb-4 md:mb-6 lg:mb-8 text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold">מוכנים להתחיל?</h2>
            <p className="text-base md:text-lg lg:text-xl xl:text-2xl text-white/95 mb-6 md:mb-8 lg:mb-12 px-2 leading-relaxed">
              הצטרפו אלינו היום והתחילו את המסע שלכם להצלחה אקדמית
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <button className="bg-background text-primary px-8 md:px-10 lg:px-12 py-3 md:py-4 lg:py-5 rounded-md font-semibold text-base md:text-lg lg:text-xl hover:bg-background/95 shadow-medium hover:shadow-large w-full sm:w-auto transition-all duration-300">
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
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base lg:text-lg max-w-md mx-auto md:mx-0">
                פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
              </p>
            </div>

            {/* Quick Links */}
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-foreground mb-4 md:mb-6 text-base md:text-lg lg:text-xl">קישורים מהירים</h3>
              <ul className="space-y-3 md:space-y-4">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">אודותינו</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">צור קשר</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">שאלות נפוצות</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">תמיכה טכנית</a></li>
              </ul>
            </div>

            {/* Support */}
            <div className="text-center md:text-right">
              <h3 className="font-semibold text-foreground mb-4 md:mb-6 text-base md:text-lg lg:text-xl">תמיכה</h3>
              <ul className="space-y-3 md:space-y-4">
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">מרכז עזרה</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">דרכי תשלום</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">החזרים וביטולים</a></li>
                <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm md:text-base lg:text-lg">מדיניות השימוש</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border pt-6 md:pt-8 lg:pt-10">
            {/* Legal Links and Copyright */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 lg:gap-8">
                <a href="#" className="text-xs md:text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors">תקנון האתר</a>
                <a href="#" className="text-xs md:text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a>
                <a href="#" className="text-xs md:text-sm lg:text-base text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
              </div>

              <div className="text-xs md:text-sm lg:text-base text-muted-foreground text-center md:text-right">
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