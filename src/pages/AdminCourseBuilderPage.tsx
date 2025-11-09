import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  GripVertical,
  Eye,
  BookOpen,
  FolderOpen,
  Video as VideoIcon
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Video {
  id: string;
  title: string;
  duration: number;
  order_index: number;
}

interface Topic {
  id: string;
  title: string;
  videos: Video[];
  order_index: number;
}

interface Chapter {
  id: string;
  title: string;
  topics: Topic[];
  order_index: number;
}

interface CourseStructure {
  id: string;
  title: string;
  chapters: Chapter[];
}

// Sortable Video Component
const SortableVideo = ({ video, videoNumber, chapterId, topicId, onEdit, onView }: {
  video: Video;
  videoNumber: number;
  chapterId: string;
  topicId: string;
  onEdit: (id: string, title: string) => void;
  onView: (id: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: video.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded-lg group border border-transparent hover:border-primary/20"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      <VideoIcon className="w-4 h-4 text-primary flex-shrink-0" />
      <span className="text-sm font-mono text-muted-foreground w-8">
        {videoNumber}.
      </span>
      <span className="text-sm flex-1 text-right">{video.title}</span>
      <Badge variant="outline" className="text-xs">
        {formatDuration(video.duration)}
      </Badge>
      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onEdit(video.id, video.title)}
        >
          <Edit className="w-3 h-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => onView(video.id)}
        >
          <Eye className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
};

// Sortable Chapter Component
const SortableChapter = ({ chapter, chapterIndex, courseStructure, expandedChapters, onToggleChapter, onEditChapter, onEditVideo, onAddTopic, onAddVideo, selectedCourse, navigate }: {
  chapter: Chapter;
  chapterIndex: number;
  courseStructure: CourseStructure | null;
  expandedChapters: Set<string>;
  onToggleChapter: (id: string) => void;
  onEditChapter: (id: string, title: string) => void;
  onEditVideo: (id: string, title: string) => void;
  onAddTopic: (chapterId: string) => void;
  onAddVideo: (chapterId: string) => void;
  selectedCourse: string;
  navigate: (path: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: chapter.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getVideoNumber = (chapterIdx: number, topicIdx: number, videoIdx: number) => {
    if (!courseStructure) return 0;
    let videoCount = 0;
    for (let i = 0; i < chapterIdx; i++) {
      for (const topic of courseStructure.chapters[i].topics) {
        videoCount += topic.videos.length;
      }
    }
    for (let i = 0; i < topicIdx; i++) {
      videoCount += courseStructure.chapters[chapterIdx].topics[i].videos.length;
    }
    videoCount += videoIdx + 1;
    return videoCount;
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

  const videoIds = chapter.topics.flatMap(topic => topic.videos.map(v => v.id));

  return (
    <Card ref={setNodeRef} style={style} className="border-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>
            <button
              onClick={() => onToggleChapter(chapter.id)}
              className="hover:bg-muted rounded p-1"
            >
              {expandedChapters.has(chapter.id) ? (
                <ChevronDown className="w-5 h-5" />
              ) : (
                <ChevronRight className="w-5 h-5" />
              )}
            </button>
            <FolderOpen className="w-5 h-5 text-primary" />
            <span className="text-lg font-semibold">
              פרק {chapterIndex + 1}: {chapter.title}
            </span>
            <Badge variant="outline">
              {chapter.topics.reduce((sum, t) => sum + t.videos.length, 0)} סרטונים
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEditChapter(chapter.id, chapter.title)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onAddTopic(chapter.id)}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      {expandedChapters.has(chapter.id) && (
        <CardContent className="pr-8">
          <DndContext
            sensors={useSensors(
              useSensor(PointerSensor),
              useSensor(KeyboardSensor, {
                coordinateGetter: sortableKeyboardCoordinates,
              })
            )}
            collisionDetection={closestCenter}
            onDragEnd={(event) => {
              const { active, over } = event;
              if (over && active.id !== over.id) {
                // Handle video reordering within topics
                const oldIndex = videoIds.indexOf(active.id as string);
                const newIndex = videoIds.indexOf(over.id as string);
                if (oldIndex !== -1 && newIndex !== -1) {
                  // This will be handled by parent component
                }
              }
            }}
          >
            <SortableContext items={videoIds} strategy={verticalListSortingStrategy}>
              {chapter.topics.map((topic, topicIndex) => (
                <div key={topic.id} className="mb-4 last:mb-0">
                  <div className="flex items-center gap-2 mb-2 text-muted-foreground">
                    <span className="text-sm font-medium">{topic.title}</span>
                  </div>
                  <div className="space-y-1 mr-6">
                    {topic.videos.map((video, videoIndex) => (
                      <SortableVideo
                        key={video.id}
                        video={video}
                        videoNumber={getVideoNumber(chapterIndex, topicIndex, videoIndex)}
                        chapterId={chapter.id}
                        topicId={topic.id}
                        onEdit={onEditVideo}
                        onView={(id) => navigate(`/admin/video-editor/${id}`)}
                      />
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mr-6 mt-2 text-muted-foreground"
                    onClick={() => onAddVideo(chapter.id)}
                  >
                    <Plus className="w-3 h-3 ml-2" />
                    הוסף שיעור
                  </Button>
                </div>
              ))}
            </SortableContext>
          </DndContext>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => onAddTopic(chapter.id)}
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף נושא חדש
          </Button>
        </CardContent>
      )}
    </Card>
  );
};

const AdminCourseBuilderPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<{type: 'chapter' | 'topic' | 'video', id: string} | null>(null);
  const [newItemName, setNewItemName] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('title');
      if (error) throw error;
      return data;
    }
  });

  // Fetch course structure
  const { data: courseStructure, isLoading } = useQuery({
    queryKey: ['course-structure', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return null;

      const { data: chapters, error: chaptersError } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', selectedCourse)
        .order('order_index');

      if (chaptersError) throw chaptersError;

      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', selectedCourse)
        .order('order_index');

      if (videosError) throw videosError;

      const course = courses.find((c: any) => c.id === selectedCourse);
      const structure: CourseStructure = {
        id: selectedCourse,
        title: course?.title || '',
        chapters: (chapters || []).map((chapter: any) => ({
          id: chapter.id,
          title: chapter.title,
          order_index: chapter.order_index,
          topics: [{
            id: `topic-${chapter.id}`,
            title: 'כל השיעורים',
            order_index: 1,
            videos: (videos || [])
              .filter((v: any) => v.chapter_id === chapter.id)
              .map((v: any) => ({
                id: v.id,
                title: v.title,
                duration: v.duration || 0,
                order_index: v.order_index || 0,
              }))
              .sort((a: Video, b: Video) => a.order_index - b.order_index)
          }]
        }))
      };

      return structure;
    },
    enabled: !!selectedCourse
  });

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !courseStructure) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    // Check if dragging chapters
    const chapterIds = courseStructure.chapters.map(c => c.id);
    if (chapterIds.includes(activeId) && chapterIds.includes(overId)) {
      const oldIndex = chapterIds.indexOf(activeId);
      const newIndex = chapterIds.indexOf(overId);
      
      if (oldIndex !== newIndex) {
        const newChapters = arrayMove(courseStructure.chapters, oldIndex, newIndex);
        
        // Update order_index in database
        for (let i = 0; i < newChapters.length; i++) {
          await supabase
            .from('course_chapters')
            .update({ order_index: i + 1 })
            .eq('id', newChapters[i].id);
        }
        
        queryClient.invalidateQueries({ queryKey: ['course-structure', selectedCourse] });
        toast.success('סדר הפרקים עודכן בהצלחה!');
      }
      return;
    }

    // Check if dragging videos
    for (const chapter of courseStructure.chapters) {
      const videoIds = chapter.topics.flatMap(t => t.videos.map(v => v.id));
      if (videoIds.includes(activeId) && videoIds.includes(overId)) {
        const oldIndex = videoIds.indexOf(activeId);
        const newIndex = videoIds.indexOf(overId);
        
        if (oldIndex !== newIndex) {
          // Find which topic contains these videos
          for (const topic of chapter.topics) {
            const topicVideoIds = topic.videos.map(v => v.id);
            if (topicVideoIds.includes(activeId) && topicVideoIds.includes(overId)) {
              const oldTopicIndex = topicVideoIds.indexOf(activeId);
              const newTopicIndex = topicVideoIds.indexOf(overId);
              
              const newVideos = arrayMove(topic.videos, oldTopicIndex, newTopicIndex);
              
              // Update order_index in database
              for (let i = 0; i < newVideos.length; i++) {
                await supabase
                  .from('videos')
                  .update({ order_index: i + 1 })
                  .eq('id', newVideos[i].id);
              }
              
              queryClient.invalidateQueries({ queryKey: ['course-structure', selectedCourse] });
              toast.success('סדר הסרטונים עודכן בהצלחה!');
              return;
            }
          }
        }
        return;
      }
    }
  };

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const handleAddChapter = async () => {
    if (!selectedCourse || !newItemName.trim()) return;

    const { data: chapters } = await supabase
      .from('course_chapters')
      .select('order_index')
      .eq('course_id', selectedCourse)
      .order('order_index', { ascending: false })
      .limit(1);

    const nextOrder = chapters && chapters.length > 0 ? chapters[0].order_index + 1 : 1;

    const { data, error } = await supabase
      .from('course_chapters')
      .insert({
        course_id: selectedCourse,
        title: newItemName,
        order_index: nextOrder,
      })
      .select()
      .single();

    if (error) {
      toast.error(`שגיאה: ${error.message}`);
      return;
    }

    setNewItemName('');
    setEditingItem(null);
    queryClient.invalidateQueries({ queryKey: ['course-structure', selectedCourse] });
    toast.success('הפרק נוסף בהצלחה!');
  };

  const handleEditItem = (type: 'chapter' | 'topic' | 'video', id: string, currentName: string) => {
    setEditingItem({ type, id });
    setNewItemName(currentName);
  };

  const handleSaveEdit = async () => {
    if (!editingItem || !newItemName.trim()) return;

    if (editingItem.type === 'chapter') {
      const { error } = await supabase
        .from('course_chapters')
        .update({ title: newItemName })
        .eq('id', editingItem.id);

      if (error) {
        toast.error(`שגיאה: ${error.message}`);
        return;
      }
    } else if (editingItem.type === 'video') {
      const { error } = await supabase
        .from('videos')
        .update({ title: newItemName })
        .eq('id', editingItem.id);

      if (error) {
        toast.error(`שגיאה: ${error.message}`);
        return;
      }
    }

    setEditingItem(null);
    setNewItemName('');
    queryClient.invalidateQueries({ queryKey: ['course-structure', selectedCourse] });
    toast.success('השינויים נשמרו!');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען מבנה קורס...</p>
        </div>
      </div>
    );
  }

  const chapterIds = courseStructure?.chapters.map(c => c.id) || [];

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">בונה קורסים</h1>
          <div className="flex gap-4">
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-[300px] text-right">
                <SelectValue placeholder="בחר קורס" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course: any) => (
                  <SelectItem key={course.id} value={course.id} className="text-right">
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {!selectedCourse ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">בחר קורס להתחלת בנייה</p>
            </CardContent>
          </Card>
        ) : courseStructure ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="space-y-4">
              {/* Course Header */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-6 h-6 text-primary" />
                      <h2 className="text-2xl font-bold">{courseStructure.title}</h2>
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => navigate(`/admin/video-library`)}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      הוסף סרטונים
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Chapters Tree */}
              <SortableContext items={chapterIds} strategy={verticalListSortingStrategy}>
                {courseStructure.chapters.map((chapter, chapterIndex) => (
                  <SortableChapter
                    key={chapter.id}
                    chapter={chapter}
                    chapterIndex={chapterIndex}
                    courseStructure={courseStructure}
                    expandedChapters={expandedChapters}
                    onToggleChapter={toggleChapter}
                    onEditChapter={(id, title) => handleEditItem('chapter', id, title)}
                    onEditVideo={(id, title) => handleEditItem('video', id, title)}
                    onAddTopic={(chapterId) => navigate(`/admin/course-builder/${selectedCourse}/chapter/${chapterId}/add-topic`)}
                    onAddVideo={(chapterId) => navigate(`/admin/video-library?course=${selectedCourse}&chapter=${chapterId}`)}
                    selectedCourse={selectedCourse}
                    navigate={navigate}
                  />
                ))}
              </SortableContext>

              {/* Add Chapter Button */}
              <Card className="border-dashed">
                <CardContent className="pt-6">
                  {editingItem?.type === 'chapter' && editingItem.id === 'new' ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        placeholder="שם פרק חדש..."
                        className="text-right flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') handleAddChapter();
                        }}
                      />
                      <Button onClick={handleAddChapter}>שמור</Button>
                      <Button variant="outline" onClick={() => setEditingItem(null)}>ביטול</Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setEditingItem({ type: 'chapter', id: 'new' });
                        setNewItemName('');
                      }}
                    >
                      <Plus className="w-4 h-4 ml-2" />
                      הוסף פרק חדש
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </DndContext>
        ) : null}
      </div>
    </div>
  );
};

export default AdminCourseBuilderPage;
