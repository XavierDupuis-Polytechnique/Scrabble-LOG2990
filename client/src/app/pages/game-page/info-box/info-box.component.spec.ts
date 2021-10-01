import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { User } from '@app/GameLogic/player/user';
import { Observable } from 'rxjs';
import { InfoBoxComponent } from './info-box.component';

class MockGameInfoService {
    user: User;
    players = [
        { name: 'P1', points: 0, letterRack: [{ char: 'A', value: 1 }] },
        { name: 'P2', points: 0, letterRack: [{ char: 'A', value: 1 }] },
    ];
    activePlayer = this.players[0];
    getPlayerScore(index: number): number {
        return this.players[index].points;
    }
    get numberOfPlayers(): number {
        return this.players.length;
    }
    get timeLeftForTurn(): Observable<number> {
        return new Observable<number>();
    }
    get numberOfLettersRemaining(): number {
        return LetterCreator.defaultNumberOfLetters;
    }
}

describe('InfoBoxComponent', () => {
    let component: InfoBoxComponent;
    let fixture: ComponentFixture<InfoBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InfoBoxComponent],
            providers: [{ provide: GameInfoService, useClass: MockGameInfoService }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(InfoBoxComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
