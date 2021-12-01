import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { BotHttpService } from '@app/services/bot-http.service';
import { of } from 'rxjs';
import { BotCreatorService } from './bot-creator.service';

describe('BotCreatorService', () => {
    let botCreator: BotCreatorService;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    const mockBotMessageService = jasmine.createSpyObj('BotMessagesService', ['sendAction']);
    const mockCommandExecuter = jasmine.createSpyObj('CommandExecuterService', ['resetDebug']);
    const mockBotHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);
    const obs = of(['Test1', 'Test2', 'Test3']);
    mockBotHttpService.getDataInfo.and.returnValue(obs);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: BotMessagesService, useValue: mockBotMessageService },
                { provide: CommandExecuterService, useValue: mockCommandExecuter },
                { provide: BotHttpService, useValue: mockBotHttpService },
            ],
        });
        botCreator = TestBed.inject(BotCreatorService);
    });

    it('should be created', () => {
        expect(botCreator).toBeTruthy();
    });

    it('should create easy bot', () => {
        const easyBot = botCreator.createBot('Tim', 'easy');
        expect(easyBot).toBeTruthy();
    });

    it('should create hard bot', () => {
        const hardBot = botCreator.createBot('Tim', 'hard');
        expect(hardBot).toBeTruthy();
    });
});
