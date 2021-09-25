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
        this.putLettersOnBoard(game);
        this.player.removeLetterFromRack(this.lettersToRemoveInRack);
        // TODO validate word
        // if validated then
        // draw
        // else revert after 3s
        /* timer(3000).subscribe(() => {
            this.drawGameLetters();
            this.endAction();
        });*/
        const drawnLetters = game.letterBag.drawGameLetters(this.lettersToRemoveInRack.length);
        for (const letter of drawnLetters) {
            this.player.letterRack.push(letter);
        }
    }

    private putLettersOnBoard(game: Game) {
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
                // TODO: put * letter value 0
                const newLetter = this.createNewLetter(charToCreate);
                grid[y][x].letterObject = newLetter;
                this.affectedCoords.push({ x, y });
            }
        }
    }

    private letterToRemove(char: string) {
        if (isCharUpperCase(char)) {
            return this.letterFactory.createLetter('*');
        }
        return this.letterFactory.createLetter(char);
    }

    private createNewLetter(char: string) {
        const charToCreate = char.toLowerCase();
        if (isCharUpperCase(char)) {
            return this.letterFactory.createBlankLetter(charToCreate);
        }
        return this.letterFactory.createLetter(charToCreate);
    }
}
