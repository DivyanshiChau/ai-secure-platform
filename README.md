# 🔐 AI Secure Data Intelligence Platform

**AI Gateway + Scanner + Log Analyzer + Risk Engine**

An AI-powered security analysis platform designed to detect sensitive data exposure, security risks, and anomalies from logs, text, uploaded files, and structured input.

---

## 📌 Overview

The **AI Secure Data Intelligence Platform** is built to act as:

- **AI Gateway**
- **Data Scanner**
- **Log Analyzer**
- **Risk Engine**

It helps identify sensitive information and risky patterns in application logs and input data, then generates **AI-assisted security insights** with **risk classification** and **policy enforcement**.

---

## 🎯 Problem Statement

Modern applications often generate logs and data traces that may unintentionally expose:

- passwords
- API keys
- tokens
- emails
- phone numbers
- stack traces
- internal system details

These leaks can create serious **security, privacy, and operational risks**.

This platform solves that problem by automatically:

- scanning logs and input content
- detecting sensitive data and suspicious patterns
- assigning severity and risk scores
- masking exposed secrets
- generating AI-based summaries and security insights

---

## 🚀 Key Features

### ✅ Multi-Input Support
The platform supports:

- **Text input**
- **Log files** (`.log`, `.txt`)
- **PDF files**
- **DOCX files**
- **SQL / structured text**
- **Chat-style input**

---

### 🔍 Sensitive Data Detection
Detects and flags:

- **Emails**
- **Phone numbers**
- **Passwords**
- **API keys**
- **Tokens**

---

### ⚠️ Security Issue Detection
Identifies:

- **Credentials in logs**
- **Hardcoded secrets**
- **API key exposure**
- **Stack trace leaks**
- **Debug mode leaks**
- **Suspicious repeated IP activity**
- **Repeated failed login attempts (basic brute-force detection)**

---

### 🧠 AI / Hybrid Security Insights
Generates:

- AI-assisted **summary of log activity**
- **Potential security risks**
- **Detected anomalies**
- Meaningful **security warnings**

---

### 📊 Risk Engine
Classifies findings into severity levels:

| Pattern | Risk |
|---------|------|
| API Key | High |
| Password | Critical |
| Email | Low |
| Phone | Low |
| Token | High |
| Stack Trace | Medium |
| Debug Leak | Medium |

Also produces:

- **Risk Score**
- **Risk Level**
- **Findings List**

---

### 💻 Frontend Dashboard
Includes:

- Clean **security dashboard UI**
- File upload and text input
- **Threat summary cards**
- Findings display
- **Highlighted masked log viewer**
- AI summary + insights panel

---

## 🧱 Architecture / Processing Flow

```text
Input (Text / File / SQL / Log / Chat)
        ↓
Validation
        ↓
Extraction / Parsing
        ↓
Detection Engine
   ├── Regex Detection
   ├── AI / Hybrid Summary
   └── Log Analyzer
        ↓
Risk Engine
        ↓
Policy Engine
        ↓
Response + Visualization
```

---

## 🧪 Example Use Case

### Sample Input

```log
2026-03-10 10:00:01 INFO User login
email=admin@company.com
password=admin123
api_key=sk-prod-xyz
Authorization: Bearer abc123token
DEBUG mode enabled
ERROR stack trace: NullPointerException at service.java:45
```

### Sample Output

- **Summary:** Sensitive password detected, API key exposure found, system error detected
- **Risk Score:** 12
- **Risk Level:** HIGH
- **Action:** Blocked / Masked
- **Insights:**
  - Sensitive credentials exposed
  - API key exposure detected
  - Stack trace reveals internal system details

---

## 🛠️ Tech Stack

### Backend
- **Python**
- **FastAPI**
- **Uvicorn**

### Frontend
- **HTML**
- **CSS**
- **JavaScript**

### AI / Analysis
- **Gemini / Hybrid AI summary logic**
- **Regex-based detection**
- **Risk scoring engine**

### File Parsing
- **PyPDF2**
- **python-docx**

### Deployment
- **Render** (Backend)
- **Vercel** (Frontend)

### Version Control
- **Git**
- **GitHub**

---

## 📁 Project Structure

```bash
ai-secure-platform/
│
├── backend/
│   ├── main.py
│   ├── detector.py
│   ├── risk_engine.py
│   ├── ai_analyzer.py
│   ├── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│
├── README.md
└── .gitignore
```

---

## ⚙️ API Endpoint

### `POST /analyze`

Analyzes text / structured / chat / log content.

### Request Format

```json
{
  "input_type": "text | file | sql | chat | log",
  "content": "...",
  "options": {
    "mask": true,
    "block_high_risk": true,
    "log_analysis": true
  }
}
```

### Response Format

```json
{
  "summary": "Log contains sensitive credentials and errors",
  "content_type": "log",
  "findings": [
    {
      "type": "api_key",
      "risk": "high",
      "line": 4
    },
    {
      "type": "password",
      "risk": "critical",
      "line": 3
    }
  ],
  "risk_score": 12,
  "risk_level": "high",
  "action": "blocked",
  "insights": [
    "Sensitive credentials exposed in logs",
    "Stack trace reveals internal system details"
  ]
}
```

---

## 🌐 Live Deployment

## "kindly run backend before testing frontend live app, because i've used free version of render and the deployment sleeps after some time, it may not show any result or may take time to give output for live-app"
### 🚀 Frontend Application
**Live App:**  
https://ai-secure-platform-dun.vercel.app/

### 🔧 Backend API
**Backend URL:**  
https://ai-secure-platform-n7uy.onrender.com/

### 📘 API Documentation
**Swagger Docs:**  
https://ai-secure-platform-n7uy.onrender.com/docs

---

## ▶️ How to Run Locally

### 1) Clone the repository

```bash
git clone https://github.com/DivyanshiChau/ai-secure-platform.git
cd ai-secure-platform
```

---

### 2) Run Backend

```bash
cd backend
pip install -r requirements.txt
python -m uvicorn main:app --reload
```

Backend will run at:

```bash
http://127.0.0.1:8000
```

---

### 3) Run Frontend

Open:

```bash
frontend/index.html
```

in your browser

OR use **Live Server** in VS Code.

---

### 4) Connect Frontend to Backend

Inside `frontend/script.js`, make sure the API base URL is correct.

For local development:

```javascript
const API_BASE = "http://127.0.0.1:8000";
```

For deployed backend:

```javascript
const API_BASE = "https://ai-secure-platform-n7uy.onrender.com";
```

---

## 🔐 Security Notes

- `.env` should **never** be uploaded to GitHub
- Secrets and API keys must be stored as **environment variables**
- Sensitive values are masked before display when enabled

---

## 🧗 Challenges Faced

Some of the key implementation challenges included:

- handling multiple input types cleanly
- building meaningful AI / hybrid summaries
- detecting sensitive data accurately
- designing a modular security pipeline
- deploying backend and frontend reliably

---

## 📈 Future Improvements

Possible future enhancements include:

- Real-time log streaming analysis
- Drag & drop upload
- Cross-log anomaly detection
- Rate limiting for large log uploads
- Better observability dashboard
- Role-based policy configuration

---
