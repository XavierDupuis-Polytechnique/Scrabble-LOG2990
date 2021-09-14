import { Injectable } from '@angular/core';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { BotService } from '@app/GameLogic/player/bot.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { BoardService } from '@app/services/board.service';
import { Game } from './game';
import { GameSettings } from './game-settings.interface';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    game: Game;
    botService: BotService;
    constructor(private timer: TimerService, private pointCalculator: PointCalculatorService) {}

    createGame(gameSettings: GameSettings): void {
        this.game = new Game(gameSettings.timePerTurn, this.timer, this.pointCalculator, new BoardService());
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
        console.log('GAME STARTED');
        this.game.start();
    }

    // Change botDifficulty
    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        // TODO CREATE PLAYER
        const player = new User(playerName);
        this.botService = new BotService();
        const bot = this.botService.createBot(playerName, botDifficulty);
        return [player, bot];
    }

    private allocatePlayers(game: Game, players: Player[]) {
        game.players = players;
    }
}
