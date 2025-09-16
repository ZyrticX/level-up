import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, Star, CheckCircle } from 'lucide-react';
import levelupLogo from '@/assets/levelup-main-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">

      {/* Hero Section */}
      <section className="section-hero relative py-20 sm:py-24 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent opacity-50"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-5xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-white mb-6 sm:mb-8 font-bold text-3xl sm:text-4xl lg:text-6xl xl:text-7xl leading-tight tracking-tight">
                פלטפורמת הלמידה
                <br />
                <span className="text-gradient-light bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">המתקדמת בישראל</span>
              </h1>
              <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
                מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות
                <br className="hidden sm:block" />
                <span className="sm:hidden"> </span>של המוסדות האקדמיים המובילים במדינה
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4 animate-scale-in">
              <Link to="/auth" className="inline-block w-full sm:w-auto">
                <button className="btn-primary text-lg w-full sm:w-auto min-w-[200px] group">
                  התחל ללמוד עכשיו
                  <span className="mr-3 group-hover:mr-2 transition-all duration-300">←</span>
                </button>
              </Link>
              <button className="btn-secondary text-lg w-full sm:w-auto min-w-[180px]">
                צפה בדמו
              </button>
            </div>
          </div>
        </div>
        {/* Floating Elements */}
        <div className="absolute top-1/4 left-8 w-20 h-20 bg-white/10 rounded-full animate-float blur-sm"></div>
        <div className="absolute top-1/3 right-12 w-16 h-16 bg-white/10 rounded-full animate-float animation-delay-2000 blur-sm"></div>
        <div className="absolute bottom-1/4 left-1/4 w-12 h-12 bg-white/10 rounded-full animate-float animation-delay-4000 blur-sm"></div>
      </section>

      {/* Features Section */}
      <section className="section-feature relative py-16 sm:py-20 lg:py-24">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12 sm:mb-16 animate-slide-up">
            <div className="flex justify-center mb-6">
              <img 
                src={levelupLogo} 
                alt="LevelUp" 
                className="h-20 sm:h-24 lg:h-28 w-auto drop-shadow-2xl"
              />
            </div>
            <p className="text-subtitle max-w-3xl mx-auto text-lg sm:text-xl px-2 font-medium">
              אנו מציעים חוויית למידה מותאמת אישית עם תוכן פרימיום ותמיכה מקצועית ברמה הגבוהה ביותר
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 max-w-7xl mx-auto">
            <div className="card-feature group animate-fade-in">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground mb-4 text-xl font-bold">תוכן פרימיום</h3>
              <p className="text-muted-foreground leading-relaxed">
                חומר לימוד מקיף ומעודכן ברמה הגבוהה ביותר, מותאם לסילבוס של מוסדות הלימוד המובילים בישראל
              </p>
            </div>

            <div className="card-feature group animate-fade-in animation-delay-200">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground mb-4 text-xl font-bold">קהילה אליטיסטית</h3>
              <p className="text-muted-foreground leading-relaxed">
                הצטרף לקהילה של הסטודנטים המובחרים והמצטיינים במוסדות הלימוד הטובים ביותר במדינה
              </p>
            </div>

            <div className="card-feature group animate-fade-in animation-delay-400">
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <Award className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground mb-4 text-xl font-bold">הישגים מוכחים</h3>
              <p className="text-muted-foreground leading-relaxed">
                אלפי סטודנטים השיגו הצלחה יוצאת דופן בבחינות הסופיות עם הפלטפורמה המתקדמת שלנו
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-foreground mb-4 text-xl sm:text-2xl lg:text-3xl">מוסדות הלימוד שלנו</h2>
            <p className="text-subtitle max-w-2xl mx-auto text-sm sm:text-base px-2">
              אנו עובדים עם המוסדות המובילים בישראל כדי להבטיח תוכן מדויק ועדכני
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
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
                className="card-course group"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-200">
                    <GraduationCap className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="text-foreground mb-2 font-semibold">{institution.name}</h3>
                  <p className="text-muted-foreground text-sm mb-3">{institution.subtitle}</p>
                  <div className="badge-academic">
                    {institution.courses}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="section-feature py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-4xl mx-auto text-center">
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-muted-foreground text-xs sm:text-sm">סטודנטים רשומים</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">250+</div>
              <div className="text-muted-foreground text-xs sm:text-sm">קורסים זמינים</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground text-xs sm:text-sm">שיעור הצלחה</div>
            </div>
            <div className="p-4">
              <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-muted-foreground text-xs sm:text-sm">מוסדות לימוד</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-12 sm:py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white mb-4 text-xl sm:text-2xl lg:text-3xl">מוכנים להתחיל?</h2>
            <p className="text-base sm:text-lg lg:text-xl text-white/90 mb-6 sm:mb-8 px-2">
              הצטרפו אלינו היום והתחילו את המסע שלכם להצלחה אקדמית
            </p>
            <Link to="/auth" className="inline-block w-full sm:w-auto">
              <button className="bg-background text-primary px-6 sm:px-8 py-3 sm:py-4 rounded-md font-semibold text-base sm:text-lg hover:bg-background/95 shadow-medium hover:shadow-large w-full sm:w-auto" style={{ transition: "var(--transition-smooth)" }}>
                הירשמו עכשיו
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 py-8 sm:py-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
              {/* Logo and Description */}
              <div className="sm:col-span-2 lg:col-span-2 text-center sm:text-right">
                <div className="flex items-center justify-center sm:justify-start space-x-3 mb-4">
                  <img 
                    src={levelupLogo} 
                    alt="LevelUp" 
                    className="h-12 sm:h-16 w-auto rounded-md"
                  />
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base max-w-md mx-auto sm:mx-0">
                  פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                  המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
                </p>
              </div>

              {/* Quick Links */}
              <div className="text-center sm:text-right">
                <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">קישורים מהירים</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">אודותינו</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">צור קשר</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">שאלות נפוצות</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">תמיכה טכנית</a></li>
                </ul>
              </div>

              {/* Support */}
              <div className="text-center sm:text-right">
                <h3 className="font-semibold text-foreground mb-4 text-sm sm:text-base">תמיכה</h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">מרכז עזרה</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">דרכי תשלום</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">החזרים וביטולים</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors text-sm sm:text-base">מדיניות השימוש</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-6 sm:pt-8">
              {/* Legal Links and Copyright */}
              <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-6">
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">תקנון האתר</a>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a>
                  <a href="#" className="text-xs sm:text-sm text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
                </div>

                <div className="text-xs sm:text-sm text-muted-foreground text-center sm:text-right">
                  © 2024 LevelUp. כל הזכויות שמורות.
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;