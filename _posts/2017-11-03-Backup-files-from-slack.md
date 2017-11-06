---
layout: post
title: Backup Files From Slack
category:
  - Shell Scripts
tags:
  - Slack
  - Shell Script
  - jq
  - curl
excerpt_separator:  <!--more-->
image: https://assets-cdn.github.com/images/modules/logos_page/Octocat.png
---

This was a simple shell script I wrote to allow the download of files that users send on public channels on Slack. The reason this was done was because...

##### Flashback last year...
Person A - Hey, are you busy?

Me - Nah, wassup?

Person A - Well, our Slack has been telling us to pay them......Could you like backup the files?

Me - Sure, OK. 

Hours later.....

![Alt text](/assets/images/running.png){:class="img-smaller"}

<!--more-->

Requirements for the script are as follows.


| Requires | Description                            |
|:---------|:---------------------------------------|
| jq       | Command Line JSON parser               |
| cURL     | Tool  to transfer data from the server |


If you do not have these or know about them, I highly suggest to go about learning what these are first before even attempting this.


So, I came to the conclusion that the easiest way I could do it is just to write a simple shell script to do it. What can an easier way be? Spend 5 hours reading their API? Writing a Java / Python or C# program? Nope.

My idea was pretty simple, I am going to check out some of the REST API end points and then look at the files that can be downloaded, then I am going to use cURL or WGET to ninja all of it at one go.

The shell script is provided at my repository. The script itself can be improved in many ways but it was meant to be something simple to begin with.

The first step itself is pretty simple. You will need to obtain a XOXP token. You obviously need some rights to obtain this token. Mind you this was 1 year ago. So, you can say that this post is delayed for 1 year. Woohoo.

My plan was just to use a cron to run the script everyday so that backup happens. Easy mode.

Obtaining the XOXP token is a simple step. You will need to generate a "legacy" token. Because, hey anything older than a year is legacy these days! On a more serious note, there is obviously a reason for it being called legacy.

[Token found here](https://api.slack.com/custom-integrations/legacy-tokens){:class="img-smaller"}

![Legacy Token Generator](/assets/images/legacy_token_generator.png){:class="img-smaller"}

You will need to select your work space and generate a XOXP token for it. 

<script src="https://gist.github.com/JianLoong/3221f6e6acf46ed2ea0a249d04b67d51.js"></script>


After that comes the fun part! 

Because I decided going through the entire API to find the actual way to download the file to be rather cumbersome and Mr. Google and Mr. Stackoverflow showed no promising way to do it, I decided to spoof my browser headers to download the image.

The idea itself is quite simple. 

I am going to go to the URL on my browser then look at the inspect tool to see the headers.

What I noticed is that the files in Slack follow a very simple URL pattern.

<code>
https://files.slack.com/files-pri/SOMETHING/FILE_NAME.png
</code>

So what I just need to do is first get all these URL and then do a curl for them.

<script src="https://gist.github.com/JianLoong/18135bb51bfea3093f95133468d278a6.js"></script>

What you will notice is that, if you run the script now, the value temp will actually tell you all the URLs of the files. So, the idea of it now is that you can look at the URL from your browser. Of course you will need to be logged on to Slack on your browser to view it. Once you open the inspect tool, you would be able to copy and paste the headers just like the screen shot below. This is under the network tab.

![Alt text](/assets/images/url-header-slack.png){:class="img-smaller"}

After that, you will need to put that line in the correct place with the correct url.

In order to run the script, you will need to give it execute permission. Then, it should download all of the files into that directory.