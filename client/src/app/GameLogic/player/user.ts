import { Letter } from '@app/GameLogic/game/letter.interface';
import { Player } from './player';

export class User extends Player {
    getLettersFromRack(mockLetters: Letter[]): Letter[] {
        const lettersInRack: Map<string, Letter[]> = new Map();
        for (const letter of this.letterRack) {
            const char: string = letter.char;
            const occcurences: Letter[] | undefined = lettersInRack.get(char);
            if (occcurences) {
                occcurences.push(letter);
            } else {
                lettersInRack.set(char, [letter]);
            }
        }

        const lettersFromRack = [];
        for (const mockLetter of mockLetters) {
            const mockChar = mockLetter.char;
            const lettersLeft = lettersInRack.get(mockChar);
            if (lettersLeft) {
                const letterToAdd = lettersLeft.pop();
                if (!letterToAdd) {
                    throw Error('Some letters are invalid');
                }
                lettersFromRack.push(letterToAdd);
            } else {
                throw Error('Some letters are invalid');
            }
        }
        return lettersFromRack;
    }
}
