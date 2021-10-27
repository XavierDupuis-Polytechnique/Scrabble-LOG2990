import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { BoardService } from '@app/game/game-logic/board/board.service';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Tile } from '@app/game/game-logic/board/tile';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR } from '@app/game/game-logic/constants';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { isCharUpperCase } from '@app/game/game-logic/utils';
import { DictionaryService } from '@app/game/game-logic/validator/dictionary/dictionary.service';
import { Word } from '@app/game/game-logic/validator/word-search/word';
import { Service } from 'typedi';

@Service()
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

    findIndexOfLetterToPlace(action: PlaceLetter) {
        const indexOfLetterToPlace: number[] = [];
        if (action.placement.direction === Direction.Horizontal) {
            const startCoord = action.placement.x;
            const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(action);
            coordsOfLettersToPlace.forEach((coord) => {
                const index = coord.x - startCoord;
                indexOfLetterToPlace.push(index);
            });
        } else {
            const startCoord = action.placement.y;
            const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(action);
            coordsOfLettersToPlace.forEach((coord) => {
                const index = coord.y - startCoord;
                indexOfLetterToPlace.push(index);
            });
        }
        return indexOfLetterToPlace;
    }

    listOfValidWord(action: PlaceLetter): Word[] {
        const listOfValidWord: Word[] = [];
        if (this.dictionaryService.isWordInDict(action.word)) {
            const letters = this.stringToTile(action.word, action.placement);
            const index = this.findIndexOfLetterToPlace(action);
            listOfValidWord.push({ letters, index });

            const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(action);
            for (const coord of coordsOfLettersToPlace) {
                const direction = action.placement.direction as Direction;
                if (this.hasNeighbour(coord, direction)) {
                    const beginingPos = this.goToBeginningOfWord(direction, coord);
                    const word = this.goToEndOfWord(action, beginingPos, coord);
                    if (this.isValid(word.letters)) {
                        listOfValidWord.push(word);
                    } else {
                        return [];
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

    goToEndOfWord(action: PlaceLetter, beginingPos: Vec2, letterPos: Vec2): Word {
        const direction = action.placement.direction;
        let x = beginingPos.x;
        let y = beginingPos.y;
        const letters: Tile[] = [];
        const index: number[] = [];
        let indexInNeighbor = 0;
        if (direction === Direction.Horizontal) {
            while (this.tileIsOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                if (this.tileIsOccupied(x, y)) {
                    letters.push(this.grid[y][x]);
                } else {
                    const indexInWord = x - action.placement.x;
                    letters.push(this.createTile(action.word[indexInWord], { x, y }));
                    index.push(indexInNeighbor);
                }
                y += 1;
                indexInNeighbor += 1;
            }
            y -= 1;
        } else {
            while (this.tileIsOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                if (this.tileIsOccupied(x, y)) {
                    letters.push(this.grid[y][x]);
                } else {
                    const indexInWord = y - action.placement.y;
                    letters.push(this.createTile(action.word[indexInWord], { x, y }));
                    index.push(indexInNeighbor);
                }
                x += 1;
                indexInNeighbor += 1;
            }
            x -= 1;
        }
        return { letters, index };
    }

    isValid(word: Tile[]): boolean {
        const wordString = this.tileToString(word).toLowerCase();
        if (this.dictionaryService.isWordInDict(wordString)) {
            return true;
        }
        return false;
    }

    isLetterPosition(currentPosition: Vec2, letterPosition: Vec2) {
        return currentPosition.x === letterPosition.x && currentPosition.y === letterPosition.y;
    }

    isInsideBoard(x: number, y: number): boolean {
        return x >= BOARD_MIN_POSITION && y >= BOARD_MIN_POSITION && x <= BOARD_MAX_POSITION && y <= BOARD_MAX_POSITION;
    }

    tileIsOccupied(x: number, y: number): boolean {
        if (!this.isInsideBoard(x, y)) {
            return false;
        }
        const char = this.grid[y][x].letterObject.char;
        return char !== EMPTY_CHAR;
    }

    findCoordOfLettersToPlace(action: PlaceLetter): Vec2[] {
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
        if (isCharUpperCase(char)) {
            newTile.letterObject = this.letterCreator.createBlankLetter(char);
        } else {
            newTile.letterObject = this.letterCreator.createLetter(char);
        }
        return newTile;
    }
}
