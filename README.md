# Woways Private Limited — Website

A full-stack marketing site: static frontend (served by Express), a lead-capture API that
stores form submissions, and a password-protected `/admin` panel where you can edit the
site's text and view/export leads — without touching code.

```
woways-app/
├── public/            Frontend (HTML, CSS, JS, images) — what visitors see
├── admin/             Admin panel (content editor + leads list)
├── data/              db.json is created here at runtime (site content + leads)
├── content.default.json   Starting copy, loaded into the DB the first time the app runs
├── server.js          Express server: serves the site, the content API, and the leads API
├── package.json
└── .env.example        Copy to .env and set your own admin login
```

## 1. Run it locally

Requires [Node.js](https://nodejs.org) 18 or later.

```bash
cd woways-app
npm install
cp .env.example .env        # then edit .env and set your own ADMIN_PASSWORD
npm start
```

Open:
- **http://localhost:3000** — the live site
- **http://localhost:3000/admin** — the editable admin panel (your browser will ask for the
  username/password you set in `.env`)

Every form submission on the site is saved to `data/db.json` and shows up in
**Admin → Leads**, where you can also export everything as a CSV.

## 2. What's editable, and how

Go to `/admin` → **Site content**. You can change the hero headline, the five "What we do"
rows, the three "How we work" stages, all four product blocks, the contact section text, and
the footer tagline — then click **Save changes**. The live site pulls this content from the
server on every page load, so changes appear the next time a visitor (or you) refreshes the
page. No redeploy needed for text changes.

Things that are **not** editable from `/admin` (they live in the code/CSS): layout, colors,
icons, and the logo images. Ask me any time and I'll update those directly in the files.

## 3. Deploying it — recommended: Railway

This app needs somewhere that runs a persistent Node process (not a static-only host like
plain GitHub Pages), because the leads/content database is a real file on disk. **Railway**
is the simplest option that supports this on a free/low-cost plan.

1. Push this folder to a new **GitHub repository**.
2. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** →
   pick the repo.
3. Railway auto-detects Node and runs `npm install && npm start`.
4. In **Variables**, add:
   - `ADMIN_USER` = your chosen admin username
   - `ADMIN_PASSWORD` = a strong password
5. In **Settings → Volumes**, attach a small persistent volume mounted at `/app/data` — this
   keeps your leads and content edits safe across deploys/restarts.
6. Once deployed, Railway gives you a URL like `woways-production.up.railway.app`. Confirm the
   site and `/admin` both work there before moving to the domain step below.

**Alternative:** [Render.com](https://render.com) works the same way (New → Web Service →
connect repo → add a small persistent disk mounted at `/opt/render/project/src/data`).

## 4. Pointing woways.in (GoDaddy) at your deployed app

Once your app is live on Railway/Render, connect your existing domain:

**A. Add the custom domain on your host**
1. In Railway: **Settings → Networking → Custom Domain** → enter `woways.in` (and/or
   `www.woways.in`).
2. The host will show you a DNS target — usually either:
   - a **CNAME** value like `xxxx.up.railway.app`, or
   - one or more **A record** IP addresses.
   Keep that screen open; you'll copy this into GoDaddy next.

**B. Update DNS in GoDaddy**
1. Log in to GoDaddy → **My Products** → find `woways.in` → **DNS** (or **Manage DNS**).
2. For the **www** subdomain: add/edit a **CNAME** record —
   Host: `www` → Points to: the value your host gave you (e.g. `xxxx.up.railway.app`) → Save.
3. For the **root domain** (`woways.in` with no `www`):
   - If your host gave you **A record IPs**, add an **A** record with Host `@` pointing to
     that IP.
   - If your host only gave a CNAME (most PaaS providers), GoDaddy's root domain can't point
     to it directly — instead, use GoDaddy's **Domain Forwarding**: forward `woways.in` →
     `https://www.woways.in` (forward only, so `www` stays the "real" address).
4. Remove any old **A** or **CNAME** records for `@`/`www` that point elsewhere (e.g. GoDaddy's
   default parked-page records), so they don't conflict.
5. Save. DNS changes usually show up within 15–60 minutes, but can take up to 24–48 hours.

**C. HTTPS**
Railway/Render both auto-issue a free SSL certificate for your domain once DNS is verified —
no separate step needed. Give it a few minutes after DNS propagates.

**D. Verify**
Visit `https://woways.in` and `https://woways.in/admin` once propagation is done, and confirm
the padlock/HTTPS is active.

## 5. A note on what I can and can't do directly

I've built the complete app and the exact steps above, but I don't have the ability to log
into your GoDaddy account, your Railway/Render account, or push code to a live server myself
— those need your own account access. If you'd like, share your screen or paste any error
message you hit at a specific step and I'll walk you through it right away.
