import React, { useState } from "react";
import axios from "axios";
import "../styles/ComparePage.css";

export default function ComparePage() {
  const [file1, setFile1] = useState(null);
  const [file2, setFile2] = useState(null);
  const [comparisonResult, setComparisonResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // New loading state

  const handleFileChange1 = (event) => setFile1(event.target.files[0]);
  const handleFileChange2 = (event) => setFile2(event.target.files[0]);

  const handleCompare = async () => {
    if (!file1 || !file2) {
      setError("Please select two resumes to compare.");
      return;
    }

    setError("");
    setLoading(true); // Start loading
    setComparisonResult(null); // Clear previous results

    const formData = new FormData();
    formData.append("resume1", file1);
    formData.append("resume2", file2);

    try {
      const response = await axios.post("https://ai-resume-assistant.onrender.com/compare", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setComparisonResult(response.data);
    } catch (error) {
      console.error("Comparison error:", error);
      setError("Error comparing resumes.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="compare-page">
      <h1 className="compare-title">📊 Resume Comparison</h1>

      <div className="upload-container">
        <div className="upload-section">
          <input type="file" onChange={handleFileChange1} />
          <input type="file" onChange={handleFileChange2} />
          <button className="compare-btn" onClick={handleCompare} disabled={loading}>
            {loading ? "Comparing..." : "Compare Resumes"}
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {/* Loading Indicator */}
      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing resumes...</p>
        </div>
      )}

      {/* Display Comparison Results */}
      {comparisonResult && !loading && (
        <div className="comparison-results">
          <h2>🔍 Comparison Result</h2>
          <p><strong>Best Resume:</strong> {comparisonResult.best_resume}</p>
          <p><strong>Score:</strong> {comparisonResult.best_score}/100</p>
          <p><strong>📊 ATS Compatibility Score:</strong> {comparisonResult.ats_score}/100</p>


          <div className="comparison-table">
            <div className="column">
              <h3>Resume 1</h3>
              {comparisonResult.improvements
                .filter((item) => item.startsWith("Resume 1"))
                .map((item, index) => (
                  <p key={index}>• {item.replace("Resume 1: ", "")}</p>
                ))}
            </div>

            <div className="column">
              <h3>Resume 2</h3>
              {comparisonResult.improvements
                .filter((item) => item.startsWith("Resume 2"))
                .map((item, index) => (
                  <p key={index}>• {item.replace("Resume 2: ", "")}</p>
                ))}
            </div>
          </div>

          {/* Common Suggestions */}
          <div className="common-section">
            <h3>🛠️ Common Improvement Suggestions</h3>
            {comparisonResult.improvements
              .filter((item) => item.startsWith("Both Resumes"))
              .map((item, index) => (
                <p key={index}>• {item.replace("Both Resumes: ", "")}</p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
