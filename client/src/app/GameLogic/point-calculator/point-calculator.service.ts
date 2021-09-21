import { Injectable } from '@angular/core';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '@app/GameLogic/player/player';

const MAX_LETTER_IN_RACK = 7;
const BONUS = 50;
@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    letterCreator: LetterCreator;

    constructor() {
        this.letterCreator = new LetterCreator();
    }

    placeLetterPointsCalculation(action: PlaceLetter, wordList: Tile[][], player: Player, game: Game) {
        let totalPointsOfTurn = 0;
        let wordPlaced: Tile[] = [];
        wordList.forEach(() => {

            wordPlaced = this.wordPlaced(action, game);
            totalPointsOfTurn += this.calculatePointsOfWord(wordPlaced);
        });
        if (player.isLetterRackEmpty && wordPlaced.length >= MAX_LETTER_IN_RACK) {
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
            this.desactivateLetterMultiplicator(letter);
            if (letter.wordMultiplicator) {
                totalWordMultiplicator *= letter.wordMultiplicator;
                this.desactivateWordMultiplicator(letter);
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

    wordPlaced(action: PlaceLetter, game: Game) {
        const wordInTile: Tile[] = [];
        const startX = action.placement.x;
        const startY = action.placement.y;
        for (let wordIndex = 0; wordIndex < action.word.length; wordIndex++) {
            let x = 0;
            let y = 0;
            if (action.placement.direction === Direction.Horizontal) {
                x = startX + wordIndex;
                wordInTile.push(game.board.grid[y][x]);
            } else {
                y = startY + wordIndex;
                wordInTile.push(game.board.grid[y][x]);
            }
        }
        return wordInTile;
    }

    protected desactivateLetterMultiplicator(tile: Tile) {
        tile.letterMultiplicator = 1;
    }

    protected desactivateWordMultiplicator(tile: Tile) {
        tile.wordMultiplicator = 1;
    }
}
