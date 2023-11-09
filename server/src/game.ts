import { v4 as uuid } from "uuid";
import { WebSocket } from "ws";

const WORLD_WIDTH = 320;
const WORLD_HEIGHT = 180;
const PLAYER_WIDTH = 16;
const PLAYERS_PER_GAME = 2;

type ClientState = 'title' | 'queued' | 'ingame';

type SendPlayerData = (clientState: ClientState, data: any) => void;

interface PlayerPosition {
    x: number,
    y: number,
}

interface Player {
    id: string,
    position: PlayerPosition,
    color: {
        red: number,
        green: number,
        blue: number,
    },
    sendState?: SendPlayerData,
}

export type ReceivedEvent = 'connect_player_id' | 'player_add_to_queue' | 'update_position';

class Game {
    players: Record<string, Player>;
    queue: Array<Player>;
    matches: Record<string, Array<Player>>;

    constructor() {
        this.players = {};
        this.queue = [];
        this.matches = {};
    }

    addPlayer() {
        const newPlayerId = uuid();
        this.players[newPlayerId] = {
            id: newPlayerId,
            position: {
                x: Math.floor(Math.random() * (WORLD_WIDTH - PLAYER_WIDTH)),
                y: Math.floor(Math.random() * (WORLD_HEIGHT - PLAYER_WIDTH)),
            },
            color: {
                red: Math.floor(Math.random() * 256),
                green: Math.floor(Math.random() * 256),
                blue: Math.floor(Math.random() * 256),
            },
        };
        console.log(`player ${newPlayerId} added`)
        return newPlayerId;
    }

    sendClientData(playerId: string, clientState: ClientState, data: any) {
        const sendData = this.players[playerId].sendState;
        if (sendData === undefined) return;
        sendData(clientState, data);
    }

    /**
     * Using the current queue, assign match ids (start matches) if there are enough players.
     */
    startMatches() {
        // players in game should get sent ingame state
        // all other players in queue should receive queued state
        while (this.queue.length >= PLAYERS_PER_GAME) {
            const newMatchPlayersArray: Array<Player> = [];
            const matchId = uuid();
            for (let i = 0; i < PLAYERS_PER_GAME; i++) {
                const newPlayer = this.queue.shift();
                if (newPlayer !== undefined) newMatchPlayersArray.push();
                const playerId = newPlayer === undefined ? '' : newPlayer.id;
                this.sendClientData(playerId, 'ingame', {});
                console.log(`player id: ${playerId} entered match id: ${matchId}`);
            }
            this.matches[matchId] = newMatchPlayersArray;
        }
        this.queue.forEach(player => {
            console.log(`player id: ${player.id} queued`);
            this.sendClientData(player.id, 'queued', {});
        });
    }

    /**
     * Connects given player with a web socket connection so they can be send state updates.
     * 
     * @param playerId 
     * @param ws 
     */
    connectPlayerToSocketConnection(playerId: string, ws: WebSocket) {
        const player = this.players[playerId];
        if (player === undefined) {
            console.log(`playerId: ${playerId} does not exist`);
            return;
        }
        const sendState: SendPlayerData = (clientState: ClientState, data: any) => ws.send(JSON.stringify({
                clientState,
                data,
        }));
        this.players[playerId].sendState = sendState;
        console.log(`player ${playerId} web socket connection established`);
        sendState('title', {});
    }

    /**
     * Given data received from a web socket connection, perform game logic
     */
    handleMessageReceived(event: ReceivedEvent, data: any) {
        const playerId = data['player_id'];
        if (playerId === undefined) return;
        const player = this.players[playerId];
        if (player === undefined) return;

        // handling events should send state updates to other players.
        if (event === 'player_add_to_queue') {
            this.queue.push(player);
            this.startMatches();
        } else if (event === 'update_position') {
            this.updatePlayerPosition(playerId, { 
                x: data['position_x'], 
                y: data['position_y'],
            });
        }
    }

    updatePlayerPosition(playerId: string, newPosition: PlayerPosition) {
        if (this.players[playerId] === undefined) return;
        this.players[playerId].position = newPosition;
    }

    deletePlayer(playerId: string) {
        const filteredPlayers: typeof this.players = {};
        for (const key in this.players) {
            if (key !== playerId) filteredPlayers[key] = this.players[key];
        }
        this.players = filteredPlayers;
    }
}

const game = new Game();

export default game;
