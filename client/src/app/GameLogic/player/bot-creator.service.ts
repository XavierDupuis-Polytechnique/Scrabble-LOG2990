import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';
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
        private wordSearcher: WordSearcher, // private game: Game,
    ) {}
    createBot(playerName: string, botDifficulty: string, game: Game): Bot {
        // this.game = game;
        if (botDifficulty === 'hard') {
            // return new HardBot(playerName, this.boardService, this.dictionaryService, this.game);
            return new HardBot(playerName, this.boardService, this.dictionaryService, this.pointCalculatorService, this.wordSearcher);
        } else {
            // return new EasyBot(playerName, this.boardService, this.dictionaryService, this.game);
            return new EasyBot(playerName, this.boardService, this.dictionaryService, this.pointCalculatorService, this.wordSearcher);
        }
    }
}
