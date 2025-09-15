import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Save, X } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category: string;
  imageUrl: string;
  price: string;
  createdAt: string;
}

const AdminPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    category: "",
    imageUrl: "",
    price: ""
  });

  // Load courses from localStorage on component mount
  useEffect(() => {
    const savedCourses = localStorage.getItem("admin_courses");
    if (savedCourses) {
      setCourses(JSON.parse(savedCourses));
    }
  }, []);

  // Save courses to localStorage whenever courses change
  useEffect(() => {
    localStorage.setItem("admin_courses", JSON.stringify(courses));
  }, [courses]);

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      category: "",
      imageUrl: "",
      price: ""
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.instructor) {
      toast.error("נא למלא את כל השדות הנדרשים");
      return;
    }

    if (editingId) {
      // Update existing course
      setCourses(prev => prev.map(course => 
        course.id === editingId 
          ? { ...course, ...formData }
          : course
      ));
      setEditingId(null);
      toast.success("הקורס עודכן בהצלחה");
    } else {
      // Create new course
      const newCourse: Course = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString()
      };
      setCourses(prev => [...prev, newCourse]);
      setIsCreating(false);
      toast.success("הקורס נוסף בהצלחה");
    }
    
    resetForm();
  };

  const handleEdit = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration,
      category: course.category,
      imageUrl: course.imageUrl,
      price: course.price
    });
    setEditingId(course.id);
    setIsCreating(false);
  };

  const handleDelete = (id: string) => {
    setCourses(prev => prev.filter(course => course.id !== id));
    toast.success("הקורס נמחק בהצלחה");
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-background p-6" dir="rtl">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ממשק ניהול קורסים</h1>
            <p className="text-muted-foreground mt-2">נהל את הקורסים שלך בקלות</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {courses.length} קורסים
          </Badge>
        </div>

        {/* Add New Course Button */}
        {!isCreating && !editingId && (
          <Button 
            onClick={() => setIsCreating(true)}
            className="mb-6"
            size="lg"
          >
            <Plus className="w-4 h-4 ml-2" />
            הוסף קורס חדש
          </Button>
        )}

        {/* Course Form */}
        {(isCreating || editingId) && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingId ? "עריכת קורס" : "הוספת קורס חדש"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">שם הקורס *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="הכנס שם קורס"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="instructor">מרצה *</Label>
                    <Input
                      id="instructor"
                      value={formData.instructor}
                      onChange={(e) => setFormData({...formData, instructor: e.target.value})}
                      placeholder="שם המרצה"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">משך הקורס</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({...formData, duration: e.target.value})}
                      placeholder="למשל: 10 שעות"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">קטגוריה</Label>
                    <Input
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      placeholder="למשל: תכנות, עיצוב"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="price">מחיר</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      placeholder="למשל: ₪299"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="imageUrl">קישור לתמונה</Label>
                    <Input
                      id="imageUrl"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">תיאור הקורס *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="תאר את הקורס, מה הסטודנטים ילמדו..."
                    className="min-h-[100px]"
                    required
                  />
                </div>
                
                <div className="flex gap-4">
                  <Button type="submit">
                    <Save className="w-4 h-4 ml-2" />
                    {editingId ? "עדכן קורס" : "שמור קורס"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCancel}>
                    <X className="w-4 h-4 ml-2" />
                    ביטול
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        <Separator className="my-8" />

        {/* Courses List */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">הקורסים שלי</h2>
          
          {courses.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  עדיין לא נוספו קורסים
                </p>
                <p className="text-muted-foreground mt-2">
                  לחץ על "הוסף קורס חדש" כדי להתחיל
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="overflow-hidden">
                  {course.imageUrl && (
                    <div className="h-48 bg-muted overflow-hidden">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-lg">{course.title}</h3>
                      <p className="text-muted-foreground text-sm line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>מרצה: {course.instructor}</span>
                      </div>
                      {course.duration && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>משך: {course.duration}</span>
                        </div>
                      )}
                      {course.category && (
                        <Badge variant="secondary" className="w-fit">
                          {course.category}
                        </Badge>
                      )}
                      {course.price && (
                        <div className="text-lg font-semibold text-primary">
                          {course.price}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(course)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleDelete(course.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;