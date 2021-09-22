import { Injectable } from '@angular/core';
import { Action } from '@app/GameLogic/actions/action';
import { ExchangeLetter } from '@app/GameLogic/actions/exchange-letter';
import { PassTurn } from '@app/GameLogic/actions/pass-turn';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
// import { NUM_TILES } from '@app/GameLogic/game/board';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Letter } from '@app/GameLogic/game/letter.interface';
import { MessagesService } from '@app/GameLogic/messages/messages.service';
import { BoardService } from '@app/services/board.service';

// TODO: put throw error
@Injectable({
    providedIn: 'root',
})
export class ActionValidatorService {
    constructor(private board: BoardService, private gameInfo: GameInfoService, private messageService: MessagesService) {}
    sendAction(action: Action) {
        const actionValid = this.validateAction(action);
        if (actionValid) {
            const player = action.player;
            player.play(action);
        }
    }

    sendErrorMessage(content: string) {
        this.messageService.receiveErrorMessage(content);
    }

    private validateAction(action: Action): boolean {
        if (this.validateTurn(action)) {
            if (action instanceof PlaceLetter) {
                return this.validatePlaceLetter(action as PlaceLetter);
            }

            if (action instanceof ExchangeLetter) {
                return this.validateExchangeLetter(action as ExchangeLetter);
            }

            if (action instanceof PassTurn) {
                return this.validatePassTurn(action as PassTurn);
            }

            throw Error("Action couldn't be validated");
        }
        const content = 'Erreur : Action demandé par ' + action.player.name + " pendant le tour d'un autre joueur";
        this.sendErrorMessage(content);
        return false;
    }

    private validateTurn(action: Action): boolean {
        return this.gameInfo.activePlayer === action.player;
    }

    private validatePlaceLetter(action: PlaceLetter): boolean {
        // TODO: uncomment
        if (this.board.board.grid) {
            return true;
        }
        return true;
        // if (!this.hasLettersInRack(action.player.letterRack, action.lettersToPlace)) {
        //     // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
        //     this.sendErrorMessage('Invalid exchange : not all letters in letterRack');
        // }

        // const centerTilePosition: number = Math.floor(NUM_TILES / 2);
        // const board = this.board.board;
        // let hasCenterTile = board.grid[centerTilePosition][centerTilePosition].letterObject.char !== ' ';

        // let x = action.placement.x;
        // let y = action.placement.y;
        // let currentTile = board.grid[x][y];
        // let numberOfLetterToPlace = action.lettersToPlace.length;
        // while (numberOfLetterToPlace > 0) {
        //     if (x >= NUM_TILES || y >= NUM_TILES) {
        //         // MESSAGE À LA BOITE DE COMMUNICATION DOIT REMPLACER LE CSL SUIVANT
        //         throw Error('Invalid exchange : letters will overflow the grid');
        //     }

        //     if (currentTile.letterObject.char === ' ') {
        //         numberOfLetterToPlace--;
        //     }

        //     if (!hasCenterTile) {
        //         if (x === centerTilePosition && y === centerTilePosition) {
        //             hasCenterTile = true;
        //         }
        //     }

        //     currentTile = action.placement.direction.charAt(0).toLowerCase() === 'v' ? board.grid[x][y++] : board.grid[x++][y];
        // }
        // return hasCenterTile;
    }

    private validateExchangeLetter(action: ExchangeLetter): boolean {
        if (!this.hasLettersInRack(action.player.letterRack, action.lettersToExchange)) {
            this.sendErrorMessage('Erreur : Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées');
            return false;
        }

        if (action.lettersToExchange.length > this.gameInfo.numberOfLettersRemaining) {
            this.sendErrorMessage('Erreur : Commande impossible à réaliser : La réserve ne contient pas assez de lettres');
            return false;
        }
        this.messageService.receiveSystemMessage(action.player.name + ' ÉCHANGE des lettres');
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

    private validatePassTurn(action: PassTurn) {
        this.messageService.receiveSystemMessage(action.player.name + ' PASSE son tour');
        return true;
    }
}
