import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf"; // ✅ Added
import "../styles/HomePage.css";
import "../styles/UploadPage.css";
import "../styles/ResumeTailor.css";
import "../styles/CoverLetter.css";
import Contact from "./ContactPage";


export default function HomePage() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const uploadSectionRef = useRef(null);
  const navigate = useNavigate();

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
      const response = await axios.post("https://ai-resume-assistant.onrender.com/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ File uploaded successfully!");
      setFeedback(response.data);
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

  const contactSectionRef = useRef(null);


  const scrollToContact = () => {
    contactSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  // const scrollToAbout = () => {
  //   uploadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  // };

  const downloadPDF = () => {
    if (!feedback) return;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("AI Resume Feedback", 20, 20);

    doc.setFontSize(12);
    doc.text(`🎯 Resume Score: ${feedback.score}/100`, 20, 40);
    doc.text(`📊 ATS Compatibility Score: ${feedback.ats_score}/100`, 20, 50);

    doc.text("✅ Strengths:", 20, 70);
    feedback.strengths.forEach((point, index) => {
      doc.text(`- ${point}`, 25, 80 + index * 10);
    });

    const offset = 80 + feedback.strengths.length * 10 + 10;
    doc.text("🛠️ Fix Suggestions:", 20, offset);
    feedback.fix_suggestions.forEach((point, index) => {
      doc.text(`- ${point}`, 25, offset + 10 + index * 10);
    });

    doc.save("Resume_Feedback.pdf");
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
            <p><strong>🎯 Resume Score:</strong> {feedback.score}/100</p>
            <p><strong>📊 ATS Compatibility Score:</strong> {feedback.ats_score}/100</p>

            <h4>✅ Strengths:</h4>
            <ul>
              {feedback.strengths.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>
            <h4>🛠️ Smart Fix Suggestions:</h4>
            <ul>
              {feedback.fix_suggestions.map((point, index) => (
                <li key={index}>• {point}</li>
              ))}
            </ul>

            {/* 📄 PDF Download Button */}
            <button className="btn btn-success mt-3" onClick={downloadPDF}>
              Download PDF Report
            </button>
          </motion.div>
        )}
      </div>

      {/* 🔹 Compare Resumes Section */}
      <div className="compare-resumes-section">
        <h2>Wanna Compare Resumes?</h2>
        <p>Analyze and compare multiple resumes with AI-powered insights.</p>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="compare-button"
          onClick={() => navigate("/compare")}
        >
          Compare Now
        </motion.button>
      </div>

      {/* 🔹 Tailor Resume Section */}
      <section className="tailor-resume-section">
        <h2 className="tailor-title">Tailor Your Resume</h2>
        <p className="tailor-description">
          Optimize your resume based on a job description for better ATS compatibility and job matching.
        </p>
        <Link to="/tailor-resume">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="tailor-btn"
          >
            Get Started
          </motion.button>
        </Link>
      </section>

      {/* 🔹 Cover Letter Generator */}
      <section className="cover-letter-section">
        <h2 className="cover-letter-title">Generate AI Cover Letter</h2>
        <p className="cover-letter-description">
          Get a professional cover letter tailored to your resume and job description.
        </p>
        <Link to="/cover-letter">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="cover-letter-btn"
          >
            Generate Now
          </motion.button>
        </Link>
      </section>
    </div>
  );
}
