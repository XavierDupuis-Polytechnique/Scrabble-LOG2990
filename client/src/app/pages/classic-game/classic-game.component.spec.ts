import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NewSoloGameFormComponent } from '@app/components/new-solo-game-form/new-solo-game-form.component';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { GameSettings } from '@app/GameLogic/game/games/game-settings.interface';
import { ClassicGameComponent } from './classic-game.component';

describe('ClassicGameComponent', () => {
    let component: ClassicGameComponent;
    let fixture: ComponentFixture<ClassicGameComponent>;
    let matDialog: jasmine.SpyObj<MatDialog>;
    let router: Router;
    const gameManager = {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        createGame: () => {},
    };

    beforeEach(async () => {
        matDialog = jasmine.createSpyObj('MatDialog', ['open']);
        await TestBed.configureTestingModule({
            declarations: [ClassicGameComponent],
            imports: [RouterTestingModule, MatDialogModule, BrowserAnimationsModule, CommonModule],
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
            ],
        }).compileComponents();
    });

    beforeEach(() => {
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
                return {
                    subscribe: (func: (result: GameSettings) => void) =>
                        func({
                            botDifficulty: 'easy',
                            playerName: 'Sam',
                            timePerTurn: 3000,
                            randomBonus: false,
                        }),
                };
            },
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            close: () => {},
        } as MatDialogRef<NewSoloGameFormComponent>);
        component.openSoloGameForm();
        expect(component.gameSettings).toBeDefined();
        expect(component.startSoloGame).toHaveBeenCalled();
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
});
