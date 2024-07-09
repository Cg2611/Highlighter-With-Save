// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === 'highlightText') {
        chrome.scripting.executeScript({
            target: { tabId: sender.tab.id },
            func: highlightText,
            args: [message.text, message.range]
        });
        saveHighlightedText(message.text, message.range); // Save the highlighted text
        sendResponse({ result: 'Text highlighted and saved!' });
    } else if (message.action === 'restoreHighlights') {
        restoreHighlights(sender.tab.id);
    }
});

// Function to highlight text
function highlightText(text, rangeInfo) {
    let range = document.createRange();
    range.setStart(document.querySelector(rangeInfo.startContainer), rangeInfo.startOffset);
    range.setEnd(document.querySelector(rangeInfo.endContainer), rangeInfo.endOffset);
    let span = document.createElement('span');
    span.style.backgroundColor = 'rgb(234, 161, 236)';
    span.textContent = text;
    range.deleteContents();
    range.insertNode(span);
}

// Function to save highlighted text to Chrome storage
function saveHighlightedText(text, range) {
    chrome.storage.local.get({ highlightedTexts: [] }, function(result) {
        let highlightedTexts = result.highlightedTexts;
        highlightedTexts.push({ text, range });
        chrome.storage.local.set({ highlightedTexts: highlightedTexts }, function() {
            console.log('Highlighted text saved:', text);
        });
    });
}

// Function to restore highlighted text from Chrome storage
function restoreHighlights(tabId) {
    chrome.storage.local.get({ highlightedTexts: [] }, function(result) {
        let highlightedTexts = result.highlightedTexts;
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: (highlightedTexts) => {
                highlightedTexts.forEach(item => {
                    let range = document.createRange();
                    range.setStart(document.querySelector(item.range.startContainer), item.range.startOffset);
                    range.setEnd(document.querySelector(item.range.endContainer), item.range.endOffset);
                    let span = document.createElement('span');
                    span.style.backgroundColor = 'rgb(234, 161, 236)';
                    span.textContent = item.text;
                    range.deleteContents();
                    range.insertNode(span);
                });
            },
            args: [highlightedTexts]
        });
    });
}
