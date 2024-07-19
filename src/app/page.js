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

    if (!response.ok) {
      // Handle error response
      console.error('Error fetching response from backend');
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'assistant', content: data.content },
    ]);

    setIsLoading(false); // Reset loading state
  };

  return (
    <div className="flex flex-col h-screen p-4">
      {/* Chat container */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <div className="flex-grow overflow-y-auto mb-4">
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
        <div className="flex items-center space-x-2 mt-auto">
          <input
            type="text"
            className="border rounded-lg px-4 py-2 flex-1"
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
