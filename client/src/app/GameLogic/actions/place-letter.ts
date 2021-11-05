import { Action } from '@app/GameLogic/actions/action';
import { EMPTY_CHAR, TIME_FOR_REVERT } from '@app/GameLogic/constants';
import { Direction } from '@app/GameLogic/direction.enum';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { Letter } from '@app/GameLogic/game/board/letter.interface';
import { Game } from '@app/GameLogic/game/games/solo-game/game';
import { PlacementSetting } from '@app/GameLogic/interfaces/placement-setting.interface';
import { Vec2 } from '@app/GameLogic/interfaces/vec2';
import { Player } from '@app/GameLogic/player/player';
import { PointCalculatorService } from '@app/GameLogic/point-calculator/point-calculator.service';
import { isCharUpperCase } from '@app/GameLogic/utils';
import { WordSearcher } from '@app/GameLogic/validator/word-search/word-searcher.service';
import { timer } from 'rxjs';
export class PlaceLetter extends Action {
    lettersToRemoveInRack: Letter[];
    affectedCoords: Vec2[];
    private letterFactory = new LetterCreator();

    constructor(
        player: Player,
        public word: string,
        public placement: PlacementSetting,
        private pointCalculator: PointCalculatorService,
        private wordSearcher: WordSearcher,
    ) {
        super(player);
    }

    revert(game: Game) {
        this.removeLetterFromBoard(game);
        this.giveBackLettersToPlayer();
    }

    protected perform(game: Game) {
        const validWordList = this.wordSearcher.listOfValidWord(this);
        const words = validWordList.map((validWord) => validWord.letters);
        this.putLettersOnBoard(game);
        this.player.removeLetterFromRack(this.lettersToRemoveInRack);
        const wordValid = validWordList.length !== 0;
        if (wordValid) {
            this.pointCalculator.placeLetterCalculation(this, words);
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
            grid[y][x].letterObject.char = EMPTY_CHAR;
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

            if (char === EMPTY_CHAR) {
                const charToCreate = this.word[wordIndex];
                const letterToRemove = this.letterToRemove(charToCreate);
                this.lettersToRemoveInRack.push(letterToRemove);
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
