// Function to handle highlighting selected text
function highlightSelectedText() {
    let selectedText = window.getSelection().toString().trim();
    if (selectedText) {
        let range = window.getSelection().getRangeAt(0);
        let rangeInfo = {
            startContainer: getSelector(range.startContainer),
            startOffset: range.startOffset,
            endContainer: getSelector(range.endContainer),
            endOffset: range.endOffset
        };
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

// Listen for mouseup events to trigger highlighting
document.addEventListener('mouseup', function(event) {
    let selection = window.getSelection();
    if (selection && selection.anchorNode === selection.focusNode && selection.toString().trim() !== '') {
        highlightSelectedText();
    }
});

// Restore highlights when the content script loads
chrome.runtime.sendMessage({ action: 'restoreHighlights' });
