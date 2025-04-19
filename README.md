# Google Drive Video Downloader

Extension tải video từ Google Drive đơn giản và hiệu quả.

## Cách cài đặt

1. Tải extension về máy và giải nén
2. Mở Chrome và truy cập `chrome://extensions/`
3. Bật chế độ "Developer mode" (góc phải trên cùng)
4. Click "Load unpacked" và chọn thư mục chứa extension đã giải nén

## Cách sử dụng

1. Mở video trong Google Drive
2. Play video một chút để load
3. Mở DevTools (F12) và chọn tab Network
4. Tìm request có chứa "videoplayback" trong tab XHR
5. Click chuột phải vào request và chọn "Copy link address"
6. Click vào icon extension trên Chrome
7. Paste URL vào ô nhập liệu
8. Click "Download" để bắt đầu tải

## Chú ý

- URL video phải là URL trực tiếp từ Google Drive (chứa "videoplayback")
- Nếu không thấy URL video, hãy thử refresh trang và play video lại
- Extension sẽ tự động xử lý URL để đảm bảo tải được video chất lượng tốt nhất

## Cấu trúc code

- `manifest.json`: Cấu hình extension
- `popup.html`: Giao diện người dùng
- `popup.js`: Xử lý tương tác người dùng
- `background.js`: Xử lý tải video
- `content.js`: Tương tác với trang web

## Các tính năng

- Tải video trực tiếp từ Google Drive
- Tự động xử lý URL để tối ưu chất lượng
- Giao diện đơn giản, dễ sử dụng
- Hiển thị trạng thái tải xuống
- Cho phép chọn vị trí lưu file

## Yêu cầu

- Chrome browser phiên bản mới nhất
- Quyền truy cập vào Google Drive
- Kết nối internet ổn định

## Giải quyết sự cố

1. **Không tải được video**
   - Kiểm tra URL có đúng định dạng không
   - Thử refresh trang và lấy URL mới
   - Đảm bảo có quyền truy cập video

2. **Extension không hoạt động**
   - Kiểm tra đã cài đặt đúng cách chưa
   - Thử tắt và bật lại extension
   - Kiểm tra console có lỗi không

## Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console trong DevTools
2. Chụp ảnh lỗi nếu có
3. Mô tả chi tiết các bước tái hiện lỗi 