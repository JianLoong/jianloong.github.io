---
title: "Sentiment Analysis of r/HongKong Using AFINN Lexicon"
author: Jian Liew
pubDatetime: 2019-10-13T20:56:02+11:00
slug: sentiment-analysis-hongkong-afinn
featured: false
draft: false
readingTime: 5
tags:
  - sentiment analysis
  - reddit
  - data visualization
  - javascript
  - api
description: "A real-time sentiment analysis of Reddit's Hong Kong subreddit using the AFINN lexicon to categorize comments as positive, negative, or neutral with interactive charts."
---

### Sentiment Analysis for the Sub-Reddit "HongKong"

This post will perform **sentiment analysis** using AFINN. AFINN is a list of words rated for valence rated with an integer between minus five(negative) and plus five (positive). This implementation uses ***AFINN-en-165***. <sup>[1](#1)</sup>

This approach however is very naive as it does not build any models to determine the context of the usage of the word itself.

**Note**: Due to CORS restrictions, the live Reddit data may not load in modern browsers. The charts below show sample data to demonstrate the sentiment analysis functionality.

#### References

<a name="1">1</a>. [AFINN Sentiment Analysis](https://darenr.github.io/afinn/)

---