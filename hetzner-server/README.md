# Hetzner Video Streaming Server Setup

מדריך התקנה מלא לשרת Hetzner עם Nginx + HLS Streaming + Token Validation.

## ארכיטקטורת המערכת

```
┌────────────────┐    ┌─────────────────┐    ┌──────────────────────┐
│  Admin Panel   │───▶│  React App      │───▶│   Hetzner Ubuntu     │
│  Upload Videos │    │  (Token Gen)    │    │   /videos/           │
└────────────────┘    └─────────────────┘    │   ├── course-1/      │
                                              │   │   ├── lesson-1/  │
                                              │   │   └── lesson-2/  │
                                              │   └── course-2/      │
                                              └──────────────────────┘
```

## דרישות מקדימות

- שרת Ubuntu 22.04 LTS
- לפחות 4GB RAM
- דומיין מוגדר (למשל: videos.yourdomain.com)
- חשבון Supabase עם הטבלאות המתאימות

## התקנה מהירה

### 1. העלה את הקבצים לשרת

```bash
scp -r hetzner-server/* root@YOUR_SERVER_IP:/root/
```

### 2. התחבר לשרת והרץ את סקריפט ההתקנה

```bash
ssh root@YOUR_SERVER_IP
cd /root
chmod +x setup.sh
./setup.sh
```

### 3. הגדר את הקובץ .env

```bash
cp /opt/video-validation-service/env.example.txt /opt/video-validation-service/.env
nano /opt/video-validation-service/.env
```

עדכן את הערכים:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ALLOWED_ORIGINS=https://yourdomain.com
```

### 4. עדכן את הגדרות Nginx

```bash
nano /etc/nginx/sites-available/video-streaming
```

החלף `videos.yourdomain.com` בדומיין שלך.

### 5. הפעל SSL עם Let's Encrypt

```bash
certbot --nginx -d videos.yourdomain.com
```

### 6. הפעל מחדש את השירותים

```bash
systemctl restart video-validation nginx
```

## בדיקת התקנה

### בדוק את שירות ה-Validation:
```bash
curl http://localhost:3001/health
```

### בדוק את Nginx:
```bash
curl -I https://videos.yourdomain.com/health
```

## מבנה תיקיות

```
/var/www/videos/
├── course-{uuid}/
│   ├── chapter-{uuid}/
│   │   ├── {video-id}.mp4
│   │   └── {video-id}/
│   │       ├── index.m3u8
│   │       └── segment-*.ts
│   └── {video-id}.mp4
└── temp/
```

## API Endpoints

### Token Validation (Internal)
```
GET /api/validate-token
Headers: X-Token: {token}
```

### Video Upload (Admin Only)
```
POST /api/upload
Headers: Authorization: Bearer {supabase_jwt}
Body: FormData { video, courseId, chapterId?, videoId? }
```

### List Videos (Admin Only)
```
GET /api/list?courseId={id}
Headers: Authorization: Bearer {supabase_jwt}
```

### Delete Video (Admin Only)
```
DELETE /api/delete
Headers: Authorization: Bearer {supabase_jwt}
Body: { videoId, path }
```

## זרימת אבטחה

1. **משתמש מבקש לצפות בסרטון**
   - האפליקציה בודקת הרשאה ב-Supabase
   - נוצר token זמני (2 שעות) ונשמר ב-DB

2. **משתמש מנסה לטעון סרטון**
   - URL מכיל את ה-token
   - Nginx שולח בקשת `auth_request` לשירות Validation
   - השירות בודק ב-Supabase אם ה-token תקף

3. **אם ה-token תקף**
   - Nginx מגיש את הסרטון
   - תומך ב-HLS streaming ו-byte-range requests

4. **אם ה-token לא תקף**
   - מחזיר 401 Unauthorized

## משתני סביבה באפליקציית React

הוסף לקובץ `.env` באפליקציה:

```env
VITE_HETZNER_HOST=videos.yourdomain.com
VITE_HETZNER_API_URL=https://videos.yourdomain.com
VITE_HETZNER_STREAM_URL=https://videos.yourdomain.com
```

## תחזוקה

### ניקוי טוקנים שפג תוקפם
הרץ פעם ביום (cron):
```bash
0 3 * * * curl -X POST http://localhost:3001/api/cleanup-tokens
```

### גיבוי סרטונים
```bash
rsync -avz /var/www/videos/ backup-server:/backups/videos/
```

### לוגים
```bash
# Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log

# Validation service logs
journalctl -u video-validation -f
```

## פתרון בעיות

### שגיאה 401 בצפייה בסרטון
- בדוק שה-token נוצר נכון
- בדוק שהשעון בשרת מסונכרן
- בדוק את הלוגים של שירות ה-validation

### שגיאה 502 Bad Gateway
- בדוק ששירות ה-validation רץ: `systemctl status video-validation`
- בדוק את הפורט: `netstat -tlnp | grep 3001`

### סרטון לא נטען
- בדוק הרשאות קובץ: `ls -la /var/www/videos/`
- בדוק שהנתיב בDB מתאים לנתיב האמיתי

### HLS לא עובד
- בדוק ש-FFmpeg מותקן: `ffmpeg -version`
- בדוק את הלוגים בזמן המרה

## אבטחה

- [ ] הפעל UFW firewall
- [ ] הגבל גישת SSH לכתובות IP ספציפיות
- [ ] הפעל fail2ban
- [ ] השתמש רק ב-HTTPS
- [ ] הגדר CORS מדויק
- [ ] החלף service role key רק בשרת (לא בקליינט)


