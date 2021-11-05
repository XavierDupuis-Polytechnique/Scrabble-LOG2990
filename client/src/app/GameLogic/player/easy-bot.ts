import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { RACK_LETTER_COUNT, TIME_BUFFER_BEFORE_ACTION } from '@app/GameLogic/constants';
import { Direction } from '@app/GameLogic/direction.enum';
import { LetterBag } from '@app/GameLogic/game/board/letter-bag';
import { PlacementSetting } from '@app/GameLogic/interfaces/placement-setting.interface';
import { ValidWord } from '@app/GameLogic/player/valid-word';
import { timer } from 'rxjs';
import { Bot } from './bot';

export class EasyBot extends Bot {
    static actionProbability = { play: 0.8, exchange: 0.1, pass: 0.1 };
    static placementProbability = { sixOrLess: 0.4, sevenToTwelve: 0.3, other: 0.3 };
    static botPointSetting = {
        sixOrLess: {
            prob: 0.4,
            value: 6,
        },
        sevenToTwelve: {
            prob: 0.3,
            value: 12,
        },
        other: {
            prob: 0.3,
            value: 18,
        },
    };

    setActive() {
        this.startTimerAction();
        this.timesUp = false;
        timer(TIME_BUFFER_BEFORE_ACTION).subscribe(() => {
            const action = this.randomActionPicker();
            this.chooseAction(action);
        });
    }

    randomActionPicker(): Action {
        const randomValue = Math.random();
        if (randomValue <= EasyBot.actionProbability.play) {
            let action = this.playAction();
            if (action === undefined) {
                action = this.passAction();
            }
            return action;
        } else if (
            randomValue <= EasyBot.actionProbability.play + EasyBot.actionProbability.exchange &&
            this.gameInfo.numberOfLettersRemaining > RACK_LETTER_COUNT
        ) {
            return this.exchangeAction();
        } else {
            return this.passAction();
        }
    }

    randomWordPicker(validWordsList: ValidWord[]): ValidWord {
        const randomValue = Math.random();
        const validWordList: ValidWord[] = validWordsList;
        const wordP6: ValidWord[] = [];
        const wordP7to12: ValidWord[] = [];
        const wordP13To18: ValidWord[] = [];
        validWordList.forEach((word) => {
            if (word.value.totalPoints <= EasyBot.botPointSetting.sixOrLess.value) {
                wordP6.push(word);
            } else if (
                word.value.totalPoints > EasyBot.botPointSetting.sixOrLess.value &&
                word.value.totalPoints <= EasyBot.botPointSetting.sevenToTwelve.value
            ) {
                wordP7to12.push(word);
            } else if (
                word.value.totalPoints > EasyBot.botPointSetting.sevenToTwelve.value &&
                word.value.totalPoints <= EasyBot.botPointSetting.other.value
            ) {
                wordP13To18.push(word);
            }
        });
        let wordPicked: ValidWord;
        if (randomValue <= EasyBot.botPointSetting.sixOrLess.prob) {
            wordPicked = this.wordPicker(wordP6);
            return wordPicked;
        } else if (randomValue <= EasyBot.botPointSetting.sevenToTwelve.prob + EasyBot.botPointSetting.other.prob) {
            wordPicked = this.wordPicker(wordP7to12);
            return wordPicked;
        } else {
            wordPicked = this.wordPicker(wordP13To18);
            return wordPicked;
        }
    }

    playAction(): Action {
        const validWordsList = this.bruteForceStart();
        const pickedWord: ValidWord = this.randomWordPicker(validWordsList);
        if (pickedWord !== undefined) {
            const placeSetting: PlacementSetting = {
                x: pickedWord.startingTileX,
                y: pickedWord.startingTileY,
                direction: pickedWord.isVertical ? Direction.Vertical : Direction.Horizontal,
            };
            const action = new PlaceLetter(this, pickedWord.word, placeSetting, this.pointCalculatorService, this.wordValidator);
            return action;
        } else {
            const action = new PassTurn(this);
            return action;
        }
    }

    exchangeAction(): Action {
        const numberOfLettersToExchange = this.getRandomInt(LetterBag.playerLetterCount, 1);
        let lettersToExchangeIndex;
        const lettersToExchange = [];
        const indexArray = [];
        let randomInt;
        for (let i = 0; i < LetterBag.playerLetterCount; i++) {
            indexArray.push(i);
        }
        for (let i = 0; i < numberOfLettersToExchange; i++) {
            randomInt = this.getRandomInt(indexArray.length);
            lettersToExchangeIndex = indexArray[randomInt];
            indexArray.splice(randomInt, 1);
            lettersToExchange.push(this.letterRack[lettersToExchangeIndex]);
        }
        const action = new ExchangeLetter(this, lettersToExchange);
        return action;
    }

    passAction(): Action {
        const action = new PassTurn(this);
        return action;
    }

    private wordPicker(list: ValidWord[]): ValidWord {
        const randomPicker = this.getRandomInt(list.length);
        return list[randomPicker];
    }
}
