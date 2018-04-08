---
layout: post
title: Static Factory Methods in Java 
category: Java
excerpt_separator:  <!--more-->
image: https://assets-cdn.github.com/images/modules/logos_page/Octocat.png
---

One of the must read books for Java programmers is Effective Java by Joshua Bloch. The 3rd edition has just been released couple months ago. I know quite a number of people have been eagerly waiting for its release.

I have been programming Java for a fairly long time. I still remember learning it via self taught from a website called Java with Passion back in 2009. The person who runs it at that time was Sang Shin. He currently works at Pivotal There was even a Google Group created for discussion purposes. Back then, programming was still new to me and for me, it was mainly because I was interested in computers and how programs work in general. 

Anyways, back to the main topic, in this day and age, everyone claims to know Java. I mean of course, they do. But the main issue here is, how does a person determine the difference between a new Java programmer and someone who has been doing it for a long time. Cough, of course I know there are certifications like OCA and OJP out there. The main issue here is that for these certifications, one can "study" for it and most of the times it doesn't become something ingrained within them.

But Java itself is a huge, and there are many ways to tackle a problem. In my opinion, one thing that every programmer should always know is regarding good practices. The problem with good practices, its that it is hard to teach good practices, as this is something that can only be gained over time.

For now, enough of the *rant*. let's see some examples from the book.

<!--more-->

One of the major problems when you work in education is that over time, your programming skills go down. This is quite evident as most of the time, it is not required as it is more important to be a good researcher in comparison to being a good programmer.

Back to static factory methods now.

A static factory method is simply a static method that returns an instance of the class. Normally, the traditional way is to use a public constructor in order to obtain an instance of the class. If you ever used 3rd party libraries like Guava or ApacheCommons, you will notice that there is almost always a factory method in the API.

An example of a static factory method is as follows. Notice that it returns a Boolean object.

```java
public static Boolean valueOf(boolean b) {
	return b ? Boolean.TRUE : Boolean.FALSE;
}
```

Advantages of static factory methods are as follows
- unlike constructors, static method have **names**
- unlike constructors, they are not required to create a new object each time they are invoked. Notice that in the example, the **new** keyword was not used.
- unlike constructors, they can return an object of any subtype of their return type.
- the class of the returned object can vary from call to call as a function of the input parameters.
- the class of the returned object need not exist when the class containing the method is written

Limitations 
- classes without public or protected constructors cannot be subclassed
- they are hard for programmers to find (Debatable)

Well, this is just a summary it is high recommended to read the book instead. This post will be updated *soon*.

Let's look at the first one.

### Static methods have names

One of the issues with code readability in Java is that there can be multiple constructors with different signatures and often times, people reading the code will have no idea what it does without reading the API. With static methods, however, you can put a more meaningful name. Thus, in a way your code will not only be cleaner it will also be more meaningful to the reader.

*More updates soon*