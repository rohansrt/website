# rohansrt.cc — Personal Portfolio Website

Personal portfolio for **Rohan Saraswat** (ISB MBA · IIT Roorkee · ex-Jaguar Land Rover). Live at [rohansrt.cc](https://rohansrt.cc).

---

## The Idea

The site is designed as a **professional showcase for a builder-operator-founder profile** — not a generic developer portfolio. The north star was: *make the work speak clearly, and make it feel considered*. Every page decision flows from a single intent: when a recruiter, founder, or collaborator lands here, they should immediately understand who Rohan is, what he has built, and how to reach him.

The aesthetic is deliberately editorial — warm off-white surfaces, serif display type, monospaced accents, navy as the single accent colour. The typography trio does three distinct jobs:

| Font | Job |
|---|---|
| Cormorant Garamond (serif) | Headlines, names, section titles — gravitas and warmth |
| Outfit (sans) | Body copy, nav labels, UI — clean legibility |
| DM Mono (mono) | Metadata, eyebrows, tags, dates — technical precision |

---

## Project Structure

```
website/
├── index.html          # Home page
├── about.html          # About Me page
├── projects.html       # Projects showcase
├── blog.html           # Blog page
├── contact.html        # Contact page
├── resume.html         # Resume viewer (inline PDF)
│
├── css/
│   └── styles.css      # Single unified stylesheet
│
├── js/
│   ├── app.js          # Global JS + base64-inlined resume PDF (pdf.js renderer)
│   └── projects.js     # Projects engine (card + modal rendering, data loading)
│
├── assets/
│   ├── images/         # Photos, org logos, achievement images
│   ├── icons/projects/ # SVG icons used inside project modals
│   ├── title icons/    # Project card title icons (PNG)
│   ├── projects/       # Project data files (JSON)
│   │   ├── projects-index.json   # Master index of all projects by tab
│   │   ├── expergo.json
│   │   ├── gulliver.json
│   │   ├── campaign.json
│   │   ├── kalkiai.json
│   │   ├── inlight.json
│   │   ├── jlr-1.json  # HVAC Team Setup
│   │   ├── jlr-2.json  # EV Program Architecture
│   │   ├── jlr-3.json  # Digital HVAC Transformation
│   │   ├── jlr-4.json  # UK OnSite EV Innovation
│   │   └── paypal-1.json
│   └── pdf/            # CV + ISB deck (downloaded on Resume page)
│
└── CNAME               # rohansrt.cc (GitHub Pages custom domain)
```

---

## Architecture — How Pages Work

The site is **plain HTML/CSS/JS with no build step, no framework, no bundler**. Each HTML file is a self-contained page with its own `<nav>` and `<footer>`. Navigation is standard `<a href>` linking between files.

The single stylesheet (`css/styles.css`) and the global script (`js/app.js`) are loaded on every page. Page-specific logic lives inline in the HTML or in dedicated JS files (only `projects.js` is separate).

### Why no framework?

The portfolio is a static, content-first site. Introducing React or Vue would add complexity without benefit — no shared state, no data fetching at runtime (except project JSON), no client-side routing needed. Every page loads fast, and the whole codebase stays readable without tooling.

---

## Page-by-Page Breakdown

### Home (`index.html`)

The landing page is structured in three vertical bands:

1. **Hero** — Two-column grid. Left: eyebrow tagline, large serif name, one-line positioning statement, two CTAs (View My Work, Let's Talk). Right: a portrait photo on a clean background. The name uses italic styling on the surname to add personality.

2. **Education & Experience band** — A horizontal strip of three `org-pill` blocks: ISB, JLR, IIT Roorkee. Each pill shows the org logo, role, and tenure dates. This is placed *below* the hero fold but *above* the main content so it anchors credibility immediately.

3. **Achievements section** — A three-card grid (`ach-grid`). Each `ach-card` carries an org colour-coded label (navy for Tata, green for ReNew, amber for JLR), the award title, a description, a mono tag, and a photo. The ReNew card has an extra "View Deck" pill link.

4. **Work Overview section** — Two summary cards (`proj-summary-card`) side by side: Personal Projects and Professional Projects. Each card lists the project names as bullet points and links to the respective tab on the Projects page via URL hash (`projects.html#self`, `projects.html#professional`). This is a preview/index — the actual project details live on the Projects page.

---

### About Me (`about.html`)

Two sections:

**Section 1 — Who am I?**
A flex row: a circular headshot on the left, a multi-paragraph narrative on the right. Below the text: an italicised pull-quote (left-bordered), and an "Inspired by" tag cluster (One Piece, Hitchhiker's Guide, Maslow's Pyramid, Elon Musk).

**Section 2 — Career Timeline + Skills**
A two-column grid:
- Left: a vertical timeline (`tl-wrap`) with a line down the left edge, each `tl-item` having a dot, date, role, org, and impact line. The oldest item (IIT Roorkee) uses a `.dim` style to visually de-emphasise it.
- Right: a skills block organised into three clusters — Product & Strategy, AI/Data/Engineering, Tools & Design — each in DM Mono with dash-separated items.

---

### Projects (`projects.html`) — The Most Complex Page

The projects page is fully data-driven. The HTML itself is nearly empty — it provides two tab panels (`#tab-self`, `#tab-professional`) each containing an empty `.proj-cards-row`. JavaScript fills everything in.

#### Data Flow

```
projects-index.json
        ↓
projects.js (bootstrap fetch)
        ↓  for each id:
  {id}.json  (full project data)
        ↓
  renderSelfProjectCard()   OR   renderProfessionalProjectCard()
  renderSelfProjectModal()  OR   renderProfessionalProjectModal()
        ↓
  Card → injected into .proj-cards-row
  Modal → appended to <body>
  wireModalEvents() → connects card's DETAILS button to modal open/close
```

#### Project JSON Schema

Each project JSON file (`assets/projects/{id}.json`) follows this structure:

```json
{
  "id": "string",
  "projectType": "self | professional",
  "title": "string",
  "titleSmall": true,          // optional — shrinks title font if long
  "tagline": "string",         // \n for line breaks
  "category": "string",        // displayed in DM Mono caps
  "heroImage": "path/to/img",
  "mvpLink": "https://...",    // optional — shown as "VIEW MVP ↗" button

  "card": {
    "strips": [
      { "icon": "assets/icons/...", "label": "TAG LABEL" }
    ]
  },

  "detail": {
    "row1": [ /* array of col objects */ ],
    "row2": {
      "title": "MVP FEATURES",
      "icon": "assets/icons/...",
      "pills": ["Feature 1", "Feature 2"]
    },
    "row3": [ /* array of col objects */ ]
  }
}
```

**Column object** (used in `row1` and `row3`):

```json
{
  "title": "COLUMN TITLE",
  "icon": "assets/icons/...",
  "noBorder": true,       // optional — removes right border
  "isFounder": true,      // optional — adds founder accent styling
  "content": { ... }      // see content types below
}
```

**Content types** supported inside a column:

| `type` | What it renders |
|---|---|
| `text` | Single paragraph (`egm-body-text`) |
| `list` | Unordered list (`egm-list`) |
| `groups` | Named groups, each with a title + unordered list |
| `flow` | Vertical flow diagram with icons and labels, arrows between steps |
| `text-chart` | Paragraph + an inline SVG growth curve |
| `quote` | Blockquote (`egm-quote`) — used for founder notes |

#### Card Anatomy

Each project card (`eg-card`) shows:
- Title + MVP link button (self projects) or title + hero image (professional)
- Divider
- Tagline + category text
- A horizontal strip of keyword tags with icons (`.eg-strips`)
- A `+ DETAILS →` button that opens the modal

#### Modal Anatomy

Each project modal (`egm-overlay`) opens as a full-screen overlay with:
- **Header** — back button, title, underline accent, tagline, category, MVP link button, hero image
- **Row 1** — 3–4 columns (customer need, target users, value proposition, how it works)
- **Row 2** — MVP features as pills
- **Row 3** — 4 columns (stakeholders, my role, market opportunity, founder note)

Modal open/close: locking `body` position to prevent scroll-behind (saves/restores `window.scrollY`). Escape key also closes. Clicking the backdrop closes.

#### Tab Switching

The Self / Professional tab toggle is handled by inline JS in `projects.html`. It fades the active panel out (opacity + translateY), swaps `.active` classes, then fades the new panel in. URL hash (`#self`, `#professional`) is read on load to deep-link to the correct tab — used by the home page Work Overview cards.

#### Adding a New Project

1. Create `assets/projects/{id}.json` following the schema above.
2. Add a `{ "id": "{id}" }` entry to the correct array in `assets/projects/projects-index.json`.
3. Add a title icon PNG to `assets/title icons/` if needed.
4. No code changes required.

---

### Blog (`blog.html`)

A grid of blog cards. One live card (`blog-card--live`) and the rest are placeholder cards (`blog-card--placeholder`). The live card triggers a full-screen modal with the full article content (inline HTML in the page). Placeholder cards show a "Coming Soon" label.

The blog modal (`blg-overlay`) follows the same lock/restore scroll pattern as project modals.

Planned future posts are already stubbed as placeholders in the grid — they signal the editorial direction without requiring content to exist yet.

---

### Contact (`contact.html`)

A two-column layout:
- Left: positioning statement (EIR, CEO's Office, 0→1 PM), email, LinkedIn, phone.
- Right: a contact form powered by **Web3Forms** (no backend needed). Form fields: name, email, message. The access key is embedded directly in a hidden input.

---

### Resume (`resume.html`)

The CV PDF is **inlined as a base64 string inside `js/app.js`** and rendered using **pdf.js** onto two `<canvas>` elements (`pdf-canvas-1`, `pdf-canvas-2`). This means the PDF is always available without a separate network request and cannot be scraped directly from a URL.

A "Download PDF" button links to the actual PDF file at `assets/pdf/Rohan_CV v6.pdf`.

---

## CSS Architecture

Everything lives in one file: `css/styles.css`. It is organised in section comments from top to bottom:

```
Reset → CSS Variables → Nav → Pages/Wrap → Typography → Buttons
→ HOME Hero → HOME Orgs → HOME Achievements → HOME Pinned → HOME Project Summary
→ ABOUT → ABOUT Timeline
→ PROJECTS (tabs, cards, strips, modals)
→ BLOG (cards, modals)
→ CONTACT → RESUME
→ FOOTER → Responsive (media queries at the end)
```

### Design Tokens (CSS Variables)

```css
--bg:        #f5f3ef   /* warm off-white page background */
--surface:   #ffffff   /* card backgrounds */
--surface2:  #eeebe5   /* slightly warm alternate surface */
--border:    #ddd9d1   /* standard dividers */
--border2:   #b8b2a8   /* stronger borders */
--navy:      #2c4a6e   /* primary accent, CTAs, highlights */
--navy-light:#4a6fa5   /* hover state */
--text:      #1a1a2e   /* primary text */
--muted:     #555565   /* secondary text */
--dim:       #999990   /* tertiary / de-emphasised */
--green:     #2d6a4f   /* ReNew Power achievement label */
--amber:     #7a4800   /* JLR achievement label */
```

### Layout System

- `max-width: 1100px` centered wrapper (`.wrap`) with `padding: 0 48px`
- `.section` adds `72px` top/bottom padding; adjacent sections are divided by `1px border-top`
- Navigation is `position: fixed`, two-row: top bar (logo + CTA) + tab row
- Pages use `padding-top: 100px` to clear the fixed nav

---

## How the Nav Works

Each HTML file sets its own `<a class="nav-tab active">` by hardcoding `active` on the correct tab. There is no JS-driven active state — navigating to a new page loads a fresh HTML file with its tab pre-marked. The nav logo and "Collaborate ↗" CTA are identical across all pages.

---

## Hosting

Deployed via **GitHub Pages** with a custom domain configured through the `CNAME` file (`rohansrt.cc`).

---

## Adding Content — Quick Reference

| What | Where |
|---|---|
| New project | Add JSON to `assets/projects/`, add id to `projects-index.json` |
| New blog post | Add a `blog-card--live` block in `blog.html`, write modal content inline |
| New achievement | Add an `ach-card` block in `index.html` |
| Update CV | Replace `assets/pdf/Rohan_CV v6.pdf` and re-encode into `app.js` |
| New org in timeline | Add a `tl-item` block in `about.html` |
| Change contact email | Update both the `mailto:` link and visible text in `contact.html` |
