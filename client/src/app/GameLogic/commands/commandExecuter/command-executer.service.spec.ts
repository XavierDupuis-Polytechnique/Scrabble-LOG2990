import { TestBed } from '@angular/core/testing';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { CommandExecuterService } from './command-executer.service';

describe('CommandExecuterService', () => {
    let service: CommandExecuterService;
    let messageServiceSpy: jasmine.SpyObj<MessagesService>;
    let actionCompilerServiceSpy: jasmine.SpyObj<ActionCompilerService>;

    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage', 'receiveMessage']);
        actionCompilerServiceSpy = jasmine.createSpyObj('ActionCompilerService', ['translate']);
        TestBed.configureTestingModule({
            providers: [
                CommandExecuterService,
                { provide: MessagesService, useValue: messageServiceSpy },
                { provide: ActionCompilerService, useValue: actionCompilerServiceSpy },
            ],
        });
        service = TestBed.inject(CommandExecuterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should activate debug', () => {
        const command = {
            type: CommandType.Debug,
        };
        service.execute(command);
        expect(service.isDebugModeActivated).toBe(true);
    });

    it('should deactivate debug', () => {
        const command = {
            type: CommandType.Debug,
        };
        service.execute(command);
        service.execute(command);
        expect(service.isDebugModeActivated).toBe(false);
    });

    it('should call #translate from action compiler', () => {
        const actionCommands: Command[] = [{ type: CommandType.Exchange }, { type: CommandType.Pass }, { type: CommandType.Place }];
        for (const actionCommand of actionCommands) {
            service.execute(actionCommand);
        }
        expect(actionCompilerServiceSpy.translate.calls.count()).toBe(actionCommands.length);
    });

    it('should not call #translate from action compiler', () => {
        const notActionCommands: Command[] = [{ type: CommandType.Debug }, { type: CommandType.Help }];
        for (const actionCommand of notActionCommands) {
            service.execute(actionCommand);
        }
        expect(actionCompilerServiceSpy.translate.calls.count()).toBe(0);
    });

    it('should call #receiveSystemMessage from messageService', () => {
        const debugCommand = { type: CommandType.Debug };
        service.execute(debugCommand);
        expect(messageServiceSpy.receiveSystemMessage.calls.count()).toBe(1);
    });

    it('should not call #receiveSystemMessage from messageService', () => {
        const notDebugCommands: Command[] = [
            { type: CommandType.Exchange },
            { type: CommandType.Pass },
            { type: CommandType.Place },
            { type: CommandType.Help },
        ];
        for (const notDebugCommand of notDebugCommands) {
            service.execute(notDebugCommand);
        }
        expect(messageServiceSpy.receiveSystemMessage.calls.count()).toBe(0);
    });
});
