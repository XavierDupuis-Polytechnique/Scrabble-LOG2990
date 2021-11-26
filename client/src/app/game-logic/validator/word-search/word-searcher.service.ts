import { Injectable } from '@angular/core';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { BOARD_MAX_POSITION, BOARD_MIN_POSITION, EMPTY_CHAR } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { Tile } from '@app/game-logic/game/board/tile';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Vec2 } from '@app/game-logic/interfaces/vec2';
import { isCharUpperCase } from '@app/game-logic/utils';
import { DictionaryService } from '@app/game-logic/validator/dictionary.service';
import { Word, WordPlacement } from '@app/game-logic/validator/word-search/word';
@Injectable({
    providedIn: 'root',
})
export class WordSearcher {
    letterCreator = new LetterCreator();

    constructor(private boardService: BoardService, private dictionaryService: DictionaryService) {}

    get grid() {
        return this.boardService.board.grid;
    }

    isWordValid(action: PlaceLetter): boolean {
        const word = action.word;
        const placement = action.placement;
        const listOfValidWord = this.listOfValidWord({ word, placement });
        if (listOfValidWord.length > 0) {
            return true;
        }
        return false;
    }

    listOfValidWord(wordPlacement: WordPlacement): Word[] {
        const listOfValidWord: Word[] = [];
        const word = wordPlacement.word;
        const placement = wordPlacement.placement;
        if (this.dictionaryService.isWordInDict(word)) {
            const letters = this.stringToTile(word, placement);
            const index = this.findIndexOfLetterToPlace(word, placement);
            listOfValidWord.push({ letters, index });

            const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(word, placement);
            for (const coord of coordsOfLettersToPlace) {
                const direction = placement.direction;
                if (this.hasNeighbour(coord, direction)) {
                    const beginingPos = this.goToBeginningOfWord(direction, coord);
                    const wordToValidate = this.goToEndOfWord(wordPlacement, beginingPos, coord);
                    if (this.isInDictionnary(wordToValidate.letters)) {
                        listOfValidWord.push(wordToValidate);
                    } else {
                        return [];
                    }
                }
            }
        }
        return listOfValidWord;
    }

    findIndexOfLetterToPlace(word: string, placement: PlacementSetting) {
        const indexOfLetterToPlace: number[] = [];
        if (placement.direction === Direction.Horizontal) {
            const startCoord = placement.x;
            const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(word, placement);
            coordsOfLettersToPlace.forEach((coord) => {
                const index = coord.x - startCoord;
                indexOfLetterToPlace.push(index);
            });
        } else {
            const startCoord = placement.y;
            const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(word, placement);
            coordsOfLettersToPlace.forEach((coord) => {
                const index = coord.y - startCoord;
                indexOfLetterToPlace.push(index);
            });
        }
        return indexOfLetterToPlace;
    }

    hasNeighbour(coord: Vec2, direction: Direction): boolean {
        const x = coord.x;
        const y = coord.y;
        if (direction === Direction.Horizontal) {
            return this.isTileOccupied(x, y + 1) || this.isTileOccupied(x, y - 1);
        } else {
            return this.isTileOccupied(x + 1, y) || this.isTileOccupied(x - 1, y);
        }
    }

    goToBeginningOfWord(direction: Direction, letterPos: Vec2): Vec2 {
        let x = letterPos.x;
        let y = letterPos.y;
        if (direction === Direction.Horizontal) {
            while (this.isTileOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                y -= 1;
            }
            y += 1;
        } else {
            while (this.isTileOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                x -= 1;
            }
            x += 1;
        }
        return { x, y };
    }

    goToEndOfWord(wordPlacement: WordPlacement, beginingPos: Vec2, letterPos: Vec2): Word {
        const direction = wordPlacement.placement.direction;
        let x = beginingPos.x;
        let y = beginingPos.y;
        const letters: Tile[] = [];
        const index: number[] = [];
        let indexInNeighbor = 0;
        if (direction === Direction.Horizontal) {
            while (this.isTileOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                if (this.isTileOccupied(x, y)) {
                    letters.push(this.grid[y][x]);
                } else {
                    const indexInWord = x - wordPlacement.placement.x;
                    letters.push(this.createTile(wordPlacement.word[indexInWord], { x, y }));
                    index.push(indexInNeighbor);
                }
                y += 1;
                indexInNeighbor += 1;
            }
            y -= 1;
        } else {
            while (this.isTileOccupied(x, y) || this.isLetterPosition({ x, y }, letterPos)) {
                if (this.isTileOccupied(x, y)) {
                    letters.push(this.grid[y][x]);
                } else {
                    const indexInWord = y - wordPlacement.placement.y;
                    letters.push(this.createTile(wordPlacement.word[indexInWord], { x, y }));
                    index.push(indexInNeighbor);
                }
                x += 1;
                indexInNeighbor += 1;
            }
            x -= 1;
        }
        return { letters, index };
    }

    isInDictionnary(word: Tile[]): boolean {
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

    isTileOccupied(x: number, y: number): boolean {
        if (!this.isInsideBoard(x, y)) {
            return false;
        }
        const char = this.grid[y][x].letterObject.char;
        return char !== EMPTY_CHAR;
    }

    findCoordOfLettersToPlace(word: string, placement: PlacementSetting): Vec2[] {
        const listOfCoord: Vec2[] = [];
        const startCoord: Vec2 = { x: placement.x, y: placement.y };
        const direction = placement.direction;
        if (direction === Direction.Horizontal) {
            const y = startCoord.y;
            const wordEnd = startCoord.x + word.length;
            for (let x = startCoord.x; x < wordEnd; x++) {
                if (!this.isTileOccupied(x, y)) {
                    listOfCoord.push({ x, y });
                }
            }
        } else {
            const x = startCoord.x;
            const wordEnd = startCoord.y + word.length;
            for (let y = startCoord.y; y < wordEnd; y++) {
                if (!this.isTileOccupied(x, y)) {
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
