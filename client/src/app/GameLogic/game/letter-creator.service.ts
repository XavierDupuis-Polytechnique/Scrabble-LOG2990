import { Injectable } from '@angular/core';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
import { Letter } from 'src/app/GameLogic/game/letter.interface';
@Injectable({
    providedIn: 'root',
})
export class LetterCreatorService {
    stringToLetter(letters: string) {
        const lettersToExchange: Letter[] = [];

        if (letters == null) return;
        if (letters.length > 0) {
            for (let charIndex = 0; charIndex < letters.length; charIndex++) {
                lettersToExchange[charIndex] = { char: letters[charIndex], value: LetterBag.gameLettersValue[letters.charCodeAt(charIndex) - 97] };
            }
            return lettersToExchange;
        }
        return;
    }
}
