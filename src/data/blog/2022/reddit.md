---
title: "Reddit Data Scraping with Python: A Simple Approach"
author: Jian Liew
pubDatetime: 2022-11-15T00:00:00+11:00
slug: reddit-scraping
featured: false
draft: false
readingTime: 5
tags:
  - tutorial
  - tools
description: "Learn how to scrape Reddit data using Python without API keys. This tutorial shows you how to fetch Reddit posts and comments using JSON endpoints."

---

## Introduction

As of March 2022, Reddit ranks as the 9th-most-visited website globally and 6th most-visited in the US according to Wikipedia.

What makes Reddit particularly interesting is its community-driven structure with `subreddits` catering to diverse interests—from `programming` and `technology` to `funny` and countless other topics.

There are several approaches to obtain data from Reddit. This post demonstrates one of the simplest methods that doesn't require API keys.

## The Basic Method: JSON Endpoints

The easiest way to extract Reddit data is to append `.json` to any Reddit URL. For example, instead of visiting `https://www.reddit.com/r/programming`, you can request `https://www.reddit.com/r/programming.json` to get the data in JSON format.

This approach has several advantages:
- **No API key required**
- **Minimal setup**
- **Direct access to Reddit's data structure**

However, be aware that you may encounter rate limiting with excessive requests.

Here's what the JSON response looks like:

<img src="/assets/reddit.png" alt="Output of crawler" style="height: 300px; width: auto; display: block; margin: 0 auto;">

<p align="center">Figure 1: JSON output from a simple request using the <strong>.json</strong> extension</p>

## Building a Python Scraper

With this knowledge, we can create a Python script to automate the data extraction. While you could use any language, Python is particularly well-suited for this task due to its excellent HTTP libraries and JSON handling.

Here's a complete implementation:

```python
import json
import requests

REDDIT_URL: str = "https://www.reddit.com/r/programming.json?limit=100"

def process():
    # Create headers to mimic a real browser
    headers = {
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

    # Create a session with our headers
    session = requests.Session()
    session.headers = headers
    
    try:
        response = session.get(REDDIT_URL)
        response.raise_for_status()  # Raise an exception for bad status codes
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return

    # Extract posts from the JSON response
    # The structure is: response.json()['data']['children']
    posts = response.json()['data']['children']
    results = []
    urls = []  # We'll use these later to fetch comments

    print(f"Processing {len(posts)} posts...")
    
    for index, post in enumerate(posts, 1):
        print(f"Processing post {index} of {len(posts)}")
        
        post_data = post['data']
        result = {
            "title": post_data['title'],
            "permalink": post_data['permalink'],
            "name": post_data['name'],
            "created": post_data['created_utc'],
            "selftext": post_data['selftext']
        }
        
        # Build URL for fetching comments later
        comment_url = f"https://www.reddit.com{post_data['permalink']}.json"
        urls.append(comment_url)
        results.append(result)

    print(json.dumps(results, indent=4))
    return results, urls

if __name__ == "__main__":
    process()
```

## Sample Output

When you run this script, you'll get output like this:

```json
[
    {
        "title": "NVIDIA Security Team: \"What if we just stopped using C?\" (This is not about Rust)",
        "permalink": "/r/programming/comments/yoisjn/nvidia_security_team_what_if_we_just_stopped/",
        "name": "t3_yoisjn",
        "created": 1667817127.0,
        "selftext": ""
    }
]
```

## Fetching Comments

The main listing provides permalinks to individual posts. You can use these to fetch comments by making additional requests. Here's how to extend the script to fetch comments asynchronously:

```python
from requests_futures.sessions import FuturesSession
from concurrent.futures import as_completed

def fetch_comments(urls, headers):
    submissions = []
    
    with FuturesSession(max_workers=30) as session:
        session.headers = headers
        futures = [session.get(url) for url in urls]
        
        for future in as_completed(futures):
            try:
                response = future.result()
                response.raise_for_status()
                
                # Extract post title
                post_data = response.json()[0]["data"]["children"][0]["data"]
                title = post_data["title"]
                
                # Extract comments
                comments_data = response.json()[1]["data"]["children"]
                replies = []
                
                for comment in comments_data:
                    if comment["kind"] == "t1":  # Regular comment
                        body = comment["data"]["body"]
                        replies.append(body)
                
                submission = {
                    "title": title,
                    "replies": replies
                }
                submissions.append(submission)
                
            except Exception as e:
                print(f"Error processing comment: {e}")
                continue
    
    return submissions
```

## Sample Comment Output

Here's what the comment data looks like:

```json
[
    {
        "title": "NVIDIA Security Team: \"What if we just stopped using C?\" (This is not about Rust)",
        "replies": [
            "That's pretty cool.\n\nThough I find it fascinating they didn't go for the low-hanging fruit of the way they do UI<->driver interactions and how many layers of vulnerabilities come from that, nevermind how \"heavyweight\" it all is.\n\nBut as far as the backend goes, that's a damn cool change, especially that it was accepted so well.",
            "> What if we just stopped using C?\n\n> #504 Gateway Time-out\n\nis this some elaborate shitpost that is flying over my head?",
            "I think reddit hugged it to death.",
            "For those mentioning Rust. Nvidia do know about Rust, just in case you thought that they hadn't heard all about it. Some considerations like lacking integer overflow protection is talked about here.\n\nhttps://youtu.be/TcIaZ9LW1WE\n\nOn a personal note. I love Ada's readability. Some see readability as meaning brevity. I do not."
        ]
    }
]
```

## Important Considerations

### Rate Limiting
This method doesn't require an API key, but Reddit may rate-limit you if you make too many requests too quickly. Consider:
- Adding delays between requests
- Using fewer concurrent workers
- Respecting Reddit's robots.txt

### Data Storage
For production use, consider:
- Storing data in a database
- Implementing duplicate detection
- Adding data validation
- Creating update mechanisms

### Legal and Ethical Considerations
- Always respect Reddit's Terms of Service
- Don't overload their servers
- Consider the privacy implications of scraping
- Use the data responsibly

## Complete Implementation

You can find the complete, production-ready implementation in this [GitHub Gist](https://gist.github.com/JianLoong/e8a92c7352e3b3276e17a060231e4432).

## Conclusion

This method provides the simplest way to extract Reddit data without requiring API keys. While suitable for basic needs and learning purposes, consider using Reddit's official API for production applications that require reliability and higher rate limits.

Remember to be respectful of Reddit's resources and always follow their terms of service when scraping data.