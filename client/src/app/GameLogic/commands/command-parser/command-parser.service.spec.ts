import { TestBed } from '@angular/core/testing';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { Message, MessageType } from '@app/GameLogic/messages/message.interface';

describe('CommandParser', () => {
    let service: CommandParserService;
    let message: Message;
    const syntaxError1 = 'mot ou emplacement manquant';
    const syntaxError2 = 'erreur de syntax: ligne hors champ';
    const syntaxError3 = 'erreur de syntax: colonne hors champ';
    const syntaxError4 = 'erreur de syntax: direction invalide';
    const syntaxError5 = 'erreur de syntax: les paramètres sont invalide';
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
    it('should be return true', () => {
        message.content = '!manger duGateau';
        expect(service.parse(message)).toThrowError('!manger est une commande invalide');
    });

    // passer une vrai commande
    it('should be return true', () => {
        expect(service.parse(message)).toBeTruthy();
    });
    // passer une commande en majuscule
    it('should be return true', () => {
        message.content = '!PLACER a1V bob';
        expect(service.parse(message)).toThrowError(syntaxError4);
    });
    // passer un espace pour placer lettre
    it('should be return true', () => {
        message.content = '!placer a1v  ';
        expect(service.parse(message)).toBeTruthy();
    });

    it('should be return true', () => {
        expect(() => {
            service.placeLetterArgVerifier(['a1v', ' ']);
        }).toThrowError("Action couldn't be validated");
    });

    // passer plusieurs espace pour placer lettre//////////////////////////////////
    // it('should be return true', () => {
    //     expect(() => {
    //         service.placeLetterArgVerifier(['a1v', '   ']);
    //     }).to;
    // });

    it('should be return true', () => {
        message.content = '!placer a1v    ';
        expect(service.parse(message)).toBeTruthy();
    });
    // mettre 1 lettre
    it('should be return true', () => {
        message.content = '!placer a1v a';
        expect(service.parse(message)).toBeTruthy();
    });
    // mettre 16 lettre
    it('should be return true', () => {
        message.content = '!placer a1v abcdefghijklmnop';
        expect(service.parse(message)).toBeTruthy();
    });
    // mettre coordonné negative
    it('should be return true', () => {
        message.content = '!placer a-1v abc';
        expect(service.parse(message)).toBeTruthy();
    });
    // mettre coordonné depassant 15
    it('should be return true', () => {
        message.content = '!placer a16v abc';
        expect(service.parse(message)).toBeTruthy();
    });
    // pas de lettres
    it('should be return true', () => {
        message.content = '!placer a1V';
        expect(service.parse(message)).toBeTruthy();
    });
    // coordonné en majuscule
    it('should be return true', () => {
        message.content = '!placer A1v allo';
        expect(service.parse(message)).toThrowError(syntaxError2);
    });

    it('should be return true', () => {
        message.content = '!placer a1V allo';
        expect(service.parse(message)).toBeTruthy();
    });
    // bonne coordonné
    it('should be return true', () => {
        message.content = '!placer a1v allo';
        expect(service.parse(message)).toBeTruthy();
    });
});
