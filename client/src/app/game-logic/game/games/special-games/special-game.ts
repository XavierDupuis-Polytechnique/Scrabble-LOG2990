import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export abstract class SpecialGame extends Game {
    privateObjectives: Map<string, Objective[]>;
    publicObjectives: Objective[];
}
