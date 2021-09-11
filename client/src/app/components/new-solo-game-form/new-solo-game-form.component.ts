import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 4;

const DEFAULT_TIME_PER_TURN = 60000;
const MIN_TIME_PER_TURN = 30000;
const MAX_TIME_PER_TURN = 300000;
const STEP_TIME_PER_TURN = 30000;

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent {
    @Output() cancelClick = new EventEmitter<void>();
    @Output() playClick = new EventEmitter<void>();
    soloGameSettingsForm = new FormGroup({
        playerName: new FormControl('', [Validators.required, Validators.minLength(MIN_NAME_LENGTH), Validators.maxLength(MAX_NAME_LENGTH)]),
        adversaryDifficulty: new FormControl('', [Validators.required]),
        timePerTurn: new FormControl(DEFAULT_TIME_PER_TURN, [
            Validators.required,
            Validators.min(MIN_TIME_PER_TURN),
            Validators.max(MAX_TIME_PER_TURN),
        ]),
    });

    minTimePerTurn = MIN_TIME_PER_TURN;
    maxTimePerTurn = MAX_TIME_PER_TURN;
    stepTimePerTurn = STEP_TIME_PER_TURN;

    playGame(): void {
        this.playClick.emit();
    }

    cancel(): void {
        this.soloGameSettingsForm.reset({
            playerName: '',
            adversaryDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
        });
        this.cancelClick.next();
    }

    get formValid() {
        return this.soloGameSettingsForm.valid;
    }

    get settings() {
        return this.soloGameSettingsForm.value;
    }
}
