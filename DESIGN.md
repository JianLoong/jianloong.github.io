---
name: Jian
description: A field manual for reliability, data, and small tools.
colors:
  paper: "#f4efe6"
  paper-raised: "#fbf8f2"
  ink: "#1c1915"
  ink-soft: "#3f3a34"
  ink-muted: "#6f675d"
  hairline: "#d8cfc2"
  oxblood: "#8c3b28"
  oxblood-deep: "#6e2d1e"
  mark: "#ead9c4"
  syntax-comment: "#7a7264"
  syntax-keyword: "#8c3b28"
  syntax-string: "#3b6449"
  syntax-function: "#4a4a8c"
  syntax-number: "#a3542c"
  syntax-punctuation: "#6f675d"
  night-ground: "#161311"
  night-raised: "#1e1a17"
  night-ink: "#efe8dc"
  night-ink-soft: "#d5cdc1"
  night-ink-muted: "#a39788"
  night-hairline: "#3a342e"
  night-oxblood: "#d08064"
  night-mark: "#3a2b22"
typography:
  display:
    fontFamily: "Newsreader, 'Iowan Old Style', Georgia, serif"
    fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Newsreader, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.55rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Newsreader, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  subhead:
    fontFamily: "Newsreader, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.28rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Newsreader, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-tight:
    fontFamily: "Newsreader, 'Iowan Old Style', Georgia, serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "Outfit, 'Helvetica Neue', sans-serif"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  code:
    fontFamily: "'IBM Plex Mono', ui-monospace, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  pill: "999px"
components:
  theme-toggle:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "2.1rem"
  project-card:
    backgroundColor: "{colors.paper-raised}"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    padding: "1.4rem 1.35rem 1.2rem"
  post-card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    padding: "1.7rem 0"
  skip-link:
    backgroundColor: "{colors.oxblood}"
    textColor: "{colors.paper}"
    rounded: "0"
    padding: "0.6rem 1rem"
  blockquote:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    padding: "0 0 0 1.2rem"
  code-block:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "0"
    padding: "1.1rem 1.3rem"
---

# Design System: Jian

## Overview

**Creative North Star: "The Field Manual"**

A field manual is written to be used, not admired. It is plain, it is durable, and it assumes you will come back to it holding a problem. This system is built the same way: a warm paper ground, a single oxblood ink for anything that matters, hairline rules doing the structural work that other systems delegate to shadows and cards.

The layout is deliberately narrow and columnar. Body text is set at `--measure` (42rem, roughly 65–75 characters) and the page never exceeds `--page` (72rem), so the reading experience stays the same whether you arrive on a laptop or a phone. Density is honest: no card corners, no elevation, no ornament that would have to be maintained.

The voice is utilitarian and terse. Headings state what they are, meta lines are uppercase labels rather than prose, and decoration is absent by policy. Warmth comes from exactly two places — the paper tone and the serif — and nowhere else.

**Key Characteristics:**
- Warm paper ground with a single oxblood accent; no secondary or tertiary hues
- Square corners everywhere, with exactly one pill (the theme toggle)
- Structure carried by 1px hairlines, never by shadow
- A serif/sans/mono split with one job per face, and one serif doing both display and prose at different weights
- Restrained but warm: the material does the personality work, the shapes stay plain

## Colors

Two inks and a paper. Almost nothing else.

### Primary
- **Oxblood** (`#8c3b28`): the single accent. Links, the reading-progress bar, list markers, blockquote rules, the "Skip to content" ground, and the `h3` of any card under hover. If something must draw the eye, it is this colour or it is nothing.
- **Oxblood Deep** (`#6e2d1e`): the pressed state for oxblood. Used for accent hover only.

### Neutral
- **Warm Paper** (`#f4efe6`): the page ground, and the text colour on any oxblood surface.
- **Raised Paper** (`#fbf8f2`): surfaces that sit *on* the page — the theme toggle, the project cards. The only tonal step in the system.
- **Ink** (`#1c1915`): primary text. Never pure black.
- **Ink Soft** (`#3f3a34`): body prose at rest — descriptions, list items, the article deck.
- **Ink Muted** (`#6f675d`): labels, meta lines, timestamps, footer. Explicitly secondary.
- **Hairline** (`#d8cfc2`): every border, rule, and divider in the system.
- **Mark** (`#ead9c4`): the ground behind inline code and code blocks.

### Syntax
Six tokens colour code inside fenced blocks, mapped separately per theme so a block stays legible on whatever ground it sits. In light mode they resolve against **Mark** (`#ead9c4`), and every pair has to clear 4.5:1 — which is why the string green is `#3b6449` rather than a lighter, prettier green.

- **Syntax Comment** (`#7a7264`), italic: comments, prolog, doctype.
- **Syntax Keyword** (`#8c3b28`): keywords, booleans, tags, selectors, properties. Deliberately the same oxblood as the accent, so code agrees with the page around it.
- **Syntax String** (`#3b6449`): strings, chars, attribute values.
- **Syntax Function** (`#4a4a8c`): function, class and builtin names.
- **Syntax Number** (`#a3542c`): numbers, constants, symbols.
- **Syntax Punctuation** (`#6f675d`): punctuation and operators.

**The One Ink Rule.** There is exactly one accent hue. Oxblood appears on well under 10% of any screen; its scarcity is what makes it read as emphasis. A second accent hue is a redesign, not an addition.

**The Tinted Ink Rule.** Text is never pure black or pure grey. Every ink is warmed toward the paper (`#1c1915`, not `#000`), so type sits *on* the ground rather than being cut out of it.

## Typography

**Display Font:** Newsreader at 500 (with Iowan Old Style, Georgia)
**Body Font:** Newsreader at 400 (with Iowan Old Style, Georgia)
**Label Font:** Outfit (with Helvetica Neue)
**Mono Font:** IBM Plex Mono

**Character:** One serif doing two jobs, separated by weight and size rather than by a second family — Newsreader at 500 for anything structural, Newsreader at 400 for prose that has to be read at length. Outfit handles all interface and meta text in uppercase, and IBM Plex Mono is confined to code. The palette of faces is deliberately narrow: no second display face, no italic variants beyond what prose needs.

### Hierarchy
Eight roles, each with a job no other role can do.

- **Display** (500, `clamp(2.2rem, 4.5vw, 3.8rem)`, 1.08, −0.035em): every `h1` — index pages, articles, the About page, the homepage hero. One clamp site-wide; the tight tracking is what makes it read as a masthead rather than a heading.
- **Headline** (500, 1.55rem, 1.2, −0.02em): article `h2` and post-card titles.
- **Title** (500, 1.35rem, 1.25, −0.02em): project-card titles.
- **Subhead** (400, 1.28rem, 1.5): the homepage lede and the article deck. Larger than prose, lighter than a heading — it introduces without competing.
- **Body** (400, 1.125rem, 1.7): all article prose, held to `--measure` (42rem) for 65–75 characters.
- **Body Tight** (400, 1.02rem, 1.5): card descriptions, where scanning beats reading and the column is narrower.
- **Label** (400, 0.86rem, `letter-spacing` 0.04–0.22em, uppercase): nav, metadata lines, section heads, footer. Size stays one step and tracking carries all the variation — uppercase and tracked is the system's only decorative move.
- **Code** (400, 0.9rem, 1.6): fenced code. Inline code is deliberately relative (`0.88em`) so it tracks the prose it sits in.

**The One Serif Rule.** Newsreader carries the whole page. Weight and size do the separating — 500 for structural headings, 400 for prose. Reaching for a second serif to manufacture that contrast is the failure this rule exists to prevent.

**The Uppercase Means Label Rule.** Uppercase plus letter-spacing marks something as metadata, never as content. If a line is meant to be read as a sentence, it does not get tracked caps.

## Layout

A single column at `--measure` (42rem), inside a container at `--page` (72rem), centred, with 2.5rem gutters narrowing to 1.5rem below 560px. The homepage and index pages use a full-width hero above the column.

Spacing is generous and vertical: sections are separated by 3.5–5rem, blocks within a section by 1.2–1.7rem. Grids collapse at **820px** (`post-card` and `project-grid` both go single-column) and the container tightens at **560px**.

The `post-card` is a 8.5rem / 1fr grid — a fixed meta column beside a fluid body — which is the system's only asymmetric layout.

## Elevation & Depth

**This system is flat. There are no shadows, and that is the design, not an omission.** Depth is expressed entirely through 1px `--hairline` rules and exactly one tonal step (`--paper-raised` against `--paper`). A shadow token was once defined in both themes and is now unused; it was removed from this document rather than recorded, because nothing in the interface consumes it.

**The Hairline Rule.** Separation is drawn, never cast. If two things need to be told apart, they get a 1px border or a background step — not a shadow, not a glow, not a gradient.

## Shapes

Square. Every container, card, code block, input and image is `border-radius: 0`. The single exception is the theme-toggle button at `999px`, which reads as a control rather than a surface.

Borders are always 1px and always `--hairline`, except the blockquote which carries a 2px `--oxblood` left edge, and the reading-progress bar at 3px. Form language is rectilinear and orthogonal: no clipping, no rotation, no overlapping surfaces.

## Components

### Theme toggle
- **Shape:** pill (`999px`) — the one rounded thing in the system, because it is a control
- **Colour:** `--paper-raised` ground, `--ink` icon, `--hairline` border
- **Size:** 2.1rem square, centred glyph
- **State:** no hover treatment; it is a switch, not a link

### Post card
- **Shape:** square, no border on the sides — top and bottom rules only
- **Layout:** 8.5rem meta column, 1fr body
- **Colour:** `--ink-soft` body, `--ink-muted` meta
- **Hover:** the `h3` turns `--oxblood`; nothing else moves. No lift, no underline, no background.

### Project card
- **Shape:** 1px `--hairline` border, square corners, `min-height: 11rem`
- **Colour:** `--paper-raised` ground, `--ink-soft` body, `--ink-muted` meta
- **Padding:** 1.4rem / 1.35rem / 1.2rem
- **Hover:** the `h3` turns `--oxblood`, matching post cards

### Navigation
- **Style:** uppercase Outfit, 0.86rem, `letter-spacing: 0.08em`, `--ink-muted` at rest
- **Active / hover:** `--ink`, not `--oxblood` — nav is chrome and stays out of the accent's way

### Skip link
- **Style:** oxblood ground with paper text, parked off-canvas until focused
- **Note:** this is the only solid oxblood surface in the interface

### Code
- **Inline:** IBM Plex Mono at 0.88em on `--mark`, near-square padding
- **Block:** IBM Plex Mono at 0.9rem on `--mark`, 1.1rem/1.3rem padding, horizontal scroll rather than wrapping
- **Syntax:** six `--code-*` tokens, mapped per theme. Comments are italic.

## Do's and Don'ts

### Do:
- **Do** hold prose to `--measure` (42rem) — the reading column is the product.
- **Do** reach for a 1px `--hairline` when two things need separating.
- **Do** keep oxblood scarce; it is the only emphasis the system has.
- **Do** set interface and meta text in uppercase Outfit with letter-spacing.
- **Do** keep corners square. The theme toggle is the single sanctioned exception.
- **Do** check both themes — every token has a night counterpart, and the accent warms from `#8c3b28` to `#d08064`.

### Don't:
- **Don't** add a second accent hue, a gradient, or a glow.
- **Don't** introduce shadows or elevation. Separation is drawn, never cast.
- **Don't** use pure black or pure grey; every ink is warmed toward the paper.
- **Don't** put text on a coloured ground unless it is `--paper` on `--oxblood` (the skip link is the only precedent, and it measures 7:1).
- **Don't** set content in tracked uppercase — that treatment means "this is a label".
- **Don't** set body prose above weight 400; weight is how display is separated from reading.
- **Don't** introduce a second serif to create display contrast.
