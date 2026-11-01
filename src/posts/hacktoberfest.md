---
title: Hacktoberfest 2022
description: A month of open source, one small word cloud generator, and the parts of it that were not the word cloud.
date: 2022-11-07
category: Open source
readingTime: 3
---

Hacktoberfest is a month-long celebration of open-source projects, their maintainers, and everyone who contributes to them. I have taken part since 2017.

<figure>
<img src="/assets/posts/hacktoberfest-shirts.jpg" alt="Five Hacktoberfest t-shirts, dated 2017 through 2021, laid out in a row on a light grey carpet." width="1920" height="864" loading="lazy" decoding="async">
<figcaption>Five years of Hacktoberfest shirts.</figcaption>
</figure>

This year I did something different. After a stretch of not feeling well, and only recently feeling better, I wanted to finish something of my own instead of contributing to someone else's. So I built a [word cloud generator](https://jianloong.github.io/word-cloud-generator/). It looks like a word cloud generator. The interesting parts are underneath it.

<figure>
<img src="/assets/posts/hacktoberfest-wordcloud.png" alt="A word cloud of the Wikipedia article on Australia. AUSTRALIA is by far the largest word, with Australian, area, population, Commonwealth, country, largest and world next." width="936" height="730" loading="lazy" decoding="async">
<figcaption>The cloud it produced from the Wikipedia article on Australia.</figcaption>
</figure>

## What is underneath it

- `gh-pages` deploys it, with no build step worth the name.
- `d3` and `d3-cloud` draw the cloud itself.
- Bootstrap 5 handles the responsive layout, so I did not hand-write flex boxes.
- Web Workers do the text processing off the main thread, so the page stays usable while it works.
- Natural-language libraries handle the tokenising and lemmatising, rather than my own regex.

## What it taught me

- Bootstrap 5 is still pleasant to use, and dropping jQuery as a dependency made the library much lighter.
- `d3-cloud` needs a small patch if you want more than one cloud on a page, or it warns. Starting again, I would use the Chart.js word cloud plugin instead.
- Web Workers are the right tool for anything that would otherwise freeze the page: the work still takes seconds, but the page can say so.
- The HTML `<select>` element cannot hold child nodes, so putting images in a dropdown takes more work than it looks like it should.

Once the base worked, I opened issues and labelled them for contributors. I built it in a hurry and plenty of it could be better, which was deliberate: finish it first, then let other people improve it.

## The part that stayed with me

Being away from this field for a while means being behind in it, and the field does not wait. The word cloud was never really the point. It was a way of checking that I could still learn the new parts on my own, which after a long illness is a question worth answering rather than assuming.

The other thing it settled: health is part of the toolchain. Learning needs energy and morale behind it, and neither is a given.

The generator is [here](https://jianloong.github.io/word-cloud-generator/) and the source is on [GitHub](https://github.com/JianLoong/word-cloud-generator). Issues and pull requests are welcome.

## Bye.

<p class="colophon">Written in 2022, converted from the old Hugo site and lightly edited with an AI assistant.</p>
