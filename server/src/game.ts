import { v4 as uuid } from "uuid";
import fs from 'fs';

const PLAYERS_PER_GAME = 1;
const WORDS_TO_WIN = 40;

// very bad practice! fix later
let WORDS: Array<string> = [];
fs.readFile('./src/words.txt', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    // this line behaves differently in different environments!
    // windows: \r\n
    // macos:   \n
    WORDS = data.split('\r\n');
    console.log(`${WORDS.length} words loaded`);
});

const getRandomWord = () => {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
};

export type ClientState = 'title' | 'queued' | 'ingame';

export type SendPlayerData = (clientState: ClientState, data: any) => void;

// note for future projects, the concept of a "client" and a "player" in a match should be separate
// but this project it should be fine
interface Player {
    id: string,
    typed: string, // typed characters by the player
    color: {
        red: number,
        green: number,
        blue: number,
    },
    sendState: SendPlayerData,
}

interface Match {
    id: string,
    state: 'play' | 'results',
    words: Array<string>, // the randomly chose words players must type
    playersWordIndex: Record<string, number>, // word players are currently typing
    victor?: Player,
    players: Array<Player>,
}

export type ReceivedEvent = 'connect_player_id' | 'player_add_to_queue' | 'update_match';

type MatchEvent = 'update' | 'quit' | 'player_dropped';

class Game {
    players: Record<string, Player>;
    queue: Array<Player>;
    matches: Record<string, Match>;

    constructor() {
        this.players = {};
        this.queue = [];
        this.matches = {};
    }

    addPlayer(sendState: SendPlayerData): string {
        const newPlayerId = uuid();
        this.players[newPlayerId] = {
            id: newPlayerId,
            typed: "",
            color: {
                red: Math.floor(Math.random() * 256),
                green: Math.floor(Math.random() * 256),
                blue: Math.floor(Math.random() * 256),
            },
            sendState,
        };
        sendState('title', { 'your_player_id': newPlayerId });
        console.log(`added player id: ${newPlayerId}`);
        return newPlayerId;
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

    /**
     * Sends given player data about their current match, if they're in one.
     * 
     * @param player 
     * @param overwriteClient Indicates if client should be forced to overwrite client data with server data. Otherwise client decides.
     * @returns 
     */
    sendClientMatchData(player: Player, overwriteClient = false) {
        const match = this.getPlayerMatch(player);
        if (match === undefined) return;
        const playerWords = new Array<string>();
        const playerWordIndex = match.playersWordIndex[player.id];
        for (let i = playerWordIndex; (i < playerWordIndex + 10) && (i < match.words.length); i++) { 
            playerWords.push(match.words[i]);
        }
        this.sendClientData(player, 'ingame', {
            players: match.players,
            playersWordIndex: match.playersWordIndex,
            wordsToWin: WORDS_TO_WIN,
            state: match.state,
            victor: match.victor,
            words: playerWords,
            overwriteClient,
        });
    }

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
            const playersWordIndex: Record<string, number> = {};
            newMatchPlayersArray.forEach(p => playersWordIndex[p.id] = 0);
            const words = new Array<string>(WORDS_TO_WIN);
            for (let i = 0; i < words.length; i++) words[i] = getRandomWord();
            this.matches[matchId] = {
                id: matchId,
                state: 'play',
                words,
                playersWordIndex,
                players: newMatchPlayersArray,
            };
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

    removePlayerFromMatch(player: Player) {
        const match = this.getPlayerMatch(player);
        if (match === undefined) return undefined;
        match.players = match.players.filter(p => p !== player);
        const filteredPlayersWordIndex: typeof match.playersWordIndex = {};
        for (const playerId in match.playersWordIndex) {
            if (playerId !== player.id) filteredPlayersWordIndex[playerId] = match.playersWordIndex[playerId];
        }
        match.playersWordIndex = filteredPlayersWordIndex;
        if (match.players.length <= 0) {
            const filteredMatches: typeof this.matches = {};
            for (const id in this.matches) {
                if (id !== match.id) filteredMatches[id] = this.matches[id];
            }
            this.matches = filteredMatches;
        }
        this.sendClientData(player, 'title', {});
        // consider also updating the match to check for win condition here
        return match;
    }

    updateMatch(player: Player, data: any) {
        let overwriteThisPlayerClient = false;
        let overwriteAllPlayerClient = false;
        const match = this.getPlayerMatch(player);
        if (match === undefined) return;
        const matchEvent = data['match_event'] as MatchEvent;
        if (matchEvent === 'player_dropped') {
            this.removePlayerFromMatch(player);
        } else if (match.state === 'play') {
            const newTyped = data['typed'];
            if (newTyped !== undefined) player.typed = newTyped;
            const targetWord = match.words[match.playersWordIndex[player.id]];
            if (player.typed.toLowerCase() === targetWord.toLowerCase()) {
                overwriteThisPlayerClient = true;
                match.playersWordIndex[player.id]++;
                player.typed = '';
                if (match.playersWordIndex[player.id] >= match.words.length) {
                    overwriteAllPlayerClient = true;
                    console.log(`player won, id: ${player.id}`);
                    match.victor = player;
                    match.state = 'results';
                }
            }
        } else if (match.state === 'results') {
            if (matchEvent === 'quit') {
                this.removePlayerFromMatch(player);
            }
        }
        match.players.forEach(p => {
            const overwrite = overwriteAllPlayerClient ? true : overwriteThisPlayerClient && p === player ? true : false;
            this.sendClientMatchData(p, overwrite);
        });
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
        const player = this.players[playerId];
        if (player === undefined) return;

        // remove player from active match, and update all other players in said match
        this.updateMatch(player, { match_event: 'player_dropped' });

        const filteredPlayers: typeof this.players = {};
        for (const key in this.players) {
            if (key !== playerId) filteredPlayers[key] = this.players[key];
        }
        this.players = filteredPlayers;
    }
}

const game = new Game();

export default game;
