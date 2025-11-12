import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X, Search, Users as UsersIcon, Calendar, Upload } from "lucide-react";
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
  DialogFooter,
} from "@/components/ui/dialog";

interface CoursePermission {
  course_id: string;
  course_name: string;
  start_date: string;
  end_date: string;
}

interface Group {
  id: string;
  name: string;
  description: string | null;
  coupon_code: string | null;
  permissions: CoursePermission[];
  member_count: number;
  is_active: boolean;
  created_at: string;
}

const AdminGroupsPage = () => {
  const queryClient = useQueryClient();
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [nameFilter, setNameFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [membersFilter, setMembersFilter] = useState("");
  const [coursesFilter, setCoursesFilter] = useState("");
  const [showMembersDialog, setShowMembersDialog] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [newMembers, setNewMembers] = useState<string[]>([]);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    coupon_code: "",
    permissions: [] as CoursePermission[],
    is_active: true,
  });

  // Fetch groups
  const { data: groups = [], isLoading } = useQuery({
    queryKey: ['admin-groups'],
    queryFn: async () => {
      // Mock data for now - will be replaced with real Supabase query
      const mockGroups: Group[] = [
        {
          id: '1',
          name: 'קבוצת טכניון - מדעי המחשב 2024',
          description: 'קבוצה לסטודנטים של מדעי המחשב בטכניון',
          coupon_code: 'TECHNION2024',
          permissions: [
            {
              course_id: '1',
              course_name: 'פיזיקה 1',
              start_date: '2024-01-01',
              end_date: '2024-06-30'
            }
          ],
          member_count: 45,
          is_active: true,
          created_at: '2024-01-01'
        },
        {
          id: '2',
          name: 'קבוצת אוניברסיטה עברית - מתמטיקה',
          description: 'קורסי מתמטיקה לתואר ראשון',
          coupon_code: 'HUMATH2024',
          permissions: [
            {
              course_id: '2',
              course_name: 'חדו"א',
              start_date: '2024-02-01',
              end_date: '2024-07-31'
            },
            {
              course_id: '3',
              course_name: 'אלגברה לינארית',
              start_date: '2024-02-01',
              end_date: '2024-07-31'
            }
          ],
          member_count: 32,
          is_active: true,
          created_at: '2024-02-01'
        },
        {
          id: '3',
          name: 'קבוצת ניסיון - לא פעילה',
          description: null,
          coupon_code: null,
          permissions: [],
          member_count: 5,
          is_active: false,
          created_at: '2023-12-01'
        }
      ];
      
      return mockGroups;
    }
  });

  // Fetch available courses
  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses-list'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title, institution, department')
        .eq('is_published', true)
        .order('title');
      
      if (error) throw error;
      return data;
    }
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      coupon_code: "",
      permissions: [],
      is_active: true,
    });
    setIsCreating(false);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast.success(editingId ? 'הקבוצה עודכנה בהצלחה!' : 'הקבוצה נוספה בהצלחה!');
    resetForm();
  };

  const handleEdit = (group: Group) => {
    setFormData({
      name: group.name,
      description: group.description || "",
      coupon_code: group.coupon_code || "",
      permissions: group.permissions || [],
      is_active: group.is_active,
    });
    setEditingId(group.id);
    setIsCreating(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('האם אתה בטוח שברצונך למחוק קבוצה זו?')) {
      toast.success('הקבוצה נמחקה בהצלחה!');
    }
  };

  const handleAddPermission = () => {
    const newPermission: CoursePermission = {
      course_id: "",
      course_name: "",
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 6 months
    };
    setFormData({
      ...formData,
      permissions: [...formData.permissions, newPermission],
    });
  };

  const handleRemovePermission = (index: number) => {
    const updatedPermissions = formData.permissions.filter((_, i) => i !== index);
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handlePermissionChange = (index: number, field: keyof CoursePermission, value: string) => {
    const updatedPermissions = [...formData.permissions];
    updatedPermissions[index] = { ...updatedPermissions[index], [field]: value };
    
    // If course_id changes, update course_name
    if (field === 'course_id') {
      const course = courses.find(c => c.id === value);
      if (course) {
        updatedPermissions[index].course_name = course.title;
      }
    }
    
    setFormData({ ...formData, permissions: updatedPermissions });
  };

  const handleManageMembers = (group: Group) => {
    setSelectedGroup(group);
    setShowMembersDialog(true);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
      // Parse CSV and add members
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const emails = text.split('\n').map(line => line.trim()).filter(Boolean);
        setNewMembers(emails);
        toast.success(`נקראו ${emails.length} כתובות מייל מהקובץ`);
      };
      reader.readAsText(file);
    }
  };

  // Filter groups
  const filteredGroups = groups.filter((group) => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && group.is_active) ||
                         (statusFilter === "inactive" && !group.is_active);
    
    const matchesName = !nameFilter || group.name.toLowerCase().includes(nameFilter.toLowerCase());
    
    const startDate = group.permissions.length > 0 
      ? new Date(Math.min(...group.permissions.map(p => new Date(p.start_date).getTime())))
      : null;
    const matchesStartDate = !startDateFilter || (startDate && startDate.toLocaleDateString('he-IL').includes(startDateFilter));
    
    const endDate = group.permissions.length > 0
      ? new Date(Math.max(...group.permissions.map(p => new Date(p.end_date).getTime())))
      : null;
    const matchesEndDate = !endDateFilter || (endDate && endDate.toLocaleDateString('he-IL').includes(endDateFilter));
    
    const matchesMembers = !membersFilter || group.member_count.toString().includes(membersFilter);
    
    const matchesCourses = !coursesFilter || group.permissions.length.toString().includes(coursesFilter);
    
    return matchesSearch && matchesStatus && matchesName && matchesStartDate && matchesEndDate && matchesMembers && matchesCourses;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען קבוצות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">ניהול קבוצות</h1>

        {/* Group Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8 border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-xl">
                {editingId ? "עריכת קבוצה" : "הוספת קבוצה חדשה"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">שם הקבוצה *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="למשל: קבוצת טכניון 2024"
                      required
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="coupon">קוד קופון (אופציונלי)</Label>
                    <Input
                      id="coupon"
                      value={formData.coupon_code}
                      onChange={(e) => setFormData({ ...formData, coupon_code: e.target.value.toUpperCase() })}
                      placeholder="למשל: TECH2024"
                      className="text-right"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">תיאור (אופציונלי)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="תיאור כללי של הקבוצה..."
                    rows={3}
                    className="text-right resize-none"
                  />
                </div>

                {/* Permissions Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">הרשאות לקורסים</Label>
                    <Button 
                      type="button" 
                      onClick={handleAddPermission}
                      variant="outline"
                      size="sm"
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      הוסף קורס
                    </Button>
                  </div>

                  {formData.permissions.length === 0 ? (
                    <div className="text-center py-8 border-2 border-dashed rounded-lg border-muted-foreground/20">
                      <p className="text-muted-foreground">לא נוספו קורסים עדיין</p>
                      <p className="text-sm text-muted-foreground mt-1">לחץ על "הוסף קורס" להוספת הרשאה</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.permissions.map((permission, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2 md:col-span-3">
                              <Label>בחר קורס</Label>
                              <Select 
                                value={permission.course_id}
                                onValueChange={(value) => handlePermissionChange(index, 'course_id', value)}
                              >
                                <SelectTrigger className="text-right">
                                  <SelectValue placeholder="בחר קורס..." />
                                </SelectTrigger>
                                <SelectContent>
                                  {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id} className="text-right">
                                      {course.title} - {course.institution}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>תאריך התחלה</Label>
                              <Input
                                type="date"
                                value={permission.start_date}
                                onChange={(e) => handlePermissionChange(index, 'start_date', e.target.value)}
                                className="text-right"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>תאריך סיום</Label>
                              <Input
                                type="date"
                                value={permission.end_date}
                                onChange={(e) => handlePermissionChange(index, 'end_date', e.target.value)}
                                className="text-right"
                              />
                            </div>

                            <div className="flex items-end">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                onClick={() => handleRemovePermission(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    <Save className="w-4 h-4 ml-2" />
                    {editingId ? 'עדכן קבוצה' : 'צור קבוצה'}
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

        {/* Groups Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">קבוצות קיימות</CardTitle>
              {!isCreating && !editingId && (
                <Button 
                  onClick={() => setIsCreating(true)}
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-5 h-5 ml-2" />
                  הוסף קבוצה חדשה
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="חיפוש קבוצה..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
            </div>

            {/* Table */}
            {filteredGroups.length === 0 ? (
              <div className="text-center py-12">
                <UsersIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {groups.length === 0 ? 'עדיין לא נוספו קבוצות' : 'לא נמצאו תוצאות'}
                </p>
                {groups.length === 0 && (
                  <p className="text-muted-foreground mt-2">
                    לחץ על "הוסף קבוצה חדשה" כדי להתחיל
                  </p>
                )}
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="text-right font-bold">
                        <div className="space-y-2">
                          <div>שם</div>
                          <Input
                            placeholder="סנן לפי שם..."
                            value={nameFilter}
                            onChange={(e) => setNameFilter(e.target.value)}
                            className="h-8 text-sm text-right"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        <div className="space-y-2">
                          <div>תאריך התחלה</div>
                          <Input
                            placeholder="סנן תאריך..."
                            value={startDateFilter}
                            onChange={(e) => setStartDateFilter(e.target.value)}
                            className="h-8 text-sm text-right"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        <div className="space-y-2">
                          <div>תאריך סיום</div>
                          <Input
                            placeholder="סנן תאריך..."
                            value={endDateFilter}
                            onChange={(e) => setEndDateFilter(e.target.value)}
                            className="h-8 text-sm text-right"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        <div className="space-y-2">
                          <div>משתתפים</div>
                          <Input
                            placeholder="סנן מספר..."
                            value={membersFilter}
                            onChange={(e) => setMembersFilter(e.target.value)}
                            className="h-8 text-sm text-right"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        <div className="space-y-2">
                          <div>סטטוס</div>
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">הכל</SelectItem>
                              <SelectItem value="active">פעילות</SelectItem>
                              <SelectItem value="inactive">לא פעילות</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableHead>
                      <TableHead className="text-right font-bold">
                        <div className="space-y-2">
                          <div>מספר קורסים</div>
                          <Input
                            placeholder="סנן מספר..."
                            value={coursesFilter}
                            onChange={(e) => setCoursesFilter(e.target.value)}
                            className="h-8 text-sm text-right"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredGroups.map((group) => {
                      const startDate = group.permissions.length > 0 
                        ? new Date(Math.min(...group.permissions.map(p => new Date(p.start_date).getTime())))
                        : null;
                      const endDate = group.permissions.length > 0
                        ? new Date(Math.max(...group.permissions.map(p => new Date(p.end_date).getTime())))
                        : null;

                      return (
                        <TableRow key={group.id} className="hover:bg-muted/30">
                          <TableCell className="text-right font-medium">
                            {group.name}
                          </TableCell>
                          <TableCell className="text-right">
                            {startDate ? startDate.toLocaleDateString('he-IL') : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {endDate ? endDate.toLocaleDateString('he-IL') : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="outline">
                              {group.member_count} חברים
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            {group.is_active ? (
                              <Badge variant="default" className="bg-green-500">פעילה</Badge>
                            ) : (
                              <Badge variant="secondary">לא פעילה</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {group.permissions.length}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleManageMembers(group)}
                                title="ניהול חברים"
                              >
                                <UsersIcon className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleEdit(group)}
                                title="עריכה"
                              >
                                <Edit className="w-4 h-4 text-primary" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                onClick={() => handleDelete(group.id)}
                                title="מחיקה"
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Members Management Dialog */}
        <Dialog open={showMembersDialog} onOpenChange={setShowMembersDialog}>
          <DialogContent className="max-w-2xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-xl">
                ניהול חברי קבוצה: {selectedGroup?.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">שיוך משתמשים לקבוצה</h3>
                
                {/* Method 1: Manual Input */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">הוספה ידנית</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label>בחר משתמשים מהמערכת</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="בחר משתמש..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">יוסי כהן - yossi@example.com</SelectItem>
                          <SelectItem value="2">שרה לוי - sara@example.com</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Method 2: CSV Upload */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">העלאת קובץ CSV</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label>העלה קובץ עם כתובות מייל</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          type="file"
                          accept=".csv"
                          onChange={handleCsvUpload}
                          className="text-right"
                        />
                        <Button variant="outline" size="icon">
                          <Upload className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        הקובץ צריך להכיל כתובת מייל אחת בכל שורה
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Method 3: Coupon Code */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">רישום עם קוד קופון</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label>קוד הקופון של הקבוצה</Label>
                      <div className="flex items-center gap-3">
                        <Input
                          value={selectedGroup?.coupon_code || "לא הוגדר"}
                          readOnly
                          className="text-right font-mono"
                        />
                        <Button 
                          variant="outline"
                          onClick={() => {
                            if (selectedGroup?.coupon_code) {
                              navigator.clipboard.writeText(selectedGroup.coupon_code);
                              toast.success('הקוד הועתק ללוח');
                            }
                          }}
                        >
                          העתק
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        משתמשים יכולים להצטרף לקבוצה באמצעות קוד זה בעת ההרשמה
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <DialogFooter>
              <Button onClick={() => setShowMembersDialog(false)}>
                סגור
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminGroupsPage;






