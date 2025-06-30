import React, { useState, useEffect } from 'react';

interface InteractiveDemoProps {
  title: string;
  description: string;
  demoType: 'calculator' | 'visualizer' | 'simulator';
}

export default function InteractiveDemo({ title, description, demoType }: InteractiveDemoProps) {
  const [isActive, setIsActive] = useState(false);
  const [result, setResult] = useState<string>('');

  const handleInteraction = () => {
    setIsActive(true);
    // Simulate some computation
    setTimeout(() => {
      setResult('Demo completed! This is an Astro island in action.');
    }, 1000);
  };

  return (
    <div className="interactive-demo-island">
      <h3>{title}</h3>
      <p>{description}</p>
      
      <button 
        onClick={handleInteraction}
        className="demo-button"
        disabled={isActive}
      >
        {isActive ? 'Processing...' : 'Start Demo'}
      </button>
      
      {result && (
        <div className="demo-result">
          <strong>Result:</strong> {result}
        </div>
      )}
    </div>
  );
} 