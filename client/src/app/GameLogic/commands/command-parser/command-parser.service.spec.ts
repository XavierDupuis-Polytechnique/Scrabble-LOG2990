/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { CommandType } from '@app/GameLogic/commands/command.interface';
import { Message } from '@app/GameLogic/messages/message.interface';
import { CommandParserService } from './command-parser.service';

describe('Service: CommandParser', () => {
    let messageTestTrue: Message;
    let fakeMessage: string[];
    let validCommands: CommandType[];
    let fakeCommand: CommandType;
    let messageTestFalse: Message;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [CommandParserService, CommandType],
        });
        validCommands = Object.values(CommandType);
    });

    it('should ...', inject([CommandParserService], (service: CommandParserService) => {
        expect(service).toBeTruthy();
    }));
    it('verifyCommand should not return true since there is no message', inject([CommandParserService], (service: CommandParserService) => {
        expect(service.verifyCommand(messageTestFalse)).toBeUndefined();
    }));
    it('createCommand should not return true as the command does not exist', inject([CommandParserService], (service: CommandParserService) => {
        fakeCommand = CommandType.Help;
        expect(service.createCommand(fakeMessage, fakeCommand)).toBeUndefined();
    }));

    // test d'une commande pas rapport
    it('should not return true as it is not a real command', inject([CommandParserService], (service: CommandParserService) => {
        messageTestFalse = { content: '!fausseCommande oh non! pas la ceinture, PAS LA CEINTUUUURE!!!', from: 'player 1' };
        expect(service.verifyCommand(messageTestFalse)).toBeFalse();
    }));
    // test d'une commande vide
    // fonction lambda. throw error
    it('should return true as they are all real', inject([CommandParserService], (service: CommandParserService) => {
        validCommands.forEach((command) => {
            messageTestTrue = { content: command, from: 'playa' };
            expect(service.verifyCommand(messageTestTrue)).toBeTruthy();
        });
    }));
});
