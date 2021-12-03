/* eslint-disable dot-notation */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable max-lines */
import { TestBed } from '@angular/core/testing';
import { Action } from '@app/game-logic/actions/action';
import { ActionValidatorService } from '@app/game-logic/actions/action-validator/action-validator.service';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { CommandExecuterService } from '@app/game-logic/commands/command-executer/command-executer.service';
import {
    BOARD_DIMENSION,
    BOARD_MAX_POSITION,
    DEFAULT_TIME_PER_TURN,
    EMPTY_CHAR,
    MIDDLE_OF_BOARD,
    RACK_LETTER_COUNT
} from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { TimerService } from '@app/game-logic/game/timer/timer.service';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { BotCreatorService } from '@app/game-logic/player/bot/bot-creator.service';
import { HardBot } from '@app/game-logic/player/bot/hard-bot';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { BotHttpService, BotInfo, BotType } from '@app/services/bot-http.service';
import { Observable } from 'rxjs';

describe('ActionValidatorService', () => {
    let service: ActionValidatorService;
    let game: OfflineGame;
    let p1: User;
    let p2: User;
    let currentPlayer: Player;
    let timer: TimerService;
    let pointCalculator: PointCalculatorService;
    let board: BoardService;
    let info: GameInfoService;
    let messagesSpy: MessagesService;
    let commandExecuterSpy: CommandExecuterService;
    let wordSearcher: WordSearcher;
    const dict = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
    const randomBonus = false;
    const centerPosition = Math.floor(BOARD_DIMENSION / 2);

    class UnknownAction extends Action {
        id: number;
        constructor(readonly player: Player) {
            super(player);
        }
        execute(): void {
            return;
        }
        protected perform(): void {
            return;
        }
    }
    let mockBotHttpService: jasmine.SpyObj<BotHttpService>;
    beforeEach(() => {
        mockBotHttpService = jasmine.createSpyObj('BotHttpService', ['getDataInfo']);
        const dummyData: BotInfo[] = [{ name: 'Test', canEdit: true, type: BotType.Easy }];
        const obs = new Observable<BotInfo[]>((sub) => {
            sub.next(dummyData);
        });
        mockBotHttpService.getDataInfo.and.returnValue(obs);

        messagesSpy = jasmine.createSpyObj(MessagesService, ['receiveErrorMessage', 'receiveSystemMessage']);
        commandExecuterSpy = jasmine.createSpyObj(CommandExecuterService, ['any']);
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dict },
                { provide: MessagesService, useValue: messagesSpy },
                { provide: CommandExecuterService, useValue: commandExecuterSpy },
                { provide: BotHttpService, useValue: mockBotHttpService },
            ],
        });
        service = TestBed.inject(ActionValidatorService);
        timer = TestBed.inject(TimerService);
        board = TestBed.inject(BoardService);
        info = TestBed.inject(GameInfoService);
        pointCalculator = TestBed.inject(PointCalculatorService);
        game = new OfflineGame(randomBonus, DEFAULT_TIME_PER_TURN, timer, pointCalculator, board, messagesSpy);
        p1 = new User('p1');
        p2 = new User('p2');
        game.players.push(p1);
        game.players.push(p2);
        info.receiveGame(game);
        game.start();
        currentPlayer = game.getActivePlayer();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should throw error when receiving an unrecognized action type', () => {
        const action = new UnknownAction(currentPlayer);
        service['checkAction'](action);
        expect(messagesSpy.receiveErrorMessage).toHaveBeenCalledWith("Commande impossible à réaliser : le type d'action n'est pas  reconnu");
    });

    it('should return false when the action is not valid', () => {
        const action = new UnknownAction(currentPlayer);
        const playerSpy = spyOn(currentPlayer, 'play');
        service.sendAction(action);
        expect(playerSpy).not.toHaveBeenCalled();
    });

    it('should propagate a valid action to the player', () => {
        const action = new PassTurn(currentPlayer);
        const spy = spyOn(currentPlayer, 'play');
        service.sendAction(action);
        expect(spy).toHaveBeenCalledWith(action);
    });

    it('should validate a valid PassTurn', () => {
        const action = new PassTurn(currentPlayer);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should invalidate an invalid PassTurn because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1 ? p2 : p1;
        const action = new PassTurn(otherPlayer);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1 ? p2 : p1;
        const action = new ExchangeLetter(otherPlayer, []);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the player tried to perform an action outside of its turn', () => {
        const otherPlayer = currentPlayer === p1 ? p2 : p1;
        const action = new PlaceLetter(
            otherPlayer,
            '',
            { x: centerPosition, y: centerPosition, direction: Direction.Vertical },
            pointCalculator,
            wordSearcher,
        );
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because 7 letters from the player rack can be exchanged', () => {
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because less than 7 letters from the player rack can be exchanged', () => {
        const lettersToExchange = [currentPlayer.letterRack[4], currentPlayer.letterRack[6]];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should validate a valid ExchangeLetter because the game letterBag has enough letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 10);
        const lettersToExchange = [...currentPlayer.letterRack].splice(0, 1);
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the game letterBag doesnt have letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length);
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the game letterBag doesnt have enough letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 2);
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack.splice(0, 5));
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because the LetterBag has less than 7 letters', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - (RACK_LETTER_COUNT - 1));
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack.splice(0, 1));
        expect(service['checkAction'](action)).not.toBeTruthy();
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
        expect(service['checkAction'](action)).toBeTruthy();
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
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should invalidate an invalid ExchangeLetter because a player cannot exchange letters not in its letterRack', () => {
        const lettersToExchange = [{ char: '!NOT_A_LETTER', value: 666 }];
        const action = new ExchangeLetter(currentPlayer, lettersToExchange);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('checkExchangeLetter should return true when a hardBot exchange letters while theres less than 7 letters left', () => {
        game.letterBag.drawGameLetters(game.letterBag.gameLetters.length - 5);
        const letterCreator = new LetterCreator();
        const letterRack = [letterCreator.createLetter('c'), letterCreator.createLetter('d')];
        const hardBot = TestBed.inject(BotCreatorService).createBot('testHardBot', 'hard') as HardBot;
        hardBot.letterRack = letterRack;
        const action = new ExchangeLetter(hardBot, letterRack);
        const result = service['checkExchangeLetter'](action);
        expect(result).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile is empty (horizontal)', () => {
        const word = 'a';
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: centerPosition, y: centerPosition };
        currentPlayer.letterRack[0].char = word.charAt(0);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile is empty (vertical)', () => {
        const word = 'a';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        currentPlayer.letterRack[0].char = word.charAt(0);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should not change the letterRack after an invalid PlaceLetter', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [
            { char: 'c', value: 1 },
            { char: 'd', value: 1 },
            { char: 'e', value: 1 },
            { char: 'f', value: 1 },
            { char: 'g', value: 1 },
        ];
        const word = 'ab';
        const initialRack = [];
        for (const letter of currentPlayer.letterRack) {
            initialRack.push({ ...letter });
        }
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).not.toBeTruthy();
        for (let i = 0; i < initialRack.length; i++) {
            expect(initialRack[i].char).toBe(currentPlayer.letterRack[i].char);
        }
    });

    it('should invalidate an invalid PlaceLetter because a player cannot place letter(s) they doesnt have', () => {
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
        expect(service['checkAction'](action)).not.toBeTruthy();
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
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the player has jokers ', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [];
        for (let i = 0; i < RACK_LETTER_COUNT; i++) {
            currentPlayer.letterRack.push({ char: '*', value: 0 });
        }
        const word = 'aBACADA';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the player has jokers but uses them incorrectly', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [];
        for (let i = 0; i < RACK_LETTER_COUNT; i++) {
            currentPlayer.letterRack.push({ char: '*', value: 0 });
        }
        const word = 'abacada';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it("should invalidate an invalid PlaceLetter because the player doesn't have enough jokers", () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        currentPlayer.letterRack = [];
        for (let i = 0; i < RACK_LETTER_COUNT - 1; i++) {
            currentPlayer.letterRack.push({ char: '*', value: 0 });
        }
        currentPlayer.letterRack.push({ char: 'z', value: 0 });
        const word = 'AAAAAAAA';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition + 1, y: centerPosition - 1 };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).not.toBeTruthy();
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
        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the center Tile remains Empty', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: 0, y: 0 };
        const word = 'b';
        currentPlayer.letterRack[0].char = word.charAt(0);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should validate a valid PlaceLetter because the letter Tile next to it is empty', () => {
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        const word = 'ab';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: centerPosition };
        currentPlayer.letterRack[0].char = word.charAt(1);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).toBeTruthy();
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
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter because the Tile is occupied and there no Tile next to it', () => {
        const x = BOARD_DIMENSION - 1;
        const y = BOARD_DIMENSION - 1;
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        game.board.grid[y][x].letterObject.char = 'a';
        const word = 'ab';
        const placement: PlacementSetting = { direction: Direction.Horizontal, x, y };
        game.board.grid[y][x].letterObject.char = word.charAt(0);
        currentPlayer.letterRack[0].char = word.charAt(1);
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        expect(service['checkAction'](action)).not.toBeTruthy();
    });

    it('should validate placing a word with already present letters on the board (horizontal)', () => {
        const horizontalWord = 'abcdefghijk';
        for (let x = 0; x < horizontalWord.length; x++) {
            if (x % 2) {
                currentPlayer.letterRack[x % RACK_LETTER_COUNT].char = horizontalWord.charAt(x);
            } else {
                game.board.grid[centerPosition][x].letterObject.char = horizontalWord.charAt(x);
            }
        }
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: 0, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, horizontalWord, placement, pointCalculator, wordSearcher);

        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should validate placing a word with already present letters on the board (vertical)', () => {
        const verticalWord = 'abcdefghijk';
        for (let y = 0; y < verticalWord.length; y++) {
            if (y % 2) {
                currentPlayer.letterRack[y % RACK_LETTER_COUNT].char = verticalWord.charAt(y);
            } else {
                game.board.grid[y][centerPosition].letterObject.char = verticalWord.charAt(y);
            }
        }
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: 0 };
        const action = new PlaceLetter(currentPlayer, verticalWord, placement, pointCalculator, wordSearcher);

        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should return false if the word is off limit in y', () => {
        const word = 'abcdefghijk';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: centerPosition, y: -1 };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        const result = service['checkBoardsLimits'](action);
        expect(result).toBeFalsy();
    });

    it('should return false if the word is off limit in x', () => {
        const word = 'abcdefghijk';
        const placement: PlacementSetting = { direction: Direction.Vertical, x: -1, y: centerPosition };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        const result = service['checkBoardsLimits'](action);
        expect(result).toBeFalsy();
    });

    it('should validate placing a word that lands on the last column (horizontal)', () => {
        const verticalWord = 'abcdefg';
        const beginPos = BOARD_MAX_POSITION - verticalWord.length + 1;
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        game.board.grid[beginPos][beginPos].letterObject.char = 'a';
        for (let y = 0; y < verticalWord.length; y++) {
            currentPlayer.letterRack[y % RACK_LETTER_COUNT].char = verticalWord.charAt(y);
        }
        const placement: PlacementSetting = { direction: Direction.Horizontal, x: beginPos, y: beginPos };
        const action = new PlaceLetter(currentPlayer, verticalWord, placement, pointCalculator, wordSearcher);

        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should validate placing a word that lands on the last row (vertical)', () => {
        const verticalWord = 'abcdefg';
        const beginPos = BOARD_MAX_POSITION - verticalWord.length + 1;
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        game.board.grid[beginPos][beginPos].letterObject.char = 'a';
        for (let y = 0; y < verticalWord.length; y++) {
            currentPlayer.letterRack[y % RACK_LETTER_COUNT].char = verticalWord.charAt(y);
        }
        const placement: PlacementSetting = { direction: Direction.Vertical, x: beginPos, y: beginPos };
        const action = new PlaceLetter(currentPlayer, verticalWord, placement, pointCalculator, wordSearcher);

        expect(service['checkAction'](action)).toBeTruthy();
    });

    it('should invalidate an invalid PlaceLetter if word overflow the board', () => {
        const finalBoardRowChars = 'abcde';
        const beginPos = BOARD_DIMENSION - finalBoardRowChars.length + 1;
        let word = '';
        game.board.grid[centerPosition][centerPosition].letterObject.char = 'a';
        game.board.grid[0][beginPos + 0].letterObject.char = finalBoardRowChars[0];
        game.board.grid[0][beginPos + 1].letterObject.char = finalBoardRowChars[1];
        game.board.grid[0][beginPos + 2].letterObject.char = finalBoardRowChars[2];
        for (let i = 3; i < finalBoardRowChars.length; i++) {
            currentPlayer.letterRack[i % RACK_LETTER_COUNT].char = finalBoardRowChars[i];
            word += finalBoardRowChars.charAt(i);
        }

        const placement: PlacementSetting = { direction: Direction.Horizontal, x: beginPos, y: 0 };
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);

        expect(service['checkAction'](action)).not.toBeTruthy();

        expect(game.board.grid[0][beginPos + 3].letterObject.char).toBe(EMPTY_CHAR);
    });

    it('should send correct message format for PassTurn action', () => {
        const action = new PassTurn(currentPlayer);
        service['sendActionArgsMessage'](action);
        const expected = currentPlayer.name + ' passe son tour';
        expect(messagesSpy.receiveSystemMessage).toHaveBeenCalledWith(expected);
    });

    it('should send correct message format for ExchangeLetter action when the User plays', () => {
        const self = currentPlayer;
        info.receiveUser(self);
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        const chars = currentPlayer.letterRack.map((letter) => letter.char);
        service['sendActionArgsMessage'](action);
        const expected = currentPlayer.name + ' échange les lettres ' + chars;
        expect(messagesSpy.receiveSystemMessage).toHaveBeenCalledWith(expected);
    });

    it('should send correct message format for ExchangeLetter action when the opponent plays', () => {
        const self = p1 === currentPlayer ? p2 : p1;
        info.receiveUser(self);
        const action = new ExchangeLetter(currentPlayer, currentPlayer.letterRack);
        const chars = currentPlayer.letterRack.map((letter) => letter.char);
        service['sendActionArgsMessage'](action);
        const expected = currentPlayer.name + ' échange ' + chars.length + ' lettres';
        expect(messagesSpy.receiveSystemMessage).toHaveBeenCalledWith(expected);
    });

    it('should send correct message format for PlaceLetter action', () => {
        const placement: PlacementSetting = { direction: Direction.Vertical, x: MIDDLE_OF_BOARD, y: MIDDLE_OF_BOARD };
        const word = 'avion';
        const action = new PlaceLetter(currentPlayer, word, placement, pointCalculator, wordSearcher);
        service['sendActionArgsMessage'](action);
        const expected = currentPlayer.name + ' place le mot ' + word + ' en h8v';
        expect(messagesSpy.receiveSystemMessage).toHaveBeenCalledWith(expected);
    });
});
