import { WebSocketServer } from "ws";
import { Packr } from "msgpackr"; // Import thư viện MessagePack

// Khởi tạo bộ đóng gói MessagePack
const packr = new Packr(); 

const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
    console.log("💡 Client connected");

    // Gửi WELCOME: đóng gói object JS thành Buffer MessagePack
    ws.send(packr.pack({ type: "welcome", message: "Connected to custom server!" }));

    ws.on("message", (msg) => {
        // Giải mã dữ liệu nhận được (Buffer) thành Object JS
        try {
            const clientData = packr.unpack(msg);
            console.log("📩 Received:", clientData);

            // Gửi ECHO lại bằng MessagePack
            ws.send(packr.pack({ type: "echo", received: clientData }));

        } catch (e) {
            console.error("Lỗi giải mã MessagePack:", e);
            // Có thể server nhận được chuỗi không phải MessagePack
        }
    });

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});
