# CLAUDE.md — K-SMART Ease of Doing Business (EoDB) Dashboard

This file tells Claude Code how to build and maintain the public EoDB dashboard for K-SMART (Government of Kerala, Local Self Government Department) from the approved Figma design. Read it fully before writing code. When this file and your own instincts disagree, this file wins; when this file and the Figma frame disagree on a visual detail, the Figma frame wins.

Start with **§0 Current status** — it says what already exists so you do not rebuild it.

---

## 0. Current status (as of 5 Nov 2026)

### 0.1 Repository and commands

- Repo: https://github.com/sbjglitch/IKM-EoDB-Dashboard- (branch `main`).
- Requires Node 18+ (built with Node 22).

```bash
npm install
npm run dev        # http://localhost:5173/
npm run build      # tsc --noEmit && vite build → dist/
npm run preview    # serve the production build
npm run test       # Vitest + React Testing Library (29 tests)
npm run lint       # ESLint 9 flat config + typescript-eslint + react-hooks
```

All of these pass on `main`.

### 0.2 What is built

Every section in §1 exists and renders at 1440 px and at phone width (no horizontal page scroll at 390 px).

| Area | State |
|---|---|
| Tokens / global CSS | Done — `src/styles/tokens.css`, `src/styles/global.css`. Typography tokens are `font` shorthands, e.g. `font: var(--text-body-md-strong)`. |
| Data + derivations | Done — `src/data/services.ts`, `src/lib/format.ts`, `src/lib/derive.ts`, with tests that assert every figure in §8.2. |
| `WebPortalHeader` | **Matched to Figma node `29:385`** with the real assets in `src/assets/header/` (K-SMART logo, Government of Kerala emblem, LSGD logo, divider line, chevron). Positions verified to within 0.5 px. |
| `LanguageMenu` | Menu button styled as the Figma "മലയാളം ⌄" button (128 × 36). Shows the language you can switch to. Keyboard: ArrowDown opens, arrows move, Enter selects, Escape closes and returns focus. Tests in `LanguageMenu.test.tsx`. |
| `Breadcrumb` | Built from spec. Carries the 1px divider on its top edge (the Figma header is exactly 80 px with no border). |
| `Hero` | Built from spec only — **not yet compared with Figma**. No photo (open question 4). |
| `KpiCard` ×5 | Built from spec — not yet compared with Figma. |
| `OutcomeCard` + `OutcomeWaffle` | Built from spec — not yet compared with Figma. Picker syncs with table rows. |
| `KeyHighlights` | Four data-derived insights (Start / Build / Connect / Renew) from `src/lib/highlights.ts`; wording adapts or drops a claim when the data stops supporting it. Tests in `highlights.test.ts`. Copy drafted by Claude — needs review; not in Figma. |
| `ServiceTable` + `RowDetail` | Built from spec, fully interactive (sort, expand, flags, total). Tests in `ServiceTable.test.tsx`. Not yet compared with Figma. |
| `Definitions` | Built with **draft copy written by Claude** — needs review. |
| `Footer` | Built from spec. |

### 0.3 Next steps

1. Compare each remaining section with Figma and fix differences, in this order: Hero → Summary/KPI cards → Outcomes → Service table → Definitions → Footer. Use `get_design_context` on the child nodes of frame `29:383`.
2. Export any remaining Figma assets (hero photo once a licensed one is supplied; icons if Figma uses different ones from `src/components/Icons/Icons.tsx`).
3. Resolve the open questions in §11.

### 0.4 Decisions already made (do not re-litigate)

- **Language picker**: menu button, not `<select>`, because Figma shows a button. No Malayalam translations exist yet, so choosing മലയാളം only changes the stored state; content stays English. Do not write Malayalam copy without an approved source.
- **Button `sm`**: padding `7px 13px` + 1px border = 36 px tall (Figma 8/14 measured inside the border). Primary has a pink border and `shadow-xs`. This also affects "View Application List".
- **Header divider** lives on the breadcrumb's top border.
- **Row detail** always shows the figures of its own row (resolves open question 2).
- **Table card** contains the Definitions via `children` (`<ServiceTable><Definitions /></ServiceTable>`).
- **Waffle on narrow screens** (< 700 px) switches to row flow with `auto-fill` so it wraps instead of overflowing.
- **Placeholder links** are centralised in `src/config.ts` (`APPLY_URL`, `LOGIN_URL` = `https://ksmart.lsgkerala.gov.in` — assumed, confirm; `APPLICATION_LIST_URL`, `TERMS_URL`, `PRIVACY_URL` = `#…`).
- **Fonts** are self-hosted through `@fontsource/manrope` (400–800), imported in `src/main.tsx`.

### 0.5 Known issues to raise with design

- Brand pink `#E83A7A` on white is ~3.95:1 — below WCAG AA 4.5:1 for 14–16 px text (pink buttons, pink Max values). Token kept as specified.
- `#7580A1` / `#5C6E93` small text on `#F6F9FB` is close to or below 4.5:1.
- The Outcomes section has no separate title above the two cards; the card header "Application Outcomes" serves as the `h2`. Confirm against Figma.

### 0.6 Figma access notes

- Use file key **`HyEhAH6MRAJ1gNMLsLM9AH`** (easy to mistype — an earlier attempt failed because of a wrong key).
- The Figma MCP must be signed in with an account that can open the file. The account used so far is `uix.sarath@gmail.com` (team G&S). Another file, `a6j1pBoknAK7o106Ooc9I3`, was not accessible to that account.
- Asset URLs from `get_design_context` are temporary; download them with `curl -L` into `src/assets/…` and import them. Never reference `figma.com` URLs at runtime.

---

## 1. What we are building

A single public web page that shows how quickly Kerala's local bodies process business-related applications on K-SMART. Audience: citizens and entrepreneurs (public, no login). Goal: make starting a business in Kerala feel easy and trustworthy, while staying an honest transparency page.

Sections, top to bottom:

1. **Web portal header** — K-SMART logo, Government of Kerala emblem, LSGD logo, "Government of Kerala / Local Self Government Department", language picker (മലയാളം), pink **Login** button.
2. **Breadcrumb** — Home icon · K-SMART › **EoDB Dashboard**.
3. **Hero — "Do Business in Kerala, Online"** — ranking badge, headline, message, two buttons, and four proof-point tiles.
4. **Summary · All services** — five KPI cards.
5. **Application Outcomes** — outcome card (240-square waffle + legend) beside a **Key Highlights** card.
6. **Service-wise Approval Details** — the mandatory table (9 services + total row), one expandable row, definitions underneath.
7. **Footer** — copyright, Terms & Conditions, Privacy Policy.

## 2. Source of truth

- Figma file: **EoDB Dashboard – Redesign** — https://www.figma.com/design/HyEhAH6MRAJ1gNMLsLM9AH/EoDB-Dashboard-%E2%80%93-Redesign?node-id=29-383
- Page frame: `29:383` "EoDB Dashboard — Web portal", **1440 × 2393**, desktop.
- Header instance: `29:385` "_Webportal-Header", **1440 × 80** (already implemented).
- With the Figma MCP connected, call `get_design_context` (and `get_screenshot` if needed) on the node before building a section, and compare your result against the screenshot.
- Design system: **K-Suite** (IKM's design system for Government of Kerala apps). Use its tokens and text styles listed below — never invent new colours, sizes or radii.

## 3. Tech stack

- **React 18 + TypeScript + Vite 5**.
- Styling: **plain CSS with CSS custom properties** (`tokens.css`, then a CSS Module per component). No Tailwind, no CSS-in-JS, no UI kit.
- Charts: hand-built with HTML/CSS (the waffle is a CSS grid of squares). Do **not** add a charting library.
- Fonts: **Manrope** 400/500/600/700/800, self-hosted via `@fontsource/manrope`.
- Data: typed local module (`src/data/services.ts`); later replaced by the K-SMART API with the **same shape**.
- Tests: Vitest + React Testing Library (jsdom), setup in `src/test/setup.ts`.

## 4. Design tokens

All live in `src/styles/tokens.css`. Component CSS must only reference variables, never raw hex.

### 4.1 Colours (semantic → value)

| Token | Value | Use |
|---|---|---|
| `--colour-text-default` | `#232F50` | Primary text (deep navy 500) |
| `--colour-text-subtle` | `#7580A1` | Secondary text, labels (deep navy 300) |
| `--colour-text-secondary` | `#5C6E93` | Slate secondary text |
| `--colour-text-brand-darkblue` | `#09327B` | Headings, table group headers (dark blue 950) |
| `--colour-text-brand-pink` | `#E83A7A` | Over-limit values |
| `--colour-text-inverse` | `#FFFFFF` | Text on dark/brand surfaces |
| `--colour-icon-subtle` | `#7580A1` | Neutral icons |
| `--colour-icon-brand-lightblue` | `#00B2EB` | "Returned" icon |
| `--colour-icon-brand-darkblue` | `#1C4192` | Clock icon |
| `--colour-icon-success` / `--colour-border-success` | `#1EBE72` | Approved check |
| `--colour-red-500` | `#F6505A` | Rejected icon |
| `--colour-red-600` | `#CB4049` | Rejected squares/swatch |
| `--colour-background-surface-default` | `#F1F5F8` | Page background |
| `--colour-background-surface-white` | `#FFFFFF` | Cards, table cells |
| `--colour-background-surface-card` | `#F6F9FB` | Table header cells, total row, expanded row (ice-gray 200) |
| `--colour-border-default` | `#E8EFF4` | Card borders, dividers (ice-gray 500) |
| `--colour-border-table` | `#DFE7EF` | Table cell borders |
| `--colour-border-strong` | `#D6E3EC` | Expanded-row bottom border, "remaining" squares |
| `--colour-background-button-primary` | `#E83A7A` | Primary buttons (brand pink 500) |
| `--colour-brand-darkblue-500` | `#0C3080` | Approved squares |
| `--colour-blue-600` | `#008EBC` | Returned squares |
| `--colour-lightblue-200` | `#99E0F7` | Badge icon stroke |
| `--colour-lightblue-150` | `#B2E8F9` | Hero tile body text |
| `--colour-lightblue-100` | `#CCF0FB` | Hero eyebrow and source line |
| `--colour-darkblue-50` | `#E7ECF6` | Hero paragraph text |
| `--colour-gray-650` | `#A2A7B4` | Outline of the "remaining" swatch |
| `--colour-yellow-50` / `--colour-yellow-700` | `#FEF8EC` / `#8A6416` | "Exceeds RTS limit" tag bg / text |
| `--colour-ice-100` | `#F1F5F8` | "No applications recorded" tag bg |
| `--colour-table-header-bg` | `#09327B` | Group header row |

Hero background: `linear-gradient(90deg, #012E86 0%, #398AD0 100%)` with a photo overlaid at **21 % opacity** (cover, centred) — set `--hero-photo: url(...)` once a licensed image exists. Hero glass: badge `rgba(255,255,255,0.08)` fill + `rgba(255,255,255,0.16)` border; tiles `rgba(255,255,255,0.05)` fill + `rgba(232,239,244,0.18)` border.

### 4.2 Typography (Manrope)

| Style | Weight | Size / line-height | Used for |
|---|---|---|---|
| `heading-h3-strong` | 700 | 28 / 36 | KPI values |
| `heading-h5-strong` | 700 | 20 / 26 | Section titles, legend values |
| `body-xl-extra-strong` | 700 | 20 / 26 | Emphasis |
| `body-lg-strong` | 600 | 16 / 24 | KPI labels, service names |
| `body-lg-default` | 500 | 16 / 24 | Table subtitle, body |
| `label-lg-strong` | 600 | 16 / 24 | "Service" header, total row label |
| `body-md-strong` | 600 | 14 / 20 | Table numbers, header org name |
| `body-md-default` | 500 | 14 / 20 | Card notes, language button |
| `label-md-strong` / `label-md-default` | 600 / 500 | 14 / 20 | Labels |
| `label-sm-strong` | 700 | 12 / 16 | Column sub-headers, tags, definition terms |
| `label-sm-default` | 600 | 12 / 16 | Percentages, captions |
| `label-sm-light` | 400 | 12 / 16 | Fine print |
| Hero headline | 800 | 32 / 1.2 | "Do Business in Kerala, Online" |
| Hero tile value | 800 | 30 / 1.1 | "3 days", "11,19,131"… |
| Outcome headline | 800 | 40 / 1 | "67.8%" |

Use `font-variant-numeric: tabular-nums` (`.num` class) on every number in KPIs and the table.

### 4.3 Spacing, radius, shadow

- Spacing: `md 12`, `lg 16`, `xl 20`, `2xl 24`, `3xl 32` (px). Page side padding 32, section gap 24.
- Radius: `lg 12` (cards, tiles), `16` (table card), `8` (buttons, inputs), `500` (pills/tags/badge), `3` (waffle squares).
- Shadows: `shadow-xs` = `0 1px 2px rgba(10,13,18,0.05)`; `shadow-raised` = `0 2px 4px rgba(10,13,18,0.06), 0 4px 8px rgba(10,13,18,0.10)`.
- Focus ring: `box-shadow: 0 0 0 3px rgba(0,178,235,0.35)`.

## 5. Layout spec (desktop 1440)

| Section | Spec |
|---|---|
| Header | **80 px**, white, padding 7/40, `space-between`, shadow-xs. Left group 53 px tall, gap 24: K-SMART logo 84.63 × 36.87 → vertical divider (44 px) → GoK emblem 49.37 × 31.64 (cover) → LSGD logo 53.16 × 31.48 (image 128.91 % tall, top −0.17 %, clipped) → two text lines (gap 4): "Government of Kerala" body-md-default secondary, "Local Self Government Department" body-md-strong default. Right group gap 8: language button 128 × 36, Login 104 × 36. |
| Breadcrumb bar | 48 px, padding 0/40, white, 1px top divider. Home icon + "K-SMART" › "EoDB Dashboard" (active, dark blue). |
| Hero | Full-bleed, padding 24/32, inner max-width 1376, two columns of 672 with 32 gap. |
| Hero · left | Column, gap 14: badge pill (padding 7/12, award icon 16) → H1 → paragraph (max 672) → actions (gap 10): Primary XL "Apply on K-SMART" + Tertiary grey XL "See Time Limits". |
| Hero · right | Eyebrow "ACROSS KERALA, THROUGH K-SMART" → 2×2 tiles (gap 10; tile padding 16, gap 6) → source line. |
| Main | Padding 24/32, column gap 24, content width 1376. |
| Summary | Title + row of 5 KPI cards, gap 24, each `flex: 1`. Card: white, 1px border, radius 12, padding 20, gap 12: icon (24) + label → value → note. |
| Outcomes | Row (gap 16) of two equal cards, padding 20/24, radius 12, 1px border. |
| Table card | Radius 16, 1px border, overflow hidden. Title block padding 24. Then table, then Definitions (padding 20/24/24/24, 5 columns, gap 32, top border). |
| Footer | Top border, padding-top 16, `space-between`. |

## 6. Components (`src/components/`)

1. **`WebPortalHeader`** [`_Webportal-Header`] — done (see §0.2).
2. **`LanguageMenu`** — done (see §0.4).
3. **`Breadcrumb`** — `<nav aria-label="Breadcrumb">` + `<ol>`; last item `aria-current="page"`.
4. **`Button`** [K-Suite `Button`] — `size: 'sm' | 'xl'`, `hierarchy: 'primary' | 'tertiary' | 'tertiary-grey'`, `icon: 'none' | 'leading' | 'trailing' | 'only'` + `iconNode`. Renders `<a>` when `href` is set. Labels are verb + object.
5. **`Hero`** — includes `RankingBadge` and `ProofTile`.
6. **`KpiCard`** — `icon`, `label`, `value`, `note`. Icons (inline SVG, 1.5 px stroke, `currentColor`, in `Icons/Icons.tsx`): chart-square (subtle), check (success), return arrow (light blue), cross (red 500), clock (brand dark blue).
7. **`OutcomeWaffle`** — N squares; main = 240 squares 12 px, gap 4, 6 rows, filled column by column; order approved → returned → rejected → remaining; `role="img"` + full `aria-label`.
8. **`OutcomeCard`** — header + service picker (`<select>`, default "All services (total)"), headline %, waffle, 4-column legend.
9. **`KeyHighlights`** — `services` prop; renders `buildHighlights(services)` (see §0.2).
10. **`ServiceTable`** — see §7.
11. **`RowDetail`** — expanded row content.
12. **`Tag`** — `warning` / `neutral`.
13. **`Definitions`** — `<dl>` with five pairs.
14. **`Footer`**.

## 7. Service table (mandatory component)

The stakeholder requires this table. Never remove it or replace it with cards.

### 7.1 Structure

- Real `<table>` with `<caption>` (title block), `<thead>` with **two header rows**, `<tbody>`, `<tfoot>` for the total.
- Column widths at 1440: Service **285**, then three groups of **363**: *Fee and time limit* (Statutory / avg fee, RTS limit), *Applications* (Received, Approved, Returned, Rejected), *Time taken to process (days)* (Min, Median, Average, Max).
- "Service" header `rowspan="2"`. Group headers bg `#09327B`, white uppercase `label-sm-strong`, white separators. Sub-headers bg card, `label-sm-strong`, secondary colour, right-aligned.
- Body rows 78 px, white, `#DFE7EF` borders, padding 16/12. Service cell: chevron toggle (24) + name (`body-lg-strong`). Numbers `body-md-strong` right-aligned; percentages under them in `label-sm-default`.
- Fee cell: main value + "Avg ₹x" when both exist; otherwise the fee note.
- Total row: bg card, "Total · All services", totals + percentages for the four application columns; fee and time cells empty (never sum times).

### 7.2 Behaviour

- **Sort**: every column except fee. `<button>` in the `<th>`, `aria-sort` on the `<th>`. First click = descending for numbers, ascending for name; second click reverses. Total row stays in `<tfoot>`.
- **Expand row**: chevron button (`aria-expanded`, `aria-controls`) toggles a detail `<tr>` (`<td colspan="11">`) — 50-square mini waffle (13 px, gap 3, 2 rows × 25), "Approved x% · Returned y% · Rejected z% · Remaining n (r%)", pink "View Application List". Opening a row sets the Outcome card's picker to that service. Several rows may be open. Chevron rotates 90° (respect reduced motion).
- **Flags**: `Tag warning "Exceeds RTS limit"` when `avg > limit || max > limit`; `Tag neutral "No applications recorded"` when `received === 0`; Max value pink when `max > limit`.
- Narrow screens: table scrolls horizontally inside its card (`role="region"`, `tabIndex=0`), Service column sticky.

## 8. Data

### 8.1 Source data (live K-SMART EoDB dashboard, read 2 Nov 2026)

Stored in `src/data/services.ts` (`Service` interface, `SERVICES` array of 9). The live dashboard writes fees as "150/4000" and Rejected/Returned as "917/33267" — we store them split. It spells "Ammendment"; we display "Amendment". `Same day` RTS limit is stored as 1.

### 8.2 Derived values (compute, never hard-code)

- `remaining = received − approved − returned − rejected` ("Remaining*" with footnote).
- Shares: `x / received × 100`, one decimal, "—" when `received === 0`.
- Totals: received **16,51,551**, approved **11,19,131 (67.8%)**, returned **1,66,563 (10.1%)**, rejected **19,053 (1.2%)**, remaining **3,46,804 (21.0%)** — asserted in `derive.test.ts`.
- "Within RTS limit": `received > 0 && avgDays <= rtsLimitDays` → **7 of 8**.
- Waffle: largest-remainder method; 240 → 163 / 24 / 3 / 50; Renewal at 50 → 41 / 3 / 1 / 5.
- Hero tiles: "3 days" (Trade License – New median, limit 7), "11,19,131", "7 of 8", "1.2%".

### 8.3 Formatting

- Indian digit grouping via `formatINR` (hand-written, tested) — 16,51,551, not 1,651,551.
- Currency "₹150", "Avg ₹4,000", "₹10,000". Days "1 day", "2 days"; `Same day` stays text.

## 9. Content and voice (K-Suite content guide)

- Clear, direct, professional, neutral, instructional. No emoji, no exclamation marks, no hype.
- Navigation = nouns; buttons = verb + object; page titles = object + state.
- Every positive claim must come from the data or a cited source. Badge: "Top Achiever · National Ease of Doing Business rankings 2024"; keep the source line under the tiles. Confirm award wording with the Department of Industries before launch.
- Keep honest details visible: Renewal's over-limit flag and Property Tax's data note stay.

## 10. Accessibility (WCAG 2.1 AA)

- Landmarks: `header`, `nav` (breadcrumb), `main`, `footer`; one `h1`; section titles `h2`.
- Real `<button>`, `<a href>`, `<select>`, `<label>`; no click handlers on `div`/`span`.
- Contrast ≥ 4.5:1 for body text (see §0.5 for known gaps).
- Waffles: `role="img"` + `aria-label` with all four shares. Never rely on colour alone.
- Visible focus ring; respect `prefers-reduced-motion`.
- `lang="en"`; Malayalam strings carry `lang="ml"`.

## 11. Open questions

1. **Key Highlights card is empty in Figma.** Built as four derived insights (new trade licence slowest decision within limit, building permit median vs limit, mobile tower approvals, renewal volume). Confirm copy and choice with design/stakeholders.
2. ~~Expanded row mismatch~~ — resolved in code: detail shows its own row's figures.
3. **"View Application List" target** — placeholder in `src/config.ts`.
4. **Hero photo** — Unsplash image (`unsplash:eEBYeEvEzYw`) needs a licensed/official replacement.
5. **"Last updated" timestamp** — not in the source data; ask the K-SMART team.
6. **Hidden "User Actions"** (Print/Download in breadcrumb bar) — do not build unless asked.
7. **Mobile layout** — not designed. Current fallback: hero stacks, KPI cards 2-column, outcome cards stacked, table scrolls with sticky Service column, header hides org text (< 900 px) and government logos (< 480 px).
8. **Malayalam content** — no translations supplied.
9. **Apply/Login URL** — `https://ksmart.lsgkerala.gov.in` assumed.
10. **Definitions and hero paragraph copy** — drafted by Claude; needs review.

## 12. File structure

```
src/
  assets/header/              # Figma exports for the header
  config.ts                   # placeholder URLs, source read date
  data/services.ts
  lib/format.ts (+ .test.ts)
  lib/derive.ts (+ .test.ts)
  styles/tokens.css, global.css
  test/setup.ts
  components/
    Breadcrumb/ Button/ Definitions/ Footer/ Hero/ Icons/ KeyHighlights/
    KpiCard/ LanguageMenu/ OutcomeCard/ OutcomeWaffle/ RowDetail/
    ServiceTable/ Tag/ WebPortalHeader/
  App.tsx, App.module.css, main.tsx
```

## 13. Don'ts

- Don't remove or restyle the table into cards.
- Don't invent data, trends or "vs last month" comparisons — the source has no time series.
- Don't hard-code totals or percentages; derive them from `SERVICES`.
- Don't use colours, fonts, radii or shadows outside §4.
- Don't add a charting or UI library without asking.
- Don't sum or average processing times across services.
- Don't reference temporary Figma asset URLs at runtime.
