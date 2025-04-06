import React from "react";
import { motion } from "framer-motion";
import "../styles/AboutPage.css"; 

export default function AboutPage() {
  return (
    <motion.div
      className="about-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1>About AI Resume Assistant</h1>

      <p>
        <strong>AI Resume Assistant</strong> is your smart companion for building and optimizing job-winning resumes and cover letters. Whether you're a fresh graduate, career switcher, or seasoned professional — this tool helps you stand out in a crowded job market.
      </p>

      <h2>🚀 Why We Built This</h2>
      <p>
        In today’s competitive job world, a great resume can be the key to landing your dream opportunity. But not everyone has access to expert guidance or time to learn resume-writing best practices. We built AI Resume Assistant to bridge that gap — using the power of artificial intelligence to give you instant, actionable feedback and enhancements tailored to your resume.
      </p>

      <h2>🧠 What It Does</h2>
      <ul>
        <li>📄 <strong>Upload Your Resume:</strong> Accepts resumes in PDF format for instant analysis.</li>
        <li>🔍 <strong>AI-Powered Feedback:</strong> Scores your resume on overall quality and ATS (Applicant Tracking System) compatibility.</li>
        <li>✅ <strong>Highlights Strengths:</strong> Shows what's working well in your current resume.</li>
        <li>🛠️ <strong>Smart Fix Suggestions:</strong> Offers suggestions to improve content, structure, keywords, and tone.</li>
        <li>📈 <strong>Compare Resumes:</strong> Evaluate multiple versions side-by-side to choose the best one.</li>
        <li>🎯 <strong>Tailor for Job Descriptions:</strong> Match your resume to specific job postings for better targeting.</li>
        <li>✉️ <strong>Cover Letter Generator:</strong> Instantly generate a professional cover letter based on your resume and job description.</li>
        <li>📥 <strong>PDF Report Download:</strong> Save a detailed analysis report for your records or future improvements.</li>
      </ul>

      <h2>💡 How It Helps</h2>
      <p>
        Our mission is to democratize resume building. With this platform, anyone can get high-quality resume feedback without needing a career coach or hours of research. It empowers you to:
      </p>
      <ul>
        <li>🔍 Understand what recruiters and ATS look for.</li>
        <li>🧹 Fix issues before sending your resume out.</li>
        <li>🚀 Increase your chances of landing interviews.</li>
        <li>🎯 Tailor your applications like a pro.</li>
      </ul>

      <p style={{ marginTop: "2rem" }}>
        🔧 Still evolving. We're constantly improving it based on user feedback. Your suggestions and support mean the world to us. 😊
      </p>
    </motion.div>
  );
}
