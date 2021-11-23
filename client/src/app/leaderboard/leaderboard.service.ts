import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Score } from '@app/leaderboard/leaderboard.interface';
import { GameMode } from '@app/socket-handler/interfaces/game-mode.interface';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
    url = `${environment.serverUrl}/scores`;
    constructor(private http: HttpClient) {}

    getLeaderboard(gameMode: GameMode): Observable<Score[]> {
        const params = new HttpParams().set('gameMode', gameMode);
        return this.http.get(`${this.url}/gameMode?`, { params }) as Observable<Score[]>;
    }

    updateLeaderboard(mode: GameMode, score: Score) {
        this.http.post(`${this.url}/gameMode?gameMode=${mode}`, score, { responseType: 'text' }).subscribe();
    }
}
