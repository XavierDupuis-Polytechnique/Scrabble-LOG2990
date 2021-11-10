import { Injectable } from '@angular/core';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Tile } from '@app/game-logic/game/board/tile';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { Vec2 } from '@app/game-logic/interfaces/vec2';
import { Player } from '@app/game-logic/player/player';
import { PlaceLetterPointsEstimation, WordPointsEstimation } from '@app/game-logic/point-calculator/calculation-estimation';

const MAX_LETTER_IN_RACK = 7;
const BONUS = 50;
@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    constructor(private boardService: BoardService) {}

    get grid() {
        return this.boardService.board.grid;
    }

    placeLetterCalculation(action: PlaceLetter, wordList: Tile[][]): number {
        let totalPointsOfTurn = 0;
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(word);
        });
        this.desactivateMultiplicators(action);

        if (action.affectedCoords.length >= MAX_LETTER_IN_RACK) {
            totalPointsOfTurn += BONUS;
        }
        action.player.points += totalPointsOfTurn;
        return totalPointsOfTurn;
    }

    testPlaceLetterCalculation(numberOfLettersToPlace: number, wordList: Tile[][]): PlaceLetterPointsEstimation {
        const wordsPoints = this.calculatePointsForEachWord(wordList);
        let totalPoints = 0;
        wordsPoints.forEach((wordPoint) => {
            totalPoints += wordPoint.points;
        });
        const isBingo = numberOfLettersToPlace >= MAX_LETTER_IN_RACK;
        if (isBingo) {
            totalPoints += BONUS;
        }
        return { wordsPoints, totalPoints, isBingo };
    }

    endOfGamePointDeduction(game: OfflineGame): void {
        const activePlayer = game.getActivePlayer();
        if (game.consecutivePass >= OfflineGame.maxConsecutivePass) {
            for (const player of game.players) {
                player.points -= this.calculatePointsOfRack(player);
            }
            return;
        }
        for (const player of game.players) {
            if (activePlayer !== player) {
                activePlayer.points += this.calculatePointsOfRack(player);
                player.points -= this.calculatePointsOfRack(player);
            }
        }
    }

    calculatePointsOfWord(word: Tile[]): number {
        let sumOfWord = 0;
        let totalWordMultiplicator = 1;
        const lettersInWord = new Set(word);
        lettersInWord.forEach((letter) => {
            sumOfWord += letter.letterObject.value * letter.letterMultiplicator;
            totalWordMultiplicator *= letter.wordMultiplicator;
        });
        sumOfWord *= totalWordMultiplicator;
        return sumOfWord;
    }

    calculatePointsForEachWord(wordList: Tile[][]): WordPointsEstimation[] {
        const wordPoints: WordPointsEstimation[] = wordList.map((wordTile) => {
            const word = this.tileToString(wordTile);
            const points = this.calculatePointsOfWord(wordTile);
            return { word, points };
        });
        return wordPoints;
    }

    calculatePointsOfRack(player: Player): number {
        let sumOfRack = 0;
        const letterRack = player.letterRack;
        for (const letter of letterRack) {
            sumOfRack += letter.value;
        }
        return sumOfRack;
    }

    desactivateMultiplicators(action: PlaceLetter): void {
        const startCoord: Vec2 = { x: action.placement.x, y: action.placement.y };
        const direction = action.placement.direction;
        const word = action.word;
        if (direction === Direction.Horizontal) {
            const y = startCoord.y;
            const wordEnd = startCoord.x + word.length;
            for (let x = startCoord.x; x < wordEnd; x++) {
                this.grid[y][x].letterMultiplicator = 1;
                this.grid[y][x].wordMultiplicator = 1;
            }
        } else {
            const x = startCoord.x;
            const wordEnd = startCoord.y + word.length;
            for (let y = startCoord.y; y < wordEnd; y++) {
                this.grid[y][x].letterMultiplicator = 1;
                this.grid[y][x].wordMultiplicator = 1;
            }
        }
    }

    tileToString(word: Tile[]): string {
        let wordTemp = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    }
}