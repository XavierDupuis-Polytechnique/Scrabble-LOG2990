/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { DEFAULT_TIME_PER_TURN } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { Action } from '@app/GameLogic/actions/action';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { CommandParserService } from '@app/GameLogic/commands/command-parser/command-parser.service';
import { NUM_TILES } from '@app/GameLogic/game/board';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { TimerService } from '@app/GameLogic/game/timer/timer.service';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { Bot } from '@app/GameLogic/player/bot';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';


class TestBot extends Bot {
    setActive() {
    }
}


describe('ActionValidatorService', () => {
    let service: ActionValidatorService;
    let game: Game;
    let p1User: User;
    let p2Bot: TestBot;
    let currentPlayer: Player;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let board: BoardService;
    let dictionary: DictionaryService;
    let info: GameInfoService;
    let wordSearcher: WordSearcher;
    const centerPosition = Math.floor(NUM_TILES / 2);

    class FakeAction extends Action {
        id: number;
        constructor(readonly player: Player) {
            super(player);
        }
        execute(game: Game): void {
            throw new Error('Method not implemented.');
        }
        protected perform(game: Game): void {
            throw new Error('Method not implemented.');
        }
    }

    // FIX les tests, car ils sont trop dépendants des autres services
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                MessagesService,
                CommandParserService,
                PointCalculatorService,
                BoardService,
                DictionaryService,
                TimerService,
                GameInfoService,
                PointCalculatorService,
                WordSearcher,
            ],
        });
        service = TestBed.inject(ActionValidatorService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);
        info = TestBed.inject(GameInfoService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        wordSearcher = TestBed.inject(WordSearcher);

        game = new Game(DEFAULT_TIME_PER_TURN, timer, pointCalculator, board);
        p1User = new User('testUser');
        // p2Bot = new EasyBot('testUser', board, dictionary, pointCalculator, game);
        p2Bot = new TestBot('testUser', board, dictionary, pointCalculator, wordSearcher);
        game.players.push(p1User);
        game.players.push(p2Bot);
        info.receiveGame(game);
        game.start();
        currentPlayer = game.getActivePlayer();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /// INVALID ACTION TYPE TESTS ///
    it('should throw error when receiving an unrecognized action type', () => {
        const action = new FakeAction(currentPlayer);
        expect(() => {
            service.validateAction(action);
        }).toThrowError("Action couldn't be validated");
    });
    /// ////////////////// ///

    /// TURN + PASSTURN TESTS ///
    it('should validate a valid PassTurn', () => {
        const action = new PassTurn(currentPlayer);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid PassTurn because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1User ? p2Bot : p1User;
        const action = new PassTurn(otherPlayer);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1User ? p2Bot : p1User;
        const action = new ExchangeLetter(otherPlayer, []);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1User ? p2Bot : p1User;
        const action = new PlaceLetter(
            otherPlayer,
            '',
            { x: centerPosition, y: centerPosition, direction: Direction.Vertical },
            pointCalculator,
            wordSearcher,
        );
        expect(service.validateAction(action)).not.toBeTruthy();
    });
    /// ////////////////// ///

    /// EXCHANGELETTER TESTS ///
    it('should validate a valid ExchangeLetter because 7 letters from the player rack can be exchanged', () => {
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because less than 7 letters from the player rack can be exchanged', () => {
        const lettersToExchange = [currentPlayer.letterRack[4], currentPlayer.letterRack[6]];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because the game letterBag has enough letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 10);
        const lettersToExchange = [...currentPlayer.letterRack].splice(0, 1);
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the game letterBag doesnt have letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length);
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the game letterBag doesnt have enough letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 2); // 102 - 100 = 2 letters remaining
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack.splice(0, 5)); // 5 letters to exchange
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because a player can exchange many of the same letter', () => {
        currentPlayer.letterRack = [
            { char: 'a', value: 1 },
            { char: 'a', value: 1 },
            { char: 'a', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
        ];
        const lettersToExchange = [
            { char: 'a', value: 1 },
            { char: 'a', value: 1 },
            { char: 'a', value: 1 },
        ];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because a player cannot exchange more of the same letter he/she has', () => {
        currentPlayer.letterRack = [
            { char: 'a', value: 1 },
            { char: 'b', value: 1 },
            { char: 'c', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
        ];
        const lettersToExchange = [
            { char: 'a', value: 1 },
            { char: 'a', value: 1 },
            { char: 'b', value: 1 },
            { char: 'c', value: 1 },
            { char: 'd', value: 1 },
        ];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because a player cannot exchange letters not in its letterRack', () => {
        const lettersToExchange = [{ char: '!NOT_A_LETTER', value: 666 }];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service.validateAction(action)).not.toBeTruthy();
    });
    /// ////////////////// ///

    /// PLACELETTER TESTS ///
    it('should validate a valid PlaceLetter because the letter Tile is empty (horizontal)', () => {
        const word = 'a';
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: centerPosition, y: centerPosition };
        currentPlayer.letterRack[0].char = word.charAt(0);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile is empty (vertical)', () => {
        const word = 'a';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        currentPlayer.letterRack[0].char = word.charAt(0);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because a player cannot place letter(s) he/she doesnt have', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [
            { char: 'a', value: 1 },
            { char: 'b', value: 1 },
            { char: 'c', value: 1 },
            { char: 'a', value: 1 },
            { char: 'd', value: 1 },
        ];
        const word = 'abacada';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the player has some of the missing letters and a joker', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [
            { char: 'a', value: 1 },
            { char: 'b', value: 1 },
            { char: 'c', value: 1 },
            { char: 'a', value: 1 },
            { char: 'd', value: 1 },
            { char: '*', value: 0 },
        ];
        const word = 'abacAda';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the player has jokers ', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [];
        for (let i = 0; i < LetterBag.playerLetterCount; i++) {
            currentPlayer.letterRack.push({ char: '*', value: 0 });
        }
        const word = 'aBACADA';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the player has jokers but uses them incorrectly', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [];
        for (let i = 0; i < LetterBag.playerLetterCount; i++) {
            currentPlayer.letterRack.push({ char: '*', value: 0 });
        }
        const word = 'abacada';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it("should invalidate an invalid PlaceLetter because the player doesn't have enough jokers", () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [];
        for (let i = 0; i < LetterBag.playerLetterCount - 1; i++) {
            currentPlayer.letterRack.push({ char: '*', value: 0 });
        }
        currentPlayer.letterRack.push({ char: 'z', value: 0 });
        const word = 'AAAAAAAA';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition + 1, y: centerPosition - 1 };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the player has all missing letters from the word', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [
            { char: 'a', value: 1 },
            { char: 'b', value: 1 },
            { char: 'c', value: 1 },
            { char: 'a', value: 1 },
            { char: 'd', value: 1 },
        ];
        const word = 'abacad';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the center Tile remains Empty', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: 0, y: 0 };
        const word = 'b';
        currentPlayer.letterRack[0].char = word.charAt(0);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile next to it is empty', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        const word = 'ab';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        currentPlayer.letterRack[0].char = word.charAt(1);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the word has no neighbours on the grid', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        const x = 0;
        const y = 0;
        const word = 'abcdefg';
        const placement: PlacementSetting = { direction: Direction.Horizontal, x, y };
        for (let i = 0; i < word.length; i++) {
            currentPlayer.letterRack[i].char = word.charAt(i);
        }
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the Tile is occupied and there no Tile next to it', () => {
        const x = NUM_TILES - 1;
        const y = NUM_TILES - 1;
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        game.board.grid[y][x].letterObject.char = 'a';
        const word = 'ab';
        const placement: PlacementSetting = { direction: Direction.Horizontal, x, y };
        game.board.grid[y][x].letterObject.char = word.charAt(0);
        currentPlayer.letterRack[0].char = word.charAt(1);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service.validateAction(action)).not.toBeTruthy();
    });

    it('should validate placing a "word" with already present letters on the board (horizontal)', () => {
        const horizontalWord = 'abcdefghijk';
        for (let x = 0; x < horizontalWord.length; x++) {
            if (x % 2) {
                currentPlayer.letterRack[x % LetterBag.playerLetterCount].char = horizontalWord.charAt(x);
            } else {
                game.board.grid[centerPosition][x].letterObject.char = horizontalWord.charAt(x);
            }
        }
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 0, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, horizontalWord, placement, pointCalculator, wordSearcher);

        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should validate placing a "word" with already present letters on the board (vertical)', () => {
        const verticalWord = 'abcdefghijk';
        for (let y = 0; y < verticalWord.length; y++) {
            if (y % 2) {
                currentPlayer.letterRack[y % LetterBag.playerLetterCount].char = verticalWord.charAt(y);
            } else {
                game.board.grid[y][centerPosition].letterObject.char = verticalWord.charAt(y);
            }
        }
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: 0 };
        const action = new PlaceLetter(currentPlayer, verticalWord, placement, pointCalculator, wordSearcher);

        expect(service.validateAction(action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter if word overflow the board', () => {
        const finalBoardRowChars = 'abcde';
        const beginPos = NUM_TILES - finalBoardRowChars.length + 1;
        let word = '';
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        game.board.grid[0][beginPos + 0].letterObject.char = finalBoardRowChars[0];
        game.board.grid[0][beginPos + 1].letterObject.char = finalBoardRowChars[1];
        game.board.grid[0][beginPos + 2].letterObject.char = finalBoardRowChars[2];
        for (let i = 3; i < finalBoardRowChars.length; i++) {
            currentPlayer.letterRack[i % LetterBag.playerLetterCount].char = finalBoardRowChars[i];
            word += finalBoardRowChars.charAt(i);
        }

        const placement: PlacementSetting = { direction: Direction.Horizontal, x: beginPos, y: 0 };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);

        expect(service.validateAction(action)).not.toBeTruthy();

        expect(game.board.grid[0][beginPos + 3].letterObject.char).toBe(' ');
    });
    /// ////////////////// ///
});
