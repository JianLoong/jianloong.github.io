---
title: "UML Statecharts"
date: 2021-10-24
tags: ["UML"]
ShowReadingTime: true
summary: This post attempts to explain UML Statecharts as simple as possible.
cover:
  image: "/images/statechart.png"
hasMermaid: true
draft: false
---

UML Diagrams are important. State charts are probably one of the more interesting diagrams.

This post attempts to explain my train of thought while trying to make a state chart and why it is useful.

### What are state charts?

Statecharts are just states, but more interestingly, it attempts to model a **single** object. It might seem simple at first but there is more to it. Most of the times, and even online resources confuse statechart and activity diagrams. 

Here is my take on attempting to draw a state chart.

Let's just take a very simple example of an ``Order`` object in an e-Commerce system. Something we all know quite well.

If you are not interested in the thought process of drawing the state chart, just scroll down for the finished product.

Asking the client who wants the system is a very important part of the process. We can start by asking things like

- When a customer places an order what happens? - ``Placed``
- What happens if there is nothing in stock? - ``Pending``

All these are just basic questions that can be asked, and we now have the very first few states. 


Please note that this post consists of multiple diagrams that are intentionally drawn in such a way as to showcase the train of thought during its construction. 

**So, it might be incorrect but is the beauty of the modern iterative process**. It is completely fine to attempt to do the state chart multiple times to gain a better understanding of the object in the system.

{{<mermaid align="center">}}

stateDiagram-v2

    [*] --> Placed
    Placed --> Pending
    Pending --> [*]

{{< /mermaid >}}


What we are interested in now, is <strong>how</strong> the object moves from one state to another, so we will continue to ask the client

- What moves the order from the placed state to the pending state? So essentially, how does ``placed`` --> ``pending``?
- When does the order move from ``placed`` to ``pending``? Is this automated? Where the system checks availability? Or does someone manually checks it?
- Does the customer need to pay before it moves to ``pending``? 
- All these are just some questions we need to ask, so we can slowly understand the requirements
  
  {{<mermaid align="center">}}

stateDiagram-v2

    [*] --> Placed
    Placed --> Pending: Payment is made
    Pending --> [*]

{{< /mermaid >}}


Now we know one possible transition, but **wait**, we are not done. We need to continue asking the client questions, for example,

- What happens if the payment is not made?
- Can an `order` stay placed forever?
- If there is inventory management, what if the customer doesn't pay? Are the products still held?
- So when does the deduction in the inventory happen? 
- So, are you saying that the deduction in the inventory happens after the client makes a payment?
- What happens if the payment fails?
- Can a customer buy more than the items in stock?

Things like that are known to us because we are used to using such a system, so now we can go back to the state chart based on what we learnt from the client.

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Placed: Customer places an order, the item must be in stock, item not deducted in inventory yet, no of items must not exceed inventory.
    Placed --> Pending
    Pending --> [*]

{{< /mermaid >}}


Now we are at a stage, where we need to ask the clients more questions because, why would the ``placed`` state be needed in the first place? It seems to serve no purpose.
Why not, the first state is ``pending``? And the only way for an order to be the ``pending`` state is when all the requirements are satisfied.

So, we just chuck away the ``placed`` state as it does nothing.

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Pending: Customer places an order
        note left of Pending
            - Item must be in stock
            - Item purchased must not exceed inventory
            - Item purchased must NOT be deducted yet
        end note
    Pending --> [*]

{{< /mermaid >}}

We can now move on and ask more and more questions to the client.

So let's try some by looking at our statechart, 
- Do you want to allow the customers to purchase a huge number of items? Or is there a limit?
- What happens after ``pending``? Do you want to call it ``paid``? Or is there a different term?

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Pending: Customer places an order
        note left of Pending
            - Items must be in stock
            - Items purchased must not exceed inventory
            - Items purchased must not be deducted yet
            - Items purchased must not be above the limit set
        end note
    Pending-->Paid: Customer pays for the order
            note right of Paid
            - Payment must be successful
            - Items must still be in stock
            - Items are now deducted
        end note
    Paid --> [*]

{{< /mermaid >}}

Now we continue brainstorming of the events.

Whenever we have two or more states, what we are interested in is **what events that could cause one state to become the other**?

So for this situation, how does ``Paid`` --> ``Pending``. So back to the client we go...

- What happens if the customer is unhappy after they have paid?
- What happens if the item in the stock house is incorrect and it is not in stock?
- Remember how we did not deduct the item at the ``pending`` state? **Oh wow, it might cause issues.**
- Should we have a cancelled state? 

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Pending: Customer places an order
        note left of Pending
            - Items must be in stock
            - Items purchased must not exceed inventory
            - Items purchased must not be deducted yet
            - Items purchased must not be above the limit set
        end note
    Pending-->Paid: Customer pays for the order
            note right of Paid
            - Payment must be successful
            - Items must still be in stock
            - Items are now deducted
        end note
    Paid --> Pending: Item no longer in stock, customer preference change.
    Paid --> [*]

{{< /mermaid >}}

The more questions we ask, the more requirements and understanding of the system we will have. We know from this a few very important things

For an order to move from ``start`` to ``pending``
- items must be in stock
- items must not exceed the limit set (1000 PlayStation5?)
- items must not exceed stock
- The **system will not deduct the item stock at this stage**

For the order to be moved from ``pending`` to ``paid``
- payment must be made and successful
- stock must be still in the system
- the system will only now deduct the items


Notice, that by going through the step-by-step process, we can now ask the client more questions for example

- When does the system deduct the item ordered by the user? **Does it do it before he pays or after he pays?**
- If the system does it after he pays, there **might be times when other users, might be able to place an order but he cannot pay for it**, do you want that to happen?
- If the system does it the minute after they place the order, **how long do you want the system to hold it before the stock is returned?**, what if the customer does not pay?
 Will this not be bad for business?
- Does it make sense for it to go from ``paid`` to ``pending``?

We are not done yet, though...............

What about the ``cancelled`` state?

We need to continue asking questions to the client because they know the system the best, and if you make too many assumptions things could go wrong.

Let's put it in and try to complete the diagram.

{{<mermaid align="center">}}
stateDiagram-v2
    [*] --> Pending : Customer places an order
    Pending-->Paid: Customer pays for the order
    Paid --> Cancelled: [Guards] 
    Pending --> Cancelled: [Guards] 
    
    Pending --> [*]
    Paid --> [*]
    Cancelled --> [*]

    note right of Paid
            - Payment must be successful
            - Items must still be in stock
            - Items are now deducted
    end note
         note left of Pending
            - Items must be in stock
            - Items purchased must not exceed inventory
            - Items purchased must not be deducted yet
            - Items purchased must not be above the limit set
        end note

         note left of Cancelled
            - Payment not made within a certain number of days
            - Cancelled as per customer request
        end note
{{< /mermaid >}}


With that, we can see a bit more clearly what is happening and the limitations of our system.

### Explained

In plain English. A customer can have an Order in the ``pending`` state. This happens when the customer places an order but does not pay for it. 
- However, the system will automatically change the ``pending`` state to the ``cancelled`` state if the items are no longer in stock or a payment has not been made after a set duration.
- The ``pending`` state can be the final state of the Order.
- The stock numbers are only reduced after a customer has paid. This means that there is a potential for another customer to have an item at a ``pending`` state but the item will not be in stock. This customer might not be able to make a payment due to the nature of the system.
- So this customer's order would potentially be left in the ``pending`` state.
- A ``pending`` will be moved to the ``cancelled`` state if payment has not been made after a set period or it is cancelled as per customer request.

But wait we still need to ask the client the question more questions

- What if a product is no longer available to be purchased? Meaning the product is no longer offered? Do you want to automatically cancel the order? Or do you want to leave it in the ``pending`` state?
  
Notice that by going through this process, we not only discover and understand more about the system. We are left with more questions than perhaps answers.

We are far from done, as if we pry into the requirements more, we would discover more and more requirements and perhaps more so states, hence it is possible to have sub-states in UML State Chart diagrams but, I shall call the current state chart the first iteration. Will it ever be complete? It is never complete in a way, as requirements may change and we need to adapt to it.


### Conclusion

The idea here is that, statecharts will allow us to understand the requirements better and what to do. Would we have to figure out these without the statechart? It is very possible indeed, but by going through the process of making a statechart, we now understand how the system works better.

From a programming and technical standpoint, we can also now use **enums** better in our system as we now understand how each of them would happen. For the ``Order`` object, it is pretty clear to us, but most of the time we would be dealing with requirements and systems which are foreign to us.

I hope this blog post is useful. I do personally find that with the aid of statecharts, I could understand the system more, after all, it is part of the software engineering process.