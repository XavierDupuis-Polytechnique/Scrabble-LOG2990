import { Vec2 } from '@app/classes/vec2';
import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { Player } from '@app/GameLogic/player/player';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { timer } from 'rxjs';

export interface PlacementSetting {
    x: number;
    y: number;
    direction: string;
}
const TIME_FOR_REVERT = 3000;

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

    constructor(
        player: Player,
        public word: string,
        public placement: PlacementSetting,
        // private pointCalculator: PointCalculatorService,
        private wordSearcher: WordSearcher,
    ) {
        super(player);
    }

    revert(game: Game) {
        this.removeLetterFromBoard(game);
        this.giveBackLettersToPlayer();
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
        const wordValid: boolean = this.wordSearcher.validateWords(this);
        console.log(wordValid);
        if (wordValid) {
            // this.pointCalculator.placeLetterPointsCalculation(this,);
            this.drawLettersForPlayer(game);
            this.end();
        } else {
            timer(TIME_FOR_REVERT).subscribe(() => {
                this.revert(game);
                this.end();
            });
        }
    }

    private removeLetterFromBoard(game: Game) {
        const grid = game.board.grid;
        for (const coord of this.affectedCoords) {
            const x = coord.x;
            const y = coord.y;
            grid[y][x].letterObject.char = ' ';
        }
    }

    private drawLettersForPlayer(game: Game) {
        const drawnLetters = game.letterBag.drawGameLetters(this.lettersToRemoveInRack.length);
        for (const letter of drawnLetters) {
            this.player.letterRack.push(letter);
        }
    }

    private giveBackLettersToPlayer() {
        for (const letter of this.lettersToRemoveInRack) {
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
