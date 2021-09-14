import { Injectable } from '@angular/core';
//import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
//import { Letter } from 'src/app/GameLogic/game/letter.interface';
//import { Player } from '@app/GameLogic/player/player';
//import { LetterBag } from '@app/GameLogic/game/letter-bag';
enum Command {
  Debug = '!debug',
  Help = '!aide',
  Place = '!placer',
  Exchange = '!échanger',
  Pass = '!passer',
}
//Placeholder 
//player: Player;

@Injectable({
  providedIn: 'root'
})

// {char: "A", value:"1"}
export class CommandParserService {

  constructor() { }

  /* stringToLetter(letter: string) {
     let lettersToExchange: Letter[] = [];
     if (letter == null) return;
     if (letter.length > 0) {
       console.log(letter);/*
       for (var _i = 0; _i < letter.length; _i++) {
         lettersToExchange[_i].char = letter[_i];
         lettersToExchange[_i].value = LetterBag.gameLettersValue[letter.charCodeAt(_i) - 72];
 
       }
       for (var _i = 0; _i < letter.length; _i++) {
         console.log(lettersToExchange[_i].value);
       }
       return lettersToExchange;
 
     }
     return;
   }*/

  isCommand(toVerify: string, Message: HTMLParagraphElement): [HTMLParagraphElement, boolean] {
    // Couper l'entry par espace pour verifier s'il s'agit d'une commande
    console.log(toVerify.split(' ')[0]);
    const commandCondition = toVerify.split(' ')[0];
    if (commandCondition[0] == '!') {
      Message.style.color = 'red';

      switch (commandCondition) {

        case Command.Place: {
          Message.classList.add('systemMessage');
          Message.innerHTML = ' Commande ';

          return [Message, true];
        }
        case Command.Exchange: {
          // this.stringToLetter(toVerify.split(' ')[1]);
          Message.classList.add('systemMessage');
          return [Message, true];
          // const comExchange: ExchangeLetter = new ExchangeLetter(player, this.stringToLetter(toVerify.split(' ')[1]));
        }


        case Command.Pass: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande ';

          return [Message, true];
        }
        case Command.Debug: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande ';

          return [Message, true];
        }
        case Command.Help: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande ';

          return [Message, true];

        }
        default: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande invalide';

          return [Message, true];

        }

      }
    }
    return [Message, false];
  }
}
