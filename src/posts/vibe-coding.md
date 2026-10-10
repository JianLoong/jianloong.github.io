---
title: Vibe coding an old blog into something I would actually use
description: Three days with Cursor, a janky Hugo site, and the surprising amount of guidance an AI still needs.
date: 2025-06-29
category: Tools
readingTime: 6
related:
  - title: The enterprise silo
    url: /posts/the-enterprise-silo/
  - title: The outpost pattern
    url: /posts/outpost-pattern/
---

This post could be potentially vibe coded. The title almost certainly was.

Recently I wanted to migrate away from my old Hugo blog into something easier and more modern. There were several issues though. My Hugo blog is jank. Think super jank: fuzzy search, custom front matter, random JavaScript embeds, random pagination, all hacked up over the years from a pure static site to Jekyll to Hugo, messing around with themes along the way.

Initially I was going to move some posts and leave the rest to rot. Then I heard about Cursor and these new IDEs that vibe coders use.

Well, shockingly, it is much better than I thought.

## Three days

Over the span of three days I vibe coded the following:

- Migrated the old blog from Hugo to Astro
- Removed some janky jQuery components and replaced them with at least so-called modern JavaScript
- Fixed a word cloud implementation from 2019, or even older
- Replaced a lot of `innerHTML` that never should have survived
- Got heaps of things that were never meant to work into a state of working
- Banged out more features than default Astro Paper by just directing the model

This would have taken me much longer by hand. To be fair, vibe coding is good if the user actually directs it. For most of my cases I still had to use specific keywords so it knew what to do. I had to say things like “Astro Islands”, and “perhaps this is the cause…”

> If you want an elegant solution, perhaps you need to hold its hand. What is elegant anyways?

I vibe coded the title as well. I do not think it gives an elegant solution on its own. Of course this codebase is small compared with real projects, but I can see vibe coding becoming another tool in the arsenal rather than a replacement for knowing what you are asking for.

Bye.
