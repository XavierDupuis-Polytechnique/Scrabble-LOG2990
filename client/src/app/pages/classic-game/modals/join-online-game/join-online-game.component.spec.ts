import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { JoinOnlineGameComponent } from './join-online-game.component';

describe('JoinOnlineGameComponent', () => {
    let component: JoinOnlineGameComponent;
    let fixture: ComponentFixture<JoinOnlineGameComponent>;

    const mockDialogRef = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        close: jasmine.createSpy('close').and.returnValue(() => {}),
    };
    const mockOnlineGameService = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        joinPendingGame: jasmine.createSpy('onlineService').and.returnValue(() => {}),
    };
    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppMaterialModule],

                providers: [
                    { provide: MAT_DIALOG_DATA, useValue: {} },
                    { provide: MatDialogRef, useValue: mockDialogRef },
                    { provide: OnlineGameInitService, useValue: mockOnlineGameService },
                ],
                declarations: [JoinOnlineGameComponent],
                schemas: [CUSTOM_ELEMENTS_SCHEMA],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(JoinOnlineGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('cancel', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const cancelButton = dom.querySelectorAll('button')[0];
        spyOn(component, 'cancel');
        cancelButton.click();
        expect(component.cancel).toHaveBeenCalled();
    });

    it('startGame not responsive when form not complete', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const startGameButton = dom.querySelectorAll('button')[1];
        const spy = spyOn(component, 'sendParameter');
        startGameButton.click();
        expect(component.oppName.valid).toBeFalse();
        expect(spy.calls.count()).toBe(0);
    });

    it('startGame not responsive if second player name is playerName', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const startGameButton = dom.querySelectorAll('button')[1];
        component.playerName = 'Simon';
        component.oppName.setValue('Simon');
        component.oppName.updateValueAndValidity();
        fixture.detectChanges();
        expect(component.oppName.valid).toBeFalse();
        const spy = spyOn(component, 'sendParameter');
        startGameButton.click();
        fixture.detectChanges();
        expect(spy.calls.count()).toBe(0);
    });

    it('startGame should call sendParameter', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const startGameButton = dom.querySelectorAll('button')[1];
        component.oppName.setValue('easy');
        component.oppName.updateValueAndValidity();
        fixture.detectChanges();
        spyOn(component, 'sendParameter');
        startGameButton.click();
        fixture.detectChanges();
        expect(component.oppName.valid).toBeTrue();
        expect(component.sendParameter).toHaveBeenCalled();
    });

    it('startGame should close the dialog', () => {
        component.sendParameter();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('cancel should close the dialog and reset form', () => {
        component.oppName.setValue('Max');
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
        expect(component.oppName.value).toEqual(null);
    });
});
