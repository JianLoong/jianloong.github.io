---
title: "Singleton & Observer Pattern (Java)"
date: 2019-11-03
tags: ["Java", "Design Pattern", "Singleton", "Observer"]
cover:
  image: "/images/luckydip.png"
---


This blog post will demonstrate a simple use case  where the **singleton** and **observable** design pattern becomes important.

Let's imagine if you are in the arcade and there is a Lucky Dip Machine. The reason I like call it the LuckyDipMachine is because it is one of the feature assignments in the Programming Foundation Units in Monash University and it is often times made fun at. However, the solution for assignment itself **can be engineered to be better.**

 - There is **only one** Lucky Dip Machine in the arcade. This lucky dip machine has a limited number of items in its inventory. A **singleton** design pattern will be used to instantiate this class. The reason for a Singleton pattern is so that, there can only ever be one LuckyDipMachine. Multiple uses of the LuckyDipMachine will only deduct items from this instance.

- Everyone in the arcade can **observe** when the LuckyDipMachine is used. Whenever, a price is won, the observers would know what Prize has been won.


{{<mermaid align="center">}}

graph TD
    A(LuckyDipMachine<br />Singleton)
    B(ObserverOne)
    C(ObserverTwo)
    D(User)
    B -- observes--> A
    C -- observes--> A
    D -- uses --> A
    A --fire changes --> B
    A --fire changes --> C
{{</mermaid>}}

<p align="center">Fig 1. Flowchart Representation of the intended design </p>



We  start off by creating a really simple Prize class.

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
<p align="center">Snippet 1. The <strong> Prize</strong> class.</p>

Our Prize class is just a plain old Java object. 

However, our LuckyDipMachine class is slightly more interesting. Here are the characteristics of it

- It has a **private** constructor.
- It has a **static** instance of itself. This is done as a class variable.
- A **PropertyChangeSupport** as a field to create an observable pattern.
- A **pull** method of the LuckyDipMachine indicating whenever the lucky dip machine has been pulled or used. When this happens, it will fire a property change done via calling the **firePropertyChange** method.

The reason it has a ``private`` constructor is quite simple, as you do not want people to use the constructor method but the ``getInstance()`` method. This is so that the LuckyDipMachine will only ever have an instance of itself.

<div></div>

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

<div></div>

We also have the Observer. The only thing that is needed in this class is for it to implement the **PropertyChangeListener**. I will also need to have an implementation for the **propertyChange**.

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

<div></div>
We can then have a simple Test class to see how it works.

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

The output of it would be as follows.

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



#### Lessons from this blog post.

- It is very important to override both the **equals** and  the **hashCode** when using maps. 
- The **Singleton** design pattern have many different approaches. The approach which I have used here is the most simplistic approach and does have certain design concerns.
- Design is still very subjective matter as it is debatable to put the **quantity** field in the Prize class itself.
- The runtime to get a random item from a HashMap would depend on the **implementation** of it.
- **Pygments** and **Chroma** of the Hugo static website generator are both good but Chroma seems to look nice out of the box for my use case.
- **PropertyChangeSupport** is so much easier to use compare to the **Observable** interface class.
- **computeIfPresent** method is pretty cool as it uses a lambda like feature.


#### References

1. quantities, I. and L., E. (2019). Inventory of objects with item types and quantities. [online] Code Review Stack Exchange. Available at: https://codereview.stackexchange.com/questions/148821/inventory-of-objects-with-item-types-and-quantities [Accessed 3 Nov. 2019].
2. Baeldung. (2019). Singletons in Java | Baeldung. [online] Available at: https://www.baeldung.com/java-singleton [Accessed 3 Nov. 2019].
3. Baeldung. (2019). The Observer Pattern in Java | Baeldung. [online] Available at: https://www.baeldung.com/java-observer-pattern [Accessed 3 Nov. 2019].