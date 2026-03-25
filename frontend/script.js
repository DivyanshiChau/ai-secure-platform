let analyzingBubble = null;

// Add chat bubble
function addMessage(text, type) {
  const chatBox = document.getElementById("chatBox");

  const div = document.createElement("div");
  div.classList.add("message", type);
  div.innerText = text;

  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  return div;
}

// Show temporary "Analyzing..." bubble
function showAnalyzingBubble() {
  analyzingBubble = addMessage("⏳ Analyzing...", "bot");
}

// Remove analyzing bubble
function removeAnalyzingBubble() {
  if (analyzingBubble) {
    analyzingBubble.remove();
    analyzingBubble = null;
  }
}

// Main send/upload function
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const textInputEl = document.getElementById("textInput");
  const textInput = textInputEl.value.trim();
  const loading = document.getElementById("loading");
  const resultDiv = document.getElementById("result");

  let response;
  let data;

  loading.classList.remove("hidden");
  resultDiv.innerHTML = `<p class="placeholder">Analyzing...</p>`;
  showAnalyzingBubble();

  try {
    // -------------------------
    // FILE UPLOAD FLOW
    // -------------------------
    if (fileInput.files[0]) {
      const formData = new FormData();
      formData.append("file", fileInput.files[0]);

      addMessage("📂 Uploaded file: " + fileInput.files[0].name, "user");

      response = await fetch("http://127.0.0.1:8000/analyze-file", {
        method: "POST",
        body: formData,
      });
    }

    // -------------------------
    // JSON INPUT FLOW
    // -------------------------
    else if (textInput) {
      addMessage(textInput, "user");

      const payload = {
        input_type: "chat", // can also use "text", "sql", "log"
        content: textInput,
        options: {
          mask: true,
          block_high_risk: true,
          log_analysis: true
        }
      };

      response = await fetch("http://127.0.0.1:8000/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload),
      });

      textInputEl.value = "";
    } else {
      removeAnalyzingBubble();
      loading.classList.add("hidden");
      alert("Please provide a file or paste some text.");
      return;
    }

    fileInput.value = "";
    data = await response.json();

    removeAnalyzingBubble();

    // Show result panel
    displayResult(data);

    // Bot chat reply
    const reply = `
Summary: ${data.summary}
Risk: ${data.risk_level ? data.risk_level.toUpperCase() : "N/A"}
Action: ${data.action || "N/A"}
Findings: ${data.findings ? data.findings.length : 0}
    `.trim();

    addMessage(reply, "bot");
  } catch (error) {
    removeAnalyzingBubble();
    resultDiv.innerHTML = `<p class="critical">Error connecting to backend.</p>`;
    addMessage("❌ Error connecting to backend.", "bot");
    console.error(error);
  } finally {
    loading.classList.add("hidden");
  }
}

// Render detailed result panel
function displayResult(data) {
  const resultDiv = document.getElementById("result");

  const findings = data.findings || [];
  const insights = data.insights || [];
  const riskLevel = data.risk_level || "low";
  const summary = data.summary || "No summary available";
  const riskScore = data.risk_score ?? "N/A";
  const action = data.action || "allowed";
  const maskedContent = data.masked_content || "No masked content";

  let html = `
    <h2>📊 Analysis Result</h2>
    <p><b>Summary:</b> ${summary}</p>
    <p><b>Risk Score:</b> ${riskScore}</p>
    <p><b>Risk Level:</b> 
      <span class="${riskLevel}">${riskLevel.toUpperCase()}</span>
    </p>
    <p><b>Action:</b> ${action}</p>

    <h3 class="section-title">🔍 Findings</h3>
  `;

  if (findings.length === 0) {
    html += `<p>No findings detected.</p>`;
  } else {
    findings.forEach((f) => {
      html += `
        <div class="finding">
          <b>Line ${f.line ?? "-"}</b> → ${f.type ?? "unknown"} 
          <span class="${f.risk || "low"}">(${(f.risk || "low").toUpperCase()})</span>
        </div>
      `;
    });
  }

  html += `<h3 class="section-title">💡 Insights</h3>`;

  if (insights.length === 0) {
    html += `<p>No additional insights.</p>`;
  } else {
    insights.forEach((i) => {
      html += `<div class="insight">• ${i}</div>`;
    });
  }

  html += `<h3 class="section-title">🔐 Masked Content</h3>`;
  html += renderHighlightedLog(maskedContent, findings);

  resultDiv.innerHTML = html;
}

// Highlight risky lines
function renderHighlightedLog(content, findings) {
  const lines = content.split("\n");

  let html = `<div class="log-viewer">`;

  lines.forEach((line, index) => {
    const lineNumber = index + 1;

    const finding = findings.find((f) => f.line === lineNumber);

    let riskClass = "";
    let marker = "";

    if (finding) {
      riskClass = finding.risk || "";
      marker = ` <span class="risk-tag ${riskClass}">${finding.type.toUpperCase()}</span>`;
    }

    html += `
      <div class="log-line ${riskClass}">
        <span class="line-number">${lineNumber}</span>
        <span class="line-content">${escapeHtml(line)}</span>
        ${marker}
      </div>
    `;
  });

  html += `</div>`;
  return html;
}

// Prevent HTML injection
function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// Enter to send
document.addEventListener("DOMContentLoaded", () => {
  const textInput = document.getElementById("textInput");

  textInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      uploadFile();
    }
  });
});