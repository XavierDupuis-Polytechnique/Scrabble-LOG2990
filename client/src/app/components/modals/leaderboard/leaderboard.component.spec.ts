/* eslint-disable dot-notation */
import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Score } from '@app/leaderboard/leaderboard.interface';
import { AppMaterialModule } from '@app/modules/material.module';
import { LeaderboardComponent } from './leaderboard.component';

describe('LeaderboardComponent', () => {
    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;
    let testScores: Score[];
    let mockHttpClient: HttpTestingController;

    beforeEach(async () => {
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, BrowserAnimationsModule, HttpClientTestingModule],
            declarations: [LeaderboardComponent],
        }).compileComponents();
        mockHttpClient = TestBed.inject(HttpTestingController);
        fixture = TestBed.createComponent(LeaderboardComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('OnInit should work', () => {
        testScores = [
            { name: 'Player0', point: 200 },
            { name: 'Player1', point: 100 },
            { name: 'Player2', point: 50 },
            { name: 'Player3', point: 10 },
            { name: 'Player4', point: 5 },
        ];
        const req = mockHttpClient.expectOne('http://localhost:3000/api/scores/gameMode?gameMode=classic');
        req.flush(testScores);
        component.ngOnInit();
        expect(component.dataSourceClassic.data.length).toEqual(testScores.length);
    });

    it('should return 5 highest scores in correct format', () => {
        testScores = [
            { name: 'Player0', point: 200 },
            { name: 'Player1', point: 100 },
            { name: 'Player2', point: 50 },
            { name: 'Player3', point: 10 },
            { name: 'Player4', point: 5 },
        ];
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
        const dataTable = component['dataSourceClassic'];
        expect(dataTable.data.length).toEqual(testScores.length);
    });

    it('should return if get leaderboard catch error', () => {
        const errorResponse = new HttpErrorResponse({
            error: { code: 'code', message: 'message.' },
            status: 400,
            statusText: 'Bad Request',
        });
        const req = mockHttpClient.expectOne('http://localhost:3000/api/scores/gameMode?gameMode=classic');
        req.flush('', errorResponse);

        component.refresh();
        const dataTable = component['dataSourceClassic'];
        expect(dataTable.data.length).toEqual(0);
    });
});
