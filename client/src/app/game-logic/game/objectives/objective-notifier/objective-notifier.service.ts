import { Injectable } from '@angular/core';
import { Objective } from '@app/game-logic/game/objectives/objectives/objective';
import { MessagesService } from '@app/game-logic/messages/messages.service';

@Injectable({
    providedIn: 'root',
})
export class ObjectiveNotifierService {
    constructor(private messagesService: MessagesService) {}

    sendObjectiveNotification(objective: Objective) {
        const ownerName = objective.owner;
        const objectiveName = objective.name;
        const points = objective.points;
        const message = `${ownerName} a complété l'objectif '${objectiveName}' (${points} points)`;
        this.messagesService.receiveSystemMessage(message);
    }
}
