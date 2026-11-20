# Paskuhang Pinoy — Landing Page

Web invitation for the **Victory Pulilan Serve Team & Leaders Christmas Party**
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
- **No server**, so the RSVP needs Option B or C in section 3.

Updating later:

```bash
git add -A && git commit -m "update" && git push
```

### Cloudflare Pages — drag and drop (free, unlimited bandwidth, can stay private)

1. Go to <https://pages.cloudflare.com> → **Create a project** → **Direct Upload**.
2. Drag this folder in.

No credits and no bandwidth metering. Like GitHub Pages it has no form handling,
so set up Option B or C in section 3.

### Netlify — drag and drop

1. Go to <https://app.netlify.com/drop> and drag this folder in.
2. RSVP replies appear under **Forms → rsvp**, with no extra setup.

Form submissions themselves are free and unlimited on Netlify's credit plans, but
the free plan has a hard 300-credit monthly cap covering bandwidth and requests —
and when an account runs out of credits its sites pause, which also stops form
submissions. Fine for a small invite; worth knowing before you share the link widely.

## 3. Make the RSVP save replies

`assets/js/main.js` tries four routes, in order. The first one that is available wins.

| Route | When it kicks in | Where replies land |
|---|---|---|
| `CONFIG.formEndpoint` | you fill it in | your Formspree / Apps Script inbox |
| Claude artifact database | page opened as a Claude artifact | stored with the artifact |
| Netlify Forms | hosted on Netlify | Netlify dashboard → Forms |
| Local storage | nothing else configured | the visitor's own browser only |

**That last row is a dead end** — the reply never reaches you, and the page says
so plainly instead of pretending it was sent. Set up one of the routes above
before you share the link.

### Option A — Netlify (nothing to edit)

Deploy to Netlify and you're done. If you point a **custom domain** at the
Netlify site, open `assets/js/main.js` and change:

```js
netlifyForms: 'auto'   →   netlifyForms: true
```

### Option B — Formspree (works on any host, free tier ~50/month)

1. Make a form at <https://formspree.io>, copy your endpoint
   (`https://formspree.io/f/abcdwxyz`).
2. In `assets/js/main.js`:

```js
formEndpoint: 'https://formspree.io/f/abcdwxyz'
```

### Option C — Google Apps Script (replies into your own Google Sheet, free, unlimited)

1. Make a Sheet with headers: `petsa | pangalan | ministry | sagot | bilang | mensahe`
2. **Extensions → Apps Script**, paste:

```js
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var d = JSON.parse(e.postData.contents);
  sheet.appendRow([d.petsa, d.pangalan, d.ministry, d.sagot, d.bilang, d.mensahe]);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
                       .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy → New deployment → Web app**, Execute as *Me*,
   Who has access *Anyone*. Copy the `/exec` URL into `formEndpoint`.

---

## 4. Things you'll probably want to change

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

**RSVP deadline** — the text in the `#rsvp` section of `index.html`.

---

## 5. Notes

- **Fonts** load from Google Fonts: Alfa Slab One (title), Bungee (labels),
  Lora (body), Caveat (handwriting). If a viewer is offline the page falls back
  to system fonts and still lays out correctly.
- **Link previews** need an absolute URL. `deploy-to-github.sh` rewrites the
  `og:image` and `canonical` tags for you. On Cloudflare or Netlify, edit those
  two lines in `index.html` by hand once you know your URL.
- **`og-cover.jpg`** was rendered on a machine without those webfonts, so the
  title on the link preview uses a fallback serif. If you want it to match
  exactly, screenshot the hero at 1200×630 and overwrite the file.
- **Accessibility** — respects `prefers-reduced-motion`, all form fields are
  labelled, the title has a text alternative.
- **Weight** — about 450 KB total, most of it the four photos.
