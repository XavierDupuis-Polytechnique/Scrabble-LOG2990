import { Injectable } from '@angular/core';
import { EMPTY_CHAR, NOT_FOUND } from '@app/game-logic/constants';
import { Game } from '@app/game-logic/game/games/game';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { SpecialGame } from '@app/game-logic/game/games/special-games/special-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { Observable, Subject, Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameInfoService {
    players: Player[];
    user: User;
    private game: Game | undefined;
    private endTurn$$: Subscription;
    private endTurnSubject = new Subject<void>();
    get endTurn$(): Observable<void> {
        return this.endTurnSubject;
    }

    get endOfGame() {
        return this.game?.isEndOfGame$;
    }

    private isEndOfGame$$: Subscription;
    private isEndOfGameSubject = new Subject<void>();
    get isEndOfGame$() {
        return this.isEndOfGameSubject;
    }

    constructor(private timer: TimerService) {}

    receiveGame(game: Game): void {
        this.endTurn$$?.unsubscribe();
        this.isEndOfGame$$?.unsubscribe();
        this.players = game.players;
        this.game = game;

        this.endTurn$$ = this.game.endTurn$.subscribe(() => {
            this.endTurnSubject.next();
        });

        this.isEndOfGame$$ = this.game.isEndOfGame$.subscribe(() => {
            this.isEndOfGameSubject.next();
        });
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

    getPrivateObjectives(playerName: string): Objective[] {
        if (!this.game || !this.user) {
            return [];
        }
        const specialGame = this.game as SpecialGame;
        const privateObjectives = specialGame.privateObjectives.get(playerName);
        return privateObjectives ? privateObjectives : [];
    }

    get opponent(): Player {
        if (!this.players) {
            throw new Error('No Players in GameInfo');
        }
        const opponent = this.user === this.players[0] ? this.players[1] : this.players[0];
        return opponent;
    }

    get letterOccurences(): Map<string, number> {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return this.game instanceof OfflineGame ? (this.game as OfflineGame).letterBag.countLetters() : new Map<string, number>();
    }

    get numberOfPlayers(): number {
        return this.players ? this.players.length : NOT_FOUND;
    }

    get activePlayer(): Player {
        if (!this.players || !this.game) {
            throw Error('No Players in GameInfo');
        }
        return this.players[this.game.activePlayerIndex];
    }

    get timeLeftForTurn(): Observable<number | undefined> {
        return this.timer.timeLeft$;
    }

    get timeLeftPercentForTurn(): Observable<number | undefined> {
        return this.timer.timeLeftPercentage$;
    }

    get numberOfLettersRemaining(): number {
        return this.game ? this.game.getNumberOfLettersRemaining() : NOT_FOUND;
    }

    get isEndOfGame(): boolean {
        return this.game ? this.game.isEndOfGame() : false;
    }

    get isOnlineGame(): boolean {
        return this.game instanceof OnlineGame;
    }

    get winner(): Player[] {
        return this.game ? this.game.getWinner() : [];
    }

    get gameId(): string {
        if (!this.game || !(this.game instanceof OnlineGame)) {
            return EMPTY_CHAR;
        }
        return (this.game as OnlineGame).gameToken;
    }

    get isSpecialGame(): boolean {
        return this.game ? this.game instanceof SpecialOfflineGame || this.game instanceof SpecialOnlineGame : false;
    }

    get publicObjectives(): Objective[] {
        return this.game ? (this.game as SpecialGame).publicObjectives : [];
    }
}
