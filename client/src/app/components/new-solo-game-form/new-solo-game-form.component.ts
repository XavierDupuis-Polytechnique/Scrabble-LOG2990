import { Component, EventEmitter, Output } from '@angular/core';
import { newSoloGameSettings, SoloGameSettings } from './solo-game-settings.interface';

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent {
    @Output() cancelClick = new EventEmitter<void>();
    @Output() playClick = new EventEmitter<void>();

    soloGameSettings: SoloGameSettings = newSoloGameSettings();

    playGame(): void {
        this.playClick.emit();
    }

    cancel(): void {
        this.soloGameSettings = newSoloGameSettings();
        this.cancelClick.next();
    }
}
