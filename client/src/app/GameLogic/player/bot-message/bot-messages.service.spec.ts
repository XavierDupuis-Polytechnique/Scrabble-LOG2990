/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { CommandExecuterService } from '@app/GameLogic/commands/command-executer/command-executer.service';
import { BOARD_DIMENSION } from '@app/GameLogic/constants';
import { Direction } from '@app/GameLogic/direction.enum';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { PlacementSetting } from '@app/GameLogic/interfaces/placement-setting.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-message/bot-messages.service';
import { HORIZONTAL, ValidWord, VERTICAL } from '@app/GameLogic/player/bot/valid-word';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

describe('bot message service', () => {
    let service: BotMessagesService;
    const commandExecuterServiceMock = jasmine.createSpyObj('CommandExecuterService', ['execute'], ['isDebugModeActivated']);
    const messagesService = jasmine.createSpyObj('MessageService', ['receiveSystemMessage', 'receiveMessageOpponent']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: MessagesService, useValue: messagesService },
                { provide: CommandExecuterService, useValue: commandExecuterServiceMock },
            ],
        });
        service = TestBed.inject(BotMessagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('sendAction should call sendPassTurnMessage', () => {
        const spy = spyOn(service, 'sendPassTurnMessage');
        const player = {
            name: 'test',
        };
        const action = new PassTurn(player as Player);
        service.sendAction(action);
        expect(spy).toHaveBeenCalled();
    });

    it('sendAction should call the correct function base on the instance of the action', () => {
        const spy = spyOn(service, 'sendPlaceLetterMessage');
        const player = {
            name: 'test',
        };
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 7, y: 7 };
        const action = new PlaceLetter(player as Player, 'allo', placement, TestBed.inject(PointCalculatorService), TestBed.inject(WordSearcher));
        service.sendAction(action);

        expect(spy).toHaveBeenCalled();

        (Object.getOwnPropertyDescriptor(commandExecuterServiceMock, 'isDebugModeActivated')?.get as jasmine.Spy<() => boolean>).and.returnValue(
            true,
        );
        const spy2 = spyOn(service, 'sendAlternativeWords');
        service.sendAction(action);
        expect(spy2).toHaveBeenCalled();
    });

    it('sendAction should call sendExchangeLettersMessage', () => {
        const spy = spyOn(service, 'sendExchangeLettersMessage');
        const player = {
            name: 'test',
        };
        const lettersToExchange: Letter[] = [{ char: 'V', value: 1 }];
        const action = new ExchangeLetter(player as Player, lettersToExchange);
        service.sendAction(action);
        expect(spy).toHaveBeenCalled();
    });

    it('sendPassTurnMessage should call receiveMessageOpponent', () => {
        service.sendPassTurnMessage('houla');
        expect(messagesService.receiveMessageOpponent).toHaveBeenCalled();
    });

    it('sendExchangeLetter shoudl call receiveMessageOpponent', () => {
        const lettersToExchange: Letter[] = [{ char: 'V', value: 1 }];

        service.sendExchangeLettersMessage(lettersToExchange, 'houla');
        expect(messagesService.receiveMessageOpponent).toHaveBeenCalled();
    });

    it('sendPlaceLetter shoudl call receiveMessageOpponent', () => {
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 7, y: 7 };
        service.sendPlaceLetterMessage('allo', placement, 'houla');
        expect(messagesService.receiveMessageOpponent).toHaveBeenCalled();
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
        expect(service.formatAlternativeWord(validWordAvion)).toEqual(expected);
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
        expect(service.formatAlternativeWord(validWordAvion)).toEqual(expected);
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

        service.sendAlternativeWords([validWordAvion]);
        expect(messagesService.receiveSystemMessage).toHaveBeenCalled();
    });
});
