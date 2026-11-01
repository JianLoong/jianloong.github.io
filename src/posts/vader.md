---
title: Scoring sentiment in the browser
description: VADER is a lexicon and a set of rules for reading tone, and it fits in a worker. Paste a paragraph and get four numbers back.
date: 2022-10-20
category: Data
readingTime: 3
scripts:
  - /js/posts/vader.js
---

VADER (Valence Aware Dictionary and sEntiment Reasoner) describes itself as "a lexicon and rule-based sentiment analysis tool that is specifically attuned to sentiments expressed in social media." That description is doing real work: it is a dictionary and a rulebook, not a trained model. No training run, no weights to download, no network call. The whole thing is a file.

<div class="demo" data-vader>
<label class="demo-field" for="vader-input">Text to analyse
<textarea id="vader-input" data-vader-input rows="6">Sentiment analysis studies the subjective information in an expression, that is, the opinions, appraisals, emotions, or attitudes towards a topic, person or entity. Expressions can be classified as positive, negative, or neutral. For example: I really like the new design of your website!</textarea>
</label>
<div class="demo-controls">
<button type="button" data-vader-run>Run</button>
</div>
<p class="demo-readout" data-vader-readout aria-live="polite">Loading the demo…</p>
<svg data-vader-bar viewBox="0 0 600 46" role="img" aria-label="A polarity bar running from minus one on the left to plus one on the right, filled from the middle in the direction of the compound score."></svg>
<table>
<thead><tr><th>Negative</th><th>Neutral</th><th>Positive</th><th>Compound</th></tr></thead>
<tbody><tr><td data-vader-neg>&nbsp;</td><td data-vader-neu>&nbsp;</td><td data-vader-pos>&nbsp;</td><td data-vader-compound>&nbsp;</td></tr></tbody>
</table>
<p class="demo-note">Three of the four numbers are proportions, so they add up to one. Compound is the one to read: it folds them into a single score from -1 to 1, and VADER's own line between neutral and not is ±0.05. The port is 8,000 lines and the lexicon is most of it, so it runs in a worker rather than on the page.</p>
</div>

## What the numbers mean

- **Negative, neutral and positive** are fractions of the text that carry each charge. They sum to one, so they describe the mix rather than the tone.
- **Compound** is the summary: the same judgement normalised onto -1 to 1. A paragraph that is half positive and half neutral lands near zero not because it is balanced, but because the positive half is diluted by the half with no opinion.

The rules are where VADER earns its keep over a bare word list. All-caps counts for more than lowercase. Exclamation marks amplify. "Very" and "barely" move the score by different amounts. Negation flips the word after it, and a "but" clause weights what follows it over what came before, which is why "the food was great but the service was awful" lands negative.

## Where it works, and where it does not

It was built for short, informal text: tweets, reviews, comments. That is exactly why it suits the Reddit work: [the sentiment analysis project](https://github.com/JianLoong/sentimentanalysis) bundles it alongside AFINN, NRC, Bing and Loughran-McDonald so the same text can be scored five ways, and [the r/AmItheAsshole crawler](https://github.com/JianLoong/reddit-store) is where that gets pointed at something real.

What it cannot do is sarcasm: the words are positive and the meaning is not, and no lexicon will tell you that. Mixed feelings in one clause, or vocabulary from a domain the lexicon never saw, produce confident nonsense. The value of the approach is that a wrong answer is inspectable (you can find the words that caused it), which a model's wrong answer generally is not.

<figure>
<img src="/assets/posts/vader-scores.png" alt="The 2022 version of this demo: the same paragraph in a text area, a Run button, and a results table reading Negative 0.076, Positive 0.138 and Compound 0.4561." width="903" height="670" loading="lazy" decoding="async">
<figcaption>The 2022 port, as it looked then: the same paragraph, scored 0.076 negative, 0.138 positive, compound 0.4561. The paragraph is mostly neutral, which is why a clearly positive closing sentence still lands as a mild positive.</figcaption>
</figure>

## References

1. [cjhutto/vaderSentiment](https://github.com/cjhutto/vaderSentiment): the original Python implementation and the lexicon.
2. Hutto, C.J. & Gilbert, E.E. (2014). *VADER: A Parsimonious Rule-based Model for Sentiment Analysis of Social Media Text.* Eighth International Conference on Weblogs and Social Media (ICWSM-14). Ann Arbor, MI, June 2014.

## Bye.

<p class="colophon">Written in 2022, ported from the old Hugo site and lightly edited. The analysis is the same Comcast port of VADER, vendored unchanged apart from three debug logging calls; jQuery is gone, and the results are now a bar as well as a table.</p>
