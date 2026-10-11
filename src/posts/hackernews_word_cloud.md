---
title: A word cloud of Hacker News headlines
description: The front page of Hacker News, turned into a cloud of the words its titles keep repeating. Live, from a read-only mirror of the site.
date: 2019-10-14
category: Data
readingTime: 3
scripts:
  - /js/vendor/d3-cloud-1.2.5.js
  - /js/posts/hackernews_word_cloud.js
---

[Hacker News](https://news.ycombinator.com/) is a list of titles, most of the day. Putting all of them into one picture is a quick way to see what a day was about — which words came up over and over, and which only looked important.

To be fair to the format: a word cloud is not a good representation of occurrence. It has no axis, the areas are not proportional to anything, and "the biggest word" is a claim the picture cannot support precisely. It does look nice, and it does show you the shape of a day in one glance, which is what it is for.

<div class="demo" data-hnwc>
<div class="demo-controls">
<button type="button" data-hnwc-run>Refresh</button>
</div>
<p class="demo-readout" data-hnwc-readout aria-live="polite">Fetching…</p>
<div data-hnwc-cloud></div>
<p class="demo-note">Sizes are a word's share of the most frequent word, not its raw count — the numbers are in the line above. Tint is a band: the ten loudest words take the accent, the next fifteen the cool tint, the rest the faint one. Words are lowercased, stripped of punctuation and digits, single characters dropped, and filtered against the 2019 stop list.</p>
</div>

The titles come from [api.hnpwa.com](https://github.com/davidejones/hnpwa-api), a read-only mirror of the Hacker News API, which answers with a permissive CORS header. The old version of this page asked that mirror for twenty pages of stories; this one asks for eight. It is someone else's service, and three hundred titles show the shape of a day about as well as six hundred do.

## What changed in the port

Nothing about the counting: titles are lowercased, punctuation and digits are stripped, the 2019 stop-word list is applied, and the fifty most frequent words are laid out. What changed is what draws it.

The 2019 version loaded two libraries from two CDNs — all of d3 v3, and `d3.layout.cloud` — and drew with d3-selection, giving every word a colour from a twenty-colour palette. That is now one vendored file of 15 KB (the layout: placing words in a spiral against measured text boxes is not worth writing by hand) and plain SVG that takes the plate's own three tints. The layout waits for the webfont before measuring, or every word would be sized against the wrong metrics.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The 2019 stop list, the fifty-word cut-off and the data source are unchanged; the drawing is now the site's own SVG instead of d3 and a CDN.</p>
