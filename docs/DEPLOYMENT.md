# SealTheDeal Deployment Guide

This guide covers deploying SealTheDeal to various platforms, with detailed instructions for Vercel (recommended) and other deployment options.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Vercel Deployment (Recommended)](#vercel-deployment-recommended)
3. [Manual Deployment](#manual-deployment)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Post-Deployment Configuration](#post-deployment-configuration)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## 🔧 Prerequisites

Before deploying, ensure you have:

- **Node.js 18+** installed
- **Git** for version control
- **PostgreSQL database** (Neon recommended)
- **OpenAI API key**
- **Clerk account** for authentication
- **Domain name** (optional, for custom domains)

### Required Services

1. **Database**: PostgreSQL (recommend Neon or Supabase)
2. **Authentication**: Clerk account
3. **AI Services**: OpenAI API access
4. **Hosting**: Vercel (recommended) or other platform
5. **Email**: SMTP service (optional, for notifications)

## 🚀 Vercel Deployment (Recommended)

Vercel is the recommended platform for deploying SealTheDeal due to its excellent Next.js support and built-in features.

### Step 1: Prepare Repository

1. **Fork or Clone** the repository:
   ```bash
   git clone https://github.com/yourusername/sealthedeal.git
   cd sealthedeal
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Test Locally**:
   ```bash
   npm run dev
   ```

### Step 2: Connect to Vercel

1. **Sign up** at [vercel.com](https://vercel.com)
2. **Import Project**:
   - Click "New Project"
   - Import from GitHub/GitLab/Bitbucket
   - Select your SealTheDeal repository
   - Choose "Next.js" framework preset

3. **Configure Build Settings**:
   - Framework Preset: `Next.js`
   - Root Directory: `./` (default)
   - Build Command: `npm run build`
   - Output Directory: `.next` (default)
   - Install Command: `npm install`

### Step 3: Environment Variables

Add the following environment variables in Vercel dashboard:

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key_here

# Optional
BACKUP_DIR=./backups
NODE_ENV=production
```

### Step 4: Deploy

1. **Deploy**: Click "Deploy" button
2. **Wait**: Build process takes 2-3 minutes
3. **Access**: Your app will be available at `https://your-project.vercel.app`

### Step 5: Custom Domain (Optional)

1. **Add Domain**: Go to Project Settings > Domains
2. **Configure DNS**: Point your domain to Vercel
3. **SSL Certificate**: Automatically provisioned

## 🔨 Manual Deployment

For other hosting platforms or self-hosting:

### Step 1: Build Application

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Test production build locally
npm start
```

### Step 2: Deploy Files

Upload the following to your hosting platform:

```
.secret
├── .next/          # Built application
├── public/         # Static assets
├── package.json    # Dependencies
├── package-lock.json
└── next.config.js  # Configuration
```

### Step 3: Configure Server

**Node.js Server** (recommended):
```bash
# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start npm --name "sealthedeal" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

**Docker Deployment**:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

**Nginx Configuration**:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ⚙️ Environment Configuration

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk public key | `pk_test_...` |
| `CLERK_SECRET_KEY` | Clerk secret key | `sk_test_...` |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | `whsec_...` |
| `OPENAI_API_KEY` | OpenAI API key | `sk-proj-...` |
| `ENCRYPTION_KEY` | 32-character encryption key | `abc123...` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKUP_DIR` | Backup directory path | `./backups` |
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_APP_URL` | Application URL | Auto-detected |

### Security Considerations

1. **Never commit** `.env.local` to version control
2. **Use strong** encryption keys (32 characters minimum)
3. **Rotate keys** regularly in production
4. **Limit API access** with proper OpenAI usage limits
5. **Monitor logs** for suspicious activity

## 🗄️ Database Setup

### Neon (Recommended)

1. **Create Account** at [neon.tech](https://neon.tech)
2. **Create Database**:
   - Choose region closest to your users
   - Select PostgreSQL 15+
   - Note connection string

3. **Configure Prisma**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

### Supabase

1. **Create Project** at [supabase.com](https://supabase.com)
2. **Get Connection String** from Settings > Database
3. **Run Migrations**:
   ```bash
   npx prisma db push
   ```

### Self-Hosted PostgreSQL

1. **Install PostgreSQL** on your server
2. **Create Database**:
   ```sql
   CREATE DATABASE sealthedeal;
   CREATE USER sealthedeal WITH PASSWORD 'secure_password';
   GRANT ALL PRIVILEGES ON DATABASE sealthedeal TO sealthedeal;
   ```

3. **Configure Connection**:
   ```env
   DATABASE_URL=postgresql://sealthedeal:secure_password@localhost:5432/sealthedeal
   ```

## 🔧 Post-Deployment Configuration

### 1. Configure Clerk Webhooks

1. **Go to Clerk Dashboard** > Webhooks
2. **Add Endpoint**: `https://your-domain.com/api/webhooks/clerk`
3. **Select Events**:
   - `user.created`
   - `user.updated`
   - `user.deleted`
4. **Add Secret**: Use `CLERK_WEBHOOK_SECRET` value

### 2. Set Up Domain

1. **Update Clerk Settings**:
   - Add your domain to allowed origins
   - Configure redirect URLs
   - Update sign-in/sign-up URLs

2. **Update Environment**:
   ```env
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

### 3. Configure OpenAI

1. **Set Usage Limits**:
   - Configure monthly spending limits
   - Set rate limits if needed
   - Monitor usage in OpenAI dashboard

2. **Test API Access**:
   ```bash
   curl -H "Authorization: Bearer $OPENAI_API_KEY" \
        https://api.openai.com/v1/models
   ```

### 4. Initialize Database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Optional: Seed with initial data
npx prisma db seed
```

## 📊 Monitoring & Maintenance

### Health Checks

Monitor your deployment with:

1. **Vercel Analytics**: Built-in performance monitoring
2. **Health Endpoint**: `GET /api/health`
3. **Uptime Monitoring**: Use services like UptimeRobot
4. **Error Tracking**: Integrate Sentry for error monitoring

### Performance Optimization

1. **Enable Caching**:
   ```javascript
   // next.config.js
   module.exports = {
     images: {
       domains: ['your-domain.com'],
     },
     async headers() {
       return [
         {
           source: '/api/:path*',
           headers: [
             { key: 'Cache-Control', value: 'public, max-age=60' },
           ],
         },
       ];
     },
   };
   ```

2. **Database Optimization**:
   - Add indexes for frequently queried fields
   - Monitor query performance
   - Set up connection pooling

3. **CDN Configuration**:
   - Enable Vercel Edge Network
   - Configure custom CDN if needed

### Backup Strategy

1. **Database Backups**:
   ```bash
   # Automated backups (cron job)
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d).sql
   ```

2. **Application Backups**:
   - Use Vercel's automatic deployments
   - Keep multiple deployment versions
   - Document configuration changes

### Security Maintenance

1. **Regular Updates**:
   ```bash
   npm audit
   npm update
   ```

2. **Monitor Logs**:
   - Check Vercel function logs
   - Monitor database logs
   - Set up alerting for errors

3. **Security Scans**:
   - Run dependency audits
   - Check for vulnerabilities
   - Update dependencies regularly

## 🔍 Troubleshooting

### Common Deployment Issues

**Build Failures**:
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

**Database Connection Issues**:
- Verify `DATABASE_URL` format
- Check database server status
- Ensure network connectivity
- Verify credentials

**Authentication Issues**:
- Confirm Clerk keys are correct
- Check domain configuration
- Verify webhook endpoints
- Test with different browsers

**API Errors**:
- Verify OpenAI API key
- Check API usage limits
- Monitor rate limiting
- Review error logs

### Performance Issues

**Slow Loading**:
- Check database query performance
- Optimize images and assets
- Enable caching
- Monitor server resources

**Memory Issues**:
- Monitor Vercel function memory usage
- Optimize code for memory efficiency
- Consider upgrading plan
- Review error logs

### Debugging Tools

1. **Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel logs your-deployment-url
   ```

2. **Database Tools**:
   ```bash
   npx prisma studio
   ```

3. **Browser DevTools**:
   - Network tab for API calls
   - Console for client errors
   - Performance tab for optimization

### Getting Help

1. **Check Logs**:
   - Vercel function logs
   - Browser console
   - Database logs

2. **Community Support**:
   - GitHub Issues
   - Discord community
   - Stack Overflow

3. **Professional Support**:
   - Email: support@sealthedeal.com
   - Priority support for Pro users

## 📚 Additional Resources

### Documentation Links

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Documentation](https://vercel.com/docs)
- [Clerk Documentation](https://clerk.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)

### Best Practices

1. **Use Environment Variables** for all configuration
2. **Monitor Performance** regularly
3. **Keep Dependencies Updated**
4. **Test Deployments** in staging first
5. **Document Configuration** changes
6. **Set Up Monitoring** and alerting
7. **Regular Backups** of data and configuration

### Scaling Considerations

1. **Database Scaling**:
   - Connection pooling
   - Read replicas
   - Query optimization

2. **Application Scaling**:
   - Horizontal scaling
   - Load balancing
   - CDN optimization

3. **Cost Optimization**:
   - Monitor usage patterns
   - Optimize API calls
   - Use caching effectively

---

**Need deployment help?** Contact our support team at support@sealthedeal.com for assistance with your specific deployment scenario.
