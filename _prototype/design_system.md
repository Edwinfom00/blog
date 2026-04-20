# Edwin Fom — Design System

> A living document for an editorial, serif-forward developer journal.
> Use this file as the single source of truth when rebuilding or extending the design.

---

## 1. Design Intent

**Character:** Editorial magazine × developer journal. Think Stripe Press meets The Browser Company blog meets Paul Graham essays. Generous white space, serif italics for voice, monospace for machine.

**Three rules, non-negotiable:**
1. **Typography carries the design.** Color is an accent, not a carrier.
2. **One serif display, one reading serif, one UI sans, one mono.** No more.
3. **The grid breathes.** Default reading width ≤ 720px. Vertical rhythm matters more than horizontal alignment.

**Tone of voice:** First-person, narrative, honest. Admit doubt. Prefer a short sentence. French and English are both first-class citizens.

---

## 2. Type System

### Typefaces
| Role | Family | Source | Weights |
|---|---|---|---|
| Display (hero, h1, h2, italic voice) | **Instrument Serif** | Google Fonts | 400 / 400 italic |
| Reading body | **Newsreader** | Google Fonts | 400 / 400 italic / 600 |
| UI / navigation | **Inter** | Google Fonts | 400 / 500 / 600 |
| Monospace / code / metadata | **JetBrains Mono** | Google Fonts | 400 / 500 |

Import:
```html
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Newsreader:ital,opsz,wght@0,6..72,300..700;1,6..72,300..700&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### CSS variables
```css
--font-display: 'Instrument Serif', 'Times New Roman', serif;
--font-read:    'Newsreader', Georgia, serif;
--font-ui:      'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
--font-mono:    'JetBrains Mono', ui-monospace, Menlo, monospace;
```

### Scale (fluid, clamp-based, ratio 1.25)
| Token | Size | Usage |
|---|---|---|
| `xs`  | 11px fixed | Metadata, labels, kbd |
| `sm`  | 12.5–13px | Captions, footnotes |
| `ui`  | 13–14px | Navigation, buttons |
| `base`| 15px | UI body |
| `read`| 19px | Article body (Newsreader) |
| `dek` | 20–22px italic | Standfirst / deck |
| `h3`  | clamp(22, 3vw, 28) | Card titles |
| `h2`  | 34–38px | Section headers |
| `h1`  | clamp(40, 6vw, 78) | Article titles |
| `hero`| clamp(56, 11vw, 148) | Masthead wordmark |

**Line heights:** body 1.66, UI 1.5, display 1.02–1.1.

**Kerning:**
- UI labels & uppercase metadata: `letter-spacing: .08em–.14em; text-transform: uppercase;`
- Display serif: `letter-spacing: -0.01em;`
- Everything else: default.

### Type rules
- Body text is always `--font-read` (Newsreader). UI text is always `--font-ui` (Inter). Never mix.
- Italics are a voice, not a decoration. Use them for kickers, deks, section ornaments, and for the word "Journal" in the masthead.
- A single drop cap on the first paragraph of every article. Instrument Serif italic, accent color, `font-size: 4.8em; float: left;`.
- Monospace gets a soft tint background for inline code: `background: var(--bg-tint); color: var(--accent); padding: 1px 6px;`.

---

## 3. Color System

Three themes, each with a light and dark mode. Themes are applied via `data-theme` + `data-mode` on `<body>`. All tokens use CSS custom properties; no hex in components.

### Themes

#### `sanguine` — the default
Warm off-white, sanguine/ocre accent. The house style.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FBF9F5` | `#141311` |
| `--bg-tint` | `#F2EDE3` | `#1C1B18` |
| `--surface` | `#FFFFFF` | `#1E1D1A` |
| `--ink` | `#1A1916` | `#F2EDE3` |
| `--ink-soft` | `#4A4742` | `#BDB6A8` |
| `--ink-mute` | `#807A70` | `#807A70` |
| `--rule` | `#E6DFD1` | `#2A2824` |
| `--rule-soft` | `#EFEAE0` | `#242320` |
| `--accent` | `#B4532A` | `#E89268` |
| `--accent-soft` | `#E8D7C7` | `#3A2A20` |
| `--highlight` | `#F4E4C1` | `#3A2F1A` |

#### `noir` — dark editorial
Deeper contrast, red-clay accent. For moody reading.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#F4F1EB` | `#0B0B0A` |
| `--bg-tint` | `#E8E3D7` | `#131211` |
| `--ink` | `#111111` | `#EEEAE0` |
| `--accent` | `#8A2B1F` | `#C4453A` |

#### `swiss` — monochrome
Pure black/white. For when the content is the design.

| Token | Light | Dark |
|---|---|---|
| `--bg` | `#FFFFFF` | `#0A0A0A` |
| `--ink` | `#000000` | `#FFFFFF` |
| `--accent` | `#000000` | `#FFFFFF` |

### Color rules
- **Accent is scarce.** Reserve it for: issue numbers, drop caps, active TOC markers, hover states, the ampersand in the masthead, dots in project status. Never body text. Never borders except the active TOC bar.
- **`--ink` vs `--ink-soft` vs `--ink-mute`:** primary / secondary / tertiary hierarchy. Use mute for dates, counts, captions.
- **No saturation above 0.08** on any token. Whites and blacks must be visibly tinted toward the theme temperature.
- **Selection** always uses `--highlight` with `var(--ink)` text.

---

## 4. Spacing & Grid

### Base unit
`4px`. All spacing, padding, and gaps are multiples: 4, 8, 12, 16, 20, 24, 32, 48, 64, 96, 120.

### Page containers
| Context | Max width | Horizontal padding |
|---|---|---|
| Home | 1240px | 32px desktop / 18px mobile |
| Projects | 1180px | 32px |
| Archive index | 980px | 32px |
| Article | 1320px (with rails) | 32px |
| Reading column | **660–760px** (tweakable) | — |

### Article grid
```
[ TOC 220px ] [ reading 660–760px ] [ rail 220px ]
gap: 48px
```
Collapses to `[TOC 180] [reading]` under 1200px, then single-column under 900px.

### Vertical rhythm
- Section top padding: `48–64px`
- Section bottom padding: `32–48px`
- Between article paragraphs: `1.3em`
- Between H2 and body: `.6em` after, `2.2em` before
- Blockquote: `2em` vertical margin
- Code block: `1.8em` vertical margin

### Rules (horizontal lines)
Two variants:
1. **Plain** — `1px solid var(--rule)`, 860px max, centered, `margin: 3.5em 0`.
2. **Ornamental** — two 1px lines with a `◆` glyph centered between them, 220px wide.

---

## 5. Elevation & Borders

- **Default border:** `1px solid var(--rule)`.
- **Border radius:** `3px` for inputs/buttons, `4px` for cards/code, `6px` for panels, `999px` for pills. Never `>10px`.
- **Shadow (only two levels):**
  - `--shadow-sm`: `0 1px 2px rgba(0,0,0,.04)`
  - `--shadow-lg`: `0 24px 60px rgba(0,0,0,.18), 0 2px 6px rgba(0,0,0,.08)` — floating panels only (CmdK, AI).
- Cards and list items don't get shadows. They get `background: var(--bg-tint)` on hover.

---

## 6. Motion

- **Timing curve:** `cubic-bezier(.4, 0, .2, 1)` always.
- **Durations:**
  - Color/background hover: `.15s`
  - Transform/layout hover: `.2s`
  - Panel enter/exit: `.25s`
  - Page transitions: `.3s` (via View Transitions API when available)
- **Cell/grid entrance:** stagger with `animation-delay: ${i * 18}ms`.
- **Reading progress bar:** 2px, top, accent. Updates on `scroll` (passive).
- **Respect `prefers-reduced-motion: reduce`** — disable cell stagger, bubble halo, and drop-cap fade. Keep color transitions.

---

## 7. Components

### 7.1 Nav
- Sticky top, `backdrop-filter: blur(14px) saturate(1.2)`, translucent bg.
- 3-column grid: brand · center links · right actions.
- Brand: 30px circle `EF` mark + italic serif name + "— Since 2021" sub.
- Link active state: `::after` 1px accent bar under text.
- Right: Search (with `⌘K` kbd), language pill (`FR`/`EN` in mono, boxed), mode toggle (sun/moon).

### 7.2 Masthead (home only)
- Double rule: top `3px solid ink`, inner separator `1px solid rule`.
- Title in two display blocks: line 1 "Edwin Fom", line 2 italic "& le Journal" with accent `&`.
- Italic kicker below, centered.

### 7.3 Hero article
- 2-column grid (1.1fr / .9fr). Collapses to single column at 900px.
- Left: uppercase kicker (accent) → serif h1 → italic dek → CTA row.
- Right: "figure" — a 4:5 tinted frame with giant accent italic numeral over an 8×6 grid of thin-ruled cells that fade in on stagger. Caption row in mono at the bottom.

### 7.4 Card (article grid)
- 4-up row on desktop, borders between cells, no outer border except bottom.
- Mono meta row: `№12` left, date right, uppercase.
- Serif title (24px, cursor: pointer). Italic serif dek below.
- Hover: `background: var(--bg-tint); title → accent`.
- Foot: `#tag` chips in mono + "N min read →" right.

### 7.5 Section head
- Flex justify-between, bottom border.
- Left: uppercase kicker (accent, 11px, tracking .14em) + italic serif title (38px).
- Right: "See all" text link with animated arrow, underline on hover.

### 7.6 TOC (article)
- Sticky, `top: 88px`.
- Left-border timeline `1px solid var(--rule)`.
- Active item: 2px accent bar on left edge + `--ink` color.
- Items: 13px Inter, 1.3 line-height, padding `7px 0 7px 14px`.

### 7.7 Reading progress
- `position: fixed; top: 0; height: 2px; background: var(--accent);`
- Width = clamp(0, scrollY / (articleHeight − 70vh), 1) × 100%.

### 7.8 Code block
Three styles, switchable via `data-code-style` on body:
- `paper` (default): tinted bg, 1px rule border, language tag + copy button in head.
- `minimal`: no border, no head, 2px left accent bar only. Quieter.
- `terminal`: near-black bg, warm off-white text, no border, 6px radius.

Minimal syntax highlighter covering: keywords, strings, comments, types, numbers, `+`/`-` diff markers. Tokens:
- `.tok-k` keywords → accent, weight 500
- `.tok-s` strings → olive green (or warm tan in terminal)
- `.tok-c` comments → ink-mute italic
- `.tok-t` types → teal
- `.tok-n` numbers → accent

### 7.9 Blockquote (editorial)
- 2px accent left border, `padding-left: 32px`.
- Text in Instrument Serif italic, 28px, line-height 1.3.
- Opening quote `“` as giant accent glyph, `vertical-align: -.45em; opacity: .5`.

### 7.10 Rail card (right column of article)
- Padding 20px, `background: var(--bg-tint)`, radius 4px.
- Mono uppercase label + stacked mono tags below.

### 7.11 Continue reading block
- Top & bottom rules. Center label in mono uppercase.
- 2-column flex: prev (left-aligned) / next (right-aligned).
- Each: mono "← Previous" kicker + serif 22px title.

### 7.12 Command Palette (⌘K)
- Overlay with `backdrop-filter: blur(4px)` and ink/30% bg.
- 640px panel, top-14vh, surface bg, 8px radius, lg shadow.
- Input row with search icon + input + `ESC` kbd.
- Results are `grid-template-columns: 18px 1fr auto`: glyph (✦ article, ◆ project, → action) / title+dek / meta.
- Selection: `background: var(--bg-tint)`. Keyboard: ↑/↓/Enter/Escape.
- Footer row with kbd hints in mono.

### 7.13 AI Reading Companion
Two parts:
1. **Bubble** — `position: fixed`, pill-shaped, ink bg, 26px accent circle icon on the left, animated halo ring. Three positions via `data-ai-dock`: `br` (default), `bl`, `side` (right-center).
2. **Panel** — 420×640 (capped at viewport), surface bg, lg shadow, 10px radius. Structure:
   - Header (bg-tint): 28px accent avatar, italic serif title "Reading companion", italic subtitle naming the current article.
   - Body: suggestions as quiet ghost buttons when empty; chat bubbles with ≈80% max-width, user messages in ink bg, assistant in bg-tint.
   - Input row (bg-tint): text input + 38px send button.
   - Footer: mono caption, "Powered by Claude · Answers grounded in the articles".

**Contextual grounding:** the panel receives the current article's title, deck, and plain-text body (stripped of HTML, capped at ~2.4k chars) as system prompt before every call. No article = visitor bio fallback.

**Keyboard shortcut:** `⌘J` opens the panel.

### 7.14 Inline AI prompt (inside articles)
Dashed accent border, tinted accent bg (6%), two suggestion buttons. Bridges the reading flow to the companion without pulling attention.

### 7.15 Tweaks panel
280px panel bottom-right, only visible when host toggles edit mode. Segment controls for theme / mode / code style / AI dock; range slider for reading width. Every change posts to parent via `__edit_mode_set_keys` for persistence.

---

## 8. Iconography

**Style:** single-weight 1.5px strokes, 24px viewBox, rounded caps & joins, no fills (except dots).

**Set (the only icons we use):**
`search · arrow-right · arrow-up-right · sun · moon · sparkle · x · copy · check · send · book · layers · home · command · hash · dot · minus · globe`

New icons must match the stroke, rounding, and visual weight. No filled glyphs.

---

## 9. Internationalization

- Every UI string lives in `I18N[lang]`. No hardcoded text in components.
- Languages: `fr` (primary) and `en`. FR/EN toggle in nav, persisted in Tweaks.
- Dates formatted locally: `11 avr. 2026` / `11 Apr 2026`. Month abbreviations are hand-tuned (FR uses dotted abbreviations except May/June).
- Article titles, decks, TOC headings, tags, and bodies are each keyed by lang: `title: { fr: "…", en: "…" }`.

---

## 10. Content Shape

### Article record
```ts
{
  id: string,
  slug: string,
  issue: number,           // monotonic, surfaces as "№14"
  date: "YYYY-MM-DD",
  readMin: number,
  tags: { fr: string[], en: string[] },
  featured: boolean,       // at most 2 featured at a time
  title: { fr: string, en: string },
  dek: { fr: string, en: string },    // 1–2 sentences, italic standfirst
  toc: Array<{ id, fr, en }>,         // H2 anchors only
  body: keyof typeof BODIES,          // pointer into BODIES registry
}
```

### Body blocks
A body is an array of typed blocks (FR and EN are separate arrays):
| type | payload |
|---|---|
| `p` | `text: string` (may contain inline `<code>` or `<em>`) |
| `h2` | `id, text: {fr, en}` |
| `quote` | `text: string` |
| `list` | `items: string[]` |
| `code` | `lang, code` |

The first non-heading block gets the drop cap automatically (via `:first-child::first-letter`).

### Project record
```ts
{
  id, name, year, url,
  kind: { fr, en },
  desc: { fr, en },
  tags: string[],
  status: "live" | "new" | "wip"
}
```
Status colors: live = `#3FA264` green, new = `--accent`, wip = `#D9A94C` amber.

---

## 11. Accessibility

- **Focus rings:** preserve default browser outlines on all interactive elements. If overriding, use `2px solid var(--accent); outline-offset: 2px;`.
- **Color contrast:** `--ink` on `--bg` ≥ 13:1 in every theme. `--ink-mute` is for ≤11px metadata only — never body.
- **Keyboard:** ⌘K, ⌘J, ↑/↓/Enter/Escape in CmdK, Tab navigation through nav + cards + TOC + AI panel.
- **Reduced motion:** drop cell stagger, bubble halo animation, drop-cap transition. Color changes remain.
- **ARIA:** icons decorative (no label) when redundant with text; buttons that are icon-only have `aria-label`.

---

## 12. File Architecture

```
Blog.html                # shell: fonts, tokens, 3 themes, tweak defaults
src/
  data.jsx               # I18N, ARTICLES, PROJECTS, BODIES
  icons.jsx              # <Icon name=…/> registry
  components.jsx         # Nav, Footer, CmdK, TweaksPanel, CodeBlock, Rule, highlight()
  pages.jsx              # HomePage, IndexPage, ProjectsPage, ArticlePage
  ai.jsx                 # AICompanion
  app.jsx                # App — routing, tweaks, keyboard, host protocol
```

**Rules:**
- Every component file ends with `Object.assign(window, { … })` to publish its exports — Babel scripts don't share scope.
- No `const styles = {…}` at module scope. Each styles object is namespaced or inlined via `<style>` blocks inside the component.
- Keep files under 1000 lines. If a page grows past that, split its sub-sections into their own module.

---

## 13. Tweaks Contract

The host can toggle an in-page Tweaks panel. Protocol:
1. App registers `message` listener handling `__activate_edit_mode` / `__deactivate_edit_mode`.
2. App posts `{ type: '__edit_mode_available' }` to parent on mount.
3. On every user change, post `{ type: '__edit_mode_set_keys', edits: { …partial } }`.
4. Defaults live in a single JSON island in the HTML shell:
```html
<script>
const TWEAKS = /*EDITMODE-BEGIN*/{
  "theme": "sanguine",
  "mode": "light",
  "readingWidth": 680,
  "codeStyle": "paper",
  "aiDock": "br",
  "lang": "fr"
}/*EDITMODE-END*/;
</script>
```
The block between markers must be valid JSON and appear exactly once in the root HTML.

---

## 14. Non-goals

Things this design explicitly rejects — don't reintroduce them without a conversation:
- Gradient backgrounds, glassmorphism, neon.
- Emoji as UI (we have one mono set, that's enough).
- Hero-sized photography. All imagery is typographic or placeholder.
- Testimonial carousels, "features" grids, or anything that smells of a SaaS landing page.
- Third-party syntax highlighters (Prism, Shiki). The in-house `highlight()` fn is intentionally minimal.
- Animations that aren't tied to reading progress or state change.

---

*Composed alongside Instrument Serif and Newsreader. Written for Edwin's own hand.*
