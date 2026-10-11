---
title: Five ways to get the min and max of an array in Java
description: A loop, a sort, two streams and a collections call — and the one I would actually use, plus the snippet from 2019 that throws.
date: 2019-11-06
category: Java
readingTime: 4
---

There are many ways to get the smallest and largest value out of an `int[]` in Java. This is a post about which ones exist, what each costs, and which one I would write.

## Method 1 — the manual loop

The obvious one. Walk the array once, keep the best so far, and guard the empty case.

```java
public void usingManual(int[] numbers){
    if (numbers.length == 0)
        throw new IllegalArgumentException("Invalid array");
    int min = Integer.MAX_VALUE;
    int max = Integer.MIN_VALUE;

    for(int value : numbers){
        if (value > max)
            max = Math.max(max, value);
        if (value < min)
            min = Math.min(min, value);
    }

    System.out.println("Min is " + min);
    System.out.println("Max is " + max);
}
```

Two notes on this. The inner `Math.max` is redundant — the `if` already established that `value` is larger — but it does no harm and reads as a guard. And the seeds matter: starting from `Integer.MAX_VALUE` and `Integer.MIN_VALUE` works for any array, including one holding only negative numbers, whereas seeding from `numbers[0]` needs a loop that starts at index 1. Get that wrong and every value in a negative array looks like a maximum.

## Method 2 — sort a copy

Sort it, and the ends are the answer. The catch is that `Arrays.sort` sorts **in place**, and a method called `getMinAndMax` has no business reordering the array its caller passed in.

```java
public void usingSort(int[] numbers){
    if (numbers.length == 0)
        throw new IllegalArgumentException("Invalid array");
    int[] clonedArray = numbers.clone();
    Arrays.sort(clonedArray);
    System.out.println("Min is " + clonedArray[0]);
    System.out.println("Max is " + clonedArray[clonedArray.length - 1]);
}
```

The clone fixes the surprise but not the cost: sorting is O(n log n) for a question that needs one pass, and for primitive arrays the implementation is a dual-pivot quicksort. A method should do one thing, and "find the min and max" is not "sort this array".

## Method 3 — streams

Java 8 added `IntStream`, which makes the one-pass version a single expression.

```java

public void usingIntStream(int[] numbers){
    if (numbers.length == 0)
        throw new IllegalArgumentException("Invalid array");    
    IntStream intStream = Arrays.stream(numbers);
    System.out.println("Min is " + intStream.min());
    System.out.println("Max is " + intStream.max());
}
```

**As published, this snippet throws.** A stream is consumed by its terminal operation, so `min()` spends the stream and the `max()` on the next line raises `IllegalStateException: stream has already been operated upon or closed`. It would also print `OptionalInt[3]` rather than `3`, because `min()` returns an optional. The fix is either a second stream or the summary statistics below:

```java
IntStream intStream = Arrays.stream(numbers);
System.out.println("Min is " + intStream.min().orElseThrow());
System.out.println("Max is " + Arrays.stream(numbers).max().orElseThrow());
```

Streams also have a decision inside them that a loop does not: whether to go parallel. For an array this is a question about the size of the data, not about style, and most arrays are too small for it to be worth asking.

## Method 4 — summary statistics

`IntSummaryStatistics` is a state object that collects count, sum, min, max and average in one pass.

```java
public void usingSummaryStats(int[] numbers){
    if (numbers.length == 0)
        throw new IllegalArgumentException("Invalid array");    
    IntSummaryStatistics stats = Arrays.stream(numbers).summaryStatistics();
    System.out.println("Min is " + stats.getMin());
    System.out.println("Max is " + stats.getMax());
}
```

This is the one I would write. It answers the question in one pass, returns real numbers rather than optionals, and the same object carries the other four statistics — so the next question about the same array costs nothing. The empty-array problem also disappears: an empty stream gives a summary with a count of zero rather than an exception or a sentinel value, so the guard is about saying what you want rather than about protecting the arithmetic.

## Method 5 — Collections

You can box the array into a `List<Integer>` and hand it to `Collections.min` and `Collections.max`.

```java
public void usingCollections(int[] numbers){
    if (numbers.length == 0)
        throw new IllegalArgumentException("Invalid array");
    List<Integer> integerList = new ArrayList<>();
    Arrays.stream(numbers).forEach(value -> integerList.add(value));
    System.out.println(Collections.min(integerList));
    System.out.println(Collections.max(integerList));
}
```

It works, and it iterates the whole collection twice to do it. Both calls are O(n), and both walk a list of boxed integers — an allocation per element that the primitives did not need. If the array is already a collection, this is reasonable; converting an `int[]` to get here is not.

[Guava](https://github.com/google/guava) has the same idea without the boxing, in `Ints.min` and `Ints.max`, which take the primitive array directly — worth knowing if Guava is already on the classpath, and not worth a dependency for this alone.

## What I would write

On Java 8 or later, `summaryStatistics()`. Before that, the manual loop. Either way, resist the sort: it is the one option here that costs more than the question and changes something the caller did not ask you to change.

## Bye.

<p class="colophon">Written in 2019, ported from the old Hugo site and lightly edited. All five snippets are the originals. The streams one is left as it was written and its bug is now called out underneath, along with the two-line fix.</p>
