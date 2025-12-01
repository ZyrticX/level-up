import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X, Search, UserPlus, Mail, User, Download } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface Student {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  institution: string | null;
  department: string | null;
  created_at: string;
  last_sign_in_at: string | null;
}

interface Institution {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  institution_id: string;
}

const AdminStudentsPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [institutionFilter, setInstitutionFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "123456",
    phone: "",
    institution: "",
    department: "",
  });

  // Fetch students
  const { data: students = [], isLoading } = useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Student[];
    }
  });

  // Fetch institutions from database
  const { data: institutionsData = [] } = useQuery({
    queryKey: ['institutions-for-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Institution[];
    }
  });

  // Fetch departments from database
  const { data: departmentsData = [] } = useQuery({
    queryKey: ['departments-for-students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, institution_id')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as Department[];
    }
  });

  // Get departments for selected institution
  const getDepartmentsForInstitution = (institutionName: string) => {
    const institution = institutionsData.find(i => i.name === institutionName);
    if (!institution) return [];
    return departmentsData.filter(d => d.institution_id === institution.id);
  };

  // Create student mutation
  const createMutation = useMutation({
    mutationFn: async (studentData: typeof formData) => {
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentData.email,
        password: studentData.password,
        options: {
          data: {
            first_name: studentData.first_name,
            last_name: studentData.last_name,
            phone: studentData.phone || null,
            institution: studentData.institution || null,
            department: studentData.department || null,
          },
          emailRedirectTo: `${window.location.origin}/`,
        }
      });
      
      if (authError) throw authError;

      // Send welcome email (handled by Supabase automatically)
      return authData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast.success('המשתמש נוסף בהצלחה! נשלח מייל אוטומטי עם פרטי ההתחברות.');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Update student mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Student> }) => {
      const { error } = await supabase
        .from('profiles')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast.success('המשתמש עודכן בהצלחה!');
      resetForm();
    },
    onError: (error: any) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Delete student mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      // First delete profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);
      
      if (profileError) throw profileError;

      // Then delete auth user (requires admin privileges)
      // Note: This should be done via Edge Function for security
      toast.info('לתשומת ליבך: מחיקת משתמש מוחלטת דורשת הרשאות מנהל');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-students'] });
      toast.success('המשתמש נמחק בהצלחה!');
    },
    onError: (error: any) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({
      first_name: "",
      last_name: "",
      email: "",
      password: "123456",
      phone: "",
      institution: "",
      department: "",
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      const { password, ...updateData } = formData;
      updateMutation.mutate({ id: editingId, data: updateData as Partial<Student> });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (student: Student) => {
    setFormData({
      first_name: student.first_name,
      last_name: student.last_name,
      email: student.email,
      password: "123456",
      phone: student.phone || "",
      institution: student.institution || "",
      department: student.department || "",
    });
    setEditingId(student.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק משתמש זה?')) {
      deleteMutation.mutate(id);
    }
  };

  // Filter students
  const filteredStudents = students.filter((student) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      student.first_name?.toLowerCase().includes(searchLower) ||
      student.last_name?.toLowerCase().includes(searchLower) ||
      student.email?.toLowerCase().includes(searchLower) ||
      student.phone?.toLowerCase().includes(searchLower);
    const matchesInstitution = institutionFilter === "all" || student.institution === institutionFilter;
    const matchesDepartment = departmentFilter === "all" || student.department === departmentFilter;
    
    return matchesSearch && matchesInstitution && matchesDepartment;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['שם פרטי', 'שם משפחה', 'מייל', 'טלפון', 'מוסד', 'חוג', 'תאריך רישום', 'התחברות אחרונה'];
    const rows = filteredStudents.map(student => [
      student.first_name || '',
      student.last_name || '',
      student.email || '',
      student.phone || '',
      student.institution || '',
      student.department || '',
      new Date(student.created_at).toLocaleDateString('he-IL'),
      student.last_sign_in_at ? new Date(student.last_sign_in_at).toLocaleDateString('he-IL') : ''
    ]);

    // Create CSV content with BOM for Hebrew support
    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `משתמשים_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('הקובץ יוצא בהצלחה!');
  };

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setIsViewDialogOpen(true);
  };

  // Get unique institutions and departments for filters
  const uniqueInstitutions = Array.from(new Set(students.map(s => s.institution).filter(Boolean)));
  const uniqueDepartments = Array.from(new Set(students.map(s => s.department).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען משתמשים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">ניהול משתמשים</h1>

        {/* Student Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">
                {editingId ? "עריכת משתמש" : "הוספת משתמש חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">שם פרטי *</Label>
                    <Input
                      id="first_name"
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="שם פרטי"
                      required
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="last_name">שם משפחה *</Label>
                    <Input
                      id="last_name"
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="שם משפחה"
                      required
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">מייל *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="email@example.com"
                      required
                      disabled={!!editingId}
                      className="text-right"
                    />
                  </div>

                  {!editingId && (
                    <div className="space-y-2">
                      <Label htmlFor="password">סיסמה</Label>
                      <Input
                        id="password"
                        type="text"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        placeholder="123456"
                        className="text-right"
                      />
                      <p className="text-xs text-muted-foreground">
                        ברירת מחדל: 123456 (המשתמש יקבל מייל עם פרטי ההתחברות)
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="phone">טלפון</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="05X-XXXXXXX"
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="institution">מוסד לימודים</Label>
                    <Select 
                      value={formData.institution} 
                      onValueChange={(value) => setFormData({ ...formData, institution: value, department: "" })}
                    >
                      <SelectTrigger id="institution" className="text-right">
                        <SelectValue placeholder="בחר מוסד" />
                      </SelectTrigger>
                      <SelectContent>
                        {institutionsData.map((inst) => (
                          <SelectItem key={inst.id} value={inst.name} className="text-right">
                            {inst.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.institution && getDepartmentsForInstitution(formData.institution).length > 0 && (
                    <div className="space-y-2">
                      <Label htmlFor="department">חוג לימודים</Label>
                      <Select 
                        value={formData.department} 
                        onValueChange={(value) => setFormData({ ...formData, department: value })}
                      >
                        <SelectTrigger id="department" className="text-right">
                          <SelectValue placeholder="בחר חוג" />
                        </SelectTrigger>
                        <SelectContent>
                          {getDepartmentsForInstitution(formData.institution).map((dept) => (
                            <SelectItem key={dept.id} value={dept.name} className="text-right">
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>

                {!editingId && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-semibold text-blue-900">מייל אוטומטי</p>
                        <p className="text-sm text-blue-700">
                          לאחר יצירת המשתמש, ישלח אליו מייל אוטומטי עם פרטי ההתחברות והנחיות שימוש במערכת.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    {editingId ? 'עדכן משתמש' : 'צור משתמש'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="flex-1"
                  >
                    <X className="w-4 h-4 ml-2" />
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Students Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">משתמשים קיימים</CardTitle>
              {!isCreating && !editingId && (
                <Button 
                  onClick={() => setIsCreating(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  הוסף משתמש חדש
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
                  placeholder="חיפוש לפי שם, מייל או טלפון..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              
              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="md:w-auto"
              >
                <Download className="w-4 h-4 ml-2" />
                ייצא ל-CSV
              </Button>
              
              <Select value={institutionFilter} onValueChange={setInstitutionFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="סנן לפי מוסד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל המוסדות</SelectItem>
                  {uniqueInstitutions.map((inst) => (
                    <SelectItem key={inst} value={inst || ""}>{inst}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="סנן לפי חוג" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל החוגים</SelectItem>
                  {uniqueDepartments.map((dept) => (
                    <SelectItem key={dept} value={dept || ""}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            {filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {students.length === 0 ? 'עדיין לא נוספו משתמשים' : 'לא נמצאו תוצאות'}
                </p>
                {students.length === 0 && (
                  <p className="text-muted-foreground mt-2">
                    לחץ על "הוסף משתמש חדש" כדי להתחיל
                  </p>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-bold">שם פרטי</TableHead>
                      <TableHead className="text-right font-bold">שם משפחה</TableHead>
                      <TableHead className="text-right font-bold">מייל</TableHead>
                      <TableHead className="text-right font-bold">טלפון</TableHead>
                      <TableHead className="text-right font-bold">מוסד</TableHead>
                      <TableHead className="text-right font-bold">חוג</TableHead>
                      <TableHead className="text-right font-bold">תאריך רישום</TableHead>
                      <TableHead className="text-right font-bold">התחברות אחרונה</TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-muted/30">
                        <TableCell className="text-right">
                          {student.first_name}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.last_name}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.email}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.phone || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.institution || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.department || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(student.created_at).toLocaleDateString('he-IL')}
                        </TableCell>
                        <TableCell className="text-right">
                          {student.last_sign_in_at 
                            ? new Date(student.last_sign_in_at).toLocaleDateString('he-IL', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                            : '-'
                          }
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleViewStudent(student)}
                              title="צפה בכרטיס משתמש"
                            >
                              <User className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(student)}
                              title="עריכה"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(student.id)}
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

        {/* Student View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle>כרטיס משתמש</DialogTitle>
              <DialogDescription>
                פרטים מלאים של המשתמש
              </DialogDescription>
            </DialogHeader>
            {selectedStudent && (
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-muted-foreground">שם פרטי</Label>
                    <p className="text-lg font-semibold">{selectedStudent.first_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">שם משפחה</Label>
                    <p className="text-lg font-semibold">{selectedStudent.last_name}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">מייל</Label>
                    <p className="text-lg">{selectedStudent.email}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">טלפון</Label>
                    <p className="text-lg">{selectedStudent.phone || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">מוסד</Label>
                    <p className="text-lg">{selectedStudent.institution || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">חוג</Label>
                    <p className="text-lg">{selectedStudent.department || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">תאריך רישום</Label>
                    <p className="text-lg">{new Date(selectedStudent.created_at).toLocaleDateString('he-IL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">התחברות אחרונה</Label>
                    <p className="text-lg">
                      {selectedStudent.last_sign_in_at 
                        ? new Date(selectedStudent.last_sign_in_at).toLocaleDateString('he-IL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })
                        : 'מעולם לא התחבר'
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 pt-4 border-t">
                  <Button
                    onClick={() => {
                      setIsViewDialogOpen(false);
                      handleEdit(selectedStudent);
                    }}
                    className="flex-1"
                  >
                    <Edit className="w-4 h-4 ml-2" />
                    ערוך משתמש
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setIsViewDialogOpen(false)}
                    className="flex-1"
                  >
                    סגור
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminStudentsPage;
