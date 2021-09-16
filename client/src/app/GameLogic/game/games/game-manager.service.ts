import { Injectable } from '@angular/core';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Game } from './game';
import { GameSettings } from './game-settings.interface';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    game: Game;
    BotCreatorService: BotCreatorService;
    constructor(
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        private boardService: BoardService,
        private botCreatorService: BotCreatorService,
        private dictionaryService: DictionaryService,
    ) {}

    createGame(gameSettings: GameSettings): void {
        this.game = new Game(gameSettings.timePerTurn, this.timer, this.pointCalculator, this.boardService);
        // create players
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(players);
    }

    startGame(): void {
        if (!this.game) {
            throw Error('No game created yet');
        }
        // console.log('GAME STARTED');
        this.game.start();
    }

    // Change botDifficulty
    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        // TODO CREATE PLAYER
        const player = new User(playerName);
        const bot = this.botCreatorService.createBot(playerName, botDifficulty, this.boardService, this.dictionaryService);
        return [player, bot];
    }

    private allocatePlayers(players: Player[]) {
        this.game.players = players;
    }
}
