import { Component, OnInit } from '@angular/core';
import { SoloGameSettings } from './solo-game-settings.interface';

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent implements OnInit {
    soloGameSettings: SoloGameSettings = {
        playerName: undefined,
        adversaryLevel: undefined,
        timePerTurn: null,
    };

    ngOnInit() {
        console.log(this.soloGameSettings);
    }

    playGame(): void {
        console.log(this.soloGameSettings);
    }
}
