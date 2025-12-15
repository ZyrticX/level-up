#!/bin/bash

#############################################################
#  Hetzner Video Streaming Server - Complete Installation
#  
#  Run this script on a fresh Ubuntu 22.04/24.04 server
#  
#  Usage: 
#    chmod +x install-complete.sh
#    sudo ./install-complete.sh
#############################################################

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "╔══════════════════════════════════════════════════════════╗"
echo "║     Hetzner Video Streaming Server Installation          ║"
echo "║     Ubuntu 22.04/24.04 - Nginx + HLS + Token Auth        ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}Please run as root (use sudo)${NC}"
    exit 1
fi

# Get user input
echo -e "${YELLOW}Please provide the following information:${NC}"
echo ""

read -p "Enter your domain (e.g., videos.yourdomain.com): " DOMAIN
read -p "Enter your Supabase URL (e.g., https://xxx.supabase.co): " SUPABASE_URL
read -p "Enter your Supabase Service Role Key: " SUPABASE_KEY
read -p "Enter allowed origins for CORS (comma-separated, e.g., https://yourdomain.com): " ALLOWED_ORIGINS
read -p "Enter your email for SSL certificates: " SSL_EMAIL

echo ""
echo -e "${BLUE}Starting installation...${NC}"
echo ""

#############################################################
# Step 1: Update System
#############################################################
echo -e "${GREEN}[1/10] Updating system packages...${NC}"
apt update && apt upgrade -y

#############################################################
# Step 2: Install Required Packages
#############################################################
echo -e "${GREEN}[2/10] Installing required packages...${NC}"
apt install -y \
    nginx \
    ffmpeg \
    certbot \
    python3-certbot-nginx \
    ufw \
    curl \
    git \
    build-essential

#############################################################
# Step 3: Install Node.js 20 LTS
#############################################################
echo -e "${GREEN}[3/10] Installing Node.js 20 LTS...${NC}"
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
npm install -g pm2

#############################################################
# Step 4: Create Directory Structure
#############################################################
echo -e "${GREEN}[4/10] Creating directory structure...${NC}"
mkdir -p /var/www/videos/temp
mkdir -p /opt/video-validation-service
chown -R www-data:www-data /var/www/videos
chmod -R 755 /var/www/videos

#############################################################
# Step 5: Create Validation Service
#############################################################
echo -e "${GREEN}[5/10] Creating validation service...${NC}"

# Create package.json
cat > /opt/video-validation-service/package.json << 'PACKAGE_EOF'
{
  "name": "hetzner-video-validation-service",
  "version": "1.0.0",
  "description": "Video token validation and upload service",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.1",
    "express": "^4.18.2",
    "fluent-ffmpeg": "^2.1.2",
    "multer": "^1.4.5-lts.1",
    "uuid": "^9.0.1"
  }
}
PACKAGE_EOF

# Create main service file
cat > /opt/video-validation-service/index.js << 'SERVICE_EOF'
/**
 * Hetzner Video Validation Service
 */

const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('fluent-ffmpeg');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Video storage path
const VIDEOS_PATH = process.env.VIDEOS_PATH || '/var/www/videos';

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['*'],
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
  limits: { fileSize: 5 * 1024 * 1024 * 1024 }, // 5GB
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
async function verifyAdmin(req, res, next) {
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

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
}

// Token validation endpoint (called by Nginx auth_request)
app.get('/api/validate-token', async (req, res) => {
  try {
    const token = req.headers['x-token'] || req.query.token;
    const clientIp = req.headers['x-original-remote-addr'];

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

    console.log('Token validated:', { userId: data[0].user_id, videoId: data[0].video_id });
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

    // Create directory structure
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

    // Generate HLS stream (async, don't wait)
    generateHLS(finalVideoPath, hlsDir).catch(err => {
      console.error('HLS generation error:', err);
    });

    // Calculate relative paths
    const relativeVideoPath = finalVideoPath.replace(VIDEOS_PATH, '');
    const relativeHlsPath = path.join(hlsDir.replace(VIDEOS_PATH, ''), 'index.m3u8');

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
  } catch (error) {
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
  } catch (error) {
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
    const hlsDir = fullPath.replace(/\.[^/.]+$/, '');

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
        .update({ hetzner_path: null, hls_path: null })
        .eq('id', videoId);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

// Cleanup expired tokens
app.post('/api/cleanup-tokens', async (req, res) => {
  try {
    const { data, error } = await supabase.rpc('cleanup_expired_video_tokens');
    if (error) throw error;
    res.json({ success: true, deleted: data });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Helper: Get video duration using ffprobe
function getVideoDuration(filePath) {
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
function generateHLS(inputPath, outputDir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'index.m3u8');

    ffmpeg(inputPath)
      .outputOptions([
        '-codec: copy',
        '-start_number 0',
        '-hls_time 10',
        '-hls_list_size 0',
        '-f hls',
      ])
      .output(outputPath)
      .on('end', () => {
        console.log('HLS generation complete:', outputPath);
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('HLS generation error:', err);
        resolve(null); // Don't fail, MP4 streaming still works
      })
      .run();
  });
}

// Helper: List videos recursively
function listVideosRecursively(dir, basePath) {
  const results = [];
  const videoExtensions = ['.mp4', '.webm', '.mov', '.avi'];

  function walkDir(currentDir) {
    try {
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
    } catch (err) {
      console.error('Error walking directory:', err);
    }
  }

  walkDir(dir);
  return results;
}

// Start server
app.listen(PORT, () => {
  console.log(`Video Validation Service running on port ${PORT}`);
  console.log(`Videos directory: ${VIDEOS_PATH}`);
});
SERVICE_EOF

# Create .env file
cat > /opt/video-validation-service/.env << ENV_EOF
PORT=3001
SUPABASE_URL=${SUPABASE_URL}
SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_KEY}
VIDEOS_PATH=/var/www/videos
ALLOWED_ORIGINS=${ALLOWED_ORIGINS}
ENV_EOF

# Install dependencies
cd /opt/video-validation-service
npm install

#############################################################
# Step 6: Configure Nginx
#############################################################
echo -e "${GREEN}[6/10] Configuring Nginx...${NC}"

cat > /etc/nginx/sites-available/video-streaming << NGINX_EOF
# Video Streaming Server Configuration
# Domain: ${DOMAIN}

upstream validation_api {
    server 127.0.0.1:3001;
    keepalive 32;
}

server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN};

    # Will be updated by certbot for HTTPS redirect
    location / {
        return 301 https://\$server_name\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};

    # SSL will be configured by certbot
    # ssl_certificate /etc/letsencrypt/live/${DOMAIN}/fullchain.pem;
    # ssl_certificate_key /etc/letsencrypt/live/${DOMAIN}/privkey.pem;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # CORS Headers
    add_header Access-Control-Allow-Origin "${ALLOWED_ORIGINS}" always;
    add_header Access-Control-Allow-Methods "GET, POST, DELETE, OPTIONS" always;
    add_header Access-Control-Allow-Headers "Authorization, Content-Type, Range" always;
    add_header Access-Control-Expose-Headers "Content-Length, Content-Range" always;

    # Root directory
    root /var/www/videos;

    # Client max body size for uploads
    client_max_body_size 5G;

    # Health check
    location /health {
        return 200 'OK';
        add_header Content-Type text/plain;
    }

    # Token validation (internal)
    location = /validate {
        internal;
        proxy_pass http://validation_api/api/validate-token;
        proxy_pass_request_body off;
        proxy_set_header Content-Length "";
        proxy_set_header X-Original-URI \$request_uri;
        proxy_set_header X-Original-Remote-Addr \$remote_addr;
        proxy_set_header X-Token \$arg_token;
    }

    # Video streaming with token validation
    location ~ ^/v/(.+)\$ {
        # Validate token
        auth_request /validate;
        auth_request_set \$auth_status \$upstream_status;

        # If validation fails
        error_page 401 = @unauthorized;
        error_page 403 = @forbidden;

        # Serve from videos directory
        alias /var/www/videos/\$1;

        # Enable byte-range requests
        add_header Accept-Ranges bytes;
        add_header Cache-Control "private, max-age=3600";

        # MP4 streaming
        mp4;
        mp4_buffer_size 1m;
        mp4_max_buffer_size 5m;

        # HLS
        location ~* \\.m3u8\$ {
            add_header Cache-Control "no-cache";
            add_header Content-Type "application/vnd.apple.mpegurl";
        }

        location ~* \\.ts\$ {
            add_header Cache-Control "max-age=3600";
            add_header Content-Type "video/mp2t";
        }
    }

    # Direct stream (for testing - remove in production)
    location /stream/ {
        alias /var/www/videos/;
        mp4;
        mp4_buffer_size 1m;
        mp4_max_buffer_size 5m;
    }

    # Unauthorized response
    location @unauthorized {
        return 401 '{"error": "Unauthorized", "message": "Invalid or expired token"}';
        add_header Content-Type application/json always;
    }

    # Forbidden response
    location @forbidden {
        return 403 '{"error": "Forbidden", "message": "Access denied"}';
        add_header Content-Type application/json always;
    }

    # API endpoints
    location /api/ {
        proxy_pass http://validation_api;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;

        # Timeouts for uploads
        proxy_connect_timeout 600;
        proxy_send_timeout 600;
        proxy_read_timeout 600;

        # For file uploads
        client_max_body_size 5G;
        proxy_request_buffering off;
    }

    # Deny access to sensitive files
    location ~ /\\. {
        deny all;
    }
}
NGINX_EOF

# Enable site
ln -sf /etc/nginx/sites-available/video-streaming /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test nginx config
nginx -t

#############################################################
# Step 7: Setup PM2 for Node.js service
#############################################################
echo -e "${GREEN}[7/10] Setting up PM2 service manager...${NC}"

cd /opt/video-validation-service
pm2 start index.js --name "video-validation"
pm2 save
pm2 startup systemd -u root --hp /root

#############################################################
# Step 8: Configure Firewall
#############################################################
echo -e "${GREEN}[8/10] Configuring firewall...${NC}"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

#############################################################
# Step 9: Setup SSL with Let's Encrypt
#############################################################
echo -e "${GREEN}[9/10] Setting up SSL certificate...${NC}"
systemctl restart nginx

# Get SSL certificate
certbot --nginx -d ${DOMAIN} --non-interactive --agree-tos --email ${SSL_EMAIL} --redirect

#############################################################
# Step 10: Setup Cron for token cleanup
#############################################################
echo -e "${GREEN}[10/10] Setting up cron jobs...${NC}"

# Add cron job for token cleanup (daily at 3 AM)
(crontab -l 2>/dev/null; echo "0 3 * * * curl -s -X POST http://localhost:3001/api/cleanup-tokens > /dev/null 2>&1") | crontab -

#############################################################
# Final restart
#############################################################
echo -e "${GREEN}Restarting services...${NC}"
systemctl restart nginx
pm2 restart video-validation

#############################################################
# Done!
#############################################################
echo ""
echo -e "${GREEN}╔══════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║              Installation Complete! 🎉                    ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Your video streaming server is now running at:${NC}"
echo -e "  ${YELLOW}https://${DOMAIN}${NC}"
echo ""
echo -e "${BLUE}Test the installation:${NC}"
echo -e "  ${YELLOW}curl https://${DOMAIN}/health${NC}"
echo -e "  ${YELLOW}curl http://localhost:3001/health${NC}"
echo ""
echo -e "${BLUE}Directory structure:${NC}"
echo -e "  Videos: ${YELLOW}/var/www/videos/${NC}"
echo -e "  Service: ${YELLOW}/opt/video-validation-service/${NC}"
echo ""
echo -e "${BLUE}Useful commands:${NC}"
echo -e "  ${YELLOW}pm2 status${NC}                    - Check service status"
echo -e "  ${YELLOW}pm2 logs video-validation${NC}     - View service logs"
echo -e "  ${YELLOW}pm2 restart video-validation${NC}  - Restart service"
echo -e "  ${YELLOW}tail -f /var/log/nginx/error.log${NC} - Nginx error logs"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo -e "  1. Add these to your React app's .env file:"
echo -e "     ${YELLOW}VITE_HETZNER_API_URL=https://${DOMAIN}${NC}"
echo -e "     ${YELLOW}VITE_HETZNER_STREAM_URL=https://${DOMAIN}${NC}"
echo ""
echo -e "  2. Run the Supabase migration to add the required tables"
echo ""
echo -e "  3. Upload your first video via the admin panel!"
echo ""


