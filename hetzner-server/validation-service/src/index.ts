/**
 * Hetzner Video Validation Service
 * 
 * This Node.js service runs on the Hetzner server and handles:
 * 1. Token validation for video streaming
 * 2. Video upload and HLS conversion
 * 3. Video management (list, delete)
 */

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role for server-side operations
);

// Video storage path
const VIDEOS_PATH = process.env.VIDEOS_PATH || '/var/www/videos';

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['https://yourdomain.com'],
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type', 'X-Token', 'X-Original-URI', 'X-Original-Remote-Addr'],
}));

app.use(express.json());

// Multer configuration for video uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = path.join(VIDEOS_PATH, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 * 1024, // 5GB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only video files are allowed.'));
    }
  },
});

// Middleware to verify admin authentication
async function verifyAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing authorization token' });
    }

    const token = authHeader.substring(7);
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Check if user is admin
    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Token validation endpoint (called by Nginx auth_request)
app.get('/api/validate-token', async (req, res) => {
  try {
    const token = req.headers['x-token'] as string || req.query.token as string;
    const originalUri = req.headers['x-original-uri'] as string;
    const clientIp = req.headers['x-original-remote-addr'] as string;

    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    // Validate token in database
    const { data, error } = await supabase.rpc('validate_video_token', {
      p_token: token,
      p_video_id: null,
      p_ip_address: clientIp || null,
    });

    if (error || !data || data.length === 0 || !data[0].is_valid) {
      console.log('Token validation failed:', { token: token.substring(0, 8) + '...', error });
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Token is valid
    console.log('Token validated successfully:', { 
      userId: data[0].user_id, 
      videoId: data[0].video_id,
    });

    res.status(200).json({ valid: true });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(500).json({ error: 'Validation failed' });
  }
});

// Video upload endpoint
app.post('/api/upload', verifyAdmin, upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    const { courseId, chapterId, videoId, title } = req.body;
    
    if (!courseId) {
      return res.status(400).json({ error: 'Course ID is required' });
    }

    const tempFilePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname);
    const videoFileName = `${videoId || uuidv4()}${fileExtension}`;

    // Create directory structure: /videos/course-{courseId}/chapter-{chapterId}/
    let videoDir = path.join(VIDEOS_PATH, `course-${courseId}`);
    if (chapterId) {
      videoDir = path.join(videoDir, `chapter-${chapterId}`);
    }

    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true });
    }

    const finalVideoPath = path.join(videoDir, videoFileName);
    const hlsDir = path.join(videoDir, path.basename(videoFileName, fileExtension));

    // Move file to final location
    fs.renameSync(tempFilePath, finalVideoPath);

    // Get video duration
    const duration = await getVideoDuration(finalVideoPath);

    // Generate HLS stream
    const hlsPath = await generateHLS(finalVideoPath, hlsDir);

    // Calculate relative paths for database
    const relativeVideoPath = finalVideoPath.replace(VIDEOS_PATH, '');
    const relativeHlsPath = hlsPath ? hlsPath.replace(VIDEOS_PATH, '') : null;

    // Update database if videoId provided
    if (videoId) {
      await supabase
        .from('videos')
        .update({
          hetzner_path: relativeVideoPath,
          hls_path: relativeHlsPath,
          duration: Math.round(duration),
        })
        .eq('id', videoId);
    }

    res.json({
      success: true,
      path: relativeVideoPath,
      hlsPath: relativeHlsPath,
      duration: Math.round(duration),
    });
  } catch (error: any) {
    console.error('Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// List videos endpoint
app.get('/api/list', verifyAdmin, async (req, res) => {
  try {
    const { courseId } = req.query;
    let searchDir = VIDEOS_PATH;

    if (courseId) {
      searchDir = path.join(VIDEOS_PATH, `course-${courseId}`);
    }

    if (!fs.existsSync(searchDir)) {
      return res.json([]);
    }

    const videos = listVideosRecursively(searchDir, VIDEOS_PATH);
    res.json(videos);
  } catch (error: any) {
    console.error('List error:', error);
    res.status(500).json({ error: error.message || 'Failed to list videos' });
  }
});

// Delete video endpoint
app.delete('/api/delete', verifyAdmin, async (req, res) => {
  try {
    const { videoId, path: videoPath } = req.body;

    if (!videoPath) {
      return res.status(400).json({ error: 'Video path is required' });
    }

    const fullPath = path.join(VIDEOS_PATH, videoPath);
    const hlsDir = fullPath.replace(/\.[^/.]+$/, ''); // Remove extension for HLS dir

    // Delete video file
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    // Delete HLS directory if exists
    if (fs.existsSync(hlsDir)) {
      fs.rmSync(hlsDir, { recursive: true });
    }

    // Update database if videoId provided
    if (videoId) {
      await supabase
        .from('videos')
        .update({
          hetzner_path: null,
          hls_path: null,
        })
        .eq('id', videoId);
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper: Get video duration using ffprobe
function getVideoDuration(filePath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(filePath, (err, metadata) => {
      if (err) {
        reject(err);
      } else {
        resolve(metadata.format.duration || 0);
      }
    });
  });
}

// Helper: Generate HLS stream
function generateHLS(inputPath: string, outputDir: string): Promise<string | null> {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'index.m3u8');

    ffmpeg(inputPath)
      .outputOptions([
        '-codec: copy', // Copy codecs without re-encoding (fast)
        '-start_number 0',
        '-hls_time 10', // 10 second segments
        '-hls_list_size 0', // Include all segments in playlist
        '-f hls',
      ])
      .output(outputPath)
      .on('end', () => {
        console.log('HLS generation complete:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('HLS generation error:', err);
        // Don't fail if HLS generation fails, MP4 streaming still works
        resolve(null);
      })
      .run();
  });
}

// Helper: List videos recursively
function listVideosRecursively(dir: string, basePath: string): { path: string; size: number; modified: Date }[] {
  const results: { path: string; size: number; modified: Date }[] = [];
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];

  function walkDir(currentDir: string) {
    const files = fs.readdirSync(currentDir);
    
    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        walkDir(filePath);
      } else if (videoExtensions.includes(path.extname(file).toLowerCase())) {
        results.push({
          path: filePath.replace(basePath, ''),
          size: stat.size,
          modified: stat.mtime,
        });
      }
    }
  }

  walkDir(dir);
  return results;
}

// Start server
app.listen(PORT, () => {
  console.log(`Hetzner Video Validation Service running on port ${PORT}`);
  console.log(`Videos directory: ${VIDEOS_PATH}`);
});


