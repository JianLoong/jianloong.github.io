---
layout: post
title: Learning Vue
category: JavaScript
tags:
  - Programming
  - Vue
  - Reddit
excerpt_separator:  <!--more-->
image: https://assets-cdn.github.com/images/modules/logos_page/Octocat.png
---

Please note that I do know that is not the correct way of using Vue. This is just me playing around. Of course, in a real life production environment there are many things that should not be done at all. 

In order to learn Vue, I made this simple demostration of how I can request the reddit API for certain subreddits.

Here, I only included Programming and Programmer Humour in the select box at the moment. Upon selected, it will query the reddit API for results. While this could have been done with jQuery, I decided that I wanted to learn how to use Vue instead. I do know that you can even do this with basic JavaScript, however the intention of this post is to understand how VueJS work with regards to the bindings and etc.

Even though the implemention seems simple, it actually took a while to understand the concepts behind it.

I even tried looking at React, in the end I decided that Vue would be the choice for me for several reasons. To me, React seems very messy, and it is hard for the to think in the "React" way. 

<!--more-->

<div id="app">
<select v-model="selected" v-on:change="selectSubreddit">
  <option disabled value="">Please select one</option>
  <option>Programming</option>
  <option>ProgrammerHumor</option>
</select>

<ul>
  <li v-for="result of results">
      {% raw  %}
        <a v-bind:href="result.data.url"> {{ result.data.title }}</a>
      {% endraw %}
  </li>
  </ul>
</div>

The JavaScript file itself is below. Here, I am using the axios library to perform the get request. 

````javascript
var app = new Vue({
  el: '#app',
  data: {
    results : [],
    errors: [],
    selected: ''
  },

  methods: {
    selectSubreddit() {
      axios.get("https://www.reddit.com/r/" + this.selected + ".json")
        .then(response => {
          // JSON responses are automatically parsed.
          this.results = response.data.data.children
        })
        .catch(e => {
          this.errors.push(e)
        })
    }
  }
});
````

For the HTML front end, since I am actually using Jekyll to generate static elements for this blog, I needed to introduce &#123;% raw and endraw %&#125; tags. I am also loading the required libraries with CDN for now. 

````html
<div id="app">
<select v-model="selected" v-on:change="selectSubreddit">
  <option disabled value="">Please select one</option>
  <option>Programming</option>
  <option>ProgrammerHumor</option>
</select>

<ul>
  <li v-for="result of results">
      {% raw  %}
        <a v-bind:href="result.data.url"> {{ result.data.title }}</a>
      {% endraw %}
  </li>
  </ul>
</div>

<!-- Production -->
<script rel="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.1/vue.min.js"></script>
<!-- Dev -->
<!-- <script rel="text/javascript" src="https://unpkg.com/vue"></script> -->
<script rel="text/javaScript" src="https://unpkg.com/vue-resource@1.3.4/dist/vue-resource.min.js"></script>
<script rel="text/javaScript" src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script rel="text/javascript" src="{{ site.baseurl }}/assets/js/vue-test.js"></script>

````

<!-- Production -->
<script rel="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.1/vue.min.js"></script>
<!-- Dev -->
<!-- <script rel="text/javascript" src="https://unpkg.com/vue"></script> -->
<script rel="text/javaScript" src="https://unpkg.com/vue-resource@1.3.4/dist/vue-resource.min.js"></script>
<script rel="text/javaScript" src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script rel="text/javascript" src="{{ site.baseurl }}/assets/js/vue-test.js"></script>

