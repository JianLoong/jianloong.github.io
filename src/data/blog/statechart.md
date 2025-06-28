---
title: "UML Statecharts: A Practical Guide to State Modeling"
author: Jian Liew
pubDatetime: 2021-10-24T00:00:00+11:00
slug: uml-statecharts
featured: true
draft: false
readingTime: 8
tags:
  - UML
  - statecharts
  - software engineering
  - design
  - modeling
description: "A practical guide to UML Statecharts, walking through the iterative process of creating state diagrams for an e-commerce order system with real-world examples."

---

UML diagrams are essential tools in software engineering, and statecharts are among the most powerful for modeling system behavior. This post demonstrates my thought process while creating a statechart and explains why this modeling technique is invaluable.

I posted this here because I completely disagree with how statecharts are taught in FIT5136 - Software Engineering at Monash University. The main justification is that the teaching team does not understand the difference between the usage of statecharts versus activity diagrams.

## What Are Statecharts?

Statecharts model the behavior of a **single object** through its various states and transitions. While this might seem simple at first, statecharts reveal complex interactions that are often overlooked. Many resources confuse statecharts with activity diagrams, but they serve different purposes.

Let me walk you through creating a statechart using a familiar example: an `Order` object in an e-commerce system.

> **Note**: This post contains multiple diagrams that intentionally showcase the iterative thought process during construction. The early versions may be incomplete or incorrect—this demonstrates the beauty of modern iterative development. It's perfectly acceptable to create multiple iterations of a statechart to gain better understanding.

## Starting Simple: Basic States

We begin by asking fundamental questions about the system:

- When a customer places an order, what happens? → `Placed` state
- What happens if items are out of stock? → `Pending` state

These basic questions give us our initial states:

<div class="mermaid" align="center" id="mermaid">
stateDiagram-v2
    [*] --> Placed
    Placed --> Pending
    Pending --> [*]
</div>

## Understanding Transitions

Now we focus on **how** the object moves between states. We continue asking the client questions:

- What triggers the transition from `Placed` to `Pending`?
- Is this transition automated or manual?
- Does payment need to occur before moving to `Pending`?

These questions help us understand the requirements better:

<div class="mermaid" align="center" id="mermaid">
stateDiagram-v2
    [*] --> Placed
    Placed --> Pending: Payment is made
    Pending --> [*]
</div>

## Refining the Model

But wait—we're not done yet. We need to consider edge cases and business rules:

- What happens if payment fails?
- Can an order remain in `Placed` state indefinitely?
- How does inventory management work?
- When does inventory deduction occur?
- Can customers order more than available stock?

Based on these considerations, we refine our model:

<div class="mermaid" align="center" id="mermaid">
stateDiagram-v2
    [*] --> Placed: Customer places an order, the item must be in stock, item not deducted in inventory yet, no of items must not exceed inventory.
    Placed --> Pending
    Pending --> [*]
</div>

## Questioning Assumptions

At this stage, we should question our initial assumptions. Why do we need a `Placed` state at all? It seems to serve no clear purpose. Why not start directly with `Pending` when all requirements are satisfied?

Let's eliminate the unnecessary `Placed` state:

<div class="mermaid" align="center" id="mermaid">
stateDiagram-v2
    [*] --> Pending: Customer places an order
        note left of Pending
            - Item must be in stock
            - Item purchased must not exceed inventory
            - Item purchased must NOT be deducted yet
        end note
    Pending --> [*]
</div>

## Adding Business Rules

We continue refining by adding more business requirements:

- Should there be purchase limits?
- What happens after `Pending`? Do we call it `Paid`?

<div class="mermaid" align="center" id="mermaid">
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
</div>

## Considering Reverse Transitions

When we have multiple states, we must consider **what events could cause reverse transitions**:

- What happens if a customer is unhappy after payment?
- What if inventory was incorrectly reported?
- Should we allow transitions from `Paid` back to `Pending`?

<div class="mermaid" align="center" id="mermaid">
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
</div>

## Key Insights from the Process

Through this iterative questioning, we've discovered critical business rules:

**For transitions from `[*]` to `Pending`:**
- Items must be in stock
- Items must not exceed purchase limits
- Items must not exceed available inventory
- **System does NOT deduct inventory at this stage**

**For transitions from `Pending` to `Paid`:**
- Payment must be successful
- Stock must still be available
- **System deducts items only at this stage**

## Adding the Cancelled State

We continue asking questions to identify missing states:

- What about order cancellation?
- How long should orders remain pending?
- What happens if products are discontinued?

<div class="mermaid" align="center" id="mermaid">
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
</div>

## System Behavior Explained

In plain English, here's how our system works:

- A customer can place an order, creating a `Pending` state
- The system automatically transitions `Pending` to `Cancelled` if items become unavailable or payment isn't made within a time limit
- `Pending` can be a final state
- Inventory is only reduced after successful payment, which creates a potential race condition where customers might not be able to pay due to insufficient stock
- Orders move to `Cancelled` if payment isn't made within the specified period or upon customer request

## Unanswered Questions

This process reveals more questions than answers:

- What happens if a product is discontinued while an order is pending?
- Should we automatically cancel such orders or leave them pending?

Notice how this iterative process not only helps us understand the system better but also uncovers requirements we hadn't considered initially.

## The Iterative Nature

We're far from complete. As we dig deeper into requirements, we might discover:
- Sub-states within existing states
- More complex transition conditions
- Additional business rules

This is why statecharts are never truly "complete"—requirements evolve, and our models must adapt.

**The statechart above is not complete but serves as a solid foundation for further refinement.**

## Conclusion

Statecharts enable us to understand requirements more deeply. While we could figure out these requirements without statecharts, the modeling process forces us to ask critical questions and understand system behavior better.

From a technical perspective, this understanding helps us:
- Design better enums and state machines
- Implement proper validation logic
- Handle edge cases more effectively
- Communicate system behavior to stakeholders

The key lesson is that **statecharts help us ask better questions about requirements**, leading to deeper system understanding and more robust implementations.

Statecharts are an essential part of the software engineering process, helping us model complex behaviors in a clear, visual way that reveals hidden requirements and potential issues.


