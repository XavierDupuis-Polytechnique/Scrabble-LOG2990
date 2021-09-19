import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
// import { Player } from '@app/GameLogic/player/player';
import { Message } from '@app/GameLogic/messages/message.interface';

// Placeholder
// player: Player;

// Placeholder
// player: Player;
// TODO: change place to game logic
@Injectable({
    providedIn: 'root',
})

// {char: "A", value:"1"}
export class CommandParserService {
    createCommand(args: string[], commandType: CommandType): Command {
        // if (message || commandType === null) {
        //     return { type: CommandType.Undefined, args: string[] } as Command;
        // }
        const command = { type: commandType, args } as Command;
        return command;
    }

    verifyCommand(message: Message): boolean {
        // Couper l'entry par espace pour verifier s'il s'agit d'une commande
        const toVerify = message.content.split(' ');
        const commandCondition = toVerify[0];
        if (commandCondition[0] === '!') {
            if (Object.values(CommandType).includes(commandCondition as CommandType)) {
                const args = toVerify.slice(1, 3);
                this.createCommand(args, commandCondition as CommandType);
                return true;
            }
            // TODO: put error in message service
            // message.content += ' est une commande invalide';
        }
        return false;
    }
}
