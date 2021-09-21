import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { Tile } from '@app/GameLogic/game/tile';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher';
import { BoardService } from '@app/services/board.service';
import { Player } from './player';
import { ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];
    isBoardEmpty: boolean;
    validWordList: ValidWord[];
    wordValidator: WordSearcher;
    game: Game;

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(
        name: string,
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        private pointCalculatorService: PointCalculatorService,
        game: Game,
    ) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
        this.isBoardEmpty = true;
        this.validWordList = [];
        this.wordValidator = new WordSearcher(boardService.board, this.dictionaryService);
        this.game = game;
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Will probably need to be moved to a UI component to show the name
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    // TODO Implement the 3 and 20 seconds timers and related functions
    bruteForceStart(): ValidWord[] {
        const grid = this.boardService.board.grid;
        const startingX = 0;
        const startingY = 0;
        const startingDirection = false;
        // let isTimesUp = false;

        this.validWordList = [];
        this.boardCrawler(startingX, startingY, grid, startingDirection);
        return this.validWordList;
    }

    botFirstTurn() {
        const minNumber = 0;
        const maxNumber = 6;
        const randomIndex = this.getRandomInt(minNumber, maxNumber);
        const startingLetter = this.letterRack[randomIndex].char;
        if (startingLetter === '*') {
            this.botFirstTurn();
        } else {
            const placedLetter: ValidWord[] = [];
            placedLetter.push(new ValidWord(startingLetter));
            const possiblyValidWords: ValidWord[] = this.wordCheck(placedLetter);
            for (const word of possiblyValidWords) {
                let placement: PlacementSetting;
                if (word.isVertical) {
                    placement = { x: word.startingTileX, y: word.startingTileY, direction: 'V' };
                } else {
                    placement = { x: word.startingTileX, y: word.startingTileY, direction: 'H' };
                }
                const fakeAction = new PlaceLetter(this, word.word, placement);
                if (this.wordValidator.validatePlacement(fakeAction)) {
                    word.value = this.pointCalculatorService.placeLetterPointsCalculation(fakeAction, word.adjacentWords, this, this.game);
                    this.validWordList.push(word);
                }
            }
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
                    tmpSubWord.word = subWord;
                    if (leftIndex === startOfLine) {
                        tmpSubWord.leftCount = lettersOnLine.leftCount;
                    } else {
                        tmpSubWord.leftCount = leftCounter;
                    }
                    tmpSubWord.isVertical = lettersOnLine.isVertical;
                    tmpSubWord.startingTileX = lettersOnLine.startingTileX;
                    tmpSubWord.startingTileY = lettersOnLine.startingTileY;
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
                tmpSubWord.startingTileX = lettersOnLine.startingTileX;
                tmpSubWord.startingTileY = lettersOnLine.startingTileY;
                allPossibilities.push(tmpSubWord);
            }
        }
        return allPossibilities;
    }

    // TODO Verify if edge case where only one letter is placed works
    private boardCrawler(startingX: number, startingY: number, grid: Tile[][], isVerticalFlag: boolean) {
        let x = startingX;
        let y = startingY;
        const endOfBoard = 14;
        const startOfBoard = 0;
        let isVertical = isVerticalFlag;
        const lettersOnLine: ValidWord = new ValidWord('');

        let letterInBox = grid[x][y].letterObject.char;
        while (letterInBox === ' ') {
            if (isVertical) {
                if (y === endOfBoard) {
                    break;
                } else {
                    y++;
                    letterInBox = grid[x][y].letterObject.char;
                }
            } else {
                if (x === endOfBoard) {
                    break;
                } else {
                    x++;
                    letterInBox = grid[x][y].letterObject.char;
                }
            }
        }
        if (letterInBox !== ' ') {
            this.isBoardEmpty = false;
            let lastLetterOfLine: number;
            let rightCount = 0;
            lettersOnLine.leftCount = x;
            lettersOnLine.isVertical = isVertical;
            lettersOnLine.startingTileX = x;
            lettersOnLine.startingTileY = y;
            if (isVertical) {
                let tmpY = endOfBoard;
                let tmpYLetterInBox = grid[x][tmpY].letterObject.char;
                while (tmpYLetterInBox === ' ') {
                    tmpY--;
                    rightCount++;
                    tmpYLetterInBox = grid[x][tmpY].letterObject.char;
                }
                lastLetterOfLine = tmpY;
                lettersOnLine.rightCount = rightCount;
                tmpY = y;
                while (tmpY <= lastLetterOfLine) {
                    lettersOnLine.word = lettersOnLine.word.concat(this.emptyCheck(letterInBox));
                    tmpY++;
                    letterInBox = grid[x][tmpY].letterObject.char;
                }
            } else {
                let tmpX = endOfBoard;
                let tmpXLetterInBox = grid[tmpX][y].letterObject.char;
                while (tmpXLetterInBox === ' ') {
                    tmpX--;
                    rightCount++;
                    tmpXLetterInBox = grid[tmpX][y].letterObject.char;
                }
                lastLetterOfLine = tmpX;
                lettersOnLine.rightCount = rightCount;
                tmpX = x;
                while (tmpX <= lastLetterOfLine) {
                    lettersOnLine.word = lettersOnLine.word.concat(this.emptyCheck(letterInBox));
                    tmpX++;
                    letterInBox = grid[tmpX][y].letterObject.char;
                }
            }

            const allPlacedLettersCombination = this.lineSplitter(lettersOnLine);
            const possiblyValidWords: ValidWord[] = this.wordCheck(allPlacedLettersCombination);

            // start
            for (const word of possiblyValidWords) {
                this.validWordList.push(word);
            }
            // end

            // for (const word of possiblyValidWords) {
            //     let placement: PlacementSetting;
            //     if (word.isVertical) {
            //         placement = { x: word.startingTileX, y: word.startingTileY, direction: 'V' };
            //     } else {
            //         placement = { x: word.startingTileX, y: word.startingTileY, direction: 'H' };
            //     }

            //     const fakeAction = new PlaceLetter(this, word.word, placement);

            //     if (this.wordValidator.validatePlacement(fakeAction)) {
            //         word.value = this.pointCalculatorService.placeLetterPointsCalculation(fakeAction, word.adjacentWords, this, this.game);
            //         this.validWordList.push(word);
            //     }
            // }
        }

        if (isVertical && x < endOfBoard) {
            x++;
            y = startOfBoard;
            this.boardCrawler(x, y, grid, isVertical);
        } else if (isVertical && x === endOfBoard) {
            this.botFirstTurn();
            return;
        }
        if (!isVertical && y < endOfBoard) {
            x = startOfBoard;
            y++;
            this.boardCrawler(x, y, grid, isVertical);
        } else if (!isVertical && x === endOfBoard) {
            x = startOfBoard;
            y = startOfBoard;
            isVertical = true;
            this.boardCrawler(x, y, grid, isVertical);
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
                if (this.dictionaryService.regexCheck(word, placedLetters.word, this)) {
                    possiblyValidWords.push(word);
                }
            }
        }
        return possiblyValidWords;
    }
}

// if (x < endOfBoard) {
//     x++;
//     this.boardCrawler(x, y, grid, isVertical);
// } else if (y < endOfBoard && x === endOfBoard) {
//     x = startOfBoard;
//     y++;
//     this.boardCrawler(x, y, grid, isVertical);
// } else if (y === endOfBoard && x === endOfBoard && !isVertical) {
//     x = startOfBoard;
//     y = startOfBoard;
//     isVertical = true;
// }
// return;

// this.boardCrawler(newX, newY, grid);
