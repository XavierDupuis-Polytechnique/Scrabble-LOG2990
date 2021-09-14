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

    // Devra probablement être déplacé dans un component UI pour afficher le nom
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }



    // generateWordList(board, availableLetter):string[] {
        // TO DO : a LOT of stuff goes here
    //      this.letterRack
            
    //}

    playTurn() {
        
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
