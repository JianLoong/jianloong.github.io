---
title: "Promise All"
date: 2019-10-25
tags: ["JavaScript", "Promise", "API"]
---


This post is a an entry to describe a use case when the Promise.all JavaScript method is needed. The official reference can be found [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). This assumes that the reader has a basic understanding of how promises work.


Before we start, there is a need to understand how certain RESTful services are structured. For example, the Hacker News API has the end point called **topstories**. This end point however, does not contain any other information besides a list of item IDs. So, if you would like to obtain the top 10 post including their **title**, there would be a need to do several GET request to fetch them all.

```javascript
curl https://hacker-news.firebaseio.com/v0/topstories.json"
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





#### Lessons from this blog post.

- The **then** function returns a promise as well. 
- Fetch is **significantly easier** to use in comparison to its jQuery counterparts. However, considerations needs to be taken into account when using it in static sites that does not have Babel or modernizr.
- There are a lot of reasons a lot of users decided to create their own wrappers around the Hacker News API. Perhaps, it is deemed that their top stories and end up which does summary could be done in a different way. But HN itself is a very opinionated community.
- Mermaid diagrams are useful and break tags can be introduced in them.
- CORS and JSONP exist. Cors is more modern and easier to use compared to using JSONP.
- Using jQuery can make the codes very unreadable and creating call back hell easier.


### References

1. https://stackoverflow.com/questions/38180080/when-to-use-promise-all



<script>
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

// const stories = topStories().then((result) => {
//   let titleStrings = "";
//   result.forEach((element) => {titleStrings += element["title"].toLocaleUpperCase()});
//   console.log(titleStrings);
// });

</script>