import { Action } from '@app/game-logic/actions/action';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { MIDDLE_OF_BOARD, TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Vec2 } from '@app/game-logic/interfaces/vec2';
import { BotCalculatorService } from '@app/game-logic/player/bot-calculator/bot-calculator.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { BotCrawler } from '@app/game-logic/player/bot/bot-crawler';
import { Player } from '@app/game-logic/player/player';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotInfo, BotType } from '@app/services/bot-http.service';
import { BehaviorSubject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HORIZONTAL, ValidWord } from './valid-word';

export abstract class Bot extends Player {
    botNames: string[] = [];
    letterCreator = new LetterCreator();
    validWordList: ValidWord[];
    botCrawler: BotCrawler;
    timesUp: boolean;
    private chosenAction$ = new BehaviorSubject<Action | undefined>(undefined);

    constructor(
        name: string,
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        protected botCalculatorService: BotCalculatorService,
        protected wordValidator: WordSearcher,
        protected botMessage: BotMessagesService,
        protected gameInfo: GameInfoService,
        protected commandExecuter: CommandExecuterService,
        protected actionCreator: ActionCreatorService,
        protected botHttpService: BotHttpService,
        protected botType: BotType,
    ) {
        super('PlaceholderName');
        this.botHttpService.getDataInfo().subscribe((answer) => {
            const list = answer as BotInfo[];
            list.forEach((bot) => {
                if (bot.type === botType) {
                    this.botNames.push(bot.name);
                }
            });
            this.name = this.generateBotName(name);
        });

        this.validWordList = [];
        this.botCrawler = new BotCrawler(this, this.dictionaryService, this.botCalculatorService, this.wordValidator);
    }

    chooseAction(action: Action) {
        this.chosenAction$.next(action);
        this.chosenAction$.complete();
    }

    startTimerAction() {
        const timerPass = timer(TIME_BEFORE_PASS);
        timerPass.pipe(takeUntil(this.action$)).subscribe(() => {
            this.timesUp = true;
            this.botMessage.sendAction(this.actionCreator.createPassTurn(this));
        });
        timer(TIME_BEFORE_PICKING_ACTION).subscribe(() => {
            const action = this.chosenAction$.value;
            if (action) {
                this.botMessage.sendAction(action);
                return;
            }
            this.chosenAction$.pipe(takeUntil(timerPass)).subscribe((chosenAction) => {
                if (chosenAction !== undefined) {
                    this.botMessage.sendAction(chosenAction);
                }
            });
        });
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    bruteForceStart(): ValidWord[] {
        const grid = this.boardService.board.grid;
        const startingX = 0;
        const startingY = 0;
        const startingPosition: Vec2 = { x: startingX, y: startingY };
        const startingDirection = HORIZONTAL;
        this.validWordList = [];
        const letterInMiddleBox = grid[MIDDLE_OF_BOARD][MIDDLE_OF_BOARD].letterObject.char;

        if (letterInMiddleBox === ' ') {
            this.botCrawler.botFirstTurn();
            return this.validWordList;
        }
        this.botCrawler.boardCrawler(startingPosition, grid, startingDirection);
        return this.validWordList;
    }

    private generateBotName(opponentName: string): string {
        const generatedName = this.botNames[this.getRandomInt(this.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }
}
