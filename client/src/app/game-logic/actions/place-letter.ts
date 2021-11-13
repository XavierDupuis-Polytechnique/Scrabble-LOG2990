import { Action } from '@app/game-logic/actions/action';
import { EMPTY_CHAR, TIME_FOR_REVERT } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { OfflineGame } from '@app/game-logic/game/games/solo-game/offline-game';
import { ObjectiveManagerService } from '@app/game-logic/game/objectives/objective-manager.service';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Vec2 } from '@app/game-logic/interfaces/vec2';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { isCharUpperCase } from '@app/game-logic/utils';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { timer } from 'rxjs';
export class PlaceLetter extends Action {
    affectedCoords: Vec2[];
    private lettersToRemoveInRack: Letter[];
    private letterFactory = new LetterCreator();

    constructor(
        player: Player,
        public word: string,
        public placement: PlacementSetting,
        private pointCalculator: PointCalculatorService,
        private wordSearcher: WordSearcher,
        private objectiveManager: ObjectiveManagerService,
    ) {
        super(player);
    }

    protected perform(game: OfflineGame) {
        const validWordList = this.wordSearcher.listOfValidWord(this);
        const words = validWordList.map((validWord) => validWord.letters);
        this.putLettersOnBoard(game);
        this.player.removeLetterFromRack(this.lettersToRemoveInRack);
        const wordValid = validWordList.length !== 0;
        if (wordValid) {
            this.pointCalculator.placeLetterCalculation(this, words);
            this.drawLettersForPlayer(game);
            // TODO : if(game instanceof SpecialOnlineGame) then next line
            this.objectiveManager.checkObjectives(this, game);
            this.end();
        } else {
            timer(TIME_FOR_REVERT).subscribe(() => {
                this.revert(game);
                this.end();
            });
        }
    }

    private revert(game: OfflineGame) {
        this.removeLetterFromBoard(game);
        this.giveBackLettersToPlayer();
    }

    private removeLetterFromBoard(game: OfflineGame) {
        const grid = game.board.grid;
        for (const coord of this.affectedCoords) {
            const x = coord.x;
            const y = coord.y;
            grid[y][x].letterObject.char = EMPTY_CHAR;
        }
    }

    private drawLettersForPlayer(game: OfflineGame) {
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

    private putLettersOnBoard(game: OfflineGame) {
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
