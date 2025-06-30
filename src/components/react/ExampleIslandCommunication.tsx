import React, { useState, useEffect } from 'react';

// Example of React islands communicating through custom events
export default function ExampleIslandCommunication() {
  const [message, setMessage] = useState('');
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    // Listen for messages from other islands
    const handleMessage = (event: CustomEvent) => {
      setReceivedMessages(prev => [...prev, event.detail]);
    };

    window.addEventListener('island-message', handleMessage as EventListener);
    
    return () => {
      window.removeEventListener('island-message', handleMessage as EventListener);
    };
  }, []);

  const sendMessage = () => {
    const customEvent = new CustomEvent('island-message', {
      detail: `Message from Island A: ${message}`,
      bubbles: true
    });
    window.dispatchEvent(customEvent);
    setMessage('');
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', margin: '10px' }}>
      <h3>Island A - Sender</h3>
      <input 
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ marginRight: '10px' }}
      />
      <button onClick={sendMessage}>Send to Other Islands</button>
      
      <h4>Received Messages:</h4>
      <ul>
        {receivedMessages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
} 