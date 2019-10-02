---
layout: post
title: Thinking in React 
category: React
excerpt_separator:  <!--more-->
image: https://assets-cdn.github.com/images/modules/logos_page/Octocat.png
---

I still remember during my undergraduate days, I took an elective called Web Development. In it, I was taught how to use HTML, JS as well as PHP. I still remember my lecturer for that unit as he was one of the best lecturers I have ever had.

One thing that I remember is that I was told that we should always try to separate the JavaScript from the HTML. My teammate and I spend very long time just to figure out how to validate a simple form with JavaScript. Of course, the JavaScript was not inline :). Mind you, these were the days Mr Stack Overflow and Mr Google did not readily provide everything for you. 

Since then, I always followed the concept where there should never be inline scripts within HTML. However, it is now evident that, this might the old style of thinking. React uses something called [JSX](https://reactjs.org/docs/introducing-jsx.html), and it is the most mind boggling thing I have seen. Well, it is mind boggling to me. JSX mixes both HTML and JS together. At first glance, it looks like something out of the 80s horror movies.

Why on earth would someone do that? Is there a reasoning behind this insanity? According to the React documentation it is stated that;

<!--more-->

> React is, in our opinion, the premier way to build big, fast Web apps with JavaScript. It has scaled very well for us at Facebook and Instagram

One key point that React states is that instead of separating **technologies** by putting the markup and logic in separate files, React separates **concerns** with loosely coupled units called components. 

This is a very interesting notion. All this while, most developers considered the separation of the markup and logic to be good practise. However, since I am an old school (developer) according to my friend, he said that it will take some time for me to be comfortable doing things the **React** way. In actual fact, I would say React actually redefined, on how we develop modern applications. The video below explains why.

<style>.embed-container { position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; } .embed-container iframe, .embed-container object, .embed-container embed { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }</style><div class='embed-container'><iframe src='https://www.youtube.com/embed/x7cQ3mrcKaY' frameborder='0' allowfullscreen></iframe></div>

<br />

The video itself was back 2013, and since then it seems a huge number of companies have adopted React.

Besides that, I also stumbled upon a good [article](https://www.codementor.io/radubrehar/thinking-in-react-8duata34n) regarding React. In it, it is stated that, what React did really well was it brought immutable UIs to the masses, in which you never mutate the UI you always re-render it. React in a sense changed the way, we think about building UIs.

That being said, however I do not have enough experience in development of React apps to actually really understand the benefits or drawbacks.



### References

- https://reactjs.org/docs/introducing-jsx.html
- https://www.codementor.io/radubrehar/thinking-in-react-8duata34n


