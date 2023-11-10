import { WebSocketServer } from 'ws';
import game, { ClientState, ReceivedEvent, SendPlayerData } from "./game";

const startSocketServer = () => {
    const port = 5000;

    const socketWebServer = new WebSocketServer({ port: port }, () => {
        console.log(`WEB socket server is running on port: ${port}`);
    });

    socketWebServer.on('connection', function connection(ws) {
        const sendState: SendPlayerData = (clientState: ClientState, data: any) => ws.send(JSON.stringify({
            clientState,
            data,
        }));
        const socketPlayerId = game.addPlayer(sendState);;
        
        ws.on('message', function message(data) {
            const rawString = data.toString();
            // game maker needs to create buffers 1 byte longer than the content
            const dataString = rawString.slice(0, rawString.length - 1);
            const dataObj = JSON.parse(dataString);
            const event = dataObj['event'] as ReceivedEvent;
            game.handleMessageReceived(event, dataObj['data']);
            
        });

        ws.on('error', (err) => {
            console.error(err.message);
            game.deletePlayer(socketPlayerId);
        });

        ws.on("close", () => {
            console.log("client disconnected");
            game.deletePlayer(socketPlayerId);
        });
    });
};

export default startSocketServer;
