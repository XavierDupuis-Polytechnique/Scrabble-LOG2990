import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { RACK_LETTER_COUNT, TIME_BUFFER_BEFORE_ACTION, ZERO } from '@app/GameLogic/constants';
import { PlacementSetting } from '@app/GameLogic/interface/placement-setting.interface';
import { ValidWord } from '@app/GameLogic/player/valid-word';
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
        if (validWordsList.length === ZERO) {
            return this.exchangeAction();
        } else {
            const pickedWord = this.bestWordPicker(validWordsList);
            return this.playAction(pickedWord);
        }
    }

    // TODO Add these extra words to debug (sprint 3)
    bestWordPicker(validWordsList: ValidWord[]): ValidWord {
        let bestWord = new ValidWord('');
        bestWord.value.totalPoints = ZERO;
        let secondWord = new ValidWord('');
        secondWord.value.totalPoints = ZERO;
        let thirdWord = new ValidWord('');
        thirdWord.value.totalPoints = ZERO;
        let fourthWord = new ValidWord('');
        fourthWord.value.totalPoints = ZERO;

        for (const validWord of validWordsList) {
            if (validWord.value.totalPoints > bestWord.value.totalPoints) {
                fourthWord = thirdWord;
                thirdWord = secondWord;
                secondWord = bestWord;
                bestWord = validWord;
            } else if (validWord.value.totalPoints > secondWord.value.totalPoints) {
                fourthWord = thirdWord;
                thirdWord = secondWord;
                secondWord = validWord;
            } else if (validWord.value.totalPoints > thirdWord.value.totalPoints) {
                fourthWord = thirdWord;
                thirdWord = validWord;
            } else if (validWord.value.totalPoints > fourthWord.value.totalPoints) {
                fourthWord = validWord;
            }
        }
        return bestWord;
    }

    playAction(pickedWord: ValidWord): Action {
        const placeSetting: PlacementSetting = {
            x: pickedWord.startingTileX,
            y: pickedWord.startingTileY,
            direction: pickedWord.isVertical ? 'V' : 'H',
        };
        const action = new PlaceLetter(this, pickedWord.word, placeSetting, this.pointCalculatorService, this.wordValidator);
        return action;
    }

    exchangeAction(): Action {
        if (this.gameInfo.numberOfLettersRemaining > RACK_LETTER_COUNT) {
            return new ExchangeLetter(this, this.letterRack);
        } else return this.passAction();
    }

    passAction(): Action {
        const action = new PassTurn(this);
        return action;
    }
}
