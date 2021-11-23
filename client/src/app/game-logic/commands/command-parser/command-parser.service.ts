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
        console.log('CommandCondition', commandCondition);
        if (commandCondition[0] !== '!') {
            return;
        }

        const commandType = commandCondition as CommandType;
        if (!Object.values(CommandType).includes(commandType)) {
            const errorContent = commandCondition + ' est une entrée invalide';
            this.sendErrorMessage(errorContent);
            return;
        }
        let args: string[] | undefined = toVerify.slice(1, toVerify.length);
        console.log(args);
        if (commandType === CommandType.Place) {
            if (!this.formatPlaceLetter(args)) {
                return;
            }
            args = this.toFormatPlaceLetter(args);
        } else if (commandType === CommandType.Exchange) {
            if (!this.verifyExchangeLetterArgr(args[0])) {
                return;
            }
        }
        const command = this.createCommand(from, args, commandType);
        this.sendCommand(command);
        return commandType;
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

    private formatPlaceLetter(command: string[]): boolean {
        if (!this.isCommandPlaceLetterValid(command)) {
            return false;
        }

        const placeLetterParameters = {
            row: command[0].charCodeAt(0),
            col: this.getColumns(command[0]),
            direction: command[0].charCodeAt(command[0].length - 1),
            word: command[1].normalize('NFD').replace(/\p{Diacritic}/gu, ''),
        };
        if (!this.isPlaceLetterParameterValid(placeLetterParameters)) {
            return false;
        }
        return true;
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

    private toFormatPlaceLetter(command: string[]): string[] {
        const row = command[0].charCodeAt(0);
        const col = this.getColumns(command[0]);
        const direction = command[0].charCodeAt(command[0].length - 1);
        const word = command[1].normalize('NFD').replace(/\p{Diacritic}/gu, '');

        const placeLetterParameters = [String.fromCharCode(row), String(col), String.fromCharCode(direction), word];
        return placeLetterParameters;
    }

    private isPlaceLetterParameterValid(placeLetterParameters: PlaceLetterParameters): boolean {
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

    private isCommandPlaceLetterValid(commandPlaceLetter: string[]) {
        if (commandPlaceLetter.length === undefined) {
            this.sendErrorMessage(this.errorSyntax + ': les paramètres sont invalides');
            return false;
        }

        if (commandPlaceLetter.length < 2) {
            this.sendErrorMessage(this.errorSyntax + ': mot ou emplacement manquant');
            return false;
        }

        if (commandPlaceLetter.length > 2) {
            this.sendErrorMessage(this.errorSyntax + 'trop de paramètres entrés');
            return false;
        }

        const parametersPlaceLetter = commandPlaceLetter[0];
        if (parametersPlaceLetter.length < MIN_PLACE_LETTER_ARG_SIZE || parametersPlaceLetter.length > MAX_PLACE_LETTER_ARG_SIZE) {
            this.sendErrorMessage(this.errorSyntax + ': les paramètres sont invalides');
            return false;
        }

        // isParameterValid()

        return true;
    }
    private isParametersValid(parameters: string): boolean {
        const rowValue = parameters.slice(0);
        const columnValue = parameters.slice(1, 2);
        const directionValue = parameters.slice(2, 3);
        // TODO: Verify rowvalue
        // verify column value
        // verify direction
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

    private isValidColumnsFormat(columns: string): boolean {
        if (columns.length < 2) {
            if (!this.isNumeric(columns[1])) {
                return false;
            }
            return true;
        }
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
}
