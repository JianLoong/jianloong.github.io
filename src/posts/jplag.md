---
title: Measuring code similarity for Intro to Programming
description: Mixed zip, rar and 7z submissions, renamed archives, unicode and __MACOSX — the shell work that made JPlag usable over 481 submissions a semester.
date: 2022-11-05
category: Tools
readingTime: 5
---

FIT9131, Introduction to Programming, was a Masters-level unit for the Master of Information Technology at Monash University. It had a reputation for being hard, and I taught into it until 2019.

Marking a unit that size means reading several hundred submissions that are mostly variations on the same answer, and the variations that matter are the ones that came from the same source. That is a similarity problem, not a marking problem.

The assignment help industry had noticed the same thing:

<figure>
<img src="/assets/posts/jplag-advert.png" alt="A photograph of two Chinese-language advertisements taped side by side to a toilet-stall wall. Both list Monash unit codes — FIT9131, FIT9132, FIT9133, ETC2410, BFF1001 among them — with a price of $18.80 an hour, plus WeChat contact codes and a phone number." width="1263" height="756" loading="lazy" decoding="async">
<figcaption>An advertisement I photographed in a campus toilet block. Someone is selling "whole semester" packages, by unit code, at $18.80 an hour.</figcaption>
</figure>

## Why JPlag

The teaching team used [JPlag](https://github.com/jplag/JPlag), and for four reasons:

- It was faster and more accurate for our case than the alternatives we tried.
- It is open source, so student work never leaves the university — unlike MOSS, which requires uploading submissions to a third-party server.
- It produced results in time to act on them, for over 450 students at once, as HTML reports.
- It is still maintained.

JPlag takes a directory of student submissions and writes reports. The whole difficulty is the word *directory*: feeding it clean trees with predictable names is most of the work, and it is the part nobody warns you about.

## What students actually submit

Every one of these appeared in a single semester:

- compressed files in zip, rar and 7z, in no particular proportions;
- a `.rar` file renamed to `.zip`, which every unzip tool refuses;
- a shortcut to an archive instead of the archive;
- unicode in `.java` source files, which broke JPlag's parser;
- hidden directories, and the occasional corrupted submission.

So the pipeline is: check the tools exist, extract by what the file *is* rather than what it is called, then clean up before JPlag sees anything.

```sh
#!/bin/bash
# Check for dependencies
if [ $# -ne 0 ]; then
    echo "Error: No command line arguments needed"
    exit 1
fi

command -v detox
exit_status=$?
if [ $exit_status -eq 1 ]; then
    echo "Error: Detox does not exist. Please do sudo apt install detox"
    exit 1
fi

command -v 7zip
exit_status=$?
if [ $exit_status -eq 1 ]; then
    echo "Error: 7zip does not exist. Please install 7zip"
    exit 1
fi

command -v unrar
exit_status=$?
if [ $exit_status -eq 1 ]; then
    echo "Error: unrar does not exist. Please install unrar"
    exit 1
fi
```

The extraction step is where the renamed archives die. `file --mime-type` reports the real format, so `grep -q rar$` catches the file a student called `.zip`, and anything that fails to extract gets moved aside and logged rather than silently skipped.

```sh
# Program to unzip all files in a directory with the correct program
for file in ./*; do
    if file --mime-type "$file" | grep -q zip$; then
        echo "Unzip $file"
        unzip -d "${file%*.zip}" "$file"
        # Check exit status if it is 0, then it is ok
        if [ $? -eq 0 ]; then
            rm -rf "$file"
        else
            mv "$file" ../
            echo "$file" >>../log.txt
        fi
    fi

    if file --mime-type "$file" | grep -q rar$; then
        echo "Unrar $file"
        unrar x -ad "$file"
        if [ $? -eq 0 ]; then
            rm -rf "$file"
        else
            mv "$file" ../
            echo "$file" >>../log.txt
        fi
    fi

    if file --mime-type "$file" | grep -q 7z-compressed$; then
        echo "7z $file"
        7z x "$file" -o"${file%*.7z}"
        if [ $? -eq 0 ]; then
            rm -rf "$file"
        else
            mv "$file" ../
            echo "$file" >>../log.txt
        fi
    fi
done
```

Then the cleaning, which is what makes the reports readable: IDE droppings, hidden files, unicode and awkward directory names all have to go before the comparison means anything.

```sh
# Remove unneeded files
rm -rf ./*/__MACOSX
# Remove unneeded class files
find . -type f -name '*.class' -delete
find . -type f -name '*.ctxt' -delete
# Delete hidden files
find . -name ._\* -print0 | xargs -0 rm -f

# Detox the file to prevent bad naming convention from students.
detox -r ./*

# Remove all unicode.
find . -type f -iname '*.java' -print | while read f; do
    echo "Removing unicode from $f"
    LANG=C sed -i 's/[\d128-\d255]//g' "$f"
done
```

And then the comparison itself, which is one command. Everything above exists to make this one line trustworthy.

```sh
java -jar ../jplag.jar -l java17 -vl -r results -s -m 50 zipped
```

<figure>
<img src="/assets/posts/jplag-report.png" alt="A JPlag report summary: 481 submissions with 2 that could not be parsed, Java 7 parser, 50 matches displayed at a 57.3% average similarity threshold and 50% maximum, dated 2018-09-09, above a similarity histogram peaking in the 10-20% band and ranked match bars from 85.0% down to 64.9%." width="1879" height="889" loading="lazy" decoding="async">
<figcaption>The top of a report: 481 submissions, two of which JPlag could not parse at all, and the distribution underneath — most pairs are unlike each other, which is what a healthy cohort looks like.</figcaption>
</figure>

## Reading the results

The report sorts matches by average similarity, and reading it is not hard. What matters is what it is not: it is a guide to where to look, not a finding. A high similarity score means two students should be interviewed — there are innocent explanations, and there is a real one, and a number cannot tell them apart. The distribution above is more useful than any single pair, because it shows the shape of the cohort rather than one line in it.

## Final words

My feelings about students paying third parties for help are neutral. In a way those people are acting as personal tutors, and as long as what they teach matches what the teaching team teaches, I have no complaint. What bothers me is the other reading: that we were seen as unapproachable enough that paying a stranger $18.80 an hour looked like the better option. The teaching team should be the first place a stuck student goes.

JPlag is a tool to help the teaching team. It was never a substitute for being reachable.

## Bye.

<p class="colophon">Written in 2022, ported from the old Hugo site and lightly edited. Both figures are the originals; the shell is unchanged.</p>
