import { Tile } from '@app/GameLogic/game/tile';
import { BoardService } from '@app/services/board.service';
import { Player } from './player';
import { ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Will probably need to be moved to a UI component to show the name
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    //TODO : a LOT of stuff goes here
    bruteForceStart(boardState: BoardService): ValidWord[] {
        let grid = boardState.board.grid;
        let validWordList: ValidWord[] = [];
        let startingX = 0;
        let startingY = 0;
        // let isTimesUp = false;

        this.boardCrawler(startingX, startingY, grid, validWordList);

        // grid[1][1].letterObject;

        return validWordList;
    }

    //TODO
    private boardCrawler(startingX: number, startingY: number, grid: Tile[][], validWordList: ValidWord[]) {
        let x = startingX;
        let y = startingY;

        //stuff

        this.hookUtil(x, y, grid, validWordList);

        // this.boardCrawler(newX, newY, grid, validWordList);
    }

    //TODO Might not be necessary
    private hookUtil(x: number, y: number, grid: Tile[][], validWordList: ValidWord[]) {}

    //TODO And make private
    wordValidator(x: number, y: number, grid: Tile[][], validWordList: ValidWord[]) {}

    //TODO Remove commented console.log/code
    // Check if it's possible to form the word with the currently available letters
    regexCheck(dictWord: string, placedWord: string): boolean {
        // let testBot = new EasyBot('Jimmy');
        // console.log(testBot.regexCheck('keyboard', 'oa'));
        // let letterRack = 'keybrd';

        let letterRack = this.letterRack;
        let mapRack = new Map();
        let NOTFOUND = -1;
        let FIRSTLETTER = 1;
        let WORDLENGHT = dictWord.length;

        for (let letter of letterRack) {
            if (mapRack.has(letter)) {
                mapRack.set(letter, mapRack.get(letter) + 1);
            } else {
                mapRack.set(letter, 1);
            }
        }
        let regex = new RegExp(placedWord.toLowerCase());
        let INDEX = dictWord.search(regex);
        if (INDEX == NOTFOUND) {
            return false;
        }
        while (INDEX != FIRSTLETTER) {
            let lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp('(?<=[' + lettersLeft + '])' + placedWord.toLowerCase());
            INDEX = dictWord.search(regex);

            if (INDEX == NOTFOUND) {
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
        while (placedWord.length != WORDLENGHT) {
            let lettersLeft = this.tmpLetterLeft(mapRack);
            regex = new RegExp(placedWord.toLowerCase() + '(?=[' + lettersLeft + '])');
            INDEX = dictWord.search(regex);
            if (INDEX == NOTFOUND) {
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
        if (dictWord.search(regex) != -1) {
            //console.log('Found_Word: ' + placedWord);
            return true;
        } else {
            //console.log('Not_Found');
            return false;
        }
    }

    private deleteTmpLetter(PLACEDLETTER: string, mapRack: any) {
        if (mapRack.get(PLACEDLETTER) > 1) {
            mapRack.set(PLACEDLETTER, mapRack.get(PLACEDLETTER) - 1);
        } else {
            mapRack.delete(PLACEDLETTER);
        }
    }

    private tmpLetterLeft(mapRack: any): string {
        let lettersLeft = '';
        for (let key of mapRack.keys()) {
            if (key == '*') {
            } else {
                for (let i = 0; i < mapRack.get(key); i++) {
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
