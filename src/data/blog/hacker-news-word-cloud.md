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
description: "Hacker News Word Cloud "

---

The word cloud generated here is based on the website hacker news.

The reason this post is; is so that it would easier to see the word that appeared the most for the day.

Even though the use of a word cloud is not exactly a good representation of occurrence, it still looks nice.

Please note that the posts here are generated based on the Hacker News API by doing `GET` requests. So, it is based on their current entries. So, it will be **refreshed** when the page is reloaded.

<div class="column" id="cloud">
  <div id="loading">Loading word cloud...</div>
</div>

<script>
// Simple approach: create word cloud once when page loads
(function() {
  // Check if already executed
  if (window.wordCloudCreated) {
    return;
  }
  window.wordCloudCreated = true;

  // Wait for DOM and container
  function waitForContainer() {
    return new Promise((resolve) => {
      const check = () => {
        const container = document.getElementById('cloud');
        if (container) {
          resolve(container);
        } else {
          setTimeout(check, 50);
        }
      };
      check();
    });
  }

  // Load script once
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      if (document.querySelector(`script[src="${src}"]`)) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Clear any existing content
  function clearContainer(container) {
    const existingSvgs = container.querySelectorAll('svg');
    existingSvgs.forEach(svg => svg.remove());
    
    const loadingElement = container.querySelector('#loading');
    if (loadingElement) {
      loadingElement.style.display = 'block';
      loadingElement.innerHTML = 'Loading word cloud...';
    }
  }

  // Main function
  async function createWordCloud() {
    try {
      console.log('Creating word cloud...');
      
      // Wait for container
      const container = await waitForContainer();
      console.log('Container found');
      
      // Clear any existing content
      clearContainer(container);
      
      // Load D3 libraries
      await loadScript('https://d3js.org/d3.v3.min.js');
      await loadScript('https://rawgit.com/jasondavies/d3-cloud/master/build/d3.layout.cloud.js');
      
      // Check if D3 is available
      if (typeof d3 === 'undefined' || typeof d3.layout.cloud === 'undefined') {
        throw new Error('D3 libraries not loaded');
      }
      
      // Create word cloud
      const fill = d3.scale.category20();
      const svg = d3.select('#cloud').append("svg")
        .attr("viewBox", "0 0 800 800")
        .append("g")
        .attr("transform", "translate(400,400)");

      function draw(words) {
        const cloud = svg.selectAll("g text")
          .data(words, d => d.text);

        cloud.enter()
          .append("text")
          .style("font-family", "Impact")
          .style("fill", (d, i) => fill(i))
          .attr("text-anchor", "middle")
          .attr('font-size', 1)
          .text(d => d.text);

        cloud
          .transition()
          .duration(600)
          .style("font-size", d => d.size + "px")
          .attr("transform", d => "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")")
          .style("fill-opacity", 1);

        cloud.exit()
          .transition()
          .duration(200)
          .style('fill-opacity', 1e-6)
          .attr('font-size', 1)
          .remove();
      }

      // Fetch data and create word cloud
      const response = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
      const storyIds = await response.json();
      
      const topStoryIds = storyIds.slice(0, 20);
      const storyPromises = topStoryIds.map(id => 
        fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
          .then(response => response.json())
          .catch(() => null)
      );
      
      const stories = await Promise.all(storyPromises);
      
      // Process words
      const stopWords = [
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
      ];

      let words = stories
        .filter(story => story && story.title)
        .map(story => story.title)
        .join(' ')
        .replace(/[^\w\s]/gi, '')
        .replace(/\d/g, '')
        .toLowerCase()
        .split(' ')
        .filter(word => !stopWords.includes(word))
        .join(' ');

      // Calculate frequency
      const wordArray = words.split(' ');
      const freq = {};
      wordArray.forEach(word => {
        if (word) freq[word] = (freq[word] || 0) + 1;
      });

      // Build word cloud data
      const wordData = Object.entries(freq)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 50)
        .map(([text, size]) => ({ text, size }));

      // Scale sizes
      const maxSize = Math.max(...wordData.map(d => d.size));
      const scaledData = wordData.map(d => ({
        text: d.text,
        size: (d.size / maxSize) * 60 + 50
      }));

      // Hide loading and create word cloud
      const loadingElement = container.querySelector('#loading');
      if (loadingElement) {
        loadingElement.style.display = 'none';
      }

      d3.layout.cloud().size([800, 800])
        .words(scaledData)
        .padding(5)
        .rotate(() => ~~(Math.random() * 2) * 90)
        .font("Impact")
        .fontSize(d => d.size)
        .on("end", draw)
        .start();

      console.log('Word cloud created successfully');
      
    } catch (error) {
      console.error('Error creating word cloud:', error);
      const loadingElement = document.getElementById('loading');
      if (loadingElement) {
        loadingElement.innerHTML = 'Error loading word cloud. Please refresh the page.';
      }
    }
  }

  // Start when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createWordCloud);
  } else {
    createWordCloud();
  }

  // Listen for Astro navigation events
  document.addEventListener('astro:page-load', function() {
    // Check if we're on the word cloud page
    if (window.location.pathname.includes('hacker-news-word-cloud')) {
      console.log('Navigated to word cloud page, resetting flag...');
      window.wordCloudCreated = false; // Reset flag
      setTimeout(() => {
        createWordCloud(); // Create word cloud
      }, 100);
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
