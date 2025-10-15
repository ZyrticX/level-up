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
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Search, Pencil, Trash2, Plus } from 'lucide-react';
import { z } from 'zod';

interface Institution {
  id: string;
  name: string;
  description: string | null;
  website: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

const institutionSchema = z.object({
  name: z.string().trim().min(1, 'שם המוסד הוא שדה חובה').max(200),
  description: z.string().trim().max(1000).optional(),
  website: z.string().trim().url('כתובת אתר לא תקינה').or(z.literal('')).optional(),
  contactEmail: z.string().trim().email('כתובת אימייל לא תקינה').or(z.literal('')).optional(),
  contactPhone: z.string().trim().max(20).optional(),
  address: z.string().trim().max(500).optional(),
  logoUrl: z.string().trim().url('כתובת לוגו לא תקינה').or(z.literal('')).optional(),
  isActive: z.boolean(),
});

const AdminInstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    logoUrl: '',
    isActive: true,
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    loadInstitutions();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredInstitutions(institutions);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredInstitutions(
        institutions.filter(
          (inst) =>
            inst.name.toLowerCase().includes(query) ||
            inst.description?.toLowerCase().includes(query) ||
            inst.address?.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, institutions]);

  const loadInstitutions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('institutions')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Error loading institutions:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לטעון את רשימת המוסדות',
        variant: 'destructive',
      });
    } else {
      setInstitutions(data || []);
      setFilteredInstitutions(data || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      website: '',
      contactEmail: '',
      contactPhone: '',
      address: '',
      logoUrl: '',
      isActive: true,
    });
    setFormErrors({});
  };

  const handleAdd = () => {
    resetForm();
    setAddDialogOpen(true);
  };

  const handleEdit = (institution: Institution) => {
    setSelectedInstitution(institution);
    setFormData({
      name: institution.name,
      description: institution.description || '',
      website: institution.website || '',
      contactEmail: institution.contact_email || '',
      contactPhone: institution.contact_phone || '',
      address: institution.address || '',
      logoUrl: institution.logo_url || '',
      isActive: institution.is_active,
    });
    setFormErrors({});
    setEditDialogOpen(true);
  };

  const handleDelete = (institution: Institution) => {
    setSelectedInstitution(institution);
    setDeleteDialogOpen(true);
  };

  const validateForm = () => {
    try {
      institutionSchema.parse(formData);
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

  const handleSaveNew = async () => {
    if (!validateForm()) return;

    const { error } = await supabase
      .from('institutions')
      .insert({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        website: formData.website.trim() || null,
        contact_email: formData.contactEmail.trim() || null,
        contact_phone: formData.contactPhone.trim() || null,
        address: formData.address.trim() || null,
        logo_url: formData.logoUrl.trim() || null,
        is_active: formData.isActive,
      });

    if (error) {
      console.error('Error creating institution:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו ליצור את המוסד',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'הצלחה',
        description: 'המוסד נוצר בהצלחה',
      });
      setAddDialogOpen(false);
      loadInstitutions();
    }
  };

  const handleSaveEdit = async () => {
    if (!selectedInstitution || !validateForm()) return;

    const { error } = await supabase
      .from('institutions')
      .update({
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        website: formData.website.trim() || null,
        contact_email: formData.contactEmail.trim() || null,
        contact_phone: formData.contactPhone.trim() || null,
        address: formData.address.trim() || null,
        logo_url: formData.logoUrl.trim() || null,
        is_active: formData.isActive,
      })
      .eq('id', selectedInstitution.id);

    if (error) {
      console.error('Error updating institution:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו לעדכן את המוסד',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'הצלחה',
        description: 'המוסד עודכן בהצלחה',
      });
      setEditDialogOpen(false);
      loadInstitutions();
    }
  };

  const confirmDelete = async () => {
    if (!selectedInstitution) return;

    const { error } = await supabase
      .from('institutions')
      .delete()
      .eq('id', selectedInstitution.id);

    if (error) {
      console.error('Error deleting institution:', error);
      toast({
        title: 'שגיאה',
        description: 'לא הצלחנו למחוק את המוסד',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'הצלחה',
        description: 'המוסד נמחק בהצלחה',
      });
      setDeleteDialogOpen(false);
      loadInstitutions();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען מוסדות...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8" dir="rtl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">ניהול מוסדות לימוד</h1>
        <p className="text-muted-foreground">נהל את רשימת המוסדות במערכת</p>
      </div>

      {/* Search Bar and Add Button */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="חפש מוסד..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          סה"כ {filteredInstitutions.length} מוסדות
        </div>
        <Button onClick={handleAdd}>
          <Plus className="ml-2 h-4 w-4" />
          הוסף מוסד
        </Button>
      </div>

      {/* Institutions Table */}
      <div className="bg-card rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">שם המוסד</TableHead>
              <TableHead className="text-right">תיאור</TableHead>
              <TableHead className="text-right">אתר</TableHead>
              <TableHead className="text-right">אימייל</TableHead>
              <TableHead className="text-right">טלפון</TableHead>
              <TableHead className="text-right">פעיל</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInstitutions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? 'לא נמצאו תוצאות' : 'אין מוסדות במערכת'}
                </TableCell>
              </TableRow>
            ) : (
              filteredInstitutions.map((institution) => (
                <TableRow key={institution.id}>
                  <TableCell className="font-medium">{institution.name}</TableCell>
                  <TableCell className="max-w-xs truncate">
                    {institution.description || '-'}
                  </TableCell>
                  <TableCell>
                    {institution.website ? (
                      <a
                        href={institution.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        קישור
                      </a>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell>{institution.contact_email || '-'}</TableCell>
                  <TableCell>{institution.contact_phone || '-'}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        institution.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {institution.is_active ? 'פעיל' : 'לא פעיל'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(institution)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(institution)}
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

      {/* Add Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>הוסף מוסד חדש</DialogTitle>
            <DialogDescription>הזן את פרטי המוסד החדש</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="add-name">שם המוסד *</Label>
              <Input
                id="add-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-description">תיאור</Label>
              <Textarea
                id="add-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-website">אתר אינטרנט</Label>
              <Input
                id="add-website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              {formErrors.website && (
                <p className="text-sm text-destructive">{formErrors.website}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-email">אימייל ליצירת קשר</Label>
              <Input
                id="add-email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
              {formErrors.contactEmail && (
                <p className="text-sm text-destructive">{formErrors.contactEmail}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-phone">טלפון</Label>
              <Input
                id="add-phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-address">כתובת</Label>
              <Textarea
                id="add-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-logo">כתובת לוגו</Label>
              <Input
                id="add-logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              />
              {formErrors.logoUrl && (
                <p className="text-sm text-destructive">{formErrors.logoUrl}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="add-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="add-active">המוסד פעיל</Label>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSaveNew}>צור מוסד</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]" dir="rtl">
          <DialogHeader>
            <DialogTitle>עריכת מוסד</DialogTitle>
            <DialogDescription>ערוך את פרטי המוסד</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="edit-name">שם המוסד *</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              {formErrors.name && (
                <p className="text-sm text-destructive">{formErrors.name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">תיאור</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-website">אתר אינטרנט</Label>
              <Input
                id="edit-website"
                type="url"
                placeholder="https://example.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              />
              {formErrors.website && (
                <p className="text-sm text-destructive">{formErrors.website}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">אימייל ליצירת קשר</Label>
              <Input
                id="edit-email"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
              />
              {formErrors.contactEmail && (
                <p className="text-sm text-destructive">{formErrors.contactEmail}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-phone">טלפון</Label>
              <Input
                id="edit-phone"
                value={formData.contactPhone}
                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-address">כתובת</Label>
              <Textarea
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">כתובת לוגו</Label>
              <Input
                id="edit-logo"
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              />
              {formErrors.logoUrl && (
                <p className="text-sm text-destructive">{formErrors.logoUrl}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="edit-active"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-active">המוסד פעיל</Label>
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
              פעולה זו תמחק לצמיתות את המוסד{' '}
              <strong>{selectedInstitution?.name}</strong> מהמערכת. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              מחק מוסד
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminInstitutionsPage;
