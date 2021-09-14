import { Injectable } from '@angular/core';

enum Command {
  InvalidCommand,
  Debug,
  Help = '!aide',
  Place = '!placer',
  Exchanger = '!échanger',
  Pass = '!passer',
}

@Injectable({
  providedIn: 'root'
})


export class CommandParserService {

  constructor() { }


  isCommand(toVerify: string, Message: HTMLParagraphElement): [HTMLParagraphElement, boolean] {
    // Couper l'entry par espace pour verifier s'il s'agit d'une commande
    const commandCondition = toVerify.split(' ')[0];
    if (commandCondition[0] == '!') {

      switch (commandCondition) {
        case Command.Place: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande';

          return [Message, true];
        }
        case Command.Pass: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande';

          return [Message, true];
        }
        case Command.Debug: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande';

          return [Message, true];
        }
        case Command.Help: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande';

          return [Message, true];

        }
        case Command.InvalidCommand: {
          Message.classList.add('systemMessage');
          Message.innerHTML = 'Commande';

          return [Message, true];

        }
        default: {
          return [Message, false];
        }
      }
    }
    return [Message, false];
  }
}
