import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AppMaterialModule } from '@app/modules/material.module';
import { AlertDialogComponent } from './alert-dialog.component';

describe('AlertDialogComponent', () => {
    let component: AlertDialogComponent;
    let fixture: ComponentFixture<AlertDialogComponent>;
    const matDialog: jasmine.SpyObj<MatDialog> = jasmine.createSpyObj('MatDialog', ['open']);
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AlertDialogComponent],
            imports: [AppMaterialModule],
            providers: [
                { provide: MatDialog, useValue: matDialog },
                { provide: MAT_DIALOG_DATA, useValue: String },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AlertDialogComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
