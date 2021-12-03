/* eslint-disable @typescript-eslint/no-magic-numbers */
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LetterCreator } from '@app/game-logic/game/board/letter-creator';
import { GameInfoService } from '@app/game-logic/game/game-info/game-info.service';
import { User } from '@app/game-logic/player/user';
import { AppMaterialModule } from '@app/modules/material.module';
import { BehaviorSubject, Observable } from 'rxjs';
import { InfoBoxComponent } from './info-box.component';

class MockGameInfoService {
    user: User;
    timeLeft$: number;
    players = [
        { name: 'P1', points: 120, letterRack: [{ char: 'A', value: 1 }] },
        { name: 'P2', points: 0, letterRack: [{ char: 'A', value: 1 }] },
    ];
    // eslint-disable-next-line no-invalid-this
    activePlayer = this.players[0];
    private t = new BehaviorSubject<number | undefined>(2000);
    private p = new BehaviorSubject<number | undefined>(0.1);
    getPlayerScore(index: number): number {
        return this.players[index].points;
    }
    get numberOfPlayers(): number {
        return this.players.length;
    }
    get timeLeftForTurn(): Observable<number | undefined> {
        return this.t;
    }
    get timeLeftPercentForTurn(): Observable<number | undefined> {
        return this.p;
    }
    get numberOfLettersRemaining(): number {
        return LetterCreator.defaultNumberOfLetters;
    }
    get winner() {
        return [this.players[0]];
    }
}

describe('InfoBoxComponent', () => {
    let component: InfoBoxComponent;
    let fixture: ComponentFixture<InfoBoxComponent>;
    let testMock: MockGameInfoService;
    beforeEach(async () => {
        testMock = new MockGameInfoService();
        await TestBed.configureTestingModule({
            imports: [AppMaterialModule, CommonModule],
            declarations: [InfoBoxComponent],
            providers: [{ provide: GameInfoService, useValue: testMock }],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
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

    it('should not do anything when timerleft is undefined', (done) => {
        // eslint-disable-next-line dot-notation
        testMock['t'].next(undefined);
        component.timeLeft$.subscribe((val) => {
            expect(val).toBe(undefined);
            done();
        });
    });

    it('should receive time left percent correctly', (done) => {
        component.timeLeftPercent$.subscribe((val) => {
            expect(val).toBe(10);
            done();
        });
    });

    it('should receive time left percent undefined correctly', (done) => {
        // eslint-disable-next-line dot-notation
        testMock['p'].next(undefined);
        component.timeLeftPercent$.subscribe((val) => {
            expect(val).toBe(undefined);
            done();
        });
    });
});
