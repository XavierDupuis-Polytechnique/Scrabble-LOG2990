/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BINGO_VALUE, BOARD_DIMENSION, FIVE, FOUR, SIX } from '@app/GameLogic/constants';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { HORIZONTAL, ValidWord, VERTICAL } from '@app/GameLogic/player/valid-word';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { placementSettingsToString } from '@app/GameLogic/utils';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

describe('BotMessagesService', () => {
    let botMessage: BotMessagesService;
    const stringWordAvion = 'avion';
    const pointsWordAvion = 25;
    const wordLettersAvion = [
        { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    ];
    const stringWordLongmot = 'longmot';
    const pointsWordLongmot = 30;
    const wordLettersLongmot = [
        { letterObject: { char: 'L', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'G', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'M', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    ];
    const stringWordVolant = 'volant';
    const pointsWordVolant = 45;
    const wordLettersVolant = [
        { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'L', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    ];
    let messageService: MessagesService;
    let botCreatorService: BotCreatorService;
    let pointCalculatorService: PointCalculatorService;
    let wordSearcher: WordSearcher;
    let commandExecuter: CommandExecuterService;
    let easyBot: EasyBot;
    const dict = new DictionaryService();

    beforeAll(() => {
        messageService = TestBed.inject(MessagesService);
        botMessage = TestBed.inject(BotMessagesService);
        botCreatorService = TestBed.inject(BotCreatorService);
        pointCalculatorService = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);
        commandExecuter = TestBed.inject(CommandExecuterService);
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        easyBot = botCreatorService.createBot('Tim', 'easy') as EasyBot;
    });

    it('should be created', () => {
        expect(botMessage).toBeTruthy();
    });

    it('should correctly format a valid word alternative for a first turn word (horizontal)', () => {
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
            [{ letters: wordLettersAvion, index: [0, 1, 2, 3, FOUR] }],
            { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
        );
        const expected = 'H8:A H9:V H10:I H11:O H12:N (25) \\n#A##V##I##O##N# (25) \\n\\n';
        expect(botMessage.formatAlternativeWord(validWordAvion)).toBe(expected);
    });

    it('should correctly format a valid word alternative for a first turn word (vertical)', () => {
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
            [{ letters: wordLettersAvion, index: [0, 1, 2, 3, FOUR] }],
            { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
        );
        const expected = 'H8:A I8:V J8:I K8:O L8:N (25) \\n#A##V##I##O##N# (25) \\n\\n';
        expect(botMessage.formatAlternativeWord(validWordAvion)).toBe(expected);
    });

    it('should correctly format a valid word alternative for a first turn word with bingo', () => {
        const validWord = new ValidWord(
            stringWordLongmot,
            0,
            stringWordLongmot.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordLongmot.length,
            [{ letters: wordLettersLongmot, index: [0, 1, 2, 3, FOUR, FIVE, SIX] }],
            { wordsPoints: [{ word: stringWordLongmot, points: pointsWordLongmot }], totalPoints: pointsWordLongmot + BINGO_VALUE, isBingo: true },
        );
        const expected = 'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n';
        expect(botMessage.formatAlternativeWord(validWord)).toBe(expected);
    });

    it('should correctly format a valid placement that generates multiple sub words', () => {
        const validWordWithMultipleSubWords = new ValidWord(
            stringWordLongmot,
            0,
            stringWordLongmot.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordLongmot.length,
            [
                { letters: wordLettersVolant, index: [0, 1, 2, 3, FOUR, FIVE] },
                { letters: wordLettersAvion, index: [0, 1, 2, 3, FOUR] },
            ],
            {
                wordsPoints: [
                    { word: stringWordVolant, points: pointsWordVolant },
                    { word: stringWordAvion, points: pointsWordAvion },
                ],
                totalPoints: pointsWordAvion + pointsWordVolant,
                isBingo: false,
            },
        );
        const expected = 'H8:V H9:O H10:L H11:A H12:N H13:T (70) \\n' + '#V##O##L##A##N##T# (45) ' + '\\n' + '#A##V##I##O##N# (25) \\n\\n';
        expect(botMessage.formatAlternativeWord(validWordWithMultipleSubWords)).toBe(expected);
    });

    it('should correctly format a valid word alternative for an added word on previously placed letters', () => {
        const validWordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 3, FOUR] }],
            { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
        );
        const expected = 'H8:A H9:V H11:O H12:N (25) \\n#A##V#I#O##N# (25) \\n\\n';
        expect(botMessage.formatAlternativeWord(validWordAvion)).toBe(expected);
    });

    it('should correctly provide 3 word alternatives with correct format', () => {
        const validWordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 3, FOUR] }],
            { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
        );
        const validWordLongmot = new ValidWord(
            stringWordLongmot,
            0,
            stringWordLongmot.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordLongmot.length,
            [{ letters: wordLettersLongmot, index: [0, 1, 2, 3, FOUR, FIVE, SIX] }],
            { wordsPoints: [{ word: stringWordLongmot, points: pointsWordLongmot }], totalPoints: pointsWordLongmot + BINGO_VALUE, isBingo: true },
        );
        const validWordVolant = new ValidWord(
            stringWordVolant,
            0,
            stringWordVolant.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordVolant.length,
            [{ letters: wordLettersVolant, index: [0, 1, 2, FOUR, FIVE] }],
            { wordsPoints: [{ word: stringWordVolant, points: pointsWordVolant }], totalPoints: pointsWordVolant, isBingo: false },
        );
        const fakeWordList = [validWordAvion, validWordLongmot, validWordVolant];
        const spyReceiveSystemMessage = spyOn(messageService, 'receiveSystemMessage');
        botMessage.sendAlternativeWords(fakeWordList);
        const expected: string[] = [];
        expected.push(
            '\\n' +
                'H8:A H9:V H11:O H12:N (25) \\n#A##V#I#O##N# (25) \\n\\n' +
                'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n' +
                'H8:V H9:O H10:L H12:N H13:T (45) \\n#V##O##L#A#N##T# (45) \\n\\n',
        );
        expect(spyReceiveSystemMessage.calls.first().args).toEqual(expected);
    });

    it('should correctly provide 2 word alternatives when there are only 2 alternatives', () => {
        const validWordLongmot = new ValidWord(
            stringWordLongmot,
            0,
            stringWordLongmot.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordLongmot.length,
            [{ letters: wordLettersLongmot, index: [0, 1, 2, 3, FOUR, FIVE, SIX] }],
            { wordsPoints: [{ word: stringWordLongmot, points: pointsWordLongmot }], totalPoints: pointsWordLongmot + BINGO_VALUE, isBingo: true },
        );
        const validWordVolant = new ValidWord(
            stringWordVolant,
            0,
            stringWordVolant.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordVolant.length,
            [{ letters: wordLettersVolant, index: [0, 1, 2, FOUR, FIVE] }],
            { wordsPoints: [{ word: stringWordVolant, points: pointsWordVolant }], totalPoints: pointsWordVolant, isBingo: false },
        );
        const fakeWordList = [validWordLongmot, validWordVolant];
        const spyReceiveSystemMessage = spyOn(messageService, 'receiveSystemMessage');
        botMessage.sendAlternativeWords(fakeWordList);
        const expected: string[] = [];
        expected.push(
            '\\n' +
                'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n' +
                'H8:V H9:O H10:L H12:N H13:T (45) \\n#V##O##L#A#N##T# (45) \\n\\n',
        );
        expect(spyReceiveSystemMessage.calls.first().args).toEqual(expected);
    });

    it('should correctly provide 1 word alternative when there is only 1 alternative', () => {
        const validWordLongmot = new ValidWord(
            stringWordLongmot,
            0,
            stringWordLongmot.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordLongmot.length,
            [{ letters: wordLettersLongmot, index: [0, 1, 2, 3, FOUR, FIVE, SIX] }],
            { wordsPoints: [{ word: stringWordLongmot, points: pointsWordLongmot }], totalPoints: pointsWordLongmot + BINGO_VALUE, isBingo: true },
        );
        const fakeWordList = [validWordLongmot];
        const spyReceiveSystemMessage = spyOn(messageService, 'receiveSystemMessage');
        botMessage.sendAlternativeWords(fakeWordList);
        const expected: string[] = [];
        expected.push('\\n' + 'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n');
        expect(spyReceiveSystemMessage.calls.first().args).toEqual(expected);
    });

    it('should return the placement settings in a string', () => {
        const placement: PlacementSetting = { x: 5, y: 5, direction: Direction.Horizontal };
        const result = placementSettingsToString(placement);
        const expected = 'f6h';

        expect(result).toEqual(expected);
    });

    it('should throw when the position is invalid x < BOARD_MIN_POSITION', () => {
        const placement: PlacementSetting = { x: -1, y: 5, direction: Direction.Horizontal };
        const result = () => {
            placementSettingsToString(placement);
        };

        expect(result).toThrowError('X value not between 0-14');
    });

    it('should throw when the position is invalid x > BOARD_MAX_POSITION', () => {
        const placement: PlacementSetting = { x: 18, y: 5, direction: Direction.Horizontal };
        const result = () => {
            placementSettingsToString(placement);
        };

        expect(result).toThrowError('X value not between 0-14');
    });

    it('should throw when the position is invalid y < BOARD_MIN_POSITION', () => {
        const placement: PlacementSetting = { x: 5, y: -1, direction: Direction.Horizontal };
        const result = () => {
            placementSettingsToString(placement);
        };

        expect(result).toThrowError('Y value not between 0-14');
    });

    it('should throw when the position is invalid y > BOARD_MAX_POSITION', () => {
        const placement: PlacementSetting = { x: 5, y: 18, direction: Direction.Horizontal };
        const result = () => {
            placementSettingsToString(placement);
        };

        expect(result).toThrowError('Y value not between 0-14');
    });

    it('should throw when the direction is invalid (!= H || V)', () => {
        const placement: PlacementSetting = { x: 5, y: 5, direction: 'K' };
        const result = () => {
            placementSettingsToString(placement);
        };

        expect(result).toThrowError('Invalid direction');
    });

    it('should sendAction of type PassTurn', () => {
        const action: Action = new PassTurn(easyBot);
        const spySendPassTurnMessage = spyOn(botMessage, 'sendPassTurnMessage');

        botMessage.sendAction(action);

        const expected = 1;

        expect(spySendPassTurnMessage.calls.count()).toEqual(expected);
    });

    it('should sendAction of type ExchangeLetter', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        const action: Action = new ExchangeLetter(easyBot, letters);
        const spySendExchangeLettersMessage = spyOn(botMessage, 'sendExchangeLettersMessage').and.callThrough();
        const spyReceiveMessageOpponent = spyOn(messageService, 'receiveMessageOpponent');
        botMessage.sendAction(action);
        const expected1 = [];
        expected1.push(letters);
        expected1.push(easyBot.name);

        const expected2: string[] = [];
        expected2.push(easyBot.name);
        expected2.push(`${CommandType.Exchange} ap*cuev`);

        const result1 = spySendExchangeLettersMessage.calls.first().args;
        const result2 = spyReceiveMessageOpponent.calls.first().args;

        expect(result1).toEqual(expected1);
        expect(result2).toEqual(expected2);
    });

    it('should sendAction of type PlaceLetter', () => {
        const placement: PlacementSetting = { x: 5, y: 5, direction: Direction.Horizontal };
        const action: Action = new PlaceLetter(easyBot, 'hello', placement, pointCalculatorService, wordSearcher);
        const spySendPlaceLetterMessage = spyOn(botMessage, 'sendPlaceLetterMessage').and.callThrough();
        const spyReceiveMessageOpponent = spyOn(messageService, 'receiveMessageOpponent');

        botMessage.sendAction(action);

        const expected1: (string | PlacementSetting)[] = [];
        expected1.push('hello');
        expected1.push(placement);
        expected1.push(easyBot.name);

        const expected2: string[] = [];
        expected2.push(easyBot.name);
        expected2.push(`${CommandType.Place} ${'f6h'} ${'hello'}`);

        const result = spySendPlaceLetterMessage.calls.first().args;
        const result2 = spyReceiveMessageOpponent.calls.first().args;

        expect(result).toEqual(expected1);
        expect(result2).toEqual(expected2);
    });

    it('should sendAction of type PlaceLetter with debug active', () => {
        const placement: PlacementSetting = { x: 5, y: 5, direction: Direction.Horizontal };
        const action: Action = new PlaceLetter(easyBot, 'hello', placement, pointCalculatorService, wordSearcher);
        const spySendPlaceLetterMessage = spyOn(botMessage, 'sendPlaceLetterMessage').and.callThrough();
        const spyReceiveMessageOpponent = spyOn(messageService, 'receiveMessageOpponent');
        const spySendAlternativeWords = spyOn(botMessage, 'sendAlternativeWords');
        const command = {
            type: CommandType.Debug,
            from: ' ',
        };
        commandExecuter.execute(command);
        botMessage.sendAction(action);

        const expected1: (string | PlacementSetting)[] = [];
        expected1.push('hello');
        expected1.push(placement);
        expected1.push(easyBot.name);

        const expected2: string[] = [];
        expected2.push(easyBot.name);
        expected2.push(`${CommandType.Place} ${'f6h'} ${'hello'}`);

        const expected3: ValidWord[][] = [];
        expected3.push(easyBot.validWordList);

        const result = spySendPlaceLetterMessage.calls.first().args;
        const result2 = spyReceiveMessageOpponent.calls.first().args;
        const result3 = spySendAlternativeWords.calls.first().args;

        expect(result).toEqual(expected1);
        expect(result2).toEqual(expected2);
        expect(result3).toEqual(expected3);
    });
});
