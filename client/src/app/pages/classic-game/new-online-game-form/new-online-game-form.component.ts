import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    DEFAULT_TIME_PER_TURN,
    MAX_NAME_LENGTH,
    MAX_TIME_PER_TURN,
    MIN_NAME_LENGTH,
    MIN_TIME_PER_TURN,
    STEP_TIME_PER_TURN
} from '@app/GameLogic/constants';
import { GameSettingsMultiUI } from '@app/modeMulti/interface/game-settings-multi.interface';

const NO_WHITE_SPACE_RGX = /^\S*$/;

@Component({
    selector: 'app-new-online-game-form',
    templateUrl: './new-online-game-form.component.html',
    styleUrls: ['./new-online-game-form.component.scss'],
})
export class NewOnlineGameFormComponent implements AfterContentChecked {
    onlineGameSettingsForm = new FormGroup({
        playerName: new FormControl('', [
            Validators.required,
            Validators.minLength(MIN_NAME_LENGTH),
            Validators.maxLength(MAX_NAME_LENGTH),
            Validators.pattern(NO_WHITE_SPACE_RGX),
        ]),
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
        @Inject(MAT_DIALOG_DATA) public data: GameSettingsMultiUI,
        private dialogRef: MatDialogRef<NewOnlineGameFormComponent>,
        private cdref: ChangeDetectorRef,
    ) {}

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    playGame(): void {
        this.dialogRef.close(this.onlineGameSettingsForm.value);
    }

    cancel(): void {
        this.dialogRef.close();
        this.onlineGameSettingsForm.reset({
            playerName: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
        });
    }

    get formValid() {
        return this.onlineGameSettingsForm.valid;
    }
}
