import { TestBed } from '@angular/core/testing';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import { DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BotCalculatorService } from '@app/game-logic/player/bot-calculator/bot-calculator.service';
import { BotMessagesService } from '@app/game-logic/player/bot-message/bot-messages.service';
import { EasyBot } from '@app/game-logic/player/bot/easy-bot';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotType } from '@app/services/bot-http.service';
import { of } from 'rxjs';

describe('Player', () => {
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    let bot: EasyBot;
    let boardService: BoardService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const mockBotHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);

    const obs = of(['Test1', 'Test2', 'Test3']);
    mockBotHttpService.getDataInfo.and.returnValue(obs);

    const randomBonus = false;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: BotMessagesService, useValue: botMessageMock },
                { provide: BotHttpService, useValue: mockBotHttpService },
            ],
        });
        boardService = TestBed.inject(BoardService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);
        bot = new EasyBot(
            'test',
            boardService,
            dict,
            TestBed.inject(BotCalculatorService),
            TestBed.inject(WordSearcher),
            TestBed.inject(BotMessagesService),
            gameInfo,
            TestBed.inject(CommandExecuterService),
            TestBed.inject(ActionCreatorService),
            TestBed.inject(BotHttpService),
            BotType.Easy,
        );
        gameInfo.receiveGame(new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService));
    });

    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should have a full letterRack', () => {
        expect(bot.isLetterRackEmpty).toBeTruthy();
    });

    it('should have a full letterRack', () => {
        const letterRack: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letterRack;
        expect(bot.isLetterRackFull).toBeTruthy();
    });

    it('should throw Some letters are invalid (getLettersFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        const invalidRack: Letter[] = [
            { char: '?', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letterRack;
        const result = () => {
            bot.getLettersFromRack(invalidRack);
        };

        expect(result).toThrowError('Some letters are invalid');
    });

    it('should throw Some letters are invalid (getLettersFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        const invalidRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        bot.letterRack = letterRack;
        const result = () => {
            bot.getLettersFromRack(invalidRack);
        };

        expect(result).toThrowError('Some letters are invalid');
    });

    it('should throw Some letters are invalid (removeLetterFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        const removeFromRack: Letter[] = [
            { char: '?', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letterRack;
        const result = () => {
            bot.removeLetterFromRack(removeFromRack);
        };

        expect(result).toThrowError('The letter you trying to remove is not in letter rack');
    });

    it('should throw Some letters are invalid (removeLetterFromRack)', () => {
        const letterRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        const removeFromRack: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
            { char: 'A', value: 1 },
        ];
        bot.letterRack = letterRack;
        const result = () => {
            bot.removeLetterFromRack(removeFromRack);
        };

        expect(result).toThrowError('The letter you trying to remove is not in letter rack');
    });
});
