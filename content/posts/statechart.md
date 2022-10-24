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

Often times, students and even professional developers do not see a need for UML diagrams.

This post attempts to explain the train of thought while trying to make a statechart and why it is useful.

### What are statecharts?

Let's just take a very simple example of an ``Order`` object in an e-Commerce system. Something we all know quite well.

Asking the client who wants the system is a very important part of the process. We can start off by asking thing like

- When a customer places an order what happens? - ``Placed``
- What happens if there is nothing in stock? - ``Pending``

All these are just basic questions that can be asked, and we now we have the very first few states. It might be incorrect for now, but is the beauty of the modern iterative process.

{{<mermaid align="center">}}

stateDiagram-v2

    [*] --> Placed
    Placed --> Pending
    Pending --> [*]

{{< /mermaid >}}


What we are interested now, is <strong>how</strong> the object moves from one state to another, so we will continue to ask the client

- What moves the order from the placed state to the pending state? So essentially, how does ``placed`` --> ``pending``?
- When does the order moves from placed to pending? Is this automated? Where the system checks availability? Or does someone manually checks it?
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
- Can an ``order``stay in the placed state forever?
- If there is inventory management, what if the customer doesn't pay? Are the products still held?
- So when does the deduction in the inventory happen? 
- So, are you saying that the deduction in the inventory happens after the client makes a payment?
- What happens if the payment fails?
- Can a customer buy more than the items in stock?

Things like that are known to us because we are used to using such a system, so now we can go back to the statechart based on what we learnt from the client.

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Placed : Customer places an order, item must be in stock, item not deducted in inventory yet, no of items must not exceed inventory.
    Placed --> Pending
    Pending --> [*]

{{< /mermaid >}}

<p align="center"><strong>Step 3</strong> - More and more questions to understand the requirements</p>

Now we are at a stage, where we need to ask the clients more questions because, why would the ``placed`` state be needed in the first place? It seems to serve no purpose.
Why not, the first state is ``pending``? And the only way for an order to be in the ``pending`` state is when all the requirements are satisfied.

So, we just chuck away the ``placed`` state as it does nothing.

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Pending : Customer places an order
        note left of Pending
            - Item must be in stock
            - Item purchased must not exceed inventory
            - Item purchased must NOT be deducted yet
        end note
    Pending --> [*]

{{< /mermaid >}}

We can now move on and ask more and more questions to the client.

So lets try some by looking at our statechart, 
- Do you want to allow the customers to purchase a huge number of items? Or is there a limit?
- What happens after ``pending``? Do you want to call it ``paid``? Or is there a different term?

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Pending : Customer places an order
        note left of Pending
            - Items must be in stock
            - Items purchased must not exceed inventory
            - Items purchased must not be deducted yet
            - Items purchased must not be above limit set
        end note
    Pending-->Paid: Customer pays for the order
            note right of Paid
            - Payment must be successful
            - Items must still be in stock
            - Items are now deducted
        end note
    Paid --> [*]

{{< /mermaid >}}

Now we continue braining storm of the events.

Whenever we have two or more states, what we are interested in is **what events that could cause one state to become the other**?

So for this situation, how does ``Paid`` --> ``Pending``. So back to the client we go...

- What happens if the customer unhappy after they have paid?
- What happens if the item in the stock house is incorrect and it is not in stock?
- Remember how we did not deduct the item at the ``pending`` state? **Oh wow, it might cause issues.**
- Should we have a cancelled state? 

{{<mermaid align="center">}}
stateDiagram-v2

    [*] --> Pending : Customer places an order
        note left of Pending
            - Items must be in stock
            - Items purchased must not exceed inventory
            - Items purchased must not be deducted yet
            - Items purchased must not be above limit set
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

In order for an order to move from ``start`` to ``pending``
- items must be in stock
- items must not exceed the limit set (1000 PlayStation5?)
- items must not exceed stock
- **system will not deduct the item stock at this stage**

For the order to be moved from ``pending`` to ``paid``
- payment must be made and successful
- stock must be still in the system
- system will only now deduct the items


Notice, that by going through the step by step process, we can now ask the client more questions for example

- When does the system deducts the item ordered by the user? **Does it do it before he pays or after he pays?**
- If the system does it after he pays, there **might be times when other users, might be able to place an order but he cannot pay for it**, do you want that to happen?
- If the system does it the minute after the place the order, **how long do you want the system to hold it before the stock is returned?**, what if the customer does not pay?
 Will this not be bad for business?
- Also, remember how the customer paid for the items but now we do not have it in stock?

We are not done yet, though...............

What about the ``cancelled`` state?

The idea here is that, statecharts will allow us to understand the requirements better and what to do. We can also now use **enums** better in our system as we now understand how each of them would happen. For the ``Order`` object, it is pretty clear to us, but most of the time we would be dealing with requirements and systems which are foreign to us.

I hope this blog post is useful.