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
                if (this.hasNeighbour(coord.x, coord.y, direction)) {
                    const wordToValidate = this.extractWord(wordPlacement, coord);
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

    private findIndexOfLetterToPlace(word: string, placement: PlacementSetting) {
        const indexOfLetterToPlace: number[] = [];
        const direction = placement.direction;
        const startCoord = direction === Direction.Horizontal ? placement.x : placement.y;

        const coordsOfLettersToPlace = this.findCoordOfLettersToPlace(word, placement);
        coordsOfLettersToPlace.forEach((coord) => {
            const indexInBoard = direction === Direction.Horizontal ? coord.x : coord.y;
            const indexInWord = indexInBoard - startCoord;
            indexOfLetterToPlace.push(indexInWord);
        });

        return indexOfLetterToPlace;
    }

    private hasNeighbour(x: number, y: number, direction: Direction): boolean {
        const nextNeighbourCoord = direction === Direction.Horizontal ? { x, y: y + 1 } : { x: x + 1, y };
        const previousNeighbourCoord = direction === Direction.Horizontal ? { x, y: y - 1 } : { x: x - 1, y };
        return (
            this.isTileOccupied(nextNeighbourCoord.x, nextNeighbourCoord.y) || this.isTileOccupied(previousNeighbourCoord.x, previousNeighbourCoord.y)
        );
    }

    private extractWord(wordPlacement: WordPlacement, currentPos: Vec2): Word {
        const direction = wordPlacement.placement.direction;
        const startCoord = { x: wordPlacement.placement.x, y: wordPlacement.placement.y };
        let x = wordPlacement.placement.x;
        let y = wordPlacement.placement.y;
        const letters: Tile[] = [];
        const index: number[] = [];
        let indexInNeighbor = 0;

        // Go to begining of Word
        while (this.isPreviousTileUsed(x, y, currentPos)) {
            [x, y] = direction === Direction.Horizontal ? [x, y - 1] : [x - 1, y];
        }

        // Go through word until end
        while (this.isNextTileUsed(x, y, currentPos)) {
            if (this.isTileOccupied(x, y)) {
                letters.push(this.grid[y][x]);
            } else {
                const indexInWord = direction === Direction.Horizontal ? x - startCoord.x : y - startCoord.y;
                letters.push(this.createTile(wordPlacement.word[indexInWord], { x, y }));
                index.push(indexInNeighbor);
            }
            [x, y] = direction === Direction.Horizontal ? [x, y + 1] : [x + 1, y];
            indexInNeighbor += 1;
        }
        return { letters, index };
    }

    private isInDictionnary(word: Tile[]): boolean {
        const wordString = this.tileToString(word).toLowerCase();
        return this.dictionaryService.isWordInDict(wordString);
    }

    private isPreviousTileUsed(x: number, y: number, letterPosition: Vec2) {
        const offset = -1;
        return this.isTileOccupied(x * offset, y * offset) || this.isLetterPosition(x, y, letterPosition);
    }

    private isNextTileUsed(x: number, y: number, letterPosition: Vec2) {
        return this.isTileOccupied(x, y) || this.isLetterPosition(x, y, letterPosition);
    }

    private isLetterPosition(x: number, y: number, letterPosition: Vec2) {
        return x === letterPosition.x && y === letterPosition.y;
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

    private findCoordOfLettersToPlace(word: string, placement: PlacementSetting): Vec2[] {
        const listOfCoord: Vec2[] = [];
        const startCoord: Vec2 = { x: placement.x, y: placement.y };
        const direction = placement.direction;

        const wordEnd = direction === Direction.Horizontal ? startCoord.x + word.length : startCoord.y + word.length;
        let currPos = direction === Direction.Horizontal ? startCoord.x : startCoord.y;

        for (startCoord; currPos < wordEnd; currPos++) {
            const coord = direction === Direction.Horizontal ? { x: currPos, y: startCoord.y } : { x: startCoord.x, y: currPos };
            if (!this.isTileOccupied(coord.x, coord.y)) {
                listOfCoord.push({ x: coord.x, y: coord.y });
            }
        }
        return listOfCoord;
    }

    private stringToTile(word: string, placement: PlacementSetting): Tile[] {
        let x = placement.x;
        let y = placement.y;
        const direction = placement.direction;
        const wordTile: Tile[] = [];

        for (const letter of word) {
            const tile = this.createTile(letter, { x, y });
            wordTile.push(tile);
            [x, y] = direction === Direction.Horizontal ? [x + 1, y] : [x, y + 1];
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
