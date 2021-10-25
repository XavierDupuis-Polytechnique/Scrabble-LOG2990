/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerInfoComponent } from './player-info.component';

describe('PlayerInfoComponent', () => {
    let component: PlayerInfoComponent;
    let fixture: ComponentFixture<PlayerInfoComponent>;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;

    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule],
            declarations: [PlayerInfoComponent],
            providers: [{ provide: GameManagerService, useValue: gameManagerSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayerInfoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
