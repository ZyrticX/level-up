import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { BookOpen, GraduationCap, Cpu, Zap, Calculator, Atom, FlaskConical, Dna, ArrowRight } from 'lucide-react';

import Footer from '@/components/Footer';

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
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="section-standard">
        <div className="container-standard space-elements">
          {/* Back to Home Button */}
          <div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-primary hover:text-primary/80 transition-colors duration-200 text-nav"
            >
              <ArrowRight className="w-5 h-5 ml-2" />
              חזרה לדף הבית
            </button>
          </div>
          
          {/* Institution Name Box */}
          <div className="bg-primary text-white rounded-xl p-8 text-center space-elements">
            <h1 className="text-h1 text-white text-right">{institutionName}</h1>
            <p className="text-paragraph text-white/90 text-right">בחרו מחלקה לצפייה בקורסים</p>
          </div>

          {/* Department Buttons */}
          <div className="flex flex-wrap gap-6 justify-center">
            {departments.map((department) => (
              <button
                key={department}
                onClick={() => handleDepartmentClick(department)}
                className={`transition-all duration-300 ${
                  selectedDepartment === department
                    ? 'btn-primary'
                    : 'btn-secondary hover:scale-105'
                }`}
              >
                {department}
              </button>
            ))}
          </div>

          {/* Courses Section */}
          <div className="space-elements">
            <h2 className="text-h2 text-foreground text-right">
              קורסים במחלקה: <span className="text-primary">{selectedDepartment}</span>
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {coursesByDepartment[selectedDepartment as keyof typeof coursesByDepartment]?.map((course, index) => {
                const IconComponent = course.icon;
                return (
                  <Link
                    key={index}
                    to={`/course/${course.id}`}
                    className="card-course"
                  >
                    <div className="text-center space-elements">
                      <div className="w-16 h-16 mx-auto bg-primary/10 rounded-lg flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-primary" />
                      </div>
                      
                      <h3 className="text-h3 text-foreground text-right leading-tight">
                        {course.name}
                      </h3>
                      
                      <p className="text-nav text-muted-foreground text-right">
                        קוד קורס: {course.code}
                      </p>
                      
                      <div className="pt-4 border-t border-border">
                        <span className="text-nav font-medium text-primary">לחץ לצפייה בקורס</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstitutionPage;