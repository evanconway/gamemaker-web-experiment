import { WebSocketServer, Server } from 'ws';
import fs from 'fs';
import game, { ClientState, ReceivedEvent, SendPlayerData } from "./game";

const startSocketServer = () => {
    // read ssl certificate
    var privateKey = fs.readFileSync('ssl-cert/private.key', 'utf8');
    var certificate = fs.readFileSync('ssl-cert/cert.crt', 'utf8');

    var credentials = { key: privateKey, cert: certificate };
    var https = require('https');

    const port = 8443;

    //pass in your credentials to create an https server
    const httpsServer = https.createServer(credentials);

    const socketWebServer = new WebSocketServer({ server: httpsServer }, () => {
        console.log(`WEB socket server is running on port: ${port}`);
    });

    socketWebServer.on('connection', function connection(ws) {
        const sendState: SendPlayerData = (clientState: ClientState, data: any) => ws.send(JSON.stringify({
            clientState,
            data,
        }));
        const socketPlayerId = game.addPlayer(sendState);
        console.log(`client connected player id: ${socketPlayerId}`);
        
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

    httpsServer.listen(port, () => console.log(`https server listening on port: ${port}`));
};

export default startSocketServer;
