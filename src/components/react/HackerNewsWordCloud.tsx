import React, { useState, useEffect, useRef } from 'react';

interface Story {
  id: number;
  title: string;
  url?: string;
  score?: number;
}

interface WordData {
  text: string;
  size: number;
  x?: number;
  y?: number;
  rotate?: number;
}

interface Config {
  containerId: string;
  loadingId: string;
  apiEndpoint: string;
  storyCount: number;
  maxWords: number;
  svgSize: number;
  minFontSize: number;
  maxFontSize: number;
}

const CONFIG: Config = {
  containerId: 'hacker-news-cloud',
  loadingId: 'hn-loading',
  apiEndpoint: 'https://hacker-news.firebaseio.com/v0/topstories.json',
  storyCount: 20,
  maxWords: 50,
  svgSize: 800,
  minFontSize: 50,
  maxFontSize: 110
};

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

export default function HackerNewsWordCloud() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordData, setWordData] = useState<WordData[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const d3Loaded = useRef(false);

  // Load D3 libraries
  const loadD3Libraries = async (): Promise<void> => {
    if (d3Loaded.current) return;

    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load ${src}`));
        document.head.appendChild(script);
      });
    };

    try {
      await Promise.all([
        loadScript('https://d3js.org/d3.v3.min.js'),
        loadScript('https://rawgit.com/jasondavies/d3-cloud/master/build/d3.layout.cloud.js')
      ]);
      d3Loaded.current = true;
    } catch (error) {
      throw new Error('Failed to load D3 libraries');
    }
  };

  // Process text for word cloud
  const processText = (text: string): string[] => {
    return text
      .replace(/[^\w\s]/gi, '')
      .replace(/\d/g, '')
      .toLowerCase()
      .split(/\s+/)
      .filter(word => word && !STOP_WORDS.has(word));
  };

  // Calculate word frequencies
  const calculateFrequencies = (words: string[]): Map<string, number> => {
    const frequencies = new Map<string, number>();
    words.forEach(word => {
      frequencies.set(word, (frequencies.get(word) || 0) + 1);
    });
    return frequencies;
  };

  // Scale word sizes
  const scaleWordSizes = (wordData: WordData[]): WordData[] => {
    if (wordData.length === 0) return [];
    const maxSize = Math.max(...wordData.map(({ size }) => size));
    return wordData.map(({ text, size }) => ({
      text,
      size: (size / maxSize) * (CONFIG.maxFontSize - CONFIG.minFontSize) + CONFIG.minFontSize
    }));
  };

  // API service
  const api = {
    async fetchTopStories(): Promise<number[]> {
      const response = await fetch(CONFIG.apiEndpoint);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    },

    async fetchStoryDetails(storyId: number): Promise<Story | null> {
      try {
        const response = await fetch(`https://hacker-news.firebaseio.com/v0/item/${storyId}.json`);
        return response.json();
      } catch (error) {
        console.warn(`Failed to fetch story ${storyId}:`, error);
        return null;
      }
    },

    async fetchStories(): Promise<Story[]> {
      const storyIds = await this.fetchTopStories();
      const topStoryIds = storyIds.slice(0, CONFIG.storyCount);
      
      const storyPromises = topStoryIds.map(id => this.fetchStoryDetails(id));
      const stories = await Promise.all(storyPromises);
      
      return stories.filter(story => story?.title) as Story[];
    }
  };

  // Render word cloud using D3
  const renderWordCloud = (words: WordData[]) => {
    if (!svgRef.current || typeof (window as any).d3 === 'undefined') return;

    const d3 = (window as any).d3;
    const fill = d3.scale.category20();

    // Clear existing content
    d3.select(svgRef.current).selectAll('*').remove();

    const svg = d3.select(svgRef.current)
      .append('g')
      .attr('transform', `translate(${CONFIG.svgSize / 2}, ${CONFIG.svgSize / 2})`);

    d3.layout.cloud()
      .size([CONFIG.svgSize, CONFIG.svgSize])
      .words(words)
      .padding(5)
      .rotate(() => ~~(Math.random() * 2) * 90)
      .font('Impact')
      .fontSize((d: WordData) => d.size)
      .on('end', (words: WordData[]) => {
        const cloud = svg.selectAll('g text')
          .data(words, (d: WordData) => d.text);

        // Enter new words
        cloud.enter()
          .append('text')
          .style('font-family', 'Impact')
          .style('fill', (d: WordData, i: number) => fill(i))
          .attr('text-anchor', 'middle')
          .attr('font-size', 1)
          .text((d: WordData) => d.text);

        // Update existing words
        cloud
          .transition()
          .duration(600)
          .style('font-size', (d: WordData) => `${d.size}px`)
          .attr('transform', (d: WordData) => `translate(${d.x}, ${d.y})rotate(${d.rotate})`)
          .style('fill-opacity', 1);

        // Exit old words
        cloud.exit()
          .transition()
          .duration(200)
          .style('fill-opacity', 1e-6)
          .attr('font-size', 1)
          .remove();
      })
      .start();
  };

  // Create word cloud
  const createWordCloud = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load D3 libraries
      await loadD3Libraries();

      // Fetch and process data
      const stories = await api.fetchStories();
      
      if (stories.length === 0) {
        throw new Error('No stories fetched');
      }

      const allText = stories.map(story => story.title).join(' ');
      const words = processText(allText);
      
      if (words.length === 0) {
        throw new Error('No words after processing');
      }

      const frequencies = calculateFrequencies(words);

      // Build word cloud data
      const rawWordData = Array.from(frequencies.entries())
        .map(([text, size]) => ({ text, size }))
        .sort((a, b) => b.size - a.size)
        .slice(0, CONFIG.maxWords);

      if (rawWordData.length === 0) {
        throw new Error('No word data generated');
      }

      const scaledData = scaleWordSizes(rawWordData);
      setWordData(scaledData);
      setLoading(false);

      // Render after state update
      setTimeout(() => {
        renderWordCloud(scaledData);
      }, 100);

    } catch (error) {
      console.error('Error creating word cloud:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');
      setLoading(false);
    }
  };

  useEffect(() => {
    createWordCloud();
  }, []);

  return (
    <div className="hacker-news-word-cloud">
      <div 
        ref={containerRef}
        id={CONFIG.containerId}
        style={{ 
          width: '100%', 
          maxWidth: `${CONFIG.svgSize}px`, 
          margin: '0 auto',
          textAlign: 'center'
        }}
      >
        {loading && (
          <div id={CONFIG.loadingId} style={{ padding: '20px', fontSize: '16px', color: '#666' }}>
            Loading word cloud...
          </div>
        )}
        
        {error && (
          <div style={{ padding: '20px', fontSize: '16px', color: '#d32f2f' }}>
            Error: {error}. Please refresh the page.
          </div>
        )}
        
        {!loading && !error && (
          <svg
            ref={svgRef}
            width={CONFIG.svgSize}
            height={CONFIG.svgSize}
            viewBox={`0 0 ${CONFIG.svgSize} ${CONFIG.svgSize}`}
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        )}
      </div>
    </div>
  );
} 