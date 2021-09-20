import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { NUM_TILES } from '@app/GameLogic/game/board';
import { Game } from '@app/GameLogic/game/games/game';
import { Letter } from '@app/GameLogic/game/letter.interface';

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
            // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Error : Action demandé par ', action.player.name, " pendant le tour d'un autre joueur");
        }
        return valid;
    }

    private validateTurn(action: Action, game: Game): boolean {
        return game.getActivePlayer() === action.player;
    }
    private validatePlaceLetter(action: PlaceLetter, game: Game): boolean {
        if (!this.hasLettersInRack(action.player.letterRack, action.lettersToPlace)) {
            // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Erreur : Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées');
            return false;
        }

        const centerTilePosition: number = Math.floor(NUM_TILES / 2);
        let hasCenterTile = game.board.grid[centerTilePosition][centerTilePosition].letterObject.char !== ' ';

        let x = action.placement.x;
        let y = action.placement.y;
        let currentTile = game.board.grid[x][y];
        let numberOfLetterToPlace = action.lettersToPlace.length;
        while (numberOfLetterToPlace > 0) {
            if (x >= NUM_TILES || y >= NUM_TILES) {
                // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
                console.log('Erreur : Commande impossible à réaliser : Implique le déboardement de la grille en ', '(x : ', x, ', y : ', y, ')');
                return false;
            }

            if (currentTile.letterObject.char === ' ') {
                numberOfLetterToPlace--;
            }

            if (!hasCenterTile) {
                if (x === centerTilePosition && y === centerTilePosition) {
                    hasCenterTile = true;
                }
            }

            currentTile = action.placement.direction.charAt(0).toLowerCase() === 'v' ? game.board.grid[x][y++] : game.board.grid[x++][y];
        }
        // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
        // console.log(action.player.name, ' PLACE des lettres');
        if (hasCenterTile) {
            this.sendValidAction(action);
            return true;
        }
        // return false;
        return hasCenterTile;
    }
    private validateExchangeLetter(action: ExchangeLetter, game: Game): boolean {
        if (!this.hasLettersInRack(action.player.letterRack, action.lettersToExchange)) {
            // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Erreur : Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées');
            return false;
        }

        if (action.lettersToExchange.length > game.letterBag.gameLetters.length) {
            // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
            console.log('Erreur : Commande impossible à réaliser : La réserve ne contient pas assez de lettres');
            return false;
        }
        console.log(action.player.name, ' ÉCHANGE des lettres');
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
        // TODO : MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
        console.log(action.player.name, ' PASSE son tour');
        this.sendValidAction(action);
        return true;
    }
    private sendValidAction(action: Action) {
        // TODO: change with player service;
        action.player.action$.next(action);
    }
}
