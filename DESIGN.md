# Design System — 10-sa

## Brand

- **App name:** 情侶日記 (10-sa)
- **Tone:** Warm, professional, personal — not childish
- **Language:** Traditional Chinese (繁中) primary

## Typography

| Role | Font |
|------|------|
| Latin | DM Sans |
| Chinese | Noto Sans TC |
| Fallback | system-ui, sans-serif |

## Color themes

Five preset palettes, each with light + dark tokens:

| ID | 中文 | Primary |
|----|------|---------|
| rose | 玫瑰 | `#e11d6a` |
| lavender | 薰衣草 | `#8b5cf6` |
| ocean | 海洋 | `#0ea5e9` |
| sage | 鼠尾草 | `#059669` |
| sunset | 夕陽 | `#ea580c` |

Tokens are CSS variables — see `src/design-system/themes.ts`.

## Components

| Component | Usage |
|-----------|-------|
| `Button` | primary · secondary · outline · ghost |
| `Card` | Elevated surface with border + shadow |
| `Input` | Form fields with label/hint |
| `Badge` | Status chips, point amounts |
| `PointBadge` | Heart coin + points display |
| `BottomNav` | 5-tab main navigation |
| `ScreenHeader` | Title + optional back + action |

## Layout

- **Mobile-first:** full width up to 480px
- **Desktop:** centered phone frame with side shadow
- **Safe areas:** notched device insets via CSS env()
