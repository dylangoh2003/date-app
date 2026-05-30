# 💌 A Special Invitation — Date Booking App

A modern, animated, single-page React app for asking someone out on a date.

## Stack

- **React 18** — component logic & state
- **Framer Motion** — all animations & page transitions
- **Tailwind CSS** — utility-first styling
- **canvas-confetti** — celebration effect on confirmation
- **Vite** — build tool

## Getting Started (local)

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. Import the repo in [vercel.com](https://vercel.com).
3. Vercel auto-detects Vite — hit **Deploy**.
4. Done. Share the link 💌

## Pages

| Step | Screen | Notes |
|------|--------|-------|
| 0 | Welcome | Yes / No (No button dodges) |
| 1 | Pick a Date | Date picker + time selector with commentary |
| 2 | Food Preference | Multi-select cuisine cards |
| 3 | Confirmed | Confetti + summary card + WhatsApp share |

## Customisation

- **Her name**: add a `name` prop to `WelcomePage` and update the heading.
- **Colors**: tweak `tailwind.config.js` → `theme.extend.colors`.
- **WhatsApp number**: in `ConfirmedPage`, change `https://wa.me/?text=` to `https://wa.me/YOUR_NUMBER?text=`.
