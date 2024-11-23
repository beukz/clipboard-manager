// background.js
function saveToClipboardHistory(text) {
    chrome.storage.local.get("clipboardHistory", (data) => {
      const history = data.clipboardHistory || [];
      const encodedText = btoa(unescape(encodeURIComponent(text))); // Encode text as base64
      if (!history.includes(encodedText)) {
        history.unshift(encodedText); // Add new encoded text at the beginning
        if (history.length > 20) history.pop(); // Keep history limited to 20 items
        chrome.storage.local.set({ clipboardHistory: history }, () => {
          console.log("Clipboard history saved:", history);
        });
      }
    });
  }
  
  // Decode when displaying the history
  function displayHistory(history) {
    const historyList = document.getElementById("historyList");
    historyList.innerHTML = ""; // Clear previous items
  
    history.forEach((encodedText) => {
      const decodedText = decodeURIComponent(escape(atob(encodedText))); // Decode base64 text
      const item = document.createElement("div");
      item.textContent = decodedText;
      item.className = "history-item";
  
      // Copy text when clicked
      item.addEventListener("click", () => {
        navigator.clipboard.writeText(decodedText).then(() => {
          showCopiedMessage("Text copied to clipboard!");
        });
      });
  
      historyList.appendChild(item);
    });
  }
  