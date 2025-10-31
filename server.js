import { WebSocketServer } from "ws";

const PORT = process.env.PORT || 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`✅ WebSocket server running on port ${PORT}`);

wss.on("connection", (ws) => {
  console.log("🔗 Client connected");
  ws.send(JSON.stringify({ type: "welcome", message: "Connected to custom server!" }));

  ws.on("message", (msg) => {
    console.log("📩 Received:", msg.toString());
    ws.send(JSON.stringify({ type: "echo", message: msg.toString() }));
  });

  ws.on("close", () => console.log("❌ Client disconnected"));
});
