import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/GameLogic/commands/command-executer/command-executer.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BotCreatorService } from './bot-creator.service';

describe('BotCreatorService', () => {
    let botCreator: BotCreatorService;
    const dict = new DictionaryService();
    const mockBotMessageService = jasmine.createSpyObj('BotMessagesService', ['sendAction']);
    const mockCommandExecuter = jasmine.createSpyObj('CommandExecuterService', ['resetDebug']);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: BotMessagesService, useValue: mockBotMessageService },
                { provide: CommandExecuterService, useValue: mockCommandExecuter },
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
