import { Injectable } from '@angular/core';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
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
    private game: Game;
    constructor(
        private botService: BotCreatorService,
        private timer: TimerService,
        private pointCalculator: PointCalculatorService,
        private info: GameInfoService,
        private messageService: MessagesService,
        private boardService: BoardService,
    ) {}

    createGame(gameSettings: GameSettings): void {
        if (this.game) {
            this.stopGame();
        }
        this.game = new Game(gameSettings.timePerTurn, this.timer, this.pointCalculator, this.boardService, this.messageService);
        const playerName = gameSettings.playerName;
        const botDifficulty = gameSettings.botDifficulty;
        const players = this.createPlayers(playerName, botDifficulty);
        this.allocatePlayers(players);
        this.info.receiveGame(this.game);
    }

    startGame(): void {
        if (!this.game) {
            throw Error('No game created yet');
        }
        // console.log('GAME STARTED');
        this.game.start();
    }

    stopGame(): void {
        this.timer.stop();
        this.game = {} as Game;
        this.messageService.clearLog();
    }
    // Change botDifficulty
    private createPlayers(playerName: string, botDifficulty: string): Player[] {
        // TODO CREATE PLAYER
        const user = new User(playerName);
        const bot = this.botService.createBot(playerName, botDifficulty);
        this.info.receiveUser(user);
        return [user, bot];
    }

    private allocatePlayers(players: Player[]) {
        this.game.players = players;
    }
}
