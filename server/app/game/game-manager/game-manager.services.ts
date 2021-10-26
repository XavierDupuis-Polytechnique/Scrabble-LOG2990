import { OnlineGameSettings } from '@app/game-manager/game-settings-multi.interface';
import { Game } from '@app/game/game-logic/game/game';
import { Player } from '@app/game/game-logic/player/player';
import { OnlineAction } from '@app/game/online-action.interface';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

interface PlayerRef {
    gameToken: string;
    player: Player;
}

@Service()
export class GameManagerService {
    activeGames = new Map<string, Game>();
    activePlayers = new Map<string, PlayerRef>(); // playerId => PlayerRef
    private newGameStateSubject = new Subject<string>();

    constructor() {
        this.activeGames.set('69', new Game());
    }

    createGame(gameToken: string, gameSettings: OnlineGameSettings) {
        this.activeGames.set(gameToken, new Game());
        console.log('active games', this.activeGames);
    }

    addPlayerToGame(playerId: string, gameToken: string) {
        const game = this.activeGames.get(gameToken);
        if (!game) {
            throw Error(`GameToken ${gameToken} is not in active game`);
        }
        // game.getPlayer(playerName)
        const playerRef = { gameToken, player: new Player() };
        this.activePlayers.set(playerId, playerRef);
        console.log('active players', this.activePlayers);
    }

    receivePlayerAction(playerId: string, action: OnlineAction) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            throw Error(`Player ${playerId} is not active anymore`);
        }
        const player = playerRef.player;
        player.play(action.type);
    }

    removePlayerFromGame(playerId: string) {
        const playerRef = this.activePlayers.get(playerId);
        if (!playerRef) {
            return;
        }
        const gameToken = playerRef.gameToken;
        // TODO set winner to the player still online
        this.activePlayers.delete(playerId);
        this.activeGames.delete(gameToken);
        console.log(`Player ${playerId} left the game`);
        console.log('Current active players', this.activePlayers);
        console.log('Current active games', this.activeGames);
    }

    get newGameStates$(): Observable<string> {
        return this.newGameStateSubject;
    }
}
