import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2  # For extracting text from PDFs
from flask_cors import CORS  # Enable frontend requests
import google.generativeai as genai  # Import Gemini AI SDK
import json  # To parse structured AI responses

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

# ✅ Home Route (Check if Flask is running)
@app.route("/")
def home():
    return "✅ Flask backend is running!"

# ✅ Configure upload folder
UPLOAD_FOLDER = "uploads"
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
app.config["ALLOWED_EXTENSIONS"] = {"pdf", "docx"}

# ✅ Function to check allowed file types
def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in app.config["ALLOWED_EXTENSIONS"]

# ✅ Resume Upload & Analysis Route
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

        # Extract text from PDF
        extracted_text = extract_text_from_pdf(filepath)

        # AI-powered resume feedback
        ai_feedback = analyze_resume_text(extracted_text)

        return jsonify(ai_feedback)

    return jsonify({"error": "❌ Invalid file type"}), 400

# ✅ Function to extract text from a PDF resume
def extract_text_from_pdf(pdf_path):
    text = ""
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        for page in reader.pages:
            text += page.extract_text() + "\n"
    return text.strip()

# ✅ Function to analyze resume text using Gemini AI
def analyze_resume_text(text):
    model = genai.GenerativeModel("gemini-1.5-flash")  # Fast, cost-effective model

    prompt = f"""
    You are an AI-powered resume evaluator. Analyze the following resume text and return structured feedback.

    **Return the response in STRICTLY VALID JSON format (no explanation, no pre-text, ONLY JSON):**
    {{
      "score": <numeric_score>,
      "strengths": ["<strength1>", "<strength2>", "<strength3>"],
      "fix_suggestions": ["<suggestion1>", "<suggestion2>", "<suggestion3>"]
    }}

    Resume Text:
    {text}
    """

    response = model.generate_content(prompt)

    if response and response.text:
        try:
            ai_response = response.text.strip()

            # ✅ Ensure AI response is valid JSON
            if not ai_response.startswith("{") or not ai_response.endswith("}"):
                print("⚠️ AI Response is not a valid JSON object. Attempting to fix formatting.")
                ai_response = ai_response[ai_response.find("{") : ai_response.rfind("}") + 1]

            parsed_response = json.loads(ai_response)

            # ✅ Scale resume score to 0-100 range
            if "score" in parsed_response and isinstance(parsed_response["score"], (int, float)):
                parsed_response["score"] = round(parsed_response["score"] * 10, 1)  # Multiply by 10

            return {
                "score": parsed_response.get("score", "❌ Error"),
                "strengths": parsed_response.get("strengths", ["AI did not return strengths"]),
                "fix_suggestions": parsed_response.get("fix_suggestions", ["AI did not return improvements"])
            }
        except json.JSONDecodeError:
            print("❌ JSON Parsing Error: AI response is not in valid JSON format.")
            print(f"RAW AI Response: {ai_response}")  # Debugging
            return {
                "score": "❌ Error",
                "strengths": ["AI response was not properly formatted."],
                "fix_suggestions": ["Try re-uploading in a different format."]
            }

    return {
        "score": "❌ Error",
        "strengths": ["No response from AI"],
        "fix_suggestions": ["Check API configuration and try again."]
    }


# --------------------------------------------------
# ✅ Chatbot API (Handles User Queries)
# --------------------------------------------------

@app.route("/chatbot", methods=["POST"])
def chatbot():
    """Handles chatbot queries and returns AI-generated responses."""
    data = request.json
    user_message = data.get("message", "").strip()

    if not user_message:
        return jsonify({"error": "Message is empty!"}), 400

    # Generate AI response
    response_text = get_ai_response(user_message)

    return jsonify({"response": response_text})

# ✅ Function to get AI response
def get_ai_response(user_input):
    """Generate chatbot responses using Gemini AI"""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    You are an AI chatbot assisting users with:
    - Resume writing and improvements
    - Career advice
    - Interview preparation and technical questions
    - ATS optimization tips

    Respond professionally and concisely.

    User: {user_input}
    AI:
    """

    response = model.generate_content(prompt)

    return response.text.strip() if response and response.text else "⚠️ Error: Unable to connect to AI."


# ✅ Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
