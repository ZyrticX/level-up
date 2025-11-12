import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
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
  Edit
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
  ip_address: string;
  count: number;
  last_seen: string;
  os: string;
  device_type: string;
  browser: string;
  mac_address: string | null;
}

interface UserTracking {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  device_switches: number;
  devices: DeviceInfo[];
  is_blocked: boolean;
  max_switches_allowed: number;
}

const AdminTrackingPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [switchesFilter, setSwitchesFilter] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<UserTracking | null>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editingSwitches, setEditingSwitches] = useState<{userId: string; value: number} | null>(null);

  // Mock tracking data
  // Note: device_switches only counts from 3rd device onwards (first 2 devices don't count)
  const usersTracking: UserTracking[] = [
    {
      id: '1',
      first_name: 'יוסי',
      last_name: 'כהן',
      email: 'yossi@example.com',
      phone: '050-1234567',
      device_switches: 1, // Has 3 devices total, so 1 switch (3rd device)
      is_blocked: false,
      max_switches_allowed: 10,
      devices: [
        {
          ip_address: '192.168.1.100',
          count: 45,
          last_seen: '2024-01-20 14:30',
          os: 'Windows 11',
          device_type: 'Desktop',
          browser: 'Chrome 120',
          mac_address: '00:1B:44:11:3A:B7'
        },
        {
          ip_address: '192.168.1.105',
          count: 23,
          last_seen: '2024-01-19 10:15',
          os: 'Android 14',
          device_type: 'Mobile',
          browser: 'Chrome Mobile 120',
          mac_address: 'A4:5E:60:E2:1F:92'
        },
        {
          ip_address: '10.0.0.15',
          count: 12,
          last_seen: '2024-01-18 18:45',
          os: 'iOS 17.2',
          device_type: 'Tablet',
          browser: 'Safari 17',
          mac_address: null
        }
      ]
    },
    {
      id: '2',
      first_name: 'שרה',
      last_name: 'לוי',
      email: 'sara@example.com',
      phone: '052-9876543',
      device_switches: 0, // Only 1 device, no switches
      is_blocked: false,
      max_switches_allowed: 10,
      devices: [
        {
          ip_address: '192.168.2.50',
          count: 78,
          last_seen: '2024-01-20 16:20',
          os: 'MacOS Sonoma',
          device_type: 'Laptop',
          browser: 'Safari 17',
          mac_address: 'F0:18:98:12:34:AB'
        }
      ]
    },
    {
      id: '3',
      first_name: 'דוד',
      last_name: 'מזרחי',
      email: 'david@example.com',
      phone: null,
      device_switches: 3, // Has 5 devices total, so 3 switches (3rd, 4th, 5th)
      is_blocked: false,
      max_switches_allowed: 10,
      devices: [
        {
          ip_address: '172.16.0.100',
          count: 34,
          last_seen: '2024-01-20 12:00',
          os: 'Windows 10',
          device_type: 'Desktop',
          browser: 'Edge 120',
          mac_address: 'B8:27:EB:AA:BB:CC'
        },
        {
          ip_address: '172.16.0.105',
          count: 29,
          last_seen: '2024-01-19 22:30',
          os: 'Android 13',
          device_type: 'Mobile',
          browser: 'Firefox Mobile 121',
          mac_address: 'C8:3A:35:11:22:33'
        },
        {
          ip_address: '10.10.10.20',
          count: 15,
          last_seen: '2024-01-18 09:00',
          os: 'Linux Ubuntu',
          device_type: 'Desktop',
          browser: 'Firefox 121',
          mac_address: 'DC:A6:32:AA:BB:DD'
        },
        {
          ip_address: '192.168.100.10',
          count: 8,
          last_seen: '2024-01-17 20:15',
          os: 'iOS 16.5',
          device_type: 'Mobile',
          browser: 'Safari 16',
          mac_address: null
        },
        {
          ip_address: '192.168.100.11',
          count: 3,
          last_seen: '2024-01-15 15:00',
          os: 'ChromeOS',
          device_type: 'Laptop',
          browser: 'Chrome 120',
          mac_address: null
        }
      ]
    },
    {
      id: '4',
      first_name: 'מיכל',
      last_name: 'אברהם',
      email: 'michal@example.com',
      phone: '054-1111111',
      device_switches: 9, // Close to blocking - 11 devices total
      is_blocked: false,
      max_switches_allowed: 10,
      devices: Array.from({ length: 11 }, (_, i) => ({
        ip_address: `10.0.${i}.100`,
        count: 5 - i,
        last_seen: `2024-01-${20 - i} 10:00`,
        os: i % 2 === 0 ? 'Windows 11' : 'Android 14',
        device_type: i % 2 === 0 ? 'Desktop' : 'Mobile',
        browser: 'Chrome 120',
        mac_address: i < 5 ? `AA:BB:CC:DD:EE:${i.toString(16).padStart(2, '0')}` : null
      }))
    },
    {
      id: '5',
      first_name: 'אריאל',
      last_name: 'שרון',
      email: 'ariel@example.com',
      phone: '053-9999999',
      device_switches: 12, // BLOCKED - 14 devices total
      is_blocked: true,
      max_switches_allowed: 10,
      devices: Array.from({ length: 14 }, (_, i) => ({
        ip_address: `192.168.${Math.floor(i / 10)}.${(i % 10) * 10}`,
        count: 3,
        last_seen: `2024-01-${20 - Math.floor(i / 2)} 15:00`,
        os: ['Windows 11', 'MacOS', 'Android 14', 'iOS 17'][i % 4],
        device_type: ['Desktop', 'Laptop', 'Mobile', 'Tablet'][i % 4],
        browser: ['Chrome 120', 'Safari 17', 'Firefox 121'][i % 3],
        mac_address: i < 7 ? `FF:EE:DD:CC:BB:${i.toString(16).padStart(2, '0')}` : null
      }))
    }
  ];

  const handleShowDetails = (user: UserTracking) => {
    setSelectedUser(user);
    setShowDetailsDialog(true);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="w-4 h-4" />;
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
      warning: '⚠️ משתמש חסום - נשלח מייל אוטומטי'
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
      // In production, this would call Supabase
      toast.success('מספר ההחלפות אופס בהצלחה!');
      setShowDetailsDialog(false);
    }
  };

  const handleUnblockUser = (userId: string) => {
    if (confirm('האם אתה בטוח שברצונך לבטל את חסימת המשתמש?')) {
      // In production, this would call Supabase
      toast.success('המשתמש שוחרר מחסימה!');
      setShowDetailsDialog(false);
    }
  };

  const handleChangeMaxSwitches = (userId: string, newMax: number) => {
    // In production, this would call Supabase
    toast.success(`מספר ההחלפות המקסימלי עודכן ל-${newMax}`);
  };

  // Filter users
  const filteredUsers = usersTracking.filter((user) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
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
    link.setAttribute('download', `מעקב_משתמשים_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('הקובץ יוצא בהצלחה!');
  };

  const handleUpdateSwitches = (userId: string, newValue: number) => {
    // In production, this would call Supabase
    toast.success(`מספר ההחלפות עודכן ל-${newValue}`);
    setEditingSwitches(null);
    // Refresh the dialog if it's open
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({
        ...selectedUser,
        device_switches: newValue
      });
    }
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">מעקב משתמשים</h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">סה"כ התחברויות</p>
                  <p className="text-2xl font-bold text-foreground">
                    {usersTracking.reduce((sum, u) => 
                      sum + u.devices.reduce((s, d) => s + d.count, 0), 0
                    )}
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
                    {usersTracking.reduce((sum, u) => sum + u.devices.length, 0)}
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
                    {usersTracking.filter(u => u.is_blocked).length}
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
              >
                <Download className="w-4 h-4 ml-2" />
                ייצא ל-CSV
              </Button>
            </div>

            {/* Table */}
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">לא נמצאו תוצאות</p>
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
                      <TableHead className="text-right font-bold">מספר החלפות</TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => {
                      const severity = getDeviceSeverity(user.device_switches, user.max_switches_allowed, user.is_blocked);
                      return (
                        <TableRow key={user.id} className={`hover:bg-muted/30 ${user.is_blocked ? 'bg-red-50' : ''}`}>
                          <TableCell className="text-right">{user.first_name}</TableCell>
                          <TableCell className="text-right">{user.last_name}</TableCell>
                          <TableCell className="text-right">{user.email}</TableCell>
                          <TableCell className="text-right">{user.phone || '-'}</TableCell>
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
                            המשתמש חרג מ-{selectedUser.max_switches_allowed} החלפות מכשירים ונחסם אוטומטית. 
                            נשלח מייל אוטומטי עם הודעה על החסימה.
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
                          {selectedUser.devices.length} מכשירים
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
                                onClick={() => {
                                  if (editingSwitches) {
                                    handleUpdateSwitches(editingSwitches.userId, editingSwitches.value);
                                  }
                                }}
                              >
                                שמור
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
                        >
                          <Unlock className="w-4 h-4 ml-2" />
                          בטל חסימה
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => handleResetSwitches(selectedUser.id)}
                        variant="outline"
                        className="border-blue-400 hover:bg-blue-100"
                      >
                        <RefreshCw className="w-4 h-4 ml-2" />
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
                            onChange={(e) => {
                              const newValue = parseInt(e.target.value);
                              if (newValue > 0 && newValue <= 50) {
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
                        <li>• {selectedUser.max_switches_allowed} החלפות - חסימה אוטומטית + מייל</li>
                        <li>• אדמין יכול לאפס או לשנות מספר החלפות</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Devices List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">מכשירים מזוהים</h3>
                  <div className="space-y-4">
                    {selectedUser.devices.map((device, index) => (
                      <Card key={index} className="border-2">
                        <CardContent className="pt-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">כתובת IP</p>
                                  <p className="font-mono font-semibold">{device.ip_address}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {getDeviceIcon(device.device_type)}
                                <div>
                                  <p className="text-xs text-muted-foreground">סוג מכשיר</p>
                                  <p className="font-semibold">{device.device_type}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Monitor className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">מערכת הפעלה</p>
                                  <p className="font-semibold">{device.os}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-3">
                              <div className="flex items-center gap-3">
                                <Chrome className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">דפדפן</p>
                                  <p className="font-semibold">{device.browser}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Activity className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">כמות התחברויות</p>
                                  <p className="font-semibold">{device.count}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-primary" />
                                <div>
                                  <p className="text-xs text-muted-foreground">נראה לאחרונה</p>
                                  <p className="font-semibold">{device.last_seen}</p>
                                </div>
                              </div>
                            </div>

                            {device.mac_address && (
                              <div className="md:col-span-2 pt-3 border-t">
                                <div className="flex items-center gap-3">
                                  <Globe className="w-5 h-5 text-primary" />
                                  <div>
                                    <p className="text-xs text-muted-foreground">כתובת MAC</p>
                                    <p className="font-mono font-semibold">{device.mac_address}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
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

