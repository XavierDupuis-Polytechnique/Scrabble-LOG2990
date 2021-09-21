/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NewSoloGameFormComponent } from './new-solo-game-form.component';

describe('NewSoloGameFormComponent', () => {
    let component: NewSoloGameFormComponent;
    let fixture: ComponentFixture<NewSoloGameFormComponent>;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [MatDialogModule],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {},
                },
                { provide: MatDialogRef, useValue: {} },
            ],
            declarations: [NewSoloGameFormComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(NewSoloGameFormComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
