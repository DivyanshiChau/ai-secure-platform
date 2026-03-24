import os
from dotenv import load_dotenv

load_dotenv()

def generate_summary(text):
    # 🔹 STEP 1: Try real AI (Gemini)
    try:
        from google import genai

        api_key = os.getenv("GEMINI_API_KEY")

        if api_key:
            client = genai.Client(api_key=api_key)

            response = client.models.generate_content(
                model="gemini-2.0-flash",
                contents=f"""
                Analyze this log for:
                - sensitive data exposure
                - security risks
                - anomalies

                Log:
                {text[:1000]}
                """
            )

            return response.text

    except Exception:
        pass  # fallback below


    # 🔥 STEP 2: SMART FALLBACK (your AI simulation)

    risks = []
    risk_level = "low"

    text_lower = text.lower()

    if "password" in text_lower:
        risks.append("Sensitive password detected")
        risk_level = "high"

    if "api_key" in text_lower:
        risks.append("API key exposure found")
        risk_level = "high"

    if "exception" in text_lower:
        risks.append("System error detected (stack trace leak)")
        if risk_level != "high":
            risk_level = "medium"

    if "email" in text_lower:
        risks.append("User email present in logs")

    if not risks:
        return "No major risks detected in logs."

    return f"{' | '.join(risks)}. Overall risk level appears {risk_level.upper()}."