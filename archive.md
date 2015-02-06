---
layout: page
title: Archive
---
<script src="//code.jquery.com/jquery-1.11.1.min.js"></script>
<script src="/public/js/search.js"></script>

<input id="search_input" placeholder="Search" autofocus="autofocus" autocomplete="off" onkeyup="checkTextField();" />
<ul id="search_results">
</ul>

## History

{% for post in site.posts %}
  * {{ post.date | date: "%d %B %Y"}} &raquo; [ {{ post.title }} ]({{ post.url }})
{% endfor %}