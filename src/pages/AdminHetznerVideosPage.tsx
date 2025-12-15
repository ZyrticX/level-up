/**
 * Admin Hetzner Videos Management Page
 * 
 * Features:
 * - Upload individual videos or entire folders to Hetzner server
 * - Maintain folder structure
 * - View and manage videos on Hetzner
 * - Sync video paths with Supabase
 * - Monitor upload progress
 */

import React, { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Upload, 
  Trash2, 
  RefreshCw, 
  Server, 
  Video, 
  HardDrive,
  CheckCircle2,
  AlertCircle,
  Link2,
  FolderOpen,
  FileVideo,
  FolderUp,
  File,
  X,
  Play,
  Copy,
  ExternalLink
} from 'lucide-react';

// Hetzner config
const HETZNER_API_URL = import.meta.env.VITE_HETZNER_API_URL || '';

interface Course {
  id: string;
  title: string;
}

interface Chapter {
  id: string;
  title: string;
  course_id: string;
}

interface VideoRecord {
  id: string;
  title: string;
  course_id: string;
  chapter_id: string | null;
  hetzner_path: string | null;
  hls_path: string | null;
  duration: number;
  is_published: boolean;
  courses?: { title: string };
  course_chapters?: { title: string };
}

interface UploadFile {
  file: File;
  relativePath: string;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface HetznerFile {
  path: string;
  size: number;
  modified: Date;
}

const AdminHetznerVideosPage: React.FC = () => {
  const queryClient = useQueryClient();
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadMode, setUploadMode] = useState<'files' | 'folder'>('files');
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('id, title')
        .order('title');
      if (error) throw error;
      return data as Course[];
    },
  });

  // Fetch chapters for selected course
  const { data: chapters = [] } = useQuery({
    queryKey: ['admin-chapters', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse || selectedCourse === 'all') return [];
      const { data, error } = await supabase
        .from('course_chapters')
        .select('id, title, course_id')
        .eq('course_id', selectedCourse)
        .order('order_index');
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!selectedCourse && selectedCourse !== 'all',
  });

  // Fetch videos from Supabase
  const { data: videos = [], isLoading: videosLoading, refetch: refetchVideos } = useQuery({
    queryKey: ['admin-hetzner-videos', selectedCourse],
    queryFn: async () => {
      let query = supabase
        .from('videos')
        .select(`
          id,
          title,
          course_id,
          chapter_id,
          hetzner_path,
          hls_path,
          duration,
          is_published,
          courses(title),
          course_chapters(title)
        `)
        .order('created_at', { ascending: false });

      if (selectedCourse && selectedCourse !== 'all') {
        query = query.eq('course_id', selectedCourse);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as VideoRecord[];
    },
  });

  // Fetch files from Hetzner server
  const { data: hetznerFiles = [], isLoading: hetznerLoading, refetch: refetchHetzner } = useQuery({
    queryKey: ['hetzner-files', selectedCourse],
    queryFn: async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return [];

        const url = new URL(`${HETZNER_API_URL}/api/list`);
        if (selectedCourse) {
          url.searchParams.append('courseId', selectedCourse);
        }

        const response = await fetch(url.toString(), {
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
        });

        if (!response.ok) return [];
        return await response.json();
      } catch (error) {
        console.error('Error fetching Hetzner files:', error);
        return [];
      }
    },
    enabled: !!HETZNER_API_URL,
  });

  // Handle folder selection
  const handleFolderSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.info('לא נבחרו קבצים');
      return;
    }

    const videoFiles: UploadFile[] = [];
    let skippedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Only accept video files
      if (file.type.startsWith('video/')) {
        // Get relative path (folder structure)
        const relativePath = (file as any).webkitRelativePath || file.name;
        videoFiles.push({
          file,
          relativePath,
          status: 'pending',
          progress: 0,
        });
      } else {
        skippedCount++;
      }
    }

    if (videoFiles.length === 0) {
      toast.error('לא נמצאו קבצי וידאו בתיקייה');
      return;
    }

    setUploadFiles(videoFiles);
    const message = skippedCount > 0 
      ? `נמצאו ${videoFiles.length} סרטונים (${skippedCount} קבצים אחרים דולגו)`
      : `נמצאו ${videoFiles.length} סרטונים בתיקייה`;
    toast.success(message);
    
    // Reset input to allow selecting the same folder again
    e.target.value = '';
  };

  // Handle individual file selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      toast.info('לא נבחרו קבצים');
      return;
    }

    const videoFiles: UploadFile[] = [];
    let skippedCount = 0;
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('video/')) {
        videoFiles.push({
          file,
          relativePath: file.name,
          status: 'pending',
          progress: 0,
        });
      } else {
        skippedCount++;
      }
    }

    if (videoFiles.length === 0) {
      toast.error('לא נבחרו קבצי וידאו. אנא בחר קבצים בפורמט וידאו (mp4, mov, avi וכו\')');
      return;
    }

    setUploadFiles(videoFiles);
    const message = skippedCount > 0 
      ? `נבחרו ${videoFiles.length} סרטונים (${skippedCount} קבצים אחרים דולגו)`
      : `נבחרו ${videoFiles.length} סרטונים`;
    toast.success(message);
    
    // Reset input to allow selecting the same files again
    e.target.value = '';
  };

  // Remove file from upload list
  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Upload all files
  const handleUpload = async () => {
    if (!selectedCourse || selectedCourse === 'all') {
      toast.error('נא לבחור קורס');
      return;
    }
    if (uploadFiles.length === 0) {
      toast.error('נא לבחור קבצים להעלאה');
      return;
    }

    setIsUploading(true);
    setOverallProgress(0);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast.error('נא להתחבר מחדש');
      setIsUploading(false);
      return;
    }

    let completedCount = 0;
    const totalFiles = uploadFiles.length;

    for (let i = 0; i < uploadFiles.length; i++) {
      const uploadFile = uploadFiles[i];
      
      // Update status to uploading
      setUploadFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading' } : f
      ));

      try {
        // Extract folder name from path for organization
        const pathParts = uploadFile.relativePath.split('/');
        const folderName = pathParts.length > 1 ? pathParts[0] : null;
        const fileName = pathParts[pathParts.length - 1];

        // Create video record in Supabase first
        const { data: videoRecord, error: createError } = await supabase
          .from('videos')
          .insert({
            title: fileName.replace(/\.[^/.]+$/, ''),
            course_id: selectedCourse,
            chapter_id: selectedChapter && selectedChapter !== 'none' ? selectedChapter : null,
            duration: 0,
            video_url: '',
            is_published: true, // Auto-publish when admin uploads
          })
          .select()
          .single();

        if (createError) throw createError;

        // Upload to Hetzner
        const formData = new FormData();
        formData.append('video', uploadFile.file);
        formData.append('courseId', selectedCourse);
        formData.append('videoId', videoRecord.id);
        if (selectedChapter && selectedChapter !== 'none') {
          formData.append('chapterId', selectedChapter);
        }
        // Include folder structure in path
        if (folderName) {
          formData.append('folderName', folderName);
        }
        formData.append('relativePath', uploadFile.relativePath);

        const response = await fetch(`${HETZNER_API_URL}/api/upload`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Upload failed');
        }

        const result = await response.json();

        // Update video record with Hetzner path
        await supabase
          .from('videos')
          .update({
            hetzner_path: result.path,
            hls_path: result.hlsPath,
            video_url: result.path || '',
            duration: result.duration || 0,
          })
          .eq('id', videoRecord.id);

        // Update status to completed
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'completed', progress: 100 } : f
        ));

        completedCount++;
        setOverallProgress(Math.round((completedCount / totalFiles) * 100));

      } catch (error: any) {
        console.error('Upload error:', error);
        
        // Update status to error
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error', error: error.message } : f
        ));
      }
    }

    setIsUploading(false);
    
    // Refresh data
    queryClient.invalidateQueries({ queryKey: ['admin-hetzner-videos'] });
    queryClient.invalidateQueries({ queryKey: ['hetzner-files'] });

    const errorCount = uploadFiles.filter(f => f.status === 'error').length;
    if (errorCount === 0) {
      toast.success(`כל ${totalFiles} הסרטונים הועלו בהצלחה!`);
    } else {
      toast.warning(`הועלו ${completedCount} סרטונים, ${errorCount} נכשלו`);
    }
  };

  // Delete video
  const deleteMutation = useMutation({
    mutationFn: async ({ videoId, hetznerPath }: { videoId: string; hetznerPath: string }) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await fetch(`${HETZNER_API_URL}/api/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ videoId, path: hetznerPath }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Delete failed');
      }

      // Delete from Supabase
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hetzner-videos'] });
      queryClient.invalidateQueries({ queryKey: ['hetzner-files'] });
      toast.success('הסרטון נמחק בהצלחה!');
    },
    onError: (error: any) => {
      toast.error(`שגיאה במחיקה: ${error.message}`);
    },
  });

  // Sync Hetzner path to video
  const syncMutation = useMutation({
    mutationFn: async ({ videoId, hetznerPath }: { videoId: string; hetznerPath: string }) => {
      const { error } = await supabase
        .from('videos')
        .update({
          hetzner_path: hetznerPath,
          video_url: hetznerPath,
        })
        .eq('id', videoId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hetzner-videos'] });
      toast.success('הנתיב עודכן בהצלחה!');
    },
    onError: (error: any) => {
      toast.error(`שגיאה בעדכון: ${error.message}`);
    },
  });

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
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

  // Generate admin preview URL
  const getPreviewUrl = (video: VideoRecord) => {
    if (!video.hetzner_path) return null;
    // Use HLS path if available, otherwise use direct path
    const videoPath = video.hls_path || video.hetzner_path;
    return `${HETZNER_API_URL}${videoPath}`;
  };

  // Copy preview link to clipboard
  const handleCopyPreviewLink = async (video: VideoRecord) => {
    const previewUrl = getPreviewUrl(video);
    if (!previewUrl) {
      toast.error('הסרטון לא מקושר לשרת');
      return;
    }
    
    try {
      // Generate a token for admin preview
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('יש להתחבר מחדש');
        return;
      }

      // Create the preview link with video ID
      const adminPreviewUrl = `${window.location.origin}/admin/preview/${video.id}`;
      
      await navigator.clipboard.writeText(adminPreviewUrl);
      toast.success('הלינק הועתק ללוח!');
    } catch (err) {
      toast.error('שגיאה בהעתקת הלינק');
    }
  };

  // Open preview in new tab
  const handleOpenPreview = (video: VideoRecord) => {
    setPreviewVideo(video);
    setShowPreviewDialog(true);
  };

  // Find unlinked videos and orphan files
  const unlinkedVideos = videos.filter(v => !v.hetzner_path);
  const linkedPaths = new Set(videos.map(v => v.hetzner_path).filter(Boolean));
  const orphanFiles = hetznerFiles.filter((f: HetznerFile) => !linkedPaths.has(f.path));

  // Group upload files by folder
  const groupedFiles = uploadFiles.reduce((acc, file) => {
    const parts = file.relativePath.split('/');
    const folder = parts.length > 1 ? parts[0] : 'קבצים בודדים';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {} as Record<string, UploadFile[]>);

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
              <Server className="w-8 h-8 text-primary" />
              ניהול סרטונים - Hetzner
            </h1>
            <p className="text-muted-foreground mt-1">
              העלאה וניהול סרטונים בשרת Hetzner עם HLS streaming
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => {
              refetchVideos();
              refetchHetzner();
            }}
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">סה"כ סרטונים</p>
                  <p className="text-3xl font-bold">{videos.length}</p>
                </div>
                <Video className="w-10 h-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">מקושרים לשרת</p>
                  <p className="text-3xl font-bold text-green-600">
                    {videos.filter(v => v.hetzner_path).length}
                  </p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-600 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ממתינים לקישור</p>
                  <p className="text-3xl font-bold text-orange-500">
                    {unlinkedVideos.length}
                  </p>
                </div>
                <AlertCircle className="w-10 h-10 text-orange-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">קבצים בשרת</p>
                  <p className="text-3xl font-bold">{hetznerFiles.length}</p>
                </div>
                <HardDrive className="w-10 h-10 text-primary opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Upload Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              העלאת סרטונים לשרת Hetzner
            </CardTitle>
            <CardDescription>
              העלה קבצים בודדים או תיקיות שלמות. מבנה התיקיות יישמר בשרת.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* No courses warning */}
            {courses.length === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-yellow-800">אין קורסים במערכת</p>
                  <p className="text-sm text-yellow-700">
                    כדי להעלות סרטונים, קודם צריך ליצור קורס בעמוד "ניהול קורסים"
                  </p>
                </div>
              </div>
            )}

            {/* Course/Chapter Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">קורס *</label>
                <Select value={selectedCourse} onValueChange={setSelectedCourse} disabled={courses.length === 0}>
                  <SelectTrigger>
                    <SelectValue placeholder={courses.length === 0 ? "אין קורסים - צור קורס קודם" : "בחר קורס"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">פרק (אופציונלי)</label>
                <Select 
                  value={selectedChapter} 
                  onValueChange={setSelectedChapter}
                  disabled={!selectedCourse || selectedCourse === 'all'}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="בחר פרק" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">ללא פרק</SelectItem>
                    {chapters.map(chapter => (
                      <SelectItem key={chapter.id} value={chapter.id}>
                        {chapter.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Upload Type Tabs */}
            <Tabs value={uploadMode} onValueChange={(v) => setUploadMode(v as 'files' | 'folder')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <FileVideo className="w-4 h-4" />
                  קבצים בודדים
                </TabsTrigger>
                <TabsTrigger value="folder" className="flex items-center gap-2">
                  <FolderUp className="w-4 h-4" />
                  תיקייה שלמה
                </TabsTrigger>
              </TabsList>

              <TabsContent value="files" className="mt-4">
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FileVideo className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    גרור קבצי וידאו לכאן או לחץ לבחירה
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="video/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading || courses.length === 0 || !selectedCourse || selectedCourse === 'all'}
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    בחר קבצים
                  </Button>
                  {(!selectedCourse || selectedCourse === 'all') && courses.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">יש לבחור קורס קודם</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="folder" className="mt-4">
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FolderUp className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    בחר תיקייה שלמה להעלאה - מבנה התיקיות יישמר
                  </p>
                  <input
                    ref={folderInputRef}
                    type="file"
                    // @ts-ignore - webkitdirectory is not in the type definitions
                    webkitdirectory=""
                    directory=""
                    multiple
                    onChange={handleFolderSelect}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => folderInputRef.current?.click()}
                    disabled={isUploading || courses.length === 0 || !selectedCourse || selectedCourse === 'all'}
                  >
                    <FolderOpen className="w-4 h-4 ml-2" />
                    בחר תיקייה
                  </Button>
                  {(!selectedCourse || selectedCourse === 'all') && courses.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">יש לבחור קורס קודם</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Selected Files List */}
            {uploadFiles.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-4 max-h-96 overflow-y-auto">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">קבצים נבחרים ({uploadFiles.length})</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setUploadFiles([])}
                    disabled={isUploading}
                  >
                    <X className="w-4 h-4 ml-1" />
                    נקה הכל
                  </Button>
                </div>

                {Object.entries(groupedFiles).map(([folder, files]) => (
                  <div key={folder} className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <FolderOpen className="w-4 h-4" />
                      {folder}
                      <Badge variant="secondary">{files.length}</Badge>
                    </div>
                    <div className="space-y-1 mr-6">
                      {files.map((file, idx) => {
                        const globalIdx = uploadFiles.findIndex(f => f === file);
                        return (
                          <div 
                            key={idx} 
                            className={`flex items-center justify-between p-2 rounded text-sm ${
                              file.status === 'completed' ? 'bg-green-500/10' :
                              file.status === 'error' ? 'bg-red-500/10' :
                              file.status === 'uploading' ? 'bg-blue-500/10' :
                              'bg-background'
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              {file.status === 'completed' && <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />}
                              {file.status === 'error' && <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />}
                              {file.status === 'uploading' && <RefreshCw className="w-4 h-4 text-blue-600 animate-spin flex-shrink-0" />}
                              {file.status === 'pending' && <File className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                              <span className="truncate">{file.file.name}</span>
                              <span className="text-muted-foreground flex-shrink-0">
                                ({formatFileSize(file.file.size)})
                              </span>
                            </div>
                            {file.status === 'pending' && !isUploading && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => removeFile(globalIdx)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            )}
                            {file.error && (
                              <span className="text-xs text-red-600">{file.error}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Progress */}
            {isUploading && (
              <div className="space-y-2">
                <Progress value={overallProgress} />
                <p className="text-sm text-muted-foreground text-center">
                  מעלה... {overallProgress}%
                </p>
              </div>
            )}

            {/* Upload Button */}
            <Button
              onClick={handleUpload}
              disabled={isUploading || uploadFiles.length === 0 || !selectedCourse || selectedCourse === 'all'}
              className="w-full"
              size="lg"
            >
              <Upload className="w-5 h-5 ml-2" />
              {isUploading ? 'מעלה...' : `העלה ${uploadFiles.length} קבצים לשרת`}
            </Button>
          </CardContent>
        </Card>

        {/* Videos Table */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                סרטונים ({videos.length})
              </CardTitle>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="סנן לפי קורס" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הקורסים</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {videosLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">טוען...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">אין סרטונים</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">שם</TableHead>
                    <TableHead className="text-right">קורס / פרק</TableHead>
                    <TableHead className="text-right">משך</TableHead>
                    <TableHead className="text-right">סטטוס שרת</TableHead>
                    <TableHead className="text-right">HLS</TableHead>
                    <TableHead className="text-center">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map(video => (
                    <TableRow key={video.id}>
                      <TableCell className="font-medium">{video.title}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {video.courses?.title || '-'}
                        {video.course_chapters?.title && (
                          <span className="text-primary"> &gt; {video.course_chapters.title}</span>
                        )}
                      </TableCell>
                      <TableCell>{formatDuration(video.duration)}</TableCell>
                      <TableCell>
                        {video.hetzner_path ? (
                          <Badge className="bg-green-500">
                            <CheckCircle2 className="w-3 h-3 ml-1" />
                            מקושר
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-orange-500 border-orange-500">
                            <AlertCircle className="w-3 h-3 ml-1" />
                            לא מקושר
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {video.hls_path ? (
                          <Badge variant="secondary">
                            <CheckCircle2 className="w-3 h-3 ml-1" />
                            זמין
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          {/* Preview buttons - only for linked videos */}
                          {video.hetzner_path && (
                            <>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleOpenPreview(video)}
                                title="צפה בסרטון"
                              >
                                <Play className="w-4 h-4 text-green-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleCopyPreviewLink(video)}
                                title="העתק לינק Preview"
                              >
                                <Copy className="w-4 h-4 text-blue-600" />
                              </Button>
                            </>
                          )}
                          
                          {!video.hetzner_path && orphanFiles.length > 0 && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" title="קשר לקובץ">
                                  <Link2 className="w-4 h-4 text-primary" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent dir="rtl">
                                <DialogHeader>
                                  <DialogTitle>קישור לקובץ בשרת</DialogTitle>
                                  <DialogDescription>
                                    בחר קובץ מהשרת לקשר לסרטון "{video.title}"
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="max-h-60 overflow-y-auto">
                                  {orphanFiles.map((file: HetznerFile) => (
                                    <div
                                      key={file.path}
                                      className="flex items-center justify-between p-2 hover:bg-muted rounded cursor-pointer"
                                      onClick={() => syncMutation.mutate({ videoId: video.id, hetznerPath: file.path })}
                                    >
                                      <div className="flex items-center gap-2">
                                        <FileVideo className="w-4 h-4 text-muted-foreground" />
                                        <span className="text-sm">{file.path}</span>
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {formatFileSize(file.size)}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {video.hetzner_path && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                if (confirm('האם אתה בטוח שברצונך למחוק את הסרטון?')) {
                                  deleteMutation.mutate({
                                    videoId: video.id,
                                    hetznerPath: video.hetzner_path!,
                                  });
                                }
                              }}
                              title="מחק"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Hetzner Files */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              קבצים בשרת Hetzner ({hetznerFiles.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hetznerLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">טוען...</p>
              </div>
            ) : hetznerFiles.length === 0 ? (
              <div className="text-center py-8">
                <HardDrive className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">אין קבצים בשרת</p>
              </div>
            ) : (
              <div className="grid gap-2">
                {hetznerFiles.map((file: HetznerFile) => (
                  <div
                    key={file.path}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <FileVideo className="w-5 h-5 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{file.path}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.size)} • {new Date(file.modified).toLocaleDateString('he-IL')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {linkedPaths.has(file.path) ? (
                        <Badge className="bg-green-500">מקושר</Badge>
                      ) : (
                        <Badge variant="outline" className="text-orange-500">לא מקושר</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Video Preview Dialog */}
        <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
          <DialogContent className="max-w-4xl" dir="rtl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Play className="w-5 h-5 text-green-600" />
                תצוגה מקדימה: {previewVideo?.title}
              </DialogTitle>
              <DialogDescription>
                {previewVideo?.courses?.title}
                {previewVideo?.course_chapters?.title && (
                  <span> &gt; {previewVideo.course_chapters.title}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {previewVideo && previewVideo.hetzner_path && (
              <div className="space-y-4">
                {/* Video Player */}
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    key={previewVideo.id}
                    controls
                    autoPlay
                    className="w-full h-full"
                    src={`${HETZNER_API_URL}${previewVideo.hls_path || previewVideo.hetzner_path}`}
                  >
                    הדפדפן שלך לא תומך בנגן וידאו
                  </video>
                </div>

                {/* Video Info */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground">משך</p>
                    <p className="font-medium">{formatDuration(previewVideo.duration)}</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-muted-foreground">סטטוס</p>
                    <p className="font-medium">{previewVideo.is_published ? 'מפורסם' : 'טיוטה'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => handleCopyPreviewLink(previewVideo)}
                  >
                    <Copy className="w-4 h-4 ml-2" />
                    העתק לינק Preview
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const url = `${HETZNER_API_URL}${previewVideo.hls_path || previewVideo.hetzner_path}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 ml-2" />
                    פתח בחלון חדש
                  </Button>
                </div>

                {/* Warning */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-800">
                    <strong>שים לב:</strong> לינק ה-Preview זמין רק למנהלים. 
                    משתמשים רגילים לא יוכלו לגשת לסרטון ללא הרשאה מתאימה.
                  </p>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminHetznerVideosPage;
