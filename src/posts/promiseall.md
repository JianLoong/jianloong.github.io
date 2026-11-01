---
title: Promise.all, and the same requests one at a time
description: The Hacker News API hands you IDs, not stories. Promise.all turns three hundred round trips into one wait, and the 2019 version of this page fetched five hundred at once.
date: 2019-10-25
category: Tools
readingTime: 4
scripts:
  - /js/posts/promiseall.js
---

Not every list endpoint returns the things you want. Hacker News is the clearest example I know: `/v0/topstories.json` returns an array of item IDs and nothing else. To get the top ten posts *with their titles*, you make one request for the list and then one request per story.

```shell
curl https://hacker-news.firebaseio.com/v0/topstories.json
```

```json
[
    33256378,
    33259379,
    33256446,
    33257197,
    33249215,
    33254791,
    33251954,
    33257300,
    33244819,
    33228387,
    33247681
]
```

Each of those IDs has its own endpoint, and only there do you find the title, the score and the author:

```shell
curl https://hacker-news.firebaseio.com/v0/item/33257197.json
```

```json
{
    "by": "walterbell",
    "descendants": 52,
    "id": 33257197,
    "score": 110,
    "time": 1666149822,
    "title": "IDA cybersecurity software provider Hex-Rays acquired",
    "type": "story",
    "url": "https://smartfinvc.com/news/smartfin-acquires-leading-cybersecurity-software-provider-hex-rays-together-with-sfpim-and-sriw/"
}
```

## The shape of the problem

Ten stories is eleven requests. Three hundred stories is three hundred and one. Done one after another, that is three hundred waits, each of them mostly a network being idle; done together, it is one wait with three hundred requests in it. That is all `Promise.all` is for, and the flow is worth seeing once:

<figure>
<svg class="figure-art" width="720" height="500" viewBox="0 0 720 500" role="img" aria-label="A flow chart: fetch the top stories list, check the response, parse the IDs, create one request per ID, wait for them together with Promise.all, check again, then show the results. Both failed checks lead to reporting the error.">
<defs>
<marker id="pa-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.45"/>
</marker>
</defs>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2">
<rect x="180" y="8" width="120" height="32" rx="16"/>
<rect x="120" y="60" width="240" height="34" rx="8"/>
<rect x="120" y="178" width="240" height="34" rx="8"/>
<rect x="120" y="232" width="240" height="34" rx="8"/>
<rect x="120" y="286" width="240" height="34" rx="8"/>
<rect x="120" y="404" width="240" height="34" rx="8"/>
<rect x="180" y="458" width="120" height="32" rx="16"/>
<rect x="440" y="200" width="240" height="56" rx="8"/>
</g>
<g fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2">
<path d="M240 106 L300 132 L240 158 L180 132 Z"/>
<path d="M240 332 L300 358 L240 384 L180 358 Z"/>
</g>
<g fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5" marker-end="url(#pa-arw)">
<path d="M240 40 V54"/>
<path d="M240 94 V100"/>
<path d="M240 158 V172"/>
<path d="M240 212 V226"/>
<path d="M240 266 V280"/>
<path d="M240 320 V326"/>
<path d="M240 384 V398"/>
<path d="M240 438 V452"/>
<path d="M300 132 H560 V194"/>
<path d="M300 358 H560 V262"/>
<path d="M680 228 H700 V474 H306"/>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="240" y="29">Start</text>
<text x="240" y="82">Fetch /topstories.json</text>
<text x="240" y="200">Parse the IDs</text>
<text x="240" y="254">Create a request per ID</text>
<text x="240" y="308">Promise.all</text>
<text x="240" y="426">Results</text>
<text x="240" y="479">End</text>
<text x="560" y="224">Report the error</text>
<text x="560" y="245" opacity="0.65">nothing to show</text>
<text x="240" y="136" opacity="0.65">valid?</text>
<text x="240" y="362" opacity="0.65">valid?</text>
</g>
<g fill="currentColor" opacity="0.6">
<text class="sm" x="248" y="118">yes</text>
<text class="sm" x="248" y="344">yes</text>
<text class="sm" x="308" y="126">no</text>
<text class="sm" x="308" y="352">no</text>
</g>
</svg>
<figcaption>The two checks are the same check: a response that is not valid ends the run and reports, rather than being parsed into something empty.</figcaption>
</figure>

The code is shorter than the diagram. Every request is created first and they are all awaited together:

```javascript
const getJSON = (url) =>
  fetch(url, { mode: "cors" }).then((response) => response.json());

const topStories = (count) =>
  getJSON("https://hacker-news.firebaseio.com/v0/topstories.json").then((ids) =>
    Promise.all(
      ids
        .slice(0, count)
        .map((id) => getJSON("https://hacker-news.firebaseio.com/v0/item/" + id + ".json"))
    )
  );
```

## The same work, both ways

The 2019 version of this page did not run at all: the script was commented out and the reader was told to paste it into a browser console, which is what the screenshots below show. It runs here instead, and it runs the work both ways so the difference is a number on the page rather than a claim.

<div class="demo" data-promiseall>
<div class="demo-controls">
<label class="demo-field" for="pa-size">Stories
<select id="pa-size" data-promiseall-size>
<option value="10">10</option>
<option value="25" selected>25</option>
<option value="50">50</option>
</select>
</label>
<button type="button" data-promiseall-concurrent>Promise.all</button>
<button type="button" data-promiseall-sequential>One at a time</button>
</div>
<p class="demo-readout" data-promiseall-readout aria-live="polite">Loading the demo…</p>
<table>
<thead><tr><th>#</th><th>Score</th><th>By</th><th>Title</th></tr></thead>
<tbody data-promiseall-rows></tbody>
</table>
<p class="demo-note">Press both buttons and compare the milliseconds. The 2019 script mapped Promise.all over all five hundred top stories; that is why its network screenshot shows a waterfall running past thirty seconds. Fifty is the ceiling here, and the readout says how many requests it took.</p>
</div>

The screenshots, in the order the post used them: the console with the code pasted, the network tab while it runs, and the promise going from pending to fulfilled.

<figure>
<img src="/assets/posts/promiseall-console.png" alt="A browser console with the pasted code: getTopStoriesId, getItem and topStories, each defined with fetch and mode cors." width="997" height="630" loading="lazy" decoding="async">
<figcaption>The code pasted into the console, which is how the 2019 version asked you to run it.</figcaption>
</figure>

<figure>
<img src="/assets/posts/promiseall-network.png" alt="The DevTools network tab: a burst of requests in the first second, then a dense band of item requests continuing past the thirty-second mark." width="1044" height="313" loading="lazy" decoding="async">
<figcaption>Five hundred requests, batched. The first burst is the list and the start of the items; the wide band after it is the rest of the items being handed out by the browser's connection limit. Promise.all does not mean unlimited parallelism: it means you are not waiting between requests.</figcaption>
</figure>

<figure>
<img src="/assets/posts/promiseall-pending.png" alt="A console showing a variable named stories evaluating first to Promise pending and later to Promise fulfilled with an array of five hundred items." width="751" height="164" loading="lazy" decoding="async">
<figcaption>Pending, then fulfilled with an array of 500. The promise is the same object both times; only its state changed.</figcaption>
</figure>

## What it taught me

- **`then` returns a promise too**, which is the whole reason the chaining above works: the second `then` waits on the `Promise.all`, not on the first fetch.
- **`fetch` is significantly easier than its jQuery counterparts**, with the caveat it always had: it is a modern API, and a static site with no build step is at the mercy of the browsers its readers bring.
- **CORS is the modern answer and JSONP is the old one.** `mode: "cors"` is a line in a fetch call; JSONP is a script tag, a callback name and a server that has to cooperate. The APIs worth using now send the header.
- **`Promise.all` fails as one.** One bad request rejects the whole thing, which is what makes the validity check in the diagram matter: there is no partial result to fall back on. `Promise.allSettled` is the version that keeps the successes, and it is the one to reach for when a single failure should not cost you the other nine.
- **Batching does not remove the work.** Five hundred requests are still five hundred requests; they just stop queueing behind each other.
- **An API with no wrapper gets one eventually.** Plenty of people wrote one for Hacker News, and the one used on this site's word cloud post is a read-only mirror of it.

## References

1. [Promise.all (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all)
2. [When to use Promise.all](https://stackoverflow.com/questions/38180080/when-to-use-promise-all), the 2019 reference.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The code, the end points and the three figures are the originals, and the flowchart was a mermaid block there and is now an SVG in the site's figure grammar. The demo now runs: it never ran on the old page.</p>
