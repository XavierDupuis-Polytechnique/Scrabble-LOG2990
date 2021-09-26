import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter, PlacementSetting } from '@app/GameLogic/actions/place-letter';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';

const BOARD_MIN_POSITION_X = 0;
const BOARD_MIN_POSITION_Y = 0;
const BOARD_MAX_POSITION_X = 14;
const BOARD_MAX_POSITION_Y = 14;

@Injectable({
    providedIn: 'root',
})
export class WordSearcher {
    letterCreator = new LetterCreator();

    constructor(private boardService: BoardService, private dictionaryService: DictionaryService) {}

    get grid() {
        return this.boardService.board.grid;
    }

    validateWords(action: PlaceLetter): boolean {
        const listOfValidWord = this.listOfValidWord(action);
        if (listOfValidWord.length > 0) {
            return true;
        }
        return false;
    }

    listOfValidWord(action: PlaceLetter): Tile[][] {
        const listOfValidWord: Tile[][] = [];
        if (this.dictionaryService.isWordInDict(action.word)) {
            const wordInTile = this.stringToTile(action.word, action.placement);
            listOfValidWord.push(wordInTile);

            const coordsOfLettersToPlace = this.findCoordOfLettersToPLace(action);
            for (const coord of coordsOfLettersToPlace) {
                const direction = action.placement.direction as Direction;
                if (this.hasNeighbour(coord, direction)) {
                    const beginingPos = this.goToBeginningOfWord(direction, coord);
                    const word = this.goToEndOfWord(action, beginingPos, coord);
                    if (this.isValid(word)) {
                        listOfValidWord.push(word);
                    }
                }
            }
        }
        return listOfValidWord;
    }

    hasNeighbour(coord: Vec2, direction: Direction): boolean {
        const x = coord.x;
        const y = coord.y;
        if (direction === Direction.Horizontal) {
            return this.tileIsOccupied(x, y + 1) || this.tileIsOccupied(x, y - 1);
        } else {
            return this.tileIsOccupied(x + 1, y) || this.tileIsOccupied(x - 1, y);
        }
    }

    goToBeginningOfWord(direction: Direction, letterPos: Vec2): Vec2 {
        let x = letterPos.x;
        let y = letterPos.y;
        if ((direction as Direction) === Direction.Horizontal) {
            while (this.tileIsOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                y -= 1;
            }
            y += 1;
        } else {
            while (this.tileIsOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                x -= 1;
            }
            x += 1;
        }
        return { x, y };
    }

    goToEndOfWord(action: PlaceLetter, beginingPos: Vec2, letterPos: Vec2): Tile[] {
        const direction = action.placement.direction;
        let x = beginingPos.x;
        let y = beginingPos.y;
        const word: Tile[] = [];
        if (direction === Direction.Horizontal) {
            while (this.tileIsOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                if (this.tileIsOccupied(x, y)) {
                    word.push(this.grid[y][x]);
                } else {
                    const index = x - action.placement.x;
                    word.push(this.createTile(action.word[index], { x, y }));
                }
                y += 1;
            }
            y -= 1;
        } else {
            while (this.tileIsOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                if (this.tileIsOccupied(x, y)) {
                    word.push(this.grid[y][x]);
                } else {
                    const index = y - action.placement.y;
                    word.push(this.createTile(action.word[index], { x, y }));
                }
                x += 1;
            }
            x -= 1;
        }
        return word;
    }

    isValid(word: Tile[]): boolean {
        const wordString = this.tileToString(word).toLowerCase();
        if (word.length >= 2) {
            if (this.dictionaryService.isWordInDict(wordString)) {
                return true;
            }
        }
        return false;
    }

    isLetterPosition(currentPosition: Vec2, letterPosition: Vec2) {
        return currentPosition.x === letterPosition.x && currentPosition.y === letterPosition.y;
    }

    isInsideBoard(x: number, y: number): boolean {
        return x >= BOARD_MIN_POSITION_X && y >= BOARD_MIN_POSITION_Y && x <= BOARD_MAX_POSITION_X && y <= BOARD_MAX_POSITION_Y;
    }

    tileIsOccupied(x: number, y: number): boolean {
        if (!this.isInsideBoard(x, y)) {
            return false;
        }
        const char = this.grid[y][x].letterObject.char;
        return char !== ' ';
    }

    findCoordOfLettersToPLace(action: PlaceLetter): Vec2[] {
        const listOfCoord: Vec2[] = [];
        const startCoord: Vec2 = { x: action.placement.x, y: action.placement.y };
        const direction = action.placement.direction;
        const word = action.word;
        if (direction === Direction.Horizontal) {
            const y = startCoord.y;
            const wordEnd = startCoord.x + word.length;
            for (let x = startCoord.x; x < wordEnd; x++) {
                if (!this.tileIsOccupied(x, y)) {
                    listOfCoord.push({ x, y });
                }
            }
        } else {
            const x = startCoord.x;
            const wordEnd = startCoord.y + word.length;
            for (let y = startCoord.y; y < wordEnd; y++) {
                if (!this.tileIsOccupied(x, y)) {
                    listOfCoord.push({ x, y });
                }
            }
        }
        return listOfCoord;
    }

    stringToTile(word: string, placement: PlacementSetting): Tile[] {
        let x = placement.x;
        let y = placement.y;
        const wordTile: Tile[] = [];
        for (const letter of word) {
            const tile = this.createTile(letter, { x, y });
            wordTile.push(tile);
            if (placement.direction === Direction.Horizontal) {
                x++;
            } else {
                y++;
            }
        }
        return wordTile;
    }

    tileToString(word: Tile[]): string {
        let wordTemp = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
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
