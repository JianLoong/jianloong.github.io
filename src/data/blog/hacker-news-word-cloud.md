---
title: "Hacker News Word Cloud: Visualizing What's Trending"
author: Jian Liew
pubDatetime: 2019-10-14T20:56:02+11:00
slug: hacker-news-word-cloud
featured: false
draft: false
readingTime: 8
tags:
  - hacker news
  - visualization
  - d3.js
  - javascript
  - api
description: "See what's buzzing on Hacker News with a live word cloud, and learn how to build your own with D3.js and JavaScript."

---

Ever wondered what topics are catching everyone's attention on Hacker News right now? Instead of scrolling through endless headlines, wouldn't it be cool to see the most common words pop out visually? That's exactly what this project does—a live word cloud that updates with the latest top stories from Hacker News.

## Why a Word Cloud?

Word clouds are a fun way to get a quick sense of what's trending. They aren't perfect for deep analysis (context matters!), but they're great for spotting patterns and getting a "vibe check" of the day's tech news.

## How It Works (Live Demo Below!)

Every time you load this page, the app fetches the latest top 20 stories from Hacker News, extracts the titles, and builds a word cloud. The more often a word appears, the bigger it gets. Common words like "the" or "and" are filtered out, so you only see what's unique to today's headlines.

### Live Word Cloud

<div class="column" id="cloud">
  <div id="loading">Loading word cloud...</div>
</div>

## How the Word Cloud is Generated

Here's a quick look at the process:

```
┌────────────────────────────────────────────────────────┐
│              WORD CLOUD GENERATION                     │
├────────────────────────────────────────────────────────┤
│                                                        │
│  ┌─────────────┐    ┌─────────────────────────────┐    │
│  │   Fetch     │──> │        Process Words        │    │
│  │   Data      │    │  • Clean text               │    │
│  └─────────────┘    │  • Remove stop words        │    │
│                     │  • Count frequency          │    │
│                     └─────────────────────────────┘    │
│                              │                         │
│                              ▼                         │
│                     ┌─────────────┐                    │
│                     │   Display   │                    │
│                     │   Cloud     │                    │
│                     └─────────────┘                    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Step-by-Step

1. **Fetch Data:** Get the top 20 story titles from the Hacker News API.
2. **Process Words:** Clean up the text, remove common "stop words" (like "the", "is", "and"), and count how often each word appears.
3. **Display Cloud:** Show the words in a cloud, with size based on frequency.

---

## Want to Build Your Own? Here's How!

Below is the core code you need to create your own live word cloud from any news source or API.

### 1. HTML Structure

```html
<div class="column" id="cloud">
  <div id="loading">Loading word cloud...</div>
</div>
```

### 2. Configuration

```javascript
const CONFIG = {
  containerId: 'cloud',
  loadingId: 'loading',
  apiEndpoint: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  storyCount: 20,
  maxWords: 50,
  svgSize: 800,
  minFontSize: 50,
  maxFontSize: 110
};
```

### 3. Stop Words Filter

```javascript
const STOP_WORDS = new Set([
  'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
  'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
  'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
  'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
  'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
  'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
  'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
  'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
  'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i', 'its', 'why', '', 'ask','hn','s'
]);
```

### 4. Text Processing

```javascript
function processText(text) {
  return text
    .replace(/[^\w\s]/gi, '')  // Remove punctuation
    .replace(/\d/g, '')        // Remove numbers
    .toLowerCase()             // Lowercase
    .split(/\s+/)              // Split into words
    .filter(word => word && !STOP_WORDS.has(word));
}
```

### 5. Fetching and Counting

```javascript
async function fetchStories() {
  // Fetch top story IDs
  const response = await fetch(CONFIG.apiEndpoint);
  const storyIds = await response.json();
  // Fetch story details
  const stories = await Promise.all(
    storyIds.slice(0, CONFIG.storyCount).map(id =>
      fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
    )
  );
  return stories.filter(story => story && story.title);
}

function calculateFrequencies(words) {
  const frequencies = new Map();
  words.forEach(word => {
    frequencies.set(word, (frequencies.get(word) || 0) + 1);
  });
  return frequencies;
}
```

### 6. Rendering the Word Cloud

You'll need D3.js and the d3-cloud layout library. Add these to your HTML:

```html
<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://rawgit.com/jasondavies/d3-cloud/master/build/d3.layout.cloud.js"></script>
```

Then, use the following to render:

```javascript
function renderWordCloud(wordData) {
  // ... see full code in the post for scaling and rendering
}
```

### 7. Putting It All Together

```javascript
async function createWordCloud() {
  const stories = await fetchStories();
  const allText = stories.map(story => story.title).join(' ');
  const words = processText(allText);
  const frequencies = calculateFrequencies(words);
  // ... scale and render as shown above
}
```

---

## What Can You Do With This?

- **Track Trends:** See what's hot on Hacker News at a glance.
- **Customize:** Use any API or text source—just change the endpoint!
- **Learn:** Great for learning about APIs, D3.js, and data visualization.

## Final Thoughts

Word clouds are a playful way to visualize what's happening in the tech world. While they don't tell the whole story, they're a great starting point for exploration and fun. If you want to dig deeper, try tweaking the code to include story content, comments, or even other news sources!

---

*Happy hacking! If you build something cool with this, let me know—I'd love to see it.*

<script>
// Modern JavaScript word cloud implementation
(() => {
  // Prevent multiple executions
  if (window.wordCloudCreated) return;
  window.wordCloudCreated = true;

  // Configuration
  const CONFIG = {
    containerId: 'cloud',
    loadingId: 'loading',
    apiEndpoint: 'https://hacker-news.firebaseio.com/v0/topstories.json',
    storyCount: 20,
    maxWords: 50,
    svgSize: 800,
    minFontSize: 50,
    maxFontSize: 110
  };

  // Stop words for filtering
  const STOP_WORDS = new Set([
    'about', 'after', 'all', 'also', 'am', 'an', 'and', 'another', 'any', 'are', 'as', 'at', 'be',
    'because', 'been', 'before', 'being', 'between', 'both', 'but', 'by', 'came', 'can',
    'come', 'could', 'did', 'do', 'each', 'for', 'from', 'get', 'got', 'has', 'had',
    'he', 'have', 'her', 'here', 'him', 'himself', 'his', 'how', 'if', 'in', 'into',
    'is', 'it', 'like', 'make', 'many', 'me', 'might', 'more', 'most', 'much', 'must',
    'my', 'never', 'now', 'of', 'on', 'only', 'or', 'other', 'our', 'out', 'over',
    'said', 'same', 'see', 'should', 'since', 'some', 'still', 'such', 'take', 'than',
    'that', 'the', 'their', 'them', 'then', 'there', 'these', 'they', 'this', 'those',
    'through', 'to', 'too', 'under', 'up', 'very', 'was', 'way', 'we', 'well', 'were',
    'what', 'where', 'which', 'while', 'who', 'with', 'would', 'you', 'your', 'a', 'i', 'its', 'why', '', 'ask','hn','s'
  ]);

  // Utility functions
  const utils = {
    // Wait for DOM element to exist
    waitForElement: (selector, timeout = 5000) => {
      return new Promise((resolve, reject) => {
        const element = document.querySelector(selector);
        if (element) {
          resolve(element);
          return;
        }

        // Simple polling approach instead of MutationObserver for better compatibility
        const check = () => {
          const element = document.querySelector(selector);
          if (element) {
            resolve(element);
          } else {
            setTimeout(check, 50);
          }
        };
        check();

        // Timeout fallback
        setTimeout(() => {
          reject(new Error(`Element ${selector} not found within ${timeout}ms`));
        }, timeout);
      });
    },

    // Load external script
    loadScript: (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          console.log(`Script ${src} already loaded`);
          resolve();
          return;
        }

        console.log(`Loading script: ${src}`);
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
          console.log(`Script ${src} loaded successfully`);
          resolve();
        };
        script.onerror = (error) => {
          console.error(`Failed to load script ${src}:`, error);
          reject(new Error(`Failed to load ${src}`));
        };
        document.head.appendChild(script);
      });
    },

    // Clear container content
    clearContainer: (container) => {
      const existingSvgs = container.querySelectorAll('svg');
      existingSvgs.forEach(svg => svg.remove());
      
      const loadingElement = container.querySelector(`#${CONFIG.loadingId}`);
      if (loadingElement) {
        loadingElement.style.display = 'block';
        loadingElement.textContent = 'Loading word cloud...';
      }
    },

    // Process text for word cloud
    processText: (text) => {
      return text
        .replace(/[^\w\s]/gi, '')
        .replace(/\d/g, '')
        .toLowerCase()
        .split(/\s+/)
        .filter(word => word && !STOP_WORDS.has(word));
    },

    // Calculate word frequencies
    calculateFrequencies: (words) => {
      const frequencies = new Map();
      words.forEach(word => {
        frequencies.set(word, (frequencies.get(word) || 0) + 1);
      });
      return frequencies;
    },

    // Scale word sizes
    scaleWordSizes: (wordData) => {
      if (wordData.length === 0) return [];
      const maxSize = Math.max(...wordData.map(({ size }) => size));
      return wordData.map(({ text, size }) => ({
        text,
        size: (size / maxSize) * (CONFIG.maxFontSize - CONFIG.minFontSize) + CONFIG.minFontSize
      }));
    }
  };

  // API service
  const api = {
    async fetchTopStories() {
      console.log('Fetching top stories...');
      const response = await fetch(CONFIG.apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log(`Fetched ${data.length} story IDs`);
      return data;
    },

    async fetchStoryDetails(storyId) {
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
        return response.json();
      } catch (error) {
        console.warn(`Failed to fetch story ${storyId}:`, error);
        return null;
      }
    },

    async fetchStories() {
      console.log('Fetching story details...');
      const storyIds = await this.fetchTopStories();
      const topStoryIds = storyIds.slice(0, CONFIG.storyCount);
      
      const storyPromises = topStoryIds.map(id => this.fetchStoryDetails(id));
      const stories = await Promise.all(storyPromises);
      
      const validStories = stories.filter(story => story?.title);
      console.log(`Fetched ${validStories.length} valid stories`);
      return validStories;
    }
  };

  // Word cloud renderer
  class WordCloudRenderer {
    constructor(container) {
      this.container = container;
      this.svg = null;
      this.fill = null;
    }

    initialize() {
      console.log('Initializing word cloud renderer...');
      
      // Check if D3 is available
      if (typeof d3 === 'undefined') {
        throw new Error('D3.js library not loaded');
      }
      
      if (typeof d3.layout.cloud === 'undefined') {
        throw new Error('D3 Cloud layout not loaded');
      }

      // Use the older D3 v3 API for compatibility
      this.fill = d3.scale.category20();
      this.svg = d3.select(`#${CONFIG.containerId}`)
        .append('svg')
        .attr('viewBox', `0 0 ${CONFIG.svgSize} ${CONFIG.svgSize}`)
        .append('g')
        .attr('transform', `translate(${CONFIG.svgSize / 2}, ${CONFIG.svgSize / 2})`);
      
      console.log('Word cloud renderer initialized');
    }

    draw(words) {
      console.log(`Drawing ${words.length} words`);
      const cloud = this.svg.selectAll('g text')
        .data(words, d => d.text);

      // Enter new words
      cloud.enter()
        .append('text')
        .style('font-family', 'Impact')
        .style('fill', (d, i) => this.fill(i))
        .attr('text-anchor', 'middle')
        .attr('font-size', 1)
        .text(d => d.text);

      // Update existing words
      cloud
        .transition()
        .duration(600)
        .style('font-size', d => `${d.size}px`)
        .attr('transform', d => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
        .style('fill-opacity', 1);

      // Exit old words
      cloud.exit()
        .transition()
        .duration(200)
        .style('fill-opacity', 1e-6)
        .attr('font-size', 1)
        .remove();
    }

    render(wordData) {
      console.log(`Rendering word cloud with ${wordData.length} words`);
      d3.layout.cloud()
        .size([CONFIG.svgSize, CONFIG.svgSize])
        .words(wordData)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font('Impact')
        .fontSize(d => d.size)
        .on('end', words => this.draw(words))
        .start();
    }
  }

  // Main word cloud creator
  class WordCloudCreator {
    constructor() {
      this.renderer = null;
    }

    async create() {
      try {
        console.log('Creating word cloud...');

        // Wait for container
        const container = await utils.waitForElement(`#${CONFIG.containerId}`);
        console.log('Container found');

        // Clear existing content
        utils.clearContainer(container);

        // Load D3 libraries
        console.log('Loading D3 libraries...');
        await Promise.all([
          utils.loadScript('https://d3js.org/d3.v3.min.js'),
          utils.loadScript('https://rawgit.com/jasondavies/d3-cloud/master/build/d3.layout.cloud.js')
        ]);
        console.log('D3 libraries loaded');

        // Initialize renderer
        this.renderer = new WordCloudRenderer(container);
        this.renderer.initialize();

        // Fetch and process data
        console.log('Fetching and processing data...');
        const stories = await api.fetchStories();
        
        if (stories.length === 0) {
          throw new Error('No stories fetched');
        }

        const allText = stories.map(story => story.title).join(' ');
        const words = utils.processText(allText);
        
        if (words.length === 0) {
          throw new Error('No words after processing');
        }

        const frequencies = utils.calculateFrequencies(words);

        // Build word cloud data
        const wordData = Array.from(frequencies.entries())
          .map(([text, size]) => ({ text, size }))
          .sort((a, b) => b.size - a.size)
          .slice(0, CONFIG.maxWords);

        if (wordData.length === 0) {
          throw new Error('No word data generated');
        }

        const scaledData = utils.scaleWordSizes(wordData);
        console.log(`Generated ${scaledData.length} words for word cloud`);

        // Hide loading and render
        const loadingElement = container.querySelector(`#${CONFIG.loadingId}`);
        if (loadingElement) {
          loadingElement.style.display = 'none';
        }

        this.renderer.render(scaledData);
        console.log('Word cloud created successfully');

      } catch (error) {
        console.error('Error creating word cloud:', error);
        const loadingElement = document.getElementById(CONFIG.loadingId);
        if (loadingElement) {
          loadingElement.textContent = `Error: ${error.message}. Please refresh the page.`;
        }
      }
    }
  }

  // Initialize word cloud
  const createWordCloud = async () => {
    const creator = new WordCloudCreator();
    await creator.create();
  };

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWordCloud);
  } else {
    createWordCloud();
  }

  // Handle Astro navigation
  document.addEventListener('astro:page-load', () => {
    if (window.location.pathname.includes('hacker-news-word-cloud')) {
      console.log('Navigated to word cloud page, resetting flag...');
      window.wordCloudCreated = false;
      setTimeout(createWordCloud, 100);
    }
  });
})();
</script>

<style>
#loading {
  text-align: center;
  padding: 20px;
  font-size: 16px;
  color: #666;
}

@media only screen and (min-width: 1000px)  {
  .row {
    display: flex !important;
  }
  .column {
    flex: 50% !important;
  }
}
</style>
