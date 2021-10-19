import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let actionValidatorServiceSpy: jasmine.SpyObj<ActionValidatorService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
    let matDialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        gameManagerServiceSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        actionValidatorServiceSpy = jasmine.createSpyObj('ActionValidatorService', ['sendAction']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    });

    beforeEach(async () => {
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent],
            imports: [RouterTestingModule, MatDialogModule, BrowserAnimationsModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: ActionValidatorService, useValue: actionValidatorServiceSpy },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
                { provide: MatDialog, useValue: matDialog },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call function stopGame if button "Abandonner la partie" is pressed', () => {
        component.abandon();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalled();
    });

    it('should call function sendAction if button "Passer" is pressed', () => {
        component.pass();
        expect(actionValidatorServiceSpy.sendAction).toHaveBeenCalled();
    });
});
