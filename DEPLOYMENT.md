# Deploying to Vercel

This guide will help you deploy your Turbo monorepo to Vercel.

## Prerequisites

- A Vercel account ([sign up here](https://vercel.com/signup))
- Your repository pushed to GitHub, GitLab, or Bitbucket
- A PostgreSQL database (for production)

## Step 1: Prepare Your Repository

The repository is already configured with:
- ✅ `vercel.json` - Vercel configuration for monorepo
- ✅ Build scripts in `packages/db` for Prisma client generation
- ✅ Turbo build pipeline configured

## Step 2: Connect Your Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will automatically detect it's a monorepo

## Step 3: Configure Project Settings

In the Vercel project settings, configure:

### Root Directory
- **Root Directory**: `apps/web` (or leave empty - Vercel will use the `vercel.json` config)

### Build & Development Settings
Vercel should auto-detect these from `vercel.json`, but verify:
- **Framework Preset**: Next.js
- **Build Command**: `cd ../.. && pnpm turbo build --filter=web`
- **Output Directory**: `apps/web/.next`
- **Install Command**: `cd ../.. && pnpm install`
- **Development Command**: `cd ../.. && pnpm turbo dev --filter=web`

### Environment Variables

Add the following environment variables in Vercel Dashboard → Settings → Environment Variables:

#### Required Variables

1. **Database Connection**
   ```
   DATABASE_URL=postgresql://user:password@host:port/database
   ```

2. **Better Auth Configuration**
   ```
   BETTER_AUTH_SECRET=your-secret-key-here
   BETTER_AUTH_URL=https://your-domain.vercel.app
   ```

3. **AI SDK (if using Google AI)**
   ```
   GOOGLE_GENERATIVE_AI_API_KEY=your-api-key
   ```

#### Optional Variables

- `NODE_ENV=production`
- Any other API keys or secrets your app needs

## Step 4: Database Setup

### Option A: Use Vercel Postgres (Recommended)

1. In your Vercel project dashboard, go to **Storage** tab
2. Click **"Create Database"** → Select **Postgres**
3. Vercel will automatically add the `POSTGRES_URL` environment variable
4. Update your `DATABASE_URL` to use `POSTGRES_URL` or set:
   ```
   DATABASE_URL=$POSTGRES_URL
   ```

### Option B: External Database (Supabase, Neon, etc.)

1. Create your PostgreSQL database
2. Get the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables

### Run Database Migrations

After setting up the database, you'll need to run migrations:

**Option 1: Using Vercel CLI (Recommended)**
```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Link your project
vercel link

# Run migrations (this will use your production DATABASE_URL)
cd packages/db
pnpm db:push
```

**Option 2: Using a migration script**
You can add a build script that runs migrations, but be careful with production databases.

## Step 5: Deploy

1. Click **"Deploy"** in Vercel dashboard
2. Vercel will:
   - Install dependencies using pnpm
   - Build dependencies (Prisma client generation)
   - Build your Next.js app
   - Deploy to production

## Step 6: Verify Deployment

After deployment:
1. Check the deployment logs for any errors
2. Visit your deployed URL
3. Test authentication flows
4. Verify database connections

## Troubleshooting

### Build Fails: "Cannot find module"

- Ensure all workspace dependencies are properly linked
- Check that `packages/db` build script runs before `apps/web` build
- Verify `turbo.json` has `"dependsOn": ["^build"]` in build task

### Prisma Client Not Found

- Ensure `packages/db/package.json` has `"build": "prisma generate"` script
- Check that Turbo builds dependencies first (via `^build` dependency)

### Environment Variables Not Working

- Ensure variables are set for the correct environment (Production, Preview, Development)
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### Monorepo Build Issues

- Verify `vercel.json` paths are correct
- Ensure `rootDirectory` points to `apps/web`
- Check that build commands use correct relative paths (`cd ../..`)

## Continuous Deployment

Once connected, Vercel will automatically:
- Deploy on every push to `main` branch (production)
- Create preview deployments for pull requests
- Run builds using Turbo's caching for faster deployments

## Additional Resources

- [Vercel Monorepo Guide](https://vercel.com/docs/monorepos)
- [Turbo + Vercel](https://turbo.build/repo/docs/core-concepts/monorepos/deploying)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

