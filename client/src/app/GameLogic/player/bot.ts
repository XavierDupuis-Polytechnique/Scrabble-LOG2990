import { Player } from './player';

export class Bot extends Player {
    static botNames = ['BlaboBlabo', 'Pingu', 'Kirbo'];
    static actionProabibility = { Play: 0.8, Exchange: 0.1, Pass: 0.1 };

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
    }

    getRandomInt(max: number) {
        return Math.floor(Math.random() * max);
    }

    // Devra probablement être déplacé dans un component UI pour afficher le nom
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
