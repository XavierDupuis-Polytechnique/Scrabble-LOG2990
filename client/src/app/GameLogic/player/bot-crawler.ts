import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { Bot } from '@app/GameLogic/player/bot';
import { ValidWord, VERTICAL } from '@app/GameLogic/player/valid-word';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';

const EMPTY = 0;
const END_OF_BOARD = 14;
const START_OF_BOARD = 0;
const MIDDLE_OF_BOARD = 7;

export class BotCrawler {
    constructor(
        private bot: Bot,
        private dictionaryService: DictionaryService,
        protected pointCalculatorService: PointCalculatorService,
        protected wordValidator: WordSearcher,
    ) {}

    botFirstTurn() {
        for (let rackIndex = 0; rackIndex < this.bot.letterRack.length; rackIndex++) {
            const startingLetter = this.bot.letterRack[rackIndex].char.toLowerCase();
            if (startingLetter !== '*') {
                const placedLetter: ValidWord[] = [];
                const initialWord = new ValidWord(startingLetter);
                const tmpLetter = this.bot.letterRack.splice(rackIndex, 1);

                if (this.bot.getRandomInt(1)) {
                    initialWord.isVertical = VERTICAL;
                }

                initialWord.startingTileX = MIDDLE_OF_BOARD;
                initialWord.startingTileY = MIDDLE_OF_BOARD;
                initialWord.leftCount = MIDDLE_OF_BOARD;
                initialWord.rightCount = MIDDLE_OF_BOARD;
                placedLetter.push(initialWord);
                const possiblyValidWords: ValidWord[] = this.wordCheck(placedLetter);
                this.bot.letterRack.push(tmpLetter[0]);

                this.crossCheck(possiblyValidWords);
            }
        }
    }

    boardCrawler(startingX: number, startingY: number, grid: Tile[][], isVerticalFlag: boolean) {
        let x = startingX;
        let y = startingY;
        let isVertical = isVerticalFlag;
        let letterInBox = grid[y][x].letterObject.char;

        while (letterInBox === ' ') {
            if (isVertical) {
                if (y !== END_OF_BOARD) {
                    y++;
                } else break;
            } else {
                if (x !== END_OF_BOARD) {
                    x++;
                } else break;
            }
            letterInBox = grid[y][x].letterObject.char;
        }
        if (letterInBox !== ' ') {
            const lettersOnLine: ValidWord = new ValidWord('');
            this.getLettersOnLine(x, y, lettersOnLine, grid, isVertical, letterInBox);
            const allPlacedLettersCombination = this.lineSplitter(lettersOnLine);
            const possiblyValidWords: ValidWord[] = this.wordCheck(allPlacedLettersCombination);
            this.crossCheck(possiblyValidWords);
        }

        if (isVertical && x < END_OF_BOARD) {
            x++;
            y = START_OF_BOARD;
            this.boardCrawler(x, y, grid, isVertical);
            return;
        } else if (isVertical && x === END_OF_BOARD) {
            return;
        }
        if (!isVertical && y < END_OF_BOARD) {
            x = START_OF_BOARD;
            y++;
            this.boardCrawler(x, y, grid, isVertical);
            return;
        } else if (!isVertical && y === END_OF_BOARD) {
            x = START_OF_BOARD;
            y = START_OF_BOARD;
            isVertical = true;
            this.boardCrawler(x, y, grid, isVertical);
            return;
        }
    }

    lineSplitter(lettersOnLine: ValidWord): ValidWord[] {
        const allPossibilities: ValidWord[] = [];
        const notFound = -1;
        const startOfLine = 0;
        let leftIndex = startOfLine;
        let rightIndex = startOfLine;
        const endOfLine = lettersOnLine.word.length;
        let subWord: string;

        let emptyBox = lettersOnLine.word.indexOf('-');
        let index = emptyBox;

        if (emptyBox === notFound) {
            lettersOnLine.word = lettersOnLine.word.toLowerCase();
            allPossibilities.push(lettersOnLine);
        } else {
            let maxGroupSize = 1;

            while (emptyBox !== notFound) {
                maxGroupSize++;

                while (lettersOnLine.word.charAt(index) === '-') {
                    index++;
                }
                leftIndex = index;
                emptyBox = lettersOnLine.word.indexOf('-', leftIndex);
                index = emptyBox;
            }

            let tmpSubWord: ValidWord = new ValidWord('');
            let leftCounter = 0;
            let rightCounter = 0;

            for (let groupsOf = 1; groupsOf <= maxGroupSize; groupsOf++) {
                tmpSubWord = new ValidWord('');
                leftIndex = startOfLine;
                emptyBox = lettersOnLine.word.indexOf('-');
                index = emptyBox;

                for (let passCount = 1; passCount < groupsOf; passCount++) {
                    while (lettersOnLine.word.charAt(index) === '-') {
                        index++;
                    }
                    rightIndex = index;
                    emptyBox = lettersOnLine.word.indexOf('-', rightIndex);
                    index = emptyBox;
                }
                rightIndex = index;

                while (emptyBox !== notFound) {
                    tmpSubWord = new ValidWord('');
                    subWord = lettersOnLine.word.substring(leftIndex, rightIndex);
                    tmpSubWord.word = subWord.toLowerCase();
                    if (leftIndex === startOfLine) {
                        tmpSubWord.leftCount = lettersOnLine.leftCount;
                    } else {
                        tmpSubWord.leftCount = leftCounter;
                    }
                    tmpSubWord.isVertical = lettersOnLine.isVertical;
                    if (lettersOnLine.isVertical) {
                        tmpSubWord.startingTileY = lettersOnLine.startingTileY + leftIndex;
                        tmpSubWord.startingTileX = lettersOnLine.startingTileX;
                    } else {
                        tmpSubWord.startingTileY = lettersOnLine.startingTileY;
                        tmpSubWord.startingTileX = lettersOnLine.startingTileX + leftIndex;
                    }
                    rightCounter = 0;
                    rightIndex++;

                    while (lettersOnLine.word.charAt(rightIndex) === '-') {
                        rightCounter++;
                        rightIndex++;
                    }
                    tmpSubWord.rightCount = rightCounter;
                    allPossibilities.push(tmpSubWord);

                    while (lettersOnLine.word.charAt(leftIndex) !== '-') {
                        leftIndex++;
                    }
                    leftCounter = 0;
                    leftIndex++;

                    while (lettersOnLine.word.charAt(leftIndex) === '-') {
                        leftCounter++;
                        leftIndex++;
                    }
                    emptyBox = lettersOnLine.word.indexOf('-', rightIndex);
                    rightIndex = emptyBox;
                }
                tmpSubWord = new ValidWord('');
                subWord = lettersOnLine.word.substring(leftIndex, endOfLine);
                tmpSubWord.word = subWord.toLowerCase();
                if (leftIndex === startOfLine) {
                    tmpSubWord.leftCount = lettersOnLine.leftCount;
                } else {
                    tmpSubWord.leftCount = leftCounter;
                }
                tmpSubWord.rightCount = lettersOnLine.rightCount;
                tmpSubWord.isVertical = lettersOnLine.isVertical;
                if (lettersOnLine.isVertical) {
                    tmpSubWord.startingTileY = lettersOnLine.startingTileY + leftIndex;
                    tmpSubWord.startingTileX = lettersOnLine.startingTileX;
                } else {
                    tmpSubWord.startingTileY = lettersOnLine.startingTileY;
                    tmpSubWord.startingTileX = lettersOnLine.startingTileX + leftIndex;
                }
                allPossibilities.push(tmpSubWord);
            }
        }
        return allPossibilities;
    }

    private getLettersOnLine(x: number, y: number, lettersOnLine: ValidWord, grid: Tile[][], isVertical: boolean, letterInBox: string) {
        let lastLetterOfLine: number;
        let rightCount = 0;
        if (isVertical) {
            lettersOnLine.leftCount = y;
        } else {
            lettersOnLine.leftCount = x;
        }
        lettersOnLine.isVertical = isVertical;
        lettersOnLine.startingTileX = x;
        lettersOnLine.startingTileY = y;
        if (isVertical) {
            let tmpY = END_OF_BOARD;
            let tmpYLetterInBox = grid[tmpY][x].letterObject.char;

            while (tmpYLetterInBox === ' ') {
                tmpY--;
                rightCount++;
                tmpYLetterInBox = grid[tmpY][x].letterObject.char;
            }
            lastLetterOfLine = tmpY;
            lettersOnLine.rightCount = rightCount;
            tmpY = y;

            while (tmpY <= lastLetterOfLine) {
                letterInBox = grid[tmpY][x].letterObject.char;
                lettersOnLine.word = lettersOnLine.word.concat(this.emptyCheck(letterInBox));
                tmpY++;
            }
        } else {
            let tmpX = END_OF_BOARD;
            let tmpXLetterInBox = grid[y][tmpX].letterObject.char;

            while (tmpXLetterInBox === ' ') {
                tmpX--;
                rightCount++;
                tmpXLetterInBox = grid[y][tmpX].letterObject.char;
            }
            lastLetterOfLine = tmpX;
            lettersOnLine.rightCount = rightCount;
            tmpX = x;

            while (tmpX <= lastLetterOfLine) {
                letterInBox = grid[y][tmpX].letterObject.char;
                lettersOnLine.word = lettersOnLine.word.concat(this.emptyCheck(letterInBox));
                tmpX++;
            }
        }
    }

    private emptyCheck(letterInBox: string): string {
        if (letterInBox !== ' ') {
            return letterInBox;
        } else {
            return '-';
        }
    }

    private wordCheck(allPlacedLettersCombination: ValidWord[]): ValidWord[] {
        const possiblyValidWords: ValidWord[] = [];
        let tmpWordList: ValidWord[] = [];

        for (const placedLetters of allPlacedLettersCombination) {
            tmpWordList = this.dictionaryService.wordGen(placedLetters);

            for (const word of tmpWordList) {
                const tmpLetterRack: Letter[] = [];

                for (const letter of this.bot.letterRack) {
                    tmpLetterRack.push(this.bot.letterCreator.createLetter(letter.char));
                }
                const wordToValidate = this.dictionaryService.regexCheck(word, placedLetters.word, tmpLetterRack);
                if (wordToValidate !== 'false') {
                    possiblyValidWords.push(
                        new ValidWord(
                            wordToValidate,
                            word.indexFound,
                            word.emptyCount,
                            word.leftCount,
                            word.rightCount,
                            word.isVertical,
                            word.startingTileX,
                            word.startingTileY,
                            word.numberOfLettersPlaced,
                        ),
                    );
                }
            }
        }
        return possiblyValidWords;
    }

    private crossCheck(possiblyValidWords: ValidWord[]) {
        for (const word of possiblyValidWords) {
            let placement: PlacementSetting;
            if (word.isVertical) {
                placement = { x: word.startingTileX, y: word.startingTileY, direction: 'V' };
            } else {
                placement = { x: word.startingTileX, y: word.startingTileY, direction: 'H' };
            }
            const fakeAction = new PlaceLetter(this.bot, word.word, placement, this.pointCalculatorService, this.wordValidator);
            const validWords = this.wordValidator.listOfValidWord(fakeAction);
            const wordIsValid = validWords.length > EMPTY;
            if (wordIsValid) {
                const words = validWords.map((validWord) => validWord.letters);
                const pointEstimation = this.pointCalculatorService.testPlaceLetterCalculation(word.numberOfLettersPlaced, words);
                word.value = pointEstimation.totalPoints;
                word.adjacentWords = validWords;
                this.bot.validWordList.push(word);
            }
        }
    }
}
