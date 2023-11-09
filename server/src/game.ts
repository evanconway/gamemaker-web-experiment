import { v4 as uuid } from "uuid";
import { WebSocket } from "ws";

const WORLD_WIDTH = 320;
const WORLD_HEIGHT = 180;
const PLAYER_WIDTH = 16;
const PLAYERS_PER_GAME = 1;

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

interface Match {
    id: string,
    players: Array<Player>,
}

export type ReceivedEvent = 'connect_player_id' | 'player_add_to_queue' | 'update_match';

type MatchEvent = 'blank' | 'update_position' | 'win';

class Game {
    players: Record<string, Player>;
    queue: Array<Player>;
    matches: Record<string, Match>;

    constructor() {
        this.players = {};
        this.queue = [];
        this.matches = {};
    }

    addPlayer(): string {
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

    getPlayerMatch(player: Player) {
        for (const key in this.matches) {
            const match = this.matches[key];
            if (match.players.includes(player)) return match;
        }
        return undefined;
    }

    sendClientData(player: Player, clientState: ClientState, data: any) {
        const sendData = player.sendState;
        if (sendData === undefined) return;
        sendData(clientState, data);
    }

    sendClientMatchData(player: Player) {
        const match = this.getPlayerMatch(player);
        if (match === undefined) return;
        console.log(`sending player id: ${player.id} data for match id ${match.id}`);
        this.sendClientData(player, 'ingame', match);
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
                if (newPlayer !== undefined) {
                    newMatchPlayersArray.push(newPlayer);
                    console.log(`player id: ${newPlayer?.id} entered match id: ${matchId}`);
                }
            }
            this.matches[matchId] = {
                id: matchId,
                players: newMatchPlayersArray,
            }
        }
        this.queue.forEach(player => {
            console.log(`player id: ${player.id} queued`);
            this.sendClientData(player, 'queued', {});
        });
        for (const key in this.matches) {
            const match = this.matches[key];
            console.log(`sending match data for match id: ${match.id}`);
            match.players.forEach(p => this.sendClientMatchData(p));
        }
    }

    updateMatch(player: Player, data: any) {
        const match = this.getPlayerMatch(player);
        if (match === undefined) return;
        const matchEvent = data['match_event'] as MatchEvent;
        if (matchEvent === 'blank') {
            console.log(`blank match update event sent by player id: ${player.id}`);
        } else if (matchEvent === 'update_position') {
            player.position = { 
                x: data['position_x'], 
                y: data['position_y'],
            };
        } else if (matchEvent === 'win') {
            match.players.forEach(p => this.sendClientData(p, 'title', {}));
            match.players = []; // prevent sending match data
            const filteredMatches: typeof this.matches = {};
            for (const id in this.matches) {
                if (id !== match.id) filteredMatches[id] = this.matches[id];
            }
            this.matches = filteredMatches;
        }
        match.players.forEach(p => this.sendClientMatchData(p));
    }

    handleMessageReceived(event: ReceivedEvent, data: any) {
        const playerId = data['player_id'];
        if (playerId === undefined) return;
        const player = this.players[playerId];
        if (player === undefined) return;

        // handling events should send state updates to other players.
        if (event === 'player_add_to_queue') {
            this.queue.push(player);
            this.startMatches();
        } else if (event === 'update_match') {
            this.updateMatch(player, data);
        }
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
