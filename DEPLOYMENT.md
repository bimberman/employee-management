# Employee Management System - EC2 Deployment Guide

## Deployment Scenarios
### 🆕 [Brand New Deployment](#brand-new-deployment)
For first-time deployment on a fresh EC2 instance.
### 🔄 [Existing Deployment Update](#existing-deployment-update)
For updating an already deployed application.

---

## 🆕 Brand New Deployment

### Step 1: Launch EC2 Instance
1. Go to AWS Console → EC2 → Launch Instance
2. Configure:
   - **Name:** employee-management-server
   - **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type:** t3.micro (2 vCPUs, 1 GB RAM) - **FREE TIER ELIGIBLE**
   - **Key Pair:** Create new or use existing (download .pem file)
   - **Storage:** 8 GB GP2 (Free tier eligible)
   - **Security Group:** Create new security group

3. **Security Group Rules:**
   ```
   Type: SSH, Protocol: TCP, Port: 22, Source: My IP
   Type: HTTP, Protocol: TCP, Port: 80, Source: 0.0.0.0/0
   Type: HTTPS, Protocol: TCP, Port: 443, Source: 0.0.0.0/0
   ```

### Step 2: Allocate Elastic IP
1. Go to AWS Console → EC2 → Elastic IPs
2. Click "Allocate Elastic IP address"
3. Associate with your EC2 instance

### Step 3: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-elastic-ip
```

### Step 4: Run Deployment Script
```bash
# Upload the deployment script
scp -i your-key.pem deploy.sh ubuntu@your-elastic-ip:/home/ubuntu/
scp -i your-key.pem config.env ubuntu@your-elastic-ip:/home/ubuntu/

# On EC2, run the deployment
chmod +x deploy.sh
./deploy.sh
```

### Step 5: Test Application
```bash
# Test locally
curl http://localhost:3000/api/health

# Test externally
curl http://your-elastic-ip/api/health
```

---

## 🔄 Existing Deployment Update

### Step 1: Connect to EC2
```bash
ssh -i your-key.pem ubuntu@your-elastic-ip
```

### Step 2: Update Application Code
```bash
cd /var/www/employee-management

# Pull latest changes
git pull origin main

# Install any new dependencies
npm install --production

# Run database migrations (if any)
npm run migrate

# Restart application
pm2 restart employee-management
```

### Step 3: Test Application
```bash
# Test locally
curl http://localhost:3000/api/health

# Test externally
curl http://your-elastic-ip/api/health
```

---

## Manual Deployment (Alternative)

If you prefer to run commands manually:

1. **Update system:** `sudo apt update && sudo apt upgrade -y`
2. **Install Node.js:** `curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs`
3. **Install PostgreSQL:** `sudo apt install postgresql postgresql-contrib -y`
4. **Install PM2:** `sudo npm install -g pm2`
5. **Install Nginx:** `sudo apt install nginx -y`
6. **Clone repository:** `git clone https://github.com/bimberman/employee-management.git /var/www/employee-management`
7. **Install dependencies:** `cd /var/www/employee-management && npm install --production`
8. **Set up database:** Follow the database setup steps in the script
9. **Configure Nginx:** Copy nginx.conf to /etc/nginx/sites-available/
10. **Start application:** `pm2 start ecosystem.config.js --env production`

## Post-Deployment

### Set Up Domain (Optional)
1. Point `employee-management.benimberman.com` to your Elastic IP
2. Update nginx.conf with your domain name
3. Restart Nginx: `sudo systemctl restart nginx`

### SSL Certificate (Optional)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d employee-management.benimberman.com
```

### Monitoring
```bash
# Check application status
pm2 status

# View logs
pm2 logs employee-management

# Restart application
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
5. **Regular security updates:** `sudo apt update && sudo apt upgrade -y`

## Backup Strategy

1. **Database backup:**
   ```bash
   pg_dump -h localhost -U employee_user employee_management > backup.sql
   ```

2. **Application backup:**
   ```bash
   tar -czf app-backup.tar.gz /var/www/employee-management
   ```

---

**🎉 CONGRATULATIONS!** Your employee management system should now be fully deployed and accessible at your Elastic IP address!