import { Injectable } from '@angular/core';
import { Game } from '@app/game-logic/game/games/game';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameInfoService {
    players: Player[];
    user: User;
    private game: Game | undefined;

    private endTurnSubject = new Subject<void>();
    get endTurn$(): Observable<void> {
        return this.endTurnSubject;
    }

    constructor(private timer: TimerService) {}

    receiveGame(game: Game): void {
        this.players = game.players;
        this.game = game;

        if (game instanceof OfflineGame) {
            this.game.endTurn$.subscribe(() => {
                this.endTurnSubject.next();
            });
        }
        // this.game = undefined;
    }

    // receiveOnlineGame(onlineGame: OnlineGame): void {
    //     this.players = onlineGame.players;
    //     this.game = onlineGame;
    //     // this.game = undefined;
    // }

    receiveUser(user: User): void {
        this.user = user;
    }

    getPlayer(index: number): Player {
        if (!this.players) {
            throw new Error('No Players in GameInfo');
        }
        return this.players[index];
    }

    getPlayerScore(index: number): number {
        if (!this.players) {
            throw new Error('No Players in GameInfo');
        }
        return this.players[index].points;
    }

    get letterOccurences(): Map<string, number> {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }

        if (this.game instanceof OfflineGame) {
            return (this.game as OfflineGame).letterBag.countLetters();
        }
        // else if (this.game instanceof OnlineGame) {
        //     return (this.game as OnlineGame).letterOccurences;
        // }
        return new Map<string, number>();
    }

    get numberOfPlayers(): number {
        if (!this.players) {
            throw Error('No Players in GameInfo');
        }
        return this.players.length;
    }

    get activePlayer(): Player {
        if (!this.players || !this.game) {
            throw Error('No Players in GameInfo');
        }
        // if (!this.game) {
        //     return this.players[(this.game as OnlineGame).activePlayerIndex];
        // }
        return this.players[this.game.activePlayerIndex];
    }

    get timeLeftForTurn(): Observable<number | undefined> {
        return this.timer.timeLeft$;
    }

    get numberOfLettersRemaining(): number {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        // return this.game.letterBag.lettersLeft;
        return this.game.getNumberOfLettersRemaining();
    }

    get isEndOfGame(): boolean {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        // if (this.game) {
        //     return this.game.isEndOfGame();
        // }
        return this.game.isEndOfGame();
    }

    get isOnlineGame(): boolean {
        return this.game instanceof OnlineGame;
    }

    get winner(): Player[] {
        // if (!this.game) {
        //     return (this.onlineGame as OnlineGame).getWinner();
        // }
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return this.game.getWinner();
    }

    get gameId(): string {
        // if (this.onlineGame) {
        //     return this.onlineGame.gameToken;
        // } else {
        //     return '';
        // }

        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        if (this.game instanceof OnlineGame) {
            return (this.game as OnlineGame).gameToken;
        }
        return '';
    }
}
