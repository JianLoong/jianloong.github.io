---
title: "Using Python to obtain data from Reddit"
date: 2022-11-07T20:56:02+11:00
summary: ""
ShowCodeCopyButtons: true
comment: true
disableShare: true
ShowWordCount: true
TocSide: right
tags: ["reddit", "crawler", "python"]
cover:
  image: "/images/simplecrawler.png"
hasMermaid: false
draft: false
---

## Introduction

As of March 2022, Reddit ranks as the 9th-most-visited website in the world and 6th most-visited website in the US according to Wikipedia.

What is interesting about Reddit is that it has ``subreddits`` for people with different interests. For example, there are subreddits on ``prorgramming``, ``technology`` or even about funny things at ``funny``.

There are a few approaches one can take to obtain data from Reddit. Here is one way to do it.

### Basic method

The easiest way to get information would just to be to issue a request to the exact same page but now with the ``.json`` extension. For example if you are after information from *https://www.reddit.com/r/programming* you can issue a request to *https://www.reddit.com/r/programming.json* for information to be retrieved in JSON format.

This method is nice because it requires minimal setup and does not need an API key, however there might be limitations where you can potentially get rate limited.

The output of that would be as follows -

{{< figure src="/images/reddit.png" title="" align="center">}}

<p align="center">Fig 1. Output JSON from a simple request using the <strong>.json</strong> extension </p>


With that knowledge we can write a simple ``python`` script to do it. It doesn't really matter what language we use for this scenario, but ``python`` would be one of the fastest, of course you could also write a simple fetch on JavaScript.

The ``python`` codes below will showcase how it is done.


```python
import json
import requests

REDDIT_URL: str = "https://www.reddit.com/r/programming.json?limit=100"

def process():

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

    # Get the results of the request - posts is a array of JSON.
    # Notice here we are accessing the data -> children
    posts = response.json()['data']['children']
    results = []

    # We will use this urls later to get the comments.
    urls = []

    index = 1
    for post in posts:
        print(str(index) + " out of " + str(len(posts)))
        index = index + 1
        title = post['data']['title']
        permalink = post['data']['permalink']
        name = post['data']['name']
        created = post['data']['created_utc']
        selftext = post['data']['selftext']

        result = {
          "title": title,
          "permalink": permalink,
          "name": name,
          "created": created,
          "selftext": selftext
        }

        urls.append("https://www.reddit.com" + permalink + ".json")
        
        results.append(result)

    print(json.dumps(results, indent=4))

if __name__ == "__main__":
    process()
    exit(0)
```


If you run it, you would be able to get a list of post from that subreddit, however often times we are interested in the content of the post themselves, so we can actually issue more request for it.

For example, if you limit the post to 1 below would be an example output of it. You can also determine how much information you would like from it.

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

Besides that, the main listing would also return hyperlinks to the post in which you can query to obtain results from them as well. These fields are indicated with the ``permalink`` entries for the post. So you can build up a list of them a perform more request for it. 

The following are the extension of the above codes. It is much faster for this to be done in an async manner, since we have multiple URLs. So, using a FutureSession would be much better for this implementation.

```python
    with FuturesSession(max_workers=30) as session:
        session.headers = header
        futures = [session.get(url) for url in urls]
        for future in as_completed(futures):
            replies_response = future.result()
            temp = replies_response.json()[0]["data"]["children"][0]["data"]["title"]
            print(temp)
            _replies_arr = replies_response.json()[1]
            replies = []
            for reply in _replies_arr['data']['children']:
                _body = reply['data']['body']
                replies.append(_body)
                
            submission = {
                "title": temp,
                "reply": replies
            }
            submissions.append(submission)
            
    print(json.dumps(submissions, indent=4))

```

The output would be

```json
[
    {
        "title": "NVIDIA Security Team: \"What if we just stopped using C?\" (This is not about Rust)",
        "reply": [
            "That's pretty cool.\n\nThough I find it fascinating they didn't go for the low-hanging fruit of the way they do UI&lt;-&gt;driver interactions and how many layers of vulnerabilities come from that, nevermind how \"heavyweight\" it all is.\n\nBut as far as the backend goes, that's a damn cool change, especially that it was accepted so well.",
            "&gt; What if we just stopped using C?\n\n&gt; #504 Gateway Time-out\n\nis this some elaborate shitpost that is flying over my head?",            "&gt; I encourage everyone to read the full case study\n\nOk, I will!\n\n&gt; **Sign up to Access Now**\n\nOk, bye!",
            "I think reddit hugged it to death.",
            "For those mentioning Rust. Nvidia do know about Rust, just in case you thought that they hadn't heard all about it. Some considerations like lacking integer overflow protection is talked about here.\n\nhttps://youtu.be/TcIaZ9LW1WE\n\nOn a personal note. I love Adas readability. 
Some see readbility as meaning brevity. I do not.",
            "tf is spark",
            "&gt; (This is not about Rust)\n\nWell, no.  It's really about Ada; actually a formally verifiable subset of it, which is a language programmers eschewed a long time ago because... reasons?  It has nearly (or all?) of the same advantages of Rust, but somehow Rust became more popular.  I don't understand why we needed Rust when Ada was there all along.   \n\nSo, I went looking for an example.  And here it is:\n\nhttps://blog.adacore.com/i-cant-believe-that-i-can-prove-that-it-can-sort\n\nBasically, this is just a SPARK example to write a verifiable sorting algorithm 
in Ada SPARK.  FWIW - That sorting algorithm is very cool too and dead simple by itself.  Like it makes falling out of bed look complicated; that 
kind of simple.\n\nAnyway, now I know why we haven't been using this stuff so far:  It's far too complicated for most of us to use in daily practice.  Most of us aren't going to be writing core SDKs or drivers used by millions of users though either, so that's fair.  But, if must write software that MUST be provable correct, then this is your go-to.  Or maybe Rust if you must write software that's probably correct because at least it 
avoids most of the sins of C, then use that.  You decide.\n\nOh... and here's the Spark sub-reddit:  https://www.reddit.com/r/spark/",
            "I actually prefer reading and writing Ada to Go. Which is saying something for a language with low level memory control.",
            "I like how cautious the title is lol\n\nPretty sad you have to preface stuff like this to avoid assholes raiding the comments though.",
            "I worked for a company doing safety related code and the crusty old tech lead told me once \"We should be doing this in ADA but we can't find enough developers\".",
            "I just wish Spark Pro wasn't privately priced. I bet its in the hundreds of thousands of dollars per license.",
            "Interestingly, this is an Ada-based system. See [https://en.wikipedia.org/wiki/SPARK\\_(programming\\_language)](https://en.wikipedia.org/wiki/SPARK_(programming_language)) \n\nIf you Google \"SPARK\" it's easy to get tangled up in Apache Spark, which this is not.\n\nI would have described Ada as a quaint, long-abandoned attempt at a programming language by DoD. Interesting that it's still around at all, much less possibly gaining usage.",
            "I only care about C because of x86-based tools like Valgrind, VTune, IDA Pro and basic portability between GPU and CPU.",
            "I am really tired after work today and at the same time I thought it sounded very interesting. I just can't focus. Did they just use 
Spark and it was as fast as C?",
            "It would be \"NVIDIA Se urity team\", then.",
            "I briefly worked with Ada, GNAT Pro, and Code Peer in the rail industry. It was a fantastic experience, but it was all green field.\n\nI won't comment about Rust negativity, but I will just say that Ada deserves much more attention and respect from safety-minded developers than 
it receives today.",
            "The only comment on the blog post is another Rust-troll.",
            "Stop trying to make Ada happen",
            "https://i.redd.it/9oez8zkg1qc01.png",
            "WHAT DO YOU MEAN IT'S NOT ABOUT RUST, RUST IS BETTER C AND C++!!!1!! SWITCH TO RUST OR I WILL SEGFAULT YOUR ENTIRE COMPANY \ud83e\udd2c\ud83d\udc79",
            "&gt; \u201cTesting security is pretty much impossible. It\u2019s hard to know if you\u2019re ever done,\u201d said Daniel Rohrer, VP 
of Software Security at NVIDIA.\n\nA) no, it's not.\n\nB) you're never done.\n\nThis is coming from the VP of Software Security? Who made him VP? 
A dozen monkeys with typewriters?",
            "However, Ada is very large and takes a long time to study even in its features.\n\nFurthermore a lot of the things we do by convention in C programs have specific Ada features just for that, so rather than applying the corresponding language primitives (which is generally painful) one hits the annotated language reference a dozen times until the knowledge sticks. On top of all that there's conventions particular to Ada, which are mysterious and powerful.",
            "Long story short they are using spark (never heard about it before) language. It\u2019s already deployed for them, and did nit really see any difference in terms of performance, aka a pretty big reason to use C/C++ on new shit today.",
            "What about Pascal ? Nothing is more readable?",
            "Amazing that industry finally starts using formal theorem provers.",
            "They used fucking ADA?!?! These guys are built different",
            "[removed]"
        ]
    }
]
```

### Conclusion

The gist of the code can be found [here](https://gist.github.com/JianLoong/e8a92c7352e3b3276e17a060231e4432)

If you are planning on saving the data, there are better ways to engineer the solution by inserting the information into a database and also preventing duplicated entries and updating them as well, but this method is sufficient enough for basic needs.

This is probably the easiest way to obtain data from reddit. You can obviously tailor the codes to the output or information you would like. The main advantage of using this method is that you do not need an API key however, there is a high chance you will get rated-limited if you are issuing too many request. Please be warned.