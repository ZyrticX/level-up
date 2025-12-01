import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings, Save, X, Info } from "lucide-react";

// רשימת כל האייקונים הזמינים בתיקיית Icons
const availableIcons = [
  { name: "computer-network", label: "רשתות מחשבים", path: "/icons/computer-network.svg" },
  { name: "digital-systems", label: "מערכות ספרתיות", path: "/icons/digital-systems.svg" },
  { name: "electricity-magnetism", label: "חשמל ומגנטיות", path: "/icons/electricity-magnetism.svg" },
  { name: "electronic-circuit", label: "מעגלים חשמליים", path: "/icons/electronic-circuit.svg" },
  { name: "electronics", label: "אלקטרוניקה", path: "/icons/electronics.svg" },
  { name: "general", label: "כללי", path: "/icons/general.svg" },
  { name: "math", label: "מתמטיקה", path: "/icons/math.svg" },
  { name: "mechanics", label: "מכניקה", path: "/icons/mechanics.svg" },
  { name: "probability", label: "הסתברות", path: "/icons/probability.svg" },
  { name: "processor", label: "מעבד / ארגון המחשב", path: "/icons/processor.svg" },
  { name: "semiconductors", label: "מוליכים למחצה", path: "/icons/semiconductors.svg" },
  { name: "signal-proccesing", label: "עיבוד אותות", path: "/icons/signal-proccesing.svg" },
  { name: "Stochastic-proccess", label: "תהליכים סטוכסטיים", path: "/icons/Stochastic-proccess.svg" },
];

interface SubjectIcon {
  id: string;
  category_key: string;
  category_label: string;
  icon_type: 'lucide' | 'custom';
  lucide_icon_name: string | null;
  custom_icon_url: string | null;
  created_at: string;
  updated_at: string;
}

const AdminSubjectsPage = () => {
  const queryClient = useQueryClient();
  const [editingSubject, setEditingSubject] = useState<SubjectIcon | null>(null);
  const [selectedIconUrl, setSelectedIconUrl] = useState<string>("");
  const [newLabel, setNewLabel] = useState<string>("");

  // שליפת כל הנושאים
  const { data: subjects, isLoading, error } = useQuery({
    queryKey: ['subject-icons'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subject_icons')
        .select('*')
        .order('category_label');
      
      if (error) throw error;
      return data as SubjectIcon[];
    }
  });

  // עדכון נושא
  const updateMutation = useMutation({
    mutationFn: async ({ id, custom_icon_url, category_label }: { 
      id: string; 
      custom_icon_url: string;
      category_label: string;
    }) => {
      const { error } = await supabase
        .from('subject_icons')
        .update({ 
          custom_icon_url,
          icon_type: 'custom',
          lucide_icon_name: null,
          category_label,
          updated_at: new Date().toISOString() 
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subject-icons'] });
      toast.success('האייקון עודכן בהצלחה!');
      setEditingSubject(null);
      setSelectedIconUrl("");
      setNewLabel("");
    },
    onError: (error) => {
      toast.error('שגיאה בעדכון האייקון');
      console.error(error);
    }
  });

  const handleEdit = (subject: SubjectIcon) => {
    setEditingSubject(subject);
    setSelectedIconUrl(subject.custom_icon_url || "/icons/general.svg");
    setNewLabel(subject.category_label);
  };

  const handleSave = () => {
    if (!editingSubject || !selectedIconUrl) return;
    
    updateMutation.mutate({
      id: editingSubject.id,
      custom_icon_url: selectedIconUrl,
      category_label: newLabel || editingSubject.category_label
    });
  };

  const handleCancel = () => {
    setEditingSubject(null);
    setSelectedIconUrl("");
    setNewLabel("");
  };

  const getIconUrl = (subject: SubjectIcon): string => {
    return subject.custom_icon_url || "/icons/general.svg";
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center" dir="rtl">
        <div className="text-muted-foreground">טוען נושאים...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8" dir="rtl">
        <div className="text-destructive">שגיאה בטעינת הנושאים</div>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">ניהול אייקונים לנושאים</h1>
        <p className="text-muted-foreground">
          בחר אייקון לכל נושא/מקצוע. האייקונים יוצגו בכרטיסי הקורסים ובממשקים השונים.
        </p>
      </div>

      {/* דיאלוג עריכה */}
      {editingSubject && (
        <Card className="mb-8 border-primary border-2 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              עריכת נושא: {editingSubject.category_label}
            </CardTitle>
            <CardDescription>
              בחר אייקון חדש עבור הנושא
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* תצוגה מקדימה */}
            <div className="flex items-center gap-4 p-4 bg-background rounded-lg border">
              <div className="w-20 h-20 bg-primary/10 rounded-xl flex items-center justify-center p-3">
                <img 
                  src={selectedIconUrl} 
                  alt="תצוגה מקדימה"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="text-lg font-semibold">{newLabel || editingSubject.category_label}</div>
                <div className="text-sm text-muted-foreground">תצוגה מקדימה</div>
              </div>
            </div>

            {/* שם התווית */}
            <div className="space-y-2">
              <Label htmlFor="label">שם הנושא (בעברית)</Label>
              <Input
                id="label"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="הזן שם לנושא"
              />
            </div>

            {/* בחירת אייקון */}
            <div className="space-y-2">
              <Label>בחר אייקון</Label>
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-3 p-4 border rounded-lg bg-background">
                {availableIcons.map((item) => {
                  const isSelected = selectedIconUrl === item.path;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setSelectedIconUrl(item.path)}
                      className={`p-3 rounded-xl border-2 transition-all hover:bg-accent flex flex-col items-center gap-2 ${
                        isSelected 
                          ? 'border-primary bg-primary/10 shadow-md' 
                          : 'border-transparent hover:border-muted'
                      }`}
                      title={item.label}
                    >
                      <div className="w-12 h-12">
                        <img 
                          src={item.path} 
                          alt={item.label}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs text-center text-muted-foreground line-clamp-2">
                        {item.label}
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-muted-foreground">
                נבחר: {availableIcons.find(i => i.path === selectedIconUrl)?.label || "לא נבחר"}
              </p>
            </div>

            {/* כפתורי פעולה */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 ml-2" />
                ביטול
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={updateMutation.isPending}
              >
                <Save className="w-4 h-4 ml-2" />
                {updateMutation.isPending ? 'שומר...' : 'שמור שינויים'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* רשימת הנושאים */}
      <Card>
        <CardHeader>
          <CardTitle>כל הנושאים</CardTitle>
          <CardDescription>
            לחץ על "ערוך" כדי לשנות את האייקון של הנושא
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {subjects?.map((subject) => {
              const iconUrl = getIconUrl(subject);
              return (
                <div
                  key={subject.id}
                  className={`p-4 border rounded-xl transition-all hover:shadow-md ${
                    editingSubject?.id === subject.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center p-2 shrink-0">
                      <img 
                        src={iconUrl} 
                        alt={subject.category_label}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-foreground truncate">
                        {subject.category_label}
                      </div>
                      <div className="text-sm text-muted-foreground truncate">
                        {subject.custom_icon_url?.split('/').pop() || 'general.svg'}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEdit(subject)}
                      disabled={editingSubject !== null}
                    >
                      ערוך
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* הסבר */}
      <Card className="mt-6 bg-muted/30">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
            <div>
              <h4 className="font-semibold mb-1">איך זה עובד?</h4>
              <p className="text-sm text-muted-foreground">
                האייקונים שתבחר כאן יוצגו בכל מקום שבו מופיע הנושא במערכת - 
                בכרטיסי הקורסים, בעמוד הקורס, ובממשקי הניהול. 
                שינויים נשמרים אוטומטית ומתעדכנים מיד בכל המערכת.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSubjectsPage;
