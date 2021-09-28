import { Injectable } from '@angular/core';
import { Bot } from '@app/GameLogic/player/bot';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';
import { EasyBot } from './easy-bot';
import { HardBot } from './hard-bot';

@Injectable({
    providedIn: 'root',
})
// TODO: Change name to botCreator
export class BotCreatorService {
    constructor(
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        private pointCalculatorService: PointCalculatorService,
        private wordSearcher: WordSearcher,
        private botMessage: BotMessagesService,
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
            );
        } else {
            return new EasyBot(
                playerName,
                this.boardService,
                this.dictionaryService,
                this.pointCalculatorService,
                this.wordSearcher,
                this.botMessage,
            );
        }
    }
}
