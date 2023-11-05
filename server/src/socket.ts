import net from "net";
import { WebSocketServer } from 'ws';

const socketTCPServer = net.createServer((socket) => {
    console.log("TCP Client connected");
    socket.write("tcp connection established");

    socket.on("data", (data) => {
        console.log(`tcp socket received: "${data.toString()}"`);
    });

    socket.on("end", () => {
        console.log("Client disconnected");
    });

    socket.on("error", (error) => {
        console.log(`Socket Error: ${error.message}`);
    });
});

socketTCPServer.on("error", (error) => {
    console.log(`Server Error: ${error.message}`);
});

const port = 5000;

const socketWebServer = new WebSocketServer({ port: port + 1 }, () => {
    console.log(`WEB socket server is running on port: ${port + 1}`);
});

socketWebServer.on('connection', function connection(ws) {
    console.log("WEB Client connected")
    ws.send("web connection established");

    ws.on('error', console.error);
  
    ws.on('message', function message(data) {
      console.log('received: %s', data);
    });

    ws.on("close", () => console.log("Client disconnected"));
});

export const startSocketServer = () => {
    socketTCPServer.listen(port, () => {
        console.log(`TCP socket server is running on port: ${port}`);
    });
};

export default startSocketServer;
