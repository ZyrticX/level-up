import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Search, Pencil, Trash2, UserPlus } from 'lucide-react';
import { z } from 'zod';

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  institution: string | null;
  department: string | null;
  created_at: string;
}

const profileSchema = z.object({
  firstName: z.string().trim().min(1, 'שם פרטי הוא שדה חובה').max(100),
  lastName: z.string().trim().min(1, 'שם משפחה הוא שדה חובה').max(100),
  phone: z.string().trim().max(20).optional(),
  institution: z.string().trim().max(200).optional(),
  department: z.string().trim().max(200).optional(),
});

const AdminStudentsPage = () => {
  const [students, setStudents] = useState<Profile[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    institution: '',
    department: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStudents(students);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredStudents(
        students.filter(
          (student) =>
            student.first_name.toLowerCase().includes(query) ||
            student.last_name.toLowerCase().includes(query) ||
            student.institution?.toLowerCase().includes(query) ||
            student.department?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, students]);

  const loadStudents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading students:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לטעון את רשימת הסטודנטים',
        variant: 'destructive',
      });
    } else {
      setStudents(data || []);
      setFilteredStudents(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (student: Profile) => {
    setSelectedStudent(student);
    setFormData({
      firstName: student.first_name,
      lastName: student.last_name,
      phone: student.phone || '',
      institution: student.institution || '',
      department: student.department || '',
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleDelete = (student: Profile) => {
    setSelectedStudent(student);
    setDeleteDialogOpen(true);
  };

  const validateForm = () => {
    try {
      profileSchema.parse(formData);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as string] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedStudent || !validateForm()) return;

    const { error } = await supabase
      .from('profiles')
      .update({
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim() || null,
        institution: formData.institution.trim() || null,
        department: formData.department.trim() || null,
      })
      .eq('id', selectedStudent.id);

    if (error) {
      console.error('Error updating student:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לעדכן את פרטי הסטודנט',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'הצלחה',
        description: 'פרטי הסטודנט עודכנו בהצלחה',
      });
      setEditDialogOpen(false);
      loadStudents();
    }
  };

  const confirmDelete = async () => {
    if (!selectedStudent) return;

    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', selectedStudent.id);

    if (error) {
      console.error('Error deleting student:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו למחוק את הסטודנט',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'הצלחה',
        description: 'הסטודנט נמחק בהצלחה',
      });
      setDeleteDialogOpen(false);
      loadStudents();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען סטודנטים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">ניהול סטודנטים</h1>
        <p className="text-muted-foreground">נהל את רשימת הסטודנטים במערכת</p>
      </div>

      {/* Search Bar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="חפש סטודנט..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          סה"כ {filteredStudents.length} סטודנטים
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם מלא</TableHead>
              <TableHead className="text-right">טלפון</TableHead>
              <TableHead className="text-right">מוסד</TableHead>
              <TableHead className="text-right">מחלקה</TableHead>
              <TableHead className="text-right">תאריך הרשמה</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'לא נמצאו תוצאות' : 'אין סטודנטים במערכת'}
                </TableCell>
              </TableRow>
            ) : (
              filteredStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">
                    {student.first_name} {student.last_name}
                  </TableCell>
                  <TableCell>{student.phone || '-'}</TableCell>
                  <TableCell>{student.institution || '-'}</TableCell>
                  <TableCell>{student.department || '-'}</TableCell>
                  <TableCell>
                    {new Date(student.created_at).toLocaleDateString('he-IL')}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(student)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(student)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>עריכת פרטי סטודנט</DialogTitle>
            <DialogDescription>
              ערוך את הפרטים האישיים של הסטודנט
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">שם פרטי *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />
                {formErrors.firstName && (
                  <p className="text-sm text-destructive">{formErrors.firstName}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">שם משפחה *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />
                {formErrors.lastName && (
                  <p className="text-sm text-destructive">{formErrors.lastName}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">טלפון</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              {formErrors.phone && (
                <p className="text-sm text-destructive">{formErrors.phone}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="institution">מוסד</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">מחלקה</Label>
              <Input
                id="department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSaveEdit}>שמור שינויים</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק לצמיתות את הסטודנט{' '}
              <strong>
                {selectedStudent?.first_name} {selectedStudent?.last_name}
              </strong>{' '}
              מהמערכת. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              מחק סטודנט
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminStudentsPage;
