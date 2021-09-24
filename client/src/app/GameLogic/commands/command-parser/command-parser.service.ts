import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { Message } from '@app/GameLogic/messages/message.interface';
import { Subject, throwError } from 'rxjs';

const CHARACTER_V = 'v'.charCodeAt(0);
const CHARACTER_H = 'h'.charCodeAt(0);
const MAX_COL = 15;
const MIN_PLACE_LETTER_ARG_SIZE = 3;
const MAX_PLACE_LETTER_ARG_SIZE = 4;
const INDEX_RECTIFIER = 97;
@Injectable({
    providedIn: 'root',
})
export class CommandParserService {
    private errorSyntax = 'erreur de syntax';
    private command$: Subject<Command> = new Subject();

    get parsedCommand$() {
        return this.command$;
    }

    createCommand(args: string[], commandType: CommandType): Command {
        const command = { type: commandType, args } as Command;
        return command;
    }

    sendCommand(command: Command) {
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
                console.log(args);
                console.log('-------------------------------');

                if (commandType === CommandType.Place) {
                    if (toVerify.length < 3) {
                        throw Error('mot ou emplacement manquant');
                    }
                    args = this.placeLetterFormatter(args);
                }
                const command = this.createCommand(args, commandCondition as CommandType);
                this.sendCommand(command);
                return true;
            }
            const errorContent = commandCondition + ' est une commande invalide';
            throw Error(errorContent);
        }
        return false;
    }

    placeLetterFormatter(args: string[]): string[] {
        const whiteSpace = new RegExp('\\s+');
        if (args[0].length <= MAX_PLACE_LETTER_ARG_SIZE && args[0].length >= MIN_PLACE_LETTER_ARG_SIZE) {
            const row = args[0].charCodeAt(0);
            const col = this.colArgVerifier(args);
            const direction = args[0].charCodeAt(args[0].length - 1);
            const word = args[1];
            console.log(row - INDEX_RECTIFIER + word.length);
            console.log(col + word.length);
            console.log('-------------------------------');
            if (col + word.length > MAX_COL || row - INDEX_RECTIFIER + word.length > MAX_COL) {
                throwError(this.errorSyntax + ': le mot depasse la grille');
            }
            if (word.length < 2 || whiteSpace.test(word)) {
                throw Error(this.errorSyntax + ': mot invalide');
            }

            args = [];
            args = [String.fromCharCode(row), String(col), String.fromCharCode(direction), word];
            this.placeLetterArgVerifier(row, col, direction);
        } else {
            throw Error(this.errorSyntax + ': les paramètres sont invalide');
        }
        return args;
    }

    placeLetterArgVerifier(row: number, col: number, direction: number) {
        if (row > 'o'.charCodeAt(0) || row < 'a'.charCodeAt(0)) {
            // si depasse 'o' et inferieur a 'a'
            throw Error(this.errorSyntax + ': ligne hors champ');
        }
        if (col > MAX_COL) {
            throw Error(this.errorSyntax + ': colonne hors champ');
        }
        if (direction !== CHARACTER_H && direction !== CHARACTER_V) {
            throw Error(this.errorSyntax + ': direction invalide');
        }
    }
    // Verifie s'il s'agit d'un axxv ou axv
    colArgVerifier(arg1: string[]): number {
        let col;
        if (arg1[0][2].charCodeAt(0) < CHARACTER_H) {
            col = Number(arg1[0][1] + arg1[0][2]);
        } else {
            col = Number(arg1[0][1]);
        }
        return col;
    }
}
