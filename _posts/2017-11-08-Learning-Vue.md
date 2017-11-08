---
layout: post
title: Learning Vue
category: JavaScript
published: false
tags:
  - jekyll
  - programming
  - blog
excerpt_separator:  <!--more-->
image: https://assets-cdn.github.com/images/modules/logos_page/Octocat.png
---

<div id="app">
	{% raw  %}
		{{ message }}
	{% endraw %}
</div>

<div id="app-4">
  <ol>
    <li v-for="todo in todos">
      {{ todo.text }}
      <span v-html="todo.text"></span>
    </li>
  </ol>
</div>

<script rel="text/javascript" src="https://unpkg.com/vue"></script>
<script rel="text/javascript" src="{{ site.baseurl }}/assets/js/vue-test.js"></script>
