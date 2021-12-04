import { Direction } from '@app/game/game-logic/actions/direction.enum';
import { PlaceLetter } from '@app/game/game-logic/actions/place-letter';
import { Tile } from '@app/game/game-logic/board/tile';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { EndOfGameReason } from '@app/game/game-logic/interface/end-of-game.interface';
import { Player } from '@app/game/game-logic/player/player';
import { Service } from 'typedi';

const MAX_LETTER_IN_RACK = 7;
const BONUS = 50;

@Service()
export class PointCalculatorService {
    placeLetterCalculation(action: PlaceLetter, wordList: Tile[][], grid: Tile[][]): number {
        let totalPointsOfTurn = 0;
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(word);
        });
        this.desactivateMultiplicators(action, grid);

        if (action.affectedCoords.length >= MAX_LETTER_IN_RACK) {
            totalPointsOfTurn += BONUS;
        }
        action.player.points += totalPointsOfTurn;
        return totalPointsOfTurn;
    }

    endOfGamePointDeduction(game: ServerGame): void {
        const activePlayer = game.getActivePlayer();
        if (game.consecutivePass >= ServerGame.maxConsecutivePass || game.endReason === EndOfGameReason.Forfeit) {
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

    private desactivateMultiplicators(action: PlaceLetter, grid: Tile[][]): void {
        let [x, y] = [action.placement.x, action.placement.y];
        const direction = action.placement.direction;
        const word = action.word;

        let startCoord = direction === Direction.Horizontal ? x : y;
        const wordEnd = startCoord + word.length;
        for (startCoord; startCoord < wordEnd; startCoord++) {
            [x, y] = direction === Direction.Horizontal ? [startCoord, y] : [x, startCoord];
            grid[y][x].letterMultiplicator = 1;
            grid[y][x].wordMultiplicator = 1;
        }
    }
}
