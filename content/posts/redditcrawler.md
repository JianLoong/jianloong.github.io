---
title: "Crawling Reddit using Python and AWS EC2"
date: 2022-10-17T21:30:56+11:00
summary: "An educational approach to crawling Reddit using Python and AWS EC2 without using Reddit API"
ShowCodeCopyButtons: true
comments: true
showToc: true
tags: ["reddit","crawler","aws"]
---

## Objective

The source codes for this project can be found here.


The objective is of this post to complete a web crawler while trying to learn as much as possible while trying to utilise software engineering knowledge and good practices. So, this post would be rather long and it would explain the rationale behind each design decision made. 


It is noted that for every subreddit, the information can be retrieved via  adding a .json to the URL. So, for 


```
https://www.reddit.com/r/programming.json
```

Based on this, information it is possible to avoid using the Reddit API and use HTTP request to obtain the results.




## Setting up your Python environment

In order to manage the various Python dependencies, a python environment is introduced to manage the dependencies.



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