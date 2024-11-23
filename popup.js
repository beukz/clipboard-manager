// popup.js

// Load clipboard history from chrome.storage
function loadClipboardHistory() {
    chrome.storage.local.get("clipboardHistory", (result) => {
      const history = result.clipboardHistory || [];
      displayHistory(history);
    });
  }
  
  // Display the clipboard history in the popup
  function displayHistory(history) {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = ""; // Clear previous items
  
    history.forEach((text) => {
      const item = document.createElement("div");
      item.textContent = text;
      item.className = "history-item";
  
      // Add click event to copy text again
      item.addEventListener("click", () => {
        navigator.clipboard.writeText(text).then(() => {
          showCopiedMessage("Text copied to clipboard!");
        });
      });
  
      historyList.appendChild(item);
    });
  }
  
  // Show message when text is copied
/**
 * Displays a temporary "copied" message with a slide-in and slide-out effect.
 * @param {string} message - The message to display.
 * @param {number} [duration=3000] - Duration in milliseconds to show the message before it slides out.
 */
function showCopiedMessage(message, duration = 3000) {
  const messageElement = document.getElementById("copyMessage");

  // Check if messageElement exists to avoid errors
  if (!messageElement) {
      console.error("Element with ID 'copyMessage' not found.");
      return;
  }

  messageElement.textContent = message;
  messageElement.classList.add("slide-in");

  // Automatically start slide-out animation after the duration
  setTimeout(() => {
      messageElement.classList.remove("slide-in");
      messageElement.classList.add("slide-out");
      
      // After slide-out animation completes, remove the slide-out class to hide the element
      setTimeout(() => {
          messageElement.classList.remove("slide-out");
      }, 500); // Duration of slide-out animation
  }, duration);
}

  
  // Clear clipboard history
  document.getElementById("clearHistory").addEventListener("click", () => {
    chrome.storage.local.set({ clipboardHistory: [] }, loadClipboardHistory);
  });
  
  // Handle saving new copied text from content.js
  document.addEventListener("copy", () => {
    chrome.storage.local.get("clipboardHistory", (data) => {
      const history = data.clipboardHistory || [];
      const copiedText = window.getSelection().toString();
      if (copiedText && !history.includes(copiedText)) {
        history.unshift(copiedText); // Add new text at the beginning
        if (history.length > 20) history.pop(); // Limit history to 20 items
        chrome.storage.local.set({ clipboardHistory: history }, loadClipboardHistory);
      }
    });
  });
  
  // Load clipboard history when popup is opened
  document.addEventListener("DOMContentLoaded", loadClipboardHistory);
  