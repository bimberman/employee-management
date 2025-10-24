# Update deploy.sh to use configuration
cat > deploy.sh << 'EOF'
#!/bin/bash

# Employee Management System Deployment Script
# Run this script on your EC2 instance

# Load configuration
if [ -f "config.env" ]; then
    source config.env
else
    echo "❌ config.env file not found. Please create it first."
    exit 1
fi

echo "🚀 Starting deployment of Employee Management System..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
echo "🗄️ Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install PM2 globally for process management
echo "⚙️ Installing PM2..."
sudo npm install -g pm2

# Install Nginx
echo "🌐 Installing Nginx..."
sudo apt install nginx -y

# Start and enable Nginx
sudo systemctl start nginx
sudo systemctl enable nginx

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p ${APP_DIR}
sudo chown -R ${APP_USER}:${APP_USER} ${APP_DIR}

# Clone the repository
echo "📥 Cloning application code..."
cd ${APP_DIR}
git clone ${REPO_URL} .

# Install dependencies
echo "📦 Installing dependencies..."
npm install --production

# Set up PostgreSQL database and user
echo "🗄️ Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE ${DB_NAME};"
sudo -u postgres psql -c "CREATE USER ${DB_USER} WITH PASSWORD '${DB_PASSWORD}';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};"

# Set up environment variables
echo "⚙️ Setting up environment variables..."
cat > .env << ENVEOF
# Production Environment Variables
DB_HOST=${DB_HOST}
DB_PORT=${DB_PORT}
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
PORT=${APP_PORT}
NODE_ENV=production
ENVEOF

# Run database migration
echo "🔄 Running database migration..."
npm run migrate

# Configure Nginx
echo "🌐 Configuring Nginx..."
# Update nginx.conf with domain name
sed -i "s/your-domain.com/${DOMAIN_NAME}/g" nginx.conf
sed -i "s/your-elastic-ip/${DOMAIN_IP}/g" nginx.conf

sudo cp nginx.conf /etc/nginx/sites-available/${APP_NAME}
sudo ln -s /etc/nginx/sites-available/${APP_NAME} /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx

# Start application with PM2
echo "🚀 Starting application..."
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow ${SSH_PORT}
sudo ufw allow ${HTTP_PORT}
sudo ufw allow ${HTTPS_PORT}
sudo ufw enable

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 Your Employee Management System is now live!"
echo "📍 Access your application at: http://${DOMAIN_IP}"
echo "🔧 API Health Check: http://${DOMAIN_IP}/api/health"
echo ""
echo "Next steps:"
echo "1. Test the application: curl http://${DOMAIN_IP}/api/health"
echo "2. Set up domain: ${DOMAIN_NAME}"
echo "3. Configure SSL certificate (optional)"
echo "4. Set up monitoring and backups"
EOF

# Make the script executable
chmod +x deploy.sh