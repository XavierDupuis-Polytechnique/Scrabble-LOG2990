import { Player } from './player';
import { ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Devra probablement être déplacé dans un component UI pour afficher le nom
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    generateWordList(/* board, availableLetter*/): ValidWord[] {
        // TO DO : a LOT of stuff goes here
        this.letterRack;
        return [];
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
