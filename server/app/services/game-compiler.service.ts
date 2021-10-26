import { ServerGame } from '@app/game/game-logic/game/server-game';
import { GameState, LightPlayer } from '@app/game/game-logic/interface/game-state.interface';
import { Player } from '@app/game/game-logic/player/player';
import { Service } from 'typedi';

@Service()
export class GameCompiler {
    compile(game: ServerGame): GameState {
        const lg = new GameState();

        lg.players = this.fillPlayer(game.players);
        lg.activePlayerIndex = game.activePlayerIndex;

        lg.grid = game.board.grid;

        lg.letterBag = game.letterBag;

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
