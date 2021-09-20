import { Vec2 } from '@app/classes/vec2';
import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Player } from '@app/GameLogic/player/player';

export interface PlacementSetting {
    x: number;
    y: number;
    direction: string;
}

const isCharUpperCase = (char: string) => {
    if (char.length !== 1) {
        throw Error('the string given is not a char');
    }
    const charCode = char.charCodeAt(0);
    return charCode >= 'A'.charCodeAt(0) && charCode <= 'Z'.charCodeAt(0);
};

export class PlaceLetter extends Action {
    lettersToRemoveInRack: Letter[];
    affectedCoords: Vec2[];
    private letterFactory = new LetterCreator();

    constructor(player: Player, public word: string, public placement: PlacementSetting) {
        super(player);
    }

    revert() {
        // for (const letter of this.lettersToPlace) {
        //     // Peut causer des problèmes : la Game ne doit pas fournir de nouvelles lettres avant un possible .revert(game)
        //     this.player.letterRack.push(letter);
        // }
        // for (const tile of this.affectedTiles) {
        //     tile.letterObject.char = ' ';
        // }
    }

    protected perform(game: Game) {
        const startX = this.placement.x;
        const startY = this.placement.y;
        const direction = this.placement.direction;
        const grid = game.board.grid;
        this.lettersToRemoveInRack = [];
        this.affectedCoords = [];
        for (let wordIndex = 0; wordIndex < this.word.length; wordIndex++) {
            let char: string;
            let x = startX;
            let y = startY;
            if (direction === Direction.Horizontal) {
                x = startX + wordIndex;
                char = grid[y][x].letterObject.char;
            } else {
                y = startY + wordIndex;
                char = grid[y][x].letterObject.char;
            }

            if (char === ' ') {
                const charToCreate = this.word[wordIndex];
                const letterToRemove = this.letterToRemove(charToCreate);
                this.lettersToRemoveInRack.push(letterToRemove);
                const newLetter = this.letterFactory.createLetter(charToCreate);
                game.board.grid[y][x].letterObject = newLetter;
                this.affectedCoords.push({ x, y });
            }
        }
        console.log(grid);
        // TODO: remove letters from rack
        this.player.removeLetterFromRack(this.lettersToRemoveInRack);
    }

    // private isDirectionVertical(direction: string): boolean {
    //     return direction.charAt(0).toLowerCase() === 'v';
    // }
    // private findLettersToPlace(word: string, game: Game, placement: PlacementSetting): [Letter[], Letter[]] {
    //     const grid = game.board.grid;
    //     const lettersToPlace: Letter[] = [];
    //     const lettersToRemoveInRack: Letter[] = [];
    //     const startX = placement.x;
    //     const startY = placement.y;
    //     for (let wordIndex = 0; wordIndex < word.length; wordIndex++) {
    //         let char: string;
    //         if (placement.direction === Direction.Horizontal) {
    //             const x = startX + wordIndex;
    //             char = grid[startY][x].letterObject.char;
    //         } else {
    //             const y = startY + wordIndex;
    //             char = grid[y][startX].letterObject.char;
    //         }

    //         if (char === ' ') {
    //             const charToCreate = word[wordIndex];
    //             const letterToRemove = this.letterToRemove(charToCreate);
    //             lettersToRemoveInRack.push(letterToRemove);
    //             const newLetter = this.letterFactory.createLetter(charToCreate);
    //             lettersToPlace.push(newLetter);
    //         }
    //     }
    //     return [lettersToPlace, lettersToRemoveInRack];
    // }

    private letterToRemove(char: string) {
        if (isCharUpperCase(char)) {
            return this.letterFactory.createLetter('*');
        }
        return this.letterFactory.createLetter(char);
    }
}
