import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

type IconCategory = "electrical_engineering" | "digital_systems" | "computer_organization" | "computer_networks" | "electronics" | "semiconductors" | "signal_processing" | "mathematics" | "probability" | "stochastic_models" | "physics" | "mechanics" | "magnetism" | "general";

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  duration: string | null;
  icon_category: IconCategory | null;
  icon_url: string | null;
  price: number | null;
  institution: string | null;
  department: string | null;
  whatsapp_link: string | null;
  is_published: boolean | null;
  students_count: number | null;
  rating: number | null;
}

const iconCategories = [
  { value: "electrical_engineering", label: "הנדסת חשמל" },
  { value: "digital_systems", label: "מערכות דיגיטליות" },
  { value: "computer_organization", label: "ארגון מחשבים" },
  { value: "computer_networks", label: "רשתות מחשבים" },
  { value: "electronics", label: "אלקטרוניקה" },
  { value: "semiconductors", label: "מוליכים למחצה" },
  { value: "signal_processing", label: "עיבוד אותות" },
  { value: "mathematics", label: "מתמטיקה" },
  { value: "probability", label: "הסתברות" },
  { value: "stochastic_models", label: "מודלים סטוכסטיים" },
  { value: "physics", label: "פיזיקה" },
  { value: "mechanics", label: "מכניקה" },
  { value: "magnetism", label: "מגנטיות" },
  { value: "general", label: "כללי" }
] as const;

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    instructor: string;
    duration: string;
    icon_category: IconCategory;
    icon_url: string;
    price: string;
    institution: string;
    department: string;
    whatsapp_link: string;
    is_published: boolean;
  }>({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    icon_category: "general",
    icon_url: "",
    price: "",
    institution: "",
    department: "",
    whatsapp_link: "",
    is_published: false
  });

  // Fetch courses
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Course[];
    }
  });

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: async (courseData: typeof formData) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: courseData.title,
          description: courseData.description || null,
          instructor: courseData.instructor || null,
          duration: courseData.duration || null,
          icon_category: courseData.icon_category || 'general',
          icon_url: courseData.icon_url || null,
          price: courseData.price ? parseFloat(courseData.price) : null,
          institution: courseData.institution || null,
          department: courseData.department || null,
          whatsapp_link: courseData.whatsapp_link || null,
          is_published: courseData.is_published
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success("הקורס נוסף בהצלחה");
      resetForm();
      setIsCreating(false);
    },
    onError: (error) => {
      console.error('Error creating course:', error);
      toast.error("שגיאה ביצירת הקורס");
    }
  });

  // Update course mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, courseData }: { id: string; courseData: typeof formData }) => {
      const { data, error } = await supabase
        .from('courses')
        .update({
          title: courseData.title,
          description: courseData.description || null,
          instructor: courseData.instructor || null,
          duration: courseData.duration || null,
          icon_category: courseData.icon_category || 'general',
          icon_url: courseData.icon_url || null,
          price: courseData.price ? parseFloat(courseData.price) : null,
          institution: courseData.institution || null,
          department: courseData.department || null,
          whatsapp_link: courseData.whatsapp_link || null,
          is_published: courseData.is_published
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success("הקורס עודכן בהצלחה");
      resetForm();
      setEditingId(null);
    },
    onError: (error) => {
      console.error('Error updating course:', error);
      toast.error("שגיאה בעדכון הקורס");
    }
  });

  // Delete course mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      toast.success("הקורס נמחק בהצלחה");
    },
    onError: (error) => {
      console.error('Error deleting course:', error);
      toast.error("שגיאה במחיקת הקורס");
    }
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      icon_category: "general",
      icon_url: "",
      price: "",
      institution: "",
      department: "",
      whatsapp_link: "",
      is_published: false
    });
  };

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIcon(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('course-icons')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('course-icons')
        .getPublicUrl(filePath);

      setFormData({ ...formData, icon_url: publicUrl });
      toast.success("האייקון הועלה בהצלחה");
    } catch (error) {
      console.error('Error uploading icon:', error);
      toast.error("שגיאה בהעלאת האייקון");
    } finally {
      setUploadingIcon(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.instructor) {
      toast.error("נא למלא את כל השדות הנדרשים");
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, courseData: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description || "",
      instructor: course.instructor || "",
      duration: course.duration || "",
      icon_category: course.icon_category || "general",
      icon_url: course.icon_url || "",
      price: course.price?.toString() || "",
      institution: course.institution || "",
      department: course.department || "",
      whatsapp_link: course.whatsapp_link || "",
      is_published: course.is_published || false
    });
    setEditingId(course.id);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק את הקורס?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען קורסים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ממשק ניהול קורסים</h1>
            <p className="text-muted-foreground mt-2">נהל את הקורסים שלך בקלות</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {courses.length} קורסים
          </Badge>
        </div>

        {/* Add New Course Button */}
        {!isCreating && !editingId && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="mb-6"
            size="lg"
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף קורס חדש
          </Button>
        )}

        {/* Course Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "עריכת קורס" : "הוספת קורס חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">שם הקורס *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="הכנס שם קורס"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor">מרצה *</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                      placeholder="שם המרצה"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="institution">מוסד</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => setFormData({...formData, institution: e.target.value})}
                      placeholder="למשל: טכניון"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">מחלקה</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => setFormData({...formData, department: e.target.value})}
                      placeholder="למשל: מדעי המחשב"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">משך הקורס</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="למשל: 10 שעות"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">מחיר (₪)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="299"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon_category">קטגוריית אייקון</Label>
                    <Select 
                      value={formData.icon_category} 
                      onValueChange={(value) => setFormData({...formData, icon_category: value as IconCategory})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר קטגוריה" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {iconCategories.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon_upload">העלאת אייקון מותאם</Label>
                    <div className="flex gap-2">
                      <Input
                        id="icon_upload"
                        type="file"
                        accept="image/*"
                        onChange={handleIconUpload}
                        disabled={uploadingIcon}
                        className="flex-1"
                      />
                      {uploadingIcon && <span className="text-sm text-muted-foreground">מעלה...</span>}
                    </div>
                    {formData.icon_url && (
                      <div className="mt-2">
                        <img src={formData.icon_url} alt="Icon preview" className="w-16 h-16 object-cover rounded" />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_link">קישור וואטסאפ</Label>
                    <Input
                      id="whatsapp_link"
                      value={formData.whatsapp_link}
                      onChange={(e) => setFormData({...formData, whatsapp_link: e.target.value})}
                      placeholder="https://wa.me/..."
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Switch
                      id="is_published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({...formData, is_published: checked})}
                    />
                    <Label htmlFor="is_published">פרסם קורס</Label>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">תיאור הקורס *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="תאר את הקורס, מה הסטודנטים ילמדו..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                    <Save className="w-4 h-4 ml-2" />
                    {editingId ? "עדכן קורס" : "שמור קורס"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 ml-2" />
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">הקורסים שלי</h2>
          
          {courses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  עדיין לא נוספו קורסים
                </p>
                <p className="text-muted-foreground mt-2">
                  לחץ על "הוסף קורס חדש" כדי להתחיל
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  {course.icon_url && (
                    <div className="h-48 bg-muted overflow-hidden">
                      <img 
                        src={course.icon_url} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-lg">{course.title}</h3>
                        {course.is_published ? (
                          <Badge variant="default">מפורסם</Badge>
                        ) : (
                          <Badge variant="secondary">טיוטה</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>מרצה: {course.instructor}</span>
                      </div>
                      {course.institution && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>מוסד: {course.institution}</span>
                        </div>
                      )}
                      {course.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>משך: {course.duration}</span>
                        </div>
                      )}
                      {course.price && (
                        <div className="text-lg font-semibold text-primary">
                          ₪{course.price}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(course.id)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
