import { Button } from '@/components/ui/button';
import { Building, GraduationCap, Cpu, Church } from 'lucide-react';

const InstitutionsSection = () => {
  const institutions = [
    {
      id: 1,
      name: 'האוניברסיטה העברית',
      icon: Building,
      description: 'מוסד אקדמי מוביל',
    },
    {
      id: 2,
      name: 'המכללה האקדמית',
      icon: GraduationCap,
      description: 'מכללה אקדמית מובילה',
    },
    {
      id: 3,
      name: 'מכללת אפקה',
      icon: Cpu,
      description: 'מכללה להנדסה וטכנולוגיה [מעודכן]',
    },
    {
      id: 4,
      name: 'בית המדרש העליון',
      icon: Church,
      description: 'מוסד לימודי מסורתי',
    },
    {
      id: 5,
      name: 'המכללה למדעים',
      icon: Building,
      description: 'מכללה למדעים מדויקים',
    },
    {
      id: 6,
      name: 'האקדמיה לאמנויות',
      icon: GraduationCap,
      description: 'אקדמיה לאמנויות יפות',
    },
  ];

  const handleInstitutionClick = (institutionName: string) => {
    console.log(`Clicked on institution: ${institutionName}`);
    // Here you would typically navigate to the institution's page
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4" dir="rtl">
        <div className="max-w-6xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gradient mb-6">
              בחרו מוסד לימודים
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              בחרו את המוסד שלכם ומצאו תוכן מותאם במיוחד לתכנית הלימודים
            </p>
          </div>

          {/* Institutions Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {institutions.map((institution) => {
              const IconComponent = institution.icon;
              return (
                <div
                  key={institution.id}
                  className="card-institution group"
                  onClick={() => handleInstitutionClick(institution.name)}
                >
                  <div className="text-center">
                    <div className="relative mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
                        <IconComponent className="w-10 h-10 text-primary-foreground" />
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors duration-200">
                      {institution.name}
                    </h3>
                    
                    <p className="text-muted-foreground mb-6">
                      {institution.description}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="btn-outline-academic w-full group-hover:bg-primary group-hover:text-primary-foreground"
                    >
                      צפיה בקורסים
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-16">
            <p className="text-lg text-muted-foreground mb-6">
              לא מוצא את המוסד שלך? נשמח לעזור!
            </p>
            <Button variant="outline" className="btn-outline-academic">
              פנה אלינו
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InstitutionsSection;