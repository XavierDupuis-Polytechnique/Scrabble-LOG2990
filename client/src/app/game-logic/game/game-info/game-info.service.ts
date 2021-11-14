import { Injectable } from '@angular/core';
import { Game } from '@app/game-logic/game/games/game';
import { OnlineGame } from '@app/game-logic/game/games/online-game/online-game';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { SpecialGame } from '@app/game-logic/game/games/special-games/special-game';
import { SpecialOfflineGame } from '@app/game-logic/game/games/special-games/special-offline-game';
import { SpecialOnlineGame } from '@app/game-logic/game/games/special-games/special-online-game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
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
        this.game.endTurn$.subscribe(() => {
            this.endTurnSubject.next();
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

    get letterOccurences(): Map<string, number> {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }

        if (this.game instanceof OfflineGame) {
            return (this.game as OfflineGame).letterBag.countLetters();
        }
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
        return this.players[this.game.activePlayerIndex];
    }

    get timeLeftForTurn(): Observable<number | undefined> {
        return this.timer.timeLeft$;
    }

    get numberOfLettersRemaining(): number {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return this.game.getNumberOfLettersRemaining();
    }

    get isEndOfGame(): boolean {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return this.game.isEndOfGame();
    }

    get isOnlineGame(): boolean {
        return this.game instanceof OnlineGame;
    }

    get winner(): Player[] {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return this.game.getWinner();
    }

    get gameId(): string {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }

        if (this.game instanceof OnlineGame) {
            return (this.game as OnlineGame).gameToken;
        }
        return '';
    }

    get isSpecialGame(): boolean {
        if (!this.game) {
            return false;
        }
        return this.game instanceof SpecialOfflineGame || this.game instanceof SpecialOnlineGame;
    }

    get privateObjectives(): Objective[] {
        if (!this.game || !this.user) {
            throw Error('No Game or User in GameInfo');
        }
        const specialGame = this.game as SpecialGame;
        const privateObjectives = specialGame.privateObjectives.get(this.user.name);
        if (!privateObjectives) {
            return [];
        }
        return privateObjectives;
    }

    get publicObjectives(): Objective[] {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return (this.game as SpecialGame).publicObjectives;
    }
}
