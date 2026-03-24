async function uploadFile() {
    const fileInput = document.getElementById("fileInput");
    const textInput = document.getElementById("textInput").value;
    const resultDiv = document.getElementById("result");

    const formData = new FormData();

    if (fileInput.files[0]) {
        formData.append("file", fileInput.files[0]);
    } else if (textInput) {
        formData.append("text", textInput);
    } else {
        alert("Provide file or text");
        return;
    }

    const response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        body: formData
    });

    const data = await response.json();

    displayResult(data);
}

function displayResult(data) {
    const resultDiv = document.getElementById("result");

    let html = `
        <h2>📊 Analysis Result</h2>
        <p><b>Summary:</b> ${data.summary}</p>
        <p><b>Risk Score:</b> ${data.risk_score}</p>
        <p><b>Risk Level:</b> <span class="${data.risk_level}">${data.risk_level.toUpperCase()}</span></p>
        <p><b>Action:</b> ${data.action}</p>

        <h3>🔍 Findings</h3>
    `;

    data.findings.forEach(f => {
        html += `<div>Line ${f.line} → ${f.type} (${f.risk})</div>`;
    });

    html += `<h3>💡 Insights</h3>`;
    data.insights.forEach(i => {
        html += `<div>• ${i}</div>`;
    });

    html += `<h3>🔐 Masked Content</h3><pre>${data.masked_content}</pre>`;

    resultDiv.innerHTML = html;
}