import { Objective } from '@app/game/game-logic/objectives/objectives/objective';

export interface GeneratedObjectives {
    privateObjectives: Objective[][];
    publicObjectives: Objective[];
}
