import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';

const BOARD_MIN_POSITION_X = 0;
const BOARD_MIN_POSITION_Y = 0;
const BOARD_MAX_POSITION_X = 15;
const BOARD_MAX_POSITION_Y = 15;

@Injectable({
    providedIn: 'root',
})
export class WordSearcher {
    listOfValidWord: Tile[][] = [];
    letterCreator = new LetterCreator();
    isValid: boolean = false;
    constructor(private boardService: BoardService, private dictionaryService: DictionaryService) {}

    get grid() {
        return this.boardService.board.grid;
    }

    getListOfValidWord(): Tile[][] {
        return this.listOfValidWord;
    }

    validateWords(action: PlaceLetter): boolean {
        if (this.dictionaryService.isWordInDict(action.word)) {
            const lettersToPlace = this.findCoordOfLettersToPLace(action);
            for (const letter of lettersToPlace) {
                const letterPos = { x: letter.x, y: letter.y };
                this.goToBeginningOfWord(action, letter);
                const word = this.goToEndOfWord(action, letter, letterPos);
                this.isValid = this.addWord(word);
            }
            return this.isValid;
        }
        return false;
    }

    goToBeginningOfWord(action: PlaceLetter, pos: Vec2): void {
        const currentPos: Vec2 = { x: pos.x, y: pos.y };
        const direction = action.placement.direction;
        if (direction === Direction.Horizontal) {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                pos.y -= 1;
            }
            pos.y += 1;
        } else {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                pos.x -= 1;
            }
            pos.x += 1;
        }
    }

    goToEndOfWord(action: PlaceLetter, pos: Vec2, letterPos: Vec2): Tile[] {
        const currentPos = { x: letterPos.x, y: letterPos.y };
        const word: Tile[] = [];
        const direction = action.placement.direction;
        if (direction === Direction.Horizontal) {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                if (this.tileIsOccupied(pos.x, pos.y)) {
                    word.push(this.grid[pos.y][pos.x]);
                } else {
                    word.push(this.createTile(action.word[pos.x - action.placement.x], pos));
                }
                pos.y += 1;
            }
            pos.y -= 1;
        } else {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                if (this.tileIsOccupied(pos.x, pos.y)) {
                    word.push(this.grid[pos.y][pos.x]);
                } else {
                    word.push(this.createTile(action.word[pos.y - action.placement.y], pos));
                }
                pos.x += 1;
            }
            pos.x -= 1;
        }
        return word;
    }

    addWord(word: Tile[]): boolean {
        const wordString = this.tileToString(word).toLowerCase();
        if (word.length >= 2) {
            if (this.dictionaryService.isWordInDict(wordString)) {
                this.listOfValidWord.push(word);
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    tileToString(word: Tile[]): string {
        let wordTemp = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    }

    isLetterPosition(currentPosition: Vec2, letterPosition: Vec2) {
        return currentPosition.x === letterPosition.x && currentPosition.y === letterPosition.y;
    }

    isInsideBoard(x: number, y: number): boolean {
        if (x >= BOARD_MIN_POSITION_X && y >= BOARD_MIN_POSITION_Y && x <= BOARD_MAX_POSITION_X && y <= BOARD_MAX_POSITION_Y) {
            return true;
        }
        return false;
    }

    tileIsOccupied(x: number, y: number): boolean {
        if (!this.isInsideBoard(x, y)) {
            return false;
        }
        if (this.grid[y][x].letterObject.char === ' ') {
            return false;
        }
        return true;
    }

    findCoordOfLettersToPLace(action: PlaceLetter): Vec2[] {
        const listOfCoord: Vec2[] = [];
        const coord: Vec2 = { x: action.placement.x, y: action.placement.y };

        for (let i = 0; i < action.word.length; i++) {
            if (!this.tileIsOccupied(coord.x, coord.y)) {
                listOfCoord.push({ x: coord.x, y: coord.y });
            }
            if (action.placement.direction === Direction.Horizontal) {
                coord.x++;
            } else {
                coord.y++;
            }
        }
        return listOfCoord;
    }

    private createTile(char: string, pos: Vec2): Tile {
        const tile = this.grid[pos.y][pos.x];
        const letterMultiplicator = tile.letterMultiplicator;
        const wordMultiplicator = tile.wordMultiplicator;
        const newTile = new Tile(letterMultiplicator, wordMultiplicator);
        newTile.letterObject = this.letterCreator.createLetter(char);
        return newTile;
    }
}
