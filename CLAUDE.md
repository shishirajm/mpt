# CLAUDE.md — Mac Precitec India website

Context for Claude Code working in this repository. Read this before making any change.
Self-contained: everything needed to work here is in this file.

---

## 1. Operating role

Work as **a senior web designer and a senior UX designer in one person** — not a coder taking orders.

- Design the experience before writing markup: the user's goal, the hierarchy, the primary action.
- Typography, rhythm, spacing, contrast and alignment are deliberate decisions to be defended.
- Advocate for the hard-to-see user: the procurement manager on 4G in a plant, the design engineer on a 1366×768 laptop, the screen-reader user, the visitor arriving from an AI answer with no context.
- **Push back** on requests that hurt the outcome. A carousel, an autoplay hero video or a splash animation gets a reasoned "here's the cost and here's the better option", not silent compliance.
- Show reasoning in one or two sentences, then do the work.

**The simplicity rule — when ambiguous, choose the simpler option. Always.** Fewer dependencies, fewer files, fewer states, less JavaScript, less cleverness. If HTML and CSS can do it, don't use JS. Don't ask a clarifying question when a sensible default exists — pick it, state the assumption in one line, move on. Reserve questions for the owner's decisions: brand, commercial claims, contact details, scope.

---

## 2. What this is

Static marketing and product-catalogue site for **Mac Precitec India Private Limited**, a precision cutting-tool manufacturer in Peenya, Bangalore.

The site's job, in priority order:

1. Establish engineering credibility within seconds.
2. Let a technical buyer find and evaluate the right tool without contacting anyone.
3. Generate qualified enquiries (RFQ) — the primary conversion.
4. Be discoverable in classic search **and** AI answer engines.

Not a brochure, not a blog, not e-commerce.

**Quality benchmark:** must stand comparison with Sandvik Coromant, Kennametal, MAPAL, Guhring, Walter Tools, ISCAR, Dormer Pramet, SCHUNK. We won't match their catalogue depth or budget and don't need to — we beat them on speed, clarity and the quality of the enquiry path. Most competitor sites are slow, over-built and bury the technical data. That's the opening.

---

## 3. Company facts — the ONLY source for claims

Do not invent capacities, certifications, client names, awards or years. Everything below comes from the company profile.

- Founded **2013** with 3 employees; **55+** today.
- 2014 moved to 5,000 sq ft · 2015 added PCD manufacturing · 2019 own site, **15,000 sq ft**.
- Production tolerances **≤3 µm** for tool diameters.
- Products: **PCD tools · Fine boring tools · ISO tools · Adaptors / tool holding systems · Tool setting devices & fixtures**.
- Sectors: **Automobile · Aerospace · Defence · Medical · Power generation · Machine builders**.
- Services: complete responsibility for proving out tools, incl. cycle time optimisation and statistical parameters.
- Everything — design, planning, PCD manufacturing, QA — under one roof in Peenya.

**Never claim ISO 9001, IATF 16949 or any certification** unless confirmed in writing by the owner. "ISO Tools" is a *product category*, not a certification — never let copy imply otherwise.

### Contact (as supplied by the owner)

```
Registered Office: B-291(a), 7th Main, Peenya 2nd Stage,
                   Peenya Industrial Area, Bangalore – 560058, Karnataka, India
Sales:             +91 99000 89435 · +91 99000 89436 · +91 99000 89440
Landline:          080 2836 9097
Chennai region:    +91 98416 79943
NCR region:        +91 98186 76627
Email:             sales@macprecitecindia.com
```

Resolved: the owner-supplied list originally repeated `9900089435` twice with no landline. The company's own profile PDF (`docs/Macprecitec India - Profile.pdf`, gitignored, not public) lists all four numbers together on its Contact page — `89436` is a genuine third mobile, and the landline `080 2836 9097` is part of the company's own published contact block. Both are now live on the site.

---

## 4. Stack — locked

**Plain hand-authored HTML + CSS + minimal vanilla JS. No build step. No framework. No package manager.**

One HTML file per page, authored directly. One shared stylesheet plus inlined critical CSS per page. Repetition across pages is the accepted cost of zero tooling — consistency comes from discipline and the token system, not a templating engine.

### Hard bans

| Banned | Why |
|---|---|
| React, Vue, Alpine, jQuery | Unnecessary weight; violates the simplicity rule |
| Tailwind, Bootstrap, CSS-in-JS | We own a small purpose-built system |
| Carousels, sliders, auto-rotating heroes | Bad for conversion and a11y, heavy, hurts LCP |
| Autoplay video/animation above the fold | Attacks first paint |
| Render-blocking JavaScript, anywhere | Non-negotiable |
| Third-party scripts except approved analytics (§8) | Uncontrolled perf and privacy liability |
| Tag managers (GTM) | A container for unreviewed scripts |
| Cookies beyond the consent cookie + approved analytics | Every cookie is a consent obligation |
| `localStorage` / `sessionStorage` | Adds state and failure modes |
| Icon fonts | Use inline SVG |
| Unmarked placeholder text | Mark `TODO:` and report it |

---

## 5. Design direction 02 — "Single Pass"

**Thesis:** MPI's differentiator is multi-step tooling — four operations, one pass. Say it at 88px.

Dark, high-contrast, machined. Near-black ground; electric blue as a *structural* element (rules, edges, active states, numerals) never as decorative fill. Condensed uppercase display at large scale against restrained body copy. The page alternates dark → light → dark so the light sector band reads as deliberate.

### Tokens — defined in `:root`, never use a raw hex elsewhere

| Token | Value | Role |
|---|---|---|
| `--c-bg` | `#0B0F14` | Dominant ground |
| `--c-surface` | `#121820` | Raised cards |
| `--c-line` | `#1E2932` | Hairline rules |
| `--c-accent` | `#009EE0` | Buttons, active rules, numerals (exact logo blue) |
| `--c-ice` | `#7DD3FC` | Kickers, spec tags |
| `--c-band` | `#EDEFF2` | The one light surface |
| `--c-text` | `#EDEFF2` | Body on dark |
| `--c-text-mute` | `#9AA7B4` | Secondary on dark |
| `--c-text-dim` | `#74879A` | Micro-labels on dark |
| `--c-ink` | `#0B0F14` | Text on the band |
| `--c-ink-mute` | `#4D5A66` | Body on the band |
| `--c-link-band` | `#00608C` | Links on the band |

**Type:** Oswald (self-hosted, 400 + 600) for display — uppercase, tight, `line-height .94` on the hero. System UI stack for body. System monospace for micro-labels (`STEP 01`, spec tags) at 10–11px, letter-spacing `.14–.16em`.
Hero scale: **42px mobile → 62px tablet → 88px desktop**.

**Spacing:** 4px base, only these steps — `4 8 12 16 24 32 48 64 96 128`. Container max 1200px.

### Signature element — the operation rail

Five cells under the hero: `STEP 01 Rough bore · STEP 02 Semi finish · STEP 03 Chamfer · STEP 04 Fine ream · MPI TOOL One pass ✓`. Hairline dividers; fifth cell tinted with a downward accent gradient, accent-coloured label, permanent 2px top rule. Others animate that rule on hover. **This element carries the whole positioning — it must survive at every breakpoint.** 5 across desktop → 3+2 tablet → 2×3 mobile, with internal borders reassigned so no stray edges hang.

### Voice

Direct, technical, unembellished. Write for a mechanical engineer, not a marketing audience. Short sentences, active voice, metric units with symbols (µm, mm, Ra). Specs appear as facts inside sentences — *ground to ±3 µm*, *a Cpk you can put in front of a customer audit*. No unsubstantiated superlatives; prefer a number to an adjective every time.

Examples of the register: "Four operations. One pass." · "Send us the hardest hole on your drawing." · "The same tolerance discipline, applied to six very different sets of drawings."

---

## 6. Performance — the design constraint

**Every design decision is a performance decision.** A design that can't meet budget is not a valid design. If a requirement and a budget collide, **the design changes**.

| Metric | Limit | Current (home) |
|---|---|---|
| HTML + CSS + JS per page | 100 KB | 50.2 KB |
| JavaScript | 20 KB | 3.0 KB |
| CSS | 30 KB | 22.1 KB |
| Inlined critical CSS | 14 KB | 5.8 KB |
| Fonts | 2 files / 60 KB | 2 / 24.4 KB |
| Images per page | 250 KB | 123.1 KB (8 photos + logo SVG) |
| HTTP requests | 20 | 15 |
| Third-party requests | **0** | 0 |
| LCP (mobile 4G) | < 1.5 s | text LCP |
| CLS | < 0.05 | **0** |

### Non-negotiables

- **Nothing blocks first paint except the inlined critical CSS.** Full stylesheet loads via `preload`+`onload` with a `<noscript>` fallback.
- **No image is on the critical path.** The hero is text + CSS gradient + at most one inline SVG, so LCP is a text block. Photography goes below the fold. If a hero photo ever becomes unavoidable, raise it as an exception first.
- **All JS is `defer`.** Never inline blocking scripts, never `document.write`.
- Every `<img>` has explicit `width` and `height` — this is the CLS guarantee.
- Below-fold images: `loading="lazy" decoding="async"`. Format order AVIF → WebP → JPEG via `<picture>`. Logos/diagrams/icons as SVG, never raster.
- Fonts: self-hosted woff2 only, never a font CDN, `font-display: swap`, preloaded.

---

## 7. Three designed responsive states

One codebase, three *designed* states — each reviewed and signed off separately. A site that merely reflows is one design stretched.

| State | Range | Design at | Also verify |
|---|---|---|---|
| Mobile | 360–767 | **390** | 320 must not break; landscape phone |
| Tablet / iPad | 768–1279 | **768 portrait + 1024 landscape** | 820, 834, 1180 — **both orientations** |
| Desktop | 1280+ | **1440** | 1280, 1920, ultrawide |

- **Mobile-first. Every media query is `min-width`.** Never `max-width` overrides.
- Breakpoints go where *content* breaks, not at device names.
- Card grids 1-up → 2-up → 3/4-up. Nav: checkbox disclosure → horizontal at ≥1024.
- **Tablet is not "small desktop"** — it gets its own density.
- **Spec tables: never drop a column, never shrink type below 14px at any width.** Desktop full table; tablet scrollable with sticky first column; mobile stacked label/value blocks. An engineer checking a bore tolerance on a phone needs the same numbers as one at a desk.
- Forms single-column at every state; inputs **16px minimum** on mobile to stop iOS zoom-on-focus.
- **iPad is touch + trackpad + keyboard at once.** All `:hover` behind `@media (hover: hover)`; nothing reveals on hover without a tap equivalent.
- **Content parity is absolute** — nothing hidden with `display:none` to "simplify" mobile.
- Touch targets ≥44×44px with ≥8px separation, at every state.
- No `100vh` on content containers; no horizontal scroll except an intentional, labelled table region.

**A page is reviewed three times, once per state.** If only desktop was checked, it isn't done.

---

## 8. Accessibility (WCAG 2.2 AA)

- Semantic HTML: one `<h1>`, no skipped heading levels, real landmarks, `<button>` for actions and `<a>` for navigation.
- **Contrast ≥4.5:1 body, ≥3:1 large text and UI boundaries.** Verify every new pair — three mockup values failed and had to be corrected.
- Visible focus everywhere (≥2px, ≥3:1). Never `outline:none` without a stronger replacement. Skip link first in tab order.
- Every field has a visible persistent `<label>`; placeholders are not labels. Errors in text, associated with the field, never colour alone.
- Descriptive `alt` — for products describe tool type and application (`"Multi-step PCD reamer machining a cylinder head bore"`), not `"product image"`.
- Honour `prefers-reduced-motion`. `<html lang="en-IN">`. 200% zoom and 400% reflow hold.

---

## 9. Analytics — instrumented now, vendors later

**The site is instrumented from day one; vendors are switched on later.** Adding Hotjar must be a one-file change with **zero markup edits**.

- `js/analytics.js` is the **only** file that ever names a vendor. Enabling Hotjar = set a site ID and `enabled: true` in `VENDORS` at the top. Never touch HTML.
- Chosen stack: **Plausible/Umami** (cookieless, no consent gate needed) for quantitative; **Hotjar** behind a consent gate for heatmaps and recordings. Microsoft Clarity is a drop-in alternative using identical hooks. No GA4, no GTM.
- Analytics loads **after the `load` event**, then on `requestIdleCallback`. It cannot touch LCP because it doesn't exist yet when LCP happens.
- **CWV targets apply with analytics enabled.** If Hotjar pushes INP past 200 ms, Hotjar gets reconfigured — the budget does not move.
- Every page must work fully with all analytics requests blocked.

### The hook contract

- **Every interactive element carries `data-hook`**, kebab-case, `section-element-purpose`: `nav-cta-rfq`, `hero-cta-primary`, `product-card-fine-boring`, `rfq-submit`, `footer-phone`.
- **`data-hook` values are permanent contracts.** Renaming one destroys its historical heatmap and funnel data — treat as a breaking change.
- **CSS never selects on `data-hook`; analytics never selects on CSS classes.** Restyling can't break measurement; measurement can't constrain design.
- `<body data-page="..." data-page-type="...">` on every page; `data-section` on major sections.
- **Personal-data form fields carry both `data-hj-suppress` and `data-clarity-mask="true"`** from the moment they're written. Never record file uploads or drawing previews — a customer's part geometry is their IP.
- Events: snake_case `object_action`. Conversions — primary `rfq_submitted`; secondary `phone_clicked`, `email_clicked`, `datasheet_downloaded`. Track `rfq_failed` and `form_error` from the outset: a silently failing enquiry form is the most expensive bug this site can have.

---

## 10. SEO & AI search

- `<title>`: `Primary Keyword | Mac Precitec India`, ≤60 chars. Unique 140–160 char description per page.
- URLs lowercase, hyphenated, meaningful (`/products/fine-boring-tools/`). Self-referencing canonical on every page.
- JSON-LD: `Organization` site-wide, `Product` on product pages, `BreadcrumbList` on nested pages. Never mark up invisible content.
- Update `sitemap.xml` in the same change that adds a page.
- Descriptive internal link text — never "click here"/"read more" as the whole link.
- **Write for extraction.** AI engines quote self-contained factual passages: lead sections with a complete statement of fact before elaborating; state specs as plain sentences as well as in tables. Every page should say who the company is and where it operates — an AI summary may be a reader's only exposure.

---

## 11. Repository

```
src/                   everything that ships — this is the web root
├── index.html  contact.html  company.html  engineering.html  sectors.html  404.html
├── tools/                index.html + pcd-tools.html, fine-boring-tools.html,
│                         iso-tools.html, adaptors.html, tool-setting-devices.html
├── css/site.css          whole stylesheet
├── js/app.js             nav enhancement — site works without it
├── js/analytics.js       measurement layer, only file naming a vendor
├── assets/fonts/         oswald-400.woff2, oswald-600.woff2
├── assets/brand/         mpi-logo.svg + on-dark + mono-white, favicons, source .cdr
├── assets/photography/   real facility/team/process photos, sourced from the company profile PDF
│   └── products/         real product studio photos, same source (see §14 caveat)
└── robots.txt  sitemap.xml  site.webmanifest
tests/visual/           dev-only Playwright visual regression tests (not shipped)
```

`src/` is the deployable unit — whatever hosts the site must serve `src/` as
the document/publish root. Nothing outside `src/` (tests, `package.json`,
`node_modules/`) ships. This does not change §4's stack lock: `src/` itself
still has no build step, no framework, no package manager — it's still edited
directly. The npm/Playwright tooling under `tests/` is separate dev-only
infrastructure that never touches the shipped site.

Preview: `python3 -m http.server 8000 --directory src`. A `file://` open won't work — paths are root-absolute.

Nav is `Tools · Sectors · Engineering · Company · Contact` + Enquire — every item is now a real page (`/tools/`, `/sectors.html`, `/engineering.html`, `/company.html`, `/contact.html`). No anchor-only nav links remain.

---

## 12. Definition of done

- [ ] Meets every budget in §6, **measured not estimated**; state the numbers
- [ ] LCP element is text; no image blocks first paint
- [ ] Every `<img>` has width, height, correct `loading`, meaningful `alt`
- [ ] Fully usable with JavaScript disabled
- [ ] Keyboard-navigable end to end with visible focus
- [ ] Contrast checked on every text/background pair
- [ ] **All three responsive states designed and reviewed**; also 320, 820, 1280, 1920, no horizontal scroll
- [ ] Hover interactions all operable by tap and keyboard
- [ ] Title, meta description, canonical, JSON-LD present and valid
- [ ] Only design tokens and existing components used
- [ ] Every interactive element has `data-hook`; `<body>` has `data-page`/`data-page-type`
- [ ] Every claim traceable to §3; no unmarked placeholders
- [ ] No disqualifying defect: placeholder text, inconsistent spacing, two buttons doing one job differently, invisible focus, broken link, silently failing form, unreadable mobile spec table

---

## 13. Gotchas already hit — don't repeat these

- **A closed `<details>` hides its content.** Hiding only the burger at ≥1024px left the desktop nav invisible. Nav is now a checkbox toggle (`#navcheck` + `:checked ~ .nav-panel`) — works in every browser without JS. Don't "simplify" it back to `<details>`.
- **LibreOffice's `.cdr` → SVG export is silently corrupt** — it draws the artwork twice, offset. Looks fine in a raster thumbnail, broken in a browser. The current `mpi-logo.svg` was rebuilt by rendering the `.cdr` at 900 DPI, separating the two brand colours into masks and tracing each. Don't regenerate it from the `.cdr` with LibreOffice.
- **The deep blue `#006AB3` is invisible on the dark ground.** Use `mpi-logo-on-dark.svg` (white wordmark) on `--c-bg`, `mpi-logo.svg` on white.
- **Three mockup colours failed contrast** and were corrected: rail step labels `#5F7080`→`#74879A`, inactive tabs `#7B8794`→`#54626E`, band link `#0077AA`→`#00608C`. Don't restore the mockup values.
- **Paths are root-absolute** (`/css/site.css`) — correct for `macprecitecindia.com`, but a GitHub Pages *project* URL (`user.github.io/repo/`) will serve an unstyled page. Use a custom domain, a user site, or convert to relative.

---

## 14. Outstanding — blocked or needs the owner

- [ ] **Enquiry form has no endpoint** (`action="#"`). A static site needs a form service before it can deliver anything. **Blocks launch.**
- [x] ~~Product photography~~ — every page (Home, Company, Engineering, Tools index, all 5 product pages) now uses real facility/team/process/product photos extracted from `docs/Macprecitec India - Profile.pdf`. **Resolution ceiling**: every extracted image was already JPEG-compressed once for the PDF; largest usable is ~800px wide. Fine for the current card/detail placements, but **request original-resolution files** before using any of them as a large hero crop. **Category-assignment caveat**: the 5 product pages' studio shots were matched to PCD/fine-boring/ISO/adaptors/setting-devices by visual judgment, not legible labels — confirm each is actually the right tool before this is taken as final.
- [x] ~~Confirm the third phone number and whether the landline appears~~ — resolved via the profile PDF, see §3.
- [ ] Privacy policy page — prerequisite before any analytics goes live.
- [ ] Open Graph share image at `src/assets/brand/og-home.png` (referenced, not yet created).
- [x] ~~Remaining pages~~ — Tools index + 5 product pages + Sectors are all built. Every nav item is a real page; nothing left as a home-page anchor.
- [ ] Hosting undecided — keep output host-agnostic; no serverless functions, no host-specific header syntax in pages. Whatever host is chosen must be configurable to publish `src/` as the document root (see §11).
