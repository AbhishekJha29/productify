# 🚀 Deploying Productify to Vercel

This guide provides step-by-step instructions to deploy both the **Backend (Express)** and **Frontend (Vite/React)** of Productify to Vercel.

---

## 📋 Prerequisites

Before you begin, ensure you have the following:
1. A [Vercel](https://vercel.com/) account.
2. A PostgreSQL Database (Recommended: [Neon](https://neon.tech/) - it's serverless and has a great free tier).
3. A [Clerk](https://clerk.com/) account for authentication.
4. Your project pushed to a GitHub, GitLab, or Bitbucket repository.

---

## 🛠️ Step 1: Prepare the Backend for Vercel

Vercel can host Express apps using **Serverless Functions**. To make this work, we need to add a configuration file and ensure the app is exported.

### 1.1 Create `backend/vercel.json`
Create a file named `vercel.json` inside the `backend/` directory with the following content:

```json
{
  "version": 2,
  "rewrites": [
    { "source": "/(.*)", "destination": "/dist/index.js" }
  ]
}
```

### 1.2 Update `backend/src/index.ts`
Ensure that your Express `app` is exported so Vercel's runtime can use it. At the bottom of `backend/src/index.ts`, add:

```typescript
export default app;
```

---

## 🌐 Step 2: Deploy the Backend to Vercel

1. **New Project**: Go to your Vercel Dashboard and click **"Add New" > "Project"**.
2. **Import Repository**: Select your repository.
3. **Configure Project**:
   - **Project Name**: `productify-api`
   - **Framework Preset**: Select **"Other"**.
   - **Root Directory**: Click **Edit** and select the `backend` folder.
4. **Build & Development Settings**:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
5. **Environment Variables**:
   Add the following variables (copy values from your local `.env` or service dashboards):
   - `DATABASE_URL`: Your Postgres connection string.
   - `CLERK_PUBLISHABLE_KEY`: From Clerk dashboard.
   - `CLERK_SECRET_KEY`: From Clerk dashboard.
   - `FRONTEND_URL`: The URL of your **frontend** (once deployed, e.g., `https://productify-web.vercel.app`). *Note: You can update this later.*
   - `NODE_ENV`: `production`
6. **Deploy**: Click **"Deploy"**.

---

## 💻 Step 3: Deploy the Frontend to Vercel

1. **New Project**: Click **"Add New" > "Project"** again for the same repository.
2. **Configure Project**:
   - **Project Name**: `productify-web`
   - **Framework Preset**: Select **"Vite"**.
   - **Root Directory**: Click **Edit** and select the `frontend` folder.
3. **Build & Development Settings**:
   - Leave as default (Build: `npm run build`, Output: `dist`).
4. **Environment Variables**:
   Add the following variables:
   - `VITE_CLERK_PUBLISHABLE_KEY`: From Clerk dashboard.
   - `VITE_BACKEND_URL`: The URL of your **deployed backend** (e.g., `https://productify-api.vercel.app`).
5. **Deploy**: Click **"Deploy"**.

---

## 🗄️ Step 4: Database Migrations

After the backend is deployed, you need to push your database schema to the production database.

1. Update your local `.env` (temporarily) with the production `DATABASE_URL`.
2. Run the following command from the `backend/` directory:
   ```bash
   npm run db:push
   ```
3. Revert your local `.env` back to your development database.

---

## 🔗 Step 5: Final Connection (CORS)

Once both are deployed:
1. Copy the URL of your **Frontend** (e.g., `https://productify-web.vercel.app`).
2. Go to the **Backend Project** on Vercel > **Settings** > **Environment Variables**.
3. Update `FRONTEND_URL` with your actual frontend URL.
4. Redeploy the backend for the changes to take effect.

---

## 💡 Tips
- **Cold Starts**: Serverless functions may have a slight delay on the first request after being idle.
- **Logs**: Use the **"Logs"** tab in the Vercel dashboard to debug any issues during or after deployment.
