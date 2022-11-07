---
title: "Using JPlag for measuring code similarity for Intro to Programming"
date: 2022-11-05T20:56:02+11:00
tags: ["JPlag", "Plagiarism", "University"]
ShowReadingTime: true
ShowCodeCopyButtons: true
cover:
  image: "/images/jplagout.png"
draft: false
summary: Automating the processing of extracting and cleaning files for JPlag input
---

### Background

Intro to Programming or FIT9131 was a unit taught at the Masters level for the Masters of Information Technology course at Monash University. It was widely known as a challenging unit by the students. I was involved in the teaching of this up to 2019. 

Here is an advertisement I once saw while at the toilet at the University a while back. Basically, it was advertising it could help the students out for those units.

{{< figure src="/images/toilet.png" title="" align="center">}}


### Reasons to use JPlag

The teaching team decided to use JPlag as 

- it was faster and more accurate for our use case. 

- Open-source software and available at their website [here](https://github.com/jplag/JPlag)

- JPlag was also able to produce timely results for over 450 students and generate reports as well. 

- It is also periodically updated. 

### Requirements to use JPlag

JPlag accepts can accept a directory which contains student assignments as an input and produces the output in the form of HTML reports by default. The main challenge here was feeding JPlag clean data and file names so that the reports generated would be accurate. 

Here are some issues that have to do with the student's submission
 - different types of compressed files used by the students, ranging from zip files, RAR files and also 7zip files
 - Unicode in the source files breaking JPlag
 - hidden directories and corrupted submissions
 - students renaming a .rar file to a zip file
 - students submitting a shortcut file instead of a zip file
  
I will use a few unzip programs to do it. I could have used 7zip for everything, but RAR files were causing issues, so I needed to use the ``unrar`` program instead. So basically ``detox`` to detox file names, ``unzip``, ``7zip`` and ``unrar`` to extract the files.

Detox tool is explained [here](https://manpages.ubuntu.com/manpages/trusty/man1/detox.1.html)

This simple shell script below will check if you have all the required programs installed. 

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

The next part is where the files needed to be unzipped. But the idea is simple, using the ``file`` command to obtain the ``mime-type`` of  the file instead of trusting the extension given by the student.

So, for each file, it will check the mine type and then use the correct program to unzip the file. If the file could not be unzipped and there is an error, it will be logged. Remember to also use the right version of ``unrar`` as using other programs might cause the ``rar`` filed to not be extracted.

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

With that we now have all of the files unzipped but we are not done yet. Because the files submitted still needs to be cleaned for use in JPlag. 

Here is a list of potential issues

- the __MACOSX files which are hidden by default for Mac users and serves no purpose for this use case
- both the ``*.class`` and ``.ctxt`` files. (The class files is because it is a Java assignment and the ctxt files were generated from the IDE which was used bu the students.
- Hidden files are removed. 
- We also detox the file names for the directories so that it does not break JPlag
- Finally we remove Unicode 

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

Last and finally we can just feed the entire directory to JPlag and it would generate the reports for us.

```sh
java -jar ../jplag.jar -l java17 -vl -r results -s -m 50 zipped
```

You can also tweak JPlag settings to produce various outputs. You can look at the various flags or options using their documentation.

Here is a screenshot of the results.

{{< figure src="/images/jplagout.png" title="" align="center">}}

### Reading the results

Reading the results of JPlag is pretty straight forward. However, please note that it should only be used as a guide and students with high similarity should be interviewed to see if it is a case of collusion of plagiarism.




### Final words

My feelings with students paying for external help from 3rd parties is neutral, because in a way, these people act like personal tutors for the students. 

As long as what they teach is in line with what is taught by the teaching team, I have no issues with it. However, I do feel sad that the teaching team is seen as not approachable by the students, as we should be the go-to point for them. 

JPlag here is normally just used as a tool to assist the teaching team.