import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { OnlineGame } from '@app/GameLogic/game/games/online-game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameInfoService {
    players: Player[];
    user: User;
    private game: Game;
    private onlineGame: OnlineGame;

    private endTurnSubject = new Subject<void>();
    get endTurn$(): Observable<void> {
        return this.endTurnSubject;
    }

    constructor(private timer: TimerService) {}

    receiveGame(game: Game): void {
        this.players = game.players;
        this.game = game;
        this.game.endTurn$.subscribe(() => {
            this.endTurnSubject.next();
        });
    }

    receiveOnlineGame(onlineGame: OnlineGame): void {
        this.players = onlineGame.players;
        this.onlineGame = onlineGame;
    }

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
        if (!this.game && !this.onlineGame) {
            throw Error('No Game in GameInfo');
        }
        if (!this.game) {
            return new Map<string, number>(); // TODO Find a way to get letterBag from the server //this.onlineGame.lettersRemaining;
        }
        return this.game.letterBag.countLetters();
    }

    get numberOfPlayers(): number {
        if (!this.players) {
            throw Error('No Players in GameInfo');
        }
        return this.players.length;
    }

    get activePlayer(): Player {
        if (!this.players) {
            throw Error('No Players in GameInfo');
        }
        if (!this.game) {
            return this.players[this.onlineGame.activePlayerIndex];
        }
        return this.players[this.game.activePlayerIndex];
    }

    get timeLeftForTurn(): Observable<number | undefined> {
        return this.timer.timeLeft$;
    }

    get numberOfLettersRemaining(): number {
        if (!this.game && !this.onlineGame) {
            throw Error('No Game in GameInfo');
        }
        if (!this.game) {
            return this.onlineGame.lettersRemaining;
        }
        return this.game.letterBag.lettersLeft;
    }

    get isEndOfGame(): boolean {
        if (!this.game) {
            return this.onlineGame.isEndOfGame;
        }
        return this.game.isEndOfGame();
    }

    get isOnlineGame(): boolean {
        if (!this.game) {
            return true;
        } else {
            return false;
        }
    }

    get winner(): Player[] {
        if (!this.game) {
            return this.onlineGame.getWinner();
        }
        return this.game.getWinner();
    }

    get gameId(): string {
        return this.onlineGame.gameToken;
    }
}
