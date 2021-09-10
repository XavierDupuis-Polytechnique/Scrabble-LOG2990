import { Injectable } from '@angular/core';
import { Bot } from '@app/GameLogic/player/bot';
import { Player } from '@app/GameLogic/player/player';
import { LetterBag } from '../letter-bag';
import { Game } from './game';

@Injectable({
    providedIn: 'root',
})
export class GameManagerService {
    constructor() {}

    createGame(p1: Player, p2?: Player): Game {
        let newGame = new Game();
        newGame.letterBag = new LetterBag();
        this.allocatePlayers(newGame, p1, p2);
        console.log(' P1 : ' + newGame.players[0].name);
        console.log(' P2 : ' + newGame.players[1].name);
        return newGame;
    }

    allocatePlayers(game: Game, p1: Player, p2?: Player) {
        game.players = [];
        game.players.push(p1);
        typeof p2 === 'undefined' ? game.players.push(new Bot(p1.name)) : game.players.push(p2);
    }
}
