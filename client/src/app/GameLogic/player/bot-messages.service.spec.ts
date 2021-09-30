import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BINGO_VALUE, BOARD_DIMENSION } from '@app/GameLogic/constants';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { BotMessagesService } from './bot-messages.service';

describe('BotMessagesService', () => {
    let service: BotMessagesService;
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
    // const stringWordVolant = 'volant';
    // const pointsWordVolant = 45;
    // const wordLettersVolant = [
    //     { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //     { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //     { letterObject: { char: 'L', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //     { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //     { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    //     { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
    // ];
    let spyMessageService: MessagesService;

    beforeEach(() => {
        spyMessageService = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage']);
        TestBed.configureTestingModule({ providers: [{ provide: MessagesService, useValue: spyMessageService }, CommandExecuterService] });
        service = TestBed.inject(BotMessagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should correctly format a valid word alternative for a first turn word', () => {
        const validwordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 2, 3, 4] }],
            { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
        );
        const expected = 'H8:A H9:V H10:I H11:O H12:N (25) \\n#A##V##I##O##N# (25) \\n\\n';
        expect(service.formatAlternativeWord(validwordAvion)).toBe(expected);
    });

    it('should correctly format a valid word alternative for a first turn word with bingo', () => {
        const validword = new ValidWord(
            stringWordLongmot,
            0,
            stringWordLongmot.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordLongmot.length,
            [{ letters: wordLettersLongmot, index: [0, 1, 2, 3, 4, 5, 6] }],
            { wordsPoints: [{ word: stringWordLongmot, points: pointsWordLongmot }], totalPoints: pointsWordLongmot + BINGO_VALUE, isBingo: true },
        );
        const expected = 'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n';
        expect(service.formatAlternativeWord(validword)).toBe(expected);
    });

    it('should correctly format a valid word alternative for an added word on previously placed letters', () => {
        const validwordAvion = new ValidWord(
            stringWordAvion,
            0,
            stringWordAvion.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWordAvion.length,
            [{ letters: wordLettersAvion, index: [0, 1, 3, 4] }],
            { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
        );
        const expected = 'H8:A H9:V H11:O H12:N (25) \\n#A##V#I#O##N# (25) \\n\\n';
        expect(service.formatAlternativeWord(validwordAvion)).toBe(expected);
    });

    // it('should correctly provide 3 word alternatives with correct format', () => {
    //     const validwordAvion = new ValidWord(
    //         stringWordAvion,
    //         0,
    //         stringWordAvion.length,
    //         0,
    //         0,
    //         false,
    //         Math.floor(BOARD_DIMENSION / 2),
    //         Math.floor(BOARD_DIMENSION / 2),
    //         stringWordAvion.length,
    //         [{ letters: wordLettersAvion, index: [0, 1, 3, 4] }],
    //         { wordsPoints: [{ word: stringWordAvion, points: pointsWordAvion }], totalPoints: pointsWordAvion, isBingo: false },
    //     );
    //     const validwordLongmot = new ValidWord(
    //         stringWordLongmot,
    //         0,
    //         stringWordLongmot.length,
    //         0,
    //         0,
    //         false,
    //         Math.floor(BOARD_DIMENSION / 2),
    //         Math.floor(BOARD_DIMENSION / 2),
    //         stringWordLongmot.length,
    //         [{ letters: wordLettersLongmot, index: [0, 1, 2, 3, 4, 5, 6] }],
    //         { wordsPoints: [{ word: stringWordLongmot, points: pointsWordLongmot }], totalPoints: pointsWordLongmot + BINGO_VALUE, isBingo: true },
    //     );
    //     const validwordVolant = new ValidWord(
    //         stringWordVolant,
    //         0,
    //         stringWordVolant.length,
    //         0,
    //         0,
    //         false,
    //         Math.floor(BOARD_DIMENSION / 2),
    //         Math.floor(BOARD_DIMENSION / 2),
    //         stringWordVolant.length,
    //         [{ letters: wordLettersVolant, index: [0, 1, 2, 4, 5] }],
    //         { wordsPoints: [{ word: stringWordVolant, points: pointsWordVolant }], totalPoints: pointsWordVolant, isBingo: false },
    //     );
    //     const expected =
    //         'H8:A H9:V H11:O H12:N (30) \\n#A##V#I#O##N# (30) \\n\\n' +
    //         'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n' +
    //         'H8:V H9:O H10:L H12:N H13:T (45) \\n#V##O##L#A#N##T# (45) \\n\\n';
    //     expect(spyMessageService.receiveSystemMessage).toHaveBeenCalledWith(expected);
    // });
});
