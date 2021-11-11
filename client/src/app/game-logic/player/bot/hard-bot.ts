import { Action } from '@app/game-logic/actions/action';
import { RACK_LETTER_COUNT, TIME_BUFFER_BEFORE_ACTION } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { ValidWord } from '@app/game-logic/player/bot/valid-word';
import { timer } from 'rxjs';
import { Bot } from './bot';

export class HardBot extends Bot {
    setActive() {
        this.startTimerAction();
        this.timesUp = false;
        timer(TIME_BUFFER_BEFORE_ACTION).subscribe(() => {
            const action = this.actionPicker();
            this.chooseAction(action);
        });
    }

    actionPicker(): Action {
        const validWordsList = this.bruteForceStart();
        if (validWordsList.length === 0) {
            return this.exchangeAction();
        } else {
            const pickedWord = this.bestWordPicker(validWordsList);
            return this.playAction(pickedWord[0]);
        }
    }

    // TODO Add these extra words to debug (sprint 3)
    bestWordPicker(validWordsList: ValidWord[]): ValidWord[] {
        const numberOfWords = 4;
        const bestWords: ValidWord[] = [];
        const zeroValueWord = new ValidWord('');
        zeroValueWord.value.totalPoints = 0;

        for (let i = 0; i < numberOfWords; i++) {
            bestWords.push(zeroValueWord);
        }

        for (const validWord of validWordsList) {
            for (let index = 0; index < numberOfWords; index++) {
                if (validWord.value.totalPoints > bestWords[index].value.totalPoints) {
                    bestWords.splice(index, 0, validWord);
                    bestWords.pop();
                    break;
                }
            }
        }
        return bestWords;
    }

    playAction(pickedWord: ValidWord): Action {
        const placeSetting: PlacementSetting = {
            x: pickedWord.startingTileX,
            y: pickedWord.startingTileY,
            direction: pickedWord.isVertical ? Direction.Vertical : Direction.Horizontal,
        };
        return this.actionCreator.createPlaceLetter(this, pickedWord.word, placeSetting);
    }

    exchangeAction(): Action {
        if (this.gameInfo.numberOfLettersRemaining > RACK_LETTER_COUNT) {
            return this.actionCreator.createExchange(this, this.letterRack);
        }
        return this.passAction();
    }

    passAction(): Action {
        return this.actionCreator.createPassTurn(this);
    }
}
