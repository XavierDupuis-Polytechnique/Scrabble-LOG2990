import { Bot } from './bot';

export class EasyBot extends Bot {
    static actionProabibility = { play: 0.8, exchange: 0.1, pass: 0.1 };

    randomActionPicker() {
        const randomValue = Math.random();
        if (randomValue <= EasyBot.actionProabibility.play) {
            // playAction();
        } else if (randomValue <= EasyBot.actionProabibility.play + EasyBot.actionProabibility.exchange) {
            // exchangeAction();
        } else {
            // passAction();
        }
    }

    // randomWordPicker()
}
