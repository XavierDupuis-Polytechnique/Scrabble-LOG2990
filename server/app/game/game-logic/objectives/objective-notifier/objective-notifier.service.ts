import { Objective } from '@app/game/game-logic/objectives/objectives/objective';
import { Service } from 'typedi';

@Service()
export class ObjectiveNotifierService {
    // eslint-disable-next-line no-unused-vars
    sendObjectiveNotification(gameToken: string, objective: Objective) {
        // const ownerName = objective.owner;
        // const objectiveName = objective.name;
        // const points = objective.points;
        // const message = `${ownerName} a complété l'objectif '${objectiveName}' (${points} points)`;
        // this.messagesService.sendGlobal(gameToken, message);
    }
}
