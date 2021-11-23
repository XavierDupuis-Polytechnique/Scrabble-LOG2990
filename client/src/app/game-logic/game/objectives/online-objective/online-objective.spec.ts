import { ObjectiveNotifierService } from '@app/game-logic/game/objectives/objective-notifier/objective-notifier.service';
import { OnlineObjective } from '@app/game-logic/game/objectives/online-objective/online-objective';

describe('OnlineObjective', () => {
    let onlineObjective: OnlineObjective;
    let objectiveNotifierSpy: jasmine.SpyObj<ObjectiveNotifierService>;
    const name = 'objName';
    const description = 'objDescription';
    const points = 10;
    beforeEach(() => {
        objectiveNotifierSpy = jasmine.createSpyObj('ObjectiveNotifierService', ['sendObjectiveNotification']);
        onlineObjective = new OnlineObjective(objectiveNotifierSpy, name, description, points);
    });

    it('should create', () => {
        expect(onlineObjective).toBeTruthy();
    });

    it('should not update progression (because the server updates objectives)', () => {
        // eslint-disable-next-line dot-notation
        onlineObjective['updateProgression']();
        expect().nothing();
    });
});
