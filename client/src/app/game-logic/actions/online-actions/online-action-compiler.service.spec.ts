import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { ActionValidatorService } from '@app/game-logic/actions/action-validator/action-validator.service';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { OnlineActionCompilerService } from '@app/game-logic/actions/online-actions/online-action-compiler.service';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { OnlineAction, OnlineActionType } from '@app/socket-handler/interfaces/online-action.interface';

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
    let game: OfflineGame;
    let p1: User;
    let p2: User;
    let timer: TimerService;
    let board: BoardService;
    let info: GameInfoService;
    let messagesSpy: MessagesService;
    let wordSearcher: WordSearcher;
    let letters: Letter[];
    let pointCalculator: PointCalculatorService;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
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
        game = new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, board, messagesSpy);
        p1 = new User('p1');
        p2 = new User('p2');
        game.players.push(p1);
        game.players.push(p2);
        info.receiveGame(game);
        game.start();
        placement = { x: 1, y: 1, direction: Direction.Horizontal };
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
            letterRack: p1.letterRack,
        };
        expect(service.compileActionOnline(placeLetter) as OnlineAction).toEqual(onlinePlaceLetterTest);
    });

    it('should only call compileExchangeLetter', () => {
        const exchangeLetter = new ExchangeLetter(p1, letters);

        const onlineExchangeLetterTest: OnlineAction = {
            type: OnlineActionType.Exchange,
            letters: 'abc',
            letterRack: p1.letterRack,
        };
        expect(service.compileActionOnline(exchangeLetter) as OnlineAction).toEqual(onlineExchangeLetterTest);
    });

    it('should only call compilePassTurn', () => {
        const passTurn = new PassTurn(p1);
        const passTurnTest: OnlineAction = {
            type: OnlineActionType.Pass,
            letterRack: p1.letterRack,
        };
        expect(service.compileActionOnline(passTurn) as OnlineAction).toEqual(passTurnTest);
    });

    it('should only call compilePassTurn', () => {
        const unknownActionTest = new UnknownAction(p1);

        expect(service.compileActionOnline(unknownActionTest)).toEqual(undefined);
    });
});
