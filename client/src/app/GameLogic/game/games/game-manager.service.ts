import { Injectable } from '@angular/core';
import { Bot } from '@app/GameLogic/player/bot';
import { Player } from '@app/GameLogic/player/player';
import { BoardService } from '@app/services/board.service';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { Game } from './game';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    game: Game;
    constructor(private timer: TimerService) {}

    createGame(gameSettings: any): void {
        this.game = new Game(gameSettings.timePerTurn, this.timer, new BoardService());
        // create players
        this.game.letterBag = new LetterBag();
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(this.game, players);
    }

    startGame(): void {
        if (!this.game) {
            throw Error("No game created yet");
        }
        this.game.start();
    }

    // Change botDifficulty
    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        // TODO CREATE PLAYER
        const player = new Player(playerName);
        const bot = new Bot("ajskdfjks");
        return [player, bot];
    }

    private allocatePlayers(game: Game, players: Player[]) {
        game.players = players;
    }
}
