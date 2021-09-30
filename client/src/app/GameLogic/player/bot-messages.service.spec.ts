import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BINGO_VALUE, BOARD_DIMENSION } from '@app/GameLogic/constants';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { BotMessagesService } from './bot-messages.service';

describe('BotMessagesService', () => {
    let service: BotMessagesService;

    beforeEach(() => {
        TestBed.configureTestingModule({ providers: [MessagesService, CommandExecuterService] });
        service = TestBed.inject(BotMessagesService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should correctly format a valid word alternative for a first turn word', () => {
        const stringWord = 'avion';
        const pointsWord = 30;
        const wordLetters = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];

        const validword = new ValidWord(
            stringWord,
            0,
            stringWord.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWord.length,
            [{ letters: wordLetters, index: [0, 1, 2, 3, 4] }],
            { wordsPoints: [{ word: stringWord, points: pointsWord }], totalPoints: pointsWord, isBingo: false },
        );
        const expected = 'H8:A H9:V H10:I H11:O H12:N (30) \\n#A##V##I##O##N# (30) \\n\\n';
        expect(service.formatAlternativeWord(validword)).toBe(expected);
    });

    it('should correctly format a valid word alternative for a first turn word with bingo', () => {
        const stringWord = 'longmot';
        const pointsWord = 30;
        const wordLetters = [
            { letterObject: { char: 'L', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'G', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'M', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];

        const validword = new ValidWord(
            stringWord,
            0,
            stringWord.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWord.length,
            [{ letters: wordLetters, index: [0, 1, 2, 3, 4, 5, 6] }],
            { wordsPoints: [{ word: stringWord, points: pointsWord }], totalPoints: pointsWord + BINGO_VALUE, isBingo: true },
        );
        const expected = 'H8:L H9:O H10:N H11:G H12:M H13:O H14:T (80) \\n#L##O##N##G##M##O##T# (30) \\nBingo! (50)\\n\\n';
        expect(service.formatAlternativeWord(validword)).toBe(expected);
    });

    it('should correctly format a valid word alternative for an added word on previously placed letters', () => {
        const stringWord = 'avion';
        const pointsWord = 30;
        const wordLetters = [
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'V', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'I', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'O', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'N', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];

        const validword = new ValidWord(
            stringWord,
            0,
            stringWord.length,
            0,
            0,
            false,
            Math.floor(BOARD_DIMENSION / 2),
            Math.floor(BOARD_DIMENSION / 2),
            stringWord.length,
            [{ letters: wordLetters, index: [0, 1, 3, 4] }],
            { wordsPoints: [{ word: stringWord, points: pointsWord }], totalPoints: pointsWord, isBingo: false },
        );
        const expected = 'H8:A H9:V H11:O H12:N (30) \\n#A##V#I#O##N# (30) \\n\\n';
        expect(service.formatAlternativeWord(validword)).toBe(expected);
    });
});
