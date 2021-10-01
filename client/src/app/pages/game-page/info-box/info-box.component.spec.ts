import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { Game } from '@app/GameLogic/game/games/game';
import { Player } from '@app/GameLogic/player/player';
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
    receiveGame(game: Game): void {
        throw new Error('Method not implemented.');
    }
    receiveUser(user: User): void {
        throw new Error('Method not implemented.');
    }
    getPlayer(index: number): Player {
        throw new Error('Method not implemented.');
    }
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
