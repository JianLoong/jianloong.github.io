---
title: Evolving a phrase out of random letters
description: A genetic algorithm that starts from noise and converges on whatever string you give it — running in a worker, with every improvement plotted as it arrives.
date: 2019-10-19
category: Data
readingTime: 3
scripts:
  - /js/posts/simplegeneticalgo.js
---

Start with a string of random characters. Score each candidate by how far it is from the string you want. Keep the best, cross them over, mutate a few, and repeat. Within a few hundred generations you have the sentence.

That is a genetic algorithm in its simplest honest form. This one was inspired by [genetic-js](https://github.com/subprotocol/genetic-js), though the implementation is different: classes rather than closures, and a web worker so the search does not freeze the page.

The same worker solves the [travelling salesperson problem](/posts/tsp/) — only the fitness function changes. Watching a phrase come out of noise is the easier way to see what the algorithm is doing.

<div class="demo" data-ga>
<div class="demo-controls">
<label class="demo-field" for="ga-crossover">Cross over
<select id="ga-crossover" data-ga-crossover>
<option value="onePoint">One point</option>
<option value="twoPoint">Two point</option>
<option value="uniform">Uniform</option>
<option value="pmx">PMX</option>
</select>
</label>
<label class="demo-field" for="ga-selection">Selection
<select id="ga-selection" data-ga-selection>
<option value="tournament">Tournament</option>
<option value="random">Random</option>
<option value="rank">Rank</option>
<option value="rouletteWheel">Roulette wheel</option>
</select>
</label>
<label class="demo-field" for="ga-target">Target string
<input type="text" id="ga-target" data-ga-target value="GA will obtain this string" autocomplete="off">
</label>
<button type="button" data-ga-run>Run</button>
</div>
<p class="demo-readout" data-ga-readout aria-live="polite">Loading the demo…</p>
<svg data-ga-chart viewBox="0 0 600 150" role="img" aria-label="Fitness against generation, climbing towards the ceiling that means the target string has been reached."></svg>
<div class="demo-log" data-ga-log>
<table>
<thead><tr><th>Generation</th><th>Fitness</th><th>Phrase</th></tr></thead>
<tbody data-ga-rows></tbody>
</table>
</div>
<p class="demo-note">Population 100, up to 2,000 generations. The worker stays quiet on generations that change nothing, which is most of them, so the log is only the improvements.</p>
</div>

## What to watch

- **Set selection to random and run it.** It often stops without reaching the target — a generation picked without regard to fitness has no pressure pushing it uphill, so the population wanders. That is the whole mechanism, removed.
- **Type a short target.** A four-letter word is solved almost immediately; the difficulty is exponential in length, and watching that happen is more instructive than any description of why.
- **Watch the log rather than the chart.** The chart shows the shape of convergence; the log shows that most of the climb happens in the first few dozen improvements, and the last characters take the longest.

## What it taught me

- **A web worker is cached hard in production.** If a worker changes, users should not need a hard refresh to get it — either load it early or put a version in its name. This is a deploy problem masquerading as a caching one.
- **The worker misbehaved with `while` loops.** A `for` loop with a bound was fine where a `while` loop was not, and the bound also makes the generation cap explicit.
- **Cross-over has to be chosen with complexity in mind.** Ordered cross-over for permutations, uniform for independent genes: the wrong pairing produces invalid children, or none at all.
- **Do not reach for jQuery to show and hide a table.** The post's original lesson was that `hide()` and `show()` misbehave on mobile; the fix was to stop loading jQuery entirely, which is what this version does.
- **The encoding is the design.** In a knapsack problem each gene is true or false; here each gene is a symbol. Get the encoding right and the operators follow; get it wrong and no amount of tuning helps.

## References

1. [Python Easy GA](https://pypi.org/project/pyeasyga/) — a similar approach in Python.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The worker is unchanged; the demo was rewritten without jQuery, and the log no longer prints the worker's completion messages as though they were fitness scores.</p>
