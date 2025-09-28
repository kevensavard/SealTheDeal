# Vercel Deployment Guide for SealTheDeal

## Pre-Deployment Checklist

### ✅ Code Preparation
- [x] ESLint configuration updated for deployment
- [x] Vercel configuration file created
- [x] All TypeScript errors resolved
- [x] Build optimization settings configured

### ✅ Environment Variables Required

You'll need to set these in Vercel dashboard:

#### **Required for Basic Functionality:**
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Database
DATABASE_URL=postgresql://...

# OpenAI
OPENAI_API_KEY=sk-proj-...

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### **Stripe (Set up after initial deployment):**
```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Step-by-Step Deployment

### 1. Prepare Your Repository
```bash
# Make sure all changes are committed
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 2. Deploy to Vercel

#### Option A: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name: sealthedeal (or your preferred name)
# - Directory: ./
# - Override settings? No
```

#### Option B: Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

### 3. Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables:

#### **Production Environment:**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

#### **Preview Environment (for testing):**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-proj-...
NEXT_PUBLIC_APP_URL=https://your-app-git-branch.vercel.app
```

### 4. Database Setup

#### **Neon Database:**
1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables as `DATABASE_URL`
5. Run migrations:
```bash
# In Vercel dashboard, go to Functions tab and run:
npx prisma migrate deploy
```

### 5. Clerk Configuration

#### **Update Clerk Settings:**
1. Go to [clerk.com](https://clerk.com) dashboard
2. Select your application
3. Go to **Configure** → **Domains**
4. Add your Vercel domain:
   - Production: `https://your-app.vercel.app`
   - Preview: `https://your-app-git-*.vercel.app`
5. Update redirect URLs:
   - **Sign-in URL**: `https://your-app.vercel.app/sign-in`
   - **Sign-up URL**: `https://your-app.vercel.app/sign-up`
   - **After sign-in URL**: `https://your-app.vercel.app/dashboard`
   - **After sign-up URL**: `https://your-app.vercel.app/dashboard`

### 6. Test Your Deployment

1. Visit your deployed URL
2. Test user registration/login
3. Test contract creation
4. Test e-signature functionality
5. Check all pages load correctly

### 7. Set Up Custom Domain (Optional)

1. In Vercel dashboard → Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update Clerk domains with your custom domain
5. Update `NEXT_PUBLIC_APP_URL` environment variable

## Post-Deployment: Stripe Setup

After your app is deployed and working:

### 1. Create Stripe Product
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Switch to **Live mode**
3. Create your Pro plan product
4. Copy the Price ID

### 2. Set Up Webhooks
1. Go to **Developers** → **Webhooks**
2. Add endpoint: `https://your-app.vercel.app/api/stripe/webhook`
3. Select required events
4. Copy webhook secret

### 3. Update Environment Variables
Add Stripe variables to Vercel:
```bash
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_PRO_MONTHLY_PRICE_ID=price_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 4. Redeploy
```bash
vercel --prod
```

## Troubleshooting

### Common Issues:

#### **Build Failures:**
- Check TypeScript errors: `npm run build`
- Verify all imports are correct
- Check environment variables are set

#### **Database Connection Issues:**
- Verify `DATABASE_URL` is correct
- Check if database allows connections from Vercel IPs
- Run `npx prisma migrate deploy` in Vercel

#### **Authentication Issues:**
- Verify Clerk keys are correct
- Check domain configuration in Clerk
- Ensure redirect URLs match your domain

#### **API Route Issues:**
- Check function timeout settings
- Verify environment variables in API routes
- Check Vercel function logs

### Performance Optimization:

#### **Vercel Configuration:**
- Functions timeout: 30 seconds (configured in `vercel.json`)
- Region: `iad1` (US East)
- Edge functions for static content

#### **Next.js Optimization:**
- Image optimization enabled
- Static generation where possible
- API route caching configured

## Monitoring

### Vercel Analytics:
1. Enable Vercel Analytics in dashboard
2. Monitor performance metrics
3. Check error rates and response times

### Database Monitoring:
1. Monitor Neon database usage
2. Set up alerts for connection limits
3. Track query performance

## Security Checklist

- [ ] Environment variables are secure
- [ ] API routes have proper authentication
- [ ] CORS headers configured
- [ ] Rate limiting implemented
- [ ] Input validation on all forms
- [ ] HTTPS enforced
- [ ] Security headers configured

## Backup Strategy

- [ ] Database backups enabled in Neon
- [ ] Code repository backed up
- [ ] Environment variables documented
- [ ] Deployment process documented

Your SealTheDeal app is now ready for production deployment on Vercel! 🚀
