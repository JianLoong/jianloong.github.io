---
title: Turning a subreddit's titles into a word cloud
description: The same layout the Hacker News cloud uses, fed by text you paste — because Reddit stopped serving its own.
date: 2019-10-12
category: Data
readingTime: 4
scripts:
  - /js/vendor/d3-cloud-1.2.5.js
  - /js/posts/reddit_word_cloud.js
---

r/programming is a list of titles, and titles are repetitive. Pull a thousand of them together and the day's obsessions show up as the biggest words on the page — the language a community uses about itself, counted without asking anyone.

A word cloud is not a good representation of occurrence: no axis, areas that are not proportional to anything, and a "biggest word" claim the picture cannot support. It does look nice, and it does show the shape of a day at a glance, which is what it is for. The Hacker News cloud on this site is [the same machine with a live feed](/posts/hackernews_word_cloud/); this one takes what you paste.

## Why you paste the text

The 2019 version fetched `https://reddit.com/r/programming.json?limit=1000` in the browser and counted the titles it got back. Reddit's public `.json` endpoints now answer **403 Blocked**, with no CORS header — so a static page cannot read them, and neither can I. The fetch is gone, and everything after it is the same: same stop list, same tokenising, same fifty words.

<div class="demo" data-rwc>
<label class="demo-field" for="rwc-input">Text to cloud
<textarea id="rwc-input" data-rwc-input rows="6">r/programming is a list of titles, and titles are repetitive. Pull a thousand of them together and the day's obsessions show up as the biggest words on the page. A word cloud is not a good representation of occurrence, and it does look nice.</textarea>
</label>
<div class="demo-controls">
<button type="button" data-rwc-run>Draw</button>
</div>
<p class="demo-readout" data-rwc-readout aria-live="polite">Drawing…</p>
<div data-rwc-cloud></div>
<p class="demo-note">Pre-filled with this page's own opening, which is a thin sample — a few hundred titles is where the picture gets interesting. Words are lowercased, punctuation and digits stripped, single characters dropped, the rest filtered against the 2019 stop list. Tint is a band: the ten loudest take the accent, the next fifteen the cool tint, the rest the faint one.</p>
</div>

## What the code does

Two steps: count, then lay out. The counting is where the judgement is — what counts as a word, and what is noise.

```javascript
function tokenise(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")    // punctuation out
    .replace(/\d+/g, " ")        // digits out
    .split(/\s+/)
    .filter(function (word) {
      return word.length > 1 && STOP_WORDS.indexOf(word) === -1;
    });
}
```

Then the fifty most frequent words go to the layout, which places each one in a spiral until it finds somewhere it does not collide with the words already placed. That part is not worth writing by hand, so it is vendored: [d3-cloud](https://github.com/jasondavies/d3-cloud), 15 KB, BSD-3-Clause, and the only reason the 2019 post needed all of d3 v3 from a CDN.

Sizes are each word's share of the loudest word, mapped onto 16–76px. The layout waits for the webfont before measuring, or every word would be sized against the wrong metrics and the cloud would come out wrong in a way that is hard to notice.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The 2019 stop list and the fifty-word cut-off are unchanged; the demo used to fetch titles from reddit.com and now takes pasted text, because those endpoints stopped answering.</p>
