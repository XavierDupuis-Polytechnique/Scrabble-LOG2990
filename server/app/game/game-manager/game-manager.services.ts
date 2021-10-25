import { Game } from '@app/game/game-logic/game/game';
import { Player } from '@app/game/game-logic/player/player';
import { OnlineAction } from '@app/game/online-action.interface';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

@Service()
export class GameManagerService {
    activeGames = new Map<string, Game>();
    activePlayers = new Map<string, Player>();
    private newGameStateSubject = new Subject<string>();

    createGame(gameToken: string) {
        this.activeGames.set(gameToken, new Game());
    }

    addPlayerToGame(playerId: string, gameToken: string) {
        // game.getPlayer(playerName)
        const player = new Player();
        this.activePlayers.set(playerId, player);
    }

    receivePlayerAction(playerId: string, action: OnlineAction) {
        const player = this.activePlayers.get(playerId);
        if (!player) {
            throw Error(`Player ${playerId} is not active anymore`);
        }
        player.play(action.type);
    }

    get newGameStates$(): Observable<string> {
        return this.newGameStateSubject;
    }
}
