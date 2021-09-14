import { Injectable } from '@angular/core';
import { Bot } from '@app/GameLogic/player/bot';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { LetterBag } from '../letter-bag';
import { TimerService } from '../timer/timer.service';
import { Game } from './game';
import { GameSettings } from './game-settings.interface';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    game: Game;
    constructor(private timer: TimerService, private pointCalculator: PointCalculatorService) {}

    createGame(gameSettings: GameSettings): void {
        this.game = new Game(gameSettings.timePerTurn, this.timer, this.pointCalculator);
        // create players
        this.game.letterBag = new LetterBag();
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(this.game, players);
    }

    startGame(): void {
        if (!this.game) {
            throw Error('No game created yet');
        }
        this.game.start();
    }

    // Change botDifficulty
    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        // TODO CREATE PLAYER
        const player = new Player(playerName);
        const bot = new Bot('ajskdfjks');
        return [player, bot];
    }

    private allocatePlayers(game: Game, players: Player[]) {
        game.players = players;
    }
}
