// =====================================
// CHANGE THIS AFTER BACKEND DEPLOYMENT
// =====================================
const API_BASE = "https://ai-secure-platform-n7uy.onrender.com"; 
// Example later:
// const API_BASE = "https://ai-secure-backend.onrender.com";

async function uploadFile() {
    const text = document.getElementById("textInput").value.trim();
    const file = document.getElementById("fileInput").files[0];

    let response;

    try {
        if (file) {
            const formData = new FormData();
            formData.append("file", file);

            response = await fetch(`${API_BASE}/analyze-file`, {
                method: "POST",
                body: formData
            });
        } else if (text) {
            response = await fetch(`${API_BASE}/analyze`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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
        } else {
            alert("Please paste text or upload a file first.");
            return;
        }

        const data = await response.json();
        render(data);

    } catch (error) {
        console.error("Error:", error);
        alert("Could not connect to backend. Please check deployment or backend server.");
    }
}

function render(data) {
    document.getElementById("riskScore").innerText = data.risk_score ?? "-";
    document.getElementById("findingCount").innerText = data.findings?.length ?? 0;
    document.getElementById("action").innerText = data.action ?? "-";
    document.getElementById("summary").innerText = data.summary ?? "No summary available";

    // Findings
    let fHTML = "";
    if (data.findings && data.findings.length > 0) {
        data.findings.forEach(f => {
            fHTML += `
                <div class="finding">
                    Line ${f.line} → ${f.type} 
                    <span class="${f.risk}">(${f.risk})</span>
                </div>
            `;
        });
    } else {
        fHTML = `<div class="finding">No findings detected.</div>`;
    }
    document.getElementById("findings").innerHTML = fHTML;

    // Insights
    let iHTML = "";
    if (data.insights && data.insights.length > 0) {
        data.insights.forEach(i => {
            iHTML += `<div class="insight">⚠ ${i}</div>`;
        });
    } else {
        iHTML = `<div class="insight">No additional insights.</div>`;
    }
    document.getElementById("insights").innerHTML = iHTML;

    // Log viewer
    let logHTML = "";
    const maskedContent = data.masked_content || "";
    const lines = maskedContent.split("\n");

    lines.forEach((line, i) => {
        let finding = data.findings?.find(f => f.line === i + 1);
        let cls = finding ? finding.risk : "";

        logHTML += `
            <div class="log-line ${cls}">
                ${i + 1}: ${escapeHtml(line)}
            </div>
        `;
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

// Clear input
function clearInput() {
    document.getElementById("textInput").value = "";
    document.getElementById("fileInput").value = "";
}

// Prevent HTML issues in log viewer
function escapeHtml(text) {
    return text
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;");
}