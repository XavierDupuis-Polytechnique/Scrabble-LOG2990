import { TestBed } from '@angular/core/testing';
import { CommandExecuterService } from '@app/GameLogic/commands/command-executer/command-executer.service';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/solo-game/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-message/bot-messages.service';
import { EasyBot } from '@app/GameLogic/player/bot/easy-bot';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

describe('Player', () => {
    const dict = new DictionaryService();
    let bot: EasyBot;
    let boardService: BoardService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    const commandExecuterMock = jasmine.createSpyObj('CommandExecuterService', ['execute']);
    const botMessageMock = jasmine.createSpyObj('BotMessageService', ['sendAction']);
    const randomBonus = false;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: CommandExecuterService, useValue: commandExecuterMock },
                { provide: BotMessagesService, useValue: botMessageMock },
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
            pointCalculator,
            TestBed.inject(WordSearcher),
            TestBed.inject(BotMessagesService),
            gameInfo,
            TestBed.inject(CommandExecuterService),
        );
        gameInfo.receiveGame(new Game(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, boardService, messagesService));
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
