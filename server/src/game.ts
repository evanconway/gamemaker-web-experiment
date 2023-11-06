import { v4 as uuid } from "uuid";

const WORLD_WIDTH = 320;
const WORLD_HEIGHT = 180;
const PLAYER_WIDTH = 16;

interface PlayerPosition {
    position_x: number,
    position_y: number,
}

// this data gets sent to GameMaker, which favors snake case
interface Player {
    player_id: string,
    position: PlayerPosition,
    player_color: {
        red: number,
        green: number,
        blue: number,
    },
}

type Players = Record<string, Player>;

interface GameState {
    players: Players,
};

export type GameStateChangeCallback = (newState: GameState) => void;

interface GameStateChangeIdCBPairing {
    playerId: string,
    callback: GameStateChangeCallback,
}

class Game {
    state: GameState;
    onChangeCallbacks: Array<GameStateChangeIdCBPairing>;

    constructor() {
        this.state = { players: {} };
        this.onChangeCallbacks = [];
    }

    handleStateChanged() {
        const bar = '---------------';
        console.log(bar, 'NEW GAME STATE', bar);
        console.log(JSON.stringify({ state: this.state, callbackPairs: this.onChangeCallbacks }));
        console.log(bar, '--------------', bar, '\n');
        this.onChangeCallbacks.forEach(cb => cb.callback(this.state));
    }

    addCallback(gameStateChangeCallback: GameStateChangeIdCBPairing) {
        this.onChangeCallbacks.push(gameStateChangeCallback);
        this.handleStateChanged();
    }

    addPlayer() {
        const newPlayerId = uuid();
        this.state.players[newPlayerId] = {
            player_id: newPlayerId,
            position: {
                position_x: Math.floor(Math.random() * (WORLD_WIDTH - PLAYER_WIDTH)),
                position_y: Math.floor(Math.random() * (WORLD_HEIGHT - PLAYER_WIDTH)),
            },
            player_color: {
                red: Math.floor(Math.random() * 256),
                green: Math.floor(Math.random() * 256),
                blue: Math.floor(Math.random() * 256),
            },
        };
        this.handleStateChanged();
        return newPlayerId;
    }

    updatePlayerPosition(playerId: string, newPosition: PlayerPosition) {
        if (this.state.players[playerId] === undefined) return;
        this.state.players[playerId].position = newPosition;
        this.handleStateChanged();
    }

    deletePlayer(playerId: string) {
        const filteredPlayers: Players = {};
        for (const key in this.state.players) {
            if (key !== playerId) filteredPlayers[key] = this.state.players[key];
        }
        this.state.players = filteredPlayers;
        this.onChangeCallbacks = this.onChangeCallbacks.filter(cb => cb.playerId !== playerId);
        this.handleStateChanged();
    }
}

const game = new Game();

export default game;
