import re
from collections import Counter

def detect_sensitive_data(text):
    findings = []
    lines = text.split("\n")

    failed_login_count = 0
    ip_counter = Counter()

    for i, line in enumerate(lines, start=1):
        line_lower = line.lower()

        # 📧 Email detection
        emails = re.findall(r"[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+", line)
        for email in emails:
            findings.append({
                "type": "email",
                "value": email,
                "risk": "low",
                "line": i
            })

        # 📱 Phone detection
        phones = re.findall(r"\b\d{10}\b", line)
        for phone in phones:
            findings.append({
                "type": "phone",
                "value": phone,
                "risk": "low",
                "line": i
            })

        # 🌐 IP detection
        ips = re.findall(r"\b(?:\d{1,3}\.){3}\d{1,3}\b", line)
        for ip in ips:
            ip_counter[ip] += 1

        # 🔑 API key detection
        if "api_key" in line_lower or "sk-" in line_lower:
            findings.append({
                "type": "api_key",
                "risk": "high",
                "line": i
            })

        # 🔒 Password detection
        if "password" in line_lower:
            findings.append({
                "type": "password",
                "risk": "critical",
                "line": i
            })

        # 🪙 Token detection
        if "token" in line_lower or "bearer" in line_lower:
            findings.append({
                "type": "token",
                "risk": "high",
                "line": i
            })

        # ⚠️ Stack trace / error detection
        if "exception" in line_lower or "traceback" in line_lower or "nullpointerexception" in line_lower:
            findings.append({
                "type": "stack_trace",
                "risk": "medium",
                "line": i
            })

        # 🐞 Debug leak detection
        if "debug" in line_lower:
            findings.append({
                "type": "debug_trace",
                "risk": "medium",
                "line": i
            })

        # 🔓 Failed login detection
        if "failed login" in line_lower or "login failed" in line_lower:
            failed_login_count += 1

    # 🚨 Brute-force detection
    if failed_login_count >= 3:
        findings.append({
            "type": "brute_force_attempt",
            "risk": "high",
            "line": "-"
        })

    # 🚨 Suspicious IP detection
    for ip, count in ip_counter.items():
        if count >= 3:
            findings.append({
                "type": f"suspicious_ip ({ip})",
                "risk": "high",
                "line": "-"
            })

    return findings