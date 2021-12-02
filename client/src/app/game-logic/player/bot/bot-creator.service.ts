import { Injectable } from '@angular/core';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { BotCalculatorService } from '@app/game-logic/player/bot-calculator/bot-calculator.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { Bot } from '@app/game-logic/player/bot/bot';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotType } from '@app/services/bot-http.service';
import { EasyBot } from './easy-bot';
import { HardBot } from './hard-bot';

@Injectable({
    providedIn: 'root',
})
export class BotCreatorService {
    constructor(
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        private botCalculatorService: BotCalculatorService,
        private wordSearcher: WordSearcher,
        private botMessage: BotMessagesService,
        private gameInfo: GameInfoService,
        private commandExecuter: CommandExecuterService,
        private actionFactory: ActionCreatorService,
        private botHttpService: BotHttpService,
    ) {}

    createBot(playerName: string, botDifficulty: string): Bot {
        if (botDifficulty === 'hard') {
            return new HardBot(
                playerName,
                this.boardService,
                this.dictionaryService,
                this.botCalculatorService,
                this.wordSearcher,
                this.botMessage,
                this.gameInfo,
                this.commandExecuter,
                this.actionFactory,
                this.botHttpService,
                BotType.Expert,
            );
        } else {
            return new EasyBot(
                playerName,
                this.boardService,
                this.dictionaryService,
                this.botCalculatorService,
                this.wordSearcher,
                this.botMessage,
                this.gameInfo,
                this.commandExecuter,
                this.actionFactory,
                this.botHttpService,
                BotType.Easy,
            );
        }
    }
}
