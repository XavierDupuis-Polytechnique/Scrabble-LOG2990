import { Injectable } from '@angular/core';
import { Message } from '@app/classes/message';
import { CommandType } from '@app/GameLogic/commands/command.interface';
// import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '@app/GameLogic/game/letter-bag';
// import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { Letter } from 'src/app/GameLogic/game/letter.interface';

// Placeholder
// player: Player;
// TODO: change place to game logic
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

    verifyCommand(input: string, message: Message): void {
        // Couper l'entry par espace pour verifier s'il s'agit d'une commande
        const toVerify = input.split(' ');
        console.log(toVerify);
        const commandCondition = toVerify[0];
        const isCommand = commandCondition[0];
        if (!isCommand) {
            return;
        }
        // TODO: send to commandTranslator after creating command (command is in gamelogic use ctlr+f)
        switch (commandCondition) {
            case CommandType.Place: {
                // return [Message, true];
            }
            case CommandType.Exchange: {
                this.stringToLetter(toVerify[1]);
                // const comExchange: ExchangeLetter = new ExchangeLetter(player, this.stringToLetter(toVerify[1]));
                // return [Message, true];
            }
            case CommandType.Pass: {
                // return [Message, true];
            }
            case CommandType.Debug: {
                // return [Message, true];
            }
            case CommandType.Help: {
                // return [Message, true];
            }
            default: {
                Message.innerHTML += 'invalide';
                return [Message, true];
            }
        }
        return [Message, false];
    }
}
