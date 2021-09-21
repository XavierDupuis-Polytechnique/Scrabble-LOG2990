import { Injectable } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import { Direction } from '@app/GameLogic/actions/direction.enum';
import { PlaceLetter } from '@app/GameLogic/actions/place-letter';
import { Game } from '@app/GameLogic/game/games/game';
import { LetterCreator } from '@app/GameLogic/game/letter-creator';
import { Tile } from '@app/GameLogic/game/tile';
import { Player } from '../player/player';

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

    // ON feed la liste des mots ecrits
    placeLetterPointsCalculation(action: PlaceLetter, wordList: Tile[][], game: Game): number {
        let totalPointsOfTurn = 0;
        // const wordPlaced = this.wordPlaced(action, game);
        wordList.forEach((word) => {
            totalPointsOfTurn += this.calculatePointsOfWord(word, action, game);
        });
        if (action.player.isLetterRackEmpty && action.lettersToRemoveInRack.length >= MAX_LETTER_IN_RACK) {
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

    calculatePointsOfWord(word: Tile[], action: PlaceLetter, game: Game): number {
        let sumOfWord = 0;
        let totalWordMultiplicator = 1;
        const lettersInWord = new Set(word);
        lettersInWord.forEach((letter) => {
            sumOfWord += letter.letterObject.value * letter.letterMultiplicator;
            this.desactivateLetterMultiplicator(this.findCoordinates(letter, action), game);

            totalWordMultiplicator *= letter.wordMultiplicator;
            this.desactivateWordMultiplicator(this.findCoordinates(letter, action), game);

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
    wordPlaced(action: PlaceLetter, game: Game): Tile[] {
        const wordInTile: Tile[] = [];
        const startX = action.placement.x;
        const startY = action.placement.y;
        for (let wordIndex = 0; wordIndex < action.word.length; wordIndex++) {
            let x = 0;
            let y = 0;
            if (action.placement.direction === Direction.Horizontal) {
                x = startX + wordIndex;
                wordInTile.push(game.board.grid[y][x]);
            } else if (action.placement.direction === Direction.Horizontal) {
                y = startY + wordIndex;
                wordInTile.push(game.board.grid[y][x]);
            }

        }
        return wordInTile;
    }

    findCoordinates(lettre: Tile, action: PlaceLetter) {
        let coordinates: Vec2 = { x: 0, y: 0 };
        for (let wordIndex = 0; wordIndex < action.word.length; wordIndex++) {
            if (action.word[wordIndex] === lettre.letterObject.char) {
                if (action.placement.direction === Direction.Horizontal) {
                    coordinates.x = action.placement.x + wordIndex;
                    coordinates.y = action.placement.y
                } else {
                    coordinates.x = action.placement.x;
                    coordinates.y = action.placement.y + wordIndex;
                }
            }

        }
        return coordinates;

    }

    protected desactivateLetterMultiplicator(coordinates: Vec2, game: Game) {
        game.board.desactivateWordMultiplicator(coordinates.x, coordinates.y);

    }

    protected desactivateWordMultiplicator(coordinates: Vec2, game: Game) {
        game.board.desactivateWordMultiplicator(coordinates.x, coordinates.y);
    }
}
