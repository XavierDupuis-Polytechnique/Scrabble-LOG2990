import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Board } from '@app/GameLogic/game/board';
import { Tile } from '@app/GameLogic/game/tile';

export class WordSearcher {
    listOfWord: Tile[][];
    neighbours: [number, number][];
    grid: Tile[][];
    constructor(board: Board) {
        this.grid = board.grid;
    }

    searchAdjacentWords(action: PlaceLetter) {
        const startX = action.placement.x;
        const startY = action.placement.y;
        const direction = action.placement.direction;
        if (direction === 'H') {
            const word = this.getWordHorizontal(startX, startY);
            this.listOfWord.push(word);
        }

        if (direction === 'V') {
            const word = this.getWordVertical(startX, startY);
            this.listOfWord.push(word);
        }

        if (direction === 'H') {
            for (const neighbour of this.neighbours) {
                const word = this.getWordVertical(neighbour[0], neighbour[1]);
                this.listOfWord.push(word);
            }
        }

        if (direction === 'V') {
            for (const neighbour of this.neighbours) {
                const word = this.getWordHorizontal(neighbour[0], neighbour[1]);
                this.listOfWord.push(word);
            }
        }
    }

    getWordVertical(x: number, y: number) {
        let word: Tile[] = [];
        let currentTile = this.grid[y][x];
        while (currentTile.letterObject.char !== ' ') {
            y += 1;
            currentTile = this.grid[y][x];
        }
        y -= 1;
        const firstLetter = this.grid[y][x];
        currentTile = firstLetter;
        while (currentTile.letterObject.char !== ' ') {
            word.push(currentTile);
            if (this.grid[y][x - 1].letterObject.char !== ' ') {
                this.neighbours.push([x - 1, y]);
            } else if (this.grid[y][x + 1].letterObject.char !== ' ') {
                this.neighbours.push([x + 1, y]);
            }
            y += 1;
            currentTile = this.grid[y][x];
        }
        return word;
    }

    getWordHorizontal(x: number, y: number) {
        let word: Tile[] = [];
        let currentTile = this.grid[y][x];
        while (currentTile.letterObject.char !== ' ') {
            currentTile = this.grid[y][x];
            x += 1;
        }
        x -= 1;
        const firstLetter = this.grid[y][x];
        currentTile = firstLetter;
        while (currentTile.letterObject.char !== ' ') {
            word.push(currentTile);
            if (this.grid[y - 1][x].letterObject.char !== ' ') {
                this.neighbours.push([x, y - 1]);
            } else if (this.grid[y + 1][x].letterObject.char !== ' ') {
                this.neighbours.push([x, y + 1]);
            }
            x += 1;
            currentTile = this.grid[y][x];
        }
        return word;
    }

    // until no word or a word is not gramatically valid
    // word should be >=2 and gramatically valid
}
