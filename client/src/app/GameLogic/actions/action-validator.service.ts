import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { NUM_TILES } from '../game/board';
import { Letter } from '../game/letter.interface';

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
        }
        return valid;
    }

    private validateTurn(action: Action, game: Game): boolean {
        return game.info.getActivePlayer() === action.player;
    }
    private validatePlaceLetter(action: PlaceLetter, game: Game): boolean {
        if (!this.hasLettersInRack(action.player.letterRack, action.lettersToPlace)) {
            // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Invalid exchange : not all letters in letterRack');
            return false;
        }

        let x = action.placement.x;
        let y = action.placement.y;
        let currentTile = game.board.grid[x][y];
        let numberOfLetterToPlace = action.lettersToPlace.length;
        while (numberOfLetterToPlace > 0) {
            if (x >= NUM_TILES || y >= NUM_TILES) {
                // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
                console.log('Invalid exchange : letters will overflow the grid');
                return false;
            }

            if (currentTile.letterObject.char === ' ') {
                numberOfLetterToPlace--;
            }

            currentTile = action.placement.direction.charAt(0).toLowerCase() === 'v' ? game.board.grid[x][y++] : game.board.grid[x++][y];
        }

        // APPEL AU WORD VALIDATOR POUR VÉRIFIER SI LA COMBINAISON DE LETTRES FORME UN/DES MOTS

        return true;
    }
    private validateExchangeLetter(action: ExchangeLetter, game: Game): boolean {
        if (!this.hasLettersInRack(action.player.letterRack, action.lettersToExchange)) {
            // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Invalid exchange : not all letters in letterRack');
            return false;
        }

        if (action.lettersToExchange.length > game.letterBag.gameLetters.length) {
            // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Invalid exchange : not enough letters in LetterBag');
            return false;
        }

        // console.log('Valid exchange');
        this.sendValidAction(action);
        return true;
    }
    private hasLettersInRack(rackLetters: Letter[], actionLetters: Letter[]): boolean {
        const actionChars: string[] = [];
        actionLetters.forEach((value) => {
            actionChars.push(value.char);
        });

        const rackChars: string[] = [];
        rackLetters.forEach((value) => {
            rackChars.push(value.char);
        });

        let rIndex = 0;
        let aIndex = 0;

        while (actionChars.length > 0) {
            if (actionChars[aIndex] === rackChars[rIndex]) {
                actionChars.splice(aIndex, 1);
                rackChars.splice(rIndex, 1);
                rIndex = 0;
                aIndex = 0;
            } else {
                if (rIndex < rackChars.length) {
                    rIndex++;
                } else {
                    return false;
                }
            }
        }
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
