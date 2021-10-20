import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { DEFAULT_TIME_PER_TURN, TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION, TIME_BUFFER_BEFORE_ACTION } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { HardBot } from '@app/GameLogic/player/hard-bot';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';

describe('HardBot', () => {
    let hardBot: HardBot;
    let boardService: BoardService;
    let botCreatorService: BotCreatorService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    const dict = new DictionaryService();
    const randomBonus = false;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                BotCreatorService,
                BotMessagesService,
                TimerService,
                PointCalculatorService,
                MessagesService,
                GameInfoService,
            ],
        });
        boardService = TestBed.inject(BoardService);
        botCreatorService = TestBed.inject(BotCreatorService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);

        gameInfo.receiveGame(new Game(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService));
        hardBot = botCreatorService.createBot('Tim', 'hard') as HardBot;
    });

    it('should create an instance', () => {
        expect(hardBot).toBeTruthy();
    });

    it('should return the best word it can place (pianola) (horizontal))', fakeAsync(() => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'L', value: 1 },
            { char: 'N', value: 1 },
            { char: 'I', value: 1 },
            { char: 'P', value: 1 },
            { char: 'A', value: 1 },
            { char: 'O', value: 1 },
        ];
        hardBot.letterRack = letters;
        const actionSpy = spyOn(hardBot, 'actionPicker').and.callThrough();
        spyOn(hardBot, 'getRandomInt').and.returnValue(0);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        const result = 'pianola';
        const expected: PlaceLetter = actionSpy.calls.first().returnValue as PlaceLetter;
        expect(expected.word).toEqual(result);
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should return the best word it can place (pianola) (vertical))', fakeAsync(() => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'L', value: 1 },
            { char: 'N', value: 1 },
            { char: 'I', value: 1 },
            { char: 'P', value: 1 },
            { char: 'A', value: 1 },
            { char: 'O', value: 1 },
        ];
        hardBot.letterRack = letters;
        const actionSpy = spyOn(hardBot, 'actionPicker').and.callThrough();
        spyOn(hardBot, 'getRandomInt').and.returnValue(1);

        hardBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        const result = 'pianola';
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

    // it('setActive', () => {
    //     hardBot.setActive();
    //     expect().nothing();
    // });

    // it('playAction', () => {
    //     hardBot.playAction();
    //     expect().nothing();
    // });

    // it('exchangeAction', () => {
    //     hardBot.exchangeAction();
    //     expect().nothing();
    // });

    // it('passAction', () => {
    //     hardBot.passAction();
    //     expect().nothing();
    // });
});
