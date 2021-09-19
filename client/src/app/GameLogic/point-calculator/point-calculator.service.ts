import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';
@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    // constructor() {}
    placeLetterPointsCalculation(player: Player, wordList: Array<Tile[]>) {
        let totalPointsOfTurn = 0;
        // let wordList = new Set(words);
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(word);
        });
        if (player.isLetterRackEmpty) {
            totalPointsOfTurn += 50;
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
            if (letter.letterMultiplicator) {
                sumOfWord += letter.letterObject.value * letter.letterMultiplicator;
            } else {
                sumOfWord += letter.letterObject.value;
            }
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
