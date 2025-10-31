    // Server-side example (Node.js with 'ws')
    const WebSocket = require('ws');
    const { pack } = require('msgpackr');

    const wss = new WebSocket.Server({ port: 8080 });

    wss.on('connection', ws => {
        const dataToSend = { message: "hello", value: 123 };
        const packedData = pack(dataToSend); // Pack into a Uint8Array
        ws.send(packedData); // Send binary data
    });
    
  });

  ws.on("close", () => console.log("Client disconnected"));
});
