import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ComparePage from "./pages/ComparePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import Navbar from "./components/Navbar";
import ChatbotButton from "./components/ChatbotButton";
import ChatbotWindow from "./components/ChatbotWindow";
import ResumeTailor from "./ResumeTailor"; // Import ResumeTailor
import CoverLetter from "./pages/CoverLetter";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
  };

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
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
          <Route path="/tailor-resume" element={<ResumeTailor />} /> {/* Add ResumeTailor Route */}
          <Route path="/cover-letter" element={<CoverLetter />} />

        </Routes>
        <ChatbotButton toggleChat={toggleChat} />
        {isChatOpen && <ChatbotWindow toggleChat={toggleChat} />}
      </div>
    </Router>
  );
};

export default App;
