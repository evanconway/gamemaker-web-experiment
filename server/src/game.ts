import { v4 as uuid } from "uuid";

const WORLD_WIDTH = 320;
const WORLD_HEIGHT = 180;
const PLAYER_WIDTH = 16;

interface PlayerPosition {
    position_x: number,
    position_y: number,
}

interface Player {
    player_id: string,
    position: PlayerPosition,
    player_color: string,
}

type Players = Record<string, Player>;

type GameState = {
    players: Players,
};

type GameStateChangeCallback = (newState: GameState) => void;

class Game {
    state: GameState;

    constructor() {
        this.state = {
            players: {}
        };
    }

    toJSONString() {
        return JSON.stringify(this.state);
    }

    printState() {
        const bar = '---------------';
        console.log(bar, 'NEW GAME STATE', bar);
        console.log(this.toJSONString());
        console.log(bar, '--------------', bar, '\n');
    }

    addPlayer() {
        const newPlayerId = uuid();
        const newPlayerColor = Math.floor(Math.random()*16777215).toString(16);
        this.state.players[newPlayerId] = {
            player_id: newPlayerId,
            position: {
                position_x: Math.floor(Math.random() * (WORLD_WIDTH - PLAYER_WIDTH)),
                position_y: Math.floor(Math.random() * (WORLD_HEIGHT - PLAYER_WIDTH)),
            },
            player_color: newPlayerColor,
        };
        this.printState();
        return newPlayerId;
    }

    updatePlayerPosition(playerId: string, newPosition: PlayerPosition) {
        if (this.state.players[playerId] === undefined) return;
        this.state.players[playerId].position = newPosition;
        this.printState();
    }

    deletePlayer(playerId: string) {
        const filteredPlayers: Players = {};
        for (const key in this.state.players) {
            if (key !== playerId) filteredPlayers[key] = this.state.players[key];
        }
        this.state.players = filteredPlayers;
        this.printState();
    }
}

const game = new Game();

export default game;
