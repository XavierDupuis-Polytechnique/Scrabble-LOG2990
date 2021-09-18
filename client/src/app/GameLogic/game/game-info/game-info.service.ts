import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Player } from '@app/GameLogic/player/player';

@Injectable({
    providedIn: 'root',
})
export class GameInfoService {
    numberOfPlayers: number;
    players: Player[];
    private game: Game;
    private timer: TimerService;

    receiveReferences(timer: TimerService, game: Game) {
        this.timer = timer;
        this.game = game;
        this.players = game.players;
        this.numberOfPlayers = this.players.length;
    }

    getActivePlayer(): Player {
        return this.players[this.game.activePlayerIndex];
    }

    getPlayer(index: number): Player {
        return this.players[index];
    }

    getPlayerScore(index: number): number {
        return this.players[index].points;
    }

    getTurnRemainingTime() {
        return this.timer.timeLeft$;
    }

    getNumberOfLettersRemaining() {
        return this.game.letterBag.gameLetters.length;
    }
}
