import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { RACK_LETTER_COUNT, TIME_BUFFER_BEFORE_ACTION } from '@app/GameLogic/constants';
import { Direction } from '@app/GameLogic/direction.enum';
import { PlacementSetting } from '@app/GameLogic/interfaces/placement-setting.interface';
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
