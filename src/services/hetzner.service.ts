/**
 * Hetzner Video Streaming Service
 * 
 * This service handles:
 * 1. Uploading videos to Hetzner server via SFTP/SSH
 * 2. Generating secure access tokens
 * 3. Managing video paths and HLS streams
 */

import { supabase } from '@/integrations/supabase/client';

// Hetzner server configuration (set these in environment variables)
const HETZNER_CONFIG = {
  host: import.meta.env.VITE_HETZNER_HOST || '',
  apiUrl: import.meta.env.VITE_HETZNER_API_URL || '',
  streamUrl: import.meta.env.VITE_HETZNER_STREAM_URL || '',
};

export interface VideoToken {
  token: string;
  expiresAt: Date;
  videoUrl: string;
  hlsUrl?: string;
}

export interface HetznerVideoInfo {
  id: string;
  title: string;
  hetznerPath: string | null;
  hlsPath: string | null;
  duration: number;
  isPreview: boolean;
}

/**
 * Generate a secure video access token
 */
export async function generateVideoToken(
  videoId: string,
  expiresInMinutes: number = 120
): Promise<VideoToken | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    // Call the database function to generate token
    const { data, error } = await supabase.rpc('generate_video_token', {
      p_user_id: user.id,
      p_video_id: videoId,
      p_ip_address: null, // Can be set from server-side
      p_user_agent: navigator.userAgent,
      p_expires_in_minutes: expiresInMinutes,
    });

    if (error) {
      console.error('Error generating video token:', error);
      throw error;
    }

    // Get video info for URLs
    const { data: video } = await supabase
      .from('videos')
      .select('hetzner_path, hls_path')
      .eq('id', videoId)
      .single();

    if (!video) {
      throw new Error('Video not found');
    }

    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000);

    return {
      token: data,
      expiresAt,
      videoUrl: buildSecureVideoUrl(video.hetzner_path, data),
      hlsUrl: video.hls_path ? buildSecureVideoUrl(video.hls_path, data) : undefined,
    };
  } catch (error) {
    console.error('Failed to generate video token:', error);
    return null;
  }
}

/**
 * Build secure video URL with token
 */
export function buildSecureVideoUrl(path: string | null, token: string): string {
  if (!path) return '';
  
  // Build URL with token as query parameter
  const baseUrl = HETZNER_CONFIG.streamUrl || HETZNER_CONFIG.apiUrl;
  return `${baseUrl}/stream${path}?token=${token}`;
}

/**
 * Check if user has access to a video
 */
export async function checkVideoAccess(videoId: string): Promise<boolean> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Check if video is preview (free access)
    const { data: video } = await supabase
      .from('videos')
      .select('is_preview, course_id')
      .eq('id', videoId)
      .single();

    if (!video) return false;
    if (video.is_preview) return true;

    // Check enrollment
    const { data: enrollment } = await supabase
      .from('course_enrollments')
      .select('id')
      .eq('user_id', user.id)
      .eq('course_id', video.course_id)
      .eq('payment_status', 'completed')
      .single();

    return !!enrollment;
  } catch (error) {
    console.error('Error checking video access:', error);
    return false;
  }
}

/**
 * Get video info with Hetzner paths
 */
export async function getVideoWithHetznerInfo(videoId: string): Promise<HetznerVideoInfo | null> {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('id, title, hetzner_path, hls_path, duration, is_preview')
      .eq('id', videoId)
      .single();

    if (error || !data) return null;

    return {
      id: data.id,
      title: data.title,
      hetznerPath: data.hetzner_path,
      hlsPath: data.hls_path,
      duration: data.duration,
      isPreview: data.is_preview || false,
    };
  } catch (error) {
    console.error('Error fetching video info:', error);
    return null;
  }
}

/**
 * Upload video to Hetzner server (Admin only)
 * This calls the backend API which handles the actual upload
 */
export async function uploadVideoToHetzner(
  file: File,
  courseId: string,
  chapterId: string | null,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; path?: string; error?: string }> {
  try {
    const formData = new FormData();
    formData.append('video', file);
    formData.append('courseId', courseId);
    if (chapterId) {
      formData.append('chapterId', chapterId);
    }

    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${HETZNER_CONFIG.apiUrl}/upload`, {
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
    return { success: true, path: result.path };
  } catch (error: any) {
    console.error('Error uploading to Hetzner:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Delete video from Hetzner server (Admin only)
 */
export async function deleteVideoFromHetzner(
  videoId: string,
  hetznerPath: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const response = await fetch(`${HETZNER_CONFIG.apiUrl}/delete`, {
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

    return { success: true };
  } catch (error: any) {
    console.error('Error deleting from Hetzner:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Get list of videos on Hetzner server (Admin only)
 */
export async function listHetznerVideos(
  courseId?: string
): Promise<{ path: string; size: number; modified: Date }[]> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      throw new Error('Not authenticated');
    }

    const url = new URL(`${HETZNER_CONFIG.apiUrl}/list`);
    if (courseId) {
      url.searchParams.append('courseId', courseId);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to list videos');
    }

    return await response.json();
  } catch (error) {
    console.error('Error listing Hetzner videos:', error);
    return [];
  }
}

/**
 * Sync video paths from Hetzner to Supabase (Admin only)
 */
export async function syncHetznerPaths(
  videoId: string,
  hetznerPath: string,
  hlsPath?: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('videos')
      .update({
        hetzner_path: hetznerPath,
        hls_path: hlsPath || null,
      })
      .eq('id', videoId);

    return !error;
  } catch (error) {
    console.error('Error syncing Hetzner paths:', error);
    return false;
  }
}

export default {
  generateVideoToken,
  buildSecureVideoUrl,
  checkVideoAccess,
  getVideoWithHetznerInfo,
  uploadVideoToHetzner,
  deleteVideoFromHetzner,
  listHetznerVideos,
  syncHetznerPaths,
};


