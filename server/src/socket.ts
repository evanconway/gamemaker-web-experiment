import { WebSocketServer } from 'ws';
import fs from 'fs';
import dotenv from "dotenv";
import game, { ClientState, ReceivedEvent, SendPlayerData } from "./game";
import https from 'https';
import http from 'http';

dotenv.config();

const secure =  process.env['SECURE'] === 'true';
const pathToKey = process.env['PATH_TO_KEY'];
const pathToCert = process.env['PATH_TO_CERT'];

if (secure === undefined) throw new Error('SCURE not defined in .env');
if (pathToKey === undefined) throw new Error('PATH_TO_KEY not defined in .env');
if (pathToCert === undefined) throw new Error('PATH_TO_CERT not defined in .env');

const startSocketServer = () => {
    const port = secure ? 443 : 5000;

    const privateKey = fs.readFileSync(pathToKey, 'utf8');
    const certificate = fs.readFileSync(pathToCert, 'utf8');
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
        
        let clientTimeout: NodeJS.Timeout | undefined = undefined;
        const resetCientTimeout = () => {
            clearTimeout(clientTimeout);
            clientTimeout = setTimeout(() => {
                game.deletePlayer(socketPlayerId);
                ws.close();
            }, 25000);
        };
        resetCientTimeout();

        ws.on('message', function message(data) {
            resetCientTimeout();
            const rawString = data.toString();
            // game maker needs to create buffers 1 byte longer than the content
            const dataString = rawString.slice(0, rawString.length - 1);
            const dataObj = JSON.parse(dataString);
            const event = dataObj['event'] as ReceivedEvent;
            if (event === 'ping') return;
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
