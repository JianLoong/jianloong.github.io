---
title: "Hacker News Word Cloud "
date: 2019-10-14T20:56:02+11:00
draft: false
tags: ["Hacker News", "Chart", "Visualisation"]
ShowReadingTime: true
---

<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://rawgit.com/jasondavies/d3-cloud/master/build/d3.layout.cloud.js"></script>

  <div class="column" id="cloud">
  </div>
  
The word cloud generated here is based on the website hacker news.

The reason this post is; is so that it would easier to see the word that appeared the most for the day.

Even though the use of a word cloud is not exactly a good representation of occurrence, it still looks nice.

Please note that the posts here are generated based on the Hacker News API by doing `GET` requests. So, it is based on their current entries. So, it will be **refreshed** when the page is reloaded.

<script>

// Based on http://bl.ocks.org/joews/9697914 with modifications.
let words = "";
let freq = [""];
let arr = "";

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
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i', 'its', 'why', '', 'ask','hn','s'
];

// https://stackoverflow.com/questions/5631422/stop-word-removal-in-javascript

function removeStopWords(str) {
    res = []
    words = str.split(' ')
    for(i=0;i<words.length;i++) {
        if(!stopWords.includes(words[i])) {
            res.push(words[i])
        }
    }
    return(res.join(' '))
  }

//Simple animated example of d3-cloud - https://github.com/jasondavies/d3-cloud
//Based on https://github.com/jasondavies/d3-cloud/blob/master/examples/simple.html

// Encapsulate the word cloud functionality
function wordCloud(selector) {

    var fill = d3.scale.category20();

    //Construct the word cloud's SVG element
    var svg = d3.select(selector).append("svg")
        .attr("viewBox", `0 0 800 800`)
        .append("g")
        .attr("transform", "translate(400,400)");


    //Draw the word cloud
    function draw(words) {
        var cloud = svg.selectAll("g text")
                        .data(words, function(d) { return d.text; })

        //Entering words
        cloud.enter()
            .append("text")
            .style("font-family", "Impact")
            .style("fill", function(d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr('font-size', 1)
            .text(function(d) { return d.text; });

        //Entering and existing words
        cloud
            .transition()
                .duration(600)
                .style("font-size", function(d) { return d.size + "px"; })
                .attr("transform", function(d) {
                    return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                })
                .style("fill-opacity", 1);

        //Exiting words
        cloud.exit()
            .transition()
                .duration(200)
                .style('fill-opacity', 1e-6)
                .attr('font-size', 1)
                .remove();
    }

    return {


        update: function(words) {

            d3.layout.cloud().size([800, 800])
                .words(words)
                .padding(5)
                .rotate(function() { return ~~(Math.random() * 2) * 90; })
                .font("Impact")
                .fontSize(function(d) { return d.size; })
                .on("end", draw)
                .start();
        }
    }

}

function getWords(i) {
    arr = words.split(" ");
    let freq = calculateFrequency(arr);
        
    return buildResult(arr);

}
function showNewWords(vis, i) {
    i = i || 0;

    vis.update(getWords(i ++ % words.length))    
}

//Create a new instance of the word cloud visualisation.
var myWordCloud = wordCloud('#cloud');


function calculateFrequency(arr) {
  var a = [],
    b = [],
    prev;
  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }
  return [a, b];
}

function buildResult(arr) {
  let resultArr = [];
  let sum = 0;

  let total = freq[0].length | 0

  for (let i = 0; i < total; i++)
    resultArr.push({
      text: freq[0][i],
      size: freq[1][i]
    });

  let sorted = resultArr.sort((a, b) => b.size - a.size);
  sorted = sorted.slice(0, 50);
  for (let i = 0; i < sorted.length; i++) sum += sorted[i].size;

  resultArr = [];
  for (let i = 0; i < sorted.length; i++)
    resultArr.push({
      text: sorted[i]["text"],
      size: (sorted[i]["size"] / sum) * 60 + 50
    });

  return resultArr;
}

function getPage(pageNumber){
  let endPoint = "https://api.hnpwa.com/v0/news/" + pageNumber + ".json";
  return fetch(endPoint, {
    mode: "cors"
  }).then((response) => response.json())
};


function getPages(noOfPages){
  let promiseArray = [];
  for(let i = 1; i < noOfPages; i++){
      promiseArray.push(getPage(i));
  }
  return Promise.all(promiseArray);
}

function process(noOfPages){
  getPages(noOfPages)
    .then((result) => {
      let titles = [];
      for(let i = 0; i < result.length; i++) {
          //console.log(result);
          for(let a =0; a < result[i].length; a++) {
              words += " " + (result[i][a].title);
          }
      }

      words = words.replace(/[^\w\s]/gi, '');
      words = words.replace(/\d/g, '');
      words = removeStopWords(words.toLowerCase());
      arr = words.split(" ");
      freq = calculateFrequency(arr);
      showNewWords(myWordCloud);
    })
}

  const noOfPages = 20;

  process(noOfPages);

</script>

<style>


@media only screen and (min-width: 1000px)  {
  .row {
    display: flex !important;
  }
  .column {
    flex: 50% !important;
  }

}
</style>
