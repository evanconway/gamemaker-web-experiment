import { WebSocketServer } from 'ws';
import game, { GameStateChangeCallback, ReceivedEvent, SendPlayerData } from "./game";

const startSocketServer = () => {
    const port = 5000;

    const socketWebServer = new WebSocketServer({ port: port }, () => {
        console.log(`WEB socket server is running on port: ${port}`);
    });

    socketWebServer.on('connection', function connection(ws) {
        let socket_player_id = "";
        
        ws.on('message', function message(data) {
            const rawString = data.toString();
            // game maker needs to create buffers 1 byte longer than the content
            const dataString = rawString.slice(0, rawString.length - 1);
            const dataObj = JSON.parse(dataString);
            const event = dataObj['event'] as ReceivedEvent;

            if (event === 'connect_player_id') {
                socket_player_id = dataObj['player_id'];
                game.connectPlayerToSocketConnection(socket_player_id, ws);
            } else {
                game.handleMessageReceived(event, dataObj['data']);
            }
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
};

export default startSocketServer;
