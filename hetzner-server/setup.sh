#!/bin/bash

# Hetzner Video Streaming Server Setup Script
# Run this on a fresh Ubuntu 22.04 server

set -e

echo "=========================================="
echo "Hetzner Video Streaming Server Setup"
echo "=========================================="

# Update system
echo "Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "Installing required packages..."
apt install -y \
    nginx \
    nodejs \
    npm \
    ffmpeg \
    certbot \
    python3-certbot-nginx \
    ufw

# Install Node.js 20 LTS
echo "Installing Node.js 20 LTS..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Create video directory
echo "Creating video directory..."
mkdir -p /var/www/videos
chown -R www-data:www-data /var/www/videos
chmod -R 755 /var/www/videos

# Create validation service directory
echo "Setting up validation service..."
mkdir -p /opt/video-validation-service
cp -r validation-service/* /opt/video-validation-service/
cd /opt/video-validation-service

# Install dependencies
npm install

# Build TypeScript
npm run build

# Create systemd service
echo "Creating systemd service..."
cat > /etc/systemd/system/video-validation.service << 'EOF'
[Unit]
Description=Video Validation Service
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=/opt/video-validation-service
ExecStart=/usr/bin/node dist/index.js
Restart=on-failure
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=video-validation
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
EOF

# Copy nginx configuration
echo "Configuring Nginx..."
cp nginx.conf /etc/nginx/sites-available/video-streaming
ln -sf /etc/nginx/sites-available/video-streaming /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Configure firewall
echo "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# Enable and start services
echo "Enabling services..."
systemctl daemon-reload
systemctl enable video-validation
systemctl start video-validation
systemctl enable nginx
systemctl restart nginx

echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Update /opt/video-validation-service/.env with your credentials"
echo "2. Update /etc/nginx/sites-available/video-streaming with your domain"
echo "3. Run: certbot --nginx -d videos.yourdomain.com"
echo "4. Restart services: systemctl restart video-validation nginx"
echo ""
echo "Test the service:"
echo "  curl http://localhost:3001/health"
echo ""


