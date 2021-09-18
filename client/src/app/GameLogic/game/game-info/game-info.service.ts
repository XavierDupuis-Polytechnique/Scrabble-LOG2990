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
        return this.players[index];
    }

    getPlayerScore(index: number): number {
        return this.players[index].points;
    }

    get numberOfPlayers(): number {
        return this.players.length;
    }

    get activePlayer(): Player {
        return this.players[this.game.activePlayerIndex];
    }

    get timeLeftForTurn(): Observable<number> {
        return this.timer.timeLeft$;
    }

    get numberOfLettersRemaining(): number {
        return this.game.letterBag.lettersLeft;
    }
}
