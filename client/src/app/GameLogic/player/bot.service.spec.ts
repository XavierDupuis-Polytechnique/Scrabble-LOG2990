import { TestBed } from '@angular/core/testing';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { HardBot } from '@app/GameLogic/player/hard-bot';

import { BotService } from './bot.service';

describe('BotService', () => {
    let service: BotService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BotService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should create easy bot', () => {
        const b = service.createBot('Tim', 'easy');
        expect(b instanceof EasyBot).toBeTrue();
    });

    it('should create hard bot', () => {
        const b = service.createBot('Tim', 'hard');
        expect(b instanceof HardBot).toBeTrue();
    });
});
