import re

def detect_sensitive_data(text):
    findings = []
    lines = text.split("\n")

    for i, line in enumerate(lines):
        if re.search(r'\b[\w.-]+@[\w.-]+\.\w+\b', line):
            findings.append({"type": "email", "risk": "low", "line": i})

        if "password=" in line.lower():
            findings.append({"type": "password", "risk": "critical", "line": i})

        if "api_key" in line.lower():
            findings.append({"type": "api_key", "risk": "high", "line": i})

        if "exception" in line.lower():
            findings.append({"type": "stack_trace", "risk": "medium", "line": i})

    return findings