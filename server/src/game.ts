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

type GameState = Record<string, Player>;
type GameStateChangeCallback = (newState: GameState) => void;

class Game {
    state: GameState;

    constructor() {
        this.state = {};
    }

    addPlayer() {
        const newPlayerId = uuid();
        const newPlayerColor = Math.floor(Math.random()*16777215).toString(16);
        this.state[newPlayerId] = {
            player_id: newPlayerId,
            position: {
                position_x: Math.floor(Math.random() * (WORLD_WIDTH - PLAYER_WIDTH)),
                position_y: Math.floor(Math.random() * (WORLD_HEIGHT - PLAYER_WIDTH)),
            },
            player_color: newPlayerColor,
        };
        return newPlayerId;
    }

    updatePlayerPosition(playerId: string, newPosition: PlayerPosition) {
        if (this.state[playerId] === undefined) return;
        this.state[playerId].position = newPosition;
    }

    deletePlayer(playerId: string) {
        const filteredState: GameState = {};
        for (const key in this.state) {
            if (key !== playerId) filteredState[key] = this.state[key];
        }
        this.state = filteredState;
    }

    toJSONString() {
        return JSON.stringify(this.state);
    }
}

const game = new Game();

export default game;
