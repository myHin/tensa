# 10-sa · 情侶日記

Mobile-first PWA couple app — UI prototype with **Supabase authentication**.

## Quick start

```bash
npm install
cp .env.example .env.local
# Fill in Supabase URL + anon key (see below)
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Supabase setup

### 1. Create a project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard) → **New project**
2. Copy **Project URL** and **anon public key** from **Settings → API**

### 2. Environment variables

Create `.env.local`:

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

### 3. Run database schema

In Supabase **SQL Editor**, run in order:

1. `supabase/schema.sql`
2. `supabase/pairing.sql` ← **required for couple pairing**

### 4. Enable auth providers

**Authentication → Providers**

- **Email** — enabled (default)
- **Google** — enable and add OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/)
  - Authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

**Authentication → URL Configuration**

- Site URL: `http://localhost:5173` (dev) or your production URL
- Redirect URLs: add `http://localhost:5173/auth/callback`

### 5. (Optional) Disable email confirmation for dev

**Authentication → Providers → Email** → turn off *Confirm email* while testing locally.

## Auth flow

| Route | Purpose |
|-------|---------|
| `/login` | Email/password + Google |
| `/register` | Sign up with display name |
| `/auth/callback` | OAuth redirect handler |
| `/pair` | Couple pairing (create / join invite code) |
| `/profile-setup` | Save name + birthday to Supabase |
| `/app/*` | Protected — requires login |

## Build & PWA

```bash
npm run build
npm run preview
```

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4 + Framer Motion
- Supabase Auth + Postgres
- vite-plugin-pwa

## Next steps

1. Persist check-ins, meals (Storage), and points
2. Supabase Storage for meal photos
3. Push notifications
