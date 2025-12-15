# מדריך התקנה מהיר - שרת Hetzner

## 📋 מה תצטרך לפני ההתקנה

1. **שרת Hetzner** עם Ubuntu 22.04/24.04
2. **דומיין** שמצביע לכתובת IP של השרת (A Record)
3. **פרטי Supabase**:
   - Supabase URL (מהגדרות הפרויקט)
   - Service Role Key (מהגדרות הפרויקט → API)

---

## 🚀 התקנה (5 דקות)

### שלב 1: העלה את הקבצים לשרת

מהמחשב שלך, הרץ:

```bash
# העלה את תיקיית hetzner-server לשרת
scp -r hetzner-server root@YOUR_SERVER_IP:/root/
```

### שלב 2: התחבר לשרת

```bash
ssh root@YOUR_SERVER_IP
```

### שלב 3: הרץ את סקריפט ההתקנה

```bash
cd /root/hetzner-server
chmod +x install-complete.sh
./install-complete.sh
```

הסקריפט ישאל אותך:
- **Domain**: הדומיין שלך (למשל: `videos.levelup.co.il`)
- **Supabase URL**: כתובת הפרויקט שלך
- **Supabase Service Key**: המפתח מהגדרות → API
- **Allowed Origins**: הדומיין של האפליקציה (למשל: `https://levelup.co.il`)
- **Email**: לתעודת SSL

---

## ✅ בדיקה שההתקנה הצליחה

```bash
# בדוק את שירות ה-validation
curl http://localhost:3001/health

# בדוק את Nginx
curl https://YOUR_DOMAIN/health
```

אמור לקבל: `{"status":"ok"...}`

---

## ⚙️ הגדרות באפליקציית React

הוסף לקובץ `.env`:

```env
VITE_HETZNER_API_URL=https://videos.yourdomain.com
VITE_HETZNER_STREAM_URL=https://videos.yourdomain.com
```

---

## 📊 הרצת ה-Migration ב-Supabase

הרץ מהפרויקט המקומי:

```bash
npx supabase db push
```

או העתק את תוכן הקובץ:
`supabase/migrations/20251210000000_hetzner_video_streaming.sql`

ולהדביק ב-Supabase Dashboard → SQL Editor

---

## 🎬 שימוש

### העלאת סרטון (מממשק Admin)
1. לך ל: `/admin/hetzner-videos`
2. בחר קורס
3. העלה קובץ וידאו

### צפייה בסרטון
הסרטון יהיה זמין בכתובת:
```
https://YOUR_DOMAIN/v/course-XXX/video.mp4?token=GENERATED_TOKEN
```

---

## 🛠️ פקודות שימושיות

```bash
# סטטוס שירותים
pm2 status
systemctl status nginx

# לוגים
pm2 logs video-validation
tail -f /var/log/nginx/error.log

# הפעלה מחדש
pm2 restart video-validation
systemctl restart nginx

# בדיקת שטח דיסק
df -h /var/www/videos
```

---

## 🔧 פתרון בעיות

### שגיאה 502 Bad Gateway
```bash
pm2 restart video-validation
```

### שגיאה 401 Unauthorized
- בדוק שה-Service Role Key נכון
- בדוק שהטבלאות והפונקציות ב-Supabase נוצרו

### סרטון לא עולה
```bash
# בדוק הרשאות
ls -la /var/www/videos/
chown -R www-data:www-data /var/www/videos/
```

### HLS לא עובד
```bash
# בדוק ש-FFmpeg מותקן
ffmpeg -version
```


