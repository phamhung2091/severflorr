    // Server-side example (Node.js with 'ws')
    const WebSocket = require('ws');
    const { pack } = require('msgpackr');

    const wss = new WebSocket.Server({ port: 8080 });

import WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({ port: process.env.PORT || 8080 });
console.log("✅ Server đang chạy trên cổng:", process.env.PORT || 8080);

wss.on("connection", (ws) => {
  console.log("🔗 Client mới kết nối");

  ws.on("message", (msg) => {
    const text = msg.toString();
    console.log("📩 Nhận:", text);

    try {
      // Nếu client gửi login
      if (text.startsWith("loginusername")) {
        const parts = text.split("@");
        const username = parts[1];
        const password = parts[2];

        // Ở đây bạn có thể kiểm tra username/password thật
        // (ví dụ truy vấn database, hoặc tạm thời chấp nhận hết)
        console.log(`🔑 Đăng nhập: ${username} / ${password}`);
        ws.send(JSON.stringify({
          type: "login_success",
          user: username,
        }));
      }

      // Nếu client gửi create
      else if (text.startsWith("createusername")) {
        const parts = text.split("@");
        const username = parts[1];
        const password = parts[2];

        console.log(`🆕 Tạo tài khoản: ${username}`);
        ws.send(JSON.stringify({
          type: "create_success",
          user: username,
        }));
      }

      // Mọi gói khác: chỉ echo
      else {
        ws.send(JSON.stringify({
          type: "echo",
          message: text
        }));
      }
    } catch (err) {
      console.error("❌ Lỗi xử lý:", err);
      ws.send(JSON.stringify({
        type: "error",
        message: "Lỗi xử lý server"
      }));
    }
  });
});
