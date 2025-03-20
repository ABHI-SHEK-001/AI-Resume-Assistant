import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "../styles/HomePage.css"; // Import the new CSS

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="overlay"></div> {/* Overlay for better text visibility */}
            <motion.div
                className="home-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1>Welcome to AI Resume Assistant</h1>
                <p>Create AI-powered resumes effortlessly.</p>
                <motion.button
                    className="start-button"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    onClick={() => navigate("/upload")}
                >
                    Get Started
                </motion.button>
            </motion.div>
        </div>
    );
};

export default HomePage;
