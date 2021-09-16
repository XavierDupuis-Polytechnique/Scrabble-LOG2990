import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Player } from './player';
import { ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];
    boardState: BoardService;
    dictionary: DictionaryService;

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string, boardService: BoardService, dictionaryService: DictionaryService) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
        this.boardState = boardService;
        this.dictionary = dictionaryService;
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
    bruteForceStart(): ValidWord[] {
        const grid = this.boardState.board.grid;
        const validWordList: ValidWord[] = [];
        const startingX = 0;
        const startingY = 0;
        // let isTimesUp = false;

        this.boardCrawler(startingX, startingY, grid, validWordList);

        // grid[1][1].letterObject;

        return validWordList;
    }

    // TODO
    private boardCrawler(startingX: number, startingY: number, grid: Tile[][], validWordList: ValidWord[]) {
        const x = startingX;
        const y = startingY;

        // stuff

        this.hookUtil(x, y, grid, validWordList);

        // this.boardCrawler(newX, newY, grid, validWordList);
    }

    // TODO Might not be necessary
    private hookUtil(x: number, y: number, grid: Tile[][], validWordList: ValidWord[]) {}

    // TODO And make private
    wordValidator(x: number, y: number, grid: Tile[][], validWordList: ValidWord[]) {}

    // TODO Remove commented console.log/code and make private
    // Check if it's possible to form the word with the currently available letters
    regexCheck(dictWord: string, placedWord: string): boolean {
        // let testBot = new EasyBot('Jimmy');
        // console.log(testBot.regexCheck('keyboard', 'oa'));
        // let letterRack = 'keybrd';

        const letterRack = this.letterRack;
        const mapRack = new Map();
        const NOTFOUND = -1;
        const FIRSTLETTER = 1;
        const WORDLENGHT = dictWord.length;

        for (const letter of letterRack) {
            if (mapRack.has(letter)) {
                mapRack.set(letter, mapRack.get(letter) + 1);
            } else {
                mapRack.set(letter, 1);
            }
        }
        let regex = new RegExp(placedWord.toLowerCase());
        let INDEX = dictWord.search(regex);
        if (INDEX === NOTFOUND) {
            return false;
        }
        while (INDEX !== FIRSTLETTER) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp('(?<=[' + lettersLeft + '])' + placedWord.toLowerCase());
            INDEX = dictWord.search(regex);

            if (INDEX === NOTFOUND) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = dictWord[INDEX - 1].toUpperCase() + placedWord;
                } else break;
            } else {
                this.deleteTmpLetter(dictWord[INDEX - 1], mapRack);
                placedWord = dictWord[INDEX - 1] + placedWord;
            }
        }
        while (placedWord.length !== WORDLENGHT) {
            const lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp(placedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            INDEX = dictWord.search(regex);
            if (INDEX === NOTFOUND) {
                if (mapRack.has('*')) {
                    regex = new RegExp(placedWord.toLowerCase());
                    INDEX = dictWord.search(regex);
                    this.deleteTmpLetter('*', mapRack);
                    placedWord = placedWord + dictWord[placedWord.length].toUpperCase();
                } else break;
            } else {
                this.deleteTmpLetter(dictWord[placedWord.length], mapRack);
                placedWord = placedWord + dictWord[placedWord.length];
            }
        }
        // if(dictWord.search(regex) !== NOTFOUND)
        if (dictWord === placedWord.toLowerCase()) {
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
