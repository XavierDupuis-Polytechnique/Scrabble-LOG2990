import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterCreator } from '@app/GameLogic/game/board/letter-creator';
import { GameInfoService } from '@app/GameLogic/game/game-info/game-info.service';
import { User } from '@app/GameLogic/player/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { InfoBoxComponent, MILISECONDS_IN_MINUTE } from './info-box.component';

class MockGameInfoService {
    user: User;
    timeLeft$: number;
    players = [
        { name: 'P1', points: 120, letterRack: [{ char: 'A', value: 1 }] },
        { name: 'P2', points: 0, letterRack: [{ char: 'A', value: 1 }] },
    ];
    activePlayer = this.players[0];
    getPlayerScore(index: number): number {
        return this.players[index].points;
    }
    get numberOfPlayers(): number {
        return this.players.length;
    }
    get timeLeftForTurn(): Observable<number | undefined> {
        const t = new BehaviorSubject<number | undefined>(undefined);
        t.next(2000);
        return t;
    }
    get numberOfLettersRemaining(): number {
        return LetterCreator.defaultNumberOfLetters;
    }

    get winner() {
        return [this.players[0]];
    }
}

const testMock: MockGameInfoService = new MockGameInfoService();
describe('InfoBoxComponent', () => {
    let component: InfoBoxComponent;
    let fixture: ComponentFixture<InfoBoxComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [InfoBoxComponent],
            providers: [{ provide: GameInfoService, useValue: testMock }],
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

    it('timeLeft$ should be defined', () => {
        component.ngOnInit();
        expect(component.timeLeft$).toBeTruthy();
    });

    it('showWinner should return the right winner string', () => {
        expect(component.showWinner()).toBe('P1');
    });

    it('showWinner should show multiple winner', () => {
        spyOnProperty(testMock, 'winner').and.returnValue([{ name: 'sam' }, { name: 'test'}]);
        expect(component.showWinner()).toBe('sam et test');
    });

    it('timerIsLessThenOneMinute should return true', () => {
        testMock.timeLeft$ = MILISECONDS_IN_MINUTE / 2;
        expect(component.timerIsLessOneMinute(testMock.timeLeft$)).toBeTruthy();
    });

    it('timerIsLessThenOneMinute should return false', () => {
        testMock.timeLeft$ = 2 * MILISECONDS_IN_MINUTE;
        expect(component.timerIsLessOneMinute(testMock.timeLeft$)).toBeFalse();
    });
});
