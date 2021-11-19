/* tslint:disable:no-unused-variable */
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Score } from '@app/leaderboard/leaderboard.interface';
import { AppMaterialModule } from '@app/modules/material.module';
import { LeaderboardComponent } from './leaderboard.component';

describe('LeaderboardComponent', () => {
    let component: LeaderboardComponent;
    let fixture: ComponentFixture<LeaderboardComponent>;
    // let leaderboardService: LeaderboardService;
    let testScores: Score[];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [AppMaterialModule, HttpClientTestingModule],
            declarations: [LeaderboardComponent],
        }).compileComponents();
        // leaderboardService = TestBed.inject(LeaderboardService);
        testScores = [
            {
                name: 'Player0',
                point: 200,
            },
            {
                name: 'Player1',
                point: 100,
            },
            {
                name: 'Player2',
                point: 50,
            },
            {
                name: 'Player3',
                point: 10,
            },
            {
                name: 'Player4',
                point: 5,
            },
        ];
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LeaderboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should return 5 highest scores', () => {
        const highestScore = {
            name: 'Player0',
            point: 200,
        };
        // eslint-disable-next-line dot-notation
        const highScores = component['filterScores'](testScores);
        expect(highScores[0].names[0]).toEqual(highestScore.name);
    });

    it('should get scores', () => {
        // TODO: get with mock httpclient
        component.refresh();
        // eslint-disable-next-line dot-notation
        const dataTable = component['dataSourceClassic'];
        expect(dataTable.data.length).toEqual(testScores.length);
    });
});
