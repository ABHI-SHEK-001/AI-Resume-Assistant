import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2  # For extracting text from PDFs
from flask_cors import CORS  # Enable frontend requests
import google.generativeai as genai  # Import Gemini AI SDK

# Load environment variables from .env file
load_dotenv()

# Get API key from .env
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ ERROR: GEMINI_API_KEY is missing! Add it to the .env file.")

# Configure Gemini AI
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# Home Route (Check if Flask is running)
@app.route("/")
def home():
    return "✅ Flask backend is running!"

# Configure upload folder
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["ALLOWED_EXTENSIONS"] = {"pdf", "docx"}

# Function to check allowed file types
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]

# Resume Upload & Analysis Route
@app.route("/upload", methods=["POST"])
def upload_resume():
    if "resume" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
        file.save(filepath)

        # Extract text from the PDF (for analysis)
        extracted_text = extract_text_from_pdf(filepath)

        # AI-based resume analysis using Gemini AI
        ai_feedback = analyze_resume_text(extracted_text)

        return jsonify({"message": "✅ File uploaded successfully!", "feedback": ai_feedback})

    return jsonify({"error": "❌ Invalid file type"}), 400

# Function to extract text from a PDF resume
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

# Function to analyze resume text using Gemini AI
def analyze_resume_text(text):
    """Send resume text to Gemini AI and get AI-powered feedback."""
    model = genai.GenerativeModel("gemini-1.5-flash")  # Fast, cost-effective model

    prompt = f"""
    You are an AI-powered resume evaluator. Analyze the following resume text 
    and provide feedback on strengths, weaknesses, and improvements.

    Resume Text:
    {text}

    Provide clear, structured, and actionable feedback.
    """

    response = model.generate_content(prompt)

    # Extract AI response
    return response.text if response else "❌ Error: No response from AI."

# Run the Flask app
if __name__ == "__main__":
    app.run(debug=True)
