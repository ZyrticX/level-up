import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Save,
  ArrowRight,
  Upload,
  X,
  Plus,
  Trash2,
  Link as LinkIcon,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail_url: string;
  video_url: string;
  course_id: string | null;
  chapter_id: string | null;
  topic_id: string | null;
  order_index: number;
  tags: string[];
  internal_notes: string;
  is_published: boolean;
  is_preview: boolean;
  publish_date: string;
}

interface Material {
  id?: string;
  type: 'pdf' | 'link' | 'file';
  title: string;
  url: string;
}

const AdminVideoEditorPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isNew = id === 'new';

  const [formData, setFormData] = useState<VideoData>({
    id: '',
    title: '',
    description: '',
    thumbnail_url: '',
    video_url: '',
    course_id: null,
    chapter_id: null,
    topic_id: null,
    order_index: 0,
    tags: [],
    internal_notes: '',
    is_published: false,
    is_preview: false,
    publish_date: new Date().toISOString().split('T')[0],
  });

  const [materials, setMaterials] = useState<Material[]>([]);
  const [newTag, setNewTag] = useState('');
  const [selectedInstitution, setSelectedInstitution] = useState<string>('');
  const [selectedDepartment, setSelectedDepartment] = useState<string>('');
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedChapter, setSelectedChapter] = useState<string>('');
  const [newChapterName, setNewChapterName] = useState('');
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [newTopicName, setNewTopicName] = useState('');

  // Fetch institutions
  const { data: institutions = [] } = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('institutions')
        .select('*')
        .order('name');
      if (error) throw error;
      return data;
    }
  });

  // Fetch courses
  const { data: courses = [] } = useQuery({
    queryKey: ['courses', selectedInstitution, selectedDepartment],
    queryFn: async () => {
      let query = supabase.from('courses').select('*');
      
      if (selectedInstitution) {
        query = query.eq('institution', selectedInstitution);
      }
      if (selectedDepartment) {
        query = query.eq('department', selectedDepartment);
      }
      
      const { data, error } = await query.order('title');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedInstitution || !!selectedDepartment
  });

  // Fetch chapters
  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', selectedCourse],
    queryFn: async () => {
      if (!selectedCourse) return [];
      const { data, error } = await supabase
        .from('course_chapters')
        .select('*')
        .eq('course_id', selectedCourse)
        .order('order_index');
      if (error) throw error;
      return data;
    },
    enabled: !!selectedCourse
  });

  // Fetch video data if editing
  const { data: videoData, isLoading } = useQuery({
    queryKey: ['video', id],
    queryFn: async () => {
      if (isNew) return null;
      const { data, error } = await supabase
        .from('videos')
        .select('*, courses!inner(*)')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !isNew
  });

  useEffect(() => {
    if (videoData) {
      setFormData({
        id: videoData.id,
        title: videoData.title || '',
        description: videoData.description || '',
        thumbnail_url: videoData.thumbnail_url || '',
        video_url: videoData.video_url || '',
        course_id: videoData.course_id,
        chapter_id: videoData.chapter_id,
        topic_id: videoData.topic_id,
        order_index: videoData.order_index || 0,
        tags: videoData.tags || [],
        internal_notes: videoData.internal_notes || '',
        is_published: videoData.is_published || false,
        is_preview: videoData.is_preview || false,
        publish_date: videoData.publish_date || new Date().toISOString().split('T')[0],
      });
      
      if (videoData.courses) {
        setSelectedInstitution(videoData.courses.institution || '');
        setSelectedDepartment(videoData.courses.department || '');
        setSelectedCourse(videoData.course_id);
      }
      setSelectedChapter(videoData.chapter_id || '');
    }
  }, [videoData]);

  const saveMutation = useMutation({
    mutationFn: async (data: VideoData) => {
      if (isNew) {
        const { data: result, error } = await supabase
          .from('videos')
          .insert({
            title: data.title,
            description: data.description,
            thumbnail_url: data.thumbnail_url,
            video_url: data.video_url,
            course_id: data.course_id,
            chapter_id: data.chapter_id,
            topic_id: data.topic_id,
            order_index: data.order_index,
            tags: data.tags,
            internal_notes: data.internal_notes,
            is_published: data.is_published,
            is_preview: data.is_preview,
            publish_date: data.publish_date,
          })
          .select()
          .single();
        if (error) throw error;
        return result;
      } else {
        const { error } = await supabase
          .from('videos')
          .update({
            title: data.title,
            description: data.description,
            thumbnail_url: data.thumbnail_url,
            course_id: data.course_id,
            chapter_id: data.chapter_id,
            topic_id: data.topic_id,
            order_index: data.order_index,
            tags: data.tags,
            internal_notes: data.internal_notes,
            is_published: data.is_published,
            is_preview: data.is_preview,
            publish_date: data.publish_date,
          })
          .eq('id', id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-videos'] });
      queryClient.invalidateQueries({ queryKey: ['video', id] });
      toast.success('הסרטון נשמר בהצלחה!');
      navigate('/admin/video-library');
    },
    onError: (error: any) => {
      toast.error(`שגיאה בשמירה: ${error.message}`);
    }
  });

  const handleCreateChapter = async () => {
    if (!newChapterName || !selectedCourse) return;
    
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
        title: newChapterName,
        order_index: nextOrder,
      })
      .select()
      .single();
    
    if (error) {
      toast.error(`שגיאה ביצירת פרק: ${error.message}`);
      return;
    }
    
    setSelectedChapter(data.id);
    setFormData({ ...formData, chapter_id: data.id });
    setNewChapterName('');
    queryClient.invalidateQueries({ queryKey: ['chapters', selectedCourse] });
    toast.success('הפרק נוצר בהצלחה!');
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleAddMaterial = (type: 'pdf' | 'link' | 'file') => {
    setMaterials([...materials, { type, title: '', url: '' }]);
  };

  const handleRemoveMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">
            {isNew ? 'סרטון חדש' : 'עריכת סרטון'}
          </h1>
          <Button variant="outline" onClick={() => navigate('/admin/video-library')}>
            <X className="w-4 h-4 ml-2" />
            ביטול
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Video Preview */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>תצוגה מקדימה</CardTitle>
                </CardHeader>
                <CardContent>
                  {formData.video_url ? (
                    <video
                      src={formData.video_url}
                      controls
                      className="w-full rounded-lg"
                    />
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-muted-foreground">אין סרטון להצגה</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Basic Details */}
              <Card>
                <CardHeader>
                  <CardTitle>פרטים בסיסיים</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">שם סרטון *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">תיאור</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      className="text-right resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="thumbnail">תמונת תצוגה (URL)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="thumbnail"
                        value={formData.thumbnail_url}
                        onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                        placeholder="https://..."
                        className="text-right"
                      />
                      <Button type="button" variant="outline" size="icon">
                        <Upload className="w-4 h-4" />
                      </Button>
                    </div>
                    {formData.thumbnail_url && (
                      <img
                        src={formData.thumbnail_url}
                        alt="Thumbnail"
                        className="w-32 h-20 object-cover rounded mt-2"
                      />
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Hierarchy Assignment */}
              <Card>
                <CardHeader>
                  <CardTitle>שיוך היררכי</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>מוסד</Label>
                      <Select value={selectedInstitution} onValueChange={setSelectedInstitution}>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="בחר מוסד" />
                        </SelectTrigger>
                        <SelectContent>
                          {institutions.map((inst: any) => (
                            <SelectItem key={inst.id} value={inst.name} className="text-right">
                              {inst.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>תחום</Label>
                      <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="בחר תחום" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses
                            .filter((c: any) => !selectedInstitution || c.institution === selectedInstitution)
                            .map((course: any) => course.department)
                            .filter((dept: string, index: number, self: string[]) => self.indexOf(dept) === index)
                            .map((dept: string) => (
                              <SelectItem key={dept} value={dept} className="text-right">
                                {dept}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>קורס</Label>
                      <Select 
                        value={selectedCourse} 
                        onValueChange={(value) => {
                          setSelectedCourse(value);
                          setFormData({ ...formData, course_id: value });
                          setSelectedChapter('');
                        }}
                      >
                        <SelectTrigger className="text-right">
                          <SelectValue placeholder="בחר קורס" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses
                            .filter((c: any) => 
                              (!selectedInstitution || c.institution === selectedInstitution) &&
                              (!selectedDepartment || c.department === selectedDepartment)
                            )
                            .map((course: any) => (
                              <SelectItem key={course.id} value={course.id} className="text-right">
                                {course.title}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>פרק</Label>
                      <div className="flex gap-2">
                        <Select 
                          value={selectedChapter} 
                          onValueChange={(value) => {
                            setSelectedChapter(value);
                            setFormData({ ...formData, chapter_id: value });
                          }}
                        >
                          <SelectTrigger className="text-right flex-1">
                            <SelectValue placeholder="בחר פרק" />
                          </SelectTrigger>
                          <SelectContent>
                            {chapters.map((chapter: any) => (
                              <SelectItem key={chapter.id} value={chapter.id} className="text-right">
                                {chapter.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="פרק חדש..."
                          value={newChapterName}
                          onChange={(e) => setNewChapterName(e.target.value)}
                          className="text-right"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleCreateChapter();
                            }
                          }}
                        />
                        <Button type="button" onClick={handleCreateChapter} variant="outline">
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>שיעור (נושא)</Label>
                    <div className="flex gap-2">
                      <Select 
                        value={selectedTopic} 
                        onValueChange={(value) => {
                          setSelectedTopic(value);
                          setFormData({ ...formData, topic_id: value });
                        }}
                      >
                        <SelectTrigger className="text-right flex-1">
                          <SelectValue placeholder="בחר שיעור" />
                        </SelectTrigger>
                        <SelectContent>
                          {/* Topics will be added when topics table exists */}
                          <SelectItem value="none" className="text-right">
                            אין שיעורים זמינים
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <Input
                        placeholder="שיעור חדש..."
                        value={newTopicName}
                        onChange={(e) => setNewTopicName(e.target.value)}
                        className="text-right"
                      />
                      <Button type="button" variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Additional Info */}
              <Card>
                <CardHeader>
                  <CardTitle>מידע נוסף</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="order">סדר תצוגה</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      className="text-right"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>תגיות</Label>
                    <div className="flex gap-2">
                      <Input
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="הוסף תגית..."
                        className="text-right"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                      />
                      <Button type="button" onClick={handleAddTag} variant="outline">
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-sm">
                          {tag}
                          <button
                            onClick={() => handleRemoveTag(tag)}
                            className="mr-2 hover:text-destructive"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">הערות פנימיות</Label>
                    <Textarea
                      id="notes"
                      value={formData.internal_notes}
                      onChange={(e) => setFormData({ ...formData, internal_notes: e.target.value })}
                      rows={3}
                      className="text-right resize-none"
                      placeholder="הערות פנימיות למנהלים בלבד..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Materials */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>חומרי עזר</CardTitle>
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => handleAddMaterial('pdf')}>
                        <FileText className="w-4 h-4 ml-2" />
                        PDF
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleAddMaterial('link')}>
                        <LinkIcon className="w-4 h-4 ml-2" />
                        קישור
                      </Button>
                      <Button type="button" variant="outline" size="sm" onClick={() => handleAddMaterial('file')}>
                        <Upload className="w-4 h-4 ml-2" />
                        קובץ
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {materials.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">אין חומרי עזר</p>
                  ) : (
                    materials.map((material, index) => (
                      <div key={index} className="flex gap-2 items-center p-3 border rounded-lg">
                        <Badge variant="outline">{material.type}</Badge>
                        <Input
                          placeholder="כותרת..."
                          value={material.title}
                          onChange={(e) => {
                            const updated = [...materials];
                            updated[index].title = e.target.value;
                            setMaterials(updated);
                          }}
                          className="text-right flex-1"
                        />
                        <Input
                          placeholder="URL..."
                          value={material.url}
                          onChange={(e) => {
                            const updated = [...materials];
                            updated[index].url = e.target.value;
                            setMaterials(updated);
                          }}
                          className="text-right flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMaterial(index)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Settings */}
            <div className="space-y-6">
              {/* Publish Settings */}
              <Card>
                <CardHeader>
                  <CardTitle>הגדרות פרסום</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="published">פעיל</Label>
                    <Switch
                      id="published"
                      checked={formData.is_published}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="preview">תצוגה מקדימה חינמית</Label>
                    <Switch
                      id="preview"
                      checked={formData.is_preview}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_preview: checked })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="publish_date">תאריך פרסום</Label>
                    <Input
                      id="publish_date"
                      type="date"
                      value={formData.publish_date}
                      onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
                      className="text-right"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={saveMutation.isPending}
              >
                <Save className="w-5 h-5 ml-2" />
                {saveMutation.isPending ? 'שומר...' : 'שמור סרטון'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminVideoEditorPage;

