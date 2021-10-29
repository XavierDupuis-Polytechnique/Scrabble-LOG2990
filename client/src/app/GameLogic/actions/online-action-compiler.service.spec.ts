import { TestBed } from '@angular/core/testing';
import { DEFAULT_TIME_PER_TURN } from '../constants';
import { BoardService } from '../game/board/board.service';
import { Letter } from '../game/board/letter.interface';
import { GameInfoService } from '../game/game-info/game-info.service';
import { Game } from '../game/games/game';
import { TimerService } from '../game/timer/timer.service';
import { PlacementSetting } from '../interface/placement-setting.interface';
import { MessagesService } from '../messages/messages.service';
import { Player } from '../player/player';
import { User } from '../player/user';
import { PointCalculatorService } from '../point-calculator/point-calculator.service';
import { DictionaryService } from '../validator/dictionary.service';
import { WordSearcher } from '../validator/word-search/word-searcher.service';
import { Action } from './action';
import { ActionValidatorService } from './action-validator.service';
import { ExchangeLetter } from './exchange-letter';
import { OnlineAction, OnlineActionType } from './online-action-compiler.interface';
import { OnlineActionCompilerService } from './online-action-compiler.service';
import { PassTurn } from './pass-turn';
import { PlaceLetter } from './place-letter';

class UnknownAction extends Action {
    id: number;
    constructor(readonly player: Player) {
        super(player);
    }
    execute(): void {
        throw new Error('Method not implemented.');
    }
    protected perform(): void {
        throw new Error('Method not implemented.');
    }
}
describe('Service: OnlineActionCompiler', () => {
    let service: OnlineActionCompilerService;
    let placement: PlacementSetting;
    let actionValidatorSpy: ActionValidatorService;
    let game: Game;
    let p1: User;
    let p2: User;
    let timer: TimerService;
    let board: BoardService;
    let info: GameInfoService;
    let messagesSpy: MessagesService;
    let wordSearcher: WordSearcher;
    let letters: Letter[];
    let pointCalculator: PointCalculatorService;
    const dict = new DictionaryService();
    const randomBonus = false;

    beforeEach(() => {
        actionValidatorSpy = jasmine.createSpyObj(ActionValidatorService, [
            'validateAction',
            'validateExchangeLetter',
            'validatePlaceLetter',
            'validatePassTurn',
        ]);

        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: MessagesService, useValue: messagesSpy },
                { provide: ActionValidatorService, useValue: actionValidatorSpy },
            ],
        });
        service = TestBed.inject(OnlineActionCompilerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);
        info = TestBed.inject(GameInfoService);
        pointCalculator = TestBed.inject(PointCalculatorService);

        game = new Game(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, board, messagesSpy);
        p1 = new User('p1');
        p2 = new User('p2');
        game.players.push(p1);
        game.players.push(p2);
        info.receiveGame(game);
        game.start();
        placement = { x: 1, y: 1, direction: 'h' };
        letters = [
            { char: 'a', value: 1 },
            { char: 'b', value: 1 },
            { char: 'c', value: 1 },
        ];
    });

    it('should create OnlineActionCompiler', () => {
        expect(service).toBeTruthy();
    });

    it('should only call compilePlaceLetter', () => {
        const placeLetter = new PlaceLetter(p1, 'abc', placement, pointCalculator, wordSearcher);
        const onlinePlaceLetterTest: OnlineAction = {
            type: OnlineActionType.Place,
            placementSettings: placeLetter.placement,
            letters: placeLetter.word,
        };
        expect(service.compileActionOnline(placeLetter)).toEqual(onlinePlaceLetterTest);
    });

    it('should only call compileExchangeLetter', () => {
        const exchangeLetter = new ExchangeLetter(p1, letters);

        const onlineExchangeLetterTest: OnlineAction = {
            type: OnlineActionType.Exchange,
            letters: 'abc',
        };
        expect(service.compileActionOnline(exchangeLetter)).toEqual(onlineExchangeLetterTest);
    });

    it('should only call compilePassTurn', () => {
        const passTurn = new PassTurn(p1);
        const passTurnTest: OnlineAction = {
            type: OnlineActionType.Pass,
        };
        expect(service.compileActionOnline(passTurn)).toEqual(passTurnTest);
    });

    it('should only call compilePassTurn', () => {
        const unknownActionTest = new UnknownAction(p1);

        expect(service.compileActionOnline(unknownActionTest)).toEqual(undefined);
    });
});
