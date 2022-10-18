---
title: "Crawling Reddit using Python and AWS EC2 - Part 1"
date: 2022-10-17T21:30:56+11:00
summary: "An educational approach to crawling Reddit using Python and AWS EC2 without using Reddit API"
ShowCodeCopyButtons: true
showToc: true
comment: true
disableShare: true
ShowWordCount: true
TocSide: right
tags: ["reddit", "crawler", "aws"]
cover:
  image: "/images/crawler.png"
hasMermaid: true
---

## Objective

The objective of this post is to complete a web crawler while trying to learn as much as possible while trying to utilise software engineering knowledge and attempt to use good practices. So, this post would be rather long and it would explain the rationale behind each design decision made. If you are after a "just get it done" method, this post is not suitable for that purpose.

![name](/images/crawler.png#center)

So, it is expected for certain elements of this post to be longer and seem to be doing things the more tedious way.

It is noted that for every subreddit, the easiest way to obtain data is by using the `.json` at the URL. For example, if you query the programming subreddit using the URL https://www.reddit.com/r/programming/ it would return the HTML page whereas if you used

```
https://www.reddit.com/r/programming.json
```

It would return the JSON information. You can do a simple cURL command to obtain the results.

```
curl https://www.reddit.com/r/programming.json
```

The returned json would be as follows

```
```

Based on this, information it is possible to avoid using the Reddit API and use HTTP requests to obtain the results.

## Project Architecture

The architecture of this project is as follows.



| GitHub                                           | Amazon EC2                                        |
| ------------------------------------------------ | ------------------------------------------------- |
| - Handles version control of the project         | - Handles the automation                          |
| - GH Pages will be used to store the .json files | - Will run python scripts to crawl for data and update repository |
|- GH Pages is the choice because, it is easy for projects to have their own pages|- Free Tier for 1 year is neat|




{{<mermaid align="left">}}

graph LR
A-->B

{{< /mermaid >}}




## Setting up your Python environment

A python virtual environment is used to run the Python scripts. This is described further in [PEP405](https://peps.python.org/pep-0405/).

```python
def create_db() -> None:

    try:
        sql = """
                CREATE TABLE IF NOT EXISTS POSTS (
                    ID INTEGER PRIMARY KEY AUTOINCREMENT,
                    title TEXT NOT NULL,
                    permalink TEXT NOT NULL,
                    name TEXT UNIQUE,
                    created INT NOT NULL,
                    selftext TEXT NOT NULL,
                    nta_count INT NOT NULL,
                    yta_count INT NOT NULL,
                    esh_count INT NOT NULL,
                    nah_count INT NOT NULL,
                    info_count INT NOT NULL
                );
        """

        cur = DB_CONNECTION.cursor()
        cur.execute(sql)
    except:
        exit(1)
```

## Summary
