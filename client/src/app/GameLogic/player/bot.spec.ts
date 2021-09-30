/* eslint-disable @typescript-eslint/no-magic-numbers*/
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION } from '@app/GameLogic/constants';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';

describe('Bot', () => {
    TestBed.configureTestingModule({
        providers: [BotCreatorService, BotMessagesService],
    });
    let bot: EasyBot;
    let botCreator: BotCreatorService;
    let botMessage: BotMessagesService;
    let spySendAction: jasmine.Spy;

    beforeEach(() => {
        botCreator = TestBed.inject(BotCreatorService);
        botMessage = TestBed.inject(BotMessagesService);
        spySendAction = spyOn(botMessage, 'sendAction');
        bot = botCreator.createBot('testBot', 'easy') as EasyBot;
    });

    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should generate a different name', () => {
        const numberOfTime = 1000;
        const opponentName = 'Jimmy';
        for (let i = 0; i < numberOfTime; i++) {
            const botName = bot.generateBotName(opponentName);
            const sameName: boolean = botName === opponentName;
            expect(sameName).toBeFalsy();
        }
    });

    it('should play before 3 seconds', fakeAsync(() => {
        bot.startTimerAction();
        bot.chooseAction(new PassTurn(bot));
        tick(TIME_BEFORE_PICKING_ACTION);
        expect(spySendAction.calls.argsFor(0)[0]).toBeInstanceOf(PassTurn);
        tick(TIME_BEFORE_PASS);
    }));

    it('should play after 3 seconds', fakeAsync(() => {
        bot.startTimerAction();
        tick(TIME_BEFORE_PICKING_ACTION);
        bot.chooseAction(new PassTurn(bot));
        expect(spySendAction.calls.argsFor(0)[0]).toBeInstanceOf(PassTurn);
        tick(TIME_BEFORE_PASS);
    }));

    it('should pass turn after 20 seconds', fakeAsync(() => {
        bot.startTimerAction();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
        expect(spySendAction.calls.argsFor(0)[0]).toBeInstanceOf(PassTurn);
    }));
});
