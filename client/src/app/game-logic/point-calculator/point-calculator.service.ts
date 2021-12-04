import { Injectable } from '@angular/core';
import { PlaceLetter } from '@app/game-logic/actions/place-letter';
import { Direction } from '@app/game-logic/direction.enum';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { Tile } from '@app/game-logic/game/board/tile';
import { OfflineGame } from '@app/game-logic/game/games/offline-game/offline-game';
import { Player } from '@app/game-logic/player/player';

const MAX_LETTER_IN_RACK = 7;
const BONUS = 50;
@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    constructor(private boardService: BoardService) {}

    get grid() {
        return this.boardService.board.grid;
    }

    placeLetterCalculation(action: PlaceLetter, wordList: Tile[][]): number {
        let totalPointsOfTurn = 0;
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(word);
        });
        this.desactivateMultiplicators(action);

        if (action.affectedCoords.length >= MAX_LETTER_IN_RACK) {
            totalPointsOfTurn += BONUS;
        }
        action.player.points += totalPointsOfTurn;
        return totalPointsOfTurn;
    }

    endOfGamePointDeduction(game: OfflineGame): void {
        const activePlayer = game.getActivePlayer();
        if (game.consecutivePass >= OfflineGame.maxConsecutivePass) {
            for (const player of game.players) {
                player.points -= this.calculatePointsOfRack(player);
            }
            return;
        }
        for (const player of game.players) {
            if (activePlayer === player) {
                continue;
            }
            activePlayer.points += this.calculatePointsOfRack(player);
            player.points -= this.calculatePointsOfRack(player);
        }
    }

    private calculatePointsOfWord(word: Tile[]): number {
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

    private calculatePointsOfRack(player: Player): number {
        let sumOfRack = 0;
        const letterRack = player.letterRack;
        for (const letter of letterRack) {
            sumOfRack += letter.value;
        }
        return sumOfRack;
    }

    private desactivateMultiplicators(action: PlaceLetter): void {
        let [x, y] = [action.placement.x, action.placement.y];
        const direction = action.placement.direction;
        const word = action.word;

        let startCoord = direction === Direction.Horizontal ? x : y;
        const wordEnd = startCoord + word.length;
        for (startCoord; startCoord < wordEnd; startCoord++) {
            [x, y] = direction === Direction.Horizontal ? [startCoord, y] : [x, startCoord];
            this.grid[y][x].letterMultiplicator = 1;
            this.grid[y][x].wordMultiplicator = 1;
        }
    }
}
