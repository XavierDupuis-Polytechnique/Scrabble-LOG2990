import { Injectable } from '@angular/core';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import {
    BOARD_DIMENSION,
    CHARACTER_H,
    CHARACTER_V,
    MAX_PLACE_LETTER_ARG_SIZE,
    MIN_PLACE_LETTER_ARG_SIZE,
    RACK_LETTER_COUNT
} from '@app/GameLogic/constants';
import { Observable, Subject } from 'rxjs';

const INVALID_PLACE_LETTER = new RegExp('[^a-zA-Z]');
const INVALID_EXCHANGE_LETTER = new RegExp('[^a-z*]');
@Injectable({
    providedIn: 'root',
})
export class CommandParserService {
    private errorSyntax = 'erreur de syntax';
    private command$: Subject<Command> = new Subject();
    private errorMessageContent$: Subject<string> = new Subject();

    get parsedCommand$(): Observable<Command> {
        return this.command$;
    }
    get errormessage$() {
        return this.errorMessageContent$;
    }
    createCommand(from: string, args: string[], commandType: CommandType): Command {
        const command = { from, type: commandType, args } as Command;
        return command;
    }

    sendCommand(command: Command) {
        this.command$.next(command);
    }

    sendErrorMessage(message: string) {
        this.errorMessageContent$.next(message);
    }

    parse(message: string, from: string): CommandType | undefined {
        const toVerify = message.split(' ').filter(Boolean);
        const commandCondition = toVerify[0];
        if (commandCondition[0] === '!') {
            const commandType = commandCondition as CommandType;
            if (Object.values(CommandType).includes(commandType)) {
                let args = toVerify.slice(1, toVerify.length);
                if (commandType === CommandType.Place) {
                    if (toVerify.length < 3) {
                        this.sendErrorMessage('mot ou emplacement manquant');
                    }
                    args = this.placeLetterFormatter(args);
                }
                if (commandType === CommandType.Exchange) {
                    this.exchangeLetterArgVerifier(args[0]);
                }
                const command = this.createCommand(from, args, commandCondition as CommandType);
                this.sendCommand(command);
                return commandCondition as CommandType;
            }
            const errorContent = commandCondition + ' est une entrée invalide';
            this.sendErrorMessage(errorContent);
        }
        return undefined;
    }

    private placeLetterFormatter(args: string[]): string[] {
        if (args[0].length <= MAX_PLACE_LETTER_ARG_SIZE && args[0].length >= MIN_PLACE_LETTER_ARG_SIZE) {
            const row = args[0].charCodeAt(0);
            const col = this.colArgVerifier(args[0]);
            const direction = args[0].charCodeAt(args[0].length - 1);
            const word = args[1].normalize('NFD').replace(/\p{Diacritic}/gu, '');

            this.placeLetterArgVerifier(row, col, direction, word);

            args = [];
            args = [String.fromCharCode(row), String(col), String.fromCharCode(direction), word];
        } else {
            this.sendErrorMessage(this.errorSyntax + ': les paramètres sont invalides');
        }
        return args;
    }

    private placeLetterArgVerifier(row: number, col: number | undefined, direction: number, word: string) {
        if (row > 'o'.charCodeAt(0) || row < 'a'.charCodeAt(0)) {
            this.sendErrorMessage(this.errorSyntax + ': ligne hors champ');
        }
        if (col === undefined || col > BOARD_DIMENSION) {
            this.sendErrorMessage(this.errorSyntax + ': colonne hors champ');
        }
        if (direction !== CHARACTER_H && direction !== CHARACTER_V) {
            this.sendErrorMessage(this.errorSyntax + ': direction invalide');
        }
        if (word.length < 2 || word.length > BOARD_DIMENSION || INVALID_PLACE_LETTER.test(word)) {
            this.sendErrorMessage(this.errorSyntax + ': mot invalide');
        }
    }

    private colArgVerifier(columns: string): number | undefined {
        let col;
        if (this.isNumeric(columns[1]) && this.isNumeric(columns[2]) && columns.length === MAX_PLACE_LETTER_ARG_SIZE) {
            col = Number(columns[1] + columns[2]);
            return col;
        } else if (this.isNumeric(columns[1]) && columns.length === MIN_PLACE_LETTER_ARG_SIZE) {
            col = Number(columns[1]);
            return col;
        }
        this.sendErrorMessage(this.errorSyntax + ': colonne invalide');
        return undefined;
    }

    private exchangeLetterArgVerifier(word: string): boolean {
        if (INVALID_EXCHANGE_LETTER.test(word) || word === undefined) {
            this.sendErrorMessage('les paramètres sont invalides');
            return false;
        }
        if (word.length > RACK_LETTER_COUNT) {
            this.sendErrorMessage('Commande impossible à réaliser: un maximum de 7 lettres peuvent être échangé');
            return false;
        }
        return true;
    }

    private isNumeric(value: string) {
        return /^\d+$/.test(value);
    }
}
