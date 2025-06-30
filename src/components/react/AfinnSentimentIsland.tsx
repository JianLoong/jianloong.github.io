import React, { useState, useEffect, useRef } from 'react';

interface SentimentData {
  id: string;
  url: string;
  title: string;
  positive: number;
  negative: number;
  neutral: number;
}

interface AfinnLexicon {
  [key: string]: number;
}

export default function AfinnSentimentIsland() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SentimentData[]>([]);
  const [afinnLexicon, setAfinnLexicon] = useState<AfinnLexicon | null>(null);
  const jqueryLoaded = useRef(false);

  // Load jQuery
  const loadjQuery = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if ((window as any).jQuery) {
        jqueryLoaded.current = true;
        resolve();
        return;
      }
      
      const script = document.createElement('script');
      script.src = 'https://code.jquery.com/jquery-3.7.1.min.js';
      script.onload = () => {
        jqueryLoaded.current = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Failed to load jQuery'));
      document.head.appendChild(script);
    });
  };

  // Load AFINN lexicon
  const loadAfinnLexicon = (): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      if ((window as any).afinn) {
        console.log('AFINN already loaded');
        setAfinnLexicon((window as any).afinn);
        resolve();
        return;
      }

      try {
        console.log('Fetching AFINN JSON...');
        // Fetch the JSON file directly
        const response = await fetch('/assets/scripts/afinn-111.json');
        if (!response.ok) {
          throw new Error(`Failed to fetch AFINN JSON: ${response.status}`);
        }
        
        const afinnLexicon = await response.json();
        console.log('AFINN lexicon loaded successfully, word count:', Object.keys(afinnLexicon).length);
        
        setAfinnLexicon(afinnLexicon);
        resolve();
        
      } catch (error) {
        console.error('Error loading AFINN lexicon:', error);
        reject(error);
      }
    });
  };

  // Calculate sentiment score for text
  const buildFreq = (repliesText: string): number => {
    if (!repliesText || !afinnLexicon) return 0;
    const convert = repliesText.replace(/[^\w\s]/gi, '').toLowerCase().split(" ");
    let totalScore = 0;
    for (let i = 0; i < convert.length; i++) {
      const currentWord = convert[i];
      totalScore += afinnLexicon[currentWord] || 0;
    }
    return totalScore;
  };

  // Process post data
  const processPostData = (data: any, link: string) => {
    const title = data[0].data.children[0].data["title"];
    const replies = data[1]["data"].children;
    const url = "https://reddit.com" + link;
    const noOfReplies = replies.length;

    const result: SentimentData = {
      id: data[0].data.children[0].data["id"],
      url: url,
      title: title,
      negative: 0,
      neutral: 0,
      positive: 0
    };

    for (let i = 0; i < noOfReplies; i++) {
      const reply = replies[i]["data"].body;
      const score = buildFreq(reply);
      
      switch (true) {
        case score === 0:
          result.neutral += 1;
          break;
        case score > 0:
          result.positive += 1;
          break;
        case score < 0:
          result.negative += 1;
          break;
      }
    }

    if (result.negative === 0 && result.positive === 0 && result.neutral === 0) {
      return;
    }
    
    setResults(prev => [...prev, result]);
  };

  // Parse individual post
  const parseResult = async (link: string) => {
    const endPoint = "https://reddit.com" + link + ".json?limit=100&jsonp=?";
    
    try {
      if (jqueryLoaded.current) {
        return new Promise((resolve, reject) => {
          (window as any).jQuery.getJSON(endPoint)
            .done((data: any) => {
              console.log('Parse result jQuery success for:', link);
              processPostData(data, link);
              resolve(data);
            })
            .fail((jqXHR: any, textStatus: string, errorThrown: string) => {
              console.log('Parse result jQuery failed for:', link, textStatus, errorThrown);
            });
        });
      } else {
        console.log('jQuery not available for parseResult');
      }
    } catch (error) {
      console.error('Error in parseResult:', error);
    }
  };

  // Process Reddit data
  const processRedditData = (data: any) => {
    const entries = data["data"].children;
    
    if (!entries || entries.length === 0) {
      setError("No posts found from r/HongKong at this time. The subreddit may be private or temporarily unavailable.");
      setLoading(false);
      return;
    }
    
    // Process posts sequentially to avoid overwhelming the API
    for (let i = 0; i < entries.length; i++) {
      const link = entries[i]["data"]["permalink"];
      parseResult(link);
    }
    
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  // Get posts from Reddit
  const getPost = async () => {
    const endPoint = "https://reddit.com/r/hongkong.json?limit=3&jsonp=?";
    
    try {
      console.log('Fetching from:', endPoint);
      
      if (jqueryLoaded.current) {
        console.log('Using jQuery $.getJSON with JSONP');
        return new Promise((resolve, reject) => {
          (window as any).jQuery.getJSON(endPoint)
            .done((data: any) => {
              console.log('jQuery JSONP success:', data);
              processRedditData(data);
              resolve(data);
            })
            .fail((jqXHR: any, textStatus: string, errorThrown: string) => {
              console.log('jQuery JSONP failed:', textStatus, errorThrown);
              setError('Unable to fetch Reddit data. The Reddit API may be temporarily unavailable or the subreddit may be private. Please try again later.');
              setLoading(false);
            });
        });
      } else {
        console.log('jQuery not available');
        setError('Unable to fetch Reddit data. The Reddit API may be temporarily unavailable or the subreddit may be private. Please try again later.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error in getPost:', error);
      setError('Unable to fetch Reddit data. The Reddit API may be temporarily unavailable or the subreddit may be private. Please try again later.');
      setLoading(false);
    }
  };

  // Initialize component
  const initialize = async () => {
    try {
      await loadjQuery();
      await loadAfinnLexicon();
      
      setTimeout(() => {
        getPost();
      }, 500);
      
    } catch (error) {
      console.error('Failed to initialize:', error);
      setError('Failed to load required libraries. Please refresh the page.');
      setLoading(false);
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <div className="afinn-sentiment-island">
      <div className="sentiment-analysis">
        {loading && (
          <div className="loading">
            <p>Loading real Reddit data from r/HongKong...</p>
          </div>
        )}
        
        {error && (
          <div className="error">
            <p><strong>Error</strong><br />{error}</p>
          </div>
        )}
        
        {!loading && !error && results.length > 0 && (
          <div className="loading">
            <p><em>Sentiment analysis complete! Results show real data from r/HongKong.</em></p>
          </div>
        )}
        
        <div className="results">
          {results.map((result, index) => {
            const total = result.positive + result.negative + result.neutral;
            const positivePct = total > 0 ? Math.round((result.positive / total) * 100) : 0;
            const negativePct = total > 0 ? Math.round((result.negative / total) * 100) : 0;
            const neutralPct = total > 0 ? Math.round((result.neutral / total) * 100) : 0;
            
            return (
              <div key={result.id || index} className="result-item">
                <strong>{result.title}</strong>
                <p>
                  <a href={result.url} target="_blank" rel="noopener noreferrer">
                    View post on Reddit
                  </a>
                </p>
                
                <div className="result-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Sentiment</th>
                        <th>Count</th>
                        <th>Percentage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Positive</td>
                        <td>{result.positive}</td>
                        <td>{positivePct}%</td>
                      </tr>
                      <tr>
                        <td>Negative</td>
                        <td>{result.negative}</td>
                        <td>{negativePct}%</td>
                      </tr>
                      <tr>
                        <td>Neutral</td>
                        <td>{result.neutral}</td>
                        <td>{neutralPct}%</td>
                      </tr>
                      <tr>
                        <td><strong>Total</strong></td>
                        <td><strong>{total}</strong></td>
                        <td><strong>100%</strong></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 