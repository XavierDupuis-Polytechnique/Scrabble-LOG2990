import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { Action } from './action';
import { ExchangeLetter } from './exchange-letter';
import { PassTurn } from './pass-turn';
import { PlaceLetter } from './place-letter';

@Injectable({
    providedIn: 'root',
})
export class ActionValidatorService {
    // constructor() {}

    validateAction(action: Action, game: Game) {
        console.log('action', action);
        switch (typeof action) {
            case typeof PlaceLetter:
                this.validatePlaceLetter(action, game);
                break;
            case typeof ExchangeLetter:
                this.validateExchangeLetter(action, game);
                break;
            case typeof PassTurn:
                this.validatePassTurn(action, game);
                break;
            default:
                throw new Error("Action couldn't be parsed");
        }
    }
    validatePlaceLetter(action: Action, game: Game) {
        const castAction = <PlaceLetter>action;
        console.log(castAction.player);
        throw new Error('Method not implemented.');
    }
    validateExchangeLetter(action: Action, game: Game) {
        const castAction = <ExchangeLetter>action;
        console.log(castAction.player);
        throw new Error('Method not implemented.');
    }
    validatePassTurn(action: Action, game: Game) {
        const castAction = <PassTurn>action;
        console.log(castAction.player);
        throw new Error('Method not implemented.');
    }
}
