// Create tooltip element
const tooltip = document.createElement("div");
tooltip.id = "irish-dictionary-tooltip";
tooltip.style.display = "none";
tooltip.style.position = "absolute";
tooltip.style.zIndex = 10000;
tooltip.style.backgroundColor = "#fff";
tooltip.style.border = "1px solid #ccc";
tooltip.style.borderRadius = "4px";
tooltip.style.padding = "8px";
tooltip.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
tooltip.style.maxWidth = "300px";
tooltip.style.fontSize = "14px";
document.body.appendChild(tooltip);

// Keep track of whether translation is enabled
let translationEnabled = true;

// Close tooltip when clicking elsewhere
document.addEventListener("click", (event) => {
  if (
    event.target.id !== "irish-dictionary-tooltip" &&
    !event.target.classList.contains("irish-word")
  ) {
    tooltip.style.display = "none";
  }
});

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleTranslation") {
    translationEnabled = request.enabled;

    // Remove all event listeners if disabled
    if (!translationEnabled) {
      tooltip.style.display = "none";
    }
  }
});

// Check if a word might be Irish (simple heuristic)
function mightBeIrish(word) {
  // Common Irish characters/patterns
  const irishPatterns = [
    /[áéíóúÁÉÍÓÚ]/, // fadas
    /[aeiou]h/i, // lenition
    /^[mb]h/i, // initial mutations
    /^g?c[eéiío]/i, // eclipse patterns
    /^n[gdDtT]/i, // eclipse patterns
    /^b[hpP]/i, // eclipse patterns
  ];

  return irishPatterns.some((pattern) => pattern.test(word));
}

// Handle click on text
document.addEventListener("click", async (event) => {
  if (!translationEnabled) return;

  // Check if we're clicking on text
  const selection = window.getSelection();
  if (!selection || selection.isCollapsed) return;

  const selectedText = selection.toString().trim();
  if (!selectedText || selectedText.length < 2) return;

  // Check if it might be an Irish word
  if (!mightBeIrish(selectedText)) return;

  event.preventDefault();

  // Show loading state
  tooltip.innerHTML = "Loading translation...";
  tooltip.style.display = "block";

  // Position the tooltip near the selected text
  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  tooltip.style.left = `${window.scrollX + rect.left}px`;
  tooltip.style.top = `${window.scrollY + rect.bottom + 10}px`;

  try {
    // Fetch the translation
    const response = await fetch(
      `https://www.teanglann.ie/ga/fgb/${encodeURIComponent(selectedText)}`,
    );
    const htmlContent = await response.text();

    // Send the HTML to the background script for parsing
    chrome.runtime.sendMessage(
      {
        action: "parseHtml",
        html: htmlContent,
        word: selectedText,
      },
      (result) => {
        if (chrome.runtime.lastError) {
          tooltip.innerHTML = "Error: Failed to parse translation.";
          return;
        }

        displayTranslation(result);
      },
    );
  } catch (error) {
    tooltip.innerHTML = `Error: ${error.message}`;
  }
});

// Display translation in the tooltip
function displayTranslation(result) {
  if (!result || result.translations.length === 0) {
    tooltip.innerHTML = "No translation found.";
    return;
  }

  let html = `
    <div style="font-weight: bold; font-size: 16px; margin-bottom: 5px;">${result.word}</div>
    <div style="color: #666; font-style: italic; margin-bottom: 5px;">${result.partOfSpeech}</div>
  `;

  result.translations.forEach((translation) => {
    html += `<div style="margin-bottom: 3px;">• ${translation}</div>`;
  });

  html += `<div style="margin-top: 8px; font-size: 11px; color: #999;">
    <a href="https://www.teanglann.ie/ga/fgb/${encodeURIComponent(result.word)}" 
       target="_blank" style="color: #4CAF50; text-decoration: none;">
      View full entry on teanglann.ie
    </a>
  </div>`;

  tooltip.innerHTML = html;
}

// Initialize - Check if translation is enabled
chrome.storage.sync.get("translationEnabled", (data) => {
  translationEnabled = data.translationEnabled !== false; // Default to true
});
