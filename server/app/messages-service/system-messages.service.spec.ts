import { GlobalSystemMessage, IndividualSystemMessage } from '@app/messages-service/system-message.interface';
import { SystemMessagesService } from '@app/messages-service/system-messages.service';
import { expect } from 'chai';

describe('SystemMessagesService', () => {
    let service: SystemMessagesService;
    before(() => {
        service = new SystemMessagesService();
    });

    it('should emit global system message', (done) => {
        const gameToken = '1';
        const content = 'allo';
        const globalMessage: GlobalSystemMessage = { gameToken, content };
        service.globalSystemMessages$.subscribe((message) => {
            expect(message).to.deep.equal(globalMessage);
            done();
        });
        service.sendGlobal(gameToken, content);
    });

    it('should emit individual system message', (done) => {
        const playerId = '1';
        const content = 'allo';
        const individualMessage: IndividualSystemMessage = { playerId, content };
        service.individualSystemMessages$.subscribe((message) => {
            expect(message).to.deep.equal(individualMessage);
            done();
        });
        service.sendIndividual(playerId, content);
    });
});
