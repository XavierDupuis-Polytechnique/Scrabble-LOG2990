/* eslint-disable @typescript-eslint/no-magic-numbers */

import { ObjectiveCompletion, ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { expect } from 'chai';

class MockObjective extends Objective {
    owner = 'playerName';
    name = 'mockObjective';
    points = 123;
    protected updateProgression(): void {
        return;
    }
}

describe('ObjectiveNotifierService', () => {
    let service: ObjectiveNotifierService;
    let objective: Objective;
    const gameToken = 'gameToken';

    beforeEach(() => {
        service = new ObjectiveNotifierService();
        objective = new MockObjective(gameToken, service);
    });

    it('should be created', () => {
        expect(service instanceof ObjectiveNotifierService).to.be.equal(true);
    });

    it('should send the correct message for an objective completion', () => {
        const expected = `${objective.owner} a complété l'objectif '${objective.name}' (${objective.points} points)`;
        service.notification$.subscribe((objectiveCompletion: ObjectiveCompletion) => {
            expect(objectiveCompletion.gameToken).to.be.equal(gameToken);
            expect(objectiveCompletion.message).to.be.equal(expected);
        });
        service.sendObjectiveNotification(gameToken, objective);
    });
});
