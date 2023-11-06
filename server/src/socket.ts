import net from "net";
import { v4 as uuid } from "uuid";
import { WebSocketServer } from 'ws';
import game from "./game";

const socketTCPServer = net.createServer((socket) => {
    let socket_player_id = "";
    console.log("TCP Client connected");
    socket.write("tcp connection established");

    socket.on("data", (data) => {
        const rawString = data.toString();
        const dataString = rawString.slice(0, rawString.length - 1);
        const dataObj = JSON.parse(dataString);
        console.log(`tcp socket received:`, dataObj);
        if (dataObj['event'] === 'connect_player_id') socket_player_id = dataObj['player_id'];
        socket.write(JSON.stringify({
            event: 'game_state',
            game_state: game.state,
        }));
    });

    socket.on("end", () => {
        console.log("Client disconnected");
        game.deletePlayer(socket_player_id);
    });

    socket.on("error", (error) => {
        console.log(`Socket Error: "${error.message}"`);
        game.deletePlayer(socket_player_id);
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
    let socket_player_id = "";
    console.log("WEB Client connected")
    ws.send("web connection established");
  
    ws.on('message', function message(data) {
        const rawString = data.toString();
        const dataString = rawString.slice(0, rawString.length - 1);
        const dataObj = JSON.parse(dataString);
        console.log(`web socket received:`, dataObj);
        if (dataObj['event'] === 'connect_player_id') socket_player_id = dataObj['player_id'];
        ws.send(JSON.stringify({
            event: 'game_state',
            game_state: game.state,
        }));
    });

    ws.on('error', (err) => {
        console.error(err.message);
        game.deletePlayer(socket_player_id);
    });

    ws.on("close", () => {
        console.log("Client disconnected");
        game.deletePlayer(socket_player_id);
    });
});

export const startSocketServer = () => {
    socketTCPServer.listen(port, () => {
        console.log(`TCP socket server is running on port: ${port}`);
    });
};

export default startSocketServer;
