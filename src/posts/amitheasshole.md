---
title: Percentage charts for r/AmItheAsshole
description: The subreddit's five verdicts, counted from the comments it attracted.
date: 2019-10-09
category: Data
readingTime: 3
scripts:
  - /js/posts/reddit-jsonp.js
  - /js/posts/amitheasshole.js
---

[r/AmItheAsshole](https://www.reddit.com/r/AmItheAsshole/) is where people post an argument and ask a jury of strangers to rule on it. Every thread resolves into one of five verdicts, and the votes are written in the replies as four-letter codes, which makes the whole subreddit unusually easy to count.

The subreddit describes itself as:

> A catharsis for the frustrated moral philosopher in all of us, and a place to finally find out if you were wrong in an argument that's been bothering you. Tell us about any non-violent conflict you have experienced; give us both sides of the story, and find out if you're right, or you're the asshole.

| Abbreviation | Meaning             |
| ------------ | ------------------- |
| YTA          | You're the A-hole   |
| NTA          | Not the A-hole      |
| ESH          | Everyone sucks here |
| NAH          | No A-holes here     |
| INFO         | Not Enough Info     |

## The counting

The 2019 version of this page fetched each thread's comments straight from reddit.com as JSON, counted how often each verdict appeared, and drew a percentage bar. It did not use a CORS-enabled fetch: it called `$.getJSON` with `&jsonp=?`, which is a `<script>` tag, and a `<script>` tag is not subject to CORS. This page asks the subreddit for its recent comments the same way, through `js/posts/reddit-jsonp.js`.

Reddit does not always answer, and when it refuses (**403 Blocked**, which is what an unauthenticated client tends to get) the script never loads and the page falls back to what you paste, saying so in the readout.

Everything after the text arrives is the same. Paste a thread's comments below and the page counts them exactly as the 2019 script did: raw occurrences of the five tokens, case sensitively, with no attempt to work out who was replying to whom.

<div class="demo" data-aita>
<label class="demo-field" for="aita-input">Comments to count
<textarea id="aita-input" data-aita-input rows="6">NTA. Your neighbours are the ones in the wrong here.
YTA for how you handled it afterwards, though: you should have called the council.
NTA, and documenting it was the right call.
ESH. You both escalated something small.
INFO: how long has this been going on?
NTA, definitely.</textarea>
</label>
<div class="demo-controls">
<button type="button" data-aita-run>Count</button>
</div>
<p class="demo-readout" data-aita-readout aria-live="polite">Fetching…</p>
<svg data-aita-bar viewBox="0 0 600 24" role="img" aria-label="One bar divided into segments proportional to how many times each of the five verdicts appears."></svg>
<table>
<thead><tr><th></th><th>Verdict</th><th>Count</th><th>Share</th></tr></thead>
<tbody data-aita-legend></tbody>
</table>
<p class="demo-note">Token counting is a crude proxy for a verdict. "NTA" appearing in a reply that says "not NTA" still counts, and someone writing the same verdict three times counts three times, which is why the shares below are indicative rather than a poll.</p>
</div>

<figure>
<img src="/assets/posts/aita-percentages.png" alt="Two charts from 2019, each headed by a post title with a link to the thread. The first is captioned NTA 14, YTA 0, ESH 3, NAH 0, INFO 0, over a bar that is green for NTA and orange for ESH. The second is captioned NTA 20, YTA 1, ESH 0, NAH 4, INFO 0, over green, red and navy segments." width="840" height="674" loading="lazy" decoding="async">
<figcaption>What the 2019 version produced: one bar per thread, segmented by verdict, with the counts underneath. "AITA for reporting my neighbours for repeatedly offleashing their dog" came back 14 NTA against 3 ESH; the baby-name thread, 20 NTA, 1 YTA and 4 NAH.</figcaption>
</figure>

The interesting thing in both of those is how much of the verdict is in the disagreement. The dog thread had three people saying everyone sucked, and the baby thread had four saying nobody did; the subreddit is less decisive than its name suggests.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The counting and the chart are unchanged. The demo asks reddit.com for the subreddit's recent comments through the same JSONP script tag the 2019 version used; pasted text is the fallback for when Reddit will not answer.</p>
