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

    validateTurn(action: Action, game: Game): boolean {
        console.log(game.getActivePlayer() === action.player);
        return game.getActivePlayer() === action.player;
    }
    validateAction(action: Action, game: Game) {
        if (this.validateTurn(action, game)) {
            switch (true) {
                case action instanceof PlaceLetter:
                    this.validatePlaceLetter(action, game);
                    break;
                case action instanceof ExchangeLetter:
                    this.validateExchangeLetter(action, game);
                    break;
                case action instanceof PassTurn:
                    this.validatePassTurn(action, game);
                    break;
                case action instanceof Action:
                default:
                    throw new Error("Action couldn't be parsed");
            }
        }
    }
    validatePlaceLetter(action: Action, game: Game) {
        const castAction = action as PlaceLetter;
        console.log(castAction.player);
    }
    validateExchangeLetter(action: Action, game: Game) {
        const castAction = action as ExchangeLetter;
        console.log(castAction.player);
    }
    validatePassTurn(action: Action, game: Game) {
        const castAction = action as PassTurn;
        const player = castAction.player;
        // player.nextAction = action;
        console.log('PassTurn for ', player.name, ' was validated');
        this.sendValidAction(action);
    }
    sendValidAction(action: Action) {
        action.player.action$.next(action);
    }
}
