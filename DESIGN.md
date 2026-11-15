---
name: Web3 Academy
description: "The Observer's Atlas — a free Web3 curriculum drawn as an engraved star chart: chart-stock ivory ground, indigo-slate ink, brass for action, verdigris for completion, night plates for code and exhibits."
colors:
  chart-stock: "#f2f0e8"
  chart-stock-shade: "#eae6d9"
  chart-stock-deep: "#e2ddcc"
  indigo-ink: "#1e2a38"
  indigo-ink-soft: "#46566a"
  indigo-ink-faint: "#5c6b7c"
  hairline: "#d9d4c4"
  hairline-strong: "#c0bbaa"
  brass: "#8a6318"
  brass-fill: "#a1761f"
  brass-bright: "#c8942a"
  brass-wash: "rgba(161, 118, 31, 0.09)"
  verdigris: "#2e6650"
  verdigris-fill: "#3e7d64"
  seal-ochre: "#8f3323"
  seal-ochre-fill: "#a13c2b"
  night-plate: "#101d2e"
  night-plate-2: "#16283e"
  plate-hairline: "#2b4058"
  star-ivory: "#ece7d9"
  plate-blue: "#a9b8cc"
  ivory-bright: "#f6f2e6"
typography:
  display:
    fontFamily: "Marcellus, 'Times New Roman', serif"
    fontSize: "clamp(30px, 3.3vw, 43px)"
    fontWeight: 400
    lineHeight: 1.16
    letterSpacing: "0.005em"
  headline:
    fontFamily: "Marcellus, 'Times New Roman', serif"
    fontSize: "clamp(24px, 2.8vw, 31px)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.01em"
  title:
    fontFamily: "Marcellus, 'Times New Roman', serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "0.01em"
  body:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.14em"
  mono:
    fontFamily: "ui-monospace, 'SF Mono', 'Cascadia Code', 'JetBrains Mono', Menlo, Consolas, monospace"
    fontSize: "13.5px"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  xs: "4px"
  sm: "6px"
  md: "10px"
  lg: "14px"
  pill: "99px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "40px"
  section: "56px"
components:
  button-primary:
    backgroundColor: "{colors.brass-fill}"
    textColor: "{colors.ivory-bright}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.indigo-ink}"
    rounded: "{rounded.sm}"
    padding: "11px 20px"
  card:
    backgroundColor: "{colors.chart-stock}"
    textColor: "{colors.indigo-ink}"
    rounded: "{rounded.md}"
    padding: "24px"
  tag:
    backgroundColor: "{colors.chart-stock}"
    textColor: "{colors.indigo-ink-faint}"
    rounded: "{rounded.pill}"
    padding: "3px 10px"
  quiz-option:
    backgroundColor: "{colors.chart-stock}"
    textColor: "{colors.indigo-ink}"
    rounded: "{rounded.sm}"
    padding: "11px 14px"
---

# Design System: Web3 Academy

## Overview

**Creative North Star: "The Observer's Atlas"**

Web3 Academy is rendered as an engraved star chart — an atlas of invisible systems. The learner surveys one warm chart-stock ivory sky, chooses a constellation (a track), reads deep night plates calmly, does fieldwork with real tools, and records the result in a field log. Every surface behaves like archival chart paper: 1px hairline rules structure it, engraved serif letterforms title it, and nothing glows. The system refuses both the neon-terminal web3 default (the incumbent look, treated as the anti-reference) and the generic edtech card grid.

The material logic is strict. Light chart-paper ivory (#f2f0e8) is the reading ground; deep night plates (#101d2e) are reserved for things set apart for study — code blocks, diagrams, exhibit headers, and the signature constellation chart. Brass is the atlas's one metal: it marks action, active states, accents and completed stars. Verdigris marks completion everywhere else; seal red-ochre is rationed to warnings and severity. Color never carries state alone — completion, progress and practice states are drawn as line marks (solid strokes, dashed open rings, filled circles), in the manner of engraved notation.

Motion is a single authored moment, not a habit: the constellation linework draws in once on load with an exponential ease-out, the hero copy rises once, and everything else transitions quietly in 100–200ms. All of it is disabled under `prefers-reduced-motion`.

**Key Characteristics:**
- Warm chart-stock ivory ground (#f2f0e8) for reading; deep night plates (#101d2e) only for code, diagrams, exhibit headers and the star chart.
- Indigo-slate ink (#1e2a38) with a three-step soft/faint ladder for hierarchy; hairline rules (#d9d4c4 / #c0bbaa) instead of boxes and shadows.
- Brass (#8a6318 text / #a1761f fill / #c8942a bright on plates) as the single accent metal for action, active states and completed stars; verdigris (#2e6650) for completion marks; seal red-ochre (#8f3323) for warnings.
- Marcellus (engraved serif) display set in sentence case; Spectral reading serif for body; system sans for UI chrome; monospace rationed to code, data and numerals.
- State drawn as line grammar — solid check = done, dashed open ring = unread, solid brass ring = established fact — never color alone.
- Signature component: the StarMap constellation chart of all 33 real lessons, with hover-highlight per constellation and a one-time draw-in animation.
- Hatched meridian progress bars, ruled index rows instead of card grids, pill tags for metadata, 44px minimum touch targets, visible brass focus rings.

## Colors

The palette reads as archival cartography: one warm ivory paper family, one indigo-slate ink family, two hairline tones, three metals (brass, verdigris, seal ochre), and a deep blue-black plate family with two ivory inks on it.

### Primary

- **Brass** (#8a6318): the atlas's one metal, as text. Primary buttons' hover ground, links, active nav underline, focus rings, list markers, Roman numerals in step counters, term heads, module ticks, and the "Academy" half of the wordmark. On chart-stock paper, brass text must stay at #8a6318 — it is the AA-passing value.
- **Brass fill** (#a1761f): the metal as matter — primary button fill, filled timeline rings, meridian hatch strokes, earned badge dots, skip-link ground. Text on it is always ivory-bright (#f6f2e6).
- **Brass bright** (#c8942a): the metal caught by plate light — used only on night plates (star chart links/labels of active constellations, completed stars, exhibit catalog numbers, sev-high tags) and for copy-button hover on plates.
- **Brass wash** (rgba(161, 118, 31, 0.09)): a breath of brass as row-hover ground (lesson rows, track rows, case rows, nav links, search hits) and earned-badge tint.

### Secondary

- **Verdigris** (#2e6650): the completion color everywhere off the chart. Done-marks text and icons, checked step rings, completed lesson numerals, correct quiz borders, perfect-score text, breakthrough outcome tags, deep-dive callout symbols.
- **Verdigris fill** (#3e7d64): filled check rings and the full-track meridian bar.

### Tertiary

- **Seal red-ochre** (#8f3323): warning ink — warning callout symbols and kind labels, practice cautions, sev-high tag text, wrong-answer icons, danger-ghost button text.
- **Seal ochre fill** (#a13c2b): the filled form — danger buttons, sev-critical tags, incorrect quiz borders.

### Neutral

- **Chart stock** (#f2f0e8): the reading ground. Body background, cards, table cells, quiz options, tags. (Theme-color meta matches it.)
- **Chart stock shade** (#eae6d9): the once-removed ground — footer, objectives panels, practice cards, dash hero, callout panels, table headers, kbd caps.
- **Chart stock deep** (#e2ddcc): the third ground, used for the progress-ring track.
- **Indigo ink** (#1e2a38): primary text on paper — headings, strong labels, table lead cells.
- **Indigo ink soft** (#46566a): secondary text — standfirsts, section leads, subtitles, secondary table cells.
- **Indigo ink faint** (#5c6b7c): tertiary text — meta, captions, breadcrumb, catalog numbers, tag text.
- **Hairline** (#d9d4c4): the 1px structural rule — row borders, card borders, section dividers.
- **Hairline strong** (#c0bbaa): the firmer rule — card hover borders, kbd and search-button borders, outer frames of ruled grids, timeline spine, unread state rings.
- **Night plate** (#101d2e): the deep blue-black plate ground — code blocks, the star chart, exhibit headers, level-advanced badge, search backdrop (at 55% alpha).
- **Night plate 2** (#16283e): plate chrome — code block headers, star chart caption bar.
- **Plate hairline** (#2b4058): the hairline on plates — borders, graticule strokes, dividers on dark ground.
- **Star ivory** (#ece7d9): the engraved ivory ink on plates — code text, exhibit h1s, active constellation stars.
- **Plate blue** (#a9b8cc): the muted blue ink on plates — labels, captions, unread stars, code language tags, muted plate body text.
- **Ivory bright** (#f6f2e6): the near-white reserved for text on filled brass and seal-ochre grounds (primary button text, sev-critical tags, checked step marks).

### Named Rules

**The Gilding Rule.** Brass is the atlas's one metal: it gilds action, active elements, accents and completed stars, and it may appear as engraved ornament (heading ticks, list markers, completed stars on the chart) beyond strict action-only use. Verdigris is the completion color everywhere else — off-chart completion marks are always verdigris, never brass. The two never swap roles.

**The Four-Ink Plate Rule.** A night plate carries at most four inks: star ivory (primary engraving), muted plate blue (secondary text), brass bright (the metal caught by plate light), and one status tone when the plate must speak state (e.g. seal ochre fill on a sev-critical tag, lifted verdigris/seal tints for outcome tags). Never add a fifth ink to a plate; the bounded set is what keeps plates legible.

## Typography

**Display Font:** Marcellus (with Times New Roman serif fallback)
**Body Font:** Spectral (with Georgia / Times New Roman serif fallback)
**UI Font:** System sans (-apple-system / Segoe UI / Roboto stack)
**Mono Font:** ui-monospace / SF Mono / Cascadia Code stack

**Character:** An engraved serif that reads like plate lettering, paired with a scholarly reading serif; the system sans stays in the chrome (nav, buttons, tags, step lists) and monospace is rationed to the chart's data. The pairing feels archival and calm — authority through letterform and spacing, never through shouting.

### Hierarchy

- **Display** (Marcellus 400, clamp(30px, 3.3vw, 43px), line-height 1.16, 0.005em): hero and page titles, set in sentence case, max-width ~24ch.
- **Headline** (Marcellus 400, clamp(24px, 2.8vw, 31px), line-height ~1.3, 0.01em): section h2s, preceded by a hairline top rule; each carries a 26px brass tick above it.
- **Title** (Marcellus 400, 16–22px): card titles, module titles, track names, exhibit names, glossary terms.
- **Body** (Spectral 400, 17px, line-height 1.75, max-width 68ch): lesson reading; UI body (system sans, 16px, line-height 1.65) handles interface copy. Standfirsts and leads run Spectral at 17.5–18px in ink-soft.
- **Label** (system sans 600, 11px, letter-spacing 0.14em, uppercase): small-caps meta only — plate captions, section kind labels, stat labels, footers. Never placed as a kicker above a heading.
- **Mono** (13.5px, line-height 1.65): code, addresses, catalog numbers (EX-01), lesson order numerals, XP/counts, quiz progress. Tabular numerals (`font-variant-numeric: tabular-nums`) on all counted figures.

### Named Rules

**The Sentence-Case Masthead Rule.** Marcellus headings are set in sentence case — the engraving reads through the letterforms themselves, not through a text transform. No uppercase display headings, no letterspaced mastheads.

**The Mono Ration.** Monospace appears only for code, data and numerals — code blocks, inline code, addresses, catalog numbers, counts, scores, order numerals. Never for body copy, titles or UI labels.

## Layout

The chart is organized as a centered column with hairline-ruled edges, not a card grid. The wrap is 1160px (24px inline padding, 18px under 640px); narrow reading pages cap at 880px; lesson prose measures at 68ch. Vertical rhythm is generous: 56px between sections, 44–48px around major lesson blocks, 24px inside cards.

The hero is a two-column plate spread (5fr copy / 7fr chart, 48px gap): engraved masthead and serif standfirst left, the night-plate star chart right, an index line of real counts beneath the standfirst. Structural alternatives to card grids are ruled furniture — the ruled-grid (cells separated by interior hairlines inside one outer frame), track rows and case rows (full-width ruled rows with a mono catalog numeral, hairline rules, hover in brass wash), terms-grid and impact-grid (same interior-hairline treatment), and the how-steps strip numbered in upper-roman.

Responsive behavior collapses in three steps: at 1024px multi-column grids drop to two and the hero stacks; at 900px the main nav yields to a menu toggle and row grids stack; at 640px everything goes single-column, star-chart in-chart labels are hidden (the plate caption names the constellations instead) and star touch targets enlarge to r=30. Buttons and full-width actions go 100% on small screens. Known trade-off: the Home page's "Built for understanding" ruled-grid is the one conventional structural move in the system — four equal cells in a framed 2×2; everywhere else the ruled-row treatment carries structure.

## Elevation & Depth

Depth is tonal and engraved, not cast. Surfaces are flat at rest; hierarchy comes from three paper grounds (chart stock, its shade, its deep tone), 1px hairlines, and night plates that sit *apart* rather than *above*. A single soft shadow token exists — `0 1px 2px rgba(30, 42, 56, 0.08), 0 10px 28px rgba(30, 42, 56, 0.1)` — and it appears only when a surface lifts with intent: card hover, the star-chart plate, the search modal. Primary buttons earn a small brass-tinted shadow (`0 6px 18px rgba(138, 99, 24, 0.28)`) on hover. There are no stacked elevation levels and no resting shadows on text containers.

### Shadow Vocabulary

- **Lift shadow** (`var(--shadow)` — `0 1px 2px rgba(30, 42, 56, 0.08), 0 10px 28px rgba(30, 42, 56, 0.1)`): under hover-lifted cards, the starmap plate, and the search modal only.
- **Brass hover shadow** (`0 6px 18px rgba(138, 99, 24, 0.28)`): primary button hover only; a warm echo, not a second elevation level.

### Named Rules

**The Lift-on-Intent Rule.** Surfaces are flat at rest. Elevation appears only as a response to state — a card or row lifts 1–2px with the lift shadow on hover, a button lifts 2px — and returns on release. Depth is never a permanent condition of a surface.

## Shapes

The form language is engraved drafting: soft rectangles with quiet radii, framed by 1px hairlines, punctuated by circles drawn as notation. Radii run in five steps — 4px for kbd caps and inline code, 6px for buttons, inputs, quiz options and small panels, 10px for cards, code blocks, ruled grids and tables, 14px for the starmap plate, exhibit headers and the search modal, and 99px pills for tags, chips, level badges and the meridian track.

Borders are always hairlines (1px, #d9d4c4 or #c0bbaa on paper; #2b4058 on plates) — full frames, never single accent edges. State and identity marks are circles: 18–20px state rings (solid verdigris check when done, dashed hairline ring when open), 11px timeline rings (solid brass border for established facts, dashed hairline for inferred entries), 9px plate-legend dots, 38px hairline medallions around ruled-mark icons. All corners on interactive elements get a 3px focus-ring radius via the global brass `:focus-visible` outline.

## Components

### Buttons

The button is a quiet brass instrument, not a billboard.

- **Shape:** 6px radius, 1px transparent border, 15px/600 system sans, padding 11px 20px (large 14px 26px, small 7px 14px).
- **Primary:** brass fill (#a1761f) with ivory-bright text (#f6f2e6). Hover darkens to brass text-tone (#8a6318), lifts 2px, and gains the brass hover shadow. Disabled drops to 45% opacity with no lift.
- **Ghost:** transparent with hairline-strong border and ink text. Hover turns the border and text brass, lifts 2px.
- **Danger variants:** seal-ochre fill (#a13c2b) with ivory-bright text; danger-ghost is seal text with a 50%-alpha seal border that solidifies on hover.
- **Focus:** 2px brass outline, 2px offset (global `:focus-visible`).
- **Reduced motion:** all button transitions removed.

### Tags / Chips

- **Style:** 99px pill, 1px hairline-strong border, 11px/650 uppercase sans at 0.1em, ink-faint text, chart-stock ground, 3px 10px padding.
- **Variants:** brass (brass text, 45%-alpha brass border), severity ladder (low/medium in ink tones, high in seal ochre, critical inverted — seal fill, ivory-bright text), outcomes (breakthrough in verdigris, failure in seal, contested in brass), and level badges (beginner in brass, intermediate in ink, advanced inverted — night-plate fill with brass-bright text). On plates, tags go transparent with plate-hairline borders and plate-blue text.
- **Chips (filters):** 8px 16px pills at 14px sans; active state fills brass with ivory-bright text; done state takes a verdigris border.

### Cards / Containers

- **Corner Style:** 10px radius (14px for plates and the search modal).
- **Background:** chart stock at rest; chart stock shade for panels (objectives, practice cards, dash hero); night plate for code and exhibit headers.
- **Shadow Strategy:** none at rest; lift shadow on hover only (see Elevation).
- **Border:** 1px hairline, deepening to hairline-strong on hover.
- **Internal Padding:** 24px (cards), 16px 18px (callouts), 26px 28px (ruled cells).
- **Hover (link cards):** lift 2px, hairline-strong border, lift shadow.

### Callouts

Legend panels, not alert boxes: full 1px hairline frame (hairline-strong), chart-stock-shade ground, 10px radius, no colored left-border band. Head row carries a drawn symbol in brass (tip), seal ochre (warning), or verdigris (deep dive) plus a 650-weight title and a right-aligned small-caps kind label. Warning callouts shift the frame to 40%-alpha seal and the ground to 5%-alpha seal wash; the body runs Spectral 15px in ink-soft.

### Night Plates (code blocks, exhibit headers, the star chart)

The plate is the system's study surface: #101d2e ground, 1px plate-hairline frame, 10px (code) or 14px (plate figures) radius.

- **Code block:** plate-2 header strip with mono uppercase language tag and a hairline-bordered copy button (hover turns brass-bright), Spectral 13.5px mono star-ivory code, and an italic serif plate-blue caption beneath a hairline.
- **Exhibit header:** 30px 34px padding, star-ivory Marcellus h1, plate-blue hook, mono brass-bright catalog number above a plate-hairline rule, transparent tags, and a fixed constellation of faint engraved star-points in the upper right corner.
- **Star chart:** 920×560 viewBox; faint graticule (0.5px plate-hairline lines), star-lines that draw in once (700ms per segment, cubic-bezier(0.16, 1, 0.3, 1), staggered), stars at 3.4/4.6 radius in plate blue that fill brass-bright when the lesson is completed, cross-sparkles on first/last stars, sans 13-unit labels in letter-spaced caps. Hovering a constellation dims the others to 28% opacity and gilds the active one's lines, labels and unread stars. In-chart labels never go below 13 SVG units.

### Meridian Progress Bar

A 4px pill-ringed track (transparent fill, 1px hairline-strong border; 6px for the large variant) whose fill is a hatched line, not a solid band: repeating-linear-gradient at -60deg, 5px brass-fill stroke / 3px gap. When a track completes, the hatch switches to verdigris fill. Width animates over 400ms.

### State Marks & Step Checks

State is a line grammar, never hue alone.

- **State mark (lesson rows):** 18px inline SVG — solid verdigris check circle when done, dashed hairline open ring when unread.
- **Step check (practices):** 20px ring, 1.6px hairline-strong border; checked turns the ring solid verdigris with an engraved ivory check drawn in border segments; the label strikes through in hairline with ink-faint text.
- **Timeline rings:** 11px circles — solid 1.6px brass-fill border for established facts; dashed 1.4px hairline border plus an " · inferred" suffix and lighter italic body for varied/inferred reports.
- **Touch targets:** all check rows and quiz options keep a 44px minimum height.

### Navigation

A sticky running head: chart-stock at 90% alpha with a 10px backdrop blur over a hairline bottom border. The wordmark is Marcellus 19px at 0.03em ("Web3" in ink, "Academy" in brass). Nav links are 14px/550 sans in ink-soft with a brass underline that scales in from the left on hover and stays on the active link; hover also lays a brass wash. The search button is a ghost pill with a mono kbd cap; below 900px the nav collapses into a stacked menu.

### Signature Component: the StarMap

The constellation chart is the atlas itself — all 33 real lessons drawn as three constellations on night stock, deterministic geometry, stars in reading order linked to their lessons, completed stars gilded brass-bright. It is the hero's right plate, captioned "The curriculum chart · Plates I–XXXIII" with a completed/unread legend. On small screens the labels leave the chart and the caption names the tracks; the figcaption gives screen readers the full textual map.

## Do's and Don'ts

### Do:

- **Do** keep light chart-paper (#f2f0e8) as the reading ground; reserve night plates (#101d2e) strictly for code blocks, diagrams, exhibit headers and the star chart.
- **Do** keep brass text at #8a6318 on #f2f0e8 — that value passes AA; brass fill (#a1761f) carries ivory-bright (#f6f2e6) text.
- **Do** draw state as line grammar — solid verdigris check = done, dashed open ring = unread, solid brass ring = established fact, dashed ring + " · inferred" suffix = varied report — never color alone.
- **Do** set the star-map labels at no less than 13 SVG units (~9 CSS px at 1440); below that, hide in-chart labels and name constellations in the plate caption.
- **Do** structure surfaces with 1px hairline frames and interior rules; give every interactive element the 2px brass `:focus-visible` ring and 44px tap targets.
- **Do** keep the one authored motion moment (star draw-in + hero rise, cubic-bezier(0.16, 1, 0.3, 1)) and disable all of it under `prefers-reduced-motion`.

### Don't:

- **Don't** use violet or lavender anywhere in the design — it is a hard brand commitment, not a preference.
- **Don't** place an eyebrow/kicker label above a heading; small-caps meta belongs beside or below the title, never above it.
- **Don't** use gradient text, or any neon/terminal glow treatment — the world refuses the neon web3 default.
- **Don't** put colored left-border bands on cards or callouts; callouts speak through a full hairline frame and a drawn symbol.
- **Don't** use monospace for anything but code, data and numerals.
- **Don't** lighten brass text on paper for emphasis; #8a6318 is the floor that passes AA on #f2f0e8.
- **Don't** stack a fifth ink onto a night plate — four inks (star ivory, plate blue, brass bright, one status tone) is the bound.

**Known trade-offs (accepted, not prohibitions):** Marcellus and Spectral load from the Google Fonts CDN with Times New Roman/Georgia serif fallbacks, so first paint may render the fallbacks; the Home page's ruled-grid section is the one conventional structural move in an otherwise ruled-row system. Both are accepted as-is.
