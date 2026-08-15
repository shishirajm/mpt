# Mac Precitec India Pvt Ltd — website

Static marketing and product-catalogue site for Mac Precitec India Pvt Ltd,
a precision cutting-tool manufacturer in Peenya, Bangalore.

**Design direction:** 02 — "Single Pass"
**Guardrails:** see `claude/project-direction.md` in the Claude project (performance
budgets, accessibility, responsive states, analytics architecture).

## Stack

Plain hand-authored HTML + CSS + minimal vanilla JavaScript.
**No build step. No framework. No package manager.** Open a file and edit it.

## Structure

```
src/                   Everything that ships — this is the web root
├── index.html         Home
├── contact.html       Contact & enquiry
├── company.html       About, vision, milestones, team, infrastructure
├── engineering.html   Design → manufacture → prove-out process
├── sectors.html       6 sectors served, expanded from Home's tab copy
├── tools/             index.html + 5 product detail pages
├── 404.html           Not found
├── css/site.css       The whole stylesheet
├── js/app.js          Nav enhancement — the site works without it
├── js/analytics.js    Measurement layer; the ONLY file that names a vendor
├── assets/fonts/      Oswald 400 + 600, self-hosted, subset (24KB total)
├── assets/brand/      Logo (SVG, 3 surface variants), favicons, source .cdr
├── assets/photography/ Real facility/team/process/product photos (see note below)
├── robots.txt         Allows reputable AI crawlers
├── sitemap.xml        Update when adding a page
└── site.webmanifest
tests/visual/          Dev-only Playwright visual regression tests (not shipped)
```

`src/` is deployed as-is with no build step — whatever hosting is chosen must
serve `src/` as the site's document/publish root (see "Deploying" below).
Nothing outside `src/` (tests, `package.json`, `node_modules/`) is part of the
shipped site.

`assets/photography/` images were extracted from the company's internal
profile PDF (`docs/`, gitignored, not public) — real MPI facility/team/process
photos, but each was already JPEG-compressed once for that PDF. Fine for
current below-the-fold use; request original-resolution files before using
any of them as a large hero crop.

## Local preview

```bash
python3 -m http.server 8000 --directory src
# then open http://localhost:8000
```

A plain file:// open will not work — pages use root-absolute paths (`/css/site.css`),
which resolve correctly once `src/` is served as the root.

## Visual regression testing

Dev-only tooling under `tests/visual/` — a `package.json` and `node_modules/`
exist for this alone and never ship (the site itself still has zero build
step). It screenshots all three live pages at every responsive state from
§7 (320/390/768/1024/1280/1440/1920) in Chromium and WebKit, and diffs
against committed baselines in `tests/visual/screenshots/`.

```bash
npm install
npx playwright install --with-deps chromium webkit

npm run test:visual           # run — fails on any pixel diff > 1%
npm run test:visual:update    # regenerate baselines after an intentional change
```

After `test:visual:update`, review the diffs (`git diff --stat tests/visual/screenshots/`
plus opening a few images) before committing new baselines — that review is
the actual regression check, the tool only flags *that* something changed.

## Budgets — do not exceed

| Metric | Limit | Current (home) |
|---|---|---|
| HTML + CSS + JS per page | 100 KB | 50.2 KB |
| JavaScript | 20 KB | 3.0 KB |
| CSS | 30 KB | 22.1 KB |
| Images per page | 250 KB | 123.1 KB (8 photos + logo) |
| Fonts | 2 files / 60 KB | 2 files / 24.4 KB |
| HTTP requests | 20 | 15 |
| Third-party requests | 0 | 0 |

A page that breaks a budget does not ship. If a design requirement and a budget
collide, the design changes.

## Rules worth knowing before editing

- **No image may block first paint.** The hero is text + CSS only, by design.
- **Every `<img>` needs `width` and `height`.** This is the CLS guarantee.
- **The site must work with JavaScript disabled.** Sector tabs are radio inputs;
  the mobile nav is a checkbox. Neither needs script.
- **Every interactive element carries `data-hook`.** These are permanent contracts —
  renaming one destroys its historical heatmap and funnel data.
- **CSS never selects on `data-hook`; analytics never selects on CSS classes.**
- **Personal-data form fields carry `data-hj-suppress` and `data-clarity-mask`**
  so session recording is safe from the day it is switched on.
- Colours, spacing and type come from the tokens in `:root`. No raw hex elsewhere.

## Outstanding before launch

- [ ] **Enquiry form has no endpoint** — `action="#"`. Needs a form service.
- [ ] **Product photography** — image areas are designed placeholders.
- [ ] Confirm third phone number (supplied list repeats 9900089435; profile PDF shows 9900089436)
- [ ] Privacy policy page — required before any analytics goes live
- [ ] Open Graph share image (`src/assets/brand/og-home.png`)
- [ ] Remaining pages: Tools, Sectors, Engineering, Company

## Deploying to GitHub Pages

Paths are root-absolute, which is correct for `macprecitecindia.com`. A **project**
Pages site (`username.github.io/repo-name/`) would break them. Either use a custom
domain / user site, or convert paths to relative first.

Because the site now lives in `src/` rather than the repo root, plain GitHub Pages
(which can only publish the repo root or `/docs`) needs one of:
- A GitHub Actions Pages deploy step that publishes the `src/` folder, or
- Any other static host (Netlify, Vercel, Cloudflare Pages, etc.) with its
  **publish/output directory set to `src`** — no build command needed.
