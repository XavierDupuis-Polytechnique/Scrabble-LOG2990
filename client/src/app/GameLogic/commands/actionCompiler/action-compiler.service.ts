import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Command, CommandType } from '@app/GameLogic/commands/command.interface';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { User } from '@app/GameLogic/player/user';

@Injectable({
    providedIn: 'root',
})
export class ActionCompilerService {
    // TODO: use player service to feed new action and get user
    translate(command: Command): Action {
        if (!command) {
            throw Error('undefined command was feeded into CommandTranslatorService');
        }
        return this.createAction(command);
    }

    private createAction(command: Command): Action {
        // TODO: get user from player service
        const user = new User('remove it');
        const args = command.args;
        switch (command.type) {
            case CommandType.Exchange:
                return this.createExchangeLetter(user, args);

            case CommandType.Pass:
                return this.createPassTurn(user);

            case CommandType.Place:
                return this.createPlaceLetter(user, args); // TODO: uncomment
            default:
                throw Error('this command dont generate an action');
        }
    }

    private createPassTurn(user: User): PassTurn {
        return new PassTurn(user);
    }

    private createExchangeLetter(user: User, letters: string[] | undefined): ExchangeLetter {
        // TODO: user.getLettersFromRack(letters);
        if (!letters) {
            throw new Error('No argument was given for exchange letter creation');
        }
        const lettersToExchange: Letter[] = [];
        return new ExchangeLetter(user, lettersToExchange);
    }

    private createPlaceLetter(user: User, args: string[] | undefined) {
        // TODO: implement createPlaceLetter
        if (!args) {
            throw new Error('No argument was given for place letter creation');
        }
        return new PlaceLetter(user, [], { x: 0, y: 0, direction: 'up' });
    }
}
