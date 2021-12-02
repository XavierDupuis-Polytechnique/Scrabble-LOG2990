import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_DICTIONARY_TITLE, DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';
import { NewSoloGameFormComponent } from './new-solo-game-form.component';

describe('NewSoloGameFormComponent', () => {
    let component: NewSoloGameFormComponent;
    let fixture: ComponentFixture<NewSoloGameFormComponent>;
    const dictHttpServiceSpy = jasmine.createSpyObj('DictHttpService', ['getDictInfoList']);
    dictHttpServiceSpy.getDictInfoList.and.returnValue(of([{ title: 'testTitle', description: 'testDescription' }]));

    const mockDialog = {
        close: () => {
            return;
        },
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule, ReactiveFormsModule],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {},
                },
                { provide: MatDialogRef, useValue: mockDialog },
                { provide: DictHttpService, useValue: dictHttpServiceSpy },
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
            dictTitle: DEFAULT_DICTIONARY_TITLE,
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
            dictTitle: DEFAULT_DICTIONARY_TITLE,
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
            dictTitle: DEFAULT_DICTIONARY_TITLE,
        };
        component.soloGameSettingsForm.setValue(setting);
        expect(component.settings).toEqual(setting);
    });

    it('playGame should close the dialog', () => {
        spyOn(mockDialog, 'close');
        component.soloGameSettingsForm.setValue({
            playerName: '',
            botDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
            dictTitle: 'testTitle',
        });
        component.playGame();
        expect(mockDialog.close).toHaveBeenCalled();
    });

    it('playGame should set error if dict deleted', () => {
        spyOn(mockDialog, 'close');
        component.soloGameSettingsForm.setValue({
            playerName: '',
            botDifficulty: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
            dictTitle: 'notTestTitle',
        });
        component.playGame();
        expect(mockDialog.close).not.toHaveBeenCalled();
    });

    it('cancel should close the dialog and reset form', () => {
        const setting = {
            playerName: 'samuel',
            botDifficulty: 'easy',
            timePerTurn: 60000,
            randomBonus: true,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
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
            dictTitle: '',
        });
    });
});
