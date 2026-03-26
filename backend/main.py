from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import re

from detector import detect_sensitive_data
from risk_engine import calculate_risk
from ai_analyzer import generate_summary

from PyPDF2 import PdfReader
from docx import Document

app = FastAPI()

# enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#request modal
class AnalyzeOptions(BaseModel):
    mask: bool = True
    block_high_risk: bool = True
    log_analysis: bool = True

class AnalyzeRequest(BaseModel):
    input_type: str   # text | sql | chat | log
    content: str
    options: Optional[AnalyzeOptions] = AnalyzeOptions()


#poilcy
def apply_policy(findings, risk_level, text, mask=True, block_high=True):
    action = "allowed"

    # Block if high risk
    if risk_level == "high" and block_high:
        action = "blocked"

    if mask:
        # Mask password
        text = re.sub(r"(password=)\S+", r"\1****", text, flags=re.IGNORECASE)

        # Mask API key
        text = re.sub(r"(api_key=)\S+", r"\1****", text, flags=re.IGNORECASE)

        # Mask email
        text = re.sub(
            r'([a-zA-Z0-9_.+-]+)@([a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+)',
            r'****@\2',
            text
        )

        # Mask phone number
        text = re.sub(r"\b(\d{6})(\d{4})\b", r"******\2", text)

        # Mask Bearer token
        text = re.sub(r"(Bearer\s+)\S+", r"\1****", text, flags=re.IGNORECASE)

        # Mask generic token=
        text = re.sub(r"(token=)\S+", r"\1****", text, flags=re.IGNORECASE)

    return action, text


#analysis
def process_content(content: str, input_type: str = "log", mask=True, block_high=True):
    # Detection
    findings = detect_sensitive_data(content)

    # Risk engine
    risk_score, risk_level = calculate_risk(findings)

    # AI / Hybrid summary
    summary = generate_summary(content)

    # Policy engine
    action, masked_content = apply_policy(findings, risk_level, content, mask, block_high)

    # Insights
    insights = []

    if "password" in content.lower():
        insights.append("Sensitive credentials exposed in logs")

    if "api_key" in content.lower():
        insights.append("API key exposure detected")

    if "exception" in content.lower() or "traceback" in content.lower():
        insights.append("Stack trace reveals internal system details")

    if "email" in content.lower():
        insights.append("User email found in logs")

    if "debug" in content.lower():
        insights.append("Debug information leaked")

    if "failed login" in content.lower():
        insights.append("Repeated authentication failures detected")

    if not insights:
        insights.append("No major risks detected")

    return {
        "summary": summary,
        "content_type": input_type,
        "findings": findings,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "action": action,
        "insights": insights,
        "masked_content": masked_content
    }


#api detection
@app.post("/analyze")
async def analyze_json(request: AnalyzeRequest):
    return process_content(
        content=request.content,
        input_type=request.input_type,
        mask=request.options.mask,
        block_high=request.options.block_high_risk
    )


#file upload
@app.post("/analyze-file")
async def analyze_file(
    file: UploadFile = File(...)
):
    filename = file.filename.lower()
    content = ""

    # PDF
    if filename.endswith(".pdf"):
        pdf = PdfReader(file.file)
        for page in pdf.pages:
            content += page.extract_text() or ""

    # DOCX
    elif filename.endswith(".docx"):
        doc = Document(file.file)
        content = "\n".join([p.text for p in doc.paragraphs])

    # TXT / LOG
    else:
        content = (await file.read()).decode("utf-8")

    return process_content(content=content, input_type="file")


#home route
@app.get("/")
def home():
    return {"message": "AI Secure Data Intelligence Platform is running 🚀"}