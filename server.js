// server.js (ESM)
import http from "http";
import { WebSocketServer } from "ws";
import { pack, unpack } from "msgpackr";

const PORT = process.env.PORT || 8080;

// Tạo HTTP server (an toàn trên Render để hỗ trợ upgrade)
const server = http.createServer((req, res) => {
  res.writeHead(200);
  res.end("OK");
});

// Khởi WS dựa trên HTTP server để hoạt động tốt trên nền tảng hosting
const wss = new WebSocketServer({ server });

server.listen(PORT, () => {
  console.log(`WebSocket server running on port ${PORT}`);
});

wss.on("connection", (ws) => {
  console.log("Client connected");

  // Gửi MessagePack binary (không stringify)
  ws.send(pack({ type: "welcome", message: "Connected to custom server!" }));

  ws.on("message", (msg) => {
    // msg có thể là Buffer/Uint8Array (binary) hoặc string (text)
    if (typeof msg === "string") {
      console.log("Received text:", msg.slice(0,200));
      // Nếu bạn vẫn muốn chấp nhận JSON text:
      try {
        const parsed = JSON.parse(msg);
        // xử lý parsed...
        ws.send(pack({ type: "echo", message: parsed }));
      } catch (e) {
        // nếu server nhận text không phải json, log để debug
        console.warn("Text message not JSON");
      }
      return;
    }

    // Nếu đến đây, msg là binary (Buffer / Uint8Array)
    try {
      const data = unpack(msg); // unpack hoạt động với Buffer/Uint8Array
      console.log("Unpacked incoming:", data);
      // phản hồi lại bằng binary
      ws.send(pack({ type: "echo", message: data }));
    } catch (err) {
      console.error("Failed to unpack binary message:", err);
    }
  });

  ws.on("close", () => console.log("Client disconnected"));
});
