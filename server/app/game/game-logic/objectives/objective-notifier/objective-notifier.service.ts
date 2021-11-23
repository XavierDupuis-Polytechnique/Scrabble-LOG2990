import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { Observable, Subject } from 'rxjs';
import { Service } from 'typedi';

export interface ObjectiveCompletion {
    gameToken: string;
    message: string;
}

@Service()
export class ObjectiveNotifierService {
    private objectiveCompletionSubject = new Subject<ObjectiveCompletion>();
    get notification$(): Observable<ObjectiveCompletion> {
        return this.objectiveCompletionSubject.asObservable();
    }

    sendObjectiveNotification(gameToken: string, objective: Objective) {
        const ownerName = objective.owner;
        const objectiveName = objective.name;
        const points = objective.points;
        const message = `${ownerName} a complété l'objectif '${objectiveName}' (${points} points)`;
        this.objectiveCompletionSubject.next({ gameToken, message });
    }
}
