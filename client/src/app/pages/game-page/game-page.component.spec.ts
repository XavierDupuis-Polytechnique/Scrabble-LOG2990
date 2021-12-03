/* eslint-disable dot-notation */
// eslint-disable-next-line max-classes-per-file
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { DisconnectedFromServerComponent } from '@app/components/modals/disconnected-from-server/disconnected-from-server.component';
import { ActionValidatorService } from '@app/game-logic/actions/action-validator/action-validator.service';
import { UIExchange } from '@app/game-logic/actions/ui-actions/ui-exchange';
import { UIInputControllerService } from '@app/game-logic/actions/ui-actions/ui-input-controller.service';
import { UIPlace } from '@app/game-logic/actions/ui-actions/ui-place';
import { BoardService } from '@app/game-logic/game/board/board.service';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { InputType, UIInput } from '@app/game-logic/interfaces/ui-input';
import { Player } from '@app/game-logic/player/player';
import { PointCalculatorService } from '@app/game-logic/point-calculator/point-calculator.service';
import { WordSearcher } from '@app/game-logic/validator/word-search/word-searcher.service';
import { routes } from '@app/modules/app-routing.module';
import { AppMaterialModule } from '@app/modules/material.module';
import { GamePageComponent } from '@app/pages/game-page/game-page.component';
import { Observable, Subject } from 'rxjs';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let gameManagerServiceSpy: jasmine.SpyObj<GameManagerService>;
    let cdRefSpy: jasmine.SpyObj<ChangeDetectorRef>;
    let uiInput: UIInput;
    let mockObservableDisconnect: Subject<void>;
    let mockObservableForfeited: Subject<void>;
    let mockEndOfGame$: Subject<void>;
    let mockClosedModal$: Subject<void>;
    let mockInfo: jasmine.SpyObj<GameInfoService>;
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
        get canBeExecuted() {
            return true;
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
        gameManagerServiceSpy = jasmine.createSpyObj(
            'GameManagerService',
            ['stopGame', 'instanciateGameFromForfeitedState', 'startConvertedGame'],
            ['disconnectedFromServer$', 'forfeitGameState$'],
        );
        cdRefSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);
        mockObservableDisconnect = new Subject<void>();
        mockObservableForfeited = new Subject<void>();
        mockEndOfGame$ = new Subject<void>();
        mockInfo = jasmine.createSpyObj('GameInfoService', [], ['user', 'activePlayer', 'isEndOfGame', 'isEndOfGame$', 'winner']);
        await TestBed.configureTestingModule({
            declarations: [GamePageComponent, DisconnectedFromServerComponent],
            imports: [RouterTestingModule.withRoutes(routes), AppMaterialModule, CommonModule],
            providers: [
                { provide: GameManagerService, useValue: gameManagerServiceSpy },
                { provide: ActionValidatorService, useClass: ActionValidatorServiceMock },
                { provide: ChangeDetectorRef, useValue: cdRefSpy },
                { provide: MatDialog, useClass: MatDialogMock },
                { provide: UIInputControllerService, useClass: UIInputControllerServiceMock },
                { provide: GameInfoService, useValue: mockInfo },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        (
            Object.getOwnPropertyDescriptor(gameManagerServiceSpy, 'disconnectedFromServer$')?.get as jasmine.Spy<() => Observable<void>>
        ).and.returnValue(mockObservableDisconnect);
        (Object.getOwnPropertyDescriptor(gameManagerServiceSpy, 'forfeitGameState$')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(
            mockObservableForfeited,
        );
        (Object.getOwnPropertyDescriptor(mockInfo, 'isEndOfGame$')?.get as jasmine.Spy<() => Observable<void>>).and.returnValue(mockEndOfGame$);

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
        const dialogSpy = spyOn(component['dialog'], 'open');
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

    it('should open the DisconnectedModal when calling the openDisconnected method', () => {
        component['dialogRef'] = undefined;
        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledOnceWith();
        expect(component['dialogRef']).toBeDefined();
        mockClosedModal$.next();
        expect(component['dialogRef']).toBeUndefined();
    });

    it('should not open the DisconnectedModal a second time when calling the openDisconnected method if the modal is opened', () => {
        component['dialogRef'] = undefined;
        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledOnceWith();
        expect(component['dialogRef']).toBeDefined();

        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledOnceWith();
        expect(component['dialogRef']).toBeDefined();
    });

    it('should open the DisconnectedModal a second time when calling the openDisconnected method if the modal was closed', () => {
        component['dialogRef'] = undefined;
        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledTimes(1);
        expect(component['dialogRef']).toBeDefined();

        mockClosedModal$.next();
        expect(component['dialogRef']).toBeUndefined();

        component.openDisconnected();
        expect(gameManagerServiceSpy.stopGame).toHaveBeenCalledTimes(2);
        expect(component['dialogRef']).toBeDefined();
    });

    it('should open disconnected modal', () => {
        const spy = spyOn(component, 'openDisconnected');
        mockObservableDisconnect.next();
        expect(spy).toHaveBeenCalled();
    });

    it('#isItMyTurn should work properly', () => {
        const mockUser = {} as unknown as Player;
        mockInfo.user = mockUser;
        (Object.getOwnPropertyDescriptor(mockInfo, 'activePlayer')?.get as jasmine.Spy<() => Player>).and.returnValue(mockUser);
        expect(component.isItMyTurn).toBeFalse();
        (Object.getOwnPropertyDescriptor(mockInfo, 'isEndOfGame')?.get as jasmine.Spy<() => boolean>).and.returnValue(true);
        expect(component.isItMyTurn).toBeFalse();
        (Object.getOwnPropertyDescriptor(mockInfo, 'isEndOfGame')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);
        (Object.getOwnPropertyDescriptor(mockInfo, 'activePlayer')?.get as jasmine.Spy<() => Player>).and.throwError('error');
        expect(component.isItMyTurn).toBeFalse();
    });

    it('#isEndOfGame should work properly', () => {
        const mockPlayer = { name: 'allo' } as unknown as Player;
        (Object.getOwnPropertyDescriptor(mockInfo, 'winner')?.get as jasmine.Spy<() => Player[]>).and.returnValue([mockPlayer]);
        (Object.getOwnPropertyDescriptor(mockInfo, 'user')?.get as jasmine.Spy<() => Player>).and.returnValue(mockPlayer);
        mockEndOfGame$.next();
        (Object.getOwnPropertyDescriptor(mockInfo, 'isEndOfGame')?.get as jasmine.Spy<() => boolean>).and.returnValue(false);
        expect(component.isEndOfGame).toBeFalse();
    });

    it('should receive forfeited game state properly', () => {
        mockObservableForfeited.next();
        mockClosedModal$.next();
        expect(gameManagerServiceSpy.instanciateGameFromForfeitedState).toHaveBeenCalled();
        expect(gameManagerServiceSpy.startConvertedGame).toHaveBeenCalled();
    });

    it('canPlace coverage', () => {
        const spyWordSearcher: jasmine.SpyObj<WordSearcher> = jasmine.createSpyObj('WordSearcher', ['']);
        const spyGameInfo: jasmine.SpyObj<GameInfoService> = jasmine.createSpyObj('WordSearcher', ['']);
        const spyPointCalc: jasmine.SpyObj<PointCalculatorService> = jasmine.createSpyObj('WordSearcher', ['']);
        const spyBoard: jasmine.SpyObj<BoardService> = jasmine.createSpyObj('WordSearcher', ['']);

        spyOnProperty(component, 'isItMyTurn').and.returnValue(true);
        component['inputController'].activeAction = new UIPlace(spyGameInfo, spyPointCalc, spyWordSearcher, spyBoard);
        const ans = component.canPlace;
        expect(ans as unknown).toEqual(true);
    });

    it('canExchange coverage', () => {
        const spyPlayer: jasmine.SpyObj<Player> = jasmine.createSpyObj('Player', ['']);
        component['inputController'].activeAction = new UIExchange(spyPlayer);
        const ans = component.canExchange;
        expect(ans as unknown).toEqual(false);
    });
});
