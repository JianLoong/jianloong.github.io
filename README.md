# Jian Liew — personal blog

Personal blog of Jian Loong Liew — writing on reliability, data, and the small
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
├── src/                   # Eleventy input directory
│   ├── _data/             # global data
│   │   ├── site.json      # site title, author, links, location
│   │   └── projects.json  # project cards shown on the homepage
│   ├── _includes/
│   │   ├── layouts/       # base.njk, page.njk, post.njk
│   │   └── partials/      # header.njk, footer.njk
│   ├── posts/             # blog posts (Markdown) + posts.json
│   ├── index.njk          # home page
│   ├── writing.njk        # all posts
│   ├── about.njk          # about page
│   ├── 404.njk            # not-found page → /404.html
│   ├── feed.njk           # RSS feed → /feed.xml
│   ├── sitemap.njk        # XML sitemap → /sitemap.xml
│   └── robots.njk         # robots.txt
├── css/                   # copied verbatim (style.css, fonts.css)
├── js/main.js             # copied verbatim to _site/
├── assets/                # copied verbatim (fonts/, favicon.svg)
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

## Deployment

`.github/workflows/deploy.yaml` builds the site on every push to `main` (and via
manual dispatch), then publishes `_site/` to GitHub Pages. Work on a branch and
merge to `main` to deploy.
