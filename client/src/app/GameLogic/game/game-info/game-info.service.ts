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
        if (this.players) {
            return this.players[index];
        } else {
            throw new Error('No Players in GameInfo');
        }
    }

    getPlayerScore(index: number): number {
        if (this.players) {
            return this.players[index].points;
        } else {
            throw new Error('No Players in GameInfo');
        }
    }

    get numberOfPlayers(): number {
        if (this.players) {
            return this.players.length;
        } else {
            throw new Error('No Players in GameInfo');
        }
    }

    get activePlayer(): Player {
        if (this.players) {
            return this.players[this.game.activePlayerIndex];
        } else {
            throw new Error('No Players in GameInfo');
        }
    }

    get timeLeftForTurn(): Observable<number | undefined> {
        return this.timer.timeLeft$;
    }

    get numberOfLettersRemaining(): number {
        if (this.game) {
            return this.game.letterBag.lettersLeft;
        } else {
            throw new Error('No Game in GameInfo');
        }
    }

    get isEndOfGame(): boolean {
        return this.game.isEndOfGame();
    }

    get winner(): Player[] {
        return this.game.getWinner();
    }
}
