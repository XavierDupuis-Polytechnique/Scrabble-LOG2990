import { Injectable } from '@angular/core';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { User } from '@app/GameLogic/player/user';
import { Command, CommandType } from '../command.interface';

@Injectable({
    providedIn: 'root',
})
export class CommandTranslatorService {
    // TODO: use player service to feed new action and get user
    translate(command: Command): Action {
        if (!command) {
            throw Error('unefined command was feeded into CommandTranslatorService');
        }
    }

    private createAction(command: Command): Action {
        const user = new User('remove it');
        switch (command.type) {
            case CommandType.Exchange:
                // TODO: find lettersToExchange
                const exchangeAction = new ExchangeLetter(user, command.args);
                return exchangeAction;

            case CommandType.Pass:
                const passAction = new PassTurn(user);
                return passAction;

            case CommandType.Place:
                const placeAction = new PlaceLetter(user);
                return placeAction;
        }
    }
}
