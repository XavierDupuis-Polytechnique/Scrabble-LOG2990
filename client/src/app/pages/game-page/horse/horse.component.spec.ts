import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameManagerService } from '@app/GameLogic/game/games/game-manager.service';
import { Player } from '@app/GameLogic/player/player';
import { User } from '@app/GameLogic/player/user';

import { HorseComponent } from './horse.component';

const mockPlayers: Player[] = [new User('Tim'), new User('George')];
mockPlayers[0].letterRack = [{ char: 'A', value: 3 }];

class MockGameManagerService {
    game = {
        players: mockPlayers,
    };
}

describe('HorseComponent', () => {
    let component: HorseComponent;
    let fixture: ComponentFixture<HorseComponent>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HorseComponent],
            providers: [{ provide: GameManagerService, useClass: MockGameManagerService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HorseComponent);
        component = fixture.componentInstance;
        // fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
