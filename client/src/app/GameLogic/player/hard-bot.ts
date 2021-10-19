import { Action } from '@app/GameLogic/actions/action';
import { Direction } from '@app/GameLogic/actions/direction.enum';
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
            return this.playAction(pickedWord[ZERO]);
        }
    }

    // TODO Add these extra words to debug (sprint 3)
    bestWordPicker(validWordsList: ValidWord[]): ValidWord[] {
        const numberOfWords = 4;
        const bestWords: ValidWord[] = [];
        const zeroValueWord = new ValidWord('');
        zeroValueWord.value.totalPoints = ZERO;

        for (let i = 0; i < numberOfWords; i++) {
            bestWords.push(zeroValueWord);
        }

        for (const validWord of validWordsList) {
            for (let index = ZERO; index < numberOfWords; index++) {
                if (validWord.value.totalPoints > bestWords[index].value.totalPoints) {
                    bestWords.splice(index, ZERO, validWord);
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
