import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { Message } from '@app/GameLogic/messages/message.interface';
import { Subject } from 'rxjs';

const CHARACTER_V = 'v'.charCodeAt(0);
const CHARACTER_H = 'h'.charCodeAt(0);
const MAX_COL = 15;
const PLACE_LETTER_ARG_SIZE = 4;
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
            const commandType = commandCondition as CommandType;
            if (Object.values(CommandType).includes(commandType)) {
                const args = toVerify.slice(1, toVerify.length);
                const command = this.createCommand(args, commandCondition as CommandType);
                const errorSyntax = 'erreur de syntax';
                if (commandType === CommandType.Place) {
                    if (args[0].length === PLACE_LETTER_ARG_SIZE) {
                        const row = args[0].charCodeAt(0);
                        const col = Number(args[0][1] + args[0][2]);
                        const direction = args[0].charCodeAt(3);

                        if (row > 'o'.charCodeAt(0) && row < 'a'.charCodeAt(0)) {
                            // si depasse 'o' et inferieur a 'a'
                            throw Error(errorSyntax + ': ligne hors champ');
                        }
                        if (col > MAX_COL) {
                            // superieur a 10
                            throw Error(errorSyntax + ': colonne hors champ');
                        }
                        if (direction !== CHARACTER_H && direction !== CHARACTER_V) {
                            throw Error(errorSyntax + ': direction invalide');
                        }
                    } else {
                        throw Error(errorSyntax + ': les paramètres sont invalide');
                    }
                }
                this.sendCommand(command);
                return true;
            }
            const errorContent = commandCondition + ' est une commande invalide';
            throw Error(errorContent);
        }
        return false;
    }
}
