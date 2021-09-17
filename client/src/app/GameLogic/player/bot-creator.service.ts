import { Injectable } from '@angular/core';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';
import { EasyBot } from './easy-bot';
import { HardBot } from './hard-bot';

@Injectable({
    providedIn: 'root',
})
// TODO: Change name to botCreator
export class BotCreatorService {
    constructor(private boardService: BoardService, private dictionaryService: DictionaryService) {}
    createBot(playerName: string, botDifficulty: string): Bot {
        if (botDifficulty === 'hard') {
            return new HardBot(playerName, this.boardService, this.dictionaryService);
        } else {
            return new EasyBot(playerName, this.boardService, this.dictionaryService);
        }
    }
}
