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
import { isStringALowerCaseLetter, placementSettingsToString } from '@app/game-logic/utils';

@Injectable({
    providedIn: 'root',
})
export class ActionValidatorService {
    constructor(private boardService: BoardService, private gameInfo: GameInfoService, private messageService: MessagesService) {}

    sendAction(action: Action) {
        const isActionValid = this.checkAction(action);
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

    private checkAction(action: Action): boolean {
        if (!this.checkTurn(action)) {
            this.sendErrorMessage('Action demandé par ' + action.player.name + " pendant le tour d'un autre joueur");
            return false;
        }

        if (action instanceof PlaceLetter) {
            return this.checkPlaceLetter(action as PlaceLetter);
        }

        if (action instanceof ExchangeLetter) {
            return this.checkExchangeLetter(action as ExchangeLetter);
        }

        if (action instanceof PassTurn) {
            return this.checkPassTurn();
        }

        this.sendErrorMessage("Commande impossible à réaliser : le type d'action n'est pas  reconnu");
        return false;
    }

    private checkTurn(action: Action): boolean {
        return this.gameInfo.activePlayer === action.player;
    }

    private checkPlaceLetter(action: PlaceLetter): boolean {
        if (!this.checkPlacementWithBoard(action)) {
            return false;
        }

        const centerTilePosition: number = Math.floor(BOARD_DIMENSION / 2);
        const hasCenterTile = this.boardService.board.grid[centerTilePosition][centerTilePosition].letterObject.char !== EMPTY_CHAR;
        const shouldCheckForNeighbors = hasCenterTile;
        return this.checkPlaceLetterBoardRequirement(action, shouldCheckForNeighbors);
    }

    private checkPlacementWithBoard(action: PlaceLetter) {
        return this.checkBoardsLimits(action) && this.checkLettersCanBePlaced(action);
    }

    private checkLettersCanBePlaced(action: PlaceLetter) {
        let x = action.placement.x;
        let y = action.placement.y;
        const direction = action.placement.direction;
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
            [x, y] = direction.toUpperCase() === Direction.Vertical ? [x, y + 1] : [x + 1, y];
        }
        if (this.hasLettersInRack(action.player.letterRack, lettersNeeded)) {
            return true;
        }
        let message = 'Commande impossible à réaliser : Le joueur ne possède pas toutes les lettres concernées.';
        if (this.hasAJoker(action.player.letterRack)) {
            message = message.concat(' Vous avez au moins une lettre blanche (*). Utilisez une lettre Majuscule pour la représenter dans votre mot.');
        }
        this.sendErrorMessage(message);
        return false;
    }

    private checkBoardsLimits(action: PlaceLetter): boolean {
        const coords = { x: action.placement.x, y: action.placement.y };
        if (coords.y < 0 || coords.x < 0) {
            return false;
        }
        const direction = action.placement.direction;
        const word = action.word;
        const startCoord = direction.toUpperCase() === Direction.Vertical ? coords.y : coords.x;
        const lastLetterPosition = startCoord + word.length - 1;
        if (lastLetterPosition > BOARD_MAX_POSITION) {
            this.sendErrorMessage('Commande impossible à réaliser : Les lettres déboderont de la grille');
            return false;
        }
        return true;
    }

    private checkPlaceLetterBoardRequirement(action: PlaceLetter, shouldCheckForNeighbors: boolean): boolean {
        const centerTilePosition: number = Math.floor(BOARD_DIMENSION / 2);
        const direction = action.placement.direction;
        let isFillingPlacementCondition = false;
        let x = action.placement.x;
        let y = action.placement.y;
        let index = 0;
        while (index++ < action.word.length) {
            isFillingPlacementCondition = shouldCheckForNeighbors
                ? this.boardService.board.hasNeighbour(x, y)
                : x === centerTilePosition && y === centerTilePosition;

            if (isFillingPlacementCondition) {
                return true;
            }
            [x, y] = direction.toUpperCase() === Direction.Vertical ? [x, y + 1] : [x + 1, y];
        }
        const centerTile = this.boardService.board.grid[centerTilePosition][centerTilePosition];
        if (centerTile.letterObject.char === EMPTY_CHAR) {
            this.sendErrorMessage("Commande impossible à réaliser : Aucun mot n'est pas placé sur la tuile centrale");
        } else {
            this.sendErrorMessage("Commande impossible à réaliser : Le mot placé n'est pas adjacent à un autre mot");
        }

        return false;
    }

    private checkExchangeLetter(action: ExchangeLetter): boolean {
        const lettersLeft = this.gameInfo.numberOfLettersRemaining;
        if (action.player instanceof HardBot && lettersLeft >= action.lettersToExchange.length) {
            return true;
        }

        if (lettersLeft < RACK_LETTER_COUNT) {
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

    private checkPassTurn() {
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
                continue;
            }
            rackCharsOccurences.set(lowerChar, 1);
        }

        for (const char of actionChars) {
            let occurence = rackCharsOccurences.get(char);
            if (occurence !== undefined && occurence > 0) {
                occurence--;
                rackCharsOccurences.set(char, occurence);
                continue;
            }
            if (isStringALowerCaseLetter(char)) {
                return false;
            }
            let jokerOccurence = rackCharsOccurences.get(JOKER_CHAR);
            if (jokerOccurence === undefined || jokerOccurence === 0) {
                return false;
            }
            jokerOccurence--;
            rackCharsOccurences.set(JOKER_CHAR, jokerOccurence);
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
