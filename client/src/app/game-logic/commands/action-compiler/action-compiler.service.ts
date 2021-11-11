import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { ActionCreatorService } from '@app/game-logic/actions/action-creator/action-creator.service';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { Command, CommandType } from '@app/game-logic/commands/command.interface';
import { Direction } from '@app/game-logic/direction.enum';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { PlacementSetting } from '@app/game-logic/interfaces/placement-setting.interface';
import { Player } from '@app/game-logic/player/player';
import { User } from '@app/game-logic/player/user';

@Injectable({
    providedIn: 'root',
})
export class ActionCompilerService {
    private letterFactory: LetterCreator = new LetterCreator();

    constructor(private gameInfo: GameInfoService, private actionFactory: ActionCreatorService) {}

    translate(command: Command): Action {
        const user = this.findPlayer(command.from);
        const args = command.args;
        switch (command.type) {
            case CommandType.Exchange:
                return this.createExchangeAction(user, args);

            case CommandType.Pass:
                return this.createPassTurnAction(user);

            case CommandType.Place:
                return this.createPlaceLetterAction(user, args);
            default:
                throw Error('this command dont generate an action');
        }
    }

    private createPassTurnAction(user: User): PassTurn {
        return this.actionFactory.createPassTurn(user);
    }

    private createExchangeAction(user: User, args: string[] | undefined): ExchangeLetter {
        if (!args) {
            throw new Error('No argument was given for exchange letter creation');
        }
        const letters = args[0].split('');
        const lettersToExchange: Letter[] = this.letterFactory.createLetters(letters);
        return this.actionFactory.createExchange(user, lettersToExchange);
    }

    private createPlaceLetterAction(user: User, args: string[] | undefined) {
        if (!args) {
            throw Error('No argument was given for place letter creation');
        }
        const PLACE_LETTER_ARGS_LENGTH = 4;
        if (args.length !== PLACE_LETTER_ARGS_LENGTH) {
            throw Error('Invalid number of arguments');
        }
        const placementArguments = args.slice(0, args.length - 1);
        const placementSettings = this.createPlacementSettings(placementArguments);
        const word = args[args.length - 1];
        return this.actionFactory.createPlaceLetter(user, word, placementSettings);
    }

    private createPlacementSettings(placementArgs: string[]): PlacementSetting {
        const xString = placementArgs[1];
        const x = Number.parseInt(xString, 10) - 1;
        const y = placementArgs[0].charCodeAt(0) - 'a'.charCodeAt(0);
        const direction = placementArgs[2].toUpperCase() as Direction;
        return { x, y, direction };
    }

    private findPlayer(name: string): Player {
        const players = this.gameInfo.players;
        for (const player of players) {
            if (player.name === name) {
                return player;
            }
        }
        throw Error(`${name} not found in players`);
    }
}
