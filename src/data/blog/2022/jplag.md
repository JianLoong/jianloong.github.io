---
title: "Automating JPlag: Streamlining Code Similarity Detection for University Assignments"
author: Jian Liew
pubDatetime: 2022-11-05T20:56:02+11:00
slug: automating-jplag-code-similarity
featured: false
draft: false
readingTime: 6
tags:
  - jplag
  - plagiarism detection
  - automation
  - shell scripting
  - education
  - java
description: "A comprehensive guide to automating JPlag processing for university programming assignments, including file extraction, cleaning, and similarity detection."

---

## Background: Teaching Programming at University Level

FIT9131 (Introduction to Programming) was a challenging unit taught at the Masters level for the Master of Information Technology course at Monash University. As a teaching team member until 2019, I witnessed firsthand the struggles students faced with this demanding course. This was done for multiple semesters over several years.

The unit's reputation for difficulty was so well-known that external services began targeting students. Here's an advertisement I once found in a university bathroom:

<img src="/assets/toilet.png" alt="External tutoring advertisement in university bathroom" style="height: 300px; width: auto; display: block; margin: 0 auto;">

<p align="center"><strong>External tutoring services targeting struggling students</strong></p>

## Why JPlag for Code Similarity Detection?

The teaching team chose JPlag as our primary tool for several compelling reasons:

- **Performance**: Significantly faster and more accurate than manual review
- **Open Source**: Free and available at [GitHub](https://github.com/jplag/JPlag)
- **Scalability**: Handles 450+ students efficiently with automated report generation
- **Active Development**: Regularly updated with improvements and new features

## The Challenge: Processing Student Submissions

JPlag accepts a directory containing student assignments and produces HTML reports. However, the main challenge lies in preparing clean, standardized data for accurate analysis.

### Common Submission Issues

Students often submit files with various problems:

- **Multiple compression formats**: ZIP, RAR, and 7-ZIP files
- **Unicode characters**: Breaking JPlag's parsing
- **Hidden directories**: Corrupted or incomplete submissions
- **File extension mismatches**: RAR files renamed as ZIP
- **Shortcut files**: Instead of actual compressed archives

## Solution: Automated File Processing Pipeline

### Step 1: Dependency Verification

First, we ensure all required tools are installed:

```bash
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

### Step 2: Intelligent File Extraction

Instead of trusting file extensions, we use the `file` command to determine the actual MIME type:

```bash
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

### Step 3: File Cleaning and Standardization

After extraction, we clean the files for JPlag compatibility:

```bash
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

### Step 4: JPlag Analysis

Finally, we run JPlag with optimized settings:

```bash
java -jar ../jplag.jar -l java17 -vl -r results -s -m 50 zipped
```

## Sample Results

Here's what the JPlag output looks like:

<img src="/assets/jplagout.png" alt="JPlag similarity detection results" style="height: 300px; width: auto; display: block; margin: 0 auto;">

<p align="center"><strong>JPlag generates comprehensive HTML reports showing similarity percentages and matching code sections</strong></p>

## Interpreting Results

Reading JPlag results is straightforward, but it's crucial to remember that **similarity scores are guidelines, not definitive proof**. Students with high similarity scores should be interviewed to determine if the similarity indicates:

- **Legitimate collaboration** (if allowed)
- **Plagiarism or collusion**
- **Coincidental similarity** (common in programming assignments)

## Key Technical Insights

### 1. MIME Type Detection
Using `file --mime-type` instead of file extensions prevents processing errors from mislabeled files.

### 2. Error Handling
The script logs failed extractions, allowing for manual review of problematic submissions.

### 3. Unicode Removal
JPlag can struggle with Unicode characters, so we strip them using `sed` with the `LANG=C` locale.

### 4. File Cleanup
Removing generated files (`.class`, `.ctxt`) and system files (`__MACOSX`) ensures JPlag focuses on source code.

## Educational Philosophy

### External Tutoring Services

My stance on students using external tutoring services is neutral. These services can act as personal tutors, which can be beneficial if:

- Their teaching aligns with the course curriculum
- They help students understand concepts rather than providing solutions
- They complement rather than replace instructor support

### The Real Issue: Student-Teacher Communication

What concerns me more is when students feel the teaching team is unapproachable. We should be their primary resource for help and guidance. If students are turning to external services, it might indicate a need to improve our accessibility and support systems.

## Best Practices for Implementation

### 1. Documentation
- Maintain clear logs of processing errors
- Document any manual interventions required
- Keep records of false positives for future reference

### 2. Student Communication
- Be transparent about using similarity detection tools
- Explain the difference between collaboration and collusion
- Provide clear guidelines on acceptable collaboration

### 3. Continuous Improvement
- Regularly review and update the processing pipeline
- Monitor for new file formats or submission methods
- Stay updated with JPlag releases and new features

## Conclusion

JPlag is a powerful tool that significantly improves the efficiency of code similarity detection in educational settings. However, it should be used as part of a comprehensive approach that includes:

- **Automated processing** for efficiency
- **Human judgment** for interpretation
- **Student interviews** for context
- **Educational support** to prevent issues

The goal isn't just to catch plagiarism—it's to create an environment where students learn effectively and feel supported in their educational journey.

---

*JPlag serves as a valuable assistant to the teaching team, helping us focus our attention where it's most needed while maintaining academic integrity.*