import { Injectable } from '@angular/core';
import { PlaceLetterParameters } from '@app/game-logic/commands/command-parser/place-letter-parameters';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import { BOARD_DIMENSION, MAX_PLACE_LETTER_ARG_SIZE, MIN_PLACE_LETTER_ARG_SIZE, RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { isStringALowerCaseLetter } from '@app/game-logic/utils';
import { Observable, Subject } from 'rxjs';

const INVALID_PLACE_LETTER = new RegExp('[^a-zA-Z]');
const INVALID_EXCHANGE_LETTER = new RegExp('[^a-z*]');
const SYNTAX_ERROR = 'erreur de syntax';
const MIN_BOARD_VALUE = 1;
@Injectable({
    providedIn: 'root',
})
export class CommandParserService {
    private command$: Subject<Command> = new Subject();
    private errorMessageContent$: Subject<string> = new Subject();

    get parsedCommand$(): Observable<Command> {
        return this.command$;
    }

    get errorMessage$() {
        return this.errorMessageContent$;
    }

    parse(message: string, from: string): CommandType | undefined {
        if (!message) {
            return;
        }
        if (!this.isCommand(message)) {
            return;
        }

        const commandContent = message.split(' ').filter(Boolean);
        const commandType = commandContent[0] as CommandType;

        if (!this.isCommandTypeValid(commandType)) {
            const errorContent = commandType + ' est une entrée invalide';
            this.sendErrorMessage(errorContent);
            return;
        }
        let commandArguments = commandContent.slice(1, commandContent.length);
        if (commandType === CommandType.Place) {
            if (!this.isPlaceLetterArgValid(commandArguments)) {
                return;
            }
            commandArguments = this.stringToPlaceLetterArguments(commandArguments);
        }
        if (commandType === CommandType.Exchange) {
            if (!this.isExchangeLetterArgr(commandArguments[0])) {
                return;
            }
        }
        const command = this.createCommand(from, commandArguments, commandType);
        this.sendCommand(command);
        return commandType;
    }

    private isCommand(message: string) {
        return message[0] === '!';
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

    private isPlaceLetterArgValid(commandArguments: string[]): boolean {
        if (!this.isCommandPlaceLetterValid(commandArguments)) {
            return false;
        }

        if (!this.isPlaceLetterParameterValid(commandArguments)) {
            return false;
        }
        return true;
    }

    private isExchangeLetterArgr(word: string): boolean {
        if (!word || INVALID_EXCHANGE_LETTER.test(word)) {
            this.sendErrorMessage('les paramètres sont invalides');
            return false;
        }
        if (word.length > RACK_LETTER_COUNT) {
            this.sendErrorMessage('Commande impossible à réaliser: un maximum de 7 lettres peuvent être échangé');
            return false;
        }
        return true;
    }

    private isCommandTypeValid(commandType: CommandType): boolean {
        return Object.values(CommandType).includes(commandType);
    }

    private isPlaceLetterParameterValid(command: string[]): boolean {
        const placeLetterParameters: PlaceLetterParameters = this.stringToPlaceLetterFormat(command);

        if (!this.isValidRow(placeLetterParameters.row)) {
            this.sendErrorMessage(SYNTAX_ERROR + ': ligne invalide');
            return false;
        }
        if (!this.isValidColumn(placeLetterParameters.col)) {
            this.sendErrorMessage(SYNTAX_ERROR + ': colonne invalide');
            return false;
        }
        if (!this.isValidDirection(placeLetterParameters.direction)) {
            this.sendErrorMessage(SYNTAX_ERROR + ': direction invalide');
            return false;
        }
        if (!this.isValidWord(placeLetterParameters.word)) {
            this.sendErrorMessage(SYNTAX_ERROR + ': mot invalide');
            return false;
        }
        return true;
    }

    private isCommandPlaceLetterValid(commandArguments: string[]) {
        if (commandArguments.length < 2) {
            this.sendErrorMessage(SYNTAX_ERROR + ': mot ou emplacement manquant');
            return false;
        }

        if (commandArguments.length > 2) {
            this.sendErrorMessage(SYNTAX_ERROR + ': trop de paramètres entrés');
            return false;
        }

        const parametersPlaceLetter = commandArguments[0];
        if (parametersPlaceLetter.length < MIN_PLACE_LETTER_ARG_SIZE || parametersPlaceLetter.length > MAX_PLACE_LETTER_ARG_SIZE) {
            this.sendErrorMessage(SYNTAX_ERROR + ': les paramètres sont invalides');
            return false;
        }

        const columnValue =
            parametersPlaceLetter.length === MIN_PLACE_LETTER_ARG_SIZE ? parametersPlaceLetter.slice(1, 2) : parametersPlaceLetter.slice(1, 3);
        if (!this.isNumeric(columnValue)) {
            this.sendErrorMessage(SYNTAX_ERROR + ': colonne invalide');
            return false;
        }
        return true;
    }

    private isValidRow(row: string): boolean {
        return row <= 'o' && row >= 'a';
    }

    private isValidColumn(columns: number): boolean {
        return columns <= BOARD_DIMENSION && columns >= MIN_BOARD_VALUE;
    }

    private isValidDirection(direction: string): boolean {
        if (!isStringALowerCaseLetter(direction)) {
            return false;
        }
        return Object.values(Direction).includes(direction.toUpperCase() as Direction);
    }

    private isValidWord(word: string): boolean {
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
        return new RegExp('^[0-9]+$').test(value);
    }

    private stringToPlaceLetterFormat(command: string[]): PlaceLetterParameters {
        const parameters = this.stringToPlaceLetterArguments(command);
        return { row: parameters[0], col: Number(parameters[1]), direction: parameters[2], word: parameters[3] };
    }

    private stringToPlaceLetterArguments(command: string[]): string[] {
        const row = command[0].slice(0, 1);
        const col = command[0].length === MIN_PLACE_LETTER_ARG_SIZE ? command[0].slice(1, 2) : command[0].slice(1, 3);
        const direction =
            command[0].length === MIN_PLACE_LETTER_ARG_SIZE ? command[0].slice(2, command[0].length) : command[0].slice(3, command[0].length);
        const word = command[1].normalize('NFD').replace(/\p{Diacritic}/gu, '');
        return [row, col, direction, word];
    }
}
