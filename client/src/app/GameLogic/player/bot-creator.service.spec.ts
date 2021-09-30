import { TestBed } from '@angular/core/testing';
import { BotCreatorService } from './bot-creator.service';

describe('BotCreatorService', () => {
    let botCreator: BotCreatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
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
