import { Component } from '@angular/core';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';

@Component({
    selector: 'app-objectives-list',
    templateUrl: './objectives-list.component.html',
    styleUrls: ['./objectives-list.component.scss'],
})
export class ObjectivesListComponent {
    constructor(private info: GameInfoService) {}

    get publicObjectives() {
        return this.info.publicObjectives;
    }

    get userPrivateObjectives() {
        return this.info.getPrivateObjectives(this.info.user.name);
    }

    get opponentPrivateObjectives() {
        return this.info.getPrivateObjectives(this.info.opponent.name);
    }

    get isOwnedByOpponent() {
        return this.opponentPrivateObjectives[0].owner === this.info.opponent.name;
    }

    get isSpecialGame() {
        return this.info.isSpecialGame;
    }
}
