# Sharp Card

Professional bet slip generator for sports handicappers. Built as a PWA — works on iPhone via "Add to Home Screen" with no App Store required.

---

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/sharp-card.git
git push -u origin main
```

### 2. Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **Add New → Project**
3. Import your `sharp-card` repo
4. Framework preset will auto-detect as **Vite** — leave defaults as-is
5. Click **Deploy**

Vercel gives you a live URL instantly (e.g. `sharp-card.vercel.app`). Every future `git push` auto-deploys.

---

## Install on iPhone

1. Open the live Vercel URL in **Safari** (must be Safari, not Chrome)
2. Tap the **Share** button (box with arrow)
3. Scroll down and tap **Add to Home Screen**
4. Tap **Add**

Sharp Card now lives on your home screen, launches full-screen, and works offline.

---

## Local development

```bash
npm install
npm run dev
```

App runs at `http://localhost:5173`

---

## How the iOS download works

On iPhone, tapping **Download PNG** opens the native iOS share sheet. From there, tap **Save Image** to save directly to your Photos app — then share to Twitter from Photos as usual.

On desktop, it triggers a standard file download.
