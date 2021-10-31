import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { ConvertToSoloFormComponent } from './convert-to-solo-form.component';

describe('ConvertToSoloFormComponent', () => {
    let component: ConvertToSoloFormComponent;
    let fixture: ComponentFixture<ConvertToSoloFormComponent>;

    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FormsModule, ReactiveFormsModule, BrowserAnimationsModule, AppMaterialModule],

            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: mockDialogRef },
            ],
            declarations: [ConvertToSoloFormComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ConvertToSoloFormComponent);
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
        expect(component.botDifficulty.valid).toBeFalse();
        expect(spy.calls.count()).toBe(0);
    });

    it('startGame should call sendParameter', () => {
        const dom = fixture.nativeElement as HTMLElement;
        const startGameButton = dom.querySelectorAll('button')[1];
        component.botDifficulty.setValue('easy');
        component.botDifficulty.updateValueAndValidity();
        fixture.detectChanges();
        spyOn(component, 'sendParameter');
        startGameButton.click();
        fixture.detectChanges();
        expect(component.botDifficulty.valid).toBeTrue();
        expect(component.sendParameter).toHaveBeenCalled();
    });

    it('startGame should close the dialog', () => {
        component.sendParameter();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('cancel should close the dialog and reset form', () => {
        component.botDifficulty.setValue('easy');
        component.cancel();
        expect(mockDialogRef.close).toHaveBeenCalled();
        expect(component.botDifficulty.value).toEqual(null);
    });
});
