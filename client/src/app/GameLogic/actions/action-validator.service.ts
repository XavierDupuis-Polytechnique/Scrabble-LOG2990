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

    validateAction(action: Action, game: Game): boolean {
        let valid = false;
        if (this.validateTurn(action, game)) {
            switch (true) {
                case action instanceof PlaceLetter:
                    valid = this.validatePlaceLetter(action as PlaceLetter, game);
                    break;
                case action instanceof ExchangeLetter:
                    valid = this.validateExchangeLetter(action as ExchangeLetter, game);
                    break;
                case action instanceof PassTurn:
                    valid = this.validatePassTurn(action as PassTurn, game);
                    break;
                case action instanceof Action:
                default:
                    throw new Error("Action couldn't be parsed");
            }
        } else {
            console.log('Error : Action performed by ', action.player.name, ' was not during its turn');
            return false;
        }
        return valid;
    }

    private validateTurn(action: Action, game: Game): boolean {
        return game.getActivePlayer() === action.player;
    }
    private validatePlaceLetter(action: PlaceLetter, game: Game): boolean {
        const castAction = action as PlaceLetter;
        castAction.id;
        return false;
    }
    private validateExchangeLetter(action: ExchangeLetter, game: Game): boolean {
        const castAction = action as ExchangeLetter;

        const exchangeLetters = new Set<Letter>(castAction.lettersToExchange);
        const rackLetters = new Set<Letter>(castAction.player.letterRack);

        for (const letter of exchangeLetters) {
            if (!rackLetters.has(letter)) {
                // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
                console.log('Invalid exchange : not all letters in letterRack');
                return false;
            }
        }

        if (castAction.lettersToExchange.length > game.letterBag.gameLetters.length) {
            // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Invalid exchange : not enough letters in LetterBag');
            return false;
        }

        // console.log('Valid exchange');
        this.sendValidAction(action);
        return true;
    }
    private validatePassTurn(action: PassTurn, game: Game) {
        const player = action.player;
        // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
        console.log('PassTurn for ', player.name, ' was validated');
        this.sendValidAction(action);
        return true;
    }
    private sendValidAction(action: Action) {
        // TODO: change with player service;
        action.player.action$.next(action);
    }
}
