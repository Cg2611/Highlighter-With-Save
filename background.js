// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'highlightText') {
        saveHighlight(message.text, message.range);
        sendResponse({ result: 'Text highlighted!' });
    } else if (message.action === 'restoreHighlights') {
        restoreHighlights();
    }
});

// Function to save highlighted text to storage
function saveHighlight(text, range) {
    let highlights = JSON.parse(localStorage.getItem('highlights')) || [];
    highlights.push({ text: text, range: range });
    localStorage.setItem('highlights', JSON.stringify(highlights));
}

// Function to restore previously highlighted text on page load
function restoreHighlights() {
    let highlights = JSON.parse(localStorage.getItem('highlights')) || [];
    highlights.forEach(function(item) {
        highlightText(item.text, item.range);
    });
}
