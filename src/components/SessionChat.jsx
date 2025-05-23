// SessionChat.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '../context/WebSocketContext';
import { useAuth } from '../context/AuthContext';
import './SessionChat.css';

const SessionChat = ({ sessionId }) => {
  const { socket, connected } = useWebSocket();
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!connected || !socket) return;

    socket.on('chat-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('chat-message');
    };
  }, [connected, socket]);

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
      timestamp: new Date().toISOString(),
    };

    socket.emit('chat-message', messageData);
    setMessages((prev) => [...prev, messageData]);
    setNewMessage('');
  };

  return (
    <div className="chat-box">
      <div className="chat-header">Chat</div>

      <div className="chat-messages">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`chat-message ${msg.userId === currentUser.id ? 'me' : 'other'}`}
            >
              {msg.userId !== currentUser.id && <div className="sender">{msg.username}</div>}
              <div className="text">{msg.text}</div>
              <div className="time">{new Date(msg.timestamp).toLocaleTimeString()}</div>
            </div>
          ))
        ) : (
          <div className="chat-empty">No messages yet</div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form className="chat-input" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          disabled={!connected}
        />
        <button type="submit" disabled={!connected || !newMessage.trim()}>
          Send
        </button>
      </form>
    </div>
  );
};

export default SessionChat;
