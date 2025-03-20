import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/Navbar.css";

const Navbar = ({ darkMode, toggleDarkMode }) => {
  return (
    <motion.nav 
      className={`navbar ${darkMode ? "dark" : "light"}`}
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="navbar-left">
        <h2>AI Resume Assistant</h2>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/upload">Upload</Link>
        <Link to="/about">About</Link>
        <Link to="/contact">Contact</Link>
      </div>
      <motion.div 
        className="dark-mode-toggle" 
        onClick={toggleDarkMode}
        whileHover={{ scale: 1.1 }}
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
