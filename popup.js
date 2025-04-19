let isDownloading = false;
let isRecording = false;

// Cập nhật trạng thái UI
function updateStatus(status) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = status;
  }
}

// Cập nhật tiến trình
function updateProgress(progress) {
  const progressElement = document.getElementById('progress');
  if (progressElement) {
    progressElement.style.width = `${progress}%`;
  }
}

// Bắt đầu tải video
async function startDownload() {
  if (isDownloading) {
    updateStatus('Download already in progress...');
    return;
  }

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab) {
      throw new Error('No active tab found');
    }

    isDownloading = true;
    updateStatus('Starting download...');

    const quality = document.getElementById('quality').value;
    await chrome.tabs.sendMessage(tab.id, { 
      action: 'startDownload',
      quality: quality
    });

  } catch (error) {
    console.error('Error starting download:', error);
    updateStatus('Please refresh the page and try again');
    isDownloading = false;
  }
}

// Xử lý messages từ content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message);

  if (message.action === 'updateStatus') {
    updateStatus(message.status);
    return;
  }

  if (message.action === 'updateProgress') {
    updateProgress(message.progress);
    return;
  }

  if (message.action === 'error') {
    isDownloading = false;
    updateStatus('Error: ' + message.error);
    return;
  }
});

// Khởi tạo UI
document.addEventListener('DOMContentLoaded', () => {
  // Thêm nút download
  const downloadButton = document.getElementById('download');
  if (downloadButton) {
    downloadButton.addEventListener('click', startDownload);
  }
  
  // Set initial status
  updateStatus('Ready');
});

document.addEventListener('DOMContentLoaded', function() {
  const videoUrlInput = document.getElementById('videoUrl');
  const downloadBtn = document.getElementById('downloadBtn');
  const status = document.getElementById('status');

  function updateStatus(message, isError = false) {
    status.textContent = message;
    status.style.color = isError ? '#d32f2f' : '#666';
  }

  downloadBtn.addEventListener('click', function() {
    const url = videoUrlInput.value.trim();
    if (!url) {
      updateStatus('Vui lòng nhập URL video', true);
      return;
    }

    updateStatus('Đang bắt đầu tải...');
    downloadBtn.disabled = true;

    try {
      chrome.runtime.sendMessage({
        action: 'startDownload',
        url: url
      }, function(response) {
        if (chrome.runtime.lastError) {
          updateStatus('Lỗi: ' + chrome.runtime.lastError.message, true);
          downloadBtn.disabled = false;
          return;
        }

        if (response && response.success) {
          updateStatus('Đang tải video...');
        } else {
          updateStatus('Lỗi: ' + (response?.error || 'Không thể tải video'), true);
          downloadBtn.disabled = false;
        }
      });
    } catch (error) {
      updateStatus('Lỗi: ' + error.message, true);
      downloadBtn.disabled = false;
    }
  });
});