import { Injectable } from '@angular/core';
import { Tile } from '@app/game-logic/game/board/tile';
import { PlaceLetterPointsEstimation, WordPointsEstimation } from '@app/game-logic/player/bot-calculator/calculation-estimation';

const BONUS = 50;
const MAX_LETTER_IN_RACK = 7;

@Injectable({
    providedIn: 'root',
})
export class BotCalculatorService {
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

    private calculatePointsOfWord(word: Tile[]): number {
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

    private calculatePointsForEachWord(wordList: Tile[][]): WordPointsEstimation[] {
        const wordPoints: WordPointsEstimation[] = wordList.map((wordTile) => {
            const word = this.tileToString(wordTile);
            const points = this.calculatePointsOfWord(wordTile);
            return { word, points };
        });
        return wordPoints;
    }

    private tileToString(word: Tile[]): string {
        let wordTemp = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    }
}
