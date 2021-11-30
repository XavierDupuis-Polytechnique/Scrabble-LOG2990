import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { routes } from '@app/modules/app-routing.module';
import { of } from 'rxjs';
import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
    let component: HomepageComponent;
    let fixture: ComponentFixture<HomepageComponent>;
    class MatDialogMock {
        open() {
            return {
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                afterClosed() {
                    return of();
                },
            };
        }
    }
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)],
            providers: [{ provide: MatDialog, useClass: MatDialogMock }],
            declarations: [HomepageComponent],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(HomepageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should open mat-dialog', () => {
        // eslint-disable-next-line dot-notation
        spyOn(component['matDialog'], 'open');
        component.openLeaderboard();
        // eslint-disable-next-line dot-notation
        expect(component['matDialog'].open).toHaveBeenCalled();
    });
});
