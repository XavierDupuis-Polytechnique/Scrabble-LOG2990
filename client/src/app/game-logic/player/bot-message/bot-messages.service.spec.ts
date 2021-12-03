/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MockLocationStrategy } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BOARD_DIMENSION } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { BotCreatorService } from '@app/game-logic/player/bot/bot-creator.service';
import { HardBot } from '@app/game-logic/player/bot/hard-bot';
import { HORIZONTAL, ValidWord, VERTICAL } from '@app/game-logic/player/bot/valid-word';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService } from '@app/services/bot-http.service';
import { of } from 'rxjs';

describe('bot message service', () => {
    let service: BotMessagesService;
    const commandExecuterServiceMock = jasmine.createSpyObj('CommandExecuterService', ['execute'], ['isDebugModeActivated']);
    const messagesService = jasmine.createSpyObj('MessageService', ['receiveSystemMessage', 'receiveMessageOpponent']);
    const httpClient = jasmine.createSpyObj('HttpClient', ['get']);
    const botHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);
    const obs = of(['Test1', 'Test2', 'Test3']);
    botHttpService.getDataInfo.and.returnValue(obs);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MessagesService, useValue: messagesService },
                { provide: CommandExecuterService, useValue: commandExecuterServiceMock },
                { provide: HttpClient, useValue: httpClient },
                { provide: LocationStrategy, useClass: MockLocationStrategy },
                { provide: BotHttpService, useValue: botHttpService },
            ],
        });
        service = TestBed.inject(BotMessagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('sendAction should call sendPassTurnMessage', () => {
        spyOn<any>(service, 'sendAlternativeWords');
        const spy = spyOn<any>(service, 'sendPassTurnMessage');
        const player = {
            name: 'test',
        };
        const action = new PassTurn(player as Player);
        service.sendAction(action);
        expect(spy).toHaveBeenCalled();
    });

    it('sendAction should call the correct function base on the instance of the action 1/2', () => {
        spyOn<any>(service, 'sendAlternativeWords');
        const spy = spyOn<any>(service, 'sendPlaceLetterMessage');
        const player = {
            name: 'test',
        };
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 7, y: 7 };
        const action = new PlaceLetter(player as Player, 'allo', placement, TestBed.inject(PointCalculatorService), TestBed.inject(WordSearcher));
        service.sendAction(action);

        expect(spy).toHaveBeenCalled();
    });

    it('sendAction should call the correct function base on the instance of the action 2/2', () => {
        const player = {
            name: 'test',
        };
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 7, y: 7 };
        const action = new PlaceLetter(player as Player, 'allo', placement, TestBed.inject(PointCalculatorService), TestBed.inject(WordSearcher));
        (Object.getOwnPropertyDescriptor(commandExecuterServiceMock, 'isDebugModeActivated')?.get as jasmine.Spy<() => boolean>).and.returnValue(
            true,
        );
        const spy2 = spyOn<any>(service, 'sendAlternativeWords');
        service.sendAction(action);
        expect(spy2).toHaveBeenCalled();
    });

    it('sendAction should call sendExchangeLettersMessage', () => {
        const spy = spyOn<any>(service, 'sendExchangeLettersMessage');
        const player = {
            name: 'test',
        };
        const lettersToExchange: Letter[] = [{ char: 'V', value: 1 }];
        const action = new ExchangeLetter(player as Player, lettersToExchange);
        service.sendAction(action);
        expect(spy).toHaveBeenCalled();
    });

    it('sendPassTurnMessage should call receiveMessageOpponent', () => {
        service['sendPassTurnMessage']('houla');
        expect(messagesService.receiveMessageOpponent).toHaveBeenCalled();
    });

    it('sendExchangeLetter should call receiveMessageOpponent', () => {
        const lettersToExchange: Letter[] = [{ char: 'V', value: 1 }];

        service['sendExchangeLettersMessage'](lettersToExchange, 'houla');
        expect(messagesService.receiveMessageOpponent).toHaveBeenCalled();
    });

    it('sendPlaceLetter should call receiveMessageOpponent', () => {
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 7, y: 7 };
        service['sendPlaceLetterMessage']('allo', placement, 'houla');
        expect(messagesService.receiveMessageOpponent).toHaveBeenCalled();
    });

    it('sendAction should call sendNextBestWords if the player is a hardBot', () => {
        spyOn<any>(service, 'formatAlternativeWord').and.returnValue('somethingValid');
        const player = TestBed.inject(BotCreatorService).createBot('Bot', 'hard');
        (Object.getOwnPropertyDescriptor(commandExecuterServiceMock, 'isDebugModeActivated')?.get as jasmine.Spy<() => boolean>).and.returnValue(
            true,
        );
        (player as HardBot).bestWordList = [new ValidWord('second'), new ValidWord('third')];
        const action = new PlaceLetter(
            player as HardBot,
            'allo',
            { direction: Direction.Horizontal, x: 7, y: 7 },
            TestBed.inject(PointCalculatorService),
            TestBed.inject(WordSearcher),
        );
        service.sendAction(action);
        expect(messagesService.receiveSystemMessage).toHaveBeenCalled();
    });

    it('formAlternativeWord should return correct output (Horizontal)', () => {
        const wordLettersAvion = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const stringWordAvion = 'avion';
        const validWordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            HORIZONTAL,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 2, 3, 4] }],
            { wordsPoints: [{ word: stringWordAvion, points: 25 }], totalPoints: 25, isBingo: true },
        );
        const expected = 'H8:A H9:V H10:I H11:O H12:N (25) \\n#A##V##I##O##N# (25) \\nBingo! (50)\\n\\n';
        expect(service['formatAlternativeWord'](validWordAvion)).toEqual(expected);
    });

    it('formAlternativeWord should return correct output (Horizontal) (no index)', () => {
        const wordLettersAvion = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const stringWordAvion = 'avion';
        const validWordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            HORIZONTAL,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [] }],
            { wordsPoints: [{ word: stringWordAvion, points: 25 }], totalPoints: 25, isBingo: true },
        );
        const expected = '(25) \\nAVION (25) \\nBingo! (50)\\n\\n';
        expect(service['formatAlternativeWord'](validWordAvion)).toEqual(expected);
    });

    it('formAlternativeWord should return correct output (Vertical)', () => {
        const wordLettersAvion = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const stringWordAvion = 'avion';
        const validWordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            VERTICAL,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 2, 3, 4] }],
            { wordsPoints: [{ word: stringWordAvion, points: 25 }], totalPoints: 25, isBingo: false },
        );
        const expected = 'H8:A I8:V J8:I K8:O L8:N (25) \\n#A##V##I##O##N# (25) \\n\\n';
        expect(service['formatAlternativeWord'](validWordAvion)).toEqual(expected);
    });

    it('sendAlternativeWords should call receiveSystemMessage', () => {
        const wordLettersAvion = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        const stringWordAvion = 'avion';
        const validWordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            VERTICAL,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 2, 3, 4] }],
            { wordsPoints: [{ word: stringWordAvion, points: 25 }], totalPoints: 25, isBingo: false },
        );

        service['sendAlternativeWords']([validWordAvion]);
        expect(messagesService.receiveSystemMessage).toHaveBeenCalled();
    });
});
