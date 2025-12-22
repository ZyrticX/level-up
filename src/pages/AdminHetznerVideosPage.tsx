/**
 * Admin Hetzner Videos Management Page
 * 
 * Features:
 * - Hierarchical upload: Institution → Department → Course → Chapter → Topic → Videos
 * - Upload individual videos or entire folders to Hetzner server
 * - Maintain folder structure
 * - View and manage videos on Hetzner
 * - Sync video paths with Supabase
 * - Monitor upload progress
 */

import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
  ExternalLink,
  Plus,
  Landmark,
  BookOpen,
  GraduationCap,
  Layers,
  FileText,
  ChevronUp,
  ChevronDown,
  GripVertical
} from 'lucide-react';

// Hetzner config
const HETZNER_API_URL = import.meta.env.VITE_HETZNER_API_URL || '';

interface Institution {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
  institution_id: string;
}

interface Course {
  id: string;
  title: string;
  institution: string | null;
  department: string | null;
}

interface Chapter {
  id: string;
  title: string;
  course_id: string;
  order_index: number;
}

interface Topic {
  id: string;
  title: string;
  chapter_id: string;
  order_index: number;
}

interface VideoRecord {
  id: string;
  title: string;
  course_id: string;
  chapter_id: string | null;
  topic_id: string | null;
  hetzner_path: string | null;
  hls_path: string | null;
  duration: number;
  is_published: boolean;
  order_index: number | null;
  courses?: { title: string };
  course_chapters?: { title: string };
  course_topics?: { title: string };
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
  
  // Selection state - hierarchical
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  
  // Upload state
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const [uploadMode, setUploadMode] = useState<'files' | 'folder'>('files');
  
  // Preview state
  const [previewVideo, setPreviewVideo] = useState<VideoRecord | null>(null);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  
  // Inline creation state
  const [newChapterName, setNewChapterName] = useState('');
  const [newTopicName, setNewTopicName] = useState('');
  const [showNewChapter, setShowNewChapter] = useState(false);
  const [showNewTopic, setShowNewTopic] = useState(false);

  // Fetch institutions
  const { data: institutions = [] } = useQuery({
    queryKey: ['upload-institutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('id, name')
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Institution[];
    },
  });

  // Fetch departments for selected institution
  const { data: departments = [] } = useQuery({
    queryKey: ['upload-departments', selectedInstitution],
    queryFn: async () => {
      if (!selectedInstitution) return [];
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, institution_id')
        .eq('institution_id', selectedInstitution)
        .eq('is_active', true)
        .order('name');
      if (error) throw error;
      return data as Department[];
    },
    enabled: !!selectedInstitution,
  });

  // Fetch courses for selected institution/department
  const { data: courses = [] } = useQuery({
    queryKey: ['upload-courses', selectedInstitution, selectedDepartment],
    queryFn: async () => {
      if (!selectedInstitution) return [];
      
      // Get institution name
      const institution = institutions.find(i => i.id === selectedInstitution);
      if (!institution) return [];
      
      let query = supabase
        .from('courses')
        .select('id, title, institution, department')
        .eq('institution', institution.name);
      
      if (selectedDepartment) {
        const department = departments.find(d => d.id === selectedDepartment);
        if (department) {
          query = query.eq('department', department.name);
        }
      }
      
      const { data, error } = await query.order('title');
      if (error) throw error;
      return data as Course[];
    },
    enabled: !!selectedInstitution,
  });

  // Fetch chapters for selected course
  const { data: chapters = [] } = useQuery({
    queryKey: ['upload-chapters', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const { data, error } = await supabase
        .from('course_chapters')
        .select('id, title, course_id, order_index')
        .eq('course_id', selectedCourse)
        .order('order_index');
      if (error) throw error;
      return data as Chapter[];
    },
    enabled: !!selectedCourse,
  });

  // Fetch topics for selected chapter
  const { data: topics = [] } = useQuery({
    queryKey: ['upload-topics', selectedChapter],
    queryFn: async () => {
      if (!selectedChapter) return [];
      const { data, error } = await supabase
        .from('course_topics')
        .select('id, title, chapter_id, order_index')
        .eq('chapter_id', selectedChapter)
        .order('order_index');
      if (error) throw error;
      return data as Topic[];
    },
    enabled: !!selectedChapter,
  });

  // Fetch videos from Supabase - filtered by selected topic
  const { data: videos = [], isLoading: videosLoading, refetch: refetchVideos } = useQuery({
    queryKey: ['admin-hetzner-videos', selectedCourse, selectedChapter, selectedTopic],
    queryFn: async () => {
      // Only fetch if topic is selected
      if (!selectedTopic) return [];
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          course_id,
          chapter_id,
          topic_id,
          hetzner_path,
          hls_path,
          duration,
          is_published,
          order_index,
          courses(title),
          course_chapters(title),
          course_topics(title)
        `)
        .eq('topic_id', selectedTopic)
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as VideoRecord[];
    },
    enabled: !!selectedTopic,
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

  // Create chapter mutation
  const createChapterMutation = useMutation({
    mutationFn: async (name: string) => {
      const maxOrder = chapters.length > 0 
        ? Math.max(...chapters.map(c => c.order_index)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('course_chapters')
        .insert({
          course_id: selectedCourse,
          title: name,
          order_index: maxOrder,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['upload-chapters'] });
      setSelectedChapter(data.id);
      setNewChapterName('');
      setShowNewChapter(false);
      toast.success('הפרק נוצר בהצלחה!');
    },
    onError: (error: any) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });

  // Create topic mutation
  const createTopicMutation = useMutation({
    mutationFn: async (name: string) => {
      const maxOrder = topics.length > 0 
        ? Math.max(...topics.map(t => t.order_index)) + 1 
        : 0;
      
      const { data, error } = await supabase
        .from('course_topics')
        .insert({
          chapter_id: selectedChapter,
          title: name,
          order_index: maxOrder,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['upload-topics'] });
      setSelectedTopic(data.id);
      setNewTopicName('');
      setShowNewTopic(false);
      toast.success('הנושא נוצר בהצלחה!');
    },
    onError: (error: any) => {
      toast.error(`שגיאה: ${error.message}`);
    },
  });

  // Handle institution change - reset downstream
  const handleInstitutionChange = (value: string) => {
    setSelectedInstitution(value);
    setSelectedDepartment('');
    setSelectedCourse('');
    setSelectedChapter('');
    setSelectedTopic('');
  };

  // Handle department change - reset downstream
  const handleDepartmentChange = (value: string) => {
    setSelectedDepartment(value);
    setSelectedCourse('');
    setSelectedChapter('');
    setSelectedTopic('');
  };

  // Handle course change - reset downstream
  const handleCourseChange = (value: string) => {
    setSelectedCourse(value);
    setSelectedChapter('');
    setSelectedTopic('');
  };

  // Handle chapter change - reset downstream
  const handleChapterChange = (value: string) => {
    setSelectedChapter(value);
    setSelectedTopic('');
  };

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
      if (file.type.startsWith('video/')) {
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
      toast.error('לא נבחרו קבצי וידאו');
      return;
    }

    setUploadFiles(videoFiles);
    const message = skippedCount > 0 
      ? `נבחרו ${videoFiles.length} סרטונים (${skippedCount} קבצים אחרים דולגו)`
      : `נבחרו ${videoFiles.length} סרטונים`;
    toast.success(message);
    e.target.value = '';
  };

  // Remove file from upload list
  const removeFile = (index: number) => {
    setUploadFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Check if can upload
  const canUpload = selectedCourse && selectedChapter && selectedTopic && uploadFiles.length > 0;

  // Upload all files with real progress tracking
  const handleUpload = async () => {
    if (!canUpload) {
      toast.error('יש לבחור קורס, פרק ונושא לפני ההעלאה');
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
    const fileProgresses: number[] = new Array(totalFiles).fill(0);

    const updateOverallProgress = () => {
      const totalProgress = fileProgresses.reduce((sum, p) => sum + p, 0);
      setOverallProgress(Math.round(totalProgress / totalFiles));
    };

    // Create a copy of files to upload to avoid state mutation issues
    const filesToUpload = [...uploadFiles];
    
    for (let i = 0; i < filesToUpload.length; i++) {
      const uploadFile = filesToUpload[i];
      
      setUploadFiles(prev => prev.map((f, idx) => 
        idx === i ? { ...f, status: 'uploading', progress: 0 } : f
      ));

      // Variable to store videoRecord ID for cleanup on error
      let videoRecordId: string | null = null;

      try {
        // Refresh session for each file (in case of long uploads)
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (!currentSession) {
          throw new Error('Session expired - please login again');
        }

        const pathParts = uploadFile.relativePath.split('/');
        const folderName = pathParts.length > 1 ? pathParts[0] : null;
        const fileName = pathParts[pathParts.length - 1];
        const videoTitle = fileName.replace(/\.[^/.]+$/, '');

        console.log(`Uploading file ${i + 1}/${filesToUpload.length}: ${fileName}`, {
          folderName,
          relativePath: uploadFile.relativePath,
          fileSize: uploadFile.file.size,
        });

        // Check for duplicate video in same location
        const { data: existingVideo } = await supabase
          .from('videos')
          .select('id, title, hetzner_path')
          .eq('course_id', selectedCourse)
          .eq('chapter_id', selectedChapter)
          .eq('topic_id', selectedTopic)
          .eq('title', videoTitle)
          .maybeSingle();

        if (existingVideo) {
          console.log('Duplicate video found:', existingVideo);
          // Skip this file - mark as duplicate
          fileProgresses[i] = 100;
          updateOverallProgress();
          setUploadFiles(prev => prev.map((f, idx) => 
            idx === i ? { ...f, status: 'error', error: 'קובץ כפול - כבר קיים במערכת', progress: 0 } : f
          ));
          toast.warning(`דילוג על "${videoTitle}" - כבר קיים במערכת`);
          continue; // Skip to next file
        }

        // Create video record in Supabase
        const { data: videoRecord, error: createError } = await supabase
          .from('videos')
          .insert({
            title: videoTitle,
            course_id: selectedCourse,
            chapter_id: selectedChapter,
            topic_id: selectedTopic,
            duration: 0,
            video_url: '',
            is_published: true,
          })
          .select()
          .single();

        if (createError) {
          console.error('Supabase insert error:', createError);
          throw createError;
        }

        videoRecordId = videoRecord.id;
        console.log('Video record created:', videoRecordId);

        // Upload to Hetzner using XMLHttpRequest for progress tracking
        const formData = new FormData();
        formData.append('video', uploadFile.file);
        formData.append('courseId', selectedCourse);
        formData.append('videoId', videoRecord.id);
        formData.append('chapterId', selectedChapter);
        formData.append('topicId', selectedTopic);
        if (folderName) {
          formData.append('folderName', folderName);
        }
        formData.append('relativePath', uploadFile.relativePath);

        const result = await new Promise<any>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          
          // Track upload progress
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              fileProgresses[i] = percentComplete;
              updateOverallProgress();
              setUploadFiles(prev => prev.map((f, idx) => 
                idx === i ? { ...f, progress: percentComplete } : f
              ));
            }
          };
          
          xhr.onload = () => {
            console.log('XHR onload:', xhr.status, xhr.responseText.substring(0, 200));
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                resolve(response);
              } catch (e) {
                reject(new Error('Invalid response from server'));
              }
            } else {
              try {
                const errorData = JSON.parse(xhr.responseText);
                reject(new Error(errorData.error || `Upload failed: ${xhr.status}`));
              } catch (e) {
                reject(new Error(`Upload failed: ${xhr.status}`));
              }
            }
          };
          
          xhr.onerror = () => {
            console.error('XHR onerror');
            reject(new Error('Network error - check your connection'));
          };
          xhr.ontimeout = () => {
            console.error('XHR ontimeout');
            reject(new Error('Upload timeout - file may be too large'));
          };
          
          xhr.open('POST', `${HETZNER_API_URL}/api/upload`);
          xhr.setRequestHeader('Authorization', `Bearer ${currentSession.access_token}`);
          xhr.timeout = 3600000; // 1 hour timeout for large files
          xhr.send(formData);
        });

        console.log('Upload result:', result);

        // Update video record with Hetzner path
        const { error: updateError } = await supabase
          .from('videos')
          .update({
            hetzner_path: result.path,
            hls_path: result.hlsPath,
            video_url: result.path || '',
            duration: result.duration || 0,
          })
          .eq('id', videoRecord.id);

        if (updateError) {
          console.error('Supabase update error:', updateError);
          // Don't throw - file is uploaded, just log warning
          toast.warning(`קובץ הועלה אך עדכון DB נכשל: ${fileName}`);
        }

        fileProgresses[i] = 100;
        updateOverallProgress();
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'completed', progress: 100 } : f
        ));

        completedCount++;
        toast.success(`הועלה: ${fileName}`, { duration: 2000 });

      } catch (error: any) {
        console.error('Upload error for file:', uploadFile.file.name, error);
        
        // If video record was created but upload failed, delete the orphan record
        if (videoRecordId) {
          console.log('Cleaning up orphan video record:', videoRecordId);
          await supabase.from('videos').delete().eq('id', videoRecordId);
        }
        
        fileProgresses[i] = 0;
        updateOverallProgress();
        setUploadFiles(prev => prev.map((f, idx) => 
          idx === i ? { ...f, status: 'error', error: error.message } : f
        ));
        toast.error(`שגיאה ב-${uploadFile.file.name}: ${error.message}`);
      }
    }

    setIsUploading(false);
    queryClient.invalidateQueries({ queryKey: ['admin-hetzner-videos'] });
    queryClient.invalidateQueries({ queryKey: ['hetzner-files'] });

    // Count results - check current state
    const currentFiles = uploadFiles;
    const duplicateCount = currentFiles.filter(f => f.error === 'קובץ כפול - כבר קיים במערכת').length;
    const errorCount = currentFiles.filter(f => f.status === 'error' && f.error !== 'קובץ כפול - כבר קיים במערכת').length;
    
    if (errorCount === 0 && duplicateCount === 0) {
      toast.success(`כל ${totalFiles} הסרטונים הועלו בהצלחה!`);
    } else if (errorCount === 0 && duplicateCount > 0) {
      toast.success(`הועלו ${completedCount} סרטונים, ${duplicateCount} כפולים דולגו`);
    } else {
      toast.warning(`הועלו ${completedCount} סרטונים, ${duplicateCount} כפולים, ${errorCount} נכשלו`);
    }
  };

  // Delete video mutation
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

  // Sync mutation
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

  // Reorder video mutation
  const reorderMutation = useMutation({
    mutationFn: async ({ videoId, direction }: { videoId: string; direction: 'up' | 'down' }) => {
      const currentIndex = videos.findIndex(v => v.id === videoId);
      if (currentIndex === -1) throw new Error('Video not found');
      
      const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= videos.length) {
        throw new Error('Cannot move video further');
      }

      const currentVideo = videos[currentIndex];
      const targetVideo = videos[targetIndex];

      // Swap order_index values
      const currentOrderIndex = currentVideo.order_index ?? currentIndex;
      const targetOrderIndex = targetVideo.order_index ?? targetIndex;

      // Update both videos
      const { error: error1 } = await supabase
        .from('videos')
        .update({ order_index: targetOrderIndex })
        .eq('id', currentVideo.id);

      if (error1) throw error1;

      const { error: error2 } = await supabase
        .from('videos')
        .update({ order_index: currentOrderIndex })
        .eq('id', targetVideo.id);

      if (error2) throw error2;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-hetzner-videos'] });
    },
    onError: (error: any) => {
      toast.error(`שגיאה בשינוי סדר: ${error.message}`);
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

  const getPreviewUrl = (video: VideoRecord) => {
    if (!video.hetzner_path) return null;
    return `${HETZNER_API_URL}${video.hetzner_path}`;
  };

  const handleCopyPreviewLink = async (video: VideoRecord) => {
    const previewUrl = getPreviewUrl(video);
    if (!previewUrl) {
      toast.error('הסרטון לא מקושר לשרת');
      return;
    }
    
    try {
      const adminPreviewUrl = `${window.location.origin}/admin/preview/${video.id}`;
      await navigator.clipboard.writeText(adminPreviewUrl);
      toast.success('הלינק הועתק ללוח!');
    } catch (err) {
      toast.error('שגיאה בהעתקת הלינק');
    }
  };

  const handleOpenPreview = (video: VideoRecord) => {
    setPreviewVideo(video);
    setShowPreviewDialog(true);
  };

  const unlinkedVideos = videos.filter(v => !v.hetzner_path);
  const linkedPaths = new Set(videos.map(v => v.hetzner_path).filter(Boolean));
  const orphanFiles = hetznerFiles.filter((f: HetznerFile) => !linkedPaths.has(f.path));

  // Cleanup orphan video records (no hetzner_path)
  const cleanupOrphansMutation = useMutation({
    mutationFn: async () => {
      const orphanIds = unlinkedVideos.map(v => v.id);
      if (orphanIds.length === 0) return 0;
      
      const { error } = await supabase
        .from('videos')
        .delete()
        .in('id', orphanIds);
      
      if (error) throw error;
      return orphanIds.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['admin-hetzner-videos'] });
      toast.success(`נמחקו ${count} רשומות יתומות`);
    },
    onError: (error: any) => {
      toast.error(`שגיאה במחיקה: ${error.message}`);
    },
  });

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
              {unlinkedVideos.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 w-full text-orange-600 border-orange-300 hover:bg-orange-50"
                  onClick={() => {
                    if (confirm(`למחוק ${unlinkedVideos.length} רשומות יתומות?`)) {
                      cleanupOrphansMutation.mutate();
                    }
                  }}
                  disabled={cleanupOrphansMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 ml-2" />
                  {cleanupOrphansMutation.isPending ? 'מוחק...' : 'נקה רשומות יתומות'}
                </Button>
              )}
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
              בחר מוסד → תחום → קורס → פרק → נושא ואז העלה סרטונים
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hierarchical Selection */}
            <div className="bg-muted/30 rounded-xl p-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2 mb-4">
                <Layers className="w-5 h-5 text-primary" />
                בחר מיקום להעלאה
              </h3>
              
              {/* Row 1: Institution & Department */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Landmark className="w-4 h-4" />
                    מוסד לימודים *
                  </Label>
                  <Select value={selectedInstitution} onValueChange={handleInstitutionChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="בחר מוסד" />
                    </SelectTrigger>
                    <SelectContent>
                      {institutions.map(inst => (
                        <SelectItem key={inst.id} value={inst.id}>
                          {inst.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    תחום/מחלקה *
                  </Label>
                  <Select 
                    value={selectedDepartment} 
                    onValueChange={handleDepartmentChange}
                    disabled={!selectedInstitution}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={selectedInstitution ? "בחר תחום" : "בחר מוסד קודם"} />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map(dept => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Course */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  קורס *
                </Label>
                <Select 
                  value={selectedCourse} 
                  onValueChange={handleCourseChange}
                  disabled={!selectedDepartment}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedDepartment ? "בחר קורס" : "בחר תחום קודם"} />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedDepartment && courses.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    אין קורסים בתחום זה. צור קורס חדש בעמוד "ניהול קורסים"
                  </p>
                )}
              </div>

              {/* Row 3: Chapter with inline creation */}
              {selectedCourse && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <Layers className="w-4 h-4" />
                      פרק *
                    </Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowNewChapter(!showNewChapter)}
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      פרק חדש
                    </Button>
                  </div>
                  
                  {showNewChapter ? (
                    <div className="flex gap-2">
                      <Input
                        value={newChapterName}
                        onChange={(e) => setNewChapterName(e.target.value)}
                        placeholder="שם הפרק..."
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => createChapterMutation.mutate(newChapterName)}
                        disabled={!newChapterName.trim() || createChapterMutation.isPending}
                      >
                        צור
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          setShowNewChapter(false);
                          setNewChapterName('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Select value={selectedChapter} onValueChange={handleChapterChange}>
                      <SelectTrigger>
                        <SelectValue placeholder={chapters.length === 0 ? "צור פרק חדש" : "בחר פרק"} />
                      </SelectTrigger>
                      <SelectContent>
                        {chapters.map(chapter => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* Row 4: Topic with inline creation */}
              {selectedChapter && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      נושא *
                    </Label>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setShowNewTopic(!showNewTopic)}
                    >
                      <Plus className="w-4 h-4 ml-1" />
                      נושא חדש
                    </Button>
                  </div>
                  
                  {showNewTopic ? (
                    <div className="flex gap-2">
                      <Input
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        placeholder="שם הנושא..."
                        className="flex-1"
                      />
                      <Button 
                        onClick={() => createTopicMutation.mutate(newTopicName)}
                        disabled={!newTopicName.trim() || createTopicMutation.isPending}
                      >
                        צור
                      </Button>
                      <Button 
                        variant="ghost"
                        onClick={() => {
                          setShowNewTopic(false);
                          setNewTopicName('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <Select value={selectedTopic} onValueChange={setSelectedTopic}>
                      <SelectTrigger>
                        <SelectValue placeholder={topics.length === 0 ? "צור נושא חדש" : "בחר נושא"} />
                      </SelectTrigger>
                      <SelectContent>
                        {topics.map(topic => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              )}

              {/* Selection Summary */}
              {selectedTopic && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-green-800 font-medium">
                    ✓ מוכן להעלאה
                  </p>
                  <p className="text-xs text-green-700 mt-1">
                    הסרטונים יועלו ל: {institutions.find(i => i.id === selectedInstitution)?.name} → {departments.find(d => d.id === selectedDepartment)?.name} → {courses.find(c => c.id === selectedCourse)?.title} → {chapters.find(c => c.id === selectedChapter)?.title} → {topics.find(t => t.id === selectedTopic)?.title}
                  </p>
                </div>
              )}
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
                    disabled={isUploading || !selectedTopic}
                  >
                    <Upload className="w-4 h-4 ml-2" />
                    בחר קבצים
                  </Button>
                  {!selectedTopic && (
                    <p className="text-sm text-muted-foreground mt-2">יש לבחור מוסד, תחום, קורס, פרק ונושא קודם</p>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="folder" className="mt-4">
                <div className="border-2 border-dashed border-primary/30 rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <FolderUp className="w-12 h-12 text-primary/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    בחר תיקייה שלמה להעלאה
                  </p>
                  <input
                    ref={folderInputRef}
                    type="file"
                    // @ts-ignore
                    webkitdirectory=""
                    directory=""
                    multiple
                    onChange={handleFolderSelect}
                    className="hidden"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => folderInputRef.current?.click()}
                    disabled={isUploading || !selectedTopic}
                  >
                    <FolderOpen className="w-4 h-4 ml-2" />
                    בחר תיקייה
                  </Button>
                  {!selectedTopic && (
                    <p className="text-sm text-muted-foreground mt-2">יש לבחור מוסד, תחום, קורס, פרק ונושא קודם</p>
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
                            className={`flex flex-col p-2 rounded text-sm ${
                              file.status === 'completed' ? 'bg-green-500/10' :
                              file.status === 'error' ? 'bg-red-500/10' :
                              file.status === 'uploading' ? 'bg-blue-500/10' :
                              'bg-background'
                            }`}
                          >
                            <div className="flex items-center justify-between">
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
                              <div className="flex items-center gap-2">
                                {file.status === 'uploading' && (
                                  <span className="text-xs font-medium text-blue-600">{file.progress}%</span>
                                )}
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
                              </div>
                            </div>
                            {file.status === 'uploading' && (
                              <div className="mt-2">
                                <Progress value={file.progress} className="h-1" />
                              </div>
                            )}
                            {file.error && (
                              <span className="text-xs text-red-600 mt-1">{file.error}</span>
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
              disabled={!canUpload || isUploading}
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
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Video className="w-5 h-5" />
                  סרטונים בנושא הנבחר ({videos.length})
                </CardTitle>
                {selectedTopic && topics.find(t => t.id === selectedTopic) && (
                  <CardDescription className="mt-1">
                    {institutions.find(i => i.id === selectedInstitution)?.name} → {departments.find(d => d.id === selectedDepartment)?.name} → {courses.find(c => c.id === selectedCourse)?.title} → {chapters.find(c => c.id === selectedChapter)?.title} → {topics.find(t => t.id === selectedTopic)?.title}
                  </CardDescription>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {!selectedTopic ? (
              <div className="text-center py-8">
                <Layers className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">בחר נושא למעלה כדי לראות את הסרטונים</p>
              </div>
            ) : videosLoading ? (
              <div className="text-center py-8">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">טוען...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-8">
                <Video className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">אין סרטונים בנושא זה</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-center w-20">סדר</TableHead>
                    <TableHead className="text-right">שם</TableHead>
                    <TableHead className="text-right">משך</TableHead>
                    <TableHead className="text-right">סטטוס</TableHead>
                    <TableHead className="text-center">פעולות</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {videos.map((video, index) => (
                    <TableRow key={video.id}>
                      <TableCell>
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => reorderMutation.mutate({ videoId: video.id, direction: 'up' })}
                            disabled={index === 0 || reorderMutation.isPending}
                            title="הזז למעלה"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </Button>
                          <span className="text-sm text-muted-foreground w-6 text-center">{index + 1}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => reorderMutation.mutate({ videoId: video.id, direction: 'down' })}
                            disabled={index === videos.length - 1 || reorderMutation.isPending}
                            title="הזז למטה"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{video.title}</TableCell>
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
                        <div className="flex items-center justify-center gap-2">
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
                {previewVideo?.course_topics?.title && (
                  <span> &gt; {previewVideo.course_topics.title}</span>
                )}
              </DialogDescription>
            </DialogHeader>
            
            {previewVideo && previewVideo.hetzner_path && (
              <div className="space-y-4">
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    key={previewVideo.id}
                    controls
                    autoPlay
                    className="w-full h-full"
                    src={`${HETZNER_API_URL}${previewVideo.hetzner_path}`}
                  >
                    הדפדפן שלך לא תומך בנגן וידאו
                  </video>
                </div>

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
                      const url = `${HETZNER_API_URL}${previewVideo.hetzner_path}`;
                      window.open(url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 ml-2" />
                    פתח בחלון חדש
                  </Button>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-yellow-800">
                    <strong>שים לב:</strong> לינק ה-Preview זמין רק למנהלים.
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
