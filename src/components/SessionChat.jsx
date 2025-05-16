// client/src/components/SessionChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';

const SessionChat = ({ sessionId }) => {
  const { socket, connected } = useWebSocket();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Set up chat event listeners
  useEffect(() => {
    if (!connected || !socket) return;
    
    socket.on('chat-message', (message) => {
      setMessages(prev => [...prev, message]);
    });
    
    return () => {
      socket.off('chat-message');
    };
  }, [connected, socket]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!connected || !newMessage.trim()) return;
    
    const messageData = {
      id: Date.now().toString(),
      sessionId,
      userId: currentUser.id,
      username: `${currentUser.firstName} ${currentUser.lastName}`,
      text: newMessage,
      timestamp: new Date().toISOString()
    };
    
    socket.emit('chat-message', messageData);
    
    // Add to local messages immediately (optimistic update)
    setMessages(prev => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-100 border-b">
        <h3 className="font-medium">Chat</h3>
      </div>
      
      <div className="h-80 overflow-y-auto p-4">
        {messages.length > 0 ? (
          <div className="space-y-3">
            {messages.map((message) => (
              <div 
                key={message.id}
                className={`flex ${message.userId === currentUser.id ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    message.userId === currentUser.id 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.userId !== currentUser.id && (
                    <div className="text-xs font-medium mb-1">
                      {message.username}
                    </div>
                  )}
                  <div>{message.text}</div>
                  <div className="text-xs mt-1 opacity-70">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            No messages yet
          </div>
        )}
      </div>
      
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type a message..."
            disabled={!connected}
          />
          <button
            type="submit"
            disabled={!connected || !newMessage.trim()}
            className={`px-4 py-2 rounded-r ${
              connected && newMessage.trim()
                ? 'bg-blue-500 hover:bg-blue-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default SessionChat;