import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DEFAULT_DICTIONARY_TITLE, DEFAULT_TIME_PER_TURN } from '@app/game-logic/constants';
import { AppMaterialModule } from '@app/modules/material.module';
import { DictHttpService } from '@app/services/dict-http.service';
import { of } from 'rxjs';
import { NewOnlineGameFormComponent } from './new-online-game-form.component';

describe('NewOnlineGameFormComponent', () => {
    let component: NewOnlineGameFormComponent;
    let fixture: ComponentFixture<NewOnlineGameFormComponent>;
    const dictHttpServiceSpy = jasmine.createSpyObj('DictHttpService', ['getDictInfoList']);
    dictHttpServiceSpy.getDictInfoList.and.returnValue(of([{ title: 'testTitle', description: 'testDescription' }]));

    const mockDialog = {
        close: () => {
            return;
        },
    };

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppMaterialModule],
                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: mockDialog },
                    { provide: DictHttpService, useValue: dictHttpServiceSpy },
                ],
                declarations: [NewOnlineGameFormComponent],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(NewOnlineGameFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call cancel method on button cancel pressed', () => {
        const domElement = fixture.nativeElement as HTMLElement;
        const cancelButton = domElement.querySelectorAll('button')[0];
        spyOn(component, 'cancel');
        cancelButton.click();
        expect(component.cancel).toHaveBeenCalled();
    });

    it('play should not be responsive if form not complete', () => {
        const domElement = fixture.nativeElement as HTMLElement;
        const cancelButton = domElement.querySelectorAll('button')[0];
        const spy = spyOn(component, 'playGame');
        cancelButton.click();
        expect(spy.calls.count()).toBe(0);
    });

    it('play should call playGame if form complete and button pressed', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const playButton = dom.querySelectorAll('button')[1];

        component.onlineGameSettingsUIForm.setValue({
            playerName: 'samuel',
            timePerTurn: 60000,
            randomBonus: true,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            dictDesc: '',
        });
        component.onlineGameSettingsUIForm.updateValueAndValidity();
        fixture.detectChanges();
        spyOn(component, 'playGame');
        playButton.click();
        fixture.detectChanges();
        expect(component.playGame).toHaveBeenCalled();
    });

    it('setting should return group form value', () => {
        const settings = {
            playerName: 'samuel',
            timePerTurn: 60000,
            randomBonus: true,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            dictDesc: '',
        };
        component.onlineGameSettingsUIForm.setValue(settings);
        expect(component.onlineGameSettingsUIForm.value).toEqual(settings);
    });

    it('playGame should close the dialog', () => {
        spyOn(mockDialog, 'close');
        component.onlineGameSettingsUIForm.setValue({
            playerName: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
            dictTitle: 'testTitle',
            dictDesc: '',
        });
        component.playGame();
        expect(mockDialog.close).toHaveBeenCalled();
    });

    it('cancel should close the dialog and reset form', () => {
        const setting = {
            playerName: 'samuel',
            timePerTurn: 60000,
            randomBonus: true,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            dictDesc: '',
        };
        component.onlineGameSettingsUIForm.setValue(setting);
        spyOn(mockDialog, 'close');
        component.cancel();
        expect(mockDialog.close).toHaveBeenCalled();
        expect(component.onlineGameSettingsUIForm.value).toEqual({
            playerName: '',
            timePerTurn: DEFAULT_TIME_PER_TURN,
            randomBonus: false,
            dictTitle: DEFAULT_DICTIONARY_TITLE,
            dictDesc: '',
        });
    });

    it('should return the description', () => {
        component.dictList = [{ title: 'testTitle', description: 'testDesc', canEdit: true }];
        expect(component.getDescription('testTitle')).toEqual('testDesc');
    });

    it('should return empty string if not found', () => {
        component.dictList = [{ title: 'testTitle', description: 'testDesc', canEdit: true }];
        expect(component.getDescription('testTitle2')).toEqual('');
    });

    it('playGame should not close dialog if error with server', () => {
        const setting = {
            playerName: 'samuel',
            timePerTurn: 60000,
            randomBonus: true,
            dictTitle: 'deletedTitle',
            dictDesc: '',
        };
        component.onlineGameSettingsUIForm.setValue(setting);

        component.playGame();
        const spy = spyOn(mockDialog, 'close');
        expect(spy).not.toHaveBeenCalled();
    });
});
