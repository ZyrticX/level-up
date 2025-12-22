import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X, Search, GraduationCap, Building2, ChevronDown, ChevronUp, Landmark } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface Department {
  id: string;
  name: string;
  is_active: boolean;
}

interface Institution {
  id: string;
  name: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
  departments: Department[];
}

const AdminInstitutionsPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedInstitution, setExpandedInstitution] = useState<string | null>(null);
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [addingDepartmentTo, setAddingDepartmentTo] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
  });

  // Fetch institutions with departments
  const { data: institutions = [], isLoading } = useQuery({
    queryKey: ['institutions-with-departments'],
    queryFn: async () => {
      const { data: institutionsData, error: instError } = await supabase
        .from('institutions')
        .select('*')
        .order('name');
      
      if (instError) throw instError;

      const { data: departmentsData, error: deptError } = await supabase
        .from('departments')
        .select('*')
        .order('name');
      
      if (deptError) throw deptError;

      // Combine departments with institutions
      return (institutionsData || []).map(inst => ({
        ...inst,
        departments: (departmentsData || []).filter(dept => dept.institution_id === inst.id)
      })) as Institution[];
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
        .insert([{
          name: institutionData.name,
          is_active: true,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions-with-departments'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-institutions'] });
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
        .update({
          name: data.name,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions-with-departments'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-institutions'] });
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
      queryClient.invalidateQueries({ queryKey: ['institutions-with-departments'] });
      queryClient.invalidateQueries({ queryKey: ['homepage-institutions'] });
      toast.success('המוסד נמחק בהצלחה!');
    },
    onError: (error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Add department mutation
  const addDepartmentMutation = useMutation({
    mutationFn: async ({ institutionId, name }: { institutionId: string; name: string }) => {
      const { error } = await supabase
        .from('departments')
        .insert([{
          institution_id: institutionId,
          name: name,
          is_active: true,
        }]);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions-with-departments'] });
      toast.success('החוג נוסף בהצלחה!');
      setNewDepartmentName("");
      setAddingDepartmentTo(null);
    },
    onError: (error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Delete department mutation
  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('departments')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['institutions-with-departments'] });
      toast.success('החוג נמחק בהצלחה!');
    },
    onError: (error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  const resetForm = () => {
    setFormData({ name: "" });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('נא להזין שם מוסד');
      return;
    }
    
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (institution: Institution) => {
    setFormData({
      name: institution.name,
    });
    setEditingId(institution.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק מוסד זה? כל החוגים והקורסים המשויכים יושפעו.')) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddDepartment = (institutionId: string) => {
    if (newDepartmentName.trim()) {
      addDepartmentMutation.mutate({ institutionId, name: newDepartmentName.trim() });
    }
  };

  const handleDeleteDepartment = (deptId: string) => {
    if (confirm('האם אתה בטוח? מחיקת החוג תשפיע על כל הקורסים המשויכים אליו.')) {
      deleteDepartmentMutation.mutate(deptId);
    }
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

        {/* Institution Form - Simplified */}
        {(isCreating || editingId) && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">
                {editingId ? "עריכת מוסד" : "הוספת מוסד חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-end gap-4">
                  {/* Icon Preview */}
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                    <Landmark className="w-8 h-8 text-white" />
                  </div>
                  
                  {/* Name Input */}
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="name">שם המוסד *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="למשל: אוניברסיטת בר אילן"
                      required
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || updateMutation.isPending}
                  >
                    <Save className="w-4 h-4 ml-2" />
                    {editingId ? 'עדכן מוסד' : 'הוסף מוסד'}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                  >
                    <X className="w-4 h-4 ml-2" />
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Institutions List */}
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

            {/* Institutions */}
            {filteredInstitutions.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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
              <div className="space-y-4">
                {filteredInstitutions.map((institution) => (
                  <Collapsible
                    key={institution.id}
                    open={expandedInstitution === institution.id}
                    onOpenChange={() => setExpandedInstitution(
                      expandedInstitution === institution.id ? null : institution.id
                    )}
                  >
                    <div className="border rounded-lg overflow-hidden">
                      <CollapsibleTrigger asChild>
                        <div className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow">
                              <Landmark className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{institution.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {institution.departments.length} חוגים | {coursesCount[institution.name] || 0} קורסים
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.stopPropagation(); handleEdit(institution); }}
                              title="עריכה"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={(e) => { e.stopPropagation(); handleDelete(institution.id); }}
                              disabled={deleteMutation.isPending}
                              title="מחיקה"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                            {expandedInstitution === institution.id ? (
                              <ChevronUp className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <div className="p-4 border-t bg-background">
                          <h4 className="font-semibold mb-3">חוגים/מחלקות:</h4>
                          
                          {/* Add Department */}
                          <div className="flex gap-2 mb-4">
                            <Input
                              value={addingDepartmentTo === institution.id ? newDepartmentName : ""}
                              onChange={(e) => {
                                setAddingDepartmentTo(institution.id);
                                setNewDepartmentName(e.target.value);
                              }}
                              placeholder="הוסף חוג חדש..."
                              className="text-right flex-1"
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddDepartment(institution.id);
                                }
                              }}
                            />
                            <Button 
                              onClick={() => handleAddDepartment(institution.id)}
                              disabled={addDepartmentMutation.isPending || !newDepartmentName.trim()}
                              variant="outline"
                            >
                              <Plus className="w-4 h-4 ml-1" />
                              הוסף
                            </Button>
                          </div>

                          {/* Departments List */}
                          {institution.departments.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                              אין חוגים עדיין. הוסף חוג חדש למעלה.
                            </p>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {institution.departments.map((dept) => (
                                <Badge 
                                  key={dept.id} 
                                  variant="secondary"
                                  className="px-3 py-1.5 text-sm flex items-center gap-2"
                                >
                                  {dept.name}
                                  <button
                                    onClick={() => handleDeleteDepartment(dept.id)}
                                    className="hover:text-destructive transition-colors"
                                    disabled={deleteDepartmentMutation.isPending}
                                    title="מחק חוג"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminInstitutionsPage;
