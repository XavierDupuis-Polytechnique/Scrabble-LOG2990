import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class GameInfoService {
    players: Player[];
    user: User;
    private game: Game;

    constructor(private timer: TimerService) {}

    receiveGame(game: Game): void {
        this.players = game.players;
        this.game = game;
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
        return this.players[this.game.activePlayerIndex];
    }

    get timeLeftForTurn(): Observable<number | undefined> {
        return this.timer.timeLeft$;
    }

    get numberOfLettersRemaining(): number {
        if (!this.game) {
            throw Error('No Game in GameInfo');
        }
        return this.game.letterBag.lettersLeft;
    }

    get isEndOfGame(): boolean {
        return this.game.isEndOfGame();
    }

    get winner(): Player[] {
        return this.game.getWinner();
    }
}
