import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { Bot } from './bot';

export class EasyBot extends Bot {
    static actionProabibility = { Play: 0.8, Exchange: 0.1, Pass: 0.1 };

    randomActionPicker() {
        const randomValue = Math.random();
        if (randomValue <= EasyBot.actionProabibility.Play) {
            this.play();
        } else if (randomValue <= EasyBot.actionProabibility.Play + EasyBot.actionProabibility.Exchange) {
            this.exchange();
        } else {
            this.pass();
        }
    }

    // randomWordPicker()

    play() {
        return;
    }

    exchange() {
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
        this.action$.next(new ExchangeLetter(this, lettersToExchange));
    }

    pass() {
        this.action$.next(new PassTurn(this));
    }
}
