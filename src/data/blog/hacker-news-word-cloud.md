---
title: "Hacker News Word Cloud"
author: Jian Liew
pubDatetime: 2019-10-14T20:56:02+11:00
slug: hacker-news-word-cloud
featured: true
draft: false
tags:
  - hacker news
  - visualisation
  - d3.js
  - javascript
  - api
description: "A dynamic word cloud visualization of Hacker News top stories using D3.js and the Hacker News API"

---

The word cloud generated here is based on the website hacker news.

The reason this post is; is so that it would easier to see the word that appeared the most for the day.

Even though the use of a word cloud is not exactly a good representation of occurrence, it still looks nice.

Please note that the posts here are generated based on the Hacker News API by doing `GET` requests. So, it is based on their current entries. So, it will be **refreshed** when the page is reloaded.

<div class="column" id="cloud">
  <div id="loading">Loading word cloud...</div>
</div>

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
