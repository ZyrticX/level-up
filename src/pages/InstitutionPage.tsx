import { useParams, Link } from 'react-router-dom';
import { BookOpen, Cpu, Zap, Calculator, Atom, FlaskConical, Dna, Building, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Footer from '@/components/Footer';

const InstitutionPage = () => {
  const { institutionId } = useParams();

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
      { name: "מבוא למדעי המחשב", icon: Cpu, code: "CS101", id: "intro-cs", duration: "12:30" },
      { name: "מבני נתונים ואלגוריתמים", icon: BookOpen, code: "CS102", id: "data-structures", duration: "15:45" },
      { name: "תכנות מתקדם", icon: Cpu, code: "CS201", id: "advanced-programming", duration: "18:20" },
      { name: "בסיסי נתונים", icon: BookOpen, code: "CS301", id: "databases", duration: "14:10" }
    ],
    "הנדסת חשמל": [
      { name: "מעגלים חשמליים", icon: Zap, code: "EE101", id: "circuits", duration: "16:00" },
      { name: "אלקטרוניקה דיגיטלית", icon: Cpu, code: "EE201", id: "digital-electronics", duration: "13:30" },
      { name: "עיבוד אותות", icon: Zap, code: "EE301", id: "signal-processing", duration: "17:15" },
      { name: "מערכות בקרה", icon: Zap, code: "EE401", id: "control-systems", duration: "14:45" }
    ],
    "הנדסת תעשייה וניהול": [
      { name: "חקר ביצועים", icon: Calculator, code: "IE101", id: "operations-research", duration: "11:20" },
      { name: "ניהול פרויקטים", icon: BookOpen, code: "IE201", id: "project-management", duration: "10:30" },
      { name: "כלכלה הנדסית", icon: Calculator, code: "IE301", id: "engineering-economics", duration: "09:45" },
      { name: "בקרת איכות", icon: Calculator, code: "IE401", id: "quality-control", duration: "12:00" }
    ],
    "מתמטיקה": [
      { name: "חשבון דיפרנציאלי ואינטגרלי", icon: Calculator, code: "MATH101", id: "calculus", duration: "20:30" },
      { name: "אלגברה לינארית", icon: Calculator, code: "MATH201", id: "linear-algebra", duration: "18:15" },
      { name: "משוואות דיפרנציאליות", icon: Calculator, code: "MATH301", id: "differential-equations", duration: "16:40" },
      { name: "חשבון הסתברויות", icon: Calculator, code: "MATH401", id: "probability", duration: "14:25" }
    ],
    "פיזיקה": [
      { name: "פיזיקה 1 - מכניקה קלאסית", icon: Atom, code: "PHYS101", id: "physics-101", duration: "22:10" },
      { name: "אלקטרומגנטיות", icon: Atom, code: "PHYS201", id: "electromagnetics", duration: "19:30" },
      { name: "פיזיקה קוונטית", icon: Atom, code: "PHYS301", id: "quantum-physics", duration: "21:45" },
      { name: "תרמודינמיקה", icon: Atom, code: "PHYS401", id: "thermodynamics", duration: "15:55" }
    ],
    "כימיה": [
      { name: "כימיה כללית", icon: FlaskConical, code: "CHEM101", id: "general-chemistry", duration: "13:20" },
      { name: "כימיה אורגנית", icon: FlaskConical, code: "CHEM201", id: "organic-chemistry", duration: "17:50" },
      { name: "כימיה פיזיקלית", icon: FlaskConical, code: "CHEM301", id: "physical-chemistry", duration: "16:30" },
      { name: "כימיה אנליטית", icon: FlaskConical, code: "CHEM401", id: "analytical-chemistry", duration: "14:15" }
    ],
    "ביולוגיה": [
      { name: "ביולוגיה כללית", icon: Dna, code: "BIO101", id: "general-biology", duration: "12:40" },
      { name: "ביולוגיה מולקולרית", icon: Dna, code: "BIO201", id: "molecular-biology", duration: "15:20" },
      { name: "גנטיקה", icon: Dna, code: "BIO301", id: "genetics", duration: "18:00" },
      { name: "ביוכימיה", icon: Dna, code: "BIO401", id: "biochemistry", duration: "16:45" }
    ]
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="py-12">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Institution Header - Modern Design */}
          <div className="bg-gradient-to-br from-white via-primary/5 to-primary/10 border-2 border-primary/20 rounded-3xl p-10 mb-12 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                <Building className="w-12 h-12 text-white" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground">{institutionName}</h1>
              </div>
            </div>
          </div>

          {/* Department Tabs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground mb-6 text-right">מגמת לימודים</h2>
            
            <Tabs defaultValue={departments[0]} className="w-full" dir="rtl">
              <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                <TabsList className="flex flex-nowrap justify-start gap-2 h-auto bg-muted/50 p-3 rounded-xl mb-8 w-max min-w-full">
                  {departments.map((department) => (
                    <TabsTrigger
                      key={department}
                      value={department}
                      className="px-6 py-3 text-base font-medium data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg transition-all flex-shrink-0 whitespace-nowrap"
                    >
                      {department}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Courses for each department */}
              {departments.map((department) => (
                <TabsContent key={department} value={department} className="mt-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-16">
                    {coursesByDepartment[department as keyof typeof coursesByDepartment]?.map((course, index) => {
                      const IconComponent = course.icon;
                      return (
                        <Link
                          key={index}
                          to={`/course/${course.id}`}
                          className="bg-gradient-to-br from-white to-primary/5 border-2 border-border hover:border-primary/40 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group"
                        >
                          {/* Course Icon */}
                          <div className="flex justify-center mb-6">
                            <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl flex items-center justify-center group-hover:from-primary/20 group-hover:to-primary/10 transition-all shadow-sm group-hover:shadow-md">
                              <IconComponent className="w-12 h-12 text-primary" />
                            </div>
                          </div>

                          {/* Course Name */}
                          <h3 className="text-lg font-bold text-foreground text-right mb-2 min-h-[3rem] leading-tight">
                            {course.name}
                          </h3>

                          {/* Course Code */}
                          <p className="text-sm text-muted-foreground text-right mb-4">
                            קוד קורס: {course.code}
                          </p>

                          {/* Duration */}
                          <div className="flex items-center justify-start gap-2 pt-3 border-t border-primary/20">
                            <Clock className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-foreground">
                              {course.duration} שעות
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default InstitutionPage;