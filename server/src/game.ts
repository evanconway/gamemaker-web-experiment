import { v4 as uuid } from "uuid";
import { WebSocket } from "ws";

const WORLD_WIDTH = 320;
const WORLD_HEIGHT = 180;
const PLAYER_WIDTH = 16;

interface PlayerPosition {
    x: number,
    y: number,
}

// this data gets sent to GameMaker, which favors snake case
interface Player {
    id: string,
    queue: number,
    matchId: string,
    position: PlayerPosition,
    color: {
        red: number,
        green: number,
        blue: number,
    },
}

type Players = Record<string, Player>;

interface GameState {
    players: Players,
    matches: Record<string, Set<string>>,
};

type SendEvent = 'connection_established' | 'update_game_state';

export type ReceivedEvent = 'connect_player_id' | 'update_position';

export type SendPlayerData = (event: SendEvent, data: any) => void;

export type GameStateChangeCallback = (newState: GameState) => void;

class Game {
    state: GameState;
    // mapping of player IDs to functions which send data to player
    playerSendStatePairings: Record<string, SendPlayerData>;

    constructor() {
        this.state = { players: {}, matches: {} };
        this.playerSendStatePairings = {};
    }

    addPlayer() {
        const newPlayerId = uuid();
        this.state.players[newPlayerId] = {
            id: newPlayerId,
            queue: -1,
            matchId: "",
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

    /**
     * Connects given player with a web socket connection so they can be send state updates.
     * 
     * @param playerId 
     * @param ws 
     */
    connectPlayerToSocketConnection(playerId: string, ws: WebSocket) {
        const sendState: SendPlayerData = (event: SendEvent, data: any) => {
            ws.send(JSON.stringify({
                event,
                data,
            }));
        };
        this.playerSendStatePairings[playerId] = sendState;
        // send player event indicating they've connected
        sendState('connection_established', 'WS Connection Established');
        console.log(`player ${playerId} web socket connection established`);
        sendState('update_game_state', this.state);
    }

    /**
     * Given data received from a web socket connection, perform game logic
     */
    handleMessageReceived(event: ReceivedEvent, data: any) {
        // handling events should send state updates to other players.

        if (event === 'update_position') {
            game.updatePlayerPosition(data['player_id'], { 
                x: data['position_x'], 
                y: data['position_y'],
            });
        }
    }

    updatePlayerPosition(playerId: string, newPosition: PlayerPosition) {
        if (this.state.players[playerId] === undefined) return;
        this.state.players[playerId].position = newPosition;
    }

    deletePlayer(playerId: string) {
        const filteredPlayers: Players = {};
        const filteredPlayerSendStatePairings: typeof this.playerSendStatePairings = {}
        for (const key in this.state.players) {
            if (key !== playerId) {
                filteredPlayers[key] = this.state.players[key];
                filteredPlayerSendStatePairings[key] = this.playerSendStatePairings[key];
            }
        }
        this.state.players = filteredPlayers;
        this.playerSendStatePairings = filteredPlayerSendStatePairings;
    }
}

const game = new Game();

export default game;
