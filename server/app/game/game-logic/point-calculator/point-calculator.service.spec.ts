/* eslint-disable dot-notation */
/* eslint-disable max-lines */
import { DictionaryServerService } from '@app/dictionary-manager/dictionary-server.service';
import { GameCompiler } from '@app/game/game-compiler/game-compiler.service';
import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { Tile } from '@app/game/game-logic/board/tile';
import { BINGO_VALUE, RACK_LETTER_COUNT } from '@app/game/game-logic/constants';
import { EndOfGame } from '@app/game/game-logic/interface/end-of-game.interface';
import { GameStateToken } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PlaceLetterPointsEstimation, WordPointsEstimation } from '@app/game/game-logic/point-calculator/calculation-estimation';
import { MockGame } from '@app/game/game-logic/point-calculator/mock-game';
import { MockPlaceLetter } from '@app/game/game-logic/point-calculator/mock-place-letter';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { TimerController } from '@app/game/game-logic/timer/timer-controller.service';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { Subject } from 'rxjs';

describe('PointCalculatorService', () => {
    const pointCalculator: PointCalculatorService = new PointCalculatorService();
    let player1: Player;
    let player2: Player;
    let action: MockPlaceLetter;
    let game: MockGame;
    let grid: Tile[][];
    const emptyRack: Letter[] = [];
    const rack: Letter[] = [
        { char: 'A', value: 1 },
        { char: 'B', value: 3 },
        { char: 'C', value: 3 },
        { char: 'D', value: 2 },
        { char: 'E', value: 1 },
        { char: 'F', value: 4 },
        { char: 'G', value: 2 },
    ];
    let listOfWord: Tile[][];
    let word: Tile[];
    const dict = new DictionaryService(new DictionaryServerService());
    const wordSearcher: WordSearcher = new WordSearcher(dict);

    const tileToString = (tileWord: Tile[]): string => {
        let wordTemp = '';
        tileWord.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    };

    const calculatePointsForEachWord = (wordList: Tile[][]): WordPointsEstimation[] => {
        const wordPoints: WordPointsEstimation[] = wordList.map((wordTile) => {
            const stringWord = tileToString(wordTile);
            const points = pointCalculator['calculatePointsOfWord'](wordTile);
            return { word: stringWord, points };
        });
        return wordPoints;
    };

    const testPlaceLetterCalculation = (numberOfLettersToPlace: number, wordList: Tile[][]): PlaceLetterPointsEstimation => {
        const wordsPoints = calculatePointsForEachWord(wordList);
        let totalPoints = 0;
        wordsPoints.forEach((wordPoint) => {
            totalPoints += wordPoint.points;
        });
        const isBingo = numberOfLettersToPlace >= RACK_LETTER_COUNT;
        if (isBingo) {
            totalPoints += BINGO_VALUE;
        }
        return { wordsPoints, totalPoints, isBingo };
    };

    let randomBonus: boolean;
    let timePerTurn: number;
    let gameToken: string;
    const pointCalculatorStub = createSinonStubInstance<PointCalculatorService>(PointCalculatorService);
    const timerController = createSinonStubInstance<TimerController>(TimerController);
    const gameCompiler = createSinonStubInstance<GameCompiler>(GameCompiler);
    const messagesService = createSinonStubInstance<SystemMessagesService>(SystemMessagesService);
    let newGameStateSubject: Subject<GameStateToken>;
    let endGameSubject: Subject<EndOfGame>;

    beforeEach(() => {
        game = new MockGame(
            timerController,
            randomBonus,
            timePerTurn,
            gameToken,
            pointCalculatorStub,
            gameCompiler,
            messagesService,
            newGameStateSubject,
            endGameSubject,
        );
        player1 = new Player('Tim');
        player2 = new Player('Max');
        listOfWord = [];
        grid = game.board.grid;
    });

    it('should be created', () => {
        expect(pointCalculator).to.be.instanceof(PointCalculatorService);
    });

    it('should calculate the correct points of players full rack', () => {
        player1.letterRack = rack;
        let totalPointsInRack = 0;
        for (const letter of rack) {
            totalPointsInRack += letter.value;
        }
        expect(pointCalculator['calculatePointsOfRack'](player1)).to.be.equal(totalPointsInRack);
    });

    it('should calculate the correct points of players empty rack', () => {
        const totalPointsInRack = 0;
        player2.letterRack = emptyRack;
        expect(pointCalculator['calculatePointsOfRack'](player2)).to.be.equal(totalPointsInRack);
    });

    it('should calculate the correct points of a word with letter multiplicator', () => {
        const totalPointsOfWord = 11;
        action = new MockPlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        action.execute(game);
        expect(pointCalculator['calculatePointsOfWord'](word)).to.be.equal(totalPointsOfWord);
    });

    it('should calculate the correct points of a word with word multiplicator', () => {
        const totalPointsOfWord = 66;
        action = new MockPlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 2 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 3 },
        ];
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        action.execute(game);
        expect(pointCalculator['calculatePointsOfWord'](word)).to.be.equal(totalPointsOfWord);
    });

    it('should calculate the correct points of a word when placing all the players letters if >=7', () => {
        const totalPointsOfWord = 101;
        const bateaux = 'bateaux';
        word = [
            { letterObject: { char: 'B', value: 3 }, letterMultiplicator: 1, wordMultiplicator: 3 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'T', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'E', value: 1 }, letterMultiplicator: 2, wordMultiplicator: 1 },
            { letterObject: { char: 'A', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'U', value: 1 }, letterMultiplicator: 1, wordMultiplicator: 1 },
            { letterObject: { char: 'X', value: 8 }, letterMultiplicator: 1, wordMultiplicator: 1 },
        ];
        listOfWord.push(word);
        grid[0][0].letterObject = { char: 'B', value: 3 };
        grid[0][1].letterObject = { char: 'A', value: 1 };
        grid[0][2].letterObject = { char: 'T', value: 1 };
        grid[0][3].letterObject = { char: 'E', value: 1 };
        grid[0][4].letterObject = { char: 'A', value: 1 };
        grid[0][5].letterObject = { char: 'U', value: 1 };
        grid[0][6].letterObject = { char: 'X', value: 8 };
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        action = new MockPlaceLetter(player2, bateaux, { x: 0, y: 0, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
        ];
        pointCalculator.placeLetterCalculation(action, listOfWord, grid);
        const estimation = testPlaceLetterCalculation(RACK_LETTER_COUNT, listOfWord);
        expect(estimation.isBingo).to.be.equal(true);
        expect(estimation.totalPoints).to.be.equal(totalPointsOfWord);
        expect(player2.points).to.be.equal(totalPointsOfWord);
    });

    it('should calculate the correct points of a word when placing a word with a letter whose multiplicator has been used', () => {
        const totalPointsOfWordPlayer1 = 15;
        const totalPointsOfWordPlayer2 = 17;
        const wordBat = [grid[0][0], grid[0][1], grid[0][2]];
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'Z', value: 10 },
            { char: 'M', value: 3 },
            { char: 'I', value: 1 },
            { char: 'L', value: 1 },
        ];
        grid[0][0].letterObject = { char: 'B', value: 3 };
        grid[0][1].letterObject = { char: 'A', value: 1 };
        grid[0][2].letterObject = { char: 'T', value: 1 };
        listOfWord.push(wordBat);
        action = new MockPlaceLetter(player1, 'bat', { x: 0, y: 0, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 0 },
            { x: 1, y: 0 },
            { x: 2, y: 0 },
        ];
        pointCalculator.placeLetterCalculation(action, listOfWord, grid);
        expect(player1.points).to.be.equal(totalPointsOfWordPlayer1);

        const wordBateaux = [grid[0][0], grid[0][1], grid[0][2], grid[0][3], grid[0][4], grid[0][5], grid[0][6]];
        listOfWord = [];
        listOfWord.push(wordBateaux);
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'E', value: 1 },
            { char: 'A', value: 1 },
            { char: 'U', value: 1 },
            { char: 'X', value: 8 },
        ];
        grid[0][3].letterObject = { char: 'E', value: 1 };
        grid[0][4].letterObject = { char: 'A', value: 1 };
        grid[0][5].letterObject = { char: 'U', value: 1 };
        grid[0][6].letterObject = { char: 'X', value: 8 };
        action = new MockPlaceLetter(player2, 'bateaux', { x: 0, y: 0, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 3, y: 0 },
            { x: 4, y: 0 },
            { x: 5, y: 0 },
            { x: 6, y: 0 },
        ];
        pointCalculator.placeLetterCalculation(action, listOfWord, grid);
        const points = player2.points;
        expect(points).to.be.equal(totalPointsOfWordPlayer2);
    });

    it('should calculate the correct points when more than one word was made', () => {
        const totalPointsOfPlayer1 = 3;
        const totalPointsOfPlayer2 = 25;
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'O', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'K', value: 5 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        grid[3][0].letterObject = { char: 'A', value: 1 };
        grid[4][0].letterObject = { char: 'T', value: 1 };
        const wordAt = [grid[3][0], grid[4][0]];
        listOfWord.push(wordAt);
        action = new MockPlaceLetter(player1, 'at', { x: 0, y: 3, direction: Direction.Vertical }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 3 },
            { x: 0, y: 4 },
        ];
        pointCalculator.placeLetterCalculation(action, listOfWord, grid);
        expect(player1.points).to.be.equal(totalPointsOfPlayer1);
        listOfWord = [];
        grid[2][0].letterObject = { char: 'B', value: 3 };
        grid[2][1].letterObject = { char: 'A', value: 1 };
        grid[2][2].letterObject = { char: 'K', value: 5 };
        grid[2][3].letterObject = { char: 'E', value: 1 };
        const wordBat = [grid[2][0], grid[3][0], grid[4][0]];
        const wordBake = [grid[2][0], grid[2][1], grid[2][2], grid[2][3]];
        const pointBat = 5;
        const pointBake = 20;
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);
        action = new MockPlaceLetter(player2, 'bake', { x: 0, y: 2, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
        ];
        const letterToPlace = RACK_LETTER_COUNT - wordBake.length;
        const estimation = testPlaceLetterCalculation(letterToPlace, listOfWord);
        expect(estimation.wordsPoints[0].points).to.be.equal(pointBat);
        expect(estimation.wordsPoints[1].points).to.be.equal(pointBake);
        pointCalculator.placeLetterCalculation(action, listOfWord, grid);
        expect(player2.points).to.be.equal(totalPointsOfPlayer2);
    });

    it('should estimate the correct points of every word made', () => {
        player1.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'O', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        player2.letterRack = [
            { char: 'B', value: 3 },
            { char: 'A', value: 1 },
            { char: 'K', value: 5 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
            { char: 'N', value: 1 },
        ];
        grid[3][0].letterObject = { char: 'A', value: 1 };
        grid[4][0].letterObject = { char: 'T', value: 1 };
        const wordAt = [grid[3][0], grid[4][0]];
        listOfWord.push(wordAt);
        action = new MockPlaceLetter(player1, 'at', { x: 0, y: 3, direction: Direction.Vertical }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 3 },
            { x: 0, y: 4 },
        ];
        pointCalculator.placeLetterCalculation(action, listOfWord, grid);
        listOfWord = [];

        grid[2][0].letterObject = { char: 'B', value: 3 };
        grid[2][1].letterObject = { char: 'A', value: 1 };
        grid[2][2].letterObject = { char: 'K', value: 5 };
        grid[2][3].letterObject = { char: 'E', value: 1 };
        const wordBat = [grid[2][0], grid[3][0], grid[4][0]];
        const wordBake = [grid[2][0], grid[2][1], grid[2][2], grid[2][3]];
        const pointBat = 5;
        const pointBake = 20;
        listOfWord.push(wordBat);
        listOfWord.push(wordBake);
        action = new MockPlaceLetter(player2, 'bake', { x: 0, y: 2, direction: Direction.Horizontal }, pointCalculator, wordSearcher);
        action.execute(game);
        action.affectedCoords = [
            { x: 0, y: 2 },
            { x: 1, y: 2 },
            { x: 2, y: 2 },
            { x: 3, y: 2 },
        ];
        const letterToPlace = RACK_LETTER_COUNT - wordBake.length;
        const estimation = testPlaceLetterCalculation(letterToPlace, listOfWord);
        expect(estimation.wordsPoints[0].points).to.be.equal(pointBat);
        expect(estimation.wordsPoints[1].points).to.be.equal(pointBake);
    });

    it('should not calculate bonus when player place all letter if rack was not full (on end of game)', () => {
        const totalPointsOfWord = 7;
        const initialPointPlayer1 = 150;
        const initialPointPlayer2 = 50;
        player1.points = initialPointPlayer1;
        player2.points = initialPointPlayer2;
        game.consecutivePass = 0;
        grid[0][5].letterObject = { char: 'C', value: 3 };
        grid[1][5].letterObject = { char: 'E', value: 1 };
        grid[2][5].letterObject = { char: 'T', value: 1 };
        const wordCet = [grid[0][5], grid[1][5], grid[2][5]];
        listOfWord.push(wordCet);
        player1.letterRack = [
            { char: 'A', value: 1 },
            { char: 'T', value: 1 },
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'N', value: 1 },
            { char: 'U', value: 1 },
            { char: 'N', value: 1 },
        ];
        action = new MockPlaceLetter(player1, 'cet', { x: 5, y: 0, direction: Direction.Vertical }, pointCalculator, wordSearcher);
        action.affectedCoords = [
            { x: 5, y: 0 },
            { x: 5, y: 1 },
            { x: 5, y: 2 },
        ];
        game.activePlayer = player1;
        game.otherPlayer = player2;
        game.players = [game.activePlayer, game.otherPlayer];
        expect(pointCalculator.placeLetterCalculation(action, listOfWord, grid)).to.be.equal(totalPointsOfWord);
        expect(game.activePlayer.points).to.be.equal(initialPointPlayer1 + totalPointsOfWord);
        const activePlayerEOGamePoints = initialPointPlayer1 + totalPointsOfWord + pointCalculator['calculatePointsOfRack'](game.otherPlayer);
        const otherPlayerEOGamePoints = initialPointPlayer2 - pointCalculator['calculatePointsOfRack'](game.otherPlayer);
        pointCalculator.endOfGamePointDeduction(game as MockGame);
        expect(game.activePlayer.points).to.be.equal(activePlayerEOGamePoints);
        expect(game.otherPlayer.points).to.be.equal(otherPlayerEOGamePoints);
    });

    it('should calculate the correct points at the end of game after 6 consecutive pass', () => {
        const totalPointsActivePlayer = 84;
        const totalPointsOtherPlayer = 95;
        const threeLetterRack = [
            { char: 'C', value: 3 },
            { char: 'E', value: 1 },
            { char: 'T', value: 1 },
        ];
        game = new MockGame(
            timerController,
            randomBonus,
            timePerTurn,
            gameToken,
            pointCalculatorStub,
            gameCompiler,
            messagesService,
            newGameStateSubject,
            endGameSubject,
        );
        game.activePlayer.points = 100;
        game.otherPlayer.points = 100;
        game.activePlayer.letterRack = rack;
        game.otherPlayer.letterRack = threeLetterRack;
        pointCalculator.endOfGamePointDeduction(game as MockGame);
        expect(game.activePlayer.points).to.be.equal(totalPointsActivePlayer);
        expect(game.otherPlayer.points).to.be.equal(totalPointsOtherPlayer);
    });
});
