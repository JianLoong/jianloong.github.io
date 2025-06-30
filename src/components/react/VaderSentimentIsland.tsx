import React, { useState, useRef, useEffect } from 'react';

interface VaderResult {
  neg: number;
  pos: number;
  neu: number;
  compound: number;
}

export default function VaderSentimentIsland() {
  const [inputText, setInputText] = useState<string>(
    'Sentiment analysis studies the subjective information in an expression, that is, the opinions, appraisals, emotions, or attitudes towards a topic, person or entity. Expressions can be classified as positive, negative, or neutral. For example: I really like the new design of your website!'
  );
  const [result, setResult] = useState<VaderResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Cleanup worker on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const handleAnalyze = async () => {
    if (inputText.trim() === '') {
      alert('Please enter some text to analyze');
      return;
    }

    setIsAnalyzing(true);
    setShowResults(false);

    try {
      // Create worker if it doesn't exist
      if (!workerRef.current) {
        workerRef.current = new Worker("/assets/scripts/vader-worker.js");
        
        workerRef.current.onmessage = function(e) {
          const analysis: VaderResult = e.data;
          setResult(analysis);
          setShowResults(true);
          setIsAnalyzing(false);
        };

        workerRef.current.onerror = function(e) {
          console.error('Worker error:', e);
          alert('Error analyzing sentiment. Please try again.');
          setIsAnalyzing(false);
        };
      }

      // Send text to worker for analysis
      workerRef.current.postMessage(inputText);
    } catch (error) {
      console.error('Failed to create worker:', error);
      alert('Failed to initialize sentiment analysis. Please refresh the page.');
      setIsAnalyzing(false);
    }
  };

  const getSentimentLabel = (compound: number): string => {
    if (compound >= 0.05) return 'Positive';
    if (compound <= -0.05) return 'Negative';
    return 'Neutral';
  };

  const getSentimentColor = (compound: number): string => {
    if (compound >= 0.05) return 'text-green-600';
    if (compound <= -0.05) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="vader-sentiment-island">
      <div className="input-section">
        <label htmlFor="inputString">Enter text to be analyzed:</label>
        <div className="textwrapper">
          <textarea 
            rows={10} 
            id="inputString" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your text here..."
            className="input-textarea"
          />
        </div>
      </div>

      <button 
        type="button" 
        onClick={handleAnalyze}
        disabled={isAnalyzing}
        className="analyze-button"
      >
        {isAnalyzing ? 'Analyzing...' : 'Run Analysis'}
      </button>

      {showResults && result && (
        <div className="results-section">
          <h4>Results</h4>
          <div className="sentiment-summary">
            <span className={`sentiment-label ${getSentimentColor(result.compound)}`}>
              {getSentimentLabel(result.compound)} Sentiment
            </span>
          </div>
          <table className="result-table">
            <thead>
              <tr>
                <th>Negative</th>
                <th>Positive</th>
                <th>Neutral</th>
                <th>Compound</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{result.neg.toFixed(3)}</td>
                <td>{result.pos.toFixed(3)}</td>
                <td>{result.neu.toFixed(3)}</td>
                <td>{result.compound.toFixed(3)}</td>
              </tr>
            </tbody>
          </table>
          
          <div className="results-explanation">
            <h5>Understanding VADER Scores</h5>
            <div className="score-explanations">
              <div className="score-item">
                <strong>Negative/Positive/Neutral:</strong> These scores represent the proportion of each sentiment type in the text (0-1 scale). They always sum to 1.0.
              </div>
              <div className="score-item">
                <strong>Compound:</strong> The overall sentiment score ranging from -1 (very negative) to +1 (very positive). This is the most useful score for determining overall sentiment.
              </div>
              <div className="compound-scale">
                <strong>Compound Score Scale:</strong>
                <ul>
                  <li><strong>0.05 to 1.0:</strong> Positive sentiment</li>
                  <li><strong>-0.05 to 0.05:</strong> Neutral sentiment</li>
                  <li><strong>-1.0 to -0.05:</strong> Negative sentiment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 