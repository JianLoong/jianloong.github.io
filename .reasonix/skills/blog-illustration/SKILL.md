---
name: blog-illustration
description: Draw post illustrations of this blog's hooded character — the canon reference, the palette, and the command.
---

# Blog illustration — the hooded figure

Every generated image on this blog is one character: a small figure in a hooded top, hood up, drawn in loose ink. It has **no face and no hands**.

That is not only a style choice. The face and the hands are the two things image models drift on most between generations, so removing them is what makes the character reproducible from post to post. It is also the reason the figure reads as *anyone* rather than as a specific person.

## The canon

`assets/hero/character-canon.jpg` is the reference and is committed. **Always** pass it, or the character changes:

```bash
npm run hero -- --out assets/hero/<name>.jpg --prompt-file tools/<name>.prompt.txt \
  --reference assets/hero/character-canon.jpg --size 1K
```

## House style

- Loose pen-and-ink line. Confident but slightly wobbly bone white (`#e9e7db`), visible line-weight variation, the occasional doubled stroke where the pen went round twice.
- Flat dark blue-black ground (`#0a0d18`) — the same value as the site's sky, so a hero has no seam against the page.
- Warm amber (`#f0c674`) and pale blue (`#8fb8c9`) appear **only as small filled dots**. Colour on this site is measurement rather than decoration; those are the magnitude colours, so they mean something.
- **No text, ever.** No labels, captions, numbers, speech bubbles, logos or signatures. Image models garble lettering, and a garbled word is worse than no word. If a label is needed, the diagram should be inline SVG instead.
- No shading, no gradients, no cross-hatching, no large colour fills.

## Rules that are not negotiable

- `response_format.mime_type` accepts **`image/jpeg` only**; `image/png` returns HTTP 400.
- Always `--size 1K`. That is 1376×768 at roughly 150–460 KB. `2K` is 2752×1536 at ~1.8 MB, far too heavy for a static page.
- The key is `GEMINI_API_KEY`, read from the gitignored `.env`. Never print it, never commit it, never paste it into a conversation — session transcripts are written to disk.
- These are rasters, so they do **not** follow the light/dark toggle. The figures inside posts stay inline SVG for exactly that reason; only heroes and unlabelled section breaks are generated.

## Where things live

- `tools/hero-image.mjs` — the generator, run as `npm run hero`. Supports `--out`, `--prompt`, `--prompt-file`, `--reference` (repeatable), `--aspect`, `--size`, `--model`.
- `tools/character.prompt.txt` — the canon prompt.
- `tools/hero-image.prompt.txt`, `tools/decoration-*.prompt.txt` — one prompt file per image, so an image can be regenerated or adjusted deliberately rather than by luck.
- `assets/hero/` — the images, and the canon.
- On the site: frontmatter `hero:` and `heroAlt:`; `src/_includes/layouts/post.njk` renders it above `.article-meta`; `css/style.css` gives it a `1px solid var(--rule)` hairline and no radius — this world only rounds pills.

## Changing the character

Edit `tools/character.prompt.txt`, regenerate `assets/hero/character-canon.jpg`, then regenerate **every** image that used the old canon. Otherwise the posts carry two versions of the same figure and the motif stops reading as one character.

## Traps

- A frontmatter value containing a colon must be quoted or Eleventy fails inside `parseMatter`. The error is a gray-matter stack trace, not a clear message.
- Reference images travel inline as base64, so they must be `.jpg`, `.png` or `.webp`.
- An unquoted description with a comma is fine; a colon is not.
