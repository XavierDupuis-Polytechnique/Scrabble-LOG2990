import { Letter } from '@app/GameLogic/game/letter.interface';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Player } from './player';
import { ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];
    isBoardEmpty: boolean;
    validWordList: ValidWord[];

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string, private boardService: BoardService, private dictionaryService: DictionaryService) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
        this.isBoardEmpty = true;
        this.validWordList = [];
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Will probably need to be moved to a UI component to show the name
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    // TODO add the board and dictionary services to the bot creator
    // TODO Implement the 3 and 20 seconds timers and related functions
    bruteForceStart(): ValidWord[] {
        const grid = this.boardService.board.grid;
        const startingX = 0;
        const startingY = 0;
        const startingDirection = false;
        // let isTimesUp = false;

        this.validWordList = [];

        this.boardCrawler(startingX, startingY, grid, startingDirection);

        // grid[1][1].letterObject;

        return this.validWordList;
    }

    // TODO Verify if edge case where only one letter is placed works
    // TODO Add case where board is empty
    private boardCrawler(startingX: number, startingY: number, grid: Tile[][], isVerticalFlag: boolean) {
        let x = startingX;
        let y = startingY;
        const endOfBoard = 14;
        const startOfBoard = 0;
        let isVertical = isVerticalFlag;
        let lettersOnLine: ValidWord = new ValidWord('');

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
                if (x == endOfBoard) {
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
            let rightCount: number = 0;
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

            let allPlacedLettersCombination = this.lineSplitter(lettersOnLine);

            let possiblyValidWords: ValidWord[] = this.wordCheck(allPlacedLettersCombination);

            if (possiblyValidWords) {
            }
            // TODO Check here if the possible words are valid / crosscheck / scoring of the move
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
    }

    botFirstTurn() {
        let randomIndex = Math.floor(Math.random() * 6);
        let startingLetter = this.letterRack[randomIndex].char;
        if (startingLetter === '*') {
            this.botFirstTurn();
        } else {
            let placedLetter: string[] = [];
            placedLetter.push(startingLetter);
            //let possiblyValidWords: ValidWord[] = this.wordCheck(placedLetter);
            // send possiblyValidWords to scoring system
            // send actuallyValidWords to the global validWordList
        }

        throw new Error('Method not implemented.');
    }

    private emptyCheck(letterInBox: string): string {
        if (letterInBox !== ' ') {
            return letterInBox;
        } else {
            return '-';
        }
    }

    lineSplitter(lettersOnLine: ValidWord): ValidWord[] {
        let allPossibilities: ValidWord[] = [];
        const notFound = -1;
        let startOfLine = 0;
        let leftIndex = startOfLine;
        let rightIndex = startOfLine;
        const endOfLine = lettersOnLine.word.length;
        let subWord: string;
        // const indexCompensation = 1;
        // const BLANK = 0;
        // let tmpIndex = startOfLine;
        // let letterCountLeft = 0;

        // while (lettersOnLine.word[tmpIndex] === '-') {
        //     tmpIndex++;
        //     letterCountLeft++;
        // }

        let emptyBox = lettersOnLine.word.indexOf('-');
        let index = emptyBox;

        if (emptyBox === notFound) {
            // let tmpSubWord = new ValidWord(lettersOnLine.word);
            // tmpSubWord.leftCount = lettersOnLine.leftCount;
            // tmpSubWord.rightCount = lettersOnLine.rightCount;
            // tmpSubWord.isVertical = lettersOnLine.isVertical;
            // tmpSubWord.startingTileX = lettersOnLine.startingTileX;
            // tmpSubWord.startingTileY = lettersOnLine.startingTileY;

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
            let leftCounter: number = 0;
            let rightCounter: number = 0;
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

                    // if (isVertical) {
                    tmpSubWord.word = subWord;
                    if (leftIndex === startOfLine) {
                        tmpSubWord.leftCount = lettersOnLine.leftCount;
                    } else {
                        tmpSubWord.leftCount = leftCounter;
                    }
                    tmpSubWord.isVertical = lettersOnLine.isVertical;
                    tmpSubWord.startingTileX = lettersOnLine.startingTileX;
                    tmpSubWord.startingTileY = lettersOnLine.startingTileY;
                    //allPossibilities.push(new ValidWord(subWord, BLANK, BLANK, x, y, isVertical));
                    // } else {
                    //     allPossibilities.push(new ValidWord(subWord, BLANK, BLANK, x, y, isVertical));
                    // }
                    rightCounter = 0;
                    rightIndex++;
                    while (lettersOnLine.word.charAt(rightIndex) === '-') {
                        rightCounter++;
                        rightIndex++;
                    }
                    // if (rightCounter === 0) {
                    // tmpSubWord.rightCount = lettersOnLine.rightCount;
                    // } else {
                    tmpSubWord.rightCount = rightCounter;
                    // }
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
                tmpSubWord.word = subWord;
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

    // TODO
    private wordCheck(allPlacedLettersCombination: ValidWord[]): ValidWord[] {
        let possiblyValidWords: ValidWord[] = [];
        let tmpWordList: ValidWord[] = [];

        for (let placedLetters of allPlacedLettersCombination) {
            tmpWordList = this.dictionaryService.wordGen(placedLetters);
            for (let word of tmpWordList) {
                // TODO Check here if the words found can be placed with the available letters
                if (this.regexCheck(word, placedLetters.word)) {
                    possiblyValidWords.push(word);
                }
                // word.word.slice;
            }
        }
        return possiblyValidWords;
    }

    // TODO Make private / delete
    // wordValidator(x: number, y: number, grid: Tile[][], validWordList: ValidWord[]) {}

    // TODO Remove commented console.log/code and make private
    // Check if it's possible to form the word with the currently available letters
    regexCheck(dictWord: ValidWord, placedLetters: string): boolean {
        const letterRack = this.letterRack;
        const mapRack = new Map();
        const notFound = -1;
        const firstLetterIndex = 1;
        const wordLength = dictWord.word.length;
        let placedWord: string = '';
        for (let letter of placedLetters) {
            if (letter === '-') {
                placedWord += '.';
            } else {
                placedWord += letter;
            }
        }

        for (const letter of letterRack) {
            const letterCount = mapRack.get(letter);
            if (mapRack.has(letter)) {
                mapRack.set(letter, letterCount + 1);
            } else {
                mapRack.set(letter, 1);
            }
        }
        let regex = new RegExp(placedWord.toLowerCase());
        let INDEX = dictWord.word.search(regex);
        if (INDEX === notFound) {
            return false;
        }
        while (INDEX !== firstLetterIndex) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp('(?<=[' + lettersLeft + '])' + placedWord.toLowerCase());
            INDEX = dictWord.word.search(regex);

            if (INDEX === notFound) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = dictWord.word[INDEX - 1].toUpperCase() + placedWord;
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[INDEX - 1], mapRack);
                placedWord = dictWord.word[INDEX - 1] + placedWord;
            }
        }

        let indexOfDot: number = placedWord.indexOf('.');
        while (indexOfDot !== notFound) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp(placedWord.substring(0, indexOfDot).toLowerCase() + '(?=[' + lettersLeft + '])');
            INDEX = dictWord.word.search(regex);
            if (INDEX === notFound) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord =
                        placedWord.substring(0, indexOfDot) + dictWord.word[placedWord.length].toUpperCase() + placedWord.substring(indexOfDot + 1);
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[placedWord.length], mapRack);
                placedWord =
                    placedWord.substring(0, indexOfDot) +
                    dictWord.word[placedWord.substring(0, indexOfDot).length] +
                    placedWord.substring(indexOfDot + 1);
            }
            indexOfDot = placedWord.indexOf('.');
        }

        while (placedWord.length !== wordLength) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp(placedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            INDEX = dictWord.word.search(regex);
            if (INDEX === notFound) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.word.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = placedWord + dictWord.word[placedWord.length].toUpperCase();
                } else break;
            } else {
                this.deleteTmpLetter(dictWord.word[placedWord.length], mapRack);
                placedWord = placedWord + dictWord.word[placedWord.length];
            }
        }
        if (dictWord.word === placedWord.toLowerCase()) {
            return true;
        } else {
            return false;
        }
    }

    private deleteTmpLetter(placedLetter: string, mapRack: Map<string, number>) {
        if (!mapRack) return;
        const letterCount = mapRack.get(placedLetter);
        if (!letterCount) return;
        if (letterCount > 1) {
            mapRack.set(placedLetter, letterCount - 1);
        } else {
            mapRack.delete(placedLetter);
        }
    }

    private tmpLetterLeft(mapRack: Map<Letter, number>): string {
        let lettersLeft = '';
        if (!mapRack) return lettersLeft;
        for (const key of mapRack.keys()) {
            if (key.char !== '*') {
                const letterCount = mapRack.get(key);
                if (!letterCount) return lettersLeft;
                for (let i = 0; i < letterCount; i++) {
                    lettersLeft += key.char;
                }
            }
        }
        return lettersLeft;
    }
    generateWordList(/* board, availableLetter*/): ValidWord[] {
        // TO DO : a LOT of stuff goes here
        this.letterRack;
        return [];
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
