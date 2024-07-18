'use client'
import React, { useState } from 'react';

const Home = () => {
  const [inputMessage, setInputMessage] = useState(''); // State to hold user input
  const [messages, setMessages] = useState([]); // State to hold chat messages
  const [isLoading, setIsLoading] = useState(false); // State to show loading

  // Function to handle sending a message
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return; // Do nothing if input is empty

    const newMessages = [...messages, { role: 'user', content: inputMessage }];
    setMessages(newMessages); // Add user message to messages
    setInputMessage(''); // Clear input field

    setIsLoading(true); // Set loading state

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newMessages), // Send messages to the backend
    });

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    let receivedText = '';

    // Process the streamed response
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      receivedText += decoder.decode(value, { stream: true });
      setMessages((prevMessages) => [
        ...prevMessages.slice(0, -1),
        { role: 'assistant', content: receivedText },
      ]);
    }

    setIsLoading(false); // Reset loading state
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="w-full max-w-md border rounded-lg p-4">
        {/* Display chat messages */}
        <div className="overflow-y-auto max-h-80 mb-4">
          {messages.map((msg, index) => (
            <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <span className={`px-3 py-2 rounded-lg inline-block ${msg.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                {msg.content}
              </span>
            </div>
          ))}
          {isLoading && <div className="text-gray-500">Loading...</div>}
        </div>
        
        {/* Input and Send button */}
        <div className="flex items-center">
          <input
            type="text"
            className="border rounded-lg px-4 py-2 flex-1 mr-2"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
