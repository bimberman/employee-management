# Employee Management System - EC2 Deployment Guide

## Prerequisites
- EC2 instance running Ubuntu 20.04+ or Amazon Linux 2
- SSH access to your EC2 instance
- Domain name (optional, for SSL)

## Step 1: Prepare Your Local Environment

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Add deployment configuration"
   git push origin main
   ```

2. **Create a deployment package:**
   ```bash
   # Create a deployment archive (excluding node_modules and .env)
   tar -czf employee-management.tar.gz \
     --exclude=node_modules \
     --exclude=.env \
     --exclude=.git \
     --exclude=*.log \
     .
   ```

## Step 2: Set Up EC2 Instance

1. **Connect to your EC2 instance:**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   ```

2. **Run the deployment script:**
   ```bash
   # Upload and run the deployment script
   chmod +x deploy.sh
   ./deploy.sh
   ```

## Step 3: Configure PostgreSQL

1. **Switch to postgres user and create database:**
   ```bash
   sudo -u postgres psql
   ```

2. **In PostgreSQL shell:**
   ```sql
   CREATE DATABASE employee_management;
   CREATE USER employee_user WITH PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE employee_management TO employee_user;
   \q
   ```

3. **Configure PostgreSQL for remote connections (if needed):**
   ```bash
   sudo nano /etc/postgresql/*/main/postgresql.conf
   # Uncomment and set: listen_addresses = 'localhost'
   
   sudo nano /etc/postgresql/*/main/pg_hba.conf
   # Add: local   all             employee_user                    md5
   ```

4. **Restart PostgreSQL:**
   ```bash
   sudo systemctl restart postgresql
   ```

## Step 4: Deploy Application Code

1. **Upload your code to EC2:**
   ```bash
   # From your local machine
   scp -i your-key.pem employee-management.tar.gz ubuntu@your-ec2-ip:/tmp/
   ```

2. **On EC2, extract and set up:**
   ```bash
   cd /var/www/employee-management
   tar -xzf /tmp/employee-management.tar.gz
   npm install --production
   ```

3. **Set up environment variables:**
   ```bash
   cp env.production.template .env
   nano .env  # Edit with your actual values
   ```

4. **Run database migration:**
   ```bash
   npm run migrate
   ```

## Step 5: Configure Nginx

1. **Copy Nginx configuration:**
   ```bash
   sudo cp nginx.conf /etc/nginx/sites-available/employee-management
   sudo ln -s /etc/nginx/sites-available/employee-management /etc/nginx/sites-enabled/
   sudo rm /etc/nginx/sites-enabled/default
   ```

2. **Update server name in config:**
   ```bash
   sudo nano /etc/nginx/sites-available/employee-management
   # Replace 'your-domain.com' with your actual domain or EC2 public IP
   ```

3. **Test and restart Nginx:**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

## Step 6: Start Application with PM2

1. **Start the application:**
   ```bash
   cd /var/www/employee-management
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

2. **Verify application is running:**
   ```bash
   pm2 status
   pm2 logs employee-management
   ```

## Step 7: Configure Firewall

```bash
# Allow HTTP and HTTPS traffic
sudo ufw allow 80
sudo ufw allow 443
sudo ufw allow 22  # SSH
sudo ufw enable
```

## Step 8: Set Up SSL (Optional but Recommended)

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

## Step 9: Monitor and Maintain

1. **Check application status:**
   ```bash
   pm2 status
   pm2 logs employee-management
   ```

2. **Restart application if needed:**
   ```bash
   pm2 restart employee-management
   ```

3. **Update application:**
   ```bash
   # Pull latest changes
   git pull origin main
   npm install --production
   npm run migrate  # If database changes
   pm2 restart employee-management
   ```

## Troubleshooting

### Application won't start:
- Check logs: `pm2 logs employee-management`
- Verify database connection: `npm run test-db`
- Check environment variables: `cat .env`

### Database connection issues:
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database exists: `sudo -u postgres psql -c "\l"`
- Test connection: `psql -h localhost -U employee_user -d employee_management`

### Nginx issues:
- Check configuration: `sudo nginx -t`
- Check logs: `sudo tail -f /var/log/nginx/error.log`
- Restart Nginx: `sudo systemctl restart nginx`

## Security Considerations

1. **Change default passwords**
2. **Use strong database passwords**
3. **Enable firewall**
4. **Set up SSL certificate**
5. **Regular security updates:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

## Backup Strategy

1. **Database backup:**
   ```bash
   pg_dump -h localhost -U employee_user employee_management > backup.sql
   ```

2. **Application backup:**
   ```bash
   tar -czf app-backup.tar.gz /var/www/employee-management
   ```
