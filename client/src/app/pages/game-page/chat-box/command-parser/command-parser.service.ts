import { Injectable } from '@angular/core';
// import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { Letter } from 'src/app/GameLogic/game/letter.interface';
// import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
enum Command {
    Debug = '!debug',
    Help = '!aide',
    Place = '!placer',
    Exchange = '!échanger',
    Pass = '!passer',
}
// Placeholder
// player: Player;

@Injectable({
    providedIn: 'root',
})

// {char: "A", value:"1"}
export class CommandParserService {
    constructor() {}

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

    verifyCommand(input: string, Message: HTMLParagraphElement): [HTMLParagraphElement, boolean] {
        // Couper l'entry par espace pour verifier s'il s'agit d'une commande
        const toVerify = input.split(' ');
        console.log(toVerify);
        const commandCondition = toVerify[0];
        if (commandCondition[0] == '!') {
            Message.style.color = 'red';
            Message.classList.add('systemMessage');
            Message.innerHTML = 'Commande: ';

            switch (commandCondition) {
                case Command.Place: {
                    return [Message, true];
                }
                case Command.Exchange: {
                    this.stringToLetter(toVerify[1]);
                    // const comExchange: ExchangeLetter = new ExchangeLetter(player, this.stringToLetter(toVerify[1]));
                    return [Message, true];
                }
                case Command.Pass: {
                    return [Message, true];
                }
                case Command.Debug: {
                    return [Message, true];
                }
                case Command.Help: {
                    return [Message, true];
                }
                default: {
                    Message.innerHTML += 'invalide';
                    return [Message, true];
                }
            }
        }
        return [Message, false];
    }
}
