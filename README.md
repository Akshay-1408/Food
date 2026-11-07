# Servd — AI Kitchen & Recipe Assistant

A modern full-stack culinary platform that turns leftovers into masterpieces with AI recipe generation, pantry scanning, meal planning, and interactive cooking controls.

- **Live Application:** [https://food-two-ruddy.vercel.app/](https://food-two-ruddy.vercel.app/)
- **Repository:** [https://github.com/Akshay-1408/Food](https://github.com/Akshay-1408/Food)

---

## 🏗️ Architecture

```
Food/
├── frontend/             # Next.js 16 App Router (React 19, DialKit, Tailwind CSS v4)
└── backend/              # Strapi v5 Headless CMS (PostgreSQL / SQLite)
```

---

## 🚀 Vercel Production Deployment Configuration

When deploying this repository to Vercel:

1. **Root Directory Setting (Crucial):**
   - Go to your Vercel Project -> **Settings** -> **General** -> **Root Directory**.
   - Set **Root Directory** to: `frontend`
   - Save and redeploy.

2. **Build & Development Settings:**
   - **Framework Preset:** Next.js
   - **Build Command:** `next build` (or leave default `npm run build`)
   - **Output Directory:** `.next` (default)
   - **Install Command:** `npm install` (default)

3. **Production Environment Variables (Vercel Project -> Settings -> Environment Variables):**
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (from [Clerk Dashboard](https://dashboard.clerk.com))
   - `CLERK_SECRET_KEY` (from [Clerk Dashboard](https://dashboard.clerk.com))
   - `NEXT_PUBLIC_CLERK_SIGN_IN_URL` = `/sign-in`
   - `NEXT_PUBLIC_CLERK_SIGN_UP_URL` = `/sign-up`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` = `/dashboard`
   - `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` = `/dashboard`
   - `NEXT_PUBLIC_STRAPI_URL` = Production Strapi backend URL
   - `STRAPI_API_TOKEN` = Strapi API token
   - `OPENAI_API_KEY` = OpenAI API key for GPT-4o-mini
   - `UNSPLASH_ACCESS_KEY` = Unsplash API key for food imagery

---

## 💻 Local Development Setup

### 1. Frontend
```bash
cd frontend
cp .env.example .env.local
# Fill in your Clerk keys and optional Strapi/OpenAI keys
npm install
npm run dev
```
Runs at [http://localhost:3000](http://localhost:3000) or [http://localhost:3002](http://localhost:3002).

### 2. Backend (Strapi)
```bash
cd backend
cp .env.example .env
npm install
npm run develop
```
Runs at [http://localhost:1337](http://localhost:1337). Admin dashboard at [http://localhost:1337/admin](http://localhost:1337/admin).
