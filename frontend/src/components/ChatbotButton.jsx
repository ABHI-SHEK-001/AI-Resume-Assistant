import React from "react";
import { motion } from "framer-motion";
import "../styles/ChatbotButton.css";

const ChatbotButton = ({ toggleChat }) => {
  return (
    <motion.div
      className="chatbot-button"
      onClick={toggleChat}
      whileHover={{ scale: 1.1 }} // Scale up on hover
      whileTap={{ scale: 0.9 }} // Bounce effect on click
      animate={{
        y: [0, -5, 0], // Floating effect
        transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
      }}
    >
      💬
    </motion.div>
  );
};

export default ChatbotButton;
