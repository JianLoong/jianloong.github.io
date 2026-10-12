---
title: Scoring a thread's sentiment with AFINN
description: AFINN rates 2,477 words from -5 to +5, which is enough to tell a positive comment from a negative one — with no model and no context.
date: 2019-10-13
category: Data
readingTime: 4
scripts:
  - /js/vendor/afinn-111.js
  - /js/posts/reddit-jsonp.js
  - /js/posts/hk.js
---

AFINN is a list of words rated for valence with an integer between -5 and +5. That is the whole method: look up each word, add the numbers up, and read the sign. No training, no weights, no context — which makes it fast, offline and completely inspectable, and also means it cannot tell irony from enthusiasm.

This approach is naive on purpose. It does not build a model to work out what a word is doing in a sentence, so "not good" scores as positive because *good* is positive and *not* is not in the lexicon. A comment full of jargon the lexicon never saw scores zero, and zero is reported as neutral rather than unknown.

The 2019 version of this page ran it over r/HongKong: the front page, then every comment in every thread, classifying each comment by the sign of its total and drawing one percentage bar per thread. It did not use a CORS-enabled fetch — it called `$.getJSON` with `&jsonp=?`, which is a `<script>` tag, and a `<script>` tag is not subject to CORS. This page asks the subreddit for its recent comments the same way, through `js/posts/reddit-jsonp.js`: one comment per line, each scored on its own.

Reddit does not always answer, and when it refuses — **403 Blocked**, which is what an unauthenticated client tends to get — the script never loads and the page falls back to what you paste, saying so in the readout.

<div class="demo" data-hk>
<label class="demo-field" for="hk-input">Comments, one per line
<textarea id="hk-input" data-hk-input rows="6">this is a good demonstration of a naive method
the lexicon is simple and easy to read
terrible results, but that is exactly what I expected
nothing in this line carries any charge at all
I am not sure this works well</textarea>
</label>
<div class="demo-controls">
<button type="button" data-hk-run>Score</button>
</div>
<p class="demo-readout" data-hk-readout aria-live="polite">Scoring…</p>
<svg data-hk-bar viewBox="0 0 600 24" role="img" aria-label="One bar divided into the share of comments that scored positive, negative and neutral."></svg>
<table>
<thead><tr><th></th><th>Band</th><th>Comments</th><th>Share</th></tr></thead>
<tbody data-hk-legend></tbody>
</table>
<p class="demo-charges" data-hk-charges></p>
<p class="demo-note">The chips are the lexicon's own entries that fired, strongest first — the reason a comment scored what it did. A word the lexicon does not know contributes nothing, so a thread written entirely in unfamiliar vocabulary reads as neutral rather than as missing.</p>
</div>

## The lexicon is the model

The nice property of this approach is that a wrong answer is explainable. If a comment scores +3, you can point at the two words that did it. That is not true of a trained classifier, where the wrong answer is a number you cannot argue with.

The 2019 script declared a stop-word list and then never used it — the array is in the post's original code and nothing reads it. It did not matter, because AFINN scores a stop word as zero anyway, which is the same contribution as not being in the lexicon at all. Dead code that happens to be harmless is still worth deleting, which is what the port did.

The most useful thing I took from this is how much of a sentiment result is the lexicon's coverage rather than the algorithm's quality. The chart says what proportion of comments were positive, negative or neutral; it does not say how many comments were actually understood.

## References

1. [AFINN](https://github.com/fnielsen/afinn) — the lexicon, by Finn Årup Nielsen, Apache License 2.0. The file vendored here is the 2,477-word AFINN-111 list.
2. [AFINN Sentiment Analysis](https://darenr.github.io/afinn/) — the 2019 reference, which called this list "AFINN-en-165".

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The lexicon, the scoring and the three-way classification are unchanged. The demo asks reddit.com for r/HongKong's recent comments through the same JSONP script tag the 2019 version used; pasted comments are the fallback for when Reddit will not answer.</p>
