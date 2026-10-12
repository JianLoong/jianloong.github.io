---
title: Turning a subreddit's titles into a word cloud
description: The same layout the Hacker News cloud uses, fed by r/programming when Reddit answers and by text you paste when it does not.
date: 2019-10-12
category: Data
readingTime: 4
scripts:
  - /js/vendor/d3-cloud-1.2.5.js
  - /js/posts/reddit-jsonp.js
  - /js/posts/reddit_word_cloud.js
---

r/programming is a list of titles, and titles are repetitive. Pull a thousand of them together and the day's obsessions show up as the biggest words on the page — the language a community uses about itself, counted without asking anyone.

A word cloud is not a good representation of occurrence: no axis, areas that are not proportional to anything, and a "biggest word" claim the picture cannot support. It does look nice, and it does show the shape of a day at a glance, which is what it is for. The Hacker News cloud on this site is [the same machine with a live feed](/posts/hackernews_word_cloud/); this one asks Reddit for the same kind of feed, and falls back to what you paste when Reddit will not answer.

## Where the titles come from

The 2019 version asked reddit.com for a thousand titles and counted them. It never used a CORS-enabled fetch: it called `$.getJSON` on `https://reddit.com/r/programming.json?limit=1000&jsonp=?`, which loads a `<script>` tag, and a `<script>` tag is not subject to CORS. This page does the same thing first — `js/posts/reddit-jsonp.js` is that trick in about thirty lines of plain JavaScript, with no jQuery.

What it cannot count on is Reddit answering. The endpoint sends no CORS header at all, so a `fetch()` from another origin is out to begin with, and Reddit's edge answers **403 Blocked** to a request from a client it does not like — one with no session, or one it takes for a robot. When that happens the script never loads, the callback never fires, and the page falls back to what you paste, saying so when it does. Both paths end in the same code: same stop list, same tokenising, same fifty words.

<div class="demo" data-rwc>
<label class="demo-field" for="rwc-input">Text to cloud
<textarea id="rwc-input" data-rwc-input rows="6">r/programming is a list of titles, and titles are repetitive. Pull a thousand of them together and the day's obsessions show up as the biggest words on the page. A word cloud is not a good representation of occurrence, and it does look nice.</textarea>
</label>
<div class="demo-controls">
<button type="button" data-rwc-run>Draw</button>
</div>
<p class="demo-readout" data-rwc-readout aria-live="polite">Fetching…</p>
<div data-rwc-cloud></div>
<p class="demo-note">The page asks r/programming for a thousand titles on load, the way the 2019 version did, and fills the box with them when Reddit answers. When it does not, the box keeps this page's own opening, which is a thin sample — a few hundred titles is where the picture gets interesting. Either way the words are lowercased, punctuation and digits stripped, single characters dropped, the rest filtered against the 2019 stop list. Tint is a band: the ten loudest take the accent, the next fifteen the cool tint, the rest the faint one.</p>
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

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The 2019 stop list and the fifty-word cut-off are unchanged. The demo still asks reddit.com for the titles, through the same JSONP script tag the 2019 version used; pasted text is the fallback for when Reddit will not answer.</p>
