import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Score } from '@app/leaderboard/leaderboard.interface';
import { LeaderboardService } from '@app/leaderboard/leaderboard.service';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';

describe('LeaderboardService', () => {
    let service: LeaderboardService;
    let httpClientMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(LeaderboardService);
        httpClientMock = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return leaderboard accurate', () => {
        const gameMode = GameMode.Classic;
        const scores: Score[] = [
            { name: 'Player1', point: 50 },
            { name: 'Player2', point: 500 },
        ];
        service.getLeaderboard(gameMode).subscribe((data: Score[]) => {
            expect(data).toEqual(scores);
        });
        const req = httpClientMock.expectOne('http://localhost:3000/api/scores/gameMode?gameMode=classic');
        expect(req.request.method).toEqual('GET');
        req.flush(scores);
    });

    it('should send post request', () => {
        const gameMode = GameMode.Classic;
        const score: Score = { name: 'Test1', point: 50 };
        service.updateLeaderboard(gameMode, score);

        const req = httpClientMock.expectOne('http://localhost:3000/api/scores/gameMode?gameMode=classic');
        expect(req.request.method).toEqual('POST');
        req.flush(true);
    });

    it('should send delete request', () => {
        const expectedResponseCode = 200;
        service.dropCollections().subscribe((res) => {
            expect(res.status).toEqual(expectedResponseCode);
        });
        const req = httpClientMock.expectOne('http://localhost:3000/api/scores/');
        expect(req.request.method).toEqual('DELETE');
        req.flush(expectedResponseCode);
    });
});
