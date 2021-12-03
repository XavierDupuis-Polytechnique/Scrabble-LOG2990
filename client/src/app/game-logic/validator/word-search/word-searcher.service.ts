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
        if (!this.dictionaryService.isWordInDict(word)) {
            return [];
        }
        const letters = this.stringToTile(word, placement);
        const index = this.findIndexOfLetterToPlace(word, placement);
        listOfValidWord.push({ letters, index });
        const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(word, placement);
        for (const coord of coordsOfLettersToPlace) {
            const adjacentWordDirection = this.getAdjacentWordsDirection(placement.direction);
            if (!this.hasNeighbour(coord.x, coord.y, adjacentWordDirection)) {
                continue;
            }
            const wordToValidate = this.extractWord(word, placement, coord);
            if (this.isInDictionnary(wordToValidate.letters)) {
                listOfValidWord.push(wordToValidate);
                continue;
            }
            return [];
        }
        return listOfValidWord;
    }

    private findIndexOfLetterToPlace(word: string, placement: PlacementSetting): number[] {
        const indexOfLetterToPlace: number[] = [];
        const originaldirection = placement.direction;
        const startCoord = originaldirection === Direction.Horizontal ? placement.x : placement.y;

        const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(word, placement);
        coordsOfLettersToPlace.forEach((coord) => {
            const indexInBoard = originaldirection === Direction.Horizontal ? coord.x : coord.y;
            const indexInWord = indexInBoard - startCoord;
            indexOfLetterToPlace.push(indexInWord);
        });

        return indexOfLetterToPlace;
    }

    private hasNeighbour(x: number, y: number, adjacentWordDirection: Direction): boolean {
        const nextCoord = adjacentWordDirection === Direction.Horizontal ? { x: x + 1, y } : { x, y: y + 1 };
        const previousCoord = adjacentWordDirection === Direction.Horizontal ? { x: x - 1, y } : { x, y: y - 1 };
        return this.isTileOccupied(nextCoord.x, nextCoord.y) || this.isTileOccupied(previousCoord.x, previousCoord.y);
    }

    private extractWord(word: string, placement: PlacementSetting, letterPos: Vec2): Word {
        const originalDirection = placement.direction;
        const adjacentWordDirection = this.getAdjacentWordsDirection(originalDirection);
        const originalWordCoord = { x: placement.x, y: placement.y };

        let [x, y] = [letterPos.x, letterPos.y];
        while (this.isPreviousTileUsed({ x, y }, adjacentWordDirection, letterPos)) {
            [x, y] = adjacentWordDirection === Direction.Horizontal ? [x - 1, y] : [x, y - 1];
        }

        const letters: Tile[] = [];
        const index: number[] = [];
        let indexInNeighbor = 0;
        while (this.isTileUsed(x, y, letterPos)) {
            if (!this.isTileOccupied(x, y)) {
                const indexInWord = originalDirection === Direction.Horizontal ? x - originalWordCoord.x : y - originalWordCoord.y;
                letters.push(this.createTile(word[indexInWord], { x, y }));
                index.push(indexInNeighbor);
            } else {
                letters.push(this.grid[y][x]);
            }
            [x, y] = adjacentWordDirection === Direction.Horizontal ? [x + 1, y] : [x, y + 1];
            indexInNeighbor += 1;
        }
        return { letters, index };
    }

    private isInDictionnary(word: Tile[]): boolean {
        const wordString = this.tileToString(word).toLowerCase();
        return this.dictionaryService.isWordInDict(wordString);
    }

    private isPreviousTileUsed(coord: Vec2, adjacentWordDirection: Direction, letterPosition: Vec2): boolean {
        const [x, y] = adjacentWordDirection === Direction.Horizontal ? [coord.x - 1, coord.y] : [coord.x, coord.y - 1];
        return this.isTileUsed(x, y, letterPosition);
    }

    private isTileUsed(x: number, y: number, letterPosition: Vec2): boolean {
        if (x === letterPosition.x && y === letterPosition.y) {
            return true;
        }
        if (this.isTileOccupied(x, y)) {
            return true;
        }
        return false;
    }

    private isInsideBoard(x: number, y: number): boolean {
        return x >= BOARD_MIN_POSITION && y >= BOARD_MIN_POSITION && x <= BOARD_MAX_POSITION && y <= BOARD_MAX_POSITION;
    }

    private isTileOccupied(x: number, y: number): boolean {
        if (!this.isInsideBoard(x, y)) {
            return false;
        }
        const char = this.grid[y][x].letterObject.char;
        return char !== EMPTY_CHAR;
    }

    private getAdjacentWordsDirection(originalWordDirection: Direction): Direction {
        return originalWordDirection === Direction.Horizontal ? Direction.Vertical : Direction.Horizontal;
    }

    private findCoordOfLettersToPlace(word: string, placement: PlacementSetting): Vec2[] {
        const listOfCoord: Vec2[] = [];
        const originalDirection = placement.direction;

        const startCoord = originalDirection === Direction.Horizontal ? placement.x : placement.y;
        const wordEnd = startCoord + word.length;
        let currentPos = startCoord;

        for (startCoord; currentPos < wordEnd; currentPos++) {
            const [x, y] = originalDirection === Direction.Horizontal ? [currentPos, placement.y] : [placement.x, currentPos];
            if (!this.isTileOccupied(x, y)) {
                listOfCoord.push({ x, y });
            }
        }
        return listOfCoord;
    }

    private stringToTile(word: string, placement: PlacementSetting): Tile[] {
        let [x, y] = [placement.x, placement.y];
        const originalDirection = placement.direction;
        const wordTile: Tile[] = [];

        for (const letter of word) {
            const tile = this.createTile(letter, { x, y });
            wordTile.push(tile);
            [x, y] = originalDirection === Direction.Horizontal ? [x + 1, y] : [x, y + 1];
        }
        return wordTile;
    }

    private tileToString(word: Tile[]): string {
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
        newTile.letterObject = isCharUpperCase(char) ? this.letterCreator.createBlankLetter(char) : this.letterCreator.createLetter(char);
        return newTile;
    }
}
