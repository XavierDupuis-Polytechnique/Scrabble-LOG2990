import { GlobalSystemMessage, IndividualSystemMessage } from '@app/messages-service/system-message.interface';
import { Service } from 'typedi';
import { Observable, Subject } from 'rxjs';

@Service()
export class SystemMessagesService {
    private globalSystemMessagesSubject = new Subject<GlobalSystemMessage>();
    private individualSystemMessagesSubject = new Subject<IndividualSystemMessage>();
    get globalSystemMessages$(): Observable<GlobalSystemMessage> {
        return this.globalSystemMessagesSubject;
    }

    get individualSystemMessages$(): Observable<IndividualSystemMessage> {
        return this.individualSystemMessagesSubject;
    }

    sendIndividual(playerId: string, content: string) {
        const message: IndividualSystemMessage = { playerId, content };
        this.individualSystemMessagesSubject.next(message);
    }

    sendGlobal(gameToken: string, content: string) {
        const message: GlobalSystemMessage = { gameToken, content };
        this.globalSystemMessagesSubject.next(message);
    }
}
