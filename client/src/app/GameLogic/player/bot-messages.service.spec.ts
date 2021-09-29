import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/GameLogic/commands/commandExecuter/command-executer.service';
import { BOARD_DIMENSION } from '@app/GameLogic/constants';
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
        const wordLetters = [
            { letterObject: { char: 'A', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
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
            30,
        );
        const expected = 'H8:A H9:V H10:I H11:O H12:N (30) \\n#A##V##I##O##N#\\n\\n';
        expect(service.formatAlternativeWord(validword)).toBe(expected);
    });
});
