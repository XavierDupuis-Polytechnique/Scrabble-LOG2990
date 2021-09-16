import { Injectable } from '@angular/core';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Bot } from './bot';
import { EasyBot } from './easy-bot';
import { HardBot } from './hard-bot';

@Injectable({
    providedIn: 'root',
})
export class BotService {
    createBot(playerName: string, botDifficulty: string, boardService: BoardService, dictionaryService: DictionaryService): Bot {
        if (botDifficulty === 'hard') {
            return new HardBot(playerName, boardService, dictionaryService);
        } else {
            return new EasyBot(playerName, boardService, dictionaryService);
        }
    }
}
