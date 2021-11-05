import { Injectable } from '@angular/core';
import { PlaceLetterParameters } from '@app/game-logic/commands/command-parser/place-letter-parameters';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import {
    BOARD_DIMENSION,
    CHARACTER_H,
    CHARACTER_V,
    MAX_PLACE_LETTER_ARG_SIZE,
    MIN_PLACE_LETTER_ARG_SIZE,
    RACK_LETTER_COUNT
} from '@app/game-logic/constants';
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

    get errorMessage$() {
        return this.errorMessageContent$;
    }

    parse(message: string, from: string): CommandType | undefined {
        const toVerify = message.split(' ').filter(Boolean);
        const commandCondition = toVerify[0];
        if (commandCondition[0] === '!') {
            const commandType = commandCondition as CommandType;

            if (!Object.values(CommandType).includes(commandType)) {
                const errorContent = commandCondition + ' est une entrée invalide';
                this.sendErrorMessage(errorContent);
                return undefined;
            }

            let args: string[] | undefined = toVerify.slice(1, toVerify.length);

            if (commandType === CommandType.Place) {
                args = this.formatPlaceLetter(args);
                if (args === undefined) {
                    return undefined;
                }
            } else if (commandType === CommandType.Exchange) {
                if (!this.verifyExchangeLetterArgr(args[0])) {
                    return undefined;
                }
            }
            const command = this.createCommand(from, args, commandType);
            this.sendCommand(command);
            return commandType;
        }
        return undefined;
    }

    private createCommand(from: string, args: string[], commandType: CommandType): Command {
        const command = { from, type: commandType, args } as Command;
        return command;
    }

    private sendCommand(command: Command) {
        this.command$.next(command);
    }

    private sendErrorMessage(message: string) {
        this.errorMessageContent$.next(message);
    }

    private formatPlaceLetter(placeLetterParameters: string[]): string[] | undefined {
        const invalidParameters = this.errorSyntax + ': les paramètres sont invalides';
        if (placeLetterParameters.length === 0) {
            this.sendErrorMessage(invalidParameters);
            return undefined;
        }
        if (placeLetterParameters[0].length < MIN_PLACE_LETTER_ARG_SIZE || placeLetterParameters[0].length > MAX_PLACE_LETTER_ARG_SIZE) {
            this.sendErrorMessage(invalidParameters);
            return undefined;
        }
        if (placeLetterParameters !== undefined && placeLetterParameters.length === 2) {
            const parameters: PlaceLetterParameters = {
                row: placeLetterParameters[0].charCodeAt(0),
                col: this.getColumns(placeLetterParameters[0]),
                direction: placeLetterParameters[0].charCodeAt(placeLetterParameters[0].length - 1),
                word: placeLetterParameters[1].normalize('NFD').replace(/\p{Diacritic}/gu, ''),
            };
            if (!this.verifyPlaceLetterArgParameters(parameters)) {
                return undefined;
            }

            placeLetterParameters = [
                String.fromCharCode(parameters.row),
                String(parameters.col),
                String.fromCharCode(parameters.direction),
                parameters.word,
            ];
        } else if (placeLetterParameters.length === 1) {
            this.sendErrorMessage('mot ou emplacement manquant');
            return undefined;
        } else {
            this.sendErrorMessage(invalidParameters);
            return undefined;
        }
        return placeLetterParameters;
    }

    private verifyPlaceLetterArgParameters(placeLetterParameters: PlaceLetterParameters): boolean {
        if (!this.isValidRow(placeLetterParameters.row)) {
            this.sendErrorMessage(this.errorSyntax + ': ligne invalide');
            return false;
        }
        if (!this.isValidColumn(placeLetterParameters.col)) {
            this.sendErrorMessage(this.errorSyntax + ': colonne invalide');
            return false;
        }
        if (!this.isValidDirection(placeLetterParameters.direction)) {
            this.sendErrorMessage(this.errorSyntax + ': direction invalide');
            return false;
        }
        if (!this.isValidWord(placeLetterParameters.word)) {
            this.sendErrorMessage(this.errorSyntax + ': mot invalide');
            return false;
        }
        return true;
    }

    private getColumns(columns: string): number | undefined {
        let col;
        if (this.isValidColumnsFormat(columns)) {
            col = Number(columns[1] + columns[2]);
            return col;
        } else if (this.isValidColumnFormat(columns)) {
            col = Number(columns[1]);
            return col;
        }
        this.sendErrorMessage(this.errorSyntax + ': colonne invalide');
        return undefined;
    }

    private verifyExchangeLetterArgr(word: string): boolean {
        if (word === undefined || INVALID_EXCHANGE_LETTER.test(word)) {
            this.sendErrorMessage('les paramètres sont invalides');
            return false;
        }
        if (word.length > RACK_LETTER_COUNT) {
            this.sendErrorMessage('Commande impossible à réaliser: un maximum de 7 lettres peuvent être échangé');
            return false;
        }
        return true;
    }

    private isValidColumnsFormat(columns: string): boolean {
        if (!this.isNumeric(columns[1])) {
            return false;
        }
        if (!this.isNumeric(columns[2])) {
            return false;
        }
        if (columns.length !== MAX_PLACE_LETTER_ARG_SIZE) {
            return false;
        }
        return true;
    }

    private isValidColumnFormat(columns: string): boolean {
        if (!this.isNumeric(columns[1])) {
            return false;
        }
        if (columns.length !== MIN_PLACE_LETTER_ARG_SIZE) {
            return false;
        }
        return true;
    }

    private isValidRow(row: number): boolean {
        if (row === undefined) {
            return false;
        }
        if (row > 'o'.charCodeAt(0)) {
            return false;
        }
        if (row < 'a'.charCodeAt(0)) {
            return false;
        }
        return true;
    }

    private isValidColumn(columns: number | undefined): boolean {
        if (columns === undefined) {
            return false;
        }
        if (columns > BOARD_DIMENSION) {
            return false;
        }
        return true;
    }

    private isValidDirection(direction: number): boolean {
        if (direction === undefined) {
            return false;
        }
        if (direction !== CHARACTER_H && direction !== CHARACTER_V) {
            return false;
        }
        return true;
    }

    private isValidWord(word: string): boolean {
        if (word === undefined) {
            return false;
        }
        if (word.length < 2) {
            return false;
        }
        if (word.length > BOARD_DIMENSION) {
            return false;
        }
        if (INVALID_PLACE_LETTER.test(word)) {
            return false;
        }
        return true;
    }

    private isNumeric(value: string) {
        return /^\d+$/.test(value);
    }
}
