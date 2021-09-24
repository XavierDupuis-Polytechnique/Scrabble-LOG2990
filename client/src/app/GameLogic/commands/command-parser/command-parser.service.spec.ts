import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';

describe('CommandParser', () => {
    let service: CommandParserService;
    let message: Message;
    const syntaxError1 = 'mot ou emplacement manquant';
    const syntaxError2 = 'erreur de syntax: ligne hors champ';
    const syntaxError3 = 'erreur de syntax: mot invalide';
    const syntaxError4 = 'erreur de syntax: colonne hors champ';
    const syntaxError5 = 'erreur de syntax: direction invalide';
    //  const syntaxError6 = 'erreur de syntax: les paramètres sont invalide';
    const syntaxError7 = 'erreur de syntax: le mot depasse la grille';
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommandParserService);
        message = { content: '!placer a1v allo', from: 'player', type: MessageType.Player1 };
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    /// //////////////// SEND COMMAND ///////////////////////////
    /// //////////////// CREATE COMMAND /////////////////////////
    /// ////////////////     Parse      /////////////////////////
    // passer une fausse commande
    it('should throw !manger est une commande invalide', () => {
        message.content = '!manger duGateau';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError('!manger est une commande invalide');
    });

    // passer une vrai commande
    it('should be return true', () => {
        expect(service.parse(message)).toBeTruthy();
    });
    // passer une commande en majuscule
    it('should throw !PLACER est une commande invalide', () => {
        message.content = '!PLACER a1v bob';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError('!PLACER est une commande invalide');
    });
    // passer un espace pour placer lettre
    it('should throw ' + syntaxError1, () => {
        message.content = '!placer a1v  ';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError1);
    });

    it('should throw ' + syntaxError3, () => {
        expect(() => {
            service.placeLetterFormatter(['a1v', ' ']);
        }).toThrowError(syntaxError3);
    });

    // passer plusieurs espace pour placer lettre//////////////////////////////////
    it('should throw ' + syntaxError3, () => {
        expect(() => {
            service.placeLetterFormatter(['a1v', '   ']);
        }).toThrowError(syntaxError3);
    });

    it('should throw ' + syntaxError1, () => {
        message.content = '!placer a1v    ';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError1);
    });
    // mettre 1 lettre
    it('should throw ' + syntaxError3, () => {
        message.content = '!placer a1v a';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError3);
    });
    // mettre 16 lettre
    it('should throw ' + syntaxError7, () => {
        message.content = '!placer a1v abcdefghijklmnop';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError7);
    });
    // mettre coordonné negative
    it('should be return true', () => {
        message.content = '!placer a-1v abc';
        expect(service.parse(message)).toBeTruthy();
    });
    // mettre coordonné depassant 15
    it('should throw ' + syntaxError4, () => {
        message.content = '!placer a16v abc';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError4);
    });
    // pas de lettres
    it('should throw ' + syntaxError1, () => {
        message.content = '!placer a1V';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError1);
    });
    // coordonné en majuscule
    it('should throw ' + syntaxError2, () => {
        message.content = '!placer A1v allo';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError2);
    });

    it('should throw ' + syntaxError5, () => {
        message.content = '!placer a1V allo';
        expect(() => {
            expect(service.parse(message));
        }).toThrowError(syntaxError5);
    });
    // bonne coordonné
    it('should be return true', () => {
        message.content = '!placer a1v allo';
        expect(service.parse(message)).toBeTruthy();
    });
});
