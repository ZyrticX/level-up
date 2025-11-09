import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Trash2, 
  Edit, 
  Plus, 
  Upload, 
  Video, 
  Search,
  Filter,
  Eye,
  CheckCircle2,
  AlertCircle,
  FileText,
  Download,
  X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
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
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VideoItem {
  id: string;
  title: string;
  description: string | null;
  duration: number; // seconds
  thumbnail_url: string | null;
  video_url: string;
  status: 'assigned' | 'unassigned' | 'draft';
  course_id: string | null;
  course_name: string | null;
  chapter_id: string | null;
  chapter_name: string | null;
  topic_id: string | null;
  topic_name: string | null;
  uploaded_at: string;
  order_index: number;
}

const AdminVideoLibraryPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedVideos, setSelectedVideos] = useState<Set<string>>(new Set());
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch videos
  const { data: videos = [], isLoading } = useQuery({
    queryKey: ['admin-videos'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          courses:course_id (title),
          chapters:chapter_id (title)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Transform data
      return (data || []).map((video: any) => ({
        id: video.id,
        title: video.title,
        description: video.description,
        duration: video.duration,
        thumbnail_url: video.thumbnail_url,
        video_url: video.video_url,
        status: video.course_id ? (video.is_published ? 'assigned' : 'draft') : 'unassigned',
        course_id: video.course_id,
        course_name: video.courses?.title || null,
        chapter_id: video.chapter_id,
        chapter_name: video.chapters?.title || null,
        topic_id: null, // Will be added when topics table exists
        topic_name: null,
        uploaded_at: video.created_at,
        order_index: video.order_index,
      })) as VideoItem[];
    }
  });

  // Upload mutation
  const uploadMutation = useMutation({
    mutationFn: async (files: File[]) => {
      setIsUploading(true);
      const uploadedVideos: VideoItem[] = [];
      
      for (const file of files) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `videos/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('videos')
          .upload(filePath, file);
        
        if (uploadError) throw uploadError;
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(filePath);
        
        // Create video record
        const { data, error } = await supabase
          .from('videos')
          .insert({
            title: file.name.replace(/\.[^/.]+$/, ""),
            video_url: publicUrl,
            duration: 0, // Will be extracted later
            is_published: false,
          })
          .select()
          .single();
        
        if (error) throw error;
        
        uploadedVideos.push({
          id: data.id,
          title: data.title,
          description: null,
          duration: 0,
          thumbnail_url: null,
          video_url: publicUrl,
          status: 'unassigned',
          course_id: null,
          course_name: null,
          chapter_id: null,
          chapter_name: null,
          topic_id: null,
          topic_name: null,
          uploaded_at: data.created_at,
          order_index: 0,
        });
      }
      
      return uploadedVideos;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('הסרטונים הועלו בהצלחה!');
      setUploadFiles([]);
      setIsUploading(false);
    },
    onError: (error: any) => {
      toast.error(`שגיאה בהעלאה: ${error.message}`);
      setIsUploading(false);
    }
  });

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from('videos')
        .delete()
        .in('id', ids);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      toast.success('הסרטונים נמחקו בהצלחה!');
      setSelectedVideos(new Set());
    },
    onError: (error: any) => {
      toast.error(`שגיאה במחיקה: ${error.message}`);
    }
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(
        file => file.type.startsWith('video/')
      );
      setUploadFiles(files);
    }
  };

  const handleUpload = () => {
    if (uploadFiles.length === 0) {
      toast.error('אנא בחר קבצים להעלאה');
      return;
    }
    uploadMutation.mutate(uploadFiles);
  };

  const handleDeleteSelected = () => {
    if (selectedVideos.size === 0) {
      toast.error('אנא בחר סרטונים למחיקה');
      return;
    }
    if (confirm(`האם אתה בטוח שברצונך למחוק ${selectedVideos.size} סרטונים?`)) {
      deleteMutation.mutate(Array.from(selectedVideos));
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'assigned':
        return <Badge className="bg-green-500"><CheckCircle2 className="w-3 h-3 ml-1" /> משויך</Badge>;
      case 'unassigned':
        return <Badge className="bg-orange-500"><AlertCircle className="w-3 h-3 ml-1" /> לא משויך</Badge>;
      case 'draft':
        return <Badge className="bg-gray-500"><FileText className="w-3 h-3 ml-1" /> טיוטה</Badge>;
      default:
        return null;
    }
  };

  const getHierarchyPath = (video: VideoItem) => {
    const parts = [];
    if (video.course_name) parts.push(video.course_name);
    if (video.chapter_name) parts.push(`> ${video.chapter_name}`);
    if (video.topic_name) parts.push(`> ${video.topic_name}`);
    return parts.length > 0 ? parts.join(' ') : '-';
  };

  // Filter videos
  const filteredVideos = videos.filter((video) => {
    const matchesSearch = 
      video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      video.course_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || video.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען סרטונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">ספריית סרטונים</h1>

        {/* Upload Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">העלאה מרובה של סרטונים</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="flex-1">
                <Input
                  type="file"
                  multiple
                  accept="video/*"
                  onChange={handleFileSelect}
                  className="text-right"
                />
                {uploadFiles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {uploadFiles.map((file, index) => (
                      <Badge key={index} variant="outline" className="text-sm">
                        {file.name}
                        <button
                          onClick={() => setUploadFiles(uploadFiles.filter((_, i) => i !== index))}
                          className="mr-2 hover:text-destructive"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <Button
                onClick={handleUpload}
                disabled={isUploading || uploadFiles.length === 0}
                className="bg-primary hover:bg-primary/90"
              >
                <Upload className="w-4 h-4 ml-2" />
                {isUploading ? 'מעלה...' : `העלה ${uploadFiles.length} קבצים`}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  placeholder="חיפוש לפי שם, תיאור או קורס..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 text-right"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="סנן לפי סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסטטוסים</SelectItem>
                  <SelectItem value="assigned">משויך</SelectItem>
                  <SelectItem value="unassigned">לא משויך</SelectItem>
                  <SelectItem value="draft">טיוטה</SelectItem>
                </SelectContent>
              </Select>

              {selectedVideos.size > 0 && (
                <Button
                  variant="destructive"
                  onClick={handleDeleteSelected}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  מחק {selectedVideos.size} נבחרים
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Videos Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">
                סרטונים ({filteredVideos.length})
              </CardTitle>
              <Badge variant="outline" className="text-base px-4 py-2">
                {videos.length} סה"כ
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {filteredVideos.length === 0 ? (
              <div className="text-center py-12">
                <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-lg">
                  {videos.length === 0 ? 'עדיין לא הועלו סרטונים' : 'לא נמצאו תוצאות'}
                </p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedVideos.size === filteredVideos.length && filteredVideos.length > 0}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedVideos(new Set(filteredVideos.map(v => v.id)));
                            } else {
                              setSelectedVideos(new Set());
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="text-right font-bold w-24">תמונה</TableHead>
                      <TableHead className="text-right font-bold">שם סרטון</TableHead>
                      <TableHead className="text-right font-bold">משך</TableHead>
                      <TableHead className="text-right font-bold">סטטוס</TableHead>
                      <TableHead className="text-right font-bold">שייך ל...</TableHead>
                      <TableHead className="text-right font-bold">תאריך העלאה</TableHead>
                      <TableHead className="text-center font-bold">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVideos.map((video) => (
                      <TableRow key={video.id} className="hover:bg-muted/30">
                        <TableCell>
                          <Checkbox
                            checked={selectedVideos.has(video.id)}
                            onCheckedChange={(checked) => {
                              const newSelected = new Set(selectedVideos);
                              if (checked) {
                                newSelected.add(video.id);
                              } else {
                                newSelected.delete(video.id);
                              }
                              setSelectedVideos(newSelected);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {video.thumbnail_url ? (
                            <img
                              src={video.thumbnail_url}
                              alt={video.title}
                              className="w-16 h-10 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-10 bg-muted rounded flex items-center justify-center">
                              <Video className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {video.title}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatDuration(video.duration)}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(video.status)}
                        </TableCell>
                        <TableCell className="text-right text-sm text-muted-foreground">
                          {getHierarchyPath(video)}
                        </TableCell>
                        <TableCell className="text-right">
                          {new Date(video.uploaded_at).toLocaleDateString('he-IL')}
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/admin/video-editor/${video.id}`)}
                              title="עריכה"
                            >
                              <Edit className="w-4 h-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => window.open(video.video_url, '_blank')}
                              title="צפייה"
                            >
                              <Eye className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('האם אתה בטוח שברצונך למחוק סרטון זה?')) {
                                  deleteMutation.mutate([video.id]);
                                }
                              }}
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

export default AdminVideoLibraryPage;

