import { Vec2 } from '@app/classes/vec2';
import { Action } from '@app/game/game-logic/actions/action';
import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { LetterCreator } from '@app/game/game-logic/board/letter-creator';
import { Letter } from '@app/game/game-logic/board/letter.interface';
import { EMPTY_CHAR, JOKER_CHAR, TIME_FOR_REVERT } from '@app/game/game-logic/constants';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { SpecialServerGame } from '@app/game/game-logic/game/special-server-game';
import { PlacementSetting } from '@app/game/game-logic/interface/placement-setting.interface';
import { ObjectiveUpdateParams } from '@app/game/game-logic/objectives/objectives/objective-update-params.interface';
import { Player } from '@app/game/game-logic/player/player';
import { PointCalculatorService } from '@app/game/game-logic/point-calculator/point-calculator.service';
import { copyGrid, isCharUpperCase } from '@app/game/game-logic/utils';
import { WordSearcher } from '@app/game/game-logic/validator/word-search/word-searcher.service';
import { timer } from 'rxjs';

export class PlaceLetter extends Action {
    affectedCoords: Vec2[];
    lettersToRemoveInRack: Letter[];
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

    protected perform(game: ServerGame) {
        const previousGrid = copyGrid(game.board.grid);
        const validWordList = this.wordSearcher.listOfValidWord(this, game.board.grid, game.gameToken);
        const formedWords = validWordList.map((validWord) => validWord.letters);
        this.putLettersOnBoard(game);
        const currentGrid = game.board.grid;
        this.player.removeLetterFromRack(this.lettersToRemoveInRack);
        const wordValid = validWordList.length !== 0;
        if (!wordValid) {
            timer(TIME_FOR_REVERT).subscribe(() => {
                this.revert(game);
                this.end();
            });
            return;
        }
        this.pointCalculator.placeLetterCalculation(this, formedWords, game.board.grid);
        this.drawLettersForPlayer(game);
        if (game instanceof SpecialServerGame) {
            const updateObjectiveParams: ObjectiveUpdateParams = {
                previousGrid,
                currentGrid,
                lettersToPlace: this.lettersToRemoveInRack,
                formedWords,
                affectedCoords: this.affectedCoords,
            };
            (game as SpecialServerGame).updateObjectives(this, updateObjectiveParams);
        }
        this.end();
    }

    private revert(game: ServerGame) {
        this.removeLetterFromBoard(game);
        this.giveBackLettersToPlayer();
    }

    private removeLetterFromBoard(game: ServerGame) {
        const grid = game.board.grid;
        for (const coord of this.affectedCoords) {
            const x = coord.x;
            const y = coord.y;
            grid[y][x].letterObject.char = EMPTY_CHAR;
        }
    }

    private drawLettersForPlayer(game: ServerGame) {
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

    private putLettersOnBoard(game: ServerGame) {
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
            return this.letterFactory.createLetter(JOKER_CHAR);
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
