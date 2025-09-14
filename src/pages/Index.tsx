import { useState } from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, BookOpen, Users, Award, ArrowLeft, Star, CheckCircle } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-1.jpg';

const Index = () => {
  return (
    <div className="min-h-screen bg-background font-sans" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50 shadow-subtle">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Right side - Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={levelupLogo} 
                alt="LevelUp" 
                className="h-16 w-auto rounded-md"
              />
            </Link>

            {/* Left side - Navigation */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/auth">
                <button className="btn-primary">
                  כניסה למערכת
                </button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="section-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-white mb-6 font-semibold">
              פלטפורמת הלמידה המובילה
              <br />
              למוסדות לימוד בישראל
            </h1>
            <p className="text-xl text-white/90 mb-8 leading-relaxed">
              מרתונים מוקלטים ועשירים המותאמים במיוחד לבחינות הסופיות
              <br />
              של מוסדות הלימוד השונים במדינה
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth" className="inline-block">
                <button className="bg-white text-primary px-8 py-4 rounded-md font-semibold text-lg hover:bg-white/95 transition-all duration-200 shadow-medium">
                  התחל ללמוד עכשיו
                </button>
              </Link>
              <button className="border border-white/30 text-white px-8 py-4 rounded-md font-medium text-lg hover:bg-white/10 transition-all duration-200">
                גלה עוד
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-feature py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">למה לבחור ב-LevelUp?</h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              אנו מציעים חוויית למידה מותאמת אישית עם תוכן איכותי ותמיכה מקצועית
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="card-feature">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground mb-3">תוכן איכותי</h3>
              <p className="text-muted-foreground">
                חומר לימוד מקיף ומעודכן, מותאם לסילבוס של מוסדות הלימוד המובילים בישראל
              </p>
            </div>

            <div className="card-feature">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground mb-3">קהילה תומכת</h3>
              <p className="text-muted-foreground">
                הצטרף לקהילה של סטודנטים מובחרים ובעלי ביצועים גבוהים במוסדות השונים
              </p>
            </div>

            <div className="card-feature">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-foreground mb-3">הצלחה מוכחת</h3>
              <p className="text-muted-foreground">
                אלפי סטודנטים כבר השיגו הצלחה בבחינות הסופיות עם העזרה של הפלטפורמה שלנו
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-foreground mb-4">מוסדות הלימוד שלנו</h2>
            <p className="text-subtitle max-w-2xl mx-auto">
              אנו עובדים עם המוסדות המובילים בישראל כדי להבטיח תוכן מדויק ועדכני
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
      <section className="section-feature py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-muted-foreground">סטודנטים רשומים</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">250+</div>
              <div className="text-muted-foreground">קורסים זמינים</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">95%</div>
              <div className="text-muted-foreground">שיעור הצלחה</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">6</div>
              <div className="text-muted-foreground">מוסדות לימוד</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-white mb-4">מוכנים להתחיל?</h2>
            <p className="text-xl text-white/90 mb-8">
              הצטרפו אלינו היום והתחילו את המסע שלכם להצלחה אקדמית
            </p>
            <Link to="/auth" className="inline-block">
              <button className="bg-white text-primary px-8 py-4 rounded-md font-semibold text-lg hover:bg-white/95 transition-all duration-200 shadow-medium">
                הירשמו עכשיו
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Logo and Description */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <img 
                    src={levelupLogo} 
                    alt="LevelUp" 
                    className="h-12 w-auto rounded-md"
                  />
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-md">
                  פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                  המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">קישורים מהירים</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">אודותינו</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">צור קשר</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">שאלות נפוצות</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">תמיכה טכנית</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-foreground mb-4">תמיכה</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">מרכז עזרה</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">דרכי תשלום</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">החזרים וביטולים</a></li>
                  <li><a href="#" className="text-muted-foreground hover:text-primary transition-colors">מדיניות השימוש</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-border pt-8">
              {/* Legal Links and Copyright */}
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">תקנון האתר</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">מדיניות פרטיות</a>
                  <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">הצהרת נגישות</a>
                </div>

                <div className="text-sm text-muted-foreground">
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