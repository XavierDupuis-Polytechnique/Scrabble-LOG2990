import { Action } from '@app/GameLogic/actions/action';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { CommandExecuterService } from '@app/GameLogic/commands/command-executer/command-executer.service';
import { MIDDLE_OF_BOARD, TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Vec2 } from '@app/GameLogic/interfaces/vec2';
import { BotMessagesService } from '@app/GameLogic/player/bot-message/bot-messages.service';
import { BotCrawler } from '@app/GameLogic/player/bot/bot-crawler';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BehaviorSubject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { HORIZONTAL, ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];
    letterCreator = new LetterCreator();
    validWordList: ValidWord[];
    botCrawler: BotCrawler;
    timesUp: boolean;
    private chosenAction$ = new BehaviorSubject<Action | undefined>(undefined);

    constructor(
        name: string,
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        protected pointCalculatorService: PointCalculatorService,
        protected wordValidator: WordSearcher,
        protected botMessage: BotMessagesService,
        protected gameInfo: GameInfoService,
        protected commandExecuter: CommandExecuterService,
    ) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
        this.validWordList = [];
        this.botCrawler = new BotCrawler(this, this.dictionaryService, this.pointCalculatorService, this.wordValidator);
    }

    chooseAction(action: Action) {
        this.chosenAction$.next(action);
        this.chosenAction$.complete();
    }

    startTimerAction() {
        const timerPass = timer(TIME_BEFORE_PASS);
        timerPass.pipe(takeUntil(this.action$)).subscribe(() => {
            this.timesUp = true;
            this.botMessage.sendAction(new PassTurn(this));
        });
        timer(TIME_BEFORE_PICKING_ACTION).subscribe(() => {
            const action = this.chosenAction$.value;
            if (action !== undefined) {
                this.botMessage.sendAction(action);
            } else {
                this.chosenAction$.pipe(takeUntil(timerPass)).subscribe((chosenAction) => {
                    if (chosenAction !== undefined) {
                        this.botMessage.sendAction(chosenAction);
                    }
                });
            }
        });
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
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
        } else {
            this.botCrawler.boardCrawler(startingPosition, grid, startingDirection);
        }
        return this.validWordList;
    }
}
