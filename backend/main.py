from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from detector import detect_sensitive_data
from risk_engine import calculate_risk
from ai_analyzer import generate_summary

app = FastAPI()

# Enable CORS (for frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze(file: UploadFile):
    content = await file.read()
    text = content.decode("utf-8")

    findings = detect_sensitive_data(text)
    risk_score, risk_level = calculate_risk(findings)
    summary = generate_summary(text)

    return {
        "summary": summary,
        "findings": findings,
        "risk_score": risk_score,
        "risk_level": risk_level
    }