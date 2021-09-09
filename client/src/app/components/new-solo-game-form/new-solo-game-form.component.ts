import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent {
    @Output() cancelClick = new EventEmitter<void>();
    @Output() playClick = new EventEmitter<void>();

    soloGameSettingsForm = new FormGroup({
        playerName: new FormControl(''),
        adversaryDifficulty: new FormControl(''),
        timePerTurn: new FormControl(''),
    });

    playGame(): void {
        this.playClick.emit();
    }

    cancel(): void {
        this.soloGameSettingsForm.reset();
        this.cancelClick.next();
    }
}
