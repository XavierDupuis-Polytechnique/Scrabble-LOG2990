// import { GameActionNotifierService } from '@app/game/game-action-notifier/game-action-notifier.service';
// import { GlobalSystemMessage, IndividualSystemMessage } from '@app/messages-service/system-message.interface';
// import { SystemMessagesService } from '@app/messages-service/system-messages.service';
// import { createSinonStubInstance } from '@app/test.util';
// import { expect } from 'chai';

// describe('SystemMessagesService', () => {
//     let service: SystemMessagesService;
//     before(() => {
//         const gameNotifier = createSinonStubInstance<GameActionNotifierService>(GameActionNotifierService);
//         service = new SystemMessagesService(gameNotifier);
//     });

//     it('should emit global system message', (done) => {
//         const gameToken = '1';
//         const content = 'allo';
//         const globalMessage: GlobalSystemMessage = { gameToken, content };
//         service.globalSystemMessages$.subscribe((message) => {
//             expect(message).to.deep.equal(globalMessage);
//             done();
//         });
//         service.sendGlobal(gameToken, content);
//     });

//     it('should emit individual system message', (done) => {
//         const playerName = '1';
//         const content = 'allo';
//         const gameToken = '1';
//         const individualMessage: IndividualSystemMessage = { gameToken, playerName, content };
//         service.individualSystemMessages$.subscribe((message) => {
//             expect(message).to.deep.equal(individualMessage);
//             done();
//         });
//         service.sendIndividual(playerName, gameToken, content);
//     });
// });
