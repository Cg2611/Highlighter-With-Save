// Listen for mouseup events to trigger highlighting
document.addEventListener('mouseup', function(event) {
    let selection = window.getSelection();
    if (selection && selection.toString().trim() !== '') {
        highlightSelectedText(selection);
    }
});

// Function to handle highlighting selected text
function highlightSelectedText(selection) {
    let selectedText = selection.toString().trim();
    if (selectedText) {
        let range = selection.getRangeAt(0);
        let rangeInfo = {
            startContainer: getSelector(range.startContainer),
            startOffset: range.startOffset,
            endContainer: getSelector(range.endContainer),
            endOffset: range.endOffset
        };

        // Immediately highlight the text
        highlightText(selectedText, rangeInfo);

        // Send message to background to save the highlight
        chrome.runtime.sendMessage({
            action: 'highlightText',
            text: selectedText,
            range: rangeInfo
        }, function(response) {
            console.log('Response from background script:', response.result);
        });
    }
}

// Helper function to get a CSS selector for a node
function getSelector(node) {
    if (node.nodeType === Node.TEXT_NODE) {
        node = node.parentNode;
    }
    return node.tagName.toLowerCase() + (node.id ? '#' + node.id : '') + (node.className ? '.' + node.className.split(' ').join('.') : '');
}

// Function to highlight text on the current page
function highlightText(text, rangeInfo) {
    try {
        let range = document.createRange();
        range.setStart(document.querySelector(rangeInfo.startContainer), rangeInfo.startOffset);
        range.setEnd(document.querySelector(rangeInfo.endContainer), rangeInfo.endOffset);
        let span = document.createElement('span');
        span.style.backgroundColor = 'rgb(234, 161, 236)';
        span.textContent = text;
        range.deleteContents();
        range.insertNode(span);
    } catch (e) {
        console.error('Error highlighting text:', e);
    }
}

// Restore highlights when the content script loads
chrome.runtime.sendMessage({ action: 'restoreHighlights' });
