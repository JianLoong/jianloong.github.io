---
name: Jian
description: An atlas of reliability, data, and small tools.
colors:
  plate: "#e2e5e8"
  plate-raised: "#eef1f3"
  ink: "#14161f"
  ink-soft: "#3a3d4a"
  ink-muted: "#5c6070"
  hairline: "#c3c7cb"
  grid: "#d4d8db"
  star-hot: "#8a4f11"
  star-cool: "#2f6a80"
  star-faint: "#6b4a86"
  mark: "#d8dbdf"
  syntax-comment: "#6b6f80"
  syntax-keyword: "#8a4f11"
  syntax-string: "#2f6a45"
  syntax-function: "#6b4a86"
  syntax-number: "#2f6a80"
  syntax-punctuation: "#62667a"
  sky: "#0a0d18"
  sky-raised: "#121728"
  sky-ink: "#e9e7db"
  sky-ink-soft: "#c3c1b5"
  sky-ink-muted: "#8b8e9c"
  sky-hairline: "#232a42"
  sky-grid: "#1b2138"
  sky-star-hot: "#f0c674"
  sky-star-cool: "#8fb8c9"
  sky-star-faint: "#b892c9"
  sky-mark: "#1a2135"
typography:
  display:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "clamp(2.2rem, 4.5vw, 3.8rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "1.55rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "1.35rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  subhead:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "1.28rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.7
    letterSpacing: "normal"
  body-tight:
    fontFamily: "Spectral, Georgia, 'Times New Roman', serif"
    fontSize: "1.02rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "'Azeret Mono', ui-monospace, Menlo, monospace"
    fontSize: "0.86rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.08em"
  code:
    fontFamily: "'Azeret Mono', ui-monospace, Menlo, monospace"
    fontSize: "0.9rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  pill: "999px"
components:
  theme-toggle:
    backgroundColor: "{colors.plate-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    size: "2.75rem"
  project-card:
    backgroundColor: "{colors.plate-raised}"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    padding: "1.4rem 1.35rem 1.2rem"
  post-card:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    padding: "1.7rem 0"
  skip-link:
    backgroundColor: "{colors.star-hot}"
    textColor: "{colors.plate}"
    rounded: "0"
    padding: "0.6rem 1rem"
  blockquote:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink-soft}"
    rounded: "0"
    padding: "0 0 0 1.2rem"
  code-block:
    backgroundColor: "{colors.mark}"
    textColor: "{colors.ink}"
    typography: "{typography.code}"
    rounded: "0"
    padding: "1.1rem 1.3rem"
  atlas-plot:
    backgroundColor: "{colors.plate}"
    textColor: "{colors.ink-muted}"
    typography: "{typography.label}"
    rounded: "0"
    padding: "2.2rem 0 0"
---

# Design System: Jian

## Overview

**The Atlas.** The site is a plotted field: a ruled coordinate plate, mono annotations that measure it, and a catalogue whose marks are sized by a real quantity rather than decorated.

It replaced a "field manual" world — warm paper, an oxblood accent, and two serifs. That world was competent and generic: cream ground plus high-contrast serif is the single most predictable pairing an interface can reach for. The atlas is the opposite bet: a cool, dark, instrument-like field where the type is a working text face, the chrome is mono, and **colour is data**.

Two rules make the world legible rather than merely dark:

- **The world owns the frame; the column stays calm.** Grid, mono, and plotted marks live in the masthead, the navigation, the legend, and the catalogue. The running prose is a plain column at a plain measure in a reading face. A star atlas that plots behind its own text is a poster, not an atlas.
- **Colour is measurement, not decoration.** There is no accent colour. There is a magnitude scale.

## Colors

Two grounds, because the world has two states: the sky it plots at night, and the plate it prints by day. Neither is a "theme" of the other — both are complete.

### The Sky (dark, the world's native state)
- **Sky** (`#0a0d18`): the ground. A blue-black, not a neutral black — the ink is tinted toward it.
- **Sky Raised** (`#121728`): surfaces that sit on the field — the theme toggle, project cards.
- **Sky Ink** (`#e9e7db`): primary text. A bone white with a faint warm cast, the colour of plotted data rather than of paper.
- **Sky Ink Soft** (`#c3c1b5`): body prose at rest.
- **Sky Ink Muted** (`#8b8e9c`): labels, meta, annotations. Cooler than the ink, because annotations belong to the instrument, not the text.
- **Sky Hairline** (`#232a42`) / **Sky Grid** (`#1b2138`): every rule, and the coordinate plate itself.

### The Plate (light, the printed state)
- **Plate** (`#e2e5e8`), **Plate Raised** (`#eef1f3`), **Ink** (`#14161f`), **Soft Ink** (`#3a3d4a`), **Muted Ink** (`#5c6070`), **Hairline** (`#c3c7cb`), **Grid** (`#d4d8db`).

The plate is the sky inverted, not a sheet of paper: it keeps the sky's cool cast at high lightness. An earlier revision made it a warm bone (`#e9e7de`), which read as cream paper and put the light theme straight back into the pairing this world exists to refuse — warm ground plus serif. The reference it is printing on is a cool chart, not a book.

### The Magnitude Scale
Three tints, and the only colour the system has. They are a scale, not a palette: the same three run hot → cool → faint in both grounds.
- **Star Hot** (`#f0c674` sky / `#8a4f11` plate): the brightest magnitude, and nothing else — the highest-value action on a screen, or a long entry in the catalogue.
- **Star Cool** (`#8fb8c9` / `#2f6a80`): mid magnitude, the default link tint.
- **Star Faint** (`#b892c9` / `#6b4a86`): the faintest, for the shortest or least weighty thing in view.

### Syntax
Six tokens colour fenced code, mapped per theme so a block stays legible on whatever ground it sits. In light mode they resolve against **Mark** (`#d8dbdf`); every pair clears 4.5:1 there, which is why the string green is `#2f6a45` and the comment grey `#6b6f80`.

## Typography

**Spectral** carries the whole page — display and prose at different weights. **Azeret Mono** carries everything the world measures with: navigation, labels, metadata, coordinate annotations, and code.

Both were chosen off the training-data default list (Fraunces, Newsreader, Playfair, Lora, Outfit, IBM Plex and friends), which is the point: the previous world ran two of those faces and read as a template because of it.

**The One Serif Rule.** Spectral is the only reading family, at 400 for prose and 500 for headings. Nothing else sets a sentence. **Azeret Mono never sets running prose or a heading** — it is the instrument's voice, reserved for labels, meta, annotations, and code. A page whose body text is mono is a terminal costume, not an atlas.

**The Measured Voice Rule.** Mono is always uppercase and tracked (`0.08em`–`0.14em`) when it labels, and sentence case when it annotates a value. Uppercase mono is a label; lowercase mono is a reading.

## Layout

One measure, `42rem`, and one page width, `72rem`. The reading column never changes width to fit the frame — extra width goes to the gutters, where the grid and the legend live.

- **The Ruled Plate Rule.** The ground is ruled at a `6rem` module in **Grid**: one hairline off the ground, never an overlay. It reads as plate stock at reading distance and disappears behind the prose.

## Elevation & Depth

The system has **no shadows at all**. Depth is carried entirely by hairlines, the one raised tonal step, and the grid. A shadow in this world would be a foreign object.

## Shapes

Square throughout, with exactly one exception: the magnitude mark is a circle, and the theme toggle is a pill. Both are instruments — a plotted dot and a control — so both are round. Everything structural is square.

## Components

- **Magnitude mark** — the signature. A plotted dot at the head of a catalogue entry whose diameter derives from a **real** quantity (reading minutes), tinted by magnitude class. It is a measurement, not an ornament: it carries `--mag` and `--mag-tint` and nothing else.
- **Atlas legend** — mono, tracked, uppercase, stating real counts of what is in the field. A star atlas always ships one, and it is not decoration: it tells the reader the scale of what they are looking at.
- **Post card / project card** — square, hairline-separated or raised. Card titles are underlined at rest so the affordance survives without hover.
- **Plotted field** — one column per interval, height the count, tint the magnitude class, on a hairline baseline with mono axis labels and a caption carrying the provenance. A histogram drawn in the world's own grammar, used only where a real series exists. That test is the point: `/about/` carries one because its repository history is real and dated, not because a prose page ought to look busier.
- **Code block** — Mark ground, mono type, square. The setting an atlas gives its figures.

## Do's and Don'ts

**Do**
- Keep the prose column plain. The world is the frame.
- Let colour mean something: hot, cool, and faint are a scale, and a fourth tint would break it.
- Set annotations in uppercase tracked mono, and values in sentence-case mono.
- Size the magnitude mark from real content.

**Don't**
- Don't put mono in the running text or a heading, at any size.
- Don't add a shadow, a gradient, or a glow.
- Don't use the three tints decoratively — a tint that does not encode magnitude is noise.
- Don't let the grid compete with the text: if it is visible *while* reading, it is too strong.
- Don't reintroduce a second serif, or a "display face" of any kind. Spectral at 500 is the display voice.
