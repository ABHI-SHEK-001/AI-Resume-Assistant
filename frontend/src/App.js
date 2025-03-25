import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotWindow from "./components/ChatbotWindow"; // Import chatbot window

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [isChatOpen, setIsChatOpen] = useState(false); // Chatbot visibility state

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen); // Toggle chatbot visibility
  };

  return (
    <Router>
      <div className={darkMode ? "dark-mode" : "light-mode"}>
        <Navbar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
        <ChatbotButton toggleChat={toggleChat} />
        {isChatOpen && <ChatbotWindow toggleChat={toggleChat} />} {/* Conditionally render chatbot */}
      </div>
    </Router>
  );
};

export default App;
