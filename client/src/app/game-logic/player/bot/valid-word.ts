import { PlaceLetterPointsEstimation } from '@app/game-logic/player/bot-calculator/calculation-estimation';
import { Word } from '@app/game-logic/validator/word-search/word';

export const VERTICAL = true;
export const HORIZONTAL = false;
export class ValidWord {
    constructor(
        public word: string,
        public indexFound: number = 0,
        public emptyCount: number = 0,
        public leftCount: number = 0,
        public rightCount: number = 0,
        public isVertical: boolean = HORIZONTAL,
        public startingTileX: number = 0,
        public startingTileY: number = 0,
        public numberOfLettersPlaced: number = 0,
        public adjacentWords: Word[] = [],
        public value: PlaceLetterPointsEstimation = { isBingo: false, totalPoints: 0, wordsPoints: [] },
    ) {}
}
