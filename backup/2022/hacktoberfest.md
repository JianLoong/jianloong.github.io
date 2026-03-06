---
title: "Hacktoberfest 2022: Building a Word Cloud Generator"
author: Jian Liew
pubDatetime: 2022-11-07T20:56:02+11:00
slug: hacktoberfest-2022
featured: false
draft: false
readingTime: 4
projectImage: "wordcloud.png"
tags:
  - project
  - data visualization
description: "My Hacktoberfest 2022 project: building a word cloud generator to encourage open-source contributions and refresh my JavaScript skills."

---

## What is Hacktoberfest?

Hacktoberfest is a month-long celebration of open-source projects, their maintainers, and the entire community of contributors. It's a fantastic opportunity to give back to the open-source community while learning new skills and connecting with developers worldwide.

Since 2017, I've been actively contributing to various open-source repositories on GitHub. This year, I decided to take a different approach—instead of just contributing to existing projects, I wanted to create something of my own and encourage others to contribute to it.

<img src="/assets/hacktoberfest.jpg" alt="Hacktoberfest t-shirts collection" style="height: 300px; width: auto; display: block; margin: 0 auto;">

<p align="center"><strong>My collection of Hacktoberfest t-shirts from years of open-source contributions. Sorry for them not being ironed. :3</strong></p>

## The Project: Word Cloud Generator

After a period of health challenges that kept me away from active development, I decided to create a simple yet meaningful open-source project. The result was a [Word Cloud Generator](https://github.com/JianLoong/word-cloud-generator) that does much more than meets the eye.

<img src="/assets/wcg.png" alt="Generated word cloud from Wikipedia article" style="height: 300px; width: auto; display: block; margin: 0 auto;">

<p align="center"><strong>A word cloud generated from a sample Wikipedia article</strong></p>

## Technical Stack and Implementation

### Core Technologies

- **GitHub Pages**: For seamless deployment and hosting
- **D3.js + d3-cloud**: For creating beautiful, interactive word clouds
- **Bootstrap 5**: For responsive, modern UI design
- **Web Workers**: For background text processing to maintain UI responsiveness
- **Natural Language Processing**: For advanced text tokenization and lemmatization

### Key Features

The word cloud generator includes several sophisticated features:

- **Real-time processing**: Text is processed in the background using Web Workers
- **Responsive design**: Works seamlessly across all device sizes
- **Customizable appearance**: Users can adjust colors, fonts, and layouts
- **Multiple input formats**: Supports text input, file uploads, and URL fetching
- **Performance optimized**: Handles large texts without blocking the UI

## Lessons Learned and Technical Insights

### 1. Bootstrap 5 Evolution
Bootstrap 5 has come a long way since its earlier versions. The removal of jQuery dependency has made it significantly lighter and more performant. The new utility classes and improved grid system make responsive design much more straightforward.

### 2. D3-Cloud Library Considerations
While `d3-cloud` is powerful, it has some quirks when creating multiple diagrams on the same page. The library can throw warnings about overlapping elements. For production applications, consider alternatives like `ChartJS` word-cloud library which offers better performance and fewer edge cases.

### 3. Web Workers for Performance
Web Workers proved invaluable for this project. Text processing, especially with large documents, can be computationally expensive. By offloading this work to background threads, the UI remains responsive and users get a smooth experience.

### 4. HTML Select Element Limitations
A surprising challenge was the HTML select element's inability to contain child nodes. When trying to display images or complex content within dropdown options, you need creative workarounds like custom dropdown implementations or alternative UI patterns.

## Open Source Collaboration

After completing the initial version, I opened several issues and marked them as "good first issues" for the community. This approach not only helps improve the project but also provides learning opportunities for new contributors.

While the project was developed quickly and could benefit from more refinement, I intentionally kept it simple to make it accessible for contributors of all skill levels. The goal was to create a welcoming environment for open-source newcomers.

## Personal Reflection and Growth

Working in education for many years, followed by health challenges, made me realize how quickly the technology landscape evolves. This project served as both a technical challenge and a reminder that continuous learning is essential in our field.

The experience reinforced several important lessons:

- **Health is foundational**: Good physical and mental health are crucial for effective learning and development
- **Learning never stops**: The tech industry moves at an incredible pace, and staying current requires ongoing effort
- **Community matters**: Open source isn't just about code—it's about building connections and helping others grow

## The Impact

This project has been more than just a Hacktoberfest contribution. It's become a platform for:

- **Learning**: Both for me and for contributors
- **Community building**: Connecting with developers worldwide
- **Skill demonstration**: Showcasing modern web development techniques
- **Open source advocacy**: Encouraging others to participate in the ecosystem

## Try It Out

You can experience the word cloud generator yourself at [pangrammer.dev/word-cloud-generator](https://pangrammer.dev/word-cloud-generator/).

## Looking Forward

This project continues to evolve with community contributions. I'm always open to discussions, suggestions, and improvements. Whether you're a seasoned developer or just starting your open-source journey, there's a place for you in this project.

## Conclusion

Hacktoberfest 2022 was more than just another month of coding—it was a reminder of why I love this community and this field. Building something from scratch, sharing it with others, and watching it grow through collaboration is what makes open source special.

The word cloud generator project embodies the spirit of Hacktoberfest: learning, sharing, and building together. It's a testament to the power of community-driven development and the endless possibilities that emerge when we combine our skills and knowledge.

---

*Interested in contributing? Check out the [GitHub repository](https://github.com/JianLoong/word-cloud-generator) and join the conversation. Every contribution, no matter how small, makes a difference.*