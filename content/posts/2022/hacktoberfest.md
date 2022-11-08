---
title: "Hacktoberfest 2022"
date: 2022-11-07T20:56:02+11:00
tags: ["JPlag", "Plagiarism", "University"]
ShowReadingTime: true
ShowCodeCopyButtons: true
cover:
  image: "/images/hacktoberfest.jpg"
draft: false
summary: Hacktoberfest 2022 Mini Project to encourage open-source contributions and remembering JavaScript
---

### Hacktoberfest 

Hacktoberfest is a month-long celebration of open-source projects, their maintainers, and the entire community of contributors. 

Over the years, I have contributed to several open source repositories on GitHub. (Starting from 2017)

{{< figure src="/images/hacktoberfest.jpg" title="" align="center">}}

<p align="center"><strong>Collection of t-Shirts rewarded from Hacktoberfest for open source contributions</strong></p>

For this year, I decided to do something a bit different. After not feeling well for the past years, and only recently feeling better, I decided to make a simple open source project. The project can be found [here](https://github.com/JianLoong/word-cloud-generator)

On the outside, it is just a word cloud generator, but actually there are more things happening behind the scenes instead of just making a word cloud. I will also note down the various things that I have learn to make this simple project.

{{< figure src="/images/wcg.png" title="" align="center">}}

<p align="center"><strong>A generated word cloud based on a sample article from Wikipedia.</strong></p>


Breakdown of tools and concepts used

- ``gh-pages`` will be used to deploy the project
- ``d3`` and ``d3-cloud`` will be used to draw the word cloud
- Bootstrap 5 is used to achieve a simple responsive web design. (Instead of needing make my own flex-boxes)
- Web-workers will be used to do text-processing behind the scenes so that it will not make the page unresponsive
- Natural language processing libraries will also be used to ease the task of tokenization and lemmatizations

Overall, here are some notable lessons I learnt from doing this project

- Bootstrap 5 is still very nice to use and since they have removed jQuery as dependency the library is so much lighter now.
- The ``d3-cloud`` library needs to be modified slightly if you are planning to make multiple diagrams because of the a warning that may appear. A better library to use would probably the ``ChartJS`` word-cloud library.
- Web-workers are very important to offload processes that may take a long time
- The HTML select element does not allow child nodes, and if you like to display imagines inside it, you need ways to get around that.
  
After, I completed the base of the project, I opened up several issues and mark them up for the community to help and contribute it. Even thought admittedly, the project was done in a hurry and lots of things could have been done better, I treated it as a learning approach where I continue to improve upon it.

### Ending words...

I personally feel that, after you have been working in education for a long time and soon after falling sick, you are behind in a lot of things since the field of IT is always improving and changing at a pace that is astounding. This blog entry not only works as a simple challenge for myself but also to remember that learning is part of life, and when we stop learning, we stop improving.

That being said though, being of good health plays a major factor towards learning as well as the morale that is needed for self improvement and learning.

Please also do checkout my word cloud generator [here](https://jianliew.me/word-cloud-generator/).

As always, I am always open to discussions and ways to improve upon it.