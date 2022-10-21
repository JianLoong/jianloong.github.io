---
title: "Simple Reddit crawler for the /r/programming subreddit"
date: 2022-10-18T21:30:56+11:00
summary: "An simple approach to crawling Reddit using Python without using Reddit API"
ShowCodeCopyButtons: true
comment: true
disableShare: true
ShowWordCount: true
TocSide: right
tags: ["reddit", "crawler", "aws"]
cover:
  image: "/images/simplecrawler.png"
hasMermaid: true
draft: true
---

### Introduction

As of March 2022, Reddit ranks as the 9th-most-visited website in the world and 6th most-visited website in the US according to Wikipedia.

What is interesting about Reddit is that it has ``subreddits`` for people with different interest.

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

r = requests.Session()
r.headers = header
try:
    response = r.get(REDDIT_URL)
except:
    exit(1)

    posts = response.json()['data']['children']
    index = 1

    urls = []

    for post in posts:
        print(str(index) + " out of " + str(len(posts)))
        index = index + 1

        if "title" and "permalink" and "name" and "created_utc" and "selftext" not in post['data']:
            print("post does not have enough information")
            continue

        title = post['data']['title']
        permalink = post['data']['permalink']
        name = post['data']['name']
        created = post['data']['created_utc']
        selftext = post['data']['selftext']

        urls.append("https://www.reddit.com" + permalink + ".json")

    with FuturesSession(max_workers=10) as session:

        session.headers = header
        futures = [session.get(url) for url in urls]
        for future in as_completed(futures):
            replies_response = future.result()

            replies = replies_response.json()[1]

            
```
