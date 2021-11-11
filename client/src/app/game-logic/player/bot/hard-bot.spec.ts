import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { DEFAULT_TIME_PER_TURN, TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION, TIME_BUFFER_BEFORE_ACTION } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { ObjectiveManagerService } from '@app/game-logic/game/objectives/objective-manager.service';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { HardBot } from '@app/game-logic/player/bot/hard-bot';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';

describe('HardBot', () => {
    let hardBot: HardBot;
    let boardService: BoardService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    let objectiveManager: ObjectiveManagerService;
    const dict = new DictionaryService();
    let newGame: OfflineGame;
    const randomBonus = false;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: BotMessagesService, useValue: botMessageMock },
            ],
        });
        boardService = TestBed.inject(BoardService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);
        objectiveManager = TestBed.inject(ObjectiveManagerService);
        newGame = new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService, objectiveManager);
        gameInfo.receiveGame(newGame);
        hardBot = new HardBot(
            'test',
            boardService,
            dict,
            pointCalculator,
            TestBed.inject(WordSearcher),
            TestBed.inject(BotMessagesService),
            gameInfo,
            TestBed.inject(CommandExecuterService),
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
        const actionSpy = spyOn(hardBot, 'actionPicker').and.callThrough();
        spyOn(hardBot, 'getRandomInt').and.returnValue(0);

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
        const actionSpy = spyOn(hardBot, 'actionPicker').and.callThrough();
        spyOn(hardBot, 'getRandomInt').and.returnValue(1);

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
        const exchangeSpy = spyOn(hardBot, 'exchangeAction').and.callThrough();

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        expect(exchangeSpy).toHaveBeenCalled();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should pass because it cant play and there is no letters to draw)', fakeAsync(() => {
        const letters: Letter[] = [{ char: 'A', value: 1 }];
        hardBot.letterRack = letters;
        const passSpy = spyOn(hardBot, 'passAction').and.callThrough();
        spyOnProperty(gameInfo, 'numberOfLettersRemaining').and.returnValue(0);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        expect(passSpy).toHaveBeenCalled();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));
});
