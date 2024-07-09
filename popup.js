document.addEventListener('DOMContentLoaded', function() {
    let toggleButton = document.getElementById('toggle-highlight');
    let displayArea = document.getElementById('highlighted-texts');

    if (toggleButton) {
        toggleButton.addEventListener('click', function() {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                chrome.scripting.executeScript({
                    target: {tabId: tabs[0].id},
                    function: toggleHighlighting
                });
            });
        });
    } else {
        console.error('Element with ID "toggle-highlight" not found in popup.html');
    }

    // Retrieve and display highlighted texts
    chrome.storage.local.get({ highlightedTexts: [] }, function(result) {
        let highlightedTexts = result.highlightedTexts;
        highlightedTexts.forEach(function(item) {
            let p = document.createElement('p');
            p.textContent = item.text;
            displayArea.appendChild(p);
        });
    });
});

function toggleHighlighting() {
    // Implement toggle functionality if needed
}
