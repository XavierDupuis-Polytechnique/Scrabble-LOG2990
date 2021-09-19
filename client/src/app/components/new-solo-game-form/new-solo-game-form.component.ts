import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GameSettings } from '@app/GameLogic/game/games/game-settings.interface';

const MAX_NAME_LENGTH = 50;
const MIN_NAME_LENGTH = 3;

export const DEFAULT_TIME_PER_TURN = 60000;
const MIN_TIME_PER_TURN = 30000;
const MAX_TIME_PER_TURN = 300000;
const STEP_TIME_PER_TURN = 30000;
const NO_WHITE_SPACE_RGX = /^\S*$/;

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent {
    soloGameSettingsForm = new FormGroup({
        playerName: new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_NAME_LENGTH),
            Validators.maxLength(MAX_NAME_LENGTH),
            Validators.pattern(NO_WHITE_SPACE_RGX),
        ]),
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

    constructor(@Inject(MAT_DIALOG_DATA) public data: GameSettings, private dialogRef: MatDialogRef<NewSoloGameFormComponent>) {}

    playGame(): void {
        this.dialogRef.close(this.soloGameSettingsForm.value);
    }

    cancel(): void {
        this.dialogRef.close();
        this.soloGameSettingsForm.reset({
            playerName: '',
            adversaryDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
        });
    }

    get formValid() {
        return this.soloGameSettingsForm.valid;
    }

    get settings() {
        return this.soloGameSettingsForm.value;
    }
}
