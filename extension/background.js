// Don't use importScripts with module type
let parserModule = null;

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "parseHtml") {
    // Since we can't use WASM easily in a service worker,
    // use a simple JavaScript parser instead
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(request.html, "text/html");

      // Extract translations
      const translations = [];
      const translationNodes = doc.querySelectorAll(".fgb.r.clickable");

      translationNodes.forEach((node) => {
        const text = node.textContent.trim();
        if (text && !translations.includes(text)) {
          translations.push(text);
        }
      });

      // Extract part of speech if available
      let partOfSpeech = "";
      const posNodes = doc.querySelectorAll(".fgb.g");
      if (posNodes.length > 0) {
        partOfSpeech = posNodes[0].textContent.trim();
      }

      const result = {
        word: request.word,
        partOfSpeech: partOfSpeech,
        translations: translations,
      };

      sendResponse(result);
    } catch (error) {
      console.error("Error parsing HTML:", error);
      sendResponse({ error: error.message });
    }

    return true; // Keep the message channel open for async response
  }
});

// Set up context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "translate-irish",
    title: "Translate Irish Word",
    contexts: ["selection"],
  });

  // Default settings
  chrome.storage.sync.set({ translationEnabled: true });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "translate-irish" && info.selectionText) {
    // Store the selected word for the popup
    chrome.storage.local.set({ lastSelectedWord: info.selectionText });
    chrome.action.openPopup();
  }
});
