import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { routes } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { AbandonDialogComponent } from './abandon-dialog.component';

describe('AbandonDialogComponent', () => {
    const mockDialogRef = {
        close: jasmine.createSpy('close'),
    };

    let component: AbandonDialogComponent;
    let fixture: ComponentFixture<AbandonDialogComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

    beforeEach(() => {
        gameManagerServiceSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    });

    beforeEach(async () => {
        TestBed.configureTestingModule({
            declarations: [AbandonDialogComponent],
            imports: [RouterTestingModule.withRoutes(routes), AppMaterialModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: MatDialogRef, useValue: mockDialogRef },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AbandonDialogComponent);
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
