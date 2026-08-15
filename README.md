# Mac Precitec India — website

Static marketing and product-catalogue site for Mac Precitec India Private Limited,
a precision cutting-tool manufacturer in Peenya, Bangalore.

**Design direction:** 02 — "Single Pass"
**Guardrails:** see `claude/project-direction.md` in the Claude project (performance
budgets, accessibility, responsive states, analytics architecture).

## Stack

Plain hand-authored HTML + CSS + minimal vanilla JavaScript.
**No build step. No framework. No package manager.** Open a file and edit it.

## Structure

```
index.html            Home
contact.html          Contact & enquiry
404.html              Not found
css/site.css          The whole stylesheet (19KB)
js/app.js             Nav enhancement — the site works without it
js/analytics.js       Measurement layer; the ONLY file that names a vendor
assets/fonts/         Oswald 400 + 600, self-hosted, subset (24KB total)
assets/brand/         Logo (SVG, 3 surface variants), favicons, source .cdr
robots.txt            Allows reputable AI crawlers
sitemap.xml           Update when adding a page
site.webmanifest
```

## Local preview

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

A plain file:// open will not work — pages use root-absolute paths (`/css/site.css`).

## Budgets — do not exceed

| Metric | Limit | Current (home) |
|---|---|---|
| HTML + CSS + JS per page | 100 KB | 43.1 KB |
| JavaScript | 20 KB | 3.0 KB |
| CSS | 30 KB | 19.2 KB |
| Fonts | 2 files / 60 KB | 2 files / 24.4 KB |
| HTTP requests | 20 | 7 |
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
- [ ] Confirm whether landline 080 2836 9097 should appear
- [ ] Privacy policy page — required before any analytics goes live
- [ ] Open Graph share image (`assets/brand/og-home.png`)
- [ ] Remaining pages: Tools, Sectors, Engineering, Company

## Deploying to GitHub Pages

Paths are root-absolute, which is correct for `macprecitecindia.com`. A **project**
Pages site (`username.github.io/repo-name/`) would break them. Either use a custom
domain / user site, or convert paths to relative first.
