import { Injectable } from '@angular/core';
import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';

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
        let sumOfRack = 0;
        for (const letter of player.letterRack) {
            sumOfRack += letter.value;
        }
        return sumOfRack;
    }
}
