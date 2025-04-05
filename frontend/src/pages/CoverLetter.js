import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import "../styles/CoverLetter.css";

export default function CoverLetter() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleGenerateCoverLetter = async () => {
    if (!file || !jobDescription) {
      setMessage("Please upload your resume and enter a job description.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    formData.append("job_description", jobDescription);

    try {
      const response = await axios.post("https://ai-resume-assistant.onrender.com/generate-cover-letter", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setCoverLetter(response.data.cover_letter);
      setMessage("✅ Cover letter generated successfully!");
    } catch (error) {
      console.error("Cover letter generation error:", error);
      setMessage("❌ Error generating cover letter.");
      setCoverLetter("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cover-letter-container">
      <h1>📄 AI Cover Letter Generator</h1>
      <p>Upload your resume and enter a job description to generate a customized cover letter.</p>

      <div className="input-section">
        <input type="file" className="form-control" onChange={handleFileChange} />
        <textarea
          placeholder="Enter job description..."
          className="job-description-input"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="generate-button"
          onClick={handleGenerateCoverLetter}
        >
          Generate Cover Letter
        </motion.button>
      </div>

      <p className="message">{message}</p>

      {loading && <p className="loading">Generating...</p>}

      {coverLetter && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="cover-letter-output"
        >
          <h3>📜 Generated Cover Letter:</h3>
          <pre>{coverLetter}</pre>
        </motion.div>
      )}
    </div>
  );
}
