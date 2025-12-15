/**
 * Admin Video Preview Page
 * 
 * Allows admins to preview videos directly.
 * Access is restricted to authenticated admins only.
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Play,
  ArrowRight,
  AlertTriangle,
  Loader2,
  Lock,
  Video,
  Clock,
  BookOpen,
  Copy,
  ExternalLink
} from 'lucide-react';

const HETZNER_API_URL = import.meta.env.VITE_HETZNER_API_URL || '';

interface VideoData {
  id: string;
  title: string;
  description: string | null;
  duration: number;
  hetzner_path: string | null;
  hls_path: string | null;
  is_published: boolean;
  courses: { title: string } | null;
  course_chapters: { title: string } | null;
}

const AdminVideoPreviewPage = () => {
  const { videoId } = useParams<{ videoId: string }>();
  const navigate = useNavigate();
  const { isAdmin, isLoading: authLoading } = useAdminAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };
    checkAuth();
  }, []);

  // Fetch video data
  const { data: video, isLoading: videoLoading, error } = useQuery({
    queryKey: ['admin-preview-video', videoId],
    queryFn: async () => {
      if (!videoId) throw new Error('Video ID is required');
      
      const { data, error } = await supabase
        .from('videos')
        .select(`
          id,
          title,
          description,
          duration,
          hetzner_path,
          hls_path,
          is_published,
          courses(title),
          course_chapters(title)
        `)
        .eq('id', videoId)
        .single();

      if (error) throw error;
      return data as VideoData;
    },
    enabled: !!videoId && isAuthenticated === true && isAdmin === true,
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('הלינק הועתק ללוח!');
    } catch {
      toast.error('שגיאה בהעתקת הלינק');
    }
  };

  // Loading state
  if (authLoading || isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">בודק הרשאות...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Lock className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">גישה נדחתה</h2>
              <p className="text-muted-foreground mb-6">
                יש להתחבר למערכת כדי לצפות בסרטון זה
              </p>
              <Button onClick={() => navigate('/auth')}>
                התחבר למערכת
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">אין הרשאה</h2>
              <p className="text-muted-foreground mb-6">
                רק מנהלי מערכת יכולים לצפות בקישור Preview זה.
                <br />
                אם אתה סטודנט, גש לקורס דרך הפלטפורמה.
              </p>
              <div className="flex gap-2 justify-center">
                <Button variant="outline" onClick={() => navigate('/')}>
                  <ArrowRight className="w-4 h-4 ml-2" />
                  לדף הבית
                </Button>
                <Button onClick={() => navigate('/my-courses')}>
                  הקורסים שלי
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Video loading
  if (videoLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">טוען סרטון...</p>
        </div>
      </div>
    );
  }

  // Video not found or error
  if (error || !video) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <Video className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">סרטון לא נמצא</h2>
              <p className="text-muted-foreground mb-6">
                הסרטון המבוקש לא נמצא או שאינו זמין
              </p>
              <Button onClick={() => navigate('/admin/hetzner-videos')}>
                <ArrowRight className="w-4 h-4 ml-2" />
                חזרה לניהול סרטונים
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // No video path
  if (!video.hetzner_path) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4" dir="rtl">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">סרטון לא מקושר</h2>
              <p className="text-muted-foreground mb-6">
                הסרטון "{video.title}" לא מקושר לקובץ בשרת Hetzner.
                <br />
                יש לקשר אותו קודם בממשק הניהול.
              </p>
              <Button onClick={() => navigate('/admin/hetzner-videos')}>
                <ArrowRight className="w-4 h-4 ml-2" />
                קשר סרטון
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Prefer MP4 (hetzner_path) as HLS may not be available
  const videoUrl = `${HETZNER_API_URL}${video.hetzner_path}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30" dir="rtl">
      {/* Admin Header Banner */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-primary">
            <Lock className="w-4 h-4" />
            <span>מצב צפייה מקדימה (Admin Only)</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/hetzner-videos')}
            className="text-primary hover:text-primary"
          >
            <ArrowRight className="w-4 h-4 ml-1" />
            חזרה לניהול
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6">
        {/* Video Player */}
        <Card className="overflow-hidden">
          <div className="relative bg-black aspect-video">
            <video
              key={video.id}
              controls
              autoPlay
              className="w-full h-full"
              src={videoUrl}
            >
              הדפדפן שלך לא תומך בנגן וידאו
            </video>
          </div>
        </Card>

        {/* Video Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl">{video.title}</CardTitle>
                  <CardDescription className="mt-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    {video.courses?.title || 'ללא קורס'}
                    {video.course_chapters?.title && (
                      <span className="text-primary"> &gt; {video.course_chapters.title}</span>
                    )}
                  </CardDescription>
                </div>
                <Badge variant={video.is_published ? 'default' : 'secondary'}>
                  {video.is_published ? 'מפורסם' : 'טיוטה'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {video.description && (
                <p className="text-muted-foreground">{video.description}</p>
              )}
            </CardContent>
          </Card>

          {/* Side Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">פרטי הסרטון</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">משך</p>
                  <p className="font-medium">{formatDuration(video.duration)}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">סוג</p>
                  <p className="font-medium">{video.hls_path ? 'HLS Streaming' : 'קובץ ישיר'}</p>
                </div>
              </div>

              <hr />

              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopyLink}
                >
                  <Copy className="w-4 h-4 ml-2" />
                  העתק לינק Preview
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => window.open(videoUrl, '_blank')}
                >
                  <ExternalLink className="w-4 h-4 ml-2" />
                  פתח בחלון חדש
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Notice */}
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium">שים לב - גישה מוגבלת</p>
                <p className="mt-1">
                  לינק זה זמין <strong>רק למנהלי מערכת</strong>. 
                  משתמשים רגילים או אורחים לא יוכלו לגשת לסרטון דרך לינק זה.
                  כדי לשתף סרטון עם סטודנטים, הוסף אותו לקורס ותן להם הרשאת גישה.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminVideoPreviewPage;

