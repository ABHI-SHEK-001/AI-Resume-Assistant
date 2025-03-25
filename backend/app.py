import os
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename
import PyPDF2  # For extracting text from PDFs
from flask_cors import CORS  # Enable frontend requests
import google.generativeai as genai  # Import Gemini AI SDK
import json  # To parse structured AI responses

# Load environment variables
load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError("❌ ERROR: GEMINI_API_KEY is missing! Add it to the .env file.")

# Configure Gemini AI
genai.configure(api_key=GEMINI_API_KEY)

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS

# ✅ Home Route
@app.route("/")
def home():
    return "✅ Flask backend is running!"

# ✅ Configure Upload Folder
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

        # Extract text
        extracted_text = extract_text_from_pdf(filepath)
        ai_feedback = analyze_resume_text(extracted_text)

        return jsonify(ai_feedback)

    return jsonify({"error": "❌ Invalid file type"}), 400

# ✅ Function to extract text from PDFs
def extract_text_from_pdf(pdf_path):
    text = ""
    try:
        with open(pdf_path, "rb") as file:
            reader = PyPDF2.PdfReader(file)
            for page in reader.pages:
                text += page.extract_text() + "\n"
    except Exception as e:
        print("❌ Error extracting text from PDF:", e)
    return text.strip()

# ✅ Resume Analysis using Gemini AI
def analyze_resume_text(text):
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    You are an AI-powered resume evaluator. Analyze the following resume text and return structured feedback.

    Return the response in STRICTLY VALID JSON:
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

            # ✅ Ensure valid JSON
            if not ai_response.startswith("{") or not ai_response.endswith("}"):
                ai_response = ai_response[ai_response.find("{") : ai_response.rfind("}") + 1]

            parsed_response = json.loads(ai_response)

            # ✅ Scale resume score (if numeric)
            if "score" in parsed_response and isinstance(parsed_response["score"], (int, float)):
                parsed_response["score"] = round(parsed_response["score"] * 10, 1)

            return parsed_response
        except json.JSONDecodeError:
            return {"score": "❌ Error", "strengths": ["Invalid AI response."], "fix_suggestions": ["Try again."]}

    return {"score": "❌ Error", "strengths": ["No response from AI"], "fix_suggestions": ["Check API settings."]}

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

    response_text = get_ai_response(user_message)
    return jsonify({"response": response_text})

# ✅ Function to get AI response
def get_ai_response(user_input):
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

# --------------------------------------------------
# ✅ Resume Comparison API
# --------------------------------------------------
@app.route("/compare", methods=["POST"])
def compare_resumes():
    """Compares two resumes and returns AI feedback."""
    if "resume1" not in request.files or "resume2" not in request.files:
        return jsonify({"error": "Two resumes are required for comparison."}), 400

    file1 = request.files["resume1"]
    file2 = request.files["resume2"]

    if file1.filename == "" or file2.filename == "":
        return jsonify({"error": "Both resumes must be selected."}), 400

    # ✅ Save both files before processing
    filepath1 = os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(file1.filename))
    filepath2 = os.path.join(app.config["UPLOAD_FOLDER"], secure_filename(file2.filename))
    
    file1.save(filepath1)
    file2.save(filepath2)

    # ✅ Extract text from saved PDFs
    text1 = extract_text_from_pdf(filepath1)
    text2 = extract_text_from_pdf(filepath2)

    if not text1 or not text2:
        return jsonify({"error": "Error extracting text from one or both resumes."}), 400

    # ✅ Compare extracted resume texts
    comparison_feedback = analyze_resume_comparison(text1, text2)
    return jsonify(comparison_feedback)


# ✅ Resume Comparison Function
def analyze_resume_comparison(text1, text2):
    """Use AI to compare two resumes and provide structured feedback."""
    model = genai.GenerativeModel("gemini-1.5-flash")

    prompt = f"""
    Compare the following two resumes and determine which one is stronger.
    Provide structured feedback, highlighting key differences, strengths, and areas for improvement.

    **Return the response in STRICTLY VALID JSON format (ONLY JSON, no explanation):**
    {{
      "best_resume": "Resume 1" or "Resume 2",
      "best_score": <numeric_score_out_of_100>,
      "improvements": [
        "Resume 1: <suggestion1>",
        "Resume 1: <suggestion2>",
        "Resume 2: <suggestion3>",
        "Resume 2: <suggestion4>",
        "Both Resumes: <common_suggestion>"
      ]
    }}

    Resume 1:
    {text1}

    Resume 2:
    {text2}
    """

    response = model.generate_content(prompt)

    if response and response.text:
        try:
            ai_response = response.text.strip()

            # ✅ Ensure AI response is in valid JSON format
            if not ai_response.startswith("{") or not ai_response.endswith("}"):
                print("⚠️ AI Response is not a valid JSON object. Attempting to fix formatting.")
                ai_response = ai_response[ai_response.find("{") : ai_response.rfind("}") + 1]

            parsed_response = json.loads(ai_response)

            # ✅ Multiply score by 10 if it's in decimal format
            if "best_score" in parsed_response and isinstance(parsed_response["best_score"], (int, float)):
                parsed_response["best_score"] = round(parsed_response["best_score"] , 1)

            return parsed_response  # ✅ Return structured JSON response

        except json.JSONDecodeError:
            print("❌ JSON Parsing Error: AI response is not in valid JSON format.")
            print(f"RAW AI Response: {ai_response}")  # Debugging
            return {
                "best_resume": "❌ Error",
                "best_score": "N/A",
                "improvements": ["AI could not compare resumes properly."]
            }

    return {
        "best_resume": "❌ Error",
        "best_score": "N/A",
        "improvements": ["No response from AI."]
    }


# ✅ Run Flask App
if __name__ == "__main__":
    app.run(debug=True)
