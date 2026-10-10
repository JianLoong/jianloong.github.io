# Jian — personal blog

Personal blog of Jian — writing on reliability, data, and the small
open-source tools I keep building. Static site generated with
[Eleventy](https://www.11ty.dev/) and published to GitHub Pages.

## Tech stack

- **[Eleventy](https://www.11ty.dev/) 3** — static site generator
- **Nunjucks** (`.njk`) templates, **Markdown** for posts
- Hand-written **CSS** (`css/style.css`) and a little vanilla **JS**
  (`js/main.js` — theme toggle + reading-progress bar)
- Deployed with **GitHub Actions** to **GitHub Pages**

## Requirements

- Node.js 22 (matches CI)

## Getting started

```bash
npm install
npm start        # dev server with live reload → http://localhost:8000
npm run build    # one-off build → _site/
```

| Script | Description |
| --- | --- |
| `npm start` / `npm run dev` | Eleventy dev server on port 8000 with live reload |
| `npm run build` | Build the static site into `_site/` |

## Project structure

```
.
├── eleventy.config.js     # dirs, passthrough copies, collections, filters
├── package.json
├── PRODUCT.md             # product record: audience, purpose, constraints
├── DESIGN.md              # design system: tokens and the eight type roles
├── .impeccable/           # design tooling state (see .gitignore for what is ephemeral)
├── src/                   # Eleventy input directory
│   ├── _data/             # global data
│   │   ├── site.json      # site title, author, social links
│   │   ├── projects.json  # project cards, shown on the homepage and /projects/
│   │   └── giscus.js      # comment settings (repo/category IDs, theme)
│   ├── _includes/
│   │   ├── layouts/       # base.njk, page.njk, post.njk
│   │   └── partials/      # header.njk, footer.njk, comments.njk
│   ├── posts/             # blog posts (Markdown) + posts.json
│   ├── index.njk          # home page
│   ├── writing.njk        # all posts
│   ├── projects.njk       # all projects
│   ├── about.njk          # about page
│   ├── 404.njk            # not-found page → /404.html
│   ├── feed.njk           # RSS feed → /feed.xml
│   ├── sitemap.njk        # XML sitemap → /sitemap.xml
│   └── robots.njk         # robots.txt
├── css/                   # copied verbatim (style.css, fonts.css, giscus themes)
├── js/main.js             # copied verbatim to _site/
├── assets/                # copied verbatim (fonts/, favicon.svg, og-image.svg)
└── _site/                 # build output (gitignored)
```

## Writing a post

Add a Markdown file under `src/posts/`:

```md
---
title: My post title
description: One-line summary shown in lists and meta tags.
date: 2025-01-01
category: Tools
readingTime: 5
---

Body in Markdown…
```

`src/posts/posts.json` is a directory data file that automatically applies the
post layout, the `post` tag, and a `/posts/<slug>/` permalink — you don't set
those per post.

## Configuration

- **`eleventy.config.js`** — input `src`, output `_site`; `css`, `js` and
  `assets` are passthrough-copied; the `posts` collection is sorted newest-first;
  the `dateFormat`, `limit`, `rfc822`, `isoDate` and `json` filters are registered.
- **`src/_data/site.json`** — site title/author/description and the social links
  used in the header, footer and About page.
- **`src/_data/projects.json`** — the project cards rendered on the homepage.

## Comments

Post pages carry a [giscus](https://giscus.app) comment thread, backed by GitHub
Discussions on this repository — there is no database and no third-party comment
host. Commenting requires a GitHub account.

The embed is configured in **`src/_data/giscus.js`** and is already set up for
this repository: the giscus app is installed, and threads go to the
**Announcements** category (`DIC_kwDOAc-pH84CsTjN`). It only renders once both
`repoId` and `categoryId` are set, so an unconfigured clone still builds and
renders cleanly — and in that state `npm start` shows a reminder in place of the
thread.

To re-derive the IDs (e.g. after moving to a new repository):

1. Enable Discussions (Settings → General → Features → Discussions).
2. Install the [giscus app](https://github.com/apps/giscus) on the repository.
3. `repoId` is the repository's `node_id` from
   `https://api.github.com/repos/OWNER/REPO`. The category IDs come from
   `https://api.github.com/repos/OWNER/REPO/discussions`, where each discussion
   carries its `category.node_id` (or use <https://giscus.app>).

`js/main.js` builds the embed lazily (`data-loading="lazy"`) and keeps it in step
with the light/dark toggle, using the palette-matched themes in
`css/giscus-light.css` and `css/giscus-dark.css`.

## Deployment

`.github/workflows/deploy.yaml` builds the site on every push to `main` (and via
manual dispatch), then publishes `_site/` to GitHub Pages. Work on a branch and
merge to `main` to deploy.
