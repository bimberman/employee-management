#!/bin/bash

# Employee Management System Deployment Script
# Run this script on your EC2 instance

echo "🚀 Starting deployment of Employee Management System..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js (using NodeSource repository for latest LTS)
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
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
sudo mkdir -p /var/www/employee-management
sudo chown -R $USER:$USER /var/www/employee-management

echo "✅ System setup completed!"
echo ""
echo "Next steps:"
echo "1. Upload your application code to /var/www/employee-management"
echo "2. Run: cd /var/www/employee-management && npm install"
echo "3. Set up PostgreSQL database and user"
echo "4. Configure environment variables"
echo "5. Start the application with PM2"
