/* eslint-disable dot-notation */
import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/game-logic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import { Message, MessageType } from '@app/game-logic/messages/message.interface';

describe('CommandParser', () => {
    let service: CommandParserService;
    let message: Message;
    let errorMessage: string;
    const errorMessageTest = (command: string | Command, testArgument: string | Command) => {
        expect(command).toEqual(testArgument);
    };

    const syntaxError0 = 'erreur de syntax: trop de paramètres entrés';
    const syntaxError1 = 'erreur de syntax: mot ou emplacement manquant';
    const syntaxError2 = 'erreur de syntax: ligne invalide';
    const syntaxError3 = 'erreur de syntax: mot invalide';
    const syntaxError4 = 'erreur de syntax: colonne invalide';
    const syntaxError5 = 'erreur de syntax: direction invalide';
    const syntaxError6 = 'erreur de syntax: les paramètres sont invalides';
    const syntaxError7 = 'erreur de syntax: colonne invalide';

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandParserService);
        message = { content: '!placer a1v allo', from: 'player', type: MessageType.Player1 };
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should be equal to the test command as it is the one pushed', () => {
        const from = message.from;
        const testCommand: Command = { from, type: CommandType.Debug, args: [] };
        service.parsedCommand$.subscribe((command) => {
            errorMessageTest(command, testCommand);
        });
        service.parse('!debug', message.from);
    });

    it('should return undefined as it is not a command', () => {
        message.content = 'Hier fut une bien belle journée';
        expect(service.parse(message.content, message.from)).toBe(undefined);
    });

    it('should send error message !manger est une commande invalide', () => {
        message.content = '!manger duGateau';
        const testError = '!manger est une entrée invalide';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, testError);
        });
        service.parse(message.content, message.from);
    });

    it('should be true', () => {
        expect(service.parse(message.content, message.from)).toBeTruthy();
    });

    it('should return !debug', () => {
        message.content = '!debug';
        expect(service.parse(message.content, message.from)).toBe(CommandType.Debug);
    });

    it('should send error message !PLACER est une commande invalide', () => {
        message.content = '!PLACER a1v bob';
        const testError = '!PLACER est une entrée invalide';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, testError);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError1, () => {
        message.content = '!placer a1v  ';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError1);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError3, () => {
        message.content = '!placer a1v -34';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError3);
        });

        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError0, () => {
        message.content = '!placer a1v mot mot';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError0);
        });
        service.parse(message.content, message.from);
    });

    it('testArg should be equal to expectedArg', () => {
        const testArg = ['h8v', 'çàé'];
        const expectedArg = ['h', '8', 'v', 'cae'];
        expect(service['stringToPlaceLetterArguments'](testArg)).toEqual(expectedArg);
    });

    it('should send error message ' + syntaxError1, () => {
        message.content = '!placer a1v    ';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError1);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError3, () => {
        message.content = '!placer a1v a';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError3);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError3, () => {
        message.content = '!placer a1v abcdefghijklmnop';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError3);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError7, () => {
        message.content = '!placer a-1v abc';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError7);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError4, () => {
        message.content = '!placer a16v abc';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError4);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError1, () => {
        message.content = '!placer a1V';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError1);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError2, () => {
        message.content = '!placer A1v allo';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError2);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError5, () => {
        message.content = '!placer a1V allo';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError5);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError6, () => {
        message.content = '!placer a12vv allo';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError6);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError6, () => {
        message.content = '!placer a1 allo';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError6);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError7, () => {
        message.content = '!placer abh allo';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError7);
        });
        service.parse(message.content, message.from);
    });

    it('should send error message ' + syntaxError7, () => {
        message.content = '!placer a1bh allo';

        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, syntaxError7);
        });
        service.parse(message.content, message.from);
    });

    it('should return type !placer', () => {
        message.content = '!placer a1v allo';
        expect(service.parse(message.content, message.from)).toBeTruthy();
    });

    it('should be of type Exchange as the args are valid ', () => {
        message.content = '!échanger abc';
        expect(service.parse(message.content, message.from)).toEqual(CommandType.Exchange);
    });

    it("should send error message error 'les parametres sont invalide as' upperCases are not accepted", () => {
        message.content = '!échanger aBc';

        errorMessage = 'les paramètres sont invalides';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, errorMessage);
        });
        service.parse(message.content, message.from);
    });

    it('should be of type !échanger as 7 letters is the maximum', () => {
        message.content = '!échanger aaaaaaa';
        expect(service.parse(message.content, message.from)).toEqual(CommandType.Exchange);
    });
    it('should send error message error as 7 letters is the maximum', () => {
        message.content = '!échanger baaaaaaaaac';
        errorMessage = 'Commande impossible à réaliser: un maximum de 7 lettres peuvent être échangé';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, errorMessage);
        });
        service.parse(message.content, message.from);
    });

    it('should send error when place letter params arent valid', () => {
        errorMessage = 'erreur de syntax: direction invalide';
        service.errorMessage$.subscribe((error) => {
            errorMessageTest(error, errorMessage);
        });
        const placeLetterParams = ['a1a', 'b', 'c', 'd'];
        service['isPlaceLetterParameterValid'](placeLetterParams);
    });

    it('should not validate a row with a value more then o', () => {
        const row = 'p';
        expect(service['isValidRow'](row)).toBeFalse();
    });

    it('should not validate word when column is not in board delimitation', () => {
        const col = 0;
        expect(service['isValidColumn'](col)).toBeFalse();
    });
});
