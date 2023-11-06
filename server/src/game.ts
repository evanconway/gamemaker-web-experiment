import { v4 as uuid } from "uuid"

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
    onStateChangeCallback: GameStateChangeCallback;

    constructor(newOnStateChangeCallback: GameStateChangeCallback) {
        this.state = {};
        this.onStateChangeCallback = newOnStateChangeCallback;
    }

    stateUpdated() {
        this.onStateChangeCallback(this.state);
    }

    addPlayer() {
        const newPlayerId = uuid();
        const newPlayerColor = Math.floor(Math.random()*16777215).toString(16);
        this.state[newPlayerId] = {
            player_id: newPlayerId,
            position: {
                position_x: 0,
                position_y: 0,
            },
            player_color: newPlayerColor,
        };
        this.stateUpdated();
        return newPlayerId;
    }

    updatePlayerPosition(playerId: string, newPosition: PlayerPosition) {
        if (this.state[playerId] === undefined) return;
        this.state[playerId].position = newPosition;
        this.stateUpdated();
    }

    deletePlayer(playerId: string) {
        const filteredState: GameState = {};
        for (const key in this.state) {
            if (key !== playerId) filteredState[key] = this.state[key];
        }
        this.state = filteredState;
        this.stateUpdated();
    }
}

export default Game;
