import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { 
  Eye, 
  Search, 
  Monitor, 
  Smartphone, 
  Chrome,
  Globe,
  MapPin,
  Calendar,
  Activity,
  RefreshCw,
  Unlock,
  AlertCircle,
  Shield,
  Download,
  Edit,
  Loader2,
  Tablet,
  Users
} from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DeviceInfo {
  id: string;
  device_fingerprint: string;
  ip_address: string | null;
  device_type: string | null;
  os: string | null;
  browser: string | null;
  is_trusted: boolean;
  login_count: number;
  first_seen_at: string;
  last_seen_at: string;
}

interface UserTracking {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  device_switches: number;
  max_switches_allowed: number;
  is_blocked: boolean;
  blocked_at: string | null;
  devices: DeviceInfo[] | null;
  total_devices: number;
  total_logins: number;
}

const AdminTrackingPage = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [switchesFilter, setSwitchesFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserTracking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editingSwitches, setEditingSwitches] = useState<{userId: string; value: number} | null>(null);

  // Fetch tracking data from Supabase
  const { data: trackingData, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-user-tracking'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_user_tracking_data');
      
      if (error) {
        console.error('Error fetching tracking data:', error);
        throw error;
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Failed to fetch tracking data');
      }
      
      return (data.data || []) as UserTracking[];
    },
  });

  const usersTracking = trackingData || [];

  // Mutation to reset switches
  const resetSwitchesMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('admin_reset_device_switches', {
        p_user_id: userId
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to reset switches');
      return data;
    },
    onSuccess: () => {
      toast.success('מספר ההחלפות אופס בהצלחה!');
      queryClient.invalidateQueries({ queryKey: ['admin-user-tracking'] });
      setShowDetailsDialog(false);
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Mutation to unblock user
  const unblockUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const { data, error } = await supabase.rpc('admin_unblock_user', {
        p_user_id: userId
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to unblock user');
      return data;
    },
    onSuccess: () => {
      toast.success('המשתמש שוחרר מחסימה!');
      queryClient.invalidateQueries({ queryKey: ['admin-user-tracking'] });
      setShowDetailsDialog(false);
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Mutation to update max switches
  const updateMaxSwitchesMutation = useMutation({
    mutationFn: async ({ userId, maxSwitches }: { userId: string; maxSwitches: number }) => {
      const { data, error } = await supabase.rpc('admin_update_max_switches', {
        p_user_id: userId,
        p_max_switches: maxSwitches
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to update max switches');
      return data;
    },
    onSuccess: () => {
      toast.success('מספר ההחלפות המקסימלי עודכן!');
      queryClient.invalidateQueries({ queryKey: ['admin-user-tracking'] });
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  // Mutation to update device switches count
  const updateSwitchesMutation = useMutation({
    mutationFn: async ({ userId, switches }: { userId: string; switches: number }) => {
      const { data, error } = await supabase.rpc('admin_update_device_switches', {
        p_user_id: userId,
        p_switches: switches
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to update switches');
      return data;
    },
    onSuccess: () => {
      toast.success('מספר ההחלפות עודכן!');
      queryClient.invalidateQueries({ queryKey: ['admin-user-tracking'] });
      setEditingSwitches(null);
    },
    onError: (error: Error) => {
      toast.error(`שגיאה: ${error.message}`);
    }
  });

  const handleShowDetails = (user: UserTracking) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const getDeviceIcon = (deviceType: string | null) => {
    switch (deviceType?.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
      case 'tablet':
        return <Tablet className="w-4 h-4" />;
      case 'desktop':
      case 'laptop':
        return <Monitor className="w-4 h-4" />;
      default:
        return <Globe className="w-4 h-4" />;
    }
  };

  const getDeviceSeverity = (switches: number, maxAllowed: number, isBlocked: boolean): { color: string; label: string; warning?: string } => {
    if (isBlocked) return { 
      color: 'bg-red-600', 
      label: 'חסום',
      warning: '⚠️ משתמש חסום'
    };
    
    if (switches >= maxAllowed - 1) return { 
      color: 'bg-red-500', 
      label: 'קריטי',
      warning: `⚠️ החלפה נוספת תחסום את המשתמש`
    };
    
    if (switches >= maxAllowed - 3) return { 
      color: 'bg-orange-500', 
      label: 'גבוה',
      warning: `נותרו ${maxAllowed - switches} החלפות`
    };
    
    if (switches >= 3) return { color: 'bg-yellow-500', label: 'בינוני' };
    if (switches >= 1) return { color: 'bg-blue-500', label: 'נמוך' };
    
    return { color: 'bg-green-500', label: 'תקין' };
  };

  const handleResetSwitches = (userId: string) => {
    if (confirm('האם אתה בטוח שברצונך לאפס את מספר ההחלפות?')) {
      resetSwitchesMutation.mutate(userId);
    }
  };

  const handleUnblockUser = (userId: string) => {
    if (confirm('האם אתה בטוח שברצונך לבטל את חסימת המשתמש?')) {
      unblockUserMutation.mutate(userId);
    }
  };

  const handleChangeMaxSwitches = (userId: string, newMax: number) => {
    if (newMax > 0 && newMax <= 50) {
      updateMaxSwitchesMutation.mutate({ userId, maxSwitches: newMax });
    }
  };

  const handleUpdateSwitches = (userId: string, newValue: number) => {
    updateSwitchesMutation.mutate({ userId, switches: newValue });
  };

  // Filter users
  const filteredUsers = usersTracking.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      user.first_name?.toLowerCase().includes(searchLower) ||
      user.last_name?.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toLowerCase().includes(searchLower);
    
    let matchesSwitches = true;
    if (switchesFilter === "blocked") {
      matchesSwitches = user.is_blocked;
    } else if (switchesFilter === "high") {
      matchesSwitches = user.device_switches >= user.max_switches_allowed - 2 && !user.is_blocked;
    } else if (switchesFilter === "medium") {
      matchesSwitches = user.device_switches >= 3 && user.device_switches < user.max_switches_allowed - 2;
    } else if (switchesFilter === "low") {
      matchesSwitches = user.device_switches >= 1 && user.device_switches < 3;
    } else if (switchesFilter === "none") {
      matchesSwitches = user.device_switches === 0;
    }
    
    return matchesSearch && matchesSwitches;
  });

  // Calculate stats
  const totalLogins = usersTracking.reduce((sum, u) => sum + (u.total_logins || 0), 0);
  const totalDevices = usersTracking.reduce((sum, u) => sum + (u.total_devices || 0), 0);
  const blockedUsers = usersTracking.filter(u => u.is_blocked).length;

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['שם פרטי', 'שם משפחה', 'מייל', 'טלפון', 'מספר החלפות', 'מקסימום מותר', 'סטטוס'];
    const rows = filteredUsers.map(user => [
      user.first_name || '',
      user.last_name || '',
      user.email || '',
      user.phone || '',
      user.device_switches.toString(),
      user.max_switches_allowed.toString(),
      user.is_blocked ? 'חסום' : 'פעיל'
    ]);

    const csvContent = '\uFEFF' + [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `מעקב_משתמשים_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('הקובץ יוצא בהצלחה!');
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('he-IL');
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6" dir="rtl">
        <div className="max-w-7xl mx-auto">
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 text-red-700">
                <AlertCircle className="w-8 h-8" />
                <div>
                  <h3 className="font-bold text-lg">שגיאה בטעינת הנתונים</h3>
                  <p>{error instanceof Error ? error.message : 'שגיאה לא ידועה'}</p>
                  <Button onClick={() => refetch()} className="mt-4" variant="outline">
                    <RefreshCw className="w-4 h-4 ml-2" />
                    נסה שוב
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">מעקב משתמשים</h1>
          <Button onClick={() => refetch()} variant="outline" disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ml-2 ${isLoading ? 'animate-spin' : ''}`} />
            רענן
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">סה"כ משתמשים</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : usersTracking.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">סה"כ התחברויות</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalLogins}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-orange-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                  <Monitor className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">מכשירים פעילים</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : totalDevices}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100/50 border-red-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">משתמשים חסומים</p>
                  <p className="text-2xl font-bold text-foreground">
                    {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : blockedUsers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Tracking Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">מעקב מפורט</CardTitle>
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
              
              <Select value={switchesFilter} onValueChange={setSwitchesFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="סנן לפי החלפות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל ההחלפות</SelectItem>
                  <SelectItem value="none">ללא החלפות</SelectItem>
                  <SelectItem value="low">נמוך (1-2)</SelectItem>
                  <SelectItem value="medium">בינוני (3+)</SelectItem>
                  <SelectItem value="high">גבוה (קרוב לחסימה)</SelectItem>
                  <SelectItem value="blocked">חסומים</SelectItem>
                </SelectContent>
              </Select>

              <Button
                onClick={handleExportCSV}
                variant="outline"
                className="md:w-auto"
                disabled={filteredUsers.length === 0}
              >
                <Download className="w-4 h-4 ml-2" />
                ייצא ל-CSV
              </Button>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">טוען נתונים...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {usersTracking.length === 0 
                    ? 'אין עדיין נתוני מעקב. הנתונים יתחילו להצטבר כשמשתמשים יתחברו למערכת.'
                    : 'לא נמצאו תוצאות התואמות לחיפוש'
                  }
                </p>
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
                      <TableHead className="text-right font-bold">מכשירים</TableHead>
                      <TableHead className="text-right font-bold">מספר החלפות</TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const severity = getDeviceSeverity(user.device_switches, user.max_switches_allowed, user.is_blocked);
                      return (
                        <TableRow key={user.id} className={`hover:bg-muted/30 ${user.is_blocked ? 'bg-red-50' : ''}`}>
                          <TableCell className="text-right">{user.first_name || '-'}</TableCell>
                          <TableCell className="text-right">{user.last_name || '-'}</TableCell>
                          <TableCell className="text-right">{user.email}</TableCell>
                          <TableCell className="text-right">{user.phone || '-'}</TableCell>
                          <TableCell className="text-right">
                            <Badge variant="secondary">{user.total_devices || 0}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="space-y-1">
                              <Badge 
                                className={`${severity.color} text-white`}
                              >
                                {user.device_switches}/{user.max_switches_allowed} - {severity.label}
                              </Badge>
                              {severity.warning && (
                                <div className="text-xs text-orange-600 font-medium">
                                  {severity.warning}
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleShowDetails(user)}
                              title="צפה בפרטים"
                            >
                              <Eye className="w-4 h-4 text-primary" />
                            </Button>
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

        {/* Device Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto" dir="rtl">
            <DialogHeader>
              <DialogTitle className="text-2xl">
                מעקב מפורט: {selectedUser?.first_name} {selectedUser?.last_name}
              </DialogTitle>
            </DialogHeader>
            
            {selectedUser && (
              <div className="space-y-6 py-4">
                {/* Policy Info Banner */}
                {selectedUser.is_blocked && (
                  <Card className="bg-red-50 border-red-300 border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-red-900 text-lg mb-1">משתמש חסום</h3>
                          <p className="text-red-700">
                            המשתמש חרג מ-{selectedUser.max_switches_allowed} החלפות מכשירים ונחסם. 
                            {selectedUser.blocked_at && ` נחסם ב-${formatDate(selectedUser.blocked_at)}`}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {!selectedUser.is_blocked && selectedUser.device_switches >= selectedUser.max_switches_allowed - 2 && (
                  <Card className="bg-orange-50 border-orange-300 border-2">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <Shield className="w-6 h-6 text-orange-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h3 className="font-bold text-orange-900 text-lg mb-1">אזהרה - קרוב לחסימה</h3>
                          <p className="text-orange-700">
                            נותרו רק {selectedUser.max_switches_allowed - selectedUser.device_switches} החלפות עד לחסימה אוטומטית.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* User Info */}
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">אימייל</p>
                        <p className="font-semibold">{selectedUser.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">טלפון</p>
                        <p className="font-semibold">{selectedUser.phone || 'לא צוין'}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">מספר מכשירים (סה"כ)</p>
                        <p className="font-semibold">
                          {selectedUser.total_devices || 0} מכשירים
                          <span className="text-xs text-muted-foreground mr-2">
                            (2 ראשונים לא נספרים)
                          </span>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">החלפות מכשירים</p>
                        <div className="flex items-center gap-2">
                          {editingSwitches?.userId === selectedUser.id ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="number"
                                value={editingSwitches.value}
                                onChange={(e) => setEditingSwitches({
                                  userId: selectedUser.id,
                                  value: parseInt(e.target.value) || 0
                                })}
                                className="w-20 text-right"
                                min={0}
                                max={selectedUser.max_switches_allowed}
                              />
                              <span className="text-muted-foreground">/ {selectedUser.max_switches_allowed}</span>
                              <Button
                                size="sm"
                                onClick={() => handleUpdateSwitches(selectedUser.id, editingSwitches.value)}
                                disabled={updateSwitchesMutation.isPending}
                              >
                                {updateSwitchesMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'שמור'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingSwitches(null)}
                              >
                                ביטול
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <p className="font-semibold">
                                {selectedUser.device_switches} / {selectedUser.max_switches_allowed}
                              </p>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingSwitches({
                                  userId: selectedUser.id,
                                  value: selectedUser.device_switches
                                })}
                                title="ערוך מספר החלפות"
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Admin Actions */}
                <Card className="border-2 border-blue-200 bg-blue-50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Shield className="w-5 h-5 text-blue-600" />
                      פעולות מנהל
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedUser.is_blocked && (
                        <Button
                          onClick={() => handleUnblockUser(selectedUser.id)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={unblockUserMutation.isPending}
                        >
                          {unblockUserMutation.isPending ? (
                            <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                          ) : (
                            <Unlock className="w-4 h-4 ml-2" />
                          )}
                          בטל חסימה
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleResetSwitches(selectedUser.id)}
                        variant="outline"
                        className="border-blue-400 hover:bg-blue-100"
                        disabled={resetSwitchesMutation.isPending}
                      >
                        {resetSwitchesMutation.isPending ? (
                          <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 ml-2" />
                        )}
                        אפס החלפות
                      </Button>

                      <div className="md:col-span-2">
                        <Label htmlFor="max-switches" className="mb-2 block">
                          מספר החלפות מקסימלי
                        </Label>
                        <div className="flex gap-2">
                          <Input
                            id="max-switches"
                            type="number"
                            defaultValue={selectedUser.max_switches_allowed}
                            min={1}
                            max={50}
                            className="text-right"
                            onBlur={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (newValue !== selectedUser.max_switches_allowed && newValue > 0 && newValue <= 50) {
                                handleChangeMaxSwitches(selectedUser.id, newValue);
                              }
                            }}
                          />
                          <span className="flex items-center text-sm text-muted-foreground">
                            (ברירת מחדל: 10)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Policy Explanation */}
                    <div className="pt-4 border-t">
                      <h4 className="font-semibold text-sm mb-2">מדיניות החלפות:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• 2 מכשירים ראשונים - ללא ספירה</li>
                        <li>• מכשיר שלישי ומעלה - ספירת החלפות</li>
                        <li>• {selectedUser.max_switches_allowed} החלפות - חסימה אוטומטית</li>
                        <li>• אדמין יכול לאפס או לשנות מספר החלפות</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Devices List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">מכשירים מזוהים ({selectedUser.devices?.length || 0})</h3>
                  {selectedUser.devices && selectedUser.devices.length > 0 ? (
                    <div className="space-y-4">
                      {selectedUser.devices.map((device, index) => (
                        <Card key={device.id || index} className="border-2">
                          <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">כתובת IP</p>
                                    <p className="font-mono font-semibold">{device.ip_address || 'לא ידוע'}</p>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  {getDeviceIcon(device.device_type)}
                                  <div>
                                    <p className="text-xs text-muted-foreground">סוג מכשיר</p>
                                    <p className="font-semibold">{device.device_type || 'לא ידוע'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Monitor className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">מערכת הפעלה</p>
                                    <p className="font-semibold">{device.os || 'לא ידוע'}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <Chrome className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">דפדפן</p>
                                    <p className="font-semibold">{device.browser || 'לא ידוע'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Activity className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">כמות התחברויות</p>
                                    <p className="font-semibold">{device.login_count}</p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Calendar className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">נראה לאחרונה</p>
                                    <p className="font-semibold">{formatDate(device.last_seen_at)}</p>
                                  </div>
                                </div>
                              </div>

                              <div className="md:col-span-2 pt-3 border-t flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <Badge variant={device.is_trusted ? "default" : "secondary"}>
                                    {device.is_trusted ? '✓ מכשיר מהימן' : 'מכשיר חדש'}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  נרשם לראשונה: {formatDate(device.first_seen_at)}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-2">
                      <CardContent className="pt-6 text-center text-muted-foreground">
                        <Monitor className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>אין מכשירים רשומים למשתמש זה</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminTrackingPage;
