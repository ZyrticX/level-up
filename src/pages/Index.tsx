import { useNavigate } from 'react-router-dom';
import { ChevronDown, User, BookOpen, GraduationCap, ArrowLeft, Building, Wrench, Church } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background font-hebrew" dir="rtl">
      {/* Header */}
      <header className="bg-background border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Right side - Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LevelUp</span>
            </div>

            {/* Left side - Navigation */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all duration-200 flex items-center">
                <User className="w-4 h-4 ml-2" />
                כניסה למנויים
              </button>

              <div className="relative group">
                <button className="border-2 border-primary text-primary bg-transparent px-6 py-2.5 rounded-lg font-medium hover:bg-primary hover:text-white transition-all duration-200 flex items-center">
                  אפשרויות
                  <ChevronDown className="w-4 h-4 mr-2" />
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <a href="#" className="block px-4 py-2 text-right hover:bg-gray-100">הגדרות</a>
                  <a href="#" className="block px-4 py-2 text-right hover:bg-gray-100">התנתק</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Main Headline */}
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8 leading-tight">
              הדרך שלך מאפס למאה – מתחילה כאן!
            </h1>

            {/* Description */}
            <div className="text-xl md:text-2xl text-gray-700 leading-relaxed mb-12 max-w-3xl mx-auto">
              <p className="mb-6">
                מרתונים מוקלטים ועשירים בהסברים ותרגולים מותאמים לבחינות הסופיות.
              </p>
              <p>
                התוכן נבנה כמסלול מסודר ובהתאמה מוחלטת לחומר המועבר בכיתה, 
                מונגש מהבסיס ואינו מצריך ידע מוקדם.
              </p>
            </div>

            {/* Features Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">מרתונים מוקלטים</h3>
                <p className="text-gray-600">
                  תוכן מלא ומקיף המותאם לבחינות
                </p>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <GraduationCap className="w-12 h-12 text-purple-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">מסלול מסודר</h3>
                <p className="text-gray-600">
                  למידה שלב אחר שלב מהבסיס
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <ArrowLeft className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">התאמה מוחלטת</h3>
                <p className="text-gray-600">
                  תוכן המותאם לחומר הכיתתי
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <button className="bg-gradient-to-r from-primary to-secondary text-white px-8 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-lg flex items-center mx-auto">
              התחל עכשיו
              <ArrowLeft className="w-5 h-5 mr-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Institutions Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Title */}
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
                בחרו מוסד לימודים
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                בחרו את המוסד שלכם ומצאו תוכן מותאם במיוחד לתכנית הלימודים
              </p>
            </div>

            {/* Institutions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: 'האוניברסיטה העברית', icon: Building, desc: 'מוסד אקדמי מוביל', id: 'hebrew-university' },
                { name: 'המכללה האקדמית', icon: GraduationCap, desc: 'מכללה אקדמית מובילה', id: 'academic-college' },
                { name: 'המכון הטכנולוגי', icon: Wrench, desc: 'מכון טכנולוגי מתקדם', id: 'technion' },
                { name: 'בית המדרש העליון', icon: Church, desc: 'מוסד לימודי מסורתי', id: 'seminary' },
                { name: 'המכללה למדעים', icon: Building, desc: 'מכללה למדעים מדויקים', id: 'science-college' },
                { name: 'האקדמיה לאמנויות', icon: GraduationCap, desc: 'אקדמיה לאמנויות יפות', id: 'arts-academy' }
              ].map((institution, index) => {
                const IconComponent = institution.icon;
                return (
                  <div
                    key={index}
                    onClick={() => navigate(`/institution/${institution.id}`)}
                    className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-pointer group bg-gradient-to-br from-white to-gray-50"
                  >
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                          <IconComponent className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors duration-200">
                        {institution.name}
                      </h3>
                      
                      <p className="text-gray-600 mb-6">
                        {institution.desc}
                      </p>
                      
                      <button className="border-2 border-blue-600 text-blue-600 bg-transparent px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 w-full group-hover:bg-blue-600 group-hover:text-white">
                        צפיה בקורסים
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional Info */}
            <div className="text-center mt-16">
              <p className="text-lg text-gray-600 mb-6">
                לא מוצא את המוסד שלך? נשמח לעזור!
              </p>
              <button className="border-2 border-blue-600 text-blue-600 bg-transparent px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-200">
                פנה אלינו
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Main Footer Content */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
              {/* Logo and Description */}
              <div className="md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                    <GraduationCap className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">LevelUp</span>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  פלטפורמת הלמידה המובילה בישראל. מרתונים מוקלטים ועשירים 
                  המותאמים במיוחד לבחינות הסופיות של מוסדות הלימוד השונים.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">קישורים מהירים</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">אודותינו</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">צור קשר</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">שאלות נפוצות</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">תמיכה טכנית</a></li>
                </ul>
              </div>

              {/* Support */}
              <div>
                <h3 className="font-semibold text-gray-800 mb-4">תמיכה</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">מרכז עזרה</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">דרכי תשלום</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">החזרים וביטולים</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">מדיניות השימוש</a></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-300 pt-8">
              {/* Legal Links and Copyright */}
              <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                <div className="flex flex-wrap justify-center md:justify-start gap-6">
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">תקנון האתר</a>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">מדיניות פרטיות</a>
                  <a href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200">הצהרת נגישות</a>
                </div>

                <div className="text-sm text-gray-600">
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