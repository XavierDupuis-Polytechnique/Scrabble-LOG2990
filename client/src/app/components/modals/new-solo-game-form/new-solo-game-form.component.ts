import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    DEFAULT_TIME_PER_TURN,
    MAX_NAME_LENGTH,
    MAX_TIME_PER_TURN,
    MIN_NAME_LENGTH,
    MIN_TIME_PER_TURN,
    STEP_TIME_PER_TURN,
} from '@app/game-logic/constants';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';

const NO_WHITE_SPACE_RGX = /^\S*$/;

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent implements AfterContentChecked {
    soloGameSettingsForm = new FormGroup({
        playerName: new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_NAME_LENGTH),
            Validators.maxLength(MAX_NAME_LENGTH),
            Validators.pattern(NO_WHITE_SPACE_RGX),
        ]),
        botDifficulty: new FormControl('', [Validators.required]),
        timePerTurn: new FormControl(DEFAULT_TIME_PER_TURN, [
            Validators.required,
            Validators.min(MIN_TIME_PER_TURN),
            Validators.max(MAX_TIME_PER_TURN),
        ]),
        randomBonus: new FormControl(false, [Validators.required]),
    });

    minTimePerTurn = MIN_TIME_PER_TURN;
    maxTimePerTurn = MAX_TIME_PER_TURN;
    stepTimePerTurn = STEP_TIME_PER_TURN;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: GameSettings,
        private dialogRef: MatDialogRef<NewSoloGameFormComponent>,
        private cdref: ChangeDetectorRef,
    ) {}

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }
    playGame(): void {
        this.dialogRef.close(this.soloGameSettingsForm.value);
    }

    cancel(): void {
        this.dialogRef.close();
        this.soloGameSettingsForm.reset({
            playerName: '',
            botDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
        });
    }

    get formValid() {
        return this.soloGameSettingsForm.valid;
    }

    get settings() {
        return this.soloGameSettingsForm.value;
    }
}
