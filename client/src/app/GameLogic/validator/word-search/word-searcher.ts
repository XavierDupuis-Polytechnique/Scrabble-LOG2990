import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Tile } from '@app/GameLogic/game/tile';
import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';

const BOARD_MIN_POSITION_X = 0;
const BOARD_MIN_POSITION_Y = 0;
const BOARD_MAX_POSITION_X = 15;
const BOARD_MAX_POSITION_Y = 15;

export class WordSearcher {
    listOfValidWord: Tile[][] = [];
    neighbours: [number, number][] = [];
    grid: Tile[][];
    placementIsValid: boolean = true;
    letterCreator: LetterCreator;

    constructor(board: Board, private dictionaryService: DictionaryService, letterCreator: LetterCreator) {
        this.letterCreator = letterCreator;
        this.grid = board.grid;
    }


    validatePlacement(action: PlaceLetter): boolean {
        this.searchAdjacentWords(action);
        return this.placementIsValid;
    }

    get listOfWords() {
        if (this.placementIsValid) {
            return this.listOfValidWord;
        } else {
            throw Error('Can"t get the neighbours because placement is invalid');
        }
    }

    searchAdjacentWords(action: PlaceLetter) {
        const startX = action.placement.x;
        const startY = action.placement.y;
        const direction = action.placement.direction;
        let word: Tile[];
        if (direction === Direction.Horizontal) {
            word = this.getWordHorizontal(startX, startY);
            this.addWord(word);

            const neighbourSet = new Set(this.neighbours);
            for (const neighbour of neighbourSet) {
                word = this.getWordVertical(neighbour[0], neighbour[1]);
                this.addWord(word);
            }
        } else {
            word = this.getWordVertical(startX, startY);
            this.addWord(word);
            const neighbourSet = new Set(this.neighbours);
            for (const neighbour of neighbourSet) {
                word = this.getWordHorizontal(neighbour[0], neighbour[1]);
                this.addWord(word);
            }
        }
    }

    getVerticalNeighbours(action: PlaceLetter): Tile[][] {
        // const poisitionX = action.placement.x;
        // const poisitionY = action.placement.y;
        let listOfWord: Tile[][] = [];
        if (this.dictionaryService.isWordInDict(action.word)) {
            for (const letter of this.findLettersToPlace(action)) {
                let word: Tile[] = [];
                let currentPosition = this.findCoordinates(letter, action);
                const letterPosition = this.findCoordinates(letter, action);
                //Iteration vers le haut
                while (this.tileIsOccupied(currentPosition.x, currentPosition.y) || (currentPosition.x === letterPosition.x && currentPosition.y === letterPosition.y)) {
                    currentPosition.y -= 1;
                }
                currentPosition.y += 1;
                while (this.tileIsOccupied(currentPosition.x, currentPosition.y) || (currentPosition.x === letterPosition.x && currentPosition.y === letterPosition.y)) {
                    if (currentPosition.x === letterPosition.x && currentPosition.y === letterPosition.y) {
                        word.push(letter);
                    } else {
                        word.push(this.grid[currentPosition.y][currentPosition.x]);
                    }
                    currentPosition.y += 1;
                }
                this.addWord(word);
            }

        }
        this.placementIsValid = false;
        return listOfWord;

    }
    getWordVertical(x: number, y: number) {
        const word: Tile[] = [];
        let currentTile = this.grid[y][x];
        while (this.tileIsOccupied(x, y)) {
            y -= 1;
            if (this.isInsideBoard(x, y)) {
                currentTile = this.grid[y][x];
            }
        }

        y += 1;
        const firstLetter = this.grid[y][x];
        currentTile = firstLetter;
        while (this.tileIsOccupied(x, y)) {
            word.push(currentTile);

            if (this.isInsideBoard(x - 1, y)) {
                if (this.grid[y][x - 1].letterObject.char !== ' ') {
                    this.neighbours.push([x - 1, y]);
                }
            } else if (this.isInsideBoard(x + 1, y)) {
                if (this.grid[y][x + 1].letterObject.char !== ' ') {
                    this.neighbours.push([x + 1, y]);
                }
            }
            y += 1;
            if (this.isInsideBoard(x, y)) {
                currentTile = this.grid[y][x];
            }
        }
        return word;
    }

    getWordHorizontal(x: number, y: number) {
        const word: Tile[] = [];
        let currentTile = this.grid[y][x];
        while (this.tileIsOccupied(x, y)) {
            x -= 1;
            if (this.isInsideBoard(x, y)) {
                currentTile = this.grid[y][x];
            }
        }
        x += 1;
        const firstLetter = this.grid[y][x];
        currentTile = firstLetter;
        while (this.tileIsOccupied(x, y)) {
            word.push(currentTile);

            if (this.isInsideBoard(x, y - 1)) {
                if (this.grid[y - 1][x].letterObject.char !== ' ') {
                    this.neighbours.push([x, y - 1]);
                }
            } else if (this.isInsideBoard(x, y + 1)) {
                if (this.grid[y + 1][x].letterObject.char !== ' ' && x >= 0 && y >= 0) {
                    this.neighbours.push([x, y + 1]);
                }
            }
            x += 1;
            if (this.isInsideBoard(x, y)) {
                currentTile = this.grid[y][x];
            }
        }
        return word;
    }

    addWord(word: Tile[]) {
        const wordString = this.tileToString(word).toLowerCase();
        if (word.length >= 2) {
            if (this.dictionaryService.isWordInDict(wordString)) {
                this.listOfValidWord.push(word);
            } else {
                this.placementIsValid = false;
                console.log('mot: ', wordString);
                // throw Error('The word ' + wordString + ' is not in the current dictionary. Placement is invalid');
            }
        }
    }

    tileToString(word: Tile[]): string {
        let wordTemp = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
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

    findLettersToPlace(action: PlaceLetter): Tile[] {
        let x = action.placement.x;
        let y = action.placement.y;
        let word: Tile[] = [];
        for (let i = 0; i < action.word.length; i++) {
            if (!this.tileIsOccupied(x, y)) {
                let tile = new Tile();
                tile.letterObject = this.letterCreator.createLetter(action.word[i]);
                tile.letterMultiplicator = this.grid[y][x].letterMultiplicator;
                tile.wordMultiplicator = this.grid[y][x].wordMultiplicator;
                word.push(tile);
            }
            if (action.placement.direction === Direction.Horizontal) {
                x++;
            } else {
                y++;
            }
        }
        return word;
    }
    //TODO: if same letter in word marche pas et ligne 222 marche peut-etre pas
    findCoordinates(lettre: Tile, action: PlaceLetter) {
        let coordinates: Vec2 = { x: 0, y: 0 };
        for (let wordIndex = 0; wordIndex < action.word.length; wordIndex++) {
            if (action.word[wordIndex] === lettre.letterObject.char) {
                if (action.placement.direction === Direction.Horizontal) {
                    coordinates.x = action.placement.x + wordIndex;
                    coordinates.y = action.placement.y
                } else {
                    coordinates.x = action.placement.x;
                    coordinates.y = action.placement.y + wordIndex;
                }
            }

        }
        return coordinates;
    }
}
