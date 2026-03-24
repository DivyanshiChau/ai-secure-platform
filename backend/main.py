from fastapi import FastAPI, UploadFile, Form
from fastapi.middleware.cors import CORSMiddleware

from detector import detect_sensitive_data
from risk_engine import calculate_risk
from ai_analyzer import generate_summary

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ POLICY ENGINE
def apply_policy(findings, risk_level, text, mask=True, block_high=True):
    action = "allowed"

    if risk_level == "high" and block_high:
        action = "blocked"

    if mask:
        for f in findings:
            if f["type"] in ["password", "api_key"]:
                text = text.replace("=", "=****")

    return action, text


# ✅ MULTI INPUT SUPPORT
@app.post("/analyze")
async def analyze(
    file: UploadFile = None,
    text: str = Form(None),
):
    content = ""

    if file:
        content = (await file.read()).decode("utf-8")

    elif text:
        content = text

    else:
        return {"error": "No input provided"}

    # Detection
    findings = detect_sensitive_data(content)

    # Risk engine
    risk_score, risk_level = calculate_risk(findings)

    # AI / Hybrid summary
    summary = generate_summary(content)

    # Policy engine
    action, masked_content = apply_policy(findings, risk_level, content)

    # Insights
    insights = []
    if "password" in content.lower():
        insights.append("Sensitive credentials exposed")
    if "exception" in content.lower():
        insights.append("System error detected")
    if "api_key" in content.lower():
        insights.append("API key exposed")

    return {
        "summary": summary,
        "content_type": "log",
        "findings": findings,
        "risk_score": risk_score,
        "risk_level": risk_level,
        "action": action,
        "insights": insights,
        "masked_content": masked_content
    }