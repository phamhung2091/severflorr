import { WebSocketServer } from "ws";
import { Packr } from "msgpackr"; // 1. Import Packr

const packr = new Packr(); // 2. Khởi tạo Packr
const PORT = process.env.PORT || 8080;

const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
    console.log("💡 Client connected");

    // 3. Gửi WELCOME bằng MessagePack (Buffer)
    ws.send(packr.pack({ type: "welcome", message: "Connected to custom server!" }));

    ws.on("message", (msg) => {
        // 4. Giải mã dữ liệu nhận được từ client
        const clientData = packr.unpack(msg);

        console.log("📩 Received:", clientData);

        // 5. Gửi ECHO lại bằng MessagePack (Buffer)
        ws.send(packr.pack({ type: "echo", received: clientData }));
    });

    ws.on("close", () => {
        console.log("❌ Client disconnected");
    });
});
