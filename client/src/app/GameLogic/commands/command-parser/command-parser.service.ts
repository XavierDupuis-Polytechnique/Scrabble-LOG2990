import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { Message } from '@app/GameLogic/messages/message.interface';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommandParserService {
    private command$: Subject<Command> = new Subject();

    get parsedCommand$() {
        return this.command$;
    }

    createCommand(args: string[], commandType: CommandType): Command {
        const command = { type: commandType, args } as Command;
        return command;
    }

    sendCommand(command: Command) {
        console.log('send command');
        this.command$.next(command);
    }

    parse(message: Message): boolean {
        // Couper l'entry par espace pour verifier s'il s'agit d'une commande
        const toVerify = message.content.split(' ');
        const commandCondition = toVerify[0];
        if (commandCondition[0] === '!') {
            if (Object.values(CommandType).includes(commandCondition as CommandType)) {
                const args = toVerify.slice(1, toVerify.length);
                const command = this.createCommand(args, commandCondition as CommandType);
                this.sendCommand(command);
                return true;
            }
            const errorContent = commandCondition + ' est une commande invalide';
            throw Error(errorContent);
        }
        return false;
    }
}
