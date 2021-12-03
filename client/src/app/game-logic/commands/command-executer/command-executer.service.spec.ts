/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ActionCompilerService } from '@app/game-logic/commands/action-compiler/action-compiler.service';
import { CommandParserService } from '@app/game-logic/commands/command-parser/command-parser.service';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import { END_LINE, RESERVE_NOT_ACCESSIBLE } from '@app/game-logic/constants';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { Observable, Subject } from 'rxjs';
import { CommandExecuterService } from './command-executer.service';

describe('CommandExecuterService', () => {
    let service: CommandExecuterService;
    let messageServiceSpy: jasmine.SpyObj<MessagesService>;
    let actionCompilerServiceSpy: jasmine.SpyObj<ActionCompilerService>;
    let gameManager: jasmine.SpyObj<GameManagerService>;
    let commandParserService: jasmine.SpyObj<CommandParserService>;
    let gameInfoSpy: jasmine.SpyObj<GameInfoService>;
    let mockNewGame$: Subject<void>;
    let mockParsedCommand$: Subject<Command>;
    let fakeLetterOccurences: Map<string, number>;

    let mockHttpClient: HttpTestingController;
    beforeEach(() => {
        messageServiceSpy = jasmine.createSpyObj('MessagesService', ['receiveSystemMessage', 'receiveMessage', 'receiveErrorMessage', 'clearLog']);
        actionCompilerServiceSpy = jasmine.createSpyObj('ActionCompilerService', ['translate']);
        gameManager = jasmine.createSpyObj('GameManagerService', ['startGame', 'stopGame'], ['newGame$']);
        mockNewGame$ = new Subject<void>();
        (Object.getOwnPropertyDescriptor(gameManager, 'newGame$')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(mockNewGame$);
        commandParserService = jasmine.createSpyObj('CommandParserService', [], ['parsedCommand$']);
        mockParsedCommand$ = new Subject<Command>();
        (Object.getOwnPropertyDescriptor(commandParserService, 'parsedCommand$')?.get as jasmine.Spy<() => Observable<Command>>).and.returnValue(
            mockParsedCommand$,
        );
        gameInfoSpy = jasmine.createSpyObj('GameInfoService', [], ['letterOccurences', 'isOnlineGame', 'gameId']);
        fakeLetterOccurences = new Map([
            ['A', 4],
            ['B', 3],
            ['C', 1],
        ]);
        (Object.getOwnPropertyDescriptor(gameInfoSpy, 'letterOccurences')?.get as jasmine.Spy<() => Map<string, number>>).and.returnValue(
            fakeLetterOccurences,
        );
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [
                CommandExecuterService,
                { provide: GameManagerService, useValue: gameManager },
                { provide: MessagesService, useValue: messageServiceSpy },
                { provide: ActionCompilerService, useValue: actionCompilerServiceSpy },
                { provide: CommandParserService, useValue: commandParserService },
                { provide: GameInfoService, useValue: gameInfoSpy },
            ],
        });
        service = TestBed.inject(CommandExecuterService);
        mockHttpClient = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should activate debug', () => {
        const command = {
            type: CommandType.Debug,
            from: ' ',
        };
        service['execute'](command);
        expect(service.isDebugModeActivated).toBe(true);
    });

    it('should deactivate debug', () => {
        const command = {
            type: CommandType.Debug,
            from: ' ',
        };
        service['execute'](command);
        service['execute'](command);
        expect(service.isDebugModeActivated).toBe(false);
    });

    it('should call #translate from action compiler', () => {
        const actionCommands: Command[] = [
            { type: CommandType.Exchange, from: ' ' },
            { type: CommandType.Pass, from: ' ' },
            { type: CommandType.Place, from: ' ' },
        ];
        for (const actionCommand of actionCommands) {
            service['execute'](actionCommand);
        }
        expect(actionCompilerServiceSpy.translate.calls.count()).toBe(actionCommands.length);
    });

    it('should not call #translate from action compiler', () => {
        const notActionCommands: Command[] = [
            { type: CommandType.Debug, from: ' ' },
            { type: CommandType.Help, from: ' ' },
        ];
        for (const actionCommand of notActionCommands) {
            service['execute'](actionCommand);
        }
        expect(actionCompilerServiceSpy.translate.calls.count()).toBe(0);
    });

    it('should call #receiveSystemMessage from messageService', () => {
        const debugCommand = { type: CommandType.Debug, from: ' ' };
        service['execute'](debugCommand);
        expect(messageServiceSpy.receiveSystemMessage.calls.count()).toBe(1);
    });

    it('should not call #receiveSystemMessage from messageService', () => {
        const notDebugCommands: Command[] = [
            { type: CommandType.Exchange, from: ' ' },
            { type: CommandType.Pass, from: ' ' },
            { type: CommandType.Place, from: ' ' },
        ];
        for (const notDebugCommand of notDebugCommands) {
            service['execute'](notDebugCommand);
        }
        expect(messageServiceSpy.receiveSystemMessage.calls.count()).toBe(0);
    });

    it('should reset debug on newGame', () => {
        const command: Command = {
            from: 'asdfg',
            type: CommandType.Debug,
        };
        service['execute'](command);
        service.resetDebug();
        expect(service.isDebugModeActivated).toBeFalsy();
        gameManager.stopGame();
    });

    it('should execute parsed command', () => {
        const command: Command = {
            from: 'Tim',
            type: CommandType.Debug,
        };
        const spy = spyOn<any>(service, 'execute');
        mockParsedCommand$.next(command);
        expect(spy).toHaveBeenCalled();
    });

    it('should not execute reserve command while not on debug', () => {
        const command = {
            from: 'Tim',
            type: CommandType.Reserve,
        };
        service['execute'](command);
        expect(messageServiceSpy.receiveErrorMessage).toHaveBeenCalledWith(RESERVE_NOT_ACCESSIBLE);
    });

    it('should execute reserve command', () => {
        const debug = {
            from: 'Tim',
            type: CommandType.Debug,
        };
        service['execute'](debug);
        messageServiceSpy.receiveSystemMessage.calls.reset();
        const command = {
            from: 'Tim',
            type: CommandType.Reserve,
        };
        service['execute'](command);
        expect(messageServiceSpy.receiveSystemMessage).toHaveBeenCalled();
    });

    it('should execute reserve command properly', () => {
        const debug = {
            from: 'Tim',
            type: CommandType.Debug,
        };
        service['execute'](debug);
        messageServiceSpy.receiveSystemMessage.calls.reset();
        const command = {
            from: 'Tim',
            type: CommandType.Reserve,
        };
        service['execute'](command);
        const expectedMessage = `Reserve:${END_LINE}A : 4${END_LINE}B : 3${END_LINE}C : 1${END_LINE}`;
        expect(messageServiceSpy.receiveSystemMessage).toHaveBeenCalledOnceWith(expectedMessage);
    });

    it('showOnlineLetter should show correct format', () => {
        const commandReserve: Command = { type: CommandType.Reserve, from: 'test' };
        const commandDebug: Command = { type: CommandType.Debug, from: 'test' };

        service['execute'](commandDebug);
        (Object.getOwnPropertyDescriptor(gameInfoSpy, 'isOnlineGame')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        (Object.getOwnPropertyDescriptor(gameInfoSpy, 'gameId')?.get as jasmine.Spy<() => string>).and.returnValue('1');

        service['execute'](commandReserve);
        const req = mockHttpClient.expectOne('http://localhost:3000/api/servergame/letterbag?gameId=1');
        const obj = {
            A: 2,
            B: 3,
        };
        req.flush(obj);
        expect(messageServiceSpy.receiveSystemMessage.calls.argsFor(1)[0]).toEqual('Reserve:\\nA : 2\\nB : 3\\n');
    });

    it('should execute command help', () => {
        const help = {
            from: 'Tim',
            type: CommandType.Help,
        };
        service['execute'](help);
        expect(messageServiceSpy.receiveSystemMessage).toHaveBeenCalled();
    });
});
