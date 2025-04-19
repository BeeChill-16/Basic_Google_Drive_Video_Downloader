console.log('Background script loaded');

let videoUrls = new Set();

// Khởi tạo khi extension được cài đặt
chrome.runtime.onInstalled.addListener(() => {
  console.log('Extension installed');
});

// Lắng nghe tab updates
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes('drive.google.com')) {
    console.log('Google Drive tab detected:', tab.url);
    chrome.tabs.sendMessage(tabId, { action: 'init' })
      .catch(error => console.log('Tab not ready yet:', error));
  }
});

// Xử lý URL video từ Google Drive
function processVideoUrl(url) {
  try {
    const urlObj = new URL(url);
    
    // Giữ lại các tham số cần thiết
    const params = new URLSearchParams();
    
    // Danh sách các tham số cần loại bỏ
    const removeParams = ['range', 'rn', 'rbuf', 'ump', 'srfvp'];
    
    // Copy tất cả tham số từ URL gốc
    urlObj.searchParams.forEach((value, key) => {
      // Chỉ giữ lại các tham số không nằm trong danh sách loại bỏ
      if (!removeParams.includes(key)) {
        params.set(key, value);
      }
    });
    
    // Đảm bảo có tham số alt=media
    if (!params.has('alt')) {
      params.set('alt', 'media');
    }
    
    // Tạo URL mới với các tham số đã lọc
    const cleanUrl = `${urlObj.origin}${urlObj.pathname}?${params.toString()}`;
    console.log('Original params:', Array.from(urlObj.searchParams.entries()));
    console.log('Filtered params:', Array.from(params.entries()));
    console.log('Processed URL:', cleanUrl);
    return cleanUrl;
  } catch (error) {
    console.error('Error processing URL:', error);
    return url;
  }
}

// Xử lý messages
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);

  switch(message.action) {
    case 'videoFound':
      console.log('Video URL found:', message.url);
      try {
        const url = new URL(message.url);
        // Thêm tham số cho Google Drive nếu cần
        if (url.hostname.includes('drive.google.com')) {
          url.searchParams.set('alt', 'media');
        }
        // Lưu URL đã xử lý
        videoUrls.add(url.toString());
        console.log('Processed video URL:', url.toString());
      } catch (error) {
        console.error('Error processing URL:', error);
      }
      break;

    case 'getVideoUrls':
      const urls = Array.from(videoUrls);
      console.log('Available video URLs:', urls);
      sendResponse({ urls });
      break;
    
    case 'startDownload':
      console.log('Original URL:', message.url);
      
      // Xử lý URL trước khi tải
      const downloadUrl = processVideoUrl(message.url);
      console.log('Download URL:', downloadUrl);
      
      // Tạo tên file từ URL gốc
      const filename = 'video.mp4';
      
      // Bắt đầu tải xuống
      chrome.downloads.download({
        url: downloadUrl,
        filename: filename,
        saveAs: true
      }, (downloadId) => {
        if (chrome.runtime.lastError) {
          console.error('Download error:', chrome.runtime.lastError);
          sendResponse({ 
            success: false, 
            error: chrome.runtime.lastError.message 
          });
        } else {
          console.log('Download started with ID:', downloadId);
          sendResponse({ success: true });
        }
      });

      return true; // Keep the message channel open for sendResponse
    
    case 'clearUrls':
      videoUrls.clear();
      console.log('Cleared video URLs');
      sendResponse({ success: true });
      break;
      
    case 'contentScriptReady':
      console.log('Content script is ready');
      sendResponse({ success: true });
      break;
  }
  
  return true; // Giữ kênh message để đợi async responses
});