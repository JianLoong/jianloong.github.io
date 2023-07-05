// builds lunr
var index = lunr(function () {
  this.field('title')
  this.field('content', {boost: 10})
  this.field('category')
  this.field('tags')
  this.ref('id')
});

index.add({
  title: "Static Factory Methods in Java",
  category: "Java",
  content: "One of the must read books for Java programmers is Effective Java by Joshua Bloch. The 3rd edition has just been released couple months ago. I know quite a number of people have been eagerly waiting for its release.\n\nI have been programming Java for a fairly long time. I still remember learning it via self taught from a website called Java with Passion back in 2009. The person who runs it at that time was Sang Shin. He currently works at Pivotal There was even a Google Group created for discussion purposes. Back then, programming was still new to me and for me, it was mainly because I was interested in computers and how programs work in general.\n\nAnyways, back to the main topic, in this day and age, everyone claims to know Java. I mean of course, they do. But the main issue here is, how does a person determine the difference between a new Java programmer and someone who has been doing it for a long time. Cough, of course I know there are certifications like OCA and OJP out there. The main issue here is that for these certifications, one can “study” for it and most of the times it doesn’t become something ingrained within them.\n\nBut Java itself is a huge, and there are many ways to tackle a problem. In my opinion, one thing that every programmer should always know is regarding good practices. The problem with good practices, its that it is hard to teach good practices, as this is something that can only be gained over time.\n\nFor now, enough of the rant. let’s see some examples from the book.\n\n\n\nOne of the major problems when you work in education is that over time, your programming skills go down. This is quite evident as most of the time, it is not required as it is more important to be a good researcher in comparison to being a good programmer.\n\nBack to static factory methods now.\n\nA static factory method is simply a static method that returns an instance of the class. Normally, the traditional way is to use a public constructor in order to obtain an instance of the class. If you ever used 3rd party libraries like Guava or ApacheCommons, you will notice that there is almost always a factory method in the API.\n\nAn example of a static factory method is as follows. Notice that it returns a Boolean object.\n\npublic static Boolean valueOf(boolean b) {\n\treturn b ? Boolean.TRUE : Boolean.FALSE;\n}\n\n\nAdvantages of static factory methods are as follows\n\n  unlike constructors, static method have names\n  unlike constructors, they are not required to create a new object each time they are invoked. Notice that in the example, the new keyword was not used.\n  unlike constructors, they can return an object of any subtype of their return type.\n  the class of the returned object can vary from call to call as a function of the input parameters.\n  the class of the returned object need not exist when the class containing the method is written\n\n\nLimitations\n\n  classes without public or protected constructors cannot be subclassed\n  they are hard for programmers to find (Debatable)\n\n\nWell, this is just a summary it is high recommended to read the book instead. This post will be updated soon.\n\nLet’s look at the first one.\n\nStatic methods have names\n\nOne of the issues with code readability in Java is that there can be multiple constructors with different signatures and often times, people reading the code will have no idea what it does without reading the API. With static methods, however, you can put a more meaningful name. Thus, in a way your code will not only be cleaner it will also be more meaningful to the reader.\n\nMore updates soon\n",
  tags: [],
  id: 0
});
index.add({
  title: "Thinking in React",
  category: "React",
  content: "I still remember during my undergraduate days, I took an elective called Web Development. In it, I was taught how to use HTML, JS as well as PHP. I still remember my lecturer for that unit as he was one of the best lecturers I have ever had.\n\nOne thing that I remember is that I was told that we should always try to separate the JavaScript from the HTML. My teammate and I spend very long time just to figure out how to validate a simple form with JavaScript. Of course, the JavaScript was not inline :). Mind you, these were the days Mr Stack Overflow and Mr Google did not readily provide everything for you.\n\nSince then, I always followed the concept where there should never be inline scripts within HTML. However, it is now evident that, this might the old style of thinking. React uses something called JSX, and it is the most mind boggling thing I have seen. Well, it is mind boggling to me. JSX mixes both HTML and JS together. At first glance, it looks like something out of the 80s horror movies.\n\nWhy on earth would someone do that? Is there a reasoning behind this insanity? According to the React documentation it is stated that;\n\n\n\n\n  React is, in our opinion, the premier way to build big, fast Web apps with JavaScript. It has scaled very well for us at Facebook and Instagram\n\n\nOne key point that React states is that instead of separating technologies by putting the markup and logic in separate files, React separates concerns with loosely coupled units called components.\n\nThis is a very interesting notion. All this while, most developers considered the separation of the markup and logic to be good practise. However, since I am an old school (developer) according to my friend, he said that it will take some time for me to be comfortable doing things the React way. In actual fact, I would say React actually redefined, on how we develop modern applications. The video below explains why.\n\n\n\n\n\n\nThe video itself was back 2013, and since then it seems a huge number of companies have adopted React.\n\nBesides that, I also stumbled upon a good article regarding React. In it, it is stated that, what React did really well was it brought immutable UIs to the masses, in which you never mutate the UI you always re-render it. React in a sense changed the way, we think about building UIs.\n\nThat being said, however I do not have enough experience in development of React apps to actually really understand the benefits or drawbacks.\n\nReferences\n\n\n  https://reactjs.org/docs/introducing-jsx.html\n  https://www.codementor.io/radubrehar/thinking-in-react-8duata34n\n\n\n",
  tags: [],
  id: 1
});
index.add({
  title: "Is Login A Use Case?",
  category: "Use Case",
  content: "When dealing with system use case diagrams, a question that often pops up is the notion whether login is a use case? There are various train of thoughts regarding this matter.\n\nIn my opinion, the answer to this question is in fact, really simple. Of course, login is a use case. However, the main question that comes into play now, is whether login is a functional or non-functional requirement. A functional requirement describes what a software system should do while a non-functional requirement place constraint on how the system will do so.\n\nThe question now becomes, which category does login fall into in your system? Well, this answer depends on what system you are designing a use case diagram for. If you are designing an authentication and authorization system, of course login is a use case, but what happens if you are not?\n\n\n\nIn a normal system, do you consider putting login as a use case in your system use case diagram? For example, if you are designing the system use case diagram for a site like eBay, do you put login as a use case? While, there is nothing wrong with putting login a use case, it creates needless complications. Why is this so? Think of it this way, if you are planning to introduce login, there is a high chance that several other use cases will use the include and extends notion to relate to this use case. If that is done, it would increase the complexity use case diagram itself.\n\nHowever, it would be better if login is not considered as a use case. Login should be treated as a non-functional requirement. In this case, based on ISO/IEC 9126 standards, login will fall under security requirements.\n\nIn actual fact, this is actually true because;\n\nA user will never want to login.\n\nA login barrier creates unnecessary burden to the user. The login use case often prevents the user from accomplishing a goal. The only reason it is present is because it is needed for security reasons.\n\nIn a perfect world, a user will never need to login, as the login process creates another step to accomplish a goal. This step is tedious and troublesome. Why do you want to trouble a user to login, a step in which has no value added to it? In fact, if you noticed, these days, most modern system often attempts to skip the login process.\n\nFor example, most online shopping system these days allows the user to purchase an item without the need of login. Why is this so? The answer is simple. The main information required for a user to purchase an item online is the delivery address and of course how they should pay for the item. Any other information is pointless in accomplishing the use case. There is not a need for the user to login into the system.\n\nIn short, login is a non-functional requirement and should not be in the system use case diagram. While, there is nothing wrong with modelling it, it would be better if it was not in the system use case diagram. These days, the process of authentication and authorization is often left to external parties for example the use of Google OAuth or even Auth0. By doing this as well, the system use case diagram will be much cleaner and effective to convey the needed information.\n\nHowever, at the end of the day, the most important factor is message that is present in the model. If a reader would be able to understand the diagram without difficulties, the goal of the use case diagram has been accomplished.\n\nReferences\n\n\n  https://en.wikipedia.org/wiki/ISO/IEC_9126\n  https://stackoverflow.com/questions/16475979/what-is-the-difference-between-functional-and-non-functional-requirement\n\n",
  tags: [],
  id: 2
});
index.add({
  title: "Learning Vue",
  category: "JavaScript",
  content: "Please note that I do know that is not the correct way of using Vue. This is just me playing around. Of course, in a real life production environment there are many things that should not be done at all.\n\nIn order to learn Vue, I made this simple demonstration of how I can request the reddit API for certain subreddits.\n\nHere, I only included Programming and Programmer Humour in the select box at the moment. Upon selected, it will query the reddit API for results. While this could have been done with jQuery, I decided that I wanted to learn how to use Vue instead. I do know that you can even do this with basic JavaScript, however the intention of this post is to understand how VueJS work with regards to the bindings and etc.\n\nEven though the implementation seems simple, it actually took a while to understand the concepts behind it.\n\nI even tried looking at React, in the end I decided that Vue would be the choice for me for several reasons. To me, React seems very messy, and it is hard for the to think in the “React” way.\n\n\n\n\n\n  Please select one\n  Programming\n  ProgrammerHumor\n\n\n\n  \n      \n         {{ result.data.title }}\n      \n  \n  \n\n\nThe JavaScript file itself is below. Here, I am using the axios library to perform the get request.\n\nvar app = new Vue({\n  el: '#app',\n  data: {\n    results : [],\n    errors: [],\n    selected: ''\n  },\n\n  methods: {\n    selectSubreddit() {\n      axios.get(\"https://www.reddit.com/r/\" + this.selected + \".json\")\n        .then(response =&gt; {\n          // JSON responses are automatically parsed.\n          this.results = response.data.data.children\n        })\n        .catch(e =&gt; {\n          this.errors.push(e)\n        })\n    }\n  }\n});\n\n\nFor the HTML front end, since I am actually using Jekyll to generate static elements for this blog, I needed to introduce {% raw and endraw %} tags. I am also loading the required libraries with CDN for now.\n\n&lt;div id=\"app\"&gt;\n&lt;select v-model=\"selected\" v-on:change=\"selectSubreddit\"&gt;\n  &lt;option disabled value=\"\"&gt;Please select one&lt;/option&gt;\n  &lt;option&gt;Programming&lt;/option&gt;\n  &lt;option&gt;ProgrammerHumor&lt;/option&gt;\n&lt;/select&gt;\n\n&lt;ul&gt;\n  &lt;li v-for=\"result of results\"&gt;\n      \n        &lt;a v-bind:href=\"result.data.url\"&gt; {{ result.data.title }}&lt;/a&gt;\n      \n  &lt;/li&gt;\n  &lt;/ul&gt;\n&lt;/div&gt;\n\n&lt;!-- Production --&gt;\n&lt;script rel=\"text/javascript\" src=\"https://cdnjs.cloudflare.com/ajax/libs/vue/2.5.1/vue.min.js\"&gt;&lt;/script&gt;\n&lt;!-- Dev --&gt;\n&lt;!-- &lt;script rel=\"text/javascript\" src=\"https://unpkg.com/vue\"&gt;&lt;/script&gt; --&gt;\n&lt;script rel=\"text/javaScript\" src=\"https://unpkg.com/vue-resource@1.3.4/dist/vue-resource.min.js\"&gt;&lt;/script&gt;\n&lt;script rel=\"text/javaScript\" src=\"https://unpkg.com/axios/dist/axios.min.js\"&gt;&lt;/script&gt;\n&lt;script rel=\"text/javascript\" src=\"/assets/js/vue-test.js\"&gt;&lt;/script&gt;\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n",
  tags: ["Programming","Vue","Reddit"],
  id: 3
});
index.add({
  title: "Backup Files From Slack",
  category: ["Shell Scripts"],
  content: "This was a simple shell script I wrote to allow the download of files that users send on public channels on Slack. The reason this was done was because…\n\nFlashback last year…\nPerson A - Hey, are you busy?\n\nMe - Nah, wassup?\n\nPerson A - Well, our Slack has been telling us to pay them……Could you like backup the files?\n\nMe - Sure, OK.\n\nHours later…..\n\n\n\n\n\nRequirements for the script are as follows.\n\n\n  \n    \n      Requires\n      Description\n    \n  \n  \n    \n      jq\n      Command Line JSON parser\n    \n    \n      cURL\n      Tool  to transfer data from the server\n    \n  \n\n\nIf you do not have these or know about them, I highly suggest to go about learning what these are first before even attempting this.\n\nSo, I came to the conclusion that the easiest way I could do it is just to write a simple shell script to do it. What can an easier way be? Spend 5 hours reading their API? Writing a Java / Python or C# program? Nope.\n\nMy idea was pretty simple, I am going to check out some of the REST API end points and then look at the files that can be downloaded, then I am going to use cURL or WGET to ninja all of it at one go.\n\nThe shell script is provided at my repository. The script itself can be improved in many ways but it was meant to be something simple to begin with.\n\nThe first step itself is pretty simple. You will need to obtain a XOXP token. You obviously need some rights to obtain this token. Mind you this was 1 year ago. So, you can say that this post is delayed for 1 year. Woohoo.\n\nMy plan was just to use a cron to run the script everyday so that backup happens. Easy mode.\n\nObtaining the XOXP token is a simple step. You will need to generate a “legacy” token. Because, hey anything older than a year is legacy these days! On a more serious note, there is obviously a reason for it being called legacy.\n\nToken found here\n\n\n\nYou will need to select your work space and generate a XOXP token for it.\n\n\n\nAfter that comes the fun part!\n\nBecause I decided going through the entire API to find the actual way to download the file to be rather cumbersome and Mr. Google and Mr. Stackoverflow showed no promising way to do it, I decided to spoof my browser headers to download the image.\n\nThe idea itself is quite simple.\n\nI am going to go to the URL on my browser then look at the inspect tool to see the headers.\n\nWhat I noticed is that the files in Slack follow a very simple URL pattern.\n\n\nhttps://files.slack.com/files-pri/SOMETHING/FILE_NAME.png\n\n\nSo what I just need to do is first get all these URL and then do a curl for them.\n\n\n\nWhat you will notice is that, if you run the script now, the value temp will actually tell you all the URLs of the files. So, the idea of it now is that you can look at the URL from your browser. Of course you will need to be logged on to Slack on your browser to view it. Once you open the inspect tool, you would be able to copy and paste the headers just like the screen shot below. This is under the network tab.\n\n\n\nAfter that, you will need to put that line in the correct place with the correct url.\n\nIn order to run the script, you will need to give it execute permission. Then, it should download all of the files into that directory.\n",
  tags: ["Slack","Shell Script","jq","curl"],
  id: 4
});
index.add({
  title: "Revival of Blog.",
  category: "Blog",
  content: "After being abandoned for 3 years, I have decided to actually revive this blog.\n\nIt would be a good idea to put some thoughts into words as well as sharing my programming experience to others.\n\nIt seems that just in the time of 3 years, JavaScript has taken over the world. I can still remember back then when everyone considers JavaScript to be the worst language of them all. My old professor said to me that, JavaScript component should always be loaded last and you should never use innerHTML inside your scripts. Apparently, that is all not true these days…….\n\nOh well, more post to come.\n\n\n",
  tags: ["jekyll","programming","blog"],
  id: 5
});
console.log( jQuery.type(index) );
// builds reference data
var store = [{
  "title": "Static Factory Methods in Java",
  "link": "/java/2018/04/08/Effective-Java-Static-Factory-Methods/",
  "image": "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  "date": "April 8, 2018",
  "category": "Java",
  "excerpt": "One of the must read books for Java programmers is Effective Java by Joshua Bloch. The 3rd edition has just..."
},{
  "title": "Thinking in React",
  "link": "/react/2018/04/04/Thinking-in-React/",
  "image": "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  "date": "April 4, 2018",
  "category": "React",
  "excerpt": "I still remember during my undergraduate days, I took an elective called Web Development. In it, I was taught how..."
},{
  "title": "Is Login A Use Case?",
  "link": "/use%20case/2018/04/02/Is-Login-A-Use-Case/",
  "image": "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  "date": "April 2, 2018",
  "category": "Use Case",
  "excerpt": "When dealing with system use case diagrams, a question that often pops up is the notion whether login is a..."
},{
  "title": "Learning Vue",
  "link": "/javascript/2017/11/08/Learning-Vue/",
  "image": "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  "date": "November 8, 2017",
  "category": "JavaScript",
  "excerpt": "Please note that I do know that is not the correct way of using Vue. This is just me playing..."
},{
  "title": "Backup Files From Slack",
  "link": "/shell%20scripts/2017/11/03/Backup-files-from-slack/",
  "image": "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  "date": "November 3, 2017",
  "category": ["Shell Scripts"],
  "excerpt": "This was a simple shell script I wrote to allow the download of files that users send on public channels..."
},{
  "title": "Revival of Blog.",
  "link": "/blog/2017/10/30/More-updates-soon/",
  "image": "https://assets-cdn.github.com/images/modules/logos_page/Octocat.png",
  "date": "October 30, 2017",
  "category": "Blog",
  "excerpt": "After being abandoned for 3 years, I have decided to actually revive this blog. It would be a good idea..."
}]
// builds search
$(document).ready(function() {
  $('input#search').on('keyup', function () {
    var resultdiv = $('#results');
    // Get query
    var query = $(this).val();
    // Search for it
    var result = index.search(query);
    // Show results
    resultdiv.empty();
    // Add status
    resultdiv.prepend('<p class="">Found '+result.length+' result(s)</p>');
    // Loop through, match, and add results
    for (var item in result) {
      var ref = result[item].ref;
      
      var searchitem = '<div class="result"><img src="'+store[ref].image+'" alt="'+store[ref].title+'" class="result-img"><div class="result-body"><a href="'+store[ref].link+'" class="post-title">'+store[ref].title+'</a><div class="post-date small">'+store[ref].category+' &times; '+store[ref].date+'</div><p>'+store[ref].excerpt+'</p></div>';
      resultdiv.append(searchitem);
    }
  });
});