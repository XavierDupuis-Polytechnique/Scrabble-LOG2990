import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { Tile } from '@app/GameLogic/game/tile';
import { BoardService } from '@app/services/board.service';
import { Direction } from '../actions/direction.enum';
import { Player } from '../player/player';

const MAX_LETTER_IN_RACK = 7;
const BONUS = 50;
@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    // ON feed la liste des mots ecrits
    placeLetterPointsCalculation(action: PlaceLetter, wordList: Tile[][], boardService: BoardService): number {
        let totalPointsOfTurn = 0;
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(action, word);
        });
        this.desactivateMultiplicators(action, boardService);

        if (action.affectedCoords.length >= MAX_LETTER_IN_RACK) {
            totalPointsOfTurn += BONUS;
        }
        action.player.points += totalPointsOfTurn;
        return totalPointsOfTurn;
    }

    endOfGamePointdeduction(game: Game): void {
        const activePlayer = game.getActivePlayer();
        if (game.consecutivePass >= Game.maxConsecutivePass) {
            for (const player of game.players) {
                player.points -= this.calculatePointsOfRack(player);
            }
            return;
        }
        for (const player of game.players) {
            if (activePlayer !== player) {
                activePlayer.points += this.calculatePointsOfRack(player);
                player.points -= this.calculatePointsOfRack(player);
            }
        }
    }
    testPlaceLetterPointsCalculation(action: PlaceLetter, wordList: Tile[][], boardService: BoardService) {
        let totalPointsOfTurn = 0;
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(action, word);
        });
        if (action.player.isLetterRackEmpty && action.lettersToRemoveInRack.length >= MAX_LETTER_IN_RACK) {
            totalPointsOfTurn += BONUS;
        }
        action.player.points += totalPointsOfTurn;
        return totalPointsOfTurn;
    }
    calculatePointsOfWord(action: PlaceLetter, word: Tile[]): number {
        let sumOfWord = 0;
        let totalWordMultiplicator = 1;

        const lettersInWord = new Set(word);
        lettersInWord.forEach((letter) => {
            sumOfWord += letter.letterObject.value * letter.letterMultiplicator;
            totalWordMultiplicator *= letter.wordMultiplicator;


        });
        sumOfWord *= totalWordMultiplicator;
        return sumOfWord;
    }

    calculatePointsOfRack(player: Player): number {
        let sumOfRack = 0;
        const letterRack = new Set(player.letterRack);
        for (const letter of letterRack) {
            sumOfRack += letter.value;
        }
        return sumOfRack;
    }

    tileToString(word: Tile[]): string {
        let wordTemp = '';
        word.forEach((tile) => {
            wordTemp = wordTemp.concat(tile.letterObject.char.valueOf());
        });
        return wordTemp;
    }
    // wordPlaced(action: PlaceLetter): Tile[] {
    //     const wordInTile: Tile[] = [];
    //     const startX = action.placement.x;
    //     const startY = action.placement.y;
    //     for (let wordIndex = 0; wordIndex < action.word.length; wordIndex++) {
    //         let x = 0;
    //         let y = 0;
    //         if (action.placement.direction === Direction.Horizontal) {
    //             x = startX + wordIndex;
    //             wordInTile.push(this.board.grid[y][x]);
    //         } else if (action.placement.direction === Direction.Horizontal) {
    //             y = startY + wordIndex;
    //             wordInTile.push(this.board.grid[y][x]);
    //         }

    //     }
    //     return wordInTile;
    // }

    desactivateMultiplicators(action: PlaceLetter, boardService: BoardService): void {
        let coord: Vec2 = { x: action.placement.x, y: action.placement.y };
        for (let i = 0; i < action.word.length; i++) {
            boardService.board.grid[coord.y][coord.x].letterMultiplicator = 1;
            boardService.board.grid[coord.y][coord.x].wordMultiplicator = 1;

            if (action.placement.direction === Direction.Horizontal) {
                coord.x++;
            } else {
                coord.y++;
            }
        }

    }

}
