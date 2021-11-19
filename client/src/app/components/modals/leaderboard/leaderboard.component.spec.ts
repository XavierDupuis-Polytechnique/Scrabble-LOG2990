/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Score } from '@app/leaderboard/leaderboard.interface';
import { AppMaterialModule } from '@app/modules/material.module';
import { LeaderboardComponent } from './leaderboard.component';

describe('LeaderboardComponent', () => {
    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;
    let testScores: Score[];
    let mockHttpClient: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientTestingModule],
            declarations: [LeaderboardComponent],
        }).compileComponents();
        mockHttpClient = TestBed.inject(HttpTestingController);
    });

    beforeEach(async () => {
        fixture = TestBed.createComponent(LeaderboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return 5 highest scores in correct format', () => {
        testScores = [
            { name: 'Player0', point: 200 },
            { name: 'Player1', point: 100 },
            { name: 'Player2', point: 50 },
            { name: 'Player3', point: 10 },
            { name: 'Player4', point: 5 },
        ];
        // eslint-disable-next-line dot-notation
        let highScores = component['filterScores'](testScores);
        expect(highScores[0].names[0]).toEqual(testScores[0].name);
        expect(highScores.length).toEqual(testScores.length);

        testScores = [
            { name: 'Player0', point: 200 },
            { name: 'Player5', point: 200 },
            { name: 'Player1', point: 100 },
            { name: 'Player2', point: 50 },
            { name: 'Player3', point: 10 },
            { name: 'Player4', point: 5 },
        ];
        const playersInFirstPos = 2;
        const tableLength = 5;
        highScores = component['filterScores'](testScores);
        expect(highScores[0].names.length).toEqual(playersInFirstPos);
        console.log(highScores);
        expect(highScores.length).toEqual(tableLength);
    });

    it('should get scores', () => {
        testScores = [
            { name: 'Player0', point: 200 },
            { name: 'Player1', point: 100 },
            { name: 'Player2', point: 50 },
            { name: 'Player3', point: 10 },
            { name: 'Player4', point: 5 },
        ];
        const req = mockHttpClient.expectOne('http://localhost:3000/api/scores/gameMode?gameMode=classic');
        req.flush(testScores);
        component.refresh();
        // eslint-disable-next-line dot-notation
        const dataTable = component['dataSourceClassic'];
        expect(dataTable.data.length).toEqual(testScores.length);
    });

    it('should be a full table ', () => {
        component.refresh();
        component['scores$'].next([
            { name: 'Player3', point: 10 },
            { name: 'Player4', point: 5 },
        ]);
        const tableLength = 2;
        const dom = fixture.nativeElement as HTMLElement;
        const table = dom.querySelectorAll('tr')[0];
        expect(table.cells.length).toBe(tableLength);
    });
});
