import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X, Search, GraduationCap } from "lucide-react";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Institution {
  id: string;
  name: string;
  departments: string[];
  created_at: string;
}

const AdminInstitutionsPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDepartmentDialog, setShowDepartmentDialog] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [newDepartment, setNewDepartment] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    departments: [] as string[],
  });

  // Fetch institutions
  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Institution[];
    }
  });

  // Fetch courses count per institution
  const { data: coursesCount = {} } = useQuery({
    queryKey: ['courses-count-by-institution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('institution');
      
      if (error) throw error;
      
      const counts: Record<string, number> = {};
      data.forEach((course) => {
        if (course.institution) {
          counts[course.institution] = (counts[course.institution] || 0) + 1;
        }
      });
      
      return counts;
    }
  });

  // Create institution mutation
  const createMutation = useMutation({
    mutationFn: async (institutionData: typeof formData) => {
      const { data, error } = await supabase
        .from('institutions')
        .insert([institutionData])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('המוסד נוסף בהצלחה!');
      resetForm();
    },
    onError: (error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Update institution mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from('institutions')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('המוסד עודכן בהצלחה!');
      resetForm();
    },
    onError: (error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Delete institution mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('institutions')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions'] });
      toast.success('המוסד נמחק בהצלחה!');
    },
    onError: (error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({ name: "", departments: [] });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (institution: Institution) => {
    setFormData({
      name: institution.name,
      departments: institution.departments || [],
    });
    setEditingId(institution.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מוסד זה?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddDepartment = () => {
    if (newDepartment.trim()) {
      const updatedDepartments = [...formData.departments, newDepartment.trim()];
      setFormData({ ...formData, departments: updatedDepartments });
      setNewDepartment("");
    }
  };

  const handleRemoveDepartment = (index: number) => {
    const updatedDepartments = formData.departments.filter((_, i) => i !== index);
    setFormData({ ...formData, departments: updatedDepartments });
  };

  // Filter institutions
  const filteredInstitutions = institutions.filter((inst) =>
    inst.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען מוסדות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">ניהול מוסדות וחוגים</h1>

        {/* Institution Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">
                {editingId ? "עריכת מוסד" : "הוספת מוסד חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">שם המוסד *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="למשל: הטכניון - מכון טכנולוגי לישראל"
                    required
                    className="text-right"
                  />
                </div>

                {/* Departments Section */}
                <div className="space-y-3">
                  <Label>חוגים/מחלקות</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newDepartment}
                      onChange={(e) => setNewDepartment(e.target.value)}
                      placeholder="הוסף חוג חדש..."
                      className="text-right"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddDepartment();
                        }
                      }}
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddDepartment}
                      variant="outline"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {formData.departments.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {formData.departments.map((dept, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="px-3 py-1 text-sm"
                        >
                          {dept}
                          <button
                            type="button"
                            onClick={() => handleRemoveDepartment(index)}
                            className="mr-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="flex-1"
                  >
                    <Save className="w-4 h-4 ml-2" />
                    {editingId ? 'עדכן מוסד' : 'הוסף מוסד'}
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

        {/* Institutions Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">מוסדות קיימים</CardTitle>
              {!isCreating && !editingId && (
                <Button 
                  onClick={() => setIsCreating(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  הוסף מוסד חדש
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="חיפוש מוסד..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 text-right"
              />
            </div>

            {/* Table */}
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-12">
                <GraduationCap className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {institutions.length === 0 ? 'עדיין לא נוספו מוסדות' : 'לא נמצאו תוצאות'}
                </p>
                {institutions.length === 0 && (
                  <p className="text-muted-foreground mt-2">
                    לחץ על "הוסף מוסד חדש" כדי להתחיל
                  </p>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-bold">שם המוסד</TableHead>
                      <TableHead className="text-right font-bold">מספר חוגים</TableHead>
                      <TableHead className="text-right font-bold">מספר קורסים</TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInstitutions.map((institution) => (
                      <TableRow key={institution.id} className="hover:bg-muted/30">
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center gap-2 justify-end">
                            <span>{institution.name}</span>
                            <GraduationCap className="w-4 h-4 text-primary" />
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {institution.departments?.length || 0} חוגים
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {coursesCount[institution.name] || 0}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEdit(institution)}
                              title="עריכה"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleDelete(institution.id)}
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

export default AdminInstitutionsPage;
