import { Player } from './player';

export class Bot extends Player {
    static botNames = ['BlaboBlabo', 'Pingu', 'Kirbo'];

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
    }

    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
