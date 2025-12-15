import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X, Upload, Search, Video } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { courseIconLabels, CourseIconCategory } from "@/lib/courseIcons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Course {
  id: string;
  title: string;
  description: string | null;
  instructor: string | null;
  duration: string | null;
  icon_category: CourseIconCategory | null;
  icon_url: string | null;
  price: number | null;
  institution: string | null;
  department: string | null;
  whatsapp_link: string | null;
  is_published: boolean | null;
  students_count: number | null;
  rating: number | null;
}

const AdminPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingIcon, setUploadingIcon] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    icon_category: CourseIconCategory;
    icon_url: string;
    price: string;
    institution: string;
    department: string;
    whatsapp_link: string;
    is_published: boolean;
  }>({
    title: "",
    description: "",
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

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesInstitution = institutionFilter === "all" || course.institution === institutionFilter;
    const matchesDepartment = departmentFilter === "all" || course.department === departmentFilter;
    
    return matchesSearch && matchesInstitution && matchesDepartment;
  });

  // Get unique institutions and departments for filters
  const uniqueInstitutions = Array.from(new Set(courses.map(c => c.institution).filter(Boolean)));
  const uniqueDepartments = Array.from(new Set(courses.map(c => c.department).filter(Boolean)));

  // Fetch institutions from database
  const { data: institutions = [] } = useQuery({
    queryKey: ['institutions-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as { id: string; name: string }[];
    }
  });

  // Fetch departments from database
  const { data: allDepartmentsData = [] } = useQuery({
    queryKey: ['departments-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, institution_id')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as { id: string; name: string; institution_id: string }[];
    }
  });

  // Get departments for selected institution
  const getDepartmentsForInstitution = (institutionName: string) => {
    const institution = institutions.find(i => i.name === institutionName);
    if (!institution) return [];
    return allDepartmentsData.filter(d => d.institution_id === institution.id);
  };

  // Get all unique department names
  const allDepartments = Array.from(new Set(allDepartmentsData.map(d => d.name)));

  // Create course mutation
  const createMutation = useMutation({
    mutationFn: async (courseData: typeof formData) => {
      const { data, error } = await supabase
        .from('courses')
        .insert([{
          title: courseData.title,
          description: courseData.description || null,
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
    
    if (!formData.title || !formData.description) {
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
      icon_category: (course.icon_category as CourseIconCategory) || "general",
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
        <h1 className="text-3xl font-bold text-foreground mb-6">ממשק ניהול קורסים</h1>

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
                    <Label htmlFor="institution">מוסד</Label>
                    <Select 
                      value={formData.institution} 
                      onValueChange={(value) => {
                        setFormData({...formData, institution: value, department: ""});
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר מוסד" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutions.map((inst) => (
                          <SelectItem key={inst.name} value={inst.name}>
                            {inst.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department">מחלקה</Label>
                    <Select 
                      value={formData.department} 
                      onValueChange={(value) => setFormData({...formData, department: value})}
                      disabled={!formData.institution}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.institution ? "בחר מחלקה" : "בחר תחילה מוסד"} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.institution && getDepartmentsForInstitution(formData.institution).map((dept) => (
                          <SelectItem key={dept.id} value={dept.name}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                    <Label htmlFor="icon_category">אייקון</Label>
                    <Select 
                      value={formData.icon_category} 
                      onValueChange={(value) => setFormData({...formData, icon_category: value as CourseIconCategory})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר אייקון" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(courseIconLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="icon_upload">העלאת אייקון מותאם (אופציונלי)</Label>
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
                  
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant={formData.is_published ? "default" : "outline"}
                      onClick={() => setFormData({...formData, is_published: !formData.is_published})}
                      className="w-full"
                    >
                      {formData.is_published ? "✓ קורס מפורסם" : "פרסם קורס"}
                    </Button>
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

        {/* Courses Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">ניהול קורסים</CardTitle>
              {!isCreating && !editingId && (
                <Button 
                  onClick={() => setIsCreating(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  הוספת קורס חדש
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Search and Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="חיפוש קורס..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="סנן לפי מוסד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המוסדות</SelectItem>
                  {uniqueInstitutions.filter(inst => inst && inst.trim() !== '').map((inst) => (
                    <SelectItem key={inst} value={inst}>{inst}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="סנן לפי חוג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל החוגים</SelectItem>
                  {uniqueDepartments.filter(dept => dept && dept.trim() !== '').map((dept) => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {courses.length === 0 ? 'עדיין לא נוספו קורסים' : 'לא נמצאו תוצאות'}
                </p>
                {courses.length === 0 && (
                  <p className="text-muted-foreground mt-2">
                    לחץ על "הוספת קורס חדש" כדי להתחיל
                  </p>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-bold">מוסד</TableHead>
                      <TableHead className="text-right font-bold">חוג</TableHead>
                      <TableHead className="text-right font-bold">שם הקורס</TableHead>
                      <TableHead className="text-right font-bold">מספר סרטונים</TableHead>
                      <TableHead className="text-right font-bold">סטטוס</TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCourses.map((course) => (
                      <TableRow key={course.id} className="hover:bg-muted/30">
                        <TableCell className="text-right">
                          {course.institution || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {course.department || '-'}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {course.title}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Video className="w-4 h-4 text-primary" />
                            <span>0</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {course.is_published ? (
                            <Badge variant="default" className="bg-green-500">מפורסם</Badge>
                          ) : (
                            <Badge variant="secondary">טיוטה</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(course)}
                              title="עריכה"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(course.id)}
                              disabled={deleteMutation.isPending}
                              title="מחיקה"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
