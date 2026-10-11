---
title: A singleton and an observer, in a lucky dip machine
description: One machine, one inventory, and two observers that hear about every prize. The Singleton and Observer patterns on an assignment that deserves better than it usually gets.
date: 2019-11-03
category: Java
readingTime: 5
---

There is one Lucky Dip Machine in the arcade. It has a limited inventory, and everyone in the arcade can watch it being used. That is a small enough problem to state in a sentence, and it needs two design patterns to say properly in code.

The assignment — it was one of the feature assignments in the programming foundation units at Monash, and it is often made fun of — usually gets solved as a single class with a `main` method. It can be engineered better than that, and the two patterns are the reason why.

- **Only one machine exists.** A **singleton** holds the inventory, so every use of the machine deducts from the same pile. No second instance, no second inventory to keep in step.
- **Everyone in the arcade can observe it.** Whenever a prize is won, the observers are told which prize left the machine. That is the **observer** pattern: the machine does not know who is watching, only that somebody is.

<figure>
<svg class="figure-art" width="720" height="330" viewBox="0 0 720 330" role="img" aria-label="A user calls pull() on the LuckyDipMachine, which is a singleton. The machine fires a property change to ObserverOne and ObserverTwo, each of which registered itself as a listener on the machine.">
<defs>
<marker id="sd-arw" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="5" markerHeight="5" orient="auto">
<path d="M0 0 L10 5 L0 10 Z" fill="currentColor" fill-opacity="0.5"/>
</marker>
</defs>
<g fill="currentColor" fill-opacity="0.05" stroke="currentColor" stroke-opacity="0.2">
<rect x="268" y="12" width="184" height="44" rx="10"/>
<rect x="58" y="254" width="184" height="44" rx="10"/>
<rect x="478" y="254" width="184" height="44" rx="10"/>
</g>
<rect x="248" y="126" width="224" height="62" rx="12" fill="none" stroke="currentColor" stroke-opacity="0.95" stroke-width="2"/>
<g fill="none" stroke="currentColor" stroke-opacity="0.5" stroke-width="1.5" marker-end="url(#sd-arw)">
<path d="M360 56 V120"/>
<path d="M318 188 L176 248"/>
<path d="M402 188 L544 248"/>
</g>
<g fill="none" stroke="currentColor" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="4 4" marker-end="url(#sd-arw)">
<path d="M58 276 H30 V157 H242"/>
<path d="M662 276 H690 V157 H478"/>
</g>
<g fill="currentColor" text-anchor="middle">
<text x="360" y="40">User</text>
<text x="360" y="152">LuckyDipMachine</text>
<text x="150" y="282">ObserverOne</text>
<text x="570" y="282">ObserverTwo</text>
</g>
<g fill="currentColor" opacity="0.65">
<text class="sm" x="360" y="174" text-anchor="middle">one instance, private constructor</text>
<text class="sm" x="378" y="96">pull()</text>
<text class="sm" x="238" y="212" text-anchor="end">fire change</text>
<text class="sm" x="482" y="212">fire change</text>
</g>
</svg>
<figcaption>Solid arrows are the machine telling observers a prize has gone; dashed arrows are the observers registering themselves. The machine never learns their names.</figcaption>
</figure>

We start with a plain object for the prize itself.

```java
package me.jianliew;

public class Prize {
    private String name;

    public Prize(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Prize prize = (Prize) o;

        return getName().equals(prize.getName());
    }

    @Override
    public int hashCode() {
        return getName().hashCode();
    }

    @Override
    public String toString() {
        return "Prize{" +
                "name='" + name + '\'' +
                '}';
    }
}
```

`equals` and `hashCode` are the interesting part: they are what let two prizes called "Potato" be the same key in a map, which is how the inventory counts them.

The machine is where the patterns live. Four things make it the machine that the arcade shares:

- a **private** constructor, so nobody can make a second one;
- a **static** instance of itself, held as a class variable;
- a **PropertyChangeSupport** field, which is the observer machinery;
- a **pull** method that returns a prize and then fires a property change.

```java
package me.jianliew;

import java.beans.PropertyChangeListener;
import java.beans.PropertyChangeSupport;
import java.util.*;

public class LuckyDipMachine {

    private Map<Prize, Integer> inventory;

    private static LuckyDipMachine ourInstance = new LuckyDipMachine();

    // PropertyChangeSupport is introduced here
    private PropertyChangeSupport support;

    public static LuckyDipMachine getInstance() {
        return ourInstance;
    }

    private LuckyDipMachine() {
        inventory = new HashMap<>();
        support = new PropertyChangeSupport(this);
        fill();
    }

    private void fill(){
        Prize p1 = new Prize("Potato");
        Prize p2 = new Prize("Tomato");
        inventory.put(p1,2);
        inventory.put(p2,2);
    }

    public Prize getRandomPrize(){
        List<Prize> keysAsArray = new ArrayList<>(inventory.keySet());
        Random r = new Random();
        return keysAsArray.get(r.nextInt(keysAsArray.size()));
    }

    public void pull(){
        if (inventory.isEmpty())
            return;
        Prize p = getRandomPrize();
        inventory.computeIfPresent(p, (prize, integer) -> inventory.get(prize) -  1);

        if(inventory.get(p) == 0){
            inventory.remove(p);
        }
        support.firePropertyChange("prize", "", p);
    }

    public int getInventorySize() {
        int sum = 0;
        for (Prize p : inventory.keySet()) sum += inventory.get(p);
        return sum;
    }

    public void addPropertyChangeListener(PropertyChangeListener pcl) {
        support.addPropertyChangeListener(pcl);
    }

    public void removePropertyChangeListener(PropertyChangeListener pcl) {
        support.removePropertyChangeListener(pcl);
    }

    @Override
    public String toString() {
        return "LuckyDipMachine{" +
                "inventory=" + inventory +
                '}';
    }
}
```

The observer needs one thing: to implement `PropertyChangeListener`.

```java
package me.jianliew;

import java.beans.PropertyChangeEvent;
import java.beans.PropertyChangeListener;
import java.util.ArrayList;
import java.util.List;

// It is needed to implement the interface PropertyChangeListener
public class Observer implements PropertyChangeListener {

    private List<Prize> observedPrizes;

    public Observer(){
        observedPrizes = new ArrayList<>();
    }

    @Override
    public void propertyChange(PropertyChangeEvent propertyChangeEvent) {
        Prize p = (Prize) propertyChangeEvent.getNewValue();
        this.observedPrizes.add(p);
        System.out.println(toString());
    }

    @Override
    public String toString() {
        return "Observer{" +
                "observedPrizes=" + observedPrizes +
                '}';
    }
}
```

A test class is then short enough to read at a glance.

```java
package me.jianliew;

public class Test {

    public static void main(String[] args) {

        Observer o = new Observer();
        LuckyDipMachine ldm = LuckyDipMachine.getInstance();
        ldm.addPropertyChangeListener(o);
        System.out.println(ldm.getInventorySize());
        ldm.pull();
        ldm.pull();
        ldm.pull();
        LuckyDipMachine ldm2= LuckyDipMachine.getInstance();
        System.out.println(ldm2.getInventorySize());
        ldm2.pull();
        System.out.println(ldm.getInventorySize());
    }
}
```

```shell
// There will be 4 items at the start
4

// On the first pull a random item is returned. The observer observes it.
Observer{observedPrizes=[Prize{name='Tomato'}]}

// On the second pull, the observer now sees 2 items in total.
Observer{observedPrizes=[Prize{name='Tomato'}, Prize{name='Potato'}]}

// There will be three items on the third pull.
Observer{observedPrizes=[Prize{name='Tomato'}, Prize{name='Potato'}, Prize{name='Tomato'}]}

// The second instance of the LuckyDipMachine will still only have 1 item as the LuckyDipMachine is a singleton.
1

// The pull of the second lucky dip machine, still triggers a fire to the observer as it is a singleton. There is no need to register the listener again.
Observer{observedPrizes=[Prize{name='Tomato'}, Prize{name='Potato'}, Prize{name='Tomato'}, Prize{name='Potato'}]}

// At the end there will be nothing left in the machine.
0
```

The line worth staring at is the second `getInstance()`. It returns the same object, so the listener registered on the first reference is still registered, and `ldm2.pull()` prints through the observer that was attached to `ldm`. That is the whole point of the pattern, and it is invisible until a test like this one makes it visible.

## What it taught me

- **Override both `equals` and `hashCode` when the objects are map keys.** One without the other is a bug that waits until the key is not the same object it was when it went in.
- **There are many ways to write a singleton, and this is the simplest one.** It is not the safe one — the eager static instance is fine here, but it has real problems with construction order and testing, and lazy holds are worth reading up on.
- **Design is subjective.** Putting a `quantity` field on `Prize` instead of keeping counts in the machine's map is a defensible choice, and so is the reverse.
- **Map lookup cost depends on the implementation.** `HashMap` is not the only answer, and the choice is observable once the inventory grows.
- **`PropertyChangeSupport` is far easier than the `Observable` interface**, which was deprecated in Java 9 for good reasons.
- **`computeIfPresent` is worth knowing.** It keeps the decrement and the removal in one place instead of scattering `containsKey` checks through the method.

## References

1. quantities, I. and L., E. (2019). Inventory of objects with item types and quantities. [online] Code Review Stack Exchange. Available at: <https://codereview.stackexchange.com/questions/148821/inventory-of-objects-with-item-types-and-quantities> [Accessed 3 Nov. 2019].
2. Baeldung. (2019). Singletons in Java | Baeldung. [online] Available at: <https://www.baeldung.com/java-singleton> [Accessed 3 Nov. 2019].
3. Baeldung. (2019). The Observer Pattern in Java | Baeldung. [online] Available at: <https://www.baeldung.com/java-observer-pattern> [Accessed 3 Nov. 2019].

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. The flowchart was a mermaid block there and is now an SVG in the site's own figure grammar.</p>
