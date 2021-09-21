import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { Message } from '@app/GameLogic/messages/message.interface';
import { Subject } from 'rxjs';

const CHARACTER_V = 'v'.charCodeAt(0);
const CHARACTER_H = 'h'.charCodeAt(0);
const MAX_COL = 15;
const MIN_PLACE_LETTER_ARG_SIZE = 3;
const MAX_PLACE_LETTER_ARG_SIZE = 4;
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
                let args = toVerify.slice(1, toVerify.length);
                const errorSyntax = 'erreur de syntax';
                if (commandType === CommandType.Place) {
                    if (args[0].length >= MIN_PLACE_LETTER_ARG_SIZE || args[0].length <= MAX_PLACE_LETTER_ARG_SIZE) {
                        const row = args[0].charCodeAt(0);
                        let col;
                        const direction = args[0].charCodeAt(args[0].length - 1);
                        // Verifie s'il s'agit d'un axxv ou axv
                        if (args[0][2].charCodeAt(0) < CHARACTER_H) {
                            col = Number(args[0][1] + args[0][2]);
                        } else {
                            col = Number(args[0][1]);
                        }
                        const word = args[args.length - 1];
                        args = [];
                        args = [String.fromCharCode(row), String(col), String.fromCharCode(direction), word];

                        if (row > 'o'.charCodeAt(0) || row < 'a'.charCodeAt(0)) {
                            // si depasse 'o' et inferieur a 'a'
                            throw Error(errorSyntax + ': ligne hors champ');
                        }
                        if (col > MAX_COL) {
                            throw Error(errorSyntax + ': colonne hors champ');
                        }
                        if (direction !== CHARACTER_H && direction !== CHARACTER_V) {
                            throw Error(errorSyntax + ': direction invalide');
                        }
                    } else {
                        throw Error(errorSyntax + ': les paramètres sont invalide');
                    }
                }
                const command = this.createCommand(args, commandCondition as CommandType);
                console.log(command);
                this.sendCommand(command);
                return true;
            }
            const errorContent = commandCondition + ' est une commande invalide';
            throw Error(errorContent);
        }
        return false;
    }
}
