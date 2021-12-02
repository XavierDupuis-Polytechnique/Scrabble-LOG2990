import { Action } from '@app/game-logic/actions/action';
import { RACK_LETTER_COUNT, TIME_BUFFER_BEFORE_ACTION } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { ValidWord } from '@app/game-logic/player/bot/valid-word';
import { timer } from 'rxjs';
import { Bot } from './bot';

export class HardBot extends Bot {
    bestWordList: ValidWord[] = [];

    setActive() {
        this.startTimerAction();
        this.timesUp = false;
        timer(TIME_BUFFER_BEFORE_ACTION).subscribe(() => {
            const action = this.actionPicker();
            this.chooseAction(action);
        });
    }

    private actionPicker(): Action {
        const validWordsList = this.bruteForceStart();
        if (validWordsList.length === 0) {
            return this.exchangeAction();
        } else {
            const pickedWord = this.bestWordPicker(validWordsList);
            return this.playAction(pickedWord[0]);
        }
    }

    private bestWordPicker(validWordsList: ValidWord[]): ValidWord[] {
        const numberOfWords = 4;
        const zeroValueWord = new ValidWord('');
        zeroValueWord.value.totalPoints = 0;
        this.bestWordList = [];

        for (let i = 0; i < numberOfWords; i++) {
            this.bestWordList.push(zeroValueWord);
        }

        for (const validWord of validWordsList) {
            for (let index = 0; index < numberOfWords; index++) {
                if (validWord.value.totalPoints > this.bestWordList[index].value.totalPoints) {
                    this.bestWordList.splice(index, 0, validWord);
                    this.bestWordList.pop();
                    break;
                }
            }
        }
        return this.bestWordList;
    }

    private playAction(pickedWord: ValidWord): Action {
        const placeSetting: PlacementSetting = {
            x: pickedWord.startingTileX,
            y: pickedWord.startingTileY,
            direction: pickedWord.isVertical ? Direction.Vertical : Direction.Horizontal,
        };
        return this.actionCreator.createPlaceLetter(this, pickedWord.word, placeSetting);
    }

    private exchangeAction(): Action {
        if (this.gameInfo.numberOfLettersRemaining >= RACK_LETTER_COUNT) {
            return this.actionCreator.createExchange(this, this.letterRack);
        }
        if (this.gameInfo.numberOfLettersRemaining > 0) {
            const lettersToExchange: Letter[] = [];
            const indexStart = this.getRandomInt(this.letterRack.length - 1);
            for (let i = 0; i < this.gameInfo.numberOfLettersRemaining; i++) {
                lettersToExchange.push(this.letterRack[(indexStart + i) % this.letterRack.length]);
            }
            return this.actionCreator.createExchange(this, lettersToExchange);
        }
        return this.passAction();
    }

    private passAction(): Action {
        return this.actionCreator.createPassTurn(this);
    }
}
