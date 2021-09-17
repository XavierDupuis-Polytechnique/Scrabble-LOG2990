import { Injectable } from '@angular/core';
import { PlayerService } from '@app/GameLogic/game/game-info/player.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';

@Injectable({
    providedIn: 'root',
})
export class GameInfoService {
    private game: Game;
    constructor(private playerService: PlayerService, private timerService: TimerService, game: Game) {
        this.game = game;
    }

    getActivePlayer(): Player {
        return this.game.players[this.game.activePlayerIndex];
    }

    getPlayerName(index: number): string {
        return this.playerService.players[index].name;
    }

    getPlayerScore(index: number): number {
        return this.playerService.players[index].points;
    }

    getTurnRemainingTime() {
        return this.timerService.timeLeft$;
    }
}
