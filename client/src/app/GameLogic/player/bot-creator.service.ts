import { Injectable } from '@angular/core';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Bot } from '@app/GameLogic/player/bot';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
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
        private commandeExecuter: CommandExecuterService,
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
                this.commandeExecuter,
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
                this.commandeExecuter,
            );
        }
    }
}
