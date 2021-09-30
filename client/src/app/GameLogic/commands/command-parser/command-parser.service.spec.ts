import { TestBed } from '@angular/core/testing';
import * as commandParserService from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { EMPTY_CHAR } from '@app/GameLogic/constants';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';

describe('CommandParser', () => {
    let service: commandParserService.CommandParserService;
    let message: Message;
    const syntaxError1 = 'mot ou emplacement manquant';
    const syntaxError2 = 'erreur de syntax: ligne hors champ';
    const syntaxError3 = 'erreur de syntax: mot invalide';
    const syntaxError4 = 'erreur de syntax: colonne hors champ';
    const syntaxError5 = 'erreur de syntax: direction invalide';
    const syntaxError6 = 'erreur de syntax: les paramètres sont invalides';
    const syntaxError7 = 'erreur de syntax: colonne invalide';
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(commandParserService.CommandParserService);
        message = { content: '!placer a1v allo', from: 'player', type: MessageType.Player1 };
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be equal to the test command as it is the one pushed', () => {
        const from = message.from;
        const testCommand: Command = { from, type: CommandType.Debug, args: [] };
        service.parsedCommand$.subscribe((command) => {
            expect(command).toEqual(testCommand);
        });
        service.parse('!debug', message.from);
    });

    it('should return false as it is not a command', () => {
        message.content = 'Hier fut une bien belle journée';
        expect(service.parse(message.content, message.from)).toBe(false);
    });

    it('should throw !manger est une commande invalide', () => {
        message.content = '!manger duGateau';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError('!manger est une entrée invalide');
    });

    it('should be return true', () => {
        expect(service.parse(message.content, message.from)).toBeTruthy();
    });

    it('should be return true', () => {
        message.content = '!debug';
        expect(service.parse(message.content, message.from)).toBe(true);
    });

    it('should throw !PLACER est une commande invalide', () => {
        message.content = '!PLACER a1v bob';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError('!PLACER est une entrée invalide');
    });

    it('should throw ' + syntaxError1, () => {
        message.content = '!placer a1v  ';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError1);
    });

    it('should throw ' + syntaxError3, () => {
        expect(() => {
            service.placeLetterFormatter(['a1v', EMPTY_CHAR]);
        }).toThrowError(syntaxError3);
    });

    it('should throw ' + syntaxError3, () => {
        expect(() => {
            service.placeLetterFormatter(['a1v', EMPTY_CHAR + EMPTY_CHAR + EMPTY_CHAR]);
        }).toThrowError(syntaxError3);
    });

    it('should be return true', () => {
        const testArg = ['h8v', 'çàé'];
        const expectedArg = ['h', '8', 'v', 'cae'];
        expect(service.placeLetterFormatter(testArg)).toEqual(expectedArg);
    });

    it('should throw ' + syntaxError1, () => {
        message.content = '!placer a1v    ';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError1);
    });

    it('should throw ' + syntaxError3, () => {
        message.content = '!placer a1v a';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError3);
    });

    it('should throw ' + syntaxError3, () => {
        message.content = '!placer a1v abcdefghijklmnop';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError3);
    });

    it('should throw ' + syntaxError7, () => {
        message.content = '!placer a-1v abc';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError7);
    });

    it('should throw ' + syntaxError4, () => {
        message.content = '!placer a16v abc';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError4);
    });

    it('should throw ' + syntaxError1, () => {
        message.content = '!placer a1V';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError1);
    });

    it('should throw ' + syntaxError2, () => {
        message.content = '!placer A1v allo';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError2);
    });

    it('should throw ' + syntaxError5, () => {
        message.content = '!placer a1V allo';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError5);
    });

    it('should throw ' + syntaxError6, () => {
        message.content = '!placer a12vv allo';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError6);
    });

    it('should throw ' + syntaxError6, () => {
        message.content = '!placer a1 allo';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError6);
    });

    it('should throw ' + syntaxError7, () => {
        message.content = '!placer abh allo';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError7);
    });

    it('should throw ' + syntaxError7, () => {
        message.content = '!placer a1bh allo';
        expect(() => {
            service.parse(message.content, message.from);
        }).toThrowError(syntaxError7);
    });

    it('should be return true', () => {
        message.content = '!placer a1v allo';
        expect(service.parse(message.content, message.from)).toBeTruthy();
    });
});
