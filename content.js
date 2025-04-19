console.log('Content script loaded');

// Lắng nghe message từ background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'init') {
        console.log('Content script initialized');
        sendResponse({ success: true });
    }
    return true;
});