import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import "../styles/HomePage.css";
import "../styles/UploadPage.css";

export default function HomePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState(null); // JSON object instead of string
  const [loading, setLoading] = useState(false);

  const uploadSectionRef = useRef(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file first.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);

    try {
      const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ File uploaded successfully!");
      setFeedback(response.data); // Store JSON object
    } catch (error) {
      console.error("Upload error:", error);
      setMessage("❌ Error uploading file.");
      setFeedback(null);
    } finally {
      setLoading(false);
    }
  };

  const scrollToUpload = () => {
    uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      {/* 🔹 Hero Section */}
      <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-gray-900 to-black text-white text-center">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 drop-shadow-lg"
        >
          AI Resume Assistant
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl md:text-2xl mt-4 text-gray-300"
        >
          Create AI-powered resumes effortlessly.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToUpload}
          className="mt-6 px-6 py-3 text-lg font-semibold bg-blue-600 rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-400"
        >
          Get Started
        </motion.button>
      </div>

      {/* 🔹 Upload Section */}
      <div ref={uploadSectionRef} id="upload-section" className="upload-container">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="upload-title"
        >
          Upload Your Resume
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="upload-box"
        >
          <input type="file" className="form-control" onChange={handleFileChange} />
          <button className="btn btn-primary mt-3" onClick={handleUpload}>
            Upload
          </button>
        </motion.div>

        <p className="upload-message">{message}</p>

        {/* AI-generated Feedback */}
        {loading ? (
          <p className="loading">Processing...</p>
        ) : feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="feedback-box"
          >
            <h3>🔍 AI Feedback:</h3>
            
            {/* Resume Score */}
            <p><strong>🎯 Resume Score:</strong> {feedback.score}/100</p>

            {/* Strengths */}
            <h4>✅ Strengths:</h4>
            <ul>
              {feedback.strengths.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>

            {/* Fix Suggestions */}
            <h4>🛠️ Smart Fix Suggestions:</h4>
            <ul>
              {feedback.fix_suggestions.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
}
