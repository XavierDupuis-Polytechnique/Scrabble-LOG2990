import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Tile } from '@app/GameLogic/game/tile';
import { BoardService } from '@app/services/board.service';
import { DictionaryService } from '../dictionary.service';

const BOARD_MIN_POSITION_X = 0;
const BOARD_MIN_POSITION_Y = 0;
const BOARD_MAX_POSITION_X = 15;
const BOARD_MAX_POSITION_Y = 15;

export class WordSearcher {
    listOfValidWord: Tile[][] = [];
    letterCreator: LetterCreator;

    constructor(private boardService: BoardService, private dictionaryService: DictionaryService, letterCreator: LetterCreator) {
        this.letterCreator = letterCreator;
    }

    get grid() {
        return this.boardService.board.grid;
    }

    getListOfValidWord(): Tile[][] {
        return this.listOfValidWord;
    }

    validateWords(action: PlaceLetter): boolean {
        console.log("ACTION:", action);

        if (this.dictionaryService.isWordInDict(action.word)) {
            if (this.hasNeighbour({ x: action.placement.x, y: action.placement.y })) {
                const lettersToPlace = this.findCoordOfLettersToPLace(action);
                for (const letter of lettersToPlace) {
                    const letterPos = { x: letter.x, y: letter.y };
                    this.goToBeginningOfWord(action, letter);
                    const word = this.goToEndOfWord(action, letter, letterPos);
                    const isValid = this.addWord(word);
                    if (!isValid) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    hasNeighbour(coord: Vec2): boolean {
        const x = coord.x;
        const y = coord.y;
        if (x + 1 < BOARD_MAX_POSITION_X) {
            if (this.boardService.board.grid[x + 1][y].letterObject.char !== ' ') {
                return true;
            }
        }
        if (x - 1 >= 0) {
            if (this.boardService.board.grid[x - 1][y].letterObject.char !== ' ') {
                return true;
            }
        }
        if (y + 1 < BOARD_MAX_POSITION_Y) {
            if (this.boardService.board.grid[x][y + 1].letterObject.char !== ' ') {
                return true;
            }
        }
        if (y - 1 >= 0) {
            if (this.boardService.board.grid[x][y - 1].letterObject.char !== ' ') {
                return true;
            }
        }
        return false;
    }

    goToBeginningOfWord(action: PlaceLetter, pos: Vec2): void {
        const currentPos: Vec2 = { x: pos.x, y: pos.y };
        if (action.placement.direction === Direction.Horizontal) {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                pos.y -= 1;
            }
            pos.y += 1;
        }
        else {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                pos.x -= 1;
            }
            pos.x += 1;
        }
    }

    goToEndOfWord(action: PlaceLetter, pos: Vec2, letterPos: Vec2): Tile[] {
        const currentPos = { x: letterPos.x, y: letterPos.y };
        let word: Tile[] = [];
        if (action.placement.direction === Direction.Horizontal) {
            while (this.tileIsOccupied(pos.x, pos.y) || this.isLetterPosition(pos, currentPos)) {
                if (this.tileIsOccupied(pos.x, pos.y)) {
                    word.push(this.grid[pos.y][pos.x])
                }
                else {
                    word.push(this.createTile(action.word[pos.x - action.placement.x], pos));
                }
                pos.y += 1;
            }
            pos.y -= 1;
        }
        else {
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

    private createTile(char: string, pos: Vec2): Tile {
        let tile = new Tile(this.grid[pos.y][pos.x].letterMultiplicator, this.grid[pos.y][pos.x].wordMultiplicator);
        tile.letterObject = this.letterCreator.createLetter(char);
        return tile;
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
}
