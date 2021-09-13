import { Injectable } from '@angular/core';
import { Game } from '../game/games/game';
import { Player } from '../player/player';

@Injectable({
    providedIn: 'root',
})
export class PointCalculatorService {
    // constructor() {}

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

    calculatePointsOfRack(player: Player) {
        const sumOfRack = 0;
        // for(const letter in player.letterRack){
        //     sumOfRack += letter.point;
        // }
        return sumOfRack;
    }

    // if player1.letterRack.!isempty && player2.letterrack.!isepmty
    // calculate player1 et player2 score (total - points)
    // else players1 + player2.calculatePoints() ; player2.score - player2.calculatepoint()
}
