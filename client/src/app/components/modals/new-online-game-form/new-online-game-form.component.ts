import { AfterContentChecked, ChangeDetectorRef, Component, Inject } from '@angular/core';
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
import { DictInfo } from '@app/pages/admin-page/admin-dict/admin-dict.component';
import { DictHttpService } from '@app/services/dict-http.service';
import { OnlineGameSettingsUI } from '@app/socket-handler/interfaces/game-settings-multi.interface';

const NO_WHITE_SPACE_RGX = /^\S*$/;

@Component({
    selector: 'app-new-online-game-form',
    templateUrl: './new-online-game-form.component.html',
    styleUrls: ['./new-online-game-form.component.scss'],
})
export class NewOnlineGameFormComponent implements AfterContentChecked {
    onlineGameSettingsUIForm = new FormGroup({
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
        dictTitle: new FormControl(DEFAULT_DICTIONARY_TITLE, [Validators.required]),
        dictDesc: new FormControl(''),
    });

    minTimePerTurn = MIN_TIME_PER_TURN;
    maxTimePerTurn = MAX_TIME_PER_TURN;
    stepTimePerTurn = STEP_TIME_PER_TURN;
    dictList: DictInfo[] = [{ title: DEFAULT_DICTIONARY_TITLE, description: '' }] as DictInfo[];

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: OnlineGameSettingsUI,
        private dialogRef: MatDialogRef<NewOnlineGameFormComponent>,
        private cdref: ChangeDetectorRef,
        private dictHttpService: DictHttpService,
    ) {
        this.onInit();
    }

    onInit() {
        this.dictHttpService.getDictInfoList().subscribe((dictList) => {
            this.dictList = dictList as DictInfo[];
        });
    }

    getDescription(dictTitle: string): string {
        const tmpDict = this.dictList.find((dict) => dict.title === dictTitle);
        return tmpDict ? tmpDict.description : '';
    }

    ngAfterContentChecked() {
        this.cdref.detectChanges();
    }

    playGame(): void {
        this.dictNotDeletedValidation(this.onlineGameSettingsUIForm);
    }

    cancel(): void {
        this.dialogRef.close();
        this.onlineGameSettingsUIForm.reset({
            playerName: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            dictDesc: '',
        });
    }

    get formValid() {
        return this.onlineGameSettingsUIForm.valid;
    }

    private dictNotDeletedValidation(formSettings: FormGroup) {
        this.dictHttpService.getDictInfoList().subscribe((dictList) => {
            this.dictList = dictList as DictInfo[];
            const dictionary = this.dictList.find((dict) => dict.title === formSettings.value.dictTitle);
            if (dictionary) {
                const form = this.onlineGameSettingsUIForm.value;
                form.dictDesc = this.getDescription(form.dictTitle);
                this.dialogRef.close(form);
                return;
            }
            this.onlineGameSettingsUIForm.controls.dictTitle.setErrors({
                dictDeleted: true,
            });
        });
    }
}
