import { Injectable } from '@angular/core';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { Letter } from 'src/app/GameLogic/game/letter.interface';

const INDEXRECTIFIER = 97;
@Injectable({
    providedIn: 'root',
})
export class LetterCreatorService {
    indexRectifier = INDEXRECTIFIER;
    stringToLetter(letters: string) {
        const lettersToExchange: Letter[] = [];

        if (letters == null) return;
        if (letters.length > 0) {
            for (let charIndex = 0; charIndex < letters.length; charIndex++) {
                lettersToExchange[charIndex] = {
                    char: letters[charIndex],
                    value: LetterBag.gameLettersValue[letters.charCodeAt(charIndex) - this.indexRectifier],
                };
            }
            return lettersToExchange;
        }
        return;
    }
}
