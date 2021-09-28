/* eslint-disable @typescript-eslint/no-magic-numbers*/
/* eslint-disable max-classes-per-file*/
import { TestBed } from '@angular/core/testing';
import { Board } from '@app/GameLogic/game/board';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { BotCreatorService } from '@app/GameLogic/player/bot-creator.service';
import { BotMessagesService } from '@app/GameLogic/player/bot-messages.service';
import { EasyBot } from '@app/GameLogic/player/easy-bot';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';

// class TestBot extends Bot {
//     setActive() {
//         this.startTimerAction();
//     }
// }
export class TestBoard extends Board {
    letterCreator = new LetterCreator();
    placeWord(x: number, y: number, isVertical: boolean, word: string) {
        for (const letter of word) {
            this.grid[y][x].letterObject = this.letterCreator.createLetter(letter);
            if (isVertical) {
                y++;
            } else {
                x++;
            }
        }
    }
}

describe('Bot', () => {
    TestBed.configureTestingModule({
        providers: [BoardService, BotCreatorService, BotMessagesService, BoardService, DictionaryService],
    });
    let bot: EasyBot;
    let board: TestBoard;
    let boardService: BoardService;
    let botCreator: BotCreatorService;
    // const boardService = new BoardService();
    // const dictionaryService = new DictionaryService();
    // const pointCalculator = new PointCalculatorService(boardService);
    // const timer = new TimerService();
    // const game = new Game(10, timer, pointCalculator, boardService);
    // const wordSearcher = new WordSearcher(boardService, dictionaryService);

    beforeEach(() => {
        botCreator = TestBed.inject(BotCreatorService);
        boardService = TestBed.inject(BoardService);

        bot = botCreator.createBot('testBot', 'easy') as EasyBot;
        board = new TestBoard();
    });
    it('should create an instance', () => {
        expect(bot).toBeTruthy();
    });

    it('should split a given line in all possible combination hello', () => {
        const testLine = new ValidWord('hello');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hello'));

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination hel-o', () => {
        const testLine = new ValidWord('hel-o');
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('hel', 0, 0, 0, 0, false));
        expected.push(new ValidWord('o', 0, 0, 0, 0, false, 4));
        expected.push(new ValidWord('hel-o', 0, 0, 0, 0));

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination test-ng---hello', () => {
        const testLine = new ValidWord('test-ng---hello', 0, 0, 8, 4);
        let result: ValidWord[] = [];
        const expected: ValidWord[] = [];

        expected.push(new ValidWord('test', 0, 0, 8, 0, false));
        expected.push(new ValidWord('ng', 0, 0, 0, 2, false, 5));
        expected.push(new ValidWord('hello', 0, 0, 2, 4, false, 10));
        expected.push(new ValidWord('test-ng', 0, 0, 8, 2, false));
        expected.push(new ValidWord('ng---hello', 0, 0, 0, 4, false, 5));
        expected.push(new ValidWord('test-ng---hello', 0, 0, 8, 4, false));

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result).toEqual(expected);
    });

    it('should split a given line in all possible combination supercalifrafilisticexpialidocious', () => {
        const testLine = new ValidWord('super-cali--fragi---listic----expiali-----docious');
        let result: ValidWord[] = [];
        const expected = 21; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.botCrawler.lineSplitter(testLine);
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (simple board))', () => {
        const letters: Letter[] = [
            { char: 'E', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letters;
        board.placeWord(6, 7, false, 'bateaux');
        board.placeWord(9, 7, true, 'elle');
        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        // TODO change number when crosscheck works
        const expected = 174; // It would take too long to list all the possibilities with any more details in this test.
        // const expected: ValidWord[] = [];
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (complex board))', () => {
        const letters: Letter[] = [
            { char: '*', value: 1 },
            { char: 'K', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'N', value: 1 },
            { char: 'J', value: 1 },
            { char: 'L', value: 1 },
        ];
        bot.letterRack = letters;

        board.placeWord(5, 7, false, 'vitrat');
        board.placeWord(0, 3, true, 'bateaux');
        board.placeWord(11, 3, true, 'elle');
        board.placeWord(0, 3, false, 'bondonneraient');
        board.placeWord(5, 3, true, 'nativement');
        board.placeWord(4, 10, false, 'retarderons');
        board.placeWord(9, 3, true, 'abacas');
        board.placeWord(2, 3, true, 'nageait');
        board.placeWord(4, 1, true, 'oxo');
        board.placeWord(13, 3, true, 'tabac');
        board.placeWord(4, 1, false, 'occlusion');
        board.placeWord(0, 12, false, 'romantismes');

        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        const expected = 975; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (empty board))', () => {
        const letters: Letter[] = [
            { char: 'A', value: 1 },
            { char: 'P', value: 1 },
            { char: '*', value: 1 },
            { char: 'C', value: 1 },
            { char: 'U', value: 1 },
            { char: 'E', value: 1 },
            { char: 'V', value: 1 },
        ];
        bot.letterRack = letters;

        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        const expected = 1349; // It would take too long to list all the possibilities with any more details in this test.
        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });

    it('should return a list of all validWord the bot can play (edge case bug fixing test))', () => {
        const letters: Letter[] = [
            { char: 'L', value: 1 },
            { char: 'J', value: 1 },
            { char: 'R', value: 1 },
            { char: 'O', value: 1 },
            { char: 'I', value: 1 },
            { char: 'E', value: 1 },
            { char: 'S', value: 1 },
        ];
        bot.letterRack = letters;

        board.placeWord(5, 7, false, 'etre');

        boardService.board.grid = board.grid;
        let result: ValidWord[] = [];
        const expected = 315; // It would take too long to list all the possibilities with any more details in this test.

        result = bot.bruteForceStart();
        expect(result.length).toEqual(expected);
    });
});

// TODO Make more tests
