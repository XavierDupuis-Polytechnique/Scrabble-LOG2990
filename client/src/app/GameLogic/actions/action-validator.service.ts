import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '../game/letter.interface';
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
        return game.getActivePlayer() === action.player;
    }
    validateAction(action: Action, game: Game) {
        if (this.validateTurn(action, game)) {
            switch (true) {
                case action instanceof PlaceLetter:
                    this.validatePlaceLetter(action as PlaceLetter, game);
                    break;
                case action instanceof ExchangeLetter:
                    this.validateExchangeLetter(action as ExchangeLetter, game);
                    break;
                case action instanceof PassTurn:
                    this.validatePassTurn(action as PassTurn, game);
                    break;
                case action instanceof Action:
                default:
                    throw new Error("Action couldn't be parsed");
            }
        } else {
            console.log('Error : Action performed by ', action.player.name, ' was not during its turn');
        }
    }
    validatePlaceLetter(action: PlaceLetter, game: Game) {
        const castAction = action as PlaceLetter;
        castAction.id;
    }
    validateExchangeLetter(action: ExchangeLetter, game: Game) {
        const castAction = action as ExchangeLetter;

        const exchangeLetters = new Set<Letter>(castAction.lettersToExchange);
        const rackLetters = new Set<Letter>(castAction.player.letterRack);

        for (const letter of exchangeLetters) {
            if (!rackLetters.has(letter)) {
                // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
                console.log('Invalid exchange : not all letters in letterRack');
                return;
            }
        }

        if (castAction.lettersToExchange.length > game.letterBag.gameLetters.length) {
            // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Invalid exchange : not enough letters in LetterBag');
            return;
        }

        console.log('Valid exchange');
        this.sendValidAction(action);
    }
    validatePassTurn(action: PassTurn, game: Game) {
        // const castAction = action as PassTurn;
        const player = action.player;
        // player.nextAction = action;
        console.log('PassTurn for ', player.name, ' was validated');
        this.sendValidAction(action);
    }
    sendValidAction(action: Action) {
        // TODO: change with player service;
        action.player.action$.next(action);
    }
}
