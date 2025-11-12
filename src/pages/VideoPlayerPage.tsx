import React, { useState, useRef, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  SkipBack, 
  SkipForward, 
  Minimize2,
  Clock,
  CheckCircle,
  Circle
} from 'lucide-react';

import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { cn } from '@/lib/utils';

// Mock course video data
const courseVideos = {
  'physics-101': {
    courseName: 'פיזיקה 1 - מכניקה קלאסית',
    topics: [
      {
        id: 'intro',
        name: 'מבוא לפיזיקה קלאסית',
        videos: [
          { id: 'intro-1', name: 'מהי פיזיקה קלאסית?', duration: '12:34', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
          { id: 'intro-2', name: 'היסטוריה של הפיזיקה', duration: '15:20', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
          { id: 'intro-3', name: 'יחידות מידה ומערכות יחידות', duration: '08:45', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
        ]
      },
      {
        id: 'kinematics',
        name: 'קינמטיקה',
        videos: [
          { id: 'kin-1', name: 'מושגי יסוד בקינמטיקה', duration: '18:12', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4' },
          { id: 'kin-2', name: 'תנועה במימד אחד', duration: '22:15', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
          { id: 'kin-3', name: 'תנועה בשני מימדים', duration: '25:30', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4' },
          { id: 'kin-4', name: 'תנועה מעגלית', duration: '19:45', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4' }
        ]
      },
      {
        id: 'dynamics',
        name: 'דינמיקה וחוקי ניוטון',
        videos: [
          { id: 'dyn-1', name: 'החוק הראשון של ניוטון', duration: '16:20', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4' },
          { id: 'dyn-2', name: 'החוק השני של ניוטון', duration: '20:10', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4' },
          { id: 'dyn-3', name: 'החוק השלישי של ניוטון', duration: '14:55', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4' }
        ]
      },
      {
        id: 'energy',
        name: 'עבודה ואנרגיה',
        videos: [
          { id: 'eng-1', name: 'מושג העבודה', duration: '13:40', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4' },
          { id: 'eng-2', name: 'אנרגיה קינטית', duration: '17:25', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4' },
          { id: 'eng-3', name: 'אנרגיה פוטנציאלית', duration: '21:10', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4' }
        ]
      }
    ]
  }
};

interface Video {
  id: string;
  name: string;
  duration: string;
  url: string;
}

interface Topic {
  id: string;
  name: string;
  videos: Video[];
}

const VideoPlayerPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentTopicId, setCurrentTopicId] = useState<string>('');
  const [openTopics, setOpenTopics] = useState<Record<string, boolean>>({});
  const [playedVideos, setPlayedVideos] = useState<Set<string>>(new Set());
  const videoRef = useRef<HTMLVideoElement>(null);

  const course = courseVideos[courseId as keyof typeof courseVideos];

  useEffect(() => {
    if (course && course.topics.length > 0) {
      const firstVideo = course.topics[0].videos[0];
      setCurrentVideo(firstVideo);
      setCurrentTopicId(course.topics[0].id);
      setOpenTopics({ [course.topics[0].id]: true });
    }
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen bg-background" dir="rtl">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">הקורס לא נמצא</h1>
          <Link to="/" className="text-primary hover:underline">
            חזרה לדף הבית
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const getAllVideos = (): Video[] => {
    return course.topics.flatMap(topic => topic.videos);
  };

  const getCurrentVideoIndex = (): number => {
    if (!currentVideo) return -1;
    return getAllVideos().findIndex(video => video.id === currentVideo.id);
  };

  const handleVideoSelect = (video: Video, topicId: string) => {
    setCurrentVideo(video);
    setCurrentTopicId(topicId);
    // Only mark as watched if not already watched
    if (!playedVideos.has(video.id)) {
      setPlayedVideos(prev => new Set([...prev, video.id]));
    }
  };

  const handleToggleWatched = (videoId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlayedVideos(prev => {
      const newSet = new Set(prev);
      if (newSet.has(videoId)) {
        newSet.delete(videoId);
      } else {
        newSet.add(videoId);
      }
      return newSet;
    });
  };

  const handleNextVideo = () => {
    const allVideos = getAllVideos();
    const currentIndex = getCurrentVideoIndex();
    if (currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];
      const nextTopic = course.topics.find(topic => 
        topic.videos.some(video => video.id === nextVideo.id)
      );
      if (nextTopic) {
        handleVideoSelect(nextVideo, nextTopic.id);
      }
    }
  };

  const handlePreviousVideo = () => {
    const allVideos = getAllVideos();
    const currentIndex = getCurrentVideoIndex();
    if (currentIndex > 0) {
      const prevVideo = allVideos[currentIndex - 1];
      const prevTopic = course.topics.find(topic => 
        topic.videos.some(video => video.id === prevVideo.id)
      );
      if (prevTopic) {
        handleVideoSelect(prevVideo, prevTopic.id);
      }
    }
  };

  const toggleTopic = (topicId: string) => {
    setOpenTopics(prev => ({
      ...prev,
      [topicId]: !prev[topicId]
    }));
  };

  const collapseAllTopics = () => {
    const allClosed: Record<string, boolean> = {};
    course.topics.forEach(topic => {
      allClosed[topic.id] = false;
    });
    setOpenTopics(allClosed);
  };

  const handleVideoEnd = () => {
    if (currentVideo) {
      setPlayedVideos(prev => new Set([...prev, currentVideo.id]));
    }
    handleNextVideo();
  };

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <main className="container mx-auto px-4 py-6">
        {/* Back navigation */}
        <div className="mb-6">
          <Link 
            to={`/course/${courseId}`}
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
          >
            <ArrowRight className="w-4 h-4 ml-2" />
            חזרה לעמוד הקורס
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Playlist Section - RIGHT SIDE */}
          <div className="lg:order-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-bold">רשימת נושאים וסרטונים</CardTitle>
                  <Button
                    onClick={collapseAllTopics}
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                  >
                    <Minimize2 className="w-3 h-3 ml-1" />
                    כווץ הכל
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto">
                {course.topics.map((topic) => (
                  <div key={topic.id} className="border-2 border-primary/20 rounded-xl overflow-hidden">
                    <Collapsible
                      open={openTopics[topic.id]}
                      onOpenChange={() => toggleTopic(topic.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <button className="w-full flex items-center justify-between p-4 bg-primary/5 hover:bg-primary/10 transition-colors text-right">
                          <div className="flex items-center">
                            {openTopics[topic.id] ? (
                              <ChevronDown className="w-5 h-5 ml-2 text-primary" />
                            ) : (
                              <ChevronRight className="w-5 h-5 ml-2 text-primary" />
                            )}
                            <span className="font-semibold text-foreground">{topic.name}</span>
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">
                            {topic.videos.length} סרטונים
                          </span>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border-t-2 border-primary/20">
                          {topic.videos.map((video) => (
                            <button
                              key={video.id}
                              onClick={() => handleVideoSelect(video, topic.id)}
                              className={cn(
                                "w-full py-2.5 px-4 text-right border-b border-primary/10 last:border-b-0 transition-all hover:bg-primary/10",
                                currentVideo?.id === video.id
                                  ? "bg-gradient-to-r from-primary/20 to-primary/10 border-r-4 border-r-primary font-semibold"
                                  : "hover:bg-primary/5"
                              )}
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1">
                                  {playedVideos.has(video.id) ? (
                                    <button
                                      onClick={(e) => handleToggleWatched(video.id, e)}
                                      className="flex-shrink-0 hover:opacity-70 transition-opacity"
                                      title="לחץ להסרת סימון נצפה"
                                    >
                                      <CheckCircle className={cn(
                                        "w-5 h-5",
                                        currentVideo?.id === video.id ? "text-primary" : "text-green-600"
                                      )} />
                                    </button>
                                  ) : (
                                    <Circle className={cn(
                                      "w-5 h-5 flex-shrink-0",
                                      currentVideo?.id === video.id ? "text-primary fill-primary" : "text-muted-foreground"
                                    )} />
                                  )}
                                  <span className={cn(
                                    "text-sm text-right leading-tight",
                                    currentVideo?.id === video.id ? "text-primary font-semibold" : "text-foreground"
                                  )}>
                                    {video.name}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-muted-foreground flex-shrink-0">
                                  <Clock className="w-3 h-3 ml-1" />
                                  {video.duration}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Video Player Section - LEFT SIDE */}
          <div className="lg:col-span-2 lg:order-2 space-y-4">
            {/* Current Video Title */}
            <div className="bg-gradient-to-l from-primary to-primary/80 text-white p-5 rounded-2xl shadow-lg">
              <h1 className="text-2xl font-bold mb-1">{currentVideo?.name || 'בחר סרטון לצפייה'}</h1>
              <p className="text-white/90 text-base">{course.courseName}</p>
            </div>

            {/* Video Player */}
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                {currentVideo ? (
                  <video
                    ref={videoRef}
                    key={currentVideo.id}
                    className="w-full aspect-video bg-black"
                    controls
                    autoPlay
                    onEnded={handleVideoEnd}
                    controlsList="nodownload"
                    onContextMenu={(e) => e.preventDefault()}
                  >
                    <source src={currentVideo.url} type="video/mp4" />
                    הדפדפן שלך אינו תומך בנגן הווידאו.
                  </video>
                ) : (
                  <div className="w-full aspect-video bg-muted flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Play className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">בחר סרטון מהרשימה לצפייה</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Video Navigation Controls */}
            <div className="flex justify-between items-center">
              <Button
                onClick={handlePreviousVideo}
                disabled={getCurrentVideoIndex() <= 0}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-6 border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-xl"
              >
                <SkipForward className="w-5 h-5 rotate-180" />
                <span className="font-semibold">סרטון קודם</span>
              </Button>

              <Button
                onClick={handleNextVideo}
                disabled={getCurrentVideoIndex() >= getAllVideos().length - 1}
                variant="outline"
                size="lg"
                className="flex items-center gap-2 px-6 border-2 border-primary/20 hover:bg-primary/10 hover:border-primary/40 rounded-xl"
              >
                <span className="font-semibold">סרטון הבא</span>
                <SkipBack className="w-5 h-5 rotate-180" />
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VideoPlayerPage;