import { LetterBag } from '@app/game/game-logic/board/letter-bag';
import { Tile } from '@app/game/game-logic/board/tile';
import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameState, LightPlayer } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { Service } from 'typedi';

@Service()
export class GameCompiler {
    compile(game: ServerGame): GameState {
        const lightPlayers: LightPlayer[] = this.fillPlayer(game.players);
        const activePlayer = game.activePlayerIndex;

        const lightGrid: Tile[][] = game.board.grid;

        const lightLetterBag: LetterBag = game.letterBag;
        let lightEndOfGame = false;
        let lightWinnerIndex: number[] = [];
        if (game.isEndOfGame()) {
            lightEndOfGame = true;
            if (game.getWinner().length === 2) {
                lightWinnerIndex = [0, 1];
            } else if (game.getWinner()[0].name === game.players[0].name) {
                lightWinnerIndex = [0];
            } else {
                lightWinnerIndex = [1];
            }
        } else {
            lightEndOfGame = false;
        }

        const lg: GameState = {
            players: lightPlayers,
            activePlayerIndex: activePlayer,
            grid: lightGrid,
            isEndOfGame: lightEndOfGame,
            letterBag: lightLetterBag,
            winnerIndex: lightWinnerIndex,
        };
        return lg;
    }

    private fillPlayer(players: Player[]): LightPlayer[] {
        const lp: LightPlayer[] = [
            { name: players[0].name, points: players[0].points, letterRack: players[0].letterRack },
            { name: players[1].name, points: players[1].points, letterRack: players[1].letterRack },
        ];

        return lp;
    }
}
