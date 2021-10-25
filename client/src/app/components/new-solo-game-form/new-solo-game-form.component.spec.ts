/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_TIME_PER_TURN } from '@app/GameLogic/constants';
import { NewSoloGameFormComponent } from './new-solo-game-form.component';

describe('NewSoloGameFormComponent', () => {
    let component: NewSoloGameFormComponent;
    let fixture: ComponentFixture<NewSoloGameFormComponent>;

    const mockDialog = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        close: () => {},
    };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDialogModule,
                MatSliderModule,
                MatDialogModule,
                MatInputModule,
                MatSelectModule,
                BrowserAnimationsModule,
                MatCheckboxModule,
                ReactiveFormsModule,
            ],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {},
                },
                { provide: MatDialogRef, useValue: mockDialog },
            ],
            declarations: [NewSoloGameFormComponent],
        }).compileComponents();
        fixture = TestBed.createComponent(NewSoloGameFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('cancel', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const buttons = dom.querySelectorAll('button');
        spyOn(component, 'cancel');
        buttons[0].click();
        expect(component.cancel).toHaveBeenCalled();
    });

    it('play not responsive when form not complete', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const buttons = dom.querySelectorAll('button');
        const spy = spyOn(component, 'playGame');
        buttons[1].click();
        expect(spy.calls.count()).toBe(0);
    });

    it('play should call playGame when form complete (easyBot)', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const buttons = dom.querySelectorAll('button');

        component.soloGameSettingsForm.setValue({
            playerName: 'samuel',
            botDifficulty: 'easy',
            timePerTurn: 60000,
            randomBonus: false,
        });
        component.soloGameSettingsForm.updateValueAndValidity();
        fixture.detectChanges();
        spyOn(component, 'playGame');
        buttons[1].click();
        fixture.detectChanges();
        expect(component.playGame).toHaveBeenCalled();
    });

    it('play should call playGame when form complete (hardBot)', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const buttons = dom.querySelectorAll('button');

        component.soloGameSettingsForm.setValue({
            playerName: 'samuel',
            botDifficulty: 'hard',
            timePerTurn: 60000,
            randomBonus: true,
        });
        component.soloGameSettingsForm.updateValueAndValidity();
        fixture.detectChanges();
        spyOn(component, 'playGame');
        buttons[1].click();
        fixture.detectChanges();
        expect(component.playGame).toHaveBeenCalled();
    });

    it('setting should return group form value', () => {
        const setting = {
            playerName: 'samuel',
            botDifficulty: 'easy',
            timePerTurn: 60000,
            randomBonus: true,
        };
        component.soloGameSettingsForm.setValue(setting);
        expect(component.settings).toEqual(setting);
    });

    it('playGame should close the dialog', () => {
        spyOn(mockDialog, 'close');
        component.playGame();
        expect(mockDialog.close).toHaveBeenCalled();
    });
    it('cancel should close the dialog and reset form', () => {
        const setting = {
            playerName: 'samuel',
            botDifficulty: 'easy',
            timePerTurn: 60000,
            randomBonus: true,
        };
        component.soloGameSettingsForm.setValue(setting);
        spyOn(mockDialog, 'close');
        component.cancel();
        expect(mockDialog.close).toHaveBeenCalled();
        expect(component.settings).toEqual({
            playerName: '',
            botDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
        });
    });
});
