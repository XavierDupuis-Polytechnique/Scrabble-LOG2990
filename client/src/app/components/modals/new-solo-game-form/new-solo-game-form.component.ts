import { AfterContentChecked, ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {
    DEFAULT_DICTIONARY_TITLE,
    DEFAULT_TIME_PER_TURN,
    MAX_NAME_LENGTH,
    MAX_TIME_PER_TURN,
    MIN_NAME_LENGTH,
    MIN_TIME_PER_TURN,
    STEP_TIME_PER_TURN,
} from '@app/game-logic/constants';
import { GameSettings } from '@app/game-logic/game/games/game-settings.interface';
import { DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';

const NO_WHITE_SPACE_RGX = /^\S*$/;

@Component({
    selector: 'app-new-solo-game-form',
    templateUrl: './new-solo-game-form.component.html',
    styleUrls: ['./new-solo-game-form.component.scss'],
})
export class NewSoloGameFormComponent implements AfterContentChecked, OnInit {
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
        dictTitle: new FormControl(DEFAULT_DICTIONARY_TITLE, [Validators.required]),
    });

    minTimePerTurn = MIN_TIME_PER_TURN;
    maxTimePerTurn = MAX_TIME_PER_TURN;
    stepTimePerTurn = STEP_TIME_PER_TURN;
    dictList: DictInfo[] = [];
    isDictDeleted = false;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: GameSettings,
        private dialogRef: MatDialogRef<NewSoloGameFormComponent>,
        private cdref: ChangeDetectorRef,
        private dictHttpService: DictHttpService,
    ) {}

    ngOnInit() {
        this.dictHttpService.getDictInfoList().subscribe((dictList) => {
            this.dictList = dictList as DictInfo[];
        });
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    playGame(): void {
        this.dictNotDeletedValidation(this.soloGameSettingsForm);
    }

    cancel(): void {
        this.dialogRef.close();
        this.soloGameSettingsForm.reset({
            playerName: '',
            botDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
            dictTitle: '',
        });
    }

    get formValid() {
        return this.soloGameSettingsForm.valid;
    }

    get settings() {
        return this.soloGameSettingsForm.value;
    }

    private dictNotDeletedValidation(formSettings: FormGroup) {
        this.dictHttpService.getDictInfoList().subscribe((dictList) => {
            this.dictList = dictList as DictInfo[];
            const dictionary = this.dictList.find((dict) => dict.title === formSettings.value.dictTitle);
            if (dictionary) {
                this.dialogRef.close(this.soloGameSettingsForm.value);
                return;
            }
            this.soloGameSettingsForm.controls.dictTitle.setErrors({
                dictDeleted: true,
            });
        });
    }
}
