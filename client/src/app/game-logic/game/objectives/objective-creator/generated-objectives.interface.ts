import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

export interface GeneratedObjectives {
    privateObjectives: Objective[][];
    publicObjectives: Objective[];
}
