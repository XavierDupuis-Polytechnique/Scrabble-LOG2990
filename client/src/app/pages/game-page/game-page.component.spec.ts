// eslint-disable-next-line max-classes-per-file
import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { SidebarComponent } from '@app/components/sidebar/sidebar.component';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { of } from 'rxjs';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
    class ActionValidatorServiceMock {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        sendAction() {}
    }
    class MatDialogMock {
        open() {
            return {
                afterClosed: () => of({}),
            };
        }
    }
    beforeEach(() => {
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    });

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent],
            imports: [RouterTestingModule, MatDialogModule, BrowserAnimationsModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: ActionValidatorService, useClass: ActionValidatorServiceMock },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
                { provide: MatDialog, useClass: MatDialogMock },
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

    it('confirming to abandon should call method stopgame', () => {
        const gameManagerSpy = spyOn(component.matDialog, 'open');
        component.abandon();
        expect(gameManagerSpy).toHaveBeenCalled();
    });

    it('should call function sendAction if button "Passer" is pressed', () => {
        // eslint-disable-next-line dot-notation
        const actionValidatorSpy = spyOn(component['avs'], 'sendAction');
        component.pass();
        expect(actionValidatorSpy).toHaveBeenCalled();
    });
});
