/* eslint-disable @typescript-eslint/no-magic-numbers */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
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
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { EasyBot } from './easy-bot';

describe('EasyBot', () => {
    let easyBot: EasyBot;
    let boardService: BoardService;
    let botCreatorService: BotCreatorService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BoardService, BotCreatorService, BotMessagesService, TimerService, PointCalculatorService, MessagesService, GameInfoService],
        });
        boardService = TestBed.inject(BoardService);
        botCreatorService = TestBed.inject(BotCreatorService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);

        gameInfo.receiveGame(new Game(DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService));
        easyBot = botCreatorService.createBot('Tim', 'easy') as EasyBot;
    });

    it('should create an instance', () => {
        expect(easyBot).toBeTruthy();
    });

    it('should call actions based on setting', () => {
        const mul = 10;
        const numberOfTime = 1000;
        const spyPlay = spyOn(easyBot, 'playAction');
        const spyExchange = spyOn(easyBot, 'exchangeAction');

        for (let i = 0; i < numberOfTime; i++) {
            gameInfo.receiveGame(new Game(DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService));
            easyBot.randomActionPicker();
        }
        let value;
        value = Math.round((spyExchange.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbability.exchange);
        value = Math.round((spyPlay.calls.count() / numberOfTime) * mul) / mul;
        expect(value).toBeCloseTo(EasyBot.actionProbability.play);
    });

    it('should return a valid first turn action (empty board))', fakeAsync(() => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;
        const test = spyOn(easyBot, 'randomActionPicker').and.callThrough();

        easyBot.setActive();
        tick(TIME_BUFFER_BEFORE_ACTION);

        const result: Action = test.calls.first().returnValue;
        expect(result).toBeTruthy();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
    }));

    it('should return a valid word 2-6 points', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;

        spyOn(Math, 'random').and.returnValue(0.2);
        easyBot.bruteForceStart();
        const pickedWord: ValidWord = easyBot.randomWordPicker(easyBot.validWordList);
        let result = false;
        if (pickedWord.value.totalPoints >= 2 && pickedWord.value.totalPoints <= 6) {
            result = true;
        }
        expect(result).toBeTruthy();
    });

    it('should return a valid word 7-12 points', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;

        spyOn(Math, 'random').and.returnValue(0.6);
        easyBot.bruteForceStart();
        const pickedWord: ValidWord = easyBot.randomWordPicker(easyBot.validWordList);
        let result = false;
        if (pickedWord.value.totalPoints >= 7 && pickedWord.value.totalPoints <= 12) {
            result = true;
        }
        expect(result).toBeTruthy();
    });

    it('should return a valid word 13-18 points', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;

        spyOn(Math, 'random').and.returnValue(0.9);
        easyBot.bruteForceStart();
        const pickedWord: ValidWord = easyBot.randomWordPicker(easyBot.validWordList);
        let result = false;
        if (pickedWord.value.totalPoints >= 13 && pickedWord.value.totalPoints <= 18) {
            result = true;
        }
        expect(result).toBeTruthy();
    });

    it('should return a valid PlaceLetter action (playAction through spied randomAction)(vertical)', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;
        const getRandomInt = spyOn(easyBot, 'getRandomInt');
        getRandomInt.withArgs(1).and.returnValue(1);
        getRandomInt.and.callThrough();

        spyOn(Math, 'random').and.returnValue(0.5);
        const result = easyBot.randomActionPicker();
        expect(result).toBeInstanceOf(PlaceLetter);
    });

    it('should return a valid PlaceLetter action (playAction through spied randomAction)(horizontal)', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;
        const getRandomInt = spyOn(easyBot, 'getRandomInt');
        getRandomInt.withArgs(1).and.returnValue(0);
        getRandomInt.and.callThrough();

        spyOn(Math, 'random').and.returnValue(0.5);
        const result = easyBot.randomActionPicker();
        expect(result).toBeInstanceOf(PlaceLetter);
    });

    it('should a valid PassTurn because no words were found (playAction through spied randomAction)', () => {
        const letters: Letter[] = [];
        easyBot.letterRack = letters;
        spyOn(Math, 'random').and.returnValue(0.5);
        const result = easyBot.randomActionPicker();
        expect(result).toBeInstanceOf(PassTurn);
    });

    it('should return a valid ExchangeAction (exchangeAction)', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        easyBot.letterRack = letters;

        const result = easyBot.exchangeAction();
        expect(result).toBeInstanceOf(ExchangeLetter);
    });
});
