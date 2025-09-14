import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronDown, User, BookOpen, GraduationCap, Cpu, Zap, Calculator, Atom, FlaskConical, Dna, ArrowRight } from 'lucide-react';
import levelupLogo from '@/assets/levelup-logo-1.jpg';

const InstitutionPage = () => {
  const { institutionId } = useParams();
  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState('מדעי המחשב');

  const institutionNames = {
    'hebrew-university': 'האוניברסיטה העברית בירושלים',
    'academic-college': 'המכללה האקדמית תל אביב-יפו',
    'technion': 'הטכניון - מכון טכנולוגי לישראל',
    'seminary': 'בית המדרש העליון לתורה',
    'science-college': 'המכללה למדעים מדויקים',
    'arts-academy': 'האקדמיה לאמנויות יפות'
  };

  const institutionName = institutionNames[institutionId as keyof typeof institutionNames] || 'מוסד לימודים';

  const departments = [
    "מדעי המחשב",
    "הנדסת חשמל",
    "הנדסת תעשייה וניהול",
    "מתמטיקה",
    "פיזיקה",
    "כימיה",
    "ביולוגיה"
  ];

  const coursesByDepartment = {
    "מדעי המחשב": [
      { name: "מבוא למדעי המחשב", icon: Cpu, code: "CS101", id: "intro-cs" },
      { name: "מבני נתונים ואלגוריתמים", icon: BookOpen, code: "CS102", id: "data-structures" },
      { name: "תכנות מתקדם", icon: Cpu, code: "CS201", id: "advanced-programming" },
      { name: "בסיסי נתונים", icon: BookOpen, code: "CS301", id: "databases" }
    ],
    "הנדסת חשמל": [
      { name: "מעגלים חשמליים", icon: Zap, code: "EE101" },
      { name: "אלקטרוניקה דיגיטלית", icon: Cpu, code: "EE201" },
      { name: "עיבוד אותות", icon: Zap, code: "EE301" },
      { name: "מערכות בקרה", icon: Zap, code: "EE401" }
    ],
    "הנדסת תעשייה וניהול": [
      { name: "חקר ביצועים", icon: Calculator, code: "IE101" },
      { name: "ניהול פרויקטים", icon: BookOpen, code: "IE201" },
      { name: "כלכלה הנדסית", icon: Calculator, code: "IE301" },
      { name: "בקרת איכות", icon: Calculator, code: "IE401" }
    ],
    "מתמטיקה": [
      { name: "חשבון דיפרנציאלי ואינטגרלי", icon: Calculator, code: "MATH101" },
      { name: "אלגברה לינארית", icon: Calculator, code: "MATH201" },
      { name: "משוואות דיפרנציאליות", icon: Calculator, code: "MATH301" },
      { name: "חשבון הסתברויות", icon: Calculator, code: "MATH401" }
    ],
    "פיזיקה": [
      { name: "פיזיקה 1 - מכניקה קלאסית", icon: Atom, code: "PHYS101", id: "physics-101" },
      { name: "אלקטרומגנטיות", icon: Atom, code: "PHYS201", id: "electromagnetics" },
      { name: "פיזיקה קוונטית", icon: Atom, code: "PHYS301", id: "quantum-physics" },
      { name: "תרמודינמיקה", icon: Atom, code: "PHYS401", id: "thermodynamics" }
    ],
    "כימיה": [
      { name: "כימיה כללית", icon: FlaskConical, code: "CHEM101" },
      { name: "כימיה אורגנית", icon: FlaskConical, code: "CHEM201" },
      { name: "כימיה פיזיקלית", icon: FlaskConical, code: "CHEM301" },
      { name: "כימיה אנליטית", icon: FlaskConical, code: "CHEM401" }
    ],
    "ביולוגיה": [
      { name: "ביולוגיה כללית", icon: Dna, code: "BIO101" },
      { name: "ביולוגיה מולקולרית", icon: Dna, code: "BIO201" },
      { name: "גנטיקה", icon: Dna, code: "BIO301" },
      { name: "ביוכימיה", icon: Dna, code: "BIO401" }
    ]
  };

  const handleDepartmentClick = (department: string) => {
    setSelectedDepartment(department);
  };


  return (
    <div className="min-h-screen bg-gray-50 font-hebrew" dir="rtl">
      {/* Header - Same as homepage */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Right side - Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <img 
                src={levelupLogo} 
                alt="LevelUp" 
                className="h-20 w-auto rounded-md"
              />
            </Link>

            {/* Left side - Navigation */}
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 flex items-center">
                <User className="w-4 h-4 ml-2" />
                כניסה למנויים
              </button>

              <div className="relative group">
                <button className="border-2 border-blue-600 text-blue-600 bg-transparent px-6 py-2.5 rounded-lg font-medium hover:bg-blue-600 hover:text-white transition-all duration-200 flex items-center">
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

      <main className="container mx-auto px-4 py-8">
        {/* Back to Home Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            <ArrowRight className="w-5 h-5 ml-2" />
            חזרה לדף הבית
          </button>
        </div>
        {/* Institution Name Box */}
        <div className="mb-8">
          <div className="bg-orange-500 text-white p-8 rounded-2xl shadow-lg text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">{institutionName}</h1>
            <p className="text-xl opacity-90">בחרו מחלקה לצפייה בקורסים</p>
          </div>
        </div>

        {/* Department Buttons */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-4 justify-center">
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => handleDepartmentClick(department)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  selectedDepartment === department
                    ? 'bg-red-900 text-white shadow-lg transform scale-105'
                    : 'bg-red-800 text-white hover:bg-red-900 hover:shadow-md hover:scale-102'
                }`}
              >
                {department}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
            קורסים במחלקה: <span className="text-red-800">{selectedDepartment}</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {coursesByDepartment[selectedDepartment as keyof typeof coursesByDepartment]?.map((course, index) => {
              const IconComponent = course.icon;
              return (
                <Link
                  key={index}
                  to={`/course/${course.id}`}
                  className="bg-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-105 hover:bg-purple-700 block"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-white/20 rounded-full flex items-center justify-center">
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="text-lg font-semibold mb-2 leading-tight">
                      {course.name}
                    </h3>
                    
                    <p className="text-purple-200 text-sm font-medium">
                      קוד קורס: {course.code}
                    </p>
                    
                    <div className="mt-4 pt-4 border-t border-purple-400/30">
                      <span className="text-sm font-medium">לחץ לצפייה בקורס</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer - Same as homepage */}
      <footer className="bg-gray-100 border-t border-gray-200">
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
                    className="h-16 w-auto rounded-md"
                  />
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

export default InstitutionPage;