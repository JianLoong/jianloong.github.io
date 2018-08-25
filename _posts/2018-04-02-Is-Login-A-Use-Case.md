---
layout: post
title: Is Login A Use Case?
category: Use Case
excerpt_separator:  <!--more-->
image: https://assets-cdn.github.com/images/modules/logos_page/Octocat.png
---

When dealing with system use case diagrams, a question that often pops up is the notion whether login is a use case? There are various train of thoughts regarding this matter.

In my opinion, the answer to this question is in fact, really simple. Of course, login is a use case. However, the main question that comes into play now, is whether login is a **functional** or **non-functional** requirement. A functional requirement describes what a software system should do while a non-functional requirement place constraint on how the system will do so.

The question now becomes, which category does login fall into in your system? Well, this answer depends on what system you are designing a use case diagram for. If you are designing an authentication and authorization system, of course login is a use case, but what happens if you are not?


<!--more-->

In a normal system, do you consider putting login as a use case in your system use case diagram? For example, if you are designing the system use case diagram for a site like eBay, do you put login as a use case? While, there is nothing wrong with putting login a use case, it creates needless complications. Why is this so? Think of it this way, if you are planning to introduce login, there is a high chance that several other use cases will use the **include** and **extends** notion to relate to this use case. If that is done, it would increase the complexity use case diagram itself.

However, it would be better if login is not considered as a use case. Login should be treated as a non-functional requirement. In this case, based on ISO/IEC 9126 standards, login will fall under security requirements.

In actual fact, this is actually true because;

**A user will never want to login.**

A login barrier creates unnecessary burden to the user. The login use case often prevents the user from accomplishing a goal. The only reason it is present is because it is needed for security reasons.

In a perfect world, a user will never need to login, as the login process creates another step to accomplish a goal. This step is tedious and troublesome. Why do you want to trouble a user to login, a step in which has no value added to it? In fact, if you noticed, these days, most modern system often attempts to skip the login process.

For example, most online shopping system these days allows the user to purchase an item without the need of login. Why is this so? The answer is simple. The main information required for a user to purchase an item online is the delivery address and of course how they should pay for the item. Any other information is pointless in accomplishing the use case. There is not a need for the user to login into the system.

In short, **login is a non-functional requirement** and should not be in the system use case diagram. While, there is nothing wrong with modelling it, it would be better if it was not in the system use case diagram. These days, the process of authentication and authorization is often left to external parties for example the use of Google OAuth or even Auth0. By doing this as well, the system use case diagram will be much cleaner and effective to convey the needed information.

However, at the end of the day, the most important factor is message that is present in the model. If a reader would be able to understand the diagram without difficulties, the goal of the use case diagram has been accomplished.


### References

- https://en.wikipedia.org/wiki/ISO/IEC_9126
- https://stackoverflow.com/questions/16475979/what-is-the-difference-between-functional-and-non-functional-requirement
