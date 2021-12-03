/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable max-lines */
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ActionValidatorService } from '@app/game-logic/actions/action-validator/action-validator.service';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { UIExchange } from '@app/game-logic/actions/ui-actions/ui-exchange';
import { UIMove } from '@app/game-logic/actions/ui-actions/ui-move';
import { UIPlace } from '@app/game-logic/actions/ui-actions/ui-place';
import { BOARD_MAX_POSITION, EMPTY_CHAR, ENTER, ESCAPE, MIDDLE_OF_BOARD, RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { InputComponent, InputType, UIInput, WheelRoll } from '@app/game-logic/interfaces/ui-input';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { getRandomInt } from '@app/game-logic/utils';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { Observable, Subject } from 'rxjs';
import { UIInputControllerService } from './ui-input-controller.service';

class MockGameInfoService {
    players: Player[];
    activePlayerIndex: number = 0;
    user: Player;
    endOfTurnMockSubject = new Subject<void>();
    get endTurn$(): Observable<void> {
        return this.endOfTurnMockSubject;
    }
    get activePlayer() {
        return this.user;
    }
}

describe('UIInputControllerService', () => {
    let player: Player;
    let service: UIInputControllerService;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    let info: GameInfoService;
    let pointCalculator: PointCalculatorService;
    let wordSearcher: WordSearcher;
    let boardService: BoardService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: GameInfoService, useClass: MockGameInfoService },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        });
        pointCalculator = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);
        boardService = TestBed.inject(BoardService);
        player = new User('p1');
        player.letterRack = [
            { char: EMPTY_CHAR, value: 0 },
            { char: EMPTY_CHAR, value: 0 },
            { char: EMPTY_CHAR, value: 0 },
            { char: EMPTY_CHAR, value: 0 },
            { char: EMPTY_CHAR, value: 0 },
            { char: EMPTY_CHAR, value: 0 },
            { char: EMPTY_CHAR, value: 0 },
        ];
        info = TestBed.inject(GameInfoService);
        info.players = [player];
        info.user = player;
        service = TestBed.inject(UIInputControllerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should discard current UIPlace action on end of turn', () => {
        service.activeAction = new UIPlace(info, pointCalculator, wordSearcher, boardService);
        (info as any as MockGameInfoService).endOfTurnMockSubject.next();
        expect(service.activeAction).toBeNull();
    });

    it('should, if possible, return the canBeCreated boolean of an activeAction (true)', () => {
        service.activeAction = new UIMove(player);
        service.activeAction.concernedIndexes.add(0);
        expect(service.canBeExecuted).toBeTruthy();
    });

    it('should, if possible, return the canBeCreated boolean of an activeAction (false)', () => {
        service.activeAction = new UIMove(player);
        expect(service.canBeExecuted).toBeFalsy();
    });

    it('should, if possible, return the canBeCreated boolean of an activeAction (false because null)', () => {
        expect(service.canBeExecuted).toBeFalsy();
    });

    it('should call processInputComponent upon receiving an input', () => {
        const input: UIInput = { type: InputType.LeftClick };
        const processInputSpy = spyOn<any>(service, 'processInput').and.callFake(() => {
            return;
        });
        service.receive(input);
        expect(processInputSpy).toHaveBeenCalledWith(input);
    });

    it('should override Keypress/MouseRoll/LeftClick/RightClick when activeComponent is Chatbox', () => {
        service.activeComponent = InputComponent.Outside;
        service.activeAction = new UIMove(player);

        const args = 'a';
        const letterIndex = getRandomInt(RACK_LETTER_COUNT - 1);
        player.letterRack[letterIndex].char = args;
        const firstInput: UIInput = { type: InputType.KeyPress, args };
        service['processInput'](firstInput);
        expect(service.activeComponent).toBe(InputComponent.Horse);
        expect(service.activeAction instanceof UIMove).toBeTruthy();
        expect(service.activeAction.concernedIndexes.has(letterIndex)).toBeTruthy();

        const secondInput: UIInput = { from: InputComponent.Chatbox, type: InputType.LeftClick };
        service['processInput'](secondInput);
        expect(service.activeComponent).toBe(InputComponent.Chatbox);
        expect(service.activeAction).toBeNull();

        service['processInput'](firstInput);
        expect(service.activeComponent).toBe(InputComponent.Chatbox);
        expect(service.activeAction).toBeNull();
    });

    it('should not escape from ChatBox when the Escape key is pressed', () => {
        service.activeComponent = InputComponent.Chatbox;
        service.activeAction = null;

        const args = ESCAPE;
        const input: UIInput = { type: InputType.KeyPress, args };
        service['processInput'](input);
        expect(service.activeComponent).toBe(InputComponent.Chatbox);
        expect(service.activeAction).toBeNull();
    });

    it('should update activeComponent with the correct default component when "from" is not provided', () => {
        const input: UIInput = { type: InputType.LeftClick };
        service['processInputComponent'](input);
        expect(service.activeComponent).toBe(InputComponent.Chatbox);
    });

    it('should update activeComponent with the provided InputComponent.Board parameter', () => {
        const component = InputComponent.Board;
        const input: UIInput = { from: component, type: InputType.LeftClick };
        service['processInputComponent'](input);
        expect(service.activeComponent).toBe(component);
    });

    it('should update activeComponent with the provided InputComponent.Horse parameter', () => {
        const component = InputComponent.Horse;
        const input: UIInput = { from: component, type: InputType.LeftClick };
        service['processInputComponent'](input);
        expect(service.activeComponent).toBe(component);
    });

    it('should update activeComponent with the provided InputComponent.Outside parameter', () => {
        const component = InputComponent.Outside;
        const input: UIInput = { from: component, type: InputType.LeftClick };
        service['processInputComponent'](input);
        expect(service.activeComponent).toBe(component);
    });

    it('should create a new UIPlace action if the activeAction is null', () => {
        service.activeComponent = InputComponent.Board;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIPlace).toBeTruthy();
    });

    it('should create a new UIExchange action if the activeAction is null', () => {
        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.RightClick);
        expect(service.activeAction instanceof UIExchange).toBeTruthy();
    });

    it('should create a new UIMove action if the activeAction is null (with click)', () => {
        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIMove).toBeTruthy();
    });

    it('should create a new UIMove action if the activeAction is null (with keypress)', () => {
        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.KeyPress);
        expect(service.activeAction instanceof UIMove).toBeTruthy();
    });

    it('should set the activeAction null if the InputComponent was "Outside"', () => {
        service.activeAction = new UIExchange(player);
        service.activeComponent = InputComponent.Outside;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction).toBeNull();
    });

    it('should not create a new UIPlace action if the activeAction is already a UIPlace', () => {
        service.activeComponent = InputComponent.Board;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIPlace).toBeTruthy();

        service.activeComponent = InputComponent.Board;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIPlace).toBeTruthy();
    });

    it('should not create a new UIExchange action if the activeAction is already a UIExchange', () => {
        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.RightClick);
        expect(service.activeAction instanceof UIExchange).toBeTruthy();

        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.RightClick);
        expect(service.activeAction instanceof UIExchange).toBeTruthy();
    });

    it('should not create a new UIMove action if the activeAction is already a UIMove (double LeftClick)', () => {
        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIMove).toBeTruthy();

        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIMove).toBeTruthy();
    });

    it('should not create a new UIMove action if the activeAction is already a UIMove (LeftClick, then KeyPress)', () => {
        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIMove).toBeTruthy();

        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.KeyPress);
        expect(service.activeAction instanceof UIMove).toBeTruthy();
    });

    it('should remove letters temporarily placed on the board after UIPlace switches to UIMove', () => {
        service.activeComponent = InputComponent.Board;
        const board = TestBed.inject(BoardService).board;
        service.activeAction = new UIPlace(info, pointCalculator, wordSearcher, boardService);
        const char = 'A';
        player.letterRack[0].char = char;
        const pos = BOARD_MAX_POSITION / 2;
        board.grid[pos][pos].letterObject.char = char;
        (service.activeAction as UIPlace).orderedIndexes.push({ rackIndex: 0, x: pos, y: pos });

        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.LeftClick);
        expect(service.activeAction instanceof UIMove).toBeTruthy();
        expect(board.grid[pos][pos].letterObject.char).toBe(EMPTY_CHAR);
    });

    it('should remove letters temporarily placed on the board after UIPlace switches to UIExchange', () => {
        service.activeComponent = InputComponent.Board;
        const board = TestBed.inject(BoardService).board;
        service.activeAction = new UIPlace(info, pointCalculator, wordSearcher, boardService);
        const char = 'A';
        player.letterRack[0].char = char;
        const pos = BOARD_MAX_POSITION / 2;
        board.grid[pos][pos].letterObject.char = char;
        (service.activeAction as UIPlace).orderedIndexes.push({ rackIndex: 0, x: pos, y: pos });

        service.activeComponent = InputComponent.Horse;
        service['updateActiveAction'](InputType.RightClick);
        expect(service.activeAction instanceof UIExchange).toBeTruthy();
        expect(board.grid[pos][pos].letterObject.char).toBe(EMPTY_CHAR);
    });

    it('should refer a LeftClick to the processLeftClick method', () => {
        service.activeAction = new UIMove(player);
        service.activeComponent = InputComponent.Horse;
        const args = getRandomInt(RACK_LETTER_COUNT - 1);
        const input: UIInput = { from: InputComponent.Horse, type: InputType.LeftClick, args };
        const receiveLeftClickSpy = spyOn(service.activeAction, 'receiveLeftClick').and.callThrough();
        service['processInputType'](input);
        expect(receiveLeftClickSpy).toHaveBeenCalledWith(args);
        expect(service.activeAction.concernedIndexes.has(args)).toBeTruthy();
    });

    it('should refer a RightClick to the processRightClick method', () => {
        service.activeAction = new UIExchange(player);
        service.activeComponent = InputComponent.Horse;
        const args = getRandomInt(RACK_LETTER_COUNT - 1);
        const input: UIInput = { from: InputComponent.Horse, type: InputType.RightClick, args };
        const receiveRightClickSpy = spyOn(service.activeAction, 'receiveRightClick').and.callThrough();
        service['processInputType'](input);
        expect(receiveRightClickSpy).toHaveBeenCalledWith(args);
        expect(service.activeAction.concernedIndexes.has(args)).toBeTruthy();
    });

    it('should refer a Keypress to the processKeypress method', () => {
        service.activeAction = new UIMove(player);
        service.activeComponent = InputComponent.Horse;
        const args = 'a';
        const letterIndex = getRandomInt(RACK_LETTER_COUNT - 1);
        player.letterRack[letterIndex].char = args;
        const input: UIInput = { type: InputType.KeyPress, args };
        const receiveKeySpy = spyOn(service.activeAction, 'receiveKey').and.callThrough();
        service['processInputType'](input);
        expect(receiveKeySpy).toHaveBeenCalledWith(args);
        expect(service.activeAction.concernedIndexes.has(letterIndex)).toBeTruthy();
    });

    it('should discard the activeAction following the "ESCAPE" Keypress', () => {
        service.activeAction = new UIMove(player);
        service.activeComponent = InputComponent.Horse;
        const args = ESCAPE;
        const input: UIInput = { type: InputType.KeyPress, args };
        service['processInputType'](input);
        expect(service.activeAction).toBeNull();
        expect(service.activeComponent).toBe(InputComponent.Outside);
    });

    it('should create the Action following the "ENTER" Keypress', () => {
        service.activeAction = new UIPlace(info, pointCalculator, wordSearcher, boardService);
        service.activeComponent = InputComponent.Board;
        const input1: UIInput = { type: InputType.LeftClick, from: InputComponent.Board, args: { x: MIDDLE_OF_BOARD, y: MIDDLE_OF_BOARD } };
        service['processInput'](input1);
        player.letterRack[0].char = 'A';
        const input2: UIInput = { type: InputType.KeyPress, args: player.letterRack[0].char.toLowerCase() };
        service['processInput'](input2);
        const args = ENTER;
        const input3: UIInput = { type: InputType.KeyPress, args };
        const sendActionSpy = spyOn(TestBed.inject(ActionValidatorService), 'sendAction').and.callFake(() => {
            return false;
        });
        service['processInputType'](input3);
        expect(sendActionSpy).toHaveBeenCalled();
        expect(service.activeAction).toBeNull();
        expect(service.activeComponent).toBe(InputComponent.Outside);
    });

    it('should refer a MouseRoll to the processMouseRoll method', () => {
        service.activeAction = new UIMove(player);
        service.activeComponent = InputComponent.Horse;
        const args = WheelRoll.UP;
        const input: UIInput = { from: InputComponent.Horse, type: InputType.MouseRoll, args };
        const receiveRightClickSpy = spyOn(service.activeAction, 'receiveRoll').and.callThrough();
        service['processInputType'](input);
        expect(receiveRightClickSpy).toHaveBeenCalledWith(args);
    });

    it('should call discard (remove the activeAction and set activeComponent to "Outside")', () => {
        service.activeComponent = InputComponent.Horse;
        service.cancel();
        expect(service.activeComponent).toBe(InputComponent.Outside);
        expect(service.activeAction).toBeNull();
    });

    it('should pass', () => {
        const sendActionSpy = spyOn(TestBed.inject(ActionValidatorService), 'sendAction').and.callFake(() => {
            return false;
        });
        service.confirm();
        service.pass(player);
        expect(sendActionSpy).toHaveBeenCalledWith(new PassTurn(player));
    });

    it('should throw error if the activeAction is null', () => {
        service.activeAction = null;
        const sendActionSpy = spyOn(TestBed.inject(ActionValidatorService), 'sendAction').and.callFake(() => {
            return false;
        });
        service.confirm();
        expect(sendActionSpy).toHaveBeenCalledTimes(0);
    });

    it('should throw error if a !canBeExecuted activeAction is confirmed', () => {
        service.activeComponent = InputComponent.Horse;
        service.activeAction = new UIExchange(player);
        const sendActionSpy = spyOn(TestBed.inject(ActionValidatorService), 'sendAction').and.callFake(() => {
            return false;
        });
        service.confirm();
        expect(service.activeComponent).toBe(InputComponent.Horse);
        expect(service.activeAction instanceof UIExchange).toBeTruthy();
        expect(sendActionSpy).toHaveBeenCalledTimes(0);
    });

    it('should send the correct action to the ActionValidatorService method', () => {
        service.activeAction = new UIExchange(player);
        service.activeAction.concernedIndexes.add(0);
        const sendActionSpy = spyOn(TestBed.inject(ActionValidatorService), 'sendAction').and.callFake(() => {
            return false;
        });
        service.confirm();
        expect(service.activeComponent).toBe(InputComponent.Outside);
        expect(service.activeAction).toBeNull();
        expect(sendActionSpy).toHaveBeenCalled();
    });
});
