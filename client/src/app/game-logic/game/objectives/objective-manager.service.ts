import { Injectable } from '@angular/core';
import { Action } from '@app/game-logic/actions/action';
import { Game } from '@app/game-logic/game/games/game';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';

@Injectable({
  providedIn: 'root',
})
export class ObjectiveManagerService {
  objectives: Objective[];
  constructor() {}
  updateObjectives(action: Action, game: Game) {
    return;
  }
}
