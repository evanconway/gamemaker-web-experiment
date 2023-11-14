import { WebSocketServer, Server } from 'ws';
import fs from 'fs';
import game, { ClientState, ReceivedEvent, SendPlayerData } from "./game";

import https from 'https';
import http from 'http';

const startSocketServer = () => {
    const secure = false;
    const port = 8443;
    
    const privateKey = fs.readFileSync('ssl-cert/private.key', 'utf8');
    const certificate = fs.readFileSync('ssl-cert/cert.crt', 'utf8');
    const credentials = { key: privateKey, cert: certificate };

    //pass in your credentials to create an https server
    const server = secure ? https.createServer(credentials) : http.createServer() ;
    server.listen(port, () => console.log(`${secure ? 'SECURE' : 'NOT SECURE'} server listening on port: ${port}`));

    const socketWebServer = new WebSocketServer({ server: server }, () => {
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
};

export default startSocketServer;
