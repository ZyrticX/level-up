/**
 * Secure Video Player Component
 * 
 * Features:
 * - Token-based video access
 * - HLS streaming support (with fallback to MP4)
 * - Progress tracking
 * - Anti-download protections
 * - Auto token refresh
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Minimize, Settings, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { generateVideoToken, checkVideoAccess, VideoToken } from '@/services/hetzner.service';

// Dynamic import for HLS.js (only load if needed)
let Hls: any = null;

interface SecureVideoPlayerProps {
  videoId: string;
  title?: string;
  onEnded?: () => void;
  onProgress?: (progress: { watched: number; total: number; percentage: number }) => void;
  className?: string;
  autoPlay?: boolean;
}

interface VideoState {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isLoading: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  error: string | null;
}

const SecureVideoPlayer: React.FC<SecureVideoPlayerProps> = ({
  videoId,
  title,
  onEnded,
  onProgress,
  className,
  autoPlay = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<number | null>(null);
  const hlsRef = useRef<any>(null);
  
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [videoToken, setVideoToken] = useState<VideoToken | null>(null);
  const [videoState, setVideoState] = useState<VideoState>({
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    isLoading: true,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    error: null,
  });
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<number | null>(null);

  // Check access and generate token
  useEffect(() => {
    async function initializeVideo() {
      try {
        // Check if user has access
        const access = await checkVideoAccess(videoId);
        setHasAccess(access);

        if (!access) {
          setVideoState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'אין לך הרשאה לצפות בסרטון זה' 
          }));
          return;
        }

        // Generate token
        const token = await generateVideoToken(videoId);
        if (!token) {
          setVideoState(prev => ({ 
            ...prev, 
            isLoading: false, 
            error: 'שגיאה ביצירת גישה לסרטון' 
          }));
          return;
        }

        setVideoToken(token);
      } catch (error) {
        console.error('Error initializing video:', error);
        setVideoState(prev => ({ 
          ...prev, 
          isLoading: false, 
          error: 'שגיאה בטעינת הסרטון' 
        }));
      }
    }

    initializeVideo();

    return () => {
      // Cleanup HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
      }
    };
  }, [videoId]);

  // Load video source when token is available
  useEffect(() => {
    if (!videoToken || !videoRef.current) return;

    async function loadVideo() {
      const video = videoRef.current!;

      // Try HLS first if available
      if (videoToken.hlsUrl) {
        // Dynamically import HLS.js
        if (!Hls) {
          try {
            const HlsModule = await import('hls.js');
            Hls = HlsModule.default;
          } catch {
            console.log('HLS.js not available, falling back to MP4');
          }
        }

        if (Hls && Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
          });
          
          hls.loadSource(videoToken.hlsUrl);
          hls.attachMedia(video);
          
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setVideoState(prev => ({ ...prev, isLoading: false }));
            if (autoPlay) {
              video.play().catch(() => {});
            }
          });

          hls.on(Hls.Events.ERROR, (event: any, data: any) => {
            if (data.fatal) {
              console.error('HLS fatal error:', data);
              // Fallback to MP4
              video.src = videoToken.videoUrl;
            }
          });

          hlsRef.current = hls;
          return;
        }
        
        // Native HLS support (Safari)
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = videoToken.hlsUrl;
          setVideoState(prev => ({ ...prev, isLoading: false }));
          if (autoPlay) {
            video.play().catch(() => {});
          }
          return;
        }
      }

      // Fallback to MP4
      video.src = videoToken.videoUrl;
      setVideoState(prev => ({ ...prev, isLoading: false }));
      if (autoPlay) {
        video.play().catch(() => {});
      }
    }

    loadVideo();
  }, [videoToken, autoPlay]);

  // Token refresh before expiry
  useEffect(() => {
    if (!videoToken) return;

    const refreshTime = videoToken.expiresAt.getTime() - Date.now() - 5 * 60 * 1000; // 5 minutes before expiry
    
    if (refreshTime > 0) {
      const timeout = setTimeout(async () => {
        const newToken = await generateVideoToken(videoId);
        if (newToken) {
          setVideoToken(newToken);
        }
      }, refreshTime);

      return () => clearTimeout(timeout);
    }
  }, [videoToken, videoId]);

  // Progress tracking
  useEffect(() => {
    if (!videoRef.current || !videoId) return;

    const saveProgress = async () => {
      const video = videoRef.current;
      if (!video || video.duration === 0) return;

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const progress = {
        watched: Math.floor(video.currentTime),
        total: Math.floor(video.duration),
        percentage: Math.round((video.currentTime / video.duration) * 100),
      };

      // Save to database
      await supabase
        .from('video_progress')
        .upsert({
          user_id: user.id,
          video_id: videoId,
          watched_duration: progress.watched,
          completed: progress.percentage >= 90,
          last_watched_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,video_id',
        });

      onProgress?.(progress);
    };

    // Save progress every 30 seconds
    progressIntervalRef.current = window.setInterval(saveProgress, 30000);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
      // Save final progress on unmount
      saveProgress();
    };
  }, [videoId, onProgress]);

  // Video event handlers
  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    setVideoState(prev => ({
      ...prev,
      currentTime: video.currentTime,
      duration: video.duration || 0,
    }));
  }, []);

  const handleProgress = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.buffered.length === 0) return;

    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    setVideoState(prev => ({
      ...prev,
      buffered: (bufferedEnd / video.duration) * 100,
    }));
  }, []);

  const handleEnded = useCallback(() => {
    setVideoState(prev => ({ ...prev, isPlaying: false }));
    onEnded?.();
  }, [onEnded]);

  // Control handlers
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setVideoState(prev => ({ ...prev, isPlaying: true }));
    } else {
      video.pause();
      setVideoState(prev => ({ ...prev, isPlaying: false }));
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setVideoState(prev => ({ ...prev, isMuted: video.muted }));
  };

  const toggleFullscreen = () => {
    const container = containerRef.current;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
      setVideoState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      document.exitFullscreen();
      setVideoState(prev => ({ ...prev, isFullscreen: false }));
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    video.currentTime = percent * video.duration;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const volume = parseFloat(e.target.value);
    video.volume = volume;
    setVideoState(prev => ({ ...prev, volume, isMuted: volume === 0 }));
  };

  // Show/hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    
    if (videoState.isPlaying) {
      controlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // No access state
  if (hasAccess === false) {
    return (
      <div className={cn('relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center', className)}>
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">🔒</div>
          <h3 className="text-xl font-bold mb-2">אין הרשאה לצפייה</h3>
          <p className="text-gray-400">יש לרכוש את הקורס כדי לצפות בסרטון זה</p>
        </div>
      </div>
    );
  }

  // Error state
  if (videoState.error) {
    return (
      <div className={cn('relative aspect-video bg-black rounded-lg overflow-hidden flex items-center justify-center', className)}>
        <div className="text-center text-white p-8">
          <div className="text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">שגיאה</h3>
          <p className="text-gray-400">{videoState.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative aspect-video bg-black rounded-lg overflow-hidden group', className)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => videoState.isPlaying && setShowControls(false)}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-full"
        playsInline
        controlsList="nodownload noplaybackrate"
        disablePictureInPicture
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onEnded={handleEnded}
        onPlay={() => setVideoState(prev => ({ ...prev, isPlaying: true }))}
        onPause={() => setVideoState(prev => ({ ...prev, isPlaying: false }))}
        onWaiting={() => setVideoState(prev => ({ ...prev, isLoading: true }))}
        onCanPlay={() => setVideoState(prev => ({ ...prev, isLoading: false }))}
      />

      {/* Loading Overlay */}
      {videoState.isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <Loader2 className="w-12 h-12 text-white animate-spin" />
        </div>
      )}

      {/* Click to Play/Pause */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={togglePlay}
      />

      {/* Title */}
      {title && showControls && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/70 to-transparent">
          <h3 className="text-white font-semibold text-lg">{title}</h3>
        </div>
      )}

      {/* Controls */}
      <div 
        className={cn(
          'absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300',
          showControls ? 'opacity-100' : 'opacity-0'
        )}
      >
        {/* Progress Bar */}
        <div 
          className="w-full h-1 bg-white/30 rounded cursor-pointer mb-4 group/progress"
          onClick={handleSeek}
        >
          {/* Buffered */}
          <div 
            className="h-full bg-white/50 rounded absolute"
            style={{ width: `${videoState.buffered}%` }}
          />
          {/* Progress */}
          <div 
            className="h-full bg-primary rounded relative"
            style={{ width: `${(videoState.currentTime / videoState.duration) * 100 || 0}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button 
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors"
            >
              {videoState.isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6" />
              )}
            </button>

            {/* Volume */}
            <div className="flex items-center gap-2 group/volume">
              <button 
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors"
              >
                {videoState.isMuted || videoState.volume === 0 ? (
                  <VolumeX className="w-5 h-5" />
                ) : (
                  <Volume2 className="w-5 h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={videoState.isMuted ? 0 : videoState.volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 transition-all duration-200 accent-primary"
              />
            </div>

            {/* Time */}
            <span className="text-white text-sm">
              {formatTime(videoState.currentTime)} / {formatTime(videoState.duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Fullscreen */}
            <button 
              onClick={toggleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              {videoState.isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecureVideoPlayer;


