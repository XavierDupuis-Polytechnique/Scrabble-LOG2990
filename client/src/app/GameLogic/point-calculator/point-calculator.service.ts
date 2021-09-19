import { Injectable } from '@angular/core';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';

const MAX_LETTER_IN_RACK = 7;
const BONUS = 50;
@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    placeLetterPointsCalculation(player: Player, action: PlaceLetter, wordList: Tile[][]) {
        let totalPointsOfTurn = 0;
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(word);
        });
        if (player.isLetterRackEmpty && action.lettersToPlace.length >= MAX_LETTER_IN_RACK) {
            totalPointsOfTurn += BONUS;
        }
        player.points += totalPointsOfTurn;
        return totalPointsOfTurn;
    }

    endOfGamePointdeduction(game: Game) {
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

    calculatePointsOfWord(word: Tile[]) {
        let sumOfWord = 0;
        let totalWordMultiplicator = 1;
        const lettersInWord = new Set(word);
        lettersInWord.forEach((letter) => {
            sumOfWord += letter.letterObject.value * letter.letterMultiplicator;
            if (letter.wordMultiplicator) {
                totalWordMultiplicator *= letter.wordMultiplicator;
            }
        });
        sumOfWord *= totalWordMultiplicator;
        return sumOfWord;
    }
    calculatePointsOfRack(player: Player) {
        let sumOfRack = 0;
        const letterRack = new Set(player.letterRack);
        for (const letter of letterRack) {
            sumOfRack += letter.value;
        }
        return sumOfRack;
    }
}
