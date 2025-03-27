import React, { useState } from "react";

const ResumeTailor = () => {
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tailoredResume, setTailoredResume] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const response = await fetch("http://127.0.0.1:5000/tailor-resume", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resume_text: resumeText, job_description: jobDescription }),
      });

      const data = await response.json();
      setTailoredResume(data.tailored_resume);
    } catch (error) {
      console.error("Error fetching tailored resume:", error);
    }

    setLoading(false); // Stop loading
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tailoredResume);
    alert("Copied to Clipboard! ✅");
  };

  const downloadResume = () => {
    const element = document.createElement("a");
    const file = new Blob([tailoredResume], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = "Tailored_Resume.txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div style={{ textAlign: "center", margin: "40px auto", width: "60%" }}>
      <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>Tailor Your Resume</h2>

      {/* Resume Input */}
      <textarea
        placeholder="Enter Your Resume Text Here"
        value={resumeText}
        onChange={(e) => setResumeText(e.target.value)}
        rows="6"
        cols="60"
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          width: "100%",
          maxWidth: "600px",
        }}
      />

      {/* Job Description Input */}
      <textarea
        placeholder="Enter Job Description Here"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        rows="4"
        cols="60"
        style={{
          display: "block",
          margin: "10px auto",
          padding: "10px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          fontSize: "16px",
          width: "100%",
          maxWidth: "600px",
        }}
      />

      {/* Tailor Resume Button */}
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#007bff",
          color: "white",
          padding: "10px 20px",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginTop: "10px",
          fontSize: "16px",
        }}
      >
        {loading ? (
          <div className="spinner" style={{ display: "inline-block", verticalAlign: "middle" }}></div>
        ) : (
          "Tailor Resume"
        )}
      </button>

      {/* Display Tailored Resume */}
      {tailoredResume && (
        <div
          style={{
            marginTop: "20px",
            textAlign: "left",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            border: "2px solid #ddd",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.1)",
            maxWidth: "600px",
            margin: "20px auto",
          }}
        >
          <h3 style={{ borderBottom: "2px solid #007bff", paddingBottom: "5px", marginBottom: "10px" }}>
            Tailored Resume:
          </h3>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "Arial, sans-serif",
              lineHeight: "1.6",
              fontSize: "16px",
            }}
          >
            {tailoredResume}
          </pre>

          {/* Copy & Download Buttons */}
          <button
            onClick={copyToClipboard}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "8px 15px",
              marginRight: "10px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            📋 Copy
          </button>

          <button
            onClick={downloadResume}
            style={{
              backgroundColor: "#17a2b8",
              color: "white",
              padding: "8px 15px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            📥 Download
          </button>
        </div>
      )}
    </div>
  );
};

export default ResumeTailor;
