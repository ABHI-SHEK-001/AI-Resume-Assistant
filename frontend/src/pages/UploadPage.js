import React, { useState } from "react";
import axios from "axios";
import "./UploadPage.css"; // Import UploadPage styles

const UploadPage = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");
    const [feedback, setFeedback] = useState("");

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setMessage("Please select a file first.");
            return;
        }

        const formData = new FormData();
        formData.append("resume", file);

        try {
            setMessage("Uploading...");
            const response = await axios.post("http://127.0.0.1:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage(`File uploaded successfully: ${response.data.message}`);
            setFeedback(response.data.feedback);
        } catch (error) {
            console.error("Upload error:", error.response ? error.response.data : error);
            setMessage("Error uploading file. Check console for details.");
        }
    };

    return (
        <div className="upload-container">
            <h1 className="upload-title">Upload Your Resume</h1>
            <div className="upload-box">
                <input type="file" className="form-control" onChange={handleFileChange} />
                <button className="btn btn-primary mt-3" onClick={handleUpload}>Upload</button>
            </div>
            <p className="upload-message">{message}</p>
            {feedback && (
                <div className="feedback-box">
                    <h3>AI Feedback:</h3>
                    <p>{feedback}</p>
                </div>
            )}
        </div>
    );
};

export default UploadPage;
