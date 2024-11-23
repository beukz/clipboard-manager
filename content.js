// content.js

document.addEventListener("copy", (event) => {
    const copiedText = window.getSelection().toString(); // Get selected text
  
    if (copiedText) {
      // Access chrome.storage directly in content script
      chrome.storage.local.get("clipboardHistory", (data) => {
        const history = data.clipboardHistory || [];
  
        // Add copied text to history if it's not already there
        if (!history.includes(copiedText)) {
          history.unshift(copiedText); // Add new text at the beginning
          if (history.length > 20) history.pop(); // Limit history to 20 items
  
          // Save the updated history to chrome.storage
          chrome.storage.local.set({ clipboardHistory: history });
        }
      });
    }
  });
  