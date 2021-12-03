/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { DEFAULT_TIME_PER_TURN, TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION, TIME_BUFFER_BEFORE_ACTION } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BotCalculatorService } from '@app/game-logic/player/bot-calculator/bot-calculator.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { HardBot } from '@app/game-logic/player/bot/hard-bot';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotType } from '@app/services/bot-http.service';
import { of } from 'rxjs';

describe('HardBot', () => {
    let hardBot: HardBot;
    let boardService: BoardService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    let newGame: OfflineGame;
    const randomBonus = false;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const dict = new DictionaryService(dictHttpServiceMock);

    const mockBotHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);
    const obs = of(['Test1', 'Test2', 'Test3']);
    mockBotHttpService.getDataInfo.and.returnValue(obs);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: BotMessagesService, useValue: botMessageMock },
                { provide: BotHttpService, useValue: mockBotHttpService },
            ],
        });
        boardService = TestBed.inject(BoardService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);
        newGame = new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService);
        gameInfo.receiveGame(newGame);
        hardBot = new HardBot(
            'test',
            boardService,
            dict,
            TestBed.inject(BotCalculatorService),
            TestBed.inject(WordSearcher),
            TestBed.inject(BotMessagesService),
            gameInfo,
            TestBed.inject(CommandExecuterService),
            TestBed.inject(ActionCreatorService),
            TestBed.inject(BotHttpService),
            BotType.Expert,
        );
    });

    it('should create an instance', () => {
        expect(hardBot).toBeTruthy();
    });

    it('should return the best word it can place (piano) (horizontal))', fakeAsync(() => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'N', value: 1 },
            { char: 'I', value: 1 },
            { char: 'P', value: 1 },
            { char: 'O', value: 1 },
        ];
        hardBot.letterRack = letters;
        const actionSpy = spyOn<any>(hardBot, 'actionPicker').and.callThrough();
        spyOn<any>(hardBot, 'getRandomInt').and.returnValue(0);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        const result = 'piano';
        const expected: PlaceLetter = actionSpy.calls.first().returnValue as PlaceLetter;
        expect(expected.word).toEqual(result);
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should return the best word it can place (vertical))', fakeAsync(() => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        hardBot.letterRack = letters;
        const actionSpy = spyOn<any>(hardBot, 'actionPicker').and.callThrough();
        spyOn<any>(hardBot, 'getRandomInt').and.returnValue(1);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        const result = 'aa';
        const expected: PlaceLetter = actionSpy.calls.first().returnValue as PlaceLetter;
        expect(expected.word).toEqual(result);
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should exchange letters because it cant play)', fakeAsync(() => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        hardBot.letterRack = letters;
        const exchangeSpy = spyOn<any>(hardBot, 'exchangeAction').and.callThrough();

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        expect(exchangeSpy).toHaveBeenCalled();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should exchange letters because it cant play and >0 <7 letters left)', fakeAsync(() => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        hardBot.letterRack = letters;
        const exchangeSpy = spyOn<any>(hardBot, 'exchangeAction').and.callThrough();
        spyOnProperty(gameInfo, 'numberOfLettersRemaining').and.returnValue(5);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        expect(exchangeSpy).toHaveBeenCalled();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should pass because it cant play and there is no letters to draw)', fakeAsync(() => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        hardBot.letterRack = letters;
        const passSpy = spyOn<any>(hardBot, 'passAction').and.callThrough();
        spyOnProperty(gameInfo, 'numberOfLettersRemaining').and.returnValue(0);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        expect(passSpy).toHaveBeenCalled();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));
});
