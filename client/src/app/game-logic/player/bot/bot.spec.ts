/* eslint-disable dot-notation */
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { TIME_BEFORE_PASS, TIME_BEFORE_PICKING_ACTION } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { BotCalculatorService } from '@app/game-logic/player/bot-calculator/bot-calculator.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { EasyBot } from '@app/game-logic/player/bot/easy-bot';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotType } from '@app/services/bot-http.service';
import { of } from 'rxjs';

describe('Bot', () => {
    const dictHttpServiceMock = jasmine.createSpyObj('DictHttpService', ['getDictionary']);
    const dict = new DictionaryService(dictHttpServiceMock);
    let bot: EasyBot;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const mockBotHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);
    const obs = of(['Test1', 'Test2', 'Test3']);
    mockBotHttpService.getDataInfo.and.returnValue(obs);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: BotMessagesService, useValue: botMessageMock },
                { provide: BotHttpService, useValue: mockBotHttpService },
            ],
        });
        bot = new EasyBot(
            'test',
            TestBed.inject(BoardService),
            TestBed.inject(DictionaryService),
            TestBed.inject(BotCalculatorService),
            TestBed.inject(WordSearcher),
            TestBed.inject(BotMessagesService),
            TestBed.inject(GameInfoService),
            TestBed.inject(CommandExecuterService),
            TestBed.inject(ActionCreatorService),
            TestBed.inject(BotHttpService),
            BotType.Easy,
        );
    });

    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should generate a different name', () => {
        const numberOfTime = 1000;
        const opponentName = 'Jimmy';
        for (let i = 0; i < numberOfTime; i++) {
            const botName = bot['generateBotName'](opponentName);
            const sameName: boolean = botName === opponentName;
            expect(sameName).toBeFalsy();
        }
    });

    it('should play before 3 seconds', fakeAsync(() => {
        bot.startTimerAction();
        bot.chooseAction(new PassTurn(bot));
        tick(TIME_BEFORE_PICKING_ACTION);
        expect(botMessageMock.sendAction.calls.argsFor(0)[0]).toBeInstanceOf(PassTurn);
        tick(TIME_BEFORE_PASS);
    }));

    it('should play after 3 seconds', fakeAsync(() => {
        bot.startTimerAction();
        tick(TIME_BEFORE_PICKING_ACTION);
        bot.chooseAction(new PassTurn(bot));
        expect(botMessageMock.sendAction.calls.argsFor(0)[0]).toBeInstanceOf(PassTurn);
        tick(TIME_BEFORE_PASS);
    }));

    it('should pass turn after 20 seconds', fakeAsync(() => {
        bot.startTimerAction();
        tick(TIME_BEFORE_PICKING_ACTION);
        tick(TIME_BEFORE_PASS);
        expect(botMessageMock.sendAction.calls.argsFor(0)[0]).toBeInstanceOf(PassTurn);
    }));
});
