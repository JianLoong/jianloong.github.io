---
title: "Using Python to obtain data from Reddit"
date: 2022-10-18T21:30:56+11:00
summary: ""
ShowCodeCopyButtons: true
comment: true
disableShare: true
ShowWordCount: true
TocSide: right
tags: ["reddit", "crawler", "praw"]
cover:
  image: "/images/simplecrawler.png"
hasMermaid: true
draft: true
---

### Introduction

As of March 2022, Reddit ranks as the 9th-most-visited website in the world and 6th most-visited website in the US according to Wikipedia.

What is interesting about Reddit is that it has ``subreddits`` for people with different interests. 



```python

# Create header to spoof browser
header = {
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    "Referer": "https://www.google.com/",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9"
}
