---
title: "Sentiment Analysis using VADER in JavaScript"
date: 2022-10-20
tags: ["Sentiment Analysis", "JavaScript"]
ShowReadingTime: true
cover:
  image: "/images/vader.png"
---
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.1/jquery.min.js" integrity="sha512-aVKKRRi/Q/YV+4mjoKBsE4x3H+BkegoM/em46NNlCqNTmUYADjBbeNefNxYV7giUp0VxICtqdrbqU7iVaeZNXA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>

This post is a simple implementation of how to use the VADER sentiment analysis on a paragraph.

<div>
    <hr>
    <label for="targetString">Enter text to be analysed: </label> 
    <p></p>
    <div id="textwrapper">
      <textarea rows="10" id="inputString" autocomplete="off" placeholder="" value="">Sentiment analysis studies the subjective information in an expression, that is, the opinions, appraisals, emotions, or attitudes towards a topic, person or entity. Expressions can be classified as positive, negative, or neutral. For example: I really like the new design of your website!
      </textarea>
    </div>
    <hr>
</div>

<button type="button" id="run" class="button">Run</button>

#### Results

<table style="" class="result-table table table-bordered table-striped mb-0">
    <tr><th>Negative</th><th>Positive</th><th>Compound</th>
    <tbody class="result"></tbody>
</table>

<script>

if (window.Worker) {
  const myWorker = new Worker("/posts/vader-worker.js");
  const button = document.getElementById("run");
  const result = document.querySelector(".result");

  
  const entry = document.querySelector("#inputString");

  let isResultTableShown = false;


  button.onclick = function() {
    if (entry.value == "")
        return;
    console.log("Test")
    myWorker.postMessage(entry.value);
  }


  myWorker.onmessage = function(e) {
  console.log("finished")
  console.log(e)
      
  let text = result.innerHTML;
  result.innerHTML = "<tr><td>" + e.data.neg + "</td><td>" + e.data.pos + "</td><td>" + e.data.compound+"</td</tr>";

  if (isResultTableShown == false){
    isResultTableShown = true;
    $(".result-table").show();
  }
  }
}

</script>
<style>

#targetString {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: 1px solid black;
  color: green
}

#inputString {
    width: 100%;
    border:1px solid black;
}

.textwrapper
{
  border:1px solid #999999;
  margin:5px 0;
  padding:3px;
}

textarea{
  color: inherit;
}

table {
    display: table;
    width:100%;
}
</style>

## References

Cjhutto CJHUTTO/Vadersentiment: Vader sentiment analysis. vader (valence aware dictionary and sentiment reasoner) is a lexicon and rule-based sentiment analysis tool that is specifically attuned to sentiments expressed in social media, and works well on texts from other domains., GitHub. Available at: https://github.com/cjhutto/vaderSentiment (Accessed: October 20, 2022). 

Hutto, C.J. & Gilbert, E.E. (2014). VADER: A Parsimonious Rule-based Model for Sentiment Analysis of Social Media Text. Eighth International Conference on Weblogs and Social Media (ICWSM-14). Ann Arbor, MI, June 2014.

