def calculate_risk(findings):
    score = 0

    for f in findings:
        if f["type"] == "password":
            score += 5
        elif f["type"] == "api_key":
            score += 4
        elif f["type"] == "email":
            score += 1
        elif f["type"] == "stack_trace":
            score += 2

    if score >= 10:
        level = "high"
    elif score >= 5:
        level = "medium"
    else:
        level = "low"

    return score, level