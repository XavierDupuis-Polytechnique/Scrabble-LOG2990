import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { WinnerDialogComponent, WinnerDialogData } from './winner-dialog.component';

const mockDialogRef = {
    close: jasmine.createSpy('close').and.returnValue(() => {
        return;
    }),
};

describe('WinnerDialogComponent', () => {
    let component: WinnerDialogComponent;
    let fixture: ComponentFixture<WinnerDialogComponent>;
    let data: WinnerDialogData;
    beforeEach(async () => {
        data = {
            winnerNames: [],
            isWinner: false,
        };
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [WinnerDialogComponent],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: data },
                { provide: MatDialogRef, useValue: mockDialogRef },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WinnerDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('close should close the dialog', () => {
        component.close();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });

    it('should get the correct winner names', () => {
        data.winnerNames = ['a', 'b'];
        expect(component.getWinnerMessage()).toBe('Les gagnants de la partie sont a et b');
        data.winnerNames = ['a'];
        expect(component.getWinnerMessage()).toBe('Le gagnant de la partie est a');
    });

    it('should get the correct congratulation message', () => {
        data.isWinner = true;
        expect(component.getCongratulationMessage()).toBe('Félicitation!');
        data.isWinner = false;
        expect(component.getCongratulationMessage()).toBe('Dommage...');
    });
});
