import { TestBed } from '@angular/core/testing';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { BoardService } from '@app/GameLogic/game/board/board.service';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';

describe('Player', () => {
    const dict = new DictionaryService();
    let bot: EasyBot;
    let boardService: BoardService;
    let botCreator: BotCreatorService;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let messagesService: MessagesService;
    let gameInfo: GameInfoService;
    const randomBonus = false;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [{ provide: DictionaryService, useValue: dict }],
        });
        boardService = TestBed.inject(BoardService);
        botCreator = TestBed.inject(BotCreatorService);
        timer = TestBed.inject(TimerService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        messagesService = TestBed.inject(MessagesService);
        gameInfo = TestBed.inject(GameInfoService);
        bot = botCreator.createBot('testBot', 'easy') as EasyBot;
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
