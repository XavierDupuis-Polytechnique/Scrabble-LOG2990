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
        let lettersOnLine = '';

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
            if (isVertical) {
                let tmpY = endOfBoard;
                let tmpYLetterInBox = grid[x][tmpY].letterObject.char;
                while (tmpYLetterInBox === ' ') {
                    tmpY--;
                    tmpYLetterInBox = grid[x][tmpY].letterObject.char;
                }
                lastLetterOfLine = tmpY;
                tmpY = y;
                while (tmpY <= lastLetterOfLine) {
                    lettersOnLine = lettersOnLine.concat(this.emptyCheck(letterInBox));
                    tmpY++;
                    letterInBox = grid[x][tmpY].letterObject.char;
                }
            } else {
                let tmpX = endOfBoard;
                let tmpXLetterInBox = grid[tmpX][y].letterObject.char;
                while (tmpXLetterInBox === ' ') {
                    tmpX--;
                    tmpXLetterInBox = grid[tmpX][y].letterObject.char;
                }
                lastLetterOfLine = tmpX;
                tmpX = x;
                while (tmpX <= lastLetterOfLine) {
                    lettersOnLine = lettersOnLine.concat(this.emptyCheck(letterInBox));
                    tmpX++;
                    letterInBox = grid[tmpX][y].letterObject.char;
                }
            }

            let allPlacedLettersCombination = this.lineSplitter(lettersOnLine);

            // TODO Check dict here for list of words
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

    lineSplitter(lettersOnLine: string): string[] {
        let allPossibilities: string[] = [];
        const notFound = -1;
        let emptyBox = lettersOnLine.indexOf('-');
        const startOfLine = 0;
        let leftIndex = startOfLine;
        let rightIndex = startOfLine;
        const endOfLine = lettersOnLine.length;
        let subWord: string;
        let index = emptyBox;
        const indexCompensation = 1;

        if (emptyBox === notFound) {
            allPossibilities.push(lettersOnLine);
        } else {
            let maxGroupSize = 1;
            while (emptyBox !== notFound) {
                maxGroupSize++;
                while (lettersOnLine.charAt(index) === '-') {
                    index++;
                }
                leftIndex = index;
                emptyBox = lettersOnLine.substring(leftIndex, endOfLine).indexOf('-');
                index += emptyBox + indexCompensation;
            }

            let groupsOf = 1;
            while (groupsOf <= maxGroupSize) {
                leftIndex = startOfLine;
                emptyBox = lettersOnLine.indexOf('-');
                index = emptyBox;

                let passCount = 1;
                while (passCount < groupsOf) {
                    while (lettersOnLine.charAt(index) === '-') {
                        index++;
                    }
                    rightIndex = index;
                    emptyBox = lettersOnLine.substring(rightIndex, endOfLine).indexOf('-');
                    index += emptyBox;
                    passCount++;
                }

                rightIndex = index;
                while (emptyBox !== notFound) {
                    subWord = lettersOnLine.substring(leftIndex, rightIndex);
                    allPossibilities.push(subWord);
                    while (lettersOnLine.charAt(++rightIndex) === '-') {}
                    while (lettersOnLine.charAt(++leftIndex) !== '-') {}
                    while (lettersOnLine.charAt(++leftIndex) === '-') {}

                    emptyBox = lettersOnLine.substring(rightIndex, endOfLine).indexOf('-');
                    rightIndex += emptyBox;
                }
                subWord = lettersOnLine.substring(leftIndex, endOfLine);
                allPossibilities.push(subWord);
                groupsOf++;
            }
        }
        return allPossibilities;
    }

    // TODO
    private wordCheck(allPlacedLettersCombination: string[]): ValidWord[] {
        let possiblyValidWords: ValidWord[] = [];
        let tmpWordList: ValidWord[] = [];

        for (let placedLetters in allPlacedLettersCombination) {
            tmpWordList = this.dictionaryService.wordGen(placedLetters);
            for (let word of tmpWordList) {
                // TODO Check here if the words found can be placed with the available letters
                if (this.regexCheck(word, placedLetters)) {
                    possiblyValidWords.push(word);
                }
                word.word.slice;
            }
        }
        return possiblyValidWords;
    }

    // TODO Make private
    wordValidator(x: number, y: number, grid: Tile[][], validWordList: ValidWord[]) {}

    // TODO Remove commented console.log/code and make private
    // TODO Rework to support empty boxes between placed letters ('-')
    // Check if it's possible to form the word with the currently available letters
    regexCheck(dictWord: ValidWord, placedLetters: string): boolean {
        // let testBot = new EasyBot('Jimmy');
        // console.log(testBot.regexCheck('keyboard', 'oa'));
        // let letterRack = 'ydebrk';

        const letterRack = this.letterRack;
        const mapRack = new Map();
        const notFound = -1;
        const firstLetterIndex = 1;
        const wordLength = dictWord.word.length;
        let placedWord = placedLetters;

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
        // if(dictWord.word.search(regex) !== notFound)
        if (dictWord.word === placedWord.toLowerCase()) {
            // console.log('Found_Word: ' + placedWord);
            return true;
        } else {
            // console.log('Not_Found');
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

    private tmpLetterLeft(mapRack: Map<string, number>): string {
        let lettersLeft = '';
        if (!mapRack) return lettersLeft;
        for (const key of mapRack.keys()) {
            if (key !== '*') {
                const letterCount = mapRack.get(key);
                if (!letterCount) return lettersLeft;
                for (let i = 0; i < letterCount; i++) {
                    lettersLeft += key;
                }
            }
        }
        return lettersLeft;
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
