---
title: Drawing a UML statechart, one question at a time
description: Seven versions of the same statechart for one Order object, each one a question asked of the client, and why the flawed ones are the point.
date: 2021-10-24
category: Design
readingTime: 8
---

Statecharts are one of the more interesting UML diagrams, and one of the more misunderstood: they model a **single** object and the states it can be in. Plenty of resources, including good ones, blur statecharts and activity diagrams together. A statechart is about one thing changing state. An activity diagram is about work flowing.

This is my train of thought while drawing one, in order, including the parts that turn out to be wrong. If you would rather see the finished thing, skip to the last diagram.

The example is an `Order` object in an e-commerce system, because everyone has met one.

Asking the client is the part of the process people skip. So we ask:

- When a customer places an order, what happens? The answer is `Placed`
- What if there is nothing in stock? The answer is `Pending`

Two questions, two states. Nothing about *how* the object moves yet.

<figure>
<svg class="figure-art" width="720" height="120" viewBox="0 0 720 120" role="img" aria-label="A statechart: a start marker, a Placed state, a Pending state and an end marker, joined left to right with arrows.">
<defs>
<marker id="sc-arw1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw1)">
<path d="M63 60 H118"/>
<path d="M290 60 H398"/>
<path d="M570 60 H651"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="120" y="38" width="170" height="44" rx="12"/>
<rect x="400" y="38" width="170" height="44" rx="12"/>
</g>
<circle cx="56" cy="60" r="7" fill="currentColor"/>
<circle cx="664" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="664" cy="60" r="4.5" fill="currentColor"/>
<g fill="currentColor" text-anchor="middle">
<text x="205" y="65">Placed</text>
<text x="485" y="65">Pending</text>
</g>
</svg>
<figcaption>Version 1: two states and no reasons.</figcaption>
</figure>

Now the interesting part: **how** does the object move from one state to another? Back to the client.

- What moves an order from `placed` to `pending`? Is it automatic, a stock check, or does someone press something?
- Does the customer pay before or after it moves?

One of those answers gives us our first transition label.

<figure>
<svg class="figure-art" width="720" height="120" viewBox="0 0 720 120" role="img" aria-label="The same statechart with the transition from Placed to Pending labelled payment is made.">
<defs>
<marker id="sc-arw2" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw2)">
<path d="M63 60 H118"/>
<path d="M290 60 H398"/>
<path d="M570 60 H651"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="120" y="38" width="170" height="44" rx="12"/>
<rect x="400" y="38" width="170" height="44" rx="12"/>
</g>
<circle cx="56" cy="60" r="7" fill="currentColor"/>
<circle cx="664" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="664" cy="60" r="4.5" fill="currentColor"/>
<g fill="currentColor" text-anchor="middle">
<text x="205" y="65">Placed</text>
<text x="485" y="65">Pending</text>
</g>
<text class="sm" x="345" y="50" fill="currentColor" text-anchor="middle">Payment is made</text>
</svg>
<figcaption>Version 2: one transition gets a reason. The rest still have none.</figcaption>
</figure>

We are not done, because the answers to the *next* questions are not states but conditions:

- What happens if the payment is never made? Can an order sit in `placed` forever?
- If there is inventory management, are the products held while the customer decides?
- When exactly is stock deducted: before payment, or after?
- What if the payment fails? Can a customer order more than exists?

Every one of those is a condition on the transition from the start, not a state of its own. So the diagram grows a very long label.

<figure>
<svg class="figure-art" width="720" height="190" viewBox="0 0 720 190" role="img" aria-label="The same statechart with a long condition written above it: customer places an order, the item must be in stock, item not deducted yet, and the order must not exceed inventory.">
<defs>
<marker id="sc-arw3" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw3)">
<path d="M63 120 H118"/>
<path d="M290 120 H398"/>
<path d="M570 120 H651"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="120" y="98" width="170" height="44" rx="12"/>
<rect x="400" y="98" width="170" height="44" rx="12"/>
</g>
<circle cx="56" cy="120" r="7" fill="currentColor"/>
<circle cx="664" cy="120" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="664" cy="120" r="4.5" fill="currentColor"/>
<g fill="currentColor" text-anchor="middle">
<text x="205" y="125">Placed</text>
<text x="485" y="125">Pending</text>
</g>
<g class="sm" fill="currentColor" text-anchor="middle" opacity="0.75">
<text x="360" y="24">Customer places an order, the item must be in stock,</text>
<text x="360" y="40">item not deducted in inventory yet, no of items</text>
<text x="360" y="56">must not exceed inventory.</text>
</g>
</svg>
<figcaption>Version 3: the transition from the start carries four conditions at once, which is a smell and not a statechart.</figcaption>
</figure>

And now the question that undoes it: **why does `Placed` exist at all?**

If every one of those conditions has to be true before an order moves on, then `Placed` is not a state anyone acts on. It is a waiting room nobody waits in. So it goes.

<figure>
<svg class="figure-art" width="720" height="230" viewBox="0 0 720 230" role="img" aria-label="The Placed state is gone. The statechart runs from the start marker straight into Pending, which carries a note with three conditions: the item must be in stock, must not exceed inventory, and must not be deducted yet.">
<defs>
<marker id="sc-arw4" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw4)">
<path d="M63 60 H328"/>
<path d="M500 60 H651"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="330" y="38" width="170" height="44" rx="12"/>
</g>
<circle cx="56" cy="60" r="7" fill="currentColor"/>
<circle cx="664" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="664" cy="60" r="4.5" fill="currentColor"/>
<text x="415" y="65" fill="currentColor" text-anchor="middle">Pending</text>
<rect x="120" y="112" width="480" height="96" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="140" y="132" opacity="0.6">note on Pending</text>
<text x="140" y="150">- Item must be in stock</text>
<text x="140" y="166">- Item purchased must not exceed inventory</text>
<text x="140" y="182">- Item purchased must NOT be deducted yet</text>
</g>
</svg>
<figcaption>Version 4: the conditions become a note on the state that owns them. One state, one note, no waiting room.</figcaption>
</figure>

With that settled, the next questions are about what comes after `pending`:

- Do you want a cap on how many items one customer can buy?
- What is the state after `pending`? Is it `paid`, or does the business call it something else?

The cap is a fourth condition, and the answer to the second question is a new state with conditions of its own.

<figure>
<svg class="figure-art" width="720" height="300" viewBox="0 0 720 300" role="img" aria-label="Pending now leads to a Paid state. Pending carries four conditions and Paid carries three: payment successful, stock still present, items deducted.">
<defs>
<marker id="sc-arw5" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw5)">
<path d="M63 60 H148"/>
<path d="M320 60 H398"/>
<path d="M570 60 H651"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="150" y="38" width="170" height="44" rx="12"/>
<rect x="400" y="38" width="170" height="44" rx="12"/>
</g>
<circle cx="56" cy="60" r="7" fill="currentColor"/>
<circle cx="664" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="664" cy="60" r="4.5" fill="currentColor"/>
<g fill="currentColor" text-anchor="middle">
<text x="235" y="65">Pending</text>
<text x="485" y="65">Paid</text>
</g>
<text class="sm" x="360" y="50" fill="currentColor" text-anchor="middle">Customer pays for the order</text>
<rect x="60" y="100" width="600" height="92" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="80" y="118" opacity="0.6">note on Pending</text>
<text x="80" y="135">- Items must be in stock</text>
<text x="80" y="150">- Items purchased must not exceed inventory</text>
<text x="80" y="165">- Items purchased must not be deducted yet</text>
<text x="80" y="180">- Items purchased must not be above the limit set</text>
</g>
<rect x="60" y="202" width="600" height="76" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="80" y="220" opacity="0.6">note on Paid</text>
<text x="80" y="237">- Payment must be successful</text>
<text x="80" y="252">- Items must still be in stock</text>
<text x="80" y="267">- Items are now deducted</text>
</g>
</svg>
<figcaption>Version 5: a second state, and the note on Pending grows a fourth line. Deduction now happens at <code>Paid</code>, which will cause trouble shortly.</figcaption>
</figure>

Two or more states means the next question is always the same: **what events move one state back to another?** So:

- What if the customer is unhappy after paying?
- What if the stock record was wrong and the item is not actually there?
- Remember that nothing is deducted while an order sits in `pending`. Can two customers both think they have the last one?

That last one is the bug the diagram was hiding, and it needs a transition the shape does not have yet.

<figure>
<svg class="figure-art" width="720" height="390" viewBox="0 0 720 390" role="img" aria-label="The same two states plus a return transition drawn as a loop below them, labelled item no longer in stock or customer preference change, from Paid back to Pending.">
<defs>
<marker id="sc-arw6" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw6)">
<path d="M63 60 H148"/>
<path d="M320 60 H398"/>
<path d="M570 60 H651"/>
</g>
<g fill="none" stroke="currentColor" stroke-opacity="0.45" stroke-width="1.5" stroke-dasharray="6 4" marker-end="url(#sc-arw6)">
<path d="M485 84 V116 H235 V88"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="150" y="38" width="170" height="44" rx="12"/>
<rect x="400" y="38" width="170" height="44" rx="12"/>
</g>
<circle cx="56" cy="60" r="7" fill="currentColor"/>
<circle cx="664" cy="60" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="664" cy="60" r="4.5" fill="currentColor"/>
<g fill="currentColor" text-anchor="middle">
<text x="235" y="65">Pending</text>
<text x="485" y="65">Paid</text>
</g>
<text class="sm" x="360" y="50" fill="currentColor" text-anchor="middle">Customer pays for the order</text>
<text class="sm" x="360" y="150" fill="currentColor" text-anchor="middle">Item no longer in stock, customer preference change.</text>
<rect x="60" y="170" width="600" height="92" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="80" y="188" opacity="0.6">note on Pending</text>
<text x="80" y="205">- Items must be in stock</text>
<text x="80" y="220">- Items purchased must not exceed inventory</text>
<text x="80" y="235">- Items purchased must not be deducted yet</text>
<text x="80" y="250">- Items purchased must not be above the limit set</text>
</g>
<rect x="60" y="272" width="600" height="76" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="80" y="290" opacity="0.6">note on Paid</text>
<text x="80" y="307">- Payment must be successful</text>
<text x="80" y="322">- Items must still be in stock</text>
<text x="80" y="337">- Items are now deducted</text>
</g>
</svg>
<figcaption>Version 6: <code>Paid</code> can go back to <code>Pending</code>. A dashed return arrow is the cheapest way to show that the first draft of a statechart usually assumes progress is one-way, and that it is not.</figcaption>
</figure>

The questions keep coming, and they are better questions now:

- When exactly is stock deducted: before payment or after?
- If it is after, then between `pending` and a failed payment the item is not held, so another customer may take it. Is that acceptable?
- If it is before, how long do you hold it? What if the customer never pays? Is that good business?
- Does `paid` going back to `pending` make sense at all?

And one state is still missing. What happens to an order that is never paid, or that the customer changes their mind about? `Cancelled`.

<figure>
<svg class="figure-art" width="720" height="500" viewBox="0 0 720 500" role="img" aria-label="The finished statechart: Pending leads to Paid, both lead to Cancelled, and all three lead to an end marker. Three notes list the conditions on Pending, Paid and Cancelled.">
<defs>
<marker id="sc-arw7" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.55"/>
</marker>
</defs>
<g fill="none" stroke="currentColor" stroke-opacity="0.55" stroke-width="1.5" marker-end="url(#sc-arw7)">
<path d="M200 27 V38"/>
<path d="M200 84 V118"/>
<path d="M275 62 L418 92"/>
<path d="M275 142 H360 V126"/>
<path d="M200 164 V198"/>
<path d="M495 124 V198"/>
<path d="M125 62 H60 V198"/>
</g>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.9" stroke-width="1.5">
<rect x="125" y="40" width="150" height="44" rx="12"/>
<rect x="125" y="120" width="150" height="44" rx="12"/>
<rect x="420" y="80" width="150" height="44" rx="12"/>
</g>
<circle cx="200" cy="20" r="7" fill="currentColor"/>
<circle cx="200" cy="210" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="200" cy="210" r="4.5" fill="currentColor"/>
<circle cx="495" cy="210" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="495" cy="210" r="4.5" fill="currentColor"/>
<circle cx="60" cy="210" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>
<circle cx="60" cy="210" r="4.5" fill="currentColor"/>
<g fill="currentColor" text-anchor="middle">
<text x="200" y="67">Pending</text>
<text x="200" y="147">Paid</text>
<text x="495" y="107">Cancelled</text>
</g>
<g class="sm" fill="currentColor">
<text x="212" y="36">Customer places an order</text>
<text x="212" y="106">Customer pays for the order</text>
<text x="347" y="66" text-anchor="middle" opacity="0.75">[guards]</text>
<text x="317" y="160" text-anchor="middle" opacity="0.75">[guards]</text>
</g>
<rect x="40" y="244" width="640" height="92" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="60" y="262" opacity="0.6">note on Pending</text>
<text x="60" y="279">- Items must be in stock</text>
<text x="60" y="294">- Items purchased must not exceed inventory</text>
<text x="60" y="309">- Items purchased must not be deducted yet</text>
<text x="60" y="324">- Items purchased must not be above the limit set</text>
</g>
<rect x="40" y="346" width="640" height="76" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="60" y="364" opacity="0.6">note on Paid</text>
<text x="60" y="381">- Payment must be successful</text>
<text x="60" y="396">- Items must still be in stock</text>
<text x="60" y="411">- Items are now deducted</text>
</g>
<rect x="40" y="432" width="640" height="56" rx="8" fill="currentColor" fill-opacity="0.04" stroke="currentColor" stroke-opacity="0.35" stroke-dasharray="4 4"/>
<g class="sm" fill="currentColor">
<text x="60" y="450" opacity="0.6">note on Cancelled</text>
<text x="60" y="467">- Payment not made within a certain number of days</text>
<text x="60" y="482">- Cancelled as per customer request</text>
</g>
</svg>
<figcaption>Version 7, the first iteration: three states, guards on both routes into <code>Cancelled</code>, and an end marker for each. Not finished: finished is not a thing a statechart gets to be.</figcaption>
</figure>

## What it says

In plain English:

- An order can sit in `pending`: the customer has placed it and has not paid.
- The system moves `pending` to `cancelled` on its own if the items are no longer in stock, or if payment has not arrived within a set period.
- `pending` can also be the last state an order is ever in. It is not an error path.
- Stock is only reduced once a customer has paid. Which means two customers can both hold an item in `pending` while only one of them can pay for it, and the other order simply stays there.
- `pending` moves to `cancelled` either by that timeout or at the customer's request.

And more questions, because there always are:

- What if a product is withdrawn from sale entirely? Cancel every order automatically, or leave them in `pending` for a human?

## What the exercise is for

Going through this in order, including the two versions that were wrong, is the useful part, not the final diagram. The first version had a state that existed for no reason. The third put four conditions on one transition. The fourth deleted a state AND found where the conditions belonged. The sixth admitted that progress can go backwards.

Two things fall out of that:

- **The requirements get understood.** Every question asked of the client is a question that would otherwise have been an assumption somebody made in code. The `pending`-holds-no-stock problem is a real bug in the system above, and it surfaced because a statechart made the awkward question obvious rather than because anyone thought of it.
- **The enums write themselves.** Once the states and transitions are explicit, an `OrderStatus` enum is not a guess: it is the list of states, and the transitions are the only places status can change. That is what I mean when I say the making of the diagram is doing the engineering.

Statecharts model one object, and requirements are about many. It is never complete either: requirements change, so the diagram changes, which is why this one is a first iteration rather than an answer.

## Bye.

<p class="colophon">Written in 2021, ported from the old Hugo site. The seven diagrams were mermaid state diagrams there and are hand-authored SVG here, one per version, so the post no longer depends on a diagramming library. The prose is lightly edited; the iteration order and every note are as written.</p>
