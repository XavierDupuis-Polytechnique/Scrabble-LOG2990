import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';
import { AppMaterialModule } from '@app/modules/material.module';
import { HorseComponent } from './horse.component';

const mockPlayers: Player[] = [new User('Tim'), new User('George')];
mockPlayers[0].letterRack = [{ char: 'A', value: 3 }];

class MockGameManagerService {
    game = {
        players: mockPlayers,
    };
}

const testSpy: jasmine.SpyObj<GameInfoService> = jasmine.createSpyObj('GameInfoService', ['getPlayer'], { user: { letterRack: 3 } });

describe('HorseComponent', () => {
    let component: HorseComponent;
    let fixture: ComponentFixture<HorseComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, CommonModule],
            declarations: [HorseComponent],
            providers: [
                { provide: GameManagerService, useClass: MockGameManagerService },
                { provide: GameInfoService, useValue: testSpy },
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(HorseComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialise player rack', () => {
        component.ngAfterContentInit();
        expect(component.playerRack).toBeDefined();
    });
});
