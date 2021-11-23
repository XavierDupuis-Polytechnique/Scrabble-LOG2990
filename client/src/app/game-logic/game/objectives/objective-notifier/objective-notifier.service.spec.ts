/* eslint-disable @typescript-eslint/no-magic-numbers */
import { TestBed } from '@angular/core/testing';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { MessagesService } from '@app/game-logic/messages/messages.service';
import { ObjectiveNotifierService } from './objective-notifier.service';

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
    let messagesServiceSpy: jasmine.SpyObj<MessagesService>;
    let objective: Objective;

    beforeEach(() => {
        messagesServiceSpy = jasmine.createSpyObj(MessagesService, ['receiveSystemMessage']);
        TestBed.configureTestingModule({ providers: [{ provide: MessagesService, useValue: messagesServiceSpy }] });
        service = TestBed.inject(ObjectiveNotifierService);
        objective = new MockObjective(service);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should send the correct message for an objective completion', () => {
        service.sendObjectiveNotification(objective);
        const expected = `${objective.owner} a complété l'objectif '${objective.name}' (${objective.points} points)`;
        expect(messagesServiceSpy.receiveSystemMessage).toHaveBeenCalledWith(expected);
    });
});
