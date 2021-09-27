import { Action } from '@app/GameLogic/actions/action';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { Tile } from '@app/GameLogic/game/tile';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { BoardService } from '@app/services/board.service';
import { BehaviorSubject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Player } from './player';
import { HORIZONTAL, ValidWord, VERTICAL } from './valid-word';

const TIME_BEFORE_PICKING_ACTION = 3000;
const TIME_BEFORE_PASS = 20000;
export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];
    static MIDDLE_OF_BOARD = 7;
    isBoardEmpty: boolean;
    validWordList: ValidWord[];
    wordValidator: WordSearcher;

    private chosenAction$ = new BehaviorSubject<Action | undefined>(undefined);
    chooseAction(action: Action) {
        this.chosenAction$.next(action);
        this.chosenAction$.complete();
    }

    // TODO: find better name
    startTimerAction() {
        const timerPass = timer(TIME_BEFORE_PASS);
        timerPass.subscribe(() => {
            this.play(new PassTurn(this));
        });
        timer(TIME_BEFORE_PICKING_ACTION).subscribe(() => {
            const action = this.chosenAction$.value;
            if (action !== undefined) {
                this.play(action);
            } else {
                this.chosenAction$.pipe(takeUntil(timerPass)).subscribe((chosenAction) => {
                    if (chosenAction !== undefined) {
                        this.play(chosenAction);
                    }
                });
            }
        });
    }
    // Start of debug code
    // startTimerAction() {
    //     const timerPass = timer(TIME_BEFORE_PASS);
    //     timerPass.subscribe(() => {
    //         this.play(new PassTurn(this));
    //     });
    //     timer(TIME_BEFORE_PICKING_ACTION).subscribe(() => {
    //         console.log('timer time 3s up');
    //         console.log(JSON.stringify(this.letterRack));
    //         const action = this.chosenAction$.value;
    //         if (action !== undefined) {
    //             console.log('bot play action');
    //             if (action instanceof PlaceLetter) {
    //                 console.log('word to play', action as PlaceLetter);
    //             }
    //             this.play(action);
    //         } else {
    //             this.chosenAction$.pipe(takeUntil(timerPass)).subscribe((chosenAction) => {
    //                 if (chosenAction !== undefined) {
    //                     this.play(chosenAction);
    //                 }
    //             });
    //         }
    //     });
    // }
    // End of debug code

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(
        name: string,
        private boardService: BoardService,
        private dictionaryService: DictionaryService,
        public pointCalculatorService: PointCalculatorService,
        private wordSearcher: WordSearcher, // private game: Game,
    ) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
        this.isBoardEmpty = true;
        this.validWordList = [];
        // this.wordValidator = new WordSearcher(boardService, this.dictionaryService);
        // this.game = game;
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
        const startingDirection = HORIZONTAL;
        // TODO Put the 20 seconds timesUp thingy
        // let isTimesUp = false;

        this.validWordList = [];
        const letterInMiddleBox = grid[Bot.MIDDLE_OF_BOARD][Bot.MIDDLE_OF_BOARD].letterObject.char;
        if (letterInMiddleBox !== ' ') {
            this.boardCrawler(startingX, startingY, grid, startingDirection);
        } else {
            this.botFirstTurn();
        }
        return this.validWordList;
    }

    botFirstTurn() {
        for (let rackIndex = 0; rackIndex < this.letterRack.length; rackIndex++) {
            const startingLetter = this.letterRack[rackIndex].char.toLowerCase();
            if (startingLetter !== '*') {
                const placedLetter: ValidWord[] = [];
                const initialWord = new ValidWord(startingLetter);
                const tmpLetter = this.letterRack.splice(rackIndex, 1);

                if (this.getRandomInt(1)) {
                    initialWord.isVertical = VERTICAL;
                }
                initialWord.startingTileX = Bot.MIDDLE_OF_BOARD;
                initialWord.startingTileY = Bot.MIDDLE_OF_BOARD;
                initialWord.leftCount = Bot.MIDDLE_OF_BOARD;
                initialWord.rightCount = Bot.MIDDLE_OF_BOARD;
                placedLetter.push(initialWord);
                const possiblyValidWords: ValidWord[] = this.wordCheck(placedLetter);
                this.letterRack.push(tmpLetter[0]);

                for (const word of possiblyValidWords) {
                    let placement: PlacementSetting;
                    if (word.isVertical) {
                        placement = { x: word.startingTileX, y: word.startingTileY, direction: 'V' };
                    } else {
                        placement = { x: word.startingTileX, y: word.startingTileY, direction: 'H' };
                    }
                    const fakeAction = new PlaceLetter(this, word.word, placement, this.pointCalculatorService, this.wordValidator);
                    const validWords = this.wordValidator.listOfValidWord(fakeAction);
                    const wordIsValid = validWords.length !== 0;
                    if (wordIsValid) {
                        // TODO: update word value
                        // TODO get the number of letter placed

                        // tmp start
                        // const tmpList: Tile[][] = [];
                        // for (const tmpword of validWords) {
                        //     tmpList.push(tmpword.letters);
                        // }
                        // tmp end
                        // TODO Calculate the number of placed letters
                        // word.value = this.pointCalculatorService.testPlaceLetterCalculation(5, validWords).totalPoints;

                        this.validWordList.push(word);
                    }
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

    private boardCrawler(startingX: number, startingY: number, grid: Tile[][], isVerticalFlag: boolean) {
        let x = startingX;
        let y = startingY;
        const endOfBoard = 14;
        const startOfBoard = 0;
        let isVertical = isVerticalFlag;

        let letterInBox = grid[y][x].letterObject.char;
        while (letterInBox === ' ') {
            if (isVertical) {
                if (y !== endOfBoard) {
                    y++;
                } else break;
            } else {
                if (x !== endOfBoard) {
                    x++;
                } else break;
            }
            letterInBox = grid[y][x].letterObject.char;
        }
        if (letterInBox !== ' ') {
            const lettersOnLine: ValidWord = new ValidWord('');
            this.isBoardEmpty = false;
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
                let tmpY = endOfBoard;
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
                let tmpX = endOfBoard;
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

            const allPlacedLettersCombination = this.lineSplitter(lettersOnLine);
            const possiblyValidWords: ValidWord[] = this.wordCheck(allPlacedLettersCombination);

            // // start
            // for (const word of possiblyValidWords) {
            //     this.validWordList.push(word);
            // }
            // // end

            for (const word of possiblyValidWords) {
                let placement: PlacementSetting;
                if (word.isVertical) {
                    placement = { x: word.startingTileX, y: word.startingTileY, direction: 'V' };
                } else {
                    placement = { x: word.startingTileX, y: word.startingTileY, direction: 'H' };
                }

                const fakeAction = new PlaceLetter(this, word.word, placement, this.pointCalculatorService, this.wordValidator);
                const validWords = this.wordValidator.listOfValidWord(fakeAction);
                const wordIsValid = validWords.length > 0;
                if (wordIsValid) {
                    // TODO: update word value
                    // TODO get the number of letter placed

                    // tmp start
                    // const tmpList: Tile[][] = [];
                    // for (const tmpword of validWords) {
                    //     tmpList.push(tmpword.letters);
                    // }
                    // word.value = this.pointCalculatorService.testPlaceLetterCalculation(5, tmpList).totalPoints;
                    // tmp end

                    this.validWordList.push(word);
                }

                // if (this.wordValidator.validatePlacement(fakeAction)) {
                //     word.value = this.pointCalculatorService.placeLetterPointsCalculation(fakeAction, word.adjacentWords, this, this.game);
                //     this.validWordList.push(word);
                // }
            }
        }

        if (isVertical && x < endOfBoard) {
            x++;
            y = startOfBoard;
            this.boardCrawler(x, y, grid, isVertical);
            return;
        } else if (isVertical && x === endOfBoard) {
            return;
        }
        if (!isVertical && y < endOfBoard) {
            x = startOfBoard;
            y++;
            this.boardCrawler(x, y, grid, isVertical);
            return;
        } else if (!isVertical && y === endOfBoard) {
            x = startOfBoard;
            y = startOfBoard;
            isVertical = true;
            this.boardCrawler(x, y, grid, isVertical);
            return;
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
                const wordToValidate = this.dictionaryService.regexCheck(word, placedLetters.word, this);
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
                        ),
                    );
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
