import { DictionaryService } from '@app/GameLogic/validator/dictionary.service';
import { BoardService } from '@app/services/board.service';
import { Player } from './player';
import { ValidWord } from './valid-word';

export abstract class Bot extends Player {
    static botNames = ['Jimmy', 'Sasha', 'Beep'];

    // Bot constructor takes opponent name as argument to prevent same name
    constructor(name: string, private boardService: BoardService, private dictionaryService: DictionaryService) {
        super('PlaceholderName');
        this.name = this.generateBotName(name);
    }

    getRandomInt(max: number, min: number = 0) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    // Will probably need to be moved to a UI component to show the name
    generateBotName(opponentName: string): string {
        const generatedName = Bot.botNames[this.getRandomInt(Bot.botNames.length)];
        return generatedName === opponentName ? this.generateBotName(opponentName) : generatedName;
    }

    generateWordList(/* board, availableLetter*/): ValidWord[] {
        // TO DO : a LOT of stuff goes here
        this.dictionaryService;
        this.boardService;
        this.letterRack;
        return [];
    }

    hello(): void {
        console.log('hello from bot ' + this.name);
    }
}
