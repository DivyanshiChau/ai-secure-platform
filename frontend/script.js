async function uploadFile() {
    const text = document.getElementById("textInput").value;
    const file = document.getElementById("fileInput").files[0];

    let response;

    if (file) {
        const formData = new FormData();
        formData.append("file", file);

        response = await fetch("http://127.0.0.1:8000/analyze-file", {
            method: "POST",
            body: formData
        });
    } else {
        response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                input_type: "log",
                content: text,
                options: {
                    mask: true,
                    block_high_risk: true,
                    log_analysis: true
                }
            })
        });
    }

    const data = await response.json();
    render(data);
}

function render(data) {

    document.getElementById("riskScore").innerText = data.risk_score;
    document.getElementById("findingCount").innerText = data.findings.length;
    document.getElementById("action").innerText = data.action;
    document.getElementById("summary").innerText = data.summary;

    // Findings
    let fHTML = "";
    data.findings.forEach(f => {
        fHTML += `<div class="finding">
        Line ${f.line} → ${f.type} 
        <span class="${f.risk}">(${f.risk})</span>
        </div>`;
    });
    document.getElementById("findings").innerHTML = fHTML;

    // Insights
    let iHTML = "";
    data.insights.forEach(i => {
        iHTML += `<div class="insight">⚠ ${i}</div>`;
    });
    document.getElementById("insights").innerHTML = iHTML;

    // Log viewer
    let lines = data.masked_content.split("\n");
    let logHTML = "";

    lines.forEach((line, i) => {
        let finding = data.findings.find(f => f.line === i + 1);
        let cls = finding ? finding.risk : "";

        logHTML += `<div class="log-line ${cls}">
        ${i + 1}: ${line}
        </div>`;
    });

    document.getElementById("logViewer").innerHTML = logHTML;
}

// Sample
function loadSample() {
    document.getElementById("textInput").value = `2026-03-10 10:00:01 INFO User login
email=admin@company.com
password=admin123
api_key=sk-prod-xyz
ERROR stack trace: NullPointerException`;
}

function clearInput() {
    document.getElementById("textInput").value = "";
}