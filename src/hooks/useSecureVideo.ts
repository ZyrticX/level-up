/**
 * useSecureVideo Hook
 * 
 * A hook for managing secure video playback with Hetzner streaming
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  generateVideoToken, 
  checkVideoAccess, 
  VideoToken,
  getVideoWithHetznerInfo,
  HetznerVideoInfo
} from '@/services/hetzner.service';

interface UseSecureVideoResult {
  hasAccess: boolean | null;
  isLoading: boolean;
  error: string | null;
  videoToken: VideoToken | null;
  videoInfo: HetznerVideoInfo | null;
  refreshToken: () => Promise<void>;
}

export function useSecureVideo(videoId: string): UseSecureVideoResult {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoToken, setVideoToken] = useState<VideoToken | null>(null);
  const [videoInfo, setVideoInfo] = useState<HetznerVideoInfo | null>(null);

  const refreshToken = useCallback(async () => {
    try {
      const token = await generateVideoToken(videoId);
      if (token) {
        setVideoToken(token);
        setError(null);
      } else {
        setError('שגיאה ביצירת גישה לסרטון');
      }
    } catch (err: any) {
      setError(err.message || 'שגיאה ביצירת גישה');
    }
  }, [videoId]);

  useEffect(() => {
    async function initialize() {
      setIsLoading(true);
      setError(null);

      try {
        // Check access
        const access = await checkVideoAccess(videoId);
        setHasAccess(access);

        if (!access) {
          setError('אין לך הרשאה לצפות בסרטון זה');
          setIsLoading(false);
          return;
        }

        // Get video info
        const info = await getVideoWithHetznerInfo(videoId);
        setVideoInfo(info);

        if (!info?.hetznerPath) {
          setError('הסרטון לא זמין כרגע');
          setIsLoading(false);
          return;
        }

        // Generate token
        const token = await generateVideoToken(videoId);
        if (!token) {
          setError('שגיאה ביצירת גישה לסרטון');
          setIsLoading(false);
          return;
        }

        setVideoToken(token);
      } catch (err: any) {
        setError(err.message || 'שגיאה בטעינת הסרטון');
      } finally {
        setIsLoading(false);
      }
    }

    if (videoId) {
      initialize();
    }
  }, [videoId]);

  // Auto-refresh token before expiry
  useEffect(() => {
    if (!videoToken) return;

    const refreshTime = videoToken.expiresAt.getTime() - Date.now() - 5 * 60 * 1000; // 5 min before expiry
    
    if (refreshTime > 0) {
      const timeout = setTimeout(refreshToken, refreshTime);
      return () => clearTimeout(timeout);
    }
  }, [videoToken, refreshToken]);

  return {
    hasAccess,
    isLoading,
    error,
    videoToken,
    videoInfo,
    refreshToken,
  };
}

export default useSecureVideo;


