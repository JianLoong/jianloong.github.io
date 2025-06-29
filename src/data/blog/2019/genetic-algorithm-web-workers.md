---
title: "Genetic Algorithm using Web Workers"
author: Jian Liew
pubDatetime: 2019-10-19T00:00:00+11:00
slug: genetic-algorithm-web-workers
featured: false
draft: false
readingTime: 8
tags:
  - tutorial
  - genetic-algorithm
  - web-workers
  - javascript
description: "A simple implementation of Genetic Algorithm using Web Workers. Start with a random string and evolve it to match a target string using different crossover and selection methods."
---

This post is a simple implementation of **Genetic Algorithm (GA).** Here, you would start with a random string and end up with the target string.

This post is heavily inspired based on this [website](https://github.com/subprotocol/genetic-js). However, I created the codes with a very different methodology to also include newer JavaScript methods using classes and also web worker so it runs behind the scenes.

The implementation of it can be seen [here](https://github.com/JianLoong/jianloong.github.io/blob/master/content/posts/ga-worker.js)

## Interactive Genetic Algorithm Demo

<GeneticAlgorithmDemo />

## Observations

- Using the methodology ``random`` crossover at times will not yield results. The reason for this is simple is because if it is random there might not improvement of the child chromosomes.
- Using a short "target" string will yield the result faster, as the problem statement would be significantly easier to solve.

## Lessons from this post

- The web worker is often cached for a longer period in production/live environments. Users would have a better experience if it is not required for them to do a hard refresh on the browsers. One easy way is to use the best practice to load the web worker in the head. Others suggested to versioning web-workers.
- The web worker at times; does not like while loops. It would be better if for loops are used instead.
- The cross-over methodology for GA needs to be implemented with complexity in mind.
- Using jQuery might not be the best idea as the **hide()** and **show()** which manipulates the display either changing to none or block does not work well on mobile browsers. Perhaps not using jQuery would be better.
- Designing an encoding is very important. For example, in a knapsack problem there are only two choices. So, each item can either be true or false.

## References

1. [Python Easy GA](https://pypi.org/project/pyeasyga/) 