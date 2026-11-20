# Paskuhang Pinoy — Landing Page

Web invitation for the **District 1 Serve Team and Leaders Christmas Party**
(Disyembre 5, 2026 · ika-5 ng hapon).

Plain HTML, CSS and JavaScript. No build step, no framework, no npm install.
Double-click `index.html` and it runs.

---

## 1. File map

```
index.html                 the whole page (markup only)
assets/css/style.css       all styling
assets/js/main.js          CONFIG + all behaviour
assets/img/peg5–8.webp     dress-code photos
assets/img/favicon.svg     parol favicon
assets/img/og-cover.jpg    link preview image for Messenger / FB
netlify.toml               deploy settings (ignored elsewhere)
deploy-to-github.sh        one-command publish to GitHub Pages
```

---

## 2. Deploy it

All three options below are free. Pick one.

### GitHub Pages — from your terminal (free, no credits, no limits)

```bash
cd ~/paskuhanpinoy/landing-page
bash deploy-to-github.sh
```

The script asks for a repo name and your GitHub username, then initialises git,
commits, pushes, and switches Pages on. If you have the `gh` CLI logged in it
does everything; if not, it prints the two manual steps. Safe to re-run — it
never deletes anything, and a second run with no changes does nothing.

Your link ends up as `https://<username>.github.io/<repo>/`.

Two things to know:

- **The repo must be public.** GitHub Pages is only free on public repos, so the
  page and the four photos become visible to anyone who finds the URL. If that
  isn't OK, use Cloudflare below.

Updating later:

```bash
git add -A && git commit -m "update" && git push
```

### Cloudflare Pages — drag and drop (free, unlimited bandwidth, can stay private)

1. Go to <https://pages.cloudflare.com> → **Create a project** → **Direct Upload**.
2. Drag this folder in.

No credits and no bandwidth metering.

### Netlify — drag and drop

Go to <https://app.netlify.com/drop> and drag this folder in. The free plan has a
300-credit monthly cap, and sites pause when it runs out.

## 3. Things you'll probably want to change

Everything below lives at the top of `assets/js/main.js` in the `CONFIG` block.

```js
eventISO:     '2026-12-05T17:00:00+08:00',  // drives the countdown
eventLocation: '',                          // venue — blank for now
calStartUTC:  '20261205T090000Z',           // 5:00 PM PH = 09:00 UTC
calEndUTC:    '20261205T140000Z',           // 10:00 PM PH
```

**Add the venue** once it's final: put it in `eventLocation` (it flows into the
"Idagdag sa Kalendaryo" button) and add a line under the date in `index.html`.

**Ministry food assignments** — the `ministries` array in `main.js`.

**Dress-code photos** — drop new images into `assets/img/` and update the
`looks` array in `main.js`. Square images with a white or plain background look
best; the cards use `object-fit: contain` so nothing gets cropped.

**Colours** — the `:root` block at the top of `style.css`:

```css
--red:#ef1f2b;  --green:#17a35c;  --gold:#ffc83d;
```

---

## 4. Notes

- **Fonts** load from Google Fonts: Alfa Slab One (title), Bungee (labels),
  Lora (body), Caveat (handwriting). If a viewer is offline the page falls back
  to system fonts and still lays out correctly.
- **Link previews** need an absolute URL. `deploy-to-github.sh` rewrites the
  `og:image` and `canonical` tags for you. On Cloudflare or Netlify, edit those
  two lines in `index.html` by hand once you know your URL.
- **`og-cover.jpg`** was rendered on a machine without those webfonts, so the
  title on the link preview uses a fallback serif. If you want it to match
  exactly, screenshot the hero at 1200×630 and overwrite the file.
- **Accessibility** — respects `prefers-reduced-motion`, the title has a text alternative.
- **Weight** — about 450 KB total, most of it the four photos.
