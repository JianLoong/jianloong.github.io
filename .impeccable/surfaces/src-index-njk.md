---
version: 1
slug: "src-index-njk"
primary_target: "src/index.njk"
related_targets: ["src/writing.njk","src/projects.njk","src/about.njk"]
---

# Surface brief: the homepage (`src/index.njk`)

> **BACK-FILL — read this first.** This brief was written *after* the build, not
> before it. The `new-work` flow requires the direction contract to be recorded
> before any code, so the finish review can audit the render against a
> commitment. That did not happen; the deviation was disclosed at the time and
> is recorded here on the author's instruction. The contract below states the
> decision faithfully, but it **did not constrain the build** and must not be
> read as evidence that it did. The seed key is verifiable against
> `.impeccable/questions/roll.json`.

## Direction contract

**THESIS.** The catalogue is plotted, not listed. The homepage refuses the
category default for a personal blog — neutral ground, warm accent, serif
display, entries stacked as equal cards — and replaces it with a measured
field: a ruled coordinate plate, mono annotations, and entries whose marks
carry a quantity read from the content rather than from taste.

**OWN-WORLD.** Cool indigo-black ground (`#0a0d18`; plate `#e2e5e8`), bone ink
(`#e9e7db` / `#14161f`), hairline rules in `--rule`, and a 6rem coordinate grid
one step off the ground. No accent colour: three tints in one magnitude scale —
hot, cool, faint. Spectral sets every sentence; Azeret Mono sets everything the
world measures with. Square everywhere; the only round things are instruments.

**STORY.** A visitor sees a field with a declared scale rather than a list of
cards. They understand the site is a record of measured work — two entries and
six objects, with reading time and star counts shown, not claimed — and they
leave through `/writing/`, `/projects/`, or the hero's three links.

**FIRST VIEWPORT.** The masthead rules the top with mono nav and the theme
toggle. The hero states the site in one sentence at display size, framed by a
lede and three mono links. Then two catalogues, each opening with a legend that
declares its own scale — `2 entries · magnitude = reading time`, then
`6 objects · magnitude = stars` — and each entry carrying a magnitude mark in its
annotation column. Primary action: open an entry.

**FORM.** The star atlas, from the bolder re-roll. Seed key `989d981c`, scope
`direction`, mode `read`, register `bolder`, re-roll 1. The roll assigned
grounded candidate 5 (the drawing sheet); the author re-rolled bolder, which
suspends the assignment and deals foreign forms only, and locked the leading
challenger, `notation-diagram-systems-star-atlas`. Verdicts on the rest: the
lexicon shoulder-and-plate was competitive and donated its guide-words
discipline; the raygun layout desk was declined as the named read-mode failure
(wayfinding deliberately broken); the sticker accretion and the coptic binding
were declined on clarity. Author-pinned: monospace in the frame, which the
read-mode rules translate to chrome, labels and code — never the running text.

**FINISH.** unreviewed and undocumented is unfinished; this build ends with the
finish review, the verdict, DESIGN.md, and every shipping raster carrying its
provenance

**FINISH status: DISCHARGED.** The review has now run, in two rounds, and its verdict is recorded here.

Round one returned `fix` with four material fixes, all of which the build had shipped: theme-color carrying the retired world's ground in `base.njk` and `js/main.js` on every page; `assets/og-image.svg` naming faces deleted in the world swap; a dead `--accent-hover` token; and a third-person `site.json` description against PRODUCT.md's first-person commitment. It also named the mono rule as contradicted by the section heads, which are `h2` in mono.

The batch answered all of it, and round two returned `ship` — scoped to the scored fixes, not to whole-surface approval. That pass also caught the parent over-claiming the carve-out: it had named the `Comments` head as mono-set when the head nests inside the article and correctly renders in Spectral. Corrected in DESIGN.md and the sidecar.

Two things remain unscored for want of an image-capable reader, and are recorded rather than glossed: the recoloured giscus iframe as rendered, and the exact rendered shape of the `Comments` head.

Provenance: `assets/og-image.svg` was the only shipping raster and has been deleted, so no shipping raster remains to carry a prompt. `base.njk` emits no `og:image`; a real social card is authoring work, not a fix, and is not done.

The review itself was substituted and that is disclosed rather than hidden: the shipped `impeccable-finish-reviewer` cannot be spawned in this harness and cannot ingest images, so two fresh read-only readers ran the file-based checks and the parent ran the visual ones. Evidence: eight full-page captures at `.impeccable/review/`.

## Scope

The world's first surface is the homepage. It reaches `/writing/`, `/projects/`
and `/about/` through the shared tokens and the catalogue components. Only the
homepage is a full expression; the other three inherit the ground, type and
magnitude scale rather than composing around it. `/about/` carries the world
through the frame alone by design — it is prose with no field to measure.

One earlier surface was built and then retired: a plotted field on `/about/`
showing repositories per year against employment and study. It was removed
because its only unique content measured volume, which is not the value.
