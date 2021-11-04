import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HeaderBarComponent } from '@app/components/header-bar/header-bar.component';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { OnlineGameInitService } from '@app/modeMulti/online-game-init.service';
import { routes } from '@app/modules/app-routing.module';
import { ClassicGameComponent } from '@app/pages/classic-game/classic-game.component';
import { NewOnlineGameFormComponent } from '@app/pages/classic-game/modals/new-online-game-form/new-online-game-form.component';
import { WaitingForPlayerComponent } from '@app/pages/classic-game/modals/waiting-for-player/waiting-for-player.component';
import { Observable, of, Subject } from 'rxjs';

describe('ClassicGameComponent', () => {
    let component: ClassicGameComponent;
    let fixture: ComponentFixture<ClassicGameComponent>;
    const mockIsDisconnect$ = new Subject<boolean>();
    const mockGameToken$ = new Subject<string>();
    let matDialog: jasmine.SpyObj<MatDialog>;
    let onlineSocketHandlerSpy: jasmine.SpyObj<OnlineGameInitService>;
    let router: Router;
    const gameManager = {
        createGame: () => {
            return;
        },
    };

    beforeEach(async () => {
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        onlineSocketHandlerSpy = jasmine.createSpyObj(
            'OnlineGameInitService',
            ['createGameMulti', 'listenForPendingGames', 'disconnectSocket', 'joinPendingGames'],
            ['isDisconnected$', 'gameToken$'],
        );
        await TestBed.configureTestingModule({
            declarations: [ClassicGameComponent, HeaderBarComponent, MatToolbar],
            imports: [RouterTestingModule.withRoutes(routes), MatDialogModule, BrowserAnimationsModule, CommonModule],
            providers: [
                {
                    provide: MAT_DIALOG_DATA,
                    useValue: {},
                },
                {
                    provide: MatDialog,
                    useValue: matDialog,
                },
                {
                    provide: GameManagerService,
                    useValue: gameManager,
                },
                { provide: OnlineGameInitService, useValue: onlineSocketHandlerSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();

        (Object.getOwnPropertyDescriptor(onlineSocketHandlerSpy, 'isDisconnected$')?.get as jasmine.Spy<() => Observable<boolean>>).and.returnValue(
            mockIsDisconnect$,
        );
        (Object.getOwnPropertyDescriptor(onlineSocketHandlerSpy, 'gameToken$')?.get as jasmine.Spy<() => Observable<string>>).and.returnValue(
            mockGameToken$,
        );
        fixture = TestBed.createComponent(ClassicGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        router = TestBed.inject(Router);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('dialog should set game setting and start game', () => {
        spyOn(component, 'startSoloGame');
        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of({
                    botDifficulty: 'easy',
                    playerName: 'Sam',
                    timePerTurn: 3000,
                    randomBonus: false,
                });
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            close: () => {},
        } as MatDialogRef<NewSoloGameFormComponent>);
        component.openSoloGameForm();
        expect(component.gameSettings).toBeDefined();
        expect(component.startSoloGame).toHaveBeenCalled();
    });
    it('dialog should not set game setting and start game if form is undefined', () => {
        spyOn(component, 'startSoloGame');
        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of(undefined);
            },
            close: () => {
                return;
            },
        } as MatDialogRef<NewSoloGameFormComponent>);
        component.openSoloGameForm();
        expect(component.gameSettings).toBeUndefined();
        expect(component.startSoloGame).not.toHaveBeenCalled();
    });

    it('button partie solo should call openSoloGameForm', () => {
        spyOn(component, 'openSoloGameForm');
        const el = fixture.nativeElement as HTMLElement;
        const button = el.querySelector('button');
        button?.click();
        expect(component.openSoloGameForm).toHaveBeenCalled();
    });

    it('start solo game should create a game', () => {
        spyOn(gameManager, 'createGame');
        spyOn(router, 'navigate');
        component.startSoloGame();
        expect(gameManager.createGame).toHaveBeenCalled();
    });

    it('Creer partie multijoueur should call openMultiGameForm', () => {
        spyOn(component, 'openWaitingForPlayer').and.callThrough();
        const gameSettings = {
            playerName: 'Sam',
            timePerTurn: 3000,
            randomBonus: false,
        };

        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of(gameSettings);
            },
            close: () => {
                return;
            },
        } as MatDialogRef<NewOnlineGameFormComponent>);
        component.openMultiGameForm();
        expect(matDialog.open).toHaveBeenCalled();
        expect(onlineSocketHandlerSpy.createGameMulti).toHaveBeenCalledOnceWith(gameSettings);
        expect(component.openWaitingForPlayer).toHaveBeenCalled();
    });

    it('Creer partie multijoueur should call openMultiGameForm and return if form is undefined', () => {
        spyOn(component, 'openWaitingForPlayer');
        matDialog.open.and.returnValue({
            afterClosed: () => {
                return of(undefined);
            },
            close: () => {
                return;
            },
        } as MatDialogRef<WaitingForPlayerComponent>);
        component.openMultiGameForm();
        expect(matDialog.open).toHaveBeenCalled();
        expect(component.gameSettings).toBeUndefined();
        expect(onlineSocketHandlerSpy.createGameMulti).not.toHaveBeenCalled();
        expect(component.openWaitingForPlayer).not.toHaveBeenCalled();
    });

    it('openWaitingForPlayer should start solo game if bot difficulty is return', () => {
        spyOn(component, 'startSoloGame');
        component.gameSettings = {
            playerName: 'Sam',
            botDifficulty: '',
            timePerTurn: 3000,
            randomBonus: false,
        };

        matDialog.open.and.returnValue({
            afterOpened: () => {
                return of(undefined);
            },
            afterClosed: () => {
                return of('easy');
            },
            close: () => {
                return;
            },
        } as MatDialogRef<WaitingForPlayerComponent>);
        component.openWaitingForPlayer();
        const soloGameSettings = component.gameSettings;
        soloGameSettings.botDifficulty = 'easy';
        expect(matDialog.open).toHaveBeenCalled();

        expect(component.gameSettings).toEqual(soloGameSettings);
        expect(onlineSocketHandlerSpy.disconnectSocket).toHaveBeenCalled();
        expect(component.startSoloGame).toHaveBeenCalled();
    });

    it('openWaitingForPlayer should disconnectSocket if player is disconnected from server', () => {
        component.gameSettings = {
            playerName: 'Sam',
            botDifficulty: '',
            timePerTurn: 3000,
            randomBonus: false,
        };
        matDialog.open.and.returnValue({
            afterOpened: () => {
                return of(undefined);
            },
            afterClosed: () => {
                return of(undefined);
            },
            close: () => {
                return;
            },
        } as MatDialogRef<WaitingForPlayerComponent>);
        component.openWaitingForPlayer();
        onlineSocketHandlerSpy.isDisconnected$.next(true);
        expect(onlineSocketHandlerSpy.disconnectSocket).toHaveBeenCalled();
    });

    it('openWaitingForPlayer should receive game Token  from server', () => {
        component.gameSettings = {
            playerName: 'Sam',
            botDifficulty: '',
            timePerTurn: 3000,
            randomBonus: false,
        };
        matDialog.open.and.returnValue({
            afterOpened: () => {
                return of(undefined);
            },
            afterClosed: () => {
                return of(undefined);
            },
            close: () => {
                return;
            },
        } as MatDialogRef<WaitingForPlayerComponent>);
        const dialog = matDialog.open(WaitingForPlayerComponent);
        spyOn(dialog, 'close');
        component.openWaitingForPlayer();
        onlineSocketHandlerSpy.isDisconnected$.next(false);
        onlineSocketHandlerSpy.gameToken$.next('abc');
        expect(dialog.close).toHaveBeenCalled();
    });

    it('openPendingGames should open dialog', () => {
        component.openPendingGames();
        expect(matDialog.open).toHaveBeenCalled();
    });
});
