/* tslint:disable:no-unused-variable */
import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing';
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { routes } from '@app/modules/app-routing.module';
import { AbandonButtonComponent } from './abandon-button.component';

describe('AbandonButtonComponent', () => {
    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };

    let component: AbandonButtonComponent;
    let fixture: ComponentFixture<AbandonButtonComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

    beforeEach(() => {
        gameManagerServiceSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    });

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AbandonButtonComponent],
            imports: [RouterTestingModule.withRoutes(routes), MatDialogModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
                { provide: LocationStrategy, useClass: MockLocationStrategy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AbandonButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call function stopGame if button "Abandonner la partie" is pressed', () => {
        component.abandon();
        fixture.detectChanges();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalled();
    });

    it('nothing should happen if we close the dialog', () => {
        component.closeDialog();
        fixture.detectChanges();
        expect(mockDialogRef.close).toHaveBeenCalled();
    });
});
