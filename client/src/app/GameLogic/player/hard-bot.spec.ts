import { TestBed } from '@angular/core/testing';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { HardBot } from '@app/GameLogic/player/hard-bot';

describe('HardBot', () => {
    let hardBot: HardBot;
    let botCreatorService: BotCreatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BotCreatorService],
        });
        botCreatorService = TestBed.inject(BotCreatorService);
        hardBot = botCreatorService.createBot('Jimmy', 'hard') as HardBot;
    });

    it('should create an instance', () => {
        expect(hardBot).toBeTruthy();
    });

    it('setActive', () => {
        hardBot.setActive();
        expect().nothing();
    });

    it('playAction', () => {
        hardBot.playAction();
        expect().nothing();
    });

    it('exchangeAction', () => {
        hardBot.exchangeAction();
        expect().nothing();
    });

    it('passAction', () => {
        hardBot.passAction();
        expect().nothing();
    });
});
