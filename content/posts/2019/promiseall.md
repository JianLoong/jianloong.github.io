---
title: "JavaScript Promise All - Parsing Hackernews Stories using Promise.all"
date: 2019-10-25
tags: ["JavaScript", "Promise", "API"]
---


This post is an entry to describe a use case when the Promise.all JavaScript method is needed. The official reference can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). This assumes that the reader has a basic understanding of how promises work.


Before we start, there is a need to understand how certain RESTful services are structured. For example, the Hacker News API has an end-point called **topstories**. This end-point however, does not contain any other information besides a list of item IDs. So, if you would like to obtain the top 10 posts including their **title**, there would be a need to do several GET requests to fetch them all.

The output of 

```shell
curl https://hacker-news.firebaseio.com/v0/topstories.json"
```

is

```json
[
    33256378,
    33259379,
    33256446,
    33257197,
    33249215,
    33254791,
    33251954,
    33257300,
    33244819,
    33228387,
    33247681,
    . . . 
```

These IDs will then be used to obtain more information from a different end point.

```shell
curl https://hacker-news.firebaseio.com/v0/item/33257197.json
```

which would yield

```json
{
    "by": "walterbell",
    "descendants": 52,
    "id": 33257197,
    "kids": [
        33257610,
        33257643,
        33259365,
        33257485,
        33258257,
        33258605,
        33257772,
        33257557
    ],
    "score": 110,
    "time": 1666149822,
    "title": "IDA cybersecurity software provider Hex-Rays acquired",
    "type": "story",
    "url": "https://smartfinvc.com/news/smartfin-acquires-leading-cybersecurity-software-provider-hex-rays-together-with-sfpim-and-sriw/"
}

```


### Flowchart Representation

{{<mermaid align="left">}}

  graph TD
      S(Start)
      A(Fetch from /topstories)
      B{Valid?}
      C(Parse all IDs from <br />/topstories)
      D(Create multiple <br />Promises with Fetch <br />using the <br />/items/id end point <br />based on the IDs obtained)
      E(Create the Promise.all)
      F{Valid?}
      G(Results)
      Y(Report Error)
      Z(End)
      S-->A
      A-->B
      B-- Valid Response -->C
      B-- Invalid Response -->Y
      C-->D
      D-->E
      E-->F
      F-- Invalid Response -->Y
      F-- Valid Response -->G
      Y-->Z
      G-->Z

{{< /mermaid >}}

<p align="center">Fig 1. Flow Chart of the <strong>Promise.all</strong> </p>



The code example below would demonstrate a situation where the **Promise.all** becomes useful.

```js

// First use the top stories end point to retrieve a list of the top stories
const getTopStoriesId = () => {
  let endPoint = "https://hacker-news.firebaseio.com/v0/topstories.json";
  return fetch(endPoint, {
    mode: "cors"
  }).then((response) => response.json());
};

const getItem = (itemNumber) => {
  let endPoint = "//hacker-news.firebaseio.com/v0/item/" + itemNumber + ".json";
  return fetch(endPoint, {
    mode: "cors"
  }).then((response) => response.json());
}

const topStories = () => getTopStoriesId().then((result) => {
    let promiseArray = [];
    result.forEach((element) => {
      promiseArray.push(getItem(element));
    });

    return Promise.all(promiseArray);
});

```
<p align="center">Code Example of the <strong>Promise.all</strong> </p>


In order to see it in action, you can copy and paste it on the browser console to see how it works.

{{< figure src="/images/console.png" title="" >}}

{{< figure src="/images/network.png" title="" >}}

{{< figure src="/images/pending.png" title="" >}}

#### Lessons from this blog post.

- The **then** function returns a promise as well. 
- Fetch is **significantly easier** to use in comparison to its jQuery counterparts. However, considerations need to be taken into account when using it in static sites that do not have Babel or modernizr.
- There are a lot of reasons a lot of users decided to create their wrappers around the Hacker News API. Perhaps, it is deemed that their top stories and ending up which does summary could be done differently. But HN itself is a very opinionated community.
- Mermaid diagrams are useful and break tags can be introduced in them.
- CORS and JSONP exist. Cors is more modern and easier to use compared to using JSONP.
- Using jQuery can make the codes very unreadable and creating callback hell easier.


### References

1. https://stackoverflow.com/questions/38180080/when-to-use-promise-all



<script>
// const getTopStoriesId = () => {
//   let endPoint = "https://hacker-news.firebaseio.com/v0/topstories.json";
//   return fetch(endPoint, {
//     mode: "cors"
//   }).then((response) => response.json());
// };

// const getItem = (itemNumber) => {
//   let endPoint = "//hacker-news.firebaseio.com/v0/item/" + itemNumber + ".json";
//   return fetch(endPoint, {
//     mode: "cors"
//   }).then((response) => response.json());
// }

// const topStories = () => getTopStoriesId().then((result) => {
//     let promiseArray = [];
//     result.forEach((element) => {
//       promiseArray.push(getItem(element));
//     });

//     return Promise.all(promiseArray);
// });

// const stories = topStories().then((result) => {
//   let titleStrings = "";
//   result.forEach((element) => {titleStrings += element["title"].toLocaleUpperCase()});
//   console.log(titleStrings);
// });

</script>