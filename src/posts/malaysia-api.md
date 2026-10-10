---
title: A REST API with no database
description: Why Malaysia API is a folder of JSON files, and why that is still the right call.
date: 2024-12-04
category: APIs
readingTime: 6
related:
  - title: The outpost pattern
    url: /posts/outpost-pattern/
  - title: Vibe coding an old blog into something I would actually use
    url: /posts/vibe-coding/
---

Malaysia has thirteen states and three federal territories. That is a terrible reason to stand up Postgres.

[Malaysia API](https://github.com/JianLoong/malaysia-api) started as a small public dataset: names, capitals, mottos, coordinates, calling codes, pulled from Wikipedia and served as JSON. The whole point was that other applications could consume static facts without me babysitting a server.

It is intentional that the files live on disk as JSON. A database engine would have been a hobby, not a feature. The data changes when a chief minister changes, not every request. Git is a fine audit log for that pace.

## What “static” bought me

I have made the other mistake. The Reddit AITA store began as a static API on GitHub Pages. Every second hour it crawled submissions, wrote SQLite, then emitted JSON indexes, per-submission files, sentiment summaries, and a Fuse.js corpus. By January 2024 the build was fifteen minutes and growing. The methodology does not survive a dataset that only gets larger. That project moved to FastAPI. Malaysia API did not need to.

Choose the boring shape that matches the write pattern.

- Facts that change yearly: files in git, a CDN in front
- Facts that change hourly, and keep accumulating: a real query interface

> Avoiding a database is not a personality. It is a decision about how often the truth moves.

## Why I still like it

People actually use it. Students, hackathon teams, the occasional visualisation. The contract is obvious: `GET /state/v1/selangor.json` returns Selangor. If something is wrong, open an issue. There is no connection string to rotate at 11pm.

The same instinct shows up in the browser sentiment analyser (AFINN, VADER, NRC, no `node_modules`) and the D3 word cloud. I like tools that a person can open without installing a platform. Teaching at Monash probably did that. If the demo needs Docker before it needs an idea, the idea is not ready.

Robogo, later, is the other side of the coin: YAML workflows against HTTP, Postgres, Kafka, SWIFT. Still KISS. Still no built-in secret store. Secrets belong to the pipeline. The tool should exit when the test is done.

I will keep putting small, complete things on GitHub. Some of them will be a folder of JSON. That is enough.
