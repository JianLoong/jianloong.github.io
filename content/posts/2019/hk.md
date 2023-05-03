---
title: "Sentiment analysis for the subreddit Hong Kong"
date: 2019-10-13T20:56:02+11:00
tags: ["Reddit", "Chart", "Visualisation", "Hong Kong", "Percentage"]
ShowReadingTime: true
cover:
  image: "/images/sentimentanalysis.png"
---

<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
<script src="https://unpkg.com/frappe-charts@1.1.0/dist/frappe-charts.min.iife.js"></script>

### Sentiment Analysis for the Sub-Reddit "HongKong"

This post will perform **sentiment analysis** using AFINN. AFINN is a list of words rated for valence rated with an integer between minus five(negative) and plus five (positive). This implementation uses ***AFINN-en-165***. <sup>[1](#1)</sup>

This approach however is very naive as it does not build any models to determine the context of the usage of the word itself.

Please note that the posts here are generated based on the Reddit website by doing `GET` requests. So, it is based on their current entries. So, it will be **refreshed** when the page is reloaded.

#### References

<a name="1">1</a>. [AFINN Sentiment Analysis](https://darenr.github.io/afinn/)


<div class="result"></div>

<script src="/posts/afinn-111.js"></script>

<script>


var stopWords = [
  'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
  'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
  'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
  'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
  'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
  'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i', 'its', 'why'
];

// https://stackoverflow.com/questions/5631422/stop-word-removal-in-javascript

let parseResult = (link) => {
    const endPoint = "https://reddit.com" + link + ".json?limit=100&jsonp=?";
    let replies = "";
    let noOfReplies = 0;

    $.getJSON(endPoint, function(data){
        let title = (data[0].data.children[0].data["title"]);
        replies = data[1]["data"].children;
        let url = "https://reddit.com" + link;
        noOfReplies = replies.length;
        let repliesText = "";

        
        let result = {
            "id" : data[0].data.children[0].data["id"],
            "url": url,
            "title": title,
            "negative": 0,
            "neutral": 0,
            "positive": 0
        }

        for (let i = 0; i < noOfReplies; i++) {
            let reply = replies[i]["data"].body;
            let score = buildFreq(reply);
            
            switch (true){
                case score == 0:
                    result["neutral"] = result["neutral"] + 1;
                    break;
                case score > 0:
                    result["positive"] = result["positive"] + 1;
                    break;
                case score < 0:    
                    result["negative"] = result["negative"] + 1;
                    break;                    
            }

        }

        if (result["negative"] == 0 && result["positive"] == 0 && result["neutral"] == 0)
            return;
        showResult(result);
    });
}

let showResult = (jsonResult) => {
    let output = "<strong>" + jsonResult["title"] + "</strong>";    
    let out = output + "<p><a id=" + jsonResult["id"] + "_link> Click here</a> to view post in context.</p>";

    $(".result").append("<div class = 'shadow'>" + out +"<div id=" + jsonResult["id"] + "></div></div>");
    $("#" + jsonResult["id"] + "_link").prop("href", jsonResult["url"]);
    $(".result").append("<p></p>");

    let id = "" + jsonResult["id"];
    const data = {
                labels: ["Positive","Negative","Neutral"],
                datasets: [
                    {
                        name: "data",
                        charType: "percentage",
                        values: [
                            jsonResult["positive"],
                            jsonResult["negative"],
                            jsonResult["neutral"]
                        ]
                    }
                    
                ]
            }


    const pos = document.getElementById(id);
    const chart = new frappe.Chart(pos, {
        data: data,
        type: 'percentage',
        colors: ['#33691e', '#b71c1c','#e8eaf6']
    })
}

let buildFreq = (repliesText) => {
    if (repliesText === undefined)
        return 0;
    let convert = repliesText.replace(/[^\w\s]/gi, '').toLowerCase().split(" ");
    let totalScore = 0;
    for(let i = 0; i < convert.length; i++) {
        let currentWord = convert[i];
        totalScore += afinn[currentWord] || 0;
    }
    //console.log(totalScore);

    return totalScore;
}

let getPost = () => {
    let result = "";
    let entries = [];
    let endPoint = "https://reddit.com/r/hongkong.json?limit=30&jsonp=?"
    $.getJSON(endPoint, function(data){
        result = data;
        entries = result["data"].children;
        for(let i = 0; i < entries.length; i++){
            let link = (entries[i]["data"]["permalink"]);
            parseResult(link)
        }
    });
}

getPost();

</script>

<style>
.shadow {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    padding-right: 1em;
    padding-left: 1em;
    padding-top: 1em;
}
</style>

The codes to achieve it are as follows

```javascript

var stopWords = [
  'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
  'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
  'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
  'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
  'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
  'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i', 'its', 'why'
];

// https://stackoverflow.com/questions/5631422/stop-word-removal-in-javascript

let parseResult = (link) => {
    const endPoint = "https://reddit.com" + link + ".json?limit=100&jsonp=?";
    let replies = "";
    let noOfReplies = 0;

    $.getJSON(endPoint, function(data){
        let title = (data[0].data.children[0].data["title"]);
        replies = data[1]["data"].children;
        let url = "https://reddit.com" + link;
        noOfReplies = replies.length;
        let repliesText = "";

        
        let result = {
            "id" : data[0].data.children[0].data["id"],
            "url": url,
            "title": title,
            "negative": 0,
            "neutral": 0,
            "positive": 0
        }

        for (let i = 0; i < noOfReplies; i++) {
            let reply = replies[i]["data"].body;
            let score = buildFreq(reply);
            
            switch (true){
                case score == 0:
                    result["neutral"] = result["neutral"] + 1;
                    break;
                case score > 0:
                    result["positive"] = result["positive"] + 1;
                    break;
                case score < 0:    
                    result["negative"] = result["negative"] + 1;
                    break;                    
            }

        }

        if (result["negative"] == 0 && result["positive"] == 0 && result["neutral"] == 0)
            return;
        showResult(result);
    });
}

let showResult = (jsonResult) => {
    let output = "<strong>" + jsonResult["title"] + "</strong>";    
    let out = output + "<p><a id=" + jsonResult["id"] + "_link> Click here</a> to view post in context.</p>";

    $(".result").append("<div class = 'shadow'>" + out +"<div class='' id=" + jsonResult["id"] + "></div></div>");
    $("#" + jsonResult["id"] + "_link").prop("href", jsonResult["url"]);
    $(".result").append("<p></p>");

    let id = "#" + jsonResult["id"];
    const data = {
                labels: ["Positive","Negative","Neutral"],
                datasets: [
                    {
                        name: "data",
                        charType: "percentage",
                        values: [
                            jsonResult["positive"],
                            jsonResult["negative"],
                            jsonResult["neutral"]
                        ]
                    }
                    
                ]
            }

    const chart = new frappe.Chart(id, {
        data: data,
        type: 'percentage',
        colors: ['#33691e', '#b71c1c','#e8eaf6']
    })
}

let buildFreq = (repliesText) => {
    if (repliesText === undefined)
        return 0;
    let convert = repliesText.replace(/[^\w\s]/gi, '').toLowerCase().split(" ");
    let totalScore = 0;
    for(let i = 0; i < convert.length; i++) {
        let currentWord = convert[i];
        totalScore += afinn[currentWord] || 0;
    }
    //console.log(totalScore);

    return totalScore;
}

let getPost = () => {
    let result = "";
    let entries = [];
    let endPoint = "https://reddit.com/r/hongkong.json?limit=30&jsonp=?"
    $.getJSON(endPoint, function(data){
        result = data;
        entries = result["data"].children;
        for(let i = 0; i < entries.length; i++){
            let link = (entries[i]["data"]["permalink"]);
            parseResult(link)
        }
    });
}

getPost();
```