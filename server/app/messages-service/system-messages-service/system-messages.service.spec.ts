import { GameActionNotification, GameActionNotifierService } from '@app/game/game-action-notifier/game-action-notifier.service';
import { ObjectiveCompletion, ObjectiveNotifierService } from '@app/game/game-logic/objectives/objective-notifier/objective-notifier.service';
import { GlobalSystemMessage, IndividualSystemMessage } from '@app/messages-service/system-message.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages-service/system-messages.service';
import { createSinonStubInstance } from '@app/test.util';
import { expect } from 'chai';
import { first, Subject } from 'rxjs';
import * as sinon from 'sinon';

describe('SystemMessagesService', () => {
    let service: SystemMessagesService;
    const mockNotification$ = new Subject<GameActionNotification>();
    const mockObjectiveNotif$ = new Subject<ObjectiveCompletion>();
    const gameActionNotifierStub = createSinonStubInstance<GameActionNotifierService>(GameActionNotifierService);
    const objectiveNotifierServiceStub = createSinonStubInstance<ObjectiveNotifierService>(ObjectiveNotifierService);
    before(() => {
        sinon.stub(gameActionNotifierStub, 'notification$').get(() => mockNotification$);
        sinon.stub(objectiveNotifierServiceStub, 'notification$').get(() => mockObjectiveNotif$);
    });

    beforeEach(() => {
        service = new SystemMessagesService(gameActionNotifierStub, objectiveNotifierServiceStub);
    });

    it('should emit global system message', (done) => {
        const gameToken = '1';
        const content = 'allo';
        const globalMessage: GlobalSystemMessage = { gameToken, content };
        service.globalSystemMessages$.pipe(first()).subscribe((message) => {
            expect(message).to.deep.equal(globalMessage);
            done();
        });
        service.sendGlobal(gameToken, content);
    });

    it('should emit individual system message', (done) => {
        const playerName = '1';
        const content = 'allo';
        const gameToken = '1';
        const individualMessage: IndividualSystemMessage = { gameToken, playerName, content };
        service.individualSystemMessages$.pipe(first()).subscribe((message) => {
            expect(message).to.deep.equal(individualMessage);
            done();
        });
        service.sendIndividual(playerName, gameToken, content);
    });

    it('should send individual notification', () => {
        const notification: GameActionNotification = {
            gameToken: '1',
            content: 'allo',
            to: ['test1'],
        };
        const individualMessage = {
            gameToken: '1',
            content: 'allo',
            playerName: 'test1',
        };
        service.individualSystemMessages$.pipe(first()).subscribe((message) => {
            expect(message).to.deep.equal(individualMessage);
        });
        mockNotification$.next(notification);
    });

    it('should receive objective notification', () => {
        const notification: ObjectiveCompletion = {
            gameToken: '1',
            message: 'abc',
        };
        const individualMessage = {
            gameToken: '1',
            content: 'abc',
        };
        service.globalSystemMessages$.pipe(first()).subscribe((message) => {
            expect(message).to.deep.equal(individualMessage);
        });
        mockObjectiveNotif$.next(notification);
    });
});
