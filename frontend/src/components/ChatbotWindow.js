import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import "../styles/ChatbotWindow.css";
import axios from "axios";

const ChatbotWindow = ({ toggleChat }) => {
  const [messages, setMessages] = useState([
    { text: "Hi! How can I assist you with your resume?", sender: "bot", timestamp: new Date() }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTimestamp = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages([...messages, newMessage]);
    setInput("");
    setIsTyping(true); // Show typing animation

    try {
      const response = await axios.post("http://127.0.0.1:5000/chatbot", {
        message: input,
      });

      // Simulate a short delay for bot response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: response.data.response, sender: "bot", timestamp: new Date() }
        ]);
        setIsTyping(false);
      }, 1500);
    } catch (error) {
      console.error("Chatbot error:", error);
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: "⚠️ Error: Unable to connect to AI.", sender: "bot", timestamp: new Date() }
        ]);
        setIsTyping(false);
      }, 1500);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <motion.div
      className="chatbot-window"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.3 }}
    >
      <div className="chatbot-header">
        <span>🤖 AI Chatbot</span>
        <button onClick={toggleChat} className="close-button">✖</button>
      </div>
      <div className="chatbot-body">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text.split("\n").map((line, i) => (
              <React.Fragment key={i}>
                {line}
                <br />
              </React.Fragment>
            ))}
            <span className="timestamp">{formatTimestamp(msg.timestamp)}</span>
          </div>
        ))}

        {isTyping && (
          <div className="message bot typing-indicator">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-footer">
        <input
          type="text"
          className="chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <button className="send-button" onClick={handleSend}>Send</button>
      </div>
    </motion.div>
  );
};

export default ChatbotWindow;
