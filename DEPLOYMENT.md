# Production Deployment Guide

This guide details instructions for deploying the **Tamil Dialogue & Sentence Builder** application to production hosting providers.

Frontend Host: **Vercel**
Backend Host: **Render**

---

## Part 1: Deploying Backend to Render

[Render](https://render.com) is a cloud platform suitable for running Python ASGI services like FastAPI.

### Steps:
1. Log in to [Render](https://render.com).
2. Click the **"New"** button and select **"Web Service"**.
3. Connect your GitHub/GitLab repository.
4. Set the following configuration values:
   - **Name**: `tamil-dialogue-backend` (or similar)
   - **Language**: `Python 3`
   - **Branch**: `main`
   - **Root Directory**: `backend` (Important: points Render to run inside the backend folder)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Expand the **"Advanced"** section:
   - Add **Environment Variables**:
     - `GEMINI_API_KEY`: `your-google-gemini-api-key` (Used for AI dialogues)
     - `PYTHON_VERSION`: `3.10.11`
6. Click **"Create Web Service"**.
7. Once deployed, copy your web service URL (e.g. `https://tamil-dialogue-backend.onrender.com`).

---

## Part 2: Deploying Frontend to Vercel

[Vercel](https://vercel.com) provides instant hosting for Vite React applications.

### Steps:
1. Log in to [Vercel](https://vercel.com).
2. Click **"Add New"** and choose **"Project"**.
3. Import your Git repository.
4. Set the following configuration values:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (Important: points Vercel to compile inside the frontend folder)
5. Expand the **"Build and Development Settings"**:
   - Verify:
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
6. Expand **"Environment Variables"**:
   - Add:
     - `VITE_API_URL`: `https://your-render-backend-url.onrender.com/api` (Remember to append `/api` to your Render backend URL!)
7. Click **"Deploy"**.
8. Vercel will build your application and host it on a public domain (e.g. `https://tamil-dialogue-frontend.vercel.app`).

### SPA Routing note:
The repository contains a `frontend/vercel.json` file. This tells Vercel's edge router to rewrite all browser routing requests back to `index.html`, allowing React Router DOM to manage page navigation without returning 404 errors on refreshes.
