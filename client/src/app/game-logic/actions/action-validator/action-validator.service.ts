import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { ExchangeLetter } from '@app/game-logic/actions/exchange-letter';
import { PassTurn } from '@app/game-logic/actions/pass-turn';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { BOARD_DIMENSION, BOARD_MAX_POSITION, EMPTY_CHAR, JOKER_CHAR, RACK_LETTER_COUNT } from '@app/game-logic/constants';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Letter } from '@app/game-logic/game/board/letter.interface';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { HardBot } from '@app/game-logic/player/bot/hard-bot';
import { placementSettingsToString } from '@app/game-logic/utils';

@Injectable({
    providedIn: 'root',
})
export class ActionValidatorService {
    constructor(private boardService: BoardService, private gameInfo: GameInfoService, private messageService: MessagesService) {}
    sendAction(action: Action) {
        const isActionValid = this.validateAction(action);
        if (!isActionValid) {
            return;
        }
        this.sendActionArgsMessage(action);
        const player = action.player;
        player.play(action);
    }

    private sendActionArgsMessage(action: Action) {
        if (action instanceof PlaceLetter) {
            this.sendPlaceLetterMessage(action);
        }

        if (action instanceof ExchangeLetter) {
            this.sendExchangeLetterMessage(action);
        }

        if (action instanceof PassTurn) {
            this.sendPassTurnMessage(action);
        }
    }

    private validateAction(action: Action): boolean {
        if (!this.validateTurn(action)) {
            this.sendErrorMessage('Action demandé par ' + action.player.name + " pendant le tour d'un autre joueur");
            return false;
        }

        if (action instanceof PlaceLetter) {
            return this.validatePlaceLetter(action as PlaceLetter);
        }

        if (action instanceof ExchangeLetter) {
            return this.validateExchangeLetter(action as ExchangeLetter);
        }

        if (action instanceof PassTurn) {
            return this.validatePassTurn();
        }

        this.sendErrorMessage("Commande impossible à réaliser : le type d'action n'est pas  reconnu");
        return false;
    }

    private validateTurn(action: Action): boolean {
        return this.gameInfo.activePlayer === action.player;
    }

    private validatePlaceLetter(action: PlaceLetter): boolean {
        if (!this.validatePlacementWithBoard(action)) {
            return false;
        }

        const centerTilePosition: number = Math.floor(BOARD_DIMENSION / 2);
        const hasCenterTile = this.boardService.board.grid[centerTilePosition][centerTilePosition].letterObject.char !== EMPTY_CHAR;
        const shouldCheckForNeighbors = hasCenterTile;
        return this.checkPlaceLetterBoardRequirement(action, shouldCheckForNeighbors);
    }

    private validatePlacementWithBoard(action: PlaceLetter) {
        return this.validateBoardsLimits(action) && this.validateLettersCanBePlaced(action);
    }

    private validateLettersCanBePlaced(action: PlaceLetter) {
        let x = action.placement.x;
        let y = action.placement.y;
        let lettersNeeded = '';

        for (let letterIndex = 0; letterIndex < action.word.length; letterIndex++) {
            const currentTileChar = this.boardService.board.grid[y][x].letterObject.char.toLowerCase();
            const wordCurrentChar = action.word.charAt(letterIndex);
            if (currentTileChar === EMPTY_CHAR) {
                lettersNeeded = lettersNeeded.concat(wordCurrentChar);
            } else {
                if (wordCurrentChar.toLowerCase() !== currentTileChar) {
                    this.sendErrorMessage(
                        `Commande impossible à réaliser : La lettre 
                        ${wordCurrentChar} 
                        ne peut être placé en
                        ${String.fromCharCode(y + 'A'.charCodeAt(0))}
                        ${++x}`,
                    );
                    return false;
                }
            }
            if (action.placement.direction.charAt(0).toUpperCase() === Direction.Vertical) {
                y++;
            } else {
                x++;
            }
        }
        if (!this.hasLettersInRack(action.player.letterRack, lettersNeeded)) {
            let message = 'Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées.';
            if (this.hasAJoker(action.player.letterRack)) {
                message = message.concat(
                    ' Vous avez au moins une lettre blanche (*). Utilisez une lettre Majuscule pour la représenter dans votre mot.',
                );
            }
            this.sendErrorMessage(message);
            return false;
        }
        return true;
    }

    private validateBoardsLimits(action: PlaceLetter): boolean {
        if (action.placement.y < 0 || action.placement.x < 0) {
            return false;
        }
        let concernedAxisValue;
        if (action.placement.direction.charAt(0).toUpperCase() === Direction.Vertical) {
            concernedAxisValue = action.placement.y;
        } else {
            concernedAxisValue = action.placement.x;
        }
        const lastLetterPosition = concernedAxisValue + action.word.length - 1;
        const doesLastPositionOverflow = lastLetterPosition > BOARD_MAX_POSITION;
        if (doesLastPositionOverflow) {
            this.sendErrorMessage('Commande impossible à réaliser : Les lettres déboderont de la grille');
            return false;
        }
        return true;
    }

    private checkPlaceLetterBoardRequirement(action: PlaceLetter, shouldCheckForNeighbors: boolean): boolean {
        const centerTilePosition: number = Math.floor(BOARD_DIMENSION / 2);
        let isFillingPlacementCondition = false;
        let x = action.placement.x;
        let y = action.placement.y;
        let index = 0;
        while (index++ < action.word.length) {
            if (shouldCheckForNeighbors) {
                isFillingPlacementCondition = this.boardService.board.hasNeighbour(x, y);
            } else {
                isFillingPlacementCondition = x === centerTilePosition && y === centerTilePosition;
            }

            if (isFillingPlacementCondition) {
                return true;
            }

            if (action.placement.direction.charAt(0).toUpperCase() === Direction.Vertical) {
                y++;
            } else {
                x++;
            }
        }

        if (this.boardService.board.grid[centerTilePosition][centerTilePosition].letterObject.char === EMPTY_CHAR) {
            this.sendErrorMessage("Commande impossible à réaliser : Aucun mot n'est pas placé sur la tuile centrale");
        } else {
            this.sendErrorMessage("Commande impossible à réaliser : Le mot placé n'est pas adjacent à un autre mot");
        }

        return false;
    }

    // private validateFirstPlaceLetter(action: PlaceLetter): boolean {
    //     const centerTilePosition: number = Math.floor(BOARD_DIMENSION / 2);
    //     let x = action.placement.x;
    //     let y = action.placement.y;
    //     let index = 0;
    //     while (index++ < action.word.length) {
    //         if (x === centerTilePosition && y === centerTilePosition) {
    //             return true;
    //         }
    //         if (action.placement.direction.charAt(0).toUpperCase() === Direction.Vertical) {
    //             y++;
    //         } else {
    //             x++;
    //         }
    //     }
    //     this.sendErrorMessage("Commande impossible à réaliser : Aucun mot n'est pas placé sur la tuile centrale");
    //     return false;
    // }

    private validateExchangeLetter(action: ExchangeLetter): boolean {
        if (action.player instanceof HardBot && this.gameInfo.numberOfLettersRemaining >= action.lettersToExchange.length) {
            return true;
        }

        if (this.gameInfo.numberOfLettersRemaining < RACK_LETTER_COUNT) {
            this.sendErrorMessage(
                'Commande impossible à réaliser : Aucun échange de lettres lorsque la réserve en contient moins de ' + RACK_LETTER_COUNT,
            );
            return false;
        }

        let actionLetters = '';
        for (const letter of action.lettersToExchange) {
            actionLetters += letter.char.toLowerCase();
        }

        if (!this.hasLettersInRack(action.player.letterRack, actionLetters)) {
            this.sendErrorMessage('Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées');
            return false;
        }
        return true;
    }

    private validatePassTurn() {
        return true;
    }

    private hasLettersInRack(rackLetters: Letter[], actionLetters: string): boolean {
        const rackChars = rackLetters.map((value) => value.char);
        const actionChars: string[] = actionLetters.split('');

        const rackCharsOccurences = new Map<string, number>();
        for (const char of rackChars) {
            const lowerChar = char.toLowerCase();
            let occurence = rackCharsOccurences.get(lowerChar);
            if (occurence) {
                occurence++;
                rackCharsOccurences.set(lowerChar, occurence);
            } else {
                rackCharsOccurences.set(lowerChar, 1);
            }
        }

        for (let char of actionChars) {
            let occurence = rackCharsOccurences.get(char);
            if (occurence === undefined || occurence === 0) {
                if (char.toUpperCase() === char) {
                    occurence = rackCharsOccurences.get(JOKER_CHAR);
                    char = JOKER_CHAR;
                    if (occurence === undefined || occurence === 0) {
                        return false;
                    }
                } else {
                    return false;
                }
            }
            occurence--;
            rackCharsOccurences.set(char, occurence);
        }
        return true;
    }

    private hasAJoker(letterRack: Letter[]): boolean {
        for (const letter of letterRack) {
            if (letter.char === JOKER_CHAR) {
                return true;
            }
        }
        return false;
    }

    private sendPlaceLetterMessage(action: PlaceLetter) {
        const playerName = action.player.name;
        const placementSettings = action.placement;
        const placementString = placementSettingsToString(placementSettings);
        const word = action.word;
        const content = `${playerName} place le mot ${word} en ${placementString}`;
        this.sendSystemMessage(content);
    }

    private sendExchangeLetterMessage(action: ExchangeLetter) {
        const letters = action.lettersToExchange;
        const playerName = action.player.name;
        const userName = this.gameInfo.user.name;
        if (playerName !== userName) {
            const nLetters = letters.length;
            const playerMessageContent = `${playerName} échange ${nLetters} lettres`;
            this.sendSystemMessage(playerMessageContent);
            return;
        }
        const chars = letters.map((letter) => letter.char);
        const userMessageContent = `${userName} échange les lettres ${chars}`;
        this.sendSystemMessage(userMessageContent);
    }

    private sendPassTurnMessage(action: PassTurn) {
        const playerName = action.player.name;
        const content = `${playerName} passe son tour`;
        this.sendSystemMessage(content);
    }

    private sendErrorMessage(content: string) {
        this.messageService.receiveErrorMessage(content);
    }

    private sendSystemMessage(content: string) {
        this.messageService.receiveSystemMessage(content);
    }
}
