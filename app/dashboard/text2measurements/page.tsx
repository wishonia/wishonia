"use client"

import React, { useState } from 'react';
import {Shell} from "@/components/layout/shell";
import {DashboardHeader} from "@/components/pages/dashboard/dashboard-header";
import {Icons} from "@/components/icons";
import {getTimeZoneOffset, getUtcDateTime} from "@/lib/dateTimeWithTimezone";

// Define a type for the message objects
type Message = {
  type: 'user' | 'response' | 'loading';
  text: string;
};

const App: React.FC = () => {
  const [input, setInput] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const sendMessage = async () => {
    if (input.trim()) {

      setMessages([...messages, { type: 'user', text: input }, { type: 'loading', text: 'Loading...' }]);
      setIsLoading(true);
      const response = await fetch('/api/text2measurements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: input,
          timeZoneOffset: getTimeZoneOffset(),
          utcDateTime: getUtcDateTime(),
        }),
      });
      const data = await response.json();
      setMessages(prevMessages => prevMessages
        .filter(msg => msg.type !== 'loading')
        .concat({ type: 'response', text: JSON.stringify(data) }));
      setIsLoading(false);
      setInput('');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <Shell>
      <DashboardHeader
        heading="Text 2 Measurements"
        text="Tell us what foods, medications, supplements you took or tell me about your symptoms and I'll convert it to structured data."
      />
      <div className="flex flex-col h-full">
        <div className="flex-grow overflow-auto">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.type} break-all overflow-hidden`}>
              {msg.type === 'loading' ? ( <div className="flex justify-center items-center">
                <Icons.spinner className="animate-spin text-4xl" /> </div>) : msg.text}
            </div>
          ))}
        </div>
        <div className="flex fixed bottom-0 left-0 right-0 bg-white">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow form-input border p-2 mr-2"
            placeholder="Type your message..."
          />
          <button onClick={sendMessage} className="btn btn-primary bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Send
          </button>
        </div>
      </div>
    </Shell>
  );
}

export default App;
