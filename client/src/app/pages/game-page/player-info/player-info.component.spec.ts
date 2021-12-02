/* eslint-disable dot-notation */
/* tslint:disable:no-unused-variable */
import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { Game } from '@app/game-logic/game/games/game';
import { GameManagerService } from '@app/game-logic/game/games/game-manager/game-manager.service';
import { Player } from '@app/game-logic/player/player';
import { AppMaterialModule } from '@app/modules/material.module';
import { PlayerInfoComponent } from './player-info.component';

describe('PlayerInfoComponent', () => {
    let component: PlayerInfoComponent;
    let fixture: ComponentFixture<PlayerInfoComponent>;
    let gameManagerSpy: jasmine.SpyObj<GameManagerService>;
    let info: jasmine.SpyObj<GameInfoService>;
    beforeEach(async () => {
        gameManagerSpy = jasmine.createSpyObj('GameManagerService', ['stopGame']);
        info = jasmine.createSpyObj('GameInfoService', [], ['activePlayer', 'numberOfLettersRemaining']);
        info['game'] = {} as unknown as Game;
        const mockPlayer = {} as unknown as Player;
        info.players = [mockPlayer, mockPlayer];
        const activePlayer = {
            name: 'test',
        } as unknown as Player;
        (Object.getOwnPropertyDescriptor(info, 'numberOfLettersRemaining')?.get as jasmine.Spy<() => number>).and.returnValue(2);
        (Object.getOwnPropertyDescriptor(info, 'activePlayer')?.get as jasmine.Spy<() => Player>).and.returnValue(activePlayer);
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, CommonModule],
            declarations: [PlayerInfoComponent],
            providers: [
                { provide: GameManagerService, useValue: gameManagerSpy },
                { provide: GameInfoService, useValue: info },
            ],
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

    it('should get info properly', () => {
        expect(component.activePlayerName).toBe('test');
        expect(component.players.length).toBe(2);
        expect(component.lettersRemaining).toBe(2);
    });
});
