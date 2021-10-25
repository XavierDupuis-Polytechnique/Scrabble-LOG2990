import { ChangeDetectorRef } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderModule } from '@angular/material/slider';
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

    beforeEach(() => {
        gameManagerServiceSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        actionValidatorServiceSpy = jasmine.createSpyObj('ActionValidatorService', ['sendAction']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
    });
    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [GamePageComponent, SidebarComponent],
            imports: [RouterTestingModule, MatSliderModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: ActionValidatorService, useValue: actionValidatorServiceSpy },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should call function stopGame if button "Abandonner la partie" is pressed', () => {
        component.abandonner();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalled();
    });

    it('should call function sendAction if button "Passer" is pressed', () => {
        component.pass();
        expect(actionValidatorServiceSpy.sendAction).toHaveBeenCalled();
    });
});
