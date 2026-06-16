# 10-sa · 情侶日記 — UI Design Prototype

Mobile-first PWA UI design for the 10th anniversary couple app. This is a **visual prototype** with mock data — not yet connected to a backend.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173). On desktop, the app renders in a centered 480px phone frame.

## PWA

- Installable on mobile (Add to Home Screen)
- Offline-capable after first load
- Portrait-oriented standalone display

```bash
npm run build
npm run preview
```

## Screens

Use the floating **「UI 設計」** button (bottom-right) to jump between all screens:

| Screen | Route |
|--------|-------|
| Welcome | `/` |
| Login / Register | `/login`, `/register` |
| Pair (invite code) | `/pair` |
| Profile setup | `/profile-setup` |
| Home (Today) | `/app/home` |
| Check-ins | `/app/check-ins` |
| Points & rewards | `/app/points` |
| Calendar & cycle | `/app/calendar` |
| Settings & themes | `/app/settings` |
| Check-in success | `/app/check-in-success` |
| Meal check-in (photo upload) | `/app/meals/check-in` |
| Meal history | `/app/meals` |
| Seasonal event | `/app/seasonal` |

## Design system

See [DESIGN.md](./DESIGN.md) for colors, typography, components, and theme tokens.

**Theme presets:** 玫瑰 Rose · 薰衣草 Lavender · 海洋 Ocean · 鼠尾草 Sage · 夕陽 Sunset  
Each supports light and dark mode (toggle in Settings).

## Tech stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Framer Motion (animations)
- React Router
- vite-plugin-pwa

## Next steps (implementation)

1. Connect Supabase/Firebase auth (email + Google)
2. Real couple pairing API
3. Persist check-ins, points, calendar data
4. Push notifications for reminders
5. Replace mock seasonal content with date-driven config
