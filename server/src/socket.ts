import { WebSocketServer } from 'ws';
import game, { GameStateChangeCallback, SendPlayerData } from "./game";

const startSocketServer = () => {
    const port = 5000;

    const socketWebServer = new WebSocketServer({ port: port }, () => {
        console.log(`WEB socket server is running on port: ${port}`);
    });

    socketWebServer.on('connection', function connection(ws) {
        let socket_player_id = "";
        console.log("WEB Client connected");

        ws.send("web connection established");
    
        ws.on('message', function message(data) {
            const rawString = data.toString();
            const dataString = rawString.slice(0, rawString.length - 1);
            const dataObj = JSON.parse(dataString);
            //console.log(`web socket received:`, dataObj);

            const sendStateToPlayer: GameStateChangeCallback = state => ws.send(
                JSON.stringify({
                    event: 'game_state',
                    game_state: state,
                }),
            );

            if (dataObj['event'] === 'connect_player_id') {
                socket_player_id = dataObj['player_id'];
                game.addCallback({ playerId: socket_player_id, callback: sendStateToPlayer });
            }
            if (dataObj['event'] === 'player_update_position') {
                game.updatePlayerPosition(dataObj['player_id'], { 
                    x: dataObj['position_x'], 
                    y: dataObj['position_y'],
                });
            }

            sendStateToPlayer(game.state);
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
