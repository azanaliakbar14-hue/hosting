---
name: testing-hype-tiers
description: Test the Hype Tiers static HTML/CSS/JS site end-to-end. Use when verifying auth flows, gamemode rendering, or ranking features.
---

# Testing Hype Tiers

## Setup

1. Serve the site locally:
   ```bash
   cd /home/ubuntu/hosting
   python3 -m http.server 8080 &
   ```
2. Open `http://localhost:8080/index.html` in the browser.

## Key Test Flows

### Auth Flow (Sign Up → Sign In → Logout)
- **Sign Up**: Fill all fields (username, email, password, confirm password, gamemode dropdown), click "Create Account". Should redirect to `index.html` within ~600ms. Nav should update to "Welcome, [username]" with Logout button.
- **Sign In**: Enter email + password, click "Sign In". Should redirect to `index.html` within ~600ms. If it stays on the signin page, auth is broken.
- **Logout**: Click Logout in nav. Should redirect to home and show Sign In/Sign Up buttons.
- Auth uses `localStorage` keys: `hypetiers_users` (array of user objects) and `hypetiers_current_user` (current session).
- To reset state between tests, clear localStorage via browser console: `localStorage.clear()`

### Gamemode Logos Consistency
- Home page (`index.html`) has 6 gamemode cards with inline SVG icons: Roleplay, Racing, Drift, Deathmatch, Survival, Heist.
- Rankings page (`ranking.html`) has 7 filter tabs (All + 6 gamemodes) with the same SVG icons.
- Verify SVGs render (not broken/empty boxes) on both pages.

### Rankings / Leaderboard
- With no users registered: should show "No Players Yet" empty state.
- After sign up: should show exactly the registered user(s) — no fake/dummy players.
- Gamemode filter tabs should filter the table (e.g., clicking "Heist" hides Racing players).
- Table columns: Rank, Player (with avatar initials), Gamemode (with SVG icon), Tier, Score, Wins, Matches.

## Common Issues
- If sign in/sign up gets stuck (no redirect), check `js/auth.js` — the `window.location.href = 'index.html'` redirect might be missing or the setTimeout might not fire.
- If gamemode icons don't appear, check that SVGs are inline (not external files) in both `index.html` and `js/ranking.js`.
- Player count on home page reads from `localStorage` — if it shows wrong number, check `js/main.js` `updatePlayerCount()` function.

## No Secrets Needed
This is a fully client-side static site with no backend or API keys required.
