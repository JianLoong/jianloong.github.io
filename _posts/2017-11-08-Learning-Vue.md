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

In order to learn Vue, I made this simple demostration of how I can request the reddit API for certain subreddits.
Here, I only included Programming and Programmer Humour. Upon, selected, it will query the reddit API for results. While this could have been done with jQuery, I decided that I wanted to learn how to use Vue instead.

Even though the implemention seems simple, it actually took a while to understand the concepts behind it.

I even tried looking at React, in the end I decided that Vue would be the choice for me for several reasons. To me, React seems very messy, and it is hard for the to think in the "React" way.


<div id="app" class="table">
<select v-model="selected">
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

<script rel="text/javascript" src="https://unpkg.com/vue"></script>
<script rel="text/javaScript" src="https://unpkg.com/vue-resource@1.3.4/dist/vue-resource.min.js"></script>
<script rel="text/javaScript" src="https://unpkg.com/axios/dist/axios.min.js"></script>
<script rel="text/javascript" src="{{ site.baseurl }}/assets/js/vue-test.js"></script>

<!--more-->