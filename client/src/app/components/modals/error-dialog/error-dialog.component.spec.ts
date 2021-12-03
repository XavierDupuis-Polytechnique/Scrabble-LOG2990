import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { ErrorDialogComponent } from './error-dialog.component';

const mockDialogRef = {
    close: jasmine.createSpy('close').and.returnValue(() => {
        return;
    }),
};

describe('ErrorDialogComponent', () => {
    let component: ErrorDialogComponent;
    let fixture: ComponentFixture<ErrorDialogComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: {} },
                { provide: MatDialogRef, useValue: mockDialogRef },
            ],
            declarations: [ErrorDialogComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ErrorDialogComponent);
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
});
