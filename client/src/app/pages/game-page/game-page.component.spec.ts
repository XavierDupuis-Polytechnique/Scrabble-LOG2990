import { LocationStrategy } from '@angular/common';
import { MockLocationStrategy } from '@angular/common/testing'; // Remove error @injectable
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let actionValidatorServiceSpy: jasmine.SpyObj<ActionValidatorService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;

    beforeEach(async () => {
        gameManagerServiceSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        actionValidatorServiceSpy = jasmine.createSpyObj('ActionValidatorService', ['sendAction']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent],
            imports: [RouterTestingModule, AppMaterialModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: ActionValidatorService, useValue: actionValidatorServiceSpy },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
                { provide: LocationStrategy, useClass: MockLocationStrategy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
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
