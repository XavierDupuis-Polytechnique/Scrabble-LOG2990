import { Injectable } from '@angular/core';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { Bot } from '@app/game-logic/player/bot/bot';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { EasyBot } from './easy-bot';
import { HardBot } from './hard-bot';

@Injectable({
    providedIn: 'root',
})
export class BotCreatorService {
    constructor(
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        private pointCalculatorService: PointCalculatorService,
        private wordSearcher: WordSearcher,
        private botMessage: BotMessagesService,
        private gameInfo: GameInfoService,
        private commandExecuter: CommandExecuterService,
    ) {}
    createBot(playerName: string, botDifficulty: string): Bot {
        if (botDifficulty === 'hard') {
            return new HardBot(
                playerName,
                this.boardService,
                this.dictionaryService,
                this.pointCalculatorService,
                this.wordSearcher,
                this.botMessage,
                this.gameInfo,
                this.commandExecuter,
            );
        } else {
            return new EasyBot(
                playerName,
                this.boardService,
                this.dictionaryService,
                this.pointCalculatorService,
                this.wordSearcher,
                this.botMessage,
                this.gameInfo,
                this.commandExecuter,
            );
        }
    }
}
