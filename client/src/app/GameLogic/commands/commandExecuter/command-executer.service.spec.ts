import { TestBed } from '@angular/core/testing';
import { ActionCompilerService } from '@app/GameLogic/commands/actionCompiler/action-compiler.service';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Observable, Subject } from 'rxjs';
import { CommandExecuterService } from './command-executer.service';

describe('CommandExecuterService', () => {
    let service: CommandExecuterService;
    let messageServiceSpy: jasmine.SpyObj<MessagesService>;
    let actionCompilerServiceSpy: jasmine.SpyObj<ActionCompilerService>;
    let gameManager: jasmine.SpyObj<GameManagerService>;
    // let gameManager: GameManagerService;

    let mockNewGame$: Subject<void>;

    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage', 'receiveMessage', 'clearLog']);
        actionCompilerServiceSpy = jasmine.createSpyObj('ActionCompilerService', ['translate']);
        gameManager = jasmine.createSpyObj('GameManagerService', ['startGame', 'stopGame'], ['newGame$']);
        mockNewGame$ = new Subject<void>();
        (Object.getOwnPropertyDescriptor(gameManager, 'newGame$')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(mockNewGame$);
        TestBed.configureTestingModule({
            providers: [
                CommandExecuterService,
                { provide: GameManagerService, useValue: gameManager },
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
            from: ' ',
        };
        service.execute(command);
        expect(service.isDebugModeActivated).toBe(true);
    });

    it('should deactivate debug', () => {
        const command = {
            type: CommandType.Debug,
            from: ' ',
        };
        service.execute(command);
        service.execute(command);
        expect(service.isDebugModeActivated).toBe(false);
    });

    it('should call #translate from action compiler', () => {
        const actionCommands: Command[] = [
            { type: CommandType.Exchange, from: ' ' },
            { type: CommandType.Pass, from: ' ' },
            { type: CommandType.Place, from: ' ' },
        ];
        for (const actionCommand of actionCommands) {
            service.execute(actionCommand);
        }
        expect(actionCompilerServiceSpy.translate.calls.count()).toBe(actionCommands.length);
    });

    it('should not call #translate from action compiler', () => {
        const notActionCommands: Command[] = [
            { type: CommandType.Debug, from: ' ' },
            { type: CommandType.Help, from: ' ' },
        ];
        for (const actionCommand of notActionCommands) {
            service.execute(actionCommand);
        }
        expect(actionCompilerServiceSpy.translate.calls.count()).toBe(0);
    });

    it('should call #receiveSystemMessage from messageService', () => {
        const debugCommand = { type: CommandType.Debug, from: ' ' };
        service.execute(debugCommand);
        expect(messageServiceSpy.receiveSystemMessage.calls.count()).toBe(1);
    });

    it('should not call #receiveSystemMessage from messageService', () => {
        const notDebugCommands: Command[] = [
            { type: CommandType.Exchange, from: ' ' },
            { type: CommandType.Pass, from: ' ' },
            { type: CommandType.Place, from: ' ' },
            { type: CommandType.Help, from: ' ' },
        ];
        for (const notDebugCommand of notDebugCommands) {
            service.execute(notDebugCommand);
        }
        expect(messageServiceSpy.receiveSystemMessage.calls.count()).toBe(0);
    });

    it('should reset debug on newGame', () => {
        const command: Command = {
            from: 'asdfg',
            type: CommandType.Debug,
        };
        service.execute(command);
        service.resetDebug();
        expect(service.isDebugModeActivated).toBeFalsy();
        gameManager.stopGame();
    });
});
