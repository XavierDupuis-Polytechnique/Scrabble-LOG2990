/* eslint-disable dot-notation */
// eslint-disable-next-line max-classes-per-file
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { ActionValidatorService } from '@app/GameLogic/actions/action-validator.service';
import { UIInputControllerService } from '@app/GameLogic/actions/ui-actions/ui-input-controller.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { InputType, UIInput } from '@app/GameLogic/interface/ui-input';
import { routes } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { DisconnectedFromServerComponent } from '@app/pages/classic-game/modals/disconnected-from-server/disconnected-from-server.component';
import { Observable, Subject } from 'rxjs';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
    let uiInput: UIInput;
    let mockObservableDisconnect: Subject<void>;
    let mockClosedModal$: Subject<void>;
    class ActionValidatorServiceMock {
        sendAction() {
            return;
        }
    }
    class UIInputControllerServiceMock {
        receive() {
            return;
        }
        confirm() {
            return;
        }
        cancel() {
            return;
        }
        pass() {
            return;
        }
    }

    class MatDialogMock {
        open() {
            return {
                // eslint-disable-next-line prefer-arrow/prefer-arrow-functions
                afterClosed() {
                    return mockClosedModal$.asObservable();
                },
            };
        }
    }

    beforeEach(async () => {
        mockClosedModal$ = new Subject();
        gameManagerServiceSpy = jasmine.createSpyObj('GameManagerService', ['stopGame'], ['disconnectedFromServer$']);
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        mockObservableDisconnect = new Subject<void>();
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, DisconnectedFromServerComponent],
            imports: [RouterTestingModule.withRoutes(routes), AppMaterialModule, CommonModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: ActionValidatorService, useClass: ActionValidatorServiceMock },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: UIInputControllerService, useClass: UIInputControllerServiceMock },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        (
            Object.getOwnPropertyDescriptor(gameManagerServiceSpy, 'disconnectedFromServer$')?.get as jasmine.Spy<() => Observable<void>>
        ).and.returnValue(mockObservableDisconnect);

        fixture = TestBed.createComponent(GamePageComponent);
        uiInput = { type: InputType.LeftClick };
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('A keypress should call receive', () => {
        const inputControllerSpy = spyOn(component['inputController'], 'receive');
        const keyEvent = new KeyboardEvent('keydown', { code: 'KeyA' });
        component.keypressEvent(keyEvent);
        expect(inputControllerSpy).toBeTruthy();
    });

    it('An input should call receive', () => {
        const inputControllerSpy = spyOn(component['inputController'], 'receive');
        component.receiveInput(uiInput);
        expect(inputControllerSpy).toBeTruthy();
    });

    it('confirming to abandon should open dialog', () => {
        const dialogSpy = spyOn(component.dialog, 'open');
        component.abandon();
        expect(dialogSpy).toHaveBeenCalled();
    });

    it('confirming to quit should call method stopgame', () => {
        component.quit();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalled();
    });

    it('should call function sendAction if button "Passer" is pressed', () => {
        const inputControllerSpy = spyOn(component['inputController'], 'pass');
        component.pass();
        expect(inputControllerSpy).toHaveBeenCalled();
    });

    it('should call confirm', () => {
        const inputControllerSpy = spyOn(component['inputController'], 'confirm');
        component.confirm();
        expect(inputControllerSpy).toBeTruthy();
    });

    it('should call cancel', () => {
        const inputControllerSpy = spyOn(component['inputController'], 'cancel');
        component.cancel();
        expect(inputControllerSpy).toHaveBeenCalled();
    });

    it('should call cancel', () => {
        const inputControllerSpy = spyOn(component['inputController'], 'cancel');
        component.cancel();
        expect(inputControllerSpy).toHaveBeenCalled();
    });

    it('should open the DisconnectedModal when calling the openDisconnected method', () => {
        component.dialogRef = undefined;
        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledOnceWith();
        expect(component.dialogRef).toBeDefined();
        mockClosedModal$.next();
        expect(component.dialogRef).toBeUndefined();
    });

    it('should not open the DisconnectedModal a second time when calling the openDisconnected method if the modal is opened', () => {
        component.dialogRef = undefined;
        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledOnceWith();
        expect(component.dialogRef).toBeDefined();

        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledOnceWith();
        expect(component.dialogRef).toBeDefined();
    });

    it('should open the DisconnectedModal a second time when calling the openDisconnected method if the modal was closed', () => {
        component.dialogRef = undefined;
        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledTimes(1);
        expect(component.dialogRef).toBeDefined();

        mockClosedModal$.next();
        expect(component.dialogRef).toBeUndefined();

        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledTimes(2);
        expect(component.dialogRef).toBeDefined();
    });
});
