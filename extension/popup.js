// Wait for the page to load
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.getElementById("search-btn");
  const resultsDiv = document.getElementById("results");
  const enableTranslationToggle = document.getElementById("enable-translation");

  // Load toggle state from storage
  chrome.storage.sync.get("translationEnabled", (data) => {
    enableTranslationToggle.checked = data.translationEnabled !== false; // Default to true
  });

  // Save toggle state changes
  enableTranslationToggle.addEventListener("change", () => {
    const isEnabled = enableTranslationToggle.checked;
    chrome.storage.sync.set({ translationEnabled: isEnabled });

    // Notify content script about the toggle change
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "toggleTranslation",
        enabled: isEnabled,
      });
    });
  });

  // Listen for Enter key in search input
  searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
      searchBtn.click();
    }
  });

  // Handle search button click
  searchBtn.addEventListener("click", async () => {
    const word = searchInput.value.trim();
    if (!word) return;

    resultsDiv.innerHTML = '<div class="loading">Loading translation...</div>';

    try {
      const result = await fetchTranslation(word);
      displayResults(result);
    } catch (error) {
      resultsDiv.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    }
  });

  // Fetch translation from API
  async function fetchTranslation(word) {
    const response = await fetch(
      `https://www.teanglann.ie/ga/fgb/${encodeURIComponent(word)}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const htmlContent = await response.text();

    // Wait for WASM module to load
    await IrishParserReady();

    // Use our WASM module to parse the HTML
    const result = IrishParser.parseIrishDictionary(htmlContent, word);
    return result;
  }

  // Display results in the popup
  function displayResults(result) {
    if (!result || result.translations.length === 0) {
      resultsDiv.innerHTML = '<div class="error">No translation found.</div>';
      return;
    }

    let html = `
      <div class="word">${result.word}</div>
      <div class="part-of-speech">${result.partOfSpeech}</div>
      <div class="translations">
    `;

    result.translations.forEach((translation) => {
      html += `<div class="translation">• ${translation}</div>`;
    });

    html += "</div>";
    resultsDiv.innerHTML = html;
  }

  // Helper to wait for the WASM module to be ready
  function IrishParserReady() {
    return new Promise((resolve, reject) => {
      if (typeof IrishParser !== "undefined") {
        resolve();
      } else {
        // Wait for the module to load
        window.moduleLoadedCallback = () => {
          resolve();
        };

        // Set a timeout in case the module fails to load
        setTimeout(() => {
          reject(new Error("WASM module failed to load"));
        }, 5000);
      }
    });
  }
});
