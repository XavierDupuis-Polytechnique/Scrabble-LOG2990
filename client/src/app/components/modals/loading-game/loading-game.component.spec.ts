import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppMaterialModule } from '@app/modules/material.module';
import { LoadingGameComponent } from './loading-game.component';

const mockDialogRef = {
    close: jasmine.createSpy('close'),
};

describe('LoadingGameComponent', () => {
    let component: LoadingGameComponent;
    let fixture: ComponentFixture<LoadingGameComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(async () => {
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            imports: [BrowserAnimationsModule, AppMaterialModule],
            declarations: [LoadingGameComponent],
            providers: [
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: MatDialog, useValue: matDialog },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoadingGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should cancel', () => {
        component.cancel();
        expect(component.isCanceled).toBeTruthy();
    });
});
