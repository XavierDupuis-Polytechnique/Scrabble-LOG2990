import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';

@Component({
    selector: 'app-classic-game',
    templateUrl: './classic-game.component.html',
    styleUrls: ['./classic-game.component.scss'],
})
export class ClassicGameComponent {
    @ViewChild('gameSettingsForm') gameFormComponent: NewSoloGameFormComponent;
    hideSoloGameForm: boolean = true;
    constructor(private router: Router, private gameManager: GameManagerService) {}

    openSoloGameForm() {
        this.hideSoloGameForm = false;
    }

    closeSoloGameForm() {
        this.hideSoloGameForm = true;
    }

    startSoloGame() {
        const gameSettings = this.gameFormComponent.settings;
        this.gameManager.createGame(gameSettings);
        this.router.navigate(['/game']);
    }
}
